"""Real browser downloads verified with PyMuPDF. Run normally for HTTP/CSP/Worker tests.
OFFLINE_HARNESS=1 is for navigation-restricted environments: source is injected into
about:blank and a bundled Blob worker substitutes importScripts only. It does not
verify HTTP delivery or CSP; the unmodified HTTP mode is run in GitHub Actions.
"""
from pathlib import Path
import functools, http.server, io, json, os, re, threading, zipfile
import fitz
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('TEST_OUTPUT','/tmp/pdf-toolkit-e2e'));OUT.mkdir(parents=True,exist_ok=True)
FIX=OUT/'fixtures';FIX.mkdir(exist_ok=True)
OFFLINE=os.environ.get('OFFLINE_HARNESS')=='1'
RESULTS=[]
def check(label,condition=True):
    assert condition,label
    RESULTS.append(label);print('PASS',label,flush=True)

def fixtures():
    for stem,n in [('alpha',3),('beta',2),('many',60)]:
        d=fitz.open()
        for i in range(n):
            p=d.new_page(width=300+i*10,height=400)
            p.insert_text((35,60),f'{stem.upper()} {i+1}',fontsize=18)
            p.draw_rect(fitz.Rect(35,100,165,170),color=(0.2,0.4,0.1),fill=(0.8,0.9,0.7))
            if stem=='alpha' and i==1:
                p.set_cropbox(fitz.Rect(10,10,290,390));p.set_rotation(90)
        d.save(FIX/f'{stem}.pdf')
        if stem=='alpha':d.save(FIX/'encrypted.pdf',encryption=fitz.PDF_ENCRYPT_AES_256,user_pw='secret',owner_pw='owner')
        d.close()
    im=Image.new('RGBA',(160,100),(0,0,0,0));dr=ImageDraw.Draw(im);dr.rectangle((20,15,100,70),fill=(180,30,50,180));im.save(FIX/'transparent.png')
    im.save(FIX/'animated.png',save_all=True,append_images=[Image.new('RGBA',(160,100),(40,90,140,255))],duration=100,loop=0)
    (FIX/'bad.pdf').write_bytes(b'not a valid document')
    (FIX/'broken.pdf').write_bytes(b'%PDF-1.7\n1 0 obj\ncorrupt')
    d=fitz.open();p=d.new_page();w=fitz.Widget();w.field_name='fill_me';w.field_type=fitz.PDF_WIDGET_TYPE_TEXT;w.rect=fitz.Rect(20,20,150,60);p.add_widget(w);d.save(FIX/'form.pdf');d.close()

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

fixtures()
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
if OFFLINE:
    core=(ROOT/'tools/pdf-kit/core.js').read_text()
    app=(ROOT/'tools/pdf-kit/app.js').read_text()
    worker='\n'.join((ROOT/p).read_text() for p in ['tools/pdf-kit/pdf-lib.min.js','tools/pdf-engine.js','tools/pdf-kit/core.js'])+'\n'+re.sub(r'importScripts\([^\n]+\);','',(ROOT/'tools/pdf-kit/worker.js').read_text())

def load(context,route,width=1440):
    page=context.new_page()
    page.set_viewport_size({'width':width,'height':1000})
    page.set_default_timeout(18000)
    if OFFLINE:
        html=(ROOT/route.strip('/')/'index.html').read_text()
        html=re.sub(r'<meta[^>]+http-equiv="Content-Security-Policy"[^>]*>','',html)
        html=re.sub(r'<link[^>]+rel="stylesheet"[^>]*>','',html)
        html=re.sub(r'<script[^>]*>.*?</script>','',html,flags=re.S)
        page.set_content(html)
        css='tools/toolkit.css' if route not in ['/tools/png-to-pdf-simple/'] else 'tools/tools.css'
        page.add_style_tag(content=(ROOT/css).read_text())
        if route not in ['/tools/','/tools/png-to-pdf-simple/','/tools/png-to-pdf/']:
            page.evaluate("""source=>{const NativeWorker=window.Worker;const blob=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));window.Worker=class extends NativeWorker{constructor(url){super(blob);}};const s=document.createElement('script');s.type='application/x-test-placeholder';s.setAttribute('data-workbench','');s.src='https://test.invalid/tools/pdf-kit/app.js';document.head.append(s);}""",worker)
            page.add_script_tag(content=core);page.add_script_tag(content=app)
        elif route=='/tools/png-to-pdf-simple/':
            page.add_script_tag(content=(ROOT/'tools/pdf-engine.js').read_text());page.add_script_tag(content=(ROOT/'tools/app.js').read_text())
    else:
        response=page.goto(BASE+route,wait_until='networkidle')
        assert response.status==200
    return page

def add(page,*names):
    page.locator('#file-input').set_input_files([str(FIX/n) for n in names])
    expect(page.locator('#workspace')).to_have_attribute('aria-busy','false')

def download(page,name):
    with page.expect_download() as event:page.locator('#export').click()
    dl=event.value;p=OUT/name;dl.save_as(p)
    expect(page.locator('#workspace')).to_have_attribute('aria-busy','false')
    assert p.stat().st_size>100
    return p,dl.suggested_filename

def texts(path):
    with fitz.open(path) as d:return [p.get_text().strip() for p in d]

try:
 with sync_playwright() as p:
    browser=p.chromium.launch(**({'executable_path':'/usr/bin/chromium'} if Path('/usr/bin/chromium').exists() else {}),args=['--no-sandbox'])
    ctx=browser.new_context(accept_downloads=True)
    requests=[];errors=[]
    ctx.on('request',lambda r:requests.append((r.method,r.url)))
    ctx.on('page',lambda pg:pg.on('pageerror',lambda e:errors.append(str(e))))
    page=load(ctx,'/tools/')
    check('hub exposes all seven existing/new tools',page.locator('.tool-card').count()==7)
    for href in page.locator('.tool-card').evaluate_all('(els)=>els.map(e=>e.getAttribute("href"))'):
        check('hub link resolves '+href,(ROOT/'tools'/href/'index.html').exists())
    page.screenshot(path=str(OUT/'hub-desktop.png'),full_page=True);page.close()
    page=load(ctx,'/tools/',390);check('mobile hub has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    page.screenshot(path=str(OUT/'hub-mobile.png'),full_page=True);page.close()
    page=load(ctx,'/tools/merge-pdf/');add(page,'alpha.pdf','beta.pdf')
    check('merge reads real page counts',page.locator('#summary').inner_text().startswith('5 页'))
    before=len(requests);out,_=download(page,'merged.pdf')
    check('merge preserves searchable text and file order',texts(out)==['ALPHA 1','ALPHA 2','ALPHA 3','BETA 1','BETA 2'])
    with fitz.open(out) as d:
        check('merge preserves rotation and CropBox',d[1].rotation==90 and d[1].cropbox.x0==10)
        with fitz.open(FIX/'alpha.pdf') as a,fitz.open(FIX/'beta.pdf') as b:
            check('rendered merged pages exactly match originals',all(d[i].get_pixmap().samples==src.get_pixmap().samples for i,src in enumerate([*a,*b])))
    check('export sends no HTTP request',len(requests)==before)
    page.locator('.source-card').nth(1).locator('[data-action=up]').click()
    page.locator('.source-card').nth(0).locator('input').fill('2')
    page.locator('.source-card').nth(1).locator('input').fill('3,1')
    out,_=download(page,'merge-ranges.pdf');check('merge follows file order and per-file ranges',texts(out)==['BETA 2','ALPHA 3','ALPHA 1'])
    page.locator('.source-card').nth(0).locator('input').fill('99')
    check('invalid page range blocks export',page.locator('#export').is_disabled() and '范围' in page.locator('#validation').inner_text())
    page.screenshot(path=str(OUT/'merge-validation.png'),full_page=True);page.close()
    page=load(ctx,'/tools/mixed-to-pdf/');add(page,'alpha.pdf','transparent.png','beta.pdf')
    page.locator('.source-card').nth(0).locator('input').fill('1')
    page.locator('.source-card').nth(2).locator('input').fill('2')
    page.locator('#filename').fill('论文/附件:合并')
    out,name=download(page,'mixed.pdf')
    with fitz.open(out) as d:
        check('mixed merge contains PDF-PNG-PDF in requested order',len(d)==3 and d[0].get_text().strip()=='ALPHA 1' and d[2].get_text().strip()=='BETA 2')
        images=d[1].get_images(full=True);check('PNG pixel dimensions and alpha retained',len(images)==1 and images[0][2:4]==(160,100) and images[0][1]>0)
        check('image A4 orientation follows landscape PNG',abs(d[1].rect.width-841.88976)<0.01)
        d[1].get_pixmap(alpha=False).save(OUT/'mixed-png-render.png')
    check('safe Unicode output filename',name=='论文_附件_合并.pdf')
    page.screenshot(path=str(OUT/'mixed-desktop.png'),full_page=True)
    page.locator('#paper').select_option('image');page.locator('#dpi').select_option('96');page.locator('#margin').select_option('0')
    out,_=download(page,'mixed-native.pdf')
    with fitz.open(out) as d:check('native image page DPI and margin geometry',abs(d[1].rect.width-120)<0.01 and abs(d[1].rect.height-75)<0.01)
    page.close()
    page=load(ctx,'/tools/split-pdf/');add(page,'alpha.pdf')
    out,_=download(page,'split-each.zip')
    with zipfile.ZipFile(out) as z:
        check('split ZIP has valid CRC and three PDFs',z.testzip() is None and len(z.namelist())==3)
        contents=[]
        for name in z.namelist():
            with fitz.open(stream=z.read(name),filetype='pdf') as d:contents.append(d[0].get_text().strip());assert len(d)==1
        check('each split page retains its searchable content',contents==['ALPHA 1','ALPHA 2','ALPHA 3'])
    page.locator('#split-mode').select_option('chunks');page.locator('#chunk').fill('2');out,_=download(page,'split-chunks.zip')
    with zipfile.ZipFile(out) as z:
        counts=[]
        for n in z.namelist():
            with fitz.open(stream=z.read(n),filetype='pdf') as d:counts.append(len(d))
        check('fixed-size splitting handles final remainder',counts==[2,1])
    page.locator('#split-mode').select_option('custom');page.locator('#split-ranges').fill('3-2;1');page.locator('#filename').fill('自定义分组')
    out,_=download(page,'split-custom.zip')
    with zipfile.ZipFile(out) as z:
        names=z.namelist();check('custom ZIP preserves Chinese names',all(n.startswith('自定义分组_') for n in names))
        with fitz.open(stream=z.read(names[0]),filetype='pdf') as d:check('custom split respects reverse range',[p.get_text().strip() for p in d]==['ALPHA 3','ALPHA 2'])
    page.locator('#split-ranges').fill('1-2;');check('empty split group blocks download',page.locator('#export').is_disabled());page.close()
    page=load(ctx,'/tools/extract-pdf/');add(page,'alpha.pdf');page.locator('#extract-range').fill('3,1,3');out,_=download(page,'extracted.pdf')
    check('extraction preserves order and intentional duplication',texts(out)==['ALPHA 3','ALPHA 1','ALPHA 3']);page.close()
    page=load(ctx,'/tools/organize-pdf/');add(page,'alpha.pdf')
    page.locator('[data-page="0"] input').uncheck()
    page.locator('[data-page="2"] [data-action=up]').click()
    page.locator('[data-page="2"] [data-action=rotate]').click()
    out,_=download(page,'organized.pdf')
    check('organizer removes excluded page and changes order',texts(out)==['ALPHA 3','ALPHA 2'])
    with fitz.open(out) as d:check('organizer changes selected rotation only',d[0].rotation==90 and d[1].rotation==90)
    add(page,'bad.pdf')
    check('failed replacement preserves organizer edits',page.locator('#summary').inner_text().startswith('2 页') and page.locator('#page-grid').locator('li').nth(1).get_attribute('data-page')=='2')
    page.locator('#select-none').click();check('organizer refuses an empty PDF',page.locator('#export').is_disabled())
    page.locator('#reset-pages').click();check('reset restores all pages',page.locator('#summary').inner_text().startswith('3 页'))
    page.screenshot(path=str(OUT/'organize-desktop.png'),full_page=True);page.close()
    page=load(ctx,'/tools/merge-pdf/');add(page,'bad.pdf','broken.pdf','encrypted.pdf','form.pdf','transparent.png')
    message=page.locator('#notice').inner_text()
    check('invalid encrypted form and wrong-type files rejected',page.locator('.source-card').count()==0 and all(t in message for t in ['加密','表单','只接受 PDF']))
    add(page,'alpha.pdf');check('valid import still works after rejected files',page.locator('.source-card').count()==1)
    page.locator('#clear').click();add(page,'many.pdf')
    page.evaluate("document.querySelector('#export').click();document.querySelector('#cancel').click()")
    expect(page.locator('#workspace')).to_have_attribute('aria-busy','false')
    check('cancelling preserves original files and settings',page.locator('.source-card').count()==1 and '取消' in page.locator('#notice').inner_text())
    out,_=download(page,'retry-after-cancel.pdf');check('a new worker can export after cancellation',len(texts(out))==60);page.close()
    page=load(ctx,'/tools/mixed-to-pdf/',390);add(page,'alpha.pdf','transparent.png')
    check('mobile workbench has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    page.screenshot(path=str(OUT/'mixed-mobile.png'),full_page=True)
    add(page,'animated.png');check('APNG is explicitly rejected','动态 PNG' in page.locator('#notice').inner_text() and page.locator('.source-card').count()==2)
    page.locator('#clear').click()
    evil='<img onerror=alert(1)>.pdf'
    page.locator('#file-input').set_input_files({'name':evil,'mimeType':'application/pdf','buffer':(FIX/'alpha.pdf').read_bytes()})
    expect(page.locator('#workspace')).to_have_attribute('aria-busy','false')
    check('filenames are text, not executable HTML',page.locator('.source-name').inner_text()==evil and page.locator('.source-name img').count()==0)
    page.evaluate("() => {const original=URL.createObjectURL.bind(URL);window.__blobTypes=[];URL.createObjectURL=blob=>{window.__blobTypes.push(blob.type);return original(blob);};}")
    page.locator('#file-input').set_input_files({'name':'disguised.html','mimeType':'text/html','buffer':(FIX/'alpha.pdf').read_bytes()})
    expect(page.locator('#workspace')).to_have_attribute('aria-busy','false')
    check('original preview normalizes untrusted file MIME type',page.evaluate('window.__blobTypes.at(-1)')=='application/pdf')
    page.close()
    page=load(ctx,'/tools/png-to-pdf-simple/');page.locator('#file-input').set_input_files(str(FIX/'transparent.png'));expect(page.locator('#workspace')).to_have_attribute('aria-busy','false');out,_=download(page,'legacy-png.pdf')
    check('preserved simple PNG converter still exports',fitz.open(out).page_count==1);page.close()
    if not OFFLINE:
        page=load(ctx,'/tools/png-to-pdf/');check('PaperScan still resolves',page.title()!='');page.close()
        check('requests are only same-origin static GETs',all(method=='GET' and url.startswith(BASE+'/') for method,url in requests if not url.startswith(('blob:','data:'))))
    check('no uncaught browser JavaScript errors',not errors)
    browser.close()
finally:
    server.shutdown()
    (OUT/'results.json').write_text(json.dumps({'harness':'source injection + bundled real worker' if OFFLINE else 'HTTP + CSP + real worker imports','passed':len(RESULTS),'checks':RESULTS},ensure_ascii=False,indent=2))
print(f'{len(RESULTS)} checks passed; artifacts: {OUT}')
