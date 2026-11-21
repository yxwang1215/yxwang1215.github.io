export const cpuqJobIdle = job => job.status === 'running' && !job.idle_exempt
  && typeof job.cpu_pct === 'number' && job.cpu_pct < 5;

export function cpuqSpanSeconds(job, now = Date.now() / 1000) {
  if(job.status === 'running' && job.start_ts) return now - job.start_ts;
  if(job.end_ts && job.start_ts) return job.end_ts - job.start_ts;
  return job.submit_ts ? now - job.submit_ts : 0;
}

export function filterCpuqJobs(jobs = [], options = {}) {
  const { owner = '', status = '', search = '', mine = false, me = '', sort = 'default', now } = options;
  const term = String(search).trim().toLowerCase();
  let rows = jobs.filter(job => {
    if(mine && job.owner !== me) return false;
    if(owner && job.owner !== owner) return false;
    if(status === 'running' && job.status !== 'running') return false;
    if(status === 'queued' && !['queued','pending'].includes(job.status)) return false;
    if(status === 'idle' && !cpuqJobIdle(job)) return false;
    if(term && ![job.id, job.name, job.machine, job.owner].some(v => String(v || '').toLowerCase().includes(term))) return false;
    return true;
  });
  if(sort === 'duration') rows = rows.slice().sort((a,b) => cpuqSpanSeconds(b, now) - cpuqSpanSeconds(a, now));
  else if(sort === 'cpus') rows = rows.slice().sort((a,b) => (parseInt(b.cpus)||0) - (parseInt(a.cpus)||0));
  else if(sort === 'owner') rows = rows.slice().sort((a,b) => String(a.owner).localeCompare(String(b.owner)) || String(a.id).localeCompare(String(b.id)));
  return rows;
}

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

const STATUS_TEXT = {Running:'运行', Pending:'排队', Succeeded:'完成', Failed:'失败', Error:'失败', Interrupted:'中断'};
const FINISHED_KIND = {smoke:'smoke', probe:'探测', thin:'过短'};
const OUTCOME_TEXT = {result:'有效结果', smoke:'smoke test', failed:'失败 / 中断', probe:'探测与过短'};

export function htmlEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function epochSeconds(value) {
  if (Number.isInteger(value) && value > 10_000_000_000) value = Math.floor(value / 1000);
  return Number.isInteger(value) && value > 1_000_000_000 ? value : null;
}

function clockStamp(seconds) {
  if (!Number.isInteger(seconds)) return '—';
  const moment = new Date(seconds * 1000);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(moment.getMonth() + 1)}-${pad(moment.getDate())} ${pad(moment.getHours())}:${pad(moment.getMinutes())}`;
}

export function exportTasksHtml(jobs, options = {}) {
  const hours = Number(options.hours) || 0;
  const filters = options.filters || {};
  const projects = options.projects || [];
  const projectLabel = name => projects.find(p => p.name === name)?.label || name || '—';
  const nowMs = options.nowMs ?? Date.now();
  const countText = n => n == null ? '—' : n.toLocaleString('zh-CN');
  const bits = [];
  if (filters.project) bits.push(`项目 ${projectLabel(filters.project)}`);
  if (filters.gpu) bits.push(`型号 ${filters.gpu}`);
  if (filters.user) bits.push(`用户 ${filters.user}`);
  if (filters.status === 'Running') bits.push('只看运行');
  else if (filters.status === 'Pending') bits.push('只看排队');
  if (filters.priority) bits.push(`优先级 ${filters.priority}`);
  if (hours) bits.push(`过去 ${hours} 小时`);
  if (options.outcome && options.outcome !== 'all') bits.push(OUTCOME_TEXT[options.outcome] || options.outcome);
  if ((filters.search || '').trim()) bits.push(`搜索 ${filters.search.trim()}`);
  const checked = options.checkedAt ? new Date(options.checkedAt).toLocaleString('zh-CN', {hour12:false}) : '';
  const summary = totals(jobs);
  const cards = hours ? '' : ` · 运行 ${summary.running_gpus} 卡 / ${summary.running_jobs} 项 · 排队 ${summary.pending_gpus} 卡 / ${summary.pending_jobs} 项`;
  const heading = `${hours ? `过去 ${hours} 小时 · ` : ''}${jobs.length} 项${cards}${checked ? ` · 最近查询 ${checked}` : ''}`;
  const rows = jobs.map(job => {
    const name = job.name || job.id || '—';
    const stale = job.stale ? '<span class="stale">上次成功数据</span>' : '';
    const status = STATUS_TEXT[job.status] || job.status || '—';
    const statusClass = job.status === 'Pending' ? 'pending' : job.status === 'Succeeded' ? 'done' : job.status === 'Failed' || job.status === 'Error' ? 'failed' : job.status === 'Interrupted' ? 'interrupted' : 'running';
    const tags = hours ? finishedTags(job).filter(tag => FINISHED_KIND[tag]).map(tag => `<span class="kind ${tag}">${htmlEscape(FINISHED_KIND[tag])}</span>`).join('') : '';
    const rank = priorityRank(job.priority);
    const duration = taskDurationSeconds(job, nowMs);
    const when = hours ? endSeconds(job) : epochSeconds(job.created_at);
    const resource = `${countText(job.nodes)}×${countText(job.gpus_per_node)} ${gpuFamily(job.gpu_type)}`;
    const title = job.id && job.id !== name ? ` title="${htmlEscape(job.id)}"` : '';
    return `<tr><td class="name"${title}>${htmlEscape(name)}${stale}</td><td>${htmlEscape(projectLabel(job.project))}</td><td>${htmlEscape(job.user || '—')}</td><td><span class="status ${statusClass}">${htmlEscape(status)}</span>${tags}</td><td><span class="priority ${rank === 99 ? 'unknown' : 'p' + rank}">${htmlEscape(job.priority || '—')}</span></td><td class="num">${htmlEscape(job.gpus == null ? '—' : String(job.gpus))}</td><td>${htmlEscape(duration == null ? '—' : formatDuration(duration))}</td><td>${htmlEscape(resource)}</td><td>${htmlEscape(clockStamp(when))}</td></tr>`;
  }).join('');
  const body = rows || '<tr><td class="empty" colspan="9">没有符合筛选条件的任务</td></tr>';
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prophet 任务明细</title>
<style>
body{margin:0;color:#182436;background:#f5f7fa;font:13px/1.45 Inter,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif}
main{max-width:1280px;margin:0 auto;padding:28px 24px 40px}
h1{margin:0 0 6px;font-size:22px;letter-spacing:-.4px}
p{margin:0;color:#748197}
.filters{margin-top:4px}
table{width:100%;margin-top:18px;border-collapse:collapse;background:#fff;border:1px solid #e4e9f0}
th,td{padding:10px 12px;border-bottom:1px solid #eef1f5;text-align:left;white-space:nowrap}
th{background:#fafbfd;color:#8b97a9;font-weight:550}
.name{font-weight:620;color:#243044}
.num{font-variant-numeric:tabular-nums;font-weight:700}
.stale{margin-left:8px;color:#bf8b25;font-size:11px;font-weight:500}
.status,.priority,.kind{display:inline-block;padding:2px 7px;border-radius:4px;font-size:12px;font-weight:650}
.status.running{background:#eaf7f1;color:#268e6d}.status.pending{background:#fff3dd;color:#b2862d}.status.done{background:#eef2ff;color:#3b63eb}.status.failed{background:#fde8e6;color:#c2412d}.status.interrupted{background:#fff1e0;color:#c26a12}
.kind{margin-left:4px}.kind.smoke{background:#fff6df;color:#a16207}.kind.probe{background:#f3f0ff;color:#6d5cae}.kind.thin{background:#f0f3f8;color:#7c8aa1}
.priority.p0{background:#fde8e6;color:#c2412d}.priority.p1{background:#fff1e0;color:#c26a12}.priority.p2{background:#fff6df;color:#a16207}.priority.p3{background:#eef2ff;color:#3b63eb}.priority.unknown{background:#f0f3f8;color:#7c8aa1}
.empty{padding:28px;text-align:center;color:#9aa6b8}
</style>
</head>
<body>
<main>
<h1>Prophet 任务明细</h1>
<p>${htmlEscape(heading)}</p>
<p class="filters">${htmlEscape(bits.join(' · ') || '当前筛选下的全部任务')}</p>
<table>
<thead><tr><th>任务</th><th>项目</th><th>用户</th><th>状态</th><th>优先级</th><th>卡数</th><th>${hours ? '用时' : '已运行'}</th><th>资源</th><th>${hours ? '完成' : '提交'}</th></tr></thead>
<tbody>${body}</tbody>
</table>
</main>
</body>
</html>
`;
}

if (typeof document !== 'undefined') init();

function init() {
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if(cls) n.className = cls; if(text != null) n.textContent = text; return n; };
  const format = n => n == null ? '—' : n.toLocaleString('zh-CN');
  let cpuqMine = false; const cpuqOpen = new Set();
  let data = null, cpuq = null, claudeUsage = null, codexUsage = null, cursorUsage = null, visible = [], shown = [], mine = false, connectionError = '', fetching = false, openPartition = '', currentPage = 'gpu';
  const filters = () => Object.fromEntries(['project','gpu','user','status','priority','search'].map(id=>[id,$(id).value]));
  const projectLabel = name => data?.projects.find(p=>p.name===name)?.label || name;
  const localDate = value => value ? new Date(value).toLocaleString('zh-CN',{hour12:false}) : '尚未成功查询';

  function renderCpuq() {
    if(!$('cpuq-memory')) return;
    const memory = cpuq?.memory || {};
    const cards = [['内存占用', memory.percent == null ? '—' : memory.percent + '%', '当前机器'],
      ['已用内存', memory.used_mb == null ? '—' : format(memory.used_mb) + ' MB', ''],
      ['可用内存', memory.available_mb == null ? '—' : format(memory.available_mb) + ' MB', ''],
      ['总内存', memory.total_mb == null ? '—' : format(memory.total_mb) + ' MB', '']];
    $('cpuq-memory').replaceChildren(...cards.map(([label,value,note]) => { const c=el('div','stat'+(label==='内存占用'?' accent':'')); c.append(el('span','',label),el('strong','',value),el('small','',note)); return c; }));
    const summary=cpuq?.summary||{};
    const host=cpuq?.host||{}; const psi=host.pressure||{}; const swap=host.swap||{};
    const summaryEl = $('cpuq-summary');
    if(summaryEl){
      summaryEl.classList.add('cpuq-summary-highlight');
      summaryEl.textContent=`全机队作业 ${summary.total ?? 0} 个 · 运行 ${summary.running ?? 0} 个 · 排队 ${summary.queued ?? 0} 个 · 提交人 ${(summary.owners||[]).length} 人 · 节点 ${summary.nodes_free ?? '—'}/${summary.nodes_total ?? '—'} 空闲　|　CPU 负载 ${host.load1 ?? '—'} / ${host.cpu_count ?? '—'} 核（${host.load_ratio ?? '—'}%） · 根盘 ${host.disk_percent ?? '—'}% · Swap ${swap.percent ?? '—'}% · 压力 CPU/内存/IO ${psi.cpu ?? '—'}%/${psi.memory ?? '—'}%/${psi.io ?? '—'}%`;
    }
    if($('cpuq-count')) $('cpuq-count').textContent=`${summary.total ?? 0} 项`;
    if($('cpuq-updated')) $('cpuq-updated').textContent=cpuq?.checked_at ? `更新于 ${localDate(cpuq.checked_at)}${cpuq.stale?' · 使用缓存':''}` : '等待 CPUQ 查询…';
    const notice=$('cpuq-notice'); const messages=[];
    if(cpuq?.error) messages.push(cpuq.error);
    if(cpuq?.stale && cpuq?.checked_at) messages.push('CPUQ 查询暂时失败，当前显示最近一次成功数据。');
    messages.push(...(cpuq?.notices||[]));
    if(notice){ notice.hidden=!messages.length; notice.textContent=messages.join(' '); }
    renderCpuqOwners(summary);
    renderCpuqTable();
  }

  function cpuqFiltered() {
    return filterCpuqJobs(cpuq?.jobs || [], {
      owner: $('cpuq-owner')?.value || '', status: $('cpuq-status')?.value || '',
      search: $('cpuq-search')?.value || '', mine: cpuqMine, me: cpuq?.me || '',
      sort: $('cpuq-sort')?.value || 'default' });
  }

  const cpuqIdle = cpuqJobIdle;

  function renderCpuqOwners(summary) {
    const host = $('cpuq-owners');
    if(!host) return;
    const owners = summary.owners || [];
    host.replaceChildren();
    if(!owners.length) { host.hidden = true; return; }
    host.hidden = false;
    for(const o of owners) {
      const chip = el('button', 'cpuq-owner-chip' + ($('cpuq-owner').value === o.owner ? ' active' : ''));
      chip.type = 'button';
      chip.append(el('strong', '', o.owner), el('span', '', `运行 ${o.running} · 排队 ${o.queued}`));
      chip.onclick = () => { cpuqMine = false; $('cpuq-owner').value = $('cpuq-owner').value === o.owner ? '' : o.owner; renderCpuq(); };
      host.append(chip);
    }
  }

  function syncCpuqOwnerOptions() {
    const select = $('cpuq-owner');
    if(!select) return;
    const owners = [...new Set((cpuq?.jobs || []).map(j => j.owner).filter(Boolean))].sort();
    const current = select.value;
    if(select.dataset.owners === owners.join('|')) return;
    select.dataset.owners = owners.join('|');
    select.replaceChildren(el('option', '', '全部提交人'), ...owners.map(o => { const n = el('option', '', o); n.value = o; return n; }));
    select.firstChild.value = '';
    select.value = owners.includes(current) ? current : '';
  }

  function cpuqDetailRow(job, columns) {
    const tr = el('tr', 'cpuq-detail-row');
    const td = el('td'); td.colSpan = columns;
    const d = job.detail || {};
    const facts = [['名字', job.name], ['镜像', d.image], ['工作目录', d.workdir], ['输出目录', d.output_dir],
      ['时限', d.time_limit], ['内存', d.mem_gb ? d.mem_gb + ' GB' : '整机减 8G'],
      ['提交', job.submit_ts ? localDate(new Date(job.submit_ts*1000).toISOString()) : '—'],
      ['开始', job.start_ts ? localDate(new Date(job.start_ts*1000).toISOString()) : '—'],
      ['结束', job.end_ts ? localDate(new Date(job.end_ts*1000).toISOString()) : '—'],
      ['退出码', d.exit_code == null ? '—' : String(d.exit_code)],
      ['选项', [d.docker_host && 'docker-host', d.independent && 'independent', d.agent_runtime && 'agent'].filter(Boolean).join(' · ') || '—'],
      ['空转', job.idle_exempt ? '已豁免回收' : (job.idle_s ? Math.round(job.idle_s/60) + ' 分钟' : '—')]];
    const grid = el('div', 'cpuq-detail-grid');
    for(const [label, value] of facts) {
      if(value == null || value === '') continue;
      const cell = el('div', 'cpuq-fact');
      cell.append(el('span', '', label), el('strong', '', String(value)));
      grid.append(cell);
    }
    td.append(grid);
    for(const [label, text] of [['丢失', d.lost_reason], ['取消', d.cancelled_by], ['回收', d.reap_reason]]) {
      if(text) td.append(el('p', 'cpuq-detail-warn', `${label}：${text}`));
    }
    if((d.shards || []).length) {
      const table = el('table', 'cpuq-shards');
      const head = el('tr');
      for(const h of ['分片', '机器', '核数', '内存', '状态', 'CPU 实时', 'CPU 均值', '退出码']) head.append(el('th', '', h));
      table.append(el('thead').appendChild(head).parentNode);
      const body = el('tbody');
      for(const sh of d.shards) {
        const row = el('tr');
        for(const value of [`#${sh.index ?? '—'}`, sh.node, sh.cpus ?? '—', sh.mem_gb ? sh.mem_gb + 'G' : '—', sh.state || '—',
          sh.cpu_pct == null ? '—' : sh.cpu_pct + '%', sh.cpu_avg_pct == null ? '—' : sh.cpu_avg_pct + '%',
          sh.exit_code == null ? '—' : String(sh.exit_code)]) row.append(el('td', '', String(value)));
        body.append(row);
      }
      table.append(body);
      td.append(table);
    }
    td.append(el('p', 'cpuq-detail-hint', '看板只读，取消任务请用 cpuq cancel ' + job.id));
    tr.append(td);
    return tr;
  }

  function renderCpuqTable() {
    if(!$('cpuq-jobs')) return;
    syncCpuqOwnerOptions();
    const body = $('cpuq-jobs'); body.replaceChildren();
    const rows = cpuqFiltered();
    const columns = 9;
    for(const job of rows) {
      const tr = el('tr', 'cpuq-row' + (cpuqOpen.has(job.id) ? ' open' : '') + (cpuqIdle(job) ? ' idle-warn' : ''));
      tr.tabIndex = 0;
      const cells = [job.id, job.owner, job.status, job.nodes, job.cpus, job.machine,
        job.cpu_pct == null ? '—' : job.cpu_pct + '%', job.duration, job.name];
      cells.forEach((value, i) => tr.append(el('td', i === 2 ? 'cpuq-state ' + job.status : '', String(value ?? ''))));
      const toggle = () => { cpuqOpen.has(job.id) ? cpuqOpen.delete(job.id) : cpuqOpen.add(job.id); renderCpuqTable(); };
      tr.onclick = toggle;
      tr.onkeydown = ev => { if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggle(); } };
      body.append(tr);
      if(cpuqOpen.has(job.id)) body.append(cpuqDetailRow(job, columns));
    }
    const total = (cpuq?.jobs || []).length;
    $('cpuq-count').textContent = rows.length === total ? `${total} 项` : `${rows.length} / ${total} 项`;
    $('cpuq-mine').setAttribute('aria-pressed', String(cpuqMine));
    $('cpuq-finished').setAttribute('aria-pressed', String(!!cpuq?.include_finished));
    if(!body.children.length) {
      const tr = el('tr'), td = el('td', 'empty', cpuq?.error ? 'CPUQ 暂无可用数据' : (total ? '没有符合筛选条件的作业' : '当前没有 CPUQ 作业'));
      td.colSpan = columns; tr.append(td); body.append(tr);
    }
  }

  function setPage(page) {
    currentPage=page;
    if($('gpu-page')) $('gpu-page').hidden=page!=='gpu';
    if($('cpuq-page')) $('cpuq-page').hidden=page!=='cpuq';
    if($('page-title')) $('page-title').textContent=page==='cpuq'?'CPUQ 监控':'GPU 占用概览';
    document.querySelectorAll('.page-tab').forEach(btn=>{const active=btn.dataset.page===page;btn.classList.toggle('active',active);btn.setAttribute('aria-selected',String(active));});
  }

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
  function subscriptionLabel(iso, estimated=false) {
    const when=beijingParts(iso);
    if(!when) return null;
    const ms=Date.parse(iso)-Date.now();
    const remain=remainText(iso);
    if(estimated) return {
      text:`预计可用至 ${when.short}${ms<=0?' · 日期已过':''}`,
      title:`预计可用至北京时间 ${when.full}。续费状态请查看 ChatGPT 账单。`,
      expired:ms<=0
    };
    if(ms<=0) return {text:`订阅到期 ${when.short} 已到期`, title:`北京时间 ${when.full} 已到期`, expired:true};
    return {text:`订阅到期 ${when.short}`, title:`北京时间 ${when.full} 到期 · ${remain}`, expired:false};
  }
  function windowSeconds(window, label) {
    const n=Number(window?.window_seconds);
    if(Number.isFinite(n) && n>0) return n;
    if(label==='一周') return 7*24*3600;
    if(label==='5小时') return 5*3600;
    if(label==='Auto' || label==='模型' || label==='合计') return 30*24*3600;
    return null;
  }
  function expectedPercent(window, label) {
    const seconds=windowSeconds(window, label);
    const resets=Date.parse(window?.resets_at);
    if(!Number.isFinite(seconds) || !Number.isFinite(resets)) return null;
    const remainMs=resets-Date.now();
    if(remainMs<=0) return 0;
    const elapsed=Math.max(0, Math.min(1, 1-remainMs/(seconds*1000)));
    return elapsed*100;
  }
  function paceInfo(percent, expected) {
    if(!Number.isFinite(percent) || !Number.isFinite(expected)) return null;
    const delta=percent-expected;
    if(Math.abs(delta)<1.5) return null;
    if(delta>0) return {kind:'fast', text:'快于均匀', title:`均匀速率应约 ${percentText(expected)}，当前已用 ${percentText(percent)}，偏快 ${percentText(delta)}`};
    return {kind:'slow', text:'慢于均匀', title:`均匀速率应约 ${percentText(expected)}，当前已用 ${percentText(percent)}，偏慢 ${percentText(-delta)}`};
  }
  function paintPaceMeter(meter) {
    const percent=Number(meter.dataset.percent);
    const expected=expectedPercent({resets_at:meter.dataset.resets, window_seconds:meter.dataset.windowSeconds}, meter.dataset.label);
    const mark=meter.querySelector('.pace-mark');
    const pace=meter.querySelector('.claude-pace');
    if(mark){
      if(expected==null){mark.hidden=true;}
      else{
        mark.hidden=false;
        mark.style.left=Math.max(0, Math.min(100, expected))+'%';
        mark.title=`均匀速率应约 ${percentText(expected)}`;
      }
    }
    if(pace){
      const info=paceInfo(percent, expected);
      if(!info){pace.hidden=true;pace.textContent='';pace.removeAttribute('title');pace.className='claude-pace';}
      else{
        pace.hidden=false;
        pace.textContent=info.text;
        pace.title=info.title;
        pace.className='claude-pace '+info.kind;
      }
    }
  }
  function paintQuotaClocks() {
    for(const node of document.querySelectorAll('.claude-reset[data-resets]')){
      if(Date.parse(node.dataset.resets)<=Date.now()){renderQuotas();return;}
      const when=beijingParts(node.dataset.resets);
      if(!when) continue;
      const remain=remainText(node.dataset.resets);
      node.textContent=remain ? `${when.short} · ${remain}` : `${when.short} 北京`;
      node.title=`北京时间 ${when.full} 重置 · ${remain}`;
    }
    for(const node of document.querySelectorAll('.quota-due[data-until]')){
      const label=node.dataset.kind==='reset-card'
        ? resetCardLabel(node.dataset.until)
        : node.dataset.kind==='reset'
        ? resetExpiryLabel(node.dataset.until, node.dataset.several==='1')
        : subscriptionLabel(node.dataset.until, node.dataset.kind==='subscription-estimate');
      if(!label) continue;
      node.textContent=label.text;
      node.title=label.title;
      node.classList.toggle('hot', label.expired);
    }
    for(const node of document.querySelectorAll('.quota-reset[data-resets]')){
      try { node.title=resetTitle(JSON.parse(node.dataset.resets)); } catch { node.removeAttribute('title'); }
    }
    for(const meter of document.querySelectorAll('.claude-meter[data-resets]')) paintPaceMeter(meter);
  }
  function beijingStamp(iso) {
    const d=new Date(iso);
    if(!iso || Number.isNaN(d.getTime())) return null;
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(d);
    const get=type=>parts.find(p=>p.type===type)?.value||'';
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
  }
  function resetCardLabel(iso) {
    const when=beijingParts(iso);
    if(!when) return null;
    const expired=Date.parse(iso)<=Date.now();
    const remain=remainText(iso);
    return {
      text:expired?`${when.short} 已过期`:(remain ? `${when.short} · ${remain}` : `${when.short} 北京`),
      title:expired?`北京时间 ${when.full} 已过期`:`北京时间 ${when.full} 到期 · ${remain}`,
      expired
    };
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
    const row=el('span','claude-meter-row');
    row.append(el('span','claude-k',label));
    const seconds=windowSeconds(window, label);
    const wide=label==='一周' || label==='Auto' || label==='模型' || label==='合计' || (seconds!=null && seconds>=6*24*3600);
    const track=el('span','claude-bar'+(wide?' wide':''));
    const fillWrap=el('span','claude-fill-wrap');
    const fill=el('i','');
    const expired=!!window?.resets_at&&Date.parse(window.resets_at)<=Date.now();
    const percent=expired?0:window&&Number.isFinite(Number(window.percent))?Number(window.percent):null;
    fill.className=tone(percent);
    if(percent!=null){
      fill.style.width=Math.max(0,Math.min(100,percent))+'%';
      if(percent>0) fill.style.minWidth='3px';
    }
    fillWrap.append(fill);
    track.append(fillWrap);
    const mark=el('span','pace-mark');
    mark.hidden=true;
    track.append(mark);
    const value=el('b','claude-pct '+tone(percent), percentText(percent));
    const pace=el('span','claude-pace');
    pace.hidden=true;
    row.append(track, value, pace);
    meter.append(row);
    const reset=el('span','claude-reset', '—');
    if(expired){
      reset.textContent='已重置';
      reset.title=`北京时间 ${beijingParts(window.resets_at)?.full||''} 已重置，等待下次读取`;
    }else if(window?.resets_at){
      reset.dataset.resets=window.resets_at;
      const when=beijingParts(window.resets_at);
      const remain=remainText(window.resets_at);
      if(when){
        reset.textContent=remain ? `${when.short} · ${remain}` : `${when.short} 北京`;
        reset.title=`北京时间 ${when.full} 重置 · ${remain}`;
      }
    }
    meter.append(reset);
    if(window?.resets_at && seconds!=null && percent!=null && !expired){
      meter.dataset.resets=window.resets_at;
      meter.dataset.windowSeconds=String(seconds);
      meter.dataset.label=label;
      meter.dataset.percent=String(percent);
      paintPaceMeter(meter);
    }
    const paceTitle=pace.title?`，${pace.title}`:'';
    meter.setAttribute('aria-label', `${label}已用 ${percentText(percent)}`+(reset.title?`，${reset.title}`:'')+paceTitle);
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
  function renderQuotaStrip(box, usage, title, hint, options = {}) {
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
      if(options.showEmail && account.email) who.append(el('small','claude-email',account.email));
      if(account.email) who.title=account.email;
      card.append(who);
      const subscriptionUntil=account.subscription_estimated_until||account.subscription_until;
      if(subscriptionUntil){
        const due=el('span','quota-due');
        due.dataset.until=subscriptionUntil;
        if(account.subscription_estimated_until) due.dataset.kind='subscription-estimate';
        const label=subscriptionLabel(subscriptionUntil, !!account.subscription_estimated_until);
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
        const err=el('span','claude-wait',hasQuota?'':account.error);
        err.title=account.error;
        if(!hasQuota) card.append(err);
        else card.title=(card.title?card.title+' · ':'')+account.error;
      }
      box.append(card);
    }
  }
  function renderClaude() {
    renderQuotaStrip($('claude-usage'), claudeUsage, 'Claude 额度', '5 小时窗口和一周窗口的已用比例。一周进度条上的竖线是均匀速率应到的位置；偏快 / 偏慢对照当前已用与该位置。重置时间是北京时间。每个号下面是注册邮箱。', {showEmail:true});
  }
  function renderCodex() {
    renderQuotaStrip($('codex-usage'), codexUsage, 'Codex 额度', '订阅窗口的已用比例、剩余积分，以及可重置次数和有效期。时间都是北京时间。');
  }
  function renderCursor() {
    renderQuotaStrip($('cursor-usage'), cursorUsage, 'Cursor 额度', '指定模型和 Auto 在本计费周期的已用比例。进度条上的竖线是均匀速率应到的位置；偏快 / 偏慢对照当前已用与该位置。重置时间是北京时间。');
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
      cpuq=next.cpuq || cpuq;
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
      renderCpuq();
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
  for(const id of ['cpuq-owner','cpuq-status','cpuq-sort']) if($(id)) $(id).addEventListener('change',()=>{if(id==='cpuq-owner')cpuqMine=false;renderCpuq();});
  if($('cpuq-search')) $('cpuq-search').addEventListener('input',renderCpuqTable);
  if($('cpuq-mine')) $('cpuq-mine').onclick=()=>{cpuqMine=!cpuqMine;if(cpuqMine)$('cpuq-owner').value='';renderCpuq();};
  if($('cpuq-reset')) $('cpuq-reset').onclick=()=>{for(const id of ['cpuq-owner','cpuq-status','cpuq-search'])$(id).value='';$('cpuq-sort').value='default';cpuqMine=false;cpuqOpen.clear();renderCpuq();};
  if($('cpuq-finished')) $('cpuq-finished').onclick=async()=>{
    const want=!(cpuq?.include_finished);
    const btn=$('cpuq-finished'); btn.disabled=true; btn.textContent=want?'正在拉取…':'含已结束';
    try{
      const r=await fetch(`/api/cpuq?finished=${want?1:0}&refresh=1`,{signal:AbortSignal.timeout(8000)});
      if(r.ok) cpuq=await r.json();
      if(cpuq) cpuq.include_finished=want;
    }catch(e){ /* 下一次轮询会带回正确范围 */ }
    btn.disabled=false; btn.textContent='含已结束'; renderCpuq();
  };
  document.querySelectorAll('.page-tab').forEach(btn=>btn.onclick=()=>setPage(btn.dataset.page));
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
  if($('json')) $('json').onclick=()=>{if(data)download('prophet-tasks.json',JSON.stringify(exportSnapshot(data,shown,filters()),null,2),'application/json');};
  if($('html')) $('html').onclick=()=>{
    if(!data)return;
    download('prophet-tasks.html', exportTasksHtml(shown, {
      projects:data.projects, checkedAt:data.checked_at, hours:Number($('finished').value)||0,
      outcome:$('outcome').value, filters:filters()
    }), 'text/html;charset=utf-8');
  };
  if($('csv')) $('csv').onclick=()=>{
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
