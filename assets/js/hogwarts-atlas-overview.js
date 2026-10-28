/* Public Atlas can issue one-use admission tickets to new or existing Hogwarts visitors. */
(function(){
  "use strict";
  var atlas=window.HogwartsAtlas,geo=window.HogwartsGeography,scenes=window.HogwartsScenes;
  var chart=document.getElementById("ga-chart");
  if(!atlas||!geo||!scenes||!chart)return;
  var $=function(id){return document.getElementById(id)};
  var state={selected:"gate",focused:false,region:"all",secrets:false,query:"",zoom:1,route:null};
  var sessionKey="hogwarts:session:v2",transferKey="hogwarts:atlas:transfer:v1";
  function validSession(){
    try{
      var item=JSON.parse(window.sessionStorage.getItem(sessionKey)||"null");
      var age=item?Date.now()-item.issued:-1;
      return item&&typeof item.id==="string"&&/^[a-f0-9]{32}$/.test(item.id)&&
        typeof item.issued==="number"&&age>=0&&age<=21600000&&
        Array.isArray(item.visited)&&typeof item.current==="string"&&
        atlas.byPath[item.current]&&item.visited.includes(atlas.byPath[item.current])?item:null;
    }catch(error){return null}
  }
  function travelTo(id){
    if(!atlas.rooms[id]||(!state.secrets&&geo.nodes[id].hidden))return;
    // Only Atlas or Platform 9¾ can start a scene journey. First-time Atlas
    // transfers create the visitor session at the destination after validation.
    var journey=validSession();
    try{
      var bytes=new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      var nonce=Array.from(bytes,function(value){return value.toString(16).padStart(2,"0")}).join("");
      var destination=atlas.rooms[id].path;
      window.sessionStorage.setItem(transferKey,JSON.stringify({
        from:"/hogwarts/atlas/",to:destination,sessionId:journey?journey.id:null,at:Date.now(),nonce:nonce
      }));
      window.location.assign(destination);
    }catch(error){
      $("ga-visit-hint").textContent="Unable to create a passage ticket. Check that browser session storage is available.";
    }
  }

  var labels={canon:"Book location",inferred:"Reconstructed link or scene",invented:"Original site addition"};
  var sourceTiers={"chapter-cited secondary index":"Chapter-based secondary index","official encyclopedia":"Official encyclopedia","official editorial feature":"Official feature","later author expansion":"Later author material"};
  function safe(value){return String(value==null?"":value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]})}
  function visibleIds(){return Object.keys(geo.nodes).filter(function(id){return state.secrets||!geo.nodes[id].hidden})}
  function matches(id){var node=geo.nodes[id],room=atlas.rooms[id];return !state.query||(node.label+" "+room.name+" "+room.path).toLowerCase().includes(state.query)}
  function sourceLink(key){
    var source=geo.sources[key];if(!source)return "";
    return '<a href="'+safe(source.url)+'" target="_blank" rel="noopener noreferrer">'+safe(source.title)+' ↗</a><small>'+safe((source.books||[]).join(" · "))+'</small>';
  }
  function routePairs(){var pairs=new Set();if(state.route)for(var i=1;i<state.route.length;i++)pairs.add(geo.edgeKey(state.route[i-1],state.route[i]));return pairs}
  function diagramBox(){
    if(state.region==='all'||state.region==='unmapped')return [0,0,1200,3610];
    return (geo.overviewSections.find(function(section){return section.id===state.region})||{}).box||[0,0,1200,3610];
  }
  function insideBox(id,box){
    var point=geo.nodes[id].position;
    return point[0]>=box[0]&&point[0]<=box[0]+box[2]&&point[1]>=box[1]&&point[1]<=box[1]+box[3];
  }
  // Route long cross-floor links around node labels. Intermediate bends are
  // drawing coordinates only, never extra destinations or compass claims.
  var drawingRoutes={
    'entry|gate':{from:'gate',via:[[70,675],[70,1070]]},
    'basementPassage|entry':{from:'entry',via:[[160,1115],[565,1115]]},
    'corridor|staircase':{from:'staircase',via:[[10,1150],[10,280],[420,280]]},
    'firstFloorJunction|staircase':{from:'staircase',via:[[30,1150],[30,445]]},
    'midFloorStair|staircase':{from:'staircase',via:[[50,1150],[50,590],[700,590]]},
    'corridor|requirement':{from:'corridor',via:[[520,198],[520,60],[900,60]]},
    'bathroom|sluice':{from:'bathroom',via:[[1190,525],[1190,1380],[105,1380]]}
  };
  function edgePath(edge){
    var a=geo.nodes[edge.a].position,b=geo.nodes[edge.b].position,detour=drawingRoutes[edge.key];
    if(detour){var via=detour.from===edge.a?detour.via:detour.via.slice().reverse();return 'M'+[a].concat(via,[b]).map(function(point){return point.join(',')}).join('L')}
    var dx=b[0]-a[0],dy=b[1]-a[1];
    if(Math.abs(dx)<35||Math.abs(dy)<35)return "M"+a.join(",")+"L"+b.join(",");
    if(Math.abs(dx)>Math.abs(dy))return "M"+a.join(",")+"C"+(a[0]+dx*.5)+","+a[1]+" "+(a[0]+dx*.5)+","+b[1]+" "+b.join(",");
    return "M"+a.join(",")+"C"+a[0]+","+(a[1]+dy*.5)+" "+b[0]+","+(a[1]+dy*.5)+" "+b.join(",");
  }
  function renderGraph(){
    var ids=visibleIds(),edges=geo.edges(state.secrets),neighbors=geo.neighbors(state.selected,state.secrets),pathPairs=routePairs(),box=diagramBox();
    var html='<title id="chart-title">Hogwarts Passage Map</title><desc id="chart-desc">Solid lines indicate connections supported by book references; dashed lines indicate reconstructed passages; dotted lines indicate secret entrances. Select a location to view its neighbouring scenes, URL and references.</desc>';
    geo.overviewSections.forEach(function(section){
      if(section.secret&&!state.secrets)return;
      var box=section.box;
      html+='<g class="ga-zone'+(section.secret?' is-secret':'')+'"><rect x="'+box[0]+'" y="'+box[1]+'" width="'+box[2]+'" height="'+box[3]+'" rx="12"></rect><text x="'+(box[0]+20)+'" y="'+(box[1]+26)+'">'+safe(section.title)+'</text></g>';
    });
    html+='<g aria-hidden="true">';
    edges.forEach(function(edge){
      var connected=edge.a===state.selected||edge.b===state.selected;
      var dim=(state.focused&&!connected||state.region==='unmapped'&&!geo.nodes[edge.a].hidden&&!geo.nodes[edge.b].hidden)&&!pathPairs.has(edge.key);
      var css='ga-edge'+(edge.status==='canon'?' is-canon':'')+(edge.secret?' is-secret':'')+(connected&&state.focused?' is-connected':'')+(dim?' is-dim':'')+(pathPairs.has(edge.key)?' is-route':'');
      html+='<path class="'+css+'" data-edge="'+safe(edge.key)+'" d="'+edgePath(edge)+'"></path>';
    });
    html+='</g>';
    ids.forEach(function(id){
      var node=geo.nodes[id],selected=id===state.selected,near=selected||neighbors.includes(id),inRoute=state.route&&state.route.includes(id);
      var touchesHidden=edges.some(function(edge){return edge.a===id&&geo.nodes[edge.b].hidden||edge.b===id&&geo.nodes[edge.a].hidden});
      var dim=(!matches(id))||(state.query?false:state.focused&&!near&&!inRoute)||(state.region==='unmapped'&&!node.hidden&&!touchesHidden);
      var css='ga-point'+(selected?' is-selected':'')+(node.hidden?' is-hidden':'')+(inRoute?' is-route':'')+(dim?' is-dim':'');
      // Keep long English place names legible without making the chart unwieldy.
      // Full names remain available in aria-label, the detail pane and the directory.
      var caption=node.label.length>24?node.label.slice(0,22).trimEnd()+"…":node.label;
      var width=Math.max(148,Math.min(230,Math.round(caption.length*7.25+32)));
      var inView=insideBox(id,box);
      html+='<g class="'+css+'" data-room="'+safe(id)+'" data-status="'+safe(node.status)+'" transform="translate('+node.position.join(',')+')" tabindex="'+(inView?'0':'-1')+'"'+(inView?'':' aria-hidden="true"')+' role="button" aria-pressed="'+selected+'" aria-label="View connections for '+safe(node.label)+'">'+
        '<rect x="'+(-width/2)+'" y="-21" width="'+width+'" height="42"></rect><circle cx="'+(-width/2+12)+'" cy="0" r="3.1"></circle><text x="7" y="4.5" text-anchor="middle">'+safe(caption)+'</text></g>';
    });
    chart.innerHTML=html;
    chart.setAttribute('viewBox',box.join(' '));
    chart.style.aspectRatio=box[2]+" / "+box[3];
    // Preserve a readable label size; small regions can scroll horizontally.
    var baseline=state.region==='all'||state.region==='unmapped'?1250:
      Math.max(740,Math.min(1200,box[2]*1.08));
    chart.style.minWidth='0';
    chart.style.width='calc(max(100%, '+baseline+'px) * '+state.zoom+')';
    $("ga-zoom-reset").textContent=Math.round(state.zoom*100)+'%';
    $("ga-zoom-out").disabled=state.zoom<=.65;
    $("ga-zoom-in").disabled=state.zoom>=2;
    $("ga-focus-clear").disabled=!state.focused&&!state.route;
    $("ga-chart-status").textContent=(state.query?ids.filter(matches).length+' matches · ':'')+ids.length+' places · '+edges.length+' connections';
  }
  function renderDetail(){
    var id=state.selected,node=geo.nodes[id],room=atlas.rooms[id],image=$("ga-detail-image");
    image.src=scenes[id].src;image.alt=scenes[id].alt;
    $("ga-detail-title").textContent=node.label;
    $("ga-detail-en").textContent=room.name===node.label?"":room.name;
    $("ga-detail-status").textContent=labels[node.status]||labels.inferred;
    $("ga-detail-floor").textContent=node.floor;
    $("ga-detail-note").textContent=node.note;
    $("ga-detail-url").textContent=room.path;
    $("ga-visit").disabled=false;
    $("ga-visit").textContent="Enter This Place ↗";
    $("ga-visit-hint").textContent="Enter this place directly from the Atlas, without visiting Platform 9¾ first. Typing a scene URL alone never grants entry.";
    $("ga-neighbors").innerHTML=geo.neighbors(id,state.secrets).map(function(next){
      var edge=geo.edges(state.secrets).find(function(item){return item.key===geo.edgeKey(id,next)});
      var kind=edge.secret?'Reveal entrance first':edge.status==='canon'?'Book-supported connection':'Reconstructed walking route';
      if(id==='sluice'&&next==='bathroom')kind='Return through the pipe with magical help';
      if(id==='chamber'&&next==='sanctum'||id==='sanctum'&&next==='chamber')kind='A different view of the same Chamber';
      return '<li><button type="button" data-select="'+safe(next)+'"><span aria-hidden="true">↳</span>'+safe(geo.nodes[next].label)+'</button><small>'+safe(kind)+'</small></li>';
    }).join('');
    $("ga-detail-sources").innerHTML=node.sources.length?node.sources.map(function(key){return '<li>'+sourceLink(key)+'</li>'}).join(''):'<li><small>An additional site-created scene without an established name in the novels.</small></li>';
  }
  function renderDirectory(){
    var ids=visibleIds().filter(matches);
    $("ga-directory").innerHTML=ids.length?ids.map(function(id){
      var node=geo.nodes[id],room=atlas.rooms[id];
      return '<tr><td><button type="button" data-select="'+safe(id)+'">'+safe(node.label)+'</button><small>'+safe(room.name)+'</small></td><td>'+safe(node.floor)+'<small>'+safe(labels[node.status])+'</small></td><td><code>'+safe(room.path)+'</code><button type="button" class="ga-inline-travel" data-visit="'+safe(id)+'"'+''+'>Go ↗</button></td></tr>';
    }).join(''):'<tr><td colspan="3" class="ga-empty">No matching places. Try an English room name or a URL.</td></tr>';
  }
  function renderRouteOptions(){
    var from=$("ga-route-from").value||'gate',to=$("ga-route-to").value||'hut';
    var html=visibleIds().map(function(id){return '<option value="'+safe(id)+'">'+safe(geo.nodes[id].label)+'</option>'}).join('');
    $("ga-route-from").innerHTML=html;$("ga-route-to").innerHTML=html;
    $("ga-route-from").value=geo.nodes[from]&&(state.secrets||!geo.nodes[from].hidden)?from:'gate';
    $("ga-route-to").value=geo.nodes[to]&&(state.secrets||!geo.nodes[to].hidden)?to:'hut';
  }
  function renderRoute(){
    if(!state.route){$("ga-route-result").innerHTML='';return}
    var result=state.route;
    var hidden=result.some(function(id){return geo.nodes[id].hidden});
    $("ga-route-result").innerHTML='<strong>'+Math.max(0,result.length-1)+' passages</strong>'+(hidden?' · Includes hidden passages that must first be revealed.':' · Follow the scenes in this order.')+
      '<ol>'+result.map(function(id){return '<li><button type="button" data-select="'+safe(id)+'">'+safe(geo.nodes[id].label)+'</button></li>'}).join('')+'</ol>';
  }
  function selectRoom(id){
    if(!geo.nodes[id]||!state.secrets&&geo.nodes[id].hidden)return;
    state.selected=id;state.focused=true;
    if(!insideBox(id,diagramBox())){state.region='all';$("ga-region").value='all'}
    renderGraph();renderDetail();
    var point=chart.querySelector('[data-room="'+id+'"]');
    if(point)point.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  chart.addEventListener('click',function(event){var node=event.target.closest('[data-room]');if(node)selectRoom(node.getAttribute('data-room'))});
  chart.addEventListener('keydown',function(event){
    if(event.key!=='Enter'&&event.key!==' ')return;
    var node=event.target.closest('[data-room]');if(!node)return;
    event.preventDefault();var id=node.getAttribute('data-room');selectRoom(id);
    var replacement=chart.querySelector('[data-room="'+id+'"]');if(replacement)replacement.focus();
  });
  document.addEventListener('click',function(event){
    var jump=event.target.closest('[data-visit]');
    if(jump){event.preventDefault();travelTo(jump.getAttribute('data-visit'));return}
    var target=event.target.closest('[data-select]');if(!target)return;
    var id=target.getAttribute('data-select');selectRoom(id);
    var point=chart.querySelector('[data-room="'+id+'"]');if(point)point.focus({preventScroll:true});
    if(target.closest('#ga-directory'))$("atlas-map").scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  });
  $("ga-visit").addEventListener("click",function(){travelTo(state.selected)});
  $("ga-search").addEventListener('input',function(){state.query=this.value.trim().toLowerCase();renderGraph();renderDirectory()});
  geo.sections.forEach(function(section){
    var option=document.createElement('option');option.value=section.id;option.textContent=section.secret?'Concealed routes (across floors)':section.zh;option.hidden=!!section.secret;option.disabled=!!section.secret;$("ga-region").appendChild(option);
  });
  $("ga-region").addEventListener('change',function(){state.region=this.value;state.focused=false;state.zoom=1;renderGraph();$("ga-map-scroll").scrollTop=0;$("ga-map-scroll").scrollLeft=0});
  $("ga-secrets").addEventListener('change',function(){
    state.secrets=this.checked;
    if(!state.secrets&&geo.nodes[state.selected].hidden)state.selected='gate';
    if(!state.secrets&&geo.sections.some(function(section){return section.secret&&section.id===state.region})){state.region='all';$("ga-region").value='all'}
    geo.sections.filter(function(section){return section.secret}).forEach(function(section){var option=$("ga-region").querySelector('[value="'+section.id+'"]');if(option){option.hidden=!state.secrets;option.disabled=!state.secrets}});
    if(state.route&&state.route.some(function(id){return !state.secrets&&geo.nodes[id].hidden}))state.route=null;
    renderGraph();renderDetail();renderDirectory();renderRouteOptions();renderRoute();
  });
  $("ga-zoom-in").addEventListener('click',function(){state.zoom=Math.min(2,state.zoom+.15);renderGraph()});
  $("ga-zoom-out").addEventListener('click',function(){state.zoom=Math.max(.65,state.zoom-.15);renderGraph()});
  $("ga-zoom-reset").addEventListener('click',function(){state.zoom=1;renderGraph()});
  $("ga-focus-clear").addEventListener('click',function(){state.focused=false;state.route=null;renderGraph();renderRoute()});
  $("ga-route-form").addEventListener('submit',function(event){
    event.preventDefault();state.route=geo.route($("ga-route-from").value,$("ga-route-to").value,state.secrets);
    state.region='all';$("ga-region").value='all';
    renderGraph();renderRoute();
    if(!state.route)$("ga-route-result").textContent='No route is available under the current spoiler settings.';
  });
  $("ga-route-clear").addEventListener('click',function(){state.route=null;renderGraph();renderRoute()});
  $("ga-export").addEventListener('click',function(){
    var copy=chart.cloneNode(true),style=document.createElementNS('http://www.w3.org/2000/svg','style');
    style.textContent='.ga-zone rect{fill:#efefe3;stroke:#d7ddce}.ga-zone text{font:700 15px sans-serif;fill:#52745e}.ga-edge{fill:none;stroke:#9caa96;stroke-width:1.65;stroke-dasharray:5 5}.ga-edge.is-canon{stroke:#4f7460;stroke-dasharray:none;stroke-width:2.3}.ga-edge.is-secret{stroke:#9a6271;stroke-dasharray:3 6}.ga-edge.is-route{stroke:#bf8a34;stroke-width:5;stroke-dasharray:none}.ga-point rect{fill:#fcfaf3;stroke:#adbdab;stroke-width:1.3;rx:5}.ga-point text{fill:#264b36;font:650 14.5px sans-serif}.ga-point circle{fill:#66846d}.ga-point[data-status=inferred] circle{fill:#b09460}.ga-point[data-status=invented] circle{fill:#a0a69a}.ga-point.is-hidden rect{stroke:#ae7c88;stroke-dasharray:3 2}.ga-point.is-selected rect{fill:#dfebdb;stroke:#294f3b;stroke-width:2.5}.ga-point.is-route rect{fill:#f3e7c6;stroke:#af8037;stroke-width:2.5}';
    copy.insertBefore(style,copy.firstChild);copy.removeAttribute('style');
    var view=copy.getAttribute('viewBox').split(' ').map(Number);copy.setAttribute('width',view[2]);copy.setAttribute('height',view[3]);
    var blob=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='hogwarts-atlas-'+state.region+'.svg';document.body.appendChild(link);link.click();link.remove();window.setTimeout(function(){URL.revokeObjectURL(url)},1000);
  });
  $("ga-total").textContent=Object.keys(atlas.rooms).length;
  $("ga-secret-total").textContent=Object.values(atlas.rooms).filter(function(room){return !!room.secret}).length;
  $("ga-paths").textContent=geo.edges(true).filter(function(edge){return !edge.secret}).length;
  $("ga-bibliography").innerHTML=Object.keys(geo.sources).map(function(key){var source=geo.sources[key];return '<li>'+sourceLink(key)+'<small>'+safe(sourceTiers[source.tier]||source.tier)+'</small></li>'}).join('');
  var session=validSession();
  if(session){
    var current=atlas.byPath[session.current];
    $("ga-return").href=atlas.rooms[current].path;
    $("ga-return").setAttribute("data-visit",current);
    $("ga-return").textContent="Return to the Current Journey ↗";
  }
  renderGraph();renderDetail();renderDirectory();renderRouteOptions();
})();
