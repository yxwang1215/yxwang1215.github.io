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
            15.16,
            71.94
          ],
          [
            16.84,
            71.94
          ],
          [
            17.75,
            74.91
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            14.25,
            74.91
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
            31.16,
            71.94
          ],
          [
            32.84,
            71.94
          ],
          [
            33.75,
            74.91
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            30.25,
            74.91
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            32,
            72.336
          ],
          [
            34.296,
            73.608
          ],
          [
            35.608,
            76.364
          ],
          [
            35.116,
            79.332
          ],
          [
            33.476,
            81.452
          ],
          [
            30.524,
            81.452
          ],
          [
            28.884,
            79.332
          ],
          [
            28.392,
            76.364
          ],
          [
            29.704,
            73.608
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
            57.68,
            25.9
          ],
          [
            62,
            25.54
          ],
          [
            66.32,
            25.9
          ],
          [
            69.2,
            30.04
          ],
          [
            69.92,
            59.2
          ],
          [
            54.08,
            59.2
          ],
          [
            54.8,
            30.04
          ]
        ],
        "point": [
          62,
          43
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Mirror of Erised Chamber",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/gallery-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Fourth-floor Portrait Corridor — a cinematic view with visible passages — revealed passage opened"
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            32,
            72.336
          ],
          [
            34.296,
            73.608
          ],
          [
            35.608,
            76.364
          ],
          [
            35.116,
            79.332
          ],
          [
            33.476,
            81.452
          ],
          [
            30.524,
            81.452
          ],
          [
            28.884,
            79.332
          ],
          [
            28.392,
            76.364
          ],
          [
            29.704,
            73.608
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
            62.72,
            23.275
          ],
          [
            68,
            22.765
          ],
          [
            73.28,
            23.275
          ],
          [
            76.8,
            29.14
          ],
          [
            77.68,
            70.45
          ],
          [
            58.32,
            70.45
          ],
          [
            59.2,
            29.14
          ]
        ],
        "point": [
          68,
          47.5
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Forgotten Armoury",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/armoury-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Third-floor Armour Gallery — a cinematic view with visible passages — revealed passage opened"
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            32,
            72.336
          ],
          [
            34.296,
            73.608
          ],
          [
            35.608,
            76.364
          ],
          [
            35.116,
            79.332
          ],
          [
            33.476,
            81.452
          ],
          [
            30.524,
            81.452
          ],
          [
            28.884,
            79.332
          ],
          [
            28.392,
            76.364
          ],
          [
            29.704,
            73.608
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
            58.9,
            17.925
          ],
          [
            62.5,
            17.555
          ],
          [
            66.1,
            17.925
          ],
          [
            68.5,
            22.18
          ],
          [
            69.1,
            52.15
          ],
          [
            55.9,
            52.15
          ],
          [
            56.5,
            22.18
          ]
        ],
        "point": [
          62.5,
          35.5
        ],
        "kind": "door",
        "label": "Enter the revealed passage to One-Eyed Witch Tunnel",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/baths-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Second-floor Bathroom Corridor — a cinematic view with visible passages — revealed passage opened"
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
            16,
            72.336
          ],
          [
            18.296,
            73.608
          ],
          [
            19.608,
            76.364
          ],
          [
            19.116,
            79.332
          ],
          [
            17.476,
            81.452
          ],
          [
            14.524,
            81.452
          ],
          [
            12.884,
            79.332
          ],
          [
            12.392,
            76.364
          ],
          [
            13.704,
            73.608
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
            57.24,
            23.3
          ],
          [
            63,
            22.78
          ],
          [
            68.76,
            23.3
          ],
          [
            72.6,
            29.28
          ],
          [
            73.56,
            71.4
          ],
          [
            52.44,
            71.4
          ],
          [
            53.4,
            29.28
          ]
        ],
        "point": [
          63,
          48
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Library Restricted Section",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/library-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Hogwarts Library — a cinematic view with visible passages — revealed passage opened"
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
            30.32,
            71.775
          ],
          [
            32,
            71.665
          ],
          [
            33.68,
            71.775
          ],
          [
            34.8,
            73.04
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            29.2,
            73.04
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            30.32,
            71.775
          ],
          [
            32,
            71.665
          ],
          [
            33.68,
            71.775
          ],
          [
            34.8,
            73.04
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            29.2,
            73.04
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
            16,
            72.336
          ],
          [
            18.296,
            73.608
          ],
          [
            19.608,
            76.364
          ],
          [
            19.116,
            79.332
          ],
          [
            17.476,
            81.452
          ],
          [
            14.524,
            81.452
          ],
          [
            12.884,
            79.332
          ],
          [
            12.392,
            76.364
          ],
          [
            13.704,
            73.608
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
            64,
            24.92
          ],
          [
            68.32,
            28.76
          ],
          [
            70.88,
            39.8
          ],
          [
            70.88,
            54.2
          ],
          [
            68.32,
            65.24
          ],
          [
            64,
            69.08
          ],
          [
            59.68,
            65.24
          ],
          [
            57.12,
            54.2
          ],
          [
            57.12,
            39.8
          ],
          [
            59.68,
            28.76
          ]
        ],
        "point": [
          64,
          47
        ],
        "kind": "hatch",
        "label": "Enter the revealed passage to Trapdoor Chamber",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/oldArchive-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Archive Passage — a cinematic view with visible passages — revealed passage opened"
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
            16,
            72.336
          ],
          [
            18.296,
            73.608
          ],
          [
            19.608,
            76.364
          ],
          [
            19.116,
            79.332
          ],
          [
            17.476,
            81.452
          ],
          [
            14.524,
            81.452
          ],
          [
            12.884,
            79.332
          ],
          [
            12.392,
            76.364
          ],
          [
            13.704,
            73.608
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
            64.72,
            20.475
          ],
          [
            70,
            19.885
          ],
          [
            75.28,
            20.475
          ],
          [
            78.8,
            27.26
          ],
          [
            79.68,
            75.05
          ],
          [
            60.32,
            75.05
          ],
          [
            61.2,
            27.26
          ]
        ],
        "point": [
          70,
          48.5
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Whispering Crypt",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/crypt-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Forgotten Crypt — a cinematic view with visible passages — revealed passage opened"
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
            32,
            72.336
          ],
          [
            34.296,
            73.608
          ],
          [
            35.608,
            76.364
          ],
          [
            35.116,
            79.332
          ],
          [
            33.476,
            81.452
          ],
          [
            30.524,
            81.452
          ],
          [
            28.884,
            79.332
          ],
          [
            28.392,
            76.364
          ],
          [
            29.704,
            73.608
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
            73.34,
            24.9
          ],
          [
            75.5,
            24.54
          ],
          [
            77.66,
            24.9
          ],
          [
            79.1,
            29.04
          ],
          [
            79.46,
            58.2
          ],
          [
            71.54,
            58.2
          ],
          [
            71.9,
            29.04
          ]
        ],
        "point": [
          75.5,
          42
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Serpent Door",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/slytherin-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Green Lantern Passage — a cinematic view with visible passages — revealed passage opened"
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
            15.16,
            71.94
          ],
          [
            16.84,
            71.94
          ],
          [
            17.75,
            74.91
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            14.25,
            74.91
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
            15.16,
            71.94
          ],
          [
            16.84,
            71.94
          ],
          [
            17.75,
            74.91
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            14.25,
            74.91
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
            15.16,
            71.94
          ],
          [
            16.84,
            71.94
          ],
          [
            17.75,
            74.91
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            14.25,
            74.91
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
            16,
            72.336
          ],
          [
            18.296,
            73.608
          ],
          [
            19.608,
            76.364
          ],
          [
            19.116,
            79.332
          ],
          [
            17.476,
            81.452
          ],
          [
            14.524,
            81.452
          ],
          [
            12.884,
            79.332
          ],
          [
            12.392,
            76.364
          ],
          [
            13.704,
            73.608
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
            81.5,
            25.92
          ],
          [
            88.25,
            29.76
          ],
          [
            92.25,
            40.8
          ],
          [
            92.25,
            55.2
          ],
          [
            88.25,
            66.24
          ],
          [
            81.5,
            70.08
          ],
          [
            74.75,
            66.24
          ],
          [
            70.75,
            55.2
          ],
          [
            70.75,
            40.8
          ],
          [
            74.75,
            29.76
          ]
        ],
        "point": [
          81.5,
          48
        ],
        "kind": "hatch",
        "label": "Enter the revealed passage to Black Lake Shallows",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/dock-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Old Pier — a cinematic view with visible passages — revealed passage opened"
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
            15.16,
            71.94
          ],
          [
            16.84,
            71.94
          ],
          [
            17.75,
            74.91
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            14.25,
            74.91
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
            15.16,
            71.94
          ],
          [
            16.84,
            71.94
          ],
          [
            17.75,
            74.91
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            14.25,
            74.91
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            30.32,
            71.775
          ],
          [
            32,
            71.665
          ],
          [
            33.68,
            71.775
          ],
          [
            34.8,
            73.04
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            29.2,
            73.04
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
            48,
            72.336
          ],
          [
            50.296,
            73.608
          ],
          [
            51.608,
            76.364
          ],
          [
            51.116,
            79.332
          ],
          [
            49.476,
            81.452
          ],
          [
            46.524,
            81.452
          ],
          [
            44.884,
            79.332
          ],
          [
            44.392,
            76.364
          ],
          [
            45.704,
            73.608
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
            59.24,
            32.875
          ],
          [
            65,
            32.525
          ],
          [
            70.76,
            32.875
          ],
          [
            74.6,
            36.9
          ],
          [
            75.56,
            65.25
          ],
          [
            54.44,
            65.25
          ],
          [
            55.4,
            36.9
          ]
        ],
        "point": [
          65,
          49.5
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Quidditch Referee Tower",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/quidditch-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Quidditch Pitch — a cinematic view with visible passages — revealed passage opened"
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
            30.32,
            71.775
          ],
          [
            32,
            71.665
          ],
          [
            33.68,
            71.775
          ],
          [
            34.8,
            73.04
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            29.2,
            73.04
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
            30.32,
            71.775
          ],
          [
            32,
            71.665
          ],
          [
            33.68,
            71.775
          ],
          [
            34.8,
            73.04
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            29.2,
            73.04
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
            14.32,
            71.775
          ],
          [
            16,
            71.665
          ],
          [
            17.68,
            71.775
          ],
          [
            18.8,
            73.04
          ],
          [
            19.08,
            81.95
          ],
          [
            12.92,
            81.95
          ],
          [
            13.2,
            73.04
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
            30.32,
            71.775
          ],
          [
            32,
            71.665
          ],
          [
            33.68,
            71.775
          ],
          [
            34.8,
            73.04
          ],
          [
            35.08,
            81.95
          ],
          [
            28.92,
            81.95
          ],
          [
            29.2,
            73.04
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
            46.32,
            71.775
          ],
          [
            48,
            71.665
          ],
          [
            49.68,
            71.775
          ],
          [
            50.8,
            73.04
          ],
          [
            51.08,
            81.95
          ],
          [
            44.92,
            81.95
          ],
          [
            45.2,
            73.04
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
            62.32,
            71.775
          ],
          [
            64,
            71.665
          ],
          [
            65.68,
            71.775
          ],
          [
            66.8,
            73.04
          ],
          [
            67.08,
            81.95
          ],
          [
            60.92,
            81.95
          ],
          [
            61.2,
            73.04
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
            34.4,
            29.913
          ],
          [
            36.344,
            31.19
          ],
          [
            37.856,
            34.84
          ],
          [
            38.936,
            39.585
          ],
          [
            39.044,
            63.675
          ],
          [
            29.756,
            63.675
          ],
          [
            29.864,
            39.585
          ],
          [
            30.944,
            34.84
          ],
          [
            32.456,
            31.19
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
            54.55,
            32.825
          ],
          [
            56.476,
            33.98
          ],
          [
            57.974,
            37.28
          ],
          [
            59.044,
            41.57
          ],
          [
            59.151,
            63.35
          ],
          [
            49.949,
            63.35
          ],
          [
            50.056,
            41.57
          ],
          [
            51.126,
            37.28
          ],
          [
            52.624,
            33.98
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
            73,
            31.875
          ],
          [
            74.908,
            33.1
          ],
          [
            76.392,
            36.6
          ],
          [
            77.452,
            41.15
          ],
          [
            77.558,
            64.25
          ],
          [
            68.442,
            64.25
          ],
          [
            68.548,
            41.15
          ],
          [
            69.608,
            36.6
          ],
          [
            71.092,
            33.1
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
    "src": "/assets/images/hogwarts-ai-v2/hogsRoad.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hogsmeade Hill Road — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            17.74,
            50.24
          ],
          [
            23.26,
            50.24
          ],
          [
            26.25,
            58.61
          ],
          [
            30.62,
            78.45
          ],
          [
            10.38,
            78.45
          ],
          [
            14.75,
            58.61
          ]
        ],
        "point": [
          20.5,
          64.5
        ],
        "kind": "path",
        "label": "Follow the passage to The Lantern Path",
        "evidence": "Manual approximate aperture on the independent daylight image, near 20.5% / 64.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            49.84,
            48
          ],
          [
            54.16,
            48
          ],
          [
            56.5,
            54.75
          ],
          [
            59.92,
            70.75
          ],
          [
            44.08,
            70.75
          ],
          [
            47.5,
            54.75
          ]
        ],
        "point": [
          52,
          59.5
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Station",
        "evidence": "Manual approximate aperture on the independent daylight image, near 52% / 59.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "s": {
        "polygon": [
          [
            80.36,
            48.32
          ],
          [
            85.64,
            48.32
          ],
          [
            88.5,
            57.23
          ],
          [
            92.68,
            78.35
          ],
          [
            73.32,
            78.35
          ],
          [
            77.5,
            57.23
          ]
        ],
        "point": [
          83,
          63.5
        ],
        "kind": "path",
        "label": "Follow the passage to The Shrieking Shack",
        "evidence": "Manual approximate aperture on the independent daylight image, near 83% / 63.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "hogsStation": {
    "src": "/assets/images/hogwarts-ai-v2/hogsStation.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hogsmeade Station — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            22,
            34.825
          ],
          [
            24.88,
            35.98
          ],
          [
            27.12,
            39.28
          ],
          [
            28.72,
            43.57
          ],
          [
            28.88,
            65.35
          ],
          [
            15.12,
            65.35
          ],
          [
            15.28,
            43.57
          ],
          [
            16.88,
            39.28
          ],
          [
            19.12,
            35.98
          ]
        ],
        "point": [
          22,
          50.5
        ],
        "kind": "arch",
        "label": "Follow the passage to Hogsmeade Hill Road",
        "evidence": "Manual approximate aperture on the independent daylight image, near 22% / 50.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            83.74,
            32.04
          ],
          [
            89.26,
            32.04
          ],
          [
            92.25,
            45.81
          ],
          [
            96.62,
            78.45
          ],
          [
            76.38,
            78.45
          ],
          [
            80.75,
            45.81
          ]
        ],
        "point": [
          86.5,
          55.5
        ],
        "kind": "path",
        "label": "Follow the passage to Station Wooden Bridge",
        "evidence": "Manual approximate aperture on the independent daylight image, near 86.5% / 55.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "hogsBridge": {
    "src": "/assets/images/hogwarts-ai-v2/hogsBridge.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Station Wooden Bridge — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            48.3,
            83.64
          ],
          [
            56.7,
            83.64
          ],
          [
            61.25,
            87.96
          ],
          [
            67.9,
            98.2
          ],
          [
            37.1,
            98.2
          ],
          [
            43.75,
            87.96
          ]
        ],
        "point": [
          52.5,
          91
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Station",
        "evidence": "Manual approximate aperture on the independent daylight image, near 52.5% / 91%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            81.36,
            27.72
          ],
          [
            86.64,
            27.72
          ],
          [
            89.5,
            39.33
          ],
          [
            93.68,
            66.85
          ],
          [
            74.32,
            66.85
          ],
          [
            78.5,
            39.33
          ]
        ],
        "point": [
          84,
          47.5
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Manual approximate aperture on the independent daylight image, near 84% / 47.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "hogsSquare": {
    "src": "/assets/images/hogwarts-ai-v2/hogsSquare-day.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Hogsmeade Village Square — cinematic daylight AI scene",
    "exits": {
      "n": {
        "polygon": [
          [
            74,
            42.65
          ],
          [
            75.8,
            43.56
          ],
          [
            77.2,
            46.16
          ],
          [
            78.2,
            49.54
          ],
          [
            78.3,
            66.7
          ],
          [
            69.7,
            66.7
          ],
          [
            69.8,
            49.54
          ],
          [
            70.8,
            46.16
          ],
          [
            72.2,
            43.56
          ]
        ],
        "point": [
          74,
          58
        ],
        "kind": "arch",
        "label": "Follow the passage to Station Wooden Bridge",
        "evidence": "Provisional image-space mapping to a visible route in the new daylight village image; shop/destination identity requires visual verification."
      },
      "e": {
        "polygon": [
          [
            45,
            78
          ],
          [
            69,
            78
          ],
          [
            71,
            99
          ],
          [
            39,
            99
          ]
        ],
        "point": [
          55,
          90
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Provisional image-space mapping to a visible route in the new daylight village image; shop/destination identity requires visual verification."
      },
      "s": {
        "polygon": [
          [
            34.38,
            49.675
          ],
          [
            37.5,
            49.405
          ],
          [
            40.62,
            49.675
          ],
          [
            42.7,
            52.78
          ],
          [
            43.22,
            74.65
          ],
          [
            31.78,
            74.65
          ],
          [
            32.3,
            52.78
          ]
        ],
        "point": [
          37.5,
          65
        ],
        "kind": "door",
        "label": "Follow the passage to Madam Puddifoot's Tea Shop",
        "evidence": "Provisional image-space mapping to a visible route in the new daylight village image; shop/destination identity requires visual verification."
      },
      "w": {
        "polygon": [
          [
            92.34,
            38.025
          ],
          [
            94.5,
            37.615
          ],
          [
            96.66,
            38.025
          ],
          [
            98.1,
            42.74
          ],
          [
            98.46,
            75.95
          ],
          [
            90.54,
            75.95
          ],
          [
            90.9,
            42.74
          ]
        ],
        "point": [
          94.5,
          58
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade Post Office",
        "evidence": "Provisional image-space mapping to a visible route in the new daylight village image; shop/destination identity requires visual verification."
      }
    }
  },
  "hogsHigh": {
    "src": "/assets/images/hogwarts-ai-v2/hogsHigh.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hogsmeade High Street — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            46.94,
            45.92
          ],
          [
            50.06,
            45.92
          ],
          [
            51.75,
            52.13
          ],
          [
            54.22,
            66.85
          ],
          [
            42.78,
            66.85
          ],
          [
            45.25,
            52.13
          ]
        ],
        "point": [
          48.5,
          56.5
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Manual approximate aperture on the independent daylight image, near 48.5% / 56.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            84.9,
            37.95
          ],
          [
            88.5,
            37.57
          ],
          [
            92.1,
            37.95
          ],
          [
            94.5,
            42.32
          ],
          [
            95.1,
            73.1
          ],
          [
            81.9,
            73.1
          ],
          [
            82.5,
            42.32
          ]
        ],
        "point": [
          88.5,
          56
        ],
        "kind": "door",
        "label": "Follow the passage to Three Broomsticks Porch",
        "evidence": "Manual approximate aperture on the independent daylight image, near 88.5% / 56%; route identity from atlas graph; final browser click-through QA required."
      },
      "s": {
        "polygon": [
          [
            73.08,
            40.775
          ],
          [
            75,
            40.465
          ],
          [
            76.92,
            40.775
          ],
          [
            78.2,
            44.34
          ],
          [
            78.52,
            69.45
          ],
          [
            71.48,
            69.45
          ],
          [
            71.8,
            44.34
          ]
        ],
        "point": [
          75,
          55.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hog's Head Porch",
        "evidence": "Manual approximate aperture on the independent daylight image, near 75% / 55.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "w": {
        "polygon": [
          [
            8.64,
            33
          ],
          [
            12,
            32.6
          ],
          [
            15.36,
            33
          ],
          [
            17.6,
            37.6
          ],
          [
            18.16,
            70
          ],
          [
            5.84,
            70
          ],
          [
            6.4,
            37.6
          ]
        ],
        "point": [
          12,
          52
        ],
        "kind": "door",
        "label": "Follow the passage to Honeydukes",
        "evidence": "Manual approximate aperture on the independent daylight image, near 12% / 52%; route identity from atlas graph; final browser click-through QA required."
      },
      "a": {
        "polygon": [
          [
            25.12,
            38.775
          ],
          [
            28,
            38.465
          ],
          [
            30.88,
            38.775
          ],
          [
            32.8,
            42.34
          ],
          [
            33.28,
            67.45
          ],
          [
            22.72,
            67.45
          ],
          [
            23.2,
            42.34
          ]
        ],
        "point": [
          28,
          53.5
        ],
        "kind": "door",
        "label": "Follow the passage to Zonko's Joke Shop",
        "evidence": "Manual approximate aperture on the independent daylight image, near 28% / 53.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "b": {
        "polygon": [
          [
            37.56,
            42.6
          ],
          [
            39,
            42.36
          ],
          [
            40.44,
            42.6
          ],
          [
            41.4,
            45.36
          ],
          [
            41.64,
            64.8
          ],
          [
            36.36,
            64.8
          ],
          [
            36.6,
            45.36
          ]
        ],
        "point": [
          39,
          54
        ],
        "kind": "door",
        "label": "Follow the passage to Scrivenshaft's Quill Shop",
        "evidence": "Manual approximate aperture on the independent daylight image, near 39% / 54%; route identity from atlas graph; final browser click-through QA required."
      },
      "c": {
        "polygon": [
          [
            59.08,
            43.65
          ],
          [
            61,
            43.39
          ],
          [
            62.92,
            43.65
          ],
          [
            64.2,
            46.64
          ],
          [
            64.52,
            67.7
          ],
          [
            57.48,
            67.7
          ],
          [
            57.8,
            46.64
          ]
        ],
        "point": [
          61,
          56
        ],
        "kind": "door",
        "label": "Follow the passage to Gladrags Wizardwear",
        "evidence": "Manual approximate aperture on the independent daylight image, near 61% / 56%; route identity from atlas graph; final browser click-through QA required."
      },
      "d": {
        "polygon": [
          [
            67.04,
            44.65
          ],
          [
            68,
            44.39
          ],
          [
            68.96,
            44.65
          ],
          [
            69.6,
            47.64
          ],
          [
            69.76,
            68.7
          ],
          [
            66.24,
            68.7
          ],
          [
            66.4,
            47.64
          ]
        ],
        "point": [
          68,
          57
        ],
        "kind": "door",
        "label": "Follow the passage to Dervish and Banges",
        "evidence": "Manual approximate aperture on the independent daylight image, near 68% / 57%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "broomsPorch": {
    "src": "/assets/images/hogwarts-ai-v2/broomsPorch.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Three Broomsticks Porch — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            14.26,
            37.6
          ],
          [
            20.74,
            37.6
          ],
          [
            24.25,
            48.4
          ],
          [
            29.38,
            74
          ],
          [
            5.62,
            74
          ],
          [
            10.75,
            48.4
          ]
        ],
        "point": [
          17.5,
          56
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Manual approximate aperture on the independent daylight image, near 17.5% / 56%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            68.28,
            21.4
          ],
          [
            75,
            20.84
          ],
          [
            81.72,
            21.4
          ],
          [
            86.2,
            27.84
          ],
          [
            87.32,
            73.2
          ],
          [
            62.68,
            73.2
          ],
          [
            63.8,
            27.84
          ]
        ],
        "point": [
          75,
          48
        ],
        "kind": "door",
        "label": "Follow the passage to The Three Broomsticks",
        "evidence": "Manual approximate aperture on the independent daylight image, near 75% / 48%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "broomsPub": {
    "src": "/assets/images/hogwarts-ai-v1/broomsPub.jpg",
    "width": 1672,
    "height": 941,
    "alt": "The Three Broomsticks — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            0,
            34
          ],
          [
            15,
            31
          ],
          [
            23,
            38
          ],
          [
            23,
            65
          ],
          [
            0,
            69
          ]
        ],
        "point": [
          12,
          54
        ],
        "kind": "door",
        "label": "Follow the passage to Three Broomsticks Porch",
        "evidence": "Cinematic image: open timber door at left onto snowy village street, with continuous stone threshold. Manually traced."
      }
    }
  },
  "hogsHeadPorch": {
    "src": "/assets/images/hogwarts-ai-v2/hogsHeadPorch.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hog's Head Porch — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            12.88,
            38.72
          ],
          [
            19.12,
            38.72
          ],
          [
            22.5,
            50.33
          ],
          [
            27.44,
            77.85
          ],
          [
            4.56,
            77.85
          ],
          [
            9.5,
            50.33
          ]
        ],
        "point": [
          16,
          58.5
        ],
        "kind": "path",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Manual approximate aperture on the independent daylight image, near 16% / 58.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            70.54,
            27.275
          ],
          [
            77.5,
            26.765
          ],
          [
            84.46,
            27.275
          ],
          [
            89.1,
            33.14
          ],
          [
            90.26,
            74.45
          ],
          [
            64.74,
            74.45
          ],
          [
            65.9,
            33.14
          ]
        ],
        "point": [
          77.5,
          51.5
        ],
        "kind": "door",
        "label": "Follow the passage to The Hog's Head",
        "evidence": "Manual approximate aperture on the independent daylight image, near 77.5% / 51.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "hogsHead": {
    "src": "/assets/images/hogwarts-ai-v1/hogsHead.jpg",
    "width": 1672,
    "height": 941,
    "alt": "The Hog's Head — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            3,
            25
          ],
          [
            15,
            20
          ],
          [
            21,
            29
          ],
          [
            22,
            62
          ],
          [
            3,
            67
          ]
        ],
        "point": [
          14,
          50
        ],
        "kind": "door",
        "label": "Follow the passage to Hog's Head Porch",
        "evidence": "Cinematic image: open left timber tavern door onto snow-covered village, with continuous threshold floor. Manually traced."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            58,
            30
          ],
          [
            62,
            24
          ],
          [
            72,
            25
          ],
          [
            73,
            47
          ],
          [
            65,
            52
          ],
          [
            57,
            48
          ]
        ],
        "point": [
          66,
          38
        ],
        "kind": "inspect",
        "label": "Inspect the old bottles",
        "evidence": "Cinematic image: actual shelves of old bottles near back-right bar; inspecting them activates reveal only."
      },
      "open": {
        "polygon": [
          [
            66,
            53
          ],
          [
            72,
            51
          ],
          [
            74,
            58
          ],
          [
            74,
            69
          ],
          [
            66,
            71
          ],
          [
            65,
            63
          ]
        ],
        "point": [
          70,
          61
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Hog's Head Cellar",
        "evidence": "Edited cinematic image preserves the base camera and furniture; polygon isolates the newly visible stairs behind the bar.",
        "src": "/assets/images/hogwarts-ai-v1/hogsHead-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "The Hog's Head with a bottle cabinet moved aside and a descending cellar stairway"
      },
      "note": "The bottles shift to reveal a narrow staircase behind the bar. Click the actual stair opening to descend."
    }
  },
  "hogsCellar": {
    "src": "/assets/images/hogwarts-ai-v2/hogsCellar.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hog's Head Cellar — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            17.14,
            26.55
          ],
          [
            22.86,
            26.55
          ],
          [
            27.8,
            44.4
          ],
          [
            31.7,
            72.45
          ],
          [
            8.3,
            72.45
          ],
          [
            12.2,
            44.4
          ]
        ],
        "point": [
          20,
          49.5
        ],
        "kind": "stair",
        "label": "Follow the passage to The Hog's Head",
        "evidence": "Manual approximate aperture on the independent daylight image, near 20% / 49.5%; route identity from atlas graph; final browser click-through QA required."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            72.5,
            43.86
          ],
          [
            76.7,
            47.58
          ],
          [
            79.1,
            55.64
          ],
          [
            78.2,
            64.32
          ],
          [
            75.2,
            70.52
          ],
          [
            69.8,
            70.52
          ],
          [
            66.8,
            64.32
          ],
          [
            65.9,
            55.64
          ],
          [
            68.3,
            47.58
          ]
        ],
        "point": [
          72.5,
          57.5
        ],
        "kind": "inspect",
        "label": "Inspect the weathered statue",
        "evidence": "Approximate hotspot over visible clue in the daylight base scene; click-through review required."
      },
      "open": {
        "polygon": [
          [
            63.06,
            20.3
          ],
          [
            70.5,
            19.78
          ],
          [
            77.94,
            20.3
          ],
          [
            82.9,
            26.28
          ],
          [
            84.14,
            68.4
          ],
          [
            56.86,
            68.4
          ],
          [
            58.1,
            26.28
          ]
        ],
        "point": [
          70.5,
          45
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Humpbacked Witch Passage",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/hogsCellar-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Hog's Head Cellar — cinematic AI scene with visible routes — revealed passage opened"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "honeydukes": {
    "src": "/assets/images/hogwarts-ai-v1/honeydukes.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Honeydukes — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            9,
            16
          ],
          [
            25,
            14
          ],
          [
            32,
            28
          ],
          [
            31,
            61
          ],
          [
            11,
            65
          ]
        ],
        "point": [
          21,
          54
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Cinematic image: open green glazed street-facing double door and exposed floor threshold at left. Manually traced."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            53,
            73
          ],
          [
            76,
            72
          ],
          [
            81,
            81
          ],
          [
            79,
            90
          ],
          [
            57,
            90
          ],
          [
            52,
            84
          ]
        ],
        "point": [
          66,
          82
        ],
        "kind": "inspect",
        "label": "Inspect the floor hatch",
        "evidence": "Cinematic image: visible timber trapdoor in foreground, framed in metal; only inspecting it reveals the cellar."
      },
      "open": {
        "polygon": [
          [
            53,
            73
          ],
          [
            75,
            72
          ],
          [
            81,
            78
          ],
          [
            79,
            86
          ],
          [
            58,
            87
          ],
          [
            52,
            82
          ]
        ],
        "point": [
          66,
          80
        ],
        "kind": "hatch",
        "label": "Enter the revealed passage to Honeydukes Cellar",
        "evidence": "Edited cinematic image keeps the exact shop camera; click polygon follows exposed stairwell inside the lifted trapdoor.",
        "src": "/assets/images/hogwarts-ai-v1/honeydukes-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Honeydukes with the wooden hatch open, revealing a lit stair into the cellar"
      },
      "note": "The trapdoor opens onto a lit stone staircase. Click the revealed stair opening."
    }
  },
  "zonkos": {
    "src": "/assets/images/hogwarts-ai-v2/zonkos.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Zonko's Joke Shop — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            14.5,
            22.35
          ],
          [
            20.5,
            21.81
          ],
          [
            26.5,
            22.35
          ],
          [
            30.5,
            28.56
          ],
          [
            31.5,
            72.3
          ],
          [
            9.5,
            72.3
          ],
          [
            10.5,
            28.56
          ]
        ],
        "point": [
          20.5,
          48
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Manual approximate aperture on the independent daylight image, near 20.5% / 48%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "scribbulus": {
    "src": "/assets/images/hogwarts-ai-v2/scribbulus.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Scrivenshaft's Quill Shop — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            5.2,
            22.525
          ],
          [
            10,
            21.915
          ],
          [
            14.8,
            22.525
          ],
          [
            18,
            29.54
          ],
          [
            18.8,
            78.95
          ],
          [
            1.2,
            78.95
          ],
          [
            2,
            29.54
          ]
        ],
        "point": [
          10,
          51.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Manual approximate aperture on the independent daylight image, near 10% / 51.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "gladrags": {
    "src": "/assets/images/hogwarts-ai-v2/gladrags.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Gladrags Wizardwear — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            7.76,
            20.425
          ],
          [
            14,
            19.855
          ],
          [
            20.24,
            20.425
          ],
          [
            24.4,
            26.98
          ],
          [
            25.44,
            73.15
          ],
          [
            2.56,
            73.15
          ],
          [
            3.6,
            26.98
          ]
        ],
        "point": [
          14,
          47.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Manual approximate aperture on the independent daylight image, near 14% / 47.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "dervish": {
    "src": "/assets/images/hogwarts-ai-v2/dervish.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Dervish and Banges — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            9.5,
            22.475
          ],
          [
            15.5,
            21.885
          ],
          [
            21.5,
            22.475
          ],
          [
            25.5,
            29.26
          ],
          [
            26.5,
            77.05
          ],
          [
            4.5,
            77.05
          ],
          [
            5.5,
            29.26
          ]
        ],
        "point": [
          15.5,
          50.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade High Street",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15.5% / 50.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "puddifoot": {
    "src": "/assets/images/hogwarts-ai-v2/puddifoot.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Madam Puddifoot's Tea Shop — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            8.06,
            15.575
          ],
          [
            15.5,
            14.945
          ],
          [
            22.94,
            15.575
          ],
          [
            27.9,
            22.82
          ],
          [
            29.14,
            73.85
          ],
          [
            1.86,
            73.85
          ],
          [
            3.1,
            22.82
          ]
        ],
        "point": [
          15.5,
          45.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15.5% / 45.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "postOffice": {
    "src": "/assets/images/hogwarts-ai-v2/postOffice.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hogsmeade Post Office — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            7.02,
            24.375
          ],
          [
            13.5,
            23.825
          ],
          [
            19.98,
            24.375
          ],
          [
            24.3,
            30.7
          ],
          [
            25.38,
            75.25
          ],
          [
            1.62,
            75.25
          ],
          [
            2.7,
            30.7
          ]
        ],
        "point": [
          13.5,
          50.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade Village Square",
        "evidence": "Manual approximate aperture on the independent daylight image, near 13.5% / 50.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "shriekingShack": {
    "src": "/assets/images/hogwarts-ai-v2/shriekingShack.jpg",
    "width": 1600,
    "height": 914,
    "alt": "The Shrieking Shack — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            7.8,
            30.225
          ],
          [
            15,
            29.735
          ],
          [
            22.2,
            30.225
          ],
          [
            27,
            35.86
          ],
          [
            28.2,
            75.55
          ],
          [
            1.8,
            75.55
          ],
          [
            3,
            35.86
          ]
        ],
        "point": [
          15,
          53.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogsmeade Hill Road",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15% / 53.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "antechamber": {
    "src": "/assets/images/hogwarts-ai-v1/antechamber.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Great Hall Antechamber — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            82,
            36
          ],
          [
            89,
            30
          ],
          [
            93,
            40
          ],
          [
            93,
            63
          ],
          [
            84,
            70
          ],
          [
            79,
            64
          ]
        ],
        "point": [
          87,
          55
        ],
        "kind": "arch",
        "label": "Follow the passage to Entrance Hall",
        "evidence": "Cinematic image: right-hand lit Gothic corridor, with floor leading toward the far arched entrance. Manual visual polygon; click-through review pending."
      }
    }
  },
  "trophy": {
    "src": "/assets/images/hogwarts-ai-v2/trophy.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Trophy Gallery — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            26.42,
            25.275
          ],
          [
            30.5,
            24.765
          ],
          [
            34.58,
            25.275
          ],
          [
            37.3,
            31.14
          ],
          [
            37.98,
            72.45
          ],
          [
            23.02,
            72.45
          ],
          [
            23.7,
            31.14
          ]
        ],
        "point": [
          30.5,
          49.5
        ],
        "kind": "door",
        "label": "Follow the passage to Third-floor Armour Gallery",
        "evidence": "Manual approximate aperture on the independent daylight image, near 30.5% / 49.5%; route identity from atlas graph; final browser click-through QA required."
      }
    },
    "secret": {
      "trigger": {
        "polygon": [
          [
            55.5,
            50.2
          ],
          [
            61.38,
            52.6
          ],
          [
            64.74,
            57.8
          ],
          [
            63.48,
            63.4
          ],
          [
            59.28,
            67.4
          ],
          [
            51.72,
            67.4
          ],
          [
            47.52,
            63.4
          ],
          [
            46.26,
            57.8
          ],
          [
            49.62,
            52.6
          ]
        ],
        "point": [
          55.5,
          59
        ],
        "kind": "inspect",
        "label": "Inspect the folded parchment",
        "evidence": "Approximate hotspot over visible clue in the daylight base scene; click-through review required."
      },
      "open": {
        "polygon": [
          [
            61.42,
            20.5
          ],
          [
            65.5,
            19.9
          ],
          [
            69.58,
            20.5
          ],
          [
            72.3,
            27.4
          ],
          [
            72.98,
            76
          ],
          [
            58.02,
            76
          ],
          [
            58.7,
            27.4
          ]
        ],
        "point": [
          65.5,
          49
        ],
        "kind": "door",
        "label": "Enter the revealed passage to Marauder's Map Nook",
        "evidence": "Approximate opening polygon on separately generated AI reveal frame; closed/open camera alignment needs visual QA.",
        "src": "/assets/images/hogwarts-ai-v2/trophy-open.jpg",
        "width": 1672,
        "height": 941,
        "alt": "Trophy Gallery — cinematic AI scene with visible routes — revealed passage opened"
      },
      "note": "A previously hidden passage is now visible. Choose its opening to enter."
    }
  },
  "clockTower": {
    "src": "/assets/images/hogwarts-ai-v2/clockTower.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Clock Tower — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            19,
            22.375
          ],
          [
            22.24,
            24.3
          ],
          [
            24.76,
            29.8
          ],
          [
            26.56,
            36.95
          ],
          [
            26.74,
            73.25
          ],
          [
            11.26,
            73.25
          ],
          [
            11.44,
            36.95
          ],
          [
            13.24,
            29.8
          ],
          [
            15.76,
            24.3
          ]
        ],
        "point": [
          19,
          48.5
        ],
        "kind": "arch",
        "label": "Follow the passage to North Battlements",
        "evidence": "Manual approximate aperture on the independent daylight image, near 19% / 48.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "prefectsBath": {
    "src": "/assets/images/hogwarts-ai-v2/prefectsBath.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Prefects' Bathroom — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            5.2,
            14.45
          ],
          [
            10,
            13.87
          ],
          [
            14.8,
            14.45
          ],
          [
            18,
            21.12
          ],
          [
            18.8,
            68.1
          ],
          [
            1.2,
            68.1
          ],
          [
            2,
            21.12
          ]
        ],
        "point": [
          10,
          42
        ],
        "kind": "door",
        "label": "Follow the passage to Second-floor Bathroom Corridor",
        "evidence": "Manual approximate aperture on the independent daylight image, near 10% / 42%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "commonGryff": {
    "src": "/assets/images/hogwarts-ai-v1/commonGryff.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Gryffindor Common Room — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            3,
            27
          ],
          [
            12,
            22
          ],
          [
            22,
            33
          ],
          [
            23,
            66
          ],
          [
            14,
            73
          ],
          [
            2,
            70
          ]
        ],
        "point": [
          13,
          56
        ],
        "kind": "arch",
        "label": "Follow the passage to Fourth-floor Portrait Corridor",
        "evidence": "Cinematic image: open left Gothic arch with connected lit corridor stone floor. Manually traced."
      }
    }
  },
  "commonRaven": {
    "src": "/assets/images/hogwarts-ai-v2/commonRaven.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Ravenclaw Common Room — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            8.76,
            20.55
          ],
          [
            15,
            19.93
          ],
          [
            21.24,
            20.55
          ],
          [
            25.4,
            27.68
          ],
          [
            26.44,
            77.9
          ],
          [
            3.56,
            77.9
          ],
          [
            4.6,
            27.68
          ]
        ],
        "point": [
          15,
          50
        ],
        "kind": "door",
        "label": "Follow the passage to North Battlements",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15% / 50%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "commonHuffle": {
    "src": "/assets/images/hogwarts-ai-v2/commonHuffle.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Hufflepuff Common Room — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            12.76,
            26.3
          ],
          [
            19,
            25.78
          ],
          [
            25.24,
            26.3
          ],
          [
            29.4,
            32.28
          ],
          [
            30.44,
            74.4
          ],
          [
            7.56,
            74.4
          ],
          [
            8.6,
            32.28
          ]
        ],
        "point": [
          19,
          51
        ],
        "kind": "door",
        "label": "Follow the passage to Castle Kitchens",
        "evidence": "Manual approximate aperture on the independent daylight image, near 19% / 51%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "commonSlytherin": {
    "src": "/assets/images/hogwarts-ai-v2/commonSlytherin.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Slytherin Common Room — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            10.5,
            18.6
          ],
          [
            16.5,
            17.96
          ],
          [
            22.5,
            18.6
          ],
          [
            26.5,
            25.96
          ],
          [
            27.5,
            77.8
          ],
          [
            5.5,
            77.8
          ],
          [
            6.5,
            25.96
          ]
        ],
        "point": [
          16.5,
          49
        ],
        "kind": "door",
        "label": "Follow the passage to Serpent Door",
        "evidence": "Manual approximate aperture on the independent daylight image, near 16.5% / 49%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "roRThings": {
    "src": "/assets/images/hogwarts-ai-v2/roRThings.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Room of Hidden Things — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            25,
            27.3
          ],
          [
            28.24,
            29.12
          ],
          [
            30.76,
            34.32
          ],
          [
            32.56,
            41.08
          ],
          [
            32.74,
            75.4
          ],
          [
            17.26,
            75.4
          ],
          [
            17.44,
            41.08
          ],
          [
            19.24,
            34.32
          ],
          [
            21.76,
            29.12
          ]
        ],
        "point": [
          25,
          52
        ],
        "kind": "arch",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Manual approximate aperture on the independent daylight image, near 25% / 52%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "roRDA": {
    "src": "/assets/images/hogwarts-ai-v2/roRDA.jpg",
    "width": 1600,
    "height": 914,
    "alt": "D.A. Training Room — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            16.5,
            18.525
          ],
          [
            22.5,
            17.915
          ],
          [
            28.5,
            18.525
          ],
          [
            32.5,
            25.54
          ],
          [
            33.5,
            74.95
          ],
          [
            11.5,
            74.95
          ],
          [
            12.5,
            25.54
          ]
        ],
        "point": [
          22.5,
          47.5
        ],
        "kind": "door",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Manual approximate aperture on the independent daylight image, near 22.5% / 47.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "roRDiadem": {
    "src": "/assets/images/hogwarts-ai-v2/roRDiadem.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Diadem Niche — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            7.24,
            15.75
          ],
          [
            13,
            15.05
          ],
          [
            18.76,
            15.75
          ],
          [
            22.6,
            23.8
          ],
          [
            23.56,
            80.5
          ],
          [
            2.44,
            80.5
          ],
          [
            3.4,
            23.8
          ]
        ],
        "point": [
          13,
          49
        ],
        "kind": "door",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Manual approximate aperture on the independent daylight image, near 13% / 49%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "roRArchive": {
    "src": "/assets/images/hogwarts-ai-v2/roRArchive.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Living Archive — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            28.2,
            30.25
          ],
          [
            33,
            29.75
          ],
          [
            37.8,
            30.25
          ],
          [
            41,
            36
          ],
          [
            41.8,
            76.5
          ],
          [
            24.2,
            76.5
          ],
          [
            25,
            36
          ]
        ],
        "point": [
          33,
          54
        ],
        "kind": "door",
        "label": "Follow the passage to Room of Requirement",
        "evidence": "Manual approximate aperture on the independent daylight image, near 33% / 54%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "lakeShallows": {
    "src": "/assets/images/hogwarts-ai-v2/lakeShallows.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Black Lake Shallows — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            13.02,
            63.32
          ],
          [
            19.98,
            63.32
          ],
          [
            23.75,
            72.23
          ],
          [
            29.26,
            93.35
          ],
          [
            3.74,
            93.35
          ],
          [
            9.25,
            72.23
          ]
        ],
        "point": [
          16.5,
          78.5
        ],
        "kind": "path",
        "label": "Follow the passage to Black Lake Islet",
        "evidence": "Manual approximate aperture on the independent daylight image, near 16.5% / 78.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            45.97,
            47
          ],
          [
            51.03,
            47
          ],
          [
            55.4,
            61
          ],
          [
            58.85,
            83
          ],
          [
            38.15,
            83
          ],
          [
            41.6,
            61
          ]
        ],
        "point": [
          48.5,
          65
        ],
        "kind": "stair",
        "label": "Follow the passage to Black Lake Underwater Cave",
        "evidence": "Manual approximate aperture on the independent daylight image, near 48.5% / 65%; route identity from atlas graph; final browser click-through QA required."
      },
      "s": {
        "polygon": [
          [
            82.12,
            32.92
          ],
          [
            87.88,
            32.92
          ],
          [
            91,
            45.88
          ],
          [
            95.56,
            76.6
          ],
          [
            74.44,
            76.6
          ],
          [
            79,
            45.88
          ]
        ],
        "point": [
          85,
          55
        ],
        "kind": "path",
        "label": "Follow the passage to Old Pier",
        "evidence": "Manual approximate aperture on the independent daylight image, near 85% / 55%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "boatLaunch": {
    "src": "/assets/images/hogwarts-ai-v2/boatLaunch.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Boathouse Launch — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            40.36,
            19.88
          ],
          [
            45.64,
            19.88
          ],
          [
            48.5,
            32.57
          ],
          [
            52.68,
            62.65
          ],
          [
            33.32,
            62.65
          ],
          [
            37.5,
            32.57
          ]
        ],
        "point": [
          43,
          41.5
        ],
        "kind": "path",
        "label": "Follow the passage to The Boathouse",
        "evidence": "Manual approximate aperture on the independent daylight image, near 43% / 41.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "lakeCave": {
    "src": "/assets/images/hogwarts-ai-v2/lakeCave.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Black Lake Underwater Cave — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            15.5,
            35.1
          ],
          [
            20.36,
            36.64
          ],
          [
            24.14,
            41.04
          ],
          [
            26.84,
            46.76
          ],
          [
            27.11,
            75.8
          ],
          [
            3.89,
            75.8
          ],
          [
            4.16,
            46.76
          ],
          [
            6.86,
            41.04
          ],
          [
            10.64,
            36.64
          ]
        ],
        "point": [
          15.5,
          56
        ],
        "kind": "arch",
        "label": "Follow the passage to Black Lake Shallows",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15.5% / 56%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            85,
            25.2
          ],
          [
            89.32,
            26.88
          ],
          [
            92.68,
            31.68
          ],
          [
            95.08,
            37.92
          ],
          [
            95.32,
            69.6
          ],
          [
            74.68,
            69.6
          ],
          [
            74.92,
            37.92
          ],
          [
            77.32,
            31.68
          ],
          [
            80.68,
            26.88
          ]
        ],
        "point": [
          85,
          48
        ],
        "kind": "arch",
        "label": "Follow the passage to Merpeople Village",
        "evidence": "Manual approximate aperture on the independent daylight image, near 85% / 48%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "merVillage": {
    "src": "/assets/images/hogwarts-ai-v1/merVillage.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Merpeople Village — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            0,
            30
          ],
          [
            9,
            26
          ],
          [
            24,
            31
          ],
          [
            29,
            43
          ],
          [
            27,
            64
          ],
          [
            10,
            73
          ],
          [
            0,
            75
          ]
        ],
        "point": [
          16,
          56
        ],
        "kind": "arch",
        "label": "Follow the passage to Black Lake Underwater Cave",
        "evidence": "Cinematic underwater image: open rock tunnel on the left with clear stone approach connecting to the foreground. Manually traced."
      }
    }
  },
  "lakeIslet": {
    "src": "/assets/images/hogwarts-ai-v2/lakeIslet.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Black Lake Islet — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            23.3,
            64.36
          ],
          [
            31.7,
            64.36
          ],
          [
            36.25,
            73.54
          ],
          [
            42.9,
            95.3
          ],
          [
            12.1,
            95.3
          ],
          [
            18.75,
            73.54
          ]
        ],
        "point": [
          27.5,
          80
        ],
        "kind": "path",
        "label": "Follow the passage to Black Lake Shallows",
        "evidence": "Manual approximate aperture on the independent daylight image, near 27.5% / 80%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "willowRoots": {
    "src": "/assets/images/hogwarts-ai-v2/willowRoots.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Whomping Willow Roots — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            11.02,
            39.76
          ],
          [
            17.98,
            39.76
          ],
          [
            21.75,
            51.64
          ],
          [
            27.26,
            79.8
          ],
          [
            1.74,
            79.8
          ],
          [
            7.25,
            51.64
          ]
        ],
        "point": [
          14.5,
          60
        ],
        "kind": "path",
        "label": "Follow the passage to South Courtyard",
        "evidence": "Manual approximate aperture on the independent daylight image, near 14.5% / 60%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "centaurGrove": {
    "src": "/assets/images/hogwarts-ai-v2/centaurGrove.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Centaur Grove — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            11.4,
            45.52
          ],
          [
            18.6,
            45.52
          ],
          [
            22.5,
            55.78
          ],
          [
            28.2,
            80.1
          ],
          [
            1.8,
            80.1
          ],
          [
            7.5,
            55.78
          ]
        ],
        "point": [
          15,
          63
        ],
        "kind": "path",
        "label": "Follow the passage to Ancient Clearing",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15% / 63%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            77.4,
            43.6
          ],
          [
            84.6,
            43.6
          ],
          [
            88.5,
            54.4
          ],
          [
            94.2,
            80
          ],
          [
            67.8,
            80
          ],
          [
            73.5,
            54.4
          ]
        ],
        "point": [
          81,
          62
        ],
        "kind": "path",
        "label": "Follow the passage to Unicorn Glade",
        "evidence": "Manual approximate aperture on the independent daylight image, near 81% / 62%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "unicornGlade": {
    "src": "/assets/images/hogwarts-ai-v2/unicornGlade.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Unicorn Glade — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            47.74,
            82.64
          ],
          [
            53.26,
            82.64
          ],
          [
            56.25,
            86.96
          ],
          [
            60.62,
            97.2
          ],
          [
            40.38,
            97.2
          ],
          [
            44.75,
            86.96
          ]
        ],
        "point": [
          50.5,
          90
        ],
        "kind": "path",
        "label": "Follow the passage to Centaur Grove",
        "evidence": "Manual approximate aperture on the independent daylight image, near 50.5% / 90%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "acromantulaDen": {
    "src": "/assets/images/hogwarts-ai-v2/acromantulaDen.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Acromantula Den — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            8.36,
            29.04
          ],
          [
            13.64,
            29.04
          ],
          [
            16.5,
            42.81
          ],
          [
            20.68,
            75.45
          ],
          [
            1.32,
            75.45
          ],
          [
            5.5,
            42.81
          ]
        ],
        "point": [
          11,
          52.5
        ],
        "kind": "path",
        "label": "Follow the passage to Forbidden Forest",
        "evidence": "Manual approximate aperture on the independent daylight image, near 11% / 52.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "coveredBridge": {
    "src": "/assets/images/hogwarts-ai-v2/coveredBridge.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Covered Bridge — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            44.58,
            85.56
          ],
          [
            54.42,
            85.56
          ],
          [
            59.75,
            89.34
          ],
          [
            67.54,
            98.3
          ],
          [
            31.46,
            98.3
          ],
          [
            39.25,
            89.34
          ]
        ],
        "point": [
          49.5,
          92
        ],
        "kind": "path",
        "label": "Follow the passage to Stone Viaduct",
        "evidence": "Manual approximate aperture on the independent daylight image, near 49.5% / 92%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "herbCourt": {
    "src": "/assets/images/hogwarts-ai-v2/herbCourt.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Herbology Courtyard — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            8.8,
            9.8
          ],
          [
            16,
            9.08
          ],
          [
            23.2,
            9.8
          ],
          [
            28,
            18.08
          ],
          [
            29.2,
            76.4
          ],
          [
            2.8,
            76.4
          ],
          [
            4,
            18.08
          ]
        ],
        "point": [
          16,
          44
        ],
        "kind": "door",
        "label": "Follow the passage to Glasshouse Passage",
        "evidence": "Manual approximate aperture on the independent daylight image, near 16% / 44%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "outerSlope": {
    "src": "/assets/images/hogwarts-ai-v2/outerSlope.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Castle Outer Slope — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            31.84,
            35.8
          ],
          [
            36.16,
            35.8
          ],
          [
            38.5,
            47.95
          ],
          [
            41.92,
            76.75
          ],
          [
            26.08,
            76.75
          ],
          [
            29.5,
            47.95
          ]
        ],
        "point": [
          34,
          56.5
        ],
        "kind": "path",
        "label": "Follow the passage to The Lantern Path",
        "evidence": "Manual approximate aperture on the independent daylight image, near 34% / 56.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "quidStands": {
    "src": "/assets/images/hogwarts-ai-v1/quidStands.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Quidditch Stands — photorealistic cinematic explorable scene",
    "exits": {
      "n": {
        "polygon": [
          [
            0,
            94
          ],
          [
            9,
            79
          ],
          [
            16,
            67
          ],
          [
            27,
            63
          ],
          [
            40,
            75
          ],
          [
            45,
            95
          ]
        ],
        "point": [
          24,
          83
        ],
        "kind": "stair",
        "label": "Follow the passage to Quidditch Pitch",
        "evidence": "Cinematic image: visible descending timber staircase at left connects stadium stand with Quidditch pitch. Manually traced."
      },
      "e": {
        "polygon": [
          [
            81,
            31
          ],
          [
            85,
            26
          ],
          [
            94,
            28
          ],
          [
            96,
            63
          ],
          [
            89,
            71
          ],
          [
            80,
            64
          ]
        ],
        "point": [
          89,
          53
        ],
        "kind": "arch",
        "label": "Follow the passage to Quidditch Changing Rooms",
        "evidence": "Cinematic image: visibly open Gothic timber corridor at right leads toward auxiliary rooms. Manually traced."
      }
    }
  },
  "quidChanging": {
    "src": "/assets/images/hogwarts-ai-v2/quidChanging.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Quidditch Changing Rooms — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            4.68,
            27.275
          ],
          [
            9,
            26.765
          ],
          [
            13.32,
            27.275
          ],
          [
            16.2,
            33.14
          ],
          [
            16.92,
            74.45
          ],
          [
            1.08,
            74.45
          ],
          [
            1.8,
            33.14
          ]
        ],
        "point": [
          9,
          51.5
        ],
        "kind": "door",
        "label": "Follow the passage to Quidditch Stands",
        "evidence": "Manual approximate aperture on the independent daylight image, near 9% / 51.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            89.38,
            24.425
          ],
          [
            92.5,
            23.855
          ],
          [
            95.62,
            24.425
          ],
          [
            97.7,
            30.98
          ],
          [
            98.22,
            77.15
          ],
          [
            86.78,
            77.15
          ],
          [
            87.3,
            30.98
          ]
        ],
        "point": [
          92.5,
          51.5
        ],
        "kind": "door",
        "label": "Follow the passage to Quidditch Equipment Store",
        "evidence": "Manual approximate aperture on the independent daylight image, near 92.5% / 51.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "quidKit": {
    "src": "/assets/images/hogwarts-ai-v2/quidKit.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Quidditch Equipment Store — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            11.76,
            22.5
          ],
          [
            18,
            21.9
          ],
          [
            24.24,
            22.5
          ],
          [
            28.4,
            29.4
          ],
          [
            29.44,
            78
          ],
          [
            6.56,
            78
          ],
          [
            7.6,
            29.4
          ]
        ],
        "point": [
          18,
          51
        ],
        "kind": "door",
        "label": "Follow the passage to Quidditch Changing Rooms",
        "evidence": "Manual approximate aperture on the independent daylight image, near 18% / 51%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "quidReferee": {
    "src": "/assets/images/hogwarts-ai-v2/quidReferee.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Quidditch Referee Tower — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            10.8,
            17.5
          ],
          [
            15.2,
            17.5
          ],
          [
            19,
            42
          ],
          [
            22,
            80.5
          ],
          [
            4,
            80.5
          ],
          [
            7,
            42
          ]
        ],
        "point": [
          13,
          49
        ],
        "kind": "stair",
        "label": "Follow the passage to Quidditch Pitch",
        "evidence": "Manual approximate aperture on the independent daylight image, near 13% / 49%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "quidGoals": {
    "src": "/assets/images/hogwarts-ai-v2/quidGoals.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Quidditch Goal Hoops — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            12.88,
            53.52
          ],
          [
            19.12,
            53.52
          ],
          [
            22.5,
            63.78
          ],
          [
            27.44,
            88.1
          ],
          [
            4.56,
            88.1
          ],
          [
            9.5,
            63.78
          ]
        ],
        "point": [
          16,
          71
        ],
        "kind": "path",
        "label": "Follow the passage to Quidditch Pitch",
        "evidence": "Manual approximate aperture on the independent daylight image, near 16% / 71%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            74.74,
            59.32
          ],
          [
            80.26,
            59.32
          ],
          [
            83.25,
            68.23
          ],
          [
            87.62,
            89.35
          ],
          [
            67.38,
            89.35
          ],
          [
            71.75,
            68.23
          ]
        ],
        "point": [
          77.5,
          74.5
        ],
        "kind": "path",
        "label": "Follow the passage to Quidditch Trophy Walk",
        "evidence": "Manual approximate aperture on the independent daylight image, near 77.5% / 74.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "quidTrophies": {
    "src": "/assets/images/hogwarts-ai-v2/quidTrophies.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Quidditch Trophy Walk — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            44.06,
            84.6
          ],
          [
            52.94,
            84.6
          ],
          [
            57.75,
            88.65
          ],
          [
            64.78,
            98.25
          ],
          [
            32.22,
            98.25
          ],
          [
            39.25,
            88.65
          ]
        ],
        "point": [
          48.5,
          91.5
        ],
        "kind": "path",
        "label": "Follow the passage to Quidditch Goal Hoops",
        "evidence": "Manual approximate aperture on the independent daylight image, near 48.5% / 91.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "flyingShed": {
    "src": "/assets/images/hogwarts-ai-v2/flyingShed.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Flying Lesson Equipment Shed — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            5.98,
            37.15
          ],
          [
            11.5,
            36.69
          ],
          [
            17.02,
            37.15
          ],
          [
            20.7,
            42.44
          ],
          [
            21.62,
            79.7
          ],
          [
            1.38,
            79.7
          ],
          [
            2.3,
            42.44
          ]
        ],
        "point": [
          11.5,
          59
        ],
        "kind": "door",
        "label": "Follow the passage to Flying-lesson Lawn",
        "evidence": "Manual approximate aperture on the independent daylight image, near 11.5% / 59%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "owlDrop": {
    "src": "/assets/images/hogwarts-ai-v2/owlDrop.jpg",
    "width": 1600,
    "height": 914,
    "alt": "Owl Delivery Ledge — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            9.98,
            17.675
          ],
          [
            15.5,
            17.005
          ],
          [
            21.02,
            17.675
          ],
          [
            24.7,
            25.38
          ],
          [
            25.62,
            79.65
          ],
          [
            5.38,
            79.65
          ],
          [
            6.3,
            25.38
          ]
        ],
        "point": [
          15.5,
          49.5
        ],
        "kind": "door",
        "label": "Follow the passage to The Owlery",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15.5% / 49.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "humpbackTunnel": {
    "src": "/assets/images/hogwarts-ai-v2/humpbackTunnel.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Humpbacked Witch Passage — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            16.42,
            20.25
          ],
          [
            20.5,
            19.75
          ],
          [
            24.58,
            20.25
          ],
          [
            27.3,
            26
          ],
          [
            27.98,
            66.5
          ],
          [
            13.02,
            66.5
          ],
          [
            13.7,
            26
          ]
        ],
        "point": [
          20.5,
          44
        ],
        "kind": "door",
        "label": "Follow the passage to Hog's Head Cellar",
        "evidence": "Manual approximate aperture on the independent daylight image, near 20.5% / 44%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "serpentDoor": {
    "src": "/assets/images/hogwarts-ai-v2/serpentDoor.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Serpent Door — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            14.5,
            29.35
          ],
          [
            18.28,
            31.24
          ],
          [
            21.22,
            36.64
          ],
          [
            23.32,
            43.66
          ],
          [
            23.53,
            79.3
          ],
          [
            5.47,
            79.3
          ],
          [
            5.68,
            43.66
          ],
          [
            7.78,
            36.64
          ],
          [
            10.72,
            31.24
          ]
        ],
        "point": [
          14.5,
          55
        ],
        "kind": "arch",
        "label": "Follow the passage to Slytherin Common Room",
        "evidence": "Manual approximate aperture on the independent daylight image, near 14.5% / 55%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            84.5,
            25.475
          ],
          [
            88.64,
            27.54
          ],
          [
            91.86,
            33.44
          ],
          [
            94.16,
            41.11
          ],
          [
            94.39,
            80.05
          ],
          [
            74.61,
            80.05
          ],
          [
            74.84,
            41.11
          ],
          [
            77.14,
            33.44
          ],
          [
            80.36,
            27.54
          ]
        ],
        "point": [
          84.5,
          53.5
        ],
        "kind": "arch",
        "label": "Follow the passage to Green Lantern Passage",
        "evidence": "Manual approximate aperture on the independent daylight image, near 84.5% / 53.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "trapdoorChamber": {
    "src": "/assets/images/hogwarts-ai-v2/trapdoorChamber.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Trapdoor Chamber — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            12.2,
            25.375
          ],
          [
            17,
            24.825
          ],
          [
            21.8,
            25.375
          ],
          [
            25,
            31.7
          ],
          [
            25.8,
            76.25
          ],
          [
            8.2,
            76.25
          ],
          [
            9,
            31.7
          ]
        ],
        "point": [
          17,
          51.5
        ],
        "kind": "door",
        "label": "Follow the passage to Archive Passage",
        "evidence": "Manual approximate aperture on the independent daylight image, near 17% / 51.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "mirrorChamber": {
    "src": "/assets/images/hogwarts-ai-v2/mirrorChamber.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Mirror of Erised Chamber — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            9.5,
            23.575
          ],
          [
            15.5,
            22.945
          ],
          [
            21.5,
            23.575
          ],
          [
            25.5,
            30.82
          ],
          [
            26.5,
            81.85
          ],
          [
            4.5,
            81.85
          ],
          [
            5.5,
            30.82
          ]
        ],
        "point": [
          15.5,
          53.5
        ],
        "kind": "door",
        "label": "Follow the passage to Fourth-floor Portrait Corridor",
        "evidence": "Manual approximate aperture on the independent daylight image, near 15.5% / 53.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "mapNook": {
    "src": "/assets/images/hogwarts-ai-v2/mapNook.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Marauder's Map Nook — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            6.24,
            16.525
          ],
          [
            12,
            15.915
          ],
          [
            17.76,
            16.525
          ],
          [
            21.6,
            23.54
          ],
          [
            22.56,
            72.95
          ],
          [
            1.44,
            72.95
          ],
          [
            2.4,
            23.54
          ]
        ],
        "point": [
          12,
          45.5
        ],
        "kind": "door",
        "label": "Follow the passage to Trophy Gallery",
        "evidence": "Manual approximate aperture on the independent daylight image, near 12% / 45.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "restrictedStacks": {
    "src": "/assets/images/hogwarts-ai-v2/restrictedStacks.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Library Restricted Section — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            33.42,
            33.175
          ],
          [
            37.5,
            32.705
          ],
          [
            41.58,
            33.175
          ],
          [
            44.3,
            38.58
          ],
          [
            44.98,
            76.65
          ],
          [
            30.02,
            76.65
          ],
          [
            30.7,
            38.58
          ]
        ],
        "point": [
          37.5,
          55.5
        ],
        "kind": "door",
        "label": "Follow the passage to Hogwarts Library",
        "evidence": "Manual approximate aperture on the independent daylight image, near 37.5% / 55.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "oneEyedTunnel": {
    "src": "/assets/images/hogwarts-ai-v2/oneEyedTunnel.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "One-Eyed Witch Tunnel — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            21,
            22.4
          ],
          [
            24.96,
            24.36
          ],
          [
            28.04,
            29.96
          ],
          [
            30.24,
            37.24
          ],
          [
            30.46,
            74.2
          ],
          [
            11.54,
            74.2
          ],
          [
            11.76,
            37.24
          ],
          [
            13.96,
            29.96
          ],
          [
            17.04,
            24.36
          ]
        ],
        "point": [
          21,
          49
        ],
        "kind": "arch",
        "label": "Follow the passage to Honeydukes Cellar",
        "evidence": "Manual approximate aperture on the independent daylight image, near 21% / 49%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            69.14,
            23.95
          ],
          [
            74.86,
            23.95
          ],
          [
            79.8,
            44.6
          ],
          [
            83.7,
            77.05
          ],
          [
            60.3,
            77.05
          ],
          [
            64.2,
            44.6
          ]
        ],
        "point": [
          72,
          50.5
        ],
        "kind": "stair",
        "label": "Follow the passage to Second-floor Bathroom Corridor",
        "evidence": "Manual approximate aperture on the independent daylight image, near 72% / 50.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "honeyCellar": {
    "src": "/assets/images/hogwarts-ai-v2/honeyCellar.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Honeydukes Cellar — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            13.5,
            25.275
          ],
          [
            18.36,
            27.06
          ],
          [
            22.14,
            32.16
          ],
          [
            24.84,
            38.79
          ],
          [
            25.11,
            72.45
          ],
          [
            1.89,
            72.45
          ],
          [
            2.16,
            38.79
          ],
          [
            4.86,
            32.16
          ],
          [
            8.64,
            27.06
          ]
        ],
        "point": [
          13.5,
          49.5
        ],
        "kind": "arch",
        "label": "Follow the passage to One-Eyed Witch Tunnel",
        "evidence": "Manual approximate aperture on the independent daylight image, near 13.5% / 49.5%; route identity from atlas graph; final browser click-through QA required."
      },
      "e": {
        "polygon": [
          [
            84.36,
            17.65
          ],
          [
            89.64,
            17.65
          ],
          [
            94.2,
            43.2
          ],
          [
            97.8,
            83.35
          ],
          [
            76.2,
            83.35
          ],
          [
            79.8,
            43.2
          ]
        ],
        "point": [
          87,
          50.5
        ],
        "kind": "stair",
        "label": "Follow the passage to Honeydukes",
        "evidence": "Manual approximate aperture on the independent daylight image, near 87% / 50.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "whisperingCrypt": {
    "src": "/assets/images/hogwarts-ai-v2/whisperingCrypt.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Whispering Crypt — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            12.72,
            14.7
          ],
          [
            18,
            14.02
          ],
          [
            23.28,
            14.7
          ],
          [
            26.8,
            22.52
          ],
          [
            27.68,
            77.6
          ],
          [
            8.32,
            77.6
          ],
          [
            9.2,
            22.52
          ]
        ],
        "point": [
          18,
          47
        ],
        "kind": "door",
        "label": "Follow the passage to Forgotten Crypt",
        "evidence": "Manual approximate aperture on the independent daylight image, near 18% / 47%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  },
  "forgottenArmory": {
    "src": "/assets/images/hogwarts-ai-v2/forgottenArmory.jpg",
    "width": 2016,
    "height": 1152,
    "alt": "Forgotten Armoury — cinematic AI scene with visible routes",
    "exits": {
      "n": {
        "polygon": [
          [
            9.28,
            20.625
          ],
          [
            16,
            19.975
          ],
          [
            22.72,
            20.625
          ],
          [
            27.2,
            28.1
          ],
          [
            28.32,
            80.75
          ],
          [
            3.68,
            80.75
          ],
          [
            4.8,
            28.1
          ]
        ],
        "point": [
          16,
          51.5
        ],
        "kind": "door",
        "label": "Follow the passage to Third-floor Armour Gallery",
        "evidence": "Manual approximate aperture on the independent daylight image, near 16% / 51.5%; route identity from atlas graph; final browser click-through QA required."
      }
    }
  }
};
})();


/* Daylight AI backgrounds for expansion scenes. Hotspot polygons and exits stay in the audited scene records above. */
(function(){
  const jpgV1 = new Set(["antechamber","broomsPub","commonGryff","hogsHead","hogsSquare","honeydukes","merVillage","quidStands"]);
  const jpgIds = ["acromantulaDen","antechamber","boatLaunch","broomsPorch","broomsPub","centaurGrove","clockTower","commonGryff","commonHuffle","commonRaven","commonSlytherin","coveredBridge","dervish","flyingShed","gladrags","herbCourt","hogsBridge","hogsCellar","hogsHead","hogsHeadPorch","hogsHigh","hogsRoad","hogsStation","lakeCave","lakeIslet","lakeShallows","merVillage","outerSlope","owlDrop","postOffice","puddifoot","quidChanging","quidGoals","quidKit","quidStands","quidTrophies","roRArchive","roRDA","roRDiadem","roRThings","scribbulus","shriekingShack","trophy","unicornGlade","willowRoots","zonkos"];
  const ai = {};
  jpgIds.forEach((id) => {
    const dir = jpgV1.has(id) ? "hogwarts-ai-v1" : "hogwarts-ai-v2";
    ai[id] = {src: "/assets/images/" + dir + "/" + id + ".jpg", width: jpgV1.has(id) ? 1672 : 1600, height: jpgV1.has(id) ? 941 : 914};
  });
  Object.entries(ai).forEach(([id, asset]) => {
    const scene = window.HogwartsScenes[id];
    if (scene) Object.assign(scene, asset);
  });
})();

             (function(){const o={hogsHead:{src:"/assets/images/hogwarts-ai-v1/hogsHead-open.jpg",width:1672,height:940},honeydukes:{src:"/assets/images/hogwarts-ai-v1/honeydukes-open.jpg",width:1672,height:940}};Object.entries(o).forEach(([i,a])=>{const s=window.HogwartsScenes[i];if(s&&s.secret&&s.secret.open)Object.assign(s.secret.open,a);});})();
