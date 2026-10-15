from pathlib import Path
import json,io,zipfile,base64
from PIL import Image,ImageDraw,ImageFont
import fitz
from playwright.sync_api import sync_playwright
from scanner_offline_harness import mount
import tempfile,os,shutil
OUT=Path(os.environ.get('SCANNER_QA_OUTPUT',tempfile.mkdtemp(prefix='paperscan-qa-')));OUT.mkdir(parents=True,exist_ok=True)
FIX=OUT/'fixtures'; FIX.mkdir(exist_ok=True)
try:font=ImageFont.truetype('DejaVuSans.ttf',26)
except OSError:font=ImageFont.load_default(size=26)
im=Image.new('RGB',(800,1100),(205,205,195)); d=ImageDraw.Draw(im)
d.rectangle((70,70,730,1020),fill=(236,235,226));d.text((95,120),'PaperScan - verification',fill=(25,35,28),font=font)
for y in range(220,880,55):d.text((95,y),f'Test line {y} / clarity and order.',fill=(65,70,60),font=font)
formats=[('01-论文.png','PNG'),('02-photo.jpg','JPEG'),('03-image.webp','WEBP'),('04-image.bmp','BMP'),('05-first-frame.gif','GIF'),('06-image.avif','AVIF')]
for name,fmt in formats:im.save(FIX/name,format=fmt)
(FIX/'broken.png').write_bytes(b'not an image')
(FIX/'unsupported.heic').write_bytes(b'unsupported')
transparent=Image.new('RGBA',(400,300),(0,0,0,0));transparent.save(FIX/'transparent.png')
ex=Image.Exif();ex[274]=6;Image.new('RGB',(400,200),(190,180,170)).save(FIX/'orientation.jpg',exif=ex)
results={}; errors=[]; requests=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1100})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('request',lambda r:requests.append(r.url))
 mount(page)
 def ready():
  page.wait_for_function("!document.getElementById('export').disabled")
 def preview_ready():
  page.wait_for_function("document.getElementById('previewMeta').textContent.includes('第 ')")
 def export(fmt,path,encoding=None):
  ready();page.select_option('#format',fmt)
  if encoding:page.select_option('#encoding',encoding)
  with page.expect_download() as info:page.click('#export')
  info.value.save_as(str(path));ready()
 page.locator('#files').set_input_files([str(FIX/n) for n,f in formats]+[str(FIX/'broken.png'),str(FIX/'unsupported.heic')])
 page.wait_for_function("document.getElementById('pageCount').textContent==='06'")
 preview_ready();results['imports']=6
 assert 'broken.png' in page.locator('#issues').inner_text() and 'unsupported.heic' in page.locator('#issues').inner_text()
 results['invalid_inputs_isolated']=True
 for mode in ['original','color','gray','bw']:
  page.click(f'[data-preset={mode}]');page.wait_for_timeout(240);preview_ready()
  stats=page.evaluate("""() => { const c=document.getElementById('afterCanvas'),a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let colors=0, nonBinary=0;for(let i=0;i<a.length;i+=4){if(a[i]!==a[i+1]||a[i]!==a[i+2]) colors++; if(a[i]!==0&&a[i]!==255) nonBinary++;}return {colors,nonBinary};}""")
  if mode in ['gray','bw']: assert stats['colors']==0,(mode,stats)
  if mode=='bw':assert stats['nonBinary']==0
 results['four_pixel_modes']=True
 page.click('[data-preset=color]');page.click('#applyAll')
 export('pdf',OUT/'batch-jpeg.pdf','jpeg')
 export('pdf',OUT/'batch-lossless.pdf','lossless')
 for enc in ['jpeg','lossless']:
  pdf=fitz.open(OUT/f'batch-{enc}.pdf');assert len(pdf)==6
  for i,pg in enumerate(pdf):
   assert len(pg.get_images())==1
   assert abs(pg.rect.width-595.2756)<.01
   assert pg.get_images()[0][-1]==('DCTDecode' if enc=='jpeg' else 'FlateDecode')
  pdf[0].get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(OUT/f'batch-{enc}-render.png')
 results['pdf_pages_and_encodings']=True
 page.fill('#filename','输出-材料')
 for fmt,extension in [('png','png'),('jpeg','jpg'),('webp','webp')]:
  path=OUT/f'single.{extension}';export(fmt,path)
  out=Image.open(path);assert out.size==(800,1100);out.verify()
  assert page.locator('#lastDownload').get_attribute('download')==f'输出-材料.{extension}'
 results['png_jpg_webp_exports']=True
 for fmt in ['png','jpeg','webp']:
  export(f'zip-{fmt}',OUT/f'batch-{fmt}.zip')
  with zipfile.ZipFile(OUT/f'batch-{fmt}.zip') as z:
   assert len(z.infolist())==6 and z.testzip() is None
   assert z.namelist()[0].startswith('001-01-论文.')
   for name in z.namelist():Image.open(io.BytesIO(z.read(name))).verify()
 results['three_zip_formats_crc_unicode']=True
 page.click('#rotateRight');page.wait_for_timeout(200);preview_ready()
 assert page.evaluate("document.getElementById('afterCanvas').width > document.getElementById('afterCanvas').height")
 page.click('#crop');r=page.locator('#canvasFrame').bounding_box()
 page.mouse.move(r['x']+.1*r['width'],r['y']+.1*r['height']);page.mouse.down();page.mouse.move(r['x']+.8*r['width'],r['y']+.8*r['height'],steps=8);page.mouse.up();page.click('#applyCrop')
 page.wait_for_timeout(200);preview_ready();export('png',OUT/'cropped.png')
 crop=Image.open(OUT/'cropped.png');assert abs(crop.width-770)<=2 and abs(crop.height-560)<=2,crop.size
 page.click('#rotateLeft');page.wait_for_timeout(200);preview_ready();export('png',OUT/'crop-rotated.png')
 crop2=Image.open(OUT/'crop-rotated.png');assert abs(crop2.width-560)<=2 and abs(crop2.height-770)<=2,crop2.size
 page.click('#reset');page.wait_for_timeout(200);preview_ready();export('png',OUT/'reset.png');assert Image.open(OUT/'reset.png').size==(800,1100)
 results['crop_rotation_reset']=True
 first=page.locator('.page-card').first.get_attribute('aria-label');page.click('#moveDown');assert page.locator('.page-card').nth(1).get_attribute('aria-label').split('：')[1]==first.split('：')[1]
 page.click('#moveUp');assert page.locator('.page-card').first.get_attribute('aria-label')==first
 results['queue_reorder']=True
 page.click('[data-view=compare]');page.locator('#compare').fill('25');page.locator('#compare').dispatch_event('input');assert '25%' in page.locator('#afterCanvas').get_attribute('style')
 page.click('[data-view=original]');assert page.locator('#afterCanvas').is_hidden()
 page.click('[data-view=processed]');results['before_after_compare']=True
 page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide', {persisted: true})); window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted: true}));")
 page.click('[data-preset=gray]');page.wait_for_timeout(220);preview_ready();results['pagehide_does_not_break_worker']=True
 ready();page.select_option('#format','pdf');page.select_option('#encoding','lossless')
 downloads=[];page.on('download',lambda x:downloads.append(x));page.click('#export');page.wait_for_selector('#cancelExport',state='visible');page.click('#cancelExport');ready();assert not downloads
 results['cancellation_no_partial_download']=True
 page.locator('#files').set_input_files([str(FIX/'transparent.png'),str(FIX/'orientation.jpg')]);page.wait_for_function("document.getElementById('pageCount').textContent==='08'");ready()
 page.locator('.page-card').nth(6).click();page.wait_for_timeout(180);preview_ready();export('png',OUT/'transparent-export.png');a=Image.open(OUT/'transparent-export.png').convert('RGB');assert a.getpixel((10,10))==(255,255,255)
 page.locator('.page-card').nth(7).click();page.wait_for_timeout(180);preview_ready();export('png',OUT/'orientation-export.png');assert Image.open(OUT/'orientation-export.png').size==(200,400)
 results['alpha_and_exif_orientation']=True
 page.locator('.page-card').first.click();page.click('[data-preset=color]');page.wait_for_timeout(240);preview_ready()
 for width in [1440,1024,768,390,320]:
  page.set_viewport_size({'width':width,'height':950});page.wait_for_timeout(120)
  assert page.evaluate('document.body.scrollWidth')<=width,(width,page.evaluate('document.body.scrollWidth'))
 results['responsive_widths']=[1440,1024,768,390,320]
 page.set_viewport_size({'width':1440,'height':1100});page.wait_for_timeout(4800);page.screenshot(path=str(OUT/'final-desktop.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(OUT/'final-mobile.png'),full_page=True)
 page.click('#clear');page.click('#keepPages');assert page.locator('#pageCount').inner_text()=='08'
 page.click('#clear');page.click('#confirmClear');assert page.locator('#pageCount').inner_text()=='00';assert page.locator('#export').is_disabled()
 assert page.locator('#lastDownload').is_hidden() and page.locator('#lastDownload').get_attribute('href') is None
 results['clear_confirmation_and_output_cleanup']=True
 assert not errors,errors
 assert not [u for u in requests if u.startswith(('https:','http:'))],requests
 results['javascript_errors']=errors;results['external_requests']=[]
 b.close()
results['harness']='Offline Chromium DOM injection with native Blob Worker; managed environment blocks URL navigation. Actual static hosting, ESM URL resolution and production CSP are not browser-tested here.'
(OUT/'test-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
