import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

// Stable compatibility contract captured before the geography revision.
// The URL's historical floor segment is not a physical-floor assertion.
const legacyPaths = {
  "gate": "/hogwarts/",
  "forecourt": "/hogwarts/grounds/approach/cobblestone-rise/",
  "entry": "/hogwarts/castle/keep/threshold/entry-vestibule/",
  "great": "/hogwarts/castle/keep/ground-floor/great-hall/",
  "kitchens": "/hogwarts/castle/keep/ground-floor/house-elf-kitchens/",
  "pantry": "/hogwarts/castle/keep/ground-floor/copper-pantry/",
  "gallery": "/hogwarts/castle/keep/ground-floor/portraits-gallery/",
  "armoury": "/hogwarts/castle/keep/ground-floor/knights-gallery/",
  "cloister": "/hogwarts/castle/keep/ground-floor/east-cloister/",
  "hospital": "/hogwarts/castle/keep/ground-floor/hospital-wing/",
  "transfig": "/hogwarts/castle/academic-wing/first-floor/transfiguration-classroom/",
  "baths": "/hogwarts/castle/keep/second-floor/abandoned-washroom/",
  "bathroom": "/hogwarts/castle/keep/second-floor/myrtles-bathroom/",
  "history": "/hogwarts/castle/academic-wing/first-floor/history-of-magic/",
  "staircase": "/hogwarts/castle/grand-staircase/first-landing/",
  "corridor": "/hogwarts/castle/academic-wing/first-floor/enchanted-corridor/",
  "library": "/hogwarts/castle/academic-wing/first-floor/library/",
  "charms": "/hogwarts/castle/academic-wing/first-floor/charms-classroom/",
  "defense": "/hogwarts/castle/academic-wing/first-floor/defence-against-dark-arts/",
  "office": "/hogwarts/castle/upper-keep/headmasters-office/",
  "astrStair": "/hogwarts/castle/upper-keep/spiral-ascent/",
  "astrTower": "/hogwarts/castle/upper-keep/astronomy-tower/",
  "divination": "/hogwarts/castle/upper-keep/divination-classroom/",
  "owlery": "/hogwarts/castle/upper-keep/owlery/",
  "ramparts": "/hogwarts/castle/upper-keep/north-battlements/",
  "dungeonSteps": "/hogwarts/castle/dungeons/spiral-stairs/",
  "potions": "/hogwarts/castle/dungeons/potions-classroom/",
  "oldArchive": "/hogwarts/castle/dungeons/forgotten-archive/",
  "crypt": "/hogwarts/castle/dungeons/forgotten-crypt/",
  "slytherin": "/hogwarts/castle/dungeons/green-lantern-passage/",
  "reservoir": "/hogwarts/castle/dungeons/underground-reservoir/",
  "vault": "/hogwarts/castle/dungeons/locked-storeroom/",
  "courtyard": "/hogwarts/grounds/south-courtyard/",
  "bridge": "/hogwarts/grounds/stone-viaduct/",
  "lake": "/hogwarts/grounds/black-lake/moonlit-shore/",
  "boathouse": "/hogwarts/grounds/black-lake/boathouse/",
  "dock": "/hogwarts/grounds/black-lake/old-pier/",
  "forest": "/hogwarts/grounds/forbidden-forest/whispering-edge/",
  "clearing": "/hogwarts/grounds/forbidden-forest/ancient-clearing/",
  "hut": "/hogwarts/grounds/keeper-hut/hagrids-garden/",
  "paddock": "/hogwarts/grounds/keeper-hut/creature-paddock/",
  "quidditch": "/hogwarts/grounds/quidditch/pitch/",
  "greenhouse": "/hogwarts/grounds/greenhouses/glass-passage/",
  "herbology": "/hogwarts/grounds/greenhouses/herbology-lesson/",
  "flying": "/hogwarts/grounds/quidditch/flying-lesson/",
  "sluice": "/hogwarts/under-castle/serpent-sewers/",
  "chamber": "/hogwarts/under-castle/chamber-of-secrets/",
  "sanctum": "/hogwarts/under-castle/ancient-serpent-sanctum/",
  "requirement": "/hogwarts/castle/academic-wing/room-of-requirement/"
};
const connectorPaths = {
  basementPassage: "/hogwarts/castle/basement/fruit-portrait-passage/",
  firstFloorJunction: "/hogwarts/castle/academic-wing/first-floor/teaching-corridor/",
  midFloorStair: "/hogwarts/castle/grand-staircase/middle-landings/",
  northTowerLanding: "/hogwarts/castle/north-tower/trapdoor-landing/"
};
const removedTeleports = [
  [
    "armoury",
    "great"
  ],
  [
    "armoury",
    "hospital"
  ],
  [
    "astrStair",
    "charms"
  ],
  [
    "astrTower",
    "divination"
  ],
  [
    "astrTower",
    "ramparts"
  ],
  [
    "bathroom",
    "history"
  ],
  [
    "baths",
    "gallery"
  ],
  [
    "bridge",
    "forest"
  ],
  [
    "charms",
    "corridor"
  ],
  [
    "charms",
    "divination"
  ],
  [
    "cloister",
    "entry"
  ],
  [
    "cloister",
    "hospital"
  ],
  [
    "corridor",
    "defense"
  ],
  [
    "corridor",
    "library"
  ],
  [
    "crypt",
    "dungeonSteps"
  ],
  [
    "defense",
    "history"
  ],
  [
    "dock",
    "flying"
  ],
  [
    "dungeonSteps",
    "oldArchive"
  ],
  [
    "dungeonSteps",
    "potions"
  ],
  [
    "dungeonSteps",
    "staircase"
  ],
  [
    "gallery",
    "great"
  ],
  [
    "great",
    "kitchens"
  ],
  [
    "history",
    "transfig"
  ],
  [
    "hospital",
    "transfig"
  ],
  [
    "library",
    "office"
  ],
  [
    "library",
    "transfig"
  ],
  [
    "office",
    "owlery"
  ],
  [
    "office",
    "ramparts"
  ],
  [
    "potions",
    "reservoir"
  ]
];
const root = process.cwd();
const atlasPath = path.join(root, "assets/js/hogwarts-atlas.js");
const context = { window: {} };
vm.runInNewContext(readFileSync(atlasPath, "utf8"), context, { filename: atlasPath, timeout: 1000 });
const atlas = context.window.HogwartsAtlas;
assert.ok(atlas, "Atlas must register on window");
assert.equal(atlas.start, "gate");
const rooms = atlas.rooms;
const ids = Object.keys(rooms);
const expansion = JSON.parse(readFileSync('data/hogwarts-expansion-113.json', 'utf8'));
assert.equal(expansion.definitions.length, 60);
assert.equal(ids.length, 113, "Keep 53 original rooms and introduce 60 expansion rooms");
assert.equal(Object.keys(legacyPaths).length, 49);
assert.ok(Object.keys({ ...legacyPaths, ...connectorPaths }).every(id => rooms[id]), 'Original room IDs must be stable');
for (const added of expansion.definitions) assert.equal(rooms[added.id].path, added.path, 'New scene URL changed: ' + added.id);
for (const [id, expected] of Object.entries({ ...legacyPaths, ...connectorPaths })) {
  assert.equal(rooms[id].path, expected, "Stable URL changed for " + id);
}

const edgeKey = (a, b) => [a, b].sort().join("|");
const secrets = Object.entries(rooms).filter(([, room]) => room.secret);
assert.deepEqual(
  secrets.map(([id, room]) => [id, room.secret.to, room.secret.type]).sort(),
  [["bathroom", "sluice", "basin"], ["corridor", "requirement", "wall"], ...expansion.hiddenEntrances].sort(),
  "Existing secret puzzles and all new discoveries must be registered"
);
const secretKeys = new Set(secrets.map(([id, room]) => edgeKey(id, room.secret.to)));
const ordinaryKeys = new Set();
const paths = new Set();
for (const [id, room] of Object.entries(rooms)) {
  assert.equal(room.id, id, "Room key mismatch");
  assert.match(room.path, /^\/hogwarts\/(?:[a-z0-9-]+\/)*$/);
  assert.ok(!paths.has(room.path), "Duplicate URL " + room.path);
  paths.add(room.path);
  assert.equal(atlas.byPath[room.path], id);
  assert.ok(room.name && room.description && room.kind, "Incomplete scene " + id);
  const wrapper = path.join(root, room.path.slice(1), "index.html");
  assert.ok(existsSync(wrapper), "Missing static scene URL " + room.path);
  const html = readFileSync(wrapper, "utf8");
  assert.match(html, /hogwarts-explorer\.html/, "Scene must use the gated shared shell");
  assert.match(html, /sitemap:\s*false/, "Scene must remain outside the sitemap");
  const destinations = Object.values(room.exits);
  assert.equal(new Set(destinations).size, destinations.length, "Duplicate local exit for " + id);
  for (const [localKey, to] of Object.entries(room.exits)) {
    assert.match(localKey, /^[a-z][a-z0-9_-]*$/, "Invalid local opening key");
    assert.ok(rooms[to], "Missing exit target " + id + " -> " + to);
    assert.notEqual(id, to, "Self-loop is not a room transition");
    if (secretKeys.has(edgeKey(id, to))) {
      assert.equal(rooms[to].secret?.to, id, "Only the return from a secret may lack an ordinary reverse");
    } else {
      // Camera orientation changes: reverse travel may use ANY local key.
      assert.ok(Object.values(rooms[to].exits).includes(id), "Missing return route " + id + " -> " + to);
      ordinaryKeys.add(edgeKey(id, to));
    }
  }
  if (room.secret) {
    assert.ok(rooms[room.secret.to], "Missing concealed destination");
    assert.ok(!destinations.includes(room.secret.to), "Secret destination leaked into ordinary exits");
    assert.ok(Object.values(rooms[room.secret.to].exits).includes(id), "Secret branch has no return");
  }
}
assert.equal(ordinaryKeys.size, 100, "Expanded ordinary route count changed");
assert.equal(secretKeys.size, 15);
const allKeys = new Set([...ordinaryKeys, ...secretKeys]);
for (const [a, b] of removedTeleports) {
  assert.ok(!allKeys.has(edgeKey(a, b)), "Removed unsafe shortcut was restored: " + a + " <-> " + b);
}

const leaves = {
  great: "entry", hospital: "firstFloorJunction", history: "firstFloorJunction",
  defense: "firstFloorJunction", transfig: "firstFloorJunction", library: "gallery",
  charms: "midFloorStair", office: "corridor",
  divination: "northTowerLanding", astrTower: "astrStair",
  potions: "slytherin", herbology: "greenhouse"
};
for (const [id, approach] of Object.entries(leaves)) {
  assert.deepEqual(Object.values(rooms[id].exits), [approach], id + " must be a destination, not a through-room");
}
for (const [id, expected] of Object.entries({
  basementPassage: ["entry", "kitchens", "dungeonSteps"],
  midFloorStair: ["staircase", "baths", "armoury", "charms", "gallery"],
  firstFloorJunction: ["staircase", "hospital", "history", "defense", "transfig"],
  northTowerLanding: ["corridor", "divination"]
})) {
  assert.deepEqual(Object.values(rooms[id].exits).sort(), expected.sort(), "Incorrect connector " + id);
}
assert.ok(Object.values(rooms.bridge.exits).includes("hut"), "Hagrid needs a direct grounds approach");
assert.ok(Object.values(rooms.flying.exits).includes("forecourt"), "Flying lawn must be reachable separately from the pitch");

function traverse(includeSecrets, depthFirst = false) {
  const seen = new Set([atlas.start]), pending = [atlas.start], order = [];
  while (pending.length) {
    const id = depthFirst ? pending.pop() : pending.shift();
    order.push(id);
    const next = Object.values(rooms[id].exits);
    if (includeSecrets && rooms[id].secret) next.push(rooms[id].secret.to);
    for (const to of next) if (!seen.has(to)) { seen.add(to); pending.push(to); }
  }
  return order;
}
const bfs = traverse(true), dfs = traverse(true, true);
assert.equal(bfs.length, 113, "An expanded scene is unreachable");
assert.equal(dfs.length, 113);
assert.notDeepEqual(bfs, dfs, "Both traversal orders should be exercised");
assert.deepEqual(ids.filter(id => !traverse(false).includes(id)).sort(),
  ["chamber", "requirement", "sanctum", "sluice", ...expansion.hiddenRooms].sort(),
  "Hidden rooms must require a concealed entrance");
assert.equal(allKeys.size - ids.length + 1, 3, "Expansion adds one further exploration loop");
for (const teacher of [
  "Minerva McGonagall", "Filius Flitwick", "Severus Snape", "Pomona Sprout",
  "Remus Lupin", "Sybill Trelawney", "Rubeus Hagrid", "Aurora Sinistra", "Rolanda Hooch"
]) assert.ok(Object.values(rooms).some(room => room.teacher === teacher), "Missing teaching character: " + teacher);

// Run the actual early access gate: public reference access must not unlock room URLs.
const shell = readFileSync(path.join(root, "_includes/hogwarts-explorer.html"), "utf8");
const gateScript = [...shell.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes("hogwarts:platform934:pass:v1"));
assert.ok(gateScript, "Station-origin session gate is missing");
const now = 1_800_000_000_000;
const nonce = "a".repeat(32);
function runGate(url, initial = {}) {
  const storage = new Map(Object.entries(initial));
  const result = { authorized: false, redirected: null, storage };
  const gateContext = {
    Date: { now: () => now },
    window: {
      HogwartsAtlas: atlas,
      location: { pathname: url, replace: to => { result.redirected = to; } },
      sessionStorage: {
        getItem: key => storage.get(key) ?? null,
        removeItem: key => storage.delete(key),
        setItem: (key, value) => storage.set(key, value)
      }
    },
    document: { documentElement: { setAttribute: (key, value) => {
      if (key === "data-hgw-authorized" && value === "true") result.authorized = true;
    } } }
  };
  vm.runInNewContext(gateScript, gateContext, { timeout: 1000 });
  return result;
}
const passKey = "hogwarts:platform934:pass:v1", sessionKey = "hogwarts:session:v2";
const ticket = JSON.stringify({ from: "/platform-934/", at: now - 100, nonce });
assert.equal(runGate(rooms.gate.path).redirected, "/", "Direct entry must remain gated");
const admitted = runGate(rooms.gate.path, { [passKey]: ticket });
assert.equal(admitted.authorized, true);
assert.equal(admitted.storage.has(passKey), false, "Entrance pass must be consumed");
assert.deepEqual(JSON.parse(admitted.storage.get(sessionKey)).visited, ["gate"]);
assert.equal(runGate(rooms.library.path, { [passKey]: ticket }).authorized, false,
  "A fresh entrance pass cannot authorize a deep URL");
const session = { id: nonce, issued: now - 1000, current: rooms.gate.path, visited: ["gate"] };
assert.equal(runGate(rooms.library.path, { [sessionKey]: JSON.stringify(session) }).authorized, false,
  "An active session cannot deep-link to an unvisited room");
session.visited.push("library");
assert.equal(runGate(rooms.library.path, { [sessionKey]: JSON.stringify(session) }).authorized, true);
session.issued = now - 21_600_001;
assert.equal(runGate(rooms.library.path, { [sessionKey]: JSON.stringify(session) }).authorized, false,
  "Expired journeys must not unlock room URLs");

console.log("Hogwarts maze checks passed: 113 rooms, 49 original legacy URLs, 100 ordinary routes, 15 secrets, 3 cycles; session gates preserved.");
