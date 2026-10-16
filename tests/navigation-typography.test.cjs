const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const css = readFileSync(join(__dirname, '../assets/css/navigation-directory.css'), 'utf8');
const layout = readFileSync(join(__dirname, '../_layouts/default.html'), 'utf8');
const data = readFileSync(join(__dirname, '../_data/site_directory.yml'), 'utf8');
const page = readFileSync(join(__dirname, '../_pages/navigation.html'), 'utf8');
const script = readFileSync(join(__dirname, '../assets/js/navigation-directory.js'), 'utf8');

test('navigation uses functional copy, without numbered blocks or generic slogans', () => {
  assert.ok(page.includes('<h1>导航</h1>'));
  for (const old of ['SITE INDEX', 'MAIN', 'GROUPS', '常用入口，清晰呈现', 'site-directory__hero-count', 'site-directory__directory-number', 'site-directory__eyebrow']) {
    assert.ok(!page.includes(old), 'old decorative heading: ' + old);
  }
  assert.ok(!data.includes('number: "03"'));
});

test('navigation uses a single cool-blue accent and dark workspace banner', () => {
  assert.ok(css.includes('/* Navigation / 2026.10 — focused, contemporary directory layout.'));
  assert.ok(css.includes('"PingFang SC"'));
  assert.ok(css.includes('--nav-accent: #2563eb;'));
  assert.ok(css.includes('background: #111c2d;'));
  assert.ok(css.includes('background: #f7f8fb;'));
  for (const old of ['#aa6237', '#a44d68', '#fbeef3', '#fff2e8', '--nav-section-soft', 'SITE INDEX']) {
    assert.ok(!css.includes(old), 'old multicolor design remains: ' + old);
  }
  assert.ok(css.includes(':focus-visible'));
});

test('layout is two main columns with responsive, independent Overleaf feature', () => {
  assert.ok(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
  assert.ok(css.includes('grid-column: 1 / -1;'));
  assert.ok(css.includes('@media (max-width: 960px)'));
  assert.ok(css.includes('@media (max-width: 560px)'));
  assert.ok(css.includes('.site-directory__search:focus-within'));
  assert.ok(css.includes('.site-directory__cards--single'));
  assert.ok(script.includes('site-directory__cards--single'));
  assert.ok(page.includes('id="site-directory-search"'));
  assert.ok(page.includes('site-directory__directory--external'));
  assert.ok(page.includes('site-directory__feature-action'));
  assert.ok(layout.includes('navigation-directory.css'));
  assert.ok(layout.includes('20261016-graphite-blue-v4'));
});

test('all original destinations and legacy anchors remain', () => {
  assert.deepEqual([...data.matchAll(/^  - id: (\w+)$/gm)].map(m => m[1]), ['home', 'tools', 'overleaf']);
  for (const link of ['/research/', '/journey/', '/journal/', '/#publications', '/#projects', '/tools/#pdf/organize']) {
    assert.ok(data.includes('url: "' + link + '"'), 'missing destination: ' + link);
  }
  assert.ok(page.includes('id="research"') && page.includes('id="journey"') && page.includes('id="journal"'));
  assert.ok(data.includes('url: "https://overleaf.yxwang1215.top/login"'));
  assert.ok(data.includes('    external: true'));
  assert.ok(page.includes('href="{{ directory.url }}" target="_blank" rel="noopener noreferrer"'));
  assert.ok(page.includes('href="{{ item.url | relative_url }}"'));
});
