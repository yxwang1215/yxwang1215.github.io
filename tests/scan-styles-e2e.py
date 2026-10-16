"""HTTP-origin integration checks for the actual editor, worker and every export format."""
import json
import os
import re
from pathlib import Path
import subprocess
import time
import zipfile
from PIL import Image, ImageDraw
import pymupdf as fitz
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SCAN_QA_OUTPUT', '/tmp/scan-styles-qa'))
OUT.mkdir(parents=True, exist_ok=True)
# Retain the exact public tool sources with QA output for reproducible offline debugging.
with zipfile.ZipFile(OUT/'tested-tools.zip', 'w', zipfile.ZIP_DEFLATED) as snapshot:
    for source in (ROOT/'tools').rglob('*'):
        if source.is_file():
            snapshot.write(source, source.relative_to(ROOT))
fixture = Image.new('RGB', (480, 620), (225, 218, 197))
draw = ImageDraw.Draw(fixture)
for y in range(70, 540, 35):
    draw.text((45, y), 'Research notes: preserve evidence 12345', fill=(85, 84, 80))
draw.ellipse((290, 470, 425, 590), outline=(160, 35, 35), width=4)
fixture.save(OUT/'input.jpg', quality=90)
fixture.save(OUT/'input.webp', quality=90)
server = subprocess.Popen(['python', '-m', 'http.server', '8876', '--bind', '127.0.0.1'], cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
errors, uploads, checks = [], [], []

def page_count(page, expected):
    expect(page.locator('#filmstrip .thumb')).to_have_count(int(expected), timeout=30000)

def ready(page):
    for _ in range(300):
        if page.locator("#demo").evaluate("el => typeof el.onclick === 'function'"):
            return
        page.wait_for_timeout(100)
    raise AssertionError("Editor event handlers did not initialize")

def preview_ready(page):
    page.wait_for_timeout(250)
    for _ in range(300):
        if page.locator('#preview').evaluate("el => !el.hidden && !el.classList.contains('busy-preview')"):
            return
        page.wait_for_timeout(100)
    raise AssertionError('Preview did not finish')

try:
    time.sleep(.6)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width':1440,'height':1000}, accept_downloads=True)
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda r: uploads.append(r.url) if r.method not in ('GET','HEAD') else None)
        page.goto('http://127.0.0.1:8876/tools/', wait_until='networkidle')
        ready(page)
        assert page.locator('[data-preset]').count() == 18
        page.locator('#demo').click()
        page_count(page,"01")
        preview_ready(page)
        assert page.locator('[data-preset] canvas').count() == 18
        page.locator('[data-scan-group="all"]').click()
        modes = page.locator('[data-preset]').evaluate_all('(els)=>els.map(e=>e.dataset.preset)')
        outputs = set()
        for mode in modes:
            page.locator(f'[data-preset="{mode}"]').click()
            preview_ready(page)
            assert page.locator(f'[data-preset="{mode}"]').get_attribute('aria-pressed') == 'true'
            outputs.add(page.locator('#afterCanvas').evaluate('(c)=>c.toDataURL()'))
        assert len(outputs) >= 16, 'scan modes should not collapse to the same rendered output'
        checks.append('18 real preset selections and worker-rendered previews')
        for group, count in [('basic',5),('repair',4),('scene',5),('color',4),('all',18)]:
            page.locator(f'[data-scan-group="{group}"]').click()
            assert page.locator('[data-preset]:visible').count() == count
        checks.append('all category filters')
        page.locator('#fileInput').set_input_files([OUT/'input.jpg', OUT/'input.webp'])
        page_count(page,"03")
        preview_ready(page)
        page.locator('[data-preset="comprehensive"]').click()
        preview_ready(page)
        page.locator('#applyAll').click()
        for i in range(3):
            page.locator('#filmstrip .thumb').nth(i).click()
            preview_ready(page)
            assert page.locator('[data-preset="comprehensive"]').get_attribute('aria-pressed') == 'true'
        checks.append('PNG/JPG/WebP import and per-page batch application')
        page.locator('[data-view="compare"]').click()
        assert page.locator('#compareSlider').is_visible()
        page.locator('[data-view="processed"]').click()
        page.screenshot(path=str(OUT/'desktop.png'), full_page=True)
        # Every export uses the selected mode and the full source, not a preview screenshot.
        for fmt in ['png','jpeg','webp','zip-png','zip-jpeg','zip-webp','pdf']:
            page.locator('#openExport').click()
            page.locator('#exportFormat').select_option(fmt)
            with page.expect_download(timeout=60000) as download:
                page.locator('#doExport').click()
            result = download.value
            target = OUT/result.suggested_filename
            result.save_as(target)
            assert target.stat().st_size > 100
            if fmt == 'pdf':
                with fitz.open(target) as doc:
                    assert len(doc) == 3
            elif fmt.startswith('zip-'):
                with zipfile.ZipFile(target) as z:
                    assert len(z.namelist()) == 3 and z.testzip() is None
            else:
                with Image.open(target) as im:
                    assert im.size == (480,620)
            preview_ready(page)
        checks.append('PNG/JPG/WebP, three ZIP variants and three-page PDF exports')
        page.locator('#resetImage').click()
        preview_ready(page)
        assert page.locator('[data-preset="original"]').get_attribute('aria-pressed') == 'true'
        checks.append('reset returns to original')
        mobile = browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        m = mobile.new_page()
        m.on('pageerror', lambda e: errors.append(str(e)))
        m.goto('http://127.0.0.1:8876/tools/', wait_until='networkidle')
        ready(m);m.locator('#demo').click()
        page_count(m,"01")
        preview_ready(m)
        m.locator('[data-tool="enhance"]').click()
        m.locator('[data-scan-group="repair"]').click()
        m.locator('[data-preset="shadow"]').click();preview_ready(m)
        assert m.locator('[data-preset="shadow"]').get_attribute('aria-pressed') == 'true'
        assert m.evaluate('() => document.documentElement.scrollWidth <= window.innerWidth + 1')
        m.screenshot(path=str(OUT/'mobile.png'), full_page=True)
        checks.append('390px mobile layout and touch preset selection')
        assert not errors, errors
        assert not uploads, uploads
        checks.append('no browser exceptions or file upload requests')
        browser.close()
finally:
    server.terminate();server.wait(timeout=10)
    report={'checks':checks,'browser_errors':errors,'upload_requests':uploads}
    (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False,indent=2))
