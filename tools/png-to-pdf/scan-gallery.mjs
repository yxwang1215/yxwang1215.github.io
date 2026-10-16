/** Mount before editor.mjs binds preset buttons; all effects use the editor's real pixel pipeline. */
export function mountScanGallery(modes) {
  const grid=document.querySelector('.presets');
  if(!grid||grid.dataset.scanGallery)return;
  grid.dataset.scanGallery=String(modes.length);grid.classList.add('scan-gallery');
  const style=document.createElement('link');style.rel='stylesheet';
  style.href=new URL('./scan-gallery.css',import.meta.url).href;document.head.append(style);
  const captions={comprehensive:'去阴影 · 校色 · 降噪',auto:'自动适配每一页',document:'白纸黑字更干净',bw:'纯黑白扫描件',original:'保留原始观感',shadow:'均衡光照与底色',sharpen:'强化细字与边缘',faded:'加深淡字与铅笔线',denoise:'柔化细小噪点',receipt:'小票与热敏纸',book:'减轻书页灰底',whiteboard:'白底与彩色笔迹',stamp:'保留红章与蓝字',ink:'浅黑文字 · 少灰底',gray:'保留灰阶层次',color:'温和保留原色',vivid:'图表与插图更鲜明',photo:'提亮照片细节'};
  grid.replaceChildren(...modes.map(mode=>{
    const b=document.createElement('button');b.type='button';b.dataset.preset=mode.id;b.dataset.group=mode.group;
    b.dataset.doc='';b.disabled=true;b.title=mode.hint;b.setAttribute('aria-pressed',String(mode.id==='auto'));
    const c=document.createElement('canvas');c.width=68;c.height=86;c.setAttribute('aria-hidden','true');
    const title=document.createElement('strong');title.textContent=mode.name;
    const hint=document.createElement('small');hint.textContent=captions[mode.id]||mode.hint;
    b.append(c,title,hint);
    if(mode.id==='comprehensive'){const tag=document.createElement('span');tag.className='scan-local-tag';tag.textContent='本地';b.append(tag);}
    return b;
  }));
  const intro=document.createElement('p');intro.className='scan-gallery-intro';intro.textContent=`${modes.length} 种一键样式 · 导入后预览真实效果`;
  const filters=document.createElement('div');filters.className='scan-filters';filters.setAttribute('role','group');filters.setAttribute('aria-label','扫描样式分类');
  let active='all';
  const selectGroup=id=>{
    active=id;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scanGroup===id)));
    grid.querySelectorAll('[data-preset]').forEach(b=>b.hidden=id!=='all'&&b.dataset.group!==id);
    grid.scrollTop=0;
  };
  for(const [id,label] of [['all','全部'],['basic','常用'],['repair','修复'],['scene','场景'],['color','色彩']]){
    const b=document.createElement('button');b.type='button';b.dataset.scanGroup=id;
    b.textContent=label;b.setAttribute('aria-pressed',String(id==='all'));b.onclick=()=>selectGroup(id);filters.append(b);
  }
  grid.before(intro,filters);
  const explanation=document.querySelector('.bottom-info article:nth-child(2) p');
  if(explanation)explanation.textContent=`${modes.length} 种一键模式，每页自动分析明暗。局部亮度校正、纸张校色、降噪与文字增强，无需逐个调整参数。`;
  const note=document.createElement('details');note.className='scan-capabilities';
  const summary=document.createElement('summary');summary.textContent='综合修复与 OmniFix 的区别';
  const text=document.createElement('p');text.textContent='综合修复组合本地光照均衡、纸张校色、保边降噪和局部文字增强，不是扫描全能王的 OmniFix，也未接入其专有模型。暂不支持 AI 去摩尔纹、曲面展平、遮挡补全或失焦文字重建。原文件不变，重要材料请使用「前后对比」核对。';
  note.append(summary,text);grid.after(note);
  // When switching pages or resetting, do not leave the selected mode hidden in another group.
  const observer=new MutationObserver(()=>{
    const selected=grid.querySelector('[data-preset][aria-pressed="true"]');
    if(selected&&active!=='all'&&selected.dataset.group!==active)selectGroup('all');
  });
  observer.observe(grid,{subtree:true,attributes:true,attributeFilter:['aria-pressed']});
}
