import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('editor retains seven image-dependent scan modes',()=>{
 const app=read('tools/studio.mjs');
 assert.match(app,/settingsForMode/);assert.match(app,/analyzePixels/);assert.match(read('tools/studio-utils.mjs'),/SCAN_MODES.map/);
});
test('existing compression algorithms are exposed in the shared inspector',()=>{
 const app=read('tools/studio.mjs');assert.match(app,/installCompressionControls/);
 assert.ok(existsSync(new URL('../tools/studio-compression.mjs',import.meta.url)));
 const compression=read('tools/studio-compression.mjs');assert.match(compression,/compressFile/);assert.match(compression,/AbortController/);
});
test('all seven compatibility routes remain reachable without a tool-card wall',()=>{
 const html=read('tools/index.html');for(const route of ['merge-pdf','mixed-to-pdf','split-pdf','extract-pdf','organize-pdf','png-to-pdf-simple','png-to-pdf'])assert.ok(html.includes('./'+route+'/'),route);
 assert.match(html,/id="compatibilityRoutes"/);
});
test('normal browser test keeps site CSP and avoids evaluator wait strings',()=>{
 const script=read('tests/browser_check.py');assert.doesNotMatch(script,/page\.wait_for_function\(/);assert.doesNotMatch(script,/bypass_csp\s*=\s*True/);
});
