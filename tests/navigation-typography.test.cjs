const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const css = readFileSync(join(__dirname, '../assets/css/navigation-directory.css'), 'utf8');
const layout = readFileSync(join(__dirname, '../_layouts/default.html'), 'utf8');
const data = readFileSync(join(__dirname, '../_data/site_directory.yml'), 'utf8');
const page = readFileSync(join(__dirname, '../_pages/navigation.html'), 'utf8');
const script = readFileSync(join(__dirname, '../assets/js/navigation-directory.js'), 'utf8');

test('navigation retains plain title and no decorative counters', () => {
  assert.ok(page.includes('<h1>导航</h1>'));
  for (const old of ['SITE INDEX', 'MAIN', 'GROUPS', '常用入口，清晰呈现',
    'site-directory__hero-count', 'site-directory__directory-number']) {
    assert.ok(!page.includes(old), 'old decorative element remains: ' + old);
  }
});

test('navigation uses official shadcn/ui Blue + Zinc semantic theme values', () => {
  assert.ok(css.includes('shadcn-ui/ui apps/v4/registry/themes.ts'));
  const tokens = {
    'nav-background': 'oklch(1 0 0)',
    'nav-foreground': 'oklch(0.141 0.005 285.823)',
    'nav-primary': 'oklch(0.488 0.243 264.376)',
    'nav-primary-foreground': 'oklch(0.97 0.014 254.604)',
    'nav-secondary': 'oklch(0.967 0.001 286.375)',
    'nav-muted-foreground': 'oklch(0.552 0.016 285.938)',
    'nav-border': 'oklch(0.92 0.004 286.32)'
  };
  for (const [name, value] of Object.entries(tokens)) {
    assert.ok(css.includes('--' + name + ': ' + value + ';'), name + ' missing');
  }
  for (const obsolete of ['#aa6237','#a44d68','#111c2d','#2563eb','#fbeef3']) {
    assert.ok(!css.includes(obsolete), 'unrelated hand-selected color remains: ' + obsolete);
  }
});

test('responsive sections, search affordances, and external workspace', () => {
  assert.ok(css.includes('grid-template-columns: repeat(2,minmax(0,1fr))'));
  assert.ok(css.includes('grid-column: 1/-1'));
  assert.ok(css.includes('@media (max-width: 940px)'));
  assert.ok(css.includes('@media (max-width: 520px)'));
  assert.ok(css.includes('.site-directory__search:focus-within'));
  assert.ok(script.includes('site-directory__cards--single'));
  assert.ok(page.includes('id="site-directory-search"'));
  assert.ok(page.includes('site-directory__directory--external'));
  assert.ok(page.includes('site-directory__feature-action'));
  assert.ok(layout.includes('navigation-directory.css'));
  assert.ok(layout.includes('20261016-shadcn-blue-zinc-v5'));
});

test('all existing home, tools, and Overleaf paths still resolve', () => {
  assert.deepEqual([...data.matchAll(/^  - id: (\w+)$/gm)].map(m => m[1]),
    ['home', 'tools', 'overleaf']);
  for (const url of ['/research/', '/journey/', '/journal/', '/#publications',
    '/#projects', '/tools/#pdf/organize']) {
    assert.ok(data.includes('url: "' + url + '"'), 'lost destination: ' + url);
  }
  assert.ok(['id="research"','id="journey"','id="journal"'].every(x=>page.includes(x)));
  assert.ok(data.includes('url: "https://overleaf.yxwang1215.top/"'));
  assert.ok(data.includes('    external: true'));
  assert.ok(page.includes('href="{{ directory.url }}" target="_blank" rel="noopener noreferrer"'));
  assert.ok(page.includes('href="{{ item.url | relative_url }}"'));
});
