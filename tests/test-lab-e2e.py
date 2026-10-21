"""Browser regression on a real Jekyll build. Run: python tests/test-lab-e2e.py _site."""
import functools
import http.server
import json
import os
from pathlib import Path
import sys
import threading
from playwright.sync_api import sync_playwright

site=Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve()
out=Path('artifacts/test-lab');out.mkdir(parents=True,exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(site)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
routes={'catalogue':'/tests/','bigfive':'/tests/personality/','compass':'/tests/personality/compass/','talent':'/tests/talent/'}
errors=[];baseline_errors=[];posts=[];checks=[]
with sync_playwright() as p:
    launch={'headless':True}
    if os.environ.get('CHROMIUM_PATH'):launch['executable_path']=os.environ['CHROMIUM_PATH']
    browser=p.chromium.launch(**launch)
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce',accept_downloads=True)
    page.set_default_timeout(15000)
    # Third-party analytics and MathJax are irrelevant to local assessment tests.
    page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) or r.request.url.startswith('blob:') else r.abort())
    def page_error(e):
        message=str(e)
        (baseline_errors if message=='MathJax is not defined' else errors).append(message)
    page.on('pageerror',page_error)
    page.on('dialog',lambda d:d.accept())
    page.on('request',lambda r:posts.append(r.url) if r.method not in ('GET','HEAD') else None)
    def visit(kind):
        response=page.goto(base+routes[kind],wait_until='domcontentloaded')
        assert response and response.status==200,(kind,'not found')
        page.wait_for_timeout(500)
    def shot(name):page.screenshot(path=str(out/(name+'.png')),full_page=True,animations='disabled')
    def no_overflow():
        # Allow the existing greedy navigation's resize handler and font layout to settle.
        page.wait_for_timeout(400)
        ok=page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        if not ok:
            shot('overflow-failure')
            detail=page.evaluate("""()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().width>0&&(e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left< -1)).map(e=>({tag:e.tagName,id:e.id,cls:e.getAttribute('class'),x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,80)})).slice(0,30)})""")
            (out/'overflow.json').write_text(json.dumps(detail,ensure_ascii=False,indent=2))
            print(json.dumps(detail,ensure_ascii=False),flush=True)
        assert ok,'Horizontal overflow: '+page.url
    visit('catalogue')
    assert page.locator('.lab-test-card').count()==3
    page.locator('[data-test-filter="personality"]').click()
    assert page.locator('[data-test-category]:visible').count()==2
    page.locator('[data-test-filter="talent"]').click()
    assert page.locator('[data-test-category]:visible').count()==1
    page.locator('[data-test-filter="all"]').click();shot('catalogue-desktop');checks.append('catalogue filter')
    for kind,size in [('bigfive',5),('compass',8)]:
        visit(kind);shot(kind+'-intro-desktop');page.locator('[data-action="start"]').click()
        assert page.locator('[data-action="next"]').is_disabled()
        page.locator('.lab-option').nth(2).click()
        assert page.locator('input[type=radio]:checked').count()==1
        page.locator('input[type=radio][value="3"]').evaluate_all('(es)=>es.forEach(e=>e.click())')
        page.locator('[data-action="next"]').dispatch_event('click')
        page.locator('[data-action="exit"]').click();page.reload(wait_until='domcontentloaded')
        page.locator('[data-action="resume"]').click();assert '2 /' in page.locator('.lab-page-index').inner_text()
        page.locator('[data-action="previous"]').click();assert page.locator('input[type=radio]:checked').count()==size
        page.locator('#personality-english').check();assert page.locator('.lab-item-english:visible').count()==size
        shot(kind+'-quiz-desktop')
        for width in [390,320]:
            page.set_viewport_size({'width':width,'height':844});no_overflow()
            assert page.locator('.lab-question legend').first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=20
        page.set_viewport_size({'width':1440,'height':1000})
        while page.locator('#personality-form').count():
            page.locator('input[type=radio][value="3"]').evaluate_all('(es)=>es.forEach(e=>e.click())')
            page.locator('[data-action="next"]').dispatch_event('click')
        assert page.locator('.lab-trait').count()==(5 if kind=='bigfive' else 4)
        if kind=='compass':
            assert page.locator('.lab-type').inner_text()=='XXXX'
            assert page.locator('.lab-context-grid article').count()==4
        shot(kind+'-results-desktop')
        with page.expect_download() as pending:page.locator('[data-action="json"]').click()
        filename=out/(kind+'-report.json');pending.value.save_as(filename)
        result=json.loads(filename.read_text());assert 'answers' not in result
        assert all(x['score']==50 for x in result['axes'])
        page.emulate_media(media='print');assert page.locator('.lab-trait').first.is_visible();assert not page.locator('.lab-result-actions').is_visible();page.emulate_media(media='screen')
        for width in [390,320]:
            page.set_viewport_size({'width':width,'height':844});no_overflow()
        shot(kind+'-results-mobile');page.set_viewport_size({'width':1440,'height':1000})
        page.reload(wait_until='domcontentloaded');page.locator('[data-action="resume"]').click();assert page.locator('.lab-trait').count()>0
        checks.append(kind+' complete, reload, export, print, responsive')
    # The two inventories must not overwrite each other.
    assert page.evaluate("!!localStorage.getItem('yxwang-personality-bigfive-v1') && !!localStorage.getItem('yxwang-personality-compass-v1')")
    for mode,pages in [('quick',8),('full',12)]:
        visit('talent');page.evaluate("localStorage.removeItem('yxwang-talent-atlas-v1');localStorage.removeItem('yxwang-talent-atlas-lang')")
        page.reload(wait_until='domcontentloaded');shot('talent-intro-desktop');page.locator('[data-start-mode="'+mode+'"]').click()
        assert page.locator('#ta-next').is_disabled()
        for i in range(pages):
            assert page.locator('#ta-question-list fieldset').count()==6
            page.locator('#ta-question-list input[value="3"]').evaluate_all('(es)=>es.forEach(e=>e.click())')
            if i==0 and mode=='quick':
                page.set_viewport_size({'width':390,'height':844});no_overflow();shot('talent-quiz-mobile')
                assert page.locator('.ta-question-prompt').first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=20
                page.set_viewport_size({'width':1440,'height':1000})
            page.locator('#ta-next').dispatch_event('click')
        assert page.locator('.ta-score-row').count()==8 and page.locator('#ta-results').is_visible()
        if mode=='quick':
            shot('talent-results-desktop');page.locator('#ta-language').click();assert 'Your talent' in page.locator('#ta-result-title').inner_text();shot('talent-results-en')
        page.set_viewport_size({'width':390,'height':844});no_overflow();page.set_viewport_size({'width':1440,'height':1000})
        checks.append('talent '+mode+' full flow')
    for width in [390,320]:
        page.set_viewport_size({'width':width,'height':844})
        for kind in routes:
            visit(kind);no_overflow();shot(kind+'-intro-'+str(width))
    assert not errors,errors
    assert not posts,posts
    report={'passed':True,'checks':checks,'viewports':[1440,390,320],'page_errors':errors,'preexisting_mathjax_errors':len(baseline_errors),'answer_submissions':posts}
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False))
    browser.close()
server.shutdown()
