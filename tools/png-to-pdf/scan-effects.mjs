/** Deterministic, on-device scan enhancement. No models, OCR, network or invented text. */
const clamp=(x,a=0,b=255)=>Math.max(a,Math.min(b,x));
const amount=x=>Number.isFinite(x)?clamp(x,0,1):0;
const luma=(a,i)=>.2126*a[i]+.7152*a[i+1]+.0722*a[i+2];

function localMean(src,w,h,r) {
  const tmp=new Float32Array(src.length),out=new Float32Array(src.length);
  for(let y=0;y<h;y++){
    let sum=0,left=0,right=-1;
    for(let x=0;x<w;x++){
      const lo=Math.max(0,x-r),hi=Math.min(w-1,x+r);
      while(right<hi)sum+=src[y*w+(++right)];
      while(left<lo)sum-=src[y*w+left++];
      tmp[y*w+x]=sum/(hi-lo+1);
    }
  }
  for(let x=0;x<w;x++){
    let sum=0,top=0,bottom=-1;
    for(let y=0;y<h;y++){
      const lo=Math.max(0,y-r),hi=Math.min(h-1,y+r);
      while(bottom<hi)sum+=tmp[(++bottom)*w+x];
      while(top<lo)sum-=tmp[top++*w+x];
      out[y*w+x]=sum/(hi-lo+1);
    }
  }
  return out;
}

/** Flatten alpha on white, estimate paper cast from bright neutral pixels, then bilateral denoise. */
export function prepareScan(input,w,h,options={}) {
  const tint=amount(options.tint),denoise=amount(options.denoise);
  if(!tint&&!denoise)return input;
  let out=new Uint8ClampedArray(input.length);
  const hist=new Uint32Array(256),n=w*h;
  for(let i=0;i<input.length;i+=4){
    const a=input[i+3]/255;
    for(let c=0;c<3;c++)out[i+c]=input[i+c]*a+255*(1-a);
    out[i+3]=255;hist[Math.round(luma(out,i))]++;
  }
  if(tint){
    let sum=0,q=0;while(q<255&&sum+hist[q]<n*.65)sum+=hist[q++];
    const sums=[0,0,0];let count=0;
    for(let i=0;i<out.length;i+=4){
      const spread=Math.max(out[i],out[i+1],out[i+2])-Math.min(out[i],out[i+1],out[i+2]);
      if(luma(out,i)>=Math.max(60,q)&&spread<90){for(let c=0;c<3;c++)sums[c]+=out[i+c];count++;}
    }
    if(count>=Math.max(1,n*.04)){
      const target=(sums[0]+sums[1]+sums[2])/3;
      const gains=sums.map(v=>clamp(target/Math.max(count,v),.8,1.25));
      for(let i=0;i<out.length;i+=4){
        const spread=Math.max(out[i],out[i+1],out[i+2])-Math.min(out[i],out[i+1],out[i+2]);
        const mix=tint*clamp(1-(spread-55)/100,0,1);
        for(let c=0;c<3;c++)out[i+c]*=1+(gains[c]-1)*mix;
      }
    }
  }
  if(denoise){
    const src=out;out=new Uint8ClampedArray(src.length);
    const lum=new Float32Array(n);for(let p=0;p<n;p++)lum[p]=luma(src,p*4);
    const weights=Float32Array.from({length:256},(_,d)=>Math.exp(-d*d/(2*18*18)));
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const p=y*w+x,i=p*4;let total=0,r=0,g=0,b=0;
      for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++){
        const j=(yy*w+xx)*4,d=Math.round(Math.abs(lum[p]-lum[yy*w+xx]));
        // Chroma gating protects colored pen lines even when luminance matches paper.
        const chroma=Math.max(Math.abs(src[i]-src[j]),Math.abs(src[i+1]-src[j+1]),Math.abs(src[i+2]-src[j+2]));
        const weight=weights[d]*(chroma>55?.05:1);
        total+=weight;r+=src[j]*weight;g+=src[j+1]*weight;b+=src[j+2]*weight;
      }
      out[i]=src[i]*(1-denoise)+r/total*denoise;
      out[i+1]=src[i+1]*(1-denoise)+g/total*denoise;
      out[i+2]=src[i+2]*(1-denoise)+b/total*denoise;out[i+3]=255;
    }
  }
  return out;
}

/** Apply bounded local contrast, neutral-paper whitening and optional color/print rendering. */
export function finishScan(out,w,h,options={}) {
  if(options.mode==='bw'){
    if(options.inkSaving)for(let i=0;i<out.length;i+=4)if(out[i]===0)out[i]=out[i+1]=out[i+2]=72;
    return out;
  }
  const detail=amount(options.detail),paper=amount(options.paperWhite);
  const sat=Number.isFinite(options.saturation)?clamp(options.saturation,0,1.6):1;
  if(!detail&&!paper&&sat===1)return out;
  const lum=new Float32Array(w*h);for(let p=0;p<lum.length;p++)lum[p]=luma(out,p*4);
  const local=detail?localMean(lum,w,h,Math.max(1,Math.round(Math.min(w,h)*.006))):null;
  for(let p=0;p<lum.length;p++){
    const i=p*4,l=lum[p];
    const delta=local?clamp((l-local[p])*detail*1.6,-52,16):0;
    const spread=Math.max(out[i],out[i+1],out[i+2])-Math.min(out[i],out[i+1],out[i+2]);
    const neutral=clamp(1-spread/65,0,1);
    const lift=paper*neutral*Math.pow(clamp((l+delta-205)/50,0,1),2);
    for(let c=0;c<3;c++){
      const v=l+(out[i+c]-l)*sat+delta;
      out[i+c]=v+(255-v)*lift;
    }
  }
  return out;
}
