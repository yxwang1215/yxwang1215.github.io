/** Preserve the original-file codecs inside the unified contextual inspector. */
import {makeZip, safeName} from './png-to-pdf/core.mjs';
import {sizeLabel} from './studio-utils.mjs';
export function installCompressionControls({getFiles, runJob, saveBlob, toast, isCanceled}) {
  for (const mode of ['image','pdf']) {
    const panel=document.querySelector(`[data-panel="${mode==='image'?'compress':'pdfcompress'}"]`);
    const details=document.createElement('details');details.id=`${mode}OriginalCompression`;
    const summary=document.createElement('summary');summary.textContent='原文件高级压缩';details.append(summary);
    const note=document.createElement('p');note.className='helper';
    note.textContent=mode==='image'?'直接压缩当前原始文件，不包含预览中的增强和裁剪。输出若没有更小，自动保留原文件。':'压缩选中页所属的整份原 PDF，保留原文字和矢量，不包含当前页面重排。多个源文件分别压缩后打包。';
    const label=document.createElement('label');label.className='field';const caption=document.createElement('span');caption.textContent='压缩档位';
    const select=document.createElement('select');select.id=`${mode}CompressionProfile`;
    for(const [value,text] of [['lossless','无损 / 结构优化'],['balanced','均衡 · 有损压缩'],['small','更小 · 有损压缩']]){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}
    select.value='balanced';label.append(caption,select);
    const explanation=document.createElement('p');explanation.className='helper';explanation.textContent=mode==='image'?'PNG 无损档使用行过滤与 DEFLATE；有损档会减色。JPG / WebP 的无损档保留原文件。':'只重编码支持的嵌入图像，不把整页文字变成图片。带数字签名、XFA 或密码的文件不修改。单文件上限 50 MB。';
    const button=document.createElement('button');button.className='btn soft full';button.id=`${mode}CompressOriginal`;button.textContent=mode==='image'?'压缩当前原文件':'压缩原 PDF';
    details.append(note,label,explanation,button);panel.append(details);
    button.onclick=()=>runJob('正在压缩原文件',async()=>{
      const sources=getFiles(mode);if(!sources.length)throw new Error('请先添加文件。');
      const {compressFile}=await import('./compression/compress.mjs');
      const controller=new AbortController(),timer=setInterval(()=>{if(isCanceled())controller.abort();},80);
      const output=[],notes=[];const profile=select.value;
      try{
        for(const [i,file]of sources.entries()){
          if(isCanceled())throw new DOMException('已取消压缩。','AbortError');
          const result=await compressFile(file,profile,controller.signal,text=>{document.getElementById('progressText').textContent=String(text);});
          const ext=result.type==='jpeg'?'jpg':result.type;
          output.push({name:`${String(i+1).padStart(2,'0')}-${safeName(file.name)}.${ext}`,data:result.blob});
          notes.push(`${file.name}: ${sizeLabel(file.size)} → ${sizeLabel(result.blob.size)}。${result.note}`);
        }
        if(isCanceled())throw new DOMException('已取消压缩。','AbortError');
        const blob=output.length===1?output[0].data:await makeZip(output);
        saveBlob(blob,output.length===1?output[0].name:'compressed-originals.zip',sources.reduce((n,f)=>n+f.size,0));
        toast(notes.join(' '));
      } finally {clearInterval(timer);}
    });
  }
}
