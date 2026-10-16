/* Pure PDF toolkit core. User bytes are never transmitted. pdf-lib is resolved only for PDF operations. */
(function(root){
'use strict';
const LIMITS=Object.freeze({files:50,file:50*1048576,image:25*1048576,total:150*1048576,pages:500,output:200*1048576});
const lib=()=>typeof module==='object'&&module.exports?require('./pdf-lib.min.js'):root.PDFLib;
const png=()=>typeof module==='object'&&module.exports?require('../pdf-engine.js'):root.PngPdf;
function pageCount(n){if(!Number.isInteger(n)||n<1||n>LIMITS.pages)throw new Error('每次支持 1–500 页，请先使用较小的 PDF。');}
function parsePages(text,total){
 pageCount(total);const value=String(text??'').trim().replace(/，/g,',').replace(/[–—]/g,'-');
 if(!value)return Array.from({length:total},(_,i)=>i);
 if(value.length>4000)throw new Error('页码范围太长。');
 const out=[];
 for(const part of value.split(',')){
  const match=/^(\d+)\s*(?:-\s*(\d+))?$/.exec(part.trim());
  if(!match)throw new Error('页码格式不正确，请使用 1-3,5；页码从 1 开始。');
  const first=Number(match[1]),last=Number(match[2]??match[1]);
  if(!Number.isSafeInteger(first)||first<1||first>total||!Number.isSafeInteger(last)||last<1||last>total)throw new Error('页码超出范围：此文件只有 '+total+' 页。');
  const step=first<=last?1:-1;
  for(let i=first;;i+=step){out.push(i-1);if(out.length>LIMITS.pages)throw new Error('一次最多输出 500 页。');if(i===last)break;}
 }
 return out;
}
function splitGroups(total,mode='each',text='',chunk=1){
 pageCount(total);let groups;
 if(mode==='each')groups=Array.from({length:total},(_,i)=>[i]);
 else if(mode==='chunks'){
  chunk=Number(chunk);if(!Number.isInteger(chunk)||chunk<1||chunk>LIMITS.pages)throw new Error('每份页数必须是 1–500 的整数。');
  groups=[];for(let i=0;i<total;i+=chunk)groups.push(Array.from({length:Math.min(chunk,total-i)},(_,j)=>i+j));
 }else if(mode==='custom'){
  if(!String(text).trim())throw new Error('请输入拆分范围，例如 1-3;4-6;7。');
  groups=String(text).replace(/；/g,';').split(';').map(s=>{if(!s.trim())throw new Error('拆分范围不能包含空分组。');return parsePages(s,total);});
 }else throw new Error('不支持的拆分方式。');
 if(groups.reduce((n,g)=>n+g.length,0)>LIMITS.pages)throw new Error('所有拆分文件合计最多输出 500 页。');
 return groups;
}
function safeName(value,extension='pdf'){
 const s=Array.from(String(value||'').trim().replace(/(?:\.(?:pdf|zip))+$/ig,'').replace(/[<>:"/\\|?*\x00-\x1f\x7f]/g,'_').replace(/^\.+|[. ]+$/g,'')).slice(0,80).join('');
 return (s||'document')+'.'+extension;
}
function kindOf(data){
 if(!(data instanceof Uint8Array))data=new Uint8Array(data);
 if(data.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>data[i]===v))return 'png';
 if(new TextDecoder().decode(data.subarray(0,1024)).includes('%PDF-'))return 'pdf';
 throw new Error('文件内容不是有效的 PDF 或 PNG，修改扩展名不能转换格式。');
}
async function loadSource(data,name,allowPng){
 data=data instanceof Uint8Array?data:new Uint8Array(data);
 if(!data.length||data.byteLength>LIMITS.file)throw new Error('文件为空或超过 50 MiB。');
 const kind=kindOf(data);
 if(kind==='png'){
  if(!allowPng)throw new Error('此工具只接受 PDF；图片请使用「图片 + PDF 合并」。');
  if(data.length>LIMITS.image)throw new Error('单张 PNG 不能超过 25 MiB。');
  const info=png().validatePNG(data);
  // Decode in the worker during import, so corrupt PNGs fail before joining the queue.
  await lib().PDFDocument.create().then(d=>d.embedPng(data));
  return {kind,data,name,count:1,pages:[{...info,rotation:0}]};
 }
 let doc;
 try{doc=await lib().PDFDocument.load(data,{updateMetadata:false,throwOnInvalidObject:true,parseSpeed:lib().ParseSpeeds.Slow});}
 catch(error){if(error.name==='EncryptedPDFError'||/encrypted/i.test(error.message))throw new Error('此 PDF 已加密，暂不支持。请先在可信软件中另存为未加密副本。');throw new Error('PDF 无法读取，文件可能损坏或使用了不支持的格式。');}
 pageCount(doc.getPageCount());
 const acro=doc.catalog.get(lib().PDFName.of('AcroForm'));
 if(acro){
  const form=doc.getForm();
  if(form.hasXFA()||form.getFields().length)throw new Error('此 PDF 含交互表单或签名字段，暂不支持。请先打印或扁平化为普通 PDF 副本。');
 }
 const pages=doc.getPages().map(p=>{const b=p.getCropBox();return {width:b.width,height:b.height,rotation:p.getRotation().angle};});
 return {kind,doc,name,count:pages.length,pages};
}
async function inspect(data,name,allowPng=false){const s=await loadSource(data,name,allowPng);return {kind:s.kind,count:s.count,pages:s.pages};}
function checkRotation(value){const n=Number(value||0);if(![0,90,180,270].includes(n))throw new Error('旋转角度必须为 0、90、180 或 270 度。');return n;}
async function copySelection(target,source,indices,rotations){
 if(!indices.length)throw new Error('至少保留一页。');
 const copied=await target.copyPages(source.doc,indices);
 copied.forEach((p,i)=>{const angle=checkRotation(rotations?rotations[i]:0);if(angle)p.setRotation(lib().degrees((p.getRotation().angle+angle)%360));target.addPage(p);});
}
async function build(inputs,options={},progress=()=>{}){
 const mode=options.mode||'merge';
 if(!['merge','mixed','split','extract','organize'].includes(mode))throw new Error('不支持的工具模式。');
 if(!inputs.length||inputs.length>LIMITS.files)throw new Error('请添加 1–50 个文件。');
 if(!['merge','mixed'].includes(mode)&&inputs.length!==1)throw new Error('此工具每次处理一个 PDF。');
 if(inputs.reduce((n,s)=>n+s.data.byteLength,0)>LIMITS.total)throw new Error('文件总大小不能超过 150 MiB。');
 const loaded=[];let inputPages=0;
 for(let i=0;i<inputs.length;i++){
  progress('读取文件 '+(i+1)+' / '+inputs.length,Math.round(i/inputs.length*25));
  const s=await loadSource(inputs[i].data,inputs[i].name,mode==='mixed');
  inputPages+=s.count;if(inputPages>LIMITS.pages)throw new Error('输入文件合计不能超过 500 页。');loaded.push(s);
 }
 const result=[];let resultBytes=0;
 async function save(doc,name){
  if(doc.getPageCount()<1||doc.getPageCount()>LIMITS.pages)throw new Error('每次输出必须为 1–500 页。');
  doc.setProducer('Yuxuan Wang PDF Toolkit · pdf-lib 1.17.1');
  const data=await doc.save({addDefaultPage:false,updateFieldAppearances:false});
  resultBytes+=data.length;if(resultBytes>LIMITS.output)throw new Error('输出合计超过 200 MiB，请减少页数或拆成更小批次。');
  result.push({name:safeName(name),data});
 }
 if(mode==='merge'||mode==='mixed'){
  const plans=loaded.map((s,i)=>s.kind==='pdf'?parsePages(inputs[i].range,s.count):[0]);
  if(plans.reduce((n,p)=>n+p.length,0)>LIMITS.pages)throw new Error('一次最多输出 500 页。');
  const doc=await lib().PDFDocument.create();
  for(let i=0;i<loaded.length;i++){
   const s=loaded[i],angle=checkRotation(inputs[i].rotation);
   progress('合并文件 '+(i+1)+' / '+loaded.length,25+Math.round(i/loaded.length*60));
   if(s.kind==='pdf')await copySelection(doc,s,plans[i],plans[i].map(()=>angle));
   else{
    const image=await doc.embedPng(s.data);
    const box=png().layout(image.width,image.height,{paper:options.paper||'a4',orientation:'auto',dpi:Number(options.dpi||96),margin:Number(options.margin??10)});
    const page=doc.addPage([box.width,box.height]);page.drawImage(image,{x:box.x,y:box.y,width:box.drawWidth,height:box.drawHeight});if(angle)page.setRotation(lib().degrees(angle));
   }
  }
  progress('正在生成 PDF…',90);await save(doc,options.name||'merged');
 }else{
  const s=loaded[0];let groups,rotations;
  if(mode==='split')groups=splitGroups(s.count,options.splitMode,options.ranges,options.chunk);
  else if(mode==='extract')groups=[parsePages(options.range,s.count)];
  else{
   const selection=options.selection||[];if(!selection.length||selection.length>LIMITS.pages)throw new Error('请至少保留一页，最多 500 页。');
   selection.forEach(p=>{if(!Number.isInteger(p.index)||p.index<0||p.index>=s.count)throw new Error('页面编号已失效，请重新选择。');checkRotation(p.rotation);});
   groups=[selection.map(p=>p.index)];rotations=selection.map(p=>p.rotation);
  }
  for(let i=0;i<groups.length;i++){
   progress('生成文件 '+(i+1)+' / '+groups.length,25+Math.round(i/groups.length*65));
   const doc=await lib().PDFDocument.create();await copySelection(doc,s,groups[i],rotations);
   const base=options.name||'document';await save(doc,groups.length>1?safeName(base).slice(0,-4)+'_'+String(i+1).padStart(3,'0'):base);
  }
 }
 progress('处理完成',100);return result;
}
// ZIP "store" mode: PDF streams are already compressed; UTF-8 flag preserves Chinese names.
const CRC=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;CRC[n]=c>>>0;}
function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=CRC[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function makeZip(files){
 if(!files.length||files.length>LIMITS.pages)throw new Error('ZIP 文件数量不正确。');
 const parts=[],central=[];let offset=0,total=0;
 for(const file of files){
  const data=file.data instanceof Uint8Array?file.data:new Uint8Array(file.data),name=new TextEncoder().encode(safeName(file.name));
  total+=data.length;if(total>LIMITS.output)throw new Error('ZIP 内容超过 200 MiB。');
  const crc=crc32(data),local=new Uint8Array(30),v=new DataView(local.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);
  parts.push(local,name,data);
  const head=new Uint8Array(46),h=new DataView(head.buffer);h.setUint32(0,0x02014b50,true);h.setUint16(4,20,true);h.setUint16(6,20,true);h.setUint16(8,0x800,true);h.setUint16(14,33,true);h.setUint32(16,crc,true);h.setUint32(20,data.length,true);h.setUint32(24,data.length,true);h.setUint16(28,name.length,true);h.setUint32(42,offset,true);
  central.push(head,name);offset+=30+name.length+data.length;
 }
 const centralSize=central.reduce((n,p)=>n+p.length,0),end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);
 const blob=new Blob([...parts,...central,end],{type:'application/zip'});if(blob.size>LIMITS.output)throw new Error('ZIP 超过 200 MiB。');return blob;
}
const api={LIMITS,parsePages,splitGroups,safeName,kindOf,inspect,build,makeZip};
if(typeof module==='object'&&module.exports)module.exports=api;else root.PDFToolkit=api;
})(typeof globalThis==='object'?globalThis:this);
