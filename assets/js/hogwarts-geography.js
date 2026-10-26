/* Sourced geographic notes and schematic positions. All navigable edges are derived from the live atlas. */
(function(){
  "use strict";
  var data={
  "reviewed": "2026-10-26",
  "nodes": {
    "gate": {
      "label": "城堡大门",
      "floor": "地面 · 城堡门口",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "这里是城堡正门，不是校界外带翼野猪石柱的大门。门厅就在门后。",
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
      "label": "提灯小径",
      "floor": "校地 · 进校道路",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "城堡前的小路经过重新组织；一次跳转代表一段步行，不等同于从伦敦站台直接走到城堡。",
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
      "label": "门厅",
      "floor": "Ground floor · 入口层",
      "group": "keep",
      "status": "canon",
      "floorStatus": "canon",
      "note": "原著描述了门厅、通向礼堂的门、上楼的楼梯，以及通向厨房方向的下行阶梯。",
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
      "label": "礼堂",
      "floor": "Ground floor · 入口层",
      "group": "keep",
      "status": "canon",
      "floorStatus": "canon",
      "note": "礼堂是用餐和集会的目的地。厨房在它正下方，不通过礼堂侧门直接抵达。",
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
      "label": "厨房",
      "floor": "地下 · 礼堂正下方",
      "group": "dungeons",
      "status": "canon",
      "floorStatus": "canon",
      "note": "从门厅下楼进入地下走廊，水果画中的梨会变成把手，打开厨房入口。本图采用已经打开的画门。",
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
      "label": "铜器储藏室",
      "floor": "地下 · 厨房服务区",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点补充的厨房储藏室；名称与具体布局不来自原著。",
      "sources": [],
      "position": [
        1035,
        1070
      ],
      "hidden": false
    },
    "gallery": {
      "label": "四楼肖像走廊",
      "floor": "Fourth floor · 四楼",
      "group": "academic",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "四楼与图书馆的楼层关系有依据；这条具体肖像走廊和相邻门的位置是重建。",
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
      "label": "三楼盔甲陈列室",
      "floor": "Third floor · 三楼",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "原著的盔甲陈列室在三楼、靠近奖品陈列室。当前图没有第二个可靠出口，因此只作为可返回的目的地。",
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
      "label": "东侧回廊",
      "floor": "地面 · 校地回廊",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "为庭院与温室之间补充的有顶通道；“东侧回廊”不是已核实的小说地名。",
      "sources": [],
      "position": [
        370,
        675
      ],
      "hidden": false
    },
    "hospital": {
      "label": "校医院",
      "floor": "一楼 · 本站选定方案",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "uncertain",
      "note": "《密室》第13章支持一楼位置；《凤凰社》第32章的路线暗示更高楼层。本站采用一楼重建，并不宣称楼层唯一。",
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
      "label": "变形术教室",
      "floor": "一楼 · 本站安排，原著未定",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "interpretation",
      "note": "原著未固定变形术教室的楼层。为保持教学区流线，本站将它接入一楼走廊。",
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
      "label": "二楼盥洗室走廊",
      "floor": "Second floor · 二楼",
      "group": "academic",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "通向桃金娘盥洗室的二楼走廊是合理衔接；原来的“废弃盥洗室”场景改为走廊。",
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
      "label": "桃金娘的盥洗室",
      "floor": "Second floor · 二楼",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "采用后续多次提及的二楼位置。蛇形记号在一只铜水龙头上；先显露管口，再进入。",
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
      "label": "魔法史教室",
      "floor": "First floor · 一楼",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "canon",
      "note": "魔法史教室位于一楼。与其他教室共用走廊，教室本身不承担穿行。",
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
      "label": "主楼梯",
      "floor": "连接多个楼层",
      "group": "keep",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "将城堡中的数段楼梯与平台压缩成一个导航地点；不把电影中的旋转楼梯结构当成精确原著平面图。",
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
      "label": "七楼走廊",
      "floor": "Seventh floor · 七楼",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "七楼的巨怪芭蕾挂毯与有求必应屋入口相对。门出现在空白墙上，不在挂毯后面。",
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
      "label": "图书馆",
      "floor": "Fourth floor · 四楼",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "按章节资料采用四楼位置。取消了穿过图书馆直达校长办公室的连接。",
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
      "label": "魔咒课教室",
      "floor": "Third floor · 三楼",
      "group": "academic",
      "status": "canon",
      "floorStatus": "canon",
      "note": "采用三楼魔咒课走廊的关系。教室通过中层平台接入，成为单独的目的地。",
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
      "label": "黑魔法防御术教室",
      "floor": "一楼 · 根据路线推定",
      "group": "teaching",
      "status": "canon",
      "floorStatus": "inferred",
      "note": "根据《密室》第6章的行走路线安排在一楼。卢平的博格特衣柜课发生在教员休息室，本站不将其说成此教室的原著事件。",
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
      "label": "校长办公室",
      "floor": "塔楼 · 入口楼层有差异",
      "group": "towers",
      "status": "canon",
      "floorStatus": "uncertain",
      "note": "稳定的入口特征是滴水兽和螺旋楼梯；不同卷中入口楼层有所变化。本站从七楼接入是选定的重建。",
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
      "label": "天文塔螺旋梯",
      "floor": "天文塔 · 上行楼梯",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "以螺旋楼梯抵达天文塔有原著依据；城垛到这段楼梯的具体连接由本站重建。",
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
      "label": "天文塔",
      "floor": "最高塔楼顶部",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "城堡最高的塔楼。独立攀登抵达，不再通过占卜教室穿行。",
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
      "label": "占卜教室",
      "floor": "North Tower · 北塔",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "北塔的小平台上方有活板门，银梯从门口放下；教室返回时也使用这个开口。",
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
      "label": "猫头鹰棚",
      "floor": "West Tower · 西塔顶部",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "猫头鹰棚位于西塔顶部。通过塔楼路线抵达，不必穿过校长办公室。",
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
      "label": "高处城垛",
      "floor": "高处 · 塔楼连接路线",
      "group": "towers",
      "status": "invented",
      "floorStatus": "interpretation",
      "note": "为几条塔楼路线设置的风景节点；连接包含未单独展示的步行和楼梯，不代表已证实的北侧建筑平面。",
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
      "label": "地下楼梯",
      "floor": "地下 · 地牢阶梯",
      "group": "dungeons",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "从地下服务区继续向地牢下降的楼梯。与通往深层密室的管道分开。",
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
      "label": "魔药课教室",
      "floor": "地下 · 地牢",
      "group": "dungeons",
      "status": "canon",
      "floorStatus": "canon",
      "note": "斯内普的魔药课在地牢内进行。教室返回绿灯通道，不再作为蓄水池的入口。",
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
      "label": "档案通道",
      "floor": "地下 · 站点扩展",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点创作的拱廊式档案通道，用来连接地窖与储物间；不再把独立阅览室当作过道。",
      "sources": [],
      "position": [
        800,
        1245
      ],
      "hidden": false
    },
    "crypt": {
      "label": "旧地窖",
      "floor": "地下 · 站点扩展",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点扩展场景，未找到对应的原著命名地点。",
      "sources": [],
      "position": [
        565,
        1245
      ],
      "hidden": false
    },
    "slytherin": {
      "label": "绿灯通道",
      "floor": "地下 · 站点扩展",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点扩展的地下交通节点；名称不表示它就是斯莱特林公共休息室。",
      "sources": [],
      "position": [
        800,
        1160
      ],
      "hidden": false
    },
    "reservoir": {
      "label": "地下蓄水池",
      "floor": "地下 · 站点扩展",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点扩展的地下水景；只沿画面中的干燥桥面往返。",
      "sources": [],
      "position": [
        1035,
        1245
      ],
      "hidden": false
    },
    "vault": {
      "label": "旧储物间",
      "floor": "地下 · 站点扩展",
      "group": "dungeons",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点扩展的旧储物间，通过档案通道进入。",
      "sources": [],
      "position": [
        800,
        1320
      ],
      "hidden": false
    },
    "courtyard": {
      "label": "南庭院",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "供校地路线汇合的庭院重建，确切方位和布局不作为小说事实。",
      "sources": [],
      "position": [
        370,
        775
      ],
      "hidden": false
    },
    "bridge": {
      "label": "石桥",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "保留电影感的石桥风景，但不把电影桥梁布局当成原著地图；三个实际通路连接庭院、湖岸和海格处。",
      "sources": [],
      "position": [
        580,
        775
      ],
      "hidden": false
    },
    "lake": {
      "label": "黑湖岸边",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "黑湖属于原著校园。湖岸、船屋和旧栈桥之间的具体步道是本站重建。",
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
      "label": "船屋",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "原著的一年级渡湖与地下泊船处有依据；这座可步行抵达的独立船屋采用电影感重建。",
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
      "label": "旧栈桥",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "站点补充的湖岸栈桥，是尽头景点，不再连接飞行课草坪。",
      "sources": [],
      "position": [
        1020,
        880
      ],
      "hidden": false
    },
    "forest": {
      "label": "禁林边缘",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "禁林位于校园边缘，靠近海格小屋。这里只有一条向林内延伸的路和原路返回。",
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
      "label": "林中空地",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "invented",
      "floorStatus": "invented",
      "note": "林内空地是合理场景；这片特定的蘑菇圈空地属于站点创作。",
      "sources": [],
      "position": [
        1020,
        925
      ],
      "hidden": false
    },
    "hut": {
      "label": "海格小屋与花园",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "原著及官方资料描述了校园边缘、紧邻禁林的小木屋。现在可从校地道路直接到达，不必先穿过禁林。",
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
      "label": "神奇动物围场",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "海格附近的神奇动物活动区域有情节背景；具体围栏、门和前往球场的路径是重建。",
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
      "label": "魁地奇球场",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "原著的球场与六个球门环保留。三条地面路线通过可见的场边门洞离场。",
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
      "label": "温室通道",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "温室在校地；这段玻璃通道和它的门位是为连接草药学场景所作的重建。",
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
      "label": "草药学温室",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "草药学在温室授课。沿通道到达温室，再从同一入口返回。",
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
      "label": "飞行课草坪",
      "floor": "Grounds · 校地",
      "group": "grounds",
      "status": "canon",
      "floorStatus": "canon",
      "note": "第一堂飞行课在平坦草地上，不等同于魁地奇比赛场；两者通过校园道路连接。",
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
      "label": "密室入口管道",
      "floor": "盥洗室下的深层管道",
      "group": "unmapped",
      "status": "canon",
      "floorStatus": "canon",
      "note": "将盥洗室下的管道与深处隧道合并为一个地点。向上返回借用福克斯协助上升的情节，不冒充普通楼梯。",
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
      "label": "密室",
      "floor": "城堡深处 · 密室",
      "group": "unmapped",
      "status": "canon",
      "floorStatus": "canon",
      "note": "巨大的柱廊与斯莱特林雕像来自原著；通行沿干燥石道，水面不作为步行出口。",
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
      "label": "密室尽头",
      "floor": "同一密室的尽头",
      "group": "unmapped",
      "status": "inferred",
      "floorStatus": "interpretation",
      "note": "这是同一密室尽头的近景，属于场景拆分；原著并没有另一个名叫“巨蛇圣所”的独立房间。",
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
      "label": "有求必应屋",
      "floor": "Seventh floor · 七楼",
      "group": "unmapped",
      "status": "canon",
      "floorStatus": "canon",
      "note": "七楼、挂毯对面的空白墙、带着需要往返三次，是原著入口机制。本站将往返简化成显露入口的交互。",
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
      "label": "地下水果画廊",
      "floor": "地下 · 厨房入口",
      "group": "dungeons",
      "status": "canon",
      "floorStatus": "canon",
      "note": "《火焰杯》第21章描述了地下宽阔石廊与水果画入口，用它连接门厅和厨房。",
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
      "label": "教学区走廊",
      "floor": "First floor · 一楼重建",
      "group": "teaching",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "将几间教室和校医院接入共同走廊。确切门序和相邻关系是重建。",
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
      "label": "中层楼梯平台",
      "floor": "Second–fourth · 二至四楼",
      "group": "academic",
      "status": "inferred",
      "floorStatus": "inferred",
      "note": "用一个楼梯场景表示二至四楼的分层路线，省略未单独绘出的平台与过道；各门不是位于同一楼层。",
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
      "label": "北塔入口平台",
      "floor": "北塔 · 占卜教室下方",
      "group": "towers",
      "status": "canon",
      "floorStatus": "canon",
      "note": "《阿兹卡班的囚徒》第6章的小平台、活板门和银梯。回七楼的路线经过压缩。",
      "sources": [
        "divination"
      ],
      "position": [
        420,
        105
      ],
      "hidden": false
    }
  },
  "sections": [
    {
      "id": "grounds",
      "title": "The Grounds",
      "zh": "校地与湖岸",
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
      "zh": "门厅与主楼梯",
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
      "zh": "一楼教学区",
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
      "zh": "二至四楼",
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
      "zh": "七楼与塔楼",
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
      "zh": "地下服务区与地牢",
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
      "zh": "隐藏路线",
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
    }
  ],
  "overviewSections": [
    {
      "id": "grounds",
      "title": "校地与湖岸",
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
      "title": "门厅与主楼梯",
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
      "title": "一楼教学区",
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
      "title": "二至四楼",
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
      "title": "七楼与塔楼",
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
      "title": "地下服务区与地牢",
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
      "title": "隐藏路线",
      "box": [
        25,
        1220,
        400,
        145
      ],
      "secret": true
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
