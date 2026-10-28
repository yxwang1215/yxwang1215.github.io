/* Sourced geographic notes and schematic positions. All navigable edges are derived from the live atlas. */
(function(){
  "use strict";
  var data={
  "reviewed": "2026-10-27",
  "nodes": {
    "gate": {
      "label": "Hogwarts Entrance",
      "floor": "Ground level · Castle entrance",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "This is the castle's main entrance, not the winged-boar gateway on the school boundary. The Entrance Hall is just beyond the doors.",
      "sources": [
        "entry",
        "arrival"
      ],
      "position": [
        160,
        675
      ],
      "hidden": false
    },
    "forecourt": {
      "label": "The Lantern Path",
      "floor": "School grounds · Castle approach",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "The approach is shortened for exploration; one scene transition represents a section of a walk, not a direct route from a London platform to Hogwarts.",
      "sources": [
        "arrival"
      ],
      "position": [
        160,
        775
      ],
      "hidden": false
    },
    "entry": {
      "label": "Entrance Hall",
      "floor": "Ground floor · Entrance level",
      "group": "keep",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The novels describe the Entrance Hall, doors to the Great Hall, an ascending staircase and steps descending towards the kitchens.",
      "sources": [
        "entry"
      ],
      "position": [
        160,
        1070
      ],
      "hidden": false
    },
    "great": {
      "label": "The Great Hall",
      "floor": "Ground floor · Entrance level",
      "group": "keep",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The Great Hall is used for meals and gatherings. The kitchens are directly beneath it, not reached through an invented side door.",
      "sources": [
        "entry",
        "kitchens"
      ],
      "position": [
        320,
        1070
      ],
      "hidden": false
    },
    "kitchens": {
      "label": "Castle Kitchens",
      "floor": "Basement · Beneath the Great Hall",
      "group": "dungeons",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Descend from the Entrance Hall into the basement passage. The pear in the fruit portrait becomes a handle to reveal the kitchen; this chart depicts the opened entrance.",
      "sources": [
        "kitchens"
      ],
      "position": [
        800,
        1070
      ],
      "hidden": false
    },
    "pantry": {
      "label": "Copper Pantry",
      "floor": "Basement · Kitchen service wing",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "An additional storeroom for the kitchen wing. Its name and layout are inventions of this site.",
      "sources": [],
      "position": [
        1035,
        1070
      ],
      "hidden": false
    },
    "gallery": {
      "label": "Fourth-floor Portrait Corridor",
      "floor": "Fourth floor",
      "group": "academic",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "The fourth-floor setting follows chapter references; the exact portrait corridor and neighbouring door positions are reconstructed.",
      "sources": [
        "fourth",
        "library"
      ],
      "position": [
        900,
        455
      ],
      "hidden": false
    },
    "armoury": {
      "label": "Third-floor Armour Gallery",
      "floor": "Third floor",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The books place the Armour Gallery on the third floor near the Trophy Room. It is a destination rather than a shortcut.",
      "sources": [
        "armour"
      ],
      "position": [
        700,
        365
      ],
      "hidden": false
    },
    "cloister": {
      "label": "East Cloister",
      "floor": "School grounds · Covered cloister",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "A covered passage added to link the courtyard and greenhouses. 'East Cloister' is not a verified location name in the novels.",
      "sources": [],
      "position": [
        370,
        675
      ],
      "hidden": false
    },
    "hospital": {
      "label": "Hospital Wing",
      "floor": "First floor · Reconstructed placement",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "uncertain",
      "note": "Chamber of Secrets chapter 13 supports a first-floor location; a later route in Order of the Phoenix chapter 32 suggests a higher floor. The site selects a first-floor reconstruction.",
      "sources": [
        "hospital"
      ],
      "position": [
        150,
        365
      ],
      "hidden": false
    },
    "transfig": {
      "label": "Transfiguration",
      "floor": "First floor · Site placement; canon uncertain",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "interpretation",
      "note": "The novels do not specify a fixed floor for Transfiguration. This reconstruction places the classroom off the first-floor teaching corridor.",
      "sources": [
        "transfig"
      ],
      "position": [
        430,
        525
      ],
      "hidden": false
    },
    "baths": {
      "label": "Second-floor Bathroom Corridor",
      "floor": "Second floor",
      "group": "academic",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "A plausible second-floor corridor towards Myrtle's Bathroom, replacing the previous abandoned-washroom setting.",
      "sources": [
        "bathroom"
      ],
      "position": [
        900,
        525
      ],
      "hidden": false
    },
    "bathroom": {
      "label": "Myrtle's Bathroom",
      "floor": "Second floor",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Later references place Myrtle's Bathroom on the second floor. A serpent mark on a brass tap reveals the pipe opening; discover it before entering.",
      "sources": [
        "myrtle",
        "bathroom"
      ],
      "position": [
        1080,
        525
      ],
      "hidden": false
    },
    "history": {
      "label": "History of Magic",
      "floor": "First floor",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "canon",
      "note": "History of Magic takes place on the first floor. Its classroom is accessed through a shared corridor and is not itself a thoroughfare.",
      "sources": [
        "history"
      ],
      "position": [
        430,
        365
      ],
      "hidden": false
    },
    "staircase": {
      "label": "Grand Staircase",
      "floor": "Multiple floors · Stairway junction",
      "group": "keep",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "Several sets of stairs and landings are condensed into one navigation point. The moving staircase is not a precise canonical castle floor plan.",
      "sources": [
        "entry",
        "hogwarts"
      ],
      "position": [
        250,
        1150
      ],
      "hidden": false
    },
    "corridor": {
      "label": "Seventh-floor Corridor",
      "floor": "Seventh floor",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "On the seventh floor, the tapestry of dancing trolls faces the blank wall where the Room of Requirement appears. The entrance is not behind the tapestry.",
      "sources": [
        "requirement",
        "requirementBook"
      ],
      "position": [
        420,
        198
      ],
      "hidden": false
    },
    "library": {
      "label": "Hogwarts Library",
      "floor": "Fourth floor",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Chapter-based references place the library on the fourth floor. It no longer provides an invented shortcut to the Headmaster's Office.",
      "sources": [
        "fourth",
        "library"
      ],
      "position": [
        1080,
        455
      ],
      "hidden": false
    },
    "charms": {
      "label": "Charms",
      "floor": "Third floor",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The third-floor Charms corridor informs this reconstruction; the classroom is reached from the middle landings as a separate destination.",
      "sources": [
        "charms"
      ],
      "position": [
        900,
        365
      ],
      "hidden": false
    },
    "defense": {
      "label": "Defence Against the Dark Arts",
      "floor": "First floor · Route-based inference",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "inferred",
      "note": "Placed on the first floor by inference from Chamber of Secrets chapter 6. Lupin's Boggart demonstration occurs in the staff room, not demonstrably in this classroom.",
      "sources": [
        "defense",
        "staffWardrobe"
      ],
      "position": [
        150,
        525
      ],
      "hidden": false
    },
    "office": {
      "label": "Headmaster's Office",
      "floor": "Tower · Entrance floor uncertain",
      "group": "towers",
      "status": "canon",
      "floorStatus": "uncertain",
      "note": "A gargoyle and spiral staircase are consistent entrance features. The books vary on entrance floor; the seventh-floor approach here is a reconstruction.",
      "sources": [
        "head"
      ],
      "position": [
        160,
        198
      ],
      "hidden": false
    },
    "astrStair": {
      "label": "Spiral Ascent",
      "floor": "Astronomy Tower · Ascending stair",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The spiral ascent to the Astronomy Tower has support in the books; the precise battlement connection is reconstructed.",
      "sources": [
        "astronomyBook"
      ],
      "position": [
        900,
        198
      ],
      "hidden": false
    },
    "astrTower": {
      "label": "Astronomy Tower",
      "floor": "Summit of the highest tower",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Hogwarts' highest tower is reached by its own stairway, not by passing through Divination.",
      "sources": [
        "astronomy",
        "astronomyBook"
      ],
      "position": [
        1080,
        198
      ],
      "hidden": false
    },
    "divination": {
      "label": "Divination",
      "floor": "North Tower",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The North Tower landing has a trapdoor above it, reached by a silver ladder. The return path uses the same opening.",
      "sources": [
        "divination"
      ],
      "position": [
        160,
        105
      ],
      "hidden": false
    },
    "owlery": {
      "label": "The Owlery",
      "floor": "West Tower · Summit",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The Owlery stands atop the West Tower. Its route does not require passing through the Headmaster's Office.",
      "sources": [
        "owlery",
        "owleryBook"
      ],
      "position": [
        680,
        105
      ],
      "hidden": false
    },
    "ramparts": {
      "label": "North Battlements",
      "floor": "Upper levels · Tower junction",
      "group": "towers",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "A scenic junction between tower routes. Some intermediate stairs and passages are condensed and not claimed as a canonical floor plan.",
      "sources": [
        "astronomyBook"
      ],
      "position": [
        680,
        198
      ],
      "hidden": false
    },
    "dungeonSteps": {
      "label": "Dungeon Stairwell",
      "floor": "Basement · Dungeon stair",
      "group": "dungeons",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "Stairs descend from the service basement into the dungeons, separately from the much deeper pipe towards the Chamber.",
      "sources": [
        "entry"
      ],
      "position": [
        565,
        1160
      ],
      "hidden": false
    },
    "potions": {
      "label": "Potions",
      "floor": "Dungeons",
      "group": "dungeons",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Potions lessons take place in the dungeons. The room opens back to the Green Lantern Passage, not directly to an underground reservoir.",
      "sources": [
        "potions"
      ],
      "position": [
        1035,
        1160
      ],
      "hidden": false
    },
    "oldArchive": {
      "label": "Archive Passage",
      "floor": "Basement · Site reconstruction",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "An invented archive passage connecting the cellars and storage rooms; a route rather than a private reading room.",
      "sources": [],
      "position": [
        800,
        1245
      ],
      "hidden": false
    },
    "crypt": {
      "label": "Forgotten Crypt",
      "floor": "Basement · Site reconstruction",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "An additional crypt setting created for this site, not a named canonical chamber.",
      "sources": [],
      "position": [
        565,
        1245
      ],
      "hidden": false
    },
    "slytherin": {
      "label": "Green Lantern Passage",
      "floor": "Basement · Site reconstruction",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "A reconstructed underground junction; it is not the Slytherin Common Room.",
      "sources": [],
      "position": [
        800,
        1160
      ],
      "hidden": false
    },
    "reservoir": {
      "label": "Underground Reservoir",
      "floor": "Basement · Site reconstruction",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "An invented reservoir. Visitors use the visible dry stone walkway, never the water surface.",
      "sources": [],
      "position": [
        1035,
        1245
      ],
      "hidden": false
    },
    "vault": {
      "label": "Old Storeroom",
      "floor": "Basement · Site reconstruction",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "A reconstructed storeroom entered from the archive passage.",
      "sources": [],
      "position": [
        800,
        1320
      ],
      "hidden": false
    },
    "courtyard": {
      "label": "South Courtyard",
      "floor": "School grounds",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "A reconstructed courtyard linking paths across the school grounds. Its exact orientation is not established in the novels.",
      "sources": [],
      "position": [
        370,
        775
      ],
      "hidden": false
    },
    "bridge": {
      "label": "Stone Viaduct",
      "floor": "School grounds",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "A cinematic stone viaduct, not a claim about the novels' actual architecture. It links courtyard, lakeshore and Hagrid's area.",
      "sources": [],
      "position": [
        580,
        775
      ],
      "hidden": false
    },
    "lake": {
      "label": "Black Lake",
      "floor": "School grounds",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The Black Lake belongs to the canonical school grounds; the particular paths between shore, boathouse and pier are reconstructed.",
      "sources": [
        "grounds"
      ],
      "position": [
        1020,
        775
      ],
      "hidden": false
    },
    "boathouse": {
      "label": "The Boathouse",
      "floor": "School grounds",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "The first-years' lake crossing has support in the books. This walkable boathouse follows a cinematic reconstruction.",
      "sources": [
        "arrival",
        "grounds"
      ],
      "position": [
        1020,
        675
      ],
      "hidden": false
    },
    "dock": {
      "label": "Old Pier",
      "floor": "School grounds",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "An additional lakeside pier, no longer a shortcut to the flying-lesson lawn.",
      "sources": [],
      "position": [
        1020,
        880
      ],
      "hidden": false
    },
    "forest": {
      "label": "Forbidden Forest",
      "floor": "School grounds",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The Forbidden Forest borders the grounds near Hagrid's hut. Enter along a visible path and return the same way.",
      "sources": [
        "grounds",
        "hut"
      ],
      "position": [
        800,
        925
      ],
      "hidden": false
    },
    "clearing": {
      "label": "Ancient Clearing",
      "floor": "School grounds",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "A plausible forest clearing; this particular mushroom-ring glade is invented.",
      "sources": [],
      "position": [
        1020,
        925
      ],
      "hidden": false
    },
    "hut": {
      "label": "Hagrid's Hut",
      "floor": "School grounds",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Hagrid's hut stands near the edge of the Forbidden Forest and can be reached from the school grounds without first crossing the forest.",
      "sources": [
        "hut",
        "hutBook"
      ],
      "position": [
        790,
        875
      ],
      "hidden": false
    },
    "paddock": {
      "label": "Creature Paddock",
      "floor": "School grounds",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "Care of magical creatures has a basis in the books; the particular enclosure and route to the pitch are reconstructed.",
      "sources": [
        "hutBook"
      ],
      "position": [
        580,
        880
      ],
      "hidden": false
    },
    "quidditch": {
      "label": "Quidditch Pitch",
      "floor": "School grounds",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The pitch and its three sets of goal hoops follow the novels; the ground-level exits are reconstructed.",
      "sources": [
        "grounds",
        "brooms"
      ],
      "position": [
        370,
        880
      ],
      "hidden": false
    },
    "greenhouse": {
      "label": "Glasshouse Passage",
      "floor": "School grounds",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "The greenhouses stand on the grounds. Their glass passage and exact door positions are reconstructed.",
      "sources": [
        "greenhouses"
      ],
      "position": [
        580,
        675
      ],
      "hidden": false
    },
    "herbology": {
      "label": "Herbology",
      "floor": "School grounds",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Herbology is taught in the greenhouses, entered and left through the greenhouse passage.",
      "sources": [
        "greenhouses"
      ],
      "position": [
        790,
        675
      ],
      "hidden": false
    },
    "flying": {
      "label": "Flying-lesson Lawn",
      "floor": "School grounds",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The flying-lesson lawn is distinct from the Quidditch match pitch, connected by a site-created campus route.",
      "sources": [
        "grounds",
        "brooms"
      ],
      "position": [
        160,
        880
      ],
      "hidden": false
    },
    "sluice": {
      "label": "Serpent's Descent",
      "floor": "Deep beneath Myrtle's Bathroom",
      "group": "unmapped",
      "status": "canon",
      "floorStatus": "canon",
      "note": "This scene combines the pipe beneath Myrtle's Bathroom and the deep tunnel. The return uses Fawkes's magical assistance, not an ordinary staircase.",
      "sources": [
        "bathroom",
        "chamber"
      ],
      "position": [
        105,
        1295
      ],
      "hidden": true
    },
    "chamber": {
      "label": "Chamber of Secrets",
      "floor": "Deep beneath Hogwarts · Chamber",
      "group": "unmapped",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The enormous pillars and statue of Slytherin are described in the novels; walking routes stay on dry stone, not the water.",
      "sources": [
        "chamber"
      ],
      "position": [
        235,
        1295
      ],
      "hidden": true
    },
    "sanctum": {
      "label": "The Chamber's Far End",
      "floor": "Far end of the same Chamber",
      "group": "unmapped",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "This is a closer view of the same Chamber, not another canonical room called the Serpent Sanctum.",
      "sources": [
        "chamber",
        "chamberRowling"
      ],
      "position": [
        365,
        1295
      ],
      "hidden": true
    },
    "requirement": {
      "label": "Room of Requirement",
      "floor": "Seventh floor",
      "group": "unmapped",
      "status": "canon",
      "floorStatus": "canon",
      "note": "On the seventh floor opposite the tapestry, the Room of Requirement appears after pacing past the blank wall three times with a specific need. The site's reveal interaction condenses this.",
      "sources": [
        "requirement",
        "requirementBook"
      ],
      "position": [
        900,
        105
      ],
      "hidden": true
    },
    "basementPassage": {
      "label": "Basement Passage",
      "floor": "Basement · Kitchen entrance",
      "group": "dungeons",
      "status": "canon",
      "floorStatus": "canon",
      "note": "Goblet of Fire chapter 21 describes the broad basement passage and the fruit-portrait entrance to the kitchens.",
      "sources": [
        "kitchens"
      ],
      "position": [
        565,
        1070
      ],
      "hidden": false
    },
    "firstFloorJunction": {
      "label": "Teaching Corridor",
      "floor": "First floor · Reconstructed corridor",
      "group": "teaching",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "A reconstructed corridor connecting classrooms and the Hospital Wing; the exact sequence of doors is not established.",
      "sources": [
        "history",
        "defense",
        "hospital",
        "transfig"
      ],
      "position": [
        290,
        445
      ],
      "hidden": false
    },
    "midFloorStair": {
      "label": "Middle Landings",
      "floor": "Second–fourth floors",
      "group": "academic",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "One view represents routes across the second through fourth floors; its exits are not all on the same landing.",
      "sources": [
        "bathroom",
        "charms",
        "fourth"
      ],
      "position": [
        700,
        455
      ],
      "hidden": false
    },
    "northTowerLanding": {
      "label": "North Tower Landing",
      "floor": "North Tower · Below Divination",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "The trapdoor, silver ladder and small landing described in Prisoner of Azkaban chapter 6. The return route to the seventh floor is condensed.",
      "sources": [
        "divination"
      ],
      "position": [
        420,
        105
      ],
      "hidden": false
    },
    "hogsRoad": {
      "label": "Hogsmeade Hill Road",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A steep lane descends through pine trees toward the village lights. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        1510
      ],
      "hidden": false
    },
    "hogsStation": {
      "label": "Hogsmeade Station",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A quiet platform, dark rails and an old clock under the lanterns. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        1510
      ],
      "hidden": false
    },
    "hogsBridge": {
      "label": "Station Wooden Bridge",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Timber planks cross the narrow stream below the station. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        1510
      ],
      "hidden": false
    },
    "hogsSquare": {
      "label": "Hogsmeade Village Square",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Warm shop windows surround a cobbled square beneath snowy gables. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        1510
      ],
      "hidden": false
    },
    "hogsHigh": {
      "label": "Hogsmeade High Street",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Shop signs and crooked chimneys crowd the main street. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        1610
      ],
      "hidden": false
    },
    "broomsPorch": {
      "label": "Three Broomsticks Porch",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Laughter and lamplight spill out across the threshold. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        1610
      ],
      "hidden": false
    },
    "broomsPub": {
      "label": "The Three Broomsticks",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "An inviting public house of honey-coloured wood and blazing hearths. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        1610
      ],
      "hidden": false
    },
    "hogsHeadPorch": {
      "label": "Hog's Head Porch",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "The weathered inn sign creaks above a shadowed doorway. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        1610
      ],
      "hidden": false
    },
    "hogsHead": {
      "label": "The Hog's Head",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A gloomy bar with old bottles, dust and a watchful portrait. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        1710
      ],
      "hidden": false
    },
    "hogsCellar": {
      "label": "Hog's Head Cellar",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "The cellar is crowded with forgotten casks and a suspicious stone statue. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        1710
      ],
      "hidden": true
    },
    "honeydukes": {
      "label": "Honeydukes",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Glass jars gleam with sweets in every colour imaginable. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        1710
      ],
      "hidden": false
    },
    "zonkos": {
      "label": "Zonko's Joke Shop",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Mechanical marvels and mischief crowd the shelves. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        1710
      ],
      "hidden": false
    },
    "scribbulus": {
      "label": "Scrivenshaft's Quill Shop",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Quills and enchanted inks cover a polished writing desk. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        1810
      ],
      "hidden": false
    },
    "gladrags": {
      "label": "Gladrags Wizardwear",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Robes and hats hang behind tall leaded shop windows. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        1810
      ],
      "hidden": false
    },
    "dervish": {
      "label": "Dervish and Banges",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Magical instruments tick, spin and murmur from brass cabinets. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        1810
      ],
      "hidden": false
    },
    "puddifoot": {
      "label": "Madam Puddifoot's Tea Shop",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Tiny tea tables crowd a room steeped in rose-coloured steam. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        1810
      ],
      "hidden": false
    },
    "postOffice": {
      "label": "Hogsmeade Post Office",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Owls settle above a counter crowded with parcels and stamps. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        1910
      ],
      "hidden": false
    },
    "shriekingShack": {
      "label": "The Shrieking Shack",
      "floor": "Hogsmeade village",
      "group": "hogsmeade",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A shuttered house stands alone where the village path ends. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        1910
      ],
      "hidden": false
    },
    "lakeShallows": {
      "label": "Black Lake Shallows",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Moonlight wrinkles across the narrow strip of shallows. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2100
      ],
      "hidden": true
    },
    "boatLaunch": {
      "label": "Boathouse Launch",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Small boats rock against the timber landing. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2100
      ],
      "hidden": false
    },
    "lakeCave": {
      "label": "Black Lake Underwater Cave",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Blue light filters through the roof of a submerged cavern. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2100
      ],
      "hidden": true
    },
    "merVillage": {
      "label": "Merpeople Village",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Submerged stone dwellings rise around an ancient plaza. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2100
      ],
      "hidden": true
    },
    "lakeIslet": {
      "label": "Black Lake Islet",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A lonely island breaks the smooth surface of the lake. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2210
      ],
      "hidden": true
    },
    "willowRoots": {
      "label": "Whomping Willow Roots",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Enormous roots press against the earth beside an agitated trunk. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2210
      ],
      "hidden": false
    },
    "centaurGrove": {
      "label": "Centaur Grove",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A circle of old trees opens beneath the stars. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2210
      ],
      "hidden": false
    },
    "unicornGlade": {
      "label": "Unicorn Glade",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Silver tracks wind between ferns and moonlit birches. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2210
      ],
      "hidden": false
    },
    "acromantulaDen": {
      "label": "Acromantula Den",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Heavy webs hang between black trunks. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2320
      ],
      "hidden": false
    },
    "coveredBridge": {
      "label": "Covered Bridge",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A timber roof spans the ravine beneath the castle. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2320
      ],
      "hidden": false
    },
    "herbCourt": {
      "label": "Herbology Courtyard",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Clay pots and damp seedlings crowd the walled garden. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2320
      ],
      "hidden": false
    },
    "outerSlope": {
      "label": "Castle Outer Slope",
      "floor": "Lake, forest & outer grounds",
      "group": "outerGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Wind moves through the grass below the high walls. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2320
      ],
      "hidden": false
    },
    "quidStands": {
      "label": "Quidditch Stands",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "High wooden terraces rise above the green pitch. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2520
      ],
      "hidden": false
    },
    "quidChanging": {
      "label": "Quidditch Changing Rooms",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "House colours hang from the rafters beside lockers. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2520
      ],
      "hidden": false
    },
    "quidKit": {
      "label": "Quidditch Equipment Store",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Brooms, bats and training balls wait behind barred shelves. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2520
      ],
      "hidden": false
    },
    "quidReferee": {
      "label": "Quidditch Referee Tower",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A private staircase climbs to the flags above the field. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2520
      ],
      "hidden": true
    },
    "quidGoals": {
      "label": "Quidditch Goal Hoops",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Three hoops cast long shadows over a bright green pitch. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2630
      ],
      "hidden": false
    },
    "quidTrophies": {
      "label": "Quidditch Trophy Walk",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Team pennants and battered cups line a short arcade. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2630
      ],
      "hidden": false
    },
    "flyingShed": {
      "label": "Flying Lesson Equipment Shed",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Practice brooms lean against a low timber wall. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2630
      ],
      "hidden": false
    },
    "owlDrop": {
      "label": "Owl Delivery Ledge",
      "floor": "Quidditch & flying grounds",
      "group": "quidditchGrounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Owl perches overlook the grounds from a sheltered ledge. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2630
      ],
      "hidden": false
    },
    "humpbackTunnel": {
      "label": "Humpbacked Witch Passage",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "A narrow carved passage vanishes under the hillside. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2850
      ],
      "hidden": true
    },
    "serpentDoor": {
      "label": "Serpent Door",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "A carved serpent coils around a door of dark stone. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2850
      ],
      "hidden": true
    },
    "trapdoorChamber": {
      "label": "Trapdoor Chamber",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "A hidden hatch opens onto forgotten masonry. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2850
      ],
      "hidden": true
    },
    "mirrorChamber": {
      "label": "Mirror of Erised Chamber",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "An ornate mirror waits alone under a faded curtain. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2850
      ],
      "hidden": true
    },
    "mapNook": {
      "label": "Marauder's Map Nook",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "Old parchment shows a shifting maze of corridors. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        2960
      ],
      "hidden": true
    },
    "restrictedStacks": {
      "label": "Library Restricted Section",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Darkened shelves stand beyond a screened doorway. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        2960
      ],
      "hidden": true
    },
    "oneEyedTunnel": {
      "label": "One-Eyed Witch Tunnel",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Stone steps wind toward an old confectioner's cellar. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        2960
      ],
      "hidden": true
    },
    "honeyCellar": {
      "label": "Honeydukes Cellar",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "The sweet shop's cellar hides a stair under barrels. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        2960
      ],
      "hidden": true
    },
    "whisperingCrypt": {
      "label": "Whispering Crypt",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "Indistinct voices drift between memorial stones. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        3070
      ],
      "hidden": true
    },
    "forgottenArmory": {
      "label": "Forgotten Armoury",
      "floor": "Hidden passages & lost rooms",
      "group": "hiddenAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Old shields guard a sealed passage behind the gallery. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        3070
      ],
      "hidden": true
    },
    "antechamber": {
      "label": "Great Hall Antechamber",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Torchlight gilds the stone antechamber outside the Great Hall. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        3260
      ],
      "hidden": false
    },
    "trophy": {
      "label": "Trophy Gallery",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Names engraved in silver catch the light among old shields. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        3260
      ],
      "hidden": false
    },
    "clockTower": {
      "label": "Clock Tower",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Enormous clockworks turn above the cloisters. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        3260
      ],
      "hidden": false
    },
    "prefectsBath": {
      "label": "Prefects' Bathroom",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Coloured taps surround a vast marble bath. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        3260
      ],
      "hidden": false
    },
    "commonGryff": {
      "label": "Gryffindor Common Room",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Red hangings and a warm fireplace welcome tired students. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        3370
      ],
      "hidden": false
    },
    "commonRaven": {
      "label": "Ravenclaw Common Room",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Blue windows frame the night sky above shelves of books. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        3370
      ],
      "hidden": false
    },
    "commonHuffle": {
      "label": "Hufflepuff Common Room",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Round windows and copper lamps brighten a snug underground room. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        3370
      ],
      "hidden": false
    },
    "commonSlytherin": {
      "label": "Slytherin Common Room",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "Greenish light ripples through windows below the water. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        3370
      ],
      "hidden": true
    },
    "roRThings": {
      "label": "Room of Hidden Things",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "Towering heaps of lost objects form paths through the changing room. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        150,
        3480
      ],
      "hidden": true
    },
    "roRDA": {
      "label": "D.A. Training Room",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "Practice dummies and spell marks line a responsive training hall. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        430,
        3480
      ],
      "hidden": true
    },
    "roRDiadem": {
      "label": "Diadem Niche",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "A dusty niche lies among stacks of forgotten furniture. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        710,
        3480
      ],
      "hidden": true
    },
    "roRArchive": {
      "label": "Living Archive",
      "floor": "Castle annex & Room of Requirement",
      "group": "castleAnnex",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "Folio pages shuffle by themselves as shelves continually rearrange. The adjacent passages are reconstructed for exploration; their precise doors, levels and mechanisms should not be treated as canonical.",
      "sources": [],
      "position": [
        990,
        3480
      ],
      "hidden": true
    }
  },
  "sections": [
    {
      "id": "grounds",
      "title": "The Grounds",
      "zh": "Grounds & Lakeshore",
      "subtitle": "Paths · forest · lake · greenhouses",
      "coords": {
        "gate": [
          245,
          180
        ],
        "forecourt": [
          245,
          320
        ],
        "courtyard": [
          450,
          320
        ],
        "bridge": [
          640,
          320
        ],
        "lake": [
          820,
          400
        ],
        "boathouse": [
          820,
          540
        ],
        "dock": [
          920,
          510
        ],
        "forest": [
          690,
          100
        ],
        "clearing": [
          520,
          80
        ],
        "hut": [
          820,
          170
        ],
        "paddock": [
          860,
          285
        ],
        "quidditch": [
          470,
          500
        ],
        "flying": [
          245,
          510
        ],
        "cloister": [
          450,
          180
        ],
        "greenhouse": [
          450,
          80
        ],
        "herbology": [
          250,
          80
        ]
      }
    },
    {
      "id": "keep",
      "title": "Entrance & Main Stairs",
      "zh": "Entrance & Main Stairs",
      "subtitle": "Ground floor · vertical circulation",
      "coords": {
        "entry": [
          500,
          400
        ],
        "great": [
          740,
          240
        ],
        "staircase": [
          280,
          200
        ]
      }
    },
    {
      "id": "teaching",
      "title": "First-floor Reconstruction",
      "zh": "First-floor Teaching Wing",
      "subtitle": "Shared corridor · destination rooms",
      "coords": {
        "firstFloorJunction": [
          500,
          330
        ],
        "hospital": [
          220,
          170
        ],
        "history": [
          780,
          170
        ],
        "defense": [
          220,
          500
        ],
        "transfig": [
          780,
          500
        ]
      }
    },
    {
      "id": "academic",
      "title": "Middle Floors",
      "zh": "Second–Fourth Floors",
      "subtitle": "Second · third · fourth — joined by stairs",
      "coords": {
        "midFloorStair": [
          280,
          330
        ],
        "baths": [
          530,
          510
        ],
        "bathroom": [
          800,
          510
        ],
        "armoury": [
          530,
          140
        ],
        "charms": [
          800,
          140
        ],
        "gallery": [
          530,
          330
        ],
        "library": [
          800,
          330
        ]
      }
    },
    {
      "id": "towers",
      "title": "Seventh Floor & Towers",
      "zh": "Seventh Floor & Towers",
      "subtitle": "Distinct towers · routes include stairs",
      "coords": {
        "corridor": [
          450,
          470
        ],
        "office": [
          180,
          470
        ],
        "northTowerLanding": [
          450,
          270
        ],
        "divination": [
          450,
          100
        ],
        "ramparts": [
          720,
          470
        ],
        "owlery": [
          850,
          270
        ],
        "astrStair": [
          720,
          100
        ],
        "astrTower": [
          900,
          100
        ]
      }
    },
    {
      "id": "dungeons",
      "title": "Basement & Dungeons",
      "zh": "Basements & Dungeons",
      "subtitle": "Kitchens below the hall · dungeons below the grounds",
      "coords": {
        "basementPassage": [
          250,
          140
        ],
        "kitchens": [
          500,
          140
        ],
        "pantry": [
          760,
          140
        ],
        "dungeonSteps": [
          250,
          320
        ],
        "slytherin": [
          500,
          320
        ],
        "potions": [
          760,
          320
        ],
        "reservoir": [
          850,
          500
        ],
        "oldArchive": [
          500,
          500
        ],
        "crypt": [
          250,
          500
        ],
        "vault": [
          680,
          570
        ]
      }
    },
    {
      "id": "unmapped",
      "title": "Concealed Routes",
      "zh": "Concealed Routes",
      "subtitle": "The seventh-floor room · the deep Chamber",
      "coords": {
        "requirement": [
          230,
          160
        ],
        "sluice": [
          720,
          520
        ],
        "chamber": [
          720,
          330
        ],
        "sanctum": [
          720,
          140
        ]
      },
      "secret": true
    },
    {
      "id": "hogsmeade",
      "title": "Hogsmeade Village",
      "zh": "Hogsmeade Village",
      "subtitle": "Hill roads, station, inns & shops",
      "coords": {
        "hogsRoad": [
          140,
          95
        ],
        "hogsStation": [
          370,
          95
        ],
        "hogsBridge": [
          600,
          95
        ],
        "hogsSquare": [
          830,
          95
        ],
        "hogsHigh": [
          140,
          205
        ],
        "broomsPorch": [
          370,
          205
        ],
        "broomsPub": [
          600,
          205
        ],
        "hogsHeadPorch": [
          830,
          205
        ],
        "hogsHead": [
          140,
          315
        ],
        "hogsCellar": [
          370,
          315
        ],
        "honeydukes": [
          600,
          315
        ],
        "zonkos": [
          830,
          315
        ],
        "scribbulus": [
          140,
          425
        ],
        "gladrags": [
          370,
          425
        ],
        "dervish": [
          600,
          425
        ],
        "puddifoot": [
          830,
          425
        ],
        "postOffice": [
          140,
          535
        ],
        "shriekingShack": [
          370,
          535
        ]
      }
    },
    {
      "id": "outerGrounds",
      "title": "Lake, Forest & Outer Grounds",
      "zh": "Lake, Forest & Outer Grounds",
      "subtitle": "Water passages, ancient trees & Herbology courts",
      "coords": {
        "lakeShallows": [
          140,
          145
        ],
        "boatLaunch": [
          370,
          145
        ],
        "lakeCave": [
          600,
          145
        ],
        "merVillage": [
          830,
          145
        ],
        "lakeIslet": [
          140,
          305
        ],
        "willowRoots": [
          370,
          305
        ],
        "centaurGrove": [
          600,
          305
        ],
        "unicornGlade": [
          830,
          305
        ],
        "acromantulaDen": [
          140,
          465
        ],
        "coveredBridge": [
          370,
          465
        ],
        "herbCourt": [
          600,
          465
        ],
        "outerSlope": [
          830,
          465
        ]
      }
    },
    {
      "id": "quidditchGrounds",
      "title": "Quidditch & Flying Grounds",
      "zh": "Quidditch & Flying Grounds",
      "subtitle": "Pitch facilities, stands & flying routes",
      "coords": {
        "quidStands": [
          140,
          205
        ],
        "quidChanging": [
          370,
          205
        ],
        "quidKit": [
          600,
          205
        ],
        "quidReferee": [
          830,
          205
        ],
        "quidGoals": [
          140,
          425
        ],
        "quidTrophies": [
          370,
          425
        ],
        "flyingShed": [
          600,
          425
        ],
        "owlDrop": [
          830,
          425
        ]
      }
    },
    {
      "id": "hiddenAnnex",
      "title": "Hidden Passages & Lost Rooms",
      "zh": "Hidden Passages & Lost Rooms",
      "subtitle": "Reached only after revealing a hidden mechanism",
      "coords": {
        "humpbackTunnel": [
          140,
          145
        ],
        "serpentDoor": [
          370,
          145
        ],
        "trapdoorChamber": [
          600,
          145
        ],
        "mirrorChamber": [
          830,
          145
        ],
        "mapNook": [
          140,
          305
        ],
        "restrictedStacks": [
          370,
          305
        ],
        "oneEyedTunnel": [
          600,
          305
        ],
        "honeyCellar": [
          830,
          305
        ],
        "whisperingCrypt": [
          140,
          465
        ],
        "forgottenArmory": [
          370,
          465
        ]
      },
      "secret": true
    },
    {
      "id": "castleAnnex",
      "title": "Castle Annex & Room of Requirement",
      "zh": "Castle Annex & Room of Requirement",
      "subtitle": "Common rooms, trophies & shifting spaces",
      "coords": {
        "antechamber": [
          140,
          145
        ],
        "trophy": [
          370,
          145
        ],
        "clockTower": [
          600,
          145
        ],
        "prefectsBath": [
          830,
          145
        ],
        "commonGryff": [
          140,
          305
        ],
        "commonRaven": [
          370,
          305
        ],
        "commonHuffle": [
          600,
          305
        ],
        "commonSlytherin": [
          830,
          305
        ],
        "roRThings": [
          140,
          465
        ],
        "roRDA": [
          370,
          465
        ],
        "roRDiadem": [
          600,
          465
        ],
        "roRArchive": [
          830,
          465
        ]
      }
    }
  ],
  "overviewSections": [
    {
      "id": "grounds",
      "title": "Grounds & Lakeshore",
      "box": [
        25,
        605,
        1150,
        365
      ],
      "secret": false
    },
    {
      "id": "keep",
      "title": "Entrance & Main Stairs",
      "box": [
        25,
        1005,
        400,
        180
      ],
      "secret": false
    },
    {
      "id": "teaching",
      "title": "First-floor Teaching Wing",
      "box": [
        25,
        300,
        535,
        270
      ],
      "secret": false
    },
    {
      "id": "academic",
      "title": "Second–Fourth Floors",
      "box": [
        590,
        300,
        585,
        270
      ],
      "secret": false
    },
    {
      "id": "towers",
      "title": "Seventh Floor & Towers",
      "box": [
        25,
        25,
        1150,
        240
      ],
      "secret": false
    },
    {
      "id": "dungeons",
      "title": "Basements & Dungeons",
      "box": [
        455,
        1005,
        720,
        355
      ],
      "secret": false
    },
    {
      "id": "unmapped",
      "title": "Concealed Routes",
      "box": [
        25,
        1220,
        400,
        145
      ],
      "secret": true
    },
    {
      "id": "hogsmeade",
      "title": "Hogsmeade Village",
      "box": [
        25,
        1425,
        1150,
        570
      ],
      "secret": false
    },
    {
      "id": "outerGrounds",
      "title": "Lake, Forest & Outer Grounds",
      "box": [
        25,
        2015,
        1150,
        400
      ],
      "secret": false
    },
    {
      "id": "quidditchGrounds",
      "title": "Quidditch & Flying Grounds",
      "box": [
        25,
        2435,
        1150,
        310
      ],
      "secret": false
    },
    {
      "id": "hiddenAnnex",
      "title": "Hidden Passages & Lost Rooms",
      "box": [
        25,
        2765,
        1150,
        390
      ],
      "secret": true
    },
    {
      "id": "castleAnnex",
      "title": "Castle Annex & Room of Requirement",
      "box": [
        25,
        3175,
        1150,
        400
      ],
      "secret": false
    }
  ],
  "sources": {
    "entry": {
      "title": "Entrance Hall — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-ground-floor/entrance-hall/",
      "books": [
        "PS7",
        "GF17",
        "GF21"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "kitchens": {
      "title": "Hogwarts kitchens — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/dungeons/kitchens/",
      "books": [
        "GF21",
        "GF28"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "requirement": {
      "title": "The Room of Requirement — Official Encyclopedia",
      "url": "https://www.harrypotter.com/fact-file/locations/the-room-of-requirement",
      "books": [
        "OP18"
      ],
      "tier": "official encyclopedia",
      "caveat": ""
    },
    "requirementBook": {
      "title": "Room of Requirement — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-seventh-floor/room-of-requirement/",
      "books": [
        "OP18",
        "OP27",
        "HBP21"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "myrtle": {
      "title": "Moaning Myrtle — Official Encyclopedia",
      "url": "https://www.harrypotter.com/fact-file/characters-and-pets/moaning-myrtle",
      "books": [
        "CS8–9",
        "GF22",
        "GF25"
      ],
      "tier": "official encyclopedia",
      "caveat": ""
    },
    "bathroom": {
      "title": "Moaning Myrtle's bathroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-second-floor/moaning-myrtles-bathroom/",
      "books": [
        "CS8–9",
        "CS16",
        "GF22",
        "GF25"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": "First-floor wording also occurs in CS8; second-floor placement is corroborated by later references. Do not import Cursed Child details into a seven-novel audit."
    },
    "hiddenEntrances": {
      "title": "Hidden entrances of the wizarding world — Official feature",
      "url": "https://www.harrypotter.com/features/web-hidden-entrances-wizarding-world",
      "books": [
        "CS16",
        "GF21"
      ],
      "tier": "official editorial feature",
      "caveat": "Useful for the tap/pipe and pear mechanisms; its first-floor Myrtle location conflicts with the official Myrtle fact file and later novel references. Do not cite its floor label."
    },
    "divination": {
      "title": "Divination classroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/north-tower/divination-classroom/",
      "books": [
        "PA6",
        "PA16"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "owlery": {
      "title": "Owlery — Official Encyclopedia",
      "url": "https://www.harrypotter.com/fact-file/locations/owlery",
      "books": [
        "GF15"
      ],
      "tier": "official encyclopedia",
      "caveat": ""
    },
    "owleryBook": {
      "title": "Owlery — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/west-tower/owlery/",
      "books": [
        "GF15"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "head": {
      "title": "Head's office — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-seventh-floor/heads-office/",
      "books": [
        "CS11–12",
        "GF28",
        "GF30",
        "HBP21"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": "The entrance is placed differently across books: second floor in GF28, apparently fifth in CS11, seventh in HBP. The tower and gargoyle/spiral-stair access are more stable than an exact floor."
    },
    "hospital": {
      "title": "Hospital Wing — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-third-floor/hospital-wing/",
      "books": [
        "CS13",
        "OP32"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": "First floor is supported by CS13; OP32 implies a higher floor. A stable universal floor is not established."
    },
    "charms": {
      "title": "Charms classroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-third-floor/charms-classroom/",
      "books": [
        "PS9",
        "OP30"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "armour": {
      "title": "Armour Gallery — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-third-floor/armour-gallery/",
      "books": [
        "PS9"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "fourth": {
      "title": "Hogwarts fourth floor — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-fourth-floor/",
      "books": [
        "PS12",
        "PA8",
        "GF25"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "library": {
      "title": "Library — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-fourth-floor/library/",
      "books": [
        "PS12",
        "GF20"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "history": {
      "title": "History of Magic classroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-first-floor/history-of-magic-classroom/",
      "books": [
        "CS9",
        "OP17"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "defense": {
      "title": "Defence Against the Dark Arts classroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-first-floor/defence-against-the-dark-arts-classroom/",
      "books": [
        "CS6"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": "First-floor placement is a route-based deduction; do not confuse the classroom with the teacher office above it."
    },
    "transfig": {
      "title": "Transfiguration classroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/transfiguration-classroom/",
      "books": [
        "PS8",
        "CS16",
        "OP32"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": "Exact floor is unknown. Film/game classroom 1B and courtyard layouts are not original-novel evidence."
    },
    "hut": {
      "title": "Hagrid's hut — Official Encyclopedia",
      "url": "https://www.harrypotter.com/fact-file/locations/hagrids-hut",
      "books": [
        "PS8"
      ],
      "tier": "official encyclopedia",
      "caveat": ""
    },
    "hutBook": {
      "title": "Hagrid's hut — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-grounds/hagrids-hut/",
      "books": [
        "PS8",
        "CS7",
        "PA6",
        "PA16",
        "PA21"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "grounds": {
      "title": "Hogwarts grounds — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-grounds/",
      "books": [
        "PS8–9",
        "PA6"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": "The article also uses later Rowling maps for compass orientation. This audit uses the novels for relative locations and does not assign a supposedly definitive compass grid."
    },
    "arrival": {
      "title": "PS6: The Journey from Platform Nine and Three-Quarters — chapter guide",
      "url": "https://www.hp-lexicon.org/source/the-harry-potter-novels/ps/ps6/",
      "books": [
        "PS6"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "greenhouses": {
      "title": "Greenhouses — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-grounds/greenhouses/",
      "books": [
        "PS8",
        "CS6"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "astronomy": {
      "title": "The Astronomy Tower — Official Encyclopedia",
      "url": "https://www.harrypotter.com/fact-file/locations/the-astronomy-tower",
      "books": [
        "PS14",
        "OP31",
        "HBP27"
      ],
      "tier": "official encyclopedia",
      "caveat": ""
    },
    "astronomyBook": {
      "title": "Astronomy Tower — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/astronomy-tower/",
      "books": [
        "PS14",
        "OP31",
        "HBP27–28"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "chamber": {
      "title": "Chamber of Secrets — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/dungeons/chamber-of-secrets/",
      "books": [
        "CS16–17",
        "DH31"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "chamberRowling": {
      "title": "Chamber of Secrets — J.K. Rowling original writing",
      "url": "https://www.harrypotter.com/writing-by-jk-rowling/chamber-of-secrets",
      "books": [],
      "tier": "later author expansion",
      "caveat": "Useful corroboration for Slytherin statue and protected entrance; plumbing-history details are later expansion, not evidence from the original seven novels."
    },
    "hogwarts": {
      "title": "Hogwarts — Official Encyclopedia",
      "url": "https://www.harrypotter.com/fact-file/locations/hogwarts",
      "books": [
        "PS8"
      ],
      "tier": "official encyclopedia",
      "caveat": ""
    },
    "brooms": {
      "title": "School Brooms — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/thing/school-brooms/",
      "books": [
        "PS9",
        "PS11",
        "PS13"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "potions": {
      "title": "Potions classroom — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/dungeons/potions-classroom/",
      "books": [
        "PS8",
        "CS11"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    },
    "staffWardrobe": {
      "title": "Staff room wardrobe — Harry Potter Lexicon",
      "url": "https://www.hp-lexicon.org/thing/lupins-boggart-wardrobe/",
      "books": [
        "CS16",
        "PA7"
      ],
      "tier": "chapter-cited secondary index",
      "caveat": ""
    }
  },
  "edgeEvidence": {
    "entry|gate": {
      "status": "canon",
      "sources": [
        "entry"
      ]
    },
    "forecourt|gate": {
      "status": "interpretation",
      "sources": []
    },
    "courtyard|forecourt": {
      "status": "interpretation",
      "sources": []
    },
    "flying|forecourt": {
      "status": "interpretation",
      "sources": []
    },
    "entry|great": {
      "status": "canon",
      "sources": [
        "entry"
      ]
    },
    "entry|staircase": {
      "status": "canon",
      "sources": [
        "entry"
      ]
    },
    "basementPassage|entry": {
      "status": "canon",
      "sources": [
        "entry",
        "kitchens"
      ]
    },
    "basementPassage|kitchens": {
      "status": "canon",
      "sources": [
        "kitchens"
      ]
    },
    "kitchens|pantry": {
      "status": "interpretation",
      "sources": []
    },
    "basementPassage|dungeonSteps": {
      "status": "interpretation",
      "sources": []
    },
    "firstFloorJunction|staircase": {
      "status": "interpretation",
      "sources": []
    },
    "midFloorStair|staircase": {
      "status": "interpretation",
      "sources": []
    },
    "corridor|staircase": {
      "status": "interpretation",
      "sources": []
    },
    "firstFloorJunction|hospital": {
      "status": "interpretation",
      "sources": []
    },
    "firstFloorJunction|history": {
      "status": "interpretation",
      "sources": []
    },
    "defense|firstFloorJunction": {
      "status": "interpretation",
      "sources": []
    },
    "firstFloorJunction|transfig": {
      "status": "interpretation",
      "sources": []
    },
    "baths|midFloorStair": {
      "status": "interpretation",
      "sources": []
    },
    "bathroom|baths": {
      "status": "interpretation",
      "sources": []
    },
    "armoury|midFloorStair": {
      "status": "interpretation",
      "sources": []
    },
    "charms|midFloorStair": {
      "status": "interpretation",
      "sources": []
    },
    "gallery|midFloorStair": {
      "status": "interpretation",
      "sources": []
    },
    "gallery|library": {
      "status": "interpretation",
      "sources": []
    },
    "corridor|office": {
      "status": "interpretation",
      "sources": []
    },
    "corridor|northTowerLanding": {
      "status": "interpretation",
      "sources": []
    },
    "divination|northTowerLanding": {
      "status": "canon",
      "sources": [
        "divination"
      ]
    },
    "corridor|ramparts": {
      "status": "interpretation",
      "sources": []
    },
    "astrStair|ramparts": {
      "status": "interpretation",
      "sources": []
    },
    "astrStair|astrTower": {
      "status": "canon",
      "sources": [
        "astronomyBook"
      ]
    },
    "owlery|ramparts": {
      "status": "interpretation",
      "sources": []
    },
    "dungeonSteps|slytherin": {
      "status": "interpretation",
      "sources": []
    },
    "potions|slytherin": {
      "status": "interpretation",
      "sources": []
    },
    "oldArchive|slytherin": {
      "status": "interpretation",
      "sources": []
    },
    "reservoir|slytherin": {
      "status": "interpretation",
      "sources": []
    },
    "crypt|oldArchive": {
      "status": "interpretation",
      "sources": []
    },
    "oldArchive|vault": {
      "status": "interpretation",
      "sources": []
    },
    "cloister|courtyard": {
      "status": "interpretation",
      "sources": []
    },
    "cloister|greenhouse": {
      "status": "interpretation",
      "sources": []
    },
    "greenhouse|herbology": {
      "status": "interpretation",
      "sources": []
    },
    "bridge|courtyard": {
      "status": "interpretation",
      "sources": []
    },
    "courtyard|quidditch": {
      "status": "interpretation",
      "sources": []
    },
    "bridge|lake": {
      "status": "interpretation",
      "sources": []
    },
    "bridge|hut": {
      "status": "interpretation",
      "sources": []
    },
    "boathouse|lake": {
      "status": "interpretation",
      "sources": []
    },
    "dock|lake": {
      "status": "interpretation",
      "sources": []
    },
    "forest|hut": {
      "status": "canon",
      "sources": [
        "hut"
      ]
    },
    "clearing|forest": {
      "status": "interpretation",
      "sources": []
    },
    "hut|paddock": {
      "status": "interpretation",
      "sources": []
    },
    "paddock|quidditch": {
      "status": "interpretation",
      "sources": []
    },
    "flying|quidditch": {
      "status": "interpretation",
      "sources": []
    },
    "chamber|sluice": {
      "status": "canon",
      "sources": [
        "chamber"
      ]
    },
    "chamber|sanctum": {
      "status": "interpretation",
      "sources": [
        "chamber"
      ]
    },
    "bathroom|sluice": {
      "status": "canon",
      "sources": [
        "bathroom",
        "chamber"
      ]
    },
    "corridor|requirement": {
      "status": "canon",
      "sources": [
        "requirement"
      ]
    },
    "forecourt|hogsRoad": {
      "status": "interpretation",
      "sources": []
    },
    "hogsRoad|hogsStation": {
      "status": "interpretation",
      "sources": []
    },
    "hogsBridge|hogsStation": {
      "status": "interpretation",
      "sources": []
    },
    "hogsBridge|hogsSquare": {
      "status": "interpretation",
      "sources": []
    },
    "hogsHigh|hogsSquare": {
      "status": "interpretation",
      "sources": []
    },
    "broomsPorch|hogsHigh": {
      "status": "interpretation",
      "sources": []
    },
    "broomsPorch|broomsPub": {
      "status": "interpretation",
      "sources": []
    },
    "hogsHeadPorch|hogsHigh": {
      "status": "interpretation",
      "sources": []
    },
    "hogsHead|hogsHeadPorch": {
      "status": "interpretation",
      "sources": []
    },
    "hogsHigh|honeydukes": {
      "status": "interpretation",
      "sources": []
    },
    "hogsHigh|zonkos": {
      "status": "interpretation",
      "sources": []
    },
    "hogsHigh|scribbulus": {
      "status": "interpretation",
      "sources": []
    },
    "gladrags|hogsHigh": {
      "status": "interpretation",
      "sources": []
    },
    "dervish|hogsHigh": {
      "status": "interpretation",
      "sources": []
    },
    "hogsSquare|puddifoot": {
      "status": "interpretation",
      "sources": []
    },
    "hogsSquare|postOffice": {
      "status": "interpretation",
      "sources": []
    },
    "hogsRoad|shriekingShack": {
      "status": "interpretation",
      "sources": []
    },
    "antechamber|entry": {
      "status": "interpretation",
      "sources": []
    },
    "armoury|trophy": {
      "status": "interpretation",
      "sources": []
    },
    "clockTower|ramparts": {
      "status": "interpretation",
      "sources": []
    },
    "baths|prefectsBath": {
      "status": "interpretation",
      "sources": []
    },
    "commonGryff|gallery": {
      "status": "interpretation",
      "sources": []
    },
    "commonRaven|ramparts": {
      "status": "interpretation",
      "sources": []
    },
    "commonHuffle|kitchens": {
      "status": "interpretation",
      "sources": []
    },
    "commonSlytherin|serpentDoor": {
      "status": "interpretation",
      "sources": []
    },
    "requirement|roRThings": {
      "status": "interpretation",
      "sources": []
    },
    "requirement|roRDA": {
      "status": "interpretation",
      "sources": []
    },
    "requirement|roRDiadem": {
      "status": "interpretation",
      "sources": []
    },
    "requirement|roRArchive": {
      "status": "interpretation",
      "sources": []
    },
    "boatLaunch|boathouse": {
      "status": "interpretation",
      "sources": []
    },
    "lakeIslet|lakeShallows": {
      "status": "interpretation",
      "sources": []
    },
    "lakeCave|lakeShallows": {
      "status": "interpretation",
      "sources": []
    },
    "lakeCave|merVillage": {
      "status": "interpretation",
      "sources": []
    },
    "courtyard|willowRoots": {
      "status": "interpretation",
      "sources": []
    },
    "centaurGrove|clearing": {
      "status": "interpretation",
      "sources": []
    },
    "centaurGrove|unicornGlade": {
      "status": "interpretation",
      "sources": []
    },
    "acromantulaDen|forest": {
      "status": "interpretation",
      "sources": []
    },
    "bridge|coveredBridge": {
      "status": "interpretation",
      "sources": []
    },
    "greenhouse|herbCourt": {
      "status": "interpretation",
      "sources": []
    },
    "forecourt|outerSlope": {
      "status": "interpretation",
      "sources": []
    },
    "quidStands|quidditch": {
      "status": "interpretation",
      "sources": []
    },
    "quidChanging|quidStands": {
      "status": "interpretation",
      "sources": []
    },
    "quidChanging|quidKit": {
      "status": "interpretation",
      "sources": []
    },
    "quidGoals|quidditch": {
      "status": "interpretation",
      "sources": []
    },
    "quidGoals|quidTrophies": {
      "status": "interpretation",
      "sources": []
    },
    "flying|flyingShed": {
      "status": "interpretation",
      "sources": []
    },
    "owlDrop|owlery": {
      "status": "interpretation",
      "sources": []
    },
    "honeyCellar|oneEyedTunnel": {
      "status": "interpretation",
      "sources": []
    },
    "hogsCellar|hogsHead": {
      "status": "interpretation",
      "sources": []
    },
    "hogsCellar|humpbackTunnel": {
      "status": "interpretation",
      "sources": []
    },
    "serpentDoor|slytherin": {
      "status": "interpretation",
      "sources": []
    },
    "oldArchive|trapdoorChamber": {
      "status": "interpretation",
      "sources": []
    },
    "gallery|mirrorChamber": {
      "status": "interpretation",
      "sources": []
    },
    "mapNook|trophy": {
      "status": "interpretation",
      "sources": []
    },
    "library|restrictedStacks": {
      "status": "interpretation",
      "sources": []
    },
    "baths|oneEyedTunnel": {
      "status": "interpretation",
      "sources": []
    },
    "honeyCellar|honeydukes": {
      "status": "interpretation",
      "sources": []
    },
    "crypt|whisperingCrypt": {
      "status": "interpretation",
      "sources": []
    },
    "armoury|forgottenArmory": {
      "status": "interpretation",
      "sources": []
    },
    "quidReferee|quidditch": {
      "status": "interpretation",
      "sources": []
    },
    "dock|lakeShallows": {
      "status": "interpretation",
      "sources": []
    }
  }
};
  var atlas=window.HogwartsAtlas;
  if(!atlas||!atlas.rooms)return;
  function edgeKey(a,b){return [a,b].sort().join('|')}
  function edges(includeHidden){
    var result=[],seen=Object.create(null);
    Object.keys(atlas.rooms).forEach(function(id){
      var room=atlas.rooms[id],destinations=Object.values(room.exits);
      if(room.secret)destinations.push(room.secret.to);
      destinations.forEach(function(to){
        if(!data.nodes[id]||!data.nodes[to])return;
        if(!includeHidden&&(data.nodes[id].hidden||data.nodes[to].hidden))return;
        var key=edgeKey(id,to);if(seen[key])return;seen[key]=true;
        var other=atlas.rooms[to];
        var secret=!!(room.secret&&room.secret.to===to||other.secret&&other.secret.to===id);
        var proof=data.edgeEvidence[key]||{status:'interpretation',sources:[]};
        result.push({key:key,a:id,b:to,secret:secret,status:proof.status,sources:proof.sources});
      });
    });
    return result;
  }
  function neighbors(id,includeHidden){
    return edges(includeHidden).filter(function(edge){return edge.a===id||edge.b===id}).map(function(edge){return edge.a===id?edge.b:edge.a});
  }
  function route(from,to,includeHidden){
    if(!data.nodes[from]||!data.nodes[to]||!includeHidden&&(data.nodes[from].hidden||data.nodes[to].hidden))return null;
    var queue=[from],parent=Object.create(null);parent[from]=null;
    for(var i=0;i<queue.length;i++){
      var id=queue[i];if(id===to)break;
      neighbors(id,includeHidden).forEach(function(next){if(Object.prototype.hasOwnProperty.call(parent,next))return;parent[next]=id;queue.push(next)});
    }
    if(!Object.prototype.hasOwnProperty.call(parent,to))return null;
    var result=[];for(var at=to;at!==null;at=parent[at])result.push(at);
    return result.reverse();
  }
  data.edges=edges;data.neighbors=neighbors;data.route=route;data.edgeKey=edgeKey;
  window.HogwartsGeography=data;
})();
