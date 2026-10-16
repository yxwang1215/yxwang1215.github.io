import {processPixels, fitSize, makePdf, makeZip, safeName} from './png-to-pdf/core.mjs';
import {History, PRESETS, uid, sizeLabel, movePage, parseRange} from './studio-utils.mjs';
import {PDFWorkspace} from './pdf-workspace.mjs';
const $ = id => document.getElementById(id);
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const s = {mode:'image', pages:[], active:null, imageTool:'enhance', pdfTool:'pages', view:'processed', busy:false, cancel:false, seq:0, crop:false, cropBox:null, original:null, lastURL:null};
const history = new History(), pdf = new PDFWorkspace({progress, isCanceled:()=>s.cancel});
const current = () => s.pages.find(p=>p.id===s.active);
const tick = () => new Promise(r=>requestAnimationFrame(r));
let toastTimer, previewTimer, dragId, cropStart, worker, jobId=0;
const jobs = new Map();
try {
  worker = new Worker(new URL('./png-to-pdf/worker.mjs',import.meta.url),{type:'module'});
  worker.onmessage = ({data}) => {const j=jobs.get(data.id);if(!j)return;jobs.delete(data.id);data.error?j.reject(new Error(data.error)):j.resolve(new Uint8ClampedArray(data.buffer));};
  worker.onerror = () => {worker.terminate();worker=null;for(const j of jobs.values())j.reject(new Error('处理线程中断'));jobs.clear();};
} catch {worker=null;}
function toast(text) {clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,6500);}
function progress(done,total,label) {$('progress').value=total?done/total*100:0;$('progressText').textContent=`${label} ${done}/${total}`;}
function checkCanceled(){if(s.cancel)throw new DOMException('已取消；已导入文件仍然保留。','AbortError');}
async function runJob(label,fn) {
  if(s.busy)return;
  s.busy=true;s.cancel=false;$('status').textContent=label;$('progressWrap').hidden=false;progress(0,1,label);
  const locks=[...document.querySelectorAll('button,input,select')].map(el=>[el,el.disabled]);
  locks.forEach(([el])=>el.disabled=true);$('cancelJob').disabled=false;
  if($('exportDialog').open)$('exportDialog').close();
  try{return await fn();}catch(e){toast(e.name==='AbortError'?'操作已取消。':e.message);}
  finally{s.busy=false;locks.forEach(([el,disabled])=>el.disabled=disabled);$('progressWrap').hidden=true;refresh();renderImages();renderPdf();schedulePreview();}
}
function refresh() {
  const active=s.mode==='image'?s.pages.length:pdf.pages.length, h=s.mode==='image'?history:pdf.history;
  $('openExport').disabled=s.busy||!active;$('undo').disabled=s.busy||!h.canUndo;$('redo').disabled=s.busy||!h.canRedo;
  for(const id of ['applyAll','resetImage','startCrop','rotateLeft','rotateRight','flipImage','removeImage','moveLeft','moveRight'])$(id).disabled=s.busy||!current();
  for(const id of ['pdfSelectAll','pdfRotate','pdfDuplicate','pdfDelete','pdfMerge','pdfSplit','pdfCompress','pdfToImages','selectRange','clearPdf'])$(id).disabled=s.busy||!pdf.pages.length;
  $('pdfDelete').disabled=s.busy||!pdf.selected.size;
  const p=current();$('activeName').textContent=s.mode==='image'?(p?.name||'未选择文件'):(pdf.pages.length?`${pdf.pages.length} 页`:'未选择文件');
  $('status').textContent=s.busy?'正在处理…':s.mode==='image'?(s.pages.length?`${s.pages.length} 张图片 · 原始文件 ${sizeLabel(s.pages.reduce((n,p)=>n+p.file.size,0))}`:'准备就绪'):(pdf.pages.length?`${pdf.pages.length} 页 · 已选择 ${pdf.selected.size} 页`:'准备就绪');
  const info=p?`${p.width} × ${p.height} px · ${sizeLabel(p.file.size)}`:'尚未选择图片';
  for(const id of ['cropInfo','compressionInfo']){const el=$(id);el.replaceChildren();if(p){const strong=document.createElement('strong');strong.textContent=p.name;el.append(strong);}el.append(document.createTextNode(info));}
  for(const [key] of Object.entries(PRESETS)){const b=document.querySelector(`[data-preset="${key}"]`);b.classList.toggle('active',(p?.preset||'auto')===key);b.setAttribute('aria-pressed',String((p?.preset||'auto')===key));b.disabled=s.busy||!p;}
  for(const el of document.querySelectorAll('[data-setting]')){el.disabled=s.busy||!p;el.value=(p?.settings||PRESETS.auto)[el.dataset.setting];$(`${el.id}Value`).textContent=el.value;}
  $('pdfDpi').disabled=!$('rasterPdf').checked||s.busy;
}
function setWorkspace(mode,force=false) {
  if(s.busy&&!force)return;
  stopCrop();s.mode=mode==='pdf'?'pdf':'image';s.seq++;
  $('imageWorkspace').hidden=s.mode!=='image';$('pdfWorkspace').hidden=s.mode!=='pdf';
  $('imageTools').hidden=s.mode!=='image';$('pdfTools').hidden=s.mode!=='pdf';
  document.querySelectorAll('[data-workspace]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.workspace===s.mode));b.tabIndex=b.dataset.workspace===s.mode?0:-1;});
  $('workspaceTitle').textContent=s.mode==='image'?'图片工作区':'PDF 工作区';
  $('fileInput').accept=s.mode==='image'?'image/png,image/jpeg,image/webp,image/bmp,image/gif,image/avif,.png,.jpg,.jpeg,.webp,.bmp,.gif,.avif':'.pdf,application/pdf';
  window.history.replaceState(null,'',`#${s.mode}`);chooseTool(s.mode==='image'?s.imageTool:s.pdfTool,false);closeInspector();refresh();renderPdf();schedulePreview();
}
function chooseTool(tool,open=true) {
  if(s.mode==='image')s.imageTool=tool;else s.pdfTool=tool;
  const titles={enhance:'扫描增强',crop:'裁剪与方向',compress:'尺寸与压缩',pages:'页面整理',pdfcompress:'PDF 压缩',convert:'PDF 转图片'};
  $('inspectorTitle').textContent=titles[tool];
  document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==tool);
  document.querySelectorAll('[data-tool]').forEach(b=>{b.classList.toggle('active',b.dataset.tool===tool);b.setAttribute('aria-pressed',String(b.dataset.tool===tool));});
  if(tool!=='crop')stopCrop();if(open&&matchMedia('(max-width:800px)').matches)openInspector();
}
let previousFocus;
function openInspector(){previousFocus=document.activeElement;$('inspector').classList.add('open');$('drawerShade').classList.add('open');$('openInspector').setAttribute('aria-expanded','true');for(const el of document.querySelectorAll('.topbar,.rail,.center'))el.inert=true;$('closeInspector').focus();}
function closeInspector(){const wasOpen=$('inspector').classList.contains('open');$('inspector').classList.remove('open');$('drawerShade').classList.remove('open');$('openInspector').setAttribute('aria-expanded','false');for(const el of document.querySelectorAll('.topbar,.rail,.center'))el.inert=false;if(wasOpen&&previousFocus?.isConnected)previousFocus.focus();}
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
async function decode(file){
  try{if('createImageBitmap'in window)return await createImageBitmap(file,{imageOrientation:'from-image'});}catch{}
  const url=URL.createObjectURL(file),im=new Image();im.src=url;
  try{await im.decode();return {width:im.naturalWidth,height:im.naturalHeight,source:im,close(){URL.revokeObjectURL(url);}};}catch{URL.revokeObjectURL(url);throw new Error('无法解码图片，文件可能损坏或格式不受支持。');}
}
async function importImages(files) {
  const issues=[];let added=0;history.save(s.pages);
  for(const file of files){checkCanceled();
    if(s.pages.length>=50){issues.push('图片上限为 50 张。');break;}
    if(!/\.(png|jpe?g|webp|bmp|gif|avif)$/i.test(file.name)&&!/^image\/(png|jpeg|webp|bmp|gif|avif)$/.test(file.type)){issues.push(`${file.name}：暂不支持此格式。`);continue;}
    if(!file.size||file.size>30*1048576){issues.push(`${file.name}：文件为空或超过 30 MB。`);continue;}
    if(s.pages.reduce((n,p)=>n+p.file.size,0)+file.size>150*1048576){issues.push('图片总导入上限为 150 MB。');break;}
    let im;
    try{
      im=await decode(file);if(im.width*im.height>40000000)throw new Error('超过 4000 万像素上限。');
      const [w,h]=fitSize(im.width,im.height,160),c=canvas(w,h);c.getContext('2d').drawImage(im.source||im,0,0,w,h);
      const page={id:uid(),name:file.name,file,width:im.width,height:im.height,thumb:c.toDataURL('image/png'),rotation:0,flip:false,crop:{x:0,y:0,w:1,h:1},preset:'auto',settings:{...PRESETS.auto}};
      s.pages.push(page);if(!s.active)s.active=page.id;added++;c.width=c.height=1;
      if(file.type==='image/gif'||/\.gif$/i.test(file.name))issues.push(`${file.name}：仅导入 GIF 首帧。`);
    }catch(e){issues.push(`${file.name}：${e.message}`);}finally{im?.close();}
    progress(added,files.length,'正在导入图片');await tick();
  }
  toast([added?`已添加 ${added} 张图片。`:'没有导入新图片。',...issues].join(' '));
}
async function importFiles(files){
  const list=[...files];if(!list.length)return;
  if(s.mode==='image'&&list.every(f=>f.type==='application/pdf'||/\.pdf$/i.test(f.name)))setWorkspace('pdf');
  await runJob('正在添加文件',async()=>{if(s.mode==='pdf'){const r=await pdf.add(list);toast(`已添加 ${r.added} 页。 ${r.issues.join(' ')}`);}else await importImages(list);});
  $('fileInput').value='';$('cameraInput').value='';
}
function renderImages(){
  const strip=$('filmstrip');strip.replaceChildren();
  if(!s.pages.some(p=>p.id===s.active))s.active=s.pages[0]?.id||null;
  if(!s.pages.length){const empty=document.createElement('div');empty.className='strip-empty';empty.innerHTML=icon('image');empty.append('添加图片后，缩略图会显示在这里');strip.append(empty);}
  for(const [i,p]of s.pages.entries()){
    const b=document.createElement('button');b.className=`thumb${p.id===s.active?' active':''}`;b.draggable=!s.busy;b.disabled=s.busy;b.setAttribute('aria-label',`第 ${i+1} 张：${p.name}`);b.setAttribute('aria-pressed',String(p.id===s.active));
    const im=new Image();im.src=p.thumb;im.alt='';const num=document.createElement('span');num.className='thumb-index';num.textContent=i+1;const name=document.createElement('span');name.className='thumb-name';name.textContent=p.name;b.append(im,num,name);
    b.onclick=()=>{stopCrop();s.active=p.id;renderImages();refresh();schedulePreview();};
    b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=Math.max(0,Math.min(s.pages.length-1,i+(e.key==='ArrowRight'?1:-1)));s.active=s.pages[n].id;renderImages();refresh();schedulePreview();strip.children[n].focus();}};
    b.ondragstart=e=>{dragId=p.id;e.dataTransfer.setData('text/plain',p.id);};
    b.ondragover=e=>{if(dragId)e.preventDefault();};b.ondrop=e=>{if(!dragId||s.busy)return;e.preventDefault();e.stopPropagation();history.save(s.pages);s.pages=movePage(s.pages,dragId,p.id);dragId=null;renderImages();refresh();};b.ondragend=()=>dragId=null;strip.append(b);
  }
  if(s.pages.length){const add=document.createElement('button');add.className='thumb-add';add.innerHTML=icon('plus');add.setAttribute('aria-label','添加图片');add.onclick=()=>$('fileInput').click();add.disabled=s.busy;strip.append(add);}
}
async function sourceCanvas(p,maxSide=1100){
  const im=await decode(p.file);
  try{
    const turned=p.rotation%180!==0,rw=turned?im.height:im.width,rh=turned?im.width:im.height,crop=p.crop;
    const [w,h]=fitSize(crop.w*rw,crop.h*rh,maxSide),c=canvas(w,h),ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.scale(w/(crop.w*rw),h/(crop.h*rh));ctx.translate(-crop.x*rw,-crop.y*rh);ctx.translate(rw/2,rh/2);ctx.rotate(p.rotation*Math.PI/180);ctx.scale(p.flip?-1:1,1);ctx.drawImage(im.source||im,-im.width/2,-im.height/2);return c;
  }finally{im.close();}
}
async function filtered(source,settings){
  const c=canvas(source.width,source.height),ctx=c.getContext('2d');
  if(settings.mode==='original'&&['clean','sharpen','contrast','brightness'].every(k=>!Number(settings[k]))){ctx.drawImage(source,0,0);return c;}
  const input=source.getContext('2d',{willReadFrequently:true}).getImageData(0,0,source.width,source.height);let out;
  if(worker){try{out=await new Promise((resolve,reject)=>{const id=++jobId;jobs.set(id,{resolve,reject});worker.postMessage({id,buffer:input.data.buffer,width:source.width,height:source.height,settings},[input.data.buffer]);});}catch{const fresh=source.getContext('2d').getImageData(0,0,source.width,source.height);out=processPixels(fresh.data,source.width,source.height,settings);}}
  else{await tick();out=processPixels(input.data,source.width,source.height,settings);}
  ctx.putImageData(new ImageData(out,source.width,source.height),0,0);return c;
}
function schedulePreview(){clearTimeout(previewTimer);const token=++s.seq;previewTimer=setTimeout(()=>preview(token),80);}
async function preview(token){
  const p=current();$('imageEmpty').hidden=!!p;$('preview').hidden=!p;if(!p){s.original=null;$('previewInfo').textContent='预览区 · 支持拖放与粘贴';return;}if(s.mode!=='image')return;
  $('preview').classList.add('busy-preview');
  try{
    const snapshot={...p,crop:{...p.crop},settings:{...p.settings}},source=await sourceCanvas(snapshot),out=await filtered(source,snapshot.settings);
    if(token!==s.seq){source.width=source.height=out.width=out.height=1;return;}
    for(const [id,c]of [['beforeCanvas',source],['afterCanvas',out]]){$(id).width=c.width;$(id).height=c.height;$(id).getContext('2d').clearRect(0,0,c.width,c.height);$(id).getContext('2d').drawImage(c,0,0);}
    if(s.original){s.original.width=s.original.height=1;}s.original=source;out.width=out.height=1;
    $('previewInfo').textContent=`${p.width} × ${p.height} px · ${PRESETS[p.preset]?.label||'自定义'}`;
    fitPreview();setView(s.view);presetThumbnails(source);
  }catch(e){if(token===s.seq)toast(e.message);}finally{if(token===s.seq)$('preview').classList.remove('busy-preview');}
}
function fitPreview(){if(!s.original||s.mode!=='image')return;const rect=$('imageStage').getBoundingClientRect(),space=matchMedia('(max-width:520px)').matches?34:matchMedia('(max-width:1100px)').matches?52:90;const scale=Math.max(.02,Math.min((rect.width-space)/s.original.width,(rect.height-space)/s.original.height,1));$('preview').style.width=`${Math.floor(s.original.width*scale)}px`;$('preview').style.height=`${Math.floor(s.original.height*scale)}px`;}
function setView(mode){s.view=mode;document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===mode));$('afterCanvas').hidden=mode==='original';$('afterCanvas').style.clipPath=mode==='compare'?`inset(0 0 0 ${$('compareRange').value}%)`:'none';for(const id of ['compareLine','compareSlider','beforeLabel','afterLabel'])$(id).hidden=mode!=='compare'||!current();$('compareLine').style.left=`${$('compareRange').value}%`;}
function presetThumbnails(source){
  const [w,h]=fitSize(source.width,source.height,120),small=canvas(w,h),ctx=small.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0,w,h);const img=ctx.getImageData(0,0,w,h);
  for(const [key,settings]of Object.entries(PRESETS)){const holder=document.querySelector(`[data-preset="${key}"] .preset-thumb`),c=canvas(w,h);if(key==='original')c.getContext('2d').drawImage(small,0,0);else c.getContext('2d').putImageData(new ImageData(processPixels(img.data,w,h,settings),w,h),0,0);holder.replaceChildren(c);}
  small.width=small.height=1;
}
function edit(fn){if(!current()||s.busy)return;history.save(s.pages);fn(current());refresh();schedulePreview();}
function stopCrop(){s.crop=false;s.cropBox=null;cropStart=null;$('cropBox').hidden=true;$('cropActions').hidden=true;$('preview').classList.remove('cropping');}
function startCrop(){if(!current())return;s.crop=true;s.cropBox=null;$('cropActions').hidden=false;$('preview').classList.add('cropping');setView('processed');closeInspector();toast('在图片上拖动框选；完成后再次打开「裁剪」应用。');}
function normalizedPoint(e){const r=$('preview').getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
function renderPdf(){
  $('pdfEmpty').hidden=!!pdf.pages.length;$('pdfGrid').hidden=!pdf.pages.length;$('pdfCount').textContent=pdf.pages.length?`${pdf.pages.length} 页 · 已选择 ${pdf.selected.size} 页`:'尚未添加 PDF';
  const grid=$('pdfGrid');grid.replaceChildren();
  for(const [i,p]of pdf.pages.entries()){
    const card=document.createElement('div');card.className=`pdf-card${pdf.selected.has(p.id)?' selected':''}`;card.draggable=!s.busy;
    const head=document.createElement('div');head.className='pdf-card-head';const label=document.createElement('label');label.textContent=`第 ${i+1} 页`;const check=document.createElement('input');check.type='checkbox';check.className='pdf-check';check.checked=pdf.selected.has(p.id);check.disabled=s.busy;check.setAttribute('aria-label',`选择第 ${i+1} 页`);head.append(label,check);
    const area=document.createElement('div');area.className='pdf-thumb';const im=new Image();im.src=p.thumb;im.alt=`第 ${i+1} 页预览`;im.style.transform=`rotate(${p.rotation}deg)`;if(p.rotation%180)im.style.maxWidth='72%';area.append(im);const name=document.createElement('p');name.className='pdf-card-name';name.textContent=p.name;card.append(head,area,name);
    const toggle=()=>{if(s.busy)return;pdf.selected.has(p.id)?pdf.selected.delete(p.id):pdf.selected.add(p.id);renderPdf();refresh();};check.onchange=toggle;area.onclick=toggle;label.onclick=toggle;
    card.ondragstart=e=>{dragId=p.id;e.dataTransfer.setData('text/plain',p.id);};card.ondragover=e=>{if(dragId)e.preventDefault();};card.ondrop=e=>{if(!dragId||s.busy)return;e.preventDefault();e.stopPropagation();pdf.history.save(pdf.pages);pdf.pages=movePage(pdf.pages,dragId,p.id);dragId=null;renderPdf();refresh();};card.ondragend=()=>dragId=null;grid.append(card);
  }
}
function pdfEdit(fn){if(s.busy||!pdf.pages.length)return;pdf.history.save(pdf.pages);fn();pdf.selected=new Set([...pdf.selected].filter(id=>pdf.pages.some(p=>p.id===id)));renderPdf();refresh();}
function undo(redo=false){if(s.busy)return;stopCrop();if(s.mode==='image'){s.pages=history[redo?'redo':'undo'](s.pages);s.active=s.pages.some(p=>p.id===s.active)?s.active:s.pages[0]?.id||null;renderImages();schedulePreview();}else{pdf.pages=pdf.history[redo?'redo':'undo'](pdf.pages);pdf.selected=new Set();renderPdf();}refresh();}
function openExport(kind){if(s.busy)return;if(!(s.mode==='image'?s.pages.length:pdf.pages.length)){toast('请先添加文件。');return;}
  $('exportTitle').textContent=s.mode==='image'?'导出图片与文档':'导出 PDF';$('imageExportOptions').hidden=s.mode!=='image';$('pdfExportOptions').hidden=s.mode!=='pdf';$('pdfExportSummary').textContent=`将按当前顺序处理 ${pdf.targets().length} 页。`;
  if(kind)$('pdfExportMode').value=kind;$('exportDescription').textContent=s.mode==='image'?'从原始图片重新处理，并另存为新文件。':'按当前页面顺序导出，不主动栅格化文字和矢量图形。';exportFormatChanged();$('exportDialog').showModal();
}
function exportFormatChanged(){const isPdf=s.mode==='image'&&$('exportFormat').value==='pdf';$('imagePdfOptions').hidden=!isPdf;$('sendToPdf').hidden=!isPdf;}
async function toBlob(c,type,quality){return new Promise((resolve,reject)=>c.toBlob(blob=>blob&&blob.type===`image/${type}`?resolve(blob):reject(new Error(`浏览器不支持 ${type.toUpperCase()} 编码。`)),`image/${type}`,quality));}
function whiteCanvas(source){const c=canvas(source.width,source.height),ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(source,0,0);return c;}
async function imagePdf(pages){
  const output=[];
  for(const [i,p]of pages.entries()){checkCanceled();const src=await sourceCanvas(p,Number($('maxEdge').value)),processed=await filtered(src,p.settings),c=whiteCanvas(processed);let data,filter;
    if($('encoding').value==='lossless'){
      if(!('CompressionStream'in window))throw new Error('浏览器不支持无损 PDF 编码，请选择 JPEG。');
      const rgba=c.getContext('2d').getImageData(0,0,c.width,c.height).data,rgb=new Uint8Array(c.width*c.height*3);for(let a=0,b=0;a<rgba.length;a+=4){rgb[b++]=rgba[a];rgb[b++]=rgba[a+1];rgb[b++]=rgba[a+2];}
      data=await new Response(new Blob([rgb]).stream().pipeThrough(new CompressionStream('deflate'))).blob();filter='FlateDecode';
    }else{data=await toBlob(c,'jpeg',Number($('quality').value)/100);filter='DCTDecode';}
    output.push({width:c.width,height:c.height,data,filter});src.width=src.height=processed.width=processed.height=c.width=c.height=1;progress(i+1,pages.length,'正在生成 PDF');
  }
  checkCanceled();return makePdf(output,{paper:$('paper').value,orientation:$('orientation').value,margin:Number($('margin').value)});
}
function saveBlob(blob,name,inputSize){if(s.lastURL)URL.revokeObjectURL(s.lastURL);s.lastURL=URL.createObjectURL(blob);const a=document.createElement('a');a.href=s.lastURL;a.download=name;document.body.append(a);a.click();a.remove();const message=`已生成 ${name} · ${sizeLabel(blob.size)}${inputSize?`（原始合计 ${sizeLabel(inputSize)}）`:''}`;toast(message);$('downloadInfo').replaceChildren(document.createTextNode(`${message} `));const link=document.createElement('a');link.href=s.lastURL;link.download=name;link.textContent='再次保存';$('downloadInfo').append(link);$('downloadInfo').hidden=false;}
async function exportFiles(toWorkspace=false){
  await runJob('正在导出',async()=>{
    const name=safeName($('exportName').value);
    if(s.mode==='pdf'){const split=$('pdfExportMode').value==='split',blob=split?await pdf.split(name):await pdf.document(pdf.targets());checkCanceled();saveBlob(blob,`${name}.${split?'zip':'pdf'}`);return;}
    const type=$('exportFormat').value;
    if(type==='pdf'){
      const blob=await imagePdf(s.pages);
      if(toWorkspace){const result=await pdf.add([new File([blob],`${name}.pdf`,{type:'application/pdf'})]);if(result.added){setWorkspace('pdf',true);toast(`已将 ${result.added} 页送入 PDF 工作区。`);}else throw new Error(result.issues.join(' '));}
      else saveBlob(blob,`${name}.pdf`,s.pages.reduce((n,p)=>n+p.file.size,0));return;
    }
    const all=type.startsWith('zip-'),format=type.replace('zip-',''),extension=format==='jpeg'?'jpg':format,targets=all?s.pages:[current()],files=[];
    for(const [i,p]of targets.entries()){
      checkCanceled();const source=await sourceCanvas(p,Number($('maxEdge').value)),processed=await filtered(source,p.settings),out=format==='jpeg'?whiteCanvas(processed):processed;
      const data=await toBlob(out,format,Number($('quality').value)/100);files.push({name:`${String(i+1).padStart(2,'0')}-${safeName(p.name)}.${extension}`,data});source.width=source.height=processed.width=processed.height=out.width=out.height=1;progress(i+1,targets.length,'正在编码图片');
    }
    checkCanceled();const blob=all?await makeZip(files):files[0].data;saveBlob(blob,`${name}.${all?'zip':extension}`,targets.reduce((n,p)=>n+p.file.size,0));
  });
}
async function demo(){
  const c=canvas(1080,1440),ctx=c.getContext('2d');ctx.fillStyle='#dddcd4';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#f9f7ed';ctx.fillRect(65,45,950,1330);ctx.fillStyle='#7c719c';ctx.font='18px sans-serif';ctx.fillText('PAPER STUDIO     /     WEEKLY NOTES',133,135);ctx.fillStyle='#343740';ctx.font='bold 50px sans-serif';ctx.fillText('A little more clarity.',133,230);ctx.font='23px sans-serif';ctx.fillStyle='#8e908c';ctx.fillText('Ideas, sketches, and everything in between.',133,282);ctx.strokeStyle='#dcdbd3';ctx.beginPath();ctx.moveTo(133,330);ctx.lineTo(945,330);ctx.stroke();
  ctx.fillStyle='#555858';ctx.font='bold 22px sans-serif';ctx.fillText('01   Make room for the important things',133,398);ctx.font='22px sans-serif';ctx.fillStyle='#777a77';for(const [i,line]of ['A good tool should feel effortless.','Keep your documents together, edit with intention,','and let the content take the center stage.'].entries())ctx.fillText(line,133,454+i*42);
  ctx.fillStyle='#f0ede4';ctx.fillRect(133,637,812,340);const values=[95,153,124,209,179,253,227,283];for(let i=0;i<values.length;i++){ctx.fillStyle=i===7?'#8370ac':'#bdb4cd';ctx.fillRect(172+i*91,936-values[i],49,values[i]);}ctx.fillStyle='#94948e';ctx.font='18px sans-serif';ctx.fillText('SMALL STEPS, REAL PROGRESS',163,680);
  ctx.fillStyle='#555858';ctx.font='bold 22px sans-serif';ctx.fillText('02   From scattered pages to a clear story',133,1050);ctx.font='22px sans-serif';ctx.fillStyle='#81847d';ctx.fillText('Your files stay yours. Your workflow stays simple.',133,1108);ctx.fillText('One workspace. Many possibilities.',133,1150);ctx.fillStyle='#a2a19a';ctx.font='18px sans-serif';ctx.fillText('SAMPLE DOCUMENT  /  NOT PERSONAL DATA',133,1280);ctx.fillText('01',911,1280);
  const blob=await toBlob(c,'jpeg',.9);await importFiles([new File([blob],'weekly-notes.jpg',{type:'image/jpeg'})]);c.width=c.height=1;
}
// Build real controls once; current-document thumbnails are rendered after each preview.
for(const [key,p]of Object.entries(PRESETS)){
  const b=document.createElement('button');b.className='preset';b.dataset.preset=key;b.innerHTML='<span class="preset-thumb"><span class="skeleton"><i></i><i></i><i></i><i></i></span></span><span class="preset-name"></span>';b.querySelector('.preset-name').textContent=p.label;b.onclick=()=>edit(page=>{page.preset=key;page.settings={...p};});$('presets').append(b);
}
for(const [key,label,min,max]of [['clean','纸张去灰',0,100],['sharpen','文字锐化',0,150],['contrast','对比度',-50,80],['brightness','亮度',-40,40],['threshold','黑白阈值',2,35]]){
  const wrapper=document.createElement('label');wrapper.className='field';wrapper.innerHTML=`<span>${label}<output id="adjust-${key}Value"></output></span><input type="range" id="adjust-${key}" data-setting="${key}" min="${min}" max="${max}">`;const input=wrapper.querySelector('input');input.addEventListener('change',()=>edit(p=>{p.preset='custom';p.settings[key]=Number(input.value);}));input.addEventListener('input',()=>$(`adjust-${key}Value`).textContent=input.value);$('advancedFields').append(wrapper);
}
document.querySelectorAll('[data-workspace]').forEach(b=>{b.onclick=()=>setWorkspace(b.dataset.workspace);b.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setWorkspace(s.mode==='image'?'pdf':'image');$(s.mode==='image'?'imageTab':'pdfTab').focus();}};});
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>chooseTool(b.dataset.tool));
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('[data-export]').forEach(b=>b.onclick=()=>openExport());
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
for(const id of ['importFiles','emptyImport','pdfImport'])$(id).onclick=()=>$('fileInput').click();
$('fileInput').onchange=e=>importFiles(e.target.files);$('camera').onclick=()=>$('cameraInput').click();$('cameraInput').onchange=e=>importFiles(e.target.files);$('demo').onclick=()=>demo().catch(e=>toast(e.message));
$('openInspector').onclick=openInspector;$('closeInspector').onclick=closeInspector;$('drawerShade').onclick=closeInspector;
$('help').onclick=()=>$('helpDialog').showModal();$('undo').onclick=()=>undo();$('redo').onclick=()=>undo(true);$('compareRange').oninput=()=>setView('compare');
$('openExport').onclick=()=>openExport();$('exportFormat').onchange=exportFormatChanged;$('doExport').onclick=()=>exportFiles();$('sendToPdf').onclick=()=>exportFiles(true);
$('quality').oninput=()=>$('qualityValue').textContent=`${$('quality').value}%`;$('rasterPdf').onchange=refresh;
$('resetImage').onclick=()=>{edit(p=>{p.preset='original';p.settings={...PRESETS.original};p.rotation=0;p.flip=false;p.crop={x:0,y:0,w:1,h:1};});stopCrop();};
$('applyAll').onclick=()=>{if(!current()||s.busy)return;history.save(s.pages);const p=current();s.pages.forEach(page=>{page.settings={...p.settings};page.preset=p.preset;});toast(`已将增强参数应用到全部 ${s.pages.length} 张图片。`);refresh();};
$('startCrop').onclick=startCrop;$('cancelCrop').onclick=stopCrop;
$('preview').onpointerdown=e=>{if(!s.crop||s.busy)return;cropStart=normalizedPoint(e);s.cropBox=null;$('preview').setPointerCapture(e.pointerId);e.preventDefault();};
$('preview').onpointermove=e=>{if(!s.crop||!cropStart)return;const q=normalizedPoint(e),b={x:Math.min(q.x,cropStart.x),y:Math.min(q.y,cropStart.y),w:Math.abs(q.x-cropStart.x),h:Math.abs(q.y-cropStart.y)};s.cropBox=b;$('cropBox').hidden=false;Object.assign($('cropBox').style,{left:`${b.x*100}%`,top:`${b.y*100}%`,width:`${b.w*100}%`,height:`${b.h*100}%`});};
$('preview').onpointerup=()=>{if(s.crop&&cropStart){cropStart=null;if(matchMedia('(max-width:800px)').matches)openInspector();}};
$('applyCrop').onclick=()=>{const b=s.cropBox;if(!b||b.w<.015||b.h<.015){toast('请先框选有效区域。');return;}edit(p=>{const c=p.crop;p.crop={x:c.x+b.x*c.w,y:c.y+b.y*c.h,w:c.w*b.w,h:c.h*b.h};});stopCrop();closeInspector();};
$('rotateLeft').onclick=()=>{stopCrop();edit(p=>{p.rotation=(p.rotation+270)%360;p.crop={x:0,y:0,w:1,h:1};});};$('rotateRight').onclick=()=>{stopCrop();edit(p=>{p.rotation=(p.rotation+90)%360;p.crop={x:0,y:0,w:1,h:1};});};$('flipImage').onclick=()=>{stopCrop();edit(p=>{p.flip=!p.flip;p.crop={x:0,y:0,w:1,h:1};});};
$('removeImage').onclick=()=>{if(!current()||s.busy)return;history.save(s.pages);s.pages=s.pages.filter(p=>p.id!==s.active);stopCrop();renderImages();refresh();schedulePreview();};
for(const [id,delta]of [['moveLeft',-1],['moveRight',1]])$(id).onclick=()=>{const index=s.pages.findIndex(p=>p.id===s.active),other=s.pages[index+delta];if(!other||s.busy)return;history.save(s.pages);s.pages=movePage(s.pages,s.active,other.id);renderImages();refresh();};
$('pdfSelectAll').onclick=()=>{pdf.selected=pdf.selected.size===pdf.pages.length?new Set():new Set(pdf.pages.map(p=>p.id));renderPdf();refresh();};
$('pdfRotate').onclick=()=>pdfEdit(()=>{pdf.targets().forEach(p=>p.rotation=(p.rotation+90)%360);});
$('pdfDelete').onclick=()=>{if(!pdf.selected.size)return;pdfEdit(()=>{const ids=new Set(pdf.targets().map(p=>p.id));pdf.pages=pdf.pages.filter(p=>!ids.has(p.id));pdf.selected.clear();});};
$('pdfDuplicate').onclick=()=>{const targets=pdf.targets();if(pdf.pages.length+targets.length>50){toast('最多同时处理 50 页。');return;}pdfEdit(()=>{const copies=targets.map(p=>({...p,id:uid()}));pdf.pages.push(...copies);pdf.selected=new Set(copies.map(p=>p.id));});};
$('selectRange').onclick=()=>{try{pdf.selected=new Set(parseRange($('pageRange').value,pdf.pages.length).map(i=>pdf.pages[i].id));renderPdf();refresh();}catch(e){toast(e.message);}};
$('pdfMerge').onclick=()=>openExport('merge');$('pdfSplit').onclick=()=>openExport('split');$('clearPdf').onclick=()=>$('confirmDialog').showModal();$('confirmClear').onclick=()=>{pdfEdit(()=>{pdf.pages=[];pdf.selected.clear();});$('confirmDialog').close();};
$('pdfCompress').onclick=()=>runJob('正在优化 PDF',async()=>{const blob=await pdf.document(pdf.targets(),{raster:$('rasterPdf').checked,dpi:Number($('pdfDpi').value)});checkCanceled();saveBlob(blob,'optimized-document.pdf');});
$('pdfToImages').onclick=()=>runJob('正在转换页面',async()=>{if(s.pages.length+pdf.targets().length>50)throw new Error('图片工作区最多容纳 50 张，请先移除部分图片。');const images=await pdf.toImages(Number($('convertDpi').value));checkCanceled();await importImages(images);setWorkspace('image',true);});
$('cancelJob').onclick=()=>{s.cancel=true;$('cancelJob').disabled=true;$('progressText').textContent='正在取消，当前步骤完成后停止…';};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('当前浏览器不支持全屏。');}};
for(const stage of [$('imageStage'),$('pdfWorkspace')]){stage.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('Files')){e.preventDefault();stage.classList.add('drag-over');}});stage.addEventListener('dragleave',()=>stage.classList.remove('drag-over'));stage.addEventListener('drop',e=>{stage.classList.remove('drag-over');if(e.dataTransfer.files.length){e.preventDefault();importFiles(e.dataTransfer.files);}});}
window.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('Files'))e.preventDefault();});window.addEventListener('drop',e=>{if(e.dataTransfer.files.length)e.preventDefault();});
window.addEventListener('paste',e=>{if(s.mode!=='image'||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;const files=[...e.clipboardData.files];if(files.length){e.preventDefault();importFiles(files);}});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){stopCrop();closeInspector();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();undo(e.shiftKey);}});
window.addEventListener('beforeunload',e=>{if(s.pages.length||pdf.pages.length){e.preventDefault();e.returnValue='';}});
window.addEventListener('hashchange',()=>setWorkspace(location.hash==='#pdf'?'pdf':'image'));
$('inspector').addEventListener('keydown',e=>{if(e.key!=='Tab'||!$('inspector').classList.contains('open'))return;const items=[...$('inspector').querySelectorAll('button,input,select,summary,a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
matchMedia('(max-width:800px)').addEventListener('change',()=>closeInspector());
new ResizeObserver(()=>fitPreview()).observe($('imageStage'));
setWorkspace(location.hash==='#pdf'?'pdf':'image');renderImages();renderPdf();refresh();
