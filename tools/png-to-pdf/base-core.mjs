/* PaperScan: pure pixel, geometry and binary-export utilities. No network or DOM. */
const clamp = (v, lo = 0, hi = 255) => Math.max(lo, Math.min(hi, v));

function boxMean(src, w, h, radius) {
  const r = Math.max(1, Math.round(radius));
  const tmp = new Float32Array(src.length), out = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    const row = y * w; let sum = 0, right = -1, left = 0;
    for (let x = 0; x < w; x++) {
      const end = Math.min(w - 1, x + r), start = Math.max(0, x - r);
      while (right < end) sum += src[row + ++right];
      while (left < start) sum -= src[row + left++];
      tmp[row + x] = sum / (end - start + 1);
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0, bottom = -1, top = 0;
    for (let y = 0; y < h; y++) {
      const end = Math.min(h - 1, y + r), start = Math.max(0, y - r);
      while (bottom < end) sum += tmp[++bottom * w + x];
      while (top < start) sum -= tmp[top++ * w + x];
      out[y * w + x] = sum / (end - start + 1);
    }
  }
  return out;
}

// Estimate paper illumination from tile upper quantiles, not text-contaminated means.
// Bilinear interpolation avoids seams and does not create bright halos around ink.
function paperBackground(lum, w, h) {
  const tile = Math.max(8, Math.round(Math.min(w, h) / 16));
  const gw = Math.ceil(w / tile), gh = Math.ceil(h / tile);
  const grid = new Float32Array(gw * gh), hist = new Uint32Array(256);
  for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
    hist.fill(0); let count = 0;
    for (let y = gy * tile; y < Math.min(h, (gy + 1) * tile); y++)
      for (let x = gx * tile; x < Math.min(w, (gx + 1) * tile); x++) {hist[Math.round(lum[y * w + x])]++; count++;}
    let sum = 0, q = 0;
    while (q < 255 && sum + hist[q] < count * .85) sum += hist[q++];
    grid[gy * gw + gx] = q;
  }
  const smooth = boxMean(grid, gw, gh, 1), out = new Float32Array(lum.length);
  for (let y = 0; y < h; y++) {
    const fy = clamp((y + .5) / tile - .5, 0, gh - 1), y0 = Math.floor(fy), y1 = Math.min(gh - 1, y0 + 1), dy = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = clamp((x + .5) / tile - .5, 0, gw - 1), x0 = Math.floor(fx), x1 = Math.min(gw - 1, x0 + 1), dx = fx - x0;
      const a = smooth[y0 * gw + x0] * (1 - dx) + smooth[y0 * gw + x1] * dx;
      const b = smooth[y1 * gw + x0] * (1 - dx) + smooth[y1 * gw + x1] * dx;
      out[y * w + x] = a * (1 - dy) + b * dy;
    }
  }
  return out;
}

export function processPixels(input, w, h, options = {}) {
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || input.length !== w * h * 4) throw new Error('Invalid image dimensions');
  const {mode = 'original', brightness = 0, contrast = 0, sharpen = 0, clean = 0, threshold = 12} = options;
  const n = w * h, out = new Uint8ClampedArray(input.length), lum = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const i = p * 4, a = input[i + 3] / 255;
    for (let c = 0; c < 3; c++) out[i + c] = input[i + c] * a + 255 * (1 - a);
    out[i + 3] = 255;
    lum[p] = .2126 * out[i] + .7152 * out[i + 1] + .0722 * out[i + 2];
  }
  const bg = clean > 0 ? paperBackground(lum, w, h) : null;
  const strength = clamp(clean, 0, 100) / 100, factor = 1 + clamp(contrast, -80, 100) / 100;
  for (let p = 0; p < n; p++) {
    const i = p * 4, l = lum[p];
    const normalized = bg ? Math.max(l, Math.min(255, l * 255 / Math.max(100, bg[p] * 1.01))) : l;
    const ratio = l > 0 ? (l + (normalized - l) * strength) / l : 1;
    for (let c = 0; c < 3; c++) out[i + c] = clamp((out[i + c] * ratio - 128) * factor + 128 + brightness * 2.55);
    lum[p] = .2126 * out[i] + .7152 * out[i + 1] + .0722 * out[i + 2];
  }
  if (mode === 'bw') {
    const local = boxMean(lum, w, h, Math.max(3, Math.min(w, h) * .02));
    for (let p = 0; p < n; p++) {
      const v = lum[p] < local[p] - clamp(threshold, 2, 35) ? 0 : 255;
      out[p * 4] = out[p * 4 + 1] = out[p * 4 + 2] = v;
    }
    return out;
  }
  const blurred = sharpen > 0 ? boxMean(lum, w, h, Math.max(1, Math.min(w, h) / 1800)) : null;
  for (let p = 0; p < n; p++) {
    const i = p * 4, delta = blurred ? Math.min(12, (lum[p] - blurred[p]) * clamp(sharpen, 0, 150) / 45) : 0;
    if (mode === 'gray') out[i] = out[i + 1] = out[i + 2] = clamp(lum[p] + delta);
    else for (let c = 0; c < 3; c++) out[i + c] = clamp(out[i + c] + delta);
  }
  return out;
}

export function fitSize(w, h, maxSide = 3200) {
  if (!(w > 0 && h > 0 && Number.isFinite(w + h))) throw new Error('Invalid image size');
  const scale = Math.min(1, maxSide / Math.max(w, h), Math.sqrt(12000000 / (w * h)));
  return [Math.max(1, Math.floor(w * scale)), Math.max(1, Math.floor(h * scale))];
}

export function pageLayout(width, height, settings = {}) {
  const {paper = 'a4', orientation = 'auto', margin = 8} = settings;
  const mm = 72 / 25.4;
  let [w, h] = ({a4: [210 * mm, 297 * mm], a5: [148 * mm, 210 * mm], letter: [612, 792]})[paper] || [width * 72 / 300, height * 72 / 300];
  if (paper !== 'image' && (orientation === 'landscape' || (orientation === 'auto' && width > height))) [w, h] = [h, w];
  const m = paper === 'image' ? 0 : clamp(Number(margin) || 0, 0, 30) * mm;
  const scale = Math.min((w - 2 * m) / width, (h - 2 * m) / height);
  const iw = width * scale, ih = height * scale;
  return {w, h, iw, ih, x: (w - iw) / 2, y: (h - ih) / 2};
}

export function safeName(name) {
  return (String(name).replace(/\.[^.]+$/, '').replace(/[\\/<>:"|?*\x00-\x1f]/g, '_').trim().slice(0, 80) || 'scan');
}
const encoder = new TextEncoder();
const bytes = s => encoder.encode(s);
const fmt = n => Number(n.toFixed(4));

/** Image-only PDF 1.4, with a single RGB XObject per page. Byte-counted xref. */
export async function makePdf(pages, settings = {}) {
  if (!pages.length || pages.length > 50) throw new Error('PDF needs 1–50 pages');
  const objects = [null];
  objects[1] = [bytes('<< /Type /Catalog /Pages 2 0 R >>')];
  objects[2] = [bytes(`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, i) => `${4 + i * 3} 0 R`).join(' ')}] >>`)];
  pages.forEach((p, index) => {
    const imageId = 3 + index * 3, pageId = imageId + 1, contentId = imageId + 2;
    if (!['DCTDecode', 'FlateDecode'].includes(p.filter)) throw new Error('Unsupported PDF encoding');
    const length = p.data instanceof Blob ? p.data.size : p.data.byteLength;
    const b = pageLayout(p.width, p.height, settings);
    const command = bytes(`q\n${fmt(b.iw)} 0 0 ${fmt(b.ih)} ${fmt(b.x)} ${fmt(b.y)} cm\n/Im0 Do\nQ\n`);
    objects[imageId] = [bytes(`<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /${p.filter} /Length ${length} >>\nstream\n`), p.data, bytes('\nendstream')];
    objects[pageId] = [bytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(b.w)} ${fmt(b.h)}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`)];
    objects[contentId] = [bytes(`<< /Length ${command.byteLength} >>\nstream\n`), command, bytes('endstream')];
  });
  const parts = [bytes('%PDF-1.4\n%PaperScan\n')], offsets = [0]; let pos = parts[0].byteLength;
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = pos;
    const obj = [bytes(`${id} 0 obj\n`), ...objects[id], bytes('\nendobj\n')];
    for (const chunk of obj) { parts.push(chunk); pos += chunk instanceof Blob ? chunk.size : chunk.byteLength; }
  }
  const xref = pos;
  parts.push(bytes(`xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map(o => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
  return new Blob(parts, {type: 'application/pdf'});
}

const crcTable = Uint32Array.from({length: 256}, (_, value) => {
  let c = value; for (let i = 0; i < 8; i++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function crc32(a) { let c = 0xffffffff; for (const b of a) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

/** ZIP STORE: image files are already compressed. UTF-8 names and CRC32. */
export async function makeZip(files) {
  if (!files.length || files.length > 50) throw new Error('ZIP needs 1–50 files');
  const local = [], central = []; let offset = 0;
  for (const file of files) {
    const data = file.data instanceof Blob ? new Uint8Array(await file.data.arrayBuffer()) : file.data;
    const name = bytes(file.name), crc = crc32(data);
    if (name.length > 65535 || data.byteLength + offset > 0xffffffff) throw new Error('ZIP size limit exceeded');
    const header = new Uint8Array(30), d = new DataView(header.buffer);
    d.setUint32(0, 0x04034b50, true); d.setUint16(4, 20, true); d.setUint16(6, 0x800, true);
    d.setUint16(12, 33, true); d.setUint32(14, crc, true); d.setUint32(18, data.length, true); d.setUint32(22, data.length, true); d.setUint16(26, name.length, true);
    local.push(header, name, data);
    const c = new Uint8Array(46), v = new DataView(c.buffer);
    v.setUint32(0, 0x02014b50, true); v.setUint16(4, 20, true); v.setUint16(6, 20, true); v.setUint16(8, 0x800, true); v.setUint16(14, 33, true);
    v.setUint32(16, crc, true); v.setUint32(20, data.length, true); v.setUint32(24, data.length, true); v.setUint16(28, name.length, true); v.setUint32(42, offset, true);
    central.push(c, name); offset += 30 + name.length + data.length;
  }
  const centralSize = central.reduce((sum, a) => sum + a.length, 0), end = new Uint8Array(22), v = new DataView(end.buffer);
  v.setUint32(0, 0x06054b50, true); v.setUint16(8, files.length, true); v.setUint16(10, files.length, true); v.setUint32(12, centralSize, true); v.setUint32(16, offset, true);
  return new Blob([...local, ...central, end], {type: 'application/zip'});
}
