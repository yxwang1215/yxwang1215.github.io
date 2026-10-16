import {fitSize} from '../png-to-pdf/core.mjs';
import {parsePng,optimizePng,encodePng} from './png-codec.mjs';
import {compressPdf} from './pdf-compress.mjs';
const check=s=>{if(s?.aborted)throw new DOMException('已取消压缩。','AbortError');};
export async function detectFile(file){
 const b=new Uint8Array(await file.slice(0,12).arrayBuffer());
 if(b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71)return 'png';
 if(b[0]===255&&b[1]===216&&b[2]===255)return 'jpeg';
 if(new TextDecoder().decode(b.subarray(0,5))==='%PDF-')return 'pdf';
 if(new TextDecoder().decode(b.subarray(0,4))==='RIFF'&&new TextDecoder().decode(b.subarray(8,12))==='WEBP')return 'webp';
 throw new Error('文件内容不是支持的 PNG、JPG、WebP 或 PDF，或文件已损坏。');
}
function pngJob(job,signal){
 check(signal);
 if(typeof Worker==='undefined')return job.kind==='lossless'?optimizePng(job.blob):encodePng(job.pixels,job.width,job.height,job.bits);
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./png-worker.mjs',import.meta.url),{type:'module'});
  const finish=(e,b)=>{worker.terminate();signal?.removeEventListener('abort',abort);e?reject(e):resolve(b);};
  const abort=()=>finish(new DOMException('已取消压缩。','AbortError'));
  signal?.addEventListener('abort',abort,{once:true});
  worker.onmessage=({data})=>data.error?finish(new Error(data.error)):finish(null,data.blob);
  worker.onerror=()=>finish(new Error('PNG 压缩线程失败，请刷新或减小图片重试。'));
  worker.postMessage(job,job.pixels?[job.pixels.buffer]:[]);
 });
}
export async function compressFile(file,profile='balanced',signal,onProgress=()=>{}){
 if(!['lossless','balanced','small'].includes(profile))throw new Error('压缩档位无效。');
 if(file.size>50*1048576||!file.size)throw new Error('单文件必须大于 0 且不超过 50 MB。');
 check(signal);const type=await detectFile(file);
 if(type==='pdf')return {...await compressPdf(file,profile,signal,onProgress),type};
 let png;
 if(type==='png')png=parsePng(new Uint8Array(await file.arrayBuffer()));
 if(profile==='lossless'){
  const out=type==='png'?await pngJob({kind:'lossless',blob:file},signal):file;check(signal);
  return {blob:out,type,kept:out.size>=file.size,note:type==='png'?(png.interlace?'交错 PNG 保留原文件。':'PNG 行过滤 + DEFLATE；保留像素、透明度与色彩元数据。'):'JPG/WebP 无损档保留原文件；压缩体积请选「均衡」或「更小」。'};
 }
 let bitmap,canvas;
 try{
  bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});check(signal);
  if(bitmap.width*bitmap.height>40000000)throw new Error('单张图片超过 4000 万像素，请先缩小。');
  const [w,h]=fitSize(bitmap.width,bitmap.height,profile==='small'?1800:3200);
  canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});
  if(type!=='png'){ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);}ctx.drawImage(bitmap,0,0,w,h);
  let out;
  if(type==='png'){const pixels=ctx.getImageData(0,0,w,h).data;out=await pngJob({kind:'encode',pixels,width:w,height:h,bits:profile==='small'?5:6},signal);}
  else{out=await new Promise((resolve,reject)=>canvas.toBlob(b=>b&&b.type===`image/${type}`?resolve(b):reject(new Error('当前浏览器不支持此格式编码。')),`image/${type}`,profile==='small'?.65:.84));}
  check(signal);const kept=out.size>=file.size;
  return {blob:kept?file:out,type,kept,note:kept?'已较精简，保留原文件；未生成更大的结果。':`${w} × ${h} px · ${type==='png'?'RGB 减色（有损），透明度保留；重编码不保留源元数据':'有损重编码，已处理 EXIF 方向'}`};
 }finally{bitmap?.close();if(canvas)canvas.width=canvas.height=1;}
}
