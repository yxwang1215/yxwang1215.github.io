/* Shared personality engine. All scoring and storage stay in the browser. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.PERSONALITY=api;if(root.document)api.mount(root.document.getElementById('personality-app'),root.PERSONALITY_DATA);}})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const valid=v=>Number.isInteger(v)&&v>=1&&v<=5;
function score(spec,answers){
 if(!answers||typeof answers!=='object')throw Error('Incomplete answers');
 const groups={};for(const a of [...spec.axes,...spec.contexts])groups[a.id]=[];
 for(const q of spec.items){if(!own(answers,q.id)||!valid(answers[q.id]))throw Error('Incomplete or invalid answer: '+q.id);groups[q.axis].push(q.reverse?6-answers[q.id]:answers[q.id]);}
 const rows=list=>list.map(a=>{const vs=groups[a.id],raw=vs.reduce((s,v)=>s+v,0)/vs.length;const value=Math.round((raw-1)*250)/10;const band=value>60?'high':value<40?'low':'middle';return {...a,value,raw:Math.round(raw*100)/100,band,advice:band==='high'?a.adviceHigh:band==='low'?a.adviceLow:'本次作答处于中间区域。可分别尝试两种方式，记录在不同情境中哪一种更适合自己。'};});
 const axes=rows(spec.axes),contexts=rows(spec.contexts);
 const type=spec.id==='compass'?axes.map(a=>a.value>57?a.positive:a.value<43?a.negative:'X').join(''):null;
 const raw=spec.items.map(q=>answers[q.id]),neutral=raw.filter(v=>v===3).length;
 return {id:spec.id,version:spec.version,axes,contexts,type,quality:{lowVariation:new Set(raw).size===1||neutral/raw.length>.8},notice:'自我报告范围分；不是人群百分位、能力等级、临床诊断或未来表现预测。'};
}
function restoreSession(spec,text){
 try{const s=JSON.parse(text);if(!s||s.id!==spec.id||s.version!==spec.version||!s.answers||typeof s.answers!=='object'||Array.isArray(s.answers))return null;const answers={};for(const q of spec.items)if(own(s.answers,q.id)&&valid(s.answers[q.id]))answers[q.id]=s.answers[q.id];return {id:spec.id,version:spec.version,answers,page:Math.max(0,Math.min(Math.ceil(spec.items.length/spec.pageSize)-1,Number.isInteger(s.page)?s.page:0)),completed:s.completed===true&&Object.keys(answers).length===spec.items.length,completedAt:typeof s.completedAt==='string'?s.completedAt:null};}catch(_){return null;}
}
const names={ISTJ:'稳健组织型',ISFJ:'细致支持型',INFJ:'价值整合型',INTJ:'系统规划型',ISTP:'实作探索型',ISFP:'体验表达型',INFP:'内在探索型',INTP:'概念分析型',ESTP:'行动应变型',ESFP:'现场互动型',ENFP:'联想探索型',ENTP:'方案碰撞型',ESTJ:'务实推进型',ESFJ:'关系协调型',ENFJ:'共识推动型',ENTJ:'目标统筹型'};
function mount(app,data){
 if(!app||!data||!own(data,app.dataset.inventory))return;
 document.title=data[app.dataset.inventory].title+' · Test Lab | Yuxuan Wang';
 const spec=data[app.dataset.inventory],view=app.querySelector('#personality-view'),key='yxwang-personality-'+spec.id+'-v1';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let storageOK=true,session=null,state='intro',english=false;
 try{session=restoreSession(spec,localStorage.getItem(key));}catch(_){storageOK=false;}
 function persist(){try{localStorage.setItem(key,JSON.stringify(session));storageOK=true;}catch(_){storageOK=false;}const n=app.querySelector('[data-save-status]');if(n)n.textContent=storageOK?'进度保存在当前浏览器，可稍后继续。':'本浏览器不允许保存；离开页面后进度可能丢失。';}
 function clear(){try{localStorage.removeItem(key);}catch(_){storageOK=false;}session=null;}
 const button=(action,label,primary=false)=>'<button type="button" class="lab-button'+(primary?' lab-button-primary':'')+'" data-action="'+action+'">'+label+'</button>';
 const basis='<p class="lab-basis">'+esc(spec.basis)+'</p>';
 function intro(){
 state='intro';app.dataset.screen=state;
 view.innerHTML='<header class="lab-intro"><div><span class="lab-kicker">'+esc(spec.en)+'</span><h1>'+esc(spec.title)+'</h1><p class="lab-lead">'+esc(spec.description)+'</p><div class="lab-meta"><span>'+spec.items.length+' 道题</span><span>约 '+spec.minutes+' 分钟</span><span>无需注册 · 本地计算</span></div></div><div class="lab-intro-side"><span class="lab-mini-title">了解自己，不是定义自己</span><p>按照通常的真实状态回答。没有正确答案，也没有哪一种性格更好。</p></div></header><div class="lab-start-grid"><section class="lab-start-card"><h2>给自己一段不被打断的时间</h2><p>每页 '+spec.pageSize+' 道题，可以返回修改。完成后立即查看完整报告，不需要邮箱或付费。</p>'+button('start','开始测试 <span aria-hidden="true">→</span>',true)+(session?'<div class="lab-resume"><p>本浏览器已保存 '+Object.keys(session.answers).length+' / '+spec.items.length+' 题。</p>'+button('resume',session.completed?'查看上次报告':'继续上次进度')+button('clear','删除本地记录')+'</div>':'')+'</section><section class="lab-overview"><h2>这项测试观察什么？</h2><div class="lab-domain-tags">'+spec.axes.map(a=>'<span>'+esc(a.zh)+'</span>').join('')+'</div><p>'+(spec.id==='compass'?'前 32 题用于四维倾向，后 32 题用于学习、工作、关系和沟通建议。情境题不会改变类型结果。':'每个维度各 10 题，保留正向与反向计分。各维度单独展示，不计算“人格总分”。')+'</p>'+basis+'</section></div><p class="lab-muted" data-save-status>'+ (storageOK?'答案仅保存在当前浏览器，不向本站提交。':'本浏览器不允许保存；可继续答题，但不能跨页面保留进度。')+'</p>';
 }
 function focusHeading(){const h=view.querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});h.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
 function current(){return spec.items.slice(session.page*spec.pageSize,(session.page+1)*spec.pageSize);}
 function controls(){
 const n=Object.keys(session.answers).length,next=app.querySelector('[data-action="next"]'),complete=current().every(q=>valid(session.answers[q.id]));
 if(next)next.disabled=!complete;
 const bar=app.querySelector('[role="progressbar"]');if(bar){bar.setAttribute('aria-valuenow',n);bar.querySelector('span').style.width=100*n/spec.items.length+'%';}
 const count=app.querySelector('#personality-count');if(count)count.textContent='已回答 '+n+' / '+spec.items.length+' 题';
 const hint=app.querySelector('#personality-hint');if(hint)hint.textContent=complete?'本页已完成，可以继续。':'请完成本页全部问题后继续。';
 }
 function quiz(focus=true){
 state='quiz';app.dataset.screen=state;
 const pages=Math.ceil(spec.items.length/spec.pageSize),section=spec.id==='compass'?(session.page<4?'四维偏好':spec.contexts[session.page-4].zh+' · 情境补充'):'日常行为倾向';
 view.innerHTML='<div class="lab-quiz-top">'+button('exit','← 保存并退出')+'<span>'+esc(spec.en)+'</span></div><header class="lab-quiz-heading"><div><span class="lab-kicker">'+esc(section)+'</span><h2>选择最符合自己的描述</h2><p>按照通常的真实状态作答，不必追求理想答案。</p></div><span class="lab-page-index">'+(session.page+1)+' / '+pages+' 页</span></header><div class="lab-progress" role="progressbar" aria-label="测试完成进度" aria-valuemin="0" aria-valuemax="'+spec.items.length+'" aria-valuenow="0"><span></span></div><div class="lab-question-toolbar"><span id="personality-count" aria-live="polite"></span><label class="lab-english"><input type="checkbox" id="personality-english"'+(english?' checked':'')+'> 同时显示英文题目</label></div><form id="personality-form"><div class="lab-questions">'+current().map((q,i)=>'<fieldset class="lab-question"><legend><span class="lab-question-index">'+String(session.page*spec.pageSize+i+1).padStart(2,'0')+'</span><span>'+esc(q.zh)+'</span></legend><p class="lab-item-english"'+(english?'':' hidden')+'>'+esc(q.en)+'</p><div class="lab-scale">'+['很不符合','较不符合','中间 / 不确定','比较符合','非常符合'].map((label,j)=>'<label class="lab-option"><input type="radio" name="'+q.id+'" value="'+(j+1)+'" data-question="'+q.id+'"'+(session.answers[q.id]===j+1?' checked':'')+'><span class="lab-option-number">'+(j+1)+'</span><span>'+label+'</span></label>').join('')+'</div></fieldset>').join('')+'</div></form><div class="lab-quiz-actions"><button type="button" class="lab-button" data-action="previous"'+(session.page===0?' disabled':'')+'>← 上一页</button><span id="personality-hint" aria-live="polite"></span>'+button('next',session.page===pages-1?'生成完整报告 →':'下一页 →',true)+'</div><p class="lab-muted" data-save-status></p>';
 controls();persist();if(focus)focusHeading();
 }
 function row(a){const middle=a.band==='middle';const summary=middle?'你的作答位于这条维度的中间区域，可能会随情境表现出两端特点。':a.band==='high'?a.highText:a.lowText;return '<article class="lab-trait"><div class="lab-trait-title"><div><h3>'+esc(a.zh)+'</h3><span>'+esc(a.en)+'</span></div><strong>'+a.value.toFixed(1)+'<small> / 100</small></strong></div><div class="lab-trait-track" role="img" aria-label="'+esc(a.zh)+'：'+a.value+'，0 端为'+esc(a.low)+'，100 端为'+esc(a.high)+'"><span class="lab-trait-center"></span><span class="lab-trait-marker" style="left:clamp(8px,'+a.value+'%,calc(100% - 8px))"></span></div><div class="lab-poles"><span>'+esc(a.low)+'</span><span>'+esc(a.high)+'</span></div><p>'+esc(summary)+'</p><p class="lab-trait-advice"><strong>可以试试</strong> '+esc(a.advice)+'</p></article>';}
 function report(){
 state='results';app.dataset.screen=state;const r=score(spec,session.answers),ambiguous=r.type&&r.type.includes('X');
 const headline=r.type?(ambiguous?'你的偏好不必被强行归类':names[r.type]):'你的五维人格画像';
 view.innerHTML='<header class="lab-result-heading"><span class="lab-kicker">'+esc(spec.en)+' · 自我探索报告</span><h1>'+headline+'</h1>'+(r.type?'<div class="lab-type">'+r.type+'</div>':'')+'<p class="lab-lead">'+(r.type?(ambiguous?'X 表示本次回答在该维度接近中点。请优先查看维度分布，不必强选一个字母。':'这四个字母只是本次作答的偏好摘要，不是能力等级，也不是对你的固定定义。'):'分数表示你的答案在各维度的可能范围中所处的位置，不是与其他人的排名。')+'</p><div class="lab-meta"><span>'+spec.items.length+' / '+spec.items.length+' 题已完成</span><span>版本 '+spec.version+'</span><span>仅供自我了解</span></div></header>'+(r.quality.lowVariation?'<div class="lab-callout" role="status">本次回答较为集中或中立项较多。请谨慎解读细微分差，并结合真实经历与他人反馈。</div>':'')+'<section class="lab-traits" aria-label="维度分布">'+r.axes.map(row).join('')+'</section>'+(r.contexts.length?'<section class="lab-context-section"><div class="lab-section-heading"><h2>把结果带回日常生活</h2><p>以下建议由后 32 道情境题单独生成，不仅依据四字母类型。</p></div><div class="lab-context-grid">'+r.contexts.map(a=>'<article><span class="lab-mini-title">'+esc(a.en)+'</span><h3>'+esc(a.zh)+'</h3><p>'+esc(a.advice)+'</p><small>情境范围分 '+a.value.toFixed(1)+' / 100 · 两端没有优劣</small></article>').join('')+'</div></section>':'')+'<div class="lab-result-actions">'+button('print','打印 / 保存 PDF',true)+button('json','导出报告 JSON')+button('copy','复制摘要')+button('edit','返回修改答案')+button('clear','删除本地记录')+'</div><p id="personality-feedback" class="lab-muted" role="status"></p><details class="lab-method"><summary>计分方式、题目来源与结果边界</summary><p>题目为 1–5 级自我描述；反向题按 6−作答值计分。每个维度独立取均值，并以（均值−1）×25 转为 0–100 范围分。没有人群常模，也没有人格优劣总分。</p><p>'+(spec.id==='compass'?'类型仅使用前 32 题：得分大于 57 采用正向字母，小于 43 采用另一字母；43–57 显示 X。该边界是提示不确定性的设计规则，不是经过验证的心理学分界。后 32 题独立生成四类情境建议。':'IPIP 第四维按情绪稳定性计分，而不是神经质；第五维为思辨 / 想象，不是客观智力或能力分。中文翻译未经独立样本验证。')+'</p><p>文案中“偏向某端”采用范围分 40 / 60 的展示规则，不是常模分类。不要用结果进行招聘筛选、临床诊断或重要人生决策。</p>'+basis+'<a href="'+esc(spec.source)+'" target="_blank" rel="noopener noreferrer">查看框架 / 题目来源 ↗</a><p>答案仅保存在当前浏览器。导出文件不含逐题回答；不会上传答案，也不会把结果写入网址。</p></details>';
 focusHeading();
 }
 function summary(){const r=score(spec,session.answers);return spec.title+(r.type?' · '+r.type:'')+'\n'+r.axes.map(a=>a.zh+'：'+a.value.toFixed(1)+' / 100').join('\n')+'\n'+r.notice;}
 view.addEventListener('submit',e=>e.preventDefault());
 view.addEventListener('change',e=>{const t=e.target;if(t.id==='personality-english'){english=t.checked;view.querySelectorAll('.lab-item-english').forEach(n=>n.hidden=!english);return;}if(!session||!t.matches('[data-question]'))return;const q=spec.items.find(q=>q.id===t.dataset.question);const v=Number(t.value);if(q&&valid(v)){session.answers[q.id]=v;session.completed=false;persist();controls();}});
 view.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;switch(b.dataset.action){
 case 'start':if(session&&Object.keys(session.answers).length&&!confirm('开始新测试将覆盖此项测试的本地记录。继续吗？'))return;session={id:spec.id,version:spec.version,answers:{},page:0,completed:false,completedAt:null};quiz();break;
 case 'resume':if(session)session.completed?report():quiz();break;
 case 'exit':intro();focusHeading();break;
 case 'previous':if(session.page>0){session.page--;quiz();}break;
 case 'next':if(!current().every(q=>valid(session.answers[q.id])))return;if((session.page+1)*spec.pageSize<spec.items.length){session.page++;quiz();}else{session.completed=true;session.completedAt=new Date().toISOString();persist();report();}break;
 case 'edit':session.page=0;quiz();break;
 case 'clear':if(confirm('删除本浏览器中这项测试的全部答案和结果？')){clear();intro();focusHeading();}break;
 case 'print':window.print();break;
 case 'copy':try{await navigator.clipboard.writeText(summary());app.querySelector('#personality-feedback').textContent='摘要已复制。';}catch(_){window.prompt('请复制以下结果摘要：',summary());}break;
 case 'json':{const r=score(spec,session.answers);const output={assessment:spec.title,id:spec.id,version:spec.version,completedAt:session.completedAt,type:r.type,axes:r.axes.map(a=>({id:a.id,name:a.zh,score:a.value})),contexts:r.contexts.map(a=>({id:a.id,name:a.zh,score:a.value,advice:a.advice})),notice:r.notice};const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='personality-'+spec.id+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 }});
 intro();
}
return {score,restoreSession,mount};
});
