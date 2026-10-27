// Runtime regressions for intentional, image-bound passage navigation.
// Only the browser boundary is simulated. The real atlas, scene metadata,
// renderer, animation callbacks, image promises and history handlers execute.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import test from "node:test";
import vm from "node:vm";

const scripts = ["hogwarts-atlas.js", "hogwarts-scenes.js", "hogwarts-explore.js"]
  .map(name => [name, readFileSync(new URL("../assets/js/" + name, import.meta.url), "utf8")]);
const actionSelector = "[data-door],[data-secret],[data-ceremony]";

class BrowserEvent {
  constructor(type, options = {}) { Object.assign(this, { type, bubbles: false, defaultPrevented: false }, options); }
  preventDefault() { this.defaultPrevented = true; }
  stopPropagation() { this.stopped = true; }
  stopImmediatePropagation() { this.stopped = this.immediate = true; }
}
function compoundMatches(node, selector) {
  const tag = selector.match(/^[\w-]+/);
  if (tag && tag[0].toUpperCase() !== node.tagName) return false;
  for (const item of selector.matchAll(/([.#])([\w-]+)|\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g)) {
    if (item[1] === "." && !node.classList.contains(item[2])) return false;
    if (item[1] === "#" && node.id !== item[2]) return false;
    if (item[3] && (node.getAttribute(item[3]) === null ||
      item[4] !== undefined && node.getAttribute(item[3]) !== item[4])) return false;
  }
  return true;
}
class Element {
  constructor(tag = "div", ownerDocument = null) {
    this.tagName = tag.toUpperCase();
    this.ownerDocument = ownerDocument;
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
  appendChild(child) {
    this.children.push(child);
    child.parentNode = child.parentElement = this;
    child.ownerDocument = this.ownerDocument;
    return child;
  }
  get innerHTML() { return this.html || ""; }
  set innerHTML(html) {
    this.html = String(html);
    if (this.ownerDocument?.activeElement && this.contains(this.ownerDocument.activeElement)) {
      this.ownerDocument.activeElement = this.ownerDocument.body;
    }
    for (const child of this.children) child.parentNode = child.parentElement = null;
    this.children = [];
    // Parse emitted HTML instead of inventing nodes for requested selectors.
    const stack = [this];
    for (const token of this.html.matchAll(/<(\/?)([\w-]+)\b([^>]*)>/g)) {
      const [, closing, tag, attributes] = token;
      if (closing) { if (stack.length > 1) stack.pop(); continue; }
      const node = new Element(tag, this.ownerDocument);
      for (const attribute of attributes.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        node.setAttribute(attribute[1], attribute[2] ?? attribute[3] ?? attribute[4] ?? "");
      }
      stack.at(-1).appendChild(node);
      if (!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag) &&
        !/\/\s*$/.test(attributes)) stack.push(node);
    }
  }
  matches(selector) {
    return selector.split(",").some(part => {
      const pieces = part.trim().split(/\s+(?![^\[]*\])/);
      if (!compoundMatches(this, pieces.at(-1))) return false;
      let parent = this.parentElement;
      for (let i = pieces.length - 2; i >= 0; i--) {
        while (parent && !compoundMatches(parent, pieces[i])) parent = parent.parentElement;
        if (!parent) return false;
        parent = parent.parentElement;
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
  getBoundingClientRect() {
    const width = this.ownerDocument?.viewportWidth || 1000;
    const stage = this.ownerDocument?.getElementById("hgw-stage");
    const ratio = (stage?.style.aspectRatio || "16 / 9").split("/").map(Number);
    const height = width * ratio[1] / ratio[0];
    return { left: 24, top: 30, width, height, right: 24 + width, bottom: 30 + height };
  }
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
      if (!capture && !event.immediate && typeof node["on" + event.type] === "function") node["on" + event.type](event);
    };
    for (const node of [...path].reverse()) {
      invoke(node, true);
      if (event.stopped) return !event.defaultPrevented;
    }
    for (const node of event.bubbles ? path : [this]) {
      invoke(node, false);
      if (event.stopped) break;
    }
    if (event.bubbles && !event.stopped && path.at(-1) === this.ownerDocument?.body) {
      this.ownerDocument.emitWindow(event);
    }
    return !event.defaultPrevented;
  }
  click() { this.dispatchEvent(new BrowserEvent("click", { bubbles: true, detail: 0 })); }
  focus() {
    const document = this.ownerDocument;
    if (!document || document.activeElement === this) return;
    const previous = document.activeElement;
    previous?.dispatchEvent(new BrowserEvent("focusout", { bubbles: true, relatedTarget: this }));
    document.activeElement = this;
    this.dispatchEvent(new BrowserEvent("focusin", { bubbles: true, relatedTarget: previous }));
  }
}
function pointInside(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    const cross = (b[0] - a[0]) * (point[1] - a[1]) - (b[1] - a[1]) * (point[0] - a[0]);
    if (Math.abs(cross) < 1e-8 && point[0] >= Math.min(a[0], b[0]) - 1e-8 &&
      point[0] <= Math.max(a[0], b[0]) + 1e-8 && point[1] >= Math.min(a[1], b[1]) - 1e-8 &&
      point[1] <= Math.max(a[1], b[1]) + 1e-8) return true;
    if ((a[1] > point[1]) !== (b[1] > point[1]) &&
      point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function renderedRegion(element) {
  // Browser hit testing is based on the emitted CSS clip, not the source data.
  const style = element.getAttribute("style") || "";
  const percent = name => {
    const match = style.match(new RegExp("(?:^|;)\\s*" + name + ":\\s*([-+.\\d]+)%"));
    assert.ok(match, "Rendered action is missing percentage " + name);
    return Number(match[1]);
  };
  const left = percent("left"), top = percent("top"), width = percent("width"), height = percent("height");
  assert.ok(width > 0 && height > 0, "Rendered action needs a nonzero box");
  const clip = style.match(/clip-path:\s*polygon\(([^)]+)\)/);
  assert.ok(clip, "A passage must be clipped to its physical polygon");
  const polygon = clip[1].split(",").map(pair => {
    const [x, y] = pair.trim().split(/\s+/).map(parseFloat);
    return [left + x / 100 * width, top + y / 100 * height];
  });
  return { left, top, width, height, polygon };
}
function hitTarget(stage, x, y) {
  return stage.querySelectorAll(actionSelector).reverse()
    .find(element => pointInside([x, y], renderedRegion(element).polygon)) || null;
}

async function harness(startId, options = {}) {
  const document = { title: "", viewportWidth: options.viewportWidth || 1000 };
  const body = new Element("body", document);
  document.body = body; document.activeElement = body;
  Object.assign(document, {
    createElement: tag => new Element(tag, document),
    getElementById: id => body.querySelector("#" + id),
    querySelector: selector => body.querySelector(selector),
    querySelectorAll: selector => body.querySelectorAll(selector),
    addEventListener: (...args) => body.addEventListener(...args)
  });
  for (const id of ["hgw-stage", "hgw-title", "hgw-overline", "hgw-summary", "hgw-teacher",
    "hgw-observation", "hgw-visited", "hgw-location", "hgw-announce", "hgw-shell"]) {
    const node = new Element("div", document); node.id = id; body.appendChild(node);
  }
  const values = new Map();
  const sessionStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
  const listeners = new Map(), tasks = new Map(), changes = [], imageResponses = [], imageRequests = [];
  let clock = 0, taskId = 0, position = 0;
  const location = {
    pathname: "", hash: "",
    reload() { this.reloaded = true; },
    replace(url) { this.replaced = url; },
    assign(url) { this.assigned = url; }
  };
  const paths = [];
  const emit = event => {
    if (event.type === "hogwarts:scenechange") changes.push(location.pathname);
    for (const callback of listeners.get(event.type) || []) callback(event);
  };
  document.emitWindow = emit;
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
    performance: { now: () => clock },
    matchMedia: () => ({ matches: !!options.reducedMotion }),
    setTimeout: schedule, clearTimeout: id => tasks.delete(id),
    requestAnimationFrame: callback => schedule(() => callback(clock), 16),
    cancelAnimationFrame: id => tasks.delete(id),
    addEventListener(type, callback) { listeners.set(type, [...(listeners.get(type) || []), callback]); },
    dispatchEvent: emit
  };
  const respond = (request, response = "load") => {
    request.image.complete = true;
    request.image.naturalWidth = response === "load" ? 1672 : 0;
    request.image.naturalHeight = response === "load" ? 941 : 0;
    request.image.dispatchEvent(new BrowserEvent(response));
  };
  const context = vm.createContext({
    window, document, sessionStorage, console, Event: BrowserEvent,
    requestAnimationFrame: window.requestAnimationFrame, cancelAnimationFrame: window.cancelAnimationFrame,
    setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
    Image: class extends Element {
      constructor() { super("img", document); this.complete = false; this.naturalWidth = this.naturalHeight = 0; }
      set src(value) {
        this.setAttribute("src", value);
        const response = imageResponses.shift() || "load";
        const request = { src: value, image: this, response };
        imageRequests.push(request);
        if (response !== "timeout" && response !== "manual") schedule(() => respond(request, response));
      }
    }
  });
  for (const [name, source] of scripts.slice(0, 2)) {
    if (options.catalogMissing && name === "hogwarts-scenes.js") continue;
    vm.runInContext(source, context, { filename: name, timeout: 1000 });
  }
  const atlas = window.HogwartsAtlas;
  assert.ok(atlas.rooms[startId], "Harness must start at a real room: " + startId);
  location.pathname = atlas.rooms[startId].path;
  paths.push(location.pathname);
  sessionStorage.setItem("hogwarts:session:v2", JSON.stringify({
    id: "explorer-runtime-check", issued: Date.now(), visited: [...new Set([startId, ...(options.visited || [])])]
  }));
  vm.runInContext(scripts[2][1], context, { filename: scripts[2][0], timeout: 1000 });
  async function drain(limit = Infinity) {
    let count = 0, idle = 0;
    while (idle < 4) {
      await Promise.resolve();
      const next = [...tasks].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
      if (!next || next[1].due > limit) { idle++; continue; }
      idle = 0;
      assert.ok(++count <= 2000, "Explorer did not settle within 2000 browser callbacks");
      const [id, task] = next;
      tasks.delete(id); clock = Math.max(clock, task.due); task.callback();
    }
  }
  const run = {
    window, document, location, history, sessionStorage, changes, imageResponses, imageRequests, atlas,
    scenes: window.HogwartsScenes, stage: document.getElementById("hgw-stage"), respond,
    get roomId() { return atlas.byPath[location.pathname]; },
    get session() { return JSON.parse(sessionStorage.getItem("hogwarts:session:v2")); },
    get image() { return this.stage.querySelector(".hgw-scene-image"); },
    async flush() { await drain(); },
    async advance(milliseconds) { const until = clock + milliseconds; await drain(until); clock = until; await drain(until); },
    async key(key, attributes = {}) {
      const target = attributes.target || document.activeElement || body;
      target.dispatchEvent(new BrowserEvent("keydown", { key, bubbles: true, ...attributes }));
      await this.flush();
    },
    async releaseKey(key) {
      const target = document.activeElement || body;
      target.dispatchEvent(new BrowserEvent("keyup", { key, bubbles: true }));
      await this.flush();
    },
    activate(selector) {
      const target = this.stage.querySelector(selector);
      assert.ok(target, "Missing rendered interaction in " + this.roomId + ": " + selector);
      target.click();
      return target;
    },
    async click(selector) { this.activate(selector); await this.flush(); },
    async pointerAt(x, y) {
      const action = hitTarget(this.stage, x, y);
      const target = action?.querySelector("polygon") || action || this.image || this.stage;
      const rect = this.stage.getBoundingClientRect();
      target.dispatchEvent(new BrowserEvent("click", {
        bubbles: true, detail: 1, clientX: rect.left + x / 100 * rect.width, clientY: rect.top + y / 100 * rect.height
      }));
      await this.flush();
      return action;
    },
    async travelTo(id) {
      const entry = Object.entries(atlas.rooms[this.roomId].exits).find(([, destination]) => destination === id);
      assert.ok(entry, "No normal passage from " + this.roomId + " to " + id);
      await this.click('[data-door="' + entry[0] + '"]');
    }
  };
  await run.flush();
  return run;
}

test("all 113 rooms render one dedicated native image with clipped, accessible passage targets", async () => {
  const catalog = (await harness("gate")).atlas.rooms;
  assert.equal(Object.keys(catalog).length, 113);
  const sources = new Set();
  for (const id of Object.keys(catalog)) {
    const run = await harness(id), scene = run.scenes[id], images = run.stage.querySelectorAll("img");
    assert.equal(images.length, 1, id + ": exactly one scene photograph must be visible");
    assert.equal(run.image?.src, scene.src, id + ": configured artwork must render");
    assert.equal(Number(run.image.getAttribute("width")), scene.width, id + ": intrinsic width");
    assert.equal(Number(run.image.getAttribute("height")), scene.height, id + ": intrinsic height");
    assert.equal(run.stage.querySelector(".hgw-groundscape,.hgw-backwall,.hgw-castle-svg,.hgw-landscape"), null,
      id + ": no procedural walls or objects may cover the photograph");
    const targets = run.stage.querySelectorAll("[data-door]");
    assert.equal(targets.length, Object.keys(catalog[id].exits).length, id + ": one target per real passage");
    for (const [direction, passage] of Object.entries(scene.exits)) {
      const target = run.stage.querySelector('[data-door="' + direction + '"]');
      assert.ok(target, id + ": missing " + direction + " aperture");
      assert.equal(target.getAttribute("role"), "link");
      assert.equal(target.getAttribute("tabindex"), "0");
      assert.ok(target.getAttribute("aria-label")?.trim(), id + ": route must be named for assistive navigation");
      assert.ok(pointInside(passage.point, renderedRegion(target).polygon), id + ": rendered clip lost its safe approach point");
    }
    sources.add(run.image.src);
  }
  assert.equal(sources.size, 113, "Every room requires distinct scene artwork");
});

test("every normal passage's actual image point reaches its declared destination at narrow and wide viewports", async () => {
  const reference = await harness("gate");
  for (const viewportWidth of [360, 1280]) {
    for (const [id, room] of Object.entries(reference.atlas.rooms)) {
      for (const [direction, destination] of Object.entries(room.exits)) {
        const run = await harness(id, { viewportWidth });
        const [x, y] = run.scenes[id].exits[direction].point;
        const target = await run.pointerAt(x, y);
        assert.equal(target?.getAttribute("data-door"), direction, id + ":" + direction + ": point hit the wrong rendered aperture");
        assert.equal(run.roomId, destination, id + ":" + direction + ": route failed at viewport " + viewportWidth);
        assert.equal(run.changes.length, 1, id + ":" + direction + ": one activation must produce one scene change");
        assert.equal(run.session.current, run.atlas.rooms[destination].path);
      }
    }
  }
});

test("the garden east gate and the paddock's real west return preserve the selected route", async () => {
  const run = await harness("hut");
  await run.click('[data-door="e"]');
  assert.equal(run.roomId, "paddock");
  assert.equal(run.session.current, "/hogwarts/grounds/keeper-hut/creature-paddock/");
  assert.ok(run.session.visited.includes("paddock"));
  await run.click('[data-door="w"]');
  assert.equal(run.roomId, "hut");
  assert.deepEqual(run.changes, [run.atlas.rooms.paddock.path, run.atlas.rooms.hut.path]);
});

test("wall pixels, image corners and the clipped-away corners of passage boxes never navigate", async () => {
  for (const id of ["gate", "entry", "great", "hut", "potions", "library", "bridge", "lake", "bathroom", "corridor"]) {
    const run = await harness(id), points = [];
    for (let y = 2; y <= 98; y += 12) for (let x = 2; x <= 98; x += 12) {
      if (!hitTarget(run.stage, x, y)) points.push([x, y]);
    }
    let clippedCorners = 0;
    for (const target of run.stage.querySelectorAll(actionSelector)) {
      const box = renderedRegion(target);
      for (const [x, y] of [[.02,.02],[.98,.02],[.02,.98],[.98,.98]]) {
        const point = [box.left + box.width * x, box.top + box.height * y];
        if (!hitTarget(run.stage, ...point)) { points.push(point); clippedCorners++; }
      }
    }
    assert.ok(points.length > 20, id + ": fixture needs many genuinely inactive pixels");
    if (id === "gate") assert.ok(clippedCorners > 0, "Gate test must exercise the arch outside its polygon but inside its box");
    for (const point of points) {
      assert.equal(await run.pointerAt(...point), null, id + ": chosen wall point unexpectedly hit an action");
      assert.equal(run.roomId, id, id + ": background activation navigated");
    }
    assert.equal(run.changes.length, 0);
    assert.equal(run.location.assigned, undefined);
  }
});

for (const key of ["ArrowRight", "d"]) {
  test(key + " selects the physically rightmost entrance stair, independent of its graph key; Enter confirms", async () => {
    const run = await harness("entry");
    for (let i = 0; i < 12; i++) await run.key(key, { repeat: i > 0 });
    assert.equal(run.roomId, "entry", "Holding a movement key must never cross a room edge");
    const target = run.document.activeElement;
    assert.ok(run.stage.contains(target) && target.matches("[data-door]"), "Selection must focus a real rendered aperture");
    assert.ok(target.classList.contains("is-selected"));
    assert.equal(target.getAttribute("data-door"), "w", "Physical right stair is graph key w, not east");
    assert.equal(run.stage.querySelector(".hgw-stage-note span").textContent, target.getAttribute("aria-label"));
    await run.key("Enter");
    assert.equal(run.roomId, "staircase", "Enter must activate the focused physical staircase");
    assert.equal(run.changes.length, 1);
  });
}

test("keyboard selection followed by clicking another route obeys the newly clicked aperture", async () => {
  const run = await harness("hut");
  for (let i = 0; i < 12; i++) await run.key("ArrowRight");
  assert.equal(run.roomId, "hut");
  assert.equal(run.document.activeElement.getAttribute("data-door"), "e");
  await run.click('[data-door="w"]');
  assert.equal(run.roomId, "forest", "The click must replace any previously selected east route");
});

test("a touch swipe can select a passage but never travels or turns its synthetic click into travel", async () => {
  const run = await harness("hut");
  run.stage.dispatchEvent(new BrowserEvent("pointerdown", { bubbles: true, pointerType: "touch", clientX: 100, clientY: 220 }));
  run.stage.dispatchEvent(new BrowserEvent("pointerup", { bubbles: true, pointerType: "touch", clientX: 950, clientY: 220 }));
  const selected = run.document.activeElement;
  assert.ok(selected.matches("[data-door]"));
  selected.dispatchEvent(new BrowserEvent("click", { bubbles: true, detail: 1 }));
  await run.flush();
  assert.equal(run.roomId, "hut", "The swipe's trailing browser click must be suppressed");
  await run.key(" ");
  assert.equal(run.roomId, run.atlas.rooms.hut.exits[selected.getAttribute("data-door")]);
});

test("input focus and modified keys do not select or activate explorer passages", async () => {
  const run = await harness("entry"), input = run.document.createElement("input");
  run.document.body.appendChild(input); input.focus();
  await run.key("d"); await run.key("Enter");
  assert.equal(run.document.activeElement, input);
  assert.equal(run.roomId, "entry");
  run.stage.focus();
  await run.key("ArrowRight", { ctrlKey: true });
  assert.equal(run.document.activeElement, run.stage);
  assert.equal(run.changes.length, 0);
});

test("Enter on a selected route and browser Back/Forward restore the matching picture, title and URL", async () => {
  const run = await harness("gate");
  await run.key("ArrowUp");
  assert.equal(run.roomId, "gate", "Arrow selection alone does not enter");
  await run.key("Enter");
  assert.equal(run.roomId, "entry");
  assert.equal(run.document.getElementById("hgw-title").textContent, "Entrance Hall");
  run.history.back(); await run.flush();
  assert.equal(run.roomId, "gate");
  assert.equal(run.image.src, run.scenes.gate.src);
  assert.equal(run.document.getElementById("hgw-title").textContent, "Hogwarts");
  run.history.forward(); await run.flush();
  assert.equal(run.roomId, "entry");
  assert.equal(run.image.src, run.scenes.entry.src);
  assert.deepEqual(run.changes.slice(-3), [run.atlas.rooms.entry.path, run.atlas.rooms.gate.path, run.atlas.rooms.entry.path]);
  assert.equal(run.location.replaced, undefined);
});

test("selecting or passing ordinary Great Hall routes never arms the ceremony activity", async () => {
  const run = await harness("great");
  for (let i = 0; i < 15; i++) await run.key("ArrowUp");
  assert.equal(run.roomId, "great");
  assert.equal(run.location.assigned, undefined);
  assert.equal(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"), null);
  await run.click('[data-door="s"]');
  assert.equal(run.roomId, "entry");
  assert.equal(run.location.assigned, undefined);
  assert.equal(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"), null);
});

for (const activation of ["click", "Enter"]) {
  test("explicit " + activation + " on the walkable ceremony target creates a fresh visit pass", async () => {
    const run = await harness("great");
    if (activation === "click") await run.pointerAt(...run.scenes.great.ceremony.point);
    else { run.stage.querySelector("[data-ceremony]").focus(); await run.key("Enter"); }
    assert.equal(run.location.assigned, "/hogwarts/sorting-ceremony/");
    const pass = JSON.parse(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"));
    assert.equal(pass.from, "/hogwarts/");
    assert.ok(Math.abs(Date.now() - pass.at) < 5000);
    assert.match(pass.nonce, /^[0-9a-f]{32}$/);
  });
}

test("browser Back during the ceremony transition cancels assignment and leaves no usable sorting pass", async () => {
  const run = await harness("entry");
  await run.travelTo("great");
  run.activate("[data-ceremony]");
  // Wait only until the real walking animation reaches the dais and the
  // 480 ms ceremony transition begins, keeping the commit callback pending.
  let elapsed = 0;
  while (!run.document.getElementById("hgw-shell").classList.contains("is-transitioning") && elapsed < 2000) {
    await run.advance(16); elapsed += 16;
  }
  assert.ok(run.document.getElementById("hgw-shell").classList.contains("is-transitioning"),
    "The test must interrupt the actual pending ceremony transition");
  assert.equal(run.location.assigned, undefined);
  run.history.back();
  await run.flush();
  assert.equal(run.roomId, "entry");
  assert.equal(run.image.src, run.scenes.entry.src);
  assert.equal(run.location.assigned, undefined, "The stale ceremony callback must not navigate after Back");
  assert.equal(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"), null,
    "A cancelled ceremony must not grant a usable sorting pass");
  await run.travelTo("great");
  await run.click("[data-ceremony]");
  assert.equal(run.location.assigned, "/hogwarts/sorting-ceremony/", "A later deliberate ceremony attempt should still work");
  assert.ok(run.sessionStorage.getItem("hogwarts:sorting:pass:v1"));
});

for (const room of ["bathroom", "corridor"]) {
  test(room + ": a successful reveal survives leaving by an ordinary route before visiting the secret", async () => {
    const run = await harness(room), destination = run.atlas.rooms[room].secret.to;
    await run.click("[data-secret]");
    assert.ok(!run.session.visited.includes(destination));
    const neighbour = Object.values(run.atlas.rooms[room].exits)[0];
    await run.travelTo(neighbour);
    await run.travelTo(room);
    assert.equal(run.image.src, run.scenes[room].secret.open.src,
      "A successful reveal is room state even before the hidden neighbour is visited");
    assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "link");
    assert.ok(!run.session.visited.includes(destination), "Restoring the open picture is not hidden-room travel");
  });

  test(room + ": returning from the hidden destination keeps the successfully revealed entrance open", async () => {
    const run = await harness(room), secret = run.scenes[room].secret, destination = run.atlas.rooms[room].secret.to;
    await run.click("[data-secret]");
    await run.click("[data-secret]");
    assert.equal(run.roomId, destination);
    const requestCount = run.imageRequests.length;
    await run.travelTo(room);
    assert.equal(run.roomId, room);
    assert.equal(run.image.src, secret.open.src, "A discovered entrance must remain visibly open on normal return");
    assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "link");
    assert.ok(!run.imageRequests.slice(requestCount).some(request => request.src === run.scenes[room].src),
      "Returning to a revealed room must prepare the open source instead of unnecessarily loading the closed photograph");
    await run.click("[data-secret]");
    assert.equal(run.roomId, destination, "Returning to an open entrance must not require another reveal interaction");
  });

  test(room + ": browser Back restores the successful open state without repeating the reveal", async () => {
    const run = await harness(room), secret = run.scenes[room].secret, destination = run.atlas.rooms[room].secret.to;
    await run.click("[data-secret]");
    await run.click("[data-secret]");
    assert.equal(run.roomId, destination);
    run.history.back(); await run.flush();
    assert.equal(run.roomId, room);
    assert.equal(run.image.src, secret.open.src, "History must restore the previously revealed picture");
    assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "link");
    assert.ok(run.session.visited.includes(destination));
  });

  test(room + ": a renewed explorer session with the hidden neighbour already visited restores the open entrance", async () => {
    const reference = await harness(room), destination = reference.atlas.rooms[room].secret.to;
    const run = await harness(room, { visited: [destination] });
    assert.equal(run.roomId, room);
    assert.equal(run.image.src, run.scenes[room].secret.open.src,
      "An already visited hidden neighbour records a successfully opened route across reloads");
    assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "link");
    await run.click("[data-secret]");
    assert.equal(run.roomId, destination);
  });

  for (const key of ["Enter", " "]) {
    test(room + ": holding " + (key === " " ? "Space" : key) + " cannot turn a reveal into travel without a second press", async () => {
      const run = await harness(room), secret = run.scenes[room].secret, destination = run.atlas.rooms[room].secret.to;
      run.stage.querySelector("[data-secret]").focus();
      await run.key(key, { repeat: false });
      assert.equal(run.roomId, room, "The first activation should only reveal the entrance");
      assert.equal(run.image.src, secret.open.src);
      const opening = run.stage.querySelector("[data-secret]");
      assert.equal(run.document.activeElement, opening, "The open aperture now has focus while the original key is still held");
      for (let i = 0; i < 4; i++) await run.key(key, { repeat: true });
      assert.equal(run.roomId, room, "Repeated keydown from the original held key is not a second travel intent");
      assert.equal(run.changes.length, 0);
      assert.ok(!run.session.visited.includes(destination));
      await run.releaseKey(key);
      await run.key(key, { repeat: false });
      assert.equal(run.roomId, destination, "A fresh press after release should activate the opened passage");
      assert.equal(run.changes.length, 1);
    });
  }

  test(room + ": inspecting a secret changes only the image; a separate open-aperture activation travels", async () => {
    const run = await harness(room), secret = run.scenes[room].secret, destination = run.atlas.rooms[room].secret.to;
    const startPath = run.location.pathname, visited = [...run.session.visited];
    const trigger = run.stage.querySelector("[data-secret]");
    assert.equal(trigger.getAttribute("role"), "button");
    await run.pointerAt(...secret.trigger.point);
    assert.equal(run.location.pathname, startPath, "Revealing an entrance must not navigate");
    assert.equal(run.changes.length, 0);
    assert.deepEqual(run.session.visited, visited, "Revealing must not visit the hidden destination");
    assert.equal(run.image.src, secret.open.src, "The photograph must visibly expose the opening");
    assert.equal(Number(run.image.getAttribute("width")), secret.open.width);
    assert.equal(Number(run.image.getAttribute("height")), secret.open.height);
    const opening = run.stage.querySelector("[data-secret]");
    assert.equal(run.stage.querySelectorAll("[data-secret]").length, 1, "Closed and open targets cannot coexist");
    assert.equal(opening.getAttribute("role"), "link");
    assert.equal(run.document.activeElement, opening, "The revealed aperture should be keyboard reachable");
    assert.ok(opening.classList.contains("is-open"));
    assert.notEqual(opening, trigger);
    // A detached trigger, e.g. the second queued event in a double click, must
    // not become permission to use the newly created opening.
    trigger.click(); await run.flush();
    assert.equal(run.roomId, room);
    await run.pointerAt(...secret.open.point);
    assert.equal(run.roomId, destination);
    assert.equal(run.changes.length, 1);
    assert.ok(run.session.visited.includes(destination));
  });

  for (const response of ["error", "timeout"]) {
    test(room + ": secret reveal image " + response + " leaves the room intact and permits retry", async () => {
      const run = await harness(room), secret = run.scenes[room].secret;
      run.imageResponses.push(response);
      await run.click("[data-secret]");
      assert.equal(run.roomId, room);
      assert.equal(run.image.src, run.scenes[room].src);
      assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "button");
      assert.match(run.document.getElementById("hgw-observation").textContent, /retry/i);
      assert.equal(run.changes.length, 0);
      await run.click("[data-secret]");
      assert.equal(run.roomId, room);
      assert.equal(run.image.src, secret.open.src);
      assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "link");
    });

    test(room + ": hidden destination image " + response + " preserves the opened entrance and permits retry", async () => {
      const run = await harness(room), secret = run.scenes[room].secret, destination = run.atlas.rooms[room].secret.to;
      await run.click("[data-secret]");
      run.imageResponses.push(response);
      await run.click("[data-secret]");
      assert.equal(run.roomId, room);
      assert.equal(run.image.src, secret.open.src, "Failed hidden travel must not erase the revealed passage");
      assert.equal(run.stage.querySelector("[data-secret]").getAttribute("role"), "link");
      assert.ok(!run.session.visited.includes(destination));
      await run.click("[data-secret]");
      assert.equal(run.roomId, destination);
      assert.equal(run.changes.length, 1);
    });
  }

  test(room + ": repeated reveal clicks while loading expose once without entering the secret", async () => {
    const run = await harness(room), trigger = run.stage.querySelector("[data-secret]");
    run.imageResponses.push("manual");
    trigger.click(); trigger.click(); trigger.click();
    await run.advance(2000);
    assert.equal(run.imageRequests.length, 1, "One pending reveal should share one image load");
    assert.equal(run.roomId, room);
    trigger.click(); trigger.click();
    run.respond(run.imageRequests[0], "load");
    await run.flush();
    assert.equal(run.roomId, room);
    assert.equal(run.image.src, run.scenes[room].secret.open.src);
    assert.equal(run.changes.length, 0, "Repeated inspection is never a second-stage travel intent");
    trigger.click(); await run.flush();
    assert.equal(run.roomId, room, "Detached closed-state target cannot activate the new opening");
  });
}

for (const response of ["load", "error"]) {
  test("late secret image " + response + " after browser Back cannot replace or unlock the restored room", async () => {
    const run = await harness("baths");
    await run.travelTo("bathroom");
    run.imageResponses.push("manual");
    run.activate("[data-secret]");
    await run.advance(2000);
    const pending = run.imageRequests.at(-1);
    assert.equal(pending.src, run.scenes.bathroom.secret.open.src);
    run.history.back(); await run.advance(20);
    assert.equal(run.roomId, "baths");
    const changesBefore = run.changes.length;
    run.respond(pending, response); await run.flush();
    assert.equal(run.roomId, "baths");
    assert.equal(run.image.src, run.scenes.baths.src);
    assert.equal(run.changes.length, changesBefore);
    // The expanded bathroom corridor also has its own unopened witch-statue secret.
    // A stale bathroom image load must not reveal or remove this independent puzzle.
    assert.equal(run.stage.querySelector("[data-secret]")?.getAttribute("data-secret"), "statue");
    assert.equal(run.stage.querySelector("[data-secret]")?.getAttribute("role"), "button");
    assert.equal(run.document.getElementById("hgw-observation").classList.contains("is-visible"), false);
    await run.travelTo("bathroom");
    assert.equal(run.roomId, "bathroom", "Stale callbacks must not leave navigation busy");
  });
}

test("late normal-destination load after browser Back cannot push its stale URL", async () => {
  const run = await harness("gate");
  await run.travelTo("entry");
  run.imageResponses.push("manual");
  const direction = Object.entries(run.atlas.rooms.entry.exits).find(([, id]) => id === "great")[0];
  run.activate('[data-door="' + direction + '"]');
  await run.advance(2000);
  const pending = run.imageRequests.at(-1);
  run.history.back(); await run.advance(20);
  assert.equal(run.roomId, "gate");
  const changesBefore = run.changes.length;
  run.respond(pending); await run.flush();
  assert.equal(run.roomId, "gate");
  assert.equal(run.image.src, run.scenes.gate.src);
  assert.equal(run.changes.length, changesBefore);
  assert.ok(!run.session.visited.includes("great"));
  await run.travelTo("entry");
  assert.equal(run.roomId, "entry");
});

for (const response of ["error", "timeout"]) {
  test("a normal destination image " + response + " preserves the current image and permits the same route retry", async () => {
    const run = await harness("hut");
    const current = run.image;
    current.complete = true; current.naturalWidth = current.naturalHeight = 0;
    current.dispatchEvent(new BrowserEvent("error")); await run.flush();
    run.imageResponses.push(response);
    await run.click('[data-door="e"]');
    assert.equal(run.roomId, "hut");
    assert.equal(run.image, current, "A failed destination must not replace the current scene");
    assert.equal(run.changes.length, 0);
    await run.click('[data-door="e"]');
    assert.equal(run.roomId, "paddock");
    await run.click('[data-door="w"]');
    assert.equal(run.roomId, "hut");
  });
}

test("a failed scene catalog offers reload without losing the visit session", async () => {
  const run = await harness("hut", { catalogMissing: true });
  assert.ok(run.stage.querySelector("[data-reload]"));
  assert.ok(run.sessionStorage.getItem("hogwarts:session:v2"));
  await run.click("[data-reload]");
  assert.equal(run.location.reloaded, true);
});
