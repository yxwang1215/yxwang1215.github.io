const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../tools/pdf-engine.js');
test('PDF engine exists', () => assert.ok(fs.existsSync(file), 'PNG-to-PDF engine is not implemented yet'));
if (fs.existsSync(file)) {
 const pdf = require(file);
 test('A4 contains landscape image without stretching', () => {
  const p = pdf.layout(1200, 600, {paper:'a4',orientation:'portrait',margin:10,dpi:96});
  assert.ok(Math.abs(p.width-595.2756)<0.01); assert.equal(p.drawWidth/p.drawHeight,2);
  assert.ok(p.x >= 28.34 && p.y >= 28.34);
 });
 test('auto orientation follows each image', () => {
  const p=pdf.layout(1200,600,{paper:'a4',orientation:'auto',margin:0,dpi:96});
  assert.ok(p.width>p.height);
 });
 test('image-sized pages use explicit DPI', () => {
  const p=pdf.layout(960,480,{paper:'image',orientation:'auto',margin:0,dpi:96});
  assert.equal(p.width,720); assert.equal(p.height,360);
 });
 test('invalid geometry is rejected', () => {
  for(const dims of [[0,1],[NaN,2],[20000,1],[8000,8000]]) assert.throws(()=>pdf.layout(...dims,{}));
  assert.throws(()=>pdf.layout(10,10,{paper:'a4',margin:999}));
 });
 test('PNG signature and IHDR dimensions are validated', () => {
  const a=new Uint8Array(33); a.set([137,80,78,71,13,10,26,10]);
  new DataView(a.buffer).setUint32(8,13); a.set([73,72,68,82],12);
  new DataView(a.buffer).setUint32(16,20); new DataView(a.buffer).setUint32(20,10);
  assert.deepEqual(pdf.pngDimensions(a),{width:20,height:10});
  a[0]=0; assert.throws(()=>pdf.pngDimensions(a));
 });
 test('safe filename handles Unicode and duplicate suffix',()=>{
  assert.equal(pdf.filename('  论文/图:1.pdf.pdf  '),'论文_图_1.pdf');
  assert.equal(pdf.filename(''),'images.pdf');
 });
 test('PDF writer outputs valid offsets and alpha soft mask',async()=>{
  const doc=new pdf.Writer(); const rgba=new Uint8Array([255,0,0,255,0,0,255,100]);
  await doc.addRGBA(rgba,2,1,pdf.layout(2,1,{paper:'image',dpi:96,margin:0}));
  const bytes=new Uint8Array(await doc.finish().arrayBuffer());
  const text=new TextDecoder('latin1').decode(bytes);
  assert.ok(text.startsWith('%PDF-1.4')); assert.match(text,/\/SMask/); assert.match(text,/\/Count 1/);
  const offset=Number(/startxref\n(\d+)/.exec(text)[1]);
  assert.equal(new TextDecoder().decode(bytes.slice(offset,offset+4)),'xref');
 });
 test('empty PDF and invalid RGBA are rejected', async()=>{
  assert.throws(()=>new pdf.Writer().finish());
  await assert.rejects(()=>new pdf.Writer().addRGBA(new Uint8Array(1),2,1,pdf.layout(2,1,{})));
 });
 test('uncompressed fallback remains a valid image stream',async()=>{
  const before=global.CompressionStream; global.CompressionStream=undefined;
  try {const d=new pdf.Writer(); await d.addRGBA(new Uint8Array([10,20,30,255]),1,1,pdf.layout(1,1,{}));
   const text=await d.finish().text(); assert.match(text,/\/ColorSpace \/DeviceRGB/); assert.doesNotMatch(text,/FlateDecode/);
  } finally {global.CompressionStream=before;}
 });
}
