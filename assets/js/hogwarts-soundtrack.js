/* Hogwarts scene soundtracks.
 * Official recordings play through Spotify's licensed Embed.
 * If properly licensed local MP3s are added to /assets/audio/hogwarts/,
 * the same routes can also play native, low-volume audio in-page.
 */
(function () {
  "use strict";

  var score = [
    {
      path: "/platform-934/",
      title: "Platform Nine-and-Three-Quarters and the Journey to Hogwarts",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "72SmD8s1DYkwUhoEkGlnyV",
      file: "platform-934.mp3"
    },
    {
      path: "/hogwarts/chamber-of-secrets/",
      title: "The Chamber of Secrets",
      composer: "John Williams · Chamber of Secrets (2002)",
      spotify: "0go4boa9hw472v8dFpRI5V",
      file: "chamber-of-secrets.mp3"
    },
    {
      path: "/hogwarts/sorting-ceremony/",
      title: "Entry into the Great Hall and the Banquet",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "0UDSwgomgI5bK1x1eYeBez",
      file: "sorting-ceremony.mp3"
    },
    {
      path: "/hogwarts/great-hall/",
      title: "Entry into the Great Hall and the Banquet",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "0UDSwgomgI5bK1x1eYeBez",
      file: "great-hall.mp3"
    },
    {
      path: "/hogwarts/staircases/",
      title: "Hogwarts Forever! and the Moving Stairs",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "0pyKuk3bYFSzPIysym8ioN",
      file: "staircases.mp3"
    },
    {
      path: "/hogwarts/quidditch/",
      title: "The Quidditch Match",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "4aL5x9pzbU5PTLca3oJjo3",
      file: "quidditch.mp3"
    },
    {
      path: "/hogwarts/hogsmeade/",
      title: "A Window to the Past",
      composer: "John Williams · Prisoner of Azkaban (2004)",
      spotify: "1PPTlPJqKuL0fdoTmzwXJy",
      file: "hogsmeade.mp3"
    },
    {
      path: "/hogwarts/astronomy-tower/",
      title: "Dumbledore's Farewell",
      composer: "Nicholas Hooper · Half-Blood Prince (2009)",
      spotify: "0bmb8jg6ljmt8qBmIsMNvL",
      file: "astronomy-tower.mp3"
    },
    {
      path: "/hogwarts/potions/",
      title: "Polyjuice Potion",
      composer: "John Williams · Chamber of Secrets (2002)",
      spotify: "23UVS3PRoBNUwWio4aqPId",
      file: "potions.mp3"
    },
    {
      path: "/hogwarts/grounds/",
      title: "Harry's Wondrous World",
      composer: "John Williams · Chamber of Secrets (2002)",
      spotify: "5qWvQZewRB57giOKgvUE3F",
      file: "grounds.mp3"
    },
    {
      path: "/hogwarts/",
      title: "Hedwig's Theme",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "1n8NKQRg8LVHy7oUhUgbFF",
      file: "hedwigs-theme.mp3"
    }
  ];

  var routePrefix = /^\/(hogwarts|platform-934)(\/|$)/;
  if (!routePrefix.test(window.location.pathname)) return;

  var storage = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (error) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (error) {}
    }
  };
  var preferenceKey = "hogwarts:score:enabled:v1";
  var volumeKey = "hogwarts:score:volume:v1";
  var enabled = storage.get(preferenceKey) !== "off";
  var savedVolume = Number(storage.get(volumeKey));
  var volume = Number.isFinite(savedVolume) && savedVolume > 0 && savedVolume <= 1
    ? savedVolume : 0.24;
  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hash-router compatibility: /hogwarts/#/chamber-of-secrets/ is also supported.
  function normalize(path) {
    return path.replace(/index\.html$/i, "").replace(/\/+$/, "") + "/";
  }
  function routeFromLocation() {
    var path = normalize(window.location.pathname);
    var hash = window.location.hash;
    if (path === "/hogwarts/" && /^#\/[a-z0-9/_-]+$/i.test(hash)) {
      var scene = hash.slice(2).replace(/^hogwarts\//i, "");
      path = normalize("/hogwarts/" + scene);
    }
    var best = null;
    score.forEach(function (item) {
      if (path.indexOf(item.path) === 0 &&
        (!best || item.path.length > best.path.length)) best = item;
    });
    return best || score[score.length - 1];
  }

  var root = document.createElement("aside");
  root.className = "hw-score";
  root.setAttribute("aria-label", "Film soundtrack for this location");
  root.innerHTML =
    '<button type="button" class="hw-score__seal" aria-label="Open soundtrack" ' +
      'aria-controls="hw-score-panel" aria-expanded="false" title="Scene soundtrack">' +
      '<span aria-hidden="true">♫</span>' +
    '</button>' +
    '<section class="hw-score__panel" id="hw-score-panel" aria-label="Scene soundtrack" hidden>' +
      '<div class="hw-score__eyebrow">SOUNDTRACK OF THIS PLACE</div>' +
      '<h2 class="hw-score__title"></h2>' +
      '<p class="hw-score__composer"></p>' +
      '<div class="hw-score__embed" aria-label="Official Spotify soundtrack player"></div>' +
      '<div class="hw-score__local" hidden>' +
        '<button type="button" class="hw-score__local-toggle" aria-pressed="false">Play in-page soundtrack</button>' +
        '<label class="hw-score__volume-label">Volume ' +
          '<input class="hw-score__volume" type="range" min="0" max="100" value="24" ' +
          'aria-label="In-page soundtrack volume"></label>' +
      '</div>' +
      '<p class="hw-score__note">Official Spotify player · press play to listen.</p>' +
      '<a class="hw-score__link" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a>' +
    '</section>';
  document.body.appendChild(root);

  var seal = root.querySelector(".hw-score__seal");
  var panel = root.querySelector(".hw-score__panel");
  var title = root.querySelector(".hw-score__title");
  var composer = root.querySelector(".hw-score__composer");
  var embed = root.querySelector(".hw-score__embed");
  var localControls = root.querySelector(".hw-score__local");
  var localToggle = root.querySelector(".hw-score__local-toggle");
  var volumeControl = root.querySelector(".hw-score__volume");
  var officialLink = root.querySelector(".hw-score__link");

  volumeControl.value = String(Math.round(volume * 100));
  var current = null;
  var audio = null;
  var loadToken = 0;
  var isPanelOpen = false;
  var fadeToken = 0;

  function stopAudio() {
    fadeToken += 1;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio = null;
  }
  function refreshLocalControls() {
    localControls.hidden = !audio;
    localToggle.textContent = audio && !audio.paused ? "Pause in-page soundtrack" :
      "Play in-page soundtrack";
    localToggle.setAttribute("aria-pressed", String(!!audio && !audio.paused));
  }
  function fadeIn(element) {
    var token = ++fadeToken;
    if (reducedMotion) {
      element.volume = volume;
      return;
    }
    element.volume = 0;
    var start = window.performance.now();
    function frame(time) {
      if (token !== fadeToken || audio !== element || element.paused) return;
      var fraction = Math.min(1, (time - start) / 1900);
      element.volume = Math.min(1, volume * fraction);
      if (fraction < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }
  function playLocal() {
    if (!audio || !enabled) return;
    if (!audio.paused) return;
    var candidate = audio;
    // Never play the in-page recording over the Spotify embed.
    if (isPanelOpen && embed.firstChild) {
      embed.replaceChildren();
    }
    var promise = candidate.play();
    if (promise && typeof promise.then === "function") {
      promise.then(function () {
        if (candidate === audio) fadeIn(candidate);
        refreshLocalControls();
      }).catch(function () { refreshLocalControls(); });
    } else {
      fadeIn(candidate);
      refreshLocalControls();
    }
  }
  function inspectLocalFile(item) {
    var token = ++loadToken;
    stopAudio();
    refreshLocalControls();
    var url = "/assets/audio/hogwarts/" + item.file;
    // MP3 files are intentionally not included: soundtrack recordings require
    // permission to distribute publicly. The official Spotify embed works now.
    window.fetch(url, { method: "HEAD", cache: "force-cache" }).then(function (response) {
      if (!response.ok || token !== loadToken) return;
      var element = new Audio(url);
      element.loop = true;
      element.preload = "auto";
      element.volume = volume;
      element.addEventListener("play", refreshLocalControls);
      element.addEventListener("pause", refreshLocalControls);
      element.addEventListener("error", function () {
        if (element !== audio) return;
        stopAudio();
        refreshLocalControls();
      });
      audio = element;
      refreshLocalControls();
      if (enabled && !isPanelOpen) playLocal();
    }).catch(function () {});
  }
  function clearEmbed() {
    while (embed.firstChild) embed.removeChild(embed.firstChild);
  }
  function makeEmbed() {
    if (!current || embed.firstChild) return;
    var frame = document.createElement("iframe");
    frame.className = "hw-score__spotify";
    frame.title = "Spotify: " + current.title;
    frame.src = "https://open.spotify.com/embed/track/" + current.spotify + "?theme=0";
    frame.width = "100%";
    frame.height = "152";
    frame.loading = "lazy";
    frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute("allowfullscreen", "");
    embed.appendChild(frame);
  }
  function openPanel() {
    isPanelOpen = true;
    panel.hidden = false;
    seal.setAttribute("aria-expanded", "true");
    if (audio) audio.pause();
    makeEmbed();
    refreshLocalControls();
  }
  function closePanel() {
    isPanelOpen = false;
    panel.hidden = true;
    seal.setAttribute("aria-expanded", "false");
    clearEmbed(); // Also stops playback when the official player is closed.
    if (enabled) playLocal();
    refreshLocalControls();
  }
  function sync() {
    var next = routeFromLocation();
    if (current && current.path === next.path) return;
    current = next;
    title.textContent = next.title;
    composer.textContent = next.composer;
    seal.setAttribute("aria-label", "Soundtrack: " + next.title + ". Open player");
    seal.title = next.title;
    officialLink.href = "https://open.spotify.com/track/" + next.spotify;
    clearEmbed();
    if (isPanelOpen) makeEmbed();
    inspectLocalFile(next);
  }

  seal.addEventListener("click", function () {
    if (isPanelOpen) closePanel();
    else openPanel();
  });
  localToggle.addEventListener("click", function () {
    if (!audio) return;
    if (!audio.paused) {
      enabled = false;
      storage.set(preferenceKey, "off");
      fadeToken += 1;
      audio.pause();
    } else {
      enabled = true;
      storage.set(preferenceKey, "on");
      playLocal();
    }
    refreshLocalControls();
  });
  volumeControl.addEventListener("input", function () {
    volume = Math.min(1, Math.max(0, Number(volumeControl.value) / 100));
    storage.set(volumeKey, String(volume));
    if (audio && !audio.paused) {
      fadeToken += 1;
      audio.volume = volume;
    }
  });
  document.addEventListener("pointerdown", function (event) {
    if (root.contains(event.target) || isPanelOpen) return;
    // Site interaction can unlock playback under the browser's autoplay rules.
    if (enabled && audio && audio.paused) playLocal();
    if (isPanelOpen && !panel.contains(event.target)) closePanel();
  }, { passive: true });
  document.addEventListener("click", function (event) {
    if (isPanelOpen && !root.contains(event.target)) closePanel();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isPanelOpen) {
      closePanel();
      seal.focus();
    }
  });
  window.addEventListener("hashchange", sync);
  window.addEventListener("popstate", sync);
  window.addEventListener("hogwarts:scenechange", sync);
  window.addEventListener("pagehide", function () {
    if (audio) audio.pause();
  });
  window.HogwartsSoundtrack = { sync: sync };
  sync();
})();