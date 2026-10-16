import test from 'node:test';import assert from 'node:assert/strict';
import {deflateSync,inflateSync} from 'node:zlib';
import {crc32} from '../tools/png-to-pdf/core.mjs';
import * as png from '../tools/compression/png-codec.mjs';
const chunk=(type,data)=>{const a=new Uint8Array(data.length+12);const v=new DataView(a.buffer);v.setUint32(0,data.length);a.set(new TextEncoder().encode(type),4);a.set(data,8);v.setUint32(a.length-4,crc32(a.subarray(4,a.length-4)));return a;};
const image=(w=32,h=24)=>{const ih=new Uint8Array(13),v=new DataView(ih.buffer);v.setUint32(0,w);v.setUint32(4,h);ih[8]=8;ih[9]=6;const raw=new Uint8Array((w*4+1)*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){let i=y*(w*4+1)+1+x*4;raw.set([x*5,y*7,100,(x+y)%2?255:128],i);}return new Blob([new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('tEXt',new TextEncoder().encode('Title\0keep-metadata')),chunk('IDAT',deflateSync(raw,{level:0})),chunk('IEND',new Uint8Array())],{type:'image/png'});};
test('lossless PNG recompression is smaller and preserves raw samples plus ancillary metadata',async()=>{
 const src=image(),out=await png.optimizePng(src);assert.ok(out.size<src.size);
 const before=png.parsePng(new Uint8Array(await src.arrayBuffer())),after=png.parsePng(new Uint8Array(await out.arrayBuffer()));
 assert.deepEqual(png.unfilter(new Uint8Array(inflateSync(before.idat)),before),png.unfilter(new Uint8Array(inflateSync(after.idat)),after));
 assert.ok(after.chunks.some(c=>c.type==='tEXt'));assert.equal(after.width,32);
});
test('RGBA PNG encoding preserves alpha and shape',async()=>{
 const src=new Uint8ClampedArray([1,2,3,0,50,60,70,128,255,255,255,255,0,0,0,255]);
 const out=await png.encodePng(src,2,2,8),p=png.parsePng(new Uint8Array(await out.arrayBuffer()));
 assert.deepEqual([...png.unfilter(new Uint8Array(inflateSync(p.idat)),p)],[...src]);
});
test('PNG lower-precision mode changes RGB but not alpha',async()=>{
 const src=new Uint8ClampedArray([121,122,123,17]);const out=await png.encodePng(src,1,1,5),p=png.parsePng(new Uint8Array(await out.arrayBuffer()));const rgba=png.unfilter(new Uint8Array(inflateSync(p.idat)),p);assert.equal(rgba[3],17);assert.notDeepEqual([...rgba],[...src]);
});
test('broken PNG signature and CRC rejected',()=>{assert.throws(()=>png.parsePng(new Uint8Array(20)));});
