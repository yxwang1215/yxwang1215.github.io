import {processPixels, fitSize, makePdf, makeZip, safeName} from './core.mjs';
const $ = id => document.getElementById(id);
import {SCAN_MODES, analyzePixels, settingsForMode} from './modes.mjs';
const state = {pages: [], selected: null, busy: false, exporting: false, cancel: false, sequence: 0, view: 'processed', cropping: false, cropBox: null, downloadUrl: null};
const current = () => state.pages.find(p => p.id === state.selected);
const mb = value => `${(value / 1048576).toFixed(1)} MB`;
const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
let toastTimer, previewTimer, previewCache = null, dragId = null, pointerStart = null, worker = null, job = 0;
const pending = new Map();
try {
  worker = new Worker(new URL('./worker.mjs', import.meta.url), {type: 'module'});
  worker.onmessage = ({data}) => {
    const handler = pending.get(data.id); if (!handler) return;
    pending.delete(data.id);
    if (data.error) handler.reject(new Error(data.error)); else handler.resolve(new Uint8ClampedArray(data.buffer));
  };
  worker.onerror = () => {
    worker?.terminate(); worker = null;
    for (const handler of pending.values()) handler.reject(new Error('图像处理线程中断，请重试。'));
    pending.clear();
  };
} catch { worker = null; }

function notify(text) {
  clearTimeout(toastTimer); $('toast').textContent = text; $('toast').hidden = false;
  toastTimer = setTimeout(() => $('toast').hidden = true, 4800);
}
function setBusy(value, exporting = false) {
  state.busy = value; state.exporting = value && exporting;
  document.querySelectorAll('#scanPanel button,#scanPanel input,#scanPanel select,.tool-tabs button').forEach(el => el.disabled = value);
  if (state.exporting) $('cancelExport').disabled = false;
  if (!value) refreshControls();
}
function refreshControls() {
  document.querySelectorAll('[data-doc]').forEach(el => el.disabled = state.busy || !current());
  $('moveUp').disabled = state.busy || state.pages.findIndex(p => p.id === state.selected) <= 0;
  $('moveDown').disabled = state.busy || !current() || state.pages.findIndex(p => p.id === state.selected) >= state.pages.length - 1;
  $('thresholdField').hidden = current()?.settings.mode !== 'bw';
  $('sharpen').disabled = state.busy || !current() || current().settings.mode === 'bw';
  const pdf = $('format').value === 'pdf', fit = $('paper').value === 'image';
  $('pdfOptions').hidden = !pdf;
  $('orientation').disabled = state.busy || fit;
  $('margin').disabled = state.busy || fit;
  $('quality').disabled = state.busy || $('format').value.endsWith('png') || (pdf && $('encoding').value === 'lossless');
  const type = $('format').value;
  $('exportLabel').textContent = pdf ? `导出 ${state.pages.length || ''} 页 PDF` : type.startsWith('zip') ? `打包 ${state.pages.length} 页 ZIP` : `导出当前页 ${type === 'jpeg' ? 'JPG' : type.toUpperCase()}`;
}
function syncSettings() {
  const s = current()?.settings || settingsForMode(null,'auto');
  for (const el of document.querySelectorAll('[data-setting]')) { el.value = s[el.dataset.setting]; $(`${el.id}Value`).textContent = el.value; }
  document.querySelectorAll('[data-preset]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.preset === s.preset)));
  $('modeSummary').textContent = s.preset === 'custom' ? '自定义参数 · 重新选择模式即可恢复自动设置' : (SCAN_MODES.find(m=>m.id===s.preset)?.hint || '');
  renderModePreviews();
  refreshControls();
}
function renderModePreviews() {
  const p=current();
  document.querySelectorAll('[data-preset] canvas').forEach(c=>{
    if(!p?.modeThumbs) {c.getContext('2d').clearRect(0,0,c.width,c.height);return;}
    const im=p.modeThumbs[c.parentElement.dataset.preset];
    c.width=im.width;c.height=im.height;c.getContext('2d').putImageData(im,0,0);
  });
}
function renderQueue() {
  const list = $('pageList'); list.replaceChildren();
  state.pages.forEach((p, index) => {
    const card = document.createElement('button'); card.type = 'button'; card.className = `page-card${p.id === state.selected ? ' selected' : ''}`;
    card.draggable = !state.busy; card.disabled = state.busy; card.setAttribute('aria-pressed', String(p.id === state.selected));
    card.setAttribute('aria-label', `第 ${index + 1} 页：${p.file.name}`);
    card.innerHTML = '<span class="page-number"></span><img alt=""><span class="page-name"></span><span class="page-size"></span>';
    card.querySelector('.page-number').textContent = String(index + 1).padStart(2, '0');
    card.querySelector('img').src = p.thumb;
    card.querySelector('.page-name').textContent = p.file.name;
    card.querySelector('.page-size').textContent = `${p.width} × ${p.height} · ${mb(p.file.size)}`;
    card.onclick = () => selectPage(p.id);
    card.ondragstart = e => { if (state.busy) { e.preventDefault(); return; } dragId = p.id; e.dataTransfer.setData('text/plain', p.id); e.dataTransfer.effectAllowed = 'move'; };
    card.ondragover = e => { if (dragId && !state.busy) {e.preventDefault(); e.dataTransfer.dropEffect = 'move';} };
    card.ondrop = e => {
      if (!dragId || state.busy) return;
      e.preventDefault(); e.stopPropagation();
      const from = state.pages.findIndex(item => item.id === dragId), to = state.pages.findIndex(item => item.id === p.id);
      if (from >= 0 && to >= 0) { const [moved] = state.pages.splice(from, 1); state.pages.splice(to, 0, moved); renderQueue(); }
      dragId = null;
    };
    card.ondragend = () => { dragId = null; };
    list.append(card);
  });
  $('pageCount').textContent = String(state.pages.length).padStart(2, '0');
  $('emptyList').hidden = !!state.pages.length;
  $('queueMeta').textContent = state.pages.length ? `${state.pages.length} 页 · ${mb(state.pages.reduce((n, p) => n + p.file.size, 0))} · 缩略图为原图` : '最多 50 页 · 单张 30 MB';
  refreshControls();
}
function selectPage(id) {
  if (state.busy) return;
  cancelCrop(); state.selected = id; previewCache = null; renderQueue(); syncSettings(); schedulePreview(0);
}
async function decode(file) {
  if ('createImageBitmap' in window) {
    try { return await createImageBitmap(file, {imageOrientation: 'from-image'}); } catch { /* Use browser image decoder as a fallback. */ }
  }
  const url = URL.createObjectURL(file), image = new Image();
  try {
    image.src = url; await image.decode();
    return {width: image.naturalWidth, height: image.naturalHeight, source: image, close() { URL.revokeObjectURL(url); }};
  } catch { URL.revokeObjectURL(url); throw new Error('无法解码图片；文件可能损坏，或当前浏览器不支持该格式。'); }
}
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
async function addFiles(files) {
  if (state.busy) return;
  const inputs = Array.from(files); if (!inputs.length) return;
  cancelCrop(); setBusy(true); const issues = [], accepted = [];
  try {
    for (const file of inputs) {
      if (state.pages.length >= 50) {issues.push('已达到 50 页上限，其余文件未导入。'); break;}
      if (!/\.(png|jpe?g|webp|bmp|gif|avif)$/i.test(file.name) && !/^image\/(png|jpeg|webp|bmp|gif|avif)$/.test(file.type)) {issues.push(`${file.name}：暂不支持此格式，请先转换为 PNG/JPG。`); continue;}
      if (file.type === 'image/svg+xml' || /\.(svg|html?)$/i.test(file.name)) {issues.push(`${file.name}：不接受矢量或网页文件。`); continue;}
      if (!file.size || file.size > 30 * 1048576) {issues.push(`${file.name}：文件为空或超过单张 30 MB。`); continue;}
      const total = state.pages.reduce((n, p) => n + p.file.size, 0);
      if (total + file.size > 150 * 1048576) {issues.push(`${file.name}：超过 150 MB 的总导入上限。`); continue;}
      let image;
      try {
        image = await decode(file);
        if (image.width * image.height > 40000000) throw new Error('超过单张 4000 万像素上限，请先缩小图片。');
        const [w, h] = fitSize(image.width, image.height, 170), thumb = canvas(w, h), ctx = thumb.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(image.source || image, 0, 0, w, h);
        const p = {id: (crypto.randomUUID?.() || Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16)).join('-')), file, width: image.width, height: image.height, thumb: thumb.toDataURL('image/jpeg', .65), rotation: 0, crop: {x: 0, y: 0, w: 1, h: 1}, settings: {...settingsForMode(null,'auto')}};
        const pixels=ctx.getImageData(0,0,w,h); p.stats=analyzePixels(pixels.data); p.settings=settingsForMode(p.stats,'auto');
        p.modeThumbs=Object.fromEntries(SCAN_MODES.map(m=>[m.id,new ImageData(processPixels(pixels.data,w,h,settingsForMode(p.stats,m.id)),w,h)]));
        state.pages.push(p); accepted.push(p.id); thumb.width = thumb.height = 1;
        if (/\.gif$/i.test(file.name) || file.type === 'image/gif') issues.push(`${file.name}：仅导入 GIF 首帧。`);
      } catch (error) { issues.push(`${file.name}：${error.message}`); }
      finally { image?.close(); }
      await nextFrame();
    }
  } finally {
    setBusy(false);
    $('issues').textContent = issues.join('\n'); $('issues').hidden = !issues.length;
    if (!state.selected && accepted.length) state.selected = accepted[0];
    renderQueue(); syncSettings(); schedulePreview(0);
    notify(accepted.length ? `已添加 ${accepted.length} 张图片，原文件不会被修改。` : '没有可导入的图片，请查看上方提示。');
    $('files').value = ''; $('cameraInput').value = '';
  }
}
async function sourceCanvas(page, maxSide) {
  const image = await decode(page.file);
  try {
    const turned = page.rotation % 180 !== 0, rw = turned ? image.height : image.width, rh = turned ? image.width : image.height;
    const crop = page.crop, cw = crop.w * rw, ch = crop.h * rh;
    const [w, h] = fitSize(cw, ch, maxSide), c = canvas(w, h), ctx = c.getContext('2d', {willReadFrequently: true});
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.scale(w / cw, h / ch); ctx.translate(-crop.x * rw, -crop.y * rh); ctx.translate(rw / 2, rh / 2); ctx.rotate(page.rotation * Math.PI / 180);
    ctx.drawImage(image.source || image, -image.width / 2, -image.height / 2); ctx.restore();
    return c;
  } finally { image.close(); }
}
async function filterCanvas(source, settings) {
  const ctx = source.getContext('2d', {willReadFrequently: true}), {width, height} = source;
  const image = ctx.getImageData(0, 0, width, height);
  let result;
  if (worker) {
    result = await new Promise((resolve, reject) => {
      const id = ++job; pending.set(id, {resolve, reject});
      worker.postMessage({id, buffer: image.data.buffer, width, height, settings}, [image.data.buffer]);
    });
  } else { await nextFrame(); result = processPixels(image.data, width, height, settings); }
  const output = canvas(width, height); output.getContext('2d').putImageData(new ImageData(result, width, height), 0, 0); return output;
}
function schedulePreview(delay = 140) {
  clearTimeout(previewTimer); state.sequence++;
  previewTimer = setTimeout(() => preview(), delay);
}
async function preview() {
  const p = current(), sequence = state.sequence;
  $('emptyPreview').hidden = !!p; $('canvasFrame').hidden = !p;
  if (!p) { $('previewMeta').textContent = '尚未添加图片'; previewCache = null; setView('processed'); return; }
  $('previewMeta').textContent = '正在处理预览…';
  try {
    const key = `${p.id}/${p.rotation}/${JSON.stringify(p.crop)}`;
    if (!previewCache || previewCache.key !== key) {
      const source = await sourceCanvas(p, 1100);
      if (sequence !== state.sequence) return;
      previewCache = {key, source};
    }
    const source = previewCache.source;
    const processed = await filterCanvas(source, {...p.settings});
    if (sequence !== state.sequence) return;
    for (const [id, src] of [['beforeCanvas', source], ['afterCanvas', processed]]) {
      $(id).width = src.width; $(id).height = src.height; $(id).getContext('2d').drawImage(src, 0, 0);
    }
    processed.width = processed.height = 1;
    $('previewMeta').textContent = `第 ${state.pages.indexOf(p) + 1} 页 · ${source.width} × ${source.height}`;
    $('previewNote').textContent = `源图 ${p.width} × ${p.height} px · 预览已缩小，导出重新处理源图。`;
    updateView();
  } catch (error) { if (sequence === state.sequence) { $('previewMeta').textContent = '预览未完成'; notify(error.message); } }
}
function setView(view) { state.view = view; updateView(); }
function updateView() {
  document.querySelectorAll('[data-view]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.view === state.view)));
  const compare = state.view === 'compare' && !!current() && !state.cropping, split = Number($('compare').value);
  $('afterCanvas').hidden = state.view === 'original';
  $('afterCanvas').style.clipPath = compare ? `inset(0 0 0 ${split}%)` : 'none';
  $('splitLine').hidden = !compare; $('splitLine').style.left = `${split}%`;
  $('compareControl').hidden = !compare;
}
function cancelCrop() {
  state.cropping = false; state.cropBox = null; pointerStart = null;
  $('cropSelection').hidden = true; $('cropHint').hidden = true; $('applyCrop').hidden = true; $('cancelCrop').hidden = true;
  $('canvasFrame').classList.remove('cropping'); $('crop').hidden = false; updateView();
}
function beginCrop() {
  if (!current() || state.busy || !$('beforeCanvas').width) return;
  state.cropping = true; state.cropBox = null; setView('processed');
  $('canvasFrame').classList.add('cropping'); $('cropHint').hidden = false; $('applyCrop').hidden = false; $('cancelCrop').hidden = false; $('crop').hidden = true;
  notify('在预览图片上拖动，框选需要保留的区域。');
}
function point(e) {
  const r = $('canvasFrame').getBoundingClientRect();
  return {x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))};
}
$('canvasFrame').addEventListener('pointerdown', e => {
  if (!state.cropping || state.busy) return;
  pointerStart = point(e); $('canvasFrame').setPointerCapture(e.pointerId); e.preventDefault();
});
$('canvasFrame').addEventListener('pointermove', e => {
  if (!pointerStart || !state.cropping) return;
  const p = point(e), x = Math.min(p.x, pointerStart.x), y = Math.min(p.y, pointerStart.y), w = Math.abs(p.x - pointerStart.x), h = Math.abs(p.y - pointerStart.y);
  state.cropBox = {x, y, w, h}; const selection = $('cropSelection'); selection.hidden = false;
  Object.assign(selection.style, {left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`});
});
$('canvasFrame').addEventListener('pointerup', () => { pointerStart = null; });
$('canvasFrame').addEventListener('pointercancel', () => { pointerStart = null; });
$('applyCrop').onclick = () => {
  const p = current(), box = state.cropBox;
  if (!p || !box || box.w < .02 || box.h < .02) return notify('请先框选一个足够大的区域。');
  const c = p.crop; p.crop = {x: c.x + box.x * c.w, y: c.y + box.y * c.h, w: box.w * c.w, h: box.h * c.h};
  cancelCrop(); previewCache = null; schedulePreview(0); notify('已裁剪；点击「重置」可恢复原图。');
};
$('crop').onclick = beginCrop; $('cancelCrop').onclick = cancelCrop;
function rotate(delta) {
  const p = current(); if (!p || state.busy) return;
  cancelCrop(); p.rotation = (p.rotation + delta + 360) % 360;
  // Convert the normalized crop into the newly rotated coordinate system.
  const c = p.crop;
  p.crop = delta > 0 ? {x: 1 - c.y - c.h, y: c.x, w: c.h, h: c.w} : {x: c.y, y: 1 - c.x - c.w, w: c.h, h: c.w};
  previewCache = null; schedulePreview(0);
}
function move(delta) {
  if (state.busy) return;
  const index = state.pages.findIndex(p => p.id === state.selected), next = index + delta;
  if (index < 0 || next < 0 || next >= state.pages.length) return;
  [state.pages[index], state.pages[next]] = [state.pages[next], state.pages[index]];
  renderQueue(); schedulePreview(0);
}
function toBlob(c, type, quality) {
  return new Promise((resolve, reject) => c.toBlob(blob => {
    if (!blob) reject(new Error('图像编码失败；请减小导出尺寸。'));
    else if (blob.type !== type) reject(new Error(`当前浏览器不支持 ${type.replace('image/', '').toUpperCase()} 导出，请选择 PNG/JPG。`));
    else resolve(blob);
  }, type, quality));
}
async function pdfImage(c, encoding, quality) {
  if (encoding !== 'lossless') return {width: c.width, height: c.height, data: await toBlob(c, 'image/jpeg', quality), filter: 'DCTDecode'};
  if (!('CompressionStream' in window)) throw new Error('当前浏览器不支持无损 PDF，请改用 JPEG 编码。');
  const rgba = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, rgb = new Uint8Array(c.width * c.height * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4) { rgb[j++] = rgba[i]; rgb[j++] = rgba[i + 1]; rgb[j++] = rgba[i + 2]; }
  const data = await new Response(new Blob([rgb]).stream().pipeThrough(new CompressionStream('deflate'))).blob();
  return {width: c.width, height: c.height, data, filter: 'FlateDecode'};
}
function save(blob, name) {
  if (state.downloadUrl) URL.revokeObjectURL(state.downloadUrl);
  state.downloadUrl = URL.createObjectURL(blob);
  const link = $('lastDownload'); link.href = state.downloadUrl; link.download = name; link.hidden = false;
  link.textContent = `再次保存：${name}（${mb(blob.size)}）`;
  link.click();
}
async function exportFiles() {
  if (!current() || state.busy) return;
  cancelCrop(); clearTimeout(previewTimer); state.sequence++;
  const format = $('format').value, isPdf = format === 'pdf', isZip = format.startsWith('zip-'), imageFormat = isZip ? format.slice(4) : format;
  const pages = (isPdf || isZip ? state.pages : [current()]).map(p => ({...p, crop: {...p.crop}, settings: {...p.settings}}));
  const resolution = Number($('resolution').value), quality = Number($('quality').value), encoding = $('encoding').value;
  const layout = {paper: $('paper').value, orientation: $('orientation').value, margin: Number($('margin').value)};
  const name = safeName($('filename').value), outputs = [];
  state.cancel = false; setBusy(true, true); $('exportStatus').hidden = false; $('progress').value = 0;
  let total = 0;
  try {
    for (let i = 0; i < pages.length; i++) {
      if (state.cancel) throw new Error('已取消导出，未保存不完整文件。');
      $('progressText').textContent = `正在处理 ${i + 1} / ${pages.length} 页…`;
      await nextFrame();
      let source, output;
      try {
        source = await sourceCanvas(pages[i], resolution);
        output = await filterCanvas(source, pages[i].settings);
        if (state.cancel) throw new Error('已取消导出，未保存不完整文件。');
        const encoded = isPdf ? await pdfImage(output, encoding, quality) : await toBlob(output, `image/${imageFormat}`, quality);
        const data = isPdf ? encoded.data : encoded;
        total += data.size;
        if (total > 150 * 1048576) throw new Error('导出结果超过 150 MB，请降低分辨率或分批导出。');
        outputs.push(isPdf ? encoded : {name: `${String(i + 1).padStart(3, '0')}-${safeName(pages[i].file.name)}.${imageFormat === 'jpeg' ? 'jpg' : imageFormat}`, data});
      } finally {
        if (source) source.width = source.height = 1;
        if (output) output.width = output.height = 1;
      }
      $('progress').value = (i + 1) / pages.length * 100;
    }
    if (state.cancel) throw new Error('已取消导出，未保存不完整文件。');
    $('progressText').textContent = '正在打包文件…'; await nextFrame();
    const blob = isPdf ? await makePdf(outputs, layout) : isZip ? await makeZip(outputs) : outputs[0].data;
    if (state.cancel) throw new Error('已取消导出，未保存不完整文件。');
    const extension = isPdf ? 'pdf' : isZip ? 'zip' : imageFormat === 'jpeg' ? 'jpg' : imageFormat;
    save(blob, `${name}.${extension}`); notify(`导出完成：${pages.length} 页，${mb(blob.size)}。`);
  } catch (error) { notify(error.message || '导出失败，请减小图片尺寸并重试。'); }
  finally { outputs.length = 0; setBusy(false); $('exportStatus').hidden = true; schedulePreview(0); }
}
$('export').onclick = exportFiles;
$('cancelExport').onclick = () => { state.cancel = true; $('cancelExport').disabled = true; $('progressText').textContent = '取消将在当前页处理完成后生效…'; };
$('choose').onclick = $('emptyChoose').onclick = () => $('files').click();
$('camera').onclick = () => $('cameraInput').click();
$('files').onchange = e => addFiles(e.target.files); $('cameraInput').onchange = e => addFiles(e.target.files);
document.addEventListener('paste', e => { const files = Array.from(e.clipboardData?.files || []); if (files.length && !state.busy && !$('scanPanel').hidden) {e.preventDefault(); addFiles(files);} });
for (const name of ['dragenter', 'dragover']) $('dropzone').addEventListener(name, e => { e.preventDefault(); if (!state.busy && !dragId) $('dropzone').classList.add('dragging'); });
$('dropzone').addEventListener('dragleave', e => { if (!$('dropzone').contains(e.relatedTarget)) $('dropzone').classList.remove('dragging'); });
$('dropzone').addEventListener('drop', e => {e.preventDefault(); $('dropzone').classList.remove('dragging'); if (!dragId) addFiles(e.dataTransfer.files);});
window.addEventListener('dragover', e => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(); });
window.addEventListener('drop', e => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(); });
document.querySelectorAll('[data-preset]').forEach(el => el.onclick = () => { if (!current() || state.busy) return; current().settings = settingsForMode(current().stats,el.dataset.preset); syncSettings(); schedulePreview(); });
document.querySelectorAll('[data-setting]').forEach(el => el.oninput = () => { if (!current() || state.busy) return; current().settings[el.dataset.setting] = Number(el.value); current().settings.preset='custom'; document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false')); $('modeSummary').textContent='自定义参数 · 重新选择模式即可恢复自动设置'; $(`${el.id}Value`).textContent = el.value; schedulePreview(); });
document.querySelectorAll('[data-view]').forEach(el => el.onclick = () => {cancelCrop(); setView(el.dataset.view);});
$('compare').oninput = updateView;
$('reset').onclick = () => { const p = current(); if (!p || state.busy) return; cancelCrop(); p.settings = {...settingsForMode(null,'original')}; p.rotation = 0; p.crop = {x: 0, y: 0, w: 1, h: 1}; previewCache = null; syncSettings(); schedulePreview(0); notify('已恢复当前页面的原图与原色。'); };
$('applyAll').onclick = () => { if (!current() || state.busy) return; const s = current().settings; state.pages.forEach(p => p.settings = s.preset==='custom' ? {...s} : settingsForMode(p.stats,s.preset)); notify(`已应用到 ${state.pages.length} 页；每页自动适配明暗，裁剪和旋转保持不变。`); };
$('rotateLeft').onclick = () => rotate(-90); $('rotateRight').onclick = () => rotate(90);
$('moveUp').onclick = () => move(-1); $('moveDown').onclick = () => move(1);
$('remove').onclick = () => { if (state.busy || !current()) return; cancelCrop(); const index = state.pages.findIndex(p => p.id === state.selected); state.pages.splice(index, 1); state.selected = state.pages[Math.min(index, state.pages.length - 1)]?.id || null; previewCache = null; renderQueue(); syncSettings(); schedulePreview(0); };
$('clear').onclick = () => {if (!state.busy) $('clearDialog').showModal();}; $('keepPages').onclick = () => $('clearDialog').close();
$('confirmClear').onclick = () => { $('clearDialog').close(); cancelCrop(); if (state.downloadUrl) URL.revokeObjectURL(state.downloadUrl); state.downloadUrl = null; $('lastDownload').hidden = true; $('lastDownload').removeAttribute('href'); state.pages = []; state.selected = null; previewCache = null; renderQueue(); syncSettings(); schedulePreview(0); };
for (const id of ['format', 'paper', 'encoding']) $(id).onchange = refreshControls;
$('demo').onclick = async () => {
  if (state.busy) return;
  const c = canvas(1000, 1320), ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 1000, 1250); grad.addColorStop(0, '#aeaaa0'); grad.addColorStop(.5, '#dedbcf'); grad.addColorStop(1, '#c3c0b5'); ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#494c44'; ctx.font = '22px sans-serif'; ctx.fillText('RESEARCH NOTES  /  01', 95, 140);
  ctx.font = 'bold 52px Georgia'; ctx.fillText('A clearer perspective.', 95, 228);
  ctx.strokeStyle = '#74796a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(95, 270); ctx.lineTo(900, 270); ctx.stroke();
  const lines = ['Good ideas deserve a little clarity.', '', '01   Start with the right question.', '02   Keep the evidence close.', '03   Make the details easier to see.', '', 'Local processing. Original files untouched.', 'Your documents stay on your device.'];
  ctx.font = '27px Georgia'; lines.forEach((text, i) => ctx.fillText(text, 95, 350 + i * 62));
  ctx.fillStyle = '#517653'; ctx.fillRect(95, 932, 7, 160); ctx.fillStyle = '#50584a'; ctx.font = 'italic 28px Georgia'; ctx.fillText('A small tool for clearer documents.', 124, 998);
  ctx.font = '21px sans-serif'; ctx.fillText('Try the before / after slider.', 124, 1048);
  ctx.fillStyle = '#777b6f'; ctx.font = '18px sans-serif'; ctx.fillText('PAPERSCAN  /  LOCAL DEMO', 95, 1220);
  const blob = await toBlob(c, 'image/png', 1); c.width = c.height = 1;
  addFiles([new File([blob], '示例-研究笔记.png', {type: 'image/png'})]);
};
window.addEventListener('beforeunload', e => { if (state.pages.length || state.busy) {e.preventDefault(); e.returnValue = '';} });
// The browser releases worker/object-URL resources when the document is destroyed.
// Do not terminate on pagehide: a back-forward-cache restore must remain usable.
refreshControls(); renderQueue(); syncSettings();
