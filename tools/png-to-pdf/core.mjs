/** Stable API shared by thumbnails, the worker, full-size exports and older tools. */
export * from './base-core.mjs';
import {processPixels as processBase} from './base-core.mjs';
import {prepareScan,finishScan} from './scan-effects.mjs';
export function processPixels(input,w,h,options={}) {
  if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||!input||input.length!==w*h*4)throw new Error('Invalid image dimensions');
  if(!options.recipe)return processBase(input,w,h,options);
  return finishScan(processBase(prepareScan(input,w,h,options),w,h,options),w,h,options);
}
