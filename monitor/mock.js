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

  function live(id, name, user, status, priority, project, gpuType, cards, ageHours) {
    const now = Math.floor(Date.now() / 1000);
    const nodes = 1;
    return {
      id, name, project, status, user, display_name: user, priority, gpu_type: gpuType,
      nodes, gpus_per_node: cards, gpus: cards,
      created_at: now - ageHours * HOUR,
      started_at: status === 'Pending' ? null : now - Math.max(1, ageHours - 1) * HOUR,
      ended_at: null, duration_seconds: null, cluster: 'mock', stale: false,
    };
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

  function machines(project, gpuType, count, freeCount) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const free = i < freeCount ? 8 : 0;
      rows.push({
        name: project.toLowerCase() + '-' + String(i + 1).padStart(2, '0'),
        project, projects: [project], gpu_type: gpuType,
        total_gpus: 8, allocated_gpus: 8 - free, free_gpus: free,
        schedulable: true, consistent: true,
      });
    }
    return rows;
  }

  function snapshot() {
    const jobs = [
      live('m-01', 'glance-etd-50', 'wangyuxuan', 'Running', 'P2', 'ZhinaoRD2_A800', A800, 8, 6),
      live('m-02', 'glance-etd-25', 'wangyuxuan', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 4),
      live('m-03', 'lt-opd-budget', 'wangyuxuan', 'Pending', 'P2', 'ZhinaoRD2_A800', A800, 4, 1),
      live('m-04', 'lt-opd-sft', 'wangyuxuan', 'Pending', 'P3', 'ZhinaoRD2_A800', A800, 8, 2),
      live('m-05', 'align-pass-3', 'linzhou', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 9),
      live('m-06', 'align-pass-4', 'linzhou', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 7),
      live('m-07', 'align-pass-5', 'linzhou', 'Running', 'P2', 'ZhinaoRD2_A800', A800, 8, 3),
      live('m-08', 'dpo-mix-a', 'chenrui', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 11),
      live('m-09', 'dpo-mix-b', 'chenrui', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 5),
      live('m-10', 'dpo-mix-c', 'chenrui', 'Pending', 'P2', 'ZhinaoRD2_A800', A800, 8, 1),
      live('m-11', 'dpo-mix-d', 'chenrui', 'Pending', 'P3', 'ZhinaoRD2_A800', A800, 8, 2),
      live('m-12', 'retrieval-sft', 'zhaoan', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 8),
      live('m-13', 'retrieval-queue', 'zhaoan', 'Pending', 'P3', 'ZhinaoRD2_A800', A800, 8, 3),
      live('m-14', 'eval-suite', 'sunqi', 'Running', 'P2', 'ZhinaoRD2_A800', A800, 8, 2),
      live('m-15', 'pack-long-1', 'heyan', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 14),
      live('m-16', 'pack-long-2', 'heyan', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 10),
      live('m-17', 'pack-long-3', 'heyan', 'Pending', 'P3', 'ZhinaoRD2_A800', A800, 8, 1),
      live('m-18', 'pretrain-west', 'guowei', 'Running', 'P3', 'ZhinaoRD2_A800', A800, 8, 20),
      live('m-19', 'pretrain-queue', 'guowei', 'Pending', 'P2', 'ZhinaoRD2_A800', A800, 8, 1),
      live('m-20', 'distill-mix', 'majie', 'Running', 'P3', 'ZhinaoRD2_A800', MIX, 8, 6),
      live('m-21', 'distill-queue', 'guowei', 'Pending', 'P3', 'ZhinaoRD2_A800', MIX, 8, 2),
      live('m-22', 'longctx-h800', 'wangyuxuan', 'Running', 'P2', 'CP', H800, 8, 5),
      live('m-23', 'sft-h800', 'linzhou', 'Running', 'P3', 'CP', H800, 8, 12),
      live('m-24', 'sft-h800-queue', 'sunqi', 'Pending', 'P3', 'CP', H800, 8, 1),
      live('m-25', 'ablation-a100', 'chenrui', 'Running', 'P3', 'CPE', A100, 4, 3),
      live('m-26', 'baseline-a100', 'zhaoan', 'Running', 'P2', 'CPE', A100, 8, 4),
    ];
    const finished = [
      done('f-01', 'glance-etd-prev', 'wangyuxuan', 'Succeeded', 'P2', 'ZhinaoRD2_A800', A800, 8, 5, 6 * HOUR),
      done('f-02', 'smoke-a800-canary', 'wangyuxuan', 'Succeeded', 'P3', 'ZhinaoRD2_A800', A800, 8, 2, 420),
      done('f-03', 'oom-repro', 'linzhou', 'Failed', 'P3', 'ZhinaoRD2_A800', A800, 8, 8, 2400),
      done('f-04', 'longctx-stop', 'chenrui', 'Interrupted', 'P2', 'CP', H800, 8, 20, 5000),
      done('f-05', 'quick-check', 'sunqi', 'Succeeded', 'P3', 'ZhinaoRD2_A800', A800, 4, 1, 45),
      done('f-06', 'preflight-pack', 'heyan', 'Succeeded', 'P3', 'ZhinaoRD2_A800', A800, 8, 30, 900),
      done('f-07', 'retrieval-full', 'zhaoan', 'Succeeded', 'P3', 'ZhinaoRD2_A800', A800, 8, 18, 10 * HOUR),
      done('f-08', 'distill-prev', 'majie', 'Succeeded', 'P3', 'ZhinaoRD2_A800', MIX, 8, 40, 8 * HOUR),
      done('f-09', 'smoke-h800', 'guowei', 'Succeeded', 'P3', 'CP', H800, 8, 36, 180),
      done('f-10', 'align-fail', 'linzhou', 'Failed', 'P2', 'ZhinaoRD2_A800', A800, 8, 14, 3 * HOUR),
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
      ...machines('ZhinaoRD2_A800', A800, 28, 2),
      ...machines('ZhinaoRD2_A800', MIX, 4, 0),
      ...machines('CP', H800, 12, 2),
      ...machines('CPE', A100, 8, 1),
    ];
    const usage = quotas();
    return {
      checked_at: checkedAt,
      complete: true,
      scope: '模拟数据，结构与本机监控相同，不连接 Prophet。',
      default_user: 'wangyuxuan',
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
