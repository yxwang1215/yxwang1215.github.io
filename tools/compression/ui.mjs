import {compressFile,detectFile} from './compress.mjs';
import {makeZip,safeName} from '../png-to-pdf/core.mjs';
const byId=id=>document.getElementById(id),queue=[];let working=false,controller=null,zipUrl=null;
const formatBytes=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(2)} MB`;
const profiles={lossless:'PNG：像素与元数据无损重压缩；PDF：只优化对象结构，不降低图像质量；JPG/WebP：保留原文件。',balanced:'推荐日常使用。有损：PNG 适度减色，JPG/WebP 质量 84%；PDF 仅重编码兼容图像，保留文字与矢量。',small:'体积优先。有损：PNG 更强减色，JPG/WebP 质量 65%，最长边 1800 px；PDF 仅压缩兼容图像，保留文字与矢量。'};
function switchTab(name){
 if(document.querySelector('.tool-tabs button:disabled'))return;
 byId('scanPanel').hidden=name!=='scan';byId('compressionPanel').hidden=name!=='compress';
 document.querySelectorAll('[data-tool]').forEach(b=>{const selected=b.dataset.tool===name;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
 if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);
 window.dispatchEvent(new Event('tool-workspace-change'));
}
document.querySelectorAll('[data-tool]').forEach(b=>{
 b.onclick=()=>switchTab(b.dataset.tool);
 b.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=b.dataset.tool==='scan'?'compress':'scan';switchTab(next);document.querySelector(`[data-tool=${next}]`).focus();}};
});
if(location.hash==='#compress')switchTab('compress');
window.addEventListener('hashchange',()=>{if(location.hash==='#compress')switchTab('compress');else if(location.hash==='#scan')switchTab('scan');});
const status=s=>byId('compressionStatus').textContent=s;
function cleanupResults(){for(const r of queue){if(r.url)URL.revokeObjectURL(r.url);r.url=null;r.result=null;r.error=null;}if(zipUrl)URL.revokeObjectURL(zipUrl);zipUrl=null;byId('zipAgain').hidden=true;byId('zipAgain').removeAttribute('href');}
function busy(value){working=value;byId('compressionPanel').setAttribute('aria-busy',String(value));document.querySelectorAll('#compressionPanel button,#compressionPanel input,#compressionPanel select,.tool-tabs button').forEach(b=>b.disabled=value);byId('stopCompress').hidden=!value;byId('stopCompress').disabled=false;if(!value)refresh();}
function refresh(){
 byId('startCompress').disabled=working||!queue.length;byId('clearCompress').disabled=working||!queue.length;
 byId('downloadAll').disabled=working||!queue.some(r=>r.result);
 byId('compressionEmpty').hidden=!!queue.length;
 byId('compressionCount').textContent=`${queue.length} 个文件 · ${formatBytes(queue.reduce((n,r)=>n+r.file.size,0))}`;
 const rows=byId('compressionRows');rows.replaceChildren();
 queue.forEach(r=>{
  const card=document.createElement('div');card.className='compression-row';
  const label=document.createElement('div');label.className='compression-name';const name=document.createElement('strong');name.textContent=r.file.name;label.append(name);
  const note=document.createElement('small');note.textContent=r.error||r.result?.note||'等待压缩';if(r.error)note.className='error-note';label.append(note);card.append(label);
  const sizes=document.createElement('div');sizes.className='compression-sizes';sizes.textContent=formatBytes(r.file.size)+(r.result?` → ${formatBytes(r.result.blob.size)}`:'');card.append(sizes);
  const saving=document.createElement('span');saving.className='saving';saving.textContent=r.result?(r.result.kept?'保留原文件':`减小 ${((1-r.result.blob.size/r.file.size)*100).toFixed(1)}%`):r.error?'未处理':'待处理';card.append(saving);
  if(r.result){const a=document.createElement('a');a.className='button';a.textContent='下载';a.href=r.url;a.download=r.name;card.append(a);}
  rows.append(card);
 });
}
async function add(files){if(working)return;const issues=[];for(const f of Array.from(files)){
 if(queue.length>=20){issues.push('最多 20 个文件，其余未添加。');break;}
 if(!f.size||f.size>50*1048576){issues.push(`${f.name}：为空或超过 50 MB。`);continue;}
 if(queue.reduce((n,r)=>n+r.file.size,0)+f.size>150*1048576){issues.push(`${f.name}：超过总量 150 MB。`);continue;}
 try{const type=await detectFile(f);queue.push({file:f,type});}catch(e){issues.push(`${f.name}：${e.message}`);}
 }refresh();status(issues.length?issues.join('\n'):'已添加。选择压缩档位后点击「开始压缩」。');byId('compressInput').value='';}
byId('compressionChoose').onclick=()=>byId('compressInput').click();byId('compressInput').onchange=e=>add(e.target.files);
const zone=byId('compressionDrop');zone.ondragover=e=>{e.preventDefault();if(!working)zone.classList.add('dragging');};zone.ondragleave=()=>zone.classList.remove('dragging');zone.ondrop=e=>{e.preventDefault();zone.classList.remove('dragging');if(!working)add(e.dataTransfer.files);};
byId('compressionProfile').onchange=()=>{byId('profileHelp').textContent=profiles[byId('compressionProfile').value];};byId('compressionProfile').onchange();
byId('startCompress').onclick=async()=>{
 if(working||!queue.length)return;cleanupResults();const profile=byId('compressionProfile').value;controller=new AbortController();busy(true);let completed=0;
 try{for(let i=0;i<queue.length;i++){
  if(controller.signal.aborted)break;const r=queue[i];status(`正在压缩 ${i+1}/${queue.length}：${r.file.name}`);
  byId('compressionProgress').value=i/queue.length*100;
  try{r.result=await compressFile(r.file,profile,controller.signal,s=>status(`${i+1}/${queue.length} · ${s}`));
   r.name=`${safeName(r.file.name)}${r.result.kept?'-original':'-compressed'}.${r.type==='jpeg'?'jpg':r.type}`;
   r.url=URL.createObjectURL(r.result.blob);completed++;
  }catch(e){if(e.name==='AbortError')break;r.error=e.message;}
  refresh();
 }
 byId('compressionProgress').value=completed/queue.length*100;
 const results=queue.filter(r=>r.result),before=results.reduce((n,r)=>n+r.file.size,0),after=results.reduce((n,r)=>n+r.result.blob.size,0);
 status(`${controller.signal.aborted?'已停止':'处理完成'}：${completed}/${queue.length} 个文件可下载${completed?`，${formatBytes(before)} → ${formatBytes(after)}，节省 ${((1-after/before)*100).toFixed(1)}%`:''}。${controller.signal.aborted?'已完成的文件保留，未完成文件未输出。':''}`);
 }finally{busy(false);refresh();}
};
byId('stopCompress').onclick=()=>{controller?.abort();status('正在取消；当前 PDF 解析或编码完成后停止。');byId('stopCompress').disabled=true;};
byId('clearCompress').onclick=()=>{if(working)return;cleanupResults();queue.length=0;byId('compressionProgress').value=0;refresh();status('已清空，设备上的原文件未修改。');};
byId('downloadAll').onclick=async()=>{
 if(working)return;const files=queue.filter(r=>r.result).map((r,i)=>({name:`${String(i+1).padStart(3,'0')}-${r.name}`,data:r.result.blob}));if(!files.length)return;
 busy(true);try{const blob=await makeZip(files);if(zipUrl)URL.revokeObjectURL(zipUrl);zipUrl=URL.createObjectURL(blob);const a=byId('zipAgain');a.href=zipUrl;a.download='compressed-files.zip';a.textContent=`再次下载 ZIP（${formatBytes(blob.size)}）`;a.hidden=false;a.click();}catch(e){status(e.message);}finally{busy(false);}
};
window.addEventListener('beforeunload',e=>{if(queue.length||working){e.preventDefault();e.returnValue='';}});
refresh();
