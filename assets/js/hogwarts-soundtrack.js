/* Hogwarts scene soundtracks: one official Spotify player follows the atlas.
 * Playback is requested on entry and retried during visitor interaction.
 * Only Spotify playback events can confirm that the score is actually playing.
 */
(function () {
  "use strict";
  if (window.HogwartsSoundtrack) return;

  var score = [
    {
      id: "platform",
      title: "Platform Nine-and-Three-Quarters and the Journey to Hogwarts",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "72SmD8s1DYkwUhoEkGlnyV"
    },
    {
      id: "chamber",
      title: "The Chamber of Secrets",
      composer: "John Williams · Chamber of Secrets (2002)",
      spotify: "0go4boa9hw472v8dFpRI5V"
    },
    {
      id: "sorting",
      title: "Entry into the Great Hall and the Banquet",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "0UDSwgomgI5bK1x1eYeBez"
    },
    {
      id: "great",
      title: "Entry into the Great Hall and the Banquet",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "0UDSwgomgI5bK1x1eYeBez"
    },
    {
      id: "staircases",
      title: "Hogwarts Forever! and the Moving Stairs",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "0pyKuk3bYFSzPIysym8ioN"
    },
    {
      id: "quidditch",
      title: "The Quidditch Match",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "4aL5x9pzbU5PTLca3oJjo3"
    },
    {
      id: "memory",
      title: "A Window to the Past",
      composer: "John Williams · Prisoner of Azkaban (2004)",
      spotify: "1PPTlPJqKuL0fdoTmzwXJy"
    },
    {
      id: "tower",
      title: "Dumbledore's Farewell",
      composer: "Nicholas Hooper · Half-Blood Prince (2009)",
      spotify: "0bmb8jg6ljmt8qBmIsMNvL"
    },
    {
      id: "potions",
      title: "Polyjuice Potion",
      composer: "John Williams · Chamber of Secrets (2002)",
      spotify: "23UVS3PRoBNUwWio4aqPId"
    },
    {
      id: "grounds",
      title: "Harry's Wondrous World",
      composer: "John Williams · Chamber of Secrets (2002)",
      spotify: "5qWvQZewRB57giOKgvUE3F"
    },
    {
      id: "hedwig",
      title: "Hedwig's Theme",
      composer: "John Williams · Philosopher's Stone (2001)",
      spotify: "1n8NKQRg8LVHy7oUhUgbFF"
    }
  ];

  // The atlas owns room URLs. Soundtrack routing only refers to stable room IDs
  // and semantic kinds, never to a second, independently maintained path list.
  var byTrack = Object.create(null);
  score.forEach(function (track) { byTrack[track.id] = track; });

  var roomOverrides = {
    gate: "hedwig",              // Keep the castle entrance iconic, not generic outdoor music.
    great: "great",
    divination: "tower",
    northTowerLanding: "tower",
    ramparts: "tower"
  };
  var kindTracks = {
    exterior: "grounds",
    grounds: "grounds",
    bridge: "grounds",
    lake: "grounds",
    forest: "grounds",
    hut: "grounds",
    greenhouse: "grounds",
    herbology: "grounds",
    quidditch: "quidditch",
    hall: "hedwig",
    kitchen: "hedwig",
    classroom: "hedwig",
    bathroom: "hedwig",
    portrait: "memory",
    hospital: "memory",
    library: "memory",
    study: "memory",
    requirement: "memory",
    stair: "staircases",
    observatory: "tower",
    dungeon: "potions",
    potions: "potions",
    water: "chamber",
    sewers: "chamber",
    chamber: "chamber"
  };

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
  var enabled = storage.get(preferenceKey) !== "off";
  // Preserve a zero-volume choice from the old optional native-audio control.
  // Spotify exposes no volume API; its own player/device handles volume now.
  if (storage.get("hogwarts:score:volume:v1") === "0") {
    enabled = false;
    storage.set(preferenceKey, "off");
    storage.set("hogwarts:score:volume:v1", "0.24");
  }

  // Legacy hash scenes resolve through the atlas too. A unique leaf slug
  // (e.g. #/chamber-of-secrets/) stays compatible without duplicating room URLs.
  function normalize(path) {
    return String(path || "/").replace(/index\.html$/i, "").replace(/\/+$/, "") + "/";
  }
  function pathFromLocation() {
    var path = normalize(window.location.pathname);
    var hash = window.location.hash || "";
    if (path !== "/hogwarts/" || !/^#\/[a-z0-9/_-]+\/?$/i.test(hash)) return path;
    var candidate = normalize("/hogwarts/" + hash.slice(2).replace(/^hogwarts\//i, ""));
    var atlas = window.HogwartsAtlas;
    if (!atlas || !atlas.rooms) return path;
    if (atlas.byPath[candidate]) return candidate;
    var leaf = candidate.split("/").filter(Boolean).pop();
    var matching = Object.keys(atlas.rooms).filter(function (id) {
      return atlas.rooms[id].path.split("/").filter(Boolean).pop() === leaf;
    });
    return matching.length === 1 ? atlas.rooms[matching[0]].path : path;
  }
  function selectForPath(path) {
    path = normalize(path);
    if (path === "/platform-934/") return byTrack.platform;
    if (path === "/hogwarts/sorting-ceremony/") return byTrack.sorting;

    var atlas = window.HogwartsAtlas;
    var id = atlas && atlas.byPath && atlas.byPath[path];
    if (id && atlas.rooms[id]) {
      var room = atlas.rooms[id];
      var trackId = roomOverrides[id] || kindTracks[room.kind];
      return byTrack[trackId] || byTrack.hedwig;
    }
    // An unknown/non-maze Hogwarts page uses the general theme.
    return byTrack.hedwig;
  }
  function routeFromLocation() {
    return selectForPath(pathFromLocation());
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
      '<div class="hw-score__local">' +
        '<button type="button" class="hw-score__local-toggle" aria-pressed="false">Mute soundtrack</button>' +
        '<button type="button" class="hw-score__local-toggle hw-score__play" hidden>Play soundtrack</button>' +
      '</div>' +
      '<p class="hw-score__note" role="status" aria-live="polite">Loading the official film score…</p>' +
      '<a class="hw-score__link" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a>' +
    '</section>';
  document.body.appendChild(root);

  var seal = root.querySelector(".hw-score__seal");
  var panel = root.querySelector(".hw-score__panel");
  var title = root.querySelector(".hw-score__title");
  var composer = root.querySelector(".hw-score__composer");
  var embed = root.querySelector(".hw-score__embed");
  var localToggle = root.querySelector(".hw-score__local-toggle");
  var playButton = root.querySelector(".hw-score__play");
  var note = root.querySelector(".hw-score__note");
  var officialLink = root.querySelector(".hw-score__link");
  var current = null;
  var isPanelOpen = false;
  var controller = null;
  var controllerReady = false;
  var controllerPending = false;
  var controllerGeneration = 0;
  var loadedUri = "";
  var apiFailed = false;
  var apiTimer = null;
  var playbackTimer = null;
  var playbackAttempt = 0;
  var confirmationTimer = null;
  var confirmationRevision = 0;
  var state = "loading";
  var hasRequestedCurrent = false;
  var hasPlayedCurrent = false;
  var pausePending = false;
  var suspendedForPage = false;

  function uriFor(item) { return "spotify:track:" + item.spotify; }
  function rememberEnabled(value) {
    enabled = value;
    storage.set(preferenceKey, value ? "on" : "off");
  }
  function clearPlaybackTimer() {
    playbackAttempt += 1;
    if (playbackTimer !== null) window.clearTimeout(playbackTimer);
    playbackTimer = null;
  }
  function clearConfirmationTimer() {
    confirmationRevision += 1;
    if (confirmationTimer !== null) window.clearTimeout(confirmationTimer);
    confirmationTimer = null;
  }
  function confirmPlayback() {
    clearConfirmationTimer();
    var revision = confirmationRevision;
    confirmationTimer = window.setTimeout(function () {
      // No new provider event means unknown, not proof that the audio stopped.
      // In particular, preview players can stop without a final paused event.
      if (revision === confirmationRevision && state === "playing") setState("unconfirmed");
    }, 15000);
  }
  function refreshControls() {
    root.setAttribute("data-state", state);
    root.setAttribute("data-enabled", String(enabled));
    localToggle.textContent = enabled ? "Mute soundtrack" : "Enable soundtrack";
    localToggle.setAttribute("aria-pressed", String(enabled));
    playButton.hidden = !enabled || ["waiting", "unavailable", "ended", "unconfirmed"].indexOf(state) < 0;
    var messages = {
      loading: "Loading the official film score…",
      starting: "Starting the original film score…",
      buffering: "The official soundtrack is buffering…",
      playing: "Playing the original film score on Spotify.",
      ended: "This Spotify playback has ended. Play again here or continue listening on Spotify.",
      unconfirmed: "Playback status is unconfirmed. Check the Spotify player below or press Play to continue.",
      waiting: "Press Play here or in the Spotify player to start the score.",
      paused: "Sound is muted. Enable the soundtrack to listen.",
      suspended: "The soundtrack is paused while you are away.",
      unavailable: "Automatic playback is unavailable. Use Play in the Spotify player or listen on Spotify."
    };
    note.textContent = messages[state] || messages.waiting;
    if (current) {
      var status = state === "playing" ? "Playing" : enabled ? "Soundtrack" : "Muted soundtrack";
      seal.setAttribute("aria-label", status + ": " + current.title + ". Open sound controls");
      seal.title = status + ": " + current.title;
    }
  }
  function setState(next) {
    if (next !== "playing") clearConfirmationTimer();
    state = next;
    refreshControls();
  }
  function styleFrame() {
    var frame = embed.querySelector("iframe");
    if (!frame) return;
    frame.className = "hw-score__spotify";
    frame.title = "Spotify: " + current.title;
    frame.loading = "eager";
    frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
  }
  function fallbackEmbed() {
    if (controller || controllerPending) return;
    embed.replaceChildren();
    var frame = document.createElement("iframe");
    frame.src = "https://open.spotify.com/embed/track/" + current.spotify + "?theme=0";
    frame.width = "100%";
    frame.height = "152";
    frame.setAttribute("allowfullscreen", "");
    embed.appendChild(frame);
    styleFrame();
  }
  function playerUnavailable() {
    if (controllerReady || apiFailed) return;
    if (apiTimer !== null) window.clearTimeout(apiTimer);
    apiTimer = null;
    apiFailed = true;
    clearPlaybackTimer();
    // A script can load successfully while createController (or its ready event)
    // never completes. Retire that attempt before replacing its mount.
    controllerGeneration += 1;
    controllerPending = false;
    var retired = controller;
    controller = null;
    loadedUri = "";
    if (retired) {
      try { retired.destroy(); } catch (error) {}
    }
    fallbackEmbed();
    setState("unavailable");
  }
  function requestPlayback(explicit) {
    if (!enabled || suspendedForPage || state === "playing") return;
    if (state === "ended" || state === "unconfirmed") {
      if (explicit !== true) return;
      if (state === "ended") hasRequestedCurrent = false;
    }
    if (!controllerReady || !loadCurrentCue()) return;
    clearPlaybackTimer();
    var attempt = playbackAttempt;
    pausePending = false;
    setState("starting");
    try {
      // resume() retries a blocked or paused player without restarting its cue.
      // Keep this call synchronous when invoked from a visitor gesture.
      var result = hasRequestedCurrent ? controller.resume() : controller.play();
      hasRequestedCurrent = true;
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          if (attempt === playbackAttempt && enabled) setState("waiting");
        });
      }
      playbackTimer = window.setTimeout(function () {
        if (attempt === playbackAttempt && (state === "starting" || state === "buffering")) {
          setState("waiting");
        }
      }, 5000);
    } catch (error) {
      setState("waiting");
    }
  }
  function pausePlayback() {
    clearPlaybackTimer();
    pausePending = true;
    if (controller) {
      try { controller.pause(); } catch (error) {}
    } else if (apiFailed) {
      fallbackEmbed(); // Removing an uncontrolled fallback also stops its audio.
    }
    setState(apiFailed ? "unavailable" : suspendedForPage ? "suspended" : "paused");
  }
  function playbackUpdate(event) {
    var data = event && event.data;
    if (!data || (data.playingURI && data.playingURI !== uriFor(current))) return;
    if (suspendedForPage) {
      if (!data.isPaused && controller) controller.pause();
      return;
    }
    // A start can arrive after the visitor has already muted a pending request.
    if (!enabled && pausePending && !data.isPaused) {
      controller.pause();
      return;
    }
    if (data.isBuffering) {
      if (enabled) setState("buffering");
      return;
    }
    clearPlaybackTimer();
    var ended = data.duration > 0 && data.position >= data.duration - 250;
    if (ended) {
      hasPlayedCurrent = false;
      pausePending = false;
      setState(enabled ? "ended" : "paused");
      return;
    }
    if (data.isPaused === false) {
      pausePending = false;
      hasPlayedCurrent = true;
      if (!enabled) rememberEnabled(true); // The visitor used Spotify's own Play.
      setState("playing");
      confirmPlayback();
    } else if (data.isPaused === true) {
      if (hasPlayedCurrent && (state === "playing" || state === "buffering") && !pausePending && !ended) {
        rememberEnabled(false);
      }
      pausePending = false;
      setState(enabled ? "waiting" : "paused");
    }
  }
  function loadCurrentCue() {
    var nextUri = uriFor(current);
    if (!controllerReady) return false;
    if (loadedUri === nextUri) return true;
    hasPlayedCurrent = false;
    hasRequestedCurrent = false;
    try {
      controller.loadEntity(nextUri);
      loadedUri = nextUri;
      styleFrame();
      return true;
    } catch (error) {
      setState("unavailable");
      return false;
    }
  }
  function initializeController(api) {
    if (controller || controllerPending) return;
    controllerPending = true;
    var generation = ++controllerGeneration;
    apiFailed = false;
    if (apiTimer === null) apiTimer = window.setTimeout(playerUnavailable, 15000);
    embed.replaceChildren();
    var mount = document.createElement("div");
    embed.appendChild(mount);
    var initialUri = uriFor(current);
    try {
      api.createController(mount, { uri: initialUri, width: "100%", height: 152 }, function (player) {
        if (generation !== controllerGeneration) {
          try { player.destroy(); } catch (error) {}
          return;
        }
        controller = player;
        controllerPending = false;
        loadedUri = initialUri;
        styleFrame();
        player.addListener("ready", function () {
          if (generation !== controllerGeneration) return;
          controllerReady = true;
          apiFailed = false;
          if (apiTimer !== null) window.clearTimeout(apiTimer);
          if (!loadCurrentCue()) return; // The visitor may have moved while Spotify loaded.
          setState(enabled ? "waiting" : "paused");
          if (enabled) requestPlayback();
          else pausePlayback();
        });
        player.addListener("playback_update", function (event) {
          if (generation === controllerGeneration) playbackUpdate(event);
        });
        player.addListener("playback_started", function (event) {
          if (generation !== controllerGeneration) return;
          playbackUpdate({ data: {
            playingURI: event && event.data && event.data.playingURI,
            isPaused: false,
            isBuffering: false
          } });
        });
      });
    } catch (error) {
      controllerPending = false;
      playerUnavailable();
    }
  }
  function loadSpotifyApi() {
    var previousReady = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = function (api) {
      if (typeof previousReady === "function") {
        try { previousReady(api); } catch (error) {}
      }
      initializeController(api);
    };
    var script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.addEventListener("error", playerUnavailable);
    apiTimer = window.setTimeout(playerUnavailable, 15000);
    document.body.appendChild(script);
  }
  function openPanel() {
    isPanelOpen = true;
    panel.hidden = false;
    seal.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    isPanelOpen = false;
    panel.hidden = true;
    seal.setAttribute("aria-expanded", "false");
  }
  function sync() {
    var next = routeFromLocation();
    if (current && current.id === next.id) return;
    var sameRecording = current && current.spotify === next.spotify;
    current = next;
    title.textContent = next.title;
    composer.textContent = next.composer;
    officialLink.href = "https://open.spotify.com/track/" + next.spotify;
    if (!sameRecording) {
      clearPlaybackTimer();
      hasPlayedCurrent = false;
      hasRequestedCurrent = false;
      setState(enabled ? "loading" : "paused");
      if (controllerReady) {
        if (loadCurrentCue() && enabled) requestPlayback();
      } else if (apiFailed) {
        fallbackEmbed();
        setState("unavailable");
      }
    }
    refreshControls();
  }

  seal.addEventListener("click", function () {
    if (isPanelOpen) closePanel();
    else {
      openPanel();
      requestPlayback();
    }
  });
  localToggle.addEventListener("click", function () {
    rememberEnabled(!enabled);
    if (enabled) requestPlayback();
    else pausePlayback();
    refreshControls();
  });
  playButton.addEventListener("click", function () {
    openPanel();
    requestPlayback(true);
  });
  function unlockFromInteraction(event) {
    if (root.contains(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.type === "keydown" && (event.repeat || event.key === "Escape" || event.key === "Tab")) return;
    requestPlayback();
  }
  // click is the cross-browser activation path; touchend and keyboard movement
  // cover the explorer's other entry interactions. No missing-file fetch awaits it.
  document.addEventListener("touchend", unlockFromInteraction, { passive: true });
  document.addEventListener("click", function (event) {
    unlockFromInteraction(event);
    if (isPanelOpen && !root.contains(event.target)) closePanel();
  });
  document.addEventListener("keydown", function (event) {
    unlockFromInteraction(event);
    if (event.key === "Escape" && isPanelOpen) {
      closePanel();
      seal.focus();
    }
  });
  window.addEventListener("hashchange", sync);
  window.addEventListener("popstate", sync);
  window.addEventListener("hogwarts:scenechange", sync);
  window.addEventListener("pagehide", function () {
    suspendedForPage = true;
    pausePlayback();
  });
  window.addEventListener("pageshow", function () {
    if (!suspendedForPage) return;
    suspendedForPage = false;
    pausePending = false;
    setState(enabled ? "waiting" : "paused");
    requestPlayback();
  });
  window.HogwartsSoundtrack = {
    sync: sync,
    selectForPath: selectForPath,
    getState: function () {
      return { track: current && current.id, state: state, enabled: enabled, ready: controllerReady };
    }
  };
  sync();
  loadSpotifyApi();
})();
