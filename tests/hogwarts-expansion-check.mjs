import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

function jpegDimensions(bytes) {
  assert.equal(bytes[0], 0xff, "JPEG missing SOI marker");
  assert.equal(bytes[1], 0xd8, "JPEG missing SOI marker");
  let cursor = 2;
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (cursor + 4 < bytes.length) {
    if (bytes[cursor] !== 0xff) { cursor++; continue; }
    while (bytes[cursor] === 0xff) cursor++;
    const marker = bytes[cursor++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = bytes.readUInt16BE(cursor);
    assert.ok(length >= 2 && cursor + length <= bytes.length, "Invalid JPEG segment length");
    if (sofMarkers.has(marker)) {
      return { width: bytes.readUInt16BE(cursor + 5), height: bytes.readUInt16BE(cursor + 3) };
    }
    cursor += length;
  }
  assert.fail("JPEG has no image-size frame marker");
}

function assertArtwork(path, source, width, height) {
  assert.ok(existsSync(path), "Missing scene artwork " + source);
  const bytes = readFileSync(path);
  if (source.endsWith(".svg")) {
    assert.match(bytes.toString("utf8"), /<svg[^>]*width="1600" height="900"/);
  } else if (source.endsWith(".jpg") || source.endsWith(".jpeg")) {
    const size = jpegDimensions(bytes);
    assert.deepEqual(size, { width, height }, "Unexpected JPEG size " + source);
  } else if (source.endsWith(".webp")) {
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF", "Invalid WebP RIFF header");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP", "Invalid WebP signature");
    assert.ok(width > 0 && height > 0, "Missing WebP dimensions " + source);
  } else {
    assert.fail("Unsupported scene artwork format " + source);
  }
}

function pointInsidePolygon([px, py], vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const [xi, yi] = vertices[i], [xj, yj] = vertices[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}


const root = process.cwd();
const expansion = JSON.parse(readFileSync(root + "/data/hogwarts-expansion-113.json", "utf8"));
const win = { window: {} };
for (const file of ["hogwarts-atlas.js", "hogwarts-scenes.js", "hogwarts-geography.js"]) {
  vm.runInNewContext(readFileSync(root + "/assets/js/" + file, "utf8"), win, { filename: file });
}
const atlas = win.window.HogwartsAtlas, scenes = win.window.HogwartsScenes, geo = win.window.HogwartsGeography;
assert.equal(expansion.count, 60);
assert.equal(expansion.definitions.length, 60);
assert.equal(Object.keys(atlas.rooms).length, 113);
assert.equal(Object.keys(scenes).length, 113);
assert.equal(Object.keys(geo.nodes).length, 113);
assert.equal(geo.edges(true).length, 115);

const kinds = new Map();
for (const def of expansion.definitions) {
  const room = atlas.rooms[def.id], scene = scenes[def.id];
  assert.ok(room && scene, "Missing new scene " + def.id);
  assert.equal(room.path, def.path);
  assert.equal(geo.nodes[def.id].label, room.name, 'Expansion scenes must use their English room names');
  assert.equal(geo.nodes[def.id].group, def.zone);
  assert.ok(room.description && room.kicker);
  const wrapper = root + def.path + "index.html";
  assert.ok(existsSync(wrapper), "Missing route " + def.path);
  assert.match(readFileSync(wrapper, "utf8"), /include hogwarts-explorer.html/);
  const graphic = root + scene.src;
  assertArtwork(graphic, scene.src, scene.width, scene.height);
  if (!scene.src.endsWith(".svg")) {
    const clickRegions = [...Object.values(scene.exits), ...(scene.secret ? [scene.secret.trigger, scene.secret.open] : [])];
    for (const region of clickRegions) {
      assert.ok(region.polygon?.length >= 3 && region.point?.length === 2, "Missing polygon for " + def.id);
      assert.ok(region.polygon.every(pair => pair.length === 2 && pair.every(v => Number.isFinite(v) && v >= 0 && v <= 100)), "Out-of-range polygon in " + def.id);
      assert.ok(pointInsidePolygon(region.point, region.polygon), "Point is outside click polygon in " + def.id);
    }
  }
  assert.ok(!kinds.has(scene.src), "Shared scene artwork " + scene.src);
  kinds.set(scene.src, true);
  assert.deepEqual(Object.keys(room.exits).sort(), Object.keys(scene.exits).sort());
  for (const to of Object.values(room.exits)) {
    assert.ok(atlas.rooms[to], "Invalid room connection " + def.id + " -> " + to);
  }
}
assert.equal(kinds.size, 60);
for (const [from, to, type] of expansion.hiddenEntrances) {
  const origin = atlas.rooms[from], target = atlas.rooms[to], visual = scenes[from];
  assert.deepEqual([origin.secret.to, origin.secret.type], [to, type]);
  assert.ok(Object.values(target.exits).includes(from), "No secret return " + to);
  assert.ok(visual.secret?.trigger?.point && visual.secret?.open?.src, "Missing two-state reveal " + from);
  assert.notEqual(visual.secret.open.src, visual.src);
  assertArtwork(root + visual.secret.open.src, visual.secret.open.src, visual.secret.open.width, visual.secret.open.height);
  assert.equal(geo.nodes[to].hidden, true);
}
const visited = new Set([atlas.start]);
let queue = [atlas.start];
for (let i = 0; i < queue.length; i++) {
  const room = atlas.rooms[queue[i]];
  for (const id of [...Object.values(room.exits), ...(room.secret ? [room.secret.to] : [])]) {
    if (!visited.has(id)) { visited.add(id); queue.push(id); }
  }
}
assert.equal(visited.size, 113, "Secret-aware traversal cannot reach every scene");
const noSecrets = new Set([atlas.start]);
queue = [atlas.start];
for (let i = 0; i < queue.length; i++) for (const id of Object.values(atlas.rooms[queue[i]].exits)) {
  if (!noSecrets.has(id)) { noSecrets.add(id); queue.push(id); }
}
for (const id of expansion.hiddenRooms) assert.ok(!noSecrets.has(id), "Hidden URL leaks into normal traversal: " + id);
assert.equal(expansion.hiddenEntrances.length, 13);
assert.match(readFileSync(root + "/_includes/hogwarts-explorer.html", "utf8"), /hogwarts:platform934:pass:v1/);
const rasterScenes = expansion.definitions.filter(def => !scenes[def.id].src.endsWith(".svg")).length;
const rasterOpens = expansion.hiddenEntrances.filter(([from]) => !scenes[from].secret.open.src.endsWith(".svg")).length;
console.log(`Expansion checks passed: 60 new static pages, ${rasterScenes} AI raster scenes, ${60 - rasterScenes} SVG scenes, ${rasterOpens} raster reveals, 115 routes, 13 new secrets, existing session gate retained.`);
