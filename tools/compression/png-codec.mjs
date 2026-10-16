import {crc32} from '../png-to-pdf/core.mjs';
const SIGN=new Uint8Array([137,80,78,71,13,10,26,10]);
const text=new TextEncoder(),decode=new TextDecoder();
export function pngChunk(type,data){const a=new Uint8Array(data.length+12),v=new DataView(a.buffer);v.setUint32(0,data.length);a.set(text.encode(type),4);a.set(data,8);v.setUint32(a.length-4,crc32(a.subarray(4,a.length-4)));return a;}
export function parsePng(a){
 if(a.length<45||!SIGN.every((v,i)=>a[i]===v))throw new Error('PNG 文件头无效。');
 const chunks=[],idats=[];let pos=8,end=false;
 while(pos+12<=a.length){const n=new DataView(a.buffer,a.byteOffset+pos,4).getUint32(0);if(n>a.length-pos-12)throw new Error('PNG 数据不完整。');
  const type=decode.decode(a.subarray(pos+4,pos+8)),data=a.subarray(pos+8,pos+8+n),raw=a.subarray(pos,pos+n+12);
  if(crc32(raw.subarray(4,raw.length-4))!==new DataView(raw.buffer,raw.byteOffset+raw.length-4,4).getUint32(0))throw new Error('PNG 校验失败，文件可能损坏。');
  if(type==='acTL')throw new Error('压缩暂不支持动态 PNG，请先导出静态图片。');
  chunks.push({type,data,raw});if(type==='IDAT')idats.push(data);pos+=n+12;if(type==='IEND'){end=true;break;}
 }
 if(!end||chunks[0]?.type!=='IHDR'||chunks[0].data.length!==13||!idats.length)throw new Error('PNG 缺少必要数据块。');
 const ih=chunks[0].data,v=new DataView(ih.buffer,ih.byteOffset,13),width=v.getUint32(0),height=v.getUint32(4),depth=ih[8],color=ih[9],channels=({0:1,2:3,3:1,4:2,6:4})[color];
 if(!width||!height||width*height>16000000||width>16384||height>16384)throw new Error('PNG 压缩上限为 1600 万像素、单边 16384 px。');
 if(!channels||!({0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]})[color].includes(depth)||ih[10]||ih[11]||ih[12]>1)throw new Error('不支持此 PNG 编码。');
 const idat=new Uint8Array(idats.reduce((n,b)=>n+b.length,0));let off=0;for(const b of idats){idat.set(b,off);off+=b.length;}
 return {width,height,depth,color,channels,interlace:ih[12],row:Math.ceil(width*channels*depth/8),bpp:Math.max(1,Math.ceil(channels*depth/8)),idat,chunks};
}
const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
export function unfilter(data,p){
 const {row,height,bpp}=p;if(data.length!==(row+1)*height)throw new Error('PNG 解压长度异常。');
 const out=new Uint8Array(row*height);
 for(let y=0;y<height;y++){const mode=data[y*(row+1)];if(mode>4)throw new Error('PNG 行过滤器无效。');for(let x=0;x<row;x++){
  const i=y*row+x,a=x>=bpp?out[i-bpp]:0,b=y?out[i-row]:0,c=y&&x>=bpp?out[i-row-bpp]:0;
  const predictor=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][mode];out[i]=(data[y*(row+1)+1+x]+predictor)&255;
 }}return out;
}
function filterRows(raw,row,height,bpp){
 const out=new Uint8Array((row+1)*height),candidate=new Uint8Array(row),best=new Uint8Array(row);
 for(let y=0;y<height;y++){let bestScore=Infinity,bestType=0;for(let mode=0;mode<=4;mode++){let score=0;for(let x=0;x<row;x++){
  const i=y*row+x,a=x>=bpp?raw[i-bpp]:0,b=y?raw[i-row]:0,c=y&&x>=bpp?raw[i-row-bpp]:0;
  const pred=mode===0?0:mode===1?a:mode===2?b:mode===3?Math.floor((a+b)/2):paeth(a,b,c),d=(raw[i]-pred)&255;
  candidate[x]=d;score+=Math.min(d,256-d);
 }if(score<bestScore){bestScore=score;bestType=mode;best.set(candidate);}}
 out[y*(row+1)]=bestType;out.set(best,y*(row+1)+1);
 }return out;
}
export async function boundedInflate(data,max){
 if(typeof DecompressionStream==='undefined')throw new Error('浏览器不支持此压缩功能，请使用新版 Chrome、Edge 或 Safari。');
 const reader=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate')).getReader(),parts=[];let size=0;
 try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('解压数据超过安全上限。');}parts.push(value);}}finally{reader.releaseLock();}
 const result=new Uint8Array(size);let off=0;for(const b of parts){result.set(b,off);off+=b.length;}return result;
}
async function deflate(data){
 if(typeof CompressionStream==='undefined')throw new Error('浏览器不支持此压缩功能。');
 return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
}
export async function optimizePng(blob){
 const a=new Uint8Array(await blob.arrayBuffer()),p=parsePng(a);
 // Adam7 remains byte-for-byte original; never silently discard frames/profiles.
 if(p.interlace)return blob;
 const max=(p.row+1)*p.height;if(max>128000000)throw new Error('PNG 解压数据过大，请分辨率缩小后重试。');
 const inflated=await boundedInflate(p.idat,max),raw=unfilter(inflated,p);
 const zipped=await deflate(filterRows(raw,p.row,p.height,p.bpp));
 const parts=[SIGN];let emitted=false;
 for(const c of p.chunks){if(c.type==='IDAT'){if(!emitted){parts.push(pngChunk('IDAT',zipped));emitted=true;}}else parts.push(c.raw);}
 const output=new Blob(parts,{type:'image/png'});return output.size<blob.size?output:blob;
}
export async function encodePng(input,width,height,bits=8){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>16000000||input.length!==width*height*4||![5,6,8].includes(bits))throw new Error('PNG 图像参数无效。');
 const rgba=new Uint8Array(input),levels=(1<<bits)-1;
 if(bits<8)for(let i=0;i<rgba.length;i+=4)for(let c=0;c<3;c++)rgba[i+c]=Math.round(Math.round(rgba[i+c]*levels/255)*255/levels);
 const ih=new Uint8Array(13),v=new DataView(ih.buffer);v.setUint32(0,width);v.setUint32(4,height);ih[8]=8;ih[9]=6;
 const data=await deflate(filterRows(rgba,width*4,height,4));
 return new Blob([SIGN,pngChunk('IHDR',ih),pngChunk('sRGB',new Uint8Array([0])),pngChunk('IDAT',data),pngChunk('IEND',new Uint8Array())],{type:'image/png'});
}
