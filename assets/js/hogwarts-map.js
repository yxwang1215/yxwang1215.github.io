/* Hogwarts explorer's parchment atlas.
 * Reveals only visited rooms and the unnamed ends of ordinary explored corridors.
 * This is a read-only chart, not a fast-travel interface or an access-control mechanism.
 */
(function () {
  "use strict";

  var atlas = window.HogwartsAtlas;
  if (!atlas || !atlas.rooms) return;

  // Coordinates are hand-laid on five illustrated floor plans, never derived
  // from URL paths. Secret places have their own page, unlocked by exploration.
  var sections = [
    { id: "grounds", title: "The Grounds", subtitle: "Lake · paths · greenhouses",
      coords: {gate:[260,205], forecourt:[205,352], courtyard:[415,358], bridge:[608,376],
        lake:[777,448], boathouse:[747,569], dock:[921,530], forest:[626,171],
        clearing:[490,88], hut:[779,95], paddock:[898,186], quidditch:[380,512],
        greenhouse:[437,216], herbology:[286,105], flying:[180,576]} },
    { id: "keep", title: "The Keep", subtitle: "Halls · kitchens · portraits",
      coords: {entry:[468,510], great:[467,307], kitchens:[691,333], pantry:[720,151],
        gallery:[229,300], armoury:[462,117], cloister:[745,515], hospital:[840,250]} },
    { id: "academic", title: "Academic Wing", subtitle: "Classes · corridors · library",
      coords: {staircase:[175,474], corridor:[300,302], library:[513,301],
        transfig:[700,349], baths:[505,517], bathroom:[824,526], history:[859,303],
        charms:[305,118], defense:[815,114]} },
    { id: "towers", title: "Upper Towers", subtitle: "High places · old secrets",
      coords: {office:[410,404], astrStair:[202,268], astrTower:[764,179],
        divination:[499,109], owlery:[427,196], ramparts:[745,465]} },
    { id: "dungeons", title: "Dungeons", subtitle: "Stone · lanterns · deep water",
      coords: {dungeonSteps:[443,313], potions:[442,493], oldArchive:[458,112],
        crypt:[188,317], slytherin:[754,155], reservoir:[749,489], vault:[199,112]} },
    { id: "unmapped", title: "Uncharted", subtitle: "Revealed only to the curious",
      coords: {requirement:[257,327], sluice:[703,501], chamber:[695,313], sanctum:[692,128]},
      secret: true }
  ];

  var roomSection = Object.create(null);
  sections.forEach(function (section) {
    Object.keys(section.coords).forEach(function (id) { roomSection[id] = section.id; });
  });

  var sessionKey = "hogwarts:session:v2";
  function currentId() {
    var path = window.location.pathname.replace(/index\.html$/i, "").replace(/\/+$/, "") + "/";
    return atlas.byPath[path] || null;
  }
  function visitedRooms() {
    try {
      var session = JSON.parse(window.sessionStorage.getItem(sessionKey) || "null");
      if (!session || !Array.isArray(session.visited)) return new Set();
      return new Set(session.visited.filter(function (id) { return !!atlas.rooms[id]; }));
    } catch (error) { return new Set(); }
  }
  function connectedVisited(id, visited) {
    var room = atlas.rooms[id];
    if (!room) return [];
    var result = Object.keys(room.exits || {}).map(function (direction) { return room.exits[direction]; });
    if (room.secret && visited.has(room.secret.to)) result.push(room.secret.to);
    // Secret passages are drawn only after both endpoints have been visited.
    Object.keys(atlas.rooms).forEach(function (otherId) {
      var other = atlas.rooms[otherId];
      if (visited.has(otherId) && other.secret && other.secret.to === id) result.push(otherId);
    });
    return result.filter(function (next, index) {
      return visited.has(next) && result.indexOf(next) === index;
    });
  }
  function routeBetween(from, to, visited) {
    if (!visited.has(from) || !visited.has(to) || !atlas.rooms[from] || !atlas.rooms[to]) return null;
    var queue = [from], parents = Object.create(null);
    parents[from] = null;
    for (var i = 0; i < queue.length; i++) {
      var id = queue[i];
      if (id === to) break;
      connectedVisited(id, visited).forEach(function (next) {
        if (Object.prototype.hasOwnProperty.call(parents, next)) return;
        parents[next] = id;
        queue.push(next);
      });
    }
    if (!Object.prototype.hasOwnProperty.call(parents, to)) return null;
    var path = [];
    for (var at = to; at !== null; at = parents[at]) path.push(at);
    return path.reverse();
  }
  function availableSections(visited) {
    var hiddenDiscovered = Object.keys(sections[5].coords).some(function (id) { return visited.has(id); });
    return sections.filter(function (section) { return !section.secret || hiddenDiscovered; });
  }

  // Pure model is exposed for the map's regression test and future extensions.
  window.HogwartsMapModel = {
    sections: sections,
    zoneOf: function (id) { return roomSection[id] || null; },
    routeBetween: routeBetween,
    availableSections: availableSections
  };

  var dialog = document.getElementById("hmap-dialog");
  var trigger = document.getElementById("hmap-trigger");
  if (!dialog || !trigger || document.documentElement.getAttribute("data-hgw-authorized") !== "true") return;

  var closeButton = document.getElementById("hmap-close");
  var tabs = document.getElementById("hmap-tabs");
  var picture = document.getElementById("hmap-illustration");
  var paths = document.getElementById("hmap-paths");
  var points = document.getElementById("hmap-points");
  var scroller = document.getElementById("hmap-scroll");
  var title = document.getElementById("hmap-area-title");
  var subtitle = document.getElementById("hmap-area-subtitle");
  var progress = document.getElementById("hmap-progress");
  var roomTitle = document.getElementById("hmap-room-title");
  var roomSubtitle = document.getElementById("hmap-room-subtitle");
  var roomDetail = document.getElementById("hmap-room-description");
  var roomSteps = document.getElementById("hmap-room-steps");
  var roomLinks = document.getElementById("hmap-room-neighbours");
  var locate = document.getElementById("hmap-locate");
  var area = sections[0].id, selected = null, open = false, previousFocus = null;
  var ns = "http://www.w3.org/2000/svg";
  var bounds = { width: 1000, height: 640 };
  var illustrations = {
    grounds: '<g class="hmap-etch"><path d="M35 145Q160 80 275 133T526 116Q692 15 901 145"/>'+
      '<path d="M600 480Q667 395 744 409T940 380L1020 651H660Q660 545 600 480Z" class="hmap-wash"/>'+
      '<path d="M634 468q108-48 220-12m-177 39q120-44 234-7m-202 47q85-19 165-10"/>'+
      '<path d="M285 290l-34-83 26-26v-62h21v62l31 28-31 82zM234 297v-80l-22-30 22-28 24 30v101z"/>'+
      '<path d="M187 310h149v55H187zM174 313l91-40 84 40M191 332h137"/>'+
      '<path d="M521 430q95-39 178-31M380 391q69 27 122 12M203 400q-38 65-23 109" stroke-dasharray="4 11"/>'+
      '<circle cx="389" cy="540" r="61"/><circle cx="389" cy="540" r="51"/><path d="M351 512v54m76-54v54"/>'+
      '<path d="M665 141l-17 37h32zM665 119l-22 34h44zM698 129l-17 33h34zM619 131l-20 39h40z"/>'+
      '<path d="M788 125h65v46h-65zM792 125l29-28 28 28M846 128h14v44h-14M780 170h88"/>'+
      '<path d="M437 215l28-61 30 61M439 215h58l-20 33z"/>'+
      '<path d="M70 570Q189 536 240 590T434 624M48 90q35 22 68 0m-58 16q35 22 68 0"/></g>',
    keep: '<g class="hmap-etch"><path d="M160 78H832l93 92v338l-86 71H157l-75-85V178z"/>'+
      '<path d="M189 106H815l68 77v309l-62 54H178l-63-68V187z"/>'+
      '<path d="M330 107v437M628 107v437M119 404h764M165 219h716" stroke-dasharray="9 11"/>'+
      '<path d="M350 242h236v129H350zM398 242v-31h140v31m-166 129v46m174-46v46"/>'+
      '<path d="M380 482h169v99H380zM396 482v-22h139v22"/>'+
      '<path d="M658 278h135v101H658zM686 277v-37h81v37"/>'+
      '<path d="M159 242h146v127H159zM175 257h113v99H175z"/>'+
      '<path d="M396 114h144l-22-30h-103zM706 103h102v118H706z"/>'+
      '<path d="M670 460h178v92H670zM695 460v-32h124v32"/>'+
      '<path d="M805 234h95v148h-95z"/></g>',
    academic: '<g class="hmap-etch"><path d="M112 128H881v378H112zM143 163H851v317H143z"/>'+
      '<path d="M120 263h740M120 386h740M413 160v320M633 160v320" stroke-dasharray="8 9"/>'+
      '<path d="M208 229h177v124H208zM433 220h184v142H433zM662 230h161v140H662z"/>'+
      '<path d="M200 390l-44 51 47 49 47-46zM483 404h190v123H483z"/>'+
      '<path d="M188 101h244v105H188zM704 87h171v122H704z"/>'+
      '<path d="M467 252h116m-116 27h116m-116 27h116M660 409h174"/>'+
      '<path d="M185 491q44 40 88-3t86-8" stroke-width="5" stroke-dasharray="3 15"/>'+
      '<circle cx="525" cy="299" r="34"/><circle cx="525" cy="299" r="18"/></g>',
    towers: '<g class="hmap-etch"><circle cx="500" cy="326" r="246"/><circle cx="500" cy="326" r="203"/>'+
      '<path d="M500 55v545M232 326h540M317 142l365 367m0-367L317 509" stroke-dasharray="7 12"/>'+
      '<path d="M391 382h181v112H391zM400 382l84-55 78 55"/>'+
      '<path d="M685 147h163v157H685zM681 146l85-85 86 85M738 181h56v91h-56z"/>'+
      '<path d="M363 149h163v126H363zM372 149l76-65 72 65"/>'+
      '<path d="M157 201h134v163H157zM150 201l74-90 74 90"/>'+
      '<path d="M680 421h156v111H680zM690 420l69-45 69 45"/>'+
      '<circle cx="501" cy="327" r="46"/><circle cx="501" cy="327" r="24"/>'+
      '<path d="M500 307v40m-20-20h40"/></g>',
    dungeons: '<g class="hmap-etch"><path d="M95 104H895v433H95zM119 130H870v382H119z"/>'+
      '<path d="M121 229h754M120 418h755M344 128v383M606 128v383" stroke-dasharray="3 10"/>'+
      '<path d="M147 270h198v111H147zM375 239h176v149H375zM649 273h182v112H649z"/>'+
      '<path d="M140 77h240v145H140zM382 75h193v134H382zM659 78h184v141H659z"/>'+
      '<path d="M198 444v121m45-121v121M392 433h133v134H392zM659 432h167v146H659z"/>'+
      '<path d="M482 267c-33 14-40 46-14 64 30 20 64-15 32-37-20-12-32 17-11 19"/>'+
      '<path d="M92 590q155-35 290 5T710 595T946 581"/></g>',
    unmapped: '<g class="hmap-etch"><path d="M131 206q194-148 322 18t-100 291q-138 73-221-57t72-173"/>'+
      '<path d="M655 69c130-23 225 94 183 198s-175 85-170 157 138 101 178 32"/>'+
      '<path d="M566 150c71-112 253-92 300 10 50 109-102 189-145 124s-1-131 77-93"/>'+
      '<path d="M642 388q-52 48-13 119t145 80M665 393q-5 63 59 96"/>'+
      '<path d="M166 294l78-81 81 81-81 80zM671 282l34-52 36 52-36 56z"/>'+
      '<circle cx="703" cy="315" r="80"/><circle cx="245" cy="324" r="78" stroke-dasharray="6 9"/>'+
      '<path d="M701 68l16 27-16 27-16-27zM668 106h69"/></g>'
  };

  function backgroundFor(section) {
    return '<defs><pattern id="hmap-scratch" width="43" height="43" patternUnits="userSpaceOnUse">' +
      '<path d="M0 42L42 0M30 43l13-13" fill="none" stroke="#785938" stroke-opacity=".05"/></pattern></defs>' +
      '<rect x="0" y="0" width="1000" height="640" fill="url(#hmap-scratch)"/>' +
      '<path class="hmap-compass-lines" d="M50 50h900v540H50z"/>' +
      '<path class="hmap-compass-lines" d="M50 75h900M50 565h900M75 50v540M925 50v540"/>' +
      '<text x="500" y="607" class="hmap-engraving" text-anchor="middle">' +
      ({grounds:"SCHOOL GROUNDS",keep:"THE ANCIENT KEEP",academic:"THE SCHOLAR'S WING",towers:"THE WATCHTOWERS",dungeons:"BELOW THE STONES",unmapped:"HERE BE UNSPOKEN THINGS"}[section.id]) +
      '</text>' +
      '<g class="hmap-compass" transform="translate(933 91)"><circle r="29"/>' +
      '<path d="M0-26V26M-26 0H26M0-22l5 22-5-3-5 3z"/><text x="0" y="-36" text-anchor="middle">N</text></g>' +
      illustrations[section.id];
  }

  function svgPath(d, className) {
    var element = document.createElementNS(ns, "path");
    element.setAttribute("d", d);
    element.setAttribute("class", className);
    paths.appendChild(element);
  }
  function curve(a, b) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    var vx = b[0] - a[0], vy = b[1] - a[1];
    var scale = Math.max(1, Math.hypot(vx, vy));
    var bend = Math.min(19, scale * 0.08);
    return "M" + a[0] + " " + a[1] + " Q" +
      (mx - vy / scale * bend).toFixed(1) + " " +
      (my + vx / scale * bend).toFixed(1) + " " + b[0] + " " + b[1];
  }
  function sectionById(id) {
    return sections.filter(function (section) { return section.id === id; })[0] || sections[0];
  }
  function roomButton(id, xy, current, active) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "hmap-point" + (current ? " is-current" : "") + (active ? " is-selected" : "") +
      (xy[0] > 845 ? " is-east" : xy[0] < 155 ? " is-west" : "");
    button.style.left = (xy[0] / bounds.width * 100) + "%";
    button.style.top = (xy[1] / bounds.height * 100) + "%";
    button.dataset.room = id;
    button.setAttribute("aria-label", atlas.rooms[id].name + (current ? ", your current location" : ", visited"));
    button.setAttribute("aria-pressed", String(active));
    var dot = document.createElement("span");
    dot.className = "hmap-point-dot";
    dot.setAttribute("aria-hidden", "true");
    var label = document.createElement("span");
    label.className = "hmap-point-label";
    label.textContent = atlas.rooms[id].name;
    button.appendChild(dot);
    button.appendChild(label);
    return button;
  }
  function unknownMark(xy) {
    var marker = document.createElement("span");
    marker.className = "hmap-undiscovered";
    marker.style.left = (xy[0] / bounds.width * 100) + "%";
    marker.style.top = (xy[1] / bounds.height * 100) + "%";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "?";
    return marker;
  }
  function drawMap(visited, where) {
    var zone = sectionById(area), coords = zone.coords;
    picture.innerHTML = backgroundFor(zone);
    paths.replaceChildren();
    points.replaceChildren();
    var route = selected ? routeBetween(where, selected, visited) : null;
    var routeEdges = new Set();
    if (route) for (var i = 1; i < route.length; i++) {
      routeEdges.add([route[i-1],route[i]].sort().join("|"));
    }
    var rendered = new Set();
    Object.keys(coords).forEach(function (id) {
      if (!visited.has(id)) return;
      var room = atlas.rooms[id];
      Object.keys(room.exits).forEach(function (dir) {
        var neighbor = room.exits[dir];
        if (!coords[neighbor]) return;
        var key = [id,neighbor].sort().join("|");
        if (rendered.has(key)) return;
        rendered.add(key);
        var known = visited.has(neighbor);
        svgPath(curve(coords[id], coords[neighbor]), known ?
          (routeEdges.has(key) ? "hmap-passage hmap-route" : "hmap-passage") :
          "hmap-passage hmap-unfinished");
      });
      if (room.secret && visited.has(room.secret.to) && coords[room.secret.to]) {
        var secretKey = [id,room.secret.to].sort().join("|");
        if (!rendered.has(secretKey)) {
          rendered.add(secretKey);
          svgPath(curve(coords[id],coords[room.secret.to]),
            routeEdges.has(secretKey) ? "hmap-passage hmap-route hmap-secret-link" : "hmap-passage hmap-secret-link");
        }
      }
    });
    // Concealed places are excluded until actually visited. Normal unexplored
    // corridors get an anonymous ink blot so the map still rewards curiosity.
    Object.keys(coords).forEach(function (id) {
      if (visited.has(id)) points.appendChild(roomButton(id, coords[id], id === where, id === selected));
      else if (!zone.secret && Object.keys(atlas.rooms).some(function (source) {
        return visited.has(source) && atlas.rooms[source].exits &&
          Object.values(atlas.rooms[source].exits).indexOf(id) !== -1;
      })) points.appendChild(unknownMark(coords[id]));
    });
  }
  function displayDetails(visited, where) {
    var room = selected ? atlas.rooms[selected] : null;
    var totalInZone = Object.keys(sectionById(area).coords).length;
    var seenInZone = Object.keys(sectionById(area).coords).filter(function (id) { return visited.has(id); }).length;
    progress.textContent = sectionById(area).secret ?
      seenInZone + " found" : seenInZone + " / " + totalInZone + " found";
    title.textContent = sectionById(area).title;
    subtitle.textContent = sectionById(area).subtitle;
    if (!room || !visited.has(selected)) {
      roomSubtitle.textContent = "A page still waiting for footsteps";
      roomTitle.textContent = "Uncharted territory";
      roomDetail.textContent = "Only places you have walked will take shape on this parchment. Keep exploring the castle to uncover the ink.";
      roomSteps.textContent = "No rooms charted on this page yet.";
      roomLinks.textContent = "";
      return;
    }
    roomSubtitle.textContent = (selected === where ? "YOU ARE HERE · " : "DISCOVERED · ") + room.kicker;
    roomTitle.textContent = room.name;
    roomDetail.textContent = room.description;
    var route = routeBetween(where, selected, visited);
    if (selected === where) {
      roomSteps.textContent = "Your footsteps are marked by the red seal.";
    } else if (route) {
      var count = route.length - 1;
      roomSteps.textContent = count + (count === 1 ? " known passage" : " known passages") +
        " from where you stand. First: " + atlas.rooms[route[1]].name + ".";
    } else {
      roomSteps.textContent = "No continuous trail through your explored rooms yet.";
    }
    var connections = connectedVisited(selected, visited).map(function (id) { return atlas.rooms[id].name; });
    roomLinks.textContent = connections.length ? "Mapped passages: " + connections.join(" · ") :
      "No neighbouring corridors inked in yet.";
  }
  function drawTabs(visited) {
    tabs.replaceChildren();
    availableSections(visited).forEach(function (zone) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "hmap-tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(area === zone.id));
      button.setAttribute("aria-controls", "hmap-scroll");
      button.tabIndex = area === zone.id ? 0 : -1;
      button.dataset.area = zone.id;
      var count = Object.keys(zone.coords).filter(function (id) {return visited.has(id);}).length;
      var name = document.createElement("span");
      name.textContent = zone.title;
      var tally = document.createElement("small");
      tally.textContent = String(count).padStart(2,"0");
      button.appendChild(name);
      button.appendChild(tally);
      tabs.appendChild(button);
    });
  }
  function render() {
    var visited = visitedRooms(), where = currentId();
    if (!where) return;
    visited.add(where);
    if (sectionById(area).secret && !availableSections(visited).some(function(s){return s.id===area;})) {
      area = roomSection[where];
    }
    var coords = sectionById(area).coords;
    if (!selected || !visited.has(selected) || roomSection[selected] !== area) {
      selected = roomSection[where] === area ? where :
        (Object.keys(coords).filter(function (id) {return visited.has(id);})[0] || null);
    }
    drawTabs(visited);
    drawMap(visited, where);
    displayDetails(visited, where);
  }
  function selectArea(id, focusTab) {
    var visited = visitedRooms();
    if (!availableSections(visited).some(function (zone) {return zone.id === id;})) return;
    area = id; selected = null; render();
    if (focusTab) {
      var button = Array.from(tabs.querySelectorAll("button")).find(function (element) {
        return element.dataset.area === id;
      });
      if (button) button.focus();
    }
    scroller.scrollLeft = 0;
    scroller.scrollTop = 0;
  }
  function openMap() {
    if (open) return;
    previousFocus = document.activeElement;
    open = true;
    area = roomSection[currentId()] || "grounds";
    selected = currentId();
    dialog.hidden = false;
    document.body.classList.add("hmap-unfurled");
    trigger.setAttribute("aria-expanded", "true");
    document.getElementById("hgw-shell").inert = true;
    render();
    closeButton.focus();
  }
  function closeMap() {
    if (!open) return;
    open = false;
    dialog.hidden = true;
    document.body.classList.remove("hmap-unfurled");
    document.getElementById("hgw-shell").inert = false;
    trigger.setAttribute("aria-expanded", "false");
    if (previousFocus && previousFocus !== document.body && previousFocus.isConnected &&
        typeof previousFocus.focus === "function") previousFocus.focus();
    else trigger.focus();
  }
  function locateMe() {
    var here = currentId();
    if (!here) return;
    selectArea(roomSection[here], false);
    selected = here;
    render();
    // Center the current marker in the scrollable parchment on narrow screens.
    var button = points.querySelector(".hmap-point.is-current");
    if (button) {
      var midpoint = button.offsetLeft - scroller.clientWidth / 2;
      scroller.scrollLeft = Math.max(0, midpoint);
    }
  }

  trigger.addEventListener("click", openMap);
  closeButton.addEventListener("click", closeMap);
  locate.addEventListener("click", locateMe);
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeMap();
  });
  tabs.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-area]");
    if (tab) selectArea(tab.dataset.area, true);
  });
  points.addEventListener("click", function (event) {
    var point = event.target.closest("[data-room]");
    if (!point) return;
    selected = point.dataset.room;
    render();
    var refreshed = points.querySelector('[data-room="' + selected + '"]');
    if (refreshed) refreshed.focus();
  });
  window.addEventListener("hogwarts:scenechange", function () {
    if (!open) return;
    area = roomSection[currentId()] || area;
    selected = currentId();
    render();
  });
  window.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    var tag = event.target && event.target.tagName;
    if (!open) {
      if ((event.key === "m" || event.key === "M") &&
          !/^(INPUT|TEXTAREA|SELECT)$/.test(tag || "") &&
          !(event.target && event.target.isContentEditable)) {
        event.preventDefault();event.stopImmediatePropagation();openMap();
      }
      return;
    }
    if (event.key === "Escape" || event.key === "m" || event.key === "M") {
      event.preventDefault();event.stopImmediatePropagation();closeMap();return;
    }
    if (event.key === "Tab") {
      var focusable = Array.from(dialog.querySelectorAll('button:not([disabled]),[href], [tabindex="0"]'))
        .filter(function (element) {return element.offsetParent !== null;});
      if (focusable.length) {
        var first = focusable[0], last = focusable[focusable.length-1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();event.stopImmediatePropagation();last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();event.stopImmediatePropagation();first.focus();
        }
      }
      return;
    }
    if (/^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|w|a|s|d)$/i.test(event.key) ||
        event.key === "Home" || event.key === "End") {
      var tab = document.activeElement && document.activeElement.closest("#hmap-tabs [data-area]");
      if (tab && /^(ArrowLeft|ArrowRight|Home|End)$/.test(event.key)) {
        var allowed = availableSections(visitedRooms());
        var at = allowed.findIndex(function (item) {return item.id===area;});
        var next = event.key === "Home" ? 0 : event.key === "End" ? allowed.length-1 :
          (at + (event.key === "ArrowRight" ? 1 : -1) + allowed.length) % allowed.length;
        selectArea(allowed[next].id, true);
        event.preventDefault();event.stopImmediatePropagation();return;
      }
      if (/^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|w|a|s|d)$/i.test(event.key)) {
        if (document.activeElement === scroller) {
          if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") scroller.scrollLeft -= 100;
          if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") scroller.scrollLeft += 100;
          if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") scroller.scrollTop -= 100;
          if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") scroller.scrollTop += 100;
        }
        event.preventDefault();event.stopImmediatePropagation();
      }
    }
  }, true);
})();