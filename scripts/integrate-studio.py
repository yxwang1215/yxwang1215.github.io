"""Reconcile the two inspected tool updates without changing their engines."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def replace(path, old, new):
    p=ROOT/path;s=p.read_text()
    if new in s:return
    assert old in s,(path,old[:100])
    p.write_text(s.replace(old,new,1))
replace('tools/studio.mjs',"import {PDFWorkspace} from './pdf-workspace.mjs';", "import {PDFWorkspace} from './pdf-workspace.mjs';\nimport {analyzePixels, settingsForMode} from './png-to-pdf/modes.mjs';\nimport {installCompressionControls} from './studio-compression.mjs';")
replace('tools/studio-utils.mjs',"  bw: {label: '黑白扫描'", "  photo: {label: '照片增强', mode: 'color', clean: 0, sharpen: 32, contrast: 8, brightness: 0, threshold: 12},\n  bw: {label: '黑白扫描'")
replace('tools/studio.mjs',"const page={id:uid(),name:file.name", "const stats=analyzePixels(c.getContext('2d').getImageData(0,0,w,h).data);\n      const page={id:uid(),stats,name:file.name")
replace('tools/studio.mjs',"preset:'auto',settings:{...PRESETS.auto}", "preset:'auto',settings:settingsForMode(stats,'auto')")
replace('tools/studio.mjs',"page.preset=key;page.settings={...p};", "page.preset=key;page.settings=settingsForMode(page.stats,key==='paper'?'document':key);")
replace('tools/studio.mjs',"processPixels(img.data,w,h,settings)","processPixels(img.data,w,h,settingsForMode(current()?.stats,key==='paper'?'document':key))")
replace('tools/studio.mjs',"page.settings={...p.settings};page.preset=p.preset;", "page.settings=p.preset==='custom'?{...p.settings}:settingsForMode(page.stats,p.preset==='paper'?'document':p.preset);page.preset=p.preset;")
replace('tools/studio.mjs',"new ResizeObserver(()=>fitPreview()).observe($('imageStage'));", "installCompressionControls({getFiles:mode=>mode==='image'?(current()?[current().file]:[]):[...new Set(pdf.targets().map(p=>p.source))].map(id=>pdf.sources.get(id).file),runJob,saveBlob,toast,isCanceled:()=>s.cancel});\nnew ResizeObserver(()=>fitPreview()).observe($('imageStage'));")
links=''.join(f'<a class="btn small" href="./{route}/">{label}</a>' for route,label in [('merge-pdf','PDF 合并'),('mixed-to-pdf','混合合并'),('split-pdf','PDF 拆分'),('extract-pdf','提取页面'),('organize-pdf','页面整理'),('png-to-pdf-simple','无损 PNG'),('png-to-pdf','扫描兼容入口')])
compat='<details id="compatibilityRoutes"><summary>兼容入口</summary><p class="helper">旧链接继续保留；日常处理可直接使用当前统一工作区。</p><div style="display:flex;flex-wrap:wrap;gap:8px">'+links+'</div></details>'
replace('tools/index.html','<footer><button class="btn" data-close="helpDialog">',compat+'<footer><button class="btn" data-close="helpDialog">')
p=ROOT/'tests/browser_check.py';s=p.read_text()
s=s.replace('import json, zipfile, fitz, os, re','import json, zipfile, fitz, os, re, time')
if 'def wait_js(' not in s:
    s=s.replace(' errors=[];', ''' def wait_js(expression, timeout=30000):
  deadline=time.monotonic()+timeout/1000
  while time.monotonic()<deadline:
   if page.evaluate("() => ("+expression+")"):return
   page.wait_for_timeout(80)
  raise AssertionError("Timed out: "+expression+"; toast="+page.locator('#toast').inner_text())
 errors=[];''')
s=s.replace('page.wait_for_function(', 'wait_js(')
s=s.replace("'six preset controls',page.locator('.preset').count()==6", "'seven adaptive preset controls',page.locator('.preset').count()==7")
s=s.replace("'real preset thumbnails',page.locator('.preset-thumb canvas').count()==6", "'real preset thumbnails',page.locator('.preset-thumb canvas').count()==7")
s=s.replace("['png-to-pdf/core.mjs','studio-utils.mjs','pdf-workspace.mjs','studio.mjs']", "['png-to-pdf/core.mjs','studio-utils.mjs','png-to-pdf/modes.mjs','studio-compression.mjs','pdf-workspace.mjs','studio.mjs']")
if 'import atexit' not in s:
    s=s.replace('checks=[]', '''import atexit
checks=[];errors=[]
atexit.register(lambda:(OUT/'checks.json').write_text(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2)))''')
anchor=" page.click('[data-workspace=\"pdf\"]');record('PDF workspace switch'"
if "original JPEG compression real download" not in s:
    s=s.replace(anchor,''' if not os.environ.get('STUDIO_IN_MEMORY'):
  page.click('[data-tool="compress"]');page.locator('#imageOriginalCompression summary').click()
  with page.expect_download() as d:page.click('#imageCompressOriginal')
  d.value.save_as(str(OUT/'compressed-original.jpg'));wait_js('document.querySelector("#progressWrap").hidden')
  record('original JPEG compression real download',(OUT/'compressed-original.jpg').stat().st_size>100)
'''+anchor)
anchor="  page.click('[data-tool=\"pdfcompress\"]');page.check('#rasterPdf')"
if "original PDF optimization retains all source pages and text" not in s:
    s=s.replace(anchor,'''  page.click('[data-tool="pdfcompress"]');page.locator('#pdfOriginalCompression summary').click();page.select_option('#pdfCompressionProfile','lossless')
  with page.expect_download() as d:page.click('#pdfCompressOriginal')
  d.value.save_as(str(OUT/'original-optimized.pdf'));wait_js('document.querySelector("#progressWrap").hidden')
  optimized=fitz.open(OUT/'original-optimized.pdf');record('original PDF optimization retains all source pages and text',len(optimized)==3 and 'PAGE 1' in optimized[0].get_text());optimized.close()
'''+anchor)
s=s.replace("page.wait_for_timeout(600);page.screenshot(path=str(OUT/'desktop-final.png'))", "page.wait_for_timeout(600);page.evaluate(\"() => document.querySelector('#toast').hidden=true\");page.screenshot(path=str(OUT/'desktop-final.png'))")
p.write_text(s)
(ROOT/'.github/workflows/tools-quality.yml').write_text((ROOT/'scripts/studio-quality.yml').read_text())
