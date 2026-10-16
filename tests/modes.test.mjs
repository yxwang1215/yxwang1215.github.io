import test from 'node:test';
import assert from 'node:assert/strict';
import * as modes from '../tools/png-to-pdf/modes.mjs';
const image = (rgb) => new Uint8ClampedArray(Array.from({length:100},()=>[...rgb,255]).flat());
test('seven named modes including an unchanged original',()=> {
 assert.equal(modes.SCAN_MODES.length,7);
 const stats=modes.analyzePixels(image([180,180,175]));
 assert.equal(modes.settingsForMode(stats,'original').clean,0);
 assert.equal(modes.settingsForMode(stats,'original').sharpen,0);
});
test('automatic exposure depends on image rather than a fixed contrast setting',()=> {
 const dark=modes.settingsForMode(modes.analyzePixels(image([150,150,150])),'auto');
 const light=modes.settingsForMode(modes.analyzePixels(image([242,242,242])),'auto');
 assert.notEqual(dark.clean, light.clean);
 assert.equal(dark.preset,'auto');
});
test('modes have distinct image operations and sane ranges',()=> {
 const s=modes.analyzePixels(image([190,185,175]));
 const all=modes.SCAN_MODES.map(x=>modes.settingsForMode(s,x.id));
 assert.equal(all.find(x=>x.preset==='bw').mode,'bw');
 assert.equal(all.find(x=>x.preset==='gray').mode,'gray');
 assert.equal(all.find(x=>x.preset==='photo').clean,0);
 assert.ok(all.every(x=>x.brightness>=-40&&x.brightness<=40&&x.contrast<=80));
 assert.throws(()=>modes.settingsForMode(s,'missing'));
});
