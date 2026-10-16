const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const css = readFileSync(join(__dirname, '../assets/css/navigation-directory.css'), 'utf8');
const layout = readFileSync(join(__dirname, '../_layouts/default.html'), 'utf8');

test('navigation uses one scoped semantic palette with no legacy green treatment', () => {
  assert.ok(css.includes('/* Navigation / 2026.10 — neutral directory UI.'));
  for (const token of ['ink', 'secondary', 'muted', 'accent', 'line', 'surface', 'white']) {
    assert.ok(css.includes('--nav-' + token + ':'), token + ' token missing');
  }
  for (const old of ['--dir-green', '#315e45', '#f2f5ef', '#588466', '#526b59', 'balanced type scale']) {
    assert.ok(!css.includes(old), old + ' should no longer appear');
  }
  assert.ok(css.includes('body.navigation-page'));
});

test('font scale brings small labels up and large titles down', () => {
  const tokens = {
    label: '.9375rem',
    helper: '1rem',
    body: '1.0625rem',
    entry: '1.125rem',
    section: '1.1875rem',
    card: 'clamp(1.5625rem, 2.2vw, 1.75rem)',
    hero: 'clamp(2.1875rem, 3.2vw, 2.625rem)'
  };
  for (const [name, value] of Object.entries(tokens)) {
    assert.ok(css.includes('--nav-type-' + name + ': ' + value + ';'), name + ' definition missing');
    assert.ok(css.includes('var(--nav-type-' + name + ')'), name + ' has no active use');
  }
  assert.ok(!css.includes('4.8rem'));
  assert.ok(css.includes('font-size: var(--nav-type-hero)'));
  assert.ok(css.includes('font-size: var(--nav-type-card)'));
  assert.ok(css.includes('font-size: var(--nav-type-entry)'));
});

test('navigation layout retains responsive cards and search affordances', () => {
  assert.ok(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
  assert.ok(css.includes('display: flex;\n  flex-direction: column;\n  position: relative;'));
  assert.ok(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
  assert.ok(css.includes('@media (max-width: 980px)'));
  assert.ok(css.includes('@media (max-width: 620px)'));
  assert.ok(css.includes('.site-directory__search:focus-within'));
  assert.ok(css.includes('overflow-wrap: break-word'));
  assert.ok(layout.includes('navigation-directory.css'));
  assert.ok(layout.includes('three-groups-v1'));
});
test('navigation keeps existing sections and adds independent Overleaf entry', () => {
  const data = readFileSync(join(__dirname, '../_data/site_directory.yml'), 'utf8');
  const page = readFileSync(join(__dirname, '../_pages/navigation.html'), 'utf8');
  const script = readFileSync(join(__dirname, '../assets/js/navigation-directory.js'), 'utf8');
  assert.deepEqual([...data.matchAll(/^  - id: (\w+)$/gm)].map(m => m[1]), ['home', 'tools', 'overleaf']);
  for (const link of ['/research/', '/journey/', '/journal/', '/#publications', '/#projects', '/tools/#pdf/organize']) {
    assert.ok(data.includes('url: "' + link + '"'), 'missing original destination: ' + link);
  }
  assert.ok(page.includes('id="research"') && page.includes('id="journey"') && page.includes('id="journal"'));
  assert.ok(data.includes('url: "https://overleaf.yxwang1215.top/login"'));
  assert.ok(data.includes('    external: true'));
  assert.ok(page.includes('site-directory__directory--external'));
  assert.ok(page.includes('{% if directory.external %}{{ directory.url }}{% else %}{{ directory.url | relative_url }}{% endif %}'));
  assert.ok(css.includes('grid-column: 1 / -1;'));
  assert.ok(script.includes('site-directory__cards--single'));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr)'));
});
