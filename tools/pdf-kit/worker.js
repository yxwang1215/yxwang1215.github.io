'use strict';
importScripts('./pdf-lib.min.js','../pdf-engine.js','./core.js');
self.onmessage=async({data:request})=>{
 const {id,type,payload}=request;
 try{
  if(type==='inspect'){
   const result=await PDFToolkit.inspect(new Uint8Array(payload.buffer),payload.name,payload.allowPng);
   self.postMessage({id,result});
  }else if(type==='build'){
   const inputs=payload.inputs.map(s=>({...s,data:new Uint8Array(s.buffer)}));
   const results=await PDFToolkit.build(inputs,payload.options,(label,percent)=>self.postMessage({id,progress:{label,percent}}));
   const multiple=results.length>1;
   const blob=multiple?PDFToolkit.makeZip(results):new Blob([results[0].data],{type:'application/pdf'});
   const name=multiple?PDFToolkit.safeName(payload.options.name,'zip'):results[0].name;
   self.postMessage({id,result:{blob,name,count:results.length}});
  }else throw new Error('未知操作。');
 }catch(error){self.postMessage({id,error:error instanceof Error?error.message:'文件处理失败，请重试。'});}
};
