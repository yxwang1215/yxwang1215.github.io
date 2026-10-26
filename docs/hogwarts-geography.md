# 霍格沃茨地理复核与关系图

复核日期：2026-10-26。公开参考页为 **/hogwarts/atlas/**。本轮保留原有 **49 个场景 ID 和 URL**，补充 **4 个交通场景**；最终为 **53 个节点、52 条普通无向连接、2 个隐藏入口**。连通图保留两个独立环路。与原图的 60 条关系相比，删除 29 条、加入 23 条，保留 31 条。

这是一张可探索场景的关系图，不是原著城堡的测绘图。一次连接可能压缩数段走廊或楼梯；距离、朝向、门序和全部内部装修均不应理解为小说中的完整建筑设计。

## 数据与兼容边界

- `assets/js/hogwarts-atlas.js` 是实际通路和场景 URL 的唯一来源。
- `assets/js/hogwarts-geography.js` 保存地点说明、楼层证据、来源、布局坐标及逐边证据。图谱通过 `edges()` 从现行 atlas 生成连线；不另维护一张独立邻接表。
- 地点的 `status` 区分原著地点（`canon`）、重建场景（`inferred`）和站点扩展（`invented`）；`floorStatus` 另行保留推定、未定和有争议的楼层。两端都是原著地点，不会自动令其连接成为原著路线。
- 每条关系都有 `edgeEvidence`。`canon` 表示存在对应的原著关系或入口依据；`interpretation` 表示项目补全的通行安排。后者仍须在画面中有可辨识通路。
- 旧 URL 中的 `ground-floor`、`first-floor`、`quidditch`、`serpent-sanctum` 等片段保留兼容性，实际位置以元数据为准。`sanctum` 现在表示同一密室尽头的近景。
- 英国计层中，Ground floor 是入口层，First floor 是其上一层。局部出口键是画面中的选择标签；返程必须存在，但不同视角下无需使用相反罗盘键。

新增地址：

| ID | 作用 | URL |
|---|---|---|
| `basementPassage` | 门厅下方水果画像走廊，分往厨房与地牢 | `/hogwarts/castle/basement/fruit-portrait-passage/` |
| `firstFloorJunction` | 一楼教学走廊，承接四个目的地 | `/hogwarts/castle/academic-wing/first-floor/teaching-corridor/` |
| `midFloorStair` | 二至四楼的分层平台与交通 | `/hogwarts/castle/grand-staircase/middle-landings/` |
| `northTowerLanding` | 占卜教室下方的北塔平台 | `/hogwarts/castle/north-tower/trapdoor-landing/` |

## 连接结构

| 区域 | 场景数 | 主要结构 |
|---|---:|---|
| 校地与湖岸 | 16 | 前路、庭院、飞行草坪、球场组成环路；桥侧路径通向湖岸和海格处，海格处再分往禁林与围场。回廊连接庭院和温室。 |
| 门厅与主楼梯 | 3 | 门厅分往礼堂、主楼梯和地下水果画廊；主楼梯承接不同楼层。 |
| 一楼教学区 | 5 | 走廊连接校医院、魔法史、黑魔法防御术和变形术。四个房间均为目的地。 |
| 二至四楼 | 7 | 中层楼梯连接二楼盥洗室走廊、三楼盔甲陈列室与魔咒教室、四楼肖像走廊；图书馆从四楼走廊进入。 |
| 七楼与塔楼 | 8 | 七楼走廊分往办公室入口、北塔平台和上层交通。占卜课经银梯活板门；猫头鹰棚位于西塔，天文塔另有楼梯。 |
| 地下服务区与地牢 | 10 | 水果画廊分往厨房与地牢楼梯；地牢交通节点连接魔药教室、档案通道和蓄水池，档案通道再分往地窖和储物间。 |
| 隐藏路线 | 4 | 有求必应屋；密室管道、密室大厅及其尽头近景。该分组管理剧透，并不把七楼房间放到地下。 |

礼堂、教室、办公室、校医院、图书馆、盔甲陈列室及各塔楼目的地均不承担穿室交通。这是结合场景画面采用的空间设计原则，并非声称小说规定这些房间绝不可能有第二扇门。

29 条旧边的删除重点是：礼堂直接通厨房；教室、医院、图书馆和办公室之间连续串门；魔咒教室直接通塔楼；占卜室直接通天文塔；码头直接通飞行课；魔药教室直接通蓄水池；以及绕过正确楼层交通的旧捷径。完整禁止回归的 29 对关系记录在 `tests/hogwarts-maze-check.mjs`。23 条新边主要接入四个交通场景，并调整三楼目的地、海格校地入口及地下通道。

例如，从大门去储藏室的新路线是：

`gate → entry → basementPassage → kitchens → pantry`

从飞行草坪去海格处的最短连接路线是：

`flying → quidditch → paddock → hut`

这里的“最短”只计算连接次数，不代表真实距离或时间。

## 原著依据及必要限定

| 地点或机制 | 采用的判断 | 依据 |
|---|---|---|
| 厨房 | 位于礼堂正下方；从门厅下楼，经水果画中梨子机关进入。取消礼堂侧门直通。 | 《火焰杯》21章；[厨房章节索引](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/dungeons/kitchens/) |
| 有求必应屋 | 七楼，门出现在巴拿巴教巨怪芭蕾挂毯对面的空白墙；带着需要往返三次。 | 《凤凰社》18章；[官方百科](https://www.harrypotter.com/fact-file/locations/the-room-of-requirement) |
| 桃金娘盥洗室 | 采用二楼；铜水龙头的小蛇记号指向可开启的洗手池管道。部分早期措辞与官方文章存在楼层差异，来源 caveat 保留该问题。 | 《密室》9、16章，《火焰杯》22、25章；[盥洗室章节索引](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-second-floor/moaning-myrtles-bathroom/) |
| 占卜教室 | 北塔小平台、银梯、圆形活板门；没有直穿天文塔或魔咒教室的门。 | 《阿兹卡班的囚徒》6章；[占卜教室](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/north-tower/divination-classroom/) |
| 猫头鹰棚 | 西塔顶部，另经塔楼交通抵达；办公室为独立目的地。 | 《火焰杯》15章；[官方百科](https://www.harrypotter.com/fact-file/locations/owlery) |
| 海格处与飞行草坪 | 林缘木屋可从校地到达；飞行课使用平坦草坪，与魁地奇球场分开。 | 《魔法石》8–9章；[海格小屋](https://www.harrypotter.com/fact-file/locations/hagrids-hut)、[校地索引](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-grounds/) |
| 图书馆、魔咒课与盔甲陈列室 | 分别采用四楼、三楼、三楼；具体入口相邻关系为重建。 | 《魔法石》9、12章；[四楼](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-fourth-floor/)、[魔咒教室](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-third-floor/charms-classroom/)、[盔甲陈列室](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-third-floor/armour-gallery/) |
| 密室与尽头 | 尽头为人形萨拉查·斯莱特林雕像；第二个场景只是同一大厅的近景，没有新增原著“巨蛇圣所”。 | 《密室》16–17章；[密室章节索引](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/dungeons/chamber-of-secrets/) |

校医院采用一楼方案，但《密室》13章和《凤凰社》32章的路线存在差异；校长办公室保留塔楼、滴水兽及上升石梯，入口楼层不写成永远固定；变形术教室的一楼位置是项目安排。相关说明分别见[校医院](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-third-floor/hospital-wing/)、[校长办公室](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/hogwarts-seventh-floor/heads-office/)、[变形术教室](https://www.hp-lexicon.org/place/hogwarts-school-of-witchcraft-and-wizardry/transfiguration-classroom/)的章节索引。

独立湖边船屋是电影式场景重建；原著一年级到校使用城堡悬崖下的地下泊船处（《魔法石》6章）。石桥、东侧回廊、储藏室、地窖和蓄水池等亦明确标为扩展。卢平的博格特衣柜课发生在教员休息室，不能作为黑魔法防御术教室内部布局的证据（《阿兹卡班的囚徒》7章；[衣柜条目](https://www.hp-lexicon.org/thing/lupins-boggart-wardrobe/)）。

来源以七部小说的章节索引和官方百科交叉核对；Harry Potter Lexicon 是二手索引，不冒充小说原文。J.K. Rowling 后续文章另列为作者补充，不能反向当作七部小说中的明确设定。完整来源、章节缩写与 caveat 在共享 geography 数据中，公开图谱列出全部来源链接。

## 隐藏入口与访问边界

只有两个显露入口：

1. `bathroom → sluice`，类型 `basin`。先开启洗手池管口，再显式进入。向上返回引用《密室》17章福克斯协助上升的情节，是注明的魔法返回，不是可直接步行爬上的普通楼梯。
2. `corridor → requirement`，类型 `wall`。在挂毯对面的墙前完成简化的往返显露，再另行进入。挂毯本身不是穿越门。

剧透关闭时，公开图谱显示 49 个普通地点和 50 条可见关系；打开后显示全部 53 个地点、54 条关系。两个密室内部普通连接同样受剧透开关控制。

公开图谱可独立打开；选点、目录、路线查询不跳转、不写访问记录、不授予站台通行票。房间本身继续执行原有站台票据和有效探索会话检查。旅程中的地图只显示已访问节点及允许的信息，路径也只能经过已访问地点；它和公开图谱共用七个分区。

## 回归验证

从仓库根目录运行：

~~~sh
node tests/hogwarts-maze-check.mjs
node tests/hogwarts-map-check.mjs
node tests/hogwarts-geography-check.mjs
~~~

三组测试分别验证旧地址与图结构、私有地图的已访问路径约束、共享地理证据与公开图谱实际行为。最短路用独立的全点距离计算核对；公开图谱在无站台票和无探索会话的模拟页面中运行，验证全部来源链接、剧透切换、取消高亮及不产生导航或存储写入。

几何回归直接读取渲染后的 SVG 路径和地点框，检查全部 54 条连线是否到达正确端点、是否穿过无关地点。直线使用精确线段相交检查；三次曲线细分为 128 段检查。隐藏路线视图仍覆盖全图，保证七楼入口和地下密室都在可见范围。
