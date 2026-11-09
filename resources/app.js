'use strict';

/** Research Shelf — portable, zero-backend personal knowledge library.
 *  Entries are stored in this browser's localStorage. Export JSON regularly;
 *  hosting the site alone does not sync user-entered entries across devices.
 */
const STORAGE_KEY = 'research-shelf:resources:v1';
const DELETED_SEED_KEY = 'research-shelf:deleted-defaults:v1';
const SEED = Array.isArray(window.RESEARCH_SHELF_SEED) ? window.RESEARCH_SHELF_SEED : [];

const CATEGORY_NAME = { MoE: 'Mixture of Experts', OPD: 'On-Policy Distillation', Multimodal: 'Multimodal / Vision', Systems: 'Systems & Infra', Other: 'Others' };
const TYPE_NAME = { guide: '技术手册', paper: '学术论文', code: '代码项目', blog: '文章博客', video: '视频课程' };
const TYPE_EN = { guide: 'TECHNICAL HANDBOOK', paper: 'RESEARCH PAPER', code: 'OPEN SOURCE', blog: 'ARTICLE / BLOG', video: 'VIDEO / COURSE' };
const STATUS_NAME = { 'to-read': '待读', reading: '正在学习', done: '已经读完' };
const FILTER_TITLE = { all: '全部收藏', starred: '重点收藏', 'to-read': '待读清单', reading: '正在学习', done: '已经读完' };

const el = id => document.getElementById(id);
const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const icon = name => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const pad = value => String(value).padStart(2, '0');
const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const validUrl = value => {try {const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null;} catch {return null;}};
const domain = value => {try {return new URL(value).hostname.replace(/^www\./, '');} catch {return 'external link';}};
const fmtDate = value => {const d = new Date(value);return Number.isNaN(+d) ? '—' : new Intl.DateTimeFormat('zh-CN', {year:'numeric', month:'2-digit', day:'2-digit'}).format(d).replaceAll('/','.');};
const normalized = v => String(v || '').toLocaleLowerCase().normalize('NFKC');
const escAttr = esc;
function normalizeResource(input){
  if(!input || typeof input !== 'object' || !String(input.title || '').trim() || !validUrl(input.url)) return null;
  return {
    id: String(input.id || newId()),title:String(input.title).trim().slice(0,180), url:validUrl(input.url),
    category:CATEGORY_NAME[input.category] ? input.category : 'Other',
    type:TYPE_NAME[input.type] ? input.type : 'blog',
    source:String(input.source || domain(input.url)).slice(0,120),
    status:STATUS_NAME[input.status] ? input.status : 'to-read',
    starred:Boolean(input.starred),
    published:String(input.published || ''),
    createdAt:Number.isNaN(new Date(input.createdAt).getTime()) ? new Date().toISOString() : String(input.createdAt),
    summary:String(input.summary || '').slice(0,1500),
    tags:Array.isArray(input.tags) ? input.tags.map(t => String(t).trim().slice(0,55)).filter(Boolean).slice(0,16) : [],
    notes:String(input.notes || '').slice(0,16000),
    links:Array.isArray(input.links) ? input.links.filter(l => l && validUrl(l.url)).map(l=>({label:String(l.label||domain(l.url)).slice(0,90),url:validUrl(l.url)})).slice(0,30) : []
  };
}
function deletedDefaultIds(){
  try {const value=JSON.parse(localStorage.getItem(DELETED_SEED_KEY) || '[]');return Array.isArray(value) ? value : [];} catch {return [];}
}
function loadResources(){
  const defaults=SEED.map(normalizeResource).filter(Boolean);
  try {
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved !== null){
      const arr=JSON.parse(saved);
      if(Array.isArray(arr)){
        const result=arr.map(normalizeResource).filter(Boolean);
        const deleted=new Set(deletedDefaultIds());
        // Publish newly added defaults from resources.js without erasing this browser's edits.
        for(const starter of defaults){if(!deleted.has(starter.id)&&!result.some(r=>r.id===starter.id || r.url===starter.url))result.push(starter);}
        return result;
      }
    }
  } catch(err){console.warn('Cannot read local collection',err);}
  return defaults;
}
let resources = loadResources();
let currentFilter = 'all';
let currentCategory = '';
let currentType = 'all';
let currentQuery = '';
let activeId = null;
let priorFocus = null;
let toastTimer;
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(resources));return true;}catch(err){console.warn('Cannot save collection',err);notify('浏览器保存失败，请及时导出备份');return false;}}
function notify(message){const box=el('toast');box.textContent=message;box.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('visible'),3200);}

function visibleResources(){
  let list=resources.filter(item=>{
    if(currentCategory && item.category !== currentCategory)return false;
    if(currentFilter==='starred'&&!item.starred)return false;
    if(STATUS_NAME[currentFilter] && item.status!==currentFilter)return false;
    if(currentType!=='all' && item.type!==currentType)return false;
    const blob=normalized([item.title,item.source,item.category,item.type,item.summary,item.notes,item.tags.join(' '),...item.links.map(l=>l.label)].join(' '));
    return !currentQuery || blob.includes(normalized(currentQuery));
  });
  const sort=el('sortSelect').value;
  list.sort((a,b) => sort==='title' ? a.title.localeCompare(b.title,'zh-CN') : sort==='oldest' ? new Date(a.createdAt)-new Date(b.createdAt) : new Date(b.createdAt)-new Date(a.createdAt));
  return list;
}
function render(){
  el('statTotal').textContent=pad(resources.length);el('statReading').textContent=pad(resources.filter(r=>r.status==='reading').length);el('statDone').textContent=pad(resources.filter(r=>r.status==='done').length);
  el('allCount').textContent=pad(resources.length);
  document.querySelectorAll('[data-count-cat]').forEach(node=>{const num=resources.filter(r=>r.category===node.dataset.countCat).length;node.textContent=num?pad(num):'';});
  document.querySelectorAll('#primaryNav .nav-item').forEach(node=>node.classList.toggle('active',!currentCategory && node.dataset.filter===currentFilter));
  document.querySelectorAll('#categoryNav .nav-item').forEach(node=>node.classList.toggle('active',node.dataset.category===currentCategory));
  document.querySelectorAll('#typeFilters .filter-chip').forEach(node=>node.classList.toggle('active',node.dataset.type===currentType));
  const list=visibleResources();const heading=currentCategory ? CATEGORY_NAME[currentCategory] : FILTER_TITLE[currentFilter];
  el('libraryHeading').innerHTML=`${esc(heading)} <span class="heading-period">.</span>`;
  el('resultCount').textContent=pad(list.length);el('filterResultCount').textContent=`显示 ${list.length} 条`;
  el('librarySub').textContent=currentQuery ? `当前搜索：${currentQuery}` : currentCategory ? '同一个研究方向下，持续积累有价值的研究线索。' : '每一份留下来的资料，都有它值得被再次打开的理由。';
  el('cards').innerHTML=list.length ? list.map((r,i)=>cardHTML(r,i===0&&!currentCategory&&currentFilter==='all'&&currentType==='all'&&!currentQuery)).join('') : `<div class="empty-state"><div class="empty-icon">${icon('book')}</div><h3>${resources.length?'暂时没有找到匹配的资料':'这里还没有任何收藏'}</h3><p>${resources.length?'换个关键词或清除筛选条件，再找找看。':'从一篇真正值得认真阅读的材料开始。'}</p><button type="button" data-action="${resources.length?'reset':'add'}">${resources.length?'清除筛选':'添加第一份资料'}</button></div>`;
}
function cardHTML(r,isFeatured){
  const tags=r.tags.slice(0,isFeatured?5:4).map(t=>`<span class="tag"># ${esc(t)}</span>`).join('');
  return `<article class="resource-card ${isFeatured?'featured':''}" data-id="${escAttr(r.id)}">
    <div class="resource-main">
      <div class="card-meta"><span class="card-type">${esc(TYPE_EN[r.type])}</span><span class="card-separator"></span><time class="card-date" datetime="${escAttr(r.createdAt)}">${esc(fmtDate(r.published||r.createdAt))}</time><button type="button" class="card-star ${r.starred?'is-starred':''}" data-action="star" data-id="${escAttr(r.id)}" aria-label="${r.starred?'取消重点收藏':'加入重点收藏'}" title="${r.starred?'取消重点收藏':'重点收藏'}">${icon('star')}</button></div>
      <h3 class="card-title">${esc(r.title)}</h3>
      <div class="card-source">${esc(r.source)}</div>
      <p class="card-description">${esc(r.summary||'还没有添加摘要。打开详情，记录这份资料为什么值得保留。')}</p>
      <div class="card-tags">${tags}</div>
      <div class="card-bottom"><div class="card-bottom-left"><span class="status-pill ${escAttr(r.status)}">${esc(STATUS_NAME[r.status])}</span><span class="card-domain">· ${esc(domain(r.url))}</span></div><button type="button" class="card-cta" data-action="view" data-id="${escAttr(r.id)}">查看笔记 ${icon('arrow')}</button></div>
    </div>
    ${isFeatured?`<div class="card-visual" aria-hidden="true"><div class="visual-grid"></div><span class="visual-top">RESEARCH NOTE / 001</span><div class="expert-diagram"><div class="expert-line one"></div><div class="expert-line two"></div><div class="expert-line three"></div><div class="expert-dot router">R</div><div class="expert-dot e1">E₁</div><div class="expert-dot e2">E₂</div><div class="expert-dot e3">E₃</div><span class="visual-label in">ROUTER</span><span class="visual-label out">EXPERTS</span></div><span class="visual-bottom">${esc(r.category==='MoE'?'SPARSE INTELLIGENCE':CATEGORY_NAME[r.category].toUpperCase())}<br>READ · THINK · REVISIT</span></div>`:''}
   </article>`;
}

function setOverlay(open){el('overlay').hidden=!open;document.body.classList.toggle('modal-open',open);}
function closePanels(){el('detailPanel').hidden=true;el('formModal').hidden=true;el('sidebar').classList.remove('is-open');setOverlay(false);activeId=null;if(priorFocus?.focus)priorFocus.focus();priorFocus=null;}
function openDetail(id){
  const r=resources.find(r=>r.id===id);if(!r)return;
  priorFocus=document.activeElement;closePanels();priorFocus=document.activeElement;activeId=id;
  el('detailBody').innerHTML=`<div class="detail-kicker">${esc(TYPE_EN[r.type])} / ${esc(r.category)}</div><h2 class="detail-title" id="detailTitle">${esc(r.title)}</h2><div class="detail-source">${esc(r.source)}${r.published?' · '+esc(fmtDate(r.published)):''}</div><div class="detail-tags">${r.tags.map(t=>`<span class="tag"># ${esc(t)}</span>`).join('')}</div><a href="${escAttr(r.url)}" target="_blank" rel="noopener noreferrer" class="detail-primary">打开原始资料 ${icon('external')}</a>
    <div class="detail-status-row"><label for="detailStatus">学习进度</label><select id="detailStatus" class="status-select" aria-label="学习进度">${Object.entries(STATUS_NAME).map(([key,label])=>`<option value="${key}" ${r.status===key?'selected':''}>${label}</option>`).join('')}</select></div>
    <div class="detail-section"><h3>为什么收藏它</h3><div class="detail-prose">${esc(r.summary||'尚未记录收藏理由。')}</div></div>
    <div class="detail-section"><h3>我的学习笔记</h3><div class="detail-prose">${esc(r.notes||'还没有笔记。点击下方“编辑资料”记录阅读心得、疑问和研究灵感。')}</div><div class="detail-note">此处笔记属于你的本地收藏，不是原文中的观点。</div></div>
    ${r.links.length?`<div class="detail-section"><h3>扩展阅读 / 相关链接</h3><div class="detail-related">${r.links.map(link=>`<a class="related-link" href="${escAttr(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ${icon('external')}</a>`).join('')}</div></div>`:''}
    <div class="detail-footer"><button data-detail-action="edit" data-id="${escAttr(r.id)}">${icon('edit')} 编辑资料</button><button data-detail-action="star" data-id="${escAttr(r.id)}">${icon('star')} ${r.starred?'取消重点':'重点收藏'}</button><button class="delete-resource" data-detail-action="delete" data-id="${escAttr(r.id)}">${icon('trash')} 删除</button></div>`;
  el('detailPanel').hidden=false;setOverlay(true);el('closeDetail').focus();
}
function openForm(id){
  const existing=id?resources.find(r=>r.id===id):null;
  closePanels();priorFocus=document.activeElement;
  el('resourceForm').reset();el('formId').value=existing?.id||'';
  el('formHeading').textContent=existing?'编辑收藏资料':'添加一份收藏';
  el('formSubmit').innerHTML=icon('check')+(existing?' 保存修改':' 保存收藏');
  const fields={formTitle:'title',formUrl:'url',formCategory:'category',formType:'type',formSource:'source',formStatus:'status',formSummary:'summary',formNotes:'notes'};
  if(existing){Object.entries(fields).forEach(([input,key])=>el(input).value=existing[key]||'');el('formTags').value=existing.tags.join(', ');el('formLinks').value=existing.links.map(l=>`${l.label} | ${l.url}`).join('\n');el('formStarred').checked=existing.starred;}
  else {el('formCategory').value=currentCategory||'MoE';el('formType').value='guide';el('formStatus').value='to-read';}
  el('formModal').hidden=false;setOverlay(true);el('formTitle').focus();
}
function parseLinks(text){
  const lines=text.split('\n').map(s=>s.trim()).filter(Boolean);const links=[];
  for(const line of lines){const idx=line.indexOf('|');const label=idx>=0?line.slice(0,idx).trim():'';const raw=idx>=0?line.slice(idx+1).trim():line;const url=validUrl(raw);if(!url)throw new Error(`无效相关链接：${line.slice(0,70)}。请使用“名称 | https://...”格式。`);links.push({label:(label||domain(url)).slice(0,90),url});}
  return links.slice(0,30);
}
function saveForm(e){
  e.preventDefault();const id=el('formId').value;const prior=id?resources.find(r=>r.id===id):null;
  try{
    const url=validUrl(el('formUrl').value.trim());if(!url)throw new Error('请填写有效的 http 或 https 原文地址。');
    const links=parseLinks(el('formLinks').value);
    const resource=normalizeResource({
      id:prior?.id||newId(),title:el('formTitle').value.trim(),url,category:el('formCategory').value,
      type:el('formType').value,source:el('formSource').value.trim(),status:el('formStatus').value,
      summary:el('formSummary').value.trim(),notes:el('formNotes').value.trim(),
      tags:el('formTags').value.split(/[,，、]/).map(s=>s.trim()).filter(Boolean),
      links,starred:el('formStarred').checked,createdAt:prior?.createdAt||new Date().toISOString(),published:prior?.published||''
    });
    if(!resource)throw new Error('资料标题和链接不能为空。');
    if(!prior && resources.some(r=>r.url===url))throw new Error('这个链接已在收藏中。可以编辑现有资料，避免重复。');
    if(prior)resources=resources.map(r=>r.id===prior.id?resource:r);else resources.unshift(resource);
    persist();render();closePanels();notify(prior?'资料更新成功':'已添加到研究资料库');
  }catch(err){notify(err.message);}
}
function changeStatus(id,status){const r=resources.find(r=>r.id===id);if(!r||!STATUS_NAME[status])return;r.status=status;persist();render();notify(`已更新：${STATUS_NAME[status]}`);}
function toggleStar(id){const r=resources.find(r=>r.id===id);if(!r)return;r.starred=!r.starred;persist();render();notify(r.starred?'已加入重点收藏':'已取消重点收藏');}
function deleteResource(id){const r=resources.find(r=>r.id===id);if(!r)return;if(!confirm(`确定删除「${r.title}」吗？此操作会删除该资料及笔记。建议先导出备份。`))return;if(SEED.some(s=>s.id===id)){try{localStorage.setItem(DELETED_SEED_KEY,JSON.stringify([...new Set([...deletedDefaultIds(),id])]));}catch(err){console.warn('Cannot record removed starter',err);}}resources=resources.filter(r=>r.id!==id);persist();render();closePanels();notify('资料已删除');}
function resetFilters(){currentFilter='all';currentCategory='';currentType='all';currentQuery='';el('searchInput').value='';el('sortSelect').value='newest';render();}
function exportResources(){const payload={app:'Research Shelf',version:1,exportedAt:new Date().toISOString(),deletedSeedIds:deletedDefaultIds(),resources};const data=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(data);link.download=`research-shelf-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);notify('已导出全部收藏与笔记');}
async function importResources(file){if(!file)return;
  try{
    if(file.size>8*1024*1024)throw new Error('备份文件超过 8 MB，请检查文件内容。');
    const raw=JSON.parse(await file.text());const list=Array.isArray(raw)?raw:raw?.resources;
    if(!Array.isArray(list))throw new Error('文件格式不正确，需要 Research Shelf 的 JSON 备份。');
    const accepted=list.map(normalizeResource).filter(Boolean);
    if(list.length && !accepted.length)throw new Error('未识别到有效收藏记录。');
    if(!confirm(`识别到 ${accepted.length} 条有效资料。是否合并到当前资料库？重复原文链接以导入版本为准。`))return;
    const merged=new Map(resources.map(r=>[r.url,r]));
    accepted.forEach(r=>{const existing=merged.get(r.url);if(existing)r.id=existing.id;merged.set(r.url,r);});
    resources=[...merged.values()];if(Array.isArray(raw?.deletedSeedIds)){try{localStorage.setItem(DELETED_SEED_KEY,JSON.stringify([...new Set([...deletedDefaultIds(),...raw.deletedSeedIds.map(String)])]));}catch{}}persist();resetFilters();notify(`成功导入 ${accepted.length} 条，当前共 ${resources.length} 条`);
  }catch(err){notify(`导入失败：${err.message}`);}finally{el('importFile').value='';}
}

el('primaryNav').addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;currentFilter=btn.dataset.filter;currentCategory='';render();closePanels();});
el('categoryNav').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;currentCategory=btn.dataset.category;currentFilter='all';render();closePanels();});
el('typeFilters').addEventListener('click',e=>{const btn=e.target.closest('[data-type]');if(!btn)return;currentType=btn.dataset.type;render();});
el('sortSelect').addEventListener('change',render);
el('searchInput').addEventListener('input',e=>{currentQuery=e.target.value.trim();render();});
el('cards').addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action,id=btn.dataset.id;if(action==='view')openDetail(id);if(action==='star')toggleStar(id);if(action==='reset')resetFilters();if(action==='add')openForm();});
el('detailBody').addEventListener('change',e=>{if(e.target.id==='detailStatus'&&activeId)changeStatus(activeId,e.target.value);});
el('detailBody').addEventListener('click',e=>{const btn=e.target.closest('[data-detail-action]');if(!btn)return;const id=btn.dataset.id,action=btn.dataset.detailAction;if(action==='edit')openForm(id);if(action==='star'){toggleStar(id);openDetail(id);}if(action==='delete')deleteResource(id);});
el('newResourceTop').addEventListener('click',()=>openForm());el('heroAdd').addEventListener('click',()=>openForm());
el('overlay').addEventListener('click',closePanels);el('closeDetail').addEventListener('click',closePanels);el('closeForm').addEventListener('click',closePanels);el('cancelForm').addEventListener('click',closePanels);
el('resourceForm').addEventListener('submit',saveForm);
el('exportBtn').addEventListener('click',exportResources);el('importBtn').addEventListener('click',()=>el('importFile').click());el('importFile').addEventListener('change',e=>importResources(e.target.files[0]));
el('mobileMenu').addEventListener('click',()=>{const open=!el('sidebar').classList.contains('is-open');el('sidebar').classList.toggle('is-open',open);setOverlay(open);});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!el('overlay').hidden)closePanels();else if(document.activeElement===el('searchInput')){el('searchInput').value='';currentQuery='';render();el('searchInput').blur();}}
  const inInput=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'');
  if((e.key==='/'&&!inInput)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();closePanels();el('searchInput').focus();}
});
render();