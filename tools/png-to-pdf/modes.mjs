/** One-click scan modes. Analysis is image-dependent and reused by preview/export. */
export const SCAN_MODES = [
  {id:'auto',name:'自动增强',hint:'自动判断明暗与纸张底色'},
  {id:'document',name:'文档净白',hint:'强化文字、淡化灰底与阴影'},
  {id:'bw',name:'黑白扫描',hint:'纯黑白文字，适合打印'},
  {id:'gray',name:'柔和灰度',hint:'去除颜色，保留灰阶层次'},
  {id:'color',name:'彩色保真',hint:'轻度增强，保留图表与印章'},
  {id:'photo',name:'照片增强',hint:'提亮细节，不做纸张去灰'},
  {id:'original',name:'原图',hint:'不增强，保留原始观感'}
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
    photo:{clean:0,sharpen:32,contrast:Math.round(5+flat*8),brightness:Math.round(limit((160-s.median)/16,-3,9))}
  };
  return {...base,...modes[id]};
}
