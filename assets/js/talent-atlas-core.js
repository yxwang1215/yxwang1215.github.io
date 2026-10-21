/* Talent Atlas core: deterministic questionnaire and transparent self-report scoring.
 * 0–100 values are rescaled item means, never population percentiles.
 */
(function (root, factory) {
  "use strict";
  const core = factory();
  if (typeof module === "object" && module.exports) module.exports = core;
  root.TALENT_ATLAS_CORE = core;
})(typeof window === "undefined" ? globalThis : window, function () {
  "use strict";
  const FACETS = ["interest", "ease", "evidence"];
  function questions(data, mode) {
    if (!data || !data.dimensions || !data.modes || !(mode in data.modes)) {
      throw new Error("Invalid assessment data or mode");
    }
    const count = data.modes[mode];
    const output = [];
    for (let slot = 0; slot < count; slot++) {
      for (const facet of FACETS) {
        for (let j = 0; j < data.dimensions.length; j++) {
          const dim = data.dimensions[(j + slot * 3 + FACETS.indexOf(facet)) % data.dimensions.length];
          const item = dim[facet] && dim[facet][slot];
          if (!Array.isArray(item) || item.length !== 2) throw new Error("Incomplete item bank");
          output.push({
            id: dim.id + "_" + facet + "_" + slot,
            domain: dim.id, facet: facet, slot: slot,
            zh: item[0], en: item[1],
            reverse: facet === "ease" && slot === 1
          });
        }
      }
    }
    return output;
  }
  function normalized(mean) { return Math.round((mean - 1) * 25 * 10) / 10; }
  function score(data, mode, answers) {
    const qs = questions(data, mode);
    if (!answers || typeof answers !== "object") throw new Error("Missing answers");
    const grouped = {};
    data.dimensions.forEach(d => {
      grouped[d.id] = { id: d.id, zh: d.zh, en: d.en, facets: {}, total: 0 };
      FACETS.forEach(f => { grouped[d.id].facets[f] = []; });
    });
    for (const q of qs) {
      const value = answers[q.id];
      if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error("Incomplete or invalid answers: " + q.id);
      grouped[q.domain].facets[q.facet].push(q.reverse ? 6 - value : value);
    }
    const rows = data.dimensions.map(d => {
      const item = grouped[d.id], facets = {};
      FACETS.forEach(f => {
        const vs = item.facets[f];
        facets[f] = normalized(vs.reduce((a, b) => a + b, 0) / vs.length);
      });
      const w = data.weights;
      const total = Math.round((facets.interest * w.interest + facets.ease * w.ease + facets.evidence * w.evidence) * 10) / 10;
      return { id: d.id, zh: d.zh, en: d.en, total, facets };
    });
    const ranked = [...rows].sort((a, b) => b.total - a.total || data.dimensions.findIndex(d => d.id === a.id) - data.dimensions.findIndex(d => d.id === b.id));
    const raw = qs.map(q => answers[q.id]);
    const mean = raw.reduce((s, x) => s + x, 0) / raw.length;
    const sd = Math.sqrt(raw.reduce((s, x) => s + (x - mean) ** 2, 0) / raw.length);
    const neutralRate = raw.filter(x => x === 3).length / raw.length;
    const suspicious = sd < 0.55 || neutralRate > 0.6;
    return {
      version: data.version, mode, count: qs.length, completedAt: new Date().toISOString(),
      rows, ranked, top: ranked.slice(0, 3), responseQuality: {
        neutralRate: Math.round(neutralRate * 100),
        spread: Math.round(sd * 100) / 100,
        caution: suspicious
      },
      weights: { ...data.weights },
      notice: "Exploratory self-report profile; values are rescaled agreement scores, not aptitude tests or population percentiles."
    };
  }
  return Object.freeze({ FACETS, questions, score });
});
