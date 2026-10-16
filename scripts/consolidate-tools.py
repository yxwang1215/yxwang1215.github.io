"""One-time, guarded migration of the owner-approved single workbench."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
def change(path,old,new,count=1):
 p=ROOT/path;s=p.read_text()
 if s.count(old)!=count:raise RuntimeError(f'Unexpected source in {path}: {old[:100]} ({s.count(old)} matches)')
 p.write_text(s.replace(old,new))
app='tools/studio.mjs';html='tools/index.html';pdf='tools/pdf-workspace.mjs';nav='tools/tool-switcher.js'
change(app,"import {installCompressionControls} from './studio-compression.mjs';","import {installCompressionControls} from './studio-compression.mjs';\nimport {resolveRoute, TOOL_ROUTES} from './studio-routing.mjs';\nimport {originalImagePdf, parsePages} from './studio-documents.mjs';")
change(app,"const jobs = new Map();","const jobs = new Map();\nlet routing=false;\nconst initialRoute=location.hash;")
change(app,"const titles={enhance:'扫描增强',crop:'裁剪与方向',compress:'尺寸与压缩',pages:'页面整理',pdfcompress:'PDF 压缩',convert:'PDF 转图片'};","const titles={enhance:'扫描增强',crop:'裁剪与方向',compress:'尺寸与压缩',imagepdf:'图片转 PDF',pages:'页面整理',mixed:'图片与 PDF 合并',split:'PDF 拆分',extract:'提取页面',pdfcompress:'PDF 压缩',convert:'PDF 转图片'};")
change(app,"  if(tool!=='crop')stopCrop();if(open&&matchMedia('(max-width:800px)').matches)openInspector();","  if(tool!=='crop')stopCrop();\n  if(!routing)writeRoute(TOOL_ROUTES[tool]||'#image');\n  if(open&&matchMedia('(max-width:800px)').matches)openInspector();")
change(app,"  window.history.replaceState(null,'',`#${s.mode}`);chooseTool","  chooseTool")
change(app,"'.pdf,application/pdf';","'.pdf,application/pdf,image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp';")
change(app,"window.addEventListener('hashchange',()=>setWorkspace(location.hash==='#pdf'?'pdf':'image'));","window.addEventListener('hashchange',()=>navigateHash(location.hash,true));\nwindow.addEventListener('popstate',()=>navigateHash(location.hash,true));")
change(app,"setWorkspace(location.hash==='#pdf'?'pdf':'image');renderImages();renderPdf();refresh();","installDocumentControls();navigateHash(initialRoute,true);renderImages();renderPdf();refresh();")
change(app,"  $('pdfDpi').disabled=!$('rasterPdf').checked||s.busy;\n  updateZoomUI();\n}","  $('pdfDpi').disabled=!$('rasterPdf').checked||s.busy;\n  for(const id of ['imagePdfExport','imageOriginalPdf'])$(id).disabled=s.busy||!s.pages.length;\n  for(const id of ['splitExport','extractExport','pdfMoveUp','pdfMoveDown'])$(id).disabled=s.busy||!pdf.pages.length;\n  $('addWorkspaceImages').disabled=s.busy||!s.pages.length;\n  updateZoomUI();\n}")
change(app,"const r=await pdf.add(list);","const r=await pdf.add(list,mixedPageOptions());")
change(app,"if(s.mode==='pdf'){const split=$('pdfExportMode').value==='split',blob=split?await pdf.split(name):await pdf.document(pdf.targets());checkCanceled();saveBlob(blob,`${name}.${split?'zip':'pdf'}`);return;}","""if(s.mode==='pdf'){
      const mode=$('pdfExportMode').value,split=mode==='split';
      const pages=mode==='extract'?parsePages($('extractRange').value,pdf.pages.length).map(i=>pdf.pages[i]):pdf.targets();
      const blob=split?await pdf.split(name,{mode:$('splitMode').value,text:$('splitRanges').value,chunk:Number($('splitChunk').value)}):await pdf.document(pages);
      checkCanceled();saveBlob(blob,`${name}.${split?'zip':'pdf'}`);return;
    }""")
change(app,"const blob=await imagePdf(s.pages);","const blob=$('imagePdfSource').value==='original'?await originalImagePdf(s.pages,rawPageOptions(),{check:checkCanceled,progress}):await imagePdf(s.pages);")
change(app,"function exportFormatChanged(){const isPdf=s.mode==='image'&&$('exportFormat').value==='pdf';$('imagePdfOptions').hidden=!isPdf;$('sendToPdf').hidden=!isPdf;}","""function exportFormatChanged(){
 const isPdf=s.mode==='image'&&$('exportFormat').value==='pdf';
 $('imagePdfOptions').hidden=!isPdf;$('sendToPdf').hidden=!isPdf;
 const raw=isPdf&&$('imagePdfSource').value==='original';
 $('imageDpiField').hidden=!raw;$('encoding').disabled=raw;
 $('paper').querySelector('[value="a5"]').disabled=raw;
 if(raw&&$('paper').value==='a5')$('paper').value='a4';
 $('imagePdfNote').textContent=raw?'无损封装未编辑原图：保留原生像素与透明度，不应用增强、裁剪或尺寸压缩。':'使用当前编辑结果；白底图片 PDF 不含可搜索文字。';
 $('splitExportFields').hidden=s.mode!=='pdf'||$('pdfExportMode').value!=='split';
 $('extractExportFields').hidden=s.mode!=='pdf'||$('pdfExportMode').value!=='extract';
 $('splitChunkField').hidden=$('splitMode').value!=='chunks';$('splitRangesField').hidden=$('splitMode').value!=='custom';
}""")
functions=r'''
function writeRoute(hash,replace=false){
 if(location.hash!==hash)window.history[replace?'replaceState':'pushState'](null,'',hash);
 window.dispatchEvent(new Event('tool-workspace-change'));
}
function navigateHash(hash,replace=false){
 if(s.busy){writeRoute(TOOL_ROUTES[s.mode==='image'?s.imageTool:s.pdfTool],true);return;}
 const route=resolveRoute(hash);routing=true;
 try{
  if(s.mode!==route.workspace)setWorkspace(route.workspace);
  else { $('imageWorkspace').hidden=s.mode!=='image';$('pdfWorkspace').hidden=s.mode!=='pdf'; }
  chooseTool(route.tool,false);$('workspaceTitle').textContent=route.title;
  if(route.tool==='imagepdf'){$('exportFormat').value='pdf';$('imagePdfSource').value=route.hash==='#image/png-to-pdf'?'original':'processed';}
  if(route.tool==='split')$('pdfExportMode').value='split';
  if(route.tool==='extract')$('pdfExportMode').value='extract';
  closeInspector();refresh();renderPdf();schedulePreview();
 }finally{routing=false;}
 writeRoute(route.hash,replace);
}
function rawPageOptions(){return {paper:$('paper').value,orientation:$('orientation').value,margin:Number($('margin').value),dpi:Number($('imageDpi').value)};}
function mixedPageOptions(){return {paper:$('mixedPaper').value,orientation:'auto',margin:Number($('mixedMargin').value),dpi:Number($('mixedDpi').value)};}
function openImagePdf(original=false){$('exportFormat').value='pdf';$('imagePdfSource').value=original?'original':'processed';openExport();}
function installDocumentControls(){
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="/tools/#"],a[href^="#image"],a[href^="#pdf"]');
  if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  e.preventDefault();if(s.busy){toast('当前操作完成后再切换功能。');return;}
  navigateHash(new URL(a.href,location.href).hash);a.closest('details')?.removeAttribute('open');
 });
 $('imagePdfExport').onclick=()=>openImagePdf(false);$('imageOriginalPdf').onclick=()=>openImagePdf(true);
 $('imagePdfSource').onchange=exportFormatChanged;$('pdfExportMode').onchange=exportFormatChanged;$('splitMode').onchange=exportFormatChanged;
 $('splitExport').onclick=()=>openExport('split');$('extractExport').onclick=()=>openExport('extract');
 $('mixedImport').onclick=()=>$('fileInput').click();
 $('addWorkspaceImages').onclick=()=>runJob('正在加入图片工作区的原图',async()=>{
  const result=await pdf.add(s.pages.map(p=>p.file),mixedPageOptions());toast(`已加入 ${result.added} 页。 ${result.issues.join(' ')}`);
 });
 for(const [id,delta]of [['pdfMoveUp',-1],['pdfMoveDown',1]])$(id).onclick=()=>{
  if(!pdf.selected.size){toast('请先选择要移动的页面。');return;}
  pdfEdit(()=>{
   const indices=pdf.pages.map((_,i)=>i);if(delta>0)indices.reverse();
   for(const i of indices){const next=i+delta;if(next>=0&&next<pdf.pages.length&&pdf.selected.has(pdf.pages[i].id)&&!pdf.selected.has(pdf.pages[next].id))[pdf.pages[i],pdf.pages[next]]=[pdf.pages[next],pdf.pages[i]];}
  });
 };
}
'''
change(app,'// Build real controls once;',functions+'\n// Build real controls once;')
change(pdf,"import {makeZip, safeName} from './png-to-pdf/core.mjs';","import {makeZip, safeName} from './png-to-pdf/core.mjs';\nimport {imageDocument, splitGroups} from './studio-documents.mjs';")
change(pdf,'async add(files) {','async add(files, imageOptions={}) {')
change(pdf,"if (file.type !== 'application/pdf' && !/\\.pdf$/i.test(file.name)) { issues.push(`${file.name}：不是 PDF。`); continue; }","const isImage=/^image\\/(png|jpeg|webp)$/.test(file.type)||/\\.(png|jpe?g|webp)$/i.test(file.name);\n      if (!isImage && file.type !== 'application/pdf' && !/\\.pdf$/i.test(file.name)) { issues.push(`${file.name}：仅支持 PDF、PNG、JPG 和 WebP。`); continue; }")
change(pdf,'const buffer = new Uint8Array(await file.arrayBuffer());','const buffer = isImage?await imageDocument(file,lib,imageOptions):new Uint8Array(await file.arrayBuffer());')
change(pdf,"async split(name) {\n    const pages = this.targets(), files = [];","async split(name,{mode='each',text='',chunk=1}={}) {\n    const pages = this.targets(), files = [];")
change(pdf,"    for (let i = 0; i < pages.length; i++) {\n      this.check(); files.push({name:`${safeName(name)}-${String(i+1).padStart(2,'0')}.pdf`,data:await this.document([pages[i]])});\n      this.progress(i+1,pages.length,'正在拆分页面');\n    }","    const groups=splitGroups(pages.length,mode,text,chunk);\n    for (let i = 0; i < groups.length; i++) {\n      this.check(); files.push({name:`${safeName(name)}-${String(i+1).padStart(2,'0')}.pdf`,data:await this.document(groups[i].map(index=>pages[index]))});\n      this.progress(i+1,groups.length,'正在拆分页面');\n    }")
ROUTES={'png-to-pdf':'#image','png-to-pdf-simple':'#image/png-to-pdf','mixed-to-pdf':'#pdf/mixed','merge-pdf':'#pdf/merge','split-pdf':'#pdf/split','extract-pdf':'#pdf/extract','organize-pdf':'#pdf/organize'}
for old,hash_ in ROUTES.items():
 if old!='png-to-pdf':change(nav,"href:'/tools/"+old+"/'","href:'/tools/"+hash_+"'")
change(nav,"href:'/tools/#compress'","href:'/tools/#image/compress'")
change(nav,'切换独立页面前，请保存处理结果。当前页面的文件不会自动转移。','所有功能都在当前工作台中完成，切换功能不会清空已导入的文件。')
s=(ROOT/nav).read_text();start=s.index('    // Keep deep links');end=s.index("    document.querySelector('.app')",start)
change(nav,s[start:end],"    menu.addEventListener('click',e=>{if(e.target.closest('a'))menu.open=false;});\n")
change(nav,"document.body.classList.add('ts-studio');","document.body.classList.add('ts-unified');")
change(html,'</head>','<link rel="stylesheet" href="./studio-comfort.css?v=20261016-unified"></head>')
change(html,'studio.mjs?v=20261016','studio.mjs?v=20261016-unified')
p=ROOT/html;p.write_text(re.sub(r'tool-switcher\.js\?v=[^"\s]+','tool-switcher.js?v=20261016-unified',p.read_text()))
change(html,'<button class="tool" data-export><svg class="icon" aria-hidden="true"><use href="#i-download"/></svg><span>导出</span></button></div><div id="pdfTools"','<button class="tool" data-tool="imagepdf"><svg class="icon" aria-hidden="true"><use href="#i-file"/></svg><span>转 PDF</span></button></div><div id="pdfTools"')
anchor='<div id="pdfTools" class="rail-tools" hidden>'
change(html,anchor,anchor+''.join(f'<button class="tool" data-tool="{tool}"><svg class="icon" aria-hidden="true"><use href="#i-{icon}"/></svg><span>{label}</span></button>' for tool,icon,label in [('mixed','plus','混合合并'),('split','file','拆分'),('extract','copy','提取')]))
panels='''<div data-panel="imagepdf" hidden><h3 class="section-title">图片转 PDF</h3><p class="description">使用当前图片列表与顺序，不需要重新上传。</p><button id="imagePdfExport" class="btn primary full">导出当前编辑结果</button><button id="imageOriginalPdf" class="btn full" style="margin-top:14px">无损 PNG / 原图转 PDF</button><div class="hint-box">无损模式保留原图像素与透明度，不应用增强、裁剪或缩放。纸张、边距与 DPI 在导出面板设置。</div></div>
<div data-panel="mixed" hidden><h3 class="section-title">图片与 PDF 合并</h3><p class="description">添加 PNG、JPG、WebP 或 PDF；在同一页面网格中排序、选择和导出。原 PDF 文字保持可搜索。</p><button id="mixedImport" class="btn primary full">添加 PDF 或图片</button><button id="addWorkspaceImages" class="btn full" style="margin-top:14px">加入图片工作区的全部原图</button><p class="helper">此按钮加入未编辑原图；需要保留增强与裁剪时，在图片导出面板选择「继续整理 PDF」。</p><label class="field"><span>新插入图片的纸张</span><select id="mixedPaper"><option value="a4">A4</option><option value="letter">US Letter</option><option value="image">适应原图</option></select></label><div class="pair"><label class="field"><span>边距</span><select id="mixedMargin"><option value="0">0 mm</option><option value="8" selected>8 mm</option><option value="15">15 mm</option></select></label><label class="field"><span>原图纸张 DPI</span><select id="mixedDpi"><option value="96">96</option><option value="150">150</option><option value="300">300</option></select></label></div><p class="helper">这些设置在添加新图片时生效，不改变已导入页面。</p></div>
<div data-panel="split" hidden><h3 class="section-title">拆分为多份 PDF</h3><p class="description">支持逐页、固定页数或自定义分组。共用当前页面顺序；选中页面时只拆分选中项。</p><button id="splitExport" class="btn primary full">设置分组并导出 ZIP</button><p class="helper">自定义示例：1-3;4-6;7。也支持 3-1 等倒序范围。</p></div>
<div data-panel="extract" hidden><h3 class="section-title">提取指定页面</h3><p class="description">输入页码顺序，导出为一个新 PDF。支持倒序与重复页，例如 3,1,3。</p><button id="extractExport" class="btn primary full">设置提取范围</button><p class="helper">提取范围按当前整个 PDF 页面网格编号。</p></div>
'''
change(html,'<div data-panel="pages" hidden>',panels+'<div data-panel="pages" hidden>')
change(html,'逐页拆分为 ZIP','拆分为 ZIP',2)
change(html,'<button id="pdfDelete"','<button id="pdfMoveUp" class="btn small">前移</button><button id="pdfMoveDown" class="btn small">后移</button><button id="pdfDelete"')
change(html,'<div id="imagePdfOptions" hidden>','<div id="imagePdfOptions" hidden><label class="field"><span>PDF 图像来源</span><select id="imagePdfSource"><option value="processed">当前增强 / 裁剪结果</option><option value="original">无损原图（保留透明度）</option></select></label><label class="field" id="imageDpiField" hidden><span>适应原图纸张的 DPI</span><select id="imageDpi"><option value="96">96</option><option value="150">150</option><option value="300">300</option></select></label>')
change(html,'<p class="helper">图片 PDF 不含 OCR 或可搜索文字。</p>','<p class="helper" id="imagePdfNote">图片 PDF 不含 OCR 或可搜索文字。</p>')
change(html,'</select></label><p class="helper" id="pdfExportSummary">','<option value="extract">按范围与顺序提取 PDF</option></select></label><div id="splitExportFields" hidden><label class="field"><span>拆分方式</span><select id="splitMode"><option value="each">每页一份</option><option value="chunks">每 N 页一份</option><option value="custom">自定义分组</option></select></label><label class="field" id="splitChunkField" hidden><span>每份页数</span><input id="splitChunk" type="number" value="2" min="1" max="50"></label><label class="field" id="splitRangesField" hidden><span>分组范围（分号分隔）</span><input id="splitRanges" placeholder="1-3;4-6;7"></label></div><div id="extractExportFields" hidden><label class="field"><span>提取页码（留空为全部）</span><input id="extractRange" placeholder="3,1,3 或 1-5"></label></div><p class="helper" id="pdfExportSummary">')
for old,hash_ in ROUTES.items():change(html,f'href="./{old}/"',f'href="/tools/{hash_}"')
change(html,'<summary>兼容入口</summary>','<summary>功能快捷入口</summary>')
change(html,'旧链接继续保留；日常处理可直接使用当前统一工作区。','全部功能都在当前工作台中完成，旧链接也会自动跳转到这里。')
change(html,'文件本地处理 · 首次使用需加载 PDF 组件','PDF / PNG / JPG / WebP · 文件本地处理')
change(html,'透明图导出 JPG 和 PDF 时使用白色背景。','透明图导出 JPG 和编辑版 PDF 时使用白色背景；无损原图 PDF 保留透明度。')
for old,hash_ in ROUTES.items():
 target='/tools/'+hash_
 (ROOT/'tools'/old/'index.html').write_text(f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url={target}"><link rel="canonical" href="https://yxwang1215.top/tools/"><title>Paper Studio · 统一工作台</title></head><body><p>功能已集成到统一工作台。<a href="{target}">打开对应功能</a></p><script src="../legacy-route.js" data-target="{target}"></script></body></html>\n')
for name in ['_data/site_directory.yml','_pages/navigation.html']:
 p=ROOT/name
 if p.exists():
  s=p.read_text()
  for old,hash_ in ROUTES.items():s=s.replace('/tools/'+old+'/', '/tools/'+hash_)
  p.write_text(s)
# Retire the obsolete standalone DOM contract, not the codec tests or real export coverage.
for name in ['pdf-toolkit-e2e.py','tools-ui-layout.py']:
 (ROOT/'tests'/name).write_text('"""Regression entrypoint for the consolidated tools document."""\nfrom pathlib import Path\nimport runpy\nrunpy.run_path(str(Path(__file__).with_name("unified-documents-e2e.py")),run_name="__main__")\n')
for name in ['toolkit-routes.test.cjs','studio-integration.test.mjs']:
 p=ROOT/'tests'/name;s=p.read_text()
 for variable in ['p','route']:
  mapping="({'merge-pdf':'#pdf/merge','mixed-to-pdf':'#pdf/mixed','split-pdf':'#pdf/split','extract-pdf':'#pdf/extract','organize-pdf':'#pdf/organize','png-to-pdf-simple':'#image/png-to-pdf','png-to-pdf':'#image'})"
  s=s.replace("html.includes('./'+"+variable+"+'/')","html.includes('/tools/'+"+mapping+"["+variable+"])")
 p.write_text(s)
p=ROOT/'tests/published_smoke.py';s=p.read_text();assert 'PATHS=[' in s
s=s.replace('PATHS=[',"PATHS=['tools/studio-comfort.css','tools/studio-routing.mjs','tools/studio-documents.mjs','tools/legacy-route.js',"+','.join(repr('tools/'+r+'/index.html') for r in ROUTES)+',',1);p.write_text(s)
