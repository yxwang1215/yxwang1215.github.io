// Asset and geometry regressions for the physical-passage scene catalog.
// Geometry is checked independently of the renderer so a malformed polygon
// cannot silently become an oversized clickable rectangle.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
const context = { window: {} };
for (const name of ["hogwarts-atlas.js", "hogwarts-scenes.js"]) {
  const path = root + "assets/js/" + name;
  assert.ok(existsSync(path), "Missing required scene catalog: " + name);
  vm.runInNewContext(readFileSync(path, "utf8"), context, { filename: name });
}
const { HogwartsAtlas: atlas, HogwartsScenes: scenes } = context.window;
const EPS = 1e-8;
const kinds = new Set(["door", "path", "stair", "hatch", "arch", "pipe", "ladder"]);
const referencedSources = new Set();

function dimensions(file) {
  const bytes = readFileSync(file);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", file + ": not a real WebP");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const kind = bytes.toString("ascii", offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4), data = offset + 8;
    assert.ok(data + length <= bytes.length, file + ": truncated WebP chunk");
    if (kind === "VP8X") return [bytes.readUIntLE(data + 4, 3) + 1, bytes.readUIntLE(data + 7, 3) + 1];
    if (kind === "VP8 ") return [bytes.readUInt16LE(data + 6) & 0x3fff, bytes.readUInt16LE(data + 8) & 0x3fff];
    if (kind === "VP8L") {
      const bits = bytes.readUInt32LE(data + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset += 8 + length + (length & 1);
  }
  throw new Error("No image dimensions in " + file);
}

function cross(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}
function signedArea(polygon) {
  return polygon.reduce((sum, a, i) => {
    const b = polygon[(i + 1) % polygon.length];
    return sum + a[0] * b[1] - b[0] * a[1];
  }, 0) / 2;
}
function onSegment(p, a, b) {
  return Math.abs(cross(a, b, p)) <= EPS &&
    p[0] >= Math.min(a[0], b[0]) - EPS && p[0] <= Math.max(a[0], b[0]) + EPS &&
    p[1] >= Math.min(a[1], b[1]) - EPS && p[1] <= Math.max(a[1], b[1]) + EPS;
}
function contains(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    if (onSegment(point, a, b)) return true;
    if ((a[1] > point[1]) !== (b[1] > point[1]) &&
      point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function segmentsIntersect(a, b, c, d) {
  const abC = cross(a, b, c), abD = cross(a, b, d), cdA = cross(c, d, a), cdB = cross(c, d, b);
  if (abC * abD < -EPS && cdA * cdB < -EPS) return true;
  return Math.abs(abC) <= EPS && onSegment(c, a, b) ||
    Math.abs(abD) <= EPS && onSegment(d, a, b) ||
    Math.abs(cdA) <= EPS && onSegment(a, c, d) ||
    Math.abs(cdB) <= EPS && onSegment(b, c, d);
}

// Ear clipping permits concave path outlines. A convex-only bounding-box test
// would incorrectly reject adjacent paths and miss concave overlaps.
function triangles(polygon) {
  const points = polygon.map(p => [...p]), result = [];
  for (let changed = true; changed && points.length > 3;) {
    changed = false;
    for (let i = 0; i < points.length; i++) {
      if (Math.abs(cross(points[(i + points.length - 1) % points.length], points[i], points[(i + 1) % points.length])) <= EPS) {
        points.splice(i, 1); changed = true; break;
      }
    }
  }
  const sign = Math.sign(signedArea(points));
  while (points.length > 3) {
    let found = false;
    for (let i = 0; i < points.length; i++) {
      const before = (i + points.length - 1) % points.length, after = (i + 1) % points.length;
      const ear = [points[before], points[i], points[after]];
      if (cross(...ear) * sign <= EPS) continue;
      if (points.some((p, j) => j !== before && j !== i && j !== after && contains(p, ear))) continue;
      result.push(ear); points.splice(i, 1); found = true; break;
    }
    assert.ok(found, "Polygon cannot be triangulated; it may cross or double back");
  }
  result.push(points);
  return result;
}
function intersectionArea(subject, clip) {
  let output = subject;
  const sign = Math.sign(signedArea(clip));
  for (let i = 0; i < clip.length && output.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], input = output;
    output = [];
    const side = p => cross(a, b, p) * sign;
    for (let j = 0; j < input.length; j++) {
      const p = input[j], q = input[(j + 1) % input.length];
      const pSide = side(p), qSide = side(q), pIn = pSide >= -EPS, qIn = qSide >= -EPS;
      if (pIn) output.push(p);
      if (pIn !== qIn) {
        const t = pSide / (pSide - qSide);
        output.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
  }
  return output.length >= 3 ? Math.abs(signedArea(output)) : 0;
}
function overlaps(a, b) {
  return triangles(a).some(left => triangles(b).some(right => intersectionArea(left, right) > EPS));
}
function checkRegion(region, label, { evidence = false, allowedKinds = kinds } = {}) {
  assert.ok(region && !Array.isArray(region), label + ": legacy ellipse is not a passage");
  assert.ok(Array.isArray(region.polygon) && region.polygon.length >= 3, label + ": missing polygon");
  const polygon = region.polygon;
  for (const point of [...polygon, region.point]) {
    assert.ok(Array.isArray(point) && point.length === 2, label + ": invalid coordinate");
    assert.ok(point.every(n => Number.isFinite(n) && n >= 0 && n <= 100), label + ": point outside uncropped image");
  }
  assert.ok(new Set(polygon.map(p => p.join(","))).size === polygon.length, label + ": duplicated polygon vertex");
  assert.ok(Math.abs(signedArea(polygon)) > EPS, label + ": polygon has zero area");
  for (let i = 0; i < polygon.length; i++) {
    for (let j = i + 1; j < polygon.length; j++) {
      if (j === i + 1 || i === 0 && j === polygon.length - 1) continue;
      assert.ok(!segmentsIntersect(polygon[i], polygon[(i + 1) % polygon.length], polygon[j], polygon[(j + 1) % polygon.length]),
        label + ": polygon edges cross or double back");
    }
  }
  assert.ok(contains(region.point, polygon), label + ": approach point is outside its passage");
  assert.ok(allowedKinds.has(region.kind), label + ": unknown interaction kind " + region.kind);
  assert.ok(typeof region.label === "string" && region.label.trim(), label + ": missing accessible action label");
  if (evidence) assert.ok(typeof region.evidence === "string" && region.evidence.trim(), label + ": missing visual evidence");
}
function checkImage(scene, label) {
  assert.ok(typeof scene.src === "string" && scene.src.startsWith("/assets/images/") && scene.src.endsWith(".webp"), label + ": invalid scene image source");
  const path = root + scene.src.slice(1);
  assert.ok(existsSync(path), label + ": missing artwork " + scene.src);
  assert.deepEqual(dimensions(path), [scene.width, scene.height], label + ": metadata must use actual native dimensions");
  assert.ok(scene.width >= 1600 && scene.height >= 900, label + ": image is too small for the scene");
  assert.ok(Math.abs(scene.width / scene.height - 16 / 9) < .01, label + ": artwork must preserve the panoramic stage");
  assert.ok(typeof scene.alt === "string" && scene.alt.trim(), label + ": missing image description");
  referencedSources.add(scene.src);
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

assert.equal(Object.keys(atlas.rooms).length, 53, "The repaired maze has 53 rooms");
assert.deepEqual(Object.keys(scenes).sort(), Object.keys(atlas.rooms).sort(), "Every room needs an audited scene");
const sources = new Set(), hashes = new Set();
let normalPassages = 0, secretStates = 0;
for (const [id, scene] of Object.entries(scenes)) {
  const hash = checkImage(scene, id);
  assert.ok(!sources.has(scene.src), id + ": another room reuses this artwork source");
  assert.ok(!hashes.has(hash), id + ": another room reuses identical background bytes");
  sources.add(scene.src); hashes.add(hash);
  assert.deepEqual(Object.keys(scene.exits).sort(), Object.keys(atlas.rooms[id].exits).sort(), id + ": graph and visible passages disagree");
  const normal = Object.entries(scene.exits);
  for (const [direction, region] of normal) {
    checkRegion(region, id + ":" + direction, { evidence: true });
    normalPassages++;
  }
  for (let i = 0; i < normal.length; i++) {
    for (let j = i + 1; j < normal.length; j++) {
      assert.ok(!overlaps(normal[i][1].polygon, normal[j][1].polygon), id + ": two normal exits overlap (" + normal[i][0] + ", " + normal[j][0] + ")");
    }
  }
  if (scene.ceremony) {
    assert.equal(id, "great", "Only the Great Hall hosts the ceremony activity");
    checkRegion(scene.ceremony, id + ":ceremony", { evidence: true, allowedKinds: new Set(["activity"]) });
    for (const [direction, region] of normal) assert.ok(!overlaps(region.polygon, scene.ceremony.polygon),
      id + ": ceremony activity overlaps normal exit " + direction);
  }
  assert.equal(Boolean(scene.secret), Boolean(atlas.rooms[id].secret), id + ": secret graph and visual states disagree");
  if (scene.secret) {
    const secret = scene.secret;
    assert.ok(["basin", "wall"].includes(atlas.rooms[id].secret.type), id + ": unsupported secret reveal interaction");
    checkRegion(secret.trigger, id + ":secret trigger", { allowedKinds: new Set(["inspect"]) });
    checkRegion(secret.open, id + ":opened aperture");
    assert.ok(typeof secret.note === "string" && secret.note.trim(), id + ": reveal needs an explanatory observation");
    assert.notEqual(secret.open.src, scene.src, id + ": revealing a secret must visibly change the photograph");
    checkImage(secret.open, id + ":opened scene");
    assert.ok(atlas.rooms[atlas.rooms[id].secret.to], id + ": secret destination is missing");
    // Trigger and opening are mutually exclusive states. They may share pixels;
    // compare each active state with normal exits, never with one another.
    for (const [direction, region] of normal) {
      for (const [state, active] of [["closed", secret.trigger], ["open", secret.open]]) {
        assert.ok(!overlaps(region.polygon, active.polygon), id + ": " + state + " secret overlaps normal exit " + direction);
      }
    }
    secretStates++;
  }
}
assert.ok(scenes.great.ceremony, "The Great Hall must retain its explicit ceremony activity");
assert.equal(secretStates, 2, "Myrtle's basin and the seventh-floor wall need separate reveal/open states");

// Match delivered files to the recorded image-generation outputs. A unique
// filename or a matching size alone would not catch an accidental replacement.
const provenanceSources = new Set();
for (const version of ["v3", "v4"]) {
  const directory = "assets/images/hogwarts-cinematic-" + version + "/";
  const manifest = JSON.parse(readFileSync(root + directory + "provenance.json", "utf8"));
  const records = version === "v3" ? manifest.assets : manifest.images;
  assert.ok(Array.isArray(records) && records.length, version + ": missing generated-image provenance");
  for (const record of records) {
    const source = record.asset.startsWith("/") ? record.asset : "/" + directory + record.asset;
    assert.ok(source.startsWith("/" + directory), version + ": provenance points outside its image set");
    assert.ok(!provenanceSources.has(source), source + ": duplicate provenance record");
    provenanceSources.add(source);
    const bytes = readFileSync(root + source.slice(1));
    const expectedHash = version === "v3" ? record.sha256 : record.webpSha256;
    assert.match(expectedHash, /^[a-f0-9]{64}$/, source + ": missing WebP SHA-256");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expectedHash,
      source + ": bytes no longer match the audited generated image");
    assert.equal(bytes.length, record.bytes, source + ": provenance byte count is stale");
    const nativeSize = version === "v3" ? [record.native_width, record.native_height] : record.nativeSize;
    assert.deepEqual(dimensions(root + source.slice(1)), nativeSize, source + ": native-size provenance is stale");
    assert.ok(typeof record.prompt === "string" && record.prompt.trim(), source + ": generation prompt is missing");
  }
}
for (const source of referencedSources) {
  if (/\/hogwarts-cinematic-v[34]\//.test(source)) {
    assert.ok(provenanceSources.has(source), source + ": active generated artwork has no provenance record");
  }
}
console.log("Verified " + sources.size + " native scene images, " + normalPassages +
  " non-overlapping passage polygons, the ceremony activity, " + secretStates +
  " visible secret state pairs, and " + provenanceSources.size + " generated-image provenance hashes.");
