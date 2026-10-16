from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json, zipfile, fitz, os, re, time
ROOT=Path(__file__).resolve().parents[1]; OUT=Path(os.environ.get('STUDIO_CHECK_DIR',str(ROOT/'.editor-checks')));OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',8765),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
import atexit
checks=[];errors=[]
atexit.register(lambda:(OUT/'checks.json').write_text(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2)))
def record(name,condition):
 assert condition,name
 checks.append(name)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':960},device_scale_factor=1,accept_downloads=True)
 def wait_js(expression, timeout=30000):
  deadline=time.monotonic()+timeout/1000
  while time.monotonic()<deadline:
   if page.evaluate("() => ("+expression+")"):return
   page.wait_for_timeout(80)
  raise AssertionError("Timed out: "+expression+"; toast="+page.locator('#toast').inner_text())
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 if os.environ.get('STUDIO_IN_MEMORY'):
  # Local DOM/CPU fallback check only: this environment blocks browser network navigation.
  html=(ROOT/'tools/index.html').read_text()
  html=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]+>','',html)
  html=re.sub(r'<script[^>]*>.*?</script>','',html)
  html=re.sub(r'<link[^>]+rel="stylesheet"[^>]+>','',html)
  page.set_content(html);page.add_style_tag(content=(ROOT/'tools/studio.css').read_text())
  sources=[]
  for f in ['png-to-pdf/core.mjs','studio-utils.mjs','png-to-pdf/modes.mjs','studio-compression.mjs','pdf-workspace.mjs','studio.mjs']:
   code=(ROOT/'tools'/f).read_text()
   code=re.sub(r'^import .*?;\n','',code,flags=re.M).replace('export ','')
   code=code.replace("new URL('./pdf-kit/pdf-lib.min.js', import.meta.url).href","'/tools/pdf-kit/pdf-lib.min.js'")
   code=code.replace("new Worker(new URL('./png-to-pdf/worker.mjs',import.meta.url),{type:'module'})", "(()=>{throw new Error('Test CPU fallback')})()")
   sources.append(code)
  page.add_script_tag(content="(()=>{'use strict';\n"+'\n'.join(sources)+"\n})()")
 else:
  page.goto('http://127.0.0.1:8765/tools/')
 page.wait_for_selector('#presets .preset')
 record('seven adaptive preset controls',page.locator('.preset').count()==7)
 record('empty export disabled',page.locator('#openExport').is_disabled())
 page.screenshot(path=str(OUT/'desktop-empty.png'))
 page.click('#demo');wait_js('document.querySelector("#beforeCanvas").width > 500');wait_js('!document.querySelector("#preview").classList.contains("busy-preview")')
 record('sample import and processing',page.locator('#filmstrip .thumb').count()==1)
 record('real preset thumbnails',page.locator('.preset-thumb canvas').count()==7)
 page.screenshot(path=str(OUT/'desktop-editor.png'))
 original=page.locator('#afterCanvas').evaluate('(c)=>c.toDataURL()')
 page.click('[data-preset="bw"]');page.wait_for_timeout(650)
 record('preset changes output pixels',page.locator('#afterCanvas').evaluate('(c)=>c.toDataURL()')!=original)
 page.click('#undo');page.wait_for_timeout(500)
 record('undo restores exact filtered pixels',page.locator('#afterCanvas').evaluate('(c)=>c.toDataURL()')==original)
 page.click('[data-view="compare"]');page.locator('#compareRange').fill('33')
 record('before-after comparison slider', '33%' in page.locator('#afterCanvas').get_attribute('style'))
 page.click('[data-tool="crop"]');page.click('#rotateRight');wait_js('document.querySelector("#afterCanvas").width > document.querySelector("#afterCanvas").height')
 record('rotate changes preview orientation',True)
 page.click('#undo');wait_js('document.querySelector("#afterCanvas").height > document.querySelector("#afterCanvas").width')
 page.click('#startCrop');box=page.locator('#preview').bounding_box();page.mouse.move(box['x']+box['width']*.1,box['y']+box['height']*.1);page.mouse.down();page.mouse.move(box['x']+box['width']*.8,box['y']+box['height']*.8);page.mouse.up();page.click('#applyCrop');page.wait_for_timeout(500)
 record('crop applies without runtime error',page.locator('#cropBox').is_hidden())
 page.click('#undo');page.wait_for_timeout(500)
 for fmt,ext in [('jpeg','jpg'),('png','png'),('webp','webp'),('zip-png','zip'),('pdf','pdf')]:
  page.click('#openExport');page.select_option('#exportFormat',fmt)
  with page.expect_download() as d:page.click('#doExport')
  download=d.value;path=OUT/f'export.{ext}';download.save_as(str(path))
  record(f'{fmt} real download',path.stat().st_size>100)
  wait_js('document.querySelector("#progressWrap").hidden')
 record('ZIP integrity',zipfile.ZipFile(OUT/'export.zip').testzip() is None)
 doc=fitz.open(OUT/'export.pdf');record('PDF readable with one page',len(doc)==1);doc.close()
 if not os.environ.get('STUDIO_IN_MEMORY'):
  page.click('[data-tool="compress"]');page.locator('#imageOriginalCompression summary').click()
  with page.expect_download() as d:page.click('#imageCompressOriginal')
  d.value.save_as(str(OUT/'compressed-original.jpg'));wait_js('document.querySelector("#progressWrap").hidden')
  record('original JPEG compression real download',(OUT/'compressed-original.jpg').stat().st_size>100)
 page.click('[data-workspace="pdf"]');record('PDF workspace switch',page.locator('#pdfWorkspace').is_visible());page.screenshot(path=str(OUT/'desktop-pdf-empty.png'))
 if not os.environ.get('STUDIO_IN_MEMORY'):
  fixture=OUT/'fixture.pdf';doc=fitz.open()
  for i in range(3):
   pg=doc.new_page();pg.insert_text((72,80),f'PAGE {i+1}: Original searchable content',fontsize=20);pg.insert_text((72,125),'Paper Studio PDF integration fixture.',fontsize=12)
  doc.save(fixture);doc.close()
  page.set_input_files('#fileInput',str(fixture));page.wait_for_selector('.pdf-card',timeout=60000)
  wait_js('document.querySelector("#progressWrap").hidden')
  record('PDF imports and renders all pages',page.locator('.pdf-card').count()==3)
  record('remove requires explicit selection',page.locator('#pdfDelete').is_disabled())
  page.fill('#pageRange','2-3');page.click('#selectRange');record('PDF range selection',page.locator('.pdf-card.selected').count()==2)
  page.click('#pdfRotate');page.screenshot(path=str(OUT/'desktop-pdf-pages.png'))
  page.click('#openExport')
  with page.expect_download() as d:page.click('#doExport')
  d.value.save_as(str(OUT/'merged.pdf'));wait_js('document.querySelector("#progressWrap").hidden')
  merged=fitz.open(OUT/'merged.pdf');record('PDF extract count',len(merged)==2);record('PDF text preserved','PAGE 2' in merged[0].get_text() and 'PAGE 3' in merged[1].get_text());record('PDF rotation preserved',merged[0].rotation==90);merged.close()
  page.click('#pdfSplit')
  with page.expect_download() as d:page.click('#doExport')
  d.value.save_as(str(OUT/'split.zip'));wait_js('document.querySelector("#progressWrap").hidden')
  archive=zipfile.ZipFile(OUT/'split.zip');record('PDF split ZIP contents',len(archive.namelist())==2 and archive.testzip() is None)
  page.click('[data-tool="pdfcompress"]');page.locator('#pdfOriginalCompression summary').click();page.select_option('#pdfCompressionProfile','lossless')
  with page.expect_download() as d:page.click('#pdfCompressOriginal')
  d.value.save_as(str(OUT/'original-optimized.pdf'));wait_js('document.querySelector("#progressWrap").hidden')
  optimized=fitz.open(OUT/'original-optimized.pdf');record('original PDF optimization retains all source pages and text',len(optimized)==3 and 'PAGE 1' in optimized[0].get_text());optimized.close()
  page.click('[data-tool="pdfcompress"]');page.check('#rasterPdf')
  with page.expect_download() as d:page.click('#pdfCompress')
  d.value.save_as(str(OUT/'raster.pdf'));wait_js('document.querySelector("#progressWrap").hidden')
  raster=fitz.open(OUT/'raster.pdf');record('raster compression is explicitly image-only',len(raster)==2 and not raster[0].get_text().strip());raster.close()
  page.click('[data-tool="convert"]');page.click('#pdfToImages');wait_js('!document.querySelector("#imageWorkspace").hidden && document.querySelector("#progressWrap").hidden')
  record('PDF-to-image handoff retains existing images',page.locator('#filmstrip .thumb').count()==3)
  page.click('[data-workspace="pdf"]');record('PDF source retained after image handoff',page.locator('.pdf-card').count()==3)
 page.click('[data-workspace="image"]');record('workspace retains imported image',page.locator('#filmstrip .thumb').count()>=1)
 page.click('[data-tool="enhance"]');page.click('[data-preset="paper"]');page.wait_for_timeout(600);page.evaluate("() => document.querySelector('#toast').hidden=true");page.screenshot(path=str(OUT/'desktop-final.png'))
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(250)
 record('mobile has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
 page.screenshot(path=str(OUT/'mobile-editor.png'))
 page.click('[data-tool="enhance"]');page.wait_for_timeout(250)
 record('mobile inspector opens as drawer',page.locator('#inspector').evaluate('(e)=>e.getBoundingClientRect().x>=0 && e.getBoundingClientRect().bottom <= innerHeight'))
 page.screenshot(path=str(OUT/'mobile-inspector.png'));page.click('#closeInspector')
 record('no page runtime errors',not errors)
 (OUT/'checks.json').write_text(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2))
 browser.close()
server.shutdown();print(json.dumps({'passed':len(checks),'checks':checks,'errors':errors},ensure_ascii=False))
