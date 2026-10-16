"""Real-HTTP regression of the consolidated document tools and enlarged UI."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import os, json, time, struct, zlib, zipfile
import pymupdf as fitz
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('TOOLS_UI_OUTPUT',str(ROOT/'.editor-checks/unified')));OUT.mkdir(parents=True,exist_ok=True)
server=None
BASE=os.environ.get('TOOLS_UI_BASE_URL','')
if not BASE:
 class Quiet(SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 BASE=f'http://127.0.0.1:{server.server_port}'
BASE=BASE.rstrip('/')
ROUTES={'png-to-pdf':'#image','png-to-pdf-simple':'#image/png-to-pdf','mixed-to-pdf':'#pdf/mixed','merge-pdf':'#pdf/merge','split-pdf':'#pdf/split','extract-pdf':'#pdf/extract','organize-pdf':'#pdf/organize'}
checks=[];errors=[];uploads=[]
def check(name,ok=True):
 assert ok,name
 checks.append(name);print('PASS',name,flush=True)
def png(path):
 def chunk(k,v):return struct.pack('>I',len(v))+k+v+struct.pack('>I',zlib.crc32(k+v)&0xffffffff)
 raw=b''.join(b'\0'+b''.join(bytes((120,30,70,180 if 20<x<130 and 10<y<90 else 0)) for x in range(160)) for y in range(100))
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',160,100,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b''))
png(OUT/'transparent.png')
for name,count in [('alpha',3),('beta',2)]:
 d=fitz.open()
 for i in range(count):
  p=d.new_page(width=300+i*10,height=400);p.insert_text((35,60),f'{name.upper()} {i+1}',fontsize=18)
  if name=='alpha' and i==1:p.set_cropbox(fitz.Rect(10,10,290,390));p.set_rotation(90)
 d.save(OUT/f'{name}.pdf');d.close()
(OUT/'bad.pdf').write_bytes(b'not a PDF')
def texts(file):
 with fitz.open(file) as d:return [p.get_text().strip() for p in d]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True)
  context=browser.new_context(viewport={'width':1440,'height':960},accept_downloads=True)
  context.on('page',lambda pg:pg.on('pageerror',lambda e:errors.append(str(e))))
  context.on('request',lambda r:uploads.append(r.url) if r.method not in ('GET','HEAD') else None)
  page=context.new_page();page.set_default_timeout(60000)
  def ready(expr):
   deadline=time.monotonic()+60
   while time.monotonic()<deadline:
    if page.evaluate('() => ('+expr+')'):return
    page.wait_for_timeout(80)
   raise AssertionError('Timed out: '+expr+' '+str(page.locator('#toast').text_content()))
  def idle():ready('document.querySelector("#progressWrap").hidden')
  def route(hash_):
   page.evaluate('(v)=>location.hash=v',hash_);ready('location.hash==='+json.dumps(hash_));page.wait_for_timeout(150)
  def export(name):
   with page.expect_download(timeout=60000) as event:page.click('#doExport')
   file=OUT/name;event.value.save_as(file);idle();assert file.stat().st_size>100;return file
  page.goto(BASE+'/tools/#image',wait_until='networkidle');ready('document.querySelectorAll(".preset").length===18')
  page.evaluate('window.__sameDocument="retained"')
  page.set_input_files('#fileInput',str(OUT/'transparent.png'));idle();ready('document.querySelector("#beforeCanvas").width===160')
  check('shared image queue accepts actual PNG',page.locator('#filmstrip .thumb').count()==1)
  page.click('.ts-menu-summary');page.click('[data-tool-target="png"]')
  check('menu uses hash navigation without reload',page.url.endswith('#image/png-to-pdf') and page.evaluate('window.__sameDocument')=='retained')
  page.click('#imageOriginalPdf');page.select_option('#paper','image');page.select_option('#margin','0');page.select_option('#imageDpi','96')
  raw=export('lossless.pdf')
  with fitz.open(raw) as d:
   im=d[0].get_images(full=True)[0]
   check('lossless PNG PDF preserves native image dimensions and alpha',len(d)==1 and im[2:4]==(160,100) and im[1]>0)
   check('native paper honors selected DPI and margins',abs(d[0].rect.width-120)<.02 and abs(d[0].rect.height-75)<.02)
  route('#image');page.click('#zoomIn');check('preview zoom remains available',page.locator('#zoomControls').is_visible());page.click('#zoomFit')
  route('#pdf/mixed');page.select_option('#mixedPaper','image');page.select_option('#mixedMargin','0')
  page.set_input_files('#fileInput',[str(OUT/n) for n in ['alpha.pdf','transparent.png','beta.pdf']]);idle();ready('document.querySelectorAll(".pdf-card").length===6')
  check('PDF and images enter one ordered page grid',page.locator('.pdf-card').count()==6)
  page.click('#openExport');page.select_option('#pdfExportMode','merge');mixed=export('mixed.pdf')
  check('mixed export retains document order and searchable text',texts(mixed)==['ALPHA 1','ALPHA 2','ALPHA 3','','BETA 1','BETA 2'])
  with fitz.open(mixed) as d,fitz.open(OUT/'alpha.pdf') as original:
   check('existing PDF rotation and crop boxes preserved',d[1].rotation==90 and d[1].cropbox.x0==10)
   check('original PDF pages render identically',all(d[i].get_pixmap().samples==original[i].get_pixmap().samples for i in range(3)))
   check('mixed PNG page retains alpha and DPI',d[3].get_images(full=True)[0][1]>0 and abs(d[3].rect.width-120)<.02)
  page.evaluate('document.querySelector("#toast").hidden=true');page.screenshot(path=str(OUT/'unified-pdf-desktop.png'))
  page.click('#addWorkspaceImages');idle();check('existing image queue feeds PDF without reupload',page.locator('.pdf-card').count()==7)
  page.click('#undo');check('undo restores page count',page.locator('.pdf-card').count()==6)
  route('#pdf/extract');page.click('#extractExport');page.fill('#extractRange','6,1,6');extracted=export('extracted.pdf')
  check('extraction supports order and intentional duplicates',texts(extracted)==['BETA 2','ALPHA 1','BETA 2'])
  route('#pdf/split');page.click('#splitExport');page.select_option('#splitMode','chunks');page.fill('#splitChunk','2');parts=export('chunks.zip')
  with zipfile.ZipFile(parts) as z:
   check('fixed-size splitting produces valid PDFs and ZIP',z.testzip() is None and [fitz.open(stream=z.read(n),filetype='pdf').page_count for n in z.namelist()]==[2,2,2])
  page.click('#splitExport');page.select_option('#splitMode','custom');page.fill('#splitRanges','3-2;1;6');parts=export('custom.zip')
  with zipfile.ZipFile(parts) as z:
   check('custom split supports reverse ranges',len(z.namelist())==3 and [pg.get_text().strip() for pg in fitz.open(stream=z.read(z.namelist()[0]),filetype='pdf')]==['ALPHA 3','ALPHA 2'])
  route('#pdf/extract');page.click('#extractExport');page.fill('#extractRange','99');page.click('#doExport');idle()
  check('invalid extraction reports an error without corrupting queue','范围' in page.locator('#toast').inner_text() and page.locator('.pdf-card').count()==6)
  route('#pdf/organize');page.fill('#pageRange','1');page.click('#selectRange');page.click('#pdfRotate');page.click('#pdfMoveDown')
  page.click('#openExport');page.select_option('#pdfExportMode','merge');one=export('selected-rotated.pdf')
  with fitz.open(one) as d:check('selection rotation and reordering are real operations',len(d)==1 and d[0].rotation==90 and d[0].get_text().strip()=='ALPHA 1')
  page.click('#undo');page.click('#undo');page.set_input_files('#fileInput',str(OUT/'bad.pdf'));idle()
  check('bad import does not destroy existing pages',page.locator('.pdf-card').count()==6)
  route('#image');check('image queue survives all PDF operations',page.locator('#filmstrip .thumb').count()==1)
  page.click('#demo');idle();ready('document.querySelectorAll(".thumb").length===2')
  page.locator('#filmstrip .thumb').nth(1).click();page.wait_for_timeout(700)
  check('labels and controls enlarged',page.locator('.description').first.evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')>=16 and page.locator('#importFiles').evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')>=16)
  page.evaluate('document.querySelector("#toast").hidden=true');page.screenshot(path=str(OUT/'unified-image-desktop.png'))
  for old,hash_ in ROUTES.items():
   pg=context.new_page();pg.goto(BASE+'/tools/'+old+'/',wait_until='networkidle');expect(pg).to_have_url(BASE+'/tools/'+hash_);expect(pg.locator('#imageTab')).to_be_visible();pg.close()
  check('all seven old bookmarks redirect to exact hashes')
  for w in [1440,1280,1024,800,390,320]:
   page.set_viewport_size({'width':w,'height':960 if w>800 else 844});page.wait_for_timeout(180)
   check(f'{w}px layout has no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   rect=page.locator('#openExport').bounding_box();check(f'{w}px export stays onscreen',rect['x']>=0 and rect['x']+rect['width']<=w+1)
  page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(200);page.screenshot(path=str(OUT/'unified-image-mobile.png'))
  page.click('[data-tool="enhance"]');page.wait_for_timeout(250)
  check('large mobile inspector stays in viewport',page.locator('#inspector').evaluate('(e)=>e.getBoundingClientRect().width<=innerWidth&&e.getBoundingClientRect().x>=0'))
  page.screenshot(path=str(OUT/'unified-mobile-panel.png'));page.click('#closeInspector')
  check('no runtime errors',not errors);check('no uploaded files',not uploads)
  browser.close()
finally:
 if server:server.shutdown()
 report={'base':BASE,'checks':checks,'errors':errors,'uploads':uploads}
 (OUT/'unified-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print(json.dumps(report,ensure_ascii=False,indent=2))
