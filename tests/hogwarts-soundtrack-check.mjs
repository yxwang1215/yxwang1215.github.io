// Dependency-free integration tests for the real atlas, explorer and Spotify UI.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const atlasSource = readFileSync("assets/js/hogwarts-atlas.js", "utf8");
const exploreSource = readFileSync("assets/js/hogwarts-explore.js", "utf8");
const soundtrackSource = readFileSync("assets/js/hogwarts-soundtrack.js", "utf8");

class Element {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.events = Object.create(null);
    this.attributes = Object.create(null);
    this.queries = new Map();
    this.hidden = false;
    this.value = "";
    this.paused = true;
    this.style = { setProperty() {} };
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  set innerHTML(html) { this.html = html; this.children = []; }
  get innerHTML() { return this.html || ""; }
  get firstChild() { return this.children[0] || null; }
  appendChild(element) { this.children.push(element); element.parent = this; return element; }
  removeChild(element) {
    const i = this.children.indexOf(element);
    if (i >= 0) this.children.splice(i, 1);
    return element;
  }
  replaceChildren(...elements) { this.children = elements; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  getAttribute(name) { return this.attributes[name] || null; }
  addEventListener(type, listener) {
    (this.events[type] ||= []).push(listener);
  }
  emit(type, event = {}) {
    for (const listener of this.events[type] || []) listener(event);
  }
  querySelector(selector) {
    if (!this.queries.has(selector)) this.queries.set(selector, new Element());
    return this.queries.get(selector);
  }
  contains(element) {
    return element === this || this.children.some(child => child.contains(element));
  }
  focus() {}
}

function harness(start, options = {}) {
  const location = { pathname: start, hash: options.hash || "", replaced: null,
    replace(url) { this.replaced = url; },
    assign(url) { this.assigned = url; } };
  const listeners = Object.create(null);
  const sessionValues = new Map();
  const localValues = new Map();
  const store = values => ({
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  });
  const sessionStorage = store(sessionValues);
  const historyPaths = [start];
  let position = 0;
  function emit(type) {
    for (const listener of listeners[type] || []) listener({ type });
  }
  const history = {
    pushState(_state, _title, url) {
      historyPaths.splice(position + 1);
      historyPaths.push(url);
      position += 1;
      location.pathname = url;
    },
    replaceState(_state, _title, url) {
      historyPaths[position] = url;
      location.pathname = url;
    },
    back() {
      if (position > 0) {
        location.pathname = historyPaths[--position];
        emit("popstate");
      }
    },
    forward() {
      if (position + 1 < historyPaths.length) {
        location.pathname = historyPaths[++position];
        emit("popstate");
      }
    }
  };
  const body = new Element("body");
  const domById = new Map();
  const document = {
    body,
    title: "",
    createElement(tag) { return new Element(tag); },
    getElementById(id) {
      if (!domById.has(id)) domById.set(id, new Element());
      return domById.get(id);
    },
    addEventListener() {}
  };
  const window = {
    location, history, sessionStorage, localStorage: store(localValues),
    performance: { now() { return 0; } },
    matchMedia() { return { matches: true }; },
    setTimeout(callback) { callback(); return 1; },
    requestAnimationFrame() { return 1; },
    cancelAnimationFrame() {},
    fetch() { return Promise.resolve({ ok: false }); },
    addEventListener(type, listener) {
      (listeners[type] ||= []).push(listener);
    },
    dispatchEvent(event) { emit(event.type); }
  };
  const context = vm.createContext({
    window, document, sessionStorage,
    Event: class { constructor(type) { this.type = type; } },
    Audio: class {}, console
  });
  if (options.maze !== false) {
    vm.runInContext(atlasSource, context, { filename: "hogwarts-atlas.js", timeout: 1000 });
    const roomId = window.HogwartsAtlas.byPath[start];
    assert.ok(roomId, "Test harness needs a real room URL: " + start);
    sessionStorage.setItem("hogwarts:session:v2", JSON.stringify({
      id: "soundtrack-test", issued: Date.now(), visited: [roomId]
    }));
    vm.runInContext(exploreSource, context, { filename: "hogwarts-explore.js", timeout: 1000 });
  }
  vm.runInContext(soundtrackSource, context, { filename: "hogwarts-soundtrack.js", timeout: 1000 });
  const root = body.children.find(element => element.className === "hw-score");
  assert.ok(root, "Score panel was not created");
  const seal = root.querySelector(".hw-score__seal");
  const embed = root.querySelector(".hw-score__embed");
  const title = root.querySelector(".hw-score__title");
  return {
    window, location, history, seal, embed, title,
    soundtrack: window.HogwartsSoundtrack,
    key(key) {
      for (const listener of listeners.keydown || []) {
        listener({
          key,
          altKey: false, ctrlKey: false, metaKey: false,
          target: { tagName: "BODY" },
          preventDefault() {}
        });
      }
    },
    changeHash(hash) { location.hash = hash; emit("hashchange"); },
    openScore() { seal.emit("click"); }
  };
}

const world = harness("/hogwarts/");
const atlas = world.window.HogwartsAtlas;
const actualIds = Object.keys(atlas.rooms);
assert.equal(actualIds.length, 49, "Room count unexpectedly changed");

const expected = {
  hedwig: ["gate", "entry", "kitchens", "pantry", "cloister", "transfig",
    "baths", "bathroom", "history", "corridor", "charms", "defense"],
  grounds: ["forecourt", "courtyard", "bridge", "lake", "boathouse", "dock",
    "forest", "clearing", "hut", "paddock", "greenhouse", "herbology"],
  great: ["great"],
  memory: ["gallery", "armoury", "hospital", "library", "office",
    "oldArchive", "vault", "requirement"],
  staircases: ["staircase", "astrStair"],
  tower: ["astrTower", "divination", "owlery", "ramparts"],
  potions: ["dungeonSteps", "potions", "crypt", "slytherin"],
  chamber: ["reservoir", "sluice", "chamber", "sanctum"],
  quidditch: ["quidditch", "flying"]
};
const expectedIds = Object.values(expected).flat();
assert.deepEqual([...expectedIds].sort(), [...actualIds].sort(),
  "Each real room must have exactly one expected soundtrack classification");
for (const [trackId, roomIds] of Object.entries(expected)) {
  for (const id of roomIds) {
    const room = atlas.rooms[id];
    const track = world.soundtrack.selectForPath(room.path);
    assert.equal(track.id, trackId, "Wrong track for " + id + " (" + room.path + ")");
    assert.equal(world.soundtrack.selectForPath(room.path.slice(0, -1)).id, trackId,
      "Trailing slash normalization failed for " + id);
    assert.equal(world.soundtrack.selectForPath(room.path + "index.html").id, trackId,
      "index.html normalization failed for " + id);
    assert.match(track.spotify, /^[a-zA-Z0-9]{22}$/, "Invalid Spotify track ID: " + id);
  }
}
assert.equal(world.soundtrack.selectForPath("/hogwarts/unknown-location/").id, "hedwig");
assert.equal(harness("/platform-934/", { maze: false }).soundtrack.selectForPath("/platform-934/").id, "platform");
assert.equal(harness("/hogwarts/sorting-ceremony/", { maze: false }).soundtrack.selectForPath("/hogwarts/sorting-ceremony/").id, "sorting");

// A normal passage changes the URL, then emits hogwarts:scenechange; transitions
// within one score family should NOT recreate the playing Spotify iframe.
world.openScore();
let themeFrame = world.embed.firstChild;
assert.match(themeFrame.src, /^https:\/\/open\.spotify\.com\/embed\/track\//);
for (let i = 0; i < 3; ++i) world.key("ArrowUp");
assert.equal(world.location.pathname, atlas.rooms.entry.path);
assert.equal(world.embed.firstChild, themeFrame,
  "Passing between rooms with one score should preserve the current player");
for (let i = 0; i < 10; ++i) world.key("ArrowUp");
assert.equal(world.location.pathname, atlas.rooms.great.path);
assert.equal(world.embed.firstChild.src,
  "https://open.spotify.com/embed/track/" + world.soundtrack.selectForPath(atlas.rooms.great.path).spotify + "?theme=0");
assert.notEqual(world.embed.firstChild, themeFrame, "Great Hall must replace the theme player");
world.history.back();
assert.equal(world.location.pathname, atlas.rooms.entry.path);
assert.equal(world.title.textContent, "Hedwig's Theme", "Back did not update the score");
world.history.forward();
assert.equal(world.location.pathname, atlas.rooms.great.path);
assert.equal(world.title.textContent, "Entry into the Great Hall and the Banquet",
  "Forward did not restore the Great Hall score");

// Secret basin passage must switch from regular interior ambience to the Chamber score.
const basin = harness(atlas.rooms.bathroom.path);
basin.openScore();
const beforeSecret = basin.embed.firstChild;
for (let i = 0; i < 5; ++i) basin.key("ArrowRight");
for (let i = 0; i < 5; ++i) basin.key("ArrowUp");
assert.equal(basin.location.pathname, atlas.rooms.sluice.path,
  "The concealed basin entrance did not navigate to the sewers");
assert.notEqual(basin.embed.firstChild, beforeSecret);
assert.equal(basin.title.textContent, "The Chamber of Secrets");
basin.history.back();
assert.equal(basin.location.pathname, atlas.rooms.bathroom.path);
assert.equal(basin.title.textContent, "Hedwig's Theme");
basin.history.forward();
assert.equal(basin.title.textContent, "The Chamber of Secrets");

// The other concealed passage must also refresh its score on entry and history traversal.
const tapestry = harness(atlas.rooms.corridor.path);
tapestry.openScore();
for (let i = 0; i < 3; ++i) tapestry.key("ArrowLeft");
for (let i = 0; i < 6; ++i) tapestry.key("ArrowUp");
assert.equal(tapestry.location.pathname, atlas.rooms.requirement.path);
assert.equal(tapestry.title.textContent, "A Window to the Past");
tapestry.history.back();
assert.equal(tapestry.title.textContent, "Hedwig's Theme");
tapestry.history.forward();
assert.equal(tapestry.title.textContent, "A Window to the Past");

// Compatibility with legacy hash links is derived from atlas path segments.
const hashed = harness("/hogwarts/", { hash: "#/chamber-of-secrets/" });
assert.equal(hashed.title.textContent, "The Chamber of Secrets");
hashed.changeHash("#/great-hall/");
assert.equal(hashed.title.textContent, "Entry into the Great Hall and the Banquet");
hashed.changeHash("#/castle/upper-keep/astronomy-tower/");
assert.equal(hashed.title.textContent, "Dumbledore's Farewell");

console.log("Hogwarts soundtrack checks passed: 49 room routes, nine score groups, normal/history/secret/hash transitions, official embeds.");
