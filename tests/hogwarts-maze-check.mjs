import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const atlasPath = path.join(root, "assets/js/hogwarts-atlas.js");
const source = readFileSync(atlasPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: atlasPath, timeout: 1000 });
const atlas = sandbox.window.HogwartsAtlas;
assert.ok(atlas, "Atlas must register on window");
assert.equal(atlas.start, "gate", "Start at the castle exterior");

const rooms = atlas.rooms;
const entries = Object.entries(rooms);
assert.equal(entries.length, 49, "Unexpected deletion of a maze room");

const paths = new Set();
const opposite = { n: "s", e: "w", s: "n", w: "e" };
const oneWayArrivals = new Set(["sluice:s:bathroom", "requirement:s:corridor"]);
const hidden = [];

for (const [key, room] of entries) {
  assert.equal(room.id, key, "Room key mismatch");
  assert.match(room.path, /^\/hogwarts\/(?:[a-z0-9-]+\/)*$/, "Invalid path");
  assert.ok(!paths.has(room.path), "Duplicate URL: " + room.path);
  paths.add(room.path);
  assert.equal(atlas.byPath[room.path], key, "Reverse path lookup broken");
  assert.ok(room.name && room.description && room.kind, "Incomplete room: " + key);
  const html = path.join(root, room.path.slice(1), "index.html");
  assert.ok(existsSync(html), "Room URL has no static index.html: " + room.path);
  const content = readFileSync(html, "utf8");
  assert.ok(content.includes("hogwarts-explorer.html"), "Missing shared room shell: " + room.path);
  assert.ok(content.includes("sitemap: false"), "Secret rooms should not be published in sitemap: " + key);
  for (const [dir, next] of Object.entries(room.exits)) {
    assert.ok(opposite[dir], "Invalid direction " + dir);
    assert.ok(rooms[next], "Broken exit from " + key + " to " + next);
    if (!oneWayArrivals.has(key + ":" + dir + ":" + next)) {
      assert.equal(rooms[next].exits[opposite[dir]], key,
        "Ordinary corridor is not bidirectional: " + key + " to " + next);
    }
  }
  if (room.secret) {
    assert.ok(rooms[room.secret.to], "Broken concealed passage: " + key);
    assert.ok(Number.isFinite(room.secret.x) && Number.isFinite(room.secret.y),
      "Secret must be discoverable at a coordinate: " + key);
    hidden.push(key + "->" + room.secret.to);
  }
}
assert.deepEqual(hidden.sort(), [
  "bathroom->sluice",
  "corridor->requirement"
].sort(), "The two concealed entrances must remain discoverable");

function traverse(mode) {
  const discovered = new Set([atlas.start]);
  const pending = [atlas.start];
  const order = [];
  while (pending.length) {
    const roomId = mode === "BFS" ? pending.shift() : pending.pop();
    order.push(roomId);
    const r = rooms[roomId];
    const neighbors = Object.values(r.exits);
    if (r.secret) neighbors.push(r.secret.to);
    for (const id of neighbors) {
      if (!discovered.has(id)) {
        discovered.add(id);
        pending.push(id);
      }
    }
  }
  return order;
}
const bfs = traverse("BFS");
const dfs = traverse("DFS");
assert.equal(bfs.length, entries.length, "BFS finds unreachable rooms");
assert.equal(dfs.length, entries.length, "DFS finds unreachable rooms");
assert.notDeepEqual(bfs, dfs, "BFS and DFS must use genuinely different traversal");
for (const mustVisit of [
  "chamber", "sanctum", "requirement", "forest", "lake", "quidditch", "herbology",
  "astrTower", "potions", "charms", "defense", "transfig", "history", "divination",
  "hut", "flying"
]) {
  assert.ok(bfs.includes(mustVisit), "A major scene cannot be reached: " + mustVisit);
}
for (const person of [
  "Minerva McGonagall", "Filius Flitwick", "Severus Snape",
  "Pomona Sprout", "Remus Lupin", "Sybill Trelawney",
  "Rubeus Hagrid", "Aurora Sinistra", "Rolanda Hooch"
]) {
  assert.ok(entries.some(([,r]) => r.teacher === person),
    "Missing teaching character: " + person);
}

const explorer = readFileSync(path.join(root, "assets/js/hogwarts-explore.js"), "utf8");
const shell = readFileSync(path.join(root, "_includes/hogwarts-explorer.html"), "utf8");
assert.ok(explorer.includes("history.pushState"), "Moving between rooms must update the URL");
assert.ok(explorer.includes("popstate"), "Back/forward movement must update the scene");
assert.ok(explorer.includes("window.requestAnimationFrame"), "Movement animation is missing");
assert.ok(explorer.includes("[data-door]"), "Physical door interactions are missing");
assert.ok(shell.includes("roomId") && shell.includes("passKey"),
  "The station-origin gate must be checked before displaying a room");
assert.ok(shell.includes("sessionStorage"), "Access must be scoped to an explorer session");
console.log("Hogwarts maze checks passed");
console.log("Rooms: " + entries.length);
console.log("Bidirectional corridors: " + Object.values(rooms)
  .reduce((n, r) => n + Object.keys(r.exits).length, 0) / 2 + " (including secret return passages)");
console.log("Secret entrances: " + hidden.length);
console.log("BFS/DFS visited: " + bfs.length + "/" + dfs.length);
