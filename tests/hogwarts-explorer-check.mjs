// Runtime regressions for image-backed rooms and intentional passage navigation.
// Only the browser boundary is simulated: the atlas, scene data, explorer,
// animation callbacks, session writes and navigation handlers are real code.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import test from "node:test";
import vm from "node:vm";

const scripts = ["hogwarts-atlas.js", "hogwarts-scenes.js", "hogwarts-explore.js"]
  .map(name => [name, readFileSync(new URL("../assets/js/" + name, import.meta.url), "utf8")]);

class BrowserEvent {
  constructor(type, options = {}) { Object.assign(this, { type, bubbles: false }, options); }
  preventDefault() { this.defaultPrevented = true; }
  stopPropagation() { this.stopped = true; }
  stopImmediatePropagation() { this.stopped = this.immediate = true; }
}

class Element {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.listeners = [];
    this.style = { setProperty(name, value) { this[name] = String(value); } };
    this.classList = {
      contains: name => (this.className || "").split(/\s+/).includes(name),
      add: (...names) => { this.className = [...new Set((this.className || "").split(/\s+/).concat(names))].join(" ").trim(); },
      remove: (...names) => { this.className = (this.className || "").split(/\s+/).filter(name => !names.includes(name)).join(" "); },
      toggle: (name, force) => {
        const add = force ?? !this.classList.contains(name);
        this.classList[add ? "add" : "remove"](name);
        return add;
      }
    };
  }
  get id() { return this.getAttribute("id") || ""; }
  set id(value) { this.setAttribute("id", value); }
  get className() { return this.getAttribute("class") || ""; }
  set className(value) { this.setAttribute("class", value); }
  get src() { return this.getAttribute("src") || ""; }
  set src(value) { this.setAttribute("src", value); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null; }
  removeAttribute(name) { delete this.attributes[name]; }
  appendChild(child) { this.children.push(child); child.parentNode = child.parentElement = this; return child; }
  get innerHTML() { return this.html || ""; }
  set innerHTML(html) {
    this.html = String(html);
    this.children = [];
    // The explorer emits ordinary HTML. Parse its nodes and attributes so that
    // missing selectors stay missing; do not invent elements for queries.
    const stack = [this];
    for (const token of this.html.matchAll(/<(\/?)([\w-]+)\b([^>]*)>/g)) {
      const [, closing, tag, attributes] = token;
      if (closing) { if (stack.length > 1) stack.pop(); continue; }
      const node = new Element(tag);
      for (const attribute of attributes.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        node.setAttribute(attribute[1], attribute[2] ?? attribute[3] ?? attribute[4] ?? "");
      }
      stack.at(-1).appendChild(node);
      if (!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag) && !/\/\s*$/.test(attributes)) stack.push(node);
    }
  }
  matches(selector) {
    return selector.split(",").some(part => {
      const value = part.trim();
      const tag = value.match(/^[\w-]+/);
      if (tag && tag[0].toUpperCase() !== this.tagName) return false;
      for (const item of value.matchAll(/([.#])([\w-]+)|\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g)) {
        if (item[1] === "." && !this.classList.contains(item[2])) return false;
        if (item[1] === "#" && this.id !== item[2]) return false;
        if (item[3] && (this.getAttribute(item[3]) === null || (item[4] !== undefined && this.getAttribute(item[3]) !== item[4]))) return false;
      }
      return true;
    });
  }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
  contains(node) { return node === this || this.children.some(child => child.contains(node)); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 1000, height: 562.5, right: 1000, bottom: 562.5 }; }
  addEventListener(type, callback, options = {}) {
    this.listeners.push({ type, callback, capture: options === true || !!options.capture, once: !!options.once });
  }
  dispatchEvent(event) {
    event.target ||= this;
    const path = [];
    for (let node = this; node; node = node.parentElement) path.push(node);
    const invoke = (node, capture) => {
      event.currentTarget = node;
      for (const item of [...node.listeners]) {
        if (item.type !== event.type || item.capture !== capture) continue;
        item.callback(event);
        if (item.once) node.listeners.splice(node.listeners.indexOf(item), 1);
        if (event.immediate) break;
      }
    };
    for (const node of [...path].reverse()) { invoke(node, true); if (event.stopped) return !event.defaultPrevented; }
    for (const node of event.bubbles ? path : [this]) { invoke(node, false); if (event.stopped) break; }
    if (!event.immediate && typeof this["on" + event.type] === "function") this["on" + event.type](event);
    return !event.defaultPrevented;
  }
  click() { this.dispatchEvent(new BrowserEvent("click", { bubbles: true })); }
  focus() {}
}

async function harness(startId, options = {}) {
  const body = new Element("body");
  for (const id of ["hgw-stage", "hgw-title", "hgw-overline", "hgw-summary", "hgw-teacher", "hgw-observation", "hgw-visited", "hgw-location", "hgw-announce", "hgw-shell"]) {
    const node = new Element(); node.id = id; body.appendChild(node);
  }
  const document = {
    body, title: "", createElement: tag => new Element(tag),
    getElementById: id => body.querySelector("#" + id),
    querySelector: selector => body.querySelector(selector),
    addEventListener: (...args) => body.addEventListener(...args)
  };
  const values = new Map();
  const sessionStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
  const listeners = new Map(), tasks = new Map(), changes = [], imageResponses = [];
  let clock = 0, taskId = 0, position = 0;
  const location = {
    pathname: "", hash: "", reload() { this.reloaded = true; }, replace(url) { this.replaced = url; }, assign(url) { this.assigned = url; }
  };
  const paths = [];
  const emit = event => {
    if (event.type === "hogwarts:scenechange") changes.push(location.pathname);
    for (const callback of listeners.get(event.type) || []) callback(event);
  };
  const history = {
    pushState(_state, _title, url) { paths.splice(position + 1); paths.push(url); position++; location.pathname = url; },
    replaceState(_state, _title, url) { paths[position] = url; location.pathname = url; },
    back() { if (position > 0) { location.pathname = paths[--position]; emit(new BrowserEvent("popstate")); } },
    forward() { if (position + 1 < paths.length) { location.pathname = paths[++position]; emit(new BrowserEvent("popstate")); } }
  };
  const schedule = (callback, delay = 0) => {
    const id = ++taskId; tasks.set(id, { callback, due: clock + delay }); return id;
  };
  const window = {
    document, location, history, sessionStorage, crypto: webcrypto,
    performance: { now: () => clock }, matchMedia: () => ({ matches: false }),
    setTimeout: schedule, clearTimeout: id => tasks.delete(id),
    requestAnimationFrame: callback => schedule(() => callback(clock), 16),
    cancelAnimationFrame: id => tasks.delete(id),
    addEventListener(type, callback) { listeners.set(type, [...(listeners.get(type) || []), callback]); },
    dispatchEvent: emit
  };
  const context = vm.createContext({ window, document, sessionStorage, console, Event: BrowserEvent,
    requestAnimationFrame: window.requestAnimationFrame, cancelAnimationFrame: window.cancelAnimationFrame,
    setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
    Image: class extends Element {
      constructor() { super("img"); this.complete = false; this.naturalWidth = 0; }
      set src(value) {
        this.setAttribute("src", value);
        const response = imageResponses.shift() || "load";
        if (response !== "timeout") schedule(() => {
          this.complete = true;
          this.naturalWidth = response === "load" ? 1672 : 0;
          this.dispatchEvent(new BrowserEvent(response));
        });
      }
    }
  });
  for (const [name, source] of scripts.slice(0, 2)) {
    if (options.catalogMissing && name === "hogwarts-scenes.js") continue;
    vm.runInContext(source, context, { filename: name, timeout: 1000 });
  }
  const atlas = window.HogwartsAtlas;
  assert.ok(atlas.rooms[startId], "Harness must start at a real room");
  location.pathname = atlas.rooms[startId].path;
  paths.push(location.pathname);
  sessionStorage.setItem("hogwarts:session:v2", JSON.stringify({ id: "explorer-runtime-check", issued: Date.now(), visited: [startId] }));
  vm.runInContext(scripts[2][1], context, { filename: scripts[2][0], timeout: 1000 });
  const run = {
    window, document, location, history, sessionStorage, changes, imageResponses, atlas, scenes: window.HogwartsScenes,
    stage: document.getElementById("hgw-stage"),
    get roomId() { return atlas.byPath[location.pathname]; },
    async flush() {
      let count = 0, idle = 0;
      // Native image callbacks resolve promises, which can schedule transition
      // timers. Drain microtasks between tasks, as the browser event loop does.
      while (idle < 3) {
        await Promise.resolve();
        if (!tasks.size) { idle++; continue; }
        idle = 0;
        assert.ok(++count <= 1000, "Explorer animation did not settle within 1000 callbacks");
        const [id, task] = [...tasks].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
        tasks.delete(id); clock = task.due; task.callback();
      }
    },
    async key(key) { emit(new BrowserEvent("keydown", { key, target: body })); await this.flush(); },
    async click(selector) {
      const target = this.stage.querySelector(selector);
      assert.ok(target, "Missing rendered interaction: " + selector);
      target.click(); await this.flush();
    }
  };
  await run.flush();
  return run;
}

test("all 49 rooms render their own dedicated image instead of procedural scenery", async () => {
  const catalog = (await harness("gate")).atlas.rooms;
  assert.equal(Object.keys(catalog).length, 49);
  const sources = new Set();
  for (const id of Object.keys(catalog)) {
    const run = await harness(id);
    const images = run.stage.querySelectorAll("img");
    assert.equal(images.length, 1, id + " must render exactly one scene image");
    assert.equal(images[0].getAttribute("src"), run.scenes[id].src, id + " must use its configured artwork");
    assert.ok(Number(images[0].getAttribute("width")) > 0 && Number(images[0].getAttribute("height")) > 0,
      id + " must reserve the image's intrinsic aspect ratio before loading");
    assert.equal(run.stage.querySelector(".hgw-groundscape,.hgw-backwall,.hgw-castle-svg,.hgw-landscape"), null,
      id + " must not overlay procedural scenery on the photograph");
    for (const direction of Object.keys(catalog[id].exits)) {
      assert.ok(run.stage.querySelector('[data-door="' + direction + '"]'), id + " is missing its " + direction + " passage");
    }
    sources.add(images[0].getAttribute("src"));
  }
  assert.equal(sources.size, 49, "Each room needs distinct scene artwork");
});

test("clicking the garden's east gate reaches Creature Paddock and persists the selected route", async () => {
  const run = await harness("hut");
  // The initial walker is on the garden's south return-path region. Its walk
  // toward the explicitly selected east gate must preserve that destination.
  const before = run.changes.length;
  await run.click('[data-door="e"]');
  assert.equal(run.roomId, "paddock", "The selected east gate must lead to Creature Paddock");
  assert.equal(run.changes.length, before + 1, "One intended passage must emit one scene change");
  assert.equal(run.changes.at(-1), "/hogwarts/grounds/keeper-hut/creature-paddock/");
  assert.equal(JSON.parse(run.sessionStorage.getItem("hogwarts:session:v2")).current,
    "/hogwarts/grounds/keeper-hut/creature-paddock/");
});

test("arrow movement enters the castle and browser back/forward restores the rendered room", async () => {
  const run = await harness("gate");
  for (let i = 0; i < 20 && run.roomId === "gate"; i++) await run.key("ArrowUp");
  assert.equal(run.roomId, "entry");
  assert.equal(run.document.getElementById("hgw-title").textContent, "Entrance Hall");
  run.history.back(); await run.flush();
  assert.equal(run.roomId, "gate");
  assert.equal(run.document.getElementById("hgw-title").textContent, "Hogwarts");
  assert.equal(run.stage.querySelector("img")?.getAttribute("src"), run.scenes.gate.src);
  run.history.forward(); await run.flush();
  assert.equal(run.roomId, "entry");
  assert.equal(run.stage.querySelector("img")?.getAttribute("src"), run.scenes.entry.src);
  assert.deepEqual(run.changes.slice(-3), [
    "/hogwarts/castle/keep/threshold/entry-vestibule/", "/hogwarts/",
    "/hogwarts/castle/keep/threshold/entry-vestibule/"
  ]);
  assert.equal(run.location.replaced, undefined, "Valid browser history must not restart the visit");
});

test("WASD movement can reach the garden's east passage", async () => {
  const run = await harness("hut");
  for (let i = 0; i < 4; i++) await run.key("w");
  for (let i = 0; i < 20 && run.roomId === "hut"; i++) await run.key("d");
  assert.equal(run.roomId, "paddock");
});

test("walking north through the Great Hall crosses the sorting area without starting the ceremony", async () => {
  const run = await harness("great");
  for (let i = 0; i < 20 && run.roomId === "great"; i++) await run.key("ArrowUp");
  assert.equal(run.location.assigned, undefined, "Ordinary movement must not activate the Sorting Ceremony");
  assert.equal(run.roomId, "armoury", "Walking north must reach the Armoury even when the path crosses the sorting area");
  assert.equal(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"), null,
    "Passing through the sorting area must not issue a ceremony pass");
});

for (const [room, selector, destination, path] of [
  ["bathroom", '[data-secret="basin"]', "sluice", "/hogwarts/under-castle/serpent-sewers/"],
  ["corridor", '[data-secret="tapestry"]', "requirement", "/hogwarts/castle/academic-wing/room-of-requirement/"]
]) {
  test(room + " secret hit target opens its hidden destination", async () => {
    const run = await harness(room);
    await run.click(selector);
    assert.equal(run.roomId, destination);
    assert.equal(run.changes.at(-1), path);
    assert.ok(JSON.parse(run.sessionStorage.getItem("hogwarts:session:v2")).visited.includes(destination));
  });
}

for (const activation of ["click", "Enter"]) {
  test("explicit " + activation + " on the sorting target opens the ceremony with a fresh session pass", async () => {
    const run = await harness("great");
    if (activation === "click") await run.click("[data-ceremony]");
    else {
      const target = run.stage.querySelector("[data-ceremony]");
      assert.ok(target, "The sorting target must be available for keyboard activation");
      target.dispatchEvent(new BrowserEvent("keydown", { key: "Enter", bubbles: true }));
      await run.flush();
    }
    assert.equal(run.location.assigned, "/hogwarts/sorting-ceremony/");
    const pass = JSON.parse(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"));
    assert.equal(pass.from, "/hogwarts/");
    assert.ok(Math.abs(Date.now() - pass.at) < 5000, "Ceremony pass must be issued for this visit");
    assert.match(pass.nonce, /^[0-9a-f]{32}$/);
  });
}

test("failed scene images never lock forward or return navigation", async () => {
  const run = await harness("hut");
  async function failCurrentImage() {
    const image = run.stage.querySelector("img");
    assert.ok(image, "An image must be rendered before its error can be exercised");
    image.complete = true; image.naturalWidth = image.naturalHeight = 0;
    image.dispatchEvent(new BrowserEvent("error")); await run.flush();
  }
  await failCurrentImage();
  run.imageResponses.push("error");
  await run.click('[data-door="e"]');
  assert.equal(run.roomId, "hut", "A failed destination load should preserve the current scene");
  await run.click('[data-door="e"]');
  assert.equal(run.roomId, "paddock");
  await failCurrentImage();
  await run.click('[data-door="w"]');
  assert.equal(run.roomId, "hut");
});

test("a destination image timeout permits retrying the same passage", async () => {
  const run = await harness("hut");
  run.imageResponses.push("timeout");
  await run.click('[data-door="e"]');
  assert.equal(run.roomId, "hut");
  await run.click('[data-door="e"]');
  assert.equal(run.roomId, "paddock");
});


test("a failed scene catalog offers reload without losing the visit session", async () => {
  const run = await harness("hut", {catalogMissing:true});
  assert.ok(run.stage.querySelector('[data-reload]'), "A failed catalog needs a visible recovery control");
  assert.ok(run.sessionStorage.getItem("hogwarts:session:v2"));
  await run.click('[data-reload]');
  assert.equal(run.location.reloaded, true);
});
