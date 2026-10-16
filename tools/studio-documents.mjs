/** Reuse the existing lossless writer and PDF range parser inside the shared UI. */
import './pdf-engine.js';
import './pdf-kit/core.js';
export const parsePages=(text,count)=>globalThis.PDFToolkit.parsePages(text,count);
export const splitGroups=(count,mode,text,chunk)=>globalThis.PDFToolkit.splitGroups(count,mode,text,chunk);
export async function originalImagePdf(pages,options,{check=()=>{},progress=()=>{}}={}){
 if(!pages.length)throw new Error('请先添加图片。');
 const writer=new globalThis.PngPdf.Writer();
 for(const [i,page] of pages.entries()){
  check();const file=page.file;
  if(/\.png$/i.test(file.name)||file.type==='image/png')globalThis.PngPdf.validatePNG(new Uint8Array(await file.arrayBuffer()));
  let bitmap,canvas;
  try{
   bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});check();
   const box=globalThis.PngPdf.layout(bitmap.width,bitmap.height,options);
   canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);
   await writer.addRGBA(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height,box);
   check();progress(i+1,pages.length,'正在无损封装原图');
  }finally{bitmap?.close();if(canvas)canvas.width=canvas.height=1;}
 }
 check();return writer.finish();
}
/** Insert an image as an ordinary source PDF page, keeping alpha and native pixels. */
export async function imageDocument(file,lib,options={}){
 if(file.size>30*1048576)throw new Error('单张图片上限为 30 MB。');
 let bitmap,c;
 try{
  if(file.type==='image/png'||/\.png$/i.test(file.name))globalThis.PngPdf.validatePNG(new Uint8Array(await file.arrayBuffer()));
  bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
  const box=globalThis.PngPdf.layout(bitmap.width,bitmap.height,{paper:'a4',orientation:'auto',margin:8,dpi:96,...options});
  c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;c.getContext('2d').drawImage(bitmap,0,0);
  const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('图片编码失败。')),'image/png'));
  const doc=await lib.PDFDocument.create(),img=await doc.embedPng(await blob.arrayBuffer());
  doc.addPage([box.width,box.height]).drawImage(img,{x:box.x,y:box.y,width:box.drawWidth,height:box.drawHeight});
  return new Uint8Array(await doc.save());
 }finally{bitmap?.close();if(c)c.width=c.height=1;}
}
