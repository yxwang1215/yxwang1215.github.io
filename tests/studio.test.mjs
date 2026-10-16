import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const root=new URL('../tools/',import.meta.url);
test('shared utilities exist',()=>assert.ok(existsSync(new URL('studio-utils.mjs',root)),'Missing studio-utils.mjs'));
test('page ranges validate and preserve requested order',async()=>{
 assert.ok(existsSync(new URL('studio-utils.mjs',root)),'Missing range parser');
 const {parseRange}=await import('../tools/studio-utils.mjs');
 assert.deepEqual(parseRange('3,1-2,2',5),[2,0,1]);
 assert.deepEqual(parseRange('',3),[0,1,2]);
 for(const s of ['0','6','2-1','1a','1,,2','1-6'])assert.throws(()=>parseRange(s,5));
});
test('history restores independent edits while retaining file references',async()=>{
 assert.ok(existsSync(new URL('studio-utils.mjs',root)),'Missing history');
 const {History}=await import('../tools/studio-utils.mjs');
 const h=new History(2),f=new Blob(['original']);
 let state=[{id:'a',file:f,settings:{clean:0},crop:{x:0}}];
 h.save(state);state[0].settings.clean=60;
 const restored=h.undo(state);assert.equal(restored[0].settings.clean,0);assert.equal(restored[0].file,f);
 assert.equal(h.redo(restored)[0].settings.clean,60);
 h.save(restored);assert.equal(h.canRedo,false);
});
test('single workspace document has shared import and export',()=>{
 assert.ok(existsSync(new URL('index.html',root)),'Missing editor HTML');
 const html=readFileSync(new URL('index.html',root),'utf8');
 assert.match(html,/id="imageWorkspace"/);assert.match(html,/id="pdfWorkspace"/);
 assert.match(html,/id="importFiles"/);assert.match(html,/id="openExport"/);
 assert.doesNotMatch(html,/class="hero"/);assert.doesNotMatch(html,/image\/compress\//);
});
