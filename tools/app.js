/* Browser-only UI. Files never enter fetch, storage, analytics, or a server API. */
(function () {
  'use strict';
  const $=id=>document.getElementById(id),pdf=window.PngPdf;
  if(!pdf) { $('message').hidden=false;$('message').textContent='转换组件未能加载，请刷新页面。';return; }
  const state={items:[],importing:false,exporting:false,cancelled:false,download:null,nextId:1};
  const locked=()=>state.importing||state.exporting;
  const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
  const bytes=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KiB':(n/1048576).toFixed(1)+' MiB';
  function message(text,error=false) {
    $('message').textContent=text;$('message').className='notice'+(error?' error':'');$('message').hidden=!text;
  }
  function invalidate() {
    if(state.download) URL.revokeObjectURL(state.download);
    state.download=null;$('download').hidden=true;$('download').removeAttribute('href');
  }
  function settings() {
    return {paper:$('paper').value,orientation:$('orientation').value,dpi:Number($('dpi').value),margin:Number($('margin').value),quality:document.querySelector('input[name=quality]:checked').value};
  }
  function controls() {
    const busy=locked(),n=state.items.length;
    $('choose').disabled=busy;$('file-input').disabled=busy;$('settings').disabled=busy;
    $('clear').disabled=busy||!n;$('sort').disabled=busy||n<2;$('export').disabled=busy||!n;
    $('count').textContent=n;$('summary').textContent=n?n+' 张图片 · '+n+' 页 PDF':'等待添加图片';
    $('input-size').textContent=bytes(state.items.reduce((sum,i)=>sum+i.file.size,0));
    $('empty').hidden=!!n;$('workspace').setAttribute('aria-busy',String(busy));
    $('orientation').disabled=busy||$('paper').value==='image';$('dpi').disabled=busy||$('paper').value!=='image';
    $('margin-value').textContent=$('margin').value+' mm';
    $('setting-note').textContent=$('paper').value==='image'?'页面大小由像素尺寸与 DPI 决定，四周加上所选边距；方向跟随图片。':'等比例居中，不裁切、不拉伸。自动方向会逐页适配图片。';
    document.querySelectorAll('.image-card').forEach((card,index)=>{
      card.draggable=!busy;card.querySelectorAll('button').forEach(b=>{
        b.disabled=busy||(b.dataset.action==='up'&&index===0)||(b.dataset.action==='down'&&index===n-1);
      });
    });
  }
  function move(id,to) {
    if(locked()) return;
    const from=state.items.findIndex(i=>i.id===id);
    if(from<0||to<0||to>=state.items.length||from===to) return;
    const [item]=state.items.splice(from,1);state.items.splice(to,0,item);invalidate();render();
  }
  function button(label,symbol,action,item,index) {
    const b=document.createElement('button');b.type='button';b.className='icon-button'+(action==='remove'?' remove':'');
    b.textContent=symbol;b.title=label;b.setAttribute('aria-label',label+'：'+item.file.name);b.dataset.action=action;
    b.addEventListener('click',()=>{
      if(locked()) return;
      if(action==='up'||action==='down') {
        move(item.id,index+(action==='up'?-1:1));
        const focus=document.querySelector('[data-id="'+item.id+'"] [data-action="'+action+'"]');if(focus&&!focus.disabled) focus.focus();return;
      }
      if(action==='rotate') item.turns=(item.turns+1)%4;
      if(action==='remove') {URL.revokeObjectURL(item.thumbnail);state.items=state.items.filter(i=>i.id!==item.id);}
      invalidate();render();
    });return b;
  }
  function render() {
    $('queue').replaceChildren();
    state.items.forEach((item,index)=>{
      const card=document.createElement('li');card.className='image-card';card.dataset.id=item.id;card.draggable=!locked();
      const num=document.createElement('span');num.className='page-number';num.textContent=String(index+1).padStart(2,'0');
      const thumb=document.createElement('div');thumb.className='thumbnail';const image=document.createElement('img');
      image.src=item.thumbnail;image.alt='';image.style.transform='rotate('+item.turns*90+'deg)';thumb.append(image);
      const info=document.createElement('div');info.style.minWidth='0';const name=document.createElement('p');name.className='image-name';name.textContent=item.file.name;name.title=item.file.name;
      const meta=document.createElement('p');meta.className='image-meta';const size=item.turns%2?[item.height,item.width]:[item.width,item.height];
      meta.textContent=size.join(' × ')+' px · '+bytes(item.file.size);info.append(name,meta);
      const actions=document.createElement('div');actions.className='card-actions';
      for(const [label,symbol,action] of [['上移','↑','up'],['下移','↓','down'],['顺时针旋转 90°','↻','rotate'],['移除','×','remove']]) actions.append(button(label,symbol,action,item,index));
      card.append(num,thumb,info,actions);
      card.addEventListener('dragstart',e=>{
        if(locked()||e.target.closest('button')) {e.preventDefault();return;}
        e.dataTransfer.setData('application/x-png-pdf-id',String(item.id));e.dataTransfer.effectAllowed='move';card.classList.add('dragging');
      });
      card.addEventListener('dragend',()=>document.querySelectorAll('.image-card').forEach(c=>c.classList.remove('dragging','drop-target')));
      card.addEventListener('dragover',e=>{if(!locked()&&Array.from(e.dataTransfer.types).includes('application/x-png-pdf-id')) {e.preventDefault();card.classList.add('drop-target');}});
      card.addEventListener('dragleave',()=>card.classList.remove('drop-target'));
      card.addEventListener('drop',e=>{
        const id=Number(e.dataTransfer.getData('application/x-png-pdf-id'));if(!id)return;
        e.preventDefault();e.stopPropagation();move(id,index);card.classList.remove('drop-target');
      });$('queue').append(card);
    });controls();
  }
  async function decode(file) {
    if(typeof createImageBitmap==='function') {
      const bitmap=await createImageBitmap(file);return {image:bitmap,width:bitmap.width,height:bitmap.height,close:()=>bitmap.close()};
    }
    const url=URL.createObjectURL(file),image=new Image();
    try {await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('PNG 解码失败，文件可能已经损坏。'));image.src=url;});}
    catch(error){URL.revokeObjectURL(url);throw error;}
    return {image,width:image.naturalWidth,height:image.naturalHeight,close:()=>URL.revokeObjectURL(url)};
  }
  function toBlob(canvas,type='image/png',quality) {
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('浏览器图片编码失败，请减少图片尺寸。')),type,quality));
  }
  async function addFiles(files) {
    if(!files.length)return;
    if(locked()) {message('正在处理图片，请完成当前操作后再添加。');return;}
    state.importing=true;invalidate();controls();message('正在本地读取图片…');const errors=[];let added=0;
    try {
      for(const file of files) {
        let bitmap=null,canvas=null;
        try {
          if(state.items.length>=pdf.LIMITS.files) {errors.push('已达到 50 张上限，其余文件未添加。');break;}
          if(file.size>pdf.LIMITS.fileBytes) throw new Error('单张文件不能超过 25 MiB。');
          if(state.items.reduce((sum,i)=>sum+i.file.size,0)+file.size>pdf.LIMITS.totalBytes) throw new Error('图片总大小不能超过 100 MiB。');
          pdf.validatePNG(new Uint8Array(await file.arrayBuffer()));
          bitmap=await decode(file);pdf.layout(bitmap.width,bitmap.height,{});
          canvas=document.createElement('canvas');const scale=Math.min(1,180/Math.max(bitmap.width,bitmap.height));
          canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
          const ctx=canvas.getContext('2d');if(!ctx) throw new Error('无法创建绘图画布，请尝试更新浏览器。');
          ctx.drawImage(bitmap.image,0,0,canvas.width,canvas.height);const thumbnail=URL.createObjectURL(await toBlob(canvas));
          state.items.push({id:state.nextId++,file,width:bitmap.width,height:bitmap.height,thumbnail,turns:0});added++;
        } catch(error){errors.push(file.name+'：'+(error.message||'图片无法读取。'));}
        finally{if(bitmap)bitmap.close();if(canvas){canvas.width=1;canvas.height=1;}}
        await pause();
      }
    } finally {state.importing=false;$('file-input').value='';render();}
    message(errors.length?errors.slice(0,5).join('\n')+(errors.length>5?'\n另有 '+(errors.length-5)+' 个文件未添加。':''):(added?'已添加 '+added+' 张图片，可调整顺序后导出。':''),!!errors.length);
  }
  function checkCancel(){if(state.cancelled)throw new Error('已取消转换，图片仍保留在列表中。');}
  async function exportPdf() {
    if(locked()||!state.items.length)return;
    const items=state.items.slice(),options=settings(),name=pdf.filename($('filename').value);
    invalidate();state.exporting=true;state.cancelled=false;controls();message('');
    $('progress-area').hidden=false;$('progress').value=0;$('cancel').disabled=false;
    try {
      const doc=new pdf.Writer();
      for(let index=0;index<items.length;index++) {
        checkCancel();const item=items[index];$('progress-text').textContent='正在转换 '+(index+1)+' / '+items.length;await pause();checkCancel();
        let bitmap=null,canvas=null;
        try {
          bitmap=await decode(item.file);checkCancel();
          const rotated=item.turns%2,ow=rotated?bitmap.height:bitmap.width,oh=rotated?bitmap.width:bitmap.height;
          const factor=options.quality==='compact'?Math.min(1,2400/Math.max(ow,oh)):1;
          canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(ow*factor));canvas.height=Math.max(1,Math.round(oh*factor));
          const ctx=canvas.getContext('2d',{willReadFrequently:options.quality==='lossless'});if(!ctx)throw new Error('浏览器内存不足，请减少图片后重试。');
          if(options.quality==='compact'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);}
          ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(item.turns*Math.PI/2);
          ctx.drawImage(bitmap.image,-bitmap.width*factor/2,-bitmap.height*factor/2,bitmap.width*factor,bitmap.height*factor);
          bitmap.close();bitmap=null;const box=pdf.layout(ow,oh,options);checkCancel();
          if(options.quality==='compact') doc.addJPEG(new Uint8Array(await (await toBlob(canvas,'image/jpeg',.85)).arrayBuffer()),canvas.width,canvas.height,box);
          else await doc.addRGBA(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height,box);
        } finally {if(bitmap)bitmap.close();if(canvas){canvas.width=1;canvas.height=1;}}
        $('progress').value=(index+1)/items.length*100;await pause();checkCancel();
      }
      const blob=doc.finish();checkCancel();state.download=URL.createObjectURL(blob);
      const link=$('download');link.href=state.download;link.download=name;link.hidden=false;link.textContent='重新下载 '+name+'（'+bytes(blob.size)+'）';link.click();
      message('已生成 '+items.length+' 页 PDF（'+bytes(blob.size)+'）。若浏览器没有自动下载，请点击「重新下载」。');
    } catch(error){message(error.message||'转换失败，请减少图片数量或尝试更新浏览器。',!state.cancelled);}
    finally{state.exporting=false;$('progress-area').hidden=true;controls();}
  }
  $('choose').addEventListener('click',()=>$('file-input').click());
  $('file-input').addEventListener('change',e=>{void addFiles(Array.from(e.target.files));});
  $('export').addEventListener('click',()=>{void exportPdf();});
  $('cancel').addEventListener('click',()=>{state.cancelled=true;$('cancel').disabled=true;$('progress-text').textContent='正在取消…';});
  $('clear').addEventListener('click',()=>{if(locked())return;state.items.forEach(i=>URL.revokeObjectURL(i.thumbnail));state.items=[];invalidate();message('');render();});
  $('sort').addEventListener('click',()=>{if(locked())return;state.items.sort((a,b)=>a.file.name.localeCompare(b.file.name,undefined,{numeric:true,sensitivity:'base'}));invalidate();render();});
  $('settings').addEventListener('input',()=>{invalidate();controls();});
  $('settings').addEventListener('change',()=>{invalidate();controls();});
  window.addEventListener('dragover',e=>{if(Array.from(e.dataTransfer.types).includes('Files'))e.preventDefault();});
  $('drop-zone').addEventListener('dragenter',()=>{if(!locked())$('drop-zone').classList.add('drag-over');});
  $('drop-zone').addEventListener('dragleave',e=>{if(!$('drop-zone').contains(e.relatedTarget))$('drop-zone').classList.remove('drag-over');});
  window.addEventListener('drop',e=>{
    $('drop-zone').classList.remove('drag-over');if(!e.dataTransfer.files.length)return;e.preventDefault();void addFiles(Array.from(e.dataTransfer.files));
  });
  document.addEventListener('paste',e=>{
    if(e.target.closest('input,textarea,[contenteditable=true]'))return;
    const files=Array.from(e.clipboardData?.items||[]).filter(i=>i.kind==='file').map(i=>i.getAsFile()).filter(Boolean);
    if(files.length){e.preventDefault();void addFiles(files);}
  });
  window.addEventListener('pagehide',e=>{if(!e.persisted){state.items.forEach(i=>URL.revokeObjectURL(i.thumbnail));if(state.download)URL.revokeObjectURL(state.download);}});
  render();
})();
