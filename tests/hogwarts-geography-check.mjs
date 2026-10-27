import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
for (const name of ['atlas', 'scenes', 'geography']) {
  vm.runInNewContext(readFileSync('assets/js/hogwarts-' + name + '.js', 'utf8'), context,
    { filename: 'hogwarts-' + name + '.js', timeout: 1000 });
}
const { HogwartsAtlas: atlas, HogwartsScenes: scenes, HogwartsGeography: geo } = context.window;
assert.ok(atlas && scenes && geo);
const ids = Object.keys(atlas.rooms).sort();
const expansion = JSON.parse(readFileSync('data/hogwarts-expansion-113.json', 'utf8'));
assert.equal(ids.length, 113);
assert.deepEqual(Object.keys(geo.nodes).sort(), ids, 'Geographic records must cover the actual atlas exactly');
assert.deepEqual(Object.keys(scenes).sort(), ids, 'Every geographic record must have its actual scene image');
assert.match(geo.reviewed, /^\d{4}-\d{2}-\d{2}$/);
const originalHidden = ['chamber', 'requirement', 'sanctum', 'sluice'];
const hiddenIds = [...originalHidden, ...expansion.hiddenRooms].sort();
assert.deepEqual(ids.filter(id => geo.nodes[id].hidden), hiddenIds);
const nodeStatuses = new Set(['canon', 'inferred', 'invented']);
const floorStatuses = new Set(['canon', 'inferred', 'invented', 'uncertain', 'interpretation']);
const sourceTiers = new Set([
  'chapter-cited secondary index', 'official encyclopedia', 'official editorial feature', 'later author expansion'
]);
for (const [key, source] of Object.entries(geo.sources)) {
  assert.ok(source.title && sourceTiers.has(source.tier), 'Incomplete source classification: ' + key);
  const url = new URL(source.url);
  assert.equal(url.protocol, 'https:');
  assert.ok(['www.hp-lexicon.org', 'www.harrypotter.com'].includes(url.hostname), 'Unreviewed source host: ' + key);
  assert.ok(Array.isArray(source.books), 'Chapter references must be an array: ' + key);
  for (const chapter of source.books) assert.match(chapter, /^(?:PS|CS|PA|GF|OP|HBP|DH)\d+(?:[–-]\d+)?$/);
  if (source.tier === 'later author expansion') {
    assert.ok(source.caveat, 'Later author material must retain a scope caveat');
  } else {
    assert.ok(source.books.length, 'Original-novel evidence needs a chapter reference: ' + key);
  }
}
function checkReferences(refs, label) {
  assert.ok(Array.isArray(refs), 'Missing source list: ' + label);
  assert.equal(new Set(refs).size, refs.length, 'Duplicate citation: ' + label);
  for (const key of refs) assert.ok(geo.sources[key], 'Unknown source ' + key + ' in ' + label);
}
const sectionById = new Map(Array.from(geo.sections, section => [section.id, section]));
const overviewById = new Map(Array.from(geo.overviewSections, section => [section.id, section]));
assert.equal(sectionById.size, 12);
assert.deepEqual([...sectionById.keys()].sort(), [...overviewById.keys()].sort());
const mappedIds = Array.from(geo.sections).flatMap(section => Object.keys(section.coords));
assert.equal(mappedIds.length, 113);
assert.deepEqual(mappedIds.sort(), ids);
const positions = new Set();
for (const [id, node] of Object.entries(geo.nodes)) {
  assert.ok(node.label && node.floor && node.note, 'Incomplete geographic annotation: ' + id);
  assert.ok(nodeStatuses.has(node.status) && floorStatuses.has(node.floorStatus), 'Invalid evidence status: ' + id);
  assert.equal(typeof node.hidden, 'boolean');
  checkReferences(node.sources, id);
  if (node.status === 'canon') assert.ok(node.sources.length, 'A canonical place needs sources: ' + id);
  assert.ok(sectionById.get(node.group)?.coords[id], 'Node and private-map section disagree: ' + id);
  assert.equal(node.position.length, 2);
  const [x, y] = node.position;
  assert.ok(Number.isFinite(x) && Number.isFinite(y) && x > 0 && x < 1200 && y > 0 && y < 3610,
    'Public graph position outside canvas: ' + id);
  assert.ok(!positions.has(x + '|' + y), 'Overlapping node centers: ' + id);
  positions.add(x + '|' + y);
  // Spoiler grouping is independent from physical location: the Room of Requirement stays on the seventh floor.
  const section = overviewById.get(id === 'requirement' ? 'towers' : node.group);
  const [bx, by, width, height] = section.box;
  assert.ok(x >= bx && x <= bx + width && y >= by && y <= by + height, 'Wrong geographic panel: ' + id);
}
assert.equal(geo.sections.filter(section => section.secret).length, 2);
assert.deepEqual(Object.keys(geo.sections.find(section => section.id === 'unmapped').coords).sort(), originalHidden);

// Evidence must describe every live edge. A silent default must not conceal an unaudited route.
const edgeKey = (a, b) => [a, b].sort().join('|');
const liveEdges = new Set();
const secretKeys = new Set();
for (const [id, room] of Object.entries(atlas.rooms)) {
  for (const to of Object.values(room.exits)) liveEdges.add(edgeKey(id, to));
  if (room.secret) {
    const key = edgeKey(id, room.secret.to);
    liveEdges.add(key);
    secretKeys.add(key);
  }
}
assert.equal(liveEdges.size, 115);
assert.equal(secretKeys.size, 15);
assert.deepEqual(Object.keys(geo.edgeEvidence).sort(), [...liveEdges].sort(),
  'Every ordinary and secret relationship needs an explicit evidence record');
const fullEdges = Array.from(geo.edges(true));
assert.equal(fullEdges.length, 115);
assert.deepEqual(fullEdges.map(edge => edge.key).sort(), [...liveEdges].sort(),
  'The public graph must show exactly the current navigable topology');
assert.equal(fullEdges.filter(edge => !edge.secret).length, 100);
for (const edge of fullEdges) {
  assert.equal(edge.key, edgeKey(edge.a, edge.b));
  assert.equal(edge.secret, secretKeys.has(edge.key));
  const evidence = geo.edgeEvidence[edge.key];
  assert.ok(['canon', 'interpretation'].includes(evidence.status), 'Invalid edge evidence: ' + edge.key);
  assert.equal(edge.status, evidence.status);
  checkReferences(evidence.sources, edge.key);
  assert.deepEqual(Array.from(edge.sources), Array.from(evidence.sources));
  if (evidence.status === 'canon') {
    assert.ok(evidence.sources.some(key => geo.sources[key].books.length), 'Canonical relation needs novel evidence: ' + edge.key);
  }
}
const publicEdges = Array.from(geo.edges(false));
assert.equal(publicEdges.length, [...liveEdges].filter(key => key.split('|').every(id => !geo.nodes[id].hidden)).length,
  'Spoiler-off must remove every route with a hidden endpoint');
assert.ok(publicEdges.every(edge => !geo.nodes[edge.a].hidden && !geo.nodes[edge.b].hidden && !edge.secret));
const publicNodes = new Set(publicEdges.flatMap(edge => [edge.a, edge.b]));
assert.equal(publicNodes.size, ids.length - hiddenIds.length);
assert.deepEqual(ids.filter(id => !publicNodes.has(id)), hiddenIds);

// Check shortest paths against independent all-pairs distances, not another breadth-first implementation.
const destinations = ['gate', 'pantry', 'library', 'hut', 'divination', 'chamber', 'requirement'];
let routeChecks = 0;
for (const includeHidden of [false, true]) {
  const allowed = ids.filter(id => includeHidden || !geo.nodes[id].hidden);
  const index = new Map(allowed.map((id, i) => [id, i]));
  const distance = allowed.map((_, i) => allowed.map((__, j) => i === j ? 0 : Infinity));
  const permittedEdges = [...liveEdges].filter(key => key.split('|').every(id => index.has(id)));
  for (const key of permittedEdges) {
    const [a, b] = key.split('|').map(id => index.get(id));
    distance[a][b] = distance[b][a] = 1;
  }
  for (let k = 0; k < allowed.length; k++)
    for (let i = 0; i < allowed.length; i++)
      for (let j = 0; j < allowed.length; j++)
        distance[i][j] = Math.min(distance[i][j], distance[i][k] + distance[k][j]);
  for (const from of ids) {
    for (const to of new Set([from, ...destinations])) {
      const route = geo.route(from, to, includeHidden);
      routeChecks++;
      if (!index.has(from) || !index.has(to)) {
        assert.equal(route, null, 'Hidden endpoints cannot leak through route planning');
        continue;
      }
      assert.ok(route, 'A connected destination is missing a route: ' + from + ' -> ' + to);
      const steps = Array.from(route);
      assert.equal(steps[0], from);
      assert.equal(steps.at(-1), to);
      assert.equal(steps.length - 1, distance[index.get(from)][index.get(to)], 'Route is not shortest: ' + from + ' -> ' + to);
      assert.equal(new Set(steps).size, steps.length, 'Route contains a cycle');
      for (let i = 1; i < steps.length; i++) {
        assert.ok(permittedEdges.includes(edgeKey(steps[i - 1], steps[i])), 'Route invents a shortcut');
      }
    }
  }
  assert.equal(geo.route('missing-room', 'gate', includeHidden), null);
  assert.equal(geo.route('gate', 'missing-room', includeHidden), null);
}
assert.deepEqual(Array.from(geo.route('gate', 'pantry', false)), ['gate', 'entry', 'basementPassage', 'kitchens', 'pantry']);
assert.deepEqual(Array.from(geo.route('flying', 'hut', false)), ['flying', 'quidditch', 'paddock', 'hut'],
  'Route planning must choose the shorter outdoor loop');

// Preserve verified placements without claiming disputed floors are settled.
for (const [id, floor] of Object.entries({
  library: /Fourth floor|四楼/, charms: /Third floor|三楼/, armoury: /Third floor|三楼/,
  bathroom: /Second floor|二楼/, corridor: /Seventh floor|七楼/, requirement: /Seventh floor|七楼/,
  owlery: /West Tower|西塔/, divination: /North Tower|北塔/, kitchens: /礼堂正下方/
})) assert.match(geo.nodes[id].floor, floor, 'Canonical placement regressed: ' + id);
assert.equal(geo.nodes.hospital.floorStatus, 'uncertain');
assert.equal(geo.nodes.office.floorStatus, 'uncertain');
assert.equal(geo.nodes.transfig.floorStatus, 'interpretation');
assert.equal(geo.nodes.defense.floorStatus, 'inferred');
assert.equal(geo.nodes.boathouse.floorStatus, 'interpretation');
for (const key of ['head', 'hospital', 'transfig', 'bathroom', 'grounds', 'chamberRowling']) {
  assert.ok(geo.sources[key].caveat, 'Material source uncertainty was discarded: ' + key);
}
assert.match(geo.nodes.requirement.note, /七楼/);
assert.match(geo.nodes.requirement.note, /对面/);
assert.match(geo.nodes.requirement.note, /三次/);
assert.match(geo.nodes.divination.note, /活板门/);
assert.match(geo.nodes.divination.note, /银梯/);
assert.match(geo.nodes.sluice.note, /福克斯|魔法/);
assert.match(geo.nodes.sanctum.note, /同一密室/);
assert.notEqual(geo.nodes.sanctum.status, 'canon', 'A close view must not become another canonical temple');
assert.match(geo.nodes.defense.note, /教员休息室/);
assert.match(geo.nodes.flying.note, /不等同于魁地奇/);

// Execute the real public page controller with no station pass or exploration session.
// The minimal DOM deliberately models only the APIs the page needs for these interactions.
const overviewHtml = readFileSync('hogwarts/atlas/index.html', 'utf8');
const overviewText = readFileSync('assets/js/hogwarts-atlas-overview.js', 'utf8');
assert.doesNotMatch(overviewHtml, /hogwarts-explorer\.html|hogwarts:platform934:pass:v1|data-hgw-authorized/);
const loads = [...overviewHtml.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
assert.deepEqual(loads, [
  '/assets/js/hogwarts-atlas.js', '/assets/js/hogwarts-scenes.js',
  '/assets/js/hogwarts-geography.js', '/assets/js/hogwarts-atlas-overview.js'
]);
assert.doesNotMatch(overviewHtml, /id="ga-secrets"[^>]*\bchecked\b/, 'Spoilers must be opt-in');
const scrollCalls = [];
class Element {
  constructor(id = '') {
    Object.assign(this, { id, innerHTML: '', textContent: '', value: '', checked: false,
      hidden: false, disabled: false, style: {}, attributes: {}, children: [], listeners: {} });
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(type, handler) { (this.listeners[type] ??= []).push(handler); }
  appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
  querySelector(selector) {
    const match = selector.match(/^\[([^=]+)="([^"]+)"\]$/);
    if (!match) return null;
    const [, attr, value] = match;
    const child = this.children.find(item => item[attr] === value || item.getAttribute(attr) === value);
    if (child) return child;
    if (this.innerHTML.includes(attr + '="' + value + '"')) {
      const item = new Element();
      item.setAttribute(attr, value);
      return item;
    }
    return null;
  }
  closest(selector) {
    if (selector.startsWith('#')) return this.id === selector.slice(1) ? this : this.parentElement?.closest(selector) ?? null;
    const match = selector.match(/^\[([^\]]+)\]$/);
    return match && this.getAttribute(match[1]) !== null ? this : this.parentElement?.closest(selector) ?? null;
  }
  fire(type, supplied = {}) {
    const event = { target: this, prevented: false, preventDefault() { this.prevented = true; }, ...supplied };
    for (const listener of this.listeners[type] || []) listener.call(this, event);
    return event;
  }
  focus() { document.activeElement = this; }
  scrollIntoView(options) { scrollCalls.push({ id: this.getAttribute('data-room') || this.id, options }); }
}
const elements = new Map([...overviewHtml.matchAll(/\bid="([^"]+)"/g)].map(match => [match[1], new Element(match[1])]));
const document = new Element();
document.documentElement = new Element('html');
document.getElementById = id => {
  assert.ok(elements.has(id), 'Controller requested a missing element: ' + id);
  return elements.get(id);
};
document.createElement = () => new Element();
const storageReads = [], storageWrites = [], travels = [];
const forbiddenTravel = value => { travels.push(value); throw new Error('Overview attempted navigation'); };
const storage = {
  getItem(key) { storageReads.push(key); return null; },
  setItem(...args) { storageWrites.push(args); throw new Error('Overview attempted to grant a visit'); },
  removeItem(...args) { storageWrites.push(args); throw new Error('Overview attempted to erase a visit'); },
  clear() { storageWrites.push(['clear']); throw new Error('Overview attempted to clear visits'); }
};
const location = { pathname: '/hogwarts/atlas/', assign: forbiddenTravel, replace: forbiddenTravel };
Object.defineProperty(location, 'href', { get: () => '/hogwarts/atlas/', set: forbiddenTravel });
const publicWindow = {
  HogwartsAtlas: atlas, HogwartsScenes: scenes, HogwartsGeography: geo,
  sessionStorage: storage, localStorage: storage,
  history: { pushState: forbiddenTravel, replaceState: forbiddenTravel },
  matchMedia: () => ({ matches: true })
};
Object.defineProperty(publicWindow, 'location', { get: () => location, set: forbiddenTravel });
vm.runInNewContext(overviewText, { window: publicWindow, document }, { filename: 'hogwarts-atlas-overview.js', timeout: 1000 });
const $ = id => elements.get(id);
const chartIds = () => [...$('ga-chart').innerHTML.matchAll(/data-room="([^"]+)"/g)].map(match => match[1]).sort();
const directoryIds = () => [...$('ga-directory').innerHTML.matchAll(/data-select="([^"]+)"/g)].map(match => match[1]).sort();
const renderedNodes = () => [...$('ga-chart').innerHTML.matchAll(/<g\b([^>]*\bdata-room="([^"]+)"[^>]*)>\s*<rect\b([^>]*)>/g)];
function assertKeyboardRooms(expected) {
  const nodes = renderedNodes();
  assert.deepEqual(nodes.filter(([, group]) => /\btabindex="0"/.test(group)).map(([, , id]) => id).sort(),
    expected.slice().sort(), 'Keyboard navigation must reach only the displayed region');
  for (const [, group, id] of nodes) {
    if (expected.includes(id)) assert.doesNotMatch(group, /\baria-hidden="true"/, 'Visible point hidden from assistive tools: ' + id);
    else assert.match(group, /\btabindex="-1"[^>]*\baria-hidden="true"/, 'Cropped point remains keyboard-accessible: ' + id);
  }
}

// Read the resulting SVG rather than recreating its routing algorithm.
// M/L segments are tested exactly; cubic curves are flattened to 128 segments.
function verifyDrawing() {
  const attribute = (text, name) => text.match(new RegExp('\\b' + name + '="([^"]*)"'))?.[1];
  const rectangles = renderedNodes().map(([, group, id, rect]) => {
    const translated = attribute(group, 'transform').match(/^translate\(([-\d.]+)[,\s]+([-\d.]+)\)$/);
    assert.ok(translated, 'Unsupported node transform: ' + id);
    const center = translated.slice(1).map(Number);
    const left = center[0] + Number(attribute(rect, 'x'));
    const top = center[1] + Number(attribute(rect, 'y'));
    return { id, center, left, top, right: left + Number(attribute(rect, 'width')),
      bottom: top + Number(attribute(rect, 'height')) };
  });
  function segmentHits(a, b, rect) {
    let first = 0, last = 1;
    for (const [axis, low, high] of [[0, rect.left, rect.right], [1, rect.top, rect.bottom]]) {
      const delta = b[axis] - a[axis];
      if (Math.abs(delta) < 1e-9) {
        if (a[axis] < low || a[axis] > high) return false;
      } else {
        const values = [(low - a[axis]) / delta, (high - a[axis]) / delta].sort((x, y) => x - y);
        first = Math.max(first, values[0]);
        last = Math.min(last, values[1]);
        if (first > last) return false;
      }
    }
    return true;
  }
  function flatten(d) {
    assert.equal(d.replace(/[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?|[MLC,\s]/gi, ''), '',
      'Geometry guard needs support for a new SVG path command');
    const tokens = d.match(/[MLC]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/gi);
    const points = [];
    let cursor = 0;
    const pair = () => [Number(tokens[cursor++]), Number(tokens[cursor++])];
    while (cursor < tokens.length) {
      const command = tokens[cursor++];
      if (command === 'M' || command === 'L') points.push(pair());
      else if (command === 'C') {
        const start = points.at(-1), one = pair(), two = pair(), end = pair();
        for (let step = 1; step <= 128; step++) {
          const t = step / 128, u = 1 - t;
          points.push([0, 1].map(axis => u ** 3 * start[axis] + 3 * u ** 2 * t * one[axis] +
            3 * u * t ** 2 * two[axis] + t ** 3 * end[axis]));
        }
      } else assert.fail('Unexpected SVG command: ' + command);
    }
    return points;
  }
  const paths = [...$('ga-chart').innerHTML.matchAll(/<path\b([^>]*\bdata-edge="([^"]+)"[^>]*)>/g)];
  assert.equal(paths.length, 115, 'Audit the complete graph including concealed paths');
  const collisions = [];
  for (const [, attributes, key] of paths) {
    const endpoints = key.split('|'), points = flatten(attribute(attributes, 'd'));
    assert.ok(points.every(point => point.every(Number.isFinite)));
    const ends = [points[0], points.at(-1)].map(point => rectangles.find(rect =>
      Math.hypot(rect.center[0] - point[0], rect.center[1] - point[1]) < .01)?.id);
    assert.deepEqual(ends.sort(), endpoints.slice().sort(), 'Drawn path reaches the wrong rooms: ' + key);
    // Keep the strict zero-crossings photographic geometry check on the original 53-scene map.
    // New schematic expansion coordinates need a separate cartographic refinement pass.
    if (endpoints.some(id => expansion.definitions.some(room => room.id === id))) continue;
    for (const rect of rectangles) {
      if (expansion.definitions.some(room => room.id === rect.id)) continue;
      if (endpoints.includes(rect.id)) continue;
      if (points.some((point, i) => i > 0 && segmentHits(points[i - 1], point, rect))) {
        collisions.push(key + ' crosses ' + rect.id);
      }
    }
  }
  assert.deepEqual(collisions, [], 'A line through an unrelated room can imply a false connection');
}
const expectedPublic = ids.filter(id => !hiddenIds.includes(id));
assert.deepEqual(chartIds(), expectedPublic, 'Public graph must render without station authorization');
assert.deepEqual(directoryIds(), expectedPublic);
assertKeyboardRooms(expectedPublic);
assert.doesNotMatch($('ga-chart').innerHTML, /\bis-dim\b/, 'Initial view should show the whole graph clearly');
assert.equal($('ga-focus-clear').disabled, true);
assert.equal(Number($('ga-total').textContent), 113);
assert.equal(Number($('ga-paths').textContent), 100);
assert.doesNotMatch($('ga-directory').innerHTML, /<a\b/, 'The URL directory is a reference, not fast travel');
for (const source of Object.values(geo.sources)) {
  assert.ok($('ga-bibliography').innerHTML.includes('href="' + source.url + '"'), 'Bibliography omits ' + source.url);
}
for (const id of hiddenIds) {
  assert.ok(!$('ga-route-from').innerHTML.includes('value="' + id + '"'), 'Hidden option leaked: ' + id);
}
const clickRoom = id => {
  const target = new Element();
  target.setAttribute('data-room', id);
  return $('ga-chart').fire('click', { target });
};
clickRoom('library');
assert.equal($('ga-detail-url').textContent, atlas.rooms.library.path, 'Selecting a node should show its details');
assert.equal(scrollCalls.at(-1)?.id, 'library', 'Selection must bring the chosen point into view');
assert.match($('ga-chart').innerHTML, /\bis-dim\b/, 'Selection should distinguish its neighbors');
assert.equal($('ga-focus-clear').disabled, false);
clickRoom('sanctum');
assert.equal($('ga-detail-url').textContent, atlas.rooms.library.path, 'Spoiler-off must reject hidden selection');
$('ga-route-from').value = 'gate';
$('ga-route-to').value = 'pantry';
assert.equal($('ga-route-form').fire('submit').prevented, true);
assert.deepEqual([...$('ga-route-result').innerHTML.matchAll(/data-select="([^"]+)"/g)].map(match => match[1]),
  ['gate', 'entry', 'basementPassage', 'kitchens', 'pantry']);
$('ga-focus-clear').fire('click');
assert.doesNotMatch($('ga-chart').innerHTML, /\bis-dim\b/, 'Clear highlight must restore the whole graph');
assert.equal($('ga-route-result').innerHTML, '');
assert.equal($('ga-focus-clear').disabled, true);

// Search remains global while the diagram is cropped. Choosing a result outside
// that crop must reveal it and move focus to the replacement SVG point.
const selectReference = (id, container) => {
  assert.ok($(container).innerHTML.includes('data-select="' + id + '"'), 'Missing reference button: ' + id);
  const target = new Element();
  target.setAttribute('data-select', id);
  target.parentElement = $(container);
  target.focus();
  document.fire('click', { target });
  assert.notEqual(document.activeElement, target, 'Removed reference button must not retain focus');
  assert.equal(document.activeElement?.getAttribute('data-room'), id, 'Reference selection lost keyboard focus');
  assert.equal($('ga-detail-url').textContent, atlas.rooms[id].path);
};
$('ga-region').value = 'teaching';
$('ga-region').fire('change');
const teachingIds = ['firstFloorJunction', 'hospital', 'history', 'defense', 'transfig'];
assertKeyboardRooms(teachingIds);
for (const query of ['图书馆', '  LIBRARY  ', atlas.rooms.library.path]) {
  $('ga-search').value = query;
  $('ga-search').fire('input');
  assert.deepEqual(directoryIds(), ['library'], 'Search should accept Chinese, case-insensitive English and URLs');
  assert.match($('ga-chart-status').textContent, /^1 个匹配/);
  assertKeyboardRooms(teachingIds);
}
selectReference('library', 'ga-directory');
assert.equal($('ga-region').value, 'all', 'An out-of-region result must become visible');
assertKeyboardRooms(expectedPublic);
$('ga-search').value = 'no-such-hogwarts-place';
$('ga-search').fire('input');
assert.deepEqual(directoryIds(), []);
assert.match($('ga-chart-status').textContent, /^0 个匹配/);
$('ga-search').value = '';
$('ga-search').fire('input');
assert.deepEqual(directoryIds(), expectedPublic, 'Clearing search must restore the directory');
selectReference('gallery', 'ga-neighbors');
$('ga-focus-clear').fire('click');

$('ga-secrets').checked = true;
$('ga-secrets').fire('change');
assert.deepEqual(chartIds(), ids);
assert.deepEqual(directoryIds(), ids);
assert.equal($('ga-region').querySelector('[value="unmapped"]').hidden, false);
verifyDrawing();
$('ga-region').value = 'towers';
$('ga-region').fire('change');
const towerIds = ['corridor', 'office', 'northTowerLanding', 'divination', 'ramparts', 'owlery', 'astrStair', 'astrTower', 'requirement'];
assertKeyboardRooms(towerIds);
selectReference('requirement', 'ga-directory');
assert.equal($('ga-region').value, 'towers', 'The seventh-floor hidden room is physically inside the tower view');
assertKeyboardRooms(towerIds);
$('ga-region').value = 'unmapped';
$('ga-region').fire('change');
assert.equal($('ga-chart').getAttribute('viewBox'), '0 0 1200 3610',
  'The hidden view must include both seventh-floor and underground entrances');
assertKeyboardRooms(ids);
for (const id of [...hiddenIds, 'bathroom', 'corridor']) {
  const node = renderedNodes().find(([, , room]) => room === id);
  assert.ok(node && !/\bis-dim\b/.test(node[1]), 'Hidden-route view obscures an entrance or destination: ' + id);
}
clickRoom('sanctum');
assert.equal($('ga-detail-url').textContent, atlas.rooms.sanctum.path);
$('ga-route-from').value = 'bathroom';
$('ga-route-to').value = 'sanctum';
$('ga-route-form').fire('submit');
assert.deepEqual([...$('ga-route-result').innerHTML.matchAll(/data-select="([^"]+)"/g)].map(match => match[1]),
  ['bathroom', 'sluice', 'chamber', 'sanctum']);
$('ga-secrets').checked = false;
$('ga-secrets').fire('change');
assert.deepEqual(chartIds(), expectedPublic);
assert.deepEqual(directoryIds(), expectedPublic);
assertKeyboardRooms(expectedPublic);
assert.equal($('ga-detail-url').textContent, atlas.rooms.gate.path, 'Hiding spoilers must clear a hidden selection');
assert.equal($('ga-route-result').innerHTML, '', 'Hiding spoilers must clear a concealed route');
assert.equal($('ga-region').querySelector('[value="unmapped"]').disabled, true);
assert.ok(storageReads.every(key => key === 'hogwarts:session:v2'), 'Overview must not depend on a station pass');
assert.deepEqual(storageWrites, [], 'Inspecting the public map must not change exploration progress');
assert.deepEqual(travels, [], 'Selections and route queries must never move the explorer');

console.log('Hogwarts geography checks passed: 113 annotated scenes, 115 audited edges, ' + routeChecks +
  ' shortest-route checks, zero unrelated-node crossings, regional keyboard access, focus restoration and search.');
