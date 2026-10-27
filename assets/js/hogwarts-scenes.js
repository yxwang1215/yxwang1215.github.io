/* Native scene images and visually audited polygon apertures.
   All coordinates refer to the complete image; only explicit activation travels. */
(function(){
  "use strict";
  window.HogwartsScenes={
  "gate": {
    "src": "/assets/images/hogwarts-cinematic-v3/hogwarts-entrance.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hogwarts — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            48.1,
            65.7
          ],
          [
            52.5,
            65.7
          ],
          [
            52.5,
            57.5
          ],
          [
            51.9,
            54.7
          ],
          [
            50.4,
            52.6
          ],
          [
            49,
            54.5
          ],
          [
            48.1,
            57.3
          ]
        ],
        "point": [
          50.4,
          61
        ],
        "kind": "door",
        "label": "Follow the doorway to Entrance Hall",
        "evidence": "Distinct wooden double door inside the Gothic entrance; cobbled bridge reaches its threshold."
      },
      "s": {
        "polygon": [
          [
            33,
            88
          ],
          [
            68,
            88
          ],
          [
            80,
            99
          ],
          [
            20,
            99
          ]
        ],
        "point": [
          50,
          95
        ],
        "kind": "path",
        "label": "Turn back along the clear path to The Lantern Path",
        "evidence": "Unobstructed cobbled bridge fills the foreground and leaves the bottom edge.",
        "turnBack": true
      }
    }
  },
  "forecourt": {
    "src": "/assets/images/hogwarts-cinematic-v3/lantern-path.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Lantern Path — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            38.9,
            54.2
          ],
          [
            43.8,
            54.2
          ],
          [
            43.8,
            44.2
          ],
          [
            42.9,
            41.9
          ],
          [
            41.3,
            40.1
          ],
          [
            39.8,
            42.3
          ],
          [
            38.9,
            45.4
          ]
        ],
        "point": [
          41.3,
          52
        ],
        "kind": "arch",
        "label": "Follow the open arch to Hogwarts",
        "evidence": "Raised portcullis and inner walls frame a continuous cobbled route through the gate."
      },
      "e": {
        "polygon": [
          [
            84.4,
            63.6
          ],
          [
            94.9,
            63.6
          ],
          [
            96.2,
            70.7
          ],
          [
            95.9,
            80.6
          ],
          [
            78.6,
            80.6
          ],
          [
            81.6,
            72.9
          ]
        ],
        "point": [
          89.3,
          72.8
        ],
        "kind": "path",
        "label": "Follow the path to South Courtyard",
        "evidence": "Distinct right fork travels around the low stone divider toward the side entrance."
      },
      "s": {
        "polygon": [
          [
            27,
            89
          ],
          [
            67,
            89
          ],
          [
            75,
            99
          ],
          [
            16,
            99
          ]
        ],
        "point": [
          46,
          95
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Flying-lesson Lawn",
        "evidence": "Main cobbled approach also continues out the bottom edge; no current graph node represents the station approach.",
        "turnBack": true
      },
      "w": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Hogsmeade Hill Road",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      },
      "a": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Castle Outer Slope",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "entry": {
    "src": "/assets/images/hogwarts-cinematic-v4/entrance-hall.webp",
    "width": 1672,
    "height": 941,
    "alt": "Entrance Hall — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            5.8,
            63
          ],
          [
            19.2,
            61.2
          ],
          [
            19,
            54.3
          ],
          [
            6.2,
            54.8
          ]
        ],
        "point": [
          12.4,
          59.4
        ],
        "kind": "door",
        "label": "Follow the doorway to Hogwarts",
        "evidence": "Actual open left doorway; click polygon is exposed paving at threshold, excluding both wood leaves."
      },
      "e": {
        "polygon": [
          [
            32.6,
            60.9
          ],
          [
            37.5,
            60.9
          ],
          [
            42.4,
            62.2
          ],
          [
            43,
            63.5
          ],
          [
            32.6,
            63.5
          ]
        ],
        "point": [
          36,
          62.4
        ],
        "kind": "stair",
        "label": "Follow the stairs to Basement Passage",
        "evidence": "Center-left stair mouth descends below floor with lit corridor below and side rails; polygon follows top tread and lip."
      },
      "n": {
        "polygon": [
          [
            55.9,
            62.2
          ],
          [
            66.1,
            62.2
          ],
          [
            66.1,
            52
          ],
          [
            62.5,
            51.2
          ],
          [
            59,
            52.4
          ],
          [
            55.9,
            55
          ]
        ],
        "point": [
          60.8,
          59.4
        ],
        "kind": "door",
        "label": "Follow the doorway to The Great Hall",
        "evidence": "Central-right open oak doors frame the continuous Great Hall aisle; mask is clear stone floor within doorway."
      },
      "w": {
        "polygon": [
          [
            77.8,
            63.2
          ],
          [
            98.6,
            63.2
          ],
          [
            96.5,
            55.6
          ],
          [
            95,
            48
          ],
          [
            93.1,
            40.4
          ],
          [
            92.8,
            34.8
          ],
          [
            92.9,
            28.5
          ],
          [
            87.2,
            31.7
          ],
          [
            86.8,
            36.4
          ],
          [
            84.1,
            44
          ],
          [
            81.9,
            50.2
          ],
          [
            79.3,
            57
          ]
        ],
        "point": [
          88.5,
          55.8
        ],
        "kind": "stair",
        "label": "Follow the stairs to Grand Staircase",
        "evidence": "Broad right staircase joins the room floor; shape follows stone treads inside rails."
      },
      "a": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Great Hall Antechamber",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "great": {
    "src": "/assets/images/hogwarts-cinematic/great-hall.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Great Hall — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            40.8,
            85
          ],
          [
            64.3,
            85
          ],
          [
            71,
            99
          ],
          [
            29.3,
            99
          ]
        ],
        "point": [
          51.5,
          94.5
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Entrance Hall",
        "evidence": "Wide unobstructed central stone aisle reaches bottom edge between the benches.",
        "turnBack": true
      }
    },
    "ceremony": {
      "polygon": [
        [
          43.3,
          68.7
        ],
        [
          60.2,
          68.7
        ],
        [
          60.7,
          72.2
        ],
        [
          42.8,
          72.2
        ]
      ],
      "point": [
        51.6,
        70.6
      ],
      "kind": "activity",
      "label": "Walk to the clear dais steps to attend the Sorting Ceremony",
      "evidence": "Unobstructed stair treads in front of the staff dais; no table or hat is a geographic exit."
    }
  },
  "kitchens": {
    "src": "/assets/images/hogwarts-cinematic/castle-kitchens.webp",
    "width": 1672,
    "height": 941,
    "alt": "Castle Kitchens — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            16.4,
            37.6
          ],
          [
            18.1,
            37.9
          ],
          [
            20.4,
            34.1
          ],
          [
            23.1,
            30.6
          ],
          [
            20.7,
            30.4
          ],
          [
            17.2,
            33
          ]
        ],
        "point": [
          19.3,
          33.7
        ],
        "kind": "stair",
        "label": "Follow the stairs to Copper Pantry",
        "evidence": "Stone treads climb at rear left beyond the kitchen work area; continuous left aisle leads toward them."
      },
      "w": {
        "polygon": [
          [
            27.9,
            81.6
          ],
          [
            32.6,
            82
          ],
          [
            32.7,
            89.5
          ],
          [
            34.2,
            94.5
          ],
          [
            34.2,
            99.5
          ],
          [
            32.7,
            99.5
          ],
          [
            32,
            94.5
          ],
          [
            30,
            89.2
          ]
        ],
        "point": [
          32.5,
          88
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Basement Passage",
        "evidence": "A narrow gap between foreground food tables remains stone floor all the way to the bottom edge.",
        "turnBack": true
      },
      "e": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Hufflepuff Common Room",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "pantry": {
    "src": "/assets/images/hogwarts-cinematic-v3/copper-pantry.webp",
    "width": 1672,
    "height": 941,
    "alt": "Copper Pantry — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            55.5,
            55.8
          ],
          [
            63.2,
            55.8
          ],
          [
            62.7,
            53.7
          ],
          [
            61.8,
            53.3
          ],
          [
            61.8,
            28.4
          ],
          [
            59.3,
            26.9
          ],
          [
            56.1,
            28.9
          ],
          [
            56,
            53.7
          ]
        ],
        "point": [
          59.4,
          54.7
        ],
        "kind": "door",
        "label": "Follow the doorway to Castle Kitchens",
        "evidence": "Open rear door has an unobstructed stone threshold and three visible steps; exclude shelving/pots around its frame."
      }
    }
  },
  "gallery": {
    "src": "/assets/images/hogwarts-cinematic/portrait-gallery.webp",
    "width": 1672,
    "height": 941,
    "alt": "Fourth-floor Portrait Corridor — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            62.2,
            75.2
          ],
          [
            66.3,
            75.2
          ],
          [
            66.3,
            72.9
          ],
          [
            64.2,
            72.9
          ],
          [
            64.1,
            69.8
          ],
          [
            62.8,
            69.8
          ]
        ],
        "point": [
          64.6,
          74.3
        ],
        "kind": "stair",
        "label": "Follow the stairs to Hogwarts Library",
        "evidence": "Lowest stone treads visible at the end of the rug lead into the rising rear staircase."
      },
      "s": {
        "polygon": [
          [
            46.4,
            86
          ],
          [
            67.7,
            86
          ],
          [
            72.3,
            99
          ],
          [
            35.5,
            99
          ]
        ],
        "point": [
          55.1,
          94.5
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Middle Landings",
        "evidence": "Unblocked carpeted aisle reaches bottom edge.",
        "turnBack": true
      },
      "e": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Gryffindor Common Room",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the curtain",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Mirror of Erised Chamber",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/gallery-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Fourth-floor Portrait Corridor with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "armoury": {
    "src": "/assets/images/hogwarts-cinematic/armoury.webp",
    "width": 1672,
    "height": 941,
    "alt": "Third-floor Armour Gallery — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            35,
            88
          ],
          [
            73,
            88
          ],
          [
            84,
            99
          ],
          [
            24,
            99
          ]
        ],
        "point": [
          55,
          95
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Middle Landings",
        "evidence": "Central aisle is clear between the raised armour plinths and reaches bottom edge.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Trophy Gallery",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the suit of armour",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Forgotten Armoury",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/armoury-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Third-floor Armour Gallery with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "cloister": {
    "src": "/assets/images/hogwarts-cinematic-v4/east-cloister.webp",
    "width": 1672,
    "height": 941,
    "alt": "East Cloister — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            22,
            68
          ],
          [
            40.8,
            68
          ],
          [
            41.2,
            60
          ],
          [
            38.2,
            60
          ],
          [
            33.7,
            62.5
          ],
          [
            25.3,
            63.6
          ]
        ],
        "point": [
          31.8,
          66.3
        ],
        "kind": "arch",
        "label": "Follow the open arch to South Courtyard",
        "evidence": "Left arch is open to floor, with continuous paved courtyard path; no sill or rail."
      },
      "e": {
        "polygon": [
          [
            60.4,
            69
          ],
          [
            82.4,
            69
          ],
          [
            77,
            58.2
          ],
          [
            67,
            58.2
          ]
        ],
        "point": [
          72.5,
          65.8
        ],
        "kind": "path",
        "label": "Follow the path to Glasshouse Passage",
        "evidence": "Right vaulted corridor has broad continuous paving toward visible glasshouse."
      }
    }
  },
  "hospital": {
    "src": "/assets/images/hogwarts-cinematic/hospital-wing.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hospital Wing — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            49,
            87
          ],
          [
            88,
            87
          ],
          [
            93,
            99
          ],
          [
            41,
            99
          ]
        ],
        "point": [
          69,
          94
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Teaching Corridor",
        "evidence": "Wide clear stone floor between beds reaches the bottom; wardrobe/window terminate the far end.",
        "turnBack": true
      }
    }
  },
  "transfig": {
    "src": "/assets/images/hogwarts-cinematic-v4/transfiguration-classroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Transfiguration — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            27.3,
            56.7
          ],
          [
            37.5,
            56.7
          ],
          [
            37.5,
            21.4
          ],
          [
            36.6,
            18
          ],
          [
            34.5,
            14.3
          ],
          [
            32.4,
            11
          ],
          [
            30.5,
            14.4
          ],
          [
            28.7,
            18.2
          ],
          [
            27.3,
            22.4
          ]
        ],
        "point": [
          32.1,
          54.3
        ],
        "kind": "door",
        "label": "Follow the doorway to Teaching Corridor",
        "evidence": "Open wooden doorway exposes corridor; empty wide classroom aisle reaches it. Door leaf to left and stone frame are excluded."
      }
    }
  },
  "baths": {
    "src": "/assets/images/hogwarts-cinematic-v4/second-floor-corridor.webp",
    "width": 1672,
    "height": 941,
    "alt": "Second-floor Bathroom Corridor — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            17.1,
            68.4
          ],
          [
            38.5,
            68.4
          ],
          [
            38.5,
            65.2
          ],
          [
            17.5,
            65.2
          ]
        ],
        "point": [
          28,
          66.8
        ],
        "kind": "stair",
        "label": "Follow the stairs to Middle Landings",
        "evidence": "Visible top stone treads at left descending stair mouth, with side rails only and no obstruction."
      },
      "n": {
        "polygon": [
          [
            72.8,
            69.8
          ],
          [
            81.9,
            70.3
          ],
          [
            81.9,
            60
          ],
          [
            80.6,
            57.6
          ],
          [
            72.9,
            57.5
          ]
        ],
        "point": [
          77.5,
          65.3
        ],
        "kind": "door",
        "label": "Follow the doorway to Myrtle's Bathroom",
        "evidence": "Right wood leaf is swung open; exposed bathroom threshold floor connects directly to corridor. Sink and leaf excluded."
      },
      "e": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Prefects' Bathroom",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the weathered statue",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to One-Eyed Witch Tunnel",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/baths-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Second-floor Bathroom Corridor with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "bathroom": {
    "src": "/assets/images/hogwarts-cinematic-v4/myrtles-bathroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Myrtle's Bathroom — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            9.1,
            53.8
          ],
          [
            9.1,
            24
          ],
          [
            10.2,
            18
          ],
          [
            12.7,
            12.1
          ],
          [
            14.4,
            15.8
          ],
          [
            16.3,
            22.5
          ],
          [
            16.3,
            53.4
          ]
        ],
        "point": [
          12.3,
          49.2
        ],
        "kind": "door",
        "label": "Follow the doorway to Second-floor Bathroom Corridor",
        "evidence": "Open ordinary door at left; clear stone threshold and connected corridor floor."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            68.9,
            41.8
          ],
          [
            69.3,
            41
          ],
          [
            69.5,
            40.4
          ],
          [
            70.3,
            39.6
          ],
          [
            70.6,
            38.7
          ],
          [
            70,
            38.2
          ],
          [
            70.2,
            37.4
          ],
          [
            71.6,
            37.4
          ],
          [
            72.1,
            38.1
          ],
          [
            71.7,
            39
          ],
          [
            71.6,
            41.2
          ],
          [
            72,
            43.6
          ],
          [
            70.1,
            44
          ],
          [
            69.9,
            42.8
          ],
          [
            70.1,
            41.5
          ]
        ],
        "point": [
          70.9,
          41.8
        ],
        "kind": "inspect",
        "label": "Whisper to the serpent tap to reveal the entrance",
        "evidence": "Small brass foreground tap has a low-contrast curled engraved motif. Tap activation changes the local scene state only; no travel from the object."
      },
      "open": {
        "polygon": [
          [
            46.5,
            72.2
          ],
          [
            47.4,
            70.8
          ],
          [
            49.5,
            69
          ],
          [
            53,
            67.4
          ],
          [
            57,
            66.7
          ],
          [
            61.6,
            66.9
          ],
          [
            65.7,
            67.9
          ],
          [
            69.5,
            69.7
          ],
          [
            72,
            72
          ],
          [
            73.2,
            74.2
          ],
          [
            71.9,
            76.5
          ],
          [
            69.4,
            78.4
          ],
          [
            65,
            79.9
          ],
          [
            60.3,
            80.6
          ],
          [
            56,
            80.1
          ],
          [
            51.6,
            78.6
          ],
          [
            48.4,
            76.4
          ],
          [
            46.8,
            74.7
          ]
        ],
        "point": [
          60,
          75
        ],
        "kind": "hatch",
        "label": "Through the open hatch to Serpent's Descent",
        "evidence": "Nearest basin moved aside, exposing an actual open circular shaft in the floor. Polygon follows the inner mouth, excluding rim and the displaced basin.",
        "src": "/assets/images/hogwarts-cinematic-v4/myrtles-bathroom-open.webp",
        "width": 1672,
        "height": 941,
        "alt": "Myrtle's bathroom with the basin moved aside and a large open pipe visible in the floor"
      },
      "note": "The basin moves aside and an open pipe appears. Click the actual opening to enter; the room has not changed yet."
    }
  },
  "history": {
    "src": "/assets/images/hogwarts-cinematic/history-of-magic.webp",
    "width": 1672,
    "height": 941,
    "alt": "History of Magic — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            40.3,
            55.8
          ],
          [
            41.8,
            55.8
          ],
          [
            41.8,
            58
          ],
          [
            39.8,
            58
          ],
          [
            39.8,
            56.9
          ]
        ],
        "point": [
          40.8,
          56.8
        ],
        "kind": "door",
        "label": "Follow the doorway to Teaching Corridor",
        "evidence": "Enlarged individual crop shows an arched opening with a wood leaf on its left and shelves beyond/right; a small unblocked stone threshold sits between the steps and teacher's podium."
      }
    }
  },
  "staircase": {
    "src": "/assets/images/hogwarts-cinematic-v4/grand-staircase.webp",
    "width": 1672,
    "height": 941,
    "alt": "Grand Staircase — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            6.5,
            73.3
          ],
          [
            30.7,
            70.4
          ],
          [
            30.7,
            72
          ],
          [
            6.6,
            75
          ]
        ],
        "point": [
          18.4,
          72.7
        ],
        "kind": "stair",
        "label": "Follow the stairs to Teaching Corridor",
        "evidence": "Clear stone lip and immediate floor approach at the mouth of left descending staircase. First lower treads fall below the viewing edge; do not target the distant wall or window visible through the stairwell."
      },
      "n": {
        "polygon": [
          [
            42,
            64.3
          ],
          [
            61.8,
            64.3
          ],
          [
            60.2,
            55
          ],
          [
            58.8,
            47
          ],
          [
            57.2,
            34.4
          ],
          [
            47.1,
            34.4
          ],
          [
            45.8,
            45
          ],
          [
            44.5,
            53.3
          ]
        ],
        "point": [
          52,
          57.5
        ],
        "kind": "stair",
        "label": "Follow the stairs to Middle Landings",
        "evidence": "Full central stair surface starts directly on current landing and rises through an arch."
      },
      "e": {
        "polygon": [
          [
            74.2,
            65.5
          ],
          [
            93.8,
            68.7
          ],
          [
            94.3,
            52.1
          ],
          [
            91.8,
            44
          ],
          [
            87.9,
            36
          ],
          [
            84.1,
            33.4
          ],
          [
            84.1,
            40.5
          ],
          [
            81.9,
            47.3
          ],
          [
            79.4,
            54.5
          ],
          [
            76.8,
            60
          ]
        ],
        "point": [
          85.4,
          59.8
        ],
        "kind": "stair",
        "label": "Follow the stairs to Seventh-floor Corridor",
        "evidence": "Right curved stair joins the same landing; mask follows tread surfaces inside stone rails."
      },
      "s": {
        "polygon": [
          [
            35,
            88
          ],
          [
            65,
            88
          ],
          [
            73,
            99
          ],
          [
            25,
            99
          ]
        ],
        "point": [
          50,
          95
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Entrance Hall",
        "evidence": "Unblocked foreground landing leaves the bottom edge.",
        "turnBack": true
      }
    }
  },
  "corridor": {
    "src": "/assets/images/hogwarts-cinematic-v4/seventh-floor-corridor.webp",
    "width": 1672,
    "height": 941,
    "alt": "Seventh-floor Corridor — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            3,
            83
          ],
          [
            15,
            80
          ],
          [
            15,
            57
          ],
          [
            11,
            48
          ],
          [
            5,
            51
          ]
        ],
        "point": [
          8,
          76
        ],
        "kind": "stair",
        "label": "Descend to main staircase",
        "evidence": "Visually inspected opening on the scene image."
      },
      "w": {
        "polygon": [
          [
            46,
            61
          ],
          [
            50,
            61
          ],
          [
            49.5,
            26
          ],
          [
            47.3,
            23
          ],
          [
            46,
            31
          ]
        ],
        "point": [
          48,
          54
        ],
        "kind": "stair",
        "label": "Gargoyle and spiral stair",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            58.5,
            57.5
          ],
          [
            63.4,
            57.5
          ],
          [
            63,
            33
          ],
          [
            60.7,
            29
          ],
          [
            58.5,
            34
          ]
        ],
        "point": [
          60.6,
          50
        ],
        "kind": "stair",
        "label": "Ascend toward North Tower",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            66.4,
            60
          ],
          [
            74.5,
            60
          ],
          [
            74.5,
            35
          ],
          [
            70.7,
            28
          ],
          [
            66.5,
            36
          ]
        ],
        "point": [
          70.7,
          53
        ],
        "kind": "arch",
        "label": "Continue onto battlements",
        "evidence": "Visually inspected opening on the scene image."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            86.4,
            20
          ],
          [
            96.7,
            20
          ],
          [
            96.7,
            85
          ],
          [
            86.4,
            83
          ]
        ],
        "point": [
          91.6,
          56
        ],
        "kind": "inspect",
        "label": "Pace three times beside the blank wall opposite the tapestry",
        "evidence": "Visually inspected opening on the scene image."
      },
      "open": {
        "polygon": [
          [
            91.7,
            20
          ],
          [
            94.1,
            19
          ],
          [
            94.1,
            84.8
          ],
          [
            92,
            81
          ]
        ],
        "point": [
          93,
          64
        ],
        "kind": "door",
        "label": "Follow the doorway to Room of Requirement",
        "evidence": "Visually inspected opening on the scene image.",
        "src": "/assets/images/hogwarts-cinematic-v4/seventh-floor-corridor-open.webp",
        "width": 1672,
        "height": 941,
        "alt": "Seventh-floor corridor with an open wooden doorway revealed in the wall opposite the tapestry"
      },
      "note": "After three passes with a need in mind, a door appears opposite the tapestry. Click the opening to enter the Room of Requirement."
    }
  },
  "library": {
    "src": "/assets/images/hogwarts-cinematic/library.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hogwarts Library — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            86.8,
            77.5
          ],
          [
            91.2,
            77.5
          ],
          [
            91.2,
            60.9
          ],
          [
            89.8,
            61.2
          ],
          [
            88,
            67.8
          ],
          [
            86.8,
            69.8
          ]
        ],
        "point": [
          89,
          75.3
        ],
        "kind": "arch",
        "label": "Follow the open arch to Fourth-floor Portrait Corridor",
        "evidence": "Open right half of the tall gate exposes a floor threshold and stairwell beyond; gate leaf occupies its left half."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the screened shelves",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Library Restricted Section",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/library-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Hogwarts Library with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "charms": {
    "src": "/assets/images/hogwarts-cinematic-v4/charms-classroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Charms — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            25.6,
            52.7
          ],
          [
            33.9,
            52.7
          ],
          [
            33.9,
            28.5
          ],
          [
            33,
            23.6
          ],
          [
            31.6,
            20.3
          ],
          [
            29.8,
            17.7
          ],
          [
            28,
            20.7
          ],
          [
            26.7,
            24.6
          ],
          [
            25.6,
            29.3
          ]
        ],
        "point": [
          29.5,
          51.3
        ],
        "kind": "door",
        "label": "Follow the doorway to Middle Landings",
        "evidence": "One clear open left-center door, with no students/desks in the foreground aisle or threshold."
      }
    }
  },
  "defense": {
    "src": "/assets/images/hogwarts-cinematic/defence-against-dark-arts.webp",
    "width": 1672,
    "height": 941,
    "alt": "Defence Against the Dark Arts — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            75,
            84.8
          ],
          [
            84.9,
            84.8
          ],
          [
            87.6,
            92.9
          ],
          [
            92.4,
            99
          ],
          [
            74,
            99
          ],
          [
            74,
            91.2
          ]
        ],
        "point": [
          81.1,
          94
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Teaching Corridor",
        "evidence": "Clear stone aisle runs down right side between desks and exits the bottom edge.",
        "turnBack": true
      }
    }
  },
  "office": {
    "src": "/assets/images/hogwarts-cinematic-v3/headmasters-office.webp",
    "width": 1672,
    "height": 940,
    "alt": "Headmaster's Office — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            28,
            90
          ],
          [
            73,
            90
          ],
          [
            81,
            99
          ],
          [
            18,
            99
          ]
        ],
        "point": [
          50,
          95
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Seventh-floor Corridor",
        "evidence": "Clear polished foreground floor reaches the bottom beyond the edge of the large rug.",
        "turnBack": true
      }
    }
  },
  "astrStair": {
    "src": "/assets/images/hogwarts-cinematic-v3/spiral-ascent.webp",
    "width": 1672,
    "height": 941,
    "alt": "Spiral Ascent — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            68,
            34.2
          ],
          [
            74.1,
            35.7
          ],
          [
            78.5,
            40.2
          ],
          [
            83.6,
            48.7
          ],
          [
            88.4,
            60.2
          ],
          [
            93.2,
            76.2
          ],
          [
            97.1,
            96.5
          ],
          [
            65.1,
            96.5
          ],
          [
            64,
            89.2
          ],
          [
            66.6,
            77
          ],
          [
            67.5,
            66.2
          ],
          [
            67.4,
            51.9
          ],
          [
            67.4,
            43.5
          ]
        ],
        "point": [
          79.9,
          68
        ],
        "kind": "stair",
        "label": "Follow the stairs to Astronomy Tower",
        "evidence": "Wide stone spiral climbs directly from foreground; polygon follows treads and avoids both balustrades."
      },
      "s": {
        "polygon": [
          [
            20.3,
            78.5
          ],
          [
            47,
            79.1
          ],
          [
            46.7,
            81.8
          ],
          [
            20.5,
            81
          ]
        ],
        "point": [
          34,
          79.9
        ],
        "kind": "stair",
        "label": "Follow the stairs to North Battlements",
        "evidence": "Left-side balustrades descend away from landing; top stair lip and open down-flight are visible."
      }
    }
  },
  "astrTower": {
    "src": "/assets/images/hogwarts-cinematic/astronomy-tower.webp",
    "width": 1672,
    "height": 941,
    "alt": "Astronomy Tower — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            29,
            88
          ],
          [
            72,
            88
          ],
          [
            78,
            99
          ],
          [
            17,
            99
          ]
        ],
        "point": [
          50,
          95
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Spiral Ascent",
        "evidence": "Clear tiled floor reaches bottom edge; all outward arches terminate at balcony balustrades.",
        "turnBack": true
      }
    }
  },
  "divination": {
    "src": "/assets/images/hogwarts-cinematic-v4/divination-classroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Divination — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            16.4,
            66.4
          ],
          [
            17.6,
            62.5
          ],
          [
            20.4,
            59.6
          ],
          [
            24.9,
            57.2
          ],
          [
            29.7,
            56
          ],
          [
            34.5,
            55.3
          ],
          [
            39.7,
            56.6
          ],
          [
            44.2,
            59
          ],
          [
            48.5,
            62.4
          ],
          [
            50.6,
            65.8
          ],
          [
            49.8,
            69.3
          ],
          [
            47.6,
            73.1
          ],
          [
            43.9,
            76.4
          ],
          [
            39.5,
            79
          ],
          [
            34.4,
            80.3
          ],
          [
            29.2,
            80
          ],
          [
            24.5,
            78.4
          ],
          [
            20.4,
            75.7
          ],
          [
            17.5,
            72
          ],
          [
            16.1,
            69.2
          ]
        ],
        "point": [
          32.5,
          71.7
        ],
        "kind": "hatch",
        "label": "Through the open hatch to North Tower Landing",
        "evidence": "The floor opening and raised timber lid are circular, seen in perspective. A silver metal ladder descends through the open human-sized shaft to the lower stone landing. Polygon traces the inner mouth and excludes the raised lid and outer rim."
      }
    }
  },
  "owlery": {
    "src": "/assets/images/hogwarts-cinematic-v3/owlery.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Owlery — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            9.5,
            80.6
          ],
          [
            18.2,
            78.7
          ],
          [
            18.2,
            73.4
          ],
          [
            11.4,
            73.4
          ],
          [
            10.1,
            74.8
          ]
        ],
        "point": [
          13.7,
          77
        ],
        "kind": "door",
        "label": "Follow the doorway to North Battlements",
        "evidence": "Door leaf swings left; a continuous stone path passes through the doorway before turning along parapet. Lower threshold is safe."
      },
      "n": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Owl Delivery Ledge",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "ramparts": {
    "src": "/assets/images/hogwarts-cinematic-v3/north-battlements.webp",
    "width": 1672,
    "height": 941,
    "alt": "North Battlements — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            5.3,
            66.8
          ],
          [
            7.9,
            66.8
          ],
          [
            7.9,
            61.3
          ],
          [
            7.1,
            59
          ],
          [
            7.1,
            38.7
          ],
          [
            5.4,
            37.7
          ]
        ],
        "point": [
          6.4,
          63.9
        ],
        "kind": "door",
        "label": "Follow the doorway to The Owlery",
        "evidence": "Narrow warm-lit gap left of the open wood leaf exposes continuous threshold floor; avoid stone arch and door leaf."
      },
      "e": {
        "polygon": [
          [
            93.2,
            62.7
          ],
          [
            96.8,
            62.7
          ],
          [
            96.8,
            50.4
          ],
          [
            95.8,
            47.2
          ],
          [
            94.7,
            46.7
          ],
          [
            93.2,
            50
          ]
        ],
        "point": [
          95,
          60.5
        ],
        "kind": "arch",
        "label": "Follow the open arch to Spiral Ascent",
        "evidence": "Unblocked right arch contains continuous stone parapet walkway."
      },
      "s": {
        "polygon": [
          [
            27.1,
            92.5
          ],
          [
            56.7,
            94.2
          ],
          [
            67.9,
            99
          ],
          [
            18.7,
            99
          ]
        ],
        "point": [
          43,
          96.8
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Seventh-floor Corridor",
        "evidence": "Foreground paving connects both tower approaches and extends out bottom edge.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Clock Tower",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      },
      "a": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Ravenclaw Common Room",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "dungeonSteps": {
    "src": "/assets/images/hogwarts-cinematic-v3/dungeon-stairwell.webp",
    "width": 1672,
    "height": 941,
    "alt": "Dungeon Stairwell — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            12,
            39
          ],
          [
            24.1,
            39
          ],
          [
            24.1,
            34
          ],
          [
            25.8,
            29
          ],
          [
            30,
            25
          ],
          [
            31.7,
            22
          ],
          [
            29.5,
            23
          ],
          [
            23,
            27
          ],
          [
            18,
            32
          ]
        ],
        "point": [
          22,
          34
        ],
        "kind": "stair",
        "label": "Follow the stairs to Basement Passage",
        "evidence": "Visually inspected opening on the scene image."
      },
      "s": {
        "polygon": [
          [
            65,
            81
          ],
          [
            76,
            81
          ],
          [
            91,
            86
          ],
          [
            98,
            94
          ],
          [
            64,
            94
          ],
          [
            57,
            87
          ]
        ],
        "point": [
          80,
          87
        ],
        "kind": "stair",
        "label": "Follow the stairs to Green Lantern Passage",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "potions": {
    "src": "/assets/images/hogwarts-cinematic/potions.webp",
    "width": 1672,
    "height": 941,
    "alt": "Potions — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            66.8,
            59.5
          ],
          [
            67.5,
            56.5
          ],
          [
            69.9,
            51.2
          ],
          [
            71.2,
            49.5
          ],
          [
            71.4,
            35.5
          ],
          [
            73,
            31.4
          ],
          [
            74.5,
            29.4
          ],
          [
            76.4,
            32.3
          ],
          [
            77.3,
            36
          ],
          [
            77.3,
            49.8
          ],
          [
            75.9,
            53.7
          ],
          [
            75,
            59.5
          ]
        ],
        "point": [
          72.5,
          54
        ],
        "kind": "stair",
        "label": "Follow the stairs to Green Lantern Passage",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "oldArchive": {
    "src": "/assets/images/hogwarts-cinematic-v3/forgotten-archive.webp",
    "width": 1672,
    "height": 941,
    "alt": "Archive Passage — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            37,
            89
          ],
          [
            66,
            89
          ],
          [
            72,
            100
          ],
          [
            31,
            100
          ]
        ],
        "point": [
          51,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Green Lantern Passage",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "w": {
        "polygon": [
          [
            20.4,
            56.8
          ],
          [
            20.4,
            31
          ],
          [
            21.3,
            26
          ],
          [
            23,
            21.5
          ],
          [
            24.9,
            26.7
          ],
          [
            26.3,
            34
          ],
          [
            26.3,
            57.6
          ],
          [
            23.2,
            58.6
          ]
        ],
        "point": [
          23.3,
          47
        ],
        "kind": "arch",
        "label": "Follow the open arch to Forgotten Crypt",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            74.8,
            69
          ],
          [
            74.8,
            38
          ],
          [
            76.6,
            31
          ],
          [
            80,
            24
          ],
          [
            82,
            29
          ],
          [
            83.2,
            35
          ],
          [
            83.2,
            57
          ],
          [
            82,
            64
          ],
          [
            82,
            70
          ]
        ],
        "point": [
          79.2,
          56
        ],
        "kind": "arch",
        "label": "Follow the open arch to Old Storeroom",
        "evidence": "Visually inspected opening on the scene image."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the old floorboards",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "hatch",
        "label": "Enter the revealed passage to Trapdoor Chamber",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/oldArchive-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Archive Passage with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "crypt": {
    "src": "/assets/images/hogwarts-cinematic-v3/forgotten-crypt.webp",
    "width": 1672,
    "height": 940,
    "alt": "Forgotten Crypt — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            4.3,
            58.5
          ],
          [
            4.4,
            35.5
          ],
          [
            6.4,
            25.2
          ],
          [
            8.4,
            18
          ],
          [
            11,
            27
          ],
          [
            12.3,
            36
          ],
          [
            12.3,
            56
          ],
          [
            11.8,
            72
          ],
          [
            4.2,
            75
          ]
        ],
        "point": [
          8.7,
          53
        ],
        "kind": "arch",
        "label": "Follow the open arch to Archive Passage",
        "evidence": "Visually inspected opening on the scene image."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the whispered inscription",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Whispering Crypt",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/crypt-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Forgotten Crypt with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "slytherin": {
    "src": "/assets/images/hogwarts-cinematic-v3/green-lantern-passage.webp",
    "width": 1672,
    "height": 941,
    "alt": "Green Lantern Passage — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            35,
            91
          ],
          [
            65,
            91
          ],
          [
            75,
            100
          ],
          [
            24,
            100
          ]
        ],
        "point": [
          50,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Dungeon Stairwell",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "w": {
        "polygon": [
          [
            9.6,
            68
          ],
          [
            18.5,
            65
          ],
          [
            18.4,
            71
          ],
          [
            23,
            76
          ],
          [
            13.4,
            82
          ],
          [
            10.5,
            83
          ]
        ],
        "point": [
          14,
          73
        ],
        "kind": "arch",
        "label": "Follow the open arch to Potions",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            48.4,
            61.7
          ],
          [
            51.2,
            61
          ],
          [
            55,
            64.6
          ],
          [
            63,
            70
          ],
          [
            69,
            74
          ],
          [
            60,
            83
          ],
          [
            42,
            83
          ],
          [
            47,
            73
          ],
          [
            49,
            67
          ]
        ],
        "point": [
          54.5,
          72
        ],
        "kind": "path",
        "label": "Follow the path to Archive Passage",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            82.8,
            67.7
          ],
          [
            87.9,
            68.1
          ],
          [
            90.1,
            70
          ],
          [
            90.5,
            79
          ],
          [
            83,
            75.5
          ]
        ],
        "point": [
          86.7,
          72.5
        ],
        "kind": "arch",
        "label": "Follow the open arch to Underground Reservoir",
        "evidence": "Visually inspected opening on the scene image."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the serpent carving",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            27.9,
            71.7
          ],
          [
            36.1,
            71.7
          ],
          [
            36.1,
            82.3
          ],
          [
            27.9,
            82.3
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Serpent Door",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/slytherin-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Green Lantern Passage with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "reservoir": {
    "src": "/assets/images/hogwarts-cinematic-v3/underground-reservoir.webp",
    "width": 1672,
    "height": 941,
    "alt": "Underground Reservoir — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            59.7,
            91
          ],
          [
            78.8,
            91
          ],
          [
            80.8,
            100
          ],
          [
            56,
            100
          ]
        ],
        "point": [
          68.5,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Green Lantern Passage",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      }
    }
  },
  "vault": {
    "src": "/assets/images/hogwarts-cinematic-v3/old-storeroom.webp",
    "width": 1672,
    "height": 941,
    "alt": "Old Storeroom — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            69.1,
            65
          ],
          [
            69.1,
            28.7
          ],
          [
            70.8,
            26
          ],
          [
            73.5,
            25.1
          ],
          [
            75.8,
            26
          ],
          [
            78,
            28
          ],
          [
            78,
            59.4
          ],
          [
            77.7,
            65
          ]
        ],
        "point": [
          73.8,
          47
        ],
        "kind": "door",
        "label": "Follow the doorway to Archive Passage",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "courtyard": {
    "src": "/assets/images/hogwarts-cinematic-v3/south-courtyard.webp",
    "width": 1672,
    "height": 941,
    "alt": "South Courtyard — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            7.3,
            61.4
          ],
          [
            7.3,
            38
          ],
          [
            8.8,
            35
          ],
          [
            11.5,
            32
          ],
          [
            14.4,
            35
          ],
          [
            16.2,
            40
          ],
          [
            16.2,
            61.5
          ],
          [
            12,
            63
          ]
        ],
        "point": [
          11.8,
          50
        ],
        "kind": "arch",
        "label": "Follow the open arch to The Lantern Path",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            50.1,
            50.8
          ],
          [
            50.1,
            46.5
          ],
          [
            51.3,
            43.5
          ],
          [
            53,
            41.4
          ],
          [
            54.8,
            43.8
          ],
          [
            55.8,
            47
          ],
          [
            55.8,
            50.9
          ],
          [
            54.3,
            50.9
          ],
          [
            54.3,
            50.2
          ],
          [
            53.4,
            50.2
          ],
          [
            53.4,
            51.3
          ],
          [
            52,
            52.1
          ],
          [
            50.1,
            54.8
          ]
        ],
        "point": [
          52.8,
          47.7
        ],
        "kind": "arch",
        "label": "Follow the open arch to East Cloister",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            91.1,
            62
          ],
          [
            91.1,
            43
          ],
          [
            92.4,
            38.4
          ],
          [
            94.7,
            35.6
          ],
          [
            96.8,
            37.8
          ],
          [
            98,
            43
          ],
          [
            98,
            62
          ]
        ],
        "point": [
          94.6,
          53
        ],
        "kind": "arch",
        "label": "Follow the open arch to Stone Viaduct",
        "evidence": "Visually inspected opening on the scene image."
      },
      "s": {
        "polygon": [
          [
            35,
            91
          ],
          [
            65,
            91
          ],
          [
            74,
            100
          ],
          [
            25,
            100
          ]
        ],
        "point": [
          50,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Quidditch Pitch",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "a": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Whomping Willow Roots",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "bridge": {
    "src": "/assets/images/hogwarts-cinematic-v3/stone-viaduct.webp",
    "width": 1672,
    "height": 941,
    "alt": "Stone Viaduct — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            5.6,
            44.7
          ],
          [
            5.6,
            36
          ],
          [
            6.8,
            31.4
          ],
          [
            8.3,
            28.7
          ],
          [
            10.7,
            32
          ],
          [
            12.4,
            36.9
          ],
          [
            12.4,
            45.2
          ],
          [
            10,
            46.9
          ]
        ],
        "point": [
          9.3,
          40
        ],
        "kind": "arch",
        "label": "Follow the open arch to South Courtyard",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            80,
            75.5
          ],
          [
            82.1,
            72.1
          ],
          [
            87.4,
            73.2
          ],
          [
            90.8,
            74.3
          ],
          [
            90.8,
            80.3
          ],
          [
            92.9,
            83.5
          ],
          [
            97,
            91.2
          ],
          [
            88.2,
            91.2
          ],
          [
            78.4,
            83.8
          ],
          [
            74.6,
            82.1
          ]
        ],
        "point": [
          85,
          79.4
        ],
        "kind": "stair",
        "label": "Follow the stairs to Black Lake",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            46.1,
            50.8
          ],
          [
            47,
            46.9
          ],
          [
            48.6,
            44.3
          ],
          [
            50,
            44.1
          ],
          [
            51.5,
            43.7
          ],
          [
            52.1,
            46.5
          ],
          [
            53,
            49.6
          ],
          [
            53.5,
            52.6
          ],
          [
            49.5,
            54.5
          ]
        ],
        "point": [
          50.3,
          48.5
        ],
        "kind": "path",
        "label": "Follow the path to Hagrid's Hut",
        "evidence": "Visually inspected opening on the scene image."
      },
      "s": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Covered Bridge",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "lake": {
    "src": "/assets/images/hogwarts-cinematic-v4/black-lake.webp",
    "width": 1672,
    "height": 941,
    "alt": "Black Lake — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            36,
            91
          ],
          [
            71,
            91
          ],
          [
            80,
            100
          ],
          [
            27,
            100
          ]
        ],
        "point": [
          52,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Stone Viaduct",
        "evidence": "Dry shore path extends through bottom edge; water is outside this polygon.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            18.2,
            45.2
          ],
          [
            19,
            42.4
          ],
          [
            23.7,
            42.4
          ],
          [
            25.7,
            44.1
          ],
          [
            23.9,
            47.7
          ],
          [
            19.4,
            47.3
          ]
        ],
        "point": [
          21.9,
          44.6
        ],
        "kind": "path",
        "label": "Follow the path to The Boathouse",
        "evidence": "Dry branch joins the boathouse's open timber threshold. Hit area stays on the path just at the door, away from furniture inside."
      },
      "s": {
        "polygon": [
          [
            73.2,
            60.2
          ],
          [
            77.4,
            57.7
          ],
          [
            88.1,
            60.5
          ],
          [
            86.3,
            64
          ],
          [
            77.4,
            63.2
          ],
          [
            70.7,
            61.4
          ]
        ],
        "point": [
          81,
          61.1
        ],
        "kind": "path",
        "label": "Follow the path to Old Pier",
        "evidence": "Wooden pier begins flush with dry shore and its connected planks are clear of rope."
      }
    }
  },
  "boathouse": {
    "src": "/assets/images/hogwarts-cinematic-v3/boathouse.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Boathouse — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            30,
            91
          ],
          [
            60,
            91
          ],
          [
            65,
            100
          ],
          [
            22,
            100
          ]
        ],
        "point": [
          44,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Black Lake",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Boathouse Launch",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "dock": {
    "src": "/assets/images/hogwarts-cinematic-v3/old-pier.webp",
    "width": 1672,
    "height": 941,
    "alt": "Old Pier — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            49.1,
            47.7
          ],
          [
            52.6,
            47.4
          ],
          [
            55.4,
            49.7
          ],
          [
            58.4,
            53
          ],
          [
            63.2,
            56.8
          ],
          [
            63.2,
            60.7
          ],
          [
            47.8,
            60.7
          ],
          [
            48.3,
            55.7
          ],
          [
            50.8,
            53.1
          ]
        ],
        "point": [
          54.8,
          55.6
        ],
        "kind": "path",
        "label": "Follow the path to Black Lake",
        "evidence": "Visually inspected opening on the scene image."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the moonlit reflection",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            11.9,
            71.7
          ],
          [
            20.1,
            71.7
          ],
          [
            20.1,
            82.3
          ],
          [
            11.9,
            82.3
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "hatch",
        "label": "Enter the revealed passage to Black Lake Shallows",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/dock-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Old Pier with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "forest": {
    "src": "/assets/images/hogwarts-cinematic/forbidden-forest.webp",
    "width": 1672,
    "height": 941,
    "alt": "Forbidden Forest — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            58,
            91
          ],
          [
            69.3,
            91
          ],
          [
            77,
            99.8
          ],
          [
            54,
            99.8
          ]
        ],
        "point": [
          64.3,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Hagrid's Hut",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            56.3,
            77.2
          ],
          [
            61,
            76
          ],
          [
            65.5,
            77.4
          ],
          [
            68.1,
            78.1
          ],
          [
            69.6,
            80.7
          ],
          [
            68.3,
            84
          ],
          [
            65,
            86.2
          ],
          [
            59.6,
            84
          ],
          [
            56,
            81.5
          ]
        ],
        "point": [
          62.7,
          81.1
        ],
        "kind": "path",
        "label": "Follow the path to Ancient Clearing",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Acromantula Den",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "clearing": {
    "src": "/assets/images/hogwarts-cinematic-v3/ancient-clearing.webp",
    "width": 1672,
    "height": 941,
    "alt": "Ancient Clearing — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            89,
            49.5
          ],
          [
            92.4,
            49.5
          ],
          [
            94,
            51.4
          ],
          [
            93.1,
            53.6
          ],
          [
            94.5,
            56.1
          ],
          [
            98.5,
            59.9
          ],
          [
            99.4,
            66.3
          ],
          [
            95.4,
            65.4
          ],
          [
            91.5,
            60.2
          ],
          [
            90.1,
            56.3
          ],
          [
            88,
            53.1
          ]
        ],
        "point": [
          93.6,
          57.7
        ],
        "kind": "path",
        "label": "Follow the path to Forbidden Forest",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "path",
        "label": "Explore the passage to Centaur Grove",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "hut": {
    "src": "/assets/images/hogwarts-cinematic-v4/hagrids-garden.webp",
    "width": 1672,
    "height": 941,
    "alt": "Hagrid's Hut — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            37,
            91
          ],
          [
            69,
            91
          ],
          [
            73,
            100
          ],
          [
            26,
            100
          ]
        ],
        "point": [
          49,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Stone Viaduct",
        "evidence": "Broad foreground dirt approach visibly runs out of the bottom edge.",
        "turnBack": true
      },
      "w": {
        "polygon": [
          [
            9.8,
            46.5
          ],
          [
            13.7,
            46.1
          ],
          [
            14.3,
            49
          ],
          [
            16.5,
            52.4
          ],
          [
            13.8,
            53.1
          ],
          [
            9.3,
            50.2
          ],
          [
            8.7,
            48
          ]
        ],
        "point": [
          12,
          49.6
        ],
        "kind": "path",
        "label": "Follow the path to Forbidden Forest",
        "evidence": "Separate dirt trail curves left through the trees. It visibly meets the shared foreground path."
      },
      "e": {
        "polygon": [
          [
            76.4,
            54.2
          ],
          [
            78.3,
            54.3
          ],
          [
            81.2,
            56.2
          ],
          [
            84.6,
            59
          ],
          [
            86.8,
            61.4
          ],
          [
            86.4,
            63.8
          ],
          [
            74.4,
            63.1
          ],
          [
            73.3,
            61.5
          ],
          [
            74.8,
            59.2
          ],
          [
            78.1,
            57.2
          ]
        ],
        "point": [
          80.8,
          60.1
        ],
        "kind": "path",
        "label": "Follow the path to Creature Paddock",
        "evidence": "Open gate leaf is swung right; a continuous dirt trail crosses the actual empty gap."
      }
    }
  },
  "paddock": {
    "src": "/assets/images/hogwarts-cinematic-v3/creature-paddock.webp",
    "width": 1672,
    "height": 941,
    "alt": "Creature Paddock — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            35,
            91
          ],
          [
            66,
            91
          ],
          [
            80,
            100
          ],
          [
            24,
            100
          ]
        ],
        "point": [
          50,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Hagrid's Hut",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "e": {
        "polygon": [
          [
            87.3,
            57.3
          ],
          [
            88.6,
            54.6
          ],
          [
            89.5,
            55.2
          ],
          [
            88.9,
            58.6
          ],
          [
            90.9,
            61
          ],
          [
            95.2,
            63.9
          ],
          [
            99.9,
            67
          ],
          [
            99.9,
            80.8
          ],
          [
            95.7,
            79.3
          ],
          [
            90.9,
            73.9
          ],
          [
            88.6,
            69.1
          ]
        ],
        "point": [
          94,
          69
        ],
        "kind": "path",
        "label": "Follow the path to Quidditch Pitch",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "quidditch": {
    "src": "/assets/images/hogwarts-cinematic-v4/quidditch-pitch.webp",
    "width": 1672,
    "height": 941,
    "alt": "Quidditch Pitch — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            37.1,
            68.4
          ],
          [
            37.1,
            55.3
          ],
          [
            38.2,
            51.7
          ],
          [
            40.1,
            50.3
          ],
          [
            42,
            51.9
          ],
          [
            43.9,
            55.2
          ],
          [
            43.9,
            68.4
          ]
        ],
        "point": [
          40.4,
          64.8
        ],
        "kind": "arch",
        "label": "Follow the open arch to South Courtyard",
        "evidence": "Distinct central arch reveals a continuous stone approach and stairs beyond."
      },
      "w": {
        "polygon": [
          [
            5.2,
            67.8
          ],
          [
            5.2,
            50.1
          ],
          [
            6.4,
            47.5
          ],
          [
            8.4,
            45.7
          ],
          [
            10.5,
            45.1
          ],
          [
            12.9,
            46.1
          ],
          [
            15,
            48.6
          ],
          [
            15.8,
            52.7
          ],
          [
            15.8,
            67.6
          ]
        ],
        "point": [
          10.5,
          66.5
        ],
        "kind": "arch",
        "label": "Follow the open arch to Creature Paddock",
        "evidence": "Left open timber tunnel has a dirt floor and a visible outgoing wooded path."
      },
      "s": {
        "polygon": [
          [
            82.2,
            71.4
          ],
          [
            82.2,
            53.6
          ],
          [
            83.3,
            50.6
          ],
          [
            86,
            48.4
          ],
          [
            89,
            47.7
          ],
          [
            92,
            48.4
          ],
          [
            94.4,
            50.6
          ],
          [
            94.4,
            71.8
          ]
        ],
        "point": [
          88,
          69.1
        ],
        "kind": "arch",
        "label": "Follow the open arch to Flying-lesson Lawn",
        "evidence": "Right timber gateway is fully open to the practice lawn and shares the foreground apron."
      },
      "e": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Quidditch Stands",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      },
      "a": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Quidditch Goal Hoops",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            43.9,
            71.7
          ],
          [
            52.1,
            71.7
          ],
          [
            52.1,
            82.3
          ],
          [
            43.9,
            82.3
          ]
        ],
        "point": [
          48,
          77
        ],
        "kind": "inspect",
        "label": "Inspect the moving banner",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            43.9,
            71.7
          ],
          [
            52.1,
            71.7
          ],
          [
            52.1,
            82.3
          ],
          [
            43.9,
            82.3
          ]
        ],
        "point": [
          48,
          77
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Quidditch Referee Tower",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/quidditch-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Quidditch Pitch with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "greenhouse": {
    "src": "/assets/images/hogwarts-cinematic-v3/glass-passage.webp",
    "width": 1672,
    "height": 941,
    "alt": "Glasshouse Passage — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            5.5,
            63
          ],
          [
            16.4,
            61.4
          ],
          [
            16.4,
            66.8
          ],
          [
            7.2,
            72
          ],
          [
            5.5,
            72.2
          ]
        ],
        "point": [
          11,
          66.9
        ],
        "kind": "arch",
        "label": "Follow the open arch to East Cloister",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            80.1,
            69.1
          ],
          [
            83.4,
            70.1
          ],
          [
            89.1,
            70.4
          ],
          [
            93.4,
            70.9
          ],
          [
            93.4,
            82.2
          ],
          [
            86,
            80.5
          ],
          [
            79.8,
            77.8
          ]
        ],
        "point": [
          86.5,
          75.6
        ],
        "kind": "door",
        "label": "Follow the doorway to Herbology",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Herbology Courtyard",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "herbology": {
    "src": "/assets/images/hogwarts-cinematic-v3/herbology-lesson.webp",
    "width": 1672,
    "height": 941,
    "alt": "Herbology — a cinematic view with visible passages",
    "exits": {
      "w": {
        "polygon": [
          [
            4.1,
            60.1
          ],
          [
            7.6,
            55.2
          ],
          [
            10.1,
            52.2
          ],
          [
            12.7,
            53.3
          ],
          [
            15.4,
            54.1
          ],
          [
            15.4,
            64.7
          ],
          [
            4.1,
            66
          ]
        ],
        "point": [
          10.9,
          60
        ],
        "kind": "door",
        "label": "Follow the doorway to Glasshouse Passage",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "flying": {
    "src": "/assets/images/hogwarts-cinematic-v3/flying-lesson.webp",
    "width": 1672,
    "height": 941,
    "alt": "Flying-lesson Lawn — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            46.8,
            70
          ],
          [
            56,
            69
          ],
          [
            67.7,
            69
          ],
          [
            67.3,
            77.8
          ],
          [
            64.6,
            79.8
          ],
          [
            53,
            78
          ],
          [
            45.8,
            76.9
          ]
        ],
        "point": [
          56.8,
          74.5
        ],
        "kind": "path",
        "label": "Follow the path to Quidditch Pitch",
        "evidence": "Visually inspected opening on the scene image."
      },
      "s": {
        "polygon": [
          [
            11.2,
            54.9
          ],
          [
            14.6,
            55
          ],
          [
            16.3,
            57
          ],
          [
            18.3,
            62
          ],
          [
            21.5,
            68.6
          ],
          [
            19.1,
            71.8
          ],
          [
            13,
            69.3
          ],
          [
            12.1,
            64.7
          ],
          [
            11.4,
            61.6
          ]
        ],
        "point": [
          15.4,
          62.7
        ],
        "kind": "path",
        "label": "Follow the path to The Lantern Path",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Flying Lesson Equipment Shed",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "sluice": {
    "src": "/assets/images/hogwarts-cinematic-v4/serpents-descent.webp",
    "width": 1672,
    "height": 941,
    "alt": "Serpent's Descent — a cinematic view with visible passages",
    "exits": {
      "n": {
        "polygon": [
          [
            71.5,
            53.6
          ],
          [
            74.8,
            51.8
          ],
          [
            80.8,
            52
          ],
          [
            82.8,
            54.4
          ],
          [
            83.3,
            61.9
          ],
          [
            70.8,
            61.9
          ],
          [
            70.8,
            58.4
          ]
        ],
        "point": [
          77.1,
          57.7
        ],
        "kind": "arch",
        "label": "Follow the open arch to Chamber of Secrets",
        "evidence": "Clear dry floor passes through the right serpent-framed arch; selected footprint excludes columns and water."
      },
      "s": {
        "polygon": [
          [
            13.4,
            56.6
          ],
          [
            11.9,
            49.5
          ],
          [
            11,
            40.4
          ],
          [
            11.6,
            30.4
          ],
          [
            14,
            21.9
          ],
          [
            18,
            15
          ],
          [
            22.6,
            10.9
          ],
          [
            27.7,
            10.4
          ],
          [
            32.8,
            13
          ],
          [
            37.3,
            19
          ],
          [
            40.9,
            27
          ],
          [
            43.2,
            36.4
          ],
          [
            43,
            46.5
          ],
          [
            40.4,
            54.7
          ],
          [
            36,
            60.3
          ],
          [
            30.8,
            62.6
          ],
          [
            25,
            63
          ],
          [
            18.9,
            61.1
          ]
        ],
        "point": [
          27,
          45
        ],
        "kind": "pipe",
        "label": "Rise through the pipe to Myrtle's Bathroom with magical assistance",
        "evidence": "Large circular pipe opening meets the dry platform. Smooth interior rises steeply toward warm gold light."
      }
    }
  },
  "chamber": {
    "src": "/assets/images/hogwarts-cinematic-v4/chamber-of-secrets.webp",
    "width": 1672,
    "height": 941,
    "alt": "Chamber of Secrets — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            35,
            91
          ],
          [
            65,
            91
          ],
          [
            76,
            100
          ],
          [
            24,
            100
          ]
        ],
        "point": [
          50,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Serpent's Descent",
        "evidence": "Continuous raised stone floor reaches the bottom of the image, safely above both water basins.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            43.4,
            60.2
          ],
          [
            43.8,
            56
          ],
          [
            44.4,
            53.2
          ],
          [
            55.6,
            53.2
          ],
          [
            56.2,
            56
          ],
          [
            56.8,
            60.2
          ]
        ],
        "point": [
          50,
          57.5
        ],
        "kind": "stair",
        "label": "Follow the stairs to The Chamber's Far End",
        "evidence": "Dry central causeway leads continuously to visible broad stairs below a bearded human statue."
      }
    }
  },
  "sanctum": {
    "src": "/assets/images/hogwarts-cinematic-v4/chamber-far-end.webp",
    "width": 1672,
    "height": 941,
    "alt": "The Chamber's Far End — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            14,
            99
          ],
          [
            87,
            99
          ],
          [
            71,
            83
          ],
          [
            35,
            83
          ]
        ],
        "point": [
          50,
          91
        ],
        "kind": "path",
        "label": "Turn back along the dry chamber aisle",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      }
    }
  },
  "requirement": {
    "src": "/assets/images/hogwarts-cinematic-v3/room-of-requirement.webp",
    "width": 1672,
    "height": 941,
    "alt": "Room of Requirement — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            39,
            91
          ],
          [
            69,
            91
          ],
          [
            76,
            100
          ],
          [
            29,
            100
          ]
        ],
        "point": [
          52,
          96
        ],
        "kind": "path",
        "label": "Turn back along the clear path to Seventh-floor Corridor",
        "evidence": "Visually inspected opening on the scene image.",
        "turnBack": true
      },
      "n": {
        "polygon": [
          [
            12.5,
            71.5
          ],
          [
            19.5,
            71.5
          ],
          [
            19.5,
            82.5
          ],
          [
            12.5,
            82.5
          ]
        ],
        "point": [
          16,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Room of Hidden Things",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      },
      "e": {
        "polygon": [
          [
            28.5,
            71.5
          ],
          [
            35.5,
            71.5
          ],
          [
            35.5,
            82.5
          ],
          [
            28.5,
            82.5
          ]
        ],
        "point": [
          32,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to D.A. Training Room",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      },
      "w": {
        "polygon": [
          [
            44.5,
            71.5
          ],
          [
            51.5,
            71.5
          ],
          [
            51.5,
            82.5
          ],
          [
            44.5,
            82.5
          ]
        ],
        "point": [
          48,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Diadem Niche",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      },
      "a": {
        "polygon": [
          [
            60.5,
            71.5
          ],
          [
            67.5,
            71.5
          ],
          [
            67.5,
            82.5
          ],
          [
            60.5,
            82.5
          ]
        ],
        "point": [
          64,
          77
        ],
        "kind": "door",
        "label": "Explore the passage to Living Archive",
        "evidence": "Expansion hotspot (provisional). Geometry avoids the original passage polygons; visual confirmation is required before final cinematic art."
      }
    }
  },
  "basementPassage": {
    "src": "/assets/images/hogwarts-cinematic-v4/basement-passage.webp",
    "width": 1672,
    "height": 941,
    "alt": "Basement Passage — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            5,
            65
          ],
          [
            24,
            65
          ],
          [
            23,
            26
          ],
          [
            19,
            13
          ],
          [
            11,
            12
          ],
          [
            6,
            23
          ]
        ],
        "point": [
          15,
          50
        ],
        "kind": "stair",
        "label": "Ascend to Entrance Hall",
        "evidence": "Visually inspected opening on the scene image."
      },
      "w": {
        "polygon": [
          [
            63.1,
            23
          ],
          [
            71.3,
            21
          ],
          [
            71.3,
            73.5
          ],
          [
            63.1,
            75.4
          ]
        ],
        "point": [
          68,
          56
        ],
        "kind": "arch",
        "label": "Through the fruit portrait",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            85.5,
            72
          ],
          [
            97.9,
            74
          ],
          [
            98,
            41
          ],
          [
            93.3,
            29
          ],
          [
            88,
            40
          ]
        ],
        "point": [
          92,
          58
        ],
        "kind": "stair",
        "label": "Descend toward dungeons",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "firstFloorJunction": {
    "src": "/assets/images/hogwarts-cinematic-v4/first-floor-junction.webp",
    "width": 1672,
    "height": 941,
    "alt": "Teaching Corridor — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            3,
            58
          ],
          [
            16.7,
            52
          ],
          [
            19.5,
            65
          ],
          [
            7.5,
            72
          ],
          [
            3,
            67
          ]
        ],
        "point": [
          9,
          64
        ],
        "kind": "stair",
        "label": "Return down main stairs",
        "evidence": "Visually inspected opening on the scene image."
      },
      "w": {
        "polygon": [
          [
            29,
            29
          ],
          [
            39.8,
            29
          ],
          [
            39.8,
            65.5
          ],
          [
            29,
            65.5
          ]
        ],
        "point": [
          34,
          57
        ],
        "kind": "arch",
        "label": "Enter Hospital Wing",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            49.2,
            32
          ],
          [
            59.9,
            32
          ],
          [
            59.9,
            65
          ],
          [
            49.2,
            65
          ]
        ],
        "point": [
          54.5,
          56
        ],
        "kind": "arch",
        "label": "Enter History of Magic",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            86.2,
            72
          ],
          [
            97.8,
            75
          ],
          [
            97.8,
            33
          ],
          [
            94,
            26
          ],
          [
            89,
            29
          ],
          [
            86.2,
            42
          ]
        ],
        "point": [
          93,
          63
        ],
        "kind": "arch",
        "label": "Follow Defence corridor",
        "evidence": "Visually inspected opening on the scene image."
      },
      "a": {
        "polygon": [
          [
            67.7,
            31
          ],
          [
            78.3,
            31
          ],
          [
            78.3,
            66
          ],
          [
            67.7,
            66
          ]
        ],
        "point": [
          73,
          54
        ],
        "kind": "arch",
        "label": "Enter Transfiguration",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "midFloorStair": {
    "src": "/assets/images/hogwarts-cinematic-v4/mid-floor-stair.webp",
    "width": 1672,
    "height": 941,
    "alt": "Middle Landings — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            30,
            94
          ],
          [
            66,
            94
          ],
          [
            62,
            79
          ],
          [
            55,
            77
          ],
          [
            40,
            77
          ],
          [
            34,
            80
          ]
        ],
        "point": [
          48,
          86
        ],
        "kind": "stair",
        "label": "Descend to main staircase",
        "evidence": "Visually inspected opening on the scene image."
      },
      "w": {
        "polygon": [
          [
            1.5,
            77
          ],
          [
            15.7,
            76
          ],
          [
            15.7,
            51
          ],
          [
            12.5,
            45
          ],
          [
            8.3,
            42
          ],
          [
            4,
            47
          ],
          [
            1.6,
            57
          ]
        ],
        "point": [
          8,
          66
        ],
        "kind": "stair",
        "label": "Descend to second-floor corridor",
        "evidence": "Visually inspected opening on the scene image."
      },
      "e": {
        "polygon": [
          [
            22.7,
            46
          ],
          [
            31.6,
            46
          ],
          [
            31.6,
            26
          ],
          [
            29,
            19
          ],
          [
            25.5,
            17
          ],
          [
            23,
            21
          ]
        ],
        "point": [
          27,
          37
        ],
        "kind": "arch",
        "label": "Third-floor Armour Gallery",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            79.5,
            51.8
          ],
          [
            98.1,
            53
          ],
          [
            97,
            20
          ],
          [
            91,
            18
          ],
          [
            87,
            20
          ],
          [
            82.2,
            37
          ]
        ],
        "point": [
          90,
          38
        ],
        "kind": "stair",
        "label": "Ascend to fourth-floor gallery",
        "evidence": "Visually inspected opening on the scene image."
      },
      "a": {
        "polygon": [
          [
            66.7,
            47
          ],
          [
            74,
            47
          ],
          [
            74,
            25
          ],
          [
            70.8,
            18
          ],
          [
            67.4,
            23
          ]
        ],
        "point": [
          70.6,
          38
        ],
        "kind": "arch",
        "label": "Third-floor Charms corridor",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "northTowerLanding": {
    "src": "/assets/images/hogwarts-cinematic-v4/north-tower-landing.webp",
    "width": 1672,
    "height": 941,
    "alt": "North Tower Landing — a cinematic view with visible passages",
    "exits": {
      "s": {
        "polygon": [
          [
            7,
            95
          ],
          [
            28,
            91
          ],
          [
            28,
            35
          ],
          [
            24,
            22
          ],
          [
            17,
            18
          ],
          [
            9,
            25
          ]
        ],
        "point": [
          16,
          85
        ],
        "kind": "stair",
        "label": "Descend the North Tower stairs",
        "evidence": "Visually inspected opening on the scene image."
      },
      "n": {
        "polygon": [
          [
            54.3,
            88.5
          ],
          [
            68.8,
            90
          ],
          [
            68.1,
            12
          ],
          [
            64,
            8
          ],
          [
            58,
            10
          ],
          [
            56,
            27
          ]
        ],
        "point": [
          61,
          58
        ],
        "kind": "ladder",
        "label": "Climb the silver ladder",
        "evidence": "Visually inspected opening on the scene image."
      }
    }
  },
  "hogsRoad": {
    "src": "/assets/images/hogwarts-expansion/hogsRoad.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hogsmeade Hill Road — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to The Lantern Path",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Station",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "s": {
        "polygon": [
          [
            44.4,
            30
          ],
          [
            55.6,
            30
          ],
          [
            55.6,
            46
          ],
          [
            44.4,
            46
          ]
        ],
        "point": [
          50,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to The Shrieking Shack",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "hogsStation": {
    "src": "/assets/images/hogwarts-expansion/hogsStation.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hogsmeade Station — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade Hill Road",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Station Wooden Bridge",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "hogsBridge": {
    "src": "/assets/images/hogwarts-expansion/hogsBridge.svg",
    "width": 1600,
    "height": 900,
    "alt": "Station Wooden Bridge — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Station",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "hogsSquare": {
    "src": "/assets/images/hogwarts-expansion/hogsSquare.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hogsmeade Village Square — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Station Wooden Bridge",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "s": {
        "polygon": [
          [
            44.4,
            30
          ],
          [
            55.6,
            30
          ],
          [
            55.6,
            46
          ],
          [
            44.4,
            46
          ]
        ],
        "point": [
          50,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Madam Puddifoot's Tea Shop",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "w": {
        "polygon": [
          [
            62.4,
            30
          ],
          [
            73.6,
            30
          ],
          [
            73.6,
            46
          ],
          [
            62.4,
            46
          ]
        ],
        "point": [
          68,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Post Office",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "hogsHigh": {
    "src": "/assets/images/hogwarts-expansion/hogsHigh.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hogsmeade High Street — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Three Broomsticks Porch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "s": {
        "polygon": [
          [
            44.4,
            30
          ],
          [
            55.6,
            30
          ],
          [
            55.6,
            46
          ],
          [
            44.4,
            46
          ]
        ],
        "point": [
          50,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Hog's Head Porch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "w": {
        "polygon": [
          [
            62.4,
            30
          ],
          [
            73.6,
            30
          ],
          [
            73.6,
            46
          ],
          [
            62.4,
            46
          ]
        ],
        "point": [
          68,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Honeydukes",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "a": {
        "polygon": [
          [
            80.4,
            30
          ],
          [
            91.6,
            30
          ],
          [
            91.6,
            46
          ],
          [
            80.4,
            46
          ]
        ],
        "point": [
          86,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Zonko's Joke Shop",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "b": {
        "polygon": [
          [
            8.4,
            65
          ],
          [
            19.6,
            65
          ],
          [
            19.6,
            81
          ],
          [
            8.4,
            81
          ]
        ],
        "point": [
          14,
          73
        ],
        "kind": "path",
        "label": "Follow the passage to Scrivenshaft's Quill Shop",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "c": {
        "polygon": [
          [
            26.4,
            65
          ],
          [
            37.6,
            65
          ],
          [
            37.6,
            81
          ],
          [
            26.4,
            81
          ]
        ],
        "point": [
          32,
          73
        ],
        "kind": "path",
        "label": "Follow the passage to Gladrags Wizardwear",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "d": {
        "polygon": [
          [
            44.4,
            65
          ],
          [
            55.6,
            65
          ],
          [
            55.6,
            81
          ],
          [
            44.4,
            81
          ]
        ],
        "point": [
          50,
          73
        ],
        "kind": "path",
        "label": "Follow the passage to Dervish and Banges",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "broomsPorch": {
    "src": "/assets/images/hogwarts-expansion/broomsPorch.svg",
    "width": 1600,
    "height": 900,
    "alt": "Three Broomsticks Porch — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to The Three Broomsticks",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "broomsPub": {
    "src": "/assets/images/hogwarts-expansion/broomsPub.svg",
    "width": 1600,
    "height": 900,
    "alt": "The Three Broomsticks — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Three Broomsticks Porch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "hogsHeadPorch": {
    "src": "/assets/images/hogwarts-expansion/hogsHeadPorch.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hog's Head Porch — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to The Hog's Head",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "hogsHead": {
    "src": "/assets/images/hogwarts-expansion/hogsHead.svg",
    "width": 1600,
    "height": 900,
    "alt": "The Hog's Head — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hog's Head Porch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "inspect",
        "label": "Inspect the old bottles",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Hog's Head Cellar",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/hogsHead-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "The Hog's Head with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "hogsCellar": {
    "src": "/assets/images/hogwarts-expansion/hogsCellar.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hog's Head Cellar — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to The Hog's Head",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "inspect",
        "label": "Inspect the weathered statue",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Humpbacked Witch Passage",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/hogsCellar-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Hog's Head Cellar with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "honeydukes": {
    "src": "/assets/images/hogwarts-expansion/honeydukes.svg",
    "width": 1600,
    "height": 900,
    "alt": "Honeydukes — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "inspect",
        "label": "Inspect the floor hatch",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "hatch",
        "label": "Enter the revealed passage to Honeydukes Cellar",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/honeydukes-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Honeydukes with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "zonkos": {
    "src": "/assets/images/hogwarts-expansion/zonkos.svg",
    "width": 1600,
    "height": 900,
    "alt": "Zonko's Joke Shop — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "scribbulus": {
    "src": "/assets/images/hogwarts-expansion/scribbulus.svg",
    "width": 1600,
    "height": 900,
    "alt": "Scrivenshaft's Quill Shop — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "gladrags": {
    "src": "/assets/images/hogwarts-expansion/gladrags.svg",
    "width": 1600,
    "height": 900,
    "alt": "Gladrags Wizardwear — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "dervish": {
    "src": "/assets/images/hogwarts-expansion/dervish.svg",
    "width": 1600,
    "height": 900,
    "alt": "Dervish and Banges — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "puddifoot": {
    "src": "/assets/images/hogwarts-expansion/puddifoot.svg",
    "width": 1600,
    "height": 900,
    "alt": "Madam Puddifoot's Tea Shop — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "postOffice": {
    "src": "/assets/images/hogwarts-expansion/postOffice.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hogsmeade Post Office — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "shriekingShack": {
    "src": "/assets/images/hogwarts-expansion/shriekingShack.svg",
    "width": 1600,
    "height": 900,
    "alt": "The Shrieking Shack — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade Hill Road",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "antechamber": {
    "src": "/assets/images/hogwarts-expansion/antechamber.svg",
    "width": 1600,
    "height": 900,
    "alt": "Great Hall Antechamber — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Entrance Hall",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "trophy": {
    "src": "/assets/images/hogwarts-expansion/trophy.svg",
    "width": 1600,
    "height": 900,
    "alt": "Trophy Gallery — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Third-floor Armour Gallery",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "inspect",
        "label": "Inspect the folded parchment",
        "evidence": "An intentionally concealed interaction; the original photographic landmark is provisional."
      },
      "open": {
        "polygon": [
          [
            45.9,
            49.7
          ],
          [
            54.1,
            49.7
          ],
          [
            54.1,
            60.3
          ],
          [
            45.9,
            60.3
          ]
        ],
        "point": [
          50,
          55
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Marauder's Map Nook",
        "evidence": "Separate opened-state aperture; this interaction activates only after a deliberate reveal.",
        "src": "/assets/images/hogwarts-expansion/trophy-revealed.svg",
        "width": 1600,
        "height": 900,
        "alt": "Trophy Gallery with a revealed hidden passage"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "clockTower": {
    "src": "/assets/images/hogwarts-expansion/clockTower.svg",
    "width": 1600,
    "height": 900,
    "alt": "Clock Tower — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to North Battlements",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "prefectsBath": {
    "src": "/assets/images/hogwarts-expansion/prefectsBath.svg",
    "width": 1600,
    "height": 900,
    "alt": "Prefects' Bathroom — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Second-floor Bathroom Corridor",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "commonGryff": {
    "src": "/assets/images/hogwarts-expansion/commonGryff.svg",
    "width": 1600,
    "height": 900,
    "alt": "Gryffindor Common Room — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Fourth-floor Portrait Corridor",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "commonRaven": {
    "src": "/assets/images/hogwarts-expansion/commonRaven.svg",
    "width": 1600,
    "height": 900,
    "alt": "Ravenclaw Common Room — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to North Battlements",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "commonHuffle": {
    "src": "/assets/images/hogwarts-expansion/commonHuffle.svg",
    "width": 1600,
    "height": 900,
    "alt": "Hufflepuff Common Room — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Castle Kitchens",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "commonSlytherin": {
    "src": "/assets/images/hogwarts-expansion/commonSlytherin.svg",
    "width": 1600,
    "height": 900,
    "alt": "Slytherin Common Room — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Serpent Door",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "roRThings": {
    "src": "/assets/images/hogwarts-expansion/roRThings.svg",
    "width": 1600,
    "height": 900,
    "alt": "Room of Hidden Things — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "roRDA": {
    "src": "/assets/images/hogwarts-expansion/roRDA.svg",
    "width": 1600,
    "height": 900,
    "alt": "D.A. Training Room — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "roRDiadem": {
    "src": "/assets/images/hogwarts-expansion/roRDiadem.svg",
    "width": 1600,
    "height": 900,
    "alt": "Diadem Niche — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "roRArchive": {
    "src": "/assets/images/hogwarts-expansion/roRArchive.svg",
    "width": 1600,
    "height": 900,
    "alt": "Living Archive — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "lakeShallows": {
    "src": "/assets/images/hogwarts-expansion/lakeShallows.svg",
    "width": 1600,
    "height": 900,
    "alt": "Black Lake Shallows — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Black Lake Islet",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Black Lake Underwater Cave",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "s": {
        "polygon": [
          [
            44.4,
            30
          ],
          [
            55.6,
            30
          ],
          [
            55.6,
            46
          ],
          [
            44.4,
            46
          ]
        ],
        "point": [
          50,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Old Pier",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "boatLaunch": {
    "src": "/assets/images/hogwarts-expansion/boatLaunch.svg",
    "width": 1600,
    "height": 900,
    "alt": "Boathouse Launch — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to The Boathouse",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "lakeCave": {
    "src": "/assets/images/hogwarts-expansion/lakeCave.svg",
    "width": 1600,
    "height": 900,
    "alt": "Black Lake Underwater Cave — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Black Lake Shallows",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Merpeople Village",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "merVillage": {
    "src": "/assets/images/hogwarts-expansion/merVillage.svg",
    "width": 1600,
    "height": 900,
    "alt": "Merpeople Village — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Black Lake Underwater Cave",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "lakeIslet": {
    "src": "/assets/images/hogwarts-expansion/lakeIslet.svg",
    "width": 1600,
    "height": 900,
    "alt": "Black Lake Islet — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Black Lake Shallows",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "willowRoots": {
    "src": "/assets/images/hogwarts-expansion/willowRoots.svg",
    "width": 1600,
    "height": 900,
    "alt": "Whomping Willow Roots — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to South Courtyard",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "centaurGrove": {
    "src": "/assets/images/hogwarts-expansion/centaurGrove.svg",
    "width": 1600,
    "height": 900,
    "alt": "Centaur Grove — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Ancient Clearing",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Unicorn Glade",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "unicornGlade": {
    "src": "/assets/images/hogwarts-expansion/unicornGlade.svg",
    "width": 1600,
    "height": 900,
    "alt": "Unicorn Glade — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Centaur Grove",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "acromantulaDen": {
    "src": "/assets/images/hogwarts-expansion/acromantulaDen.svg",
    "width": 1600,
    "height": 900,
    "alt": "Acromantula Den — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Forbidden Forest",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "coveredBridge": {
    "src": "/assets/images/hogwarts-expansion/coveredBridge.svg",
    "width": 1600,
    "height": 900,
    "alt": "Covered Bridge — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to Stone Viaduct",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "herbCourt": {
    "src": "/assets/images/hogwarts-expansion/herbCourt.svg",
    "width": 1600,
    "height": 900,
    "alt": "Herbology Courtyard — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Glasshouse Passage",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "outerSlope": {
    "src": "/assets/images/hogwarts-expansion/outerSlope.svg",
    "width": 1600,
    "height": 900,
    "alt": "Castle Outer Slope — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to The Lantern Path",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "quidStands": {
    "src": "/assets/images/hogwarts-expansion/quidStands.svg",
    "width": 1600,
    "height": 900,
    "alt": "Quidditch Stands — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Pitch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Changing Rooms",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "quidChanging": {
    "src": "/assets/images/hogwarts-expansion/quidChanging.svg",
    "width": 1600,
    "height": 900,
    "alt": "Quidditch Changing Rooms — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Stands",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Equipment Store",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "quidKit": {
    "src": "/assets/images/hogwarts-expansion/quidKit.svg",
    "width": 1600,
    "height": 900,
    "alt": "Quidditch Equipment Store — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Changing Rooms",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "quidReferee": {
    "src": "/assets/images/hogwarts-expansion/quidReferee.svg",
    "width": 1600,
    "height": 900,
    "alt": "Quidditch Referee Tower — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Pitch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "quidGoals": {
    "src": "/assets/images/hogwarts-expansion/quidGoals.svg",
    "width": 1600,
    "height": 900,
    "alt": "Quidditch Goal Hoops — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Pitch",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Trophy Walk",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "quidTrophies": {
    "src": "/assets/images/hogwarts-expansion/quidTrophies.svg",
    "width": 1600,
    "height": 900,
    "alt": "Quidditch Trophy Walk — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Goal Hoops",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "flyingShed": {
    "src": "/assets/images/hogwarts-expansion/flyingShed.svg",
    "width": 1600,
    "height": 900,
    "alt": "Flying Lesson Equipment Shed — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Flying-lesson Lawn",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "owlDrop": {
    "src": "/assets/images/hogwarts-expansion/owlDrop.svg",
    "width": 1600,
    "height": 900,
    "alt": "Owl Delivery Ledge — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "path",
        "label": "Follow the passage to The Owlery",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "humpbackTunnel": {
    "src": "/assets/images/hogwarts-expansion/humpbackTunnel.svg",
    "width": 1600,
    "height": 900,
    "alt": "Humpbacked Witch Passage — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hog's Head Cellar",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "serpentDoor": {
    "src": "/assets/images/hogwarts-expansion/serpentDoor.svg",
    "width": 1600,
    "height": 900,
    "alt": "Serpent Door — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Slytherin Common Room",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Green Lantern Passage",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "trapdoorChamber": {
    "src": "/assets/images/hogwarts-expansion/trapdoorChamber.svg",
    "width": 1600,
    "height": 900,
    "alt": "Trapdoor Chamber — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Archive Passage",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "mirrorChamber": {
    "src": "/assets/images/hogwarts-expansion/mirrorChamber.svg",
    "width": 1600,
    "height": 900,
    "alt": "Mirror of Erised Chamber — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Fourth-floor Portrait Corridor",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "mapNook": {
    "src": "/assets/images/hogwarts-expansion/mapNook.svg",
    "width": 1600,
    "height": 900,
    "alt": "Marauder's Map Nook — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Trophy Gallery",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "restrictedStacks": {
    "src": "/assets/images/hogwarts-expansion/restrictedStacks.svg",
    "width": 1600,
    "height": 900,
    "alt": "Library Restricted Section — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogwarts Library",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "oneEyedTunnel": {
    "src": "/assets/images/hogwarts-expansion/oneEyedTunnel.svg",
    "width": 1600,
    "height": 900,
    "alt": "One-Eyed Witch Tunnel — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Honeydukes Cellar",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Second-floor Bathroom Corridor",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "honeyCellar": {
    "src": "/assets/images/hogwarts-expansion/honeyCellar.svg",
    "width": 1600,
    "height": 900,
    "alt": "Honeydukes Cellar — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to One-Eyed Witch Tunnel",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      },
      "e": {
        "polygon": [
          [
            26.4,
            30
          ],
          [
            37.6,
            30
          ],
          [
            37.6,
            46
          ],
          [
            26.4,
            46
          ]
        ],
        "point": [
          32,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Honeydukes",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "whisperingCrypt": {
    "src": "/assets/images/hogwarts-expansion/whisperingCrypt.svg",
    "width": 1600,
    "height": 900,
    "alt": "Whispering Crypt — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Forgotten Crypt",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  },
  "forgottenArmory": {
    "src": "/assets/images/hogwarts-expansion/forgottenArmory.svg",
    "width": 1600,
    "height": 900,
    "alt": "Forgotten Armoury — illustrated, explorable Hogwarts location",
    "exits": {
      "n": {
        "polygon": [
          [
            8.4,
            30
          ],
          [
            19.6,
            30
          ],
          [
            19.6,
            46
          ],
          [
            8.4,
            46
          ]
        ],
        "point": [
          14,
          38
        ],
        "kind": "arch",
        "label": "Follow the passage to Third-floor Armour Gallery",
        "evidence": "Visible illustrated aperture in the new SVG scene board."
      }
    }
  }
};
})();
