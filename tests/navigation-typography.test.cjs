"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const source = path => readFileSync(join(__dirname, "..", path), "utf8");
const css = source("assets/css/navigation-directory.css");
const layout = source("_layouts/default.html");
const data = source("_data/site_directory.yml");
const page = source("_pages/navigation.html");
const script = source("assets/js/navigation-directory.js");
const works = source("_includes/home-works.html");

test("navigation preserves clear heading and excludes obsolete decorative counters", () => {
  assert.ok(page.includes("<h1>Navigation</h1>"));
  for (const obsolete of ["site-directory__hero-count", "site-directory__directory-number"]) {
    assert.ok(!page.includes(obsolete), "Old counter remains: " + obsolete);
  }
  assert.match(page, /id="site-directory-search"/);
});

test("navigation styles follow current homepage palette and readable font sizing", () => {
  for (const token of ["--rounded-font", "--home-ink", "--home-muted", "--home-rose", "--home-line"]) {
    assert.ok(css.includes(token), "Missing shared theme token: " + token);
  }
  assert.match(css, /font-size:\s*18px/);
  assert.match(css, /body\.navigation-page\.subpage-shell/);
  assert.ok(!css.includes("shadcn-ui/ui apps/v4/registry/themes.ts"),
    "Old Blue/Zinc styling should not replace the homepage palette");
});

test("responsive grid, search, and external workspace remain supported", () => {
  assert.match(css, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.ok(css.includes("@media (max-width: 940px)"));
  assert.ok(css.includes("@media (max-width: 620px)"));
  assert.ok(css.includes(".site-directory__search:focus-within"));
  assert.ok(script.includes("site-directory__cards--single"));
  assert.ok(page.includes("site-directory__directory--external"));
  assert.ok(page.includes("site-directory__feature-action"));
  assert.ok(layout.includes("navigation-directory.css"));
});

test("Works, Tools, Test Lab, and Overleaf destinations remain discoverable", () => {
  assert.deepEqual([...data.matchAll(/^  - id: (\w+)$/gm)].map(m => m[1]),
    ["home", "tools", "tests", "dog", "overleaf"]);
  for (const url of ["/research/", "/journey/", "/journal/", "/#works", "/#service",
                     "/tools/#pdf/organize", "/tests/talent/"]) {
    assert.ok(data.includes('url: "' + url + '"'), "Lost destination: " + url);
  }
  for (const id of ["works", "publications", "projects"]) {
    const count = [...works.matchAll(new RegExp('id="' + id + '"', "g"))].length;
    assert.equal(count, 1, "Missing/duplicated homepage anchor: " + id);
  }
  assert.ok(['id="research"', 'id="journey"', 'id="journal"'].every(x => page.includes(x)));
  assert.ok(data.includes('url: "https://overleaf.yxwang1215.top/"'));
  assert.ok(data.includes("    external: true"));
  assert.ok(page.includes('href="{{ directory.url }}" target="_blank" rel="noopener noreferrer"'));
  assert.ok(page.includes('href="{{ item.url | relative_url }}"'));
});
