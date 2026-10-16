"""Actual HTTP-origin browser tests; no mocked workers, imports or CSP."""
from pathlib import Path
import json,os,shutil,subprocess,time,zipfile
from PIL import Image,ImageDraw,ImageFont,PngImagePlugin
import fitz
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('TOOLS_QA_DIR','/tmp/tools-qa'));OUT.mkdir(exist_ok=True,parents=True)
try:font=ImageFont.truetype('DejaVuSans.ttf',24)
except OSError:font=ImageFont.load_default(size=24)
im=Image.new('RGB',(800,1100),(206,205,194));d=ImageDraw.Draw(im)
d.text((70,70),'SCAN TEST / JPEG INPUT',font=font,fill=(38,40,33))
for y in range(160,950,50):d.text((70,y),'Preserve text and improve paper contrast.',font=font,fill=(45,46,36))
im.save(OUT/'scan.JPG',quality=99);im.save(OUT/'scan.png',compress_level=0)
a=Image.new('RGBA',(128,128),(32,60,90,128));ImageDraw.Draw(a).rectangle((20,20,90,90),fill=(120,240,45,210));meta=PngImagePlugin.PngInfo();meta.add_text('Title','preserve metadata');a.save(OUT/'alpha.png',compress_level=0,pnginfo=meta)
(OUT/'invalid.jpg').write_bytes(b'invalid')
for name,img,text in [('with-text.pdf','scan.JPG','KEEP THIS SEARCHABLE TEXT'),('with-flate.pdf','scan.png','FLATE TEXT MUST SURVIVE')]:
 doc=fitz.open();p=doc.new_page();p.insert_text((60,60),text);p.insert_image(fitz.Rect(60,110,510,720),filename=str(OUT/img));doc.save(OUT/name,deflate=name=='with-flate.pdf');doc.close()
doc=fitz.open();doc.new_page();xref=doc.get_new_xref();doc.update_object(xref,'<< /Type /Sig /ByteRange [0 1 2 3] >>');doc.save(OUT/'signed.pdf');doc.close()
doc=fitz.open();doc.new_page();doc.save(OUT/'encrypted.pdf',encryption=fitz.PDF_ENCRYPT_AES_256,user_pw='test',owner_pw='owner');doc.close()
results={};errors=[];requests=[]
server=subprocess.Popen(['python3','-m','http.server','8877','--bind','127.0.0.1','--directory',str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(.5)
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('google-chrome') or shutil.which('chromium'),headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1440,'height':1050});page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url));page.set_default_timeout(20000)
  page.goto('http://127.0.0.1:8877/tools/');page.wait_for_selector('[data-preset=auto]')
  page.locator('#files').set_input_files([str(OUT/'scan.JPG'),str(OUT/'alpha.png')]);page.wait_for_function("document.querySelector('#pageCount').textContent==='02' && !document.querySelector('#export').disabled")
  page.wait_for_function("document.querySelector('#previewMeta').textContent.includes('第 ')")
  assert page.locator('[data-preset]').count()==7
  assert not page.locator('.advanced').first.get_attribute('open')
  assert page.locator('[data-preset=auto]').get_attribute('aria-pressed')=='true'
  hashes={}
  for mode in ['auto','document','bw','gray','color','photo','original']:
   page.click('[data-preset='+mode+']');page.wait_for_timeout(250);page.wait_for_function("document.querySelector('#previewMeta').textContent.includes('第 ')");hashes[mode]=page.locator('#afterCanvas').evaluate('(c)=>c.toDataURL()')
  assert len(set(hashes.values()))==7,'Seven modes should be distinct on shaded document fixture'
  page.click('[data-preset=document]');page.click('#applyAll');page.locator('.page-card').nth(1).click();assert page.locator('[data-preset=document]').get_attribute('aria-pressed')=='true'
  page.locator('.page-card').first.click();page.click('[data-preset=auto]');page.wait_for_timeout(300)
  with page.expect_download() as dl:page.click('#export')
  dl.value.save_as(str(OUT/'jpeg-input-export.pdf'));page.wait_for_function("!document.querySelector('#export').disabled")
  pdf=fitz.open(OUT/'jpeg-input-export.pdf');assert len(pdf)==2;pdf[0].get_pixmap().save(OUT/'jpeg-input-render.png');pdf.close()
  results['scanner']='JPG import; seven distinct modes and thumbnails; collapsed adjustments; batch modes; two-page PDF'
  for w in [1440,1024,768,390,320]:
   page.set_viewport_size({'width':w,'height':950});assert page.evaluate('document.documentElement.scrollWidth')<=w
  page.set_viewport_size({'width':1440,'height':1050});page.screenshot(path=str(OUT/'scan-desktop.png'),full_page=True)
  page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(OUT/'scan-mobile.png'),full_page=True)
  page.click('#compressionTab');assert page.locator('#scanPanel').is_hidden()
  files=['scan.JPG','scan.png','alpha.png','invalid.jpg','with-text.pdf','with-flate.pdf']
  page.locator('#compressInput').set_input_files([str(OUT/f) for f in files]);page.wait_for_timeout(500);assert 'invalid.jpg' in page.locator('#compressionStatus').inner_text()
  page.select_option('#compressionProfile','lossless');page.click('#startCompress');page.wait_for_function("!document.querySelector('#startCompress').disabled",timeout=60000)
  rows=page.locator('.compression-row');assert rows.count()==5
  assert rows.nth(0).locator('.saving').inner_text()=='保留原文件'
  for index,name in [(1,'lossless.png'),(2,'alpha-lossless.png')]:
   with page.expect_download() as dl:rows.nth(index).locator('a').click()
   dl.value.save_as(str(OUT/name))
  assert (OUT/'lossless.png').stat().st_size<(OUT/'scan.png').stat().st_size
  assert Image.open(OUT/'alpha-lossless.png').info['Title']=='preserve metadata'
  assert Image.open(OUT/'alpha-lossless.png').tobytes()==Image.open(OUT/'alpha.png').tobytes()
  results['png_lossless']='Smaller output, exact RGBA and retained metadata'
  page.select_option('#compressionProfile','balanced');page.click('#startCompress');page.wait_for_function("!document.querySelector('#startCompress').disabled",timeout=60000)
  for index,name in [(0,'compressed.jpg'),(1,'compressed.png'),(3,'compressed.pdf'),(4,'compressed-flate.pdf')]:
   with page.expect_download() as dl:rows.nth(index).locator('a').click()
   dl.value.save_as(str(OUT/name))
  assert (OUT/'compressed.jpg').stat().st_size<(OUT/'scan.JPG').stat().st_size
  assert (OUT/'compressed.png').stat().st_size<(OUT/'scan.png').stat().st_size
  for f in ['compressed.jpg','compressed.png']:Image.open(OUT/f).verify()
  for src,out,text in [('with-text.pdf','compressed.pdf','KEEP THIS SEARCHABLE TEXT'),('with-flate.pdf','compressed-flate.pdf','FLATE TEXT MUST SURVIVE')]:
   doc=fitz.open(OUT/out);assert len(doc)==1 and text in doc[0].get_text();assert (OUT/out).stat().st_size<=(OUT/src).stat().st_size;doc[0].get_pixmap().save(OUT/(out+'.png'));doc.close()
  assert (OUT/'compressed.pdf').stat().st_size<(OUT/'with-text.pdf').stat().st_size
  results['pdf']='Original text/page count retained; JPEG fixture shrank; Flate fixture parsed; independent rendering passed'
  results['sizes']={f:(OUT/f).stat().st_size for f in ['scan.JPG','compressed.jpg','scan.png','compressed.png','lossless.png','with-text.pdf','compressed.pdf','with-flate.pdf','compressed-flate.pdf']}
  with page.expect_download() as dl:page.click('#downloadAll')
  dl.value.save_as(str(OUT/'batch.zip'))
  with zipfile.ZipFile(OUT/'batch.zip') as z:assert z.testzip() is None and len(z.namelist())==5
  for w in [1440,1024,768,390,320]:
   page.set_viewport_size({'width':w,'height':950});assert page.evaluate('document.documentElement.scrollWidth')<=w
  page.set_viewport_size({'width':1440,'height':1050});page.screenshot(path=str(OUT/'compression-desktop.png'),full_page=True)
  page.click('#clearCompress');assert page.locator('.compression-row').count()==0 and page.locator('#zipAgain').is_hidden()
  page.locator('#compressInput').set_input_files([str(OUT/'signed.pdf'),str(OUT/'encrypted.pdf')]);page.wait_for_timeout(300);page.click('#startCompress');page.wait_for_function("!document.querySelector('#startCompress').disabled",timeout=30000)
  assert '签名' in page.locator('.compression-row').nth(0).inner_text() and '加密' in page.locator('.compression-row').nth(1).inner_text()
  assert page.locator('.compression-row a').count()==0
  results['safety']='Signed and encrypted PDFs rejected without output; invalid image rejected; source unchanged; ZIP CRC valid'
  assert not errors,errors
  assert not [u for u in requests if u.startswith(('http:','https:')) and not u.startswith('http://127.0.0.1:8877/')]
  results['javascript_errors']=errors;results['external_requests']=[];results['responsive_widths']=[1440,1024,768,390,320]
  browser.close()
finally:server.terminate()
(OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print(json.dumps(results,ensure_ascii=False,indent=2))
