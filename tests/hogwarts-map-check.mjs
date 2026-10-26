import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const atlasText = readFileSync('assets/js/hogwarts-atlas.js', 'utf8');
const geographyText = readFileSync('assets/js/hogwarts-geography.js', 'utf8');
const mapText = readFileSync('assets/js/hogwarts-map.js', 'utf8');
const shell = readFileSync('_includes/hogwarts-explorer.html', 'utf8');
const css = readFileSync('assets/css/hogwarts-map.css', 'utf8');
const context = { window: {}, document: { getElementById: () => null } };
for (const [name, script] of [['atlas', atlasText], ['geography', geographyText], ['map', mapText]]) {
  vm.runInNewContext(script, context, { filename: 'hogwarts-' + name + '.js', timeout: 1000 });
}
const atlas = context.window.HogwartsAtlas;
const geography = context.window.HogwartsGeography;
const map = context.window.HogwartsMapModel;
assert.ok(atlas && geography && map, 'Map model must use the shared room graph and geographic groups');
assert.equal(map.sections, geography.sections, 'Private and public maps must share geographic groups');
assert.equal(map.sections.length, 7, 'Six public regions and one concealed section are expected');
const coords = Array.from(map.sections).flatMap(section =>
  Object.entries(section.coords).map(([id, xy]) => ({ id, xy, section: section.id })));
assert.equal(coords.length, 53, 'Every scene needs one map position');
assert.equal(new Set(coords.map(item => item.id)).size, 53, 'Map must not duplicate scenes');
assert.deepEqual(coords.map(item => item.id).sort(), Object.keys(atlas.rooms).sort());
for (const { id, xy, section } of coords) {
  assert.equal(xy.length, 2);
  assert.ok(Number.isFinite(xy[0]) && Number.isFinite(xy[1]), 'Non-numeric position: ' + id);
  assert.ok(xy[0] > 60 && xy[0] < 950 && xy[1] > 50 && xy[1] < 610, 'Position outside frame: ' + id);
  assert.equal(map.zoneOf(id), section);
  assert.equal(geography.nodes[id].group, section);
}
assert.equal(map.zoneOf('missing-room'), null);

const pantryPath = ['gate', 'entry', 'basementPassage', 'kitchens', 'pantry'];
const visited = new Set(pantryPath);
assert.deepEqual(Array.from(map.routeBetween('gate', 'pantry', visited)), pantryPath,
  'Kitchen route must use the basement passage rather than the Great Hall');
assert.deepEqual(Array.from(map.routeBetween('pantry', 'gate', visited)), pantryPath.slice().reverse());
assert.deepEqual(Array.from(map.routeBetween('pantry', 'pantry', visited)), ['pantry']);
assert.equal(map.routeBetween('gate', 'chamber', visited), null, 'Cannot route through an unexplored destination');
assert.equal(map.routeBetween('missing-room', 'gate', visited), null);
const missingIntermediate = new Set(visited);
missingIntermediate.delete('basementPassage');
assert.equal(map.routeBetween('gate', 'pantry', missingIntermediate), null,
  'Visited endpoints cannot reveal a path through an unvisited intermediate scene');

const hiddenSection = map.sections.find(section => section.secret);
assert.ok(hiddenSection, 'Concealed section is identified by metadata, not array position');
assert.deepEqual(Object.keys(hiddenSection.coords).sort(), ['chamber', 'requirement', 'sanctum', 'sluice']);
assert.equal(map.availableSections(visited).length, 6);
assert.ok(!map.availableSections(visited).some(section => section.secret));
for (const id of Object.keys(hiddenSection.coords)) {
  assert.ok(map.availableSections(new Set([...visited, id])).some(section => section.secret),
    'Discovering any concealed scene should reveal its section: ' + id);
}
const secretIndex = map.sections.indexOf(hiddenSection);
map.sections.splice(secretIndex, 1);
map.sections.unshift(hiddenSection);
assert.ok(!map.availableSections(visited).some(section => section.secret), 'Section order must not leak secrets');
assert.ok(map.availableSections(new Set(['requirement'])).some(section => section.secret));
map.sections.shift();
map.sections.splice(secretIndex, 0, hiddenSection);

const withChamber = new Set(['bathroom', 'sluice', 'chamber']);
assert.deepEqual(Array.from(map.routeBetween('bathroom', 'chamber', withChamber)), ['bathroom', 'sluice', 'chamber']);
assert.deepEqual(Array.from(map.routeBetween('chamber', 'bathroom', withChamber)), ['chamber', 'sluice', 'bathroom']);
assert.equal(map.routeBetween('bathroom', 'sluice', new Set(['bathroom'])), null,
  'Knowing the bathroom does not disclose the concealed pipe route');
assert.deepEqual(Array.from(map.routeBetween('corridor', 'requirement', new Set(['corridor', 'requirement']))),
  ['corridor', 'requirement']);

assert.ok(shell.includes('data-hgw-authorized'), 'Station-origin gate must remain');
assert.ok(shell.includes('id="hmap-trigger"') && shell.includes('id="hmap-dialog"'), 'Private map controls must remain mounted');
assert.ok(shell.includes('/assets/css/hogwarts-map.css'));
const geographyLoad = shell.indexOf('/assets/js/hogwarts-geography.js');
const mapLoad = shell.indexOf('/assets/js/hogwarts-map.js');
assert.ok(geographyLoad >= 0 && mapLoad > geographyLoad, 'Load shared geography before the private map');
assert.ok(mapText.includes('hogwarts:scenechange'), 'Map must refresh after exploration');
assert.ok(mapText.includes('event.stopImmediatePropagation()'), 'Map keyboard use must not move the explorer');
assert.doesNotMatch(mapText, /(?:sessionStorage|localStorage)\s*\.\s*(?:setItem|removeItem|clear)\s*\(/,
  'Map may read visits but cannot grant or erase them');
assert.doesNotMatch(mapText, /(?:location\s*\.\s*(?:assign|replace)|history\s*\.\s*pushState)\s*\(/,
  'Map cannot teleport between rooms');
assert.ok(css.includes('prefers-reduced-motion') && css.includes('hmap-point:focus-visible'),
  'Private map needs reduced-motion and keyboard focus styles');
console.log('Hogwarts map checks passed: 53 scenes, seven shared regions, visited-only routes and concealed sections.');
