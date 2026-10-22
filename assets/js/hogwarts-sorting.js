(function () {
  "use strict";

  var hall = document.getElementById("great-hall");
  var intro = document.getElementById("entry-stage");
  var hat = document.getElementById("hat-trigger");
  var questionsStage = document.getElementById("whisper-stage");
  var resultStage = document.getElementById("result-stage");
  var currentNumber = document.getElementById("question-counter");
  var runes = document.getElementById("runes");
  var questionTitle = document.getElementById("question-title");
  var questionPreface = document.getElementById("question-preface");
  var choiceGrid = document.getElementById("choice-grid");
  var resultTitle = document.getElementById("result-title");
  var resultDescription = document.getElementById("result-description");
  var resultMotto = document.getElementById("result-motto");
  var crestLetter = document.getElementById("crest-letter");
  var traitContainer = document.getElementById("result-attributes");
  var retry = document.getElementById("try-again");
  var linksBack = document.querySelectorAll("[data-return-castle]");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var run = 0;
  var busy = false;
  var picks = [];
  var names = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];
  var scores = { gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 0 };

  var houses = {
    gryffindor: {
      name: "Gryffindor",
      initial: "G",
      motto: "WHERE DWELL THE BRAVE AT HEART",
      description: "There is a bright, determined fire in you. When the moment asks someone to step forward, you would rather face the unknown than watch from the sidelines.",
      traits: ["Courage", "Nerve", "Chivalry"]
    },
    hufflepuff: {
      name: "Hufflepuff",
      initial: "H",
      motto: "WHERE THEY ARE JUST AND LOYAL",
      description: "Your magic is the kind that stays. In a castle of grand ambitions, you know the quiet strength of being fair, keeping your word, and leaving no one behind.",
      traits: ["Loyalty", "Patience", "Fairness"]
    },
    ravenclaw: {
      name: "Ravenclaw",
      initial: "R",
      motto: "WHERE THOSE OF WIT AND LEARNING",
      description: "You see questions where others see walls. Your mind follows the hidden patterns of things, and wonder is the compass that leads you further.",
      traits: ["Wisdom", "Curiosity", "Originality"]
    },
    slytherin: {
      name: "Slytherin",
      initial: "S",
      motto: "WHERE YOU'LL MAKE YOUR REAL FRIENDS",
      description: "You do not mistake the world as it is for the world it could become. You notice the unmarked doors, plan your own path, and have the will to see it through.",
      traits: ["Ambition", "Resourcefulness", "Determination"]
    }
  };

  // Story choices blend two qualities. The final choice carries more weight:
  // the Sorting Hat listens to what its wearer values most.
  var scenes = [
    {
      preface: "The hat remembers a corridor long forgotten.",
      question: "A door appears where no door should be. What draws you closer?",
      choices: [
        { text: "The thrill of stepping into the unknown.", house: "gryffindor", echo: "ravenclaw" },
        { text: "The thought of bringing someone else along.", house: "hufflepuff", echo: "gryffindor" },
        { text: "The symbols carved into its frame.", house: "ravenclaw", echo: "slytherin" },
        { text: "The question of who holds its key.", house: "slytherin", echo: "ravenclaw" }
      ]
    },
    {
      preface: "A parchment rustles inside the brim.",
      question: "You discover an unfinished spell at midnight.",
      choices: [
        { text: "Unravel every line until you understand it.", house: "ravenclaw", echo: "hufflepuff" },
        { text: "Keep it secret until you know what it could become.", house: "slytherin", echo: "ravenclaw" },
        { text: "Dare to test it when no one else will.", house: "gryffindor", echo: "slytherin" },
        { text: "Make it safe enough for everyone to try.", house: "hufflepuff", echo: "ravenclaw" }
      ]
    },
    {
      preface: "A whisper travels across the Great Hall.",
      question: "A classmate is blamed for something they didn't do.",
      choices: [
        { text: "Stay with them until they no longer feel alone.", house: "hufflepuff", echo: "gryffindor" },
        { text: "Speak up for them before the entire hall.", house: "gryffindor", echo: "hufflepuff" },
        { text: "Find the one person who can overturn the verdict.", house: "slytherin", echo: "hufflepuff" },
        { text: "Gather the evidence that proves the truth.", house: "ravenclaw", echo: "gryffindor" }
      ]
    },
    {
      preface: "The hat shows you four impossible treasures.",
      question: "The castle offers one extraordinary gift.",
      choices: [
        { text: "A key to doors no one else can see.", house: "slytherin", echo: "ravenclaw" },
        { text: "A book with a new mystery on every page.", house: "ravenclaw", echo: "slytherin" },
        { text: "A lantern that always guides the lost home.", house: "hufflepuff", echo: "gryffindor" },
        { text: "A sword that protects those who cannot fight.", house: "gryffindor", echo: "hufflepuff" }
      ]
    },
    {
      preface: "The old seams tighten, considering.",
      question: "Someone entrusts you with a dangerous secret.",
      choices: [
        { text: "Break the silence if keeping it would cause harm.", house: "gryffindor", echo: "hufflepuff" },
        { text: "Understand the whole story before you act.", house: "ravenclaw", echo: "slytherin" },
        { text: "Protect the person who placed their trust in you.", house: "hufflepuff", echo: "gryffindor" },
        { text: "Wait for the precise moment it can do some good.", house: "slytherin", echo: "ravenclaw" }
      ]
    },
    {
      preface: "Beyond the castle, the path divides.",
      question: "Which passage would you follow under moonlight?",
      choices: [
        { text: "A silent staircase climbing toward the stars.", house: "ravenclaw", echo: "gryffindor" },
        { text: "A warm passage alive with familiar voices.", house: "hufflepuff", echo: "ravenclaw" },
        { text: "A narrow bridge leading to a hidden tower.", house: "slytherin", echo: "gryffindor" },
        { text: "A steep trail disappearing into the storm.", house: "gryffindor", echo: "slytherin" }
      ]
    },
    {
      preface: "The hat grows very quiet. It is listening to you now.",
      question: "More than anything, what do you hope to find here?",
      choices: [
        { text: "Friends for whom I would go to the ends of the earth.", house: "hufflepuff", echo: "gryffindor" },
        { text: "The chance to make something extraordinary of myself.", house: "slytherin", echo: "ravenclaw" },
        { text: "The courage to become who I truly am.", house: "gryffindor", echo: "hufflepuff" },
        { text: "Answers to questions I haven't yet imagined.", house: "ravenclaw", echo: "slytherin" }
      ]
    }
  ];

  function focusHeading(el) {
    try { el.focus({ preventScroll: true }); }
    catch (error) { el.focus(); }
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  function drawDust() {
    var dust = document.getElementById("hall-dust");
    if (!dust) return;
    var seed = 934;
    for (var i = 0; i < 56; i++) {
      seed = (seed * 16807) % 2147483647;
      var x = (seed % 9800) / 100 + 1;
      seed = (seed * 16807) % 2147483647;
      var y = (seed % 9100) / 100 + 2;
      var mote = document.createElement("i");
      mote.style.setProperty("--x", x.toFixed(1) + "%");
      mote.style.setProperty("--y", y.toFixed(1) + "%");
      mote.style.setProperty("--o", (0.11 + (i % 7) * .055).toFixed(2));
      mote.style.setProperty("--t", (4 + i % 8) + "s");
      mote.style.setProperty("--d", (-(i % 9)) + "s");
      dust.appendChild(mote);
    }
  }

  function illuminateProgress() {
    runes.textContent = "";
    for (var i = 0; i < scenes.length; i++) {
      var rune = document.createElement("span");
      rune.className = "rune" + (i <= run ? " rune--lit" : "");
      rune.setAttribute("aria-hidden", "true");
      runes.appendChild(rune);
    }
    runes.setAttribute("aria-label", "Question " + (run + 1) + " of " + scenes.length);
  }

  function renderQuestion() {
    busy = false;
    if (run >= scenes.length) { showHouse(); return; }
    var scene = scenes[run];
    currentNumber.textContent = String(run + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
    questionPreface.textContent = "“" + scene.preface + "”";
    questionTitle.textContent = scene.question;
    illuminateProgress();
    choiceGrid.textContent = "";

    scene.choices.forEach(function(choice, index) {
      var option = document.createElement("button");
      option.type = "button";
      option.className = "choice";
      var roman = document.createElement("span");
      roman.className = "numeral";
      roman.textContent = ["I", "II", "III", "IV"][index];
      roman.setAttribute("aria-hidden", "true");
      var label = document.createElement("span");
      label.textContent = choice.text;
      option.appendChild(roman);
      option.appendChild(label);
      option.addEventListener("click", function() {
        if (busy) return;
        busy = true;
        picks.push(choice.house);
        scores[choice.house] += run === scenes.length - 1 ? 6 : 4;
        scores[choice.echo] += 1;
        var options = choiceGrid.querySelectorAll("button");
        options.forEach(function(button) {
          button.disabled = true;
          button.classList.add("locked");
        });
        option.classList.remove("locked");
        option.classList.add("selected");
        run += 1;
        window.setTimeout(renderQuestion, reduced ? 0 : 400);
      });
      choiceGrid.appendChild(option);
    });
    focusHeading(questionTitle);
  }

  function start() {
    if (busy) return;
    run = 0;
    picks = [];
    scores = { gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 0 };
    hall.removeAttribute("data-house");
    intro.hidden = true;
    resultStage.hidden = true;
    questionsStage.hidden = false;
    renderQuestion();
  }

  function showHouse() {
    var preferred = picks[picks.length - 1];
    var best = names.slice().sort(function(a,b) {
      if (scores[b] !== scores[a]) return scores[b] - scores[a];
      if (a === preferred) return -1;
      if (b === preferred) return 1;
      return picks.lastIndexOf(b) - picks.lastIndexOf(a);
    })[0];
    var house = houses[best];
    hall.setAttribute("data-house", best);
    questionsStage.hidden = true;
    resultStage.hidden = false;
    resultTitle.textContent = house.name + "!";
    resultMotto.textContent = house.motto;
    resultDescription.textContent = house.description;
    crestLetter.textContent = house.initial;
    traitContainer.textContent = "";
    house.traits.forEach(function(trait) {
      var el = document.createElement("span");
      el.textContent = trait;
      traitContainer.appendChild(el);
    });
    try { window.sessionStorage.setItem("hogwarts:house:v1", best); }
    catch(error) { /* Sorting still works without storage. */ }
    focusHeading(resultTitle);
  }

  function makeNonce() {
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, function(value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }

  function returnToCastle(event) {
    event.preventDefault();
    try {
      window.sessionStorage.setItem("hogwarts:platform934:pass:v1", JSON.stringify({
        from: "/hogwarts/sorting-ceremony/",
        at: Date.now(),
        nonce: makeNonce()
      }));
      window.location.assign("/hogwarts/");
    } catch (error) {
      // A denied browser storage permission must not create a false open route.
      var status = document.getElementById("navigation-status");
      if (status) status.textContent = "Please enable session storage to cross back through the castle.";
    }
  }

  drawDust();
  hat.addEventListener("click", start);
  retry.addEventListener("click", function() {
    questionsStage.hidden = true;
    resultStage.hidden = true;
    intro.hidden = false;
    hall.removeAttribute("data-house");
    hat.focus();
    hat.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });
  linksBack.forEach(function(link) { link.addEventListener("click", returnToCastle); });
})();