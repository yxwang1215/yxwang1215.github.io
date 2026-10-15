/* PNG to PDF: dependency-free PDF 1.4 image writer. No network or DOM access. */
(function (root) {
  'use strict';
  const LIMITS = Object.freeze({files:50, fileBytes:25*1024*1024, totalBytes:100*1024*1024, pixels:16000000, side:16384, outputBytes:200*1024*1024});
  const mm = 72 / 25.4;
  function dimensions(width, height) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > LIMITS.side || height > LIMITS.side || width*height > LIMITS.pixels)
      throw new Error('图片尺寸超限：每张最多 1600 万像素，单边不超过 16384 px。');
  }
  function pngDimensions(bytes) {
    const sig = [137,80,78,71,13,10,26,10];
    if (bytes.length < 33 || sig.some((n,i)=>bytes[i]!==n) || String.fromCharCode(...bytes.slice(12,16))!=='IHDR')
      throw new Error('不是有效的 PNG 文件，请不要只修改文件扩展名。');
    const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    if(v.getUint32(8)!==13) throw new Error('PNG 文件头损坏。');
    const width=v.getUint32(16),height=v.getUint32(20); dimensions(width,height);
    return {width,height};
  }
  function validatePNG(bytes) {
    const size=pngDimensions(bytes),v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    let pos=8,ended=false;
    while(pos+12<=bytes.length) {
      const length=v.getUint32(pos);
      if(length>bytes.length-pos-12) throw new Error('PNG 文件不完整或已损坏。');
      const type=String.fromCharCode(...bytes.slice(pos+4,pos+8));
      if(type==='acTL') throw new Error('暂不支持动态 PNG（APNG），请先导出为静态图片。');
      pos+=length+12;
      if(type==='IEND') {ended=true;break;}
    }
    if(!ended) throw new Error('PNG 文件不完整，缺少结束标记。');
    return size;
  }
  function layout(iw,ih,options={}) {
    dimensions(iw,ih);
    const paper=options.paper||'a4',orientation=options.orientation||'auto';
    const dpi=Number(options.dpi??96),margin=Number(options.margin??10)*mm;
    if(!['a4','letter','image'].includes(paper) || !['auto','portrait','landscape'].includes(orientation) || ![96,150,300].includes(dpi) || !Number.isFinite(margin) || margin<0 || margin>40*mm)
      throw new Error('页面设置无效。');
    let width,height;
    if(paper==='image') {width=iw*72/dpi+2*margin;height=ih*72/dpi+2*margin;}
    else {
      [width,height]=paper==='a4'?[210*mm,297*mm]:[612,792];
      if(orientation==='landscape'||(orientation==='auto'&&iw>ih)) [width,height]=[height,width];
    }
    if(Math.max(width,height)>14400) throw new Error('PDF 页面过大，请改用 A4 或提高 DPI。');
    const scale=Math.min((width-2*margin)/iw,(height-2*margin)/ih);
    if(!Number.isFinite(scale)||scale<=0) throw new Error('边距过大，图片无法放入页面。');
    const drawWidth=iw*scale,drawHeight=ih*scale;
    return {width,height,drawWidth,drawHeight,x:(width-drawWidth)/2,y:(height-drawHeight)/2};
  }
  function filename(value) {
    const s=String(value||'').trim().replace(/(?:\.pdf)+$/i,'').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/[. ]+$/g,'').slice(0,120);
    return (s||'images')+'.pdf';
  }
  async function compressed(bytes) {
    if(typeof CompressionStream==='function') {
      const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
      return {data:await new Response(stream).blob(),filter:'/Filter /FlateDecode'};
    }
    return {data:new Blob([bytes]),filter:''};
  }
  const number=n=>Number(n.toFixed(5)).toString();
  class Writer {
    constructor() {this.objects=[null,null,null];this.pages=[];this.size=0;}
    object(body) {
      const blob=body instanceof Blob?body:new Blob([body]);
      this.size+=blob.size;
      if(this.size>LIMITS.outputBytes) throw new Error('PDF 超过 200 MiB，请减少图片或使用「精简体积」。');
      this.objects.push(blob);return this.objects.length-1;
    }
    stream(dictionary,data) {
      const blob=data instanceof Blob?data:new Blob([data]);
      return this.object(new Blob([`<< ${dictionary} /Length ${blob.size} >>\nstream\n`,blob,'\nendstream']));
    }
    page(image,width,height,box,mask='') {
      if(this.pages.length>=LIMITS.files) throw new Error('一次最多导出 50 页。');
      const content=this.stream('',`q\n${number(box.drawWidth)} 0 0 ${number(box.drawHeight)} ${number(box.x)} ${number(box.y)} cm\n/Im0 Do\nQ`);
      const page=this.object(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${number(box.width)} ${number(box.height)}] /Resources << /XObject << /Im0 ${image} 0 R >> >> /Contents ${content} 0 R >>`);
      this.pages.push(page);
    }
    async addRGBA(rgba,width,height,box) {
      dimensions(width,height);const pixels=width*height;
      if(rgba.length!==pixels*4) throw new Error('图片像素数据不完整。');
      const rgb=new Uint8Array(pixels*3),alpha=new Uint8Array(pixels);let transparent=false;
      for(let i=0,j=0;i<rgba.length;i+=4,j++) {
        rgb[j*3]=rgba[i];rgb[j*3+1]=rgba[i+1];rgb[j*3+2]=rgba[i+2];alpha[j]=rgba[i+3];
        if(alpha[j]!==255) transparent=true;
      }
      let mask='';
      if(transparent) {
        const a=await compressed(alpha);
        const id=this.stream(`/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceGray /BitsPerComponent 8 ${a.filter}`,a.data);
        mask=`/SMask ${id} 0 R`;
      }
      const c=await compressed(rgb);
      const id=this.stream(`/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 ${c.filter} ${mask}`,c.data);
      this.page(id,width,height,box);
    }
    addJPEG(bytes,width,height,box) {
      dimensions(width,height);
      if(bytes[0]!==255||bytes[1]!==216) throw new Error('浏览器未能生成 JPEG 数据。');
      const id=this.stream(`/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,bytes);
      this.page(id,width,height,box);
    }
    finish() {
      if(!this.pages.length) throw new Error('请先添加 PNG 图片。');
      this.objects[1]=new Blob(['<< /Type /Catalog /Pages 2 0 R >>']);
      this.objects[2]=new Blob([`<< /Type /Pages /Count ${this.pages.length} /Kids [${this.pages.map(id=>id+' 0 R').join(' ')}] >>`]);
      const parts=[new Blob(['%PDF-1.4\n',new Uint8Array([37,226,227,207,211,10])])],offsets=[0];
      let length=parts[0].size;
      for(let id=1;id<this.objects.length;id++) {
        offsets[id]=length;const part=new Blob([`${id} 0 obj\n`,this.objects[id],'\nendobj\n']);parts.push(part);length+=part.size;
      }
      const xref=length;
      parts.push(`xref\n0 ${this.objects.length}\n0000000000 65535 f \n`+offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${this.objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
      const result=new Blob(parts,{type:'application/pdf'});
      if(result.size>LIMITS.outputBytes) throw new Error('PDF 超过 200 MiB，请减少图片。');
      return result;
    }
  }
  const api={LIMITS,layout,pngDimensions,validatePNG,filename,Writer};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.PngPdf=api;
})(typeof globalThis!=='undefined'?globalThis:this);
