// Regression: every real room must render its own uncropped raster and its exits
// must stay attached to that image's coordinate system at every viewport width.
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';

const context = {window:{}};
vm.runInNewContext(readFileSync('assets/js/hogwarts-atlas.js','utf8'), context);
assert.ok(existsSync('assets/js/hogwarts-scenes.js'), 'Scenes need explicit image and hotspot metadata; CSS cover currently crops the exits away');
vm.runInNewContext(readFileSync('assets/js/hogwarts-scenes.js','utf8'), context);
const atlas = context.window.HogwartsAtlas;
const scenes = context.window.HogwartsScenes;
function dimensions(file) {
  const bytes = readFileSync(file);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', 'Scene must be a real WebP image');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const kind = bytes.toString('ascii', offset, offset+4), data = offset+8;
    if (kind === 'VP8X') return [bytes.readUIntLE(data+4,3)+1, bytes.readUIntLE(data+7,3)+1];
    if (kind === 'VP8 ') return [bytes.readUInt16LE(data+6)&0x3fff, bytes.readUInt16LE(data+8)&0x3fff];
    if (kind === 'VP8L') {
      const bits = bytes.readUInt32LE(data+1);
      return [(bits&0x3fff)+1, ((bits>>>14)&0x3fff)+1];
    }
    const length = bytes.readUInt32LE(offset+4);
    offset += 8+length+(length&1);
  }
  throw new Error('No image dimensions in '+file);
}
assert.deepEqual(Object.keys(scenes).sort(), Object.keys(atlas.rooms).sort(), 'Every room must have its own image');
const sources = new Set();
for (const [id, scene] of Object.entries(scenes)) {
  assert.ok(existsSync('.' + scene.src), id + ': background missing');
  assert.ok(!sources.has(scene.src), id + ': a generic image was reused');
  sources.add(scene.src);
  assert.deepEqual(dimensions('.' + scene.src), [scene.width,scene.height], id + ': declared dimensions differ from the file');
  assert.ok(scene.width >= 1600 && scene.height >= 900, id + ': small source is stretched');
  assert.ok(Math.abs(scene.width / scene.height - 16/9) < .01, id + ': background must match the panoramic stage');
  assert.deepEqual(Object.keys(scene.exits).sort(), Object.keys(atlas.rooms[id].exits).sort(), id + ': missing physical passage');
  for (const [dir, [x,y,w,h]] of Object.entries(scene.exits)) {
    assert.ok(w > 0 && h > 0 && x-w/2 >= 0 && x+w/2 <= 100 && y-h/2 >= 0 && y+h/2 <= 100, id + ':' + dir + ': hotspot outside the image');
  }
}
console.log('Scene assets and image-bound passages checked for all ' + sources.size + ' rooms.');
