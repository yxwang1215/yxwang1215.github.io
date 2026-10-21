/* Talent Atlas browser UI — no external libraries, no submissions. */
(() => {
  "use strict";
  const data = window.TALENT_ATLAS_DATA;
  const core = window.TALENT_ATLAS_CORE;
  const app = document.getElementById("talent-atlas");
  if (!app || !data || !core) return;

  const KEY = "yxwang-talent-atlas-v1";
  const LANG_KEY = "yxwang-talent-atlas-lang";
  const SIZE = 6;
  const el = id => document.getElementById(id);
  const $ = (selector, parent = app) => parent.querySelector(selector);
  const $$ = (selector, parent = app) => [...parent.querySelectorAll(selector)];
  let lang = safeGet(LANG_KEY) === "en" ? "en" : "zh";
  let session = restore();
  let report = null;
  const say = (zh, en) => lang === "en" ? en : zh;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* e.g. private browsing */ }
  }
  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (_) { /* unavailable storage */ }
  }
  function restore() {
    try {
      const raw = safeGet(KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== data.version || !(saved.mode in data.modes) ||
          typeof saved.answers !== "object" || !saved.answers || !Number.isInteger(saved.page)) return null;
      const ids = new Set(core.questions(data, saved.mode).map(q => q.id));
      const answers = {};
      Object.entries(saved.answers).forEach(([id, v]) => {
        if (ids.has(id) && Number.isInteger(v) && v >= 1 && v <= 5) answers[id] = v;
      });
      const maxPage = Math.ceil(ids.size / SIZE) - 1;
      return {
        mode: saved.mode, answers, page: Math.max(0, Math.min(maxPage, saved.page)),
        completed: saved.completed === true && Object.keys(answers).length === ids.size
      };
    } catch (_) { return null; }
  }
  function save() {
    if (!session) return;
    safeSet(KEY, JSON.stringify({ version: data.version, ...session }));
  }
  function setScreen(name) {
    ["intro", "quiz", "results"].forEach(screen => {
      const section = el("ta-" + screen);
      section.hidden = screen !== name;
    });
    app.dataset.screen = name;
  }
  function questions() {
    return core.questions(data, session.mode);
  }
  function answeredCount() {
    return Object.keys(session.answers).length;
  }
  function updateResume() {
    const resume = el("ta-resume");
    resume.hidden = !session;
    if (!session) return;
    const total = questions().length;
    const completed = session.completed;
    el("ta-resume-text").textContent = completed
      ? say("上次的结果已保存在此浏览器。", "Your last report is saved in this browser.")
      : say("已完成 " + answeredCount() + " / " + total + " 题，继续上次进度。",
            answeredCount() + " of " + total + " answers saved. Continue where you left off.");
    el("ta-resume-button").textContent = completed
      ? say("查看上次结果", "View saved report")
      : say("继续测试", "Resume assessment");
  }
  function applyLocale() {
    document.documentElement.dataset.talentLanguage = lang;
    app.lang = lang === "en" ? "en" : "zh-CN";
    $$("[data-zh][data-en]").forEach(node => { node.textContent = node.dataset[lang]; });
    el("ta-language").textContent = lang === "en" ? "中文" : "English";
    el("ta-language").setAttribute("aria-label", lang === "en" ? "Switch to Chinese" : "切换为英语");
    safeSet(LANG_KEY, lang);
    updateResume();
    if (!el("ta-quiz").hidden && session) renderPage(false);
    if (!el("ta-results").hidden && session) renderResults(false);
  }
  function begin(mode) {
    if (session && answeredCount() > 0 &&
        !window.confirm(say("开始新测试会覆盖此前保存在本浏览器的作答。继续吗？",
                             "Starting over replaces your saved answers in this browser. Continue?"))) return;
    session = { mode, answers: {}, page: 0, completed: false };
    report = null;
    save();
    renderPage(true);
  }
  function resume() {
    if (!session) return;
    if (session.completed) {
      renderResults(true);
    } else {
      renderPage(true);
    }
  }
  function updateControls() {
    if (!session) return;
    const qs = questions();
    const totalPages = Math.ceil(qs.length / SIZE);
    const start = session.page * SIZE;
    const current = qs.slice(start, start + SIZE);
    const hasAll = current.every(q => Number.isInteger(session.answers[q.id]));
    const all = answeredCount();
    const percent = Math.round(all / qs.length * 100);
    el("ta-counter").textContent = say("已回答 " + all + " / " + qs.length + " 题",
      all + " / " + qs.length + " answered");
    el("ta-page-count").textContent = say("第 " + (session.page + 1) + " / " + totalPages + " 页",
      "Page " + (session.page + 1) + " / " + totalPages);
    el("ta-progress-value").style.width = percent + "%";
    el("ta-progress").setAttribute("aria-valuenow", String(all));
    el("ta-progress").setAttribute("aria-valuemax", String(qs.length));
    el("ta-previous").disabled = session.page === 0;
    el("ta-next").disabled = !hasAll;
    el("ta-next").textContent = session.page === totalPages - 1
      ? say("生成我的报告 →", "Generate my report →")
      : say("继续下一页 →", "Continue →");
    el("ta-next-hint").textContent = hasAll ? ""
      : say("请先完成本页全部 6 题。", "Answer all six questions on this page to continue.");
  }
  function renderPage(moveFocus) {
    if (!session) return;
    setScreen("quiz");
    const qs = questions();
    const current = qs.slice(session.page * SIZE, (session.page + 1) * SIZE);
    const options = [
      say("非常不符合", "Strongly disagree"), say("比较不符合", "Disagree"),
      say("不确定", "Not sure"), say("比较符合", "Agree"),
      say("非常符合", "Strongly agree")
    ];
    const html = current.map((q, i) => {
      const label = q.facet === "evidence"
        ? say("近半年 · 行为", "Last 6 months · Practice")
        : q.facet === "ease"
          ? say("自然上手 · 感受", "Perceived ease")
          : say("兴趣驱动 · 偏好", "Motivation");
      const choices = options.map((option, k) => {
        const value = k + 1;
        const name = "ta-" + q.id;
        const id = name + "-" + value;
        const checked = session.answers[q.id] === value ? " checked" : "";
        return '<label class="ta-scale-option" for="' + id + '">' +
          '<input type="radio" id="' + id + '" name="' + name + '" data-id="' + q.id +
          '" value="' + value + '"' + checked + '>' +
          '<span class="ta-scale-number">' + value + '</span>' +
          '<span class="ta-scale-label">' + escapeHtml(option) + '</span></label>';
      }).join("");
      return '<fieldset class="ta-question"><legend>' +
        '<span class="ta-question-meta"><span class="ta-question-number">' +
        String(session.page * SIZE + i + 1).padStart(2, "0") +
        '</span><span>' + escapeHtml(label) + '</span></span>' +
        '<span class="ta-question-prompt">' + escapeHtml(lang === "en" ? q.en : q.zh) +
        '</span></legend><div class="ta-scale">' + choices + '</div></fieldset>';
    }).join("");
    el("ta-question-list").innerHTML = html;
    el("ta-quiz-heading").textContent = say(
      session.mode === "full" ? "深入探索你的优势" : "快速描绘你的优势",
      session.mode === "full" ? "Explore your strengths in depth" : "Map your strengths");
    updateControls();
    if (moveFocus) {
      el("ta-quiz-heading").setAttribute("tabindex", "-1");
      el("ta-quiz-heading").focus({ preventScroll: true });
      window.scrollTo({ top: Math.max(0, app.getBoundingClientRect().top + window.scrollY - 84), behavior: "smooth" });
    }
  }
  function next() {
    if (!session) return;
    const qs = questions();
    const current = qs.slice(session.page * SIZE, (session.page + 1) * SIZE);
    const missing = current.find(q => !Number.isInteger(session.answers[q.id]));
    if (missing) {
      const node = $('input[data-id="' + missing.id + '"]');
      if (node) node.focus();
      return;
    }
    if (session.page < Math.ceil(qs.length / SIZE) - 1) {
      session.page++;
      save();
      renderPage(true);
    } else {
      session.completed = true;
      save();
      renderResults(true);
    }
  }
  function previous() {
    if (session && session.page > 0) {
      session.page--;
      save();
      renderPage(true);
    }
  }
  function svgRadar(rows) {
    const cx = 250, cy = 216, r = 141, rings = [0.25, 0.5, 0.75, 1];
    const dims = data.dimensions;
    const point = (n, ratio) => {
      const theta = -Math.PI / 2 + n * 2 * Math.PI / dims.length;
      return [cx + Math.cos(theta) * r * ratio, cy + Math.sin(theta) * r * ratio];
    };
    const coords = pts => pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
    const grid = rings.map(ratio =>
      '<polygon class="ta-radar-ring" points="' + coords(dims.map((_, i) => point(i, ratio))) + '"></polygon>'
    ).join("");
    const spokes = dims.map((_, i) => {
      const [x, y] = point(i, 1);
      return '<line class="ta-radar-spoke" x1="' + cx + '" y1="' + cy +
        '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"></line>';
    }).join("");
    const shape = '<polygon class="ta-radar-shape" points="' + coords(rows.map((row, i) =>
      point(i, row.total / 100))) + '"></polygon>';
    const dots = rows.map((row, i) => {
      const [x, y] = point(i, row.total / 100);
      return '<circle class="ta-radar-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4"></circle>';
    }).join("");
    const labels = dims.map((d, i) => {
      const theta = -Math.PI / 2 + i * 2 * Math.PI / dims.length;
      const x = cx + Math.cos(theta) * (r + 43);
      const y = cy + Math.sin(theta) * (r + 29);
      const anchor = Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end";
      return '<text class="ta-radar-label" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
        '" text-anchor="' + anchor + '">' + escapeHtml(lang === "en" ? d.en : d.zh) + '</text>';
    }).join("");
    return '<svg viewBox="0 0 500 450" role="img" aria-label="' +
      escapeHtml(say("八维自我报告图谱；具体得分见右侧列表", "Eight-dimension self-report profile; exact values in the adjacent list")) +
      '" xmlns="http://www.w3.org/2000/svg">' + grid + spokes + shape + dots + labels + '</svg>';
  }
  function rowMarkup(row, i) {
    const d = data.dimensions.find(d => d.id === row.id);
    const facets = [
      [say("兴趣", "Motivation"), row.facets.interest],
      [say("上手感", "Ease"), row.facets.ease],
      [say("实践", "Practice"), row.facets.evidence]
    ];
    return '<article class="ta-score-row"><div class="ta-score-row-top"><span class="ta-score-name">' +
      '<span class="ta-score-icon" style="--ta-dot:' + d.color + '">' + escapeHtml(d.icon) + '</span>' +
      escapeHtml(lang === "en" ? d.en : d.zh) + '</span><strong>' +
      row.total.toFixed(1) + '<small>/100</small></strong></div>' +
      '<div class="ta-score-track"><span style="width:' + row.total + '%;--ta-dot:' + d.color + '"></span></div>' +
      '<div class="ta-facet-mini">' + facets.map(pair =>
        '<span>' + pair[0] + ' ' + pair[1].toFixed(0) + '</span>').join('') + '</div></article>';
  }
  function experimentMarkup(row, rank) {
    const d = data.dimensions.find(d => d.id === row.id);
    return '<article class="ta-experiment"><span class="ta-experiment-index">0' + (rank + 1) +
      '</span><div><h3>' + escapeHtml(lang === "en" ? d.en : d.zh) +
      '</h3><p>' + escapeHtml(lang === "en" ? d.actionEn : d.action) + '</p></div></article>';
  }
  function renderResults(moveFocus) {
    if (!session) return;
    try {
      report = core.score(data, session.mode, session.answers);
    } catch (err) {
      session.completed = false; save(); renderPage(true); return;
    }
    setScreen("results");
    const top = report.top;
    const first = top[0];
    const second = top[1];
    el("ta-result-title").textContent = say("你的天赋探索图谱", "Your talent exploration profile");
    el("ta-result-summary").textContent = say(
      "在这次自我报告中，" + top.map(x => x.zh).join("、") +
      " 是你得分较高的方向。它们代表当前感受到的兴趣、上手感与实践经验，而不是先天能力的判定。",
      "In this self-report, your leading directions are " + top.map(x => x.en).join(", ") +
      ". They reflect present motivation, perceived ease and practice, not innate ability.");
    el("ta-result-pill").textContent = say(
      session.mode === "full" ? "72 题 · 完整探索" : "48 题 · 快速探索",
      session.mode === "full" ? "72 items · Full" : "48 items · Quick");
    el("ta-radar").innerHTML = svgRadar(report.rows);
    el("ta-scores").innerHTML = report.ranked.map(rowMarkup).join("");
    el("ta-experiments").innerHTML = top.map(experimentMarkup).join("");
    const gaps = report.rows.filter(x => x.facets.interest - x.facets.evidence >= 25)
      .sort((a, b) => (b.facets.interest - b.facets.evidence) - (a.facets.interest - a.facets.evidence));
    const gap = gaps[0];
    el("ta-growth").textContent = gap
      ? say("值得进一步验证：" + gap.zh + " 的兴趣信号高于近期实践信号。建议先安排低成本实践，而不是认定自己缺乏能力。",
            "Worth exploring: " + gap.en + " has stronger motivation than recent practice. Try a low-cost experiment before drawing conclusions.")
      : say("你的兴趣与实践信号没有出现明显的大幅差距。可以优先从排名靠前的方向选择一个两周项目。",
            "Your motivation and recent practice do not show a large gap. Try a two-week project in a leading direction.");
    el("ta-quality").hidden = !report.responseQuality.caution;
    el("ta-quality").textContent = say(
      "结果提示：本次回答较集中或选择中立项较多，各维度的细微分差可能不稳定。建议结合实际作品和他人反馈理解结果。",
      "Interpret with care: responses are concentrated or often neutral. Small differences may be unstable; compare with actual work and feedback.");
    el("ta-comparison").textContent = Math.abs(first.total - second.total) < 3
      ? say("前两项得分很接近，建议把它们看作并列探索方向。", "The top two scores are very close; consider both as leading directions.")
      : say("排名是你本次回答的相对排序，不代表与其他人的比较。", "Rankings describe this session only, not how you compare with others.");
    if (moveFocus) {
      el("ta-result-title").setAttribute("tabindex", "-1");
      el("ta-result-title").focus({ preventScroll: true });
      window.scrollTo({ top: Math.max(0, app.getBoundingClientRect().top + window.scrollY - 84), behavior: "smooth" });
    }
  }
  function summaryText() {
    if (!report) return "";
    return [
      "Talent Atlas | " + (lang === "en" ? "Talent exploration" : "天赋探索图谱"),
      "Mode: " + report.mode + " · " + report.count + " items · v" + report.version,
      ...report.ranked.map((row, i) => String(i + 1) + ". " + (lang === "en" ? row.en : row.zh) +
        ": " + row.total.toFixed(1) + "/100 (" +
        row.facets.interest.toFixed(1) + " / " + row.facets.ease.toFixed(1) + " / " +
        row.facets.evidence.toFixed(1) + ")"),
      say("注意：分数是主观作答的线性换算，不是常模百分位或能力测验。",
          "Scores are linear transformations of self-ratings, not aptitude measures or population percentiles."),
      "https://yxwang1215.top/tests/talent/"
    ].join("\n");
  }
  function exportJSON() {
    if (!report) return;
    const output = { ...report, answers: undefined,
      dataPrivacy: "Only aggregated domain scores are included; individual responses remain in the browser." };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "talent-atlas-results.json";
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(summaryText());
      el("ta-copy").textContent = say("已复制 ✓", "Copied ✓");
    } catch (_) {
      window.prompt(say("复制以下结果摘要", "Copy your results"), summaryText());
    }
  }

  $$("[data-start-mode]").forEach(button =>
    button.addEventListener("click", () => begin(button.dataset.startMode)));
  el("ta-resume-button").addEventListener("click", resume);
  el("ta-form").addEventListener("change", event => {
    const target = event.target;
    if (!target.matches('input[type="radio"][data-id]') || !session) return;
    const value = Number(target.value);
    if (value >= 1 && value <= 5) {
      session.answers[target.dataset.id] = value;
      save();
      updateControls();
    }
  });
  el("ta-next").addEventListener("click", next);
  el("ta-previous").addEventListener("click", previous);
  el("ta-exit").addEventListener("click", () => { setScreen("intro"); updateResume(); });
  el("ta-language").addEventListener("click", () => {
    lang = lang === "zh" ? "en" : "zh"; applyLocale();
  });
  el("ta-save-json").addEventListener("click", exportJSON);
  el("ta-print").addEventListener("click", () => window.print());
  el("ta-copy").addEventListener("click", copy);
  el("ta-restart").addEventListener("click", () => {
    if (!window.confirm(say("清除当前问卷和结果，并重新开始？", "Clear your responses and start again?"))) return;
    safeRemove(KEY); session = null; report = null; setScreen("intro"); updateResume();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  el("ta-clear").addEventListener("click", () => {
    if (!session || window.confirm(say("删除保存在本浏览器的所有测试答案与结果？",
                                       "Delete all locally saved assessment answers and results?"))) {
      safeRemove(KEY); session = null; report = null; updateResume(); setScreen("intro");
    }
  });
  applyLocale();
  setScreen("intro");
  updateResume();
})();
