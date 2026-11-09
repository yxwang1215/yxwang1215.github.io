/* Static stand-in for /api/snapshot. Names, counts, and times are invented. */
(function () {
  const HOUR = 3600;
  const A800 = 'A800-80G-基础版';
  const MIX = 'AMP-A100-A800-80G-标准版';
  const A100 = 'A100-80G-标准版';
  const H800 = 'H800-80G-基础版';
  let checkedAt = new Date().toISOString();

  function summarize(jobs) {
    const result = {running_jobs: 0, pending_jobs: 0, running_gpus: 0, pending_gpus: 0, unknown_gpu_jobs: 0};
    for (const job of jobs) {
      const kind = job.status === 'Running' ? 'running' : job.status === 'Pending' ? 'pending' : null;
      if (!kind) continue;
      result[kind + '_jobs'] += 1;
      if (job.gpus == null) result.unknown_gpu_jobs += 1;
      else result[kind + '_gpus'] += job.gpus;
    }
    return result;
  }

  function live(id, name, user, status, priority, project, gpuType, nodeCount, perNode, ageHours) {
    const now = Math.floor(Date.now() / 1000);
    return {
      id, name, project, status, user, display_name: user, priority, gpu_type: gpuType,
      nodes: nodeCount, gpus_per_node: perNode, gpus: nodeCount * perNode,
      created_at: now - ageHours * HOUR,
      started_at: status === 'Pending' ? null : now - Math.max(1, ageHours - 1) * HOUR,
      ended_at: null, duration_seconds: null, cluster: 'mock', stale: false,
    };
  }

  function many(user, status, priority, project, gpuType, nodeCount, perNode, count, namePrefix, ageStart) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      rows.push(live(
        namePrefix + '-' + String(i + 1).padStart(2, '0'),
        namePrefix + '-' + String(i + 1).padStart(2, '0'),
        user, status, priority, project, gpuType, nodeCount, perNode,
        ageStart + (i % 18),
      ));
    }
    return rows;
  }

  function done(id, name, user, status, priority, project, gpuType, cards, endedHours, duration) {
    const now = Math.floor(Date.now() / 1000);
    const end = now - endedHours * HOUR;
    return {
      id, name, project, status, user, display_name: user, priority, gpu_type: gpuType,
      nodes: 1, gpus_per_node: cards, gpus: cards,
      created_at: end - duration, started_at: end - duration, ended_at: end,
      duration_seconds: duration, cluster: 'mock', stale: false,
    };
  }

  function machines(project, gpuType, freeList, fullCount) {
    const rows = [];
    const layout = freeList.concat(Array(fullCount).fill(0));
    layout.forEach((free, index) => {
      rows.push({
        name: project.toLowerCase() + '-' + gpuType.slice(0, 4).toLowerCase() + '-' + String(index + 1).padStart(2, '0'),
        project, projects: [project], gpu_type: gpuType,
        total_gpus: 8, allocated_gpus: 8 - free, free_gpus: free,
        schedulable: true, consistent: true,
      });
    });
    return rows;
  }

  function snapshot() {
    const A = 'ZhinaoRD2_A800';
    const jobs = [
      ...many('我', 'Running', 'P0', A, A800, 1, 8, 8, 'a800-me', 6),
      ...many('用户 B', 'Running', 'P0', A, A800, 1, 8, 4, 'a800-b-p0', 10),
      ...many('用户 B', 'Running', 'P3', A, A800, 1, 8, 4, 'a800-b-p3', 8),
      ...many('用户 C', 'Running', 'P3', A, A800, 1, 8, 7, 'a800-c', 12),
      ...many('用户 C', 'Pending', 'P3', A, A800, 1, 8, 63, 'a800-c-queue', 2),
      ...many('用户 D', 'Running', 'P0', A, A800, 1, 2, 15, 'a800-d-small', 20),
      ...many('用户 D', 'Running', 'P3', A, A800, 1, 8, 1, 'a800-d', 9),
      ...many('用户 E', 'Running', 'P0', 'CP', H800, 4, 8, 1, 'h800-e', 30),
      ...many('用户 F', 'Running', 'P3', 'CP', H800, 1, 4, 6, 'h800-f', 14),
      ...many('用户 G', 'Running', 'P3', 'CP', H800, 2, 8, 1, 'h800-g', 18),
      ...many('用户 H', 'Running', 'P3', 'CP', H800, 1, 8, 1, 'h800-h', 7),
      ...many('用户 H', 'Pending', 'P3', 'CP', H800, 4, 8, 1, 'h800-h-queue32', 1),
      ...many('用户 H', 'Pending', 'P3', 'CP', H800, 1, 8, 1, 'h800-h-queue8', 1),
      ...many('用户 I', 'Running', 'P0', A, MIX, 8, 8, 1, 'mix-i', 16),
      ...many('用户 I', 'Running', 'P3', A, MIX, 1, 4, 1, 'mix-i-small', 5),
      ...many('用户 J', 'Running', 'P0', A, MIX, 1, 8, 2, 'mix-j', 11),
      ...many('用户 J', 'Running', 'P0', A, MIX, 1, 2, 1, 'mix-j-small', 4),
      ...many('用户 K', 'Running', 'P3', A, MIX, 1, 4, 1, 'mix-k', 6),
      ...many('用户 L', 'Running', 'P3', 'CPE', A100, 1, 8, 6, 'a100-l', 15),
      ...many('用户 M', 'Running', 'P0', A, A100, 1, 8, 2, 'a100-m', 13),
      ...many('用户 N', 'Running', 'P0', A, A100, 1, 8, 1, 'a100-n', 8),
    ];
    const finished = [
      done('f-01', 'a800-result-3h', '我', 'Succeeded', 'P0', A, A800, 8, 3, 6 * HOUR),
      done('f-02', 'smoke-a800', '用户 C', 'Failed', 'P3', A, A800, 8, 2, 400),
      done('f-03', 'a800-fail', '用户 B', 'Failed', 'P3', A, A800, 8, 8, 2 * HOUR),
      done('f-04', 'h800-stop', '用户 H', 'Interrupted', 'P3', 'CP', H800, 8, 6, 4 * HOUR),
      done('f-05', 'a800-short', '用户 D', 'Succeeded', 'P3', A, A800, 2, 1, 40),
      done('f-06', 'a800-result-18h', '用户 B', 'Succeeded', 'P3', A, A800, 8, 18, 10 * HOUR),
      done('f-07', 'h800-result-20h', '用户 F', 'Succeeded', 'P3', 'CP', H800, 4, 20, 5 * HOUR),
      done('f-08', 'preflight-a800', '用户 D', 'Succeeded', 'P3', A, A800, 8, 30, 800),
      done('f-09', 'a800-result-40h', '我', 'Succeeded', 'P0', A, A800, 8, 40, 8 * HOUR),
      done('f-10', 'smoke-h800', '用户 E', 'Succeeded', 'P3', 'CP', H800, 8, 36, 160),
    ];
    const projects = [
      ['ZhinaoRD2_A800', 'A800'],
      ['CP', 'H800（CP）'],
      ['CPE', 'A100（CPE）'],
    ].map(([name, label]) => ({
      name, id: 'mock-' + name, label, platform_name: name.toLowerCase(),
      available: true, stale: false, updated_at: checkedAt, error: null,
      summary: summarize(jobs.filter(job => job.project === name)),
    }));
    const nodes = [
      ...machines(A, A800, [4, 6, 4, 2, 4, 4], 37),
      ...machines('CP', H800, [], 10),
      ...machines('CPE', A100, [], 7),
      ...machines(A, A100, [], 3),
    ];
    const usage = quotas();
    return {
      checked_at: checkedAt,
      complete: true,
      scope: '模拟数据，结构与本机监控相同，不连接 Prophet。',
      default_user: '我',
      capabilities: {pool_capacity: true, gpu_utilization: false},
      projects, jobs, finished,
      summary: summarize(jobs),
      inventory: {
        available: true, complete: true, nodes,
        projects: projects.map(project => ({name: project.name, available: true, stale: false, error: null})),
        summary: null,
      },
      claude_usage: usage.claude,
      codex_usage: usage.codex,
      cursor_usage: usage.cursor,
    };
  }

  function windowMeter(label, percent, hoursAhead) {
    return {label, percent, resets_at: new Date(Date.now() + hoursAhead * HOUR * 1000).toISOString()};
  }

  function quotas() {
    return {
      claude: {
        pending: false, checked_at: checkedAt,
        accounts: [{
          id: 'demo-claude', name: '演示', account: 'demo', plan: 'Max',
          windows: [windowMeter('5小时', 42, 3), windowMeter('一周', 18, 40)],
        }],
      },
      codex: {
        pending: false, checked_at: checkedAt,
        accounts: [{
          id: 'demo-codex', name: '演示', account: 'demo', plan: 'Plus',
          windows: [windowMeter('5小时', 27, 4)],
          credits: {balance: 860, unlimited: false, local_messages: [40, 70]},
        }],
      },
      cursor: {
        pending: false, checked_at: checkedAt,
        accounts: [{
          id: 'demo-cursor', name: '演示', account: 'demo', plan: 'Pro',
          windows: [windowMeter('指定模型', 63, 12), windowMeter('Auto', 21, 12)],
        }],
      },
    };
  }

  function json(body, status) {
    return new Response(JSON.stringify(body), {
      status: status || 200,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/api/snapshot') !== -1) return Promise.resolve(json(snapshot()));
    if (url.indexOf('/api/claude-usage') !== -1) return Promise.resolve(json(quotas().claude));
    if (url.indexOf('/api/codex-usage') !== -1) return Promise.resolve(json(quotas().codex));
    if (url.indexOf('/api/cursor-usage') !== -1) return Promise.resolve(json(quotas().cursor));
    if (url.indexOf('/api/refresh') !== -1) {
      checkedAt = new Date().toISOString();
      return Promise.resolve(json({ok: true}));
    }
    return realFetch(input, init);
  };
})();
