from pathlib import Path
root=Path(__file__).resolve().parents[2]/'tools'
# Preserve the live converter, including its previously added PaperScan banner.
if not (root/'png-to-pdf-simple/index.html').exists():
    old=(root/'index.html').read_text()
    for oldpath,newpath in [('./tools.css','../tools.css'),('./pdf-engine.js','../pdf-engine.js'),('./app.js','../app.js'),('./png-to-pdf/','../png-to-pdf/')]:old=old.replace(oldpath,newpath)
    old=old.replace('href="./" aria-current="page"','href="../"')
    (root/'png-to-pdf-simple').mkdir(exist_ok=True)
    (root/'png-to-pdf-simple/index.html').write_text(old)
icons={
'join':'<path d="M5 5h7v10H5zM20 5h7v10h-7zM8 19v4h16v-4M16 23v5"/>',
'mixed':'<path d="M3 5h12v15H3zM5 16l3-4 5 5M18 10h10v17H18zM21 15h4M21 19h4"/><circle cx="7" cy="9" r="1"/>',
'split':'<path d="M11 3h10v9H11zM16 12v6M6 18h20M6 18v4M26 18v4M2 22h8v8H2zM22 22h8v8h-8z"/>',
'extract':'<path d="M4 4h14v23H4zM8 9h6M8 14h6M16 20h13m-4-4 4 4-4 4"/>',
'organize':'<path d="M4 4h9v9H4zM19 4h9v9h-9zM4 19h9v9H4zM21 23h7m-3-3 3 3-3 3"/>',
'image':'<path d="M5 3h15l7 7v20H5zM20 3v8h7M9 24l5-6 5 5 3-3"/><circle cx="12" cy="13" r="2"/>',
'scan':'<path d="M10 4H4v6m18-6h6v6M4 22v6h6m18-6v6h-6M2 16h28M10 10h12M10 22h12"/>'}
def svg(name):return '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>'
routes=[('mixed-to-pdf','mixed','图片 + PDF 合并','PNG + PDF → PDF','把图片、扫描件和已有 PDF，按顺序合为一份文档。','混合编排 · 支持选页','mixed'),('merge-pdf','merge','PDF 合并','PDF + PDF → PDF','组合多份 PDF，保留原页面文字、矢量图与尺寸。','自由排序 · 逐文件选页','join'),('split-pdf','split','PDF 拆分','PDF → PDFs','逐页拆分、固定页数分组，或按自定义范围拆分。','多份结果 · ZIP 打包','split'),('extract-pdf','extract','提取 PDF 页面','SELECT → PDF','选出需要的页面，按指定顺序导出新的 PDF。','页码范围 · 支持倒序','extract'),('organize-pdf','organize','PDF 页面整理','REORDER · ROTATE','按页调整顺序、旋转方向，移除不需要的页面。','页码卡片 · 原文件不变','organize')]
head='''<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; worker-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'">
<meta name="referrer" content="no-referrer"><meta name="theme-color" content="#f7f8f3">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23395143'/%3E%3Cpath d='M19 14h18l10 10v27H19z' fill='none' stroke='white' stroke-width='3'/%3E%3C/svg%3E">'''
def header(back):return f'''<a class="skip-link" href="#main">跳转到主要内容</a><header class="site-header"><div class="header-inner"><a class="brand" href="/"><span class="brand-mark">YW</span><span>Yuxuan Wang<small>PERSONAL TOOLKIT</small></span></a><nav aria-label="主导航"><a href="/">个人主页 ↗</a><a class="active" href="{back}">Tools</a><a href="#privacy">隐私说明</a></nav></div></header>'''
footer='''<footer><span>Yuxuan Wang <b>·</b> Small tools, less friction.</span><a href="/">返回个人主页 ↗</a></footer>'''
nav='<nav class="tool-nav" aria-label="文件工具">'+''.join(f'<a href="../{r}/" data-mode-link="{m}">{t}</a>' for r,m,t,*_ in routes)+'</nav>'
for route,mode,title,eyebrow,desc,tag,icon in routes:
 folder=root/route;folder.mkdir(exist_ok=True)
 html=f'''<!doctype html><html lang="zh-CN"><head>{head}
<title>{title} · Yuxuan Wang Tools</title><meta name="description" content="{desc}文件在浏览器本地处理，无需上传。">
<link rel="stylesheet" href="../toolkit.css"><script defer src="../pdf-kit/core.js"></script><script defer data-workbench src="../pdf-kit/app.js"></script>
</head><body data-tool="{mode}">{header('../')}<main class="shell" id="main">
<div class="breadcrumbs"><a href="../">全部工具</a><span>/</span>{title}</div>{nav}
<section class="tool-hero"><div><p class="eyebrow">{eyebrow}</p><h1 id="tool-title">{title}</h1><p id="tool-description">{desc}</p></div><div class="hero-icon">{svg(icon)}</div></section>
<div class="privacy-strip"><span class="green-dot"></span>仅本地处理<span>不上传文件 · 无需登录 · 无水印</span></div>
<noscript><p class="notice error">请启用 JavaScript。所有文件在浏览器中处理。</p></noscript>
<div class="workbench" id="workspace"><section class="work-panel" aria-labelledby="source-heading">
<div class="section-title"><h2 id="source-heading"><span>01</span> 添加与整理</h2><small id="file-count">0 个文件</small></div>
<div id="drop-zone" class="drop-zone" role="group" aria-label="拖放文件区域"><div class="drop-icon">{svg(icon)}</div><h3 id="drop-title">把文件拖到这里</h3><p>文件只会被本地读取，不会上传服务器</p><button id="choose" type="button" class="button primary">选择文件</button><input id="file-input" class="visually-hidden" type="file" accept="application/pdf,.pdf" tabindex="-1" aria-label="选择文件"><small>PDF 单份 50 MiB · PNG 单张 25 MiB · 合计 150 MiB / 500 页</small></div>
<div class="queue-toolbar"><strong>文件列表</strong><div><button type="button" class="text-button" id="sort">按名称排序</button><button type="button" class="text-button danger" id="clear">清空</button></div></div>
<p class="hint" id="queue-hint"></p><div class="empty-state" id="empty"><span>＋</span><p>从一份文件开始</p><small>完成添加后，在右侧设置输出方式。</small></div><ol id="files" class="source-list" aria-label="文件顺序"></ol>
<section id="page-section" hidden><div class="page-toolbar"><strong>页面顺序</strong><div><button type="button" id="select-all">全选</button><button type="button" id="select-none">全不选</button><button type="button" id="invert">反选</button><button type="button" id="rotate-all">全部旋转</button><button type="button" id="reset-pages">重置</button></div></div><p class="hint">以下为页码卡片，不是内容预览。拖动或用箭头排序；取消勾选表示不导出该页。可点击上方「打开原文件」核对内容。</p><ol id="page-grid" class="page-grid" aria-label="页面顺序与保留状态"></ol></section>
<div id="notice" class="notice" role="status" aria-live="polite" hidden></div>
</section><aside class="settings-panel" aria-labelledby="output-heading"><div class="section-title"><h2 id="output-heading"><span>02</span> 输出设置</h2><small>EXPORT</small></div>
<fieldset id="options"><legend class="visually-hidden">输出选项</legend>
<section data-modes="mixed"><label class="field-label" for="paper">新插入图片的页面尺寸</label><select id="paper"><option value="a4">A4 · 自动横纵向</option><option value="letter">US Letter · 自动横纵向</option><option value="image">跟随图片尺寸</option></select><div class="field-row"><div><label class="field-label" for="margin">图片边距</label><select id="margin"><option value="0">无边距</option><option value="5">5 mm</option><option value="10" selected>10 mm</option><option value="20">20 mm</option></select></div><div><label class="field-label" for="dpi">图片 DPI</label><select id="dpi"><option value="96">96 DPI</option><option value="150">150 DPI</option><option value="300">300 DPI</option></select></div></div><p class="hint">仅影响 PNG 页面。原 PDF 的页面尺寸与内容保持不变；PNG 保留像素与透明度。</p></section>
<section data-modes="split"><label class="field-label" for="split-mode">拆分方式</label><select id="split-mode"><option value="each">每页一个 PDF</option><option value="chunks">每 N 页一个 PDF</option><option value="custom">自定义分组范围</option></select><div class="field-space" id="chunk-wrap" hidden><label class="field-label" for="chunk">每份页数</label><input type="number" id="chunk" min="1" max="500" step="1" value="2"></div><div class="field-space" id="split-ranges-wrap" hidden><label class="field-label" for="split-ranges">用分号分隔每份文件</label><textarea id="split-ranges" rows="3" maxlength="4000" placeholder="1-3;4-6;7,9"></textarea><p class="hint">例如 1-3;4-6 会得到两份 PDF。每组可以用逗号选页，也支持倒序。</p></div><p class="hint">一份结果直接下载 PDF；多份结果自动打包为 ZIP，避免逐个下载被浏览器拦截。</p></section>
<section data-modes="extract"><label class="field-label" for="extract-range">需要提取的页码</label><textarea id="extract-range" rows="3" maxlength="4000" placeholder="例如 1-3,5,8-6"></textarea><p class="hint">页码从 1 开始。逗号连接页面，短横线表示范围；支持倒序和重复页，留空提取全部。</p></section>
<section data-modes="merge"><div class="setting-card"><strong>按文件顺序合并</strong><p>在左侧排列文件，并为每个 PDF 指定需要的页码。没有指定页码时取全部页面。</p></div></section>
<section data-modes="organize"><div class="setting-card"><strong>按左侧卡片顺序导出</strong><p>只导出勾选的页面。旋转角度会叠加在原页面方向上，不会重新压缩页面内容。</p></div></section>
<label class="field-label field-space" for="filename">输出文件名</label><input id="filename" type="text" value="document" maxlength="80" autocomplete="off" spellcheck="false"><p class="hint">自动添加 .pdf 或 .zip 后缀。</p>
</fieldset>
<div class="export-area"><div class="export-meta"><span id="summary">等待添加文件</span><span id="input-size">0 KiB</span></div><p id="validation" class="validation" role="status" hidden></p><button type="button" class="button primary export-button" id="export" disabled>生成并下载</button><div id="busy-area" hidden><progress id="progress" max="100" value="0" aria-label="处理进度"></progress><div class="progress-row"><span id="progress-label"></span><button type="button" id="cancel" class="text-button">取消</button></div></div><div id="result" class="result" hidden><strong>文件已就绪</strong><p id="result-meta"></p><a id="download" class="button">下载结果 ↓</a></div><p class="local-note">文件始终留在你的设备上。</p></div>
</aside></div>
<section class="notes" id="privacy"><article><span>01 / LOCAL FIRST</span><h3>文件不会上传</h3><p>工具和 PDF 组件从本站加载。文件仅在浏览器内存中处理，不写入账号或云端；刷新页面会清空未下载的任务。</p></article><article><span>02 / CONTENT, NOT SCREENSHOTS</span><h3>保留页面内容</h3><p>直接复制 PDF 页面中的文字、矢量图与图片，不将页面截图重建。文档级书签、附件、元数据和跨页链接不保证保留。</p></article><article><span>03 / KNOW THE LIMITS</span><h3>普通 PDF 优先</h3><p>暂不支持加密 PDF、交互表单、签名字段及动态 PNG。最多 50 个文件、500 页；输出合计限 200 MiB。手机建议少量分批处理。</p></article></section>{footer}</main></body></html>'''
 (folder/'index.html').write_text(html)
# Hub with real route links, no JS needed.
cards=''
allcards=[*routes,('png-to-pdf','scan','PaperScan 扫描增强','IMAGE → SCAN','文字锐化、纸张去灰、黑白扫描与裁剪，整理拍照资料。','原有工具 · 路径保持不变','scan'),('png-to-pdf-simple','image','PNG 转 PDF','PNG → PDF','将一张或多张 PNG 转成 PDF，保持图片清晰与透明度。','原有简易版 · 轻量转换','image')]
for i,(route,mode,title,label,desc,tag,icon) in enumerate(allcards,1):
 cards+=f'''<a class="tool-card {'featured' if i==1 else ''}" href="./{route}/"><div class="card-top"><span class="card-icon">{svg(icon)}</span><span class="card-index">{i:02}</span></div><p class="card-label">{label}</p><h2>{title}<span>↗</span></h2><p class="card-desc">{desc}</p><div class="card-foot">{tag}<span>打开工具 →</span></div></a>'''
hub=f'''<!doctype html><html lang="zh-CN"><head>{head}<title>Tools · Yuxuan Wang</title><meta name="description" content="本地文件工具箱：PNG 与 PDF 混合合并、PDF 合并、拆分、页面提取与整理、PNG 转 PDF 及扫描增强。无需上传文件。"><link rel="stylesheet" href="./toolkit.css"></head><body>{header('./')}<main class="shell" id="main"><section class="hub-hero"><div><p class="eyebrow">SMALL TOOLS, LESS FRICTION <span>/ PERSONAL TOOLKIT</span></p><h1>文件处理，<br>简单一点<span class="accent">。</span></h1><p>合并、拆分、整理，给零散的文件一个清晰的顺序。<br>不必上传到陌生服务器，在浏览器里就能完成。</p><div class="hub-badges"><span><i class="green-dot"></i> 本地处理</span><span>无需注册</span><span>无水印</span></div></div><aside class="hub-note"><span>LESS UPLOADING.<br>MORE GETTING THINGS DONE.</span><strong>07<span> / tools</span></strong><p>小工具，解决具体问题。<br>为日常与科研工作而做。</p></aside></section><div class="catalog-heading"><h2>文件工具箱 <span>07</span></h2><p>选择你现在需要做的事</p></div><section class="tool-grid" aria-label="文件处理工具">{cards}</section><section class="hub-bottom" id="privacy"><div><span class="eyebrow">PRIVATE BY DESIGN</span><h2>你的文件，留在你的设备。</h2><p>本站提供网页与处理组件；图片和 PDF 不会上传，也不会保存在服务器。刷新或关闭页面前，记得下载结果。大文件建议在电脑上分批处理。</p></div><div class="hub-quiet"><strong>不改变原文件</strong><p>每次操作都生成新的结果文件。<br>原始资料由你保管。</p></div></section>{footer}</main></body></html>'''
(root/'index.html').write_text(hub)
