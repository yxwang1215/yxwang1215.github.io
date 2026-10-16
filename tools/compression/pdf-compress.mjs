import {boundedInflate} from './png-codec.mjs';
let codecPromise;
function pdfCodec(){
 if(globalThis.PDFLib)return Promise.resolve(globalThis.PDFLib);
 if(!codecPromise)codecPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('../codecs/pdf-lib-1.17.1.min.js',import.meta.url).href;s.onload=()=>globalThis.PDFLib?resolve(globalThis.PDFLib):reject(new Error('PDF 组件加载失败。'));s.onerror=()=>reject(new Error('PDF 压缩组件尚未加载，请刷新重试。'));document.head.append(s);}).catch(e=>{codecPromise=null;throw e;});
 return codecPromise;
}
const tick=()=>new Promise(r=>setTimeout(r,0));
const check=signal=>{if(signal?.aborted)throw new DOMException('已取消压缩。','AbortError');};
const jpeg=c=>new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('JPEG 编码失败。')),'image/jpeg',c.quality));
/** Rewrite selected image streams, never rasterize page text, vectors or OCR. */
export async function compressPdf(file,profile='balanced',signal,onProgress=()=>{}){
 check(signal);const L=await pdfCodec(),{PDFDocument,PDFName,PDFRawStream,PDFDict,PDFNumber}=L,N=PDFName.of;
 const bytes=new Uint8Array(await file.arrayBuffer());check(signal);
 let doc;try{doc=await PDFDocument.load(bytes,{updateMetadata:false,throwOnInvalidObject:true});}catch(e){throw new Error(/encrypt/i.test(e.message)?'加密 PDF 暂不支持；请先用密码正常解密后导入。':'PDF 无法解析，可能损坏或使用了不支持的结构。');}
 if(doc.isEncrypted)throw new Error('加密 PDF 暂不支持。');
 const pages=doc.getPageCount();if(pages<1||pages>300)throw new Error('PDF 压缩支持 1–300 页。');
 const objects=doc.context.enumerateIndirectObjects();
 for(const [,o] of objects){const d=o instanceof PDFDict?o:o instanceof PDFRawStream?o.dict:null;
  if(d&&(d.has(N('ByteRange'))||d.get(N('FT'))?.toString()==='/Sig'))throw new Error('检测到数字签名或签名字段；为避免破坏签名，本工具不修改此 PDF。');
 }
 const form=doc.catalog.lookupMaybe(N('AcroForm'),PDFDict);if(form?.has(N('XFA')))throw new Error('暂不支持 XFA 动态表单 PDF。');
 let changed=0,skipped=0,examined=0;
 const candidates=objects.filter(([,o])=>o instanceof PDFRawStream&&o.dict.get(N('Subtype'))?.toString()==='/Image');
 if(profile!=='lossless')for(const [ref,o] of candidates){
  check(signal);onProgress(`正在检查 PDF 图像 ${++examined} / ${candidates.length}`);await tick();
  const d=o.dict,lookup=k=>d.lookup(N(k)),val=k=>lookup(k)?.asNumber?.(),str=k=>lookup(k)?.toString?.();
  const w=val('Width'),h=val('Height'),space=str('ColorSpace'),filter=str('Filter');
  if(!w||!h||w*h>16000000||w*h<4096||val('BitsPerComponent')!==8||!['/DeviceRGB','/DeviceGray'].includes(space)||!['/DCTDecode','/FlateDecode'].includes(filter)||['SMask','Mask','Decode','DecodeParms','ImageMask','Alternates','OPI'].some(k=>d.has(N(k)))){skipped++;continue;}
  let bitmap,source,c;
  try{
   if(filter==='/DCTDecode'){
    bitmap=await createImageBitmap(new Blob([o.contents],{type:'image/jpeg'}),{imageOrientation:'none'});
    if(bitmap.width!==w||bitmap.height!==h){skipped++;continue;}source=bitmap;
   }else{
    const channels=space==='/DeviceRGB'?3:1,expected=w*h*channels;
    const raw=await boundedInflate(o.contents,expected);if(raw.length!==expected){skipped++;continue;}
    const rgba=new Uint8ClampedArray(w*h*4);for(let p=0;p<w*h;p++){rgba[p*4]=raw[p*channels];rgba[p*4+1]=raw[p*channels+(channels===3?1:0)];rgba[p*4+2]=raw[p*channels+(channels===3?2:0)];rgba[p*4+3]=255;}
    source=document.createElement('canvas');source.width=w;source.height=h;source.getContext('2d').putImageData(new ImageData(rgba,w,h),0,0);
   }
   const max=profile==='small'?1800:2800,scale=Math.min(1,max/Math.max(w,h));
   c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*scale));c.height=Math.max(1,Math.round(h*scale));c.quality=profile==='small'?.65:.82;
   const ctx=c.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(source,0,0,c.width,c.height);
   const compressed=await jpeg(c);check(signal);
   if(compressed.size>=o.contents.length*.97){skipped++;continue;}
   const dict=d.clone(doc.context);dict.set(N('Width'),PDFNumber.of(c.width));dict.set(N('Height'),PDFNumber.of(c.height));dict.set(N('ColorSpace'),N('DeviceRGB'));dict.set(N('Filter'),N('DCTDecode'));dict.set(N('Length'),PDFNumber.of(compressed.size));
   doc.context.assign(ref,PDFRawStream.of(dict,new Uint8Array(await compressed.arrayBuffer())));changed++;
  }catch(e){if(e.name==='AbortError')throw e;skipped++;}
  finally{bitmap?.close();if(source&&source!==bitmap)source.width=source.height=1;if(c)c.width=c.height=1;}
 }
 check(signal);onProgress('正在优化 PDF 对象结构…');await tick();
 const output=await doc.save({useObjectStreams:true,addDefaultPage:false,updateFieldAppearances:false,objectsPerTick:25});check(signal);
 const out=new Blob([output],{type:'application/pdf'}),smaller=out.size<file.size;
 return {blob:smaller?out:file,kept:!smaller,note:smaller?`${pages} 页；保留文字/矢量；重编码 ${changed} 张图像${skipped?`，跳过 ${skipped} 张` : ''}`:'已较精简，保留原文件；未强行改变格式或栅格化文字。'};
}
