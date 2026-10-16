"""Exercise the served site: local smoke validation in PRs, actual public domain on main."""
from pathlib import Path
from datetime import datetime, timezone
import json, os, time
import pymupdf as fitz
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.editor-checks'; OUT.mkdir(exist_ok=True)
REV=os.environ.get('GITHUB_SHA','release-verification')
SITE=os.environ.get('STUDIO_SITE_URL','https://yxwang1215.top/tools/')
URL=SITE+'?release='+REV+'#image'
checks=[]; errors=[]; uploads=[]
def check(name, condition):
    if not condition: raise AssertionError(name)
    checks.append(name)
    print('PASS',name,flush=True)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1440,'height':960},accept_downloads=True)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:uploads.append(r.url) if r.method not in ('GET','HEAD') else None)
    def ready(expression):
        deadline=time.monotonic()+60
        while time.monotonic()<deadline:
            if page.evaluate('() => ('+expression+')'): return
            page.wait_for_timeout(120)
        raise AssertionError('Served site timed out: '+expression+'; '+page.locator('#toast').text_content())
    response=page.goto(URL,wait_until='networkidle',timeout=60000)
    check('editor returns HTTP 200',response.status==200)
    ready('document.querySelectorAll(".preset").length === 18')
    check('all 18 scan modes are wired',page.locator('.preset').count()==18)
    page.click('#demo')
    ready('document.querySelector("#beforeCanvas").width > 500 && !document.querySelector("#preview").classList.contains("busy-preview") && document.querySelector("#progressWrap").hidden')
    check('image processing and real thumbnails work',page.locator('.preset-thumb canvas').count()==18)
    page.click('[data-preset="comprehensive"]');page.wait_for_timeout(250)
    ready('!document.querySelector("#preview").classList.contains("busy-preview")')
    page.evaluate('() => document.querySelector("#toast").hidden=true')
    page.screenshot(path=str(OUT/'live-desktop.png'))
    page.click('#openExport');page.select_option('#exportFormat','png')
    with page.expect_download(timeout=60000) as download: page.click('#doExport')
    download.value.save_as(str(OUT/'live-image.png'))
    check('PNG export produces a PNG file',(OUT/'live-image.png').read_bytes().startswith(b'\x89PNG\r\n\x1a\n'))
    ready('document.querySelector("#progressWrap").hidden')
    doc=fitz.open()
    for i in range(2):
        pg=doc.new_page();pg.insert_text((72,90),f'Public deployment fixture - page {i+1}',fontsize=18)
    doc.save(OUT/'live-input.pdf');doc.close()
    page.click('#pdfTab');page.set_input_files('#fileInput',str(OUT/'live-input.pdf'))
    ready('document.querySelectorAll(".pdf-card").length === 2 && document.querySelector("#progressWrap").hidden')
    check('PDF import renders both page thumbnails',page.locator('.pdf-card img').count()==2)
    page.evaluate('() => document.querySelector("#toast").hidden=true')
    page.screenshot(path=str(OUT/'live-pdf.png'))
    page.click('#openExport')
    with page.expect_download(timeout=60000) as download: page.click('#doExport')
    download.value.save_as(str(OUT/'live-output.pdf'))
    with fitz.open(OUT/'live-output.pdf') as result:
        check('PDF export preserves pages and searchable text',len(result)==2 and 'page 1' in result[0].get_text() and 'page 2' in result[1].get_text())
    ready('document.querySelector("#progressWrap").hidden')
    page.click('#imageTab')
    check('workspace switch retains original image',page.locator('#filmstrip .thumb').count()==1)
    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(300)
    check('mobile layout has no horizontal overflow',page.evaluate('() => document.documentElement.scrollWidth <= innerWidth'))
    page.evaluate('() => document.querySelector("#toast").hidden=true')
    page.screenshot(path=str(OUT/'live-mobile.png'))
    page.click('[data-tool="enhance"]');page.wait_for_timeout(250)
    check('mobile drawer stays inside viewport',page.locator('#inspector').evaluate('(e) => e.getBoundingClientRect().x >= 0 && e.getBoundingClientRect().bottom <= innerHeight'))
    page.screenshot(path=str(OUT/'live-mobile-drawer.png'))
    check('no page JavaScript exceptions',not errors)
    check('test files were not uploaded',not uploads)
    report={'site':SITE,'revision':REV,'checked_at':datetime.now(timezone.utc).isoformat(),'browser':browser.version,'checks':checks,'errors':errors,'upload_requests':uploads}
    (OUT/'published-browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    browser.close()
print(json.dumps(report,ensure_ascii=False,indent=2))
