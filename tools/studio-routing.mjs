/** Same-document routes. A route changes controls, never file queues. */
export const LEGACY_ROUTES=Object.freeze({
 'png-to-pdf':'#image','png-to-pdf-simple':'#image/png-to-pdf',
 'mixed-to-pdf':'#pdf/mixed','merge-pdf':'#pdf/merge','split-pdf':'#pdf/split',
 'extract-pdf':'#pdf/extract','organize-pdf':'#pdf/organize'
});
const definitions={
 '#image':['image','enhance','图片工作区'],
 '#image/crop':['image','crop','裁剪与方向'],
 '#image/compress':['image','compress','图片压缩'],
 '#image/pdf':['image','imagepdf','图片转 PDF'],
 '#image/png-to-pdf':['image','imagepdf','无损原图转 PDF'],
 '#pdf':['pdf','pages','PDF 工作区'],
 '#pdf/merge':['pdf','pages','PDF 合并'],
 '#pdf/organize':['pdf','pages','PDF 页面整理'],
 '#pdf/mixed':['pdf','mixed','图片与 PDF 合并'],
 '#pdf/split':['pdf','split','PDF 拆分'],
 '#pdf/extract':['pdf','extract','PDF 页面提取'],
 '#pdf/compress':['pdf','pdfcompress','PDF 压缩'],
 '#pdf/images':['pdf','convert','PDF 转图片']
};
export function resolveRoute(value=''){
 const aliases={'#scan':'#image','#compress':'#image/compress','#png-to-pdf':'#image/png-to-pdf'};
 let hash=String(value).replace(/\/$/,'');hash=aliases[hash]||hash;
 if(!Object.hasOwn(definitions,hash))hash='#image';
 const [workspace,tool,title]=definitions[hash];return {hash,workspace,tool,title};
}
export const TOOL_ROUTES=Object.freeze({enhance:'#image',crop:'#image/crop',compress:'#image/compress',imagepdf:'#image/pdf',pages:'#pdf',mixed:'#pdf/mixed',split:'#pdf/split',extract:'#pdf/extract',pdfcompress:'#pdf/compress',convert:'#pdf/images'});
