import test from 'node:test';
import assert from 'node:assert/strict';
import { filterJobs, totals, csvCell, rankedUsers, hasData, exportSnapshot, gpuFamily, gpuSummary, availableGpuFamilies, availablePriorities, priorityRank, compareTasks, gpuBlockGroups, filterResourceNodes, resourceTotals, freeGpusByFamily, freeGpusByProject, idleCaption, idleMachineLine, gpuSizeCounts, jobStartSeconds, runtimeSeconds, taskDurationSeconds, formatDuration, usersOnGpu, finishedWithin, endSeconds, finishedTags, keepFinished, recentTaskNames } from './static/app.js';

const jobs = [
  {id:'a', name:'four-node run', user:'alice', project:'CP', status:'Running', gpus:32, gpu_type:'H800'},
  {id:'b', name:'queued', user:'alice', project:'CP', status:'Pending', gpus:16, gpu_type:'H800'},
  {id:'c', name:'other', user:'bob', project:'CPE', status:'Running', gpus:8, gpu_type:'A100'},
  {id:'d', name:'missing', user:'bob', project:'CPE', status:'Running', gpus:null, gpu_type:'A100'}
];

test('filters combine user, project, status, and case-insensitive search', () => {
  assert.deepEqual(filterJobs(jobs,{user:'alice',project:'CP',status:'Running',search:'H800'}).map(j=>j.id), ['a']);
  assert.deepEqual(filterJobs(jobs,{search:'FOUR-NODE'}).map(j=>j.id), ['a']);
  assert.equal(filterJobs(jobs,{user:'nobody'}).length,0);
});
test('finished tasks separate smoke, failure, and runs too short to keep', () => {
  const smoke={name:'lab-swe-pol-smoke-code',status:'Succeeded',duration_seconds:80};
  const failed={name:'lab-swe-memory-r7',status:'Failed',duration_seconds:400};
  const stopped={name:'lab-swe-pol-main-code',status:'Interrupted',duration_seconds:0};
  const thin={name:'lab-swe-atod-grpo',status:'Succeeded',duration_seconds:24};
  const probe={name:'lab-swe-profiling-v2-q34',status:'Succeeded',duration_seconds:3600};
  const result={name:'lab-swe-opd-advv2-s1',status:'Succeeded',duration_seconds:5000};
  assert.deepEqual(finishedTags(smoke), ['smoke']);
  assert.deepEqual(finishedTags(failed), ['failed']);
  assert.deepEqual(finishedTags(probe), ['probe']);
  assert.deepEqual(finishedTags(thin), ['thin']);
  assert.equal(keepFinished(result, 'result'), true);
  assert.equal(keepFinished(smoke, 'result'), false);
  assert.equal(keepFinished(thin, 'result'), false);
  assert.equal(keepFinished(probe, 'probe'), true);
  assert.equal(keepFinished(failed, 'failed'), true);
  assert.equal(keepFinished(stopped, 'failed'), true);
  assert.equal(keepFinished(smoke, 'smoke'), true);
});
test('finished window keeps one user completions inside 12, 24 and 48 hours', () => {
  const now = Date.parse('2026-10-29T10:00:00Z');
  const jobs = [
    {id:'new', user:'wangyuxuan6', ended_at: now/1000 - 3*3600},
    {id:'day', user:'wangyuxuan6', ended_at: now/1000 - 20*3600},
    {id:'two', user:'wangyuxuan6', ended_at: now/1000 - 40*3600},
    {id:'old', user:'wangyuxuan6', ended_at: now/1000 - 60*3600},
    {id:'other', user:'alice', ended_at: now/1000 - 3600},
  ];
  assert.deepEqual(finishedWithin(jobs, 12, now).map(j=>j.id), ['new','other']);
  assert.deepEqual(finishedWithin(jobs, 24, now).map(j=>j.id), ['new','day','other']);
  assert.deepEqual(finishedWithin(jobs, 48, now).map(j=>j.id), ['new','day','two','other']);
  assert.deepEqual(filterJobs(finishedWithin(jobs, 48, now), {user:'wangyuxuan6'}).map(j=>j.id), ['new','day','two']);
  assert.equal(endSeconds({ended_at: now/1000 - 10}), now/1000 - 10);
  assert.equal(finishedWithin(jobs, 0, now).length, 0);
});
test('recent task names cover submit, start and finish inside 3, 6, 12 and 24 hours', () => {
  const now = Date.parse('2026-11-03T02:00:00Z');
  const sec = hours => now / 1000 - hours * 3600;
  const rows = [
    {id:'run', name:'submitted-2h', status:'Running', created_at: sec(2)},
    {id:'start', name:'started-5h', status:'Running', started_at: sec(5) * 1000},
    {id:'done', name:'finished-10h', status:'Succeeded', ended_at: sec(10)},
    {id:'old', name:'finished-20h', status:'Succeeded', ended_at: sec(20)},
    {id:'run', name:'submitted-2h-again', created_at: sec(1)},
    {id:'blank', name:'  ', created_at: sec(1)},
  ];
  assert.deepEqual(recentTaskNames(rows, 3, now), ['submitted-2h']);
  assert.deepEqual(recentTaskNames(rows, 6, now), ['submitted-2h', 'started-5h']);
  assert.deepEqual(recentTaskNames(rows, 12, now), ['submitted-2h', 'started-5h', 'finished-10h']);
  assert.deepEqual(recentTaskNames(rows, 24, now), ['submitted-2h', 'started-5h', 'finished-10h', 'finished-20h']);
  assert.deepEqual(recentTaskNames(filterJobs(rows, {user:'nobody'}), 12, now), []);
  assert.equal(recentTaskNames(rows, 0, now).length, 0);
});
test('each task draws one highlighted block per GPU, grouped by node', () => {
  assert.deepEqual(gpuBlockGroups({nodes:4,gpus_per_node:8,gpus:32}),[8,8,8,8]);
  assert.deepEqual(gpuBlockGroups({nodes:1,gpus_per_node:2,gpus:2}),[2]);
  assert.deepEqual(gpuBlockGroups({gpus:8}),[8]);
  assert.deepEqual(gpuBlockGroups({gpus:null}),[]);
});
test('priority filter and search keep each task P0 or P3', () => {
  const rows=jobs.map((j,i)=>({...j,priority:i%2?'P3':'P0'}));
  assert.deepEqual(filterJobs(rows,{priority:'P0'}).map(j=>j.id),['a','c']);
  assert.deepEqual(filterJobs(rows,{search:'p3'}).map(j=>j.id),['b','d']);
  assert.deepEqual(availablePriorities(rows,'P1'),['P0','P1','P3']);
  assert.deepEqual([priorityRank('P0'),priorityRank('P3'),priorityRank('—')],[0,3,99]);
});
test('one user pending queue is P2 then P3, ahead of card count', () => {
  const rows = [
    {id:'p3-8', user:'me', status:'Pending', priority:'P3', gpus:8},
    {id:'run-8', user:'me', status:'Running', priority:'P3', gpus:8},
    {id:'p2-4', user:'me', status:'Pending', priority:'P2', gpus:4},
    {id:'run-4', user:'me', status:'Running', priority:'P2', gpus:4},
    {id:'p3-4', user:'me', status:'Pending', priority:'P3', gpus:4},
  ];
  const ordered = rows.slice().sort((a,b) => compareTasks(a, b, {pendingByPriority:true}));
  assert.deepEqual(ordered.map(j => j.id), ['run-8','run-4','p2-4','p3-8','p3-4']);
});
test('mixed users keep pending jobs in card-count order', () => {
  const rows = [
    {id:'p2-4', user:'me', status:'Pending', priority:'P2', gpus:4},
    {id:'p3-8', user:'other', status:'Pending', priority:'P3', gpus:8},
  ];
  const ordered = rows.slice().sort((a,b) => compareTasks(a, b, {pendingByPriority:false}));
  assert.deepEqual(ordered.map(j => j.id), ['p3-8','p2-4']);
});
test('totals separate requested GPUs and retain unknown count', () => {
  assert.deepEqual(totals(jobs), {running_gpus:40,pending_gpus:16,running_jobs:3,pending_jobs:1,unknown:1});
});
test('user ranking excludes pending demand', () => {
  assert.deepEqual(rankedUsers(jobs).map(j=>[j.user,j.gpus]),[['alice',32],['bob',8]]);
});
test('CSV quotes commas and prevents spreadsheet formula evaluation', () => {
  assert.equal(csvCell('a,b'), '"a,b"');
  assert.equal(csvCell('=1+1'),'"\'=1+1"');
  assert.equal(csvCell('a"b'),'"a""b"');
  assert.equal(csvCell(null),'""');
});

test('failed selected project has unknown counts even if another project is healthy', () => {
  const projects=[{name:'CP',available:false},{name:'CPE',available:true}];
  assert.equal(hasData(projects,'CP'),false);
  assert.equal(hasData(projects,'CPE'),true);
  assert.equal(hasData(projects,''),true);
});

test('JSON export preserves selected project failures and unknown totals', () => {
  const data={checked_at:'now',scope:'visible projects',projects:[
    {name:'CP',available:false,stale:true,updated_at:null,error:'unavailable'},
    {name:'CPE',available:true,stale:false,updated_at:'now',error:null}
  ]};
  const out=exportSnapshot(data,[],{project:'CP'});
  assert.equal(out.complete,false);
  assert.equal(out.summary,null);
  assert.equal(out.projects.length,1);
  assert.equal(out.projects[0].error,'unavailable');
});

test('JSON export includes last successful update of stale cached rows', () => {
  const data={checked_at:'now',projects:[{name:'CP',available:true,stale:true,updated_at:'yesterday',error:'timeout'}]};
  const out=exportSnapshot(data,[jobs[0]],{});
  assert.equal(out.projects[0].updated_at,'yesterday');
  assert.equal(out.complete,false);
  assert.equal(out.summary.running_gpus,32);
});

test('H800 filter includes its tasks regardless of project alias', () => {
  assert.deepEqual(filterJobs(jobs,{gpu:'H800'}).map(j=>j.id),['a','b']);
  assert.equal(gpuFamily('H800-80G-基础版'),'H800');
  assert.equal(gpuFamily('AMP-A100-A800-80G-标准版'),'A100/A800 混合');
});

test('GPU summary separates running allocation from queued requests', () => {
  const summary=gpuSummary(jobs);
  const h800=summary.find(g=>g.family==='H800');
  assert.equal(h800.running_gpus,32);
  assert.equal(h800.pending_gpus,16);
  assert.equal(h800.running_jobs,1);
  const a100=summary.find(g=>g.family==='A100');
  assert.equal(a100.running_gpus,8);
  assert.equal(a100.unknown,1);
});

test('selected H800 filter remains selected when its last task disappears', () => {
  const remaining=jobs.filter(j=>j.gpu_type!=='H800');
  assert.deepEqual(availableGpuFamilies(remaining,'H800'),['A100','H800']);
  assert.equal(filterJobs(remaining,{gpu:'H800'}).length,0);
});

const resourceNodes=[
 {name:'eight',project:'A',projects:['A'],gpu_type:'A800-80G-基础版,AMP-A100-A800-80G-标准版',total_gpus:8,allocated_gpus:0,free_gpus:8,schedulable:true,consistent:true},
 {name:'six',project:'A',projects:['A'],gpu_type:'A800',total_gpus:8,allocated_gpus:2,free_gpus:6,schedulable:true,consistent:true},
 {name:'four',project:'B',projects:['B'],gpu_type:'H800',total_gpus:8,allocated_gpus:4,free_gpus:4,schedulable:true,consistent:true},
 {name:'one',project:'A',projects:['A'],gpu_type:'A800',total_gpus:8,allocated_gpus:7,free_gpus:1,schedulable:true,consistent:true},
 {name:'repair',project:'A',projects:['A'],gpu_type:'A800',total_gpus:8,allocated_gpus:0,free_gpus:8,schedulable:false,consistent:true}
];

test('idle cards distinguish total singles, full machines and per-node thresholds', () => {
 const s=resourceTotals(resourceNodes);
 assert.equal(s.schedulable_free_gpus,19);
 assert.equal(s.raw_free_gpus,27);
 assert.equal(s.full_free_8_nodes,1);
 assert.equal(s.at_least_8_nodes,1);
 assert.equal(s.at_least_4_nodes,3);
 assert.equal(s.at_least_2_nodes,3);
 assert.equal(s.free_distribution['8'],1);
 assert.equal(s.free_distribution['6'],1);
 assert.equal(s.free_distribution['4'],1);
 assert.equal(s.free_distribution['1'],1);
});

test('node resource filters follow project and hardware, ignoring task user/status', () => {
 assert.deepEqual(filterResourceNodes(resourceNodes,{gpu:'A800',user:'nobody',status:'Pending'}).map(n=>n.name),['eight','six','one','repair']);
 assert.deepEqual(filterResourceNodes(resourceNodes,{project:'B'}).map(n=>n.name),['four']);
});

test('schedulable idle cards are grouped for the same color series as queued demand', () => {
 const byFamily=freeGpusByFamily(resourceNodes);
 assert.equal(byFamily.get('A800'),15);
 assert.equal(byFamily.get('H800'),4);
 assert.equal(byFamily.has(undefined),false);
 const byProject=freeGpusByProject(resourceNodes);
 assert.equal(byProject.get('A'),15);
 assert.equal(byProject.get('B'),4);
 const shared={name:'shared',project:'A',projects:['A','B'],gpu_type:'A800',free_gpus:2,schedulable:true,consistent:true};
 const sharedProjects=freeGpusByProject([shared]);
 assert.equal(sharedProjects.get('A'),2);
 assert.equal(sharedProjects.get('B'),2);
 assert.equal(freeGpusByFamily([{...resourceNodes[0],free_gpus:0},{...resourceNodes[4]}]).size,0);
});

test('chart caption lists remaining cards per node instead of overlapping thresholds', () => {
  const a800=resourceTotals(resourceNodes.filter(n=>['eight','six','one','repair'].includes(n.name)));
  assert.equal(idleCaption(a800), '8卡×1 · 6卡×1 · 1卡×1 · 不可调度 1台');
  assert.equal(idleCaption(resourceTotals([resourceNodes[2]])), '4卡×1');
  assert.equal(idleCaption(resourceTotals([{name:'down',schedulable:false,consistent:true,free_gpus:6,total_gpus:8,allocated_gpus:2}])), '没有可调度空闲 · 不可调度 1台 · 未分配 6卡不可用');
});

test('narrow row counts machines with at least 8, 4, or 2 cards free', () => {
  const s=resourceTotals(resourceNodes);
  assert.equal(idleMachineLine(s), '单机至少空闲 8卡 1台 · 4卡 3台 · 2卡 3台');
  assert.equal(idleMachineLine(resourceTotals([resourceNodes[2]])), '单机至少空闲 8卡 0台 · 4卡 1台 · 2卡 1台');
  assert.equal(idleMachineLine(null), '');
});

test('task sizes count exact 8, 4, 2, and 1 card jobs', () => {
  const sized=gpuSizeCounts([
    {gpus:8,status:'Running'},{gpus:8,status:'Pending'},{gpus:4,status:'Running'},
    {gpus:2,status:'Running'},{gpus:1,status:'Pending'},{gpus:16,status:'Running'},
    {gpus:3,status:'Running'},{gpus:null,status:'Running'},
  ]);
  assert.equal(sized.counts[8].total,2);
  assert.equal(sized.counts[8].running,1);
  assert.equal(sized.counts[8].pending,1);
  assert.equal(sized.counts[4].total,1);
  assert.equal(sized.counts[4].running,1);
  assert.equal(sized.counts[2].total,1);
  assert.equal(sized.counts[1].total,1);
  assert.equal(sized.counts[1].pending,1);
  assert.equal(sized.counts[1].running,0);
  assert.equal(sized.other.total,2);
  assert.equal(sized.other.running,2);
  assert.equal(sized.other.pending,0);
});

test('each GPU model lists the users who hold its cards', () => {
  assert.deepEqual(usersOnGpu(jobs, 'H800').map(u=>[u.user,u.gpus,u.running,u.pending]), [['alice',48,32,16]]);
  assert.deepEqual(usersOnGpu(jobs, 'A100').map(u=>[u.user,u.gpus]), [['bob',8]]);
  assert.deepEqual(usersOnGpu(jobs, 'H800', 'CPE'), []);
  assert.deepEqual(usersOnGpu(jobs).map(u=>u.user), ['alice','bob']);
});

test('running time follows start time and stays blank before a job starts', () => {
  const now=1_700_000_000_000;
  assert.equal(jobStartSeconds({started_at:1_699_999_000}), 1_699_999_000);
  assert.equal(jobStartSeconds({started_at:1_699_999_000_000}), 1_699_999_000);
  assert.equal(runtimeSeconds({status:'Running', started_at:1_700_000_000-125}, now), 125);
  assert.equal(runtimeSeconds({status:'Pending', started_at:1_700_000_000-125}, now), null);
  assert.equal(runtimeSeconds({status:'Running', duration_seconds:90}, now), 90);
  assert.equal(formatDuration(125), '2分');
  assert.equal(formatDuration(3700), '1小时1分');
  assert.equal(formatDuration(90061), '1天1小时');
  assert.equal(formatDuration(null), '—');
});

test('task duration sorts finished runs by recorded or computed elapsed time', () => {
  const now = 1_700_000_000_000;
  const running = {id:'run', status:'Running', started_at:1_700_000_000 - 7200};
  const recorded = {id:'rec', status:'Succeeded', duration_seconds:5000, started_at:1_700_000_000 - 9000, ended_at:1_700_000_000};
  const computed = {id:'gap', status:'Failed', started_at:1_700_000_000 - 400, ended_at:1_700_000_000};
  const queued = {id:'wait', status:'Pending', created_at:1_700_000_000 - 100};
  assert.equal(taskDurationSeconds(running, now), 7200);
  assert.equal(taskDurationSeconds(recorded, now), 5000);
  assert.equal(taskDurationSeconds(computed, now), 400);
  assert.equal(taskDurationSeconds(queued, now), null);
  const ordered = [queued, computed, running, recorded].sort((a, b) => (taskDurationSeconds(b, now) ?? -1) - (taskDurationSeconds(a, now) ?? -1));
  assert.deepEqual(ordered.map(j => j.id), ['run', 'rec', 'gap', 'wait']);
});

test('inconsistent node does not inflate schedulable idle cards', () => {
 const s=resourceTotals([{...resourceNodes[0],consistent:false,schedulable:false,total_gpus:7,allocated_gpus:8,free_gpus:0}]);
 assert.equal(s.schedulable_free_gpus,0);
 assert.equal(s.inconsistent_nodes,1);
});

test('resource export preserves missing-project status instead of partial totals', () => {
 const data={projects:[{name:'A',available:true,stale:false},{name:'B',available:true,stale:false}],
  inventory:{checked_at:'now',projects:[{name:'A',available:true,stale:false},{name:'B',available:false,error:'denied'}],nodes:resourceNodes.filter(n=>n.project==='A')}};
 assert.equal(exportSnapshot(data,[],{}).inventory.summary,null);
 assert.equal(exportSnapshot(data,[],{}).complete,false);
 const selected=exportSnapshot(data,[],{project:'A'});
 assert.equal(selected.inventory.summary.schedulable_free_gpus,15);
});
