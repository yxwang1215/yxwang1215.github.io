/* Hogwarts explorer: tactile, URL-addressed labyrinth without navigation buttons.
   Rooms are a cyclic graph; keyboard/point/touch movement intersects actual doors.
   Designed as an original fan-made website experience, not a replacement for server access control. */
(function(){
  "use strict";
  var atlas=window.HogwartsAtlas;
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
  var castleArtwork="<svg class=\"hgw-castle-svg\" aria-hidden=\"true\" viewBox=\"0 0 1440 650\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"hill\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop stop-color=\"#152730\"/><stop offset=\"1\" stop-color=\"#081219\"/></linearGradient>\n          <linearGradient id=\"tower\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#21343a\"/><stop offset=\"1\" stop-color=\"#09151e\"/></linearGradient>\n          <linearGradient id=\"water\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop stop-color=\"#29444a\"/><stop offset=\"1\" stop-color=\"#07131b\"/></linearGradient>\n          <filter id=\"window-glow\"><feGaussianBlur stdDeviation=\"3\"/></filter>\n        </defs>\n        <path d=\"M0 410Q180 360 350 415T700 405T1100 393T1440 420V650H0Z\" fill=\"#17262b\" opacity=\".75\"/>\n        <path d=\"M0 507Q210 445 375 470Q555 410 760 462Q985 395 1160 467Q1285 441 1440 486V650H0Z\" fill=\"url(#hill)\"/>\n        <path d=\"M405 459L473 412L552 430L618 384L704 411L767 372L868 408L955 379L1049 434L1088 445L1068 526H397Z\" fill=\"#0b161c\"/>\n        <g fill=\"url(#tower)\" stroke=\"#314247\" stroke-width=\"2\">\n          <path d=\"M487 311h111v209H487zM480 311l62-66 63 66z\"/>\n          <path d=\"M610 270h116v252H610zM601 270l67-80 67 80z\"/>\n          <path d=\"M733 321h150v200H733zM719 321l89-75 89 75z\"/>\n          <path d=\"M893 258h78v260h-78zM885 258l47-100 47 100z\"/>\n          <path d=\"M1003 352h67v170h-67zM995 352l41-80 42 80z\"/>\n          <path d=\"M410 369h62v147h-62zM402 369l39-72 39 72z\"/>\n          <path d=\"M553 374h48v151h-48zM544 374l33-81 33 81z\"/>\n          <path d=\"M810 218h55v290h-55zM798 218l39-102 40 102z\"/>\n          <path d=\"M649 155h39v356h-39zM639 155l29-99 29 99z\"/>\n        </g>\n        <g fill=\"#131e22\" stroke=\"#344547\" stroke-width=\"2\">\n          <rect x=\"481\" y=\"393\" width=\"410\" height=\"126\"/>\n          <path d=\"M478 392l66-55 68 55 64-50 57 50 74-61 86 61z\"/>\n        </g>\n        <g fill=\"#e5bc73\">\n          <rect x=\"656\" y=\"180\" width=\"8\" height=\"19\" rx=\"4\"/><rect x=\"673\" y=\"180\" width=\"8\" height=\"19\" rx=\"4\"/>\n          <rect x=\"822\" y=\"256\" width=\"8\" height=\"19\" rx=\"4\"/><rect x=\"845\" y=\"256\" width=\"8\" height=\"19\" rx=\"4\"/>\n          <rect x=\"919\" y=\"303\" width=\"9\" height=\"22\" rx=\"4\"/><rect x=\"941\" y=\"303\" width=\"9\" height=\"22\" rx=\"4\"/>\n          <rect x=\"515\" y=\"337\" width=\"8\" height=\"18\" rx=\"4\"/><rect x=\"555\" y=\"337\" width=\"8\" height=\"18\" rx=\"4\"/>\n          <rect x=\"640\" y=\"305\" width=\"9\" height=\"19\" rx=\"4\"/><rect x=\"685\" y=\"305\" width=\"9\" height=\"19\" rx=\"4\"/>\n          <rect x=\"760\" y=\"345\" width=\"11\" height=\"22\" rx=\"5\"/><rect x=\"791\" y=\"345\" width=\"11\" height=\"22\" rx=\"5\"/><rect x=\"834\" y=\"345\" width=\"11\" height=\"22\" rx=\"5\"/>\n          <rect x=\"422\" y=\"389\" width=\"9\" height=\"20\" rx=\"4\"/><rect x=\"448\" y=\"389\" width=\"9\" height=\"20\" rx=\"4\"/>\n          <rect x=\"1019\" y=\"383\" width=\"8\" height=\"19\" rx=\"4\"/><rect x=\"1043\" y=\"383\" width=\"8\" height=\"19\" rx=\"4\"/>\n          <rect x=\"510\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/><rect x=\"546\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/><rect x=\"584\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/>\n          <rect x=\"634\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/><rect x=\"670\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/><rect x=\"706\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/>\n          <rect x=\"759\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/><rect x=\"795\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/><rect x=\"831\" y=\"415\" width=\"10\" height=\"23\" rx=\"4\"/>\n          <rect x=\"546\" y=\"463\" width=\"9\" height=\"18\" rx=\"4\"/><rect x=\"590\" y=\"463\" width=\"9\" height=\"18\" rx=\"4\"/><rect x=\"634\" y=\"463\" width=\"9\" height=\"18\" rx=\"4\"/><rect x=\"677\" y=\"463\" width=\"9\" height=\"18\" rx=\"4\"/><rect x=\"775\" y=\"463\" width=\"9\" height=\"18\" rx=\"4\"/><rect x=\"820\" y=\"463\" width=\"9\" height=\"18\" rx=\"4\"/>\n        </g>\n        <g filter=\"url(#window-glow)\" opacity=\".46\" fill=\"#f2c57e\">\n          <ellipse cx=\"665\" cy=\"190\" rx=\"12\" ry=\"18\"/><ellipse cx=\"837\" cy=\"265\" rx=\"22\" ry=\"20\"/><ellipse cx=\"932\" cy=\"311\" rx=\"22\" ry=\"20\"/><ellipse cx=\"669\" cy=\"427\" rx=\"38\" ry=\"19\"/><ellipse cx=\"801\" cy=\"430\" rx=\"55\" ry=\"18\"/>\n        </g>\n        <path d=\"M0 520Q310 498 640 521T1440 518V650H0Z\" fill=\"url(#water)\" opacity=\".9\"/>\n        <g fill=\"#d9b47a\" opacity=\".12\"><path d=\"M610 540h125l-28 85h-70z\"/><path d=\"M798 533h81l-13 77h-62z\"/><path d=\"M897 537h76l-12 66h-52z\"/></g>\n        <path d=\"M0 604Q240 580 470 603T900 602T1440 608V650H0Z\" fill=\"#071219\"/>\n        <path d=\"M87 590q27-22 52 0q-21-8-34 7zM1106 574q38-32 76 0q-33-11-51 9z\" fill=\"#101f25\"/>\n      </svg>";
  var outsideKinds=["exterior","grounds","bridge","lake","forest","hut","quidditch","greenhouse","herbology"];
  var names={n:"north",e:"east",s:"south",w:"west"};
  var current=null,avatar={x:50,y:84},walkTarget=null,frame=null,busy=false,remembered={},ceremonyArmed=false;
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
  function persist(){
    try{session.current=current.path;sessionStorage.setItem(sessionKey,JSON.stringify(session))}catch(error){}
    visitedCount.textContent=String(session.visited.length).padStart(2,"0")+" / "+String(Object.keys(atlas.rooms).length).padStart(2,"0");
  }
  function approachOf(direction){
    return direction==="n"?{x:50,y:30}:direction==="s"?{x:50,y:91}:direction==="w"?{x:13,y:51}:{x:87,y:51};
  }
  function spawnAfter(direction){
    return direction==="n"?{x:50,y:81}:direction==="s"?{x:50,y:38}:direction==="w"?{x:78,y:53}:direction==="e"?{x:22,y:53}:{x:50,y:76};
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
  function outdoorSVG(kind){
    var tree=kind==="forest"||kind==="hut";
    var lake=kind==="lake"||kind==="bridge";
    return '<svg class="hgw-landscape" viewBox="0 0 960 490" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+
      '<path d="M0 358L102 245L180 285L314 108L439 294L570 156L696 273L829 107L960 312V490H0Z" fill="'+(tree?'#183d39':lake?'#284955':'#2b4a48')+'" opacity=".8"/>'+
      '<path d="M0 420Q120 360 221 402T465 386T730 395T960 377V490H0Z" fill="'+(tree?'#102d2b':'#1c3837')+'"/>'+
      '<path d="M0 453Q175 384 296 438T570 422T960 438V490H0Z" fill="#102922"/>'+
      Array.from({length:20},function(_,i){var x=((i*73)+47)%965;var y=280+(i%5)*23;var h=(tree?160:95)+(i%3)*30;return '<path d="M'+x+' '+(y+h)+'V'+(y+40)+'" stroke="#0b2628" stroke-width="'+(tree?11:7)+'"/><path d="M'+(x-27)+' '+(y+83)+'L'+x+' '+(y-39)+'L'+(x+27)+' '+(y+83)+'Z" fill="'+(tree?'#102b2a':'#213d3b')+'"/>'}).join("")+
      '</svg>';
  }
  function doorMarkup(room,kind){
    var html="";
    Object.keys(room.exits).forEach(function(dir){
      var next=atlas.rooms[room.exits[dir]];
      if(!next)return;
      html+='<div class="hgw-door hgw-door--'+dir+'" tabindex="0" role="link" data-door="'+dir+'" aria-label="'+safe(names[dir])+' doorway to '+safe(next.name)+'"></div>';
    });
    return html;
  }
  function atmosphericObjects(room){
    var kind=room.kind,id=room.id,html="";
    if(["hall","portrait","study","kitchen"].indexOf(kind)>=0){
      html+='<div class="hgw-banner hgw-banner--l"></div><div class="hgw-banner hgw-banner--r"></div>';
    }
    if(id==="great"){
      html+='<div class="hgw-candles">'+Array(11).fill("<i></i>").join("")+'</div><div class="hgw-tables"><i></i><i></i><i></i><i></i></div>'+
        '<div class="hgw-prop--sorting-hat" tabindex="0" role="link" data-ceremony aria-label="Examine the old hat resting on the dais"></div>';
    }
    if(["library","oldArchive"].indexOf(id)>=0){
      html+='<div class="hgw-books"><i></i><i></i><i></i></div>';
      if(id==="library")html+='<div class="hgw-prop hgw-prop--book" data-observation="The book opens at a page about an ancient language spoken in whispers."></div>';
    }
    if(["classroom","potions","herbology"].indexOf(kind)>=0){
      html+='<div class="hgw-blackboard" aria-hidden="true"></div>';
    }
    if(room.teacher&&kind!=="herbology"&&kind!=="forest"&&kind!=="hut"&&kind!=="hospital"){
      html+='<div class="hgw-teacher-figure" aria-hidden="true"></div>';
    }
    if(id==="charms")html+='<div class="hgw-prop hgw-prop--feather"></div>';
    if(["potions"].indexOf(kind)>=0)html+='<div class="hgw-prop hgw-prop--cauldron"></div>';
    if(id==="divination")html+='<div class="hgw-prop hgw-prop--crystal"></div>';
    if(id==="astrTower"||id==="owlery")html+='<div class="hgw-prop hgw-prop--telescope"></div>';
    if(id==="office")html+='<div class="hgw-prop hgw-prop--clock"></div>';
    if(kind==="hospital")html+='<div class="hgw-prop hgw-prop--bed"></div>';
    if(kind==="greenhouse"||kind==="herbology"){
      html+='<div class="hgw-prop--glass"></div><div class="hgw-prop hgw-prop--plant"></div>';
    }
    if(kind==="quidditch")html+='<div class="hgw-prop--hoops"><i></i><i></i><i></i></div>';
    if(kind==="forest"||kind==="hut"){
      html+='<div class="hgw-prop--tree hgw-prop--tree-a"></div><div class="hgw-prop--tree hgw-prop--tree-b"></div>';
    }
    if(kind==="hut")html+='<div class="hgw-prop--hut"></div>';
    if(kind==="lake"||kind==="water")html+='<div class="hgw-prop--waterline"></div>';
    if(kind==="stair")html+='<div class="hgw-prop--staircase"></div>';
    if(kind==="chamber"||kind==="sewers")html+='<div class="hgw-prop hgw-prop--serpent"></div>';
    if(id==="bathroom")html+='<div class="hgw-prop hgw-prop--basin"></div>';
    if(id==="corridor")html+='<div class="hgw-prop hgw-prop--tapestry"></div>';
    if(room.secret){
      html+='<div class="hgw-secret-target hgw-secret-target--'+room.secret.type+'" tabindex="0" role="link" data-secret="'+safe(room.secret.type)+'" aria-label="Examine a curious '+(room.secret.type==="basin"?"engraved washbasin":"tapestry")+'"></div>';
    }
    return html;
  }
  function castleScene(room){
    var html='<div class="hgw-scene hgw-castle-scene" data-kind="exterior" data-room="gate">'+
      '<div class="hgw-stars">'+sparkles(60,934,"hgw-star")+'</div>'+
      '<div class="hgw-moon"></div>'+
      castleArtwork+
      '<div class="hgw-castle-path" aria-hidden="true"></div>'+
      '<div class="hgw-castle-threshold" role="link" tabindex="0" aria-label="Walk toward the castle doorway" data-door="n"></div>'+
      '<div class="hgw-fog"></div><div class="hgw-fog hgw-fog--top"></div>'+
      doorMarkup({exits:{s:room.exits.s}},"exterior")+
      '<div class="hgw-vignette"></div>';
    return html+'</div>';
  }
  function roomScene(room){
    if(room.id==="gate")return castleScene(room);
    var outside=outsideKinds.indexOf(room.kind)>=0;
    var content='<div class="hgw-scene hgw-scene--'+safe(room.kind)+' '+(outside?'hgw-scene--outdoor':'hgw-scene--interior')+'" data-room="'+safe(room.id)+'">'+
      (outside?
        '<div class="hgw-groundscape"><div class="hgw-sky"></div><div class="hgw-stars">'+sparkles(52,1492,"hgw-star")+'</div><div class="hgw-moon"></div>'+outdoorSVG(room.kind)+'<div class="hgw-outdoor-ground"></div></div>':
        '<div class="hgw-ceiling"></div><div class="hgw-backwall"></div><div class="hgw-leftwall"></div><div class="hgw-rightwall"></div><div class="hgw-floor"></div><div class="hgw-torch hgw-torch--l"></div><div class="hgw-torch hgw-torch--r"></div>')+
      '<div class="hgw-decoration">'+atmosphericObjects(room)+'</div>'+
      doorMarkup(room,room.kind)+
      '<div class="hgw-dust">'+sparkles(25,1244+room.name.length,"hgw-particle")+'</div>'+
      '<div class="hgw-stage-mist"></div><div class="hgw-vignette"></div></div>';
    return content;
  }
  function walkerMarkup(){
    return '<div id="hgw-walker" class="hgw-walker" aria-hidden="true"><span class="hgw-shadow"></span></div>';
  }
  function enterRoom(id,opts){
    opts=opts||{};
    var room=atlas.rooms[id];if(!room)return;
    stopWalk();current=room;busy=false;ceremonyArmed=false;
    avatar=opts.spawn||{x:50,y:room.id==="gate"?92:73};
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
    host.innerHTML=roomScene(room)+walkerMarkup()+
      '<div class="hgw-stage-note" aria-hidden="true"><span>'+safe(room.kicker)+'</span><span class="hgw-seal">✦</span></div>';
    document.title=room.name+" · Hogwarts";
    stageStamp.textContent=room.kicker;
    if(!session.visited.includes(id)){session.visited.push(id)}
    persist();syncAvatar();
    announce.textContent=room.name+". "+room.description;
    shell.classList.remove("is-transitioning");
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
    if(current.id==="gate"&&current.exits.n&&avatar.y<=80&&avatar.x>=41&&avatar.x<=59)return "n";
    if(current.exits.n&&avatar.y<=32&&avatar.x>=37&&avatar.x<=63)return "n";
    if(current.exits.s&&avatar.y>=88&&avatar.x>=34&&avatar.x<=66)return "s";
    if(current.exits.w&&avatar.x<=18&&avatar.y>=35&&avatar.y<=67)return "w";
    if(current.exits.e&&avatar.x>=82&&avatar.y>=35&&avatar.y<=67)return "e";
    return null;
  }
  function checkSecret(){
    if(!current||!current.secret)return false;
    var spot=current.secret;
    var dx=avatar.x-spot.x,dy=avatar.y-spot.y;
    if(Math.sqrt(dx*dx+dy*dy)<=8){
      changeRoom(spot.to,null);return true;
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
      Math.hypot(avatar.x-65,avatar.y-67)<=7&&visitSortingCeremony());
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
    busy=true;stopWalk();
    shell.classList.add("is-transitioning");
    var spawn=direction?spawnAfter(direction):{x:50,y:74};
    window.setTimeout(function(){
      var room=atlas.rooms[to];
      window.history.pushState({hogwarts:true,room:to},"",room.path);
      enterRoom(to,{spawn:spawn});
      window.dispatchEvent(new Event("hogwarts:scenechange"));
    },reduced?20:405);
  }
  function move(dx,dy){
    if(busy||!current)return;
    stopWalk();ceremonyArmed=true;
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
    if(dist<=1.7){syncAvatar(false);walkTarget=null;checkSecret()||checkCeremony();return}
    var speed=1.8;
    avatar.x=Math.max(7,Math.min(93,avatar.x+(dx/dist)*speed));
    avatar.y=Math.max(23,Math.min(93,avatar.y+(dy/dist)*speed));
    syncAvatar(true);
    var direction=findExit();
    if(direction){changeRoom(current.exits[direction],direction);return}
    if(checkSecret()||checkCeremony())return;
    ambientLine();
    frame=window.requestAnimationFrame(tickAuto);
  }
  function goTo(x,y,ceremony){
    if(busy)return;
    stopWalk();ceremonyArmed=!!ceremony;walkTarget={x:Math.max(7,Math.min(93,x)),y:Math.max(23,Math.min(93,y))};
    frame=window.requestAnimationFrame(tickAuto);
  }
  function clickOnScene(event){
    if(busy||!current)return;
    var door=event.target.closest("[data-door]");
    if(door&&host.contains(door)){
      var dir=door.getAttribute("data-door");
      if(!current.exits[dir])return;
      var target=approachOf(dir);
      if(current.id==="gate"&&dir==="n")target={x:50,y:79};
      goTo(target.x,target.y);return;
    }
    var secret=event.target.closest("[data-secret]");
    if(secret&&host.contains(secret)&&current.secret){
      goTo(current.secret.x,current.secret.y);return;
    }
    var ceremony=event.target.closest("[data-ceremony]");
    if(ceremony&&host.contains(ceremony)&&current.id==="great"){
      goTo(65,67,true);return;
    }
    var rect=host.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    var x=100*(event.clientX-rect.left)/rect.width;
    var y=100*(event.clientY-rect.top)/rect.height;
    goTo(x,y,current.id==="great"&&Math.hypot(x-65,y-67)<=7);
  }
  host.addEventListener("click",clickOnScene);
  host.addEventListener("keydown",function(event){
    if(event.target!==host&&(event.key==="Enter"||event.key===" ")){
      var action=event.target.closest("[data-door],[data-secret],[data-ceremony]");
      if(action){event.preventDefault();action.click();return}
    }
  });
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
