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
      "s": "flying",
      "w": "hogsRoad",
      "a": "outerSlope"
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
      "e": "basementPassage",
      "a": "antechamber"
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
      "n": "pantry",
      "e": "commonHuffle"
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
      "n": "library",
      "e": "commonGryff"
    },
    "secret": {
      "to": "mirrorChamber",
      "type": "mirror"
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
      "s": "midFloorStair",
      "n": "trophy"
    },
    "secret": {
      "to": "forgottenArmory",
      "type": "armour"
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
      "n": "bathroom",
      "e": "prefectsBath"
    },
    "secret": {
      "to": "oneEyedTunnel",
      "type": "statue"
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
    },
    "secret": {
      "to": "restrictedStacks",
      "type": "books"
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
      "s": "ramparts",
      "n": "owlDrop"
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
      "e": "astrStair",
      "n": "clockTower",
      "a": "commonRaven"
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
    },
    "secret": {
      "to": "trapdoorChamber",
      "type": "hatch"
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
    },
    "secret": {
      "to": "whisperingCrypt",
      "type": "whisper"
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
    },
    "secret": {
      "to": "serpentDoor",
      "type": "rune"
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
      "s": "quidditch",
      "a": "willowRoots"
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
      "n": "hut",
      "s": "coveredBridge"
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
      "s": "lake",
      "n": "boatLaunch"
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
    },
    "secret": {
      "to": "lakeShallows",
      "type": "reflection"
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
      "n": "clearing",
      "e": "acromantulaDen"
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
      "s": "forest",
      "n": "centaurGrove"
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
      "s": "flying",
      "e": "quidStands",
      "a": "quidGoals"
    },
    "secret": {
      "to": "quidReferee",
      "type": "banner"
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
      "e": "herbology",
      "n": "herbCourt"
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
      "s": "forecourt",
      "e": "flyingShed"
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
      "s": "corridor",
      "n": "roRThings",
      "e": "roRDA",
      "w": "roRDiadem",
      "a": "roRArchive"
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
  },
  {
    "id": "hogsRoad",
    "path": "/hogwarts/hogsmeade/hill-road/",
    "name": "Hogsmeade Hill Road",
    "kind": "grounds",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "A steep lane descends through pine trees toward the village lights.",
    "exits": {
      "n": "forecourt",
      "e": "hogsStation",
      "s": "shriekingShack"
    }
  },
  {
    "id": "hogsStation",
    "path": "/hogwarts/hogsmeade/station/",
    "name": "Hogsmeade Station",
    "kind": "hall",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "A quiet platform, dark rails and an old clock under the lanterns.",
    "exits": {
      "n": "hogsRoad",
      "e": "hogsBridge"
    }
  },
  {
    "id": "hogsBridge",
    "path": "/hogwarts/hogsmeade/station/wooden-bridge/",
    "name": "Station Wooden Bridge",
    "kind": "bridge",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Timber planks cross the narrow stream below the station.",
    "exits": {
      "n": "hogsStation",
      "e": "hogsSquare"
    }
  },
  {
    "id": "hogsSquare",
    "path": "/hogwarts/hogsmeade/village-square/",
    "name": "Hogsmeade Village Square",
    "kind": "grounds",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Warm shop windows surround a cobbled square beneath snowy gables.",
    "exits": {
      "n": "hogsBridge",
      "e": "hogsHigh",
      "s": "puddifoot",
      "w": "postOffice"
    }
  },
  {
    "id": "hogsHigh",
    "path": "/hogwarts/hogsmeade/high-street/",
    "name": "Hogsmeade High Street",
    "kind": "grounds",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Shop signs and crooked chimneys crowd the main street.",
    "exits": {
      "n": "hogsSquare",
      "e": "broomsPorch",
      "s": "hogsHeadPorch",
      "w": "honeydukes",
      "a": "zonkos",
      "b": "scribbulus",
      "c": "gladrags",
      "d": "dervish"
    }
  },
  {
    "id": "broomsPorch",
    "path": "/hogwarts/hogsmeade/three-broomsticks/porch/",
    "name": "Three Broomsticks Porch",
    "kind": "hall",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Laughter and lamplight spill out across the threshold.",
    "exits": {
      "n": "hogsHigh",
      "e": "broomsPub"
    }
  },
  {
    "id": "broomsPub",
    "path": "/hogwarts/hogsmeade/three-broomsticks/",
    "name": "The Three Broomsticks",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "An inviting public house of honey-coloured wood and blazing hearths.",
    "exits": {
      "n": "broomsPorch"
    }
  },
  {
    "id": "hogsHeadPorch",
    "path": "/hogwarts/hogsmeade/hogs-head/porch/",
    "name": "Hog's Head Porch",
    "kind": "hall",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "The weathered inn sign creaks above a shadowed doorway.",
    "exits": {
      "n": "hogsHigh",
      "e": "hogsHead"
    }
  },
  {
    "id": "hogsHead",
    "path": "/hogwarts/hogsmeade/hogs-head/",
    "name": "The Hog's Head",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "A gloomy bar with old bottles, dust and a watchful portrait.",
    "exits": {
      "n": "hogsHeadPorch"
    },
    "secret": {
      "to": "hogsCellar",
      "type": "bottle"
    }
  },
  {
    "id": "hogsCellar",
    "path": "/hogwarts/hogsmeade/hogs-head/cellar/",
    "name": "Hog's Head Cellar",
    "kind": "dungeon",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "The cellar is crowded with forgotten casks and a suspicious stone statue.",
    "exits": {
      "n": "hogsHead"
    },
    "secret": {
      "to": "humpbackTunnel",
      "type": "statue"
    }
  },
  {
    "id": "honeydukes",
    "path": "/hogwarts/hogsmeade/honeydukes/",
    "name": "Honeydukes",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Glass jars gleam with sweets in every colour imaginable.",
    "exits": {
      "n": "hogsHigh"
    },
    "secret": {
      "to": "honeyCellar",
      "type": "trapdoor"
    }
  },
  {
    "id": "zonkos",
    "path": "/hogwarts/hogsmeade/zonkos/",
    "name": "Zonko's Joke Shop",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Mechanical marvels and mischief crowd the shelves.",
    "exits": {
      "n": "hogsHigh"
    }
  },
  {
    "id": "scribbulus",
    "path": "/hogwarts/hogsmeade/scribbulus/",
    "name": "Scrivenshaft's Quill Shop",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Quills and enchanted inks cover a polished writing desk.",
    "exits": {
      "n": "hogsHigh"
    }
  },
  {
    "id": "gladrags",
    "path": "/hogwarts/hogsmeade/gladrags/",
    "name": "Gladrags Wizardwear",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Robes and hats hang behind tall leaded shop windows.",
    "exits": {
      "n": "hogsHigh"
    }
  },
  {
    "id": "dervish",
    "path": "/hogwarts/hogsmeade/dervish-and-banges/",
    "name": "Dervish and Banges",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Magical instruments tick, spin and murmur from brass cabinets.",
    "exits": {
      "n": "hogsHigh"
    }
  },
  {
    "id": "puddifoot",
    "path": "/hogwarts/hogsmeade/madam-puddifoot/",
    "name": "Madam Puddifoot's Tea Shop",
    "kind": "study",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Tiny tea tables crowd a room steeped in rose-coloured steam.",
    "exits": {
      "n": "hogsSquare"
    }
  },
  {
    "id": "postOffice",
    "path": "/hogwarts/hogsmeade/post-office/",
    "name": "Hogsmeade Post Office",
    "kind": "hall",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "Owls settle above a counter crowded with parcels and stamps.",
    "exits": {
      "n": "hogsSquare"
    }
  },
  {
    "id": "shriekingShack",
    "path": "/hogwarts/hogsmeade/shrieking-shack/",
    "name": "The Shrieking Shack",
    "kind": "exterior",
    "kicker": "霍格莫德村",
    "teacher": "",
    "subject": "",
    "description": "A shuttered house stands alone where the village path ends.",
    "exits": {
      "n": "hogsRoad"
    }
  },
  {
    "id": "antechamber",
    "path": "/hogwarts/castle/keep/ground-floor/great-hall-antechamber/",
    "name": "Great Hall Antechamber",
    "kind": "hall",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Torchlight gilds the stone antechamber outside the Great Hall.",
    "exits": {
      "n": "entry"
    }
  },
  {
    "id": "trophy",
    "path": "/hogwarts/castle/keep/third-floor/trophy-gallery/",
    "name": "Trophy Gallery",
    "kind": "portrait",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Names engraved in silver catch the light among old shields.",
    "exits": {
      "n": "armoury"
    },
    "secret": {
      "to": "mapNook",
      "type": "map"
    }
  },
  {
    "id": "clockTower",
    "path": "/hogwarts/castle/upper-keep/clock-tower/",
    "name": "Clock Tower",
    "kind": "observatory",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Enormous clockworks turn above the cloisters.",
    "exits": {
      "n": "ramparts"
    }
  },
  {
    "id": "prefectsBath",
    "path": "/hogwarts/castle/keep/fifth-floor/prefects-bathroom/",
    "name": "Prefects' Bathroom",
    "kind": "bathroom",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Coloured taps surround a vast marble bath.",
    "exits": {
      "n": "baths"
    }
  },
  {
    "id": "commonGryff",
    "path": "/hogwarts/castle/residences/gryffindor-common-room/",
    "name": "Gryffindor Common Room",
    "kind": "study",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Red hangings and a warm fireplace welcome tired students.",
    "exits": {
      "n": "gallery"
    }
  },
  {
    "id": "commonRaven",
    "path": "/hogwarts/castle/residences/ravenclaw-common-room/",
    "name": "Ravenclaw Common Room",
    "kind": "study",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Blue windows frame the night sky above shelves of books.",
    "exits": {
      "n": "ramparts"
    }
  },
  {
    "id": "commonHuffle",
    "path": "/hogwarts/castle/residences/hufflepuff-common-room/",
    "name": "Hufflepuff Common Room",
    "kind": "study",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Round windows and copper lamps brighten a snug underground room.",
    "exits": {
      "n": "kitchens"
    }
  },
  {
    "id": "commonSlytherin",
    "path": "/hogwarts/castle/residences/slytherin-common-room/",
    "name": "Slytherin Common Room",
    "kind": "dungeon",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Greenish light ripples through windows below the water.",
    "exits": {
      "n": "serpentDoor"
    }
  },
  {
    "id": "roRThings",
    "path": "/hogwarts/castle/academic-wing/room-of-requirement/hidden-things/",
    "name": "Room of Hidden Things",
    "kind": "requirement",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Towering heaps of lost objects form paths through the changing room.",
    "exits": {
      "n": "requirement"
    }
  },
  {
    "id": "roRDA",
    "path": "/hogwarts/castle/academic-wing/room-of-requirement/da-training/",
    "name": "D.A. Training Room",
    "kind": "requirement",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Practice dummies and spell marks line a responsive training hall.",
    "exits": {
      "n": "requirement"
    }
  },
  {
    "id": "roRDiadem",
    "path": "/hogwarts/castle/academic-wing/room-of-requirement/diadem-niche/",
    "name": "Diadem Niche",
    "kind": "requirement",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "A dusty niche lies among stacks of forgotten furniture.",
    "exits": {
      "n": "requirement"
    }
  },
  {
    "id": "roRArchive",
    "path": "/hogwarts/castle/academic-wing/room-of-requirement/living-archive/",
    "name": "Living Archive",
    "kind": "requirement",
    "kicker": "城堡新翼与有求必应屋",
    "teacher": "",
    "subject": "",
    "description": "Folio pages shuffle by themselves as shelves continually rearrange.",
    "exits": {
      "n": "requirement"
    }
  },
  {
    "id": "lakeShallows",
    "path": "/hogwarts/grounds/black-lake/shallow-water/",
    "name": "Black Lake Shallows",
    "kind": "lake",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Moonlight wrinkles across the narrow strip of shallows.",
    "exits": {
      "n": "lakeIslet",
      "e": "lakeCave",
      "s": "dock"
    }
  },
  {
    "id": "boatLaunch",
    "path": "/hogwarts/grounds/black-lake/boat-launch/",
    "name": "Boathouse Launch",
    "kind": "lake",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Small boats rock against the timber landing.",
    "exits": {
      "n": "boathouse"
    }
  },
  {
    "id": "lakeCave",
    "path": "/hogwarts/grounds/black-lake/underwater-cave/",
    "name": "Black Lake Underwater Cave",
    "kind": "water",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Blue light filters through the roof of a submerged cavern.",
    "exits": {
      "n": "lakeShallows",
      "e": "merVillage"
    }
  },
  {
    "id": "merVillage",
    "path": "/hogwarts/grounds/black-lake/merpeople-village/",
    "name": "Merpeople Village",
    "kind": "water",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Submerged stone dwellings rise around an ancient plaza.",
    "exits": {
      "n": "lakeCave"
    }
  },
  {
    "id": "lakeIslet",
    "path": "/hogwarts/grounds/black-lake/islet/",
    "name": "Black Lake Islet",
    "kind": "lake",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "A lonely island breaks the smooth surface of the lake.",
    "exits": {
      "n": "lakeShallows"
    }
  },
  {
    "id": "willowRoots",
    "path": "/hogwarts/grounds/whomping-willow/roots/",
    "name": "Whomping Willow Roots",
    "kind": "forest",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Enormous roots press against the earth beside an agitated trunk.",
    "exits": {
      "n": "courtyard"
    }
  },
  {
    "id": "centaurGrove",
    "path": "/hogwarts/grounds/forbidden-forest/centaur-grove/",
    "name": "Centaur Grove",
    "kind": "forest",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "A circle of old trees opens beneath the stars.",
    "exits": {
      "n": "clearing",
      "e": "unicornGlade"
    }
  },
  {
    "id": "unicornGlade",
    "path": "/hogwarts/grounds/forbidden-forest/unicorn-glade/",
    "name": "Unicorn Glade",
    "kind": "forest",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Silver tracks wind between ferns and moonlit birches.",
    "exits": {
      "n": "centaurGrove"
    }
  },
  {
    "id": "acromantulaDen",
    "path": "/hogwarts/grounds/forbidden-forest/acromantula-den/",
    "name": "Acromantula Den",
    "kind": "forest",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Heavy webs hang between black trunks.",
    "exits": {
      "n": "forest"
    }
  },
  {
    "id": "coveredBridge",
    "path": "/hogwarts/grounds/covered-bridge/",
    "name": "Covered Bridge",
    "kind": "bridge",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "A timber roof spans the ravine beneath the castle.",
    "exits": {
      "n": "bridge"
    }
  },
  {
    "id": "herbCourt",
    "path": "/hogwarts/grounds/greenhouses/herbology-courtyard/",
    "name": "Herbology Courtyard",
    "kind": "greenhouse",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Clay pots and damp seedlings crowd the walled garden.",
    "exits": {
      "n": "greenhouse"
    }
  },
  {
    "id": "outerSlope",
    "path": "/hogwarts/grounds/castle-outer-slope/",
    "name": "Castle Outer Slope",
    "kind": "grounds",
    "kicker": "湖底、禁林与校地外围",
    "teacher": "",
    "subject": "",
    "description": "Wind moves through the grass below the high walls.",
    "exits": {
      "n": "forecourt"
    }
  },
  {
    "id": "quidStands",
    "path": "/hogwarts/grounds/quidditch/stands/",
    "name": "Quidditch Stands",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "High wooden terraces rise above the green pitch.",
    "exits": {
      "n": "quidditch",
      "e": "quidChanging"
    }
  },
  {
    "id": "quidChanging",
    "path": "/hogwarts/grounds/quidditch/changing-rooms/",
    "name": "Quidditch Changing Rooms",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "House colours hang from the rafters beside lockers.",
    "exits": {
      "n": "quidStands",
      "e": "quidKit"
    }
  },
  {
    "id": "quidKit",
    "path": "/hogwarts/grounds/quidditch/equipment-store/",
    "name": "Quidditch Equipment Store",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "Brooms, bats and training balls wait behind barred shelves.",
    "exits": {
      "n": "quidChanging"
    }
  },
  {
    "id": "quidReferee",
    "path": "/hogwarts/grounds/quidditch/referee-tower/",
    "name": "Quidditch Referee Tower",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "A private staircase climbs to the flags above the field.",
    "exits": {
      "n": "quidditch"
    }
  },
  {
    "id": "quidGoals",
    "path": "/hogwarts/grounds/quidditch/goal-hoops/",
    "name": "Quidditch Goal Hoops",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "Three hoops cast long shadows over a bright green pitch.",
    "exits": {
      "n": "quidditch",
      "e": "quidTrophies"
    }
  },
  {
    "id": "quidTrophies",
    "path": "/hogwarts/grounds/quidditch/trophy-walk/",
    "name": "Quidditch Trophy Walk",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "Team pennants and battered cups line a short arcade.",
    "exits": {
      "n": "quidGoals"
    }
  },
  {
    "id": "flyingShed",
    "path": "/hogwarts/grounds/quidditch/flying-equipment-shed/",
    "name": "Flying Lesson Equipment Shed",
    "kind": "quidditch",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "Practice brooms lean against a low timber wall.",
    "exits": {
      "n": "flying"
    }
  },
  {
    "id": "owlDrop",
    "path": "/hogwarts/grounds/quidditch/owl-delivery-ledge/",
    "name": "Owl Delivery Ledge",
    "kind": "grounds",
    "kicker": "魁地奇与飞行区域",
    "teacher": "",
    "subject": "",
    "description": "Owl perches overlook the grounds from a sheltered ledge.",
    "exits": {
      "n": "owlery"
    }
  },
  {
    "id": "humpbackTunnel",
    "path": "/hogwarts/under-castle/humpbacked-witch-passage/",
    "name": "Humpbacked Witch Passage",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "A narrow carved passage vanishes under the hillside.",
    "exits": {
      "n": "hogsCellar"
    }
  },
  {
    "id": "serpentDoor",
    "path": "/hogwarts/castle/dungeons/serpent-door/",
    "name": "Serpent Door",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "A carved serpent coils around a door of dark stone.",
    "exits": {
      "n": "commonSlytherin",
      "e": "slytherin"
    }
  },
  {
    "id": "trapdoorChamber",
    "path": "/hogwarts/castle/dungeons/hidden-trapdoor/",
    "name": "Trapdoor Chamber",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "A hidden hatch opens onto forgotten masonry.",
    "exits": {
      "n": "oldArchive"
    }
  },
  {
    "id": "mirrorChamber",
    "path": "/hogwarts/castle/keep/mirror-of-erised-chamber/",
    "name": "Mirror of Erised Chamber",
    "kind": "portrait",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "An ornate mirror waits alone under a faded curtain.",
    "exits": {
      "n": "gallery"
    }
  },
  {
    "id": "mapNook",
    "path": "/hogwarts/castle/keep/marauders-map-nook/",
    "name": "Marauder's Map Nook",
    "kind": "study",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "Old parchment shows a shifting maze of corridors.",
    "exits": {
      "n": "trophy"
    }
  },
  {
    "id": "restrictedStacks",
    "path": "/hogwarts/castle/academic-wing/first-floor/restricted-section/",
    "name": "Library Restricted Section",
    "kind": "library",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "Darkened shelves stand beyond a screened doorway.",
    "exits": {
      "n": "library"
    }
  },
  {
    "id": "oneEyedTunnel",
    "path": "/hogwarts/under-castle/one-eyed-witch-tunnel/",
    "name": "One-Eyed Witch Tunnel",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "Stone steps wind toward an old confectioner's cellar.",
    "exits": {
      "n": "honeyCellar",
      "e": "baths"
    }
  },
  {
    "id": "honeyCellar",
    "path": "/hogwarts/hogsmeade/honeydukes/cellar/",
    "name": "Honeydukes Cellar",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "The sweet shop's cellar hides a stair under barrels.",
    "exits": {
      "n": "oneEyedTunnel",
      "e": "honeydukes"
    }
  },
  {
    "id": "whisperingCrypt",
    "path": "/hogwarts/castle/dungeons/whispering-crypt/",
    "name": "Whispering Crypt",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "Indistinct voices drift between memorial stones.",
    "exits": {
      "n": "crypt"
    }
  },
  {
    "id": "forgottenArmory",
    "path": "/hogwarts/castle/keep/forgotten-armory/",
    "name": "Forgotten Armoury",
    "kind": "dungeon",
    "kicker": "隐秘通道与失落房间",
    "teacher": "",
    "subject": "",
    "description": "Old shields guard a sealed passage behind the gallery.",
    "exits": {
      "n": "armoury"
    }
  }
];
  var rooms=Object.create(null),paths=Object.create(null);
  rows.forEach(function(room){rooms[room.id]=room;paths[room.path]=room.id;});
  window.HogwartsAtlas={rooms:rooms,byPath:paths,start:"gate"};
})();
