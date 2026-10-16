/** Shared navigation only. File queues, parsers and export engines remain owned by each workspace. */
(() => {
  'use strict';
  const tools = [
    {id:'scan',title:'扫描增强',detail:'净白、锐化、裁剪与多格式导出',href:'/tools/#image',icon:'scan'},
    {id:'compress',title:'文件压缩',detail:'图片与 PDF 的原文件压缩',href:'/tools/#compress',icon:'compress'},
    {id:'png',title:'PNG 转 PDF',detail:'PNG 批量排序、无损像素导出',href:'/tools/png-to-pdf-simple/',icon:'image'},
    {id:'mixed',title:'图片 + PDF 合并',detail:'PNG 和 PDF 按顺序混合成文档',href:'/tools/mixed-to-pdf/',icon:'layers'},
    {id:'merge',title:'PDF 合并',detail:'多份 PDF 合为一份，可按范围选页',href:'/tools/merge-pdf/',icon:'merge'},
    {id:'split',title:'PDF 拆分',detail:'逐页、每 N 页或自定义范围拆分',href:'/tools/split-pdf/',icon:'split'},
    {id:'extract',title:'提取 PDF 页面',detail:'选出需要的页面，另存为新文件',href:'/tools/extract-pdf/',icon:'extract'},
    {id:'organize',title:'PDF 页面整理',detail:'调整顺序、旋转与移除页面',href:'/tools/organize-pdf/',icon:'grid'}
  ];
  const shapes = {
    scan:'M7 3H4a1 1 0 0 0-1 1v3m14-4h3a1 1 0 0 1 1 1v3M3 17v3a1 1 0 0 0 1 1h3m10 0h3a1 1 0 0 0 1-1v-3M7 8h10M7 12h10M7 16h6',
    compress:'M8 3v5H3m18 0h-5V3M3 16h5v5m8 0v-5h5M3 3l5 5m8 0 5-5M3 21l5-5m8 0 5 5',
    image:'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM3 17l6-6 4 4 3-3 5 5M7 7h.01',
    layers:'m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5',
    merge:'M4 3h5v8H4zm11 0h5v8h-5zM6 14v3h12v-3M12 17v5',
    split:'M4 3h16v5H4zm0 13h5v5H4zm11 0h5v5h-5zM12 8v4m-6 4v-4h12v4',
    extract:'M14 3H5v18h14V8l-5-5Zm0 0v5h5M9 13h6m-6 4h4',
    grid:'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z'
  };
  const el = (tag,cls,text) => {const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const icon = name => {
    const n=document.createElementNS('http://www.w3.org/2000/svg','svg');
    n.setAttribute('viewBox','0 0 24 24');n.setAttribute('aria-hidden','true');n.classList.add('ts-icon');
    const p=document.createElementNS(n.namespaceURI,'path');p.setAttribute('d',shapes[name]||shapes.grid);n.append(p);return n;
  };
  const studio=!!document.querySelector('.topbar');
  let mount=document.getElementById('tool-directory');
  if(!mount&&!studio)return;
  const initialHash=location.hash;
  const path=location.pathname.replace(/index\.html$/,'').replace(/\/$/,'')+'/';
  const current=() => {
    if(path==='/tools/'){
      if(document.querySelector('#pdfTab[aria-selected="true"]'))return '';
      return document.querySelector('#imageTools [data-tool="compress"].active')?'compress':'scan';
    }
    return tools.find(t=>t.href.split('#')[0]===path)?.id||'';
  };
  const menu=el('details',studio?'ts-studio-menu':'ts-directory-menu');
  const summary=el('summary','ts-menu-summary');summary.setAttribute('aria-label',studio?'选择其他工具':'展开或收起工具导航');summary.append(icon('grid'),el('span','',studio?'全部工具':'工具导航'),el('span','ts-menu-caret','⌄'));
  const panel=el('div','ts-menu-panel');
  const heading=el('div','ts-menu-heading');heading.append(el('span','ts-kicker','YOUR LOCAL WORKSPACE'),el('strong','',studio?'选择一个工具':'文件工具箱'));
  const quick=el('div','ts-quicklinks');
  for(const [name,href] of [['图片工作区','/tools/#image'],['PDF 工作区','/tools/#pdf']]){const a=el('a','',name);a.href=href;quick.append(a);}
  const nav=el('nav','tool-switcher__grid');nav.setAttribute('aria-label','全部工具与功能说明');
  for(const t of tools){
    const a=el('a','tool-switcher__item');a.href=t.href;a.dataset.toolTarget=t.id;
    const body=el('span','ts-link-copy');body.append(el('strong','tool-switcher__item-name',t.title),el('span','tool-switcher__item-detail',t.detail));
    a.append(icon(t.icon),body);nav.append(a);
  }
  const note=el('p','ts-nav-note','切换独立页面前，请保存处理结果。当前页面的文件不会自动转移。');
  panel.append(heading,quick,nav,note);menu.append(summary,panel);
  if(studio){
    document.body.classList.add('ts-studio');
    const brand=document.querySelector('.topbar .brand');
    const group=el('div','ts-brand-group');brand.before(group);group.append(brand,menu);
    document.addEventListener('pointerdown',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false;});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;summary.focus();}});
    // Keep deep links from the earlier scanner valid in the unified editor.
    const openImageTool=(target)=>{
      const tab=document.getElementById('imageTab'),button=document.querySelector('#imageTools [data-tool="'+target+'"]');
      if(!tab||!button||tab.disabled||button.disabled)return;
      tab.click();button.focus();button.click();refresh();
    };
    if(initialHash==='#compress'){
      if(document.readyState==='complete')openImageTool('compress');
      else window.addEventListener('load',()=>openImageTool('compress'),{once:true});
    }
    menu.addEventListener('click',e=>{
      const a=e.target.closest('a');if(!a)return;
      if(['compress','scan'].includes(a.dataset.toolTarget)&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();openImageTool(a.dataset.toolTarget==='scan'?'enhance':'compress');}
      menu.open=false;
    });
    document.querySelector('.app')?.addEventListener('click',()=>queueMicrotask(refresh));
    document.querySelector('.workspace-tabs')?.addEventListener('click',()=>queueMicrotask(refresh));
  }else{
    document.body.classList.add('ts-legacy');
    mount.replaceChildren(menu);document.querySelector('.site-header')?.after(mount);
    const wide=window.matchMedia('(min-width:1100px)');
    const resize=()=>{menu.open=wide.matches;};resize();wide.addEventListener('change',resize);
    const brand=document.querySelector('.site-header .brand');
    if(brand){brand.replaceChildren();const mark=el('span','brand-mark');mark.append(icon('layers'));const name=el('span','');name.append(el('strong','','Paper Studio'),el('small','','YUXUAN WANG / TOOLS'));brand.append(mark,name);}
  }
  function refresh(){
    const key=current();
    for(const a of nav.querySelectorAll('[data-tool-target]')){
      const active=a.dataset.toolTarget===key;a.classList.toggle('is-current',active);
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    }
  }
  window.addEventListener('hashchange',()=>queueMicrotask(refresh));
  window.addEventListener('tool-workspace-change',refresh);refresh();
})();
