/* Run with: node --test tests/talent-atlas.test.cjs */
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = global;
require("../assets/js/talent-atlas-data.js");
const core = require("../assets/js/talent-atlas-core.js");
const data = global.TALENT_ATLAS_DATA;
const answer = (qs, fn) => Object.fromEntries(qs.map(q => [q.id, fn(q)]));

test("eight bilingual domains, complete original item bank, stable IDs", () => {
  assert.equal(data.dimensions.length, 8);
  assert.equal(new Set(data.dimensions.map(x => x.id)).size, 8);
  for (const d of data.dimensions) {
    for (const f of core.FACETS) {
      assert.equal(d[f].length, 3, d.id + ":" + f);
      for (const item of d[f]) {
        assert.equal(item.length, 2);
        assert.ok(item[0].length > 8);
        assert.ok(item[1].length > 14);
      }
    }
  }
  for (const mode of ["quick", "full"]) {
    const qs = core.questions(data, mode);
    assert.equal(qs.length, mode === "quick" ? 48 : 72);
    assert.equal(new Set(qs.map(q => q.id)).size, qs.length);
    assert.deepEqual(qs, core.questions(data, mode));
    assert.equal(qs.filter(q => q.reverse).length, 8);
    for (const d of data.dimensions) {
      assert.equal(qs.filter(q => q.domain === d.id).length, mode === "quick" ? 6 : 9);
    }
    for (const f of core.FACETS) {
      assert.equal(qs.filter(q => q.facet === f).length, mode === "quick" ? 16 : 24);
    }
  }
});

test("neutral answers score 50/100, with no percentile interpretation", () => {
  for (const mode of ["quick", "full"]) {
    const qs = core.questions(data, mode);
    const result = core.score(data, mode, answer(qs, () => 3));
    assert.equal(result.count, qs.length);
    assert.equal(result.rows.length, 8);
    assert.ok(result.rows.every(row => row.total === 50));
    assert.ok(result.rows.every(row => Object.values(row.facets).every(v => v === 50)));
    assert.equal(result.responseQuality.neutralRate, 100);
    assert.equal(result.responseQuality.caution, true);
    assert.match(result.notice, /not.*percentile/i);
  }
});

test("reverse-keyed items preserve intended direction", () => {
  for (const mode of ["quick", "full"]) {
    const qs = core.questions(data, mode);
    const result = core.score(data, mode, answer(qs, q =>
      q.domain === "analysis" ? (q.reverse ? 1 : 5) : 3
    ));
    assert.equal(result.ranked[0].id, "analysis");
    assert.equal(result.ranked[0].total, 100);
    assert.deepEqual(result.ranked[0].facets, { interest: 100, ease: 100, evidence: 100 });
    assert.ok(result.rows.filter(row => row.id !== "analysis").every(row => row.total === 50));
  }
});

test("incomplete and invalid answers fail closed", () => {
  const qs = core.questions(data, "quick");
  const all = answer(qs, () => 3);
  delete all[qs[0].id];
  assert.throws(() => core.score(data, "quick", all), /Incomplete/);
  all[qs[0].id] = 9;
  assert.throws(() => core.score(data, "quick", all), /invalid/);
  assert.throws(() => core.questions(data, "unknown"), /Invalid/);
});

test("item bank, report and navigation are loaded through the correct pages", () => {
  const read = p => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
  const page = read("tests/talent/index.html");
  const layout = read("_layouts/default.html");
  const nav = read("_data/navigation.yml");
  const hub = read("_pages/tests.html");
  assert.match(page, /id="ta-form"/);
  assert.match(page, /id="ta-results"/);
  assert.match(page, /id="ta-clear"/);
  assert.match(layout, /talent-atlas-data\.js/);
  assert.match(layout, /talent-atlas-core\.js/);
  assert.match(layout, /talent-atlas-app\.js/);
  assert.match(layout, /test-lab\.css/);
  assert.match(nav, /url: "\/tests\/"/);
  assert.match(hub, /site\.data\.tests\.items/);
});
