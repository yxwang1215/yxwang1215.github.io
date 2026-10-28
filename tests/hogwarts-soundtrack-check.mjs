// Dependency-free integration tests for the real atlas, explorer and soundtrack.
// Spotify is an external boundary: the fixture implements its documented event
// payloads while assertions exercise our loading, playback and preference logic.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const atlasSource = readFileSync("assets/js/hogwarts-atlas.js", "utf8");
const scenesSource = readFileSync("assets/js/hogwarts-scenes.js", "utf8");
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
  set innerHTML(html) {
    this.html = html;
    this.children = [];
    // Materialize the explorer's interactive targets from its rendered markup.
    for (const match of html.matchAll(/<(div|button|a)\b[^>]*\s(data-(?:door|secret|ceremony))(?:="([^"]*)")?[^>]*>/g)) {
      const element = new Element(match[1]);
      for (const attribute of match[0].matchAll(/([a-z][\w-]*)="([^"]*)"/g)) {
        element.setAttribute(attribute[1], attribute[2]);
      }
      element.setAttribute(match[2], match[3] || "");
      this.appendChild(element);
    }
  }
  get innerHTML() { return this.html || ""; }
  get firstChild() { return this.children[0] || null; }
  appendChild(element) { this.children.push(element); element.parent = this; return element; }
  removeChild(element) {
    const i = this.children.indexOf(element);
    if (i >= 0) this.children.splice(i, 1);
    return element;
  }
  replaceChild(replacement, element) {
    const i = this.children.indexOf(element);
    if (i >= 0) this.children.splice(i, 1, replacement);
    replacement.parent = this;
  }
  replaceChildren(...elements) { this.children = elements; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  getAttribute(name) {
    return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null;
  }
  addEventListener(type, listener) {
    (this.events[type] ||= []).push(listener);
  }
  emit(type, event = {}) {
    for (const listener of this.events[type] || []) listener(event);
  }
  querySelector(selector) {
    if (selector === "iframe") {
      return this.children.find(child => child.tagName === "IFRAME") || null;
    }
    if (selector.startsWith("[data-")) {
      return this.querySelectorAll(selector)[0] || null;
    }
    if (!this.queries.has(selector)) {
      const element = new Element();
      this.queries.set(selector, element);
      this.appendChild(element);
    }
    return this.queries.get(selector);
  }
  matches(selector) {
    return selector.split(",").some(part => {
      const match = part.trim().match(/^\[([^=\]\s]+)(?:="([^"]*)")?\]$/);
      return match && Object.hasOwn(this.attributes, match[1]) &&
        (match[2] === undefined || this.attributes[match[1]] === match[2]);
    });
  }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [
      ...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)
    ]);
  }
  contains(element) {
    return element === this || this.children.some(child => child.contains(element));
  }
  closest(selector) {
    if (this.matches(selector)) return this;
    return this.parent ? this.parent.closest(selector) : null;
  }
  focus() {}
}

function harness(start, options = {}) {
  const location = { pathname: start, hash: options.hash || "", replaced: null,
    replace(url) { this.replaced = url; },
    assign(url) { this.assigned = url; } };
  const listeners = Object.create(null);
  const sessionValues = new Map();
  const localValues = new Map(Object.entries(options.storage || {}));
  const store = values => ({
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  });
  const sessionStorage = store(sessionValues);
  const historyPaths = [start];
  let position = 0;
  function emit(type, data = {}) {
    for (const listener of listeners[type] || []) listener({ type, ...data });
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
  const documentEvents = Object.create(null);
  const timers = new Map();
  const fetches = [];
  let timerId = 0;
  const document = {
    body,
    title: "",
    createElement(tag) { return new Element(tag); },
    getElementById(id) {
      if (!domById.has(id)) domById.set(id, new Element());
      return domById.get(id);
    },
    addEventListener(type, listener) { (documentEvents[type] ||= []).push(listener); },
    emit(type, event = {}) {
      for (const listener of documentEvents[type] || []) listener({ type, target: body, ...event });
    }
  };
  const window = {
    location, history, sessionStorage, localStorage: store(localValues),
    performance: { now() { return 0; } },
    matchMedia() { return { matches: true }; },
    setTimeout(callback, delay = 0) {
      const id = ++timerId;
      if (delay < 1000) callback();
      else timers.set(id, callback);
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(callback) { callback(0); return 1; },
    cancelAnimationFrame() {},
    fetch(url) { fetches.push(url); return Promise.resolve({ ok: false }); },
    addEventListener(type, listener) {
      (listeners[type] ||= []).push(listener);
    },
    dispatchEvent(event) { emit(event.type); }
  };
  const context = vm.createContext({
    window, document, sessionStorage,
    Event: class { constructor(type) { this.type = type; } },
    Image: class {
      set src(value) {
        this.url = value;
        this.complete = true;
        this.naturalWidth = 1920;
        if (this.onload) this.onload();
      }
    },
    cancelAnimationFrame: window.cancelAnimationFrame,
    Audio: class {}, console
  });
  if (options.maze !== false) {
    vm.runInContext(atlasSource, context, { filename: "hogwarts-atlas.js", timeout: 1000 });
    vm.runInContext(scenesSource, context, { filename: "hogwarts-scenes.js", timeout: 1000 });
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
  const note = root.querySelector(".hw-score__note");
  const toggle = root.querySelector(".hw-score__local-toggle");
  const calls = [];
  let controller = null;
  let pendingControllerCallback = null;
  const api = {
    createController(mount, settings, callback) {
      calls.push(["create", settings]);
      function finishController() {
      const frame = new Element("iframe");
      const initial = settings.uri || settings.url;
      function frameUrl(entity) {
        const id = entity.startsWith("spotify:") ? entity.split(":").pop() : new URL(entity).pathname.split("/").pop();
        return "https://open.spotify.com/embed/track/" + id + "?theme=0";
      }
      frame.src = frameUrl(initial);
      mount.parent.replaceChild(frame, mount);
      const eventHandlers = Object.create(null);
      controller = {
        addListener(type, handler) { (eventHandlers[type] ||= []).push(handler); },
        emit(type, data = {}) {
          for (const handler of eventHandlers[type] || []) handler({ data });
        },
        play() { calls.push(["play"]); },
        resume() { calls.push(["resume"]); },
        pause() { calls.push(["pause"]); },
        loadEntity(entity) {
          calls.push(["load", entity]);
          if (options.failCueLoad) throw new Error("Provider could not load this cue");
          frame.src = frameUrl(entity);
        },
        destroy() {
          calls.push(["destroy"]);
          if (frame.parent) frame.parent.removeChild(frame);
        }
      };
      callback(controller);
      }
      if (options.deferControllerCallback) pendingControllerCallback = finishController;
      else finishController();
    }
  };
  const result = {
    window, location, history, seal, embed, title, root, note, toggle,
    document, calls, fetches, localValues,
    get controller() { return controller; },
    soundtrack: window.HogwartsSoundtrack,
    apiReady() {
      if (typeof window.onSpotifyIframeApiReady === "function") {
        window.onSpotifyIframeApiReady(api);
        if (controller && !options.deferPlayerReady) controller.emit("ready");
      }
    },
    resolveController() {
      if (pendingControllerCallback) {
        const callback = pendingControllerCallback;
        pendingControllerCallback = null;
        callback();
      }
      if (controller) controller.emit("ready");
    },
    playback(data) {
      controller.emit("playback_update", {
        playingURI: "spotify:track:" + result.soundtrack.selectForPath(location.pathname).spotify,
        isPaused: false, isBuffering: false, duration: 180000, position: 1200,
        ...data
      });
    },
    expireTimers() {
      const pending = [...timers.values()];
      timers.clear();
      pending.forEach(callback => callback());
    },
    emit,
    async walkThrough(direction) {
      const before = location.pathname;
      const atlas = window.HogwartsAtlas;
      const destination = atlas.rooms[atlas.byPath[before]].exits[direction];
      assert.ok(destination, "The current room must have the requested passage");
      const host = document.getElementById("hgw-stage");
      const target = host.querySelector('[data-door="' + direction + '"]');
      assert.ok(target, "The real scene must render the requested passage target");
      host.emit("click", { target, preventDefault() {}, stopImmediatePropagation() {} });
      assert.equal(result.soundtrack.getState().track,
        result.soundtrack.selectForPath(atlas.rooms[destination].path).id,
        "Clicking the pictured passage must select its soundtrack without opening the player panel");
      await Promise.resolve();
      assert.equal(location.pathname, atlas.rooms[destination].path,
        "An intentional click on the rendered passage must reach its atlas destination");
    },
    async activateSecret(expectedRole) {
      const host = document.getElementById("hgw-stage");
      const target = host.querySelector("[data-secret]");
      assert.ok(target, "The room must render an interactive secret target");
      assert.equal(target.getAttribute("role"), expectedRole,
        "Secret discovery must be a local button before it becomes a traversable opening");
      const scoreBefore = result.soundtrack.getState().track;
      const fromId = window.HogwartsAtlas.byPath[location.pathname];
      host.emit("click", { target, preventDefault() {}, stopImmediatePropagation() {} });
      assert.equal(result.soundtrack.getState().track,
        expectedRole === "link"
          ? result.soundtrack.selectForPath(window.HogwartsAtlas.rooms[
            window.HogwartsAtlas.rooms[fromId].secret.to].path).id
          : scoreBefore,
        "Revealing a secret must preserve the score until its open doorway is clicked");
      await Promise.resolve();
    },
    key(key) {
      document.emit("keydown", { key, altKey: false, ctrlKey: false, metaKey: false });
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
    openScore() { seal.emit("click"); },
    toggleScore() { toggle.emit("click"); },
    playScore() { root.querySelector(".hw-score__play").emit("click"); }
  };
  if (options.api !== false) result.apiReady();
  return result;
}

const world = harness("/hogwarts/");
assert.ok(world.document.body.children.some(element =>
  element.src === "https://open.spotify.com/embed/iframe-api/v1"),
"The official player API must load on entry, before opening the music panel");
assert.equal(world.fetches.length, 0,
  "Scene music must not depend on HEAD requests for MP3s absent from the site");
assert.ok(world.calls.some(call => call[0] === "play" || call[0] === "resume"),
  "A ready official player must attempt playback when sound is enabled");
assert.notEqual(world.root.getAttribute("data-state"), "playing",
  "A playback attempt alone is not evidence that music has started");
world.playback({});
assert.equal(world.root.getAttribute("data-state"), "playing",
  "The playing state must follow the official player's playback event");
const atlas = world.window.HogwartsAtlas;
const actualIds = Object.keys(atlas.rooms);
assert.equal(actualIds.length, 113, "Room count unexpectedly changed");

const expected = {
  hedwig: ["gate", "entry", "kitchens", "pantry", "cloister", "transfig",
    "baths", "bathroom", "history", "corridor", "charms", "defense",
    "basementPassage", "firstFloorJunction"],
  grounds: ["forecourt", "courtyard", "bridge", "lake", "boathouse", "dock",
    "forest", "clearing", "hut", "paddock", "greenhouse", "herbology"],
  great: ["great"],
  memory: ["gallery", "armoury", "hospital", "library", "office",
    "oldArchive", "vault", "requirement"],
  staircases: ["staircase", "astrStair", "midFloorStair"],
  tower: ["astrTower", "divination", "owlery", "ramparts", "northTowerLanding"],
  potions: ["dungeonSteps", "potions", "crypt", "slytherin"],
  chamber: ["reservoir", "sluice", "chamber", "sanctum"],
  quidditch: ["quidditch", "flying"]
};
const expectedIds = Object.values(expected).flat();
assert.deepEqual([...expectedIds].sort(), [...actualIds].filter(id => expectedIds.includes(id)).sort(),
  "All existing 53 rooms must retain their previously validated soundtrack");
for (const id of actualIds.filter(id => !expectedIds.includes(id))) {
  const track = world.soundtrack.selectForPath(atlas.rooms[id].path);
  assert.match(track.spotify, /^[a-zA-Z0-9]{22}$/, "New room must receive a valid soundtrack: " + id);
}
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

// A normal passage changes the URL, then emits hogwarts:scenechange. One player
// survives every passage; cue changes are sent to the official controller.
world.openScore();
let themeFrame = world.embed.firstChild;
assert.match(themeFrame.src, /^https:\/\/open\.spotify\.com\/embed\/track\//);
await world.walkThrough("n");
assert.equal(world.location.pathname, atlas.rooms.entry.path);
assert.equal(world.embed.firstChild, themeFrame,
  "Passing between rooms with one score should preserve the current player");
await world.walkThrough("n");
assert.equal(world.location.pathname, atlas.rooms.great.path);
assert.equal(world.embed.firstChild.src,
  "https://open.spotify.com/embed/track/" + world.soundtrack.selectForPath(atlas.rooms.great.path).spotify + "?theme=0");
assert.equal(world.embed.firstChild, themeFrame,
  "Great Hall must load its cue without replacing the initialized player");
assert.ok(world.calls.some(call => call[0] === "load" &&
  /0UDSwgomgI5bK1x1eYeBez/.test(call[1])), "Great Hall cue was not loaded");
world.history.back();
assert.equal(world.location.pathname, atlas.rooms.entry.path);
assert.equal(world.title.textContent, "Hedwig's Theme", "Back did not update the score");
world.history.forward();
assert.equal(world.location.pathname, atlas.rooms.great.path);
assert.equal(world.title.textContent, "Entry into the Great Hall and the Banquet",
  "Forward did not restore the Great Hall score");

// Revealing the basin changes only the local picture. The separate, deliberate
// click on the open pipe changes rooms and switches to the Chamber score.
const basin = harness(atlas.rooms.bathroom.path);
basin.openScore();
const beforeSecret = basin.embed.firstChild;
const basinController = basin.controller;
const basinScore = basin.title.textContent;
const basinLoads = basin.calls.filter(call => call[0] === "load").length;
await basin.activateSecret("button");
assert.equal(basin.location.pathname, atlas.rooms.bathroom.path,
  "Revealing the basin must stay in the bathroom until the open pipe is activated");
assert.equal(basin.title.textContent, basinScore,
  "Revealing a hidden opening must not change the room's score");
assert.equal(basin.embed.firstChild, beforeSecret,
  "The local reveal must preserve the initialized player iframe");
assert.equal(basin.controller, basinController,
  "The local reveal must preserve the initialized Spotify controller");
assert.equal(basin.calls.filter(call => call[0] === "load").length, basinLoads,
  "A local reveal must not load a different recording");
await basin.activateSecret("link");
assert.equal(basin.location.pathname, atlas.rooms.sluice.path,
  "The visibly open pipe did not navigate to the sewers");
assert.equal(basin.embed.firstChild, beforeSecret,
  "The secret passage must retain the initialized player");
assert.equal(basin.title.textContent, "The Chamber of Secrets");
basin.history.back();
assert.equal(basin.location.pathname, atlas.rooms.bathroom.path);
assert.equal(basin.title.textContent, "Hedwig's Theme");
basin.history.forward();
assert.equal(basin.title.textContent, "The Chamber of Secrets");

// The wall opposite the tapestry first reveals a door. Its subsequent entry
// must refresh the score, with the same history and player continuity.
const wall = harness(atlas.rooms.corridor.path);
wall.openScore();
const wallFrame = wall.embed.firstChild;
const wallController = wall.controller;
const wallScore = wall.title.textContent;
const wallLoads = wall.calls.filter(call => call[0] === "load").length;
await wall.activateSecret("button");
assert.equal(wall.location.pathname, atlas.rooms.corridor.path,
  "Revealing the Room of Requirement door must stay in the corridor");
assert.equal(wall.title.textContent, wallScore,
  "The wall reveal must preserve the corridor's score");
assert.equal(wall.embed.firstChild, wallFrame);
assert.equal(wall.controller, wallController);
assert.equal(wall.calls.filter(call => call[0] === "load").length, wallLoads,
  "The wall reveal must not load a different recording");
await wall.activateSecret("link");
assert.equal(wall.location.pathname, atlas.rooms.requirement.path);
assert.equal(wall.embed.firstChild, wallFrame,
  "Entering the revealed door must retain the initialized player");
assert.equal(wall.controller, wallController);
assert.equal(wall.title.textContent, "A Window to the Past");
wall.history.back();
assert.equal(wall.title.textContent, "Hedwig's Theme");
wall.history.forward();
assert.equal(wall.title.textContent, "A Window to the Past");

// Compatibility with legacy hash links is derived from atlas path segments.
const hashed = harness("/hogwarts/", { hash: "#/chamber-of-secrets/" });
assert.equal(hashed.title.textContent, "The Chamber of Secrets");
hashed.changeHash("#/great-hall/");
assert.equal(hashed.title.textContent, "Entry into the Great Hall and the Banquet");
hashed.changeHash("#/castle/upper-keep/astronomy-tower/");
assert.equal(hashed.title.textContent, "Dumbledore's Farewell");

// A provider that has not confirmed playback must not be presented as playing.
// Every supported visitor gesture retries synchronously, without another fetch.
const waiting = harness(atlas.rooms.paddock.path);
waiting.expireTimers();
assert.equal(waiting.root.getAttribute("data-state"), "waiting");
for (const [type, event] of [["click", {}], ["touchend", {}],
  ["keydown", { key: "ArrowUp" }]]) {
  const before = waiting.calls.filter(call => ["play", "resume"].includes(call[0])).length;
  waiting.document.emit(type, event);
  assert.ok(waiting.calls.filter(call => ["play", "resume"].includes(call[0])).length > before,
    type + " must retry blocked playback directly in the gesture handler");
}
waiting.playback({ isBuffering: true });
assert.notEqual(waiting.root.getAttribute("data-state"), "playing");
waiting.expireTimers();
assert.equal(waiting.root.getAttribute("data-state"), "waiting",
  "A stalled buffer must offer a manual retry instead of waiting forever");
waiting.playback({});
assert.equal(waiting.root.getAttribute("data-state"), "playing");
const playingCalls = waiting.calls.length;
waiting.document.emit("click");
assert.equal(waiting.calls.length, playingCalls, "Routine movement must not restart playing music");

// Showing and hiding settings must preserve playback and the initialized iframe.
const stableFrame = waiting.embed.firstChild;
waiting.openScore();
waiting.openScore();
assert.equal(waiting.embed.firstChild, stableFrame);
assert.equal(waiting.calls.length, playingCalls, "Closing the panel must not stop the music");

// A visitor's pause persists through input, scene changes, page restoration and reload.
waiting.toggleScore();
assert.equal(waiting.localValues.get("hogwarts:score:enabled:v1"), "off");
assert.ok(waiting.calls.some(call => call[0] === "pause"));
const afterPause = waiting.calls.filter(call => ["play", "resume"].includes(call[0])).length;
waiting.document.emit("click");
waiting.document.emit("keydown", { key: "ArrowUp" });
waiting.location.pathname = atlas.rooms.library.path;
waiting.soundtrack.sync();
waiting.emit("pageshow", { persisted: true });
assert.equal(waiting.calls.filter(call => ["play", "resume"].includes(call[0])).length, afterPause,
  "Navigation and gestures must not undo a visitor's pause");
const muted = harness(atlas.rooms.paddock.path, {
  storage: { "hogwarts:score:enabled:v1": "off" }
});
assert.equal(muted.calls.filter(call => ["play", "resume"].includes(call[0])).length, 0);
muted.document.emit("click");
assert.equal(muted.calls.filter(call => ["play", "resume"].includes(call[0])).length, 0);
muted.toggleScore();
assert.equal(muted.localValues.get("hogwarts:score:enabled:v1"), "on");
assert.ok(muted.calls.some(call => ["play", "resume"].includes(call[0])));

// A pause made in Spotify's own controls is also a visitor preference.
const embeddedPause = harness(atlas.rooms.paddock.path);
embeddedPause.playback({});
embeddedPause.playback({ isPaused: true, position: 3400 });
assert.equal(embeddedPause.localValues.get("hogwarts:score:enabled:v1"), "off");
const pausedCalls = embeddedPause.calls.length;
embeddedPause.document.emit("click");
assert.equal(embeddedPause.calls.length, pausedCalls);
embeddedPause.playback({ isPaused: false, position: 3500 });
assert.equal(embeddedPause.localValues.get("hogwarts:score:enabled:v1"), "on",
  "Play in Spotify's controls should restore the enabled preference");

// Buffering after playback has begun must not erase a visitor's later Pause.
const bufferedPause = harness(atlas.rooms.paddock.path);
bufferedPause.playback({});
bufferedPause.playback({ isBuffering: true, position: 3400 });
bufferedPause.playback({ isPaused: true, position: 3400 });
assert.equal(bufferedPause.localValues.get("hogwarts:score:enabled:v1"), "off",
  "A pause from the buffering state must be saved as the visitor's preference");
const bufferedPauseCalls = bufferedPause.calls.length;
bufferedPause.document.emit("click");
assert.equal(bufferedPause.calls.length, bufferedPauseCalls,
  "Scene interaction must not resume a soundtrack paused while buffering");

// Some Spotify previews finish with a terminal position but isPaused:false.
// A natural end preserves the preference and requires an explicit replay.
const endedPreview = harness(atlas.rooms.paddock.path);
endedPreview.playback({ duration: 30000, position: 1200 });
endedPreview.playback({ duration: 30000, position: 30000, isPaused: false });
assert.equal(endedPreview.soundtrack.getState().state, "ended",
  "The end of a preview must not remain marked as playing");
assert.equal(endedPreview.soundtrack.getState().enabled, true);
const endedCalls = endedPreview.calls.length;
endedPreview.document.emit("click");
endedPreview.openScore();
assert.equal(endedPreview.calls.length, endedCalls,
  "An incidental click or panel opening must not restart a finished preview");
endedPreview.playScore();
assert.equal(endedPreview.calls.at(-1)[0], "play",
  "The explicit Play action may replay a finished preview");

// If the provider stops sending events, its last playing report must expire
// into an unknown state, without asserting that audio stopped or changing mute.
const stalePlayback = harness(atlas.rooms.paddock.path);
stalePlayback.playback({ duration: 180000, position: 29000 });
const beforeStale = stalePlayback.calls.length;
stalePlayback.expireTimers();
assert.equal(stalePlayback.soundtrack.getState().state, "unconfirmed");
assert.equal(stalePlayback.soundtrack.getState().enabled, true);
stalePlayback.document.emit("click");
assert.equal(stalePlayback.calls.length, beforeStale,
  "Missing confirmations must not pause or resume the provider automatically");
stalePlayback.playback({ duration: 180000, position: 46000 });
assert.equal(stalePlayback.soundtrack.getState().state, "playing",
  "A fresh provider confirmation must restore the playing indication");

// Back/forward cache restoration resumes only a soundtrack that was enabled.
const restored = harness(atlas.rooms.paddock.path);
restored.playback({});
restored.emit("pagehide", { persisted: true });
assert.equal(restored.calls.at(-1)[0], "pause");
restored.playback({ isPaused: true });
assert.notEqual(restored.localValues.get("hogwarts:score:enabled:v1"), "off",
  "A lifecycle pause must not be saved as the visitor's mute preference");
restored.emit("pageshow", { persisted: true });
assert.ok(["play", "resume"].includes(restored.calls.at(-1)[0]));
restored.playback({ isPaused: true });
assert.notEqual(restored.localValues.get("hogwarts:score:enabled:v1"), "off",
  "A late lifecycle pause after page restore must not override the requested resume");

const lateStart = harness(atlas.rooms.paddock.path);
lateStart.toggleScore();
lateStart.playback({ isPaused: false });
assert.equal(lateStart.localValues.get("hogwarts:score:enabled:v1"), "off");
assert.equal(lateStart.calls.at(-1)[0], "pause",
  "A late provider start must be stopped after the visitor mutes");

const zeroVolume = harness(atlas.rooms.paddock.path, {
  storage: { "hogwarts:score:volume:v1": "0" }
});
assert.equal(zeroVolume.calls.filter(call => ["play", "resume"].includes(call[0])).length, 0,
  "A saved zero-volume preference must not become audible after the upgrade");

const failedCue = harness(atlas.rooms.paddock.path, { failCueLoad: true });
const beforeFailure = failedCue.calls.filter(call => ["play", "resume"].includes(call[0])).length;
failedCue.location.pathname = atlas.rooms.library.path;
failedCue.soundtrack.sync();
assert.equal(failedCue.calls.filter(call => ["play", "resume"].includes(call[0])).length, beforeFailure,
  "A failed cue change must not play the previous room's recording");

// Slow API arrival and late playback events must not restore the departed cue.
const delayed = harness("/hogwarts/", { api: false });
delayed.location.pathname = atlas.rooms.paddock.path;
delayed.soundtrack.sync();
delayed.apiReady();
const created = delayed.calls.find(call => call[0] === "create")[1];
assert.match(created.uri || created.url, /5qWvQZewRB57giOKgvUE3F/);
delayed.playback({ playingURI: "spotify:track:1n8NKQRg8LVHy7oUhUgbFF" });
assert.notEqual(delayed.root.getAttribute("data-state"), "playing",
  "A late event for the departed track must not confirm the new scene's playback");

// If the controller script is blocked, the visitor still gets an official player.
const unavailable = harness(atlas.rooms.paddock.path, { api: false });
unavailable.document.body.children.find(element =>
  element.src === "https://open.spotify.com/embed/iframe-api/v1").emit("error");
assert.match(unavailable.embed.firstChild.src,
  /^https:\/\/open\.spotify\.com\/embed\/track\/5qWvQZewRB57giOKgvUE3F/);
assert.equal(unavailable.root.getAttribute("data-state"), "unavailable");
assert.notEqual(unavailable.note.textContent, "");
const fallbackFrame = unavailable.embed.firstChild;
unavailable.expireTimers();
assert.equal(unavailable.embed.firstChild, fallbackFrame,
  "A pending API timeout must not replace a fallback the visitor may be playing");

// A loaded API can still stall while creating its controller. Retire that
// attempt before mounting a standard player, including any late callbacks.
for (const options of [{ deferControllerCallback: true }, { deferPlayerReady: true }]) {
  const stalledController = harness(atlas.rooms.paddock.path, options);
  stalledController.expireTimers();
  assert.equal(stalledController.embed.firstChild.tagName, "IFRAME",
    "Controller initialization timeout must leave a usable standard Spotify iframe");
  assert.match(stalledController.embed.firstChild.src,
    /^https:\/\/open\.spotify\.com\/embed\/track\/5qWvQZewRB57giOKgvUE3F/);
  assert.equal(stalledController.root.getAttribute("data-state"), "unavailable");
  const retainedFallback = stalledController.embed.firstChild;
  stalledController.resolveController();
  assert.equal(stalledController.embed.firstChild, retainedFallback,
    "A late controller callback must not replace the visitor's fallback player");
  assert.equal(stalledController.soundtrack.getState().ready, false,
    "A retired controller's late ready event must be ignored");
  assert.equal(stalledController.calls.filter(call => ["play", "resume"].includes(call[0])).length, 0,
    "A retired controller must never start a second soundtrack");
}

console.log("Hogwarts soundtrack checks passed: 113 atlas routes; deliberate passage clicks; local secret reveals before travel; stable Spotify controller; ready/gesture playback; truthful state; pause persistence; panel, history and lifecycle continuity; provider fallback.");
