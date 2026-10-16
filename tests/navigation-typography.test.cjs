const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const css = readFileSync(join(__dirname, '../assets/css/navigation-directory.css'), 'utf8');
const layout = readFileSync(join(__dirname, '../_layouts/default.html'), 'utf8');
const data = readFileSync(join(__dirname, '../_data/site_directory.yml'), 'utf8');
const page = readFileSync(join(__dirname, '../_pages/navigation.html'), 'utf8');
const script = readFileSync(join(__dirname, '../assets/js/navigation-directory.js'), 'utf8');

test('navigation page uses a plain heading without decorative counters or slogan copy', () => {
  assert.ok(page.includes('<h1>导航</h1>'));
  for (const old of ['SITE INDEX', 'MAIN', 'GROUPS', '常用入口，清晰呈现', 'site-directory__hero-count', 'site-directory__directory-number', 'site-directory__eyebrow']) {
    assert.ok(!page.includes(old), 'obsolete promotional header element: ' + old);
  }
  assert.ok(!data.includes('number: "03"'));
  assert.ok(!data.includes('eyebrow: "LATEX / ONLINE EDITOR"'));
});

test('navigation typography uses system fonts and three restrained accent colors', () => {
  assert.ok(css.includes('/* Navigation page: muted editorial palette'));
  assert.ok(css.includes('"PingFang SC"'));
  assert.ok(css.includes('font-size: clamp(1.875rem, 3vw, 2.125rem)'));
  assert.ok(css.includes('font-size: 1.0625rem'));
  assert.ok(css.includes('font-size: .9375rem'));
  for (const old of ['#5a52c7', '#4841ac', '#f2f1ff', 'Geist Sans', 'linear-gradient(']) {
    assert.ok(!css.includes(old), 'old ornamental styling remains: ' + old);
  }
  for (const accent of ['#3167a9', '#aa6237', '#a44d68']) {
    assert.ok(css.includes(accent), 'missing destination accent: ' + accent);
  }
  assert.ok(css.includes('--nav-section-soft'));
  assert.ok(css.includes('background: var(--nav-section-soft);'));
  assert.ok(css.includes('background: var(--nav-section-accent);'));
  assert.ok(css.includes('body.navigation-page'));
  assert.ok(css.includes(':focus-visible'));
});

test('layout preserves responsive group cards, search, and Overleaf as its own card', () => {
  assert.ok(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
  assert.ok(css.includes('grid-column: 1 / -1;'));
  assert.ok(css.includes('@media (max-width: 960px)'));
  assert.ok(css.includes('@media (max-width: 540px)'));
  assert.ok(css.includes('.site-directory__search:focus-within'));
  assert.ok(script.includes('site-directory__cards--single'));
  assert.ok(page.includes('id="site-directory-search"'));
  assert.ok(page.includes('site-directory__directory--external'));
  assert.ok(page.includes('site-directory__directory-icon'));
  assert.ok(page.includes("{% when 'home' %}"));
  assert.ok(page.includes("{% when 'tools' %}"));
  assert.ok(page.includes("{% when 'overleaf' %}"));
  assert.ok(layout.includes('navigation-directory.css'));
  assert.ok(layout.includes('20261016-color-cards-v3'));
});

test('personal, tools, and Overleaf links remain intact', () => {
  assert.deepEqual([...data.matchAll(/^  - id: (\w+)$/gm)].map(m => m[1]), ['home', 'tools', 'overleaf']);
  for (const link of ['/research/', '/journey/', '/journal/', '/#publications', '/#projects', '/tools/#pdf/organize']) {
    assert.ok(data.includes('url: "' + link + '"'), 'missing original destination: ' + link);
  }
  assert.ok(page.includes('id="research"') && page.includes('id="journey"') && page.includes('id="journal"'));
  assert.ok(data.includes('url: "https://overleaf.yxwang1215.top/login"'));
  assert.ok(data.includes('    external: true'));
  assert.ok(page.includes('target="_blank" rel="noopener noreferrer"'));
  assert.ok(page.includes('{% if directory.external %}{{ directory.url }}{% else %}{{ directory.url | relative_url }}{% endif %}'));
});
