/** Optional PDF bridge. Only library requests leave the browser; files never do. */
import {History, uid} from './studio-utils.mjs';
import {makeZip, safeName} from './png-to-pdf/core.mjs';
const CDN = 'https://cdn.jsdelivr.net/npm/';
let libraries;
async function loadLibraries() {
  if (!libraries) libraries = (async () => {
    if (!globalThis.PDFLib) await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('./pdf-kit/pdf-lib.min.js', import.meta.url).href;
      script.onload = resolve;
      script.onerror = () => { script.remove(); reject(new Error('PDF 组件下载失败，请检查网络后重试。图片功能不受影响。')); };
      document.head.append(script);
    });
    const parser = await import(`${CDN}pdfjs-dist@4.10.38/build/pdf.min.mjs`);
    parser.GlobalWorkerOptions.workerSrc = `${CDN}pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
    return {lib: globalThis.PDFLib, parser};
  })().catch(error => { libraries = null; throw new Error(`无法加载 PDF 组件：${error.message}`); });
  return libraries;
}
const canceled = () => new DOMException('已取消；已成功处理的文件仍然保留。', 'AbortError');
export class PDFWorkspace {
  constructor({progress, isCanceled}) { this.pages = []; this.selected = new Set(); this.sources = new Map(); this.history = new History(); this.progress = progress; this.isCanceled = isCanceled; }
  check() { if (this.isCanceled()) throw canceled(); }
  targets() { return this.selected.size ? this.pages.filter(p => this.selected.has(p.id)) : [...this.pages]; }
  async add(files) {
    const {lib, parser} = await loadLibraries();
    const issues = []; let added = 0;
    this.history.save(this.pages);
    for (const file of files) {
      this.check();
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) { issues.push(`${file.name}：不是 PDF。`); continue; }
      if (!file.size || file.size > 100 * 1048576) { issues.push(`${file.name}：文件为空或超过 100 MB。`); continue; }
      if ([...this.sources.values()].reduce((n,s)=>n+s.file.size,0)+file.size>100*1048576) { issues.push('PDF 总导入上限为 100 MB。'); continue; }
      let source;
      try {
        const buffer = new Uint8Array(await file.arrayBuffer());
        const doc = await lib.PDFDocument.load(buffer, {ignoreEncryption: false});
        if (doc.isEncrypted) throw new Error('暂不支持密码保护 PDF。');
        if (this.pages.length + doc.getPageCount() > 50) throw new Error('最多同时处理 50 页，请拆分后导入。');
        const loading = parser.getDocument({data: buffer.slice(), isEvalSupported: false, useSystemFonts: true});
        loading.onPassword = () => loading.destroy();
        const view = await loading.promise;
        source = {id: uid(), file, doc, view};
        this.sources.set(source.id, source);
        for (let index = 0; index < doc.getPageCount(); index++) {
          this.check();
          const page = {id: uid(), source: source.id, index, rotation: 0, name: file.name};
          const canvas = await this.renderPage(page, 45, 330);
          page.thumb = canvas.toDataURL('image/jpeg', .75); canvas.width = canvas.height = 1;
          this.pages.push(page); added++;
          this.progress(index + 1, doc.getPageCount(), `正在读取 ${file.name}`);
        }
      } catch(error) {
        if (error.name === 'AbortError') throw error;
        issues.push(`${file.name}：${error.message}`);
        if (source && !this.pages.some(p=>p.source===source.id)) { source.view.destroy(); this.sources.delete(source.id); }
      }
    }
    return {added, issues};
  }
  async renderPage(page, dpi = 150, maxSide = 3200) {
    this.check();
    const source = this.sources.get(page.source);
    const p = await source.view.getPage(page.index + 1);
    const rotation = (p.rotate + page.rotation + 360) % 360;
    const base = p.getViewport({scale: 1, rotation});
    const scale = Math.min(dpi / 72, maxSide / Math.max(base.width, base.height), Math.sqrt(12000000/(base.width*base.height)));
    const viewport = p.getViewport({scale, rotation});
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width)); canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    await p.render({canvasContext: ctx, viewport, background: 'rgb(255,255,255)'}).promise;
    return canvas;
  }
  async document(pages, {raster = false, dpi = 150} = {}) {
    if (!pages.length) throw new Error('请先添加 PDF。');
    const {lib} = await loadLibraries(), output = await lib.PDFDocument.create();
    for (let i = 0; i < pages.length; i++) {
      this.check(); const page = pages[i], src = this.sources.get(page.source);
      if (raster) {
        const c = await this.renderPage(page, dpi);
        const jpg = await new Promise(resolve => c.toBlob(resolve, 'image/jpeg', .78));
        if (!jpg) throw new Error('页面图像编码失败。');
        const image = await output.embedJpg(await jpg.arrayBuffer());
        const inputPage = src.doc.getPage(page.index), angle = (inputPage.getRotation().angle + page.rotation + 360) % 360;
        let {width, height} = inputPage.getSize(); if (angle % 180) [width, height] = [height, width];
        const outPage = output.addPage([width,height]); outPage.drawImage(image,{x:0,y:0,width,height});
        c.width = c.height = 1;
      } else {
        const [copied] = await output.copyPages(src.doc, [page.index]);
        copied.setRotation(lib.degrees((copied.getRotation().angle + page.rotation + 360) % 360)); output.addPage(copied);
      }
      this.progress(i+1,pages.length,raster?'正在重编码扫描页':'正在整理 PDF 页面');
    }
    return new Blob([await output.save({useObjectStreams:true, addDefaultPage:false})],{type:'application/pdf'});
  }
  async split(name) {
    const pages = this.targets(), files = [];
    if (!pages.length) throw new Error('请先添加 PDF。');
    for (let i = 0; i < pages.length; i++) {
      this.check(); files.push({name:`${safeName(name)}-${String(i+1).padStart(2,'0')}.pdf`,data:await this.document([pages[i]])});
      this.progress(i+1,pages.length,'正在拆分页面');
    }
    return makeZip(files);
  }
  async toImages(dpi) {
    const result = [], pages = this.targets();
    for(let i=0;i<pages.length;i++) {
      this.check(); const c = await this.renderPage(pages[i],dpi);
      const blob = await new Promise(resolve=>c.toBlob(resolve,'image/png'));
      if (!blob) throw new Error('PNG 编码失败。');
      result.push(new File([blob],`${safeName(pages[i].name)}-${pages[i].index+1}.png`,{type:'image/png'}));
      c.width=c.height=1; this.progress(i+1,pages.length,'正在将 PDF 转为图片');
    }
    return result;
  }
}
