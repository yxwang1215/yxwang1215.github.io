const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const corePath=path.join(__dirname,'../tools/pdf-kit/core.js');
test('PDF toolkit core is implemented',()=>assert.ok(fs.existsSync(corePath),'missing core.js'));
if(fs.existsSync(corePath)) {
 const K=require(corePath),P=require('../tools/pdf-kit/pdf-lib.min.js');
 async function source(count=3,rotation=0){const d=await P.PDFDocument.create();for(let i=0;i<count;i++){const p=d.addPage([300+i*10,400]);p.drawText('PAGE '+(i+1));p.setRotation(P.degrees(rotation));p.setCropBox(10,10,280,380);}return new Uint8Array(await d.save());}
 test('blank range selects all pages',()=>assert.deepEqual(K.parsePages('',3),[0,1,2]));
 test('range respects reverse order, duplicates and Chinese commas',()=>assert.deepEqual(K.parsePages('3-1，2,2',3),[2,1,0,1,1]));
 test('bad ranges fail rather than silently selecting all',()=>{for(const s of ['0','4','-1','1,,2','1.5','1-','hello','1;2'])assert.throws(()=>K.parsePages(s,3));});
 test('range has an output bound',()=>assert.throws(()=>K.parsePages('1,'.repeat(500)+'1',1)));
 test('split each page and fixed chunks',()=>{assert.deepEqual(K.splitGroups(3,'each'),[[0],[1],[2]]);assert.deepEqual(K.splitGroups(5,'chunks','',2),[[0,1],[2,3],[4]]);});
 test('custom split preserves group order',()=>assert.deepEqual(K.splitGroups(5,'custom','3-1;4,5'),[[2,1,0],[3,4]]));
 test('custom split validates all groups',()=>{assert.throws(()=>K.splitGroups(5,'custom','1-2;'));assert.throws(()=>K.splitGroups(5,'chunks','',0));});
 test('safe Unicode names contain no path traversal',()=>{assert.equal(K.safeName('论文/a:1.pdf','pdf'),'论文_a_1.pdf');assert.equal(K.safeName('..','zip'),'document.zip');});
 test('sniff rejects renamed non-PDF/PNG',()=>assert.throws(()=>K.kindOf(new TextEncoder().encode('not a PDF'))));
 test('inspect returns PDF dimensions, crop and rotation',async()=>{const i=await K.inspect(await source(2,90),'a.pdf',false);assert.equal(i.count,2);assert.equal(i.pages[0].rotation,90);assert.equal(i.pages[0].width,280);});
 test('empty and malformed PDFs are rejected',async()=>{await assert.rejects(K.inspect(new TextEncoder().encode('%PDF-1.7\nwrong'),'a.pdf',false));const d=await P.PDFDocument.create();await assert.rejects(K.inspect(await d.save({addDefaultPage:false}),'empty.pdf',false));});
 test('interactive forms are rejected explicitly',async()=>{const d=await P.PDFDocument.create();const p=d.addPage();d.getForm().createTextField('test').addToPage(p);await assert.rejects(K.inspect(await d.save(),'form.pdf',false),/表单/);});
 test('merge preserves order, dimensions, crop and existing rotation',async()=>{const a=await source(3,90),b=await source(1);const out=await K.build([{data:a,name:'a.pdf',range:'3,1'},{data:b,name:'b.pdf'}],{mode:'merge',name:'合并'});const d=await P.PDFDocument.load(out[0].data);assert.equal(d.getPageCount(),3);assert.equal(d.getPage(0).getWidth(),320);assert.equal(d.getPage(1).getRotation().angle,90);assert.equal(d.getPage(0).getCropBox().x,10);});
 test('extract duplicate pages as independent copies',async()=>{const out=await K.build([{data:await source(),name:'a.pdf'}],{mode:'extract',range:'2,1,2'});const d=await P.PDFDocument.load(out[0].data);assert.equal(d.getPageCount(),3);assert.equal(d.getPage(0).getWidth(),310);assert.notEqual(d.getPage(0).ref,d.getPage(2).ref);});
 test('organize rotates copies, reorders and removes excluded pages',async()=>{const out=await K.build([{data:await source(3,90),name:'a.pdf'}],{mode:'organize',selection:[{index:2,rotation:90},{index:0,rotation:270}]});const d=await P.PDFDocument.load(out[0].data);assert.equal(d.getPageCount(),2);assert.equal(d.getPage(0).getWidth(),320);assert.equal(d.getPage(0).getRotation().angle,180);assert.equal(d.getPage(1).getRotation().angle,0);});
 test('all-excluded and empty input cannot export a blank PDF',async()=>{await assert.rejects(K.build([],{mode:'merge'}));await assert.rejects(K.build([{data:await source(),name:'a.pdf'}],{mode:'organize',selection:[]}));});
 test('split creates expected independent PDF outputs',async()=>{const out=await K.build([{data:await source(5),name:'a.pdf'}],{mode:'split',splitMode:'chunks',chunk:2,name:'拆分'});assert.equal(out.length,3);assert.equal((await P.PDFDocument.load(out[2].data)).getPageCount(),1);assert.equal(new Set(out.map(f=>f.name)).size,3);});
 test('ZIP stores valid CRC32 and UTF-8 filenames',async()=>{const z=await K.makeZip([{name:'论文.pdf',data:new Uint8Array([1,2,3])}]);const data=new Uint8Array(await z.arrayBuffer());const v=new DataView(data.buffer);assert.equal(v.getUint32(0,true),0x04034b50);assert.equal(v.getUint16(6,true),0x800);assert.equal(v.getUint32(14,true),0x55bc801d);assert.equal(v.getUint32(data.length-22,true),0x06054b50);});
}
