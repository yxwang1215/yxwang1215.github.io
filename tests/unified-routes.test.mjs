import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
const moduleUrl=new URL('../tools/studio-routing.mjs',import.meta.url);
test('one router maps every legacy path into the same tools document',async()=>{
 assert.ok(existsSync(moduleUrl),'single-document router not implemented');
 const {LEGACY_ROUTES,resolveRoute}=await import(moduleUrl);
 assert.equal(Object.keys(LEGACY_ROUTES).length,7);
 for(const hash of Object.values(LEGACY_ROUTES))assert.equal(resolveRoute(hash).hash,hash);
 assert.equal(LEGACY_ROUTES['png-to-pdf-simple'],'#image/png-to-pdf');
 assert.equal(LEGACY_ROUTES['split-pdf'],'#pdf/split');
 assert.equal(resolveRoute('#compress').hash,'#image/compress');
 assert.equal(resolveRoute('#invalid').hash,'#image');
});
test('all old pages are redirects, not parallel applications',()=>{
 for(const path of ['png-to-pdf','png-to-pdf-simple','merge-pdf','mixed-to-pdf','split-pdf','extract-pdf','organize-pdf']){
  const html=readFileSync(new URL(`../tools/${path}/index.html`,import.meta.url),'utf8');
  assert.match(html,/http-equiv="refresh"/i,path+' is still independent');
  assert.match(html,/\/tools\/#(?:image|pdf)/);
  assert.doesNotMatch(html,/data-workbench|id="workspace"|id="file-input"/);
 }
});
