/* Hogwarts explorer: tactile, URL-addressed labyrinth without navigation buttons.
   Rooms form a cyclic graph; explicit activation uses pictured passage polygons.
   Designed as an original fan-made website experience, not a replacement for server access control. */
(function(){
  "use strict";
  var atlas=window.HogwartsAtlas;
  var scenes=window.HogwartsScenes||{};
  var geography=window.HogwartsGeography;
  var host=document.getElementById("hgw-stage");
  var title=document.getElementById("hgw-title");
  var overline=document.getElementById("hgw-overline");
  var summary=document.getElementById("hgw-summary");
  var teacher=document.getElementById("hgw-teacher");
  var observation=document.getElementById("hgw-observation");
  var visitedCount=document.getElementById("hgw-visited");
  var stageStamp=document.getElementById("hgw-location");
  var announce=document.getElementById("hgw-announce");
  var shell=document.getElementById("hgw-shell");
  var sessionKey="hogwarts:session:v2";
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current=null,avatar={x:50,y:84},walkTarget=null,frame=null,busy=false,remembered={},ceremonyArmed=false,transitionId=0;
  var imageLoads=Object.create(null),revealedSecrets=Object.create(null),selectedPassage=null,secretOpen=false;
  function safe(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }
  function pathFromLocation(){return window.location.pathname.replace(/\/+$/,"")+"/";}
  function loadSession(){
    try{
      var item=JSON.parse(sessionStorage.getItem(sessionKey)||"null");
      return item&&typeof item.id==="string"&&Array.isArray(item.visited)&&item.issued>0?item:null;
    }catch(error){return null}
  }
  var session=loadSession();
  if(!session||!atlas||!atlas.byPath[pathFromLocation()]){
    window.location.replace("/");return;
  }
  // A previously visited hidden neighbor proves this opening was already used.
  // A successful reveal also remains visible while revisiting this journey.
  Object.keys(atlas.rooms).forEach(function(id){
    var secret=atlas.rooms[id].secret;
    if(secret&&session.visited.includes(secret.to))revealedSecrets[id]=true;
  });
  function hasScene(id){
    var scene=scenes[id],room=atlas.rooms[id];
    return !!(scene&&room&&scene.src&&scene.width>0&&scene.height>0&&scene.exits&&
      Object.keys(room.exits).every(function(dir){
        var passage=scene.exits[dir];
        return passage&&Array.isArray(passage.polygon)&&passage.polygon.length>=3&&Array.isArray(passage.point);
      }));
  }
  if(!hasScene(atlas.byPath[pathFromLocation()])){
    title.textContent=atlas.rooms[atlas.byPath[pathFromLocation()]].name;
    host.innerHTML='<div class="hgw-load-error" role="status"><p>This view is taking longer to arrive.</p><button type="button" data-reload>Reload this view</button></div>';
    host.querySelector("[data-reload]").addEventListener("click",function(){window.location.reload()});
    return;
  }
  function persist(){
    try{session.current=current.path;sessionStorage.setItem(sessionKey,JSON.stringify(session))}catch(error){}
    visitedCount.textContent=String(session.visited.length).padStart(2,"0")+" / "+String(Object.keys(atlas.rooms).length).padStart(2,"0");
  }
  function approachOf(direction){
    var scene=scenes[current.id],opened=secretOpen&&scene.secret&&scene.secret.open;
    var point=(opened&&opened.exits&&opened.exits[direction])||scene.exits[direction];
    return {x:point.point?point.point[0]:point[0],y:point.point?point.point[1]:point[1]};
  }
  function spawnAfter(direction,room){
    var reverse={n:"s",s:"n",e:"w",w:"e"}[direction];
    var point=scenes[room.id].exits[reverse];
    if(!point)return {x:50,y:78};
    point=point.point||point;
    return {x:Math.max(15,Math.min(85,point[0]+(50-point[0])*.36)),
      y:Math.max(40,Math.min(82,point[1]+(65-point[1])*.55))};
  }
  function stopWalk(){walkTarget=null;if(frame){cancelAnimationFrame(frame);frame=null}}
  function rand(seed){return function(){seed=(seed*16807)%2147483647;return seed/2147483647}}
  function sparkles(count,seed,cssName){
    var random=rand(seed),html="";
    for(var i=0;i<count;i++){
      html+='<span class="'+cssName+'" style="left:'+(random()*100).toFixed(2)+'%;top:'+(random()*100).toFixed(2)+'%;--px:'+(random()*100).toFixed(2)+'%;--py:'+(random()*100).toFixed(2)+'%;--opacity:'+(random()*.55+.15).toFixed(2)+';--dur:'+(3+random()*6).toFixed(2)+'s;--delay:'+(-random()*8).toFixed(2)+'s"></span>';
    }
    return html;
  }
  function regionBounds(region){
    var xs=region.polygon.map(function(p){return p[0]}),ys=region.polygon.map(function(p){return p[1]});
    var left=Math.min.apply(null,xs),top=Math.min.apply(null,ys);
    return {left:left,top:top,width:Math.max.apply(null,xs)-left,height:Math.max.apply(null,ys)-top};
  }
  function regionStyle(region){
    var box=regionBounds(region);
    var polygon=region.polygon.map(function(p){return ((p[0]-box.left)/box.width*100)+'% '+((p[1]-box.top)/box.height*100)+'%'}).join(',');
    return 'left:'+box.left+'%;top:'+box.top+'%;width:'+box.width+'%;height:'+box.height+'%;clip-path:polygon('+polygon+');';
  }
  function targetMarkup(region,cssName,attribute,label,role){
    var box=regionBounds(region);
    return '<div class="'+cssName+'" style="'+regionStyle(region)+'" tabindex="0" role="'+(role||'link')+'" '+attribute+' aria-label="'+safe(label)+'">'+
      '<svg viewBox="'+box.left+' '+box.top+' '+box.width+' '+box.height+'" preserveAspectRatio="none" aria-hidden="true"><polygon points="'+
      region.polygon.map(function(p){return p.join(',')}).join(' ')+'"></polygon></svg></div>';
  }
  function doorMarkup(room){
    var html="",scene=scenes[room.id],opened=secretOpen&&scene.secret&&scene.secret.open;
    Object.keys(room.exits).forEach(function(dir){
      var next=atlas.rooms[room.exits[dir]];
      var region=(opened&&opened.exits&&opened.exits[dir])||scene.exits[dir];
      if(!next||!region)return;
      html+=targetMarkup(region,'hgw-door','data-door="'+safe(dir)+'"',region.label||'Walk to '+next.name);
    });
    return html;
  }
  function roomScene(room){
    var scene=scenes[room.id],view=secretOpen&&scene.secret?scene.secret.open:scene;
    var content='<div class="hgw-scene" data-room="'+safe(room.id)+'">'+
      '<img class="hgw-scene-image" src="'+safe(view.src)+'" width="'+view.width+'" height="'+view.height+'" alt="'+safe(view.alt||scene.alt)+'" decoding="async" fetchpriority="high" draggable="false">'+
      doorMarkup(room);
    if(room.secret&&scene.secret){
      var secretRegion=secretOpen?scene.secret.open:scene.secret.trigger;
      content+=targetMarkup(secretRegion,'hgw-secret-target'+(secretOpen?' is-open':''),'data-secret="'+safe(room.secret.type)+'"',secretRegion.label,secretOpen?'link':'button');
    }
    if(scene.ceremony){
      content+=targetMarkup(scene.ceremony,'hgw-ceremony-target','data-ceremony',scene.ceremony.label||'Walk along the aisle to attend the Sorting Ceremony','button');
    }
    return content+'<div class="hgw-dust" aria-hidden="true">'+sparkles(10,1244+room.name.length,"hgw-particle")+'</div></div>';
  }
  function loadSource(src){
    if(imageLoads[src])return imageLoads[src];
    imageLoads[src]=new Promise(function(resolve,reject){
      var image=new Image(),done=false;
      var timer=window.setTimeout(function(){finish(false)},10000);
      function finish(ok){
        if(done)return;done=true;window.clearTimeout(timer);
        image.onload=null;image.onerror=null;
        if(ok)resolve();else{delete imageLoads[src];reject(new Error("Scene image unavailable"))}
      }
      image.onload=function(){finish(true)};
      image.onerror=function(){finish(false)};
      image.src=src;
      if(image.complete&&image.naturalWidth)finish(true);
    });
    return imageLoads[src];
  }
  function loadImage(id){
    var scene=scenes[id],view=revealedSecrets[id]&&scene.secret?scene.secret.open:scene;
    return loadSource(view.src);
  }
  function walkerMarkup(){
    return '<div id="hgw-walker" class="hgw-walker" aria-hidden="true"><span class="hgw-shadow"></span></div>';
  }
  function renderStage(room){
    host.innerHTML=roomScene(room)+walkerMarkup()+
      '<div class="hgw-stage-note" aria-hidden="true"><span>'+safe(room.kicker)+'</span><span class="hgw-seal">✦</span></div>';
  }
  function enterRoom(id,opts){
    opts=opts||{};
    var room=atlas.rooms[id];if(!room)return;
    stopWalk();current=room;busy=false;ceremonyArmed=false;transitionId++;
    selectedPassage=null;secretOpen=!!revealedSecrets[id];
    avatar=opts.spawn||{x:50,y:83};
    var region=room.path.indexOf("/grounds/")>=0?"THE GROUNDS":
      room.path.indexOf("/dungeons/")>=0?"BENEATH THE CASTLE":
      room.path.indexOf("/under-castle/")>=0?"THE UNCHARTED DEPTHS":
      room.path.indexOf("/upper-keep/")>=0?"THE UPPER TOWERS":
      room.path.indexOf("/academic-wing/")>=0?"THE ACADEMIC WING":"THE ANCIENT KEEP";
    if(geography&&geography.nodes[room.id])region=geography.nodes[room.id].floor;
    if(room.id==="gate")region="A PLACE BETWEEN WORLDS";
    overline.textContent=region;
    title.textContent=room.name;
    title.classList.toggle("hgw-title--long",room.name.length>20);
    title.classList.toggle("hgw-title--very-long",room.name.length>29);
    summary.textContent=room.description;
    teacher.hidden=!room.teacher;
    if(room.teacher){
      teacher.innerHTML='<div><span class="hgw-teacher-name">'+safe(room.teacher)+'</span><span class="hgw-teacher-subject">'+safe(room.subject)+'</span></div>';
    }else teacher.innerHTML="";
    observation.classList.remove("is-visible");observation.textContent="";
    var activeFrame=secretOpen&&scenes[id].secret?scenes[id].secret.open:scenes[id];
    host.style.aspectRatio=activeFrame.width+" / "+activeFrame.height;
    renderStage(room);
    var sceneImage=host.querySelector(".hgw-scene-image");
    if(sceneImage)sceneImage.addEventListener("error",function(){
      observation.textContent="This view could not load. Move to another passage or refresh to try again.";
      observation.classList.add("is-visible");
    });
    document.title=room.name+" · Hogwarts";
    stageStamp.textContent=room.kicker;
    if(!session.visited.includes(id)){session.visited.push(id)}
    persist();syncAvatar();
    announce.textContent=room.name+". "+room.description;
    shell.classList.remove("is-transitioning","is-preparing");
    shell.classList.add("is-arriving");
    window.setTimeout(function(){shell.classList.remove("is-arriving")},reduced?0:690);
  }
  function syncAvatar(walking){
    var walker=document.getElementById("hgw-walker");if(!walker)return;
    walker.style.left=avatar.x+"%";
    walker.style.top=avatar.y+"%";
    walker.style.transform="translate(-50%,-88%) scale("+(0.57+avatar.y/180).toFixed(3)+")";
    walker.classList.toggle("is-walking",!!walking);
  }
  function passagePoint(element){
    var scene=scenes[current.id],dir=element.getAttribute("data-door"),opened=secretOpen&&scene.secret&&scene.secret.open;
    var region=dir?((opened&&opened.exits&&opened.exits[dir])||scene.exits[dir]):element.getAttribute("data-secret")!==null?
      (secretOpen&&scene.secret.open?scene.secret.open:scene.secret.trigger||scene.secret):scene.ceremony;
    return region&&(region.point||region);
  }
  function selectPassage(dx,dy){
    if(busy||!current)return;
    var options=Array.from(host.querySelectorAll("[data-door],[data-secret],[data-ceremony]"));
    var origin=selectedPassage&&host.contains(selectedPassage)?passagePoint(selectedPassage):[50,65];
    var best=null,bestScore=Infinity;
    options.forEach(function(element){
      if(element===selectedPassage)return;
      var point=passagePoint(element);if(!point)return;
      var x=point[0]-origin[0],y=point[1]-origin[1],forward=x*dx+y*dy;
      if(forward<=.1)return;
      var score=Math.abs(x*dy-y*dx)*2+Math.hypot(x,y);
      if(score<bestScore){best=element;bestScore=score}
    });
    if(!best&&!selectedPassage){
      options.forEach(function(element){
        var point=passagePoint(element);if(!point)return;
        var score=-(point[0]*dx+point[1]*dy);
        if(score<bestScore){best=element;bestScore=score}
      });
    }
    if(best){
      if(selectedPassage)selectedPassage.classList.remove("is-selected");
      selectedPassage=best;best.classList.add("is-selected");best.focus();
      describePassage({target:best});
    }
  }
  function revealSecret(){
    if(busy||!current.secret)return;
    if(secretOpen){changeRoom(current.secret.to,null);return}
    var secret=scenes[current.id].secret;
    if(!secret||!secret.open||!secret.open.src)return;
    busy=true;stopWalk();
    var token=++transitionId;
    shell.classList.add("is-preparing");
    loadSource(secret.open.src).then(function(){
      if(token!==transitionId)return;
      secretOpen=true;revealedSecrets[current.id]=true;busy=false;selectedPassage=null;
      host.style.aspectRatio=secret.open.width+" / "+secret.open.height;
      renderStage(current);syncAvatar();
      shell.classList.remove("is-preparing");
      observation.textContent=secret.note||"An entrance has opened. Approach the opening when you are ready.";
      observation.classList.add("is-visible");
      announce.textContent=observation.textContent;
      var opening=host.querySelector("[data-secret]");
      if(opening){opening.focus();selectedPassage=opening;opening.classList.add("is-selected")}
    }).catch(function(){
      if(token!==transitionId)return;
      busy=false;shell.classList.remove("is-preparing");
      observation.textContent="The hidden opening could not be revealed. Examine it again to retry.";
      observation.classList.add("is-visible");
    });
  }
  function visitSortingCeremony(){
    if(busy||!current||current.id!=="great")return false;
    busy=true;stopWalk();
    var token=++transitionId;
    shell.classList.add("is-transitioning");
    window.setTimeout(function(){
      if(token!==transitionId||!current||current.id!=="great")return;
      try{
        var bytes=new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        var nonce=Array.from(bytes,function(value){return value.toString(16).padStart(2,"0")}).join("");
        window.sessionStorage.setItem("hogwarts:sorting:pass:v1",JSON.stringify({
          from:"/hogwarts/",at:Date.now(),nonce:nonce
        }));
        persist();
      }catch(error){
        busy=false;ceremonyArmed=false;shell.classList.remove("is-transitioning");
        if(window.HogwartsSoundtrack&&window.HogwartsSoundtrack.sync)
          window.HogwartsSoundtrack.sync();
        observation.textContent="The ancient door cannot open without browser session storage.";
        observation.classList.add("is-visible");
        return;
      }
      window.location.assign("/hogwarts/sorting-ceremony/");
    },reduced?0:480);
    return true;
  }
  function checkCeremony(){
    return !!(ceremonyArmed&&current&&current.id==="great"&&
      Math.hypot(avatar.x-scenes.great.ceremony.point[0],avatar.y-scenes.great.ceremony.point[1])<=5&&visitSortingCeremony());
  }
  function ambientLine(){
    if(!current||remembered[current.id])return;
    var line="";
    if(current.id==="library"&&avatar.x<39&&avatar.y>=53&&avatar.y<=70)line="On an open page, someone has drawn a small serpent next to the word 'listen'.";
    else if(current.id==="great"&&avatar.y<58)line="The enchanted ceiling darkens as the candles drift toward the rafters.";
    else if(current.id==="charms"&&avatar.x<44&&avatar.y<55)line="The feather rises another inch, as if it has heard a secret.";
    else if(current.id==="potions"&&avatar.x>38&&avatar.x<65&&avatar.y>57)line="The cauldron's surface changes from silver to green.";
    else if(current.id==="forest"&&avatar.x<38)line="There is a second set of footsteps among the leaves.";
    else if(current.id==="chamber"&&avatar.y<65)line="A thousand-year-old hiss answers your footstep.";
    else if(current.id==="office"&&avatar.x>62)line="A beautiful red feather moves in the still air.";
    else if(current.id==="transfig"&&avatar.y<59)line="The tabby cat blinks, and the professor smiles very slightly.";
    else if(current.id==="history"&&avatar.y<59)line="Professor Binns floats through the desk without pausing his lecture.";
    else if(current.id==="herbology"&&avatar.y<58)line="A mandrake curls one leaf around the rim of its pot.";
    else if(current.id==="bathroom"&&avatar.x>60&&avatar.y<60)line="One copper tap bears a carved serpent instead of a letter.";
    else if(current.id==="corridor"&&avatar.x<33&&avatar.y<59)line="The blank wall opposite the tapestry seems to be waiting for a need.";
    if(line){remembered[current.id]=true;observation.textContent=line;observation.classList.add("is-visible")}
  }
  function changeRoom(to,direction){
    if(busy||!atlas.rooms[to])return;
    if(!hasScene(to)){
      observation.textContent="This passage could not load. Refresh to try again.";
      observation.classList.add("is-visible");return;
    }
    busy=true;stopWalk();
    var token=++transitionId,room=atlas.rooms[to];
    shell.classList.add("is-preparing");
    // Keep the current picture visible until the next real image is available.
    loadImage(to).then(function(){
      if(token!==transitionId)return;
      shell.classList.remove("is-preparing");
      shell.classList.add("is-transitioning");
      var spawn=direction?spawnAfter(direction,room):{x:50,y:80};
      window.setTimeout(function(){
        if(token!==transitionId)return;
        window.history.pushState({hogwarts:true,room:to},"",room.path);
        enterRoom(to,{spawn:spawn});
        window.dispatchEvent(new Event("hogwarts:scenechange"));
      },reduced?0:250);
    }).catch(function(){
      if(token!==transitionId)return;
      busy=false;shell.classList.remove("is-preparing","is-transitioning");
      // The soundtrack was prepared on click; restore the old cue if the
      // destination could not be loaded and the URL never changed.
      if(window.HogwartsSoundtrack&&window.HogwartsSoundtrack.sync)
        window.HogwartsSoundtrack.sync();
      observation.textContent="The passage is taking a moment. Try it again when you are ready.";
      observation.classList.add("is-visible");
    });
  }
  function move(dx,dy){selectPassage(dx,dy)}
  function tickAuto(){
    frame=null;
    if(busy||!walkTarget)return;
    var dx=walkTarget.x-avatar.x,dy=walkTarget.y-avatar.y;
    var dist=Math.hypot(dx,dy);
    if(dist<=1.7){
      var arrived=walkTarget;avatar.x=arrived.x;avatar.y=arrived.y;
      syncAvatar(false);walkTarget=null;
      if(arrived.exit){changeRoom(current.exits[arrived.exit],arrived.exit);return}
      if(arrived.secret){revealSecret();return}
      checkCeremony();return;
    }
    var speed=1.8;
    avatar.x=Math.max(0,Math.min(100,avatar.x+(dx/dist)*speed));
    avatar.y=Math.max(0,Math.min(100,avatar.y+(dy/dist)*speed));
    syncAvatar(true);
    ambientLine();
    frame=window.requestAnimationFrame(tickAuto);
  }
  function goTo(x,y,options){
    if(busy)return;
    options=options||{};
    stopWalk();ceremonyArmed=!!options.ceremony;
    walkTarget={x:Math.max(0,Math.min(100,x)),y:Math.max(0,Math.min(100,y)),
      exit:options.exit,secret:options.secret,ceremony:options.ceremony};
    frame=window.requestAnimationFrame(tickAuto);
  }
  function clickOnScene(event){
    if(busy||!current)return;
    var door=event.target.closest("[data-door]");
    if(door&&host.contains(door)){
      var dir=door.getAttribute("data-door");
      if(!current.exits[dir])return;
      var target=approachOf(dir);
      // The click on a pictured passage is the user gesture for soundtrack playback.
      if(window.HogwartsSoundtrack&&window.HogwartsSoundtrack.prepareForTravel)
        window.HogwartsSoundtrack.prepareForTravel(atlas.rooms[current.exits[dir]].path);
      goTo(target.x,target.y,{exit:dir});return;
    }
    var secret=event.target.closest("[data-secret]");
    if(secret&&host.contains(secret)&&current.secret){
      var secretData=scenes[current.id].secret;
      var spot=(secretOpen?secretData.open:secretData.trigger).point;
      // A sealed mechanism is only a local reveal; switch music on the opened
      // doorway click, not on discovering the secret.
      if(secretOpen&&window.HogwartsSoundtrack&&window.HogwartsSoundtrack.prepareForTravel)
        window.HogwartsSoundtrack.prepareForTravel(atlas.rooms[current.secret.to].path);
      goTo(spot[0],spot[1],{secret:true});return;
    }
    var ceremony=event.target.closest("[data-ceremony]");
    if(ceremony&&host.contains(ceremony)&&current.id==="great"){
      var dais=scenes.great.ceremony.point;
      if(window.HogwartsSoundtrack&&window.HogwartsSoundtrack.prepareForTravel)
        window.HogwartsSoundtrack.prepareForTravel("/hogwarts/sorting-ceremony/");
      goTo(dais[0],dais[1],{ceremony:true});return;
    }
    // A background click is observation, never permission to leave the scene.
    // In particular, walking toward an image edge cannot invent a doorway.

  }
  host.addEventListener("click",clickOnScene);
  host.addEventListener("keydown",function(event){
    if(event.target!==host&&(event.key==="Enter"||event.key===" ")){
      var action=event.target.closest("[data-door],[data-secret],[data-ceremony]");
      if(action){event.preventDefault();if(!event.repeat)action.click();return}
    }
  });
  function describePassage(event){
    var passage=event.target.closest("[data-door],[data-secret],[data-ceremony]");
    if(!passage||!host.contains(passage))return;
    var caption=host.querySelector(".hgw-stage-note span");
    if(caption)caption.textContent=passage.getAttribute("aria-label");
  }
  function restoreCaption(){
    var caption=host.querySelector(".hgw-stage-note span");
    if(caption&&current)caption.textContent=current.kicker;
  }
  host.addEventListener("pointerover",describePassage);
  host.addEventListener("focusin",describePassage);
  host.addEventListener("pointerout",restoreCaption);
  host.addEventListener("focusout",restoreCaption);
  var swipeStart=null,ignoreClick=false;
  host.addEventListener("pointerdown",function(event){
    if(event.pointerType==="touch"){swipeStart={x:event.clientX,y:event.clientY}}
  });
  host.addEventListener("pointerup",function(event){
    if(!swipeStart||event.pointerType!=="touch")return;
    var dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;
    swipeStart=null;
    if(Math.hypot(dx,dy)>38){
      ignoreClick=true;
      window.setTimeout(function(){ignoreClick=false},100);
      if(Math.abs(dx)>Math.abs(dy))move(dx>0?12:-12,0);
      else move(0,dy>0?12:-12);
    }
  });
  host.addEventListener("click",function(event){
    if(!ignoreClick)return;
    event.stopImmediatePropagation();
    ignoreClick=false;
  },true);
  window.addEventListener("keydown",function(event){
    if(event.altKey||event.metaKey||event.ctrlKey||event.target&&/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))return;
    var key=event.key.toLowerCase();
    var dir={"arrowup":[0,-5],w:[0,-5],"arrowdown":[0,5],s:[0,5],"arrowleft":[-5,0],a:[-5,0],"arrowright":[5,0],d:[5,0]}[key];
    if(dir){event.preventDefault();move(dir[0],dir[1])}
    else if((key==="enter"||key===" ")&&selectedPassage&&host.contains(selectedPassage)&&event.target===host){
      event.preventDefault();if(!event.repeat)selectedPassage.click();
    }
  });
  window.addEventListener("popstate",function(){
    var id=atlas.byPath[pathFromLocation()];
    if(!id||!session.visited.includes(id)){window.location.replace("/");return}
    enterRoom(id,{spawn:{x:50,y:76}});
    window.dispatchEvent(new Event("hogwarts:scenechange"));
  });
  window.history.replaceState({hogwarts:true,room:atlas.byPath[pathFromLocation()]},"",window.location.pathname);
  enterRoom(atlas.byPath[pathFromLocation()]);
})();
