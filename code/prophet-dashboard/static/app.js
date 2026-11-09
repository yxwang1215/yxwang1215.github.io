export function filterJobs(jobs, filters = {}) {
  const q = (filters.search || '').trim().toLowerCase();
  return jobs.filter(j => (!filters.project || j.project === filters.project)
    && (!filters.gpu || gpuFamily(j.gpu_type) === filters.gpu)
    && (!filters.user || j.user === filters.user) && (!filters.status || j.status === filters.status)
    && (!filters.priority || j.priority === filters.priority)
    && (!q || [j.name, j.id, j.user, j.display_name, j.gpu_type, j.project, j.priority].join(' ').toLowerCase().includes(q)));
}

export function gpuBlockGroups(job) {
  const nodes = Number.isInteger(job.nodes) ? job.nodes : 0;
  const perNode = Number.isInteger(job.gpus_per_node) ? job.gpus_per_node : 0;
  if (nodes > 0 && perNode > 0) return Array(nodes).fill(perNode);
  return Number.isInteger(job.gpus) && job.gpus > 0 ? [job.gpus] : [];
}

export function priorityRank(value) {
  const match = /^P(\d+)$/i.exec(String(value || ''));
  return match ? Number(match[1]) : 99;
}

// Default card-count order keeps running jobs by GPU count. For one user's
// pending jobs, priority comes first: P2 before P3, then card count.
export function compareTasks(a, b, options = {}) {
  const sort = options.sort || 'gpu';
  if (sort === 'created') return (b.created_at || 0) - (a.created_at || 0);
  if (sort === 'runtime') return (runtimeSeconds(b) ?? b.duration_seconds ?? -1) - (runtimeSeconds(a) ?? a.duration_seconds ?? -1);
  if (sort === 'duration') return (taskDurationSeconds(b) ?? -1) - (taskDurationSeconds(a) ?? -1);
  if (sort === 'user') return String(a.user || '').localeCompare(String(b.user || ''));
  if (sort === 'project') return String(a.project || '').localeCompare(String(b.project || ''));
  if (sort === 'priority') return priorityRank(a.priority) - priorityRank(b.priority) || (b.gpus || 0) - (a.gpus || 0);
  if (options.finished) return (endSeconds(b) || 0) - (endSeconds(a) || 0) || (b.gpus || 0) - (a.gpus || 0);
  const status = (a.status !== 'Running') - (b.status !== 'Running');
  if (status) return status;
  if (options.pendingByPriority && a.status === 'Pending' && b.status === 'Pending') {
    const rank = priorityRank(a.priority) - priorityRank(b.priority);
    if (rank) return rank;
  }
  return (b.gpus || 0) - (a.gpus || 0) || priorityRank(a.priority) - priorityRank(b.priority);
}

export function availablePriorities(jobs, selected = '') {
  const values = new Set(jobs.map(j => j.priority).filter(p => p && p !== '—'));
  if (selected) values.add(selected);
  return [...values].sort((a, b) => priorityRank(a) - priorityRank(b) || String(a).localeCompare(String(b)));
}

export function gpuFamily(value) {
  const type=(value||'').toUpperCase();
  if(type.includes('A100')&&type.includes('A800'))return 'A100/A800 混合';
  for(const family of ['H800','H100','A800','A100','H200','B200','L40','V100']) {
    if(type.includes(family))return family;
  }
  return value||'未知';
}

export function gpuSummary(jobs) {
  const families=[...new Set(jobs.map(j=>gpuFamily(j.gpu_type)))];
  return families.map(family=>({family,...totals(jobs.filter(j=>gpuFamily(j.gpu_type)===family))}))
    .sort((a,b)=>b.running_gpus-a.running_gpus||a.family.localeCompare(b.family));
}

export function availableGpuFamilies(jobs, selected = '') {
  const values=new Set(jobs.map(j=>gpuFamily(j.gpu_type)));
  if(selected)values.add(selected);
  return [...values].sort();
}

export function nodeGpuFamily(node) {
  return gpuFamily((node.gpu_type||'未知').split(',')[0]);
}

export function filterResourceNodes(nodes, filters = {}) {
  return nodes.filter(n=>(!filters.project || (n.projects||[n.project]).includes(filters.project))
    && (!filters.gpu || nodeGpuFamily(n)===filters.gpu
      || (filters.gpu==='A100/A800 混合' && (n.gpu_type||'').includes('AMP-A100-A800'))));
}

export function resourceTotals(nodes) {
  const eligible=nodes.filter(n=>n.schedulable&&n.consistent&&Number.isInteger(n.free_gpus));
  const sum=key=>nodes.every(n=>Number.isInteger(n[key]))?nodes.reduce((s,n)=>s+n[key],0):null;
  const distribution={};
  for(const n of eligible)distribution[n.free_gpus]=(distribution[n.free_gpus]||0)+1;
  return {total_nodes:nodes.length,total_gpus:sum('total_gpus'),allocated_gpus:sum('allocated_gpus'),
    raw_free_gpus:sum('free_gpus'),schedulable_free_gpus:eligible.reduce((s,n)=>s+n.free_gpus,0),
    full_free_8_nodes:eligible.filter(n=>n.total_gpus===8&&n.free_gpus===8).length,
    at_least_8_nodes:eligible.filter(n=>n.free_gpus>=8).length,
    at_least_4_nodes:eligible.filter(n=>n.free_gpus>=4).length,at_least_2_nodes:eligible.filter(n=>n.free_gpus>=2).length,
    at_least_1_nodes:eligible.filter(n=>n.free_gpus>=1).length,free_distribution:distribution,
    unavailable_nodes:nodes.filter(n=>!n.schedulable).length,inconsistent_nodes:nodes.filter(n=>!n.consistent).length,
    unknown_nodes:nodes.filter(n=>!Number.isInteger(n.total_gpus)||!Number.isInteger(n.free_gpus)).length};
}

export function totals(jobs) {
  const s = {running_gpus: 0, pending_gpus: 0, running_jobs: 0, pending_jobs: 0, unknown: 0};
  for (const j of jobs) {
    const k = j.status === 'Running' ? 'running' : j.status === 'Pending' ? 'pending' : null;
    if (k) { s[k + '_jobs']++; if (j.gpus == null) s.unknown++; else s[k + '_gpus'] += j.gpus; }
  }
  return s;
}

function idleNodes(nodes) {
  return nodes.filter(n => n.schedulable && n.consistent && Number.isInteger(n.free_gpus) && n.free_gpus > 0);
}

export function freeGpusByFamily(nodes) {
  const totals = new Map();
  for (const n of idleNodes(nodes)) {
    const family = nodeGpuFamily(n);
    totals.set(family, (totals.get(family) || 0) + n.free_gpus);
  }
  return totals;
}

export function freeGpusByProject(nodes) {
  const totals = new Map();
  for (const n of idleNodes(nodes)) {
    for (const project of n.projects || [n.project]) {
      totals.set(project, (totals.get(project) || 0) + n.free_gpus);
    }
  }
  return totals;
}

export function idleCaption(summary) {
  if (!summary) return '';
  const dist = Object.entries(summary.free_distribution || {})
    .map(([k, v]) => [Number(k), v])
    .filter(([k, v]) => k > 0 && v > 0)
    .sort((a, b) => b[0] - a[0]);
  const bits = dist.length ? dist.map(([k, v]) => `${k}卡×${v}`) : ['没有可调度空闲'];
  if (summary.unavailable_nodes) bits.push(`不可调度 ${summary.unavailable_nodes}台`);
  if (summary.inconsistent_nodes) bits.push(`异常 ${summary.inconsistent_nodes}台`);
  if (!dist.length && summary.raw_free_gpus > 0) bits.push(`未分配 ${summary.raw_free_gpus}卡不可用`);
  return bits.join(' · ');
}

export function idleMachineLine(summary) {
  if (!summary) return '';
  const count = key => Number.isInteger(summary[key]) ? summary[key] : 0;
  return `单机至少空闲 8卡 ${count('at_least_8_nodes')}台 · 4卡 ${count('at_least_4_nodes')}台 · 2卡 ${count('at_least_2_nodes')}台`;
}

export function gpuSizeCounts(jobs, sizes = [8, 4, 2, 1]) {
  const counts = {};
  for (const size of sizes) counts[size] = {total: 0, running: 0, pending: 0};
  const other = {total: 0, running: 0, pending: 0};
  for (const job of jobs) {
    if (job.status !== 'Running' && job.status !== 'Pending') continue;
    const bucket = counts[job.gpus];
    const target = bucket || (Number.isInteger(job.gpus) && job.gpus > 0 ? other : null);
    if (!target) continue;
    target.total++;
    if (job.status === 'Running') target.running++;
    else target.pending++;
  }
  return {counts, other};
}

export function endSeconds(job) {
  let end = job.ended_at;
  if (Number.isInteger(end) && end > 10_000_000_000) end = Math.floor(end / 1000);
  return Number.isInteger(end) && end > 1_000_000_000 ? end : null;
}

export function finishedTags(job) {
  const name = String(job.name || '').toLowerCase();
  const tags = [];
  if (/smoke|canary/.test(name)) tags.push('smoke');
  else if (/profil|preflight|diag/.test(name)) tags.push('probe');
  if (job.status === 'Failed' || job.status === 'Error') tags.push('failed');
  else if (job.status === 'Interrupted') tags.push('interrupted');
  else if (!tags.length && job.status === 'Succeeded' && Number.isInteger(job.duration_seconds) && job.duration_seconds < 120) tags.push('thin');
  return tags;
}

export function keepFinished(job, mode) {
  if (!mode || mode === 'all') return true;
  const tags = finishedTags(job);
  if (mode === 'result') return job.status === 'Succeeded' && !tags.some(tag => tag === 'smoke' || tag === 'probe' || tag === 'thin');
  if (mode === 'smoke') return tags.includes('smoke');
  if (mode === 'failed') return tags.includes('failed') || tags.includes('interrupted');
  if (mode === 'probe') return tags.includes('probe') || tags.includes('thin');
  return true;
}

export function finishedWithin(jobs, hours, nowMs = Date.now()) {
  const windowHours = Number(hours);
  if (!windowHours) return [];
  const cutoff = Math.floor(nowMs / 1000) - windowHours * 3600;
  return jobs.filter(j => {
    const end = endSeconds(j);
    return end != null && end >= cutoff;
  });
}

function createdSeconds(job) {
  let created = job.created_at;
  if (Number.isInteger(created) && created > 10_000_000_000) created = Math.floor(created / 1000);
  return Number.isInteger(created) && created > 1_000_000_000 ? created : null;
}

export function recentTaskNames(jobs, hours, nowMs = Date.now()) {
  const windowHours = Number(hours);
  if (!windowHours) return [];
  const cutoff = Math.floor(nowMs / 1000) - windowHours * 3600;
  const seen = new Set();
  const rows = [];
  for (const job of jobs) {
    const times = [createdSeconds(job), jobStartSeconds(job), endSeconds(job)].filter(t => t != null);
    const latest = times.length ? Math.max(...times) : null;
    if (latest == null || latest < cutoff) continue;
    const key = job.id || job.name;
    if (!key || seen.has(key)) continue;
    const name = String(job.name || job.id || '').trim();
    if (!name) continue;
    seen.add(key);
    rows.push({name, at: latest});
  }
  rows.sort((a, b) => b.at - a.at || a.name.localeCompare(b.name));
  return rows.map(row => row.name);
}

export function jobStartSeconds(job) {
  let start = job.started_at;
  if (Number.isInteger(start) && start > 10_000_000_000) start = Math.floor(start / 1000);
  return Number.isInteger(start) && start > 1_000_000_000 ? start : null;
}

export function runtimeSeconds(job, nowMs = Date.now()) {
  if (job.status !== 'Running') return null;
  const start = jobStartSeconds(job);
  if (start) return Math.max(0, Math.floor(nowMs / 1000) - start);
  return Number.isInteger(job.duration_seconds) ? job.duration_seconds : null;
}

const TERMINAL_STATUS = new Set(['Succeeded', 'Failed', 'Error', 'Interrupted']);

export function taskDurationSeconds(job, nowMs = Date.now()) {
  if (job.status === 'Running') return runtimeSeconds(job, nowMs);
  if (!TERMINAL_STATUS.has(job.status)) return null;
  if (Number.isInteger(job.duration_seconds) && job.duration_seconds >= 0) return job.duration_seconds;
  const started = jobStartSeconds(job);
  const ended = endSeconds(job);
  return started && ended ? Math.max(0, ended - started) : null;
}

export function formatDuration(seconds) {
  if (!Number.isInteger(seconds) || seconds < 0) return '—';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days) return `${days}天${hours}小时`;
  if (hours) return `${hours}小时${minutes}分`;
  if (minutes) return `${minutes}分`;
  return `${seconds}秒`;
}

export function usersOnGpu(jobs, family, project = '') {
  const users = new Map();
  for (const j of jobs) {
    if ((project && j.project !== project) || (family && gpuFamily(j.gpu_type) !== family) || (j.status !== 'Running' && j.status !== 'Pending')) continue;
    const entry = users.get(j.user) || {user: j.user, gpus: 0, running: 0, pending: 0};
    const cards = j.gpus || 0;
    entry.gpus += cards;
    if (j.status === 'Running') entry.running += cards;
    else entry.pending += cards;
    users.set(j.user, entry);
  }
  return [...users.values()].sort((a, b) => b.gpus - a.gpus || a.user.localeCompare(b.user));
}

export function rankedUsers(jobs) {
  const users = new Map();
  for (const j of jobs.filter(j => j.status === 'Running')) {
    const entry = users.get(j.user) || {user: j.user, gpus: 0, jobs: 0};
    entry.gpus += j.gpus || 0; entry.jobs++; users.set(j.user, entry);
  }
  return [...users.values()].sort((a,b) => b.gpus - a.gpus || a.user.localeCompare(b.user));
}

export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function hasData(projects, selectedProject = '') {
  return projects.some(p => p.available && (!selectedProject || p.name === selectedProject));
}

export function exportSnapshot(data, jobs, filters) {
  const projects = data.projects.filter(p=>!filters.project || p.name===filters.project)
    .map(({name,id,label,platform_name,available,stale,updated_at,error})=>({name,id,label,platform_name,available,stale,updated_at,error}));
  const out={checked_at:data.checked_at,scope:data.scope,filters,projects,
    complete:projects.every(p=>p.available&&!p.stale),
    summary:hasData(projects) ? totals(jobs) : null,jobs};
  if(data.inventory) {
    const inventory=data.inventory, nodes=filterResourceNodes(inventory.nodes||[],filters);
      const resourceProjects=(inventory.projects||[]).filter(p=>!filters.project||p.name===filters.project);
    out.inventory={checked_at:inventory.checked_at,projects:resourceProjects,nodes,
      complete:resourceProjects.every(p=>p.available&&!p.stale),
      summary:resourceProjects.length&&resourceProjects.every(p=>p.available)?resourceTotals(nodes):null};
    out.complete=out.complete&&out.inventory.complete;
  }
  return out;
}

if (typeof document !== 'undefined') init();

function init() {
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if(cls) n.className = cls; if(text != null) n.textContent = text; return n; };
  const format = n => n == null ? '—' : n.toLocaleString('zh-CN');
  let data = null, claudeUsage = null, codexUsage = null, cursorUsage = null, visible = [], shown = [], mine = false, connectionError = '', fetching = false, openPartition = '';
  const filters = () => Object.fromEntries(['project','gpu','user','status','priority','search'].map(id=>[id,$(id).value]));
  const projectLabel = name => data?.projects.find(p=>p.name===name)?.label || name;
  const localDate = value => value ? new Date(value).toLocaleString('zh-CN',{hour12:false}) : '尚未成功查询';

  function notice() {
    const warnings = [];
    if(connectionError) warnings.push(connectionError);
    if(data) {
      for(const p of data.projects) {
        if(p.stale) warnings.push(`${p.name}：${p.error}。${p.available ? '保留上次成功数据（' + localDate(p.updated_at) + '）' : '暂无可用数据，统计未包含此项目'}。`);
      }
      if(Date.now() - Date.parse(data.checked_at) > 150000) warnings.push('数据超过 150 秒未更新，请检查查询服务。');
      const count = totals(visible).unknown;
      if(count) warnings.push(`${count} 个任务的 GPU 数量未知，汇总仅包含已知卡数。`);
      const inventory=data.inventory;
      if(inventory) {
        for(const p of inventory.projects||[])if(p.error||!p.available)warnings.push(`资源池 ${projectLabel(p.name)}：${p.error||'暂无可用数据'}。${p.available?'保留 '+localDate(p.updated_at)+' 的缓存':'暂无资源数据'}。`);
      }
    }
    $('notice').hidden = !warnings.length;
    $('notice').textContent = warnings.join(' ');
  }

  function updateSync() {
    if(!data) return;
    const age = Math.max(0,Math.floor((Date.now()-Date.parse(data.checked_at))/1000));
    $('sync-status').textContent = connectionError ? '本机服务连接异常' : `${data.complete ? '已同步' : '部分数据不可用'} · ${age} 秒前`;
    paintRuntimes();
    paintQuotaClocks();
    notice();
  }

  function paintRuntimes() {
    const now = Math.floor(Date.now() / 1000);
    for (const cell of document.querySelectorAll('td.runtime[data-start]')) {
      cell.textContent = formatDuration(Math.max(0, now - Number(cell.dataset.start)));
    }
  }

  function options(id, items) {
    const select = $(id), current = select.value;
    while(select.options.length > 1) select.remove(1);
    for(const [value,label] of items) { const option = el('option','',label); option.value = value; select.append(option); }
    select.value = [...select.options].some(o=>o.value===current) ? current : '';
  }

  function chartRow(name, running, pending, free, maximum, onClick, suffix='', detail='') {
    const row=el('div','chart-row'), heading=el('div','chart-heading');
    const label=el('button','',name); label.onclick=onClick; heading.append(label);
    const parts=[];
    if(running||(!pending&&!free)) parts.push(`${format(running)} 卡`);
    if(pending) parts.push(`待 ${format(pending)} 卡`);
    if(free) parts.push(`空闲 ${format(free)} 卡`);
    heading.append(el('span','chart-values',parts.join(' / ')+suffix));
    const track=el('div','bar-track'), scale=Math.max(1,maximum);
    for(const [cls,value] of [['bar-run',running],['bar-pending',pending],['bar-free',free]]) {
      const bar=el('div',cls);
      bar.style.width=(100*(value||0)/scale)+'%';
      if(value>0) bar.style.minWidth='4px';
      track.append(bar);
    }
    row.append(heading,track);
    if(detail) row.append(el('p','chart-detail',detail));
    return row;
  }

  function beijingParts(iso) {
    const d=new Date(iso);
    if(!iso || Number.isNaN(d.getTime())) return null;
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d);
    const get=type=>parts.find(p=>p.type===type)?.value||'';
    return {short:`${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`, full:`${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`};
  }
  function remainText(iso) {
    const ms=Date.parse(iso)-Date.now();
    if(!Number.isFinite(ms)) return '';
    if(ms<=0) return '已到重置点';
    const minutes=Math.floor(ms/60000);
    const hours=Math.floor(minutes/60);
    const days=Math.floor(hours/24);
    if(days>=1) return `还有 ${days}天${hours%24}小时`;
    if(hours>=1) return `还有 ${hours}小时${minutes%60}分`;
    return `还有 ${Math.max(minutes,1)}分钟`;
  }
  function percentText(value) {
    const n=Number(value);
    if(!Number.isFinite(n)) return '—';
    const shown=Math.abs(n-Math.round(n))<0.05?Math.round(n):Math.round(n*10)/10;
    return shown+'%';
  }
  function tone(value) {
    const n=Number(value);
    if(!Number.isFinite(n)) return 'none';
    if(n>=90) return 'hot';
    if(n>=60) return 'warm';
    return 'ok';
  }
  function subscriptionLabel(iso) {
    const when=beijingParts(iso);
    if(!when) return null;
    const ms=Date.parse(iso)-Date.now();
    if(ms<=0) return {text:'订阅已到期', title:`北京时间 ${when.full} 已到期`, expired:true};
    const minutes=Math.floor(ms/60000), hours=Math.floor(minutes/60), days=Math.floor(hours/24);
    const remain=days>=1?`还有 ${days}天${hours%24}小时`:(hours>=1?`还有 ${hours}小时${minutes%60}分`:`还有 ${Math.max(minutes,1)}分钟`);
    return {text:`订阅到期 ${when.short}`, title:`北京时间 ${when.full} 到期 · ${remain}`, expired:false};
  }
  function paintQuotaClocks() {
    for(const node of document.querySelectorAll('.claude-reset[data-resets]')){
      if(Date.parse(node.dataset.resets)<=Date.now()){renderQuotas();return;}
      const when=beijingParts(node.dataset.resets);
      if(!when) continue;
      node.textContent=when.short+' 北京';
      node.title=`北京时间 ${when.full} 重置 · ${remainText(node.dataset.resets)}`;
    }
    for(const node of document.querySelectorAll('.quota-due[data-until]')){
      const label=node.dataset.kind==='reset-card'
        ? resetCardLabel(node.dataset.until)
        : node.dataset.kind==='reset'
        ? resetExpiryLabel(node.dataset.until, node.dataset.several==='1')
        : subscriptionLabel(node.dataset.until);
      if(!label) continue;
      node.textContent=label.text;
      node.title=label.title;
      node.classList.toggle('hot', label.expired);
    }
    for(const node of document.querySelectorAll('.quota-reset[data-resets]')){
      try { node.title=resetTitle(JSON.parse(node.dataset.resets)); } catch { node.removeAttribute('title'); }
    }
  }
  function beijingStamp(iso) {
    const d=new Date(iso);
    if(!iso || Number.isNaN(d.getTime())) return null;
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(d);
    const get=type=>parts.find(p=>p.type===type)?.value||'';
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
  }
  function resetCardLabel(iso) {
    const stamp=beijingStamp(iso);
    if(!stamp) return null;
    const expired=Date.parse(iso)<=Date.now();
    return {text:expired?`${stamp} 已过期`:`${stamp} 北京`, title:expired?`北京时间 ${stamp} 已过期`:`北京时间 ${stamp} 到期 · ${remainText(iso)}`, expired};
  }
  function resetExpiryLabel(iso, several) {
    const when=beijingParts(iso);
    if(!when) return null;
    const ms=Date.parse(iso)-Date.now();
    if(ms<=0) return {text:several?'最早已过期':'有效期已过', title:`北京时间 ${when.full} 已过期`, expired:true};
    const prefix=several?'最早 ':'有效期至 ';
    return {text:`${prefix}${when.short}`, title:`北京时间 ${when.full} 到期 · ${remainText(iso)}`, expired:false};
  }
  function resetTitle(resets) {
    const count=Math.max(0, Math.round(Number(resets.available)));
    const items=Array.isArray(resets.items)?resets.items:[];
    if(!count) return '当前没有重置卡';
    const lines=[`共 ${count.toLocaleString('zh-CN')} 张重置卡`];
    let shown=0;
    for(const item of items){
      if(!item?.expires_at) continue;
      const when=beijingParts(item.expires_at);
      if(!when) continue;
      shown++;
      const remain=Date.parse(item.expires_at)<=Date.now()?'已过期':remainText(item.expires_at);
      lines.push(`${item.title?item.title+' · ':''}北京时间 ${when.full} 到期 · ${remain}`);
    }
    const missing=count-shown;
    if(missing>0) lines.push(`${missing.toLocaleString('zh-CN')} 张未返回有效期`);
    return lines.join('\n');
  }
  function quotaMeter(label, window) {
    const meter=el('span','claude-meter');
    meter.append(el('span','claude-k',label));
    const track=el('span','claude-bar');
    const fill=el('i','');
    const expired=!!window?.resets_at&&Date.parse(window.resets_at)<=Date.now();
    const percent=expired?0:window&&Number.isFinite(Number(window.percent))?Number(window.percent):null;
    fill.className=tone(percent);
    if(percent!=null){
      fill.style.width=Math.max(0,Math.min(100,percent))+'%';
      if(percent>0) fill.style.minWidth='3px';
    }
    track.append(fill);
    const value=el('b','claude-pct '+tone(percent), percentText(percent));
    meter.append(track, value);
    const reset=el('span','claude-reset', '—');
    if(expired){
      reset.textContent='已重置';
      reset.title=`北京时间 ${beijingParts(window.resets_at)?.full||''} 已重置，等待下次读取`;
    }else if(window?.resets_at){
      reset.dataset.resets=window.resets_at;
      const when=beijingParts(window.resets_at);
      if(when){
        reset.textContent=when.short+' 北京';
        reset.title=`北京时间 ${when.full} 重置 · ${remainText(window.resets_at)}`;
      }
    }
    meter.append(reset);
    meter.setAttribute('aria-label', `${label}已用 ${percentText(percent)}`+(reset.title?`，${reset.title}`:''));
    return meter;
  }
  function creditChip(credits) {
    const chip=el('span','quota-credit', credits.unlimited?'积分不限':'积分 '+(Number.isFinite(Number(credits.balance))?Math.round(Number(credits.balance)).toLocaleString('zh-CN'):'—'));
    const range=credits.local_messages;
    chip.title=credits.unlimited?'积分不限':'剩余积分'+(Array.isArray(range)&&range.length>=2?`，大约还可发送 ${Number(range[0]).toLocaleString('zh-CN')}–${Number(range[1]).toLocaleString('zh-CN')} 条本地消息`:'');
    return chip;
  }
  function resetChip(resets) {
    const count=Number(resets&&resets.available);
    if(!Number.isFinite(count)) return null;
    const shown=Math.max(0, Math.round(count));
    const items=(Array.isArray(resets.items)?resets.items:[]).filter(item=>item&&typeof item==='object');
    const chip=el('span','quota-reset', '');
    chip.dataset.resets=JSON.stringify({available:shown, items:items.map(item=>({title:item.title||'', expires_at:item.expires_at||null}))});
    chip.append(el('b','', `重置 ${shown.toLocaleString('zh-CN')} 张`));
    items.forEach((item, index)=>{
      const card=el('span','quota-reset-card');
      card.append(el('span','quota-reset-index', `卡${index+1}`));
      if(item.expires_at){
        const due=el('span','quota-due');
        due.dataset.until=item.expires_at;
        due.dataset.kind='reset-card';
        const label=resetCardLabel(item.expires_at);
        if(label){
          due.textContent=label.text;
          due.title=label.title;
          if(label.expired) due.classList.add('hot');
        }
        card.append(due);
      }else{
        card.append(el('span','quota-due','有效期未知'));
      }
      if(item.title) card.title=item.title;
      chip.append(card);
    });
    const missing=shown-items.filter(item=>item.expires_at).length;
    if(missing>0) chip.append(el('span','quota-due', `${missing.toLocaleString('zh-CN')} 张未返回有效期`));
    chip.title=resetTitle({available:shown, items});
    chip.setAttribute('aria-label', chip.title.replaceAll('\n', '，'));
    return chip;
  }
  function renderQuotaStrip(box, usage, title, hint) {
    if(!box) return;
    if(!usage){
      box.hidden=false;
      box.replaceChildren(el('span','claude-label',title), el('span','claude-wait','正在读取…'));
      return;
    }
    const accounts=usage.accounts||[];
    if(!accounts.length){box.hidden=true;box.replaceChildren();return;}
    box.hidden=false;
    const label=el('span','claude-label',title);
    label.title=hint;
    box.replaceChildren(label);
    for(const account of accounts){
      const card=el('span','claude-account');
      const who=el('span','claude-who');
      who.append(el('b','',account.name||account.account||account.id));
      const meta=[account.account,account.plan].filter(Boolean).join(' · ');
      if(meta) who.append(el('small','',meta));
      if(account.email) who.title=account.email;
      card.append(who);
      if(account.subscription_until){
        const due=el('span','quota-due');
        due.dataset.until=account.subscription_until;
        const label=subscriptionLabel(account.subscription_until);
        if(label){
          due.textContent=label.text;
          due.title=label.title;
          if(label.expired) due.classList.add('hot');
        }
        card.append(due);
      }
      const windows=Array.isArray(account.windows)?account.windows:null;
      if(windows){
        for(const window of windows) card.append(quotaMeter(window.label||'额度', window));
      }else{
        card.append(quotaMeter('5小时', account.five_hour), quotaMeter('一周', account.week));
      }
      if(account.credits) card.append(creditChip(account.credits));
      const resets=account.resets?resetChip(account.resets):null;
      if(resets) card.append(resets);
      if(account.note) card.append(el('span','quota-note',account.note));
      const hasQuota=windows?windows.length||account.credits||account.resets:account.five_hour||account.week;
      if(account.stale){
        const when=beijingParts(account.as_of);
        const tag=el('span','claude-stale',when?`缓存 ${when.short}`:'缓存');
        tag.title=when?`上次成功读取 北京时间 ${when.full}`:'显示上次成功读取的额度';
        card.append(tag);
      }
      if(account.error){
        const err=el('span','claude-wait',hasQuota?'':'读取失败');
        err.title=account.error;
        if(!hasQuota) card.append(err);
        else card.title=(card.title?card.title+' · ':'')+account.error;
      }
      box.append(card);
    }
  }
  function renderClaude() {
    renderQuotaStrip($('claude-usage'), claudeUsage, 'Claude 额度', '5 小时窗口和一周窗口的已用比例。重置时间是北京时间。');
  }
  function renderCodex() {
    renderQuotaStrip($('codex-usage'), codexUsage, 'Codex 额度', '订阅窗口的已用比例、剩余积分，以及可重置次数和有效期。时间都是北京时间。');
  }
  function renderCursor() {
    renderQuotaStrip($('cursor-usage'), cursorUsage, 'Cursor 额度', '指定模型和 Auto 在本计费周期的已用比例。重置时间是北京时间。');
  }
  function renderQuotas() { renderClaude(); renderCodex(); renderCursor(); }

  function render() {
    if(!data) return;
    renderQuotas();
    visible = filterJobs(data.jobs,filters());
    const hours = Number($('finished').value) || 0;
    const finishedPool = hours ? finishedWithin(data.finished || [], hours) : [];
    const taskPool = hours ? finishedPool : data.jobs;
    const taskFilters = hours ? {...filters(), status: ''} : filters();
    const outcome = $('outcome').value || 'all';
    const tableJobs = (hours ? filterJobs(finishedPool, taskFilters) : visible.slice()).filter(j => !hours || keepFinished(j, outcome));
    const taskUsers=[...new Set(filterJobs(taskPool,{...taskFilters,user:''}).map(j=>j.user))].sort((a,b)=>a.localeCompare(b));
    const taskSelect=$('task-user'), taskWanted=$('user').value;
    while(taskSelect.options.length>1) taskSelect.remove(1);
    for(const name of taskUsers){const option=el('option','',name===data.default_user?name+'（我）':name);option.value=name;taskSelect.append(option);}
    taskSelect.value=taskUsers.includes(taskWanted)?taskWanted:'';
    syncTaskMenus();
    const sort = $('sort').value;
    const oneUser = new Set(tableJobs.map(j => j.user)).size <= 1;
    tableJobs.sort((a,b) => compareTasks(a, b, {sort, finished: Boolean(hours), pendingByPriority: oneUser}));
    shown = tableJobs;
    const available = hasData(data.projects, $('project').value);
    $('task-count').textContent=hours?`过去 ${hours} 小时 · ${tableJobs.length} 项`:`${tableJobs.length} 项`;
    $('col-time').textContent=hours?'完成':'提交';
    $('col-runtime').textContent=hours?'用时':'已运行';
    $('interval').textContent=data.refresh_interval || 60;
    $('footer-time').textContent='最近查询：'+localDate(data.checked_at);
    $('mine').setAttribute('aria-pressed',String(mine));
    renderResources();

    const selected=filters();
    const resourceProjects=(data.inventory?.projects||[]).filter(p=>!selected.project||p.name===selected.project);
    const resourceKnown=resourceProjects.length>0&&resourceProjects.every(p=>p.available);
    const resourceNodes=resourceKnown?filterResourceNodes(data.inventory.nodes||[],{project:selected.project,gpu:selected.gpu}):[];
    const gpuJobs=filterJobs(data.jobs,{...filters(),user:''});
    const pairs=new Map();
    const pairKey=(project,family)=>project+'\0'+family;
    for(const j of gpuJobs){
      const family=gpuFamily(j.gpu_type), key=pairKey(j.project,family);
      if(!pairs.has(key)) pairs.set(key,{project:j.project,family});
    }
    if(resourceKnown) for(const n of resourceNodes){
      const family=nodeGpuFamily(n);
      for(const project of n.projects||[n.project]){
        if(selected.project&&project!==selected.project) continue;
        const key=pairKey(project,family);
        if(!pairs.has(key)) pairs.set(key,{project,family});
      }
    }
    const projectMeta=new Map(data.projects.map(p=>[p.name,p]));
    const pairNodes=(project,family)=>resourceNodes.filter(n=>nodeGpuFamily(n)===family&&(n.projects||[n.project]).includes(project));
    const gpuRows=[...pairs.values()].filter(g=>projectMeta.get(g.project)?.available!==false).map(g=>{
      const usage=totals(visible.filter(j=>j.project===g.project&&gpuFamily(j.gpu_type)===g.family));
      const meta=projectMeta.get(g.project);
      const free=resourceKnown?resourceTotals(pairNodes(g.project,g.family)).schedulable_free_gpus:0;
      return {...g,...usage,free_gpus:free,stale:!!meta?.stale};
    }).sort((a,b)=>(b.running_gpus+b.pending_gpus+b.free_gpus)-(a.running_gpus+a.pending_gpus+a.free_gpus)||projectLabel(a.project).localeCompare(projectLabel(b.project))||a.family.localeCompare(b.family));
    const gpuMax=Math.max(1,...gpuRows.map(g=>g.running_gpus+g.pending_gpus+g.free_gpus));
    const selectUser=user=>{mine=false;$('user').value=$('user').value===user?'':user;render();};
    const people=usersOnGpu(gpuJobs);
    const userBar=$('gpu-users'), peak=Math.max(1,...people.map(u=>u.gpus));
    userBar.replaceChildren(...people.map(u=>{
      const button=el('button','gpu-user'), head=el('span','gpu-user-head');
      head.append(el('span','gpu-user-name',u.user), el('span','gpu-user-count',`${format(u.gpus)} 卡`));
      const track=el('span','gpu-user-track'), fill=el('span','gpu-user-fill');
      fill.style.width=Math.max(14, Math.round(100*u.gpus/peak))+'%';
      track.append(fill);
      button.type='button';
      button.title=`${u.user} · ${format(u.gpus)} 卡`;
      button.setAttribute('aria-pressed',String($('user').value===u.user));
      button.onclick=()=>selectUser(u.user);
      button.append(head, track);
      return button;
    }));
    userBar.hidden=!people.length;
    const togglePartition=key=>{openPartition=openPartition===key?'':key;render();};
    const chartRows=gpuRows.map(g=>{
      const key=pairKey(g.project,g.family), open=openPartition===key;
      const row=chartRow(`${projectLabel(g.project)} · ${g.family}`,g.running_gpus,g.pending_gpus,g.free_gpus,gpuMax,()=>togglePartition(key),g.stale?' · 数据过期':'');
      row.classList.toggle('is-open', open);
      const nameBtn=row.querySelector('button');
      nameBtn.setAttribute('aria-expanded', String(open));
      nameBtn.title=open?'收起这一分区的占卡用户':'查看这一分区的占卡用户';
      row.addEventListener('click', event=>{
        if(event.target.closest('button')||event.target.closest('.partition-users')) return;
        togglePartition(key);
      });
      if(open){
        const holders=usersOnGpu(gpuJobs, g.family, g.project).filter(u=>u.gpus>0)
          .sort((a,b)=>b.running-a.running||b.pending-a.pending||a.user.localeCompare(b.user));
        const box=el('div','partition-users');
        if(!holders.length) box.append(el('p','chart-detail','这一分区没有运行或排队任务'));
        const holdPeak=Math.max(1,...holders.map(u=>u.running||u.pending));
        for(const u of holders){
          const button=el('button','gpu-user'), head=el('span','gpu-user-head');
          const count=u.running?`${format(u.running)} 卡`:`待 ${format(u.pending)} 卡`;
          const extra=u.running&&u.pending?` · 待 ${format(u.pending)}`:'';
          head.append(el('span','gpu-user-name',u.user), el('span','gpu-user-count',count+extra));
          const track=el('span','gpu-user-track'), fill=el('span','gpu-user-fill');
          fill.style.width=Math.max(14, Math.round(100*(u.running||u.pending)/holdPeak))+'%';
          track.append(fill);
          button.type='button';
          button.title=`${u.user} · 运行 ${format(u.running)} 卡 · 排队 ${format(u.pending)} 卡`;
          button.setAttribute('aria-pressed', String($('user').value===u.user));
          button.onclick=()=>selectUser(u.user);
          button.append(head, track);
          box.append(button);
        }
        row.append(box);
      }
      return row;
    });
    for(const p of data.projects){
      if((selected.project&&p.name!==selected.project)||p.available) continue;
      chartRows.push(el('p','unknown',(p.label||p.name)+' · 查询失败，暂无数据'));
    }
    $('gpu-chart').replaceChildren(...(chartRows.length?chartRows:[el('p','empty','当前筛选下没有 GPU 任务或空闲卡')]));

    const ranked = rankedUsers(visible), users = ranked.slice(0, 9), userMax = Math.max(1,...users.map(u=>u.gpus));
    const rankRows = users.map(u=>chartRow(u.user,u.gpus,0,0,userMax,()=>{mine=false;$('user').value=u.user;render();},` · ${u.jobs} 项`));
    if(ranked.length>users.length) rankRows.push(el('p','chart-detail',`还有 ${ranked.length-users.length} 人`));
    $('user-rank-count').textContent=ranked.length?`${ranked.length} 人`:'—';
    $('user-chart').replaceChildren(...(rankRows.length ? rankRows : [el('p','empty','当前筛选下没有运行任务')]));

    const fragment=document.createDocumentFragment();
    for(const j of tableJobs) {
      const tr=el('tr'), name=el('td'), label=j.name||j.id, link=el('button','task-name',label);
      link.type='button'; link.title='点击复制任务名';
      link.onclick=async ()=>{
        const ok=await copyText(label);
        showCopyToast(ok?'已复制':'复制失败');
      };
      name.append(link); if(j.stale) name.append(el('span','stale-label','上次成功数据'));
      tr.append(name,el('td','project-tag',projectLabel(j.project)));
      const user=el('td','user-link'+(filters().user===j.user?' active':''),j.user);
      user.title=(j.display_name&&j.display_name!==j.user?j.display_name+' · ':'')+'点击只看该用户';
      user.onclick=()=>{mine=false;$('user').value=$('user').value===j.user?'':j.user;render();};
      tr.append(user);
      const status=el('td');
      const statusClass=j.status==='Pending'?' pending':j.status==='Succeeded'?' done':j.status==='Failed'||j.status==='Error'?' failed':j.status==='Interrupted'?' interrupted':'';
      const statusText=j.status==='Running'?'运行':j.status==='Pending'?'排队':j.status==='Succeeded'?'完成':j.status==='Failed'||j.status==='Error'?'失败':j.status==='Interrupted'?'中断':j.status;
      status.append(el('span','status-tag'+statusClass,statusText));
      if(hours){
        const labels={smoke:'smoke',probe:'探测',thin:'过短'};
        for(const tag of finishedTags(j)) if(labels[tag]) status.append(el('span','kind-tag '+tag,labels[tag]));
      }
      tr.append(status);
      const rank=priorityRank(j.priority), priority=el('td','priority');
      priority.append(el('span','priority-tag '+(rank===99?'unknown':'p'+rank), j.priority||'—'));
      priority.title='调度优先级 '+(j.priority&&j.priority!=='—'?j.priority:'未知');
      tr.append(priority);
      const gpuCell=el('td','gpu-cell'), gpuCount=el('div','gpu-count');
      gpuCount.append(el('span','gpu-number',j.gpus==null?'—':String(j.gpus)));
      const groups=gpuBlockGroups(j);
      if(groups.length){
        const blocks=el('span','gpu-blocks'), tone=rank===99?'unknown':'p'+rank, pending=j.status==='Pending'?' pending':'';
        for(const count of groups){
          const group=el('span','gpu-group');
          for(let i=0;i<count;i++) group.append(el('i','gpu-block '+tone+pending));
          blocks.append(group);
        }
        gpuCount.append(blocks);
      }
      gpuCell.title=j.gpus==null?'卡数未知':`${j.gpus} 卡 · ${format(j.nodes)} 节点 × ${format(j.gpus_per_node)} 卡`;
      gpuCell.append(gpuCount);
      tr.append(gpuCell);
      const started=jobStartSeconds(j), ended=endSeconds(j);
      const terminal=TERMINAL_STATUS.has(j.status);
      const duration=taskDurationSeconds(j);
      const runtime=el('td','runtime',duration==null?'—':formatDuration(duration));
      if(j.status==='Running'&&started) runtime.dataset.start=String(started);
      if(j.status==='Running'&&started) runtime.title='开始于 '+localDate(started*1000);
      else if(terminal&&duration!=null) runtime.title='用时 '+formatDuration(duration);
      tr.append(runtime);
      const moment=hours&&ended?new Date(ended*1000):(j.created_at?new Date(j.created_at*1000):null);
      const stamp=moment?`${String(moment.getMonth()+1).padStart(2,'0')}-${String(moment.getDate()).padStart(2,'0')} ${String(moment.getHours()).padStart(2,'0')}:${String(moment.getMinutes()).padStart(2,'0')}`:'—';
      const resource=el('td','resource',`${format(j.nodes)}×${format(j.gpus_per_node)} ${gpuFamily(j.gpu_type)}`);
      resource.title=`${j.gpu_type} · ${format(j.nodes)} 节点 × ${format(j.gpus_per_node)} 卡 · 优先级 ${j.priority}`;
      tr.append(resource,el('td','submitted',stamp));
      if(moment) tr.lastChild.title=(hours?'完成于 ':'提交于 ')+localDate(moment);
      fragment.append(tr);
    }
    if(!tableJobs.length){const tr=el('tr'),td=el('td','empty',!available?'查询失败，暂无任务数据':hours&&outcome==='all'?`过去 ${hours} 小时没有结束的任务`:'没有符合筛选条件的任务');td.colSpan=9;tr.append(td);fragment.append(tr);}
    $('tasks').replaceChildren(fragment);
    updateSync();
  }

  function renderResources() {
    const inventory=data.inventory, selected=filters();
    const projects=(inventory?.projects||[]).filter(p=>!selected.project||p.name===selected.project);
    const known=projects.length>0&&projects.every(p=>p.available), nodes=filterResourceNodes(inventory?.nodes||[],selected);
    const s=resourceTotals(nodes), stale=projects.some(p=>p.stale);
    const messages=[];
    if(!known)messages.push('资源节点数据暂不可用，无法计算空闲卡。');
    if(stale)messages.push('部分资源数据为上次成功缓存，当前空闲数量尚未完整更新。');
    if(s.inconsistent_nodes)messages.push(`${s.inconsistent_nodes} 台节点上报的容量与分配数据不一致，未计入可调度空闲。`);
    if(s.unknown_nodes)messages.push(`${s.unknown_nodes} 台节点卡数未知。`);
    $('resource-notice').textContent=messages.join(' ');$('resource-notice').hidden=!messages.length;
    const idle=$('idle-machines');
    idle.hidden=false;
    idle.classList.toggle('mine-only', !known);
    idle.replaceChildren();
    if(known){
      idle.title='可调度且容量一致的节点。空闲达到 8 卡的机器同时计入 4 卡和 2 卡。中间是我正在运行的任务，右边是运行加排队的合计，都按总卡数计数。';
      const free=el('span','idle-group');
      free.append(el('span','idle-label','空闲机器'));
      for(const [label,key] of [['≥8卡','at_least_8_nodes'],['≥4卡','at_least_4_nodes'],['≥2卡','at_least_2_nodes']]){
        const chip=el('span','idle-chip');
        chip.append(el('span','idle-k',label), el('b','',String(Number.isInteger(s[key])?s[key]:0)), el('span','idle-u','台'));
        free.append(chip);
      }
      idle.append(free, el('span','mine-split'));
    } else {
      idle.title='资源节点暂不可用。中间是我正在运行的任务，右边是运行加排队的合计。';
    }
    const sized=gpuSizeCounts((data.jobs||[]).filter(j=>j.user===data.default_user));
    appendSizeGroup(idle, sized, {group:'run-sizes', labelClass:'run-label', chip:'run-chip', label:'在跑', field:'running', unit:'台',
      labelTitle:'当前账号正在运行的任务，按总卡数计数。',
      chipTitle:bucket=>bucket.running?`正在运行 ${bucket.running} 台`:'没有正在运行的这个卡数任务',
      otherTitle:'正在运行、总卡数不是 8、4、2、1 的任务'});
    idle.append(el('span','mine-split'));
    appendSizeGroup(idle, sized, {group:'mine-sizes', labelClass:'mine-label', chip:'mine-chip', label:'我的任务', field:'total', unit:'个',
      labelTitle:'当前账号的运行和排队任务合计，按总卡数（节点数 × 每节点 GPU）计数。',
      chipTitle:bucket=>{
        const parts=[];
        if(bucket.running) parts.push('运行 '+bucket.running);
        if(bucket.pending) parts.push('排队 '+bucket.pending);
        return parts.length?parts.join(' · '):'没有这个卡数的任务';
      },
      otherTitle:'总卡数不是 8、4、2、1 的任务，含排队'});
  }

  function appendSizeGroup(idle, sized, spec) {
    const group=el('span','mine-sizes '+spec.group);
    const label=el('span','idle-label '+spec.labelClass, spec.label);
    label.title=spec.labelTitle;
    group.append(label);
    for(const size of [8,4,2,1]){
      const bucket=sized.counts[size];
      const chip=el('span','idle-chip '+spec.chip);
      chip.append(el('span','idle-k',size+'卡'), el('b','',String(bucket[spec.field])), el('span','idle-u',spec.unit));
      chip.title=spec.chipTitle(bucket);
      group.append(chip);
    }
    const extraCount=sized.other[spec.field];
    if(extraCount){
      const extra=el('span','idle-u','其他 '+extraCount);
      extra.title=spec.otherTitle;
      group.append(extra);
    }
    idle.append(group);
  }

  async function load() {
    if(fetching) return;
    fetching=true;
    try {
      const response=await fetch('/api/snapshot',{signal:AbortSignal.timeout(12000)});
      const next=await response.json();
      if(!response.ok) throw new Error(next.error||`HTTP ${response.status}`);
      if(next.claude_usage) claudeUsage=next.claude_usage;
      if(next.codex_usage) codexUsage=next.codex_usage;
      if(next.cursor_usage) cursorUsage=next.cursor_usage;
      const changed=!data || next.checked_at!==data.checked_at || (next.claude_usage?.checked_at||'')!==(data?.claude_usage?.checked_at||'') || (next.codex_usage?.checked_at||'')!==(data?.codex_usage?.checked_at||'') || (next.cursor_usage?.checked_at||'')!==(data?.cursor_usage?.checked_at||'');
      connectionError=''; data=next;
      if(changed) {
        options('project',data.projects.map(p=>[p.name,p.label||p.name]));
        const resourceFamilies=(data.inventory?.nodes||[]).map(n=>({gpu_type:nodeGpuFamily(n)}));
        options('gpu',availableGpuFamilies([...data.jobs,...resourceFamilies],$('gpu').value).map(g=>[g,g]));
        options('priority',availablePriorities(data.jobs,$('priority').value).map(p=>[p,p]));
        const users=[...new Set([...(data.jobs||[]),...(data.finished||[])].map(j=>j.user))];
        if(!users.includes(data.default_user)) users.push(data.default_user);
        options('user',users.sort().map(u=>[u,u===data.default_user?u+'（我）':u]));
        render();
      } else updateSync();
    } catch(error) {
      connectionError=error.message==='Failed to fetch' ? '无法连接本机查询服务。保留页面上次读取的数据。' : error.message;
      $('sync-status').textContent=data?'连接异常 · 保留上次数据':'等待查询服务';notice();
    } finally {fetching=false; loadQuotas();}
  }

  async function loadClaude() {
    try {
      const response=await fetch('/api/claude-usage',{signal:AbortSignal.timeout(8000)});
      const usage=await response.json();
      if(!response.ok) return;
      const prev=claudeUsage?.checked_at||'';
      claudeUsage=usage.pending?null:usage;
      if((usage.checked_at||'')!==prev || usage.pending) renderClaude();
      else paintQuotaClocks();
    } catch {}
  }

  async function loadCodex() {
    try {
      const response=await fetch('/api/codex-usage',{signal:AbortSignal.timeout(8000)});
      const usage=await response.json();
      if(!response.ok) return;
      const prev=codexUsage?.checked_at||'';
      codexUsage=usage.pending?null:usage;
      if((usage.checked_at||'')!==prev || usage.pending) renderCodex();
      else paintQuotaClocks();
    } catch {}
  }

  async function loadCursor() {
    try {
      const response=await fetch('/api/cursor-usage',{signal:AbortSignal.timeout(8000)});
      const usage=await response.json();
      if(!response.ok) return;
      const prev=cursorUsage?.checked_at||'';
      cursorUsage=usage.pending?null:usage;
      if((usage.checked_at||'')!==prev || usage.pending) renderCursor();
      else paintQuotaClocks();
    } catch {}
  }

  async function loadQuotas() {
    await Promise.all([loadClaude(), loadCodex(), loadCursor()]);
  }

  for(const id of ['project','gpu','user','status','priority','finished','outcome','sort']) $(id).addEventListener('change',()=>{if(id==='user')mine=false;if(id==='outcome'&&$('outcome').value!=='all'&&!$('finished').value)$('finished').value='48';render();});
  $('task-user').addEventListener('change',()=>{mine=false;$('user').value=$('task-user').value;render();});
  $('search').addEventListener('input',render);
  $('mine').onclick=()=>{if(!data)return;mine=!mine;$('user').value=mine?data.default_user:'';render();};
  $('reset').onclick=()=>{for(const id of ['project','gpu','user','status','priority','finished','search'])$(id).value='';$('outcome').value='all';mine=false;render();};
  $('refresh').onclick=async()=> {
    $('refresh').disabled=true;$('refresh').textContent='正在刷新…';
    try {const r=await fetch('/api/refresh',{method:'POST',signal:AbortSignal.timeout(5000)});if(!r.ok&&r.status!==429)throw new Error('刷新请求失败');}
    catch(e){connectionError=e.message;notice();}
    setTimeout(()=>{$('refresh').disabled=false;$('refresh').textContent='↻ 刷新数据';load();},10000);
  };
  let copyToastTimer=0;
  function showCopyToast(text) {
    const toast=$('copy-toast');
    toast.textContent=text;
    toast.hidden=false;
    clearTimeout(copyToastTimer);
    copyToastTimer=setTimeout(()=>{toast.hidden=true;},1600);
  }
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch {}
    }
    const area=document.createElement('textarea');
    area.value=text; area.setAttribute('readonly',''); area.style.position='fixed'; area.style.opacity='0';
    document.body.append(area); area.select();
    let ok=false; try { ok=document.execCommand('copy'); } catch { ok=false; }
    area.remove(); return ok;
  }
  function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  for (const id of ['copy-3h', 'copy-6h', 'copy-12h', 'copy-24h']) {
    $(id).onclick = async () => {
      if (!data) return;
      const hours = Number($(id).dataset.hours);
      const selected = filters();
      if ($(id).dataset.requireUser) {
        selected.user = $('task-user').value || $('user').value;
        if (!selected.user) { showCopyToast('请先选择用户'); return; }
      }
      const names = recentTaskNames(filterJobs([...(data.jobs || []), ...(data.finished || [])], selected), hours);
      if (!names.length) { showCopyToast(selected.user && $(id).dataset.requireUser ? `近 ${hours} 小时没有该用户的任务` : `近 ${hours} 小时没有任务`); return; }
      const ok = await copyText(names.join('\n'));
      showCopyToast(ok ? `已复制 ${names.length} 个任务名` : '复制失败');
    };
  }
  $('json').onclick=()=>{if(data)download('prophet-tasks.json',JSON.stringify(exportSnapshot(data,shown,filters()),null,2),'application/json');};
  $('csv').onclick=()=>{
    if(!data)return;
    const keys=['id','name','project','user','status','gpus','nodes','gpus_per_node','gpu_type','priority','started_at','ended_at','duration_seconds','runtime_seconds','stale'];
    const cell=(j,k)=>k==='runtime_seconds'?taskDurationSeconds(j)??'':j[k];
    download('prophet-tasks.csv','\ufeff'+[keys,...shown.map(j=>keys.map(k=>cell(j,k)))].map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
  };
  function closeTaskMenus() {
    for (const menu of document.querySelectorAll('.task-panel .task-menu')) {
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
    }
  }
  function syncTaskMenus() {
    for (const select of document.querySelectorAll('.task-panel .sort-label select')) {
      let btn = select.nextElementSibling;
      if (!btn || !btn.classList.contains('task-menu-btn')) {
        btn = el('button', 'task-menu-btn');
        btn.type = 'button';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        const menu = el('div', 'task-menu');
        menu.hidden = true;
        menu.setAttribute('role', 'listbox');
        select.after(btn, menu);
        btn.onclick = event => {
          event.stopPropagation();
          const willOpen = menu.hidden;
          closeTaskMenus();
          menu.hidden = !willOpen;
          btn.setAttribute('aria-expanded', String(willOpen));
        };
      }
      const menu = btn.nextElementSibling;
      const current = select.value;
      btn.textContent = select.selectedOptions[0]?.textContent || '';
      menu.replaceChildren(...[...select.options].map(opt => {
        const item = el('button', 'task-menu-item' + (opt.value === current ? ' is-selected' : ''), opt.textContent);
        item.type = 'button';
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(opt.value === current));
        item.onclick = event => {
          event.stopPropagation();
          select.value = opt.value;
          closeTaskMenus();
          select.dispatchEvent(new Event('change', { bubbles: true }));
        };
        return item;
      }));
    }
  }
  document.addEventListener('click', closeTaskMenus);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeTaskMenus(); });
  syncTaskMenus();
  load();setInterval(load,5000);setInterval(updateSync,1000);
}
