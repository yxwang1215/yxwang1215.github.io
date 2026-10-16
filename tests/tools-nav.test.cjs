const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
test('legacy deep links are captured before the editor normalizes the URL', () => {
  const html = fs.readFileSync(path.join(__dirname,'../tools/index.html'),'utf8');
  const navigation = html.indexOf('<script defer src="./tool-switcher.js');
  const editor = html.indexOf('<script type="module" src="./studio.mjs');
  assert.ok(navigation >= 0 && navigation < editor);
});
