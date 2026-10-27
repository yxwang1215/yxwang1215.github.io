import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

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
  assert.equal(geo.nodes[def.id].label, def.zh);
  assert.equal(geo.nodes[def.id].group, def.zone);
  assert.ok(room.description && room.kicker);
  const wrapper = root + def.path + "index.html";
  assert.ok(existsSync(wrapper), "Missing route " + def.path);
  assert.match(readFileSync(wrapper, "utf8"), /include hogwarts-explorer.html/);
  const graphic = root + scene.src;
  assert.ok(existsSync(graphic), "Missing scene artwork " + scene.src);
  assert.match(readFileSync(graphic, "utf8"), /<svg[^>]*width="1600" height="900"/);
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
  assert.ok(existsSync(root + visual.secret.open.src), "Missing opened illustration " + from);
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
console.log("Expansion checks passed: 60 new static pages, 73 SVG states, 115 routes, 13 new secrets, existing session gate retained.");
