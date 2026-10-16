/* Shared workbench. Original Files stay local; the worker owns all parsing and PDF output. */
(function(){
'use strict';
const $=id=>document.getElementById(id),K=window.PDFToolkit,mode=document.body.dataset.tool;
const multi=mode==='merge'||mode==='mixed';
const labels={merge:['PDF 合并','按顺序组合多份 PDF，也可以只取其中几页。','选择 PDF 文件','合并并下载 PDF'],mixed:['图片 + PDF 合并','把 PNG 图片和 PDF 放进同一份文档，按你的顺序组合。','选择 PNG / PDF','合并并下载 PDF'],split:['PDF 拆分','按页、按固定页数或自定义范围，拆成独立文件。','选择一个 PDF','拆分并下载'],extract:['提取 PDF 页面','只留下需要的页面，按输入的顺序组成一份新 PDF。','选择一个 PDF','提取并下载 PDF'],organize:['PDF 页面整理','调整顺序、旋转页面，取消勾选不需要的页面。','选择一个 PDF','保存整理后的 PDF']};
if(!K||!labels[mode])return;
const state={items:[],pages:[],next:1,busy:false,cancelled:false,worker:null,pending:null,job:0,output:null,validation:''};
const pretty=n=>n<1048576?(n/1024).toFixed(1)+' KiB':(n/1048576).toFixed(1)+' MiB';
function notice(text,error=false){$('notice').textContent=text;$('notice').className='notice'+(error?' error':'');$('notice').hidden=!text;}
function invalidate(){if(state.output)URL.revokeObjectURL(state.output);state.output=null;$('result').hidden=true;$('download').removeAttribute('href');}
function cancelWorker(error){
 if(state.worker)state.worker.terminate();state.worker=null;
 if(state.pending){const p=state.pending;state.pending=null;clearTimeout(p.timer);p.reject(error);}
}
function ensureWorker(){
 if(state.worker)return;
 state.worker=new Worker(new URL('./worker.js',document.querySelector('script[data-workbench]').src));
 state.worker.onmessage=({data})=>{
  const p=state.pending;if(!p||data.id!==p.id)return;
  if(data.progress){$('progress-label').textContent=data.progress.label;$('progress').value=data.progress.percent;return;}
  state.pending=null;clearTimeout(p.timer);data.error?p.reject(new Error(data.error)):p.resolve(data.result);
 };
 state.worker.onerror=e=>{e.preventDefault();cancelWorker(new Error('PDF 组件加载或运行失败，请刷新页面；大文件可尝试减少页数。'));};
}
function rpc(type,payload,transfer=[]){
 if(state.cancelled)return Promise.reject(new Error('已取消，文件和设置仍然保留。'));
 return new Promise((resolve,reject)=>{
  try{
   ensureWorker();const id=++state.job;
   const timer=setTimeout(()=>cancelWorker(new Error('处理时间过长，已停止。请减少文件大小或页数后重试。')),120000);
   state.pending={id,resolve,reject,timer};state.worker.postMessage({id,type,payload},transfer);
  }catch(error){if(state.pending)clearTimeout(state.pending.timer);state.pending=null;reject(error);}
 });
}
function checkCancel(){if(state.cancelled)throw new Error('已取消，文件和设置仍然保留。');}
function options(){return {mode,name:$('filename').value,range:$('extract-range').value,splitMode:$('split-mode').value,ranges:$('split-ranges').value,chunk:Number($('chunk').value),paper:$('paper').value,margin:Number($('margin').value),dpi:Number($('dpi').value),selection:state.pages.filter(p=>p.keep).map(p=>({index:p.index,rotation:p.rotation}))};}
function outputSummary(){
 if(!state.items.length)return '等待添加文件';
 const count=state.items.reduce((n,s)=>n+s.count,0);let output=count,parts=1;
 if(multi)output=state.items.reduce((n,s)=>n+(s.kind==='png'?1:K.parsePages(s.range,s.count).length),0);
 if(mode==='extract')output=K.parsePages($('extract-range').value,state.items[0].count).length;
 if(mode==='split'){const groups=K.splitGroups(state.items[0].count,$('split-mode').value,$('split-ranges').value,Number($('chunk').value));parts=groups.length;output=groups.reduce((n,g)=>n+g.length,0);}
 if(mode==='organize')output=state.pages.filter(p=>p.keep).length;
 if(output<1)throw new Error('请至少保留一页。');if(output>K.LIMITS.pages)throw new Error('一次最多输出 500 页。');
 return parts>1?`${parts} 个 PDF · 共 ${output} 页 · ZIP 下载`:`${output} 页 · 1 个 PDF`;
}
function controls(){
 document.querySelectorAll('button,input,select,textarea').forEach(el=>el.disabled=state.busy);
 $('cancel').disabled=false;$('busy-area').hidden=!state.busy;$('workspace').setAttribute('aria-busy',String(state.busy));
 $('clear').disabled=state.busy||!state.items.length;$('sort').disabled=state.busy||state.items.length<2;
 $('sort').hidden=!multi;$('empty').hidden=!!state.items.length;
 $('file-count').textContent=state.items.length+' 个文件';$('input-size').textContent=pretty(state.items.reduce((n,s)=>n+s.file.size,0));
 $('choose').textContent=!multi&&state.items.length?'更换 PDF':labels[mode][2];
 $('chunk-wrap').hidden=$('split-mode').value!=='chunks';$('split-ranges-wrap').hidden=$('split-mode').value!=='custom';
 $('dpi').disabled=state.busy||$('paper').value!=='image';
 $('page-section').hidden=mode!=='organize'||!state.items.length;
 try{$('summary').textContent=outputSummary();state.validation='';}catch(error){state.validation=error.message;$('summary').textContent='请检查页码设置';}
 $('validation').textContent=state.validation;$('validation').hidden=!state.validation;
 $('export').disabled=state.busy||!state.items.length||!!state.validation;
 for(const [list,items] of [[$('files'),state.items],[$('page-grid'),state.pages]]){
  Array.from(list.children).forEach((el,index)=>{el.draggable=!state.busy;const up=el.querySelector('[data-action=up]'),down=el.querySelector('[data-action=down]');if(up)up.disabled=state.busy||index===0;if(down)down.disabled=state.busy||index===items.length-1;});
 }
}
function busy(value,label=''){
 state.busy=value;if(value){state.cancelled=false;$('progress-label').textContent=label;$('progress').value=0;}
 controls();
}
function action(label,symbol,fn,type){const b=document.createElement('button');b.type='button';b.className='icon-button';b.title=label;b.setAttribute('aria-label',label);b.textContent=symbol;b.dataset.action=type;b.onclick=()=>{if(!state.busy)fn();};return b;}
function move(items,from,to,render){
 if(state.busy||from<0||to<0||to>=items.length||from===to)return;
 const [item]=items.splice(from,1);items.splice(to,0,item);invalidate();render();
}
function drag(card,type,key,findIndex,items,render){
 card.addEventListener('dragstart',e=>{if(state.busy||e.target.closest('input,button,a')){e.preventDefault();return;}e.dataTransfer.setData(type,String(key));e.dataTransfer.effectAllowed='move';card.classList.add('dragging');});
 card.addEventListener('dragend',()=>document.querySelectorAll('.dragging,.drag-over').forEach(el=>el.classList.remove('dragging','drag-over')));
 card.addEventListener('dragover',e=>{if(!state.busy&&Array.from(e.dataTransfer.types).includes(type)){e.preventDefault();card.classList.add('drag-over');}});
 card.addEventListener('dragleave',()=>card.classList.remove('drag-over'));
 card.addEventListener('drop',e=>{const raw=e.dataTransfer.getData(type);if(raw==='')return;e.preventDefault();e.stopPropagation();card.classList.remove('drag-over');move(items,findIndex(Number(raw)),findIndex(key),render);});
}
function discard(item){URL.revokeObjectURL(item.url);}
function renderFiles(){
 $('files').replaceChildren();
 state.items.forEach((item,index)=>{
  const card=document.createElement('li');card.className='source-card';card.dataset.id=item.id;
  const num=document.createElement('span');num.className='order-label';num.textContent=String(index+1).padStart(2,'0');
  const icon=document.createElement('div');icon.className='file-icon '+item.kind;
  if(item.kind==='png'){const img=document.createElement('img');img.src=item.url;img.alt='PNG 缩略图';icon.append(img);}else icon.textContent='PDF';
  const info=document.createElement('div');info.className='source-info';
  const title=document.createElement('p');title.className='source-name';title.textContent=item.file.name;title.title=item.file.name;
  const meta=document.createElement('p');meta.className='source-meta';meta.textContent=item.count+' 页 · '+pretty(item.file.size)+(item.rotation?' · 顺时针 '+item.rotation+'°':'');
  const open=document.createElement('a');open.href=item.url;open.target='_blank';open.rel='noopener noreferrer';open.className='open-original';open.textContent='打开原文件 ↗';
  info.append(title,meta,open);
  if(multi&&item.kind==='pdf'){
   const label=document.createElement('label');label.className='source-range';label.textContent='取用页码';
   const input=document.createElement('input');input.type='text';input.value=item.range;input.placeholder='全部，例如 1-3,5';input.maxLength=4000;input.setAttribute('aria-label',item.file.name+' 的页码范围');input.dataset.range=item.id;
   input.addEventListener('input',()=>{item.range=input.value;invalidate();controls();});label.append(input);info.append(label);
  }
  const buttons=document.createElement('div');buttons.className='source-actions';
  if(multi){
   buttons.append(action('上移文件 '+item.file.name,'↑',()=>move(state.items,index,index-1,renderFiles),'up'));
   buttons.append(action('下移文件 '+item.file.name,'↓',()=>move(state.items,index,index+1,renderFiles),'down'));
   buttons.append(action('旋转文件 '+item.file.name,'↻',()=>{item.rotation=(item.rotation+90)%360;invalidate();renderFiles();},'rotate'));
  }
  buttons.append(action('移除文件 '+item.file.name,'×',()=>{discard(item);state.items=state.items.filter(s=>s!==item);state.pages=[];invalidate();renderFiles();renderPages();},'remove'));
  card.append(num,icon,info,buttons);$('files').append(card);
  if(multi)drag(card,'application/x-toolkit-source',item.id,id=>state.items.findIndex(s=>s.id===id),state.items,renderFiles);
 });controls();
}
function resetPages(){state.pages=(state.items[0]?.pages||[]).map((info,index)=>({...info,index,originalRotation:info.rotation,rotation:0,keep:true}));renderPages();}
function renderPages(){
 $('page-grid').replaceChildren();
 if(mode!=='organize'){controls();return;}
 state.pages.forEach((page,index)=>{
  const card=document.createElement('li');card.className='page-card'+(page.keep?'':' excluded');card.dataset.page=page.index;
  const label=document.createElement('label');label.className='keep-label';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=page.keep;checkbox.setAttribute('aria-label','保留原第 '+(page.index+1)+' 页');label.append(checkbox,document.createTextNode('保留此页'));
  checkbox.onchange=()=>{page.keep=checkbox.checked;invalidate();renderPages();};
  const visual=document.createElement('div');visual.className='page-symbol';visual.textContent=String(page.index+1);visual.style.transform='rotate('+page.rotation+'deg)';
  const title=document.createElement('strong');title.textContent='原第 '+(page.index+1)+' 页';
  const meta=document.createElement('small');meta.textContent=Math.round(page.width)+' × '+Math.round(page.height)+' pt · '+((page.originalRotation+page.rotation)%360)+'°';
  const buttons=document.createElement('div');buttons.className='page-actions';buttons.append(action('上移第 '+(page.index+1)+' 页','←',()=>move(state.pages,index,index-1,renderPages),'up'),action('下移第 '+(page.index+1)+' 页','→',()=>move(state.pages,index,index+1,renderPages),'down'),action('旋转第 '+(page.index+1)+' 页','↻',()=>{page.rotation=(page.rotation+90)%360;invalidate();renderPages();},'rotate'));
  card.append(label,visual,title,meta,buttons);$('page-grid').append(card);
  drag(card,'application/x-toolkit-page',page.index,id=>state.pages.findIndex(p=>p.index===id),state.pages,renderPages);
 });controls();
}
async function addFiles(files){
 if(!files.length)return;if(state.busy){notice('正在处理文件，请完成或取消当前操作后再添加。');return;}
 if(!multi&&files.length!==1){notice('此工具每次处理一个 PDF，请只选择一个文件。',true);return;}
 busy(true,'正在检查文件…');invalidate();notice('');const errors=[];let added=0;
 try{
  for(const file of files){
   checkCancel();
   if(multi&&state.items.length>=K.LIMITS.files){errors.push('已达到 50 个文件上限，其余未添加。');break;}
   try{
    if(!file.size||file.size>K.LIMITS.file)throw new Error('单个文件不能为空或超过 50 MiB。');
    if((multi?state.items.reduce((n,s)=>n+s.file.size,0):0)+file.size>K.LIMITS.total)throw new Error('文件合计不能超过 150 MiB。');
    $('progress-label').textContent='检查 '+file.name;
    const buffer=await file.arrayBuffer();checkCancel();
    const meta=await rpc('inspect',{buffer,name:file.name,allowPng:mode==='mixed'},[buffer]);checkCancel();
    if((multi?state.items.reduce((n,s)=>n+s.count,0):0)+meta.count>K.LIMITS.pages)throw new Error('输入文件合计不能超过 500 页。');
    if(!multi){state.items.forEach(discard);state.items=[];}
    state.items.push({...meta,file,id:state.next++,range:'',rotation:0,url:URL.createObjectURL(file)});added++;
   }catch(error){if(state.cancelled)throw error;errors.push(file.name+'：'+error.message);}
  }
  if(mode==='organize'&&added)resetPages();
  notice(errors.length?errors.slice(0,6).join('\n')+(errors.length>6?'\n另有 '+(errors.length-6)+' 个文件未添加。':''):'已添加 '+added+' 个文件。请检查顺序与输出设置。',!!errors.length);
 }catch(error){notice(error.message,!state.cancelled);}
 finally{$('file-input').value='';busy(false);renderFiles();renderPages();}
}
async function exportFiles(){
 if(state.busy||!state.items.length||state.validation)return;
 const settings=options();busy(true,'准备文件…');invalidate();notice('');
 try{
  const inputs=[];
  for(const item of state.items){checkCancel();const buffer=await item.file.arrayBuffer();checkCancel();inputs.push({buffer,name:item.file.name,range:item.range,rotation:item.rotation});}
  const result=await rpc('build',{inputs,options:settings},inputs.map(i=>i.buffer));checkCancel();
  state.output=URL.createObjectURL(result.blob);
  const a=$('download');a.href=state.output;a.download=result.name;a.textContent='下载 '+result.name+' ↓';
  $('result-meta').textContent=result.count>1?`${result.count} 个 PDF 已打包 · ${pretty(result.blob.size)}`:pretty(result.blob.size);
  $('result').hidden=false;a.click();notice('文件已生成。若浏览器没有自动下载，请点击下方下载按钮。');
 }catch(error){notice(error.message||'处理失败，请减少文件大小后重试。',!state.cancelled);}
 finally{busy(false);}
}
$('tool-title').textContent=labels[mode][0];$('tool-description').textContent=labels[mode][1];$('export').textContent=labels[mode][3];
$('drop-title').textContent=mode==='mixed'?'把 PNG 和 PDF 拖到这里':multi?'把 PDF 文件拖到这里':'把一个 PDF 拖到这里';
$('file-input').multiple=multi;$('file-input').accept=mode==='mixed'?'.png,.pdf,image/png,application/pdf':'.pdf,application/pdf';
$('filename').value={merge:'merged',mixed:'combined',split:'split',extract:'extracted',organize:'organized'}[mode];
$('queue-hint').textContent=multi?(mode==='mixed'?'拖动或用箭头调整文件顺序。可以重复添加同一 PDF 并指定页码，将图片插在中间。':'拖动或用箭头调整文件顺序。留空页码表示全部；可以按 3,1-2 的顺序取页。'):'原文件不会被修改。更换文件前，请先下载已有结果。';
for(const el of document.querySelectorAll('[data-modes]'))el.hidden=!el.dataset.modes.split(' ').includes(mode);
for(const a of document.querySelectorAll('[data-mode-link]'))if(a.dataset.modeLink===mode){a.classList.add('active');a.setAttribute('aria-current','page');}
$('choose').onclick=()=>$('file-input').click();$('file-input').onchange=e=>void addFiles(Array.from(e.target.files));
$('clear').onclick=()=>{if(state.busy)return;state.items.forEach(discard);state.items=[];state.pages=[];invalidate();notice('');renderFiles();renderPages();};
$('sort').onclick=()=>{if(state.busy)return;state.items.sort((a,b)=>a.file.name.localeCompare(b.file.name,undefined,{numeric:true,sensitivity:'base'}));invalidate();renderFiles();};
$('options').addEventListener('input',()=>{invalidate();controls();});$('options').addEventListener('change',()=>{invalidate();controls();});
$('export').onclick=()=>void exportFiles();
$('cancel').onclick=()=>{state.cancelled=true;cancelWorker(new Error('已取消，文件和设置仍然保留。'));};
$('select-all').onclick=()=>{state.pages.forEach(p=>p.keep=true);invalidate();renderPages();};
$('select-none').onclick=()=>{state.pages.forEach(p=>p.keep=false);invalidate();renderPages();};
$('invert').onclick=()=>{state.pages.forEach(p=>p.keep=!p.keep);invalidate();renderPages();};
$('rotate-all').onclick=()=>{state.pages.forEach(p=>p.rotation=(p.rotation+90)%360);invalidate();renderPages();};
$('reset-pages').onclick=()=>{invalidate();resetPages();};
window.addEventListener('dragover',e=>{if(Array.from(e.dataTransfer.types).includes('Files')){e.preventDefault();if(!state.busy)$('drop-zone').classList.add('drag-over');}});
window.addEventListener('dragleave',e=>{if(!e.relatedTarget)$('drop-zone').classList.remove('drag-over');});
window.addEventListener('drop',e=>{$('drop-zone').classList.remove('drag-over');if(e.dataTransfer.files.length){e.preventDefault();void addFiles(Array.from(e.dataTransfer.files));}});
document.addEventListener('paste',e=>{if(mode!=='mixed'||e.target.closest('input,textarea,[contenteditable]'))return;const files=Array.from(e.clipboardData?.items||[]).filter(i=>i.kind==='file').map(i=>i.getAsFile()).filter(Boolean);if(files.length){e.preventDefault();void addFiles(files);}});
window.addEventListener('pagehide',e=>{if(!e.persisted){state.items.forEach(discard);if(state.output)URL.revokeObjectURL(state.output);state.worker?.terminate();}});
controls();
if(typeof Worker!=='function'){notice('当前浏览器不支持后台文件处理，请使用较新的浏览器。',true);$('choose').disabled=true;}
})();
