const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const css = readFileSync(join(__dirname, '../assets/css/navigation-directory.css'), 'utf8');
const layout = readFileSync(join(__dirname, '../_layouts/default.html'), 'utf8');
test('navigation type hierarchy is scoped and declared after the existing rules', () => {
  const marker = '/* /navigation/ — balanced type scale (scoped, loaded after base rules). */';
  const start = css.indexOf(marker);
  assert.ok(start > css.indexOf('.site-directory__hero {'), 'The balanced scale must win the CSS cascade');
  const scale = css.slice(start);
  for (const token of ['caption', 'small', 'body', 'entry', 'section', 'card', 'hero']) {
    assert.ok(scale.includes('--dir-type-' + token + ':'), token + ' definition missing');
    assert.ok(scale.includes('var(--dir-type-' + token + ')'), token + ' is unused');
  }
  assert.ok(scale.includes('overflow-wrap: break-word'));
  assert.ok(scale.includes('font-size: var(--dir-type-hero)'));
  assert.ok(scale.includes('font-size: var(--dir-type-card)'));
  assert.ok(scale.includes('font-size: var(--dir-type-entry)'));
});
test('mobile navigation type remains independently tuned and cache-busted', () => {
  assert.ok(css.includes('@media (max-width: 560px)'));
  assert.ok(css.includes('clamp(2.35rem, 8vw, 2.75rem)'));
  assert.ok(css.includes('clamp(1.85rem, 5.6vw, 1.95rem)'));
  assert.ok(layout.includes('navigation-directory.css'));
  assert.ok(layout.includes('20261016-balanced-type-1'));
});
