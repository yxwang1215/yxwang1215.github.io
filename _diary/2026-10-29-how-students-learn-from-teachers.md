---
title: "Student 究竟应该如何向 Teacher 学习？"
date: 2026-10-29 14:00:00 +0800
subtitle: "从 SFT、OPD 到孔子、苏格拉底与最近发展区：知识传递之外，还有学习本身。"
excerpt: "读 OPD 与 Agent Skill Distillation 时想到：Teacher 知道什么，与 Student 最后能够学会什么，未必是一回事。古今教育思想或许能帮助我们重新设计教学信号、介入时机与验证方式。"
tags:
  - 科研随想
  - 知识蒸馏
  - 教育
  - Agent
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

## 最后，教师知道什么，不等于学生学会什么

回头看，从孔子的“不愤不启”，到《学记》的“开而弗达”，从苏格拉底的追问，到最近发展区、认知学徒制和生产性失败，它们关注的其实是不同的教学变量：**时机、难度、方式、探索、反馈与迁移**。

我们在知识蒸馏里习惯问：

*How can we transfer knowledge from the Teacher to the Student?*

但我越来越想把问题换成：

**What can the Student actually learn from the Teacher?**

前者看重知识从哪里来，后者更在意知识最终有没有留下。

对于下一代 Agent Skill Learning，也许真正值得优化的不是 Teacher 与 Student 的差异有多大，而是：**在有限的教学预算下，让 Student 获得多少可以独立、稳定、跨任务复用的能力。**

---

### 阅读线索

**教育思想与教学研究**

- [《论语·述而》：不愤不启、举一反三（中国哲学书电子化计划）](https://ctext.org/lunyu-zhushu/shu-er/zhs)
- [《礼记·学记》：道而弗牵、开而弗达（中国哲学书电子化计划）](https://ctext.org/wiki.pl?chapter=7376&if=gb&remap=gb)
- [Collins, Brown & Holum — Cognitive Apprenticeship: Making Thinking Visible](https://www.aft.org/ae/winter1991/collins_brown_holum)
- [Kapur — Learning from Productive Failure](https://doi.org/10.1080/23735082.2015.1002195)
- [Mazur — Peer Instruction: A User's Manual](https://mazur.harvard.edu/publications/peer-instruction-users-manual)
- [Bloom — Learning for Mastery (1968)](https://eric.ed.gov/?id=ED053419)

**AI 与 Skill Learning**

- [Rethinking On-Policy Distillation of Large Language Models](https://arxiv.org/abs/2604.13016)
- [SkillGen: Verified Inference-Time Agent Skill Synthesis](https://arxiv.org/abs/2605.10999)
- [SKILL-KD: Contrastive Skill Distillation for LLM Agents](https://arxiv.org/abs/2607.28048)
- [Socratic Skill Learning: Interleaving Teaching and Practice for Transferable Agent Skills](https://arxiv.org/abs/2610.17860)
