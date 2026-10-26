/* Dedicated scene photography and image-bound passage coordinates.
   Coordinates are percentages of the complete image, never a cover-cropped viewport. */
(function(){
  "use strict";
  window.HogwartsScenes={
  "gate": {
    "src": "/assets/images/hogwarts-cinematic-v3/hogwarts-entrance.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hogwarts — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        50.5,
        59.5,
        12,
        24
      ],
      "s": [
        50,
        92,
        30,
        16
      ]
    }
  },
  "forecourt": {
    "src": "/assets/images/hogwarts-cinematic-v3/lantern-path.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Lantern Path — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        41,
        47,
        14,
        24
      ],
      "e": [
        90,
        64,
        18,
        32
      ]
    }
  },
  "entry": {
    "src": "/assets/images/hogwarts-cinematic/entrance-hall.webp",
    "width": 1672,
    "height": 941,
    "alt": "Entrance Hall — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        59,
        57,
        15,
        26
      ],
      "e": [
        89,
        70,
        20,
        36
      ],
      "w": [
        10,
        70,
        20,
        36
      ]
    }
  },
  "great": {
    "src": "/assets/images/hogwarts-cinematic/great-hall.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Great Hall — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "e": [
        72,
        63,
        12,
        24
      ],
      "w": [
        17,
        66,
        13,
        26
      ],
      "n": [
        36,
        59,
        9,
        19
      ]
    },
    "ceremony": [
      52,
      63,
      14,
      12
    ]
  },
  "kitchens": {
    "src": "/assets/images/hogwarts-cinematic/castle-kitchens.webp",
    "width": 1672,
    "height": 941,
    "alt": "Castle Kitchens — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        80,
        20,
        36
      ],
      "n": [
        52,
        51,
        14,
        23
      ]
    }
  },
  "pantry": {
    "src": "/assets/images/hogwarts-cinematic-v3/copper-pantry.webp",
    "width": 1672,
    "height": 941,
    "alt": "Copper Pantry — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        59,
        43,
        12,
        32
      ]
    }
  },
  "gallery": {
    "src": "/assets/images/hogwarts-cinematic/portrait-gallery.webp",
    "width": 1672,
    "height": 941,
    "alt": "Portrait Gallery — a cinematic view of Hogwarts",
    "exits": {
      "e": [
        91,
        77,
        18,
        36
      ],
      "n": [
        61,
        64,
        14,
        22
      ],
      "s": [
        50,
        92,
        30,
        16
      ]
    }
  },
  "armoury": {
    "src": "/assets/images/hogwarts-cinematic/armoury.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Armoury — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "e": [
        91,
        75,
        18,
        36
      ]
    }
  },
  "cloister": {
    "src": "/assets/images/hogwarts-cinematic/east-cloister.webp",
    "width": 1672,
    "height": 941,
    "alt": "East Cloister — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        76,
        20,
        38
      ],
      "n": [
        37,
        63,
        12,
        23
      ],
      "e": [
        89,
        77,
        22,
        35
      ],
      "s": [
        50,
        92,
        30,
        16
      ]
    }
  },
  "hospital": {
    "src": "/assets/images/hogwarts-cinematic/hospital-wing.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hospital Wing — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        79,
        20,
        36
      ],
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        60,
        56,
        15,
        25
      ]
    }
  },
  "transfig": {
    "src": "/assets/images/hogwarts-cinematic/transfiguration.webp",
    "width": 1672,
    "height": 941,
    "alt": "Transfiguration — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "w": [
        9,
        77,
        18,
        36
      ],
      "e": [
        92,
        77,
        16,
        36
      ]
    }
  },
  "baths": {
    "src": "/assets/images/hogwarts-cinematic-v3/forgotten-washroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Forgotten Washroom — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        41,
        69,
        18,
        28
      ],
      "e": [
        87,
        59,
        22,
        34
      ]
    }
  },
  "bathroom": {
    "src": "/assets/images/hogwarts-cinematic/myrtles-bathroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Myrtle's Bathroom — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        25,
        52,
        14,
        38
      ],
      "w": [
        7,
        74,
        14,
        35
      ]
    },
    "secret": [
      86,
      65,
      23,
      30
    ]
  },
  "history": {
    "src": "/assets/images/hogwarts-cinematic/history-of-magic.webp",
    "width": 1672,
    "height": 941,
    "alt": "History of Magic — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        9,
        72,
        18,
        40
      ],
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        51,
        55,
        14,
        24
      ]
    }
  },
  "staircase": {
    "src": "/assets/images/hogwarts-cinematic/grand-staircase.webp",
    "width": 1672,
    "height": 941,
    "alt": "Grand Staircase — a cinematic view of Hogwarts",
    "exits": {
      "e": [
        91,
        63,
        18,
        35
      ],
      "n": [
        63,
        51,
        15,
        25
      ],
      "w": [
        12,
        75,
        24,
        33
      ]
    }
  },
  "corridor": {
    "src": "/assets/images/hogwarts-cinematic/enchanted-corridor.webp",
    "width": 1672,
    "height": 941,
    "alt": "Enchanted Corridor — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "e": [
        93,
        57,
        14,
        53
      ],
      "w": [
        9,
        88,
        18,
        24
      ],
      "n": [
        58,
        64,
        11,
        27
      ]
    },
    "secret": [
      42,
      56,
      9,
      43
    ]
  },
  "library": {
    "src": "/assets/images/hogwarts-cinematic/library.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hogwarts Library — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "e": [
        89,
        59,
        18,
        45
      ],
      "w": [
        9,
        77,
        18,
        35
      ],
      "n": [
        63,
        62,
        12,
        26
      ]
    }
  },
  "charms": {
    "src": "/assets/images/hogwarts-cinematic/charms.webp",
    "width": 1672,
    "height": 941,
    "alt": "Charms — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        55,
        54,
        14,
        24
      ],
      "e": [
        92,
        77,
        16,
        36
      ]
    }
  },
  "defense": {
    "src": "/assets/images/hogwarts-cinematic/defence-against-dark-arts.webp",
    "width": 1672,
    "height": 941,
    "alt": "Defence Against the Dark Arts — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "e": [
        92,
        79,
        16,
        36
      ]
    }
  },
  "office": {
    "src": "/assets/images/hogwarts-cinematic-v3/headmasters-office.webp",
    "width": 1672,
    "height": 940,
    "alt": "Headmaster's Office — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        74,
        55,
        15,
        25
      ],
      "e": [
        91,
        70,
        18,
        38
      ]
    }
  },
  "astrStair": {
    "src": "/assets/images/hogwarts-cinematic-v3/spiral-ascent.webp",
    "width": 1672,
    "height": 941,
    "alt": "Spiral Ascent — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        30,
        86,
        32,
        20
      ],
      "e": [
        79,
        55,
        25,
        44
      ]
    }
  },
  "astrTower": {
    "src": "/assets/images/hogwarts-cinematic/astronomy-tower.webp",
    "width": 1672,
    "height": 941,
    "alt": "Astronomy Tower — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        73,
        20,
        36
      ],
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        58,
        58,
        16,
        29
      ]
    }
  },
  "divination": {
    "src": "/assets/images/hogwarts-cinematic-v3/divination-classroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Divination — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        76,
        20,
        36
      ],
      "n": [
        57,
        49,
        16,
        28
      ]
    }
  },
  "owlery": {
    "src": "/assets/images/hogwarts-cinematic-v3/owlery.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Owlery — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "w": [
        15,
        57,
        18,
        50
      ]
    }
  },
  "ramparts": {
    "src": "/assets/images/hogwarts-cinematic-v3/north-battlements.webp",
    "width": 1672,
    "height": 941,
    "alt": "North Battlements — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        49,
        14,
        46
      ],
      "s": [
        50,
        93,
        32,
        14
      ],
      "e": [
        92,
        55,
        14,
        26
      ]
    }
  },
  "dungeonSteps": {
    "src": "/assets/images/hogwarts-cinematic-v3/dungeon-stairwell.webp",
    "width": 1672,
    "height": 941,
    "alt": "Dungeon Stairwell — a cinematic view of Hogwarts",
    "exits": {
      "e": [
        91,
        75,
        18,
        38
      ],
      "n": [
        70,
        66,
        16,
        28
      ],
      "s": [
        50,
        92,
        30,
        16
      ],
      "w": [
        10,
        75,
        20,
        38
      ]
    }
  },
  "potions": {
    "src": "/assets/images/hogwarts-cinematic/potions.webp",
    "width": 1672,
    "height": 941,
    "alt": "Potions — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        73,
        58,
        14,
        25
      ],
      "e": [
        92,
        75,
        16,
        38
      ]
    }
  },
  "oldArchive": {
    "src": "/assets/images/hogwarts-cinematic-v3/forgotten-archive.webp",
    "width": 1672,
    "height": 941,
    "alt": "Forgotten Archive — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        53,
        91,
        32,
        18
      ],
      "e": [
        79,
        49,
        12,
        38
      ],
      "w": [
        23.5,
        47,
        11,
        33
      ]
    }
  },
  "crypt": {
    "src": "/assets/images/hogwarts-cinematic-v3/forgotten-crypt.webp",
    "width": 1672,
    "height": 940,
    "alt": "Forgotten Crypt — a cinematic view of Hogwarts",
    "exits": {
      "e": [
        12,
        49,
        20,
        40
      ]
    }
  },
  "slytherin": {
    "src": "/assets/images/hogwarts-cinematic-v3/green-lantern-passage.webp",
    "width": 1672,
    "height": 941,
    "alt": "Green Lantern Passage — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        14,
        55,
        20,
        42
      ],
      "s": [
        50,
        92,
        30,
        16
      ]
    }
  },
  "reservoir": {
    "src": "/assets/images/hogwarts-cinematic-v3/underground-reservoir.webp",
    "width": 1672,
    "height": 941,
    "alt": "Underground Reservoir — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        42,
        18,
        36
      ],
      "n": [
        67,
        43,
        13,
        28
      ]
    }
  },
  "vault": {
    "src": "/assets/images/hogwarts-cinematic-v3/old-storeroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Old Storeroom — a cinematic view of Hogwarts",
    "exits": {
      "e": [
        74,
        47,
        12,
        35
      ]
    }
  },
  "courtyard": {
    "src": "/assets/images/hogwarts-cinematic-v3/south-courtyard.webp",
    "width": 1672,
    "height": 941,
    "alt": "South Courtyard — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        12,
        48,
        14,
        32
      ],
      "n": [
        53,
        49,
        8,
        20
      ],
      "e": [
        93,
        50,
        12,
        30
      ],
      "s": [
        50,
        91,
        30,
        18
      ]
    }
  },
  "bridge": {
    "src": "/assets/images/hogwarts-cinematic-v3/stone-viaduct.webp",
    "width": 1672,
    "height": 941,
    "alt": "Stone Viaduct — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        9,
        40,
        15,
        26
      ],
      "n": [
        50,
        48,
        17,
        25
      ],
      "e": [
        85,
        77,
        21,
        26
      ]
    }
  },
  "lake": {
    "src": "/assets/images/hogwarts-cinematic-v3/black-lake.webp",
    "width": 1672,
    "height": 941,
    "alt": "Black Lake — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        15,
        53,
        14,
        18
      ],
      "n": [
        44.5,
        43.5,
        10,
        16
      ],
      "s": [
        29,
        91,
        28,
        18
      ]
    }
  },
  "boathouse": {
    "src": "/assets/images/hogwarts-cinematic-v3/boathouse.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Boathouse — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        91,
        34,
        18
      ]
    }
  },
  "dock": {
    "src": "/assets/images/hogwarts-cinematic-v3/old-pier.webp",
    "width": 1672,
    "height": 941,
    "alt": "Old Pier — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        55,
        51,
        14,
        22
      ],
      "e": [
        80,
        54,
        17,
        23
      ]
    }
  },
  "forest": {
    "src": "/assets/images/hogwarts-cinematic/forbidden-forest.webp",
    "width": 1672,
    "height": 941,
    "alt": "Forbidden Forest — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "w": [
        9,
        75,
        18,
        36
      ],
      "n": [
        55,
        57,
        16,
        24
      ]
    }
  },
  "clearing": {
    "src": "/assets/images/hogwarts-cinematic-v3/ancient-clearing.webp",
    "width": 1672,
    "height": 941,
    "alt": "Ancient Clearing — a cinematic view of Hogwarts",
    "exits": {
      "e": [
        92,
        60,
        16,
        30
      ]
    }
  },
  "hut": {
    "src": "/assets/images/hogwarts-cinematic-v3/hagrids-hut.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hagrid's Hut — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        51,
        91,
        28,
        18
      ],
      "e": [
        79,
        62,
        19,
        30
      ]
    }
  },
  "paddock": {
    "src": "/assets/images/hogwarts-cinematic-v3/creature-paddock.webp",
    "width": 1672,
    "height": 941,
    "alt": "Creature Paddock — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        21,
        72,
        25,
        31
      ],
      "e": [
        92,
        67,
        16,
        35
      ]
    }
  },
  "quidditch": {
    "src": "/assets/images/hogwarts-cinematic/quidditch.webp",
    "width": 1672,
    "height": 941,
    "alt": "Quidditch Pitch — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        54,
        60,
        20,
        26
      ],
      "w": [
        9,
        79,
        18,
        34
      ],
      "s": [
        50,
        92,
        30,
        16
      ]
    }
  },
  "greenhouse": {
    "src": "/assets/images/hogwarts-cinematic-v3/glass-passage.webp",
    "width": 1672,
    "height": 941,
    "alt": "Glasshouse Passage — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        12,
        56,
        18,
        38
      ],
      "e": [
        87,
        57,
        18,
        44
      ]
    }
  },
  "herbology": {
    "src": "/assets/images/hogwarts-cinematic-v3/herbology-lesson.webp",
    "width": 1672,
    "height": 941,
    "alt": "Herbology — a cinematic view of Hogwarts",
    "exits": {
      "w": [
        10,
        47,
        15,
        42
      ]
    }
  },
  "flying": {
    "src": "/assets/images/hogwarts-cinematic-v3/flying-lesson.webp",
    "width": 1672,
    "height": 941,
    "alt": "Flying Lesson — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        57,
        71,
        18,
        26
      ],
      "w": [
        15,
        60,
        22,
        32
      ]
    }
  },
  "sluice": {
    "src": "/assets/images/hogwarts-cinematic-v3/serpents-descent.webp",
    "width": 1672,
    "height": 941,
    "alt": "Serpent's Descent — a cinematic view of Hogwarts",
    "exits": {
      "n": [
        61,
        72,
        20,
        30
      ],
      "s": [
        50,
        92,
        30,
        16
      ]
    }
  },
  "chamber": {
    "src": "/assets/images/hogwarts-cinematic/chamber-of-secrets.webp",
    "width": 1672,
    "height": 941,
    "alt": "Chamber of Secrets — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        50,
        92,
        30,
        16
      ],
      "n": [
        52,
        59,
        15,
        25
      ]
    }
  },
  "sanctum": {
    "src": "/assets/images/hogwarts-cinematic-v3/serpent-sanctum.webp",
    "width": 1672,
    "height": 941,
    "alt": "Serpent Sanctum — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        81,
        88,
        28,
        24
      ]
    }
  },
  "requirement": {
    "src": "/assets/images/hogwarts-cinematic-v3/room-of-requirement.webp",
    "width": 1672,
    "height": 941,
    "alt": "Room of Requirement — a cinematic view of Hogwarts",
    "exits": {
      "s": [
        52,
        91,
        30,
        18
      ]
    }
  }
};
})();
