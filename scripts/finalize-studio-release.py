"""One-time, narrowly scoped reconciliation of the approved editor and current main."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
def change(path, old, new):
    p = ROOT/path
    text = p.read_text()
    if new in text:
        return
    assert text.count(old) == 1, (path, 'unexpected source', old[:90])
    p.write_text(text.replace(old, new, 1))

# Only update the obsolete hub-layout assertion; retain every legacy file/output test.
change('tests/pdf-toolkit-e2e.py',
    "    check('hub exposes all seven existing/new tools',page.locator('.tool-card').count()==7)\n    for href in page.locator('.tool-card').evaluate_all('(els)=>els.map(e=>e.getAttribute(\"href\"))'):",
    "    expected={'./merge-pdf/','./mixed-to-pdf/','./split-pdf/','./extract-pdf/','./organize-pdf/','./png-to-pdf-simple/','./png-to-pdf/'}\n    links=page.locator('#compatibilityRoutes a').evaluate_all('(els)=>els.map(e=>e.getAttribute(\"href\"))')\n    check('editor retains all seven exact compatibility routes',len(links)==7 and set(links)==expected)\n    check('image and PDF share the editor',page.locator('#imageWorkspace').count()==1 and page.locator('#pdfWorkspace').count()==1)\n    check('no independent tool-card wall',page.locator('.tool-card').count()==0)\n    for href in links:")

# Reuse every current scan recipe, instead of regressing the new 18-mode gallery to seven.
p=ROOT/'tools/studio-utils.mjs'
s=p.read_text()
start=s.index('export const PRESETS = ')
s=s[:start]+"export const PRESETS = Object.fromEntries(SCAN_MODES.map(m => [m.id === 'document' ? 'paper' : m.id, {...settingsForMode(null, m.id), label:m.name, group:m.group, hint:m.hint}]));\n"
s="import {SCAN_MODES, settingsForMode} from './png-to-pdf/modes.mjs';\n"+s
p.write_text(s)
change('tools/studio.mjs',
    '// Build real controls once; current-document thumbnails are rendered after each preview.',
    '''// Build real controls once; current-document thumbnails are rendered after each preview.
let scanGroup = 'basic';
const scanFilters = document.createElement('div');
scanFilters.className = 'scan-filters'; scanFilters.setAttribute('aria-label','扫描效果分类');
for (const [group, label] of [['basic','常用'],['repair','修复'],['scene','场景'],['color','色彩'],['all','全部']]) {
  const button = document.createElement('button'); button.type='button'; button.dataset.scanGroup=group; button.textContent=label;
  button.setAttribute('aria-pressed',String(group===scanGroup));
  button.onclick=()=>{
    scanGroup=group;
    scanFilters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scanGroup===group)));
    document.querySelectorAll('[data-preset]').forEach(b=>b.hidden=group!=='all' && b.dataset.scanCategory!==group);
  };
  scanFilters.append(button);
}
$('presets').before(scanFilters);''')
change('tools/studio.mjs',
    "b.dataset.preset=key;b.innerHTML=",
    "b.dataset.preset=key;b.dataset.scanCategory=p.group;b.hidden=p.group!==scanGroup;b.title=p.hint;b.innerHTML=")
p=ROOT/'tools/studio.css'
p.write_text(p.read_text()+'''\n.scan-filters{display:flex;gap:4px;flex-wrap:wrap;margin:0 0 16px}.scan-filters button{padding:6px 9px;border-radius:6px;background:transparent;color:#777b87;font-size:10px}.scan-filters button[aria-pressed=true]{background:var(--accent-soft);color:var(--accent);font-weight:600}.scan-filters button:hover{background:#f3f2f8}\n''')
change('tests/studio-integration.test.mjs',
    "assert.match(read('tools/studio-utils.mjs'),/photo:/);",
    "assert.match(read('tools/studio-utils.mjs'),/SCAN_MODES.map/);")
p=ROOT/'tests/browser_check.py';s=p.read_text().replace("'seven adaptive preset controls',page.locator('.preset').count()==7", "'18 adaptive preset controls',page.locator('.preset').count()==18").replace("'real preset thumbnails',page.locator('.preset-thumb canvas').count()==7", "'18 real preset thumbnails',page.locator('.preset-thumb canvas').count()==18")
p.write_text(s)

# Keep the existing scan suite's coverage, targeting the approved editor controls.
p=ROOT/'tests/scan-styles-e2e.py';s=p.read_text()
a=s.index('def page_count(');b=s.index('def ready(',a)
s=s[:a]+'''def page_count(page, expected):
    expect(page.locator('#filmstrip .thumb')).to_have_count(int(expected), timeout=30000)

'''+s[b:]
a=s.index('def preview_ready(');b=s.index('\ntry:',a)
s=s[:a]+'''def preview_ready(page):
    page.wait_for_timeout(250)
    for _ in range(300):
        if page.locator('#preview').evaluate("el => !el.hidden && !el.classList.contains('busy-preview')"):
            return
        page.wait_for_timeout(100)
    raise AssertionError('Preview did not finish')
'''+s[b:]
s=s.replace("        modes = page.locator('[data-preset]')", "        page.locator('[data-scan-group=\"all\"]').click()\n        modes = page.locator('[data-preset]')")
s=s.replace("page.locator('#files')", "page.locator('#fileInput')").replace("page.locator('.page-card')", "page.locator('#filmstrip .thumb')").replace("page.locator('#compareControl')", "page.locator('#compareSlider')")
s=s.replace("            page.locator('#format').select_option(fmt)", "            page.locator('#openExport').click()\n            page.locator('#exportFormat').select_option(fmt)")
s=s.replace("page.locator('#export').click()", "page.locator('#doExport').click()").replace("page.locator('#reset').click()", "page.locator('#resetImage').click()")
s=s.replace("        m.locator('[data-scan-group=\"repair\"]').click()", "        m.locator('[data-tool=\"enhance\"]').click()\n        m.locator('[data-scan-group=\"repair\"]').click()")
p.write_text(s)

# The public check must include the dependencies modified by the concurrent scan work.
p=ROOT/'tests/published_smoke.py';s=p.read_text()
s=s.replace("'tools/pdf-workspace.mjs']", "'tools/pdf-workspace.mjs','tools/png-to-pdf/core.mjs','tools/png-to-pdf/base-core.mjs','tools/png-to-pdf/scan-effects.mjs','tools/png-to-pdf/modes.mjs']")
p.write_text(s)
print('Reconciled only editor scan controls, layout assertions, and deployment verification.')
