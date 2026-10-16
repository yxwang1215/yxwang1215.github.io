import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESETS} from '../tools/studio-utils.mjs';
import {SCAN_MODES} from '../tools/png-to-pdf/modes.mjs';
test('the unified editor exposes every scan recipe currently published on main',()=>{
 assert.deepEqual(new Set(Object.keys(PRESETS).map(id=>id==='paper'?'document':id)),new Set(SCAN_MODES.map(m=>m.id)));
 for(const p of Object.values(PRESETS)) assert.ok(p.group && p.hint && p.label);
});
