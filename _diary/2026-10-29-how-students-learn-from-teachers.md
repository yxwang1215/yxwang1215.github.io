---
title: "如果 Agent 也要练习：Student 如何向 Teacher 学习？"
date: 2026-10-29 14:00:00 +0800
subtitle: "从 SFT、OPD 到 Skill Learning：怎样教、怎样练，以及怎样证明真正学会。"
excerpt: "Teacher 知道什么，与 Student 真正学会什么，不是一回事。从示范与纠错，到苏格拉底式提问、最近发展区和六种练习理论，思考 Agent 如何获得可迁移的 Skill。"
cover: /images/diary/teacher-student-learning.svg
cover_alt: "暖色学习空间的插画：两个人物围坐在摊开的笔记本前，知识的往复路径连接 Teacher 与 Student"
cover_caption: "The Art of Teaching and Learning · 关于 Teacher–Student 学习与 Agent Skill 练习的随笔。"
redirect_from:
  - /journal/2026-10-29-six-educational-ideas-for-agent-skills/
tags:
  - 科研随想
  - Agent
  - Skill Learning
  - 教育
  - 知识蒸馏
---

最近在看 On-Policy Distillation（OPD）和 Agent Skill Learning 的论文，脑子里一直有个问题：**一个更强的 Teacher，究竟应该怎样教一个更弱的 Student？**

这个问题乍看很像机器学习里的知识蒸馏，仔细想却远比“把正确答案交给学生”复杂。回到真实的课堂，有的老师喜欢先示范，有的会等学生做错后纠正，有的只提问，有的只给一点提示。甚至同样一位老师，面对两个不同的学生，也不会采用完全相同的讲法。

我觉得这里真正值得研究的，不只是 *what the Teacher knows*，而是 **what the Student can actually learn**。教师拥有多少知识，与学生能够把多少知识变成自己的能力，是两件事。

## 从 SFT 和 OPD 说起

SFT 可以类比为一种示范式教学：先有一批高质量的答案或行动轨迹，再让 Student 在这些数据上学习。学生面对的是别人已经走过的路径。数据可以来自人类标注、合成数据或强模型，但不一定是 Student 自己实际会走到的状态。

OPD 改变了这一点。**Student 先按照当前策略生成轨迹，Teacher 再在 Student 实际访问的上下文上给出分布级监督。** 因此，Student 决定“在哪些状态上学”，Teacher 仍然决定“这些状态上的监督是什么”，最后更新的也仍然是 Student。严格来说，OPD 并不是 Student 把知识教给 Teacher。

这两种方式已经能对应人类教学中的两个直观场景：

- **SFT：**老师解一道例题，学生模仿正确做法。
- **OPD：**学生先自己做，老师对学生真正遇到的步骤进行指导。

而 RLVR 又更接近另一条路线：不要求老师告诉每一步怎么做，而是通过可验证的结果告诉学生这次尝试是否成功。

但人类教育显然不止“示范—模仿”“尝试—纠正”和“结果反馈”这几种方式。

## 孔子：什么时候教，比教什么同样重要

《论语·述而》有一句我很喜欢的话：

> 不愤不启，不悱不发。

这里的“愤”和“悱”，不是简单地说学生做错了，而是学生**已经在努力思考，接近想通却还没有想通**，或者想表达却表达不出来。教学要抓住这样的时机。

把它放进 Agent 里，就有了一个很自然的问题：**是不是每个 Student token、每次工具调用都值得 Teacher 监督？**

OPD 可以提供密集的监督，但监督密集不一定意味着教学有效。一个状态可能太简单，Student 本来就会；也可能太困难，即使 Teacher 给出解释，Student 仍无法把它转化为后续行为。真正值得介入的，可能是那些只差一个关键提示就能学会的状态。

这就不仅是 *uncertainty-aware* 的问题，还涉及 *teachability*：**Student 现在的困难，究竟能不能通过一次指导被改变？**

孔子紧接着又讲“举一隅不以三隅反，则不复也”。我理解这句话时，想到的不是要求模型记住一个答案，而是 Skill 的泛化：教过一次参数校验，Student 能否在另一套 API 上自己识别类似错误？只在原题成功，恐怕还不能算学会。

## 《学记》：引导，而不是替学生走完

《礼记·学记》说：

> 道而弗牵，强而弗抑，开而弗达。

很像现代教育里讨论的教学支架。老师要指出方向、启发思考，但不必替学生完成全部推理。

这对 Agent 尤其重要。一个 Teacher 可以直接给出完整代码、工具参数和正确执行顺序；Student 也许因此把当前任务做对了。但到了下一道题，它是否还会？这是另一回事。

我更感兴趣的是一种**有强度之分的教学信号**：

1. 先让 Student 独立执行。
2. 如果失败，只指出错误发生在哪一步。
3. 还不能解决，就给出原因或约束。
4. 再不行，才展示部分示范乃至完整解法。
5. 换一道相似但不同的题，撤去帮助，重新验证。

这里不是为了刻意少告诉 Student，而是要找到**刚好足以让它跨过当前障碍的最小指导**。一条能够被 Student 自己执行的简短规则，可能比一份完整却难以迁移的 Teacher 轨迹更有价值。

《学记》还有“教学相长”。我不想把它生硬解释成“弱模型也能训练强模型”。更准确的对应是：Student 的困惑、追问和失败，能够反过来改变 Teacher **如何教学**。Teacher 不必更新模型权重，也可以更新自己的教学策略、提示选择与规则组织方式。

## 苏格拉底：也许最好的监督不是答案

苏格拉底式诘问给我另一个启发：教师有时不需要直接说“正确做法是什么”，而是通过提问让学生发现自己的论证在哪里出现了矛盾。

比如一个 Coding Agent 调用 API 时，给错了参数类型。Teacher 可以直接给出正确调用，也可以先问：

“你确认过这个接口的参数 schema 吗？”

“这个字段接受列表还是字符串？”

“如果返回为空，是否意味着请求成功？”

这些问题不会自动让弱模型变强；过多的提问甚至可能浪费 token。但它们改变了学习过程：**Student 必须自己找到证据、修改判断，并重新执行。**

在 Skill Learning 中，我会很想比较两种规则的来源：一种由 Teacher 直接撰写，另一种由 Student 在追问和验证后自己归纳。如果后者在未见任务上更有效，那才说明“自己想通”不只是一个好听的教育比喻。

## 最近发展区：不是越难，越值得学

维果茨基的 **Zone of Proximal Development（ZPD，最近发展区）**，讨论的是学生独立能够完成的事情，与在他人帮助下能够完成的事情之间的距离。

这个思想可能是我最想迁移到蒸馏里的部分。

假设有三个任务：

- A：Student 不用帮助就能完成。
- B：Student 独立完成不了，但在一个关键提示后能完成。
- C：Student 即使得到详细解释，也难以完成。

如果 Teacher 的调用预算有限，我会优先考虑 B。因为 A 的指导收益可能很小，C 的教学成本可能很高，而 B 恰好处在能够转化为能力的区域。

需要注意，**“带提示能做对”不等于“已经学会”**。最近发展区只帮助我们找到候选教学机会。要判断学习是否发生，还必须把提示撤掉，让 Student 在新的任务中独立表现。

所以相比只看 Teacher–Student 的性能差距，我更想测量三件事：独立做题成功率、得到帮助后的成功率、**撤除帮助后在新任务上的成功率**。最后一个才是教学真正想追求的结果。

## 认知学徒制：从示范到独立

在认知学徒制（Cognitive Apprenticeship）中，常见的教学过程包括 Modeling、Coaching、Scaffolding 和 Fading：老师先把隐含的思考过程展示出来，随后在学生动手时指导，再逐渐撤去支架，把责任交回学生。

这让我想到一个可能的 Skill 学习流程：

**Teacher 示范 → Student 尝试 → Teacher 提示 → Student 重试 → 生成 Skill → 撤去 Teacher → 跨任务测评。**

其中最关键的不是前几个箭头，而是最后一步。一个 Agent 如果每次都需要 Teacher 救场，实际上只是完成了协作，并没有获得可迁移的独立能力。

因此，训练阶段可以允许多轮帮助，但评测必须严格区分两种结果：**带 Teacher 的即时任务完成率**和**没有 Teacher 的长期 Skill 收益**。把这两个数字混在一起，很容易高估教学的效果。

## 生产性失败：错误也可能是教材

Manu Kapur 研究的 Productive Failure（生产性失败）提醒我们，某些学习任务中，先探索、再接受知识整合，可能比先听完整讲解更有利于理解和迁移。

它不是“失败越多越好”，而是说：**经过设计的探索，以及随后对不同尝试的比较和解释，可以让失败产生学习价值。**

对于 Agent，我想象的不是简单地反复采样失败轨迹，而是让 Student 先尝试几条不同路径，Teacher 再指出它们共同忽略的条件、各自违反的约束，以及成功策略为什么不同。

例如三个失败的工具调用，可能暴露的是同一个根本问题：Agent 没有先检查输入输出契约。最后应该被保存成 Skill 的，未必是三条针对具体报错的补丁，而可能是一条更加通用的执行原则。

当然，失败轨迹也会包含大量偶然噪声。如何分清“有教学价值的错误”和“随机坏运气”，是这一方向真正难的地方。

## 同伴教学与术业有专攻：Teacher 不必永远最强

韩愈在《师说》中写道：

> 闻道有先后，术业有专攻。

这句话很适合提醒我们：一个总体表现更强的 Teacher，也未必在每一个领域、每一个决策上都更可靠。

数学推理、代码调试、文档检索和环境交互，需要的知识可能不同。让不同专家根据专长提供指导，比始终相信单一 Teacher 更合理。但如果只是按题型路由模型，还算不上新的教育机制。

更有意思的是同伴教学（Peer Instruction）。它让学习者先独立判断，再通过讨论暴露理解差异。转化为 Multi-Agent 时，可以让能力接近、擅长领域不同的 Students 交换解释、互相质疑，再由环境反馈而不是多数投票决定哪条规则值得保留。

这里尤其需要防范“集体自信地犯错”。同伴之间的意见一致，并不等于答案正确；有效的同伴学习应有独立验证。

## 从参数蒸馏到 Skill 蒸馏

读到 [SkillGen](https://arxiv.org/abs/2605.10999)、[SKILL-KD](https://arxiv.org/abs/2607.28048) 和最近的 [Socratic Skill Learning](https://arxiv.org/abs/2610.17860) 时，我觉得这些工作已经在朝类似方向探索。

SkillGen 从 Agent 的成功与失败中生成可检查的 Skill，并比较有无 Skill 时的收益与损害；SKILL-KD 对比强 Teacher 与弱 Student 的执行轨迹，提炼行为差异，再让 Student 重试；Socratic Skill Learning 则强调把教师指导与学生实践交错进行，让 Student 自己承担探索与 Skill 编写的责任。

它们都启发了一个区别：**“把知识写成文档”并不等于“把知识教给 Student”。**

如果 Student 参数始终冻结，外部 Skill 文档可以视为被优化的学习产物。Teacher 的答案、反问、提示、批评和示范，都是候选教学信号。但这些信号只有在转化成 Student 能够独立执行的规则以后，才真正构成有效的 Skill。

我甚至觉得，研究对象可以从“怎样生成最好的 Skill”进一步变成：**对给定的 Student，什么教学过程最容易形成可迁移的 Skill？**

## 如果把它变成一个可验证的研究问题

我想把问题拆成四个相互关联的部分。

### 教什么：Task Selection

先找到 Student 尚不能独立完成、但有可能通过适度帮助掌握的任务，而不是一味挑最难的题。比较按失败率、模型不确定性、Teacher–Student 差异，以及实际教学收益来选任务，哪一种更有效。

### 什么时候教：Teaching Timing

Teacher 是在 Student 第一次犹豫时介入，还是在明确失败后介入？是每一步都提供反馈，还是只在关键决策点给出反馈？这不仅关乎 token 成本，也关乎 Student 是否真正经过自己的探索。

### 怎么教：Teaching Strategy

对同一类错误，比较完整示范、直接纠错、苏格拉底式提问、渐进提示、反例和失败对比。教学信号不一定越详细越好，关键在于是否适合 Student 当前的能力。

### 怎么知道学会：Generalization

我认为这一项必须放在最重要的位置。不能只测训练任务的重试成功率，而应在未见任务、不同环境和新会话中，**完全撤除 Teacher 的实时帮助**，评估 Student 是否还能成功。

同时记录 Teacher API 成本、Skill 长度、执行开销和负迁移：某条规则修复了多少原本失败的任务，又破坏了多少原本能成功的任务。

一个合理的实验至少需要以下对照：无 Skill、直接 Teacher 示范、基于 Student 当前轨迹的反馈、Teacher–Student 对比式 Skill 生成，以及自适应教学策略。固定 Student 模型、总预算和测试集，才能知道收益是不是来自更好的教学方式，而不只是用了更多 Teacher token。

这些想法目前还是**研究假设**，不是已经得到实验证实的新算法。教育学中的规律也不能原样视作 LLM 的学习规律；人会形成长期的认知结构，而冻结模型加一份 Skill 文档，本质上仍是条件化推理。恰恰因为存在这样的差别，类比才需要被严格实验检验。

## 从教学走向练习：六种教育心理学假设

前面讨论的是 Teacher 在什么时机、以什么方式帮助 Student。但对于参数冻结、只能修改外部 Skill 的 API-only Agent，还有一个更具体的问题：**Skill 生成以后，应该怎样练习、验证和迁移？**

这六种思路关注的不再只是 Teacher 提供什么答案，而是 Student 通过什么练习经验学会**在未见任务中选择、修订或放弃一条 Skill**。它们只是待验证的研究假设：不能因为借用了教育学术语，就默认机制对 LLM 也成立。

### 01 · Desirable Difficulties：最容易学会的，不一定最值得练

「有益困难」（Desirable Difficulties）提醒我们：练习时的即时顺利，不一定意味着未来表现更好。适当的变式、检索与挑战，可能促进更稳固的迁移；当然，过难的任务也可能只是浪费时间。

在 Skill Learning 里，大多数流程容易偏向已有成功经验，或优先修补当前最常见的失败。我更想主动选择**稍有困难、但经过反馈能够解决的任务变体**。

比如为一个 API 调用 Skill 制造几种受控变化：参数字段改名、缺少权限、响应 schema 变化、调用顺序被约束。重点不是让 Agent 多失败几次，而是促使它学到「先检查什么条件、何时切换策略」这样的规则。

一个可检验的假设是：

> 在相同 API 调用预算下，按预期迁移收益选择练习任务，能否优于随机抽题、只练简单题、只练最难题，以及按历史失败率选题？

实验需要按难度分桶，并用独立的未见环境评测。只有训练期的错误率提高而迁移不变，不能叫有益困难。

### 02 · Preparation for Future Learning：今天的分数，不是全部

「为未来学习做准备」（Preparation for Future Learning）更吸引我。它不只问今天会不会做，还问**面对明天的新情况，能多快学会**。

假设两个 Skill 都能解决目前的数据库迁移问题：

- Skill A 记住当前框架版本下的准确操作顺序；
- Skill B 记住发现接口约束、检查版本差异、验证兼容性的程序性原则。

A 在原环境中可能更快；B 的初始准确率甚至可能略低。但当 API 或仓库发生变化，只允许获得 1、2、4 次新任务反馈时，B 是否更容易被修订并恢复性能？

我想把目标从「当前成功率」扩展为 **future adaptation performance**：测量新任务家族上，Skill 随有限反馈逐步更新的成功率曲线、曲线下面积和达到目标性能需要的 API 成本。

> 一条有价值的 Skill，可能不是当前最强的规则，而是下一次环境改变时最容易适应的规则。

这里要格外小心数据划分：初始生成、内部验证、近迁移、远迁移任务必须分开。不能让最终迁移任务提前参与 Skill 选择。

### 03 · Interleaved Practice：真正困难的是区分相似的技能

交错练习（Interleaved Practice）最有价值的部分，并不是把不同任务随机洗牌，而是帮助学习者**辨别看似相近、但应采用不同策略的情况**。

Coding Agent 很容易遇到这样的混淆：

| 任务表象 | 实际关键 Skill |
| --- | --- |
| 数据字段发生变化 | Schema Migration |
| 旧客户端仍要正常工作 | Backward Compatibility |
| 序列化格式不一致 | Serialization Repair |
| 三个问题同时出现 | Skill 的条件化组合 |

如果分别用一组纯粹的任务生成三个 Skill，再把它们放入库中，Agent 可能每个都会，却在真实任务中路由错误。

一个可行的做法是记录 **Skill Confusion Matrix**：某类任务本应选择 Skill A，Agent 却调用 B 的比例是多少？接着优先生成能够区分 A/B 的 *minimal contrast pairs*，把适用条件、禁用条件与组合条件写进 Skill。

评价不应只看单个 Skill 的成功率，还应看 Skill 误选率、组合冲突率、未见复合任务成功率。需要与普通随机交错、分块训练和基于语义相似度的 Skill Retrieval 比较。

### 04 · Mastery Learning + Knowledge Tracing：到底算不算掌握？

传统掌握学习强调达到一定熟练程度后再进入下一阶段；知识追踪则尝试估计学习者在不同知识点上的状态。

但对于冻结的 LLM，我不愿轻易说模型「掌握了」某个 Skill。更精确的表述应该是：**在给定模型、任务类型和环境版本下，外部 Skill 有多可靠？**

例如一个 Tool-use Skill 可以拆成四项可测能力：识别接口、满足前置条件、执行调用、恢复错误。维护每个能力在不同任务切片上的成功记录和不确定度。

当某个切片表现稳定时，减少重复验证；当环境变化或置信度不足时，补充针对性测试。这样「掌握状态」就不只是一个 LLM 自评标签，而是由真实执行反馈支持的可靠性估计。

可以检验：动态验证预算是否比固定等量采样更好？当 Skill 在新环境中退化时，这种表示能否提前发现？

### 05 · Learning by Teaching：教得会别人，才更接近真正可复用

「以教促学」（Learning by Teaching）给了我一个很直接的实验：让生成 Skill 的 Agent **把它教给另一个从未见过原轨迹的 Agent**。

如果一条 Skill 只能让原来的模型在原来的工具环境中工作，它可能只是过拟合的提示词；如果另一个模型读完它，也能独立完成新任务，这至少说明规则具有一定可传递性。

可以安排 Author–Student–Verifier 三个角色：

1. Author 从执行轨迹中归纳 Skill。
2. 新 Student 只接收 Skill 文档，不接收原任务的答案或执行历史。
3. Verifier 在未见任务中检查 Student 的独立执行结果。
4. Author 根据 Student 的真实误用情况修订规则的先决条件和表达方式。

我最想测的不是「两个 Agent 能不能配合解决眼前任务」，而是**把实时 Teacher 移除以后，Skill 能否在不同 backbone 和不同 harness 上独立产生增益**。

当然，Teacher–Student 和 Skill Distillation 已经有不少相关工作。仅仅交换角色并不新；这里值得研究的是用 *teachability* 作为 Skill 质量的外部检验信号。

### 06 · Expertise Reversal Effect：对初学者有用的指导，可能拖累专家

专长反转效应（Expertise Reversal Effect）提醒我们：详细、显式的教学支架对初学者可能很有用，但对已有经验者可能造成冗余和干扰。

Agent Skill 也存在类似的可能性。弱模型也许需要逐步列出 API 调用、异常分支和检查清单；强模型可能只需几条关键约束。过长的 Skill 不仅消耗上下文，还可能强行覆盖模型本来正确的策略。

因此同一个 Skill 不一定只有一种写法。我想把它表示为几种**可验证的指导粒度**：简短原则、条件化决策规则、完整步骤、带异常恢复的详细操作方案。

让 Agent 根据目标模型的历史表现和任务风险选择指导粒度，并把无 Skill 也作为合法选项。研究的不是「强模型一定少看提示」，而是估计**某条额外指令是否真有正的边际收益**。

这也回应了 Skill 研究中的负迁移问题：即使一条 Skill 对某个模型有效，也不代表它适用于所有能力层级。

## 两条值得优先验证的研究路线

我不想把六个机制一股脑塞进同一个新框架；那样最终即使涨点，也很难知道原因。更合理的是先选一个**清晰、可证伪的核心假设**。

目前我会优先考虑两条路线。

**路线 A：Difficulty-Aware Preparation for Transferable Skills**

把「有益困难」与「为未来学习做准备」组合起来。用选择器决定下一道练习题，Skill 优化器根据轨迹更新外部规则，最后在新任务家族中观察少量反馈下的适应曲线。关键问题是：练什么，才能让下一次学习更快？

**路线 B：Skill Boundary Learning**

从交错练习出发，专门研究相似 Skill 的判别边界、相互干扰以及组合条件。关键问题是：会使用多个 Skill，是否等于知道什么时候不应该使用某个 Skill？

建议把 [SkillGen](https://arxiv.org/abs/2605.10999)、[Socratic Skill Learning](https://arxiv.org/abs/2610.17860)、[SKILL-KD](https://arxiv.org/abs/2607.28048)、[COBRA-Skills](https://arxiv.org/abs/2609.11682) 等作为相关基线，优先使用有执行式判定器的 Agent 任务。实验固定基础 LLM、初始任务、验证预算与可使用的上下文，并同时报告：

- 当前任务成功率，以及撤除实时 Teacher 后的独立成功率；
- 近迁移与远迁移成功率、少量反馈下的适应曲线；
- Skill 修复原本失败任务的数量，以及破坏原本成功任务的数量；
- 全过程 API Token、工具执行费用与推理延迟。

如果只是优化时多跑了几十次 API 才获得一点提升，还不能证明教学思想有效。更好的方法应当在**相同预算、相同信息权限与相同测试协议**下，改变学习过程本身。

## 最后，教师知道什么，不等于学生学会什么

回头看，从孔子的“不愤不启”，到《学记》的“开而弗达”，从苏格拉底的追问，到最近发展区、认知学徒制和生产性失败；再到有益困难、交错练习、为未来学习做准备与专长反转效应，问题逐渐变得完整：**教什么、何时介入、如何指导、怎样练习，以及如何证明能力真正发生了迁移。**

我们在知识蒸馏里习惯问：

*How can we transfer knowledge from the Teacher to the Student?*

但我越来越想把问题换成：

**What can the Student actually learn from the Teacher?**

前者看重知识从哪里来，后者更在意知识最终有没有留下。

对于下一代 Agent Skill Learning，也许真正值得优化的不是 Teacher 与 Student 的差异有多大，而是：**在有限的教学预算下，让 Student 获得多少可以独立、稳定、跨任务复用的能力。**

如果把它进一步落到冻结参数的 API-only Agent 上，我还想追问一句：*How should an agent practice today so that its skills become more useful tomorrow?*

---

### 阅读线索

**教育经典与教学研究**

- [《论语·述而》：不愤不启、举一反三（中国哲学书电子化计划）](https://ctext.org/lunyu-zhushu/shu-er/zhs)
- [《礼记·学记》：道而弗牵、开而弗达（中国哲学书电子化计划）](https://ctext.org/wiki.pl?chapter=7376&if=gb&remap=gb)
- [Collins, Brown & Holum — Cognitive Apprenticeship: Making Thinking Visible](https://www.aft.org/ae/winter1991/collins_brown_holum)
- [Kapur — Learning from Productive Failure](https://doi.org/10.1080/23735082.2015.1002195)
- [Mazur — Peer Instruction: A User's Manual](https://mazur.harvard.edu/publications/peer-instruction-users-manual)
- [Bloom — Learning for Mastery (1968)](https://eric.ed.gov/?id=ED053419)

**教育心理学与练习研究**

- [Bjork & Bjork — Making Things Hard on Yourself, But in a Good Way](https://bjorklab.psych.ucla.edu/research/)
- [Schwartz & Bransford — A Time for Telling](https://doi.org/10.1207/S1532690XCI1604_4)
- [Dunlosky et al. — Improving Students' Learning With Effective Learning Techniques](https://doi.org/10.1177/1529100612453266)
- [Chi et al. — Self-Explanations: How Students Study and Use Examples](https://doi.org/10.1207/s15516709cog1302_1)
- [Kalyuga et al. — The Expertise Reversal Effect](https://doi.org/10.1207/S15326985EP3801_4)

**OPD 与 Agent Skill Learning**

- [Rethinking On-Policy Distillation of Large Language Models](https://arxiv.org/abs/2604.13016)
- [SkillGen: Verified Inference-Time Agent Skill Synthesis](https://arxiv.org/abs/2605.10999)
- [SKILL-KD: Contrastive Skill Distillation for LLM Agents](https://arxiv.org/abs/2607.28048)
- [Socratic Skill Learning: Interleaving Teaching and Practice for Transferable Agent Skills](https://arxiv.org/abs/2610.17860)
- [COBRA-Skills: Contextual Bandit-Guided Skill Evolution](https://arxiv.org/abs/2609.11682)
