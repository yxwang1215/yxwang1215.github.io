"""One-time migration. Generated source files are committed and maintained normally."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]
if 'id="compressionPanel"' in (p/'tools/index.html').read_text():
    print('Unified tools already generated'); raise SystemExit(0)
app=p/'tools/png-to-pdf/app.mjs';s=app.read_text()
a=s.index('const presets =');b=s.index('const state =',a)
s=s[:a]+"import {SCAN_MODES, analyzePixels, settingsForMode} from './modes.mjs';\n"+s[b:]
s=s.replace("document.querySelectorAll('button,input,select')", "document.querySelectorAll('#scanPanel button,#scanPanel input,#scanPanel select,.tool-tabs button')")
s=s.replace('presets.color', "settingsForMode(null,'auto')").replace('presets.original',"settingsForMode(null,'original')")
s=s.replace("el.dataset.preset === s.mode", "el.dataset.preset === s.preset")
s=s.replace("  refreshControls();\n}\nfunction renderQueue", "  $('modeSummary').textContent = s.preset === 'custom' ? '自定义参数 · 重新选择模式即可恢复自动设置' : (SCAN_MODES.find(m=>m.id===s.preset)?.hint || '');\n  renderModePreviews();\n  refreshControls();\n}\nfunction renderModePreviews() {\n  const p=current();\n  document.querySelectorAll('[data-preset] canvas').forEach(c=>{\n    if(!p?.modeThumbs) {c.getContext('2d').clearRect(0,0,c.width,c.height);return;}\n    const im=p.modeThumbs[c.parentElement.dataset.preset];\n    c.width=im.width;c.height=im.height;c.getContext('2d').putImageData(im,0,0);\n  });\n}\nfunction renderQueue")
s=s.replace("state.pages.push(p); accepted.push(p.id); thumb.width = thumb.height = 1;", "const pixels=ctx.getImageData(0,0,w,h); p.stats=analyzePixels(pixels.data); p.settings=settingsForMode(p.stats,'auto');\n        p.modeThumbs=Object.fromEntries(SCAN_MODES.map(m=>[m.id,new ImageData(processPixels(pixels.data,w,h,settingsForMode(p.stats,m.id)),w,h)]));\n        state.pages.push(p); accepted.push(p.id); thumb.width = thumb.height = 1;")
s=s.replace("current().settings = {...presets[el.dataset.preset]}", "current().settings = settingsForMode(current().stats,el.dataset.preset)")
s=s.replace("current().settings[el.dataset.setting] = Number(el.value);", "current().settings[el.dataset.setting] = Number(el.value); current().settings.preset='custom'; document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false')); $('modeSummary').textContent='自定义参数 · 重新选择模式即可恢复自动设置';")
s=s.replace("state.pages.forEach(p => p.settings = {...s}); notify(`已将增强参数应用到 ${state.pages.length} 页；裁剪和旋转保持各自设置。`)","state.pages.forEach(p => p.settings = s.preset==='custom' ? {...s} : settingsForMode(p.stats,s.preset)); notify(`已应用到 ${state.pages.length} 页；每页自动适配明暗，裁剪和旋转保持不变。`)")
s=s.replace("if (files.length && !state.busy)","if (files.length && !state.busy && !$('scanPanel').hidden)")
app.write_text(s)
s=(p/'tools/png-to-pdf/index.html').read_text()
s=s.replace('href="./style.css"','href="./png-to-pdf/style.css?v=20261016-3"').replace('src="./app.mjs"','src="./png-to-pdf/app.mjs?v=20261016-3"')
s=s.replace("connect-src 'none'", "connect-src 'self'")
s=s.replace('PaperScan · 图片转 PDF 与扫描增强 | Yuxuan Wang','PaperScan · 扫描、转换与文件压缩 | Yuxuan Wang')
s=s.replace('无第三方脚本','本地算法')
s=s.replace('图片转 PDF，加一点扫描质感。整理笔记、论文与手边的每份材料。','一键选择扫描模式，或压缩 PDF、PNG、JPG。所有处理均在你的设备上完成。')
s=s.replace('<section class="importbar"','<div class="tool-tabs" role="tablist" aria-label="工具切换"><button role="tab" aria-selected="true" aria-controls="scanPanel" id="scanTab" data-tool="scan">扫描与转换</button><button role="tab" aria-selected="false" aria-controls="compressionPanel" id="compressionTab" data-tool="compress">文件压缩 <small>PDF / PNG / JPG</small></button></div>\n<div id="scanPanel" role="tabpanel" aria-labelledby="scanTab"><section class="importbar"',1)
a=s.index('<div class="presets"');b=s.index('<div class="slider-field">',a)
modes=[('auto','自动增强','自动判断明暗与底色'),('document','文档净白','文字与纸张清理'),('bw','黑白扫描','打印与文字材料'),('gray','柔和灰度','保留灰阶层次'),('color','彩色保真','图表、印章与证件'),('photo','照片增强','照片与日常记录'),('original','原图','不做扫描增强')]
s=s[:a]+'<div class="presets mode-grid" role="group" aria-label="一键扫描模式">'+''.join(f'<button data-preset="{id}" aria-pressed="{str(id=="auto").lower()}" title="{hint}" data-doc><canvas width="68" height="86" aria-hidden="true"></canvas><strong>{name}</strong><small>{hint}</small></button>' for id,name,hint in modes)+'</div><p id="modeSummary" class="mode-summary">自动判断明暗与纸张底色</p><button id="applyAll" class="button subtle full" data-doc>将当前模式应用到全部页面</button><details class="advanced"><summary>高级调整 <span>可选，无需手动设置</span></summary>'+s[b:]
s=s.replace('<button id="applyAll" class="button subtle full" data-doc>将增强参数应用到全部页面</button>', '</details>')
s=s.replace('<section class="bottom-info">','</div>\n'+(p/'scripts/compression-panel.html').read_text()+'\n<section class="bottom-info">')
s=s.replace('暂不支持 HEIC、TIFF、PDF 导入、OCR 或自动透视校正。','扫描区暂不支持 HEIC、TIFF、PDF 转图片、OCR 或自动透视校正。PDF 压缩请切换「文件压缩」。')
s=s.replace('href="https://github.com/yxwang1215/yxwang1215.github.io/tree/main/tools/png-to-pdf"','href="https://github.com/yxwang1215/yxwang1215.github.io/tree/main/tools"')
s=s.replace('局部亮度校正、文字边缘锐化与自适应黑白化。前后对比，按页微调，再批量导出。','七种一键模式，每页自动分析明暗。局部亮度校正、文字锐化与自适应黑白化，无需逐个调整参数。')
s=s.replace('<div id="pdfOptions">','<details class="advanced"><summary>导出选项 <span>纸张、尺寸与质量</span></summary><div id="pdfOptions">').replace('<button id="export"','</details><button id="export"')
s=s.replace('</head>','<link rel="stylesheet" href="./tools-extra.css?v=20261016-3"><script type="module" src="./compression/ui.mjs?v=20261016-3"></script>\n</head>')
(p/'tools/index.html').write_text(s)
(p/'tools/png-to-pdf/index.html').write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/tools/"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="canonical" href="https://yxwang1215.top/tools/"><title>PaperScan 已统一到 /tools/</title></head><body><p>工具已统一到 <a href="/tools/">/tools/，点击打开扫描与压缩工具</a>。</p></body></html>\n')
print('Generated unified /tools/, redirect and one-click scanner')
