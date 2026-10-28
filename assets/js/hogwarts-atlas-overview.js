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
      $("ga-visit-hint").textContent="The map could not seal a passage. Allow session storage and try again.";
    }
  }

  var labels={canon:"Book-attested",inferred:"Reconstructed",invented:"Original addition"};
  var sourceTiers={"chapter-cited secondary index":"Chapter-indexed secondary source","official encyclopedia":"Official encyclopedia","official editorial feature":"Official editorial feature","later author expansion":"Later authorial supplement"};
  function safe(value){return String(value==null?"":value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]})}
  function visibleIds(){return Object.keys(geo.nodes).filter(function(id){return state.secrets||!geo.nodes[id].hidden})}
  function matches(id){var node=geo.nodes[id],room=atlas.rooms[id];return !state.query||(node.label+" "+room.name+" "+room.path).toLowerCase().includes(state.query)}

  var regionNames={
    grounds:"The Grounds & Lakeside",
    keep:"Entrance Hall & Grand Stairs",
    teaching:"First-floor Classrooms",
    academic:"Middle Floors & Library",
    towers:"Seventh Floor & Towers",
    dungeons:"Basement & Dungeons",
    unmapped:"Concealed Entrances",
    hogsmeade:"Hogsmeade Village",
    outerGrounds:"Lake, Forest & Outlying Grounds",
    quidditchGrounds:"Quidditch & Flying Grounds",
    hiddenAnnex:"Secret Passages & Lost Rooms",
    castleAnnex:"Castle Annex & Room of Requirement"
  };
  function regionName(id){return regionNames[id]||"Hogwarts"}
  function floorName(node){
    var floor=String(node.floor||"");
    var level=floor.match(/\b(Ground|First|Second|Third|Fourth|Fifth|Sixth|Seventh)\s+floor\b/i);
    if(level)return level[1]+" floor · "+regionName(node.group);
    if(/七楼/.test(floor))return "Seventh floor · "+regionName(node.group);
    if(/六楼/.test(floor))return "Sixth floor · "+regionName(node.group);
    if(/五楼/.test(floor))return "Fifth floor · "+regionName(node.group);
    if(/四楼/.test(floor))return "Fourth floor · "+regionName(node.group);
    if(/三楼/.test(floor))return "Third floor · "+regionName(node.group);
    if(/二楼/.test(floor))return "Second floor · "+regionName(node.group);
    if(/一楼/.test(floor))return "First floor · "+regionName(node.group);
    if(/地下|地牢|地窖/.test(floor))return "Below ground · "+regionName(node.group);
    if(/湖底|水下/.test(floor))return "Under the Black Lake";
    if(/禁林/.test(floor))return "The Forbidden Forest";
    return regionName(node.group);
  }
  // Pure SVG ink-work; decorative silhouettes are not clickable locations or map edges.
  function engraving(section){
    var b=section.box,scale=Math.max(.58,Math.min(1.4,b[2]/900)),x=b[0]+b[2]-94*scale,y=b[1]+Math.min(114,b[3]*.53);
    var look=section.id;
    var art;
    if(look==="grounds"||look==="outerGrounds"){
      art='<g class="ga-engraving is-forest">'+
        '<path d="M-123 46l23-57 23 57h-14l17 24h-52l16-24zM-69 46l21-48 21 48h-12l16 24h-50l15-24zM-5 46l16-42 16 42H18l13 24H-10L2 46z"/>'+
        '<path d="M-100 70v18M-48 70v18M11 70v18M-132 91Q-68 76-12 91"/>'+
        '<path d="M-142 101q25-10 50 0t50 0t50 0"/></g>';
    }else if(look==="quidditchGrounds"){
      art='<g class="ga-engraving">'+
        '<ellipse cx="-52" cy="24" rx="88" ry="51"/><ellipse cx="-52" cy="24" rx="75" ry="41"/>'+
        '<path d="M-52-28V76M-140 24H35M-110-15V-66M-108-66h-10v13h20v-13h-10M-48-30V-82M-48-82h-10v13h20v-13h-10M15-14V-67M15-67H5v13h20v-13H15"/></g>';
    }else if(look==="hogsmeade"){
      art='<g class="ga-engraving">'+
        '<path d="M-145 61V2l33-27 34 27v59zM-124 61V19h22v42M-68 61V-23l38-34 36 34v84M-40 61V0h21v61M18 61V15l38-28 34 28v46z"/>'+
        '<path d="M-145 2h67M-68-23H6M18 15h72M-105-25l-7-29-6 28M-33-57v-18M40-15l-9-21-6 20M-152 68h250"/></g>';
    }else if(look==="unmapped"||look==="hiddenAnnex"){
      art='<g class="ga-engraving">'+
        '<path d="M-120 67V-45Q-120-69-94-69H-11Q15-69 15-45V67M-109 67V-42Q-109-57-94-57H-11Q4-57 4-42V67M-107-30H3M-107 16H3"/>'+
        '<path d="M-92 65V30Q-92 16-77 16H-33Q-18 16-18 30V65M-50 18V65M-120 72H16M23-30l20-20m-13 35l22 6"/></g>';
    }else{
      art='<g class="ga-engraving">'+
        '<path d="M-137 75V12L-122 1V-43L-105-66L-88-43V-10L-72-22V-72L-53-92L-34-72V-21L-15-10V-53L1-74L18-53V12L32 2V75z"/>'+
        '<path d="M-105-66v-25M-53-92v-25M1-74v-25M-122 1h34M-72-21h38M-15-10h33M-132 68H32"/>'+
        '<path d="M-122 18h34M-72 0h38M-15 18h33M-111 30v-18h12v18M-60 25v-18h12v18M-3 31V13H8v18M-73 74V47Q-73 24-53 24Q-33 24-33 47V74"/>'+
        '<path d="M-146 78H42M-152 84H48"/></g>';
    }
    return '<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') scale('+scale.toFixed(3)+')" aria-hidden="true">'+art+'</g>';
  }
  function shortenLabel(id,width){
    var name=atlas.rooms[id].name.replace(/^The\s+/i,"");
    var length=Math.max(11,Math.floor((width-28)/6.5));
    if(name.length<=length)return name;
    return name.slice(0,length-1).replace(/\s+\S*$/,"").trim()+"…";
  }
  function footprint(x,y,angle){
    return '<g class="ga-footprint" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+angle.toFixed(1)+')" aria-hidden="true">'+
      '<ellipse cx="-9" cy="-7" rx="4.2" ry="7" transform="rotate(-19 -9 -7)"/>'+
      '<ellipse cx="7" cy="9" rx="4.2" ry="7" transform="rotate(18 7 9)"/>'+
      '<circle cx="-13" cy="-15" r="2.1"/><circle cx="-8" cy="-17" r="1.9"/><circle cx="7" cy="17" r="2.1"/><circle cx="12" cy="15" r="1.9"/></g>';
  }

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
    var html='<title id="chart-title">The Hogwarts Atlas</title>'+
      '<desc id="chart-desc">Cartouches mark the rooms. The ink connects real passageways. Select a room for its story and the option to enter.</desc>';
    geo.overviewSections.forEach(function(section){
      if(section.secret&&!state.secrets)return;
      var zone=section.box;
      html+='<g class="ga-zone'+(section.secret?' is-secret':'')+'"><rect x="'+zone[0]+'" y="'+zone[1]+'" width="'+zone[2]+'" height="'+zone[3]+'" rx="8"></rect>'+
        '<text x="'+(zone[0]+19)+'" y="'+(zone[1]+30)+'">'+safe(regionName(section.id))+'</text>'+
        '<text class="ga-zone-ornament" x="'+(zone[0]+zone[2]-34)+'" y="'+(zone[1]+31)+'" text-anchor="middle">✦</text></g>';
      html+=engraving(section);
    });
    html+='<g aria-hidden="true">';
    edges.forEach(function(edge){
      var connected=edge.a===state.selected||edge.b===state.selected;
      var dim=(state.focused&&!connected||state.region==='unmapped'&&!geo.nodes[edge.a].hidden&&!geo.nodes[edge.b].hidden)&&!pathPairs.has(edge.key);
      var css='ga-edge'+(edge.status==='canon'?' is-canon':'')+(edge.secret?' is-secret':'')+
        (connected&&state.focused?' is-connected':'')+(dim?' is-dim':'')+(pathPairs.has(edge.key)?' is-route':'');
      html+='<path class="'+css+'" data-edge="'+safe(edge.key)+'" d="'+edgePath(edge)+'"></path>';
    });
    html+='</g>';
    if(state.route&&state.route.length>1){
      for(var i=1;i<state.route.length;i++){
        var a=geo.nodes[state.route[i-1]].position,b=geo.nodes[state.route[i]].position;
        var angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
        html+=footprint((a[0]*.63+b[0]*.37),(a[1]*.63+b[1]*.37),angle);
        html+=footprint((a[0]*.37+b[0]*.63),(a[1]*.37+b[1]*.63),angle);
      }
    }
    ids.forEach(function(id){
      var node=geo.nodes[id],selected=id===state.selected,near=selected||neighbors.includes(id),inRoute=state.route&&state.route.includes(id);
      var touchesHidden=edges.some(function(edge){return edge.a===id&&geo.nodes[edge.b].hidden||edge.b===id&&geo.nodes[edge.a].hidden});
      var dim=(!matches(id))||(state.query?false:state.focused&&!near&&!inRoute)||(state.region==='unmapped'&&!node.hidden&&!touchesHidden);
      var css='ga-point'+(selected?' is-selected':'')+(node.hidden?' is-hidden':'')+(inRoute?' is-route':'')+(dim?' is-dim':'');
      // Preserve the audited original cartouche bounds; long English labels get a tooltip.
      var charWidth=Array.from(node.label).reduce(function(n,ch){
        var cp=ch.codePointAt(0);return n+(cp>=0x3400&&cp<=0x9fff?14.8:8.2);
      },0);
      var width=Math.max(148,Math.min(212,Math.round(charWidth+34)));
      if(['sluice','chamber','sanctum'].includes(id))width=Math.max(128,Math.min(178,Math.round(charWidth+30)));
      var inView=insideBox(id,box);
      html+='<g class="'+css+'" data-room="'+safe(id)+'" data-status="'+safe(node.status)+'" transform="translate('+node.position.join(',')+')" tabindex="'+(inView?'0':'-1')+'"'+
        (inView?'':' aria-hidden="true"')+' role="button" aria-pressed="'+selected+'" aria-label="Inspect '+safe(atlas.rooms[id].name)+'">'+
        '<rect x="'+(-width/2)+'" y="-21" width="'+width+'" height="42"></rect><circle cx="'+(-width/2+12)+'" cy="0" r="3.1"></circle>'+
        '<text x="7" y="4.5" text-anchor="middle">'+safe(shortenLabel(id,width))+'</text>'+
        '<title>'+safe(atlas.rooms[id].name)+'</title></g>';
    });
    chart.innerHTML=html;
    chart.setAttribute('viewBox',box.join(' '));
    chart.style.aspectRatio=box[2]+" / "+box[3];
    var baseline=state.region==='all'||state.region==='unmapped'?1250:Math.max(740,Math.min(1200,box[2]*1.08));
    chart.style.minWidth='0';
    chart.style.width='calc(max(100%, '+baseline+'px) * '+state.zoom+')';
    $("ga-zoom-reset").textContent=Math.round(state.zoom*100)+'%';
    $("ga-zoom-out").disabled=state.zoom<=.65;
    $("ga-zoom-in").disabled=state.zoom>=2;
    $("ga-focus-clear").disabled=!state.focused&&!state.route;
    $("ga-chart-status").textContent=(state.query?ids.filter(matches).length+' matching · ':'')+ids.length+' places · '+edges.length+' passages';
  }
  function renderDetail(){
    var id=state.selected,node=geo.nodes[id],room=atlas.rooms[id],image=$("ga-detail-image");
    image.src=scenes[id].src;image.alt=scenes[id].alt;
    $("ga-detail-title").textContent=room.name;
    $("ga-detail-en").textContent=room.kicker||regionName(node.group);
    $("ga-detail-status").textContent=labels[node.status]||labels.inferred;
    $("ga-detail-floor").textContent=floorName(node);
    $("ga-detail-note").textContent=room.description;
    $("ga-detail-url").textContent=room.path;
    $("ga-visit").disabled=false;
    $("ga-visit").textContent="✣ Enter This Place ↗";
    $("ga-visit-hint").textContent="The atlas can open a passage; typing this address cannot.";
    $("ga-neighbors").innerHTML=geo.neighbors(id,state.secrets).map(function(next){
      var edge=geo.edges(state.secrets).find(function(item){return item.key===geo.edgeKey(id,next)});
      var kind=edge.secret?'A concealed passage':edge.status==='canon'?'A book-attested connection':'A reconstructed walk';
      if(id==='sluice'&&next==='bathroom')kind='A magically assisted return';
      if(id==='chamber'&&next==='sanctum'||id==='sanctum'&&next==='chamber')kind='Another view of the same chamber';
      return '<li><button type="button" data-select="'+safe(next)+'"><span aria-hidden="true">↳</span>'+safe(atlas.rooms[next].name)+'</button><small>'+safe(kind)+'</small></li>';
    }).join('');
    $("ga-detail-sources").innerHTML=node.sources.length?node.sources.map(function(key){return '<li>'+sourceLink(key)+'</li>'}).join(''):
      '<li><small>This scene is part of the site's original reconstruction.</small></li>';
  }
  function renderDirectory(){
    var ids=visibleIds().filter(matches);
    $("ga-directory").innerHTML=ids.length?ids.map(function(id){
      var node=geo.nodes[id],room=atlas.rooms[id];
      return '<tr><td><button type="button" data-select="'+safe(id)+'">'+safe(room.name)+'</button><small>'+safe(regionName(node.group))+'</small></td>'+
        '<td>'+safe(floorName(node))+'<small>'+safe(labels[node.status])+'</small></td>'+
        '<td><code>'+safe(room.path)+'</code><button type="button" class="ga-inline-travel" data-visit="'+safe(id)+'">Travel ↗</button></td></tr>';
    }).join(''):'<tr><td colspan="3" class="ga-empty">No places match your search. Try a room name or an address.</td></tr>';
  }
  function renderRouteOptions(){
    var from=$("ga-route-from").value||'gate',to=$("ga-route-to").value||'hut';
    var html=visibleIds().map(function(id){return '<option value="'+safe(id)+'">'+safe(atlas.rooms[id].name)+'</option>'}).join('');
    $("ga-route-from").innerHTML=html;$("ga-route-to").innerHTML=html;
    $("ga-route-from").value=geo.nodes[from]&&(state.secrets||!geo.nodes[from].hidden)?from:'gate';
    $("ga-route-to").value=geo.nodes[to]&&(state.secrets||!geo.nodes[to].hidden)?to:'hut';
  }
  function renderRoute(){
    if(!state.route){$("ga-route-result").innerHTML='';return}
    var result=state.route;
    var hidden=result.some(function(id){return geo.nodes[id].hidden});
    $("ga-route-result").innerHTML='<strong>'+Math.max(0,result.length-1)+' passages</strong>'+
      (hidden?' · Contains concealed entrances.':' · Follow these rooms in order.')+
      '<ol>'+result.map(function(id){return '<li><button type="button" data-select="'+safe(id)+'">'+safe(atlas.rooms[id].name)+'</button></li>'}).join('')+'</ol>';
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
    var option=document.createElement('option');option.value=section.id;option.textContent=regionName(section.id);option.hidden=!!section.secret;option.disabled=!!section.secret;$("ga-region").appendChild(option);
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
    if(!state.route)$("ga-route-result").textContent="No connected route is available with these map settings.";
  });
  $("ga-route-clear").addEventListener('click',function(){state.route=null;renderGraph();renderRoute()});
  $("ga-export").addEventListener('click',function(){
    var copy=chart.cloneNode(true),style=document.createElementNS('http://www.w3.org/2000/svg','style');
    style.textContent='.ga-zone rect{fill:#ebd3a5;fill-opacity:.5;stroke:#a17c50;stroke-width:1.4;stroke-dasharray:5 5}.ga-zone text{font:600 18px Georgia,serif;fill:#825a35}.ga-engraving{fill:none;stroke:#805331;stroke-width:1.6;opacity:.35}.ga-edge{fill:none;stroke:#956f48;stroke-width:2.7;stroke-dasharray:4 6;stroke-linecap:round}.ga-edge.is-canon{stroke:#77502f;stroke-dasharray:none}.ga-edge.is-secret{stroke:#844238;stroke-width:3.3;stroke-dasharray:2 7}.ga-edge.is-route{stroke:#78382d;stroke-width:6;stroke-dasharray:4 8}.ga-edge.is-dim{opacity:.09}.ga-footprint{fill:#773c30}.ga-point rect{fill:#f2dfb9;stroke:#6f482b;stroke-width:1.7;rx:2}.ga-point text{fill:#422c1e;font:500 14.2px Georgia,serif}.ga-point circle{fill:#a07a48}.ga-point.is-hidden rect{stroke:#8e4c3d;stroke-dasharray:5 3}.ga-point.is-selected rect{fill:#f8e9c8;stroke:#783b2d;stroke-width:3.2}.ga-point.is-route rect{fill:#ead0a4;stroke:#82422e;stroke-width:2.5}.ga-point.is-dim{opacity:.16}';
    copy.insertBefore(style,copy.firstChild);copy.removeAttribute('style');
    var view=copy.getAttribute('viewBox').split(' ').map(Number);copy.setAttribute('width',view[2]);copy.setAttribute('height',view[3]);
    var blob=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='hogwarts-marauders-atlas-'+state.region+'.svg';document.body.appendChild(link);link.click();link.remove();window.setTimeout(function(){URL.revokeObjectURL(url)},1000);
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
    $("ga-return").textContent="Return to My Journey ↗";
  }
  renderGraph();renderDetail();renderDirectory();renderRouteOptions();
})();
