/* Small progressive enhancements for the catalogue. No network requests. */
(()=>{'use strict';
 if(document.querySelector('.test-collection'))document.title='Test Lab · 个人测评 | Yuxuan Wang';
 if(document.getElementById('talent-atlas'))document.title='Talent Atlas · 天赋潜能图谱 | Yuxuan Wang';
 const buttons=[...document.querySelectorAll('[data-test-filter]')];
 const cards=[...document.querySelectorAll('[data-test-category]')];
 const count=document.getElementById('lab-filter-count');
 for(const b of buttons)b.addEventListener('click',()=>{
  const filter=b.dataset.testFilter;
  for(const button of buttons)button.setAttribute('aria-pressed',String(button===b));
  let visible=0;for(const card of cards){card.hidden=filter!=='all'&&card.dataset.testCategory!==filter;if(!card.hidden)visible++;}
  if(count)count.textContent=visible+' 项测评';
 });
 const radar=document.getElementById('ta-radar');
 if(radar){const labels=['Analysis','Learning','Creation','Building','Empathy','Expression','Initiative','Execution'];
  const fit=()=>radar.querySelectorAll('.ta-radar-label').forEach((n,i)=>{n.setAttribute('x',(250+Math.cos(-Math.PI/2+i*Math.PI/4)*168).toFixed(1));if(document.getElementById('talent-atlas').lang==='en')n.textContent=labels[i];});
  new MutationObserver(fit).observe(radar,{childList:true});fit();
 }
})();
