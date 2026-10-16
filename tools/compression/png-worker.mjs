import {optimizePng,encodePng} from './png-codec.mjs';
self.onmessage=async({data:d})=>{try{const blob=d.kind==='lossless'?await optimizePng(d.blob):await encodePng(d.pixels,d.width,d.height,d.bits);self.postMessage({blob});}catch(e){self.postMessage({error:e.message});}};
