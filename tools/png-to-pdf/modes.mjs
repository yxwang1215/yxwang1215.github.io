/** One-click scan modes. Analysis is image-dependent and reused by preview/export. */
export const SCAN_MODES = [
  {id:'comprehensive',name:'综合修复',group:'basic',hint:'本地去阴影、校正纸张偏色、降噪与文字增强；非 OmniFix 模型'},
  {id:'auto',name:'自动增强',group:'basic',hint:'自动判断明暗与纸张底色'},
  {id:'document',name:'文档净白',group:'basic',hint:'强化文字、淡化灰底与阴影'},
  {id:'bw',name:'黑白扫描',group:'basic',hint:'纯黑白文字，适合打印'},
  {id:'original',name:'原图',group:'basic',hint:'不增强，保留原始观感'},
  {id:'shadow',name:'去阴影',group:'repair',hint:'均衡纸张光照与底色；不能恢复被遮挡的内容'},
  {id:'sharpen',name:'增强锐化',group:'repair',hint:'强化细字边缘与局部对比；不能恢复失焦细节'},
  {id:'faded',name:'淡字增强',group:'repair',hint:'加深低对比文字和铅笔线条；请对照原图核对'},
  {id:'denoise',name:'柔和降噪',group:'repair',hint:'抑制细小噪点，尽量保留文字边缘；不等同于 AI 去摩尔纹'},
  {id:'receipt',name:'票据清晰',group:'scene',hint:'灰度净底与淡字增强，适合小票和热敏纸'},
  {id:'book',name:'书籍柔和',group:'scene',hint:'柔和灰阶、减轻纸张偏色与书页阴影；不做曲面展平'},
  {id:'whiteboard',name:'白板笔记',group:'scene',hint:'提亮白板背景并保留彩色笔迹；不恢复反光遮住的内容'},
  {id:'stamp',name:'印章保色',group:'scene',hint:'温和清理底色，保留红章、蓝字等颜色；不重绘印章'},
  {id:'ink',name:'省墨打印',group:'scene',hint:'清除浅灰底、以浅黑文字输出；细字材料请核对原图'},
  {id:'gray',name:'柔和灰度',group:'color',hint:'去除颜色，保留灰阶层次'},
  {id:'color',name:'彩色保真',group:'color',hint:'轻度增强，保留图表与印章'},
  {id:'vivid',name:'鲜明彩色',group:'color',hint:'提高颜色饱和度与局部对比，适合图表与插图'},
  {id:'photo',name:'照片增强',group:'color',hint:'提亮细节，不做纸张去灰'}
];
const limit=(v,a,b)=>Math.max(a,Math.min(b,v));
export function analyzePixels(data) {
  if (!data?.length || data.length%4) throw new Error('Invalid analysis pixels');
  const hist=new Uint32Array(256);let neutral=0,count=0;
  const stride=Math.max(1,Math.floor(data.length/4/20000));
  for(let p=0;p<data.length/4;p+=stride) {
    const i=p*4,a=data[i+3]/255;
    const r=data[i]*a+255*(1-a),g=data[i+1]*a+255*(1-a),b=data[i+2]*a+255*(1-a);
    hist[Math.round(.2126*r+.7152*g+.0722*b)]++;count++;
    if(Math.max(r,g,b)-Math.min(r,g,b)<30)neutral++;
  }
  const q=f=>{let sum=0;for(let i=0;i<256;i++){sum+=hist[i];if(sum>=count*f)return i;}return 255;};
  return {low:q(.02),median:q(.5),paper:q(.88),high:q(.98),neutral:neutral/count};
}
export function settingsForMode(stats,id='auto') {
  if(!SCAN_MODES.some(m=>m.id===id))throw new Error('Unknown scan mode');
  const s=stats||{low:30,median:200,paper:230,high:250,neutral:1};
  const shade=limit((245-s.paper)/95,0,1),flat=limit((205-(s.high-s.low))/205,0,1);
  const base={preset:id,mode:'color',clean:0,sharpen:0,contrast:0,brightness:0,threshold:12};
  const modes={
    original:{mode:'original'},
    auto:s.neutral>.64 ? {clean:Math.round(30+shade*58),sharpen:38,contrast:Math.round(5+flat*9),brightness:0}
      : {clean:8,sharpen:24,contrast:6,brightness:Math.round(limit((180-s.median)/18,0,8))},
    document:{clean:Math.round(80+shade*20),sharpen:58,contrast:18,brightness:0},
    bw:{mode:'bw',clean:35,threshold:Math.round(9+flat*6)},
    gray:{mode:'gray',clean:Math.round(20+shade*38),sharpen:22,contrast:4},
    color:{clean:12,sharpen:26,contrast:4},
    photo:{clean:0,sharpen:32,contrast:Math.round(5+flat*8),brightness:Math.round(limit((160-s.median)/16,-3,9))},
    comprehensive:{recipe:true,clean:Math.round(82+shade*18),sharpen:36,contrast:9,tint:.9,denoise:.3,detail:.5,paperWhite:.6},
    shadow:{recipe:true,clean:100,sharpen:18,contrast:3,tint:.9,paperWhite:.3},
    sharpen:{recipe:true,clean:35,sharpen:85,contrast:12,detail:.45},
    faded:{recipe:true,clean:85,sharpen:48,contrast:22,brightness:-2,tint:.7,detail:1},
    denoise:{recipe:true,clean:8,sharpen:0,contrast:2,denoise:.88},
    receipt:{recipe:true,mode:'gray',clean:100,sharpen:40,contrast:24,tint:1,detail:.85,paperWhite:.8},
    book:{recipe:true,mode:'gray',clean:65,sharpen:24,contrast:5,tint:.8,denoise:.2,detail:.15},
    whiteboard:{recipe:true,clean:100,sharpen:32,contrast:10,tint:.8,detail:.25,paperWhite:1,saturation:1.12},
    stamp:{recipe:true,clean:28,sharpen:24,contrast:3,tint:.35,saturation:1.06},
    ink:{recipe:true,mode:'bw',clean:75,threshold:Math.round(16+flat*6),inkSaving:true},
    vivid:{recipe:true,clean:5,sharpen:32,contrast:10,detail:.2,saturation:1.3}
  };
  return {...base,...modes[id]};
}
