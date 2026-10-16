"""Real HTTP / Chromium checks for the shared Tools design. No engine mocks."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import json, os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OFFLINE = os.environ.get('TOOLS_UI_OFFLINE') == '1'
if OFFLINE:
    from ui_offline import load_dom
OUT = Path(os.environ.get('TOOLS_UI_OUTPUT', str(ROOT / '.editor-checks/layout')))
OUT.mkdir(parents=True, exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
BASE = os.environ.get('TOOLS_UI_BASE_URL', f'http://127.0.0.1:{server.server_port}').rstrip('/')
results, errors = [], []
def check(name, ok, detail=None):
    results.append({'name':name, 'passed':bool(ok), 'detail':detail})

routes = ['png-to-pdf-simple', 'mixed-to-pdf', 'merge-pdf', 'split-pdf', 'extract-pdf', 'organize-pdf']
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None, args=['--no-sandbox'])
    context = browser.new_context(accept_downloads=True, reduced_motion="reduce")
    for route in routes:
        page = context.new_page()
        page.set_viewport_size({'width':1440,'height':960})
        page.on('pageerror', lambda e: errors.append(str(e)))
        if OFFLINE:
            load_dom(page,ROOT,f'/tools/{route}/')
        else:
            response = page.goto(f'{BASE}/tools/{route}/', wait_until='networkidle')
            check(route + ': HTTP 200', response.status == 200)
        nav = page.locator('#tool-directory')
        check(route + ': all 8 described cross-links', nav.locator('[data-tool-target]').count() == 8 and nav.locator('.tool-switcher__item-detail').count() == 8)
        check(route + ': one current link', nav.locator('[aria-current=page]').count() == 1)
        for width,height in [(1440,960),(1280,800),(1024,768),(768,1024),(390,844),(320,740)]:
            page.set_viewport_size({'width':width,'height':height})
            page.wait_for_timeout(90)
            check(f'{route}: no overflow at {width}', page.evaluate('document.documentElement.scrollWidth <= innerWidth'),page.evaluate('document.documentElement.scrollWidth'))
            left = page.locator('.upload-panel' if route=='png-to-pdf-simple' else '.work-panel').bounding_box()
            right = page.locator('.settings-panel').bounding_box()
            if width >= 1100:
                diffs={'top':round(abs(left['y']-right['y']),2), 'bottom':round(abs(left['y']+left['height']-right['y']-right['height']),2)}
                check(f'{route}: aligned panel edges at {width}',max(diffs.values())<=1,diffs)
                check(f'{route}: workspace visible above fold at {width}',left['y']<230,left['y'])
            if width == 390:
                button = page.locator('#choose').bounding_box()
                check(f'{route}: mobile import touch target',button['height']>=40,button['height'])
            if width in [1440,390]:
                page.screenshot(path=str(OUT/f'{route}-{width}.png'),full_page=True)
        page.close()
    page=context.new_page()
    page.set_viewport_size({'width':1440,'height':960})
    page.on('pageerror',lambda e:errors.append(str(e)))
    if OFFLINE:load_dom(page,ROOT,'/tools/')
    else:page.goto(f'{BASE}/tools/',wait_until='networkidle')
    page.wait_for_selector('.preset')
    check('studio: visible all-tools switcher',page.locator('.ts-studio-menu').count()==1)
    check('studio: 18 presets retained',page.locator('.preset').count()==18)
    rects=page.locator('.app > .rail,.app > .center,.app > .inspector').evaluate_all('(els)=>els.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom}})')
    check('studio: aligned rail, canvas, inspector',max(x['bottom'] for x in rects)-min(x['bottom'] for x in rects)<=1,rects)
    page.screenshot(path=str(OUT/'studio-empty-1440.png'))
    menu=page.locator('.ts-studio-menu')
    menu.locator('summary').click()
    check('studio: menu exposes all 8 described destinations',menu.locator('a[data-tool-target]:visible').count()==8 and menu.locator('.tool-switcher__item-detail:visible').count()==8)
    menu.locator('a[data-tool-target="compress"]').click()
    check('studio: compression menu opens actual inspector',page.locator('#inspectorTitle').inner_text()=='尺寸与压缩')
    check('studio: compression current state is highlighted',menu.locator('a[data-tool-target="compress"][aria-current="page"]').count()==1)
    menu.locator('summary').click()
    if OFFLINE:
        menu.locator('a[data-tool-target="scan"]').evaluate('(a)=>a.addEventListener("click",e=>e.preventDefault(),{once:true})')
    menu.locator('a[data-tool-target="scan"]').click()
    check('studio: scan menu returns from compression to enhancement',page.locator('#inspectorTitle').inner_text()=='扫描增强')
    page.click('#imageTools [data-tool="enhance"]')
    menu.locator('summary').click()
    page.keyboard.press('Escape')
    check('studio: Escape closes menu and restores focus',menu.evaluate('(e)=>!e.open && document.activeElement===e.querySelector("summary")'))
    page.click('#demo')
    page.wait_for_selector("#filmstrip .thumb")
    page.wait_for_timeout(900)
    page.screenshot(path=str(OUT/'studio-image-1440.png'))
    for width,height in [(1280,800),(1024,768),(768,1024),(390,844),(320,740)]:
        page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(100)
        check(f'studio: no overflow at {width}',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        boxes=page.locator('.ts-brand-group,.workspace-tabs,.top-actions').evaluate_all('(es)=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,r:r.right,b:r.bottom}})')
        overlap=any(min(a['r'],b['r'])-max(a['x'],b['x'])>1 and min(a['b'],b['b'])-max(a['y'],b['y'])>1 for i,a in enumerate(boxes) for b in boxes[i+1:])
        check(f'studio: header controls do not overlap at {width}',not overlap,boxes)
        if width<=800:
            right=page.locator('.center').bounding_box()
            check(f'studio: canvas uses available width at {width}',abs(right['x']+right['width']-width)<1)
    page.set_viewport_size({'width':390,'height':844})
    page.locator('.ts-studio-menu summary').click()
    check('studio: mobile menu reachable and bounded',menu.locator('.ts-menu-panel').evaluate('(e)=>{const r=e.getBoundingClientRect();return r.x>=0&&r.right<=innerWidth&&r.bottom<=innerHeight}'))
    page.screenshot(path=str(OUT/'studio-mobile-menu.png'))
    page.keyboard.press('Escape')
    page.click('#imageTools [data-tool="enhance"]')
    check('studio: mobile settings drawer stays inside screen',page.locator('#inspector').evaluate('(e)=>{const r=e.getBoundingClientRect();return e.classList.contains("open")&&r.x>=0&&r.bottom<=innerHeight}'))
    page.screenshot(path=str(OUT/'studio-mobile-inspector.png'))
    page.click('#closeInspector')
    check('studio: mobile drawer closes',not page.locator('#inspector').evaluate('(e)=>e.classList.contains("open")'))
    page.screenshot(path=str(OUT/'studio-mobile-390.png'))
    if not OFFLINE:
        page.close()
        page=context.new_page()
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(f'{BASE}/tools/#compress',wait_until='networkidle')
        check('studio: old compression deep link opens correct inspector',page.locator('#inspectorTitle').inner_text()=='尺寸与压缩')
    check('no page errors',not errors,errors)
    browser.close()
server.shutdown()
(OUT/'results.json').write_text(json.dumps({'mode':'in-memory DOM' if OFFLINE else 'HTTP', 'passed':sum(x['passed'] for x in results),'failed':[x for x in results if not x['passed']],'checks':results,'errors':errors},ensure_ascii=False,indent=2))
failed=[x for x in results if not x['passed']]
print(json.dumps({'passed':len(results)-len(failed),'failed':failed,'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(1 if failed else 0)
