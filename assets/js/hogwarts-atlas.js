/* The traversable URL graph. Passage keys are local to each camera view, not compass bearings.
   Geographic evidence and interpretation are recorded separately in hogwarts-geography.js. */
(function(){
  "use strict";
  var rows=[
  {
    "id": "gate",
    "path": "/hogwarts/",
    "name": "Hogwarts",
    "kind": "exterior",
    "kicker": "The castle, after dusk",
    "teacher": "",
    "subject": "",
    "description": "Warm windows rise above the cobbled approach. The old wooden doors wait at the foot of the towers.",
    "exits": {
      "n": "entry",
      "s": "forecourt"
    }
  },
  {
    "id": "forecourt",
    "path": "/hogwarts/grounds/approach/cobblestone-rise/",
    "name": "The Lantern Path",
    "kind": "grounds",
    "kicker": "The climb from the station",
    "teacher": "",
    "subject": "",
    "description": "Wet cobbles lead down toward the mist. The sound of the train seems impossibly distant.",
    "exits": {
      "n": "gate",
      "e": "courtyard",
      "s": "flying"
    }
  },
  {
    "id": "entry",
    "path": "/hogwarts/castle/keep/threshold/entry-vestibule/",
    "name": "Entrance Hall",
    "kind": "hall",
    "kicker": "The threshold of the castle",
    "teacher": "",
    "subject": "",
    "description": "Tall arches carry every footstep farther than it ought to travel.",
    "exits": {
      "s": "gate",
      "n": "great",
      "w": "staircase",
      "e": "basementPassage"
    }
  },
  {
    "id": "great",
    "path": "/hogwarts/castle/keep/ground-floor/great-hall/",
    "name": "The Great Hall",
    "kind": "hall",
    "kicker": "A sky beneath a ceiling",
    "teacher": "",
    "subject": "",
    "description": "Candles drift above the four long tables. Somewhere, cutlery is still moving.",
    "exits": {
      "s": "entry"
    }
  },
  {
    "id": "kitchens",
    "path": "/hogwarts/castle/keep/ground-floor/house-elf-kitchens/",
    "name": "Castle Kitchens",
    "kind": "kitchen",
    "kicker": "Below the Great Hall",
    "teacher": "",
    "subject": "",
    "description": "Copper pans line the basement kitchen. The tables stand directly beneath the Great Hall above; the way out leads through the fruit-portrait passage.",
    "exits": {
      "w": "basementPassage",
      "n": "pantry"
    }
  },
  {
    "id": "pantry",
    "path": "/hogwarts/castle/keep/ground-floor/copper-pantry/",
    "name": "Copper Pantry",
    "kind": "kitchen",
    "kicker": "A small forgotten room",
    "teacher": "",
    "subject": "",
    "description": "Spices gather in orderly rows beside a kettle that does not cool.",
    "exits": {
      "s": "kitchens"
    }
  },
  {
    "id": "gallery",
    "path": "/hogwarts/castle/keep/ground-floor/portraits-gallery/",
    "name": "Fourth-floor Portrait Corridor",
    "kind": "portrait",
    "kicker": "The library landing",
    "teacher": "",
    "subject": "",
    "description": "Portraits watch over the fourth-floor approach. The stairs lead back down, and the passage ahead continues toward the library.",
    "exits": {
      "s": "midFloorStair",
      "n": "library"
    }
  },
  {
    "id": "armoury",
    "path": "/hogwarts/castle/keep/ground-floor/knights-gallery/",
    "name": "Third-floor Armour Gallery",
    "kind": "portrait",
    "kicker": "Armour beside the upper corridors",
    "teacher": "",
    "subject": "",
    "description": "Suits of armour keep watch over the third-floor gallery. The clear central aisle returns to the middle landings.",
    "exits": {
      "s": "midFloorStair"
    }
  },
  {
    "id": "cloister",
    "path": "/hogwarts/castle/keep/ground-floor/east-cloister/",
    "name": "East Cloister",
    "kind": "hall",
    "kicker": "Stone beneath the arches",
    "teacher": "",
    "subject": "",
    "description": "The castle's east wing opens in several directions, none of them especially straight.",
    "exits": {
      "w": "courtyard",
      "e": "greenhouse"
    }
  },
  {
    "id": "hospital",
    "path": "/hogwarts/castle/keep/ground-floor/hospital-wing/",
    "name": "Hospital Wing",
    "kind": "hospital",
    "kicker": "Clean linen and calm voices",
    "teacher": "Poppy Pomfrey",
    "subject": "Matron",
    "description": "The curtains are drawn around one empty bed. A silver potion cools on the sill.",
    "exits": {
      "s": "firstFloorJunction"
    }
  },
  {
    "id": "transfig",
    "path": "/hogwarts/castle/academic-wing/first-floor/transfiguration-classroom/",
    "name": "Transfiguration",
    "kind": "classroom",
    "kicker": "The art of becoming",
    "teacher": "Minerva McGonagall",
    "subject": "Transfiguration",
    "description": "An attentive tabby cat sits on the desk. The professor's gaze misses very little.",
    "exits": {
      "s": "firstFloorJunction"
    }
  },
  {
    "id": "baths",
    "path": "/hogwarts/castle/keep/second-floor/abandoned-washroom/",
    "name": "Second-floor Bathroom Corridor",
    "kind": "hall",
    "kicker": "The quiet second floor",
    "teacher": "",
    "subject": "",
    "description": "A disused bathroom opens off this stone corridor. The stairs return to the middle landings.",
    "exits": {
      "s": "midFloorStair",
      "n": "bathroom"
    }
  },
  {
    "id": "bathroom",
    "path": "/hogwarts/castle/keep/second-floor/myrtles-bathroom/",
    "name": "Myrtle's Bathroom",
    "kind": "bathroom",
    "kicker": "The water has stories",
    "teacher": "",
    "subject": "",
    "description": "A row of washbasins stands beneath cracked mirrors. A tiny snake is scratched into one copper tap. The ordinary doorway returns to the second-floor corridor.",
    "exits": {
      "s": "baths"
    },
    "secret": {
      "to": "sluice",
      "type": "basin"
    }
  },
  {
    "id": "history",
    "path": "/hogwarts/castle/academic-wing/first-floor/history-of-magic/",
    "name": "History of Magic",
    "kind": "classroom",
    "kicker": "An endless century",
    "teacher": "Cuthbert Binns",
    "subject": "History of Magic",
    "description": "The professor continues his lecture without once noticing that the sun has set.",
    "exits": {
      "s": "firstFloorJunction"
    }
  },
  {
    "id": "staircase",
    "path": "/hogwarts/castle/grand-staircase/first-landing/",
    "name": "Grand Staircase",
    "kind": "stair",
    "kicker": "Some steps have opinions",
    "teacher": "",
    "subject": "",
    "description": "At irregular intervals, the higher staircase seems to settle into a different position.",
    "exits": {
      "s": "entry",
      "w": "firstFloorJunction",
      "n": "midFloorStair",
      "e": "corridor"
    }
  },
  {
    "id": "corridor",
    "path": "/hogwarts/castle/academic-wing/first-floor/enchanted-corridor/",
    "name": "Seventh-floor Corridor",
    "kind": "hall",
    "kicker": "Opposite Barnabas the Barmy",
    "teacher": "",
    "subject": "",
    "description": "A tapestry shows trolls attempting ballet. Opposite it, a blank stretch of wall waits for someone to walk past three times with a need in mind.",
    "exits": {
      "s": "staircase",
      "w": "office",
      "n": "northTowerLanding",
      "e": "ramparts"
    },
    "secret": {
      "to": "requirement",
      "type": "wall"
    }
  },
  {
    "id": "library",
    "path": "/hogwarts/castle/academic-wing/first-floor/library/",
    "name": "Hogwarts Library",
    "kind": "library",
    "kicker": "Some books are not quiet",
    "teacher": "Irma Pince",
    "subject": "Librarian",
    "description": "The old volumes are catalogued by subjects that do not appear in ordinary schools.",
    "exits": {
      "s": "gallery"
    }
  },
  {
    "id": "charms",
    "path": "/hogwarts/castle/academic-wing/first-floor/charms-classroom/",
    "name": "Charms",
    "kind": "classroom",
    "kicker": "A lesson on the third floor",
    "teacher": "Filius Flitwick",
    "subject": "Charms",
    "description": "Professor Flitwick waits beside an airy classroom. A clear doorway returns toward the third-floor landing.",
    "exits": {
      "s": "midFloorStair"
    }
  },
  {
    "id": "defense",
    "path": "/hogwarts/castle/academic-wing/first-floor/defence-against-dark-arts/",
    "name": "Defence Against the Dark Arts",
    "kind": "classroom",
    "kicker": "Courage is a practical skill",
    "teacher": "Remus Lupin",
    "subject": "Defence Against the Dark Arts",
    "description": "Remus Lupin has prepared a practical lesson. The classroom door returns to the teaching corridor.",
    "exits": {
      "s": "firstFloorJunction"
    }
  },
  {
    "id": "office",
    "path": "/hogwarts/castle/upper-keep/headmasters-office/",
    "name": "Headmaster's Office",
    "kind": "study",
    "kicker": "A room full of second chances",
    "teacher": "Albus Dumbledore",
    "subject": "Headmaster",
    "description": "Silver instruments turn beside a patient phoenix. The only route back follows the guarded spiral stair; the office is a destination of its own.",
    "exits": {
      "s": "corridor"
    }
  },
  {
    "id": "astrStair",
    "path": "/hogwarts/castle/upper-keep/spiral-ascent/",
    "name": "Spiral Ascent",
    "kind": "stair",
    "kicker": "Steps above the clouds",
    "teacher": "",
    "subject": "",
    "description": "The staircase grows narrower as the wind grows louder.",
    "exits": {
      "s": "ramparts",
      "n": "astrTower"
    }
  },
  {
    "id": "astrTower",
    "path": "/hogwarts/castle/upper-keep/astronomy-tower/",
    "name": "Astronomy Tower",
    "kind": "observatory",
    "kicker": "Beyond the last cloud",
    "teacher": "Aurora Sinistra",
    "subject": "Astronomy",
    "description": "The telescope points toward a constellation that seems to have moved.",
    "exits": {
      "s": "astrStair"
    }
  },
  {
    "id": "divination",
    "path": "/hogwarts/castle/upper-keep/divination-classroom/",
    "name": "Divination",
    "kind": "classroom",
    "kicker": "Above the North Tower landing",
    "teacher": "Sybill Trelawney",
    "subject": "Divination",
    "description": "Tea leaves settle among the little tables. An open floor hatch and a silver ladder provide the way back down.",
    "exits": {
      "s": "northTowerLanding"
    }
  },
  {
    "id": "owlery",
    "path": "/hogwarts/castle/upper-keep/owlery/",
    "name": "The Owlery",
    "kind": "observatory",
    "kicker": "At the top of the West Tower",
    "teacher": "",
    "subject": "",
    "description": "Owls watch the sky through unglazed windows. The tower stairs lead back toward the battlements.",
    "exits": {
      "s": "ramparts"
    }
  },
  {
    "id": "ramparts",
    "path": "/hogwarts/castle/upper-keep/north-battlements/",
    "name": "North Battlements",
    "kind": "exterior",
    "kicker": "Above the sleeping valley",
    "teacher": "",
    "subject": "",
    "description": "The lake is a black mirror from here. A line of lanterns traces the road below.",
    "exits": {
      "s": "corridor",
      "w": "owlery",
      "e": "astrStair"
    }
  },
  {
    "id": "dungeonSteps",
    "path": "/hogwarts/castle/dungeons/spiral-stairs/",
    "name": "Dungeon Stairwell",
    "kind": "dungeon",
    "kicker": "Below the ancient foundations",
    "teacher": "",
    "subject": "",
    "description": "A stair descends from the basement toward a green-lit junction. The return flight climbs back toward the entrance level.",
    "exits": {
      "n": "basementPassage",
      "s": "slytherin"
    }
  },
  {
    "id": "potions",
    "path": "/hogwarts/castle/dungeons/potions-classroom/",
    "name": "Potions",
    "kind": "potions",
    "kicker": "A delicate art of precision",
    "teacher": "Severus Snape",
    "subject": "Potions",
    "description": "A dark cauldron stirs without a spoon. Professor Snape is not impressed by guesswork.",
    "exits": {
      "s": "slytherin"
    }
  },
  {
    "id": "oldArchive",
    "path": "/hogwarts/castle/dungeons/forgotten-archive/",
    "name": "Archive Passage",
    "kind": "library",
    "kicker": "A corridor below the castle",
    "teacher": "",
    "subject": "",
    "description": "Old records line the vaulted passage. Open stone arches branch toward a storeroom and a forgotten crypt.",
    "exits": {
      "s": "slytherin",
      "w": "crypt",
      "e": "vault"
    }
  },
  {
    "id": "crypt",
    "path": "/hogwarts/castle/dungeons/forgotten-crypt/",
    "name": "Forgotten Crypt",
    "kind": "dungeon",
    "kicker": "An ancient silence",
    "teacher": "",
    "subject": "",
    "description": "Names worn smooth by time disappear into the stone.",
    "exits": {
      "s": "oldArchive"
    }
  },
  {
    "id": "slytherin",
    "path": "/hogwarts/castle/dungeons/green-lantern-passage/",
    "name": "Green Lantern Passage",
    "kind": "dungeon",
    "kicker": "The light bends strangely",
    "teacher": "",
    "subject": "",
    "description": "A procession of carved serpents vanishes into a turn beneath the floor.",
    "exits": {
      "s": "dungeonSteps",
      "w": "potions",
      "n": "oldArchive",
      "e": "reservoir"
    }
  },
  {
    "id": "reservoir",
    "path": "/hogwarts/castle/dungeons/underground-reservoir/",
    "name": "Underground Reservoir",
    "kind": "water",
    "kicker": "Still water, deep below",
    "teacher": "",
    "subject": "",
    "description": "Beneath the bridge, something brushes the dark water and moves away.",
    "exits": {
      "s": "slytherin"
    }
  },
  {
    "id": "vault",
    "path": "/hogwarts/castle/dungeons/locked-storeroom/",
    "name": "Old Storeroom",
    "kind": "study",
    "kicker": "Boxes without labels",
    "teacher": "",
    "subject": "",
    "description": "An unopened crate carries an embossed crest from a school long forgotten.",
    "exits": {
      "s": "oldArchive"
    }
  },
  {
    "id": "courtyard",
    "path": "/hogwarts/grounds/south-courtyard/",
    "name": "South Courtyard",
    "kind": "grounds",
    "kicker": "The heart of the grounds",
    "teacher": "",
    "subject": "",
    "description": "Rainwater rests between the paving stones. The great doors are somewhere behind you.",
    "exits": {
      "w": "forecourt",
      "n": "cloister",
      "e": "bridge",
      "s": "quidditch"
    }
  },
  {
    "id": "bridge",
    "path": "/hogwarts/grounds/stone-viaduct/",
    "name": "Stone Viaduct",
    "kind": "bridge",
    "kicker": "Over the silver mist",
    "teacher": "",
    "subject": "",
    "description": "A broad bridge climbs above the valley. The trees are darker on the far bank.",
    "exits": {
      "w": "courtyard",
      "e": "lake",
      "n": "hut"
    }
  },
  {
    "id": "lake",
    "path": "/hogwarts/grounds/black-lake/moonlit-shore/",
    "name": "Black Lake",
    "kind": "lake",
    "kicker": "Where the water keeps secrets",
    "teacher": "",
    "subject": "",
    "description": "Sunlight shimmers across the shore. Far below, something enormous turns.",
    "exits": {
      "w": "bridge",
      "n": "boathouse",
      "s": "dock"
    }
  },
  {
    "id": "boathouse",
    "path": "/hogwarts/grounds/black-lake/boathouse/",
    "name": "The Boathouse",
    "kind": "lake",
    "kicker": "A boat without oars",
    "teacher": "",
    "subject": "",
    "description": "The boats are tied to their posts, though the lake is perfectly still.",
    "exits": {
      "s": "lake"
    }
  },
  {
    "id": "dock",
    "path": "/hogwarts/grounds/black-lake/old-pier/",
    "name": "Old Pier",
    "kind": "lake",
    "kicker": "The end of the planks",
    "teacher": "",
    "subject": "",
    "description": "A wet lantern makes one small golden circle on the black water.",
    "exits": {
      "s": "lake"
    }
  },
  {
    "id": "forest",
    "path": "/hogwarts/grounds/forbidden-forest/whispering-edge/",
    "name": "Forbidden Forest",
    "kind": "forest",
    "kicker": "Where the trees listen",
    "teacher": "",
    "subject": "",
    "description": "A muddy trail leads deeper toward a clearing. The way back follows the same path to Hagrid's garden at the forest edge.",
    "exits": {
      "s": "hut",
      "n": "clearing"
    }
  },
  {
    "id": "clearing",
    "path": "/hogwarts/grounds/forbidden-forest/ancient-clearing/",
    "name": "Ancient Clearing",
    "kind": "forest",
    "kicker": "A gathering of old trees",
    "teacher": "",
    "subject": "",
    "description": "Pale mushrooms outline a ring where the wind never quite reaches.",
    "exits": {
      "s": "forest"
    }
  },
  {
    "id": "hut",
    "path": "/hogwarts/grounds/keeper-hut/hagrids-garden/",
    "name": "Hagrid's Hut",
    "kind": "hut",
    "kicker": "Tea, stories, and muddy boots",
    "teacher": "Rubeus Hagrid",
    "subject": "Care of Magical Creatures",
    "description": "A wooden cabin stands beside the forest edge. One trail returns to the grounds, another enters the trees, and an open gate leads to the creature paddock.",
    "exits": {
      "s": "bridge",
      "w": "forest",
      "e": "paddock"
    }
  },
  {
    "id": "paddock",
    "path": "/hogwarts/grounds/keeper-hut/creature-paddock/",
    "name": "Creature Paddock",
    "kind": "forest",
    "kicker": "Care of Magical Creatures",
    "teacher": "Rubeus Hagrid",
    "subject": "Care of Magical Creatures",
    "description": "Behind the fence, a few curious eyes shine back at you.",
    "exits": {
      "w": "hut",
      "e": "quidditch"
    }
  },
  {
    "id": "quidditch",
    "path": "/hogwarts/grounds/quidditch/pitch/",
    "name": "Quidditch Pitch",
    "kind": "quidditch",
    "kicker": "The field under starlight",
    "teacher": "",
    "subject": "",
    "description": "Six high hoops reach into the wind. The stands are empty and full of echoes.",
    "exits": {
      "n": "courtyard",
      "w": "paddock",
      "s": "flying"
    }
  },
  {
    "id": "greenhouse",
    "path": "/hogwarts/grounds/greenhouses/glass-passage/",
    "name": "Glasshouse Passage",
    "kind": "greenhouse",
    "kicker": "Breathing glass",
    "teacher": "",
    "subject": "",
    "description": "The windows are fogged from inside. Something leaf-shaped taps on the panes.",
    "exits": {
      "w": "cloister",
      "e": "herbology"
    }
  },
  {
    "id": "herbology",
    "path": "/hogwarts/grounds/greenhouses/herbology-lesson/",
    "name": "Herbology",
    "kind": "herbology",
    "kicker": "The roots are restless",
    "teacher": "Pomona Sprout",
    "subject": "Herbology",
    "description": "Mandrakes rustle in their pots. The professor's gloves are coated in fresh soil.",
    "exits": {
      "w": "greenhouse"
    }
  },
  {
    "id": "flying",
    "path": "/hogwarts/grounds/quidditch/flying-lesson/",
    "name": "Flying-lesson Lawn",
    "kind": "quidditch",
    "kicker": "The flat grass beside the grounds",
    "teacher": "Rolanda Hooch",
    "subject": "Flying",
    "description": "The open lawn gives first-time flyers space to practise. Its paths return to the approach and continue toward the Quidditch pitch.",
    "exits": {
      "n": "quidditch",
      "s": "forecourt"
    }
  },
  {
    "id": "sluice",
    "path": "/hogwarts/under-castle/serpent-sewers/",
    "name": "Serpent's Descent",
    "kind": "sewers",
    "kicker": "Below the last known floor",
    "teacher": "",
    "subject": "",
    "description": "A dry tunnel continues toward the serpent door. The pipe behind rises to Myrtle's bathroom; returning upward uses the story's magically assisted ascent.",
    "exits": {
      "n": "chamber",
      "s": "bathroom"
    }
  },
  {
    "id": "chamber",
    "path": "/hogwarts/under-castle/chamber-of-secrets/",
    "name": "Chamber of Secrets",
    "kind": "chamber",
    "kicker": "A room that should not exist",
    "teacher": "",
    "subject": "",
    "description": "Stone columns rise above the dark water. A dry causeway reaches the far end of the chamber, beneath the face of Salazar Slytherin.",
    "exits": {
      "s": "sluice",
      "n": "sanctum"
    }
  },
  {
    "id": "sanctum",
    "path": "/hogwarts/under-castle/ancient-serpent-sanctum/",
    "name": "The Chamber's Far End",
    "kind": "chamber",
    "kicker": "Beneath the face of Slytherin",
    "teacher": "",
    "subject": "",
    "description": "The far end belongs to the same Chamber of Secrets. The stone walkway returns between its columns; there is no second canonical sanctum here.",
    "exits": {
      "s": "chamber"
    }
  },
  {
    "id": "requirement",
    "path": "/hogwarts/castle/academic-wing/room-of-requirement/",
    "name": "Room of Requirement",
    "kind": "requirement",
    "kicker": "Only what is truly needed",
    "teacher": "",
    "subject": "",
    "description": "The room has become a storehouse of forgotten things. Its doorway returns to the seventh-floor corridor where it appeared.",
    "exits": {
      "s": "corridor"
    }
  },
  {
    "id": "basementPassage",
    "path": "/hogwarts/castle/basement/fruit-portrait-passage/",
    "name": "Basement Passage",
    "kind": "hall",
    "kicker": "Beneath the Great Hall",
    "teacher": "",
    "subject": "",
    "description": "Food paintings brighten the broad stone corridor. A fruit portrait stands open beside a warm kitchen doorway.",
    "exits": {
      "s": "entry",
      "w": "kitchens",
      "e": "dungeonSteps"
    }
  },
  {
    "id": "firstFloorJunction",
    "path": "/hogwarts/castle/academic-wing/first-floor/teaching-corridor/",
    "name": "Teaching Corridor",
    "kind": "hall",
    "kicker": "Lessons behind the doors",
    "teacher": "",
    "subject": "",
    "description": "Open doorways branch from a quiet landing. Each classroom returns to this shared corridor.",
    "exits": {
      "s": "staircase",
      "w": "hospital",
      "n": "history",
      "e": "defense",
      "a": "transfig"
    }
  },
  {
    "id": "midFloorStair",
    "path": "/hogwarts/castle/grand-staircase/middle-landings/",
    "name": "Middle Landings",
    "kind": "stair",
    "kicker": "Between the second and fourth floors",
    "teacher": "",
    "subject": "",
    "description": "The stairs join the bathroom corridor, the third-floor galleries and the library landing above.",
    "exits": {
      "s": "staircase",
      "w": "baths",
      "e": "armoury",
      "n": "gallery",
      "a": "charms"
    }
  },
  {
    "id": "northTowerLanding",
    "path": "/hogwarts/castle/north-tower/trapdoor-landing/",
    "name": "North Tower Landing",
    "kind": "stair",
    "kicker": "A ladder above the landing",
    "teacher": "",
    "subject": "",
    "description": "A silver ladder reaches an open ceiling hatch. The scent of tea drifts down from the Divination classroom.",
    "exits": {
      "s": "corridor",
      "n": "divination"
    }
  }
];
  var rooms=Object.create(null),paths=Object.create(null);
  rows.forEach(function(room){rooms[room.id]=room;paths[room.path]=room.id;});
  window.HogwartsAtlas={rooms:rooms,byPath:paths,start:"gate"};
})();
