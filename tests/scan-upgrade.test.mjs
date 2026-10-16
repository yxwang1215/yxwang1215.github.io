import test from 'node:test';
import assert from 'node:assert/strict';
import {SCAN_MODES,settingsForMode,analyzePixels} from '../tools/png-to-pdf/modes.mjs';

test('gallery offers 18 distinct selectable scan modes',()=>{
  assert.equal(SCAN_MODES.length,18);
  assert.equal(new Set(SCAN_MODES.map(m=>m.id)).size,18);
});
test('comprehensive repair has real denoise, tint and detail stages',()=>{
  const s=settingsForMode(null,'comprehensive');
  assert.ok(s.denoise>0 && s.tint>0 && s.detail>0 && s.clean>0);
});
test('every mode belongs to a useful group',()=>{
  for(const m of SCAN_MODES) assert.ok(['basic','repair','scene','color'].includes(m.group));
});
test('legacy modes remain accepted and unknown modes rejected',()=>{
  for(const id of ['auto','document','bw','gray','color','photo','original']) assert.equal(settingsForMode(null,id).preset,id);
  assert.throws(()=>settingsForMode(null,'missing'),/Unknown/);
});
test('per-page analysis adapts to source light, not a fixed global preset',()=>{
  const pixels=v=>Uint8ClampedArray.from([v,v,v,255,v,v,v,255]);
  assert.notDeepEqual(settingsForMode(analyzePixels(pixels(140)),'auto'),settingsForMode(analyzePixels(pixels(250)),'auto'));
});

import {processPixels} from '../tools/png-to-pdf/core.mjs';
import {processPixels as legacy} from '../tools/png-to-pdf/base-core.mjs';
const fixture=(w,h,fn)=>{const a=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++)a.set([...fn(x,y),255],(y*w+x)*4);return a;};
const mean=(a,x,y,w)=>{const i=(y*w+x)*4;return (a[i]+a[i+1]+a[i+2])/3;};

test('edge-aware denoise suppresses small noise but keeps a strong text edge',()=>{
  const w=40,h=40,a=fixture(w,h,(x,y)=>{const v=x<20?210+((x+y)%2?7:-7):30;return [v,v,v];});
  const b=processPixels(a,w,h,{recipe:true,mode:'color',denoise:.9});
  const inputDiff=Math.abs(mean(a,10,10,w)-mean(a,11,10,w));
  const outputDiff=Math.abs(mean(b,10,10,w)-mean(b,11,10,w));
  assert.ok(outputDiff<inputDiff*.7,`${outputDiff} < ${inputDiff*.7}`);
  assert.ok(mean(b,19,10,w)-mean(b,20,10,w)>160);
});
test('paper tint correction neutralizes warm paper without bleaching red ink',()=>{
  const w=40,h=40,a=fixture(w,h,(x,y)=>x<5?[170,25,25]:[230,210,180]);
  const b=processPixels(a,w,h,{recipe:true,mode:'color',tint:1});
  const i=(20*w+20)*4,j=(20*w+2)*4;
  assert.ok(Math.abs(b[i]-b[i+2])<12);
  assert.ok(b[j]-b[j+1]>110);
});
test('local detail improves weak line contrast',()=>{
  const w=80,h=80,a=fixture(w,h,(x,y)=>{const v=y%14===6 && x>8 && x<70?190:220;return [v,v,v];});
  const b=processPixels(a,w,h,{recipe:true,mode:'gray',detail:1});
  assert.ok(mean(b,30,4,w)-mean(b,30,6,w)>30);
});

test('all modes preserve source data, output dimensions and opaque alpha',()=>{
  const w=53,h=39,a=fixture(w,h,(x,y)=>[120+(x*7+y)%120,140+(y*3+x)%95,80+(x+y*9)%155]),copy=a.slice();
  const stats=analyzePixels(a),signatures=new Set();
  for(const m of SCAN_MODES){
    const s=settingsForMode(stats,m.id),b=processPixels(a,w,h,s);
    assert.equal(b.length,a.length);assert.deepEqual(a,copy);
    for(let i=3;i<b.length;i+=4)assert.equal(b[i],255);
    assert.deepEqual(b,processPixels(a,w,h,s),'deterministic: '+m.id);
    signatures.add(Buffer.from(b).toString('base64'));
  }
  assert.equal(signatures.size,18,'not duplicate filters under new names');
});
test('legacy processing results remain byte-identical',()=>{
  const w=30,h=40,a=fixture(w,h,(x,y)=>[x*8,y*6,70]);
  for(const id of ['auto','document','bw','gray','color','photo','original']){
    const s=settingsForMode(analyzePixels(a),id);
    assert.deepEqual(processPixels(a,w,h,s),legacy(a,w,h,s));
  }
});
test('tiny images and alpha compose safely for every mode',()=>{
  for(const m of SCAN_MODES){
    const b=processPixels(new Uint8ClampedArray([0,0,0,0]),1,1,settingsForMode(null,m.id));
    assert.deepEqual(Array.from(b),[255,255,255,255],m.id);
  }
  assert.throws(()=>processPixels(new Uint8ClampedArray(4),2,1,{recipe:true}),/Invalid/);
});
test('shadow mode lifts uneven paper without erasing dark strokes',()=>{
  const w=160,h=160,a=fixture(w,h,(x,y)=>{const v=y%24===12&&x>20&&x<140?35:135+x*.6;return [v,v,v];});
  const b=processPixels(a,w,h,settingsForMode(analyzePixels(a),'shadow'));
  assert.ok(mean(b,30,30,w)>mean(a,30,30,w)+60);
  assert.ok(mean(b,30,30,w)-mean(b,30,36,w)>100);
});
test('ink saving emits lighter ink without changing dimensions',()=>{
  const w=60,h=60,a=fixture(w,h,(x,y)=>{const v=y%12===5?20:245;return [v,v,v];});
  const b=processPixels(a,w,h,settingsForMode(analyzePixels(a),'ink'));
  assert.ok(b.some((v,i)=>i%4!==3&&v===72));
  assert.ok(b.every((v,i)=>i%4===3||v===72||v===255));
});
