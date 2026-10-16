const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const read = p => readFileSync(join(__dirname, "..", p), "utf8");
const page = read("_pages/diary.md");
const css = read("assets/css/site-polish-journal.css");

test("latest Journal post lives in the same card loop as every other entry", () => {
  assert.match(page, /<section id="latest" class="journal-list journal-list--v2"/);
  assert.match(page, /{% for entry in diary_entries %}/);
  assert.doesNotMatch(page, /offset:1|journal-featured|journal-feature-section|featured_search_text/);
  assert.equal((page.match(/data-journal-item/g) || []).length, 1);
  assert.equal((page.match(/id="latest"/g) || []).length, 1);
  assert.match(page, /{% if forloop.first %}<span class="journal-card__latest-label">最新<\/span>{% endif %}/);
  assert.match(page, /id="all" class="journal-discovery"/);
  assert.match(page, /data-journal-filter="all"/);
  assert.match(page, /id="archive"/);
  assert.match(page, /<a href="#latest">开始阅读<\/a>/);
});

test("all Journal cards use compact square covers with responsive columns", () => {
  assert.match(css, /\.journal-list\.journal-list--v2\s*\{\s*display:\s*grid;/);
  for (const cols of [4, 3, 2]) {
    assert.ok(css.includes("repeat(" + cols + ", minmax(0, 1fr))"), "Missing " + cols + "-column layout");
  }
  assert.match(css, /\.journal-card:nth-child\(n\) \.journal-card__cover\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1;/);
  assert.match(css, /\.journal-list--v2 \.journal-card__cover img\s*\{[^}]*object-fit:\s*cover;/);
  assert.match(css, /\.journal-list--v2 \.journal-card__footer\s*\{\s*margin-top:\s*auto;/);
  assert.match(css, /@media \(max-width: 340px\)/);
  assert.doesNotMatch(css, /\.journal-featured\s*\{/);
});

test("Journal index keeps its cache keys distinct from older CSS", () => {
  assert.match(read("assets/css/site-polish.css"), /site-polish-journal\.css\?v=20261016-unified-journal-grid/);
  assert.match(read("_includes/head/custom.html"), /site-polish\.css[^"]*20261016-nav-journal-uniform/);
});
