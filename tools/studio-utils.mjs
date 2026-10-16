import {SCAN_MODES, settingsForMode} from './png-to-pdf/modes.mjs';
/** UI-only state helpers. File/Blob objects are retained, never uploaded or rewritten. */
export function parseRange(text, count) {
  if (!Number.isInteger(count) || count < 1) throw new Error('请先添加 PDF 页面。');
  if (!String(text).trim()) return Array.from({length: count}, (_, i) => i);
  const result = [];
  for (const part of String(text).split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error('页码格式应为 1-3,5；请使用英文逗号。');
    const start = Number(match[1]), end = Number(match[2] || match[1]);
    if (start < 1 || end > count || start > end) throw new Error(`页码必须在 1–${count} 之间，且起始页不能大于结束页。`);
    for (let i = start; i <= end; i++) if (!result.includes(i - 1)) result.push(i - 1);
  }
  return result;
}
const clone = pages => pages.map(p => ({...p, settings: p.settings ? {...p.settings} : undefined, crop: p.crop ? {...p.crop} : undefined}));
export class History {
  constructor(limit = 20) { this.limit = limit; this.past = []; this.future = []; }
  get canUndo() { return this.past.length > 0; }
  get canRedo() { return this.future.length > 0; }
  save(pages) { this.past.push(clone(pages)); if (this.past.length > this.limit) this.past.shift(); this.future = []; }
  undo(pages) { if (!this.canUndo) return pages; this.future.push(clone(pages)); return this.past.pop(); }
  redo(pages) { if (!this.canRedo) return pages; this.past.push(clone(pages)); return this.future.pop(); }
  clear() { this.past = []; this.future = []; }
}
export const uid = () => globalThis.crypto?.randomUUID?.() || `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const sizeLabel = n => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
export function movePage(pages, fromId, toId) {
  const copy = [...pages], from = copy.findIndex(p => p.id === fromId), to = copy.findIndex(p => p.id === toId);
  if (from < 0 || to < 0 || from === to) return copy;
  copy.splice(to, 0, copy.splice(from, 1)[0]); return copy;
}
export const PRESETS = Object.fromEntries(SCAN_MODES.map(m => [m.id === 'document' ? 'paper' : m.id, {...settingsForMode(null, m.id), label:m.name, group:m.group, hint:m.hint}]));
