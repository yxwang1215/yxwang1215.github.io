/* Hogwarts explorer: tactile, URL-addressed labyrinth without navigation buttons.
   Rooms are a cyclic graph; keyboard/point/touch movement intersects actual doors.
   Designed as an original fan-made website experience, not a replacement for server access control. */
(function(){
  "use strict";
  var atlas=window.HogwartsAtlas;
  var scenes=window.HogwartsScenes||{};
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
  var names={n:"north",e:"east",s:"south",w:"west"};
  var current=null,avatar={x:50,y:84},walkTarget=null,frame=null,busy=false,remembered={},ceremonyArmed=false,transitionId=0;
  var imageLoads=Object.create(null);
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
  function hasScene(id){
    var scene=scenes[id],room=atlas.rooms[id];
    return !!(scene&&room&&scene.src&&scene.width>0&&scene.height>0&&scene.exits&&
      Object.keys(room.exits).every(function(dir){return Array.isArray(scene.exits[dir])&&scene.exits[dir].length===4}));
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
    var point=scenes[current.id].exits[direction];
    return {x:point[0],y:point[1]};
  }
  function spawnAfter(direction,room){
    var reverse={n:"s",s:"n",e:"w",w:"e"}[direction];
    var point=scenes[room.id].exits[reverse];
    if(!point)return {x:50,y:78};
    // Arrive just inside the destination passage, away from its trigger.
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
  function regionStyle(point){
    return 'left:'+(point[0]-point[2]/2)+'%;top:'+(point[1]-point[3]/2)+'%;width:'+point[2]+'%;height:'+point[3]+'%;';
  }
  function doorMarkup(room){
    var html="",scene=scenes[room.id];
    Object.keys(room.exits).forEach(function(dir){
      var next=atlas.rooms[room.exits[dir]],point=scene.exits[dir];
      if(!next||!point)return;
      html+='<div class="hgw-door hgw-door--'+dir+'" style="'+regionStyle(point)+'" tabindex="0" role="link" data-door="'+dir+'" aria-label="Walk '+safe(names[dir])+' to '+safe(next.name)+'"></div>';
    });
    return html;
  }
  function roomScene(room){
    var scene=scenes[room.id];
    var content='<div class="hgw-scene" data-room="'+safe(room.id)+'">'+
      '<img class="hgw-scene-image" src="'+safe(scene.src)+'" width="'+scene.width+'" height="'+scene.height+'" alt="'+safe(scene.alt)+'" decoding="async" fetchpriority="high" draggable="false">'+
      doorMarkup(room);
    if(room.secret&&scene.secret){
      content+='<div class="hgw-secret-target" style="'+regionStyle(scene.secret)+'" tabindex="0" role="link" data-secret="'+safe(room.secret.type)+'" aria-label="Examine the '+(room.secret.type==="basin"?"serpent carved into the washbasin":"old tapestry")+'"></div>';
    }
    if(scene.ceremony){
      content+='<div class="hgw-ceremony-target" style="'+regionStyle(scene.ceremony)+'" tabindex="0" role="link" data-ceremony aria-label="Approach the high table for the Sorting Ceremony"></div>';
    }
    return content+'<div class="hgw-dust" aria-hidden="true">'+sparkles(10,1244+room.name.length,"hgw-particle")+'</div></div>';
  }
  function loadImage(id){
    if(imageLoads[id])return imageLoads[id];
    imageLoads[id]=new Promise(function(resolve,reject){
      var image=new Image(),done=false;
      var timer=window.setTimeout(function(){finish(false)},10000);
      function finish(ok){
        if(done)return;done=true;window.clearTimeout(timer);
        image.onload=null;image.onerror=null;
        if(ok)resolve();else{delete imageLoads[id];reject(new Error("Scene image unavailable"))}
      }
      image.onload=function(){finish(true)};
      image.onerror=function(){finish(false)};
      image.src=scenes[id].src;
      if(image.complete&&image.naturalWidth)finish(true);
    });
    return imageLoads[id];
  }
  function walkerMarkup(){
    return '<div id="hgw-walker" class="hgw-walker" aria-hidden="true"><span class="hgw-shadow"></span></div>';
  }
  function enterRoom(id,opts){
    opts=opts||{};
    var room=atlas.rooms[id];if(!room)return;
    stopWalk();current=room;busy=false;ceremonyArmed=false;transitionId++;
    avatar=opts.spawn||{x:50,y:83};
    var region=room.path.indexOf("/grounds/")>=0?"THE GROUNDS":
      room.path.indexOf("/dungeons/")>=0?"BENEATH THE CASTLE":
      room.path.indexOf("/under-castle/")>=0?"THE UNCHARTED DEPTHS":
      room.path.indexOf("/upper-keep/")>=0?"THE UPPER TOWERS":
      room.path.indexOf("/academic-wing/")>=0?"THE ACADEMIC WING":"THE ANCIENT KEEP";
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
    host.style.aspectRatio=scenes[id].width+" / "+scenes[id].height;
    host.innerHTML=roomScene(room)+walkerMarkup()+
      '<div class="hgw-stage-note" aria-hidden="true"><span>'+safe(room.kicker)+'</span><span class="hgw-seal">✦</span></div>';
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
  function findExit(){
    // Keyboard movement continues through the edge of the scene. A targeted
    // click uses its selected passage instead, even if the walk crosses another.
    if(current.exits.n&&avatar.y<=24)return "n";
    if(current.exits.s&&avatar.y>=92)return "s";
    if(current.exits.w&&avatar.x<=8)return "w";
    if(current.exits.e&&avatar.x>=92)return "e";
    return null;
  }
  function checkSecret(){
    if(!current||!current.secret)return false;
    var spot=scenes[current.id].secret;
    if(spot&&Math.hypot(avatar.x-spot[0],avatar.y-spot[1])<=5){
      changeRoom(current.secret.to,null);return true;
    }
    return false;
  }
  function visitSortingCeremony(){
    if(busy||!current||current.id!=="great")return false;
    busy=true;stopWalk();
    try{
      var bytes=new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      var nonce=Array.from(bytes,function(value){return value.toString(16).padStart(2,"0")}).join("");
      window.sessionStorage.setItem("hogwarts:sorting:pass:v1",JSON.stringify({
        from:"/hogwarts/",at:Date.now(),nonce:nonce
      }));
      persist();
    }catch(error){
      busy=false;ceremonyArmed=false;
      observation.textContent="The ancient door cannot open without browser session storage.";
      observation.classList.add("is-visible");
      return false;
    }
    shell.classList.add("is-transitioning");
    window.setTimeout(function(){
      window.location.assign("/hogwarts/sorting-ceremony/");
    },reduced?0:480);
    return true;
  }
  function checkCeremony(){
    return !!(ceremonyArmed&&current&&current.id==="great"&&
      Math.hypot(avatar.x-scenes.great.ceremony[0],avatar.y-scenes.great.ceremony[1])<=5&&visitSortingCeremony());
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
    else if(current.id==="bathroom"&&avatar.x>60&&avatar.y<60)line="One brass tap bears a carved serpent instead of a letter.";
    else if(current.id==="corridor"&&avatar.x<33&&avatar.y<59)line="The tapestry's edge moves, though there is no wind.";
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
      observation.textContent="The passage is taking a moment. Try it again when you are ready.";
      observation.classList.add("is-visible");
    });
  }
  function move(dx,dy){
    if(busy||!current)return;
    stopWalk();ceremonyArmed=false;
    avatar.x=Math.max(7,Math.min(93,avatar.x+dx));
    avatar.y=Math.max(23,Math.min(93,avatar.y+dy));
    syncAvatar(true);
    var direction=findExit();
    if(direction){changeRoom(current.exits[direction],direction);return}
    if(checkSecret()||checkCeremony())return;
    ambientLine();
  }
  function tickAuto(){
    frame=null;
    if(busy||!walkTarget)return;
    var dx=walkTarget.x-avatar.x,dy=walkTarget.y-avatar.y;
    var dist=Math.hypot(dx,dy);
    if(dist<=1.7){
      var arrived=walkTarget;avatar.x=arrived.x;avatar.y=arrived.y;
      syncAvatar(false);walkTarget=null;
      if(arrived.exit){changeRoom(current.exits[arrived.exit],arrived.exit);return}
      checkSecret()||checkCeremony();return;
    }
    var speed=1.8;
    avatar.x=Math.max(7,Math.min(93,avatar.x+(dx/dist)*speed));
    avatar.y=Math.max(23,Math.min(93,avatar.y+(dy/dist)*speed));
    syncAvatar(true);
    // A chosen destination wins over incidental intersections along the walk.
    if(!walkTarget.exit&&!walkTarget.secret&&!walkTarget.ceremony){
      var direction=findExit();
      if(direction){changeRoom(current.exits[direction],direction);return}
      if(checkSecret()||checkCeremony())return;
    }
    ambientLine();
    frame=window.requestAnimationFrame(tickAuto);
  }
  function goTo(x,y,options){
    if(busy)return;
    options=options||{};
    stopWalk();ceremonyArmed=!!options.ceremony;
    walkTarget={x:Math.max(7,Math.min(93,x)),y:Math.max(23,Math.min(93,y)),
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
      goTo(target.x,target.y,{exit:dir});return;
    }
    var secret=event.target.closest("[data-secret]");
    if(secret&&host.contains(secret)&&current.secret){
      var spot=scenes[current.id].secret;
      goTo(spot[0],spot[1],{secret:true});return;
    }
    var ceremony=event.target.closest("[data-ceremony]");
    if(ceremony&&host.contains(ceremony)&&current.id==="great"){
      var dais=scenes.great.ceremony;
      goTo(dais[0],dais[1],{ceremony:true});return;
    }
    var rect=host.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    var x=100*(event.clientX-rect.left)/rect.width;
    var y=100*(event.clientY-rect.top)/rect.height;
    goTo(x,y,{ceremony:current.id==="great"&&Math.hypot(x-scenes.great.ceremony[0],y-scenes.great.ceremony[1])<=5});
  }
  host.addEventListener("click",clickOnScene);
  host.addEventListener("keydown",function(event){
    if(event.target!==host&&(event.key==="Enter"||event.key===" ")){
      var action=event.target.closest("[data-door],[data-secret],[data-ceremony]");
      if(action){event.preventDefault();action.click();return}
    }
  });
  function describePassage(event){
    var passage=event.target.closest("[data-door]");
    if(!passage)return;
    var next=atlas.rooms[current.exits[passage.getAttribute("data-door")]];
    var caption=host.querySelector(".hgw-stage-note span");
    if(caption&&next)caption.textContent=next.name;
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
