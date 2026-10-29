---
title: "如果 Agent 也要练习：六种教育思想与 Skill Learning"
date: 2026-10-29 14:10:00 +0800
subtitle: "从有益困难、为未来学习做准备，到交错练习、掌握学习、以教促学与专长反转效应。"
excerpt: "Skill 生成以后，怎样练习、何时验证、如何迁移？把六种教育心理学思想转化为可测试的 API-only Agent Skill 研究假设。"
tags:
  - 科研随想
  - Agent
  - Skill Learning
  - 教育
---

刚写完 [《Student 究竟应该如何向 Teacher 学习？》](/journal/2026-10-29-how-students-learn-from-teachers/)，我又想到一个更具体的问题：**如果不更新 LLM 参数，只允许 Agent 修改外部 Skill，那么人类教育中关于「练习与迁移」的思想，还能给我们什么启发？**

最近读到的 [SkillGen](https://arxiv.org/abs/2605.10999) 强调从成功与失败轨迹中生成 Skill，并用真实执行验证净收益；[Socratic Skill Learning](https://arxiv.org/abs/2610.17860) 则把教师指导与 Student 实践交错进行。这些工作让我觉得，下一步或许不该只是继续让 Agent *generate more skills*，而是要问：**什么样的学习经历，会使 Skill 在未来更可靠、更容易迁移？**

下面记下六个来自教育心理学的研究假设。它们不是已经验证的新算法，也不能仅因为换了教育学名词就算创新。真正有意思的是：能否用冻结的 API 模型、可执行任务和严格的迁移测评，证明对应机制确实有效？

## 01 · Desirable Difficulties：最容易学会的，不一定最值得练

「有益困难」（Desirable Difficulties）提醒我们：练习时的即时顺利，不一定意味着未来表现更好。适当的变式、检索与挑战，可能促进更稳固的迁移；当然，过难的任务也可能只是浪费时间。

在 Skill Learning 里，大多数流程容易偏向已有成功经验，或优先修补当前最常见的失败。我更想主动选择**稍有困难、但经过反馈能够解决的任务变体**。

比如为一个 API 调用 Skill 制造几种受控变化：参数字段改名、缺少权限、响应 schema 变化、调用顺序被约束。重点不是让 Agent 多失败几次，而是促使它学到「先检查什么条件、何时切换策略」这样的规则。

一个可检验的假设是：

> 在相同 API 调用预算下，按预期迁移收益选择练习任务，能否优于随机抽题、只练简单题、只练最难题，以及按历史失败率选题？

实验需要按难度分桶，并用独立的未见环境评测。只有训练期的错误率提高而迁移不变，不能叫有益困难。

## 02 · Preparation for Future Learning：今天的分数，不是全部

「为未来学习做准备」（Preparation for Future Learning）更吸引我。它不只问今天会不会做，还问**面对明天的新情况，能多快学会**。

假设两个 Skill 都能解决目前的数据库迁移问题：

- Skill A 记住当前框架版本下的准确操作顺序；
- Skill B 记住发现接口约束、检查版本差异、验证兼容性的程序性原则。

A 在原环境中可能更快；B 的初始准确率甚至可能略低。但当 API 或仓库发生变化，只允许获得 1、2、4 次新任务反馈时，B 是否更容易被修订并恢复性能？

我想把目标从「当前成功率」扩展为 **future adaptation performance**：测量新任务家族上，Skill 随有限反馈逐步更新的成功率曲线、曲线下面积和达到目标性能需要的 API 成本。

> 一条有价值的 Skill，可能不是当前最强的规则，而是下一次环境改变时最容易适应的规则。

这里要格外小心数据划分：初始生成、内部验证、近迁移、远迁移任务必须分开。不能让最终迁移任务提前参与 Skill 选择。

## 03 · Interleaved Practice：真正困难的是区分相似的技能

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

## 04 · Mastery Learning + Knowledge Tracing：到底算不算掌握？

传统掌握学习强调达到一定熟练程度后再进入下一阶段；知识追踪则尝试估计学习者在不同知识点上的状态。

但对于冻结的 LLM，我不愿轻易说模型「掌握了」某个 Skill。更精确的表述应该是：**在给定模型、任务类型和环境版本下，外部 Skill 有多可靠？**

例如一个 Tool-use Skill 可以拆成四项可测能力：识别接口、满足前置条件、执行调用、恢复错误。维护每个能力在不同任务切片上的成功记录和不确定度。

当某个切片表现稳定时，减少重复验证；当环境变化或置信度不足时，补充针对性测试。这样「掌握状态」就不只是一个 LLM 自评标签，而是由真实执行反馈支持的可靠性估计。

可以检验：动态验证预算是否比固定等量采样更好？当 Skill 在新环境中退化时，这种表示能否提前发现？

## 05 · Learning by Teaching：教得会别人，才更接近真正可复用

「以教促学」（Learning by Teaching）给了我一个很直接的实验：让生成 Skill 的 Agent **把它教给另一个从未见过原轨迹的 Agent**。

如果一条 Skill 只能让原来的模型在原来的工具环境中工作，它可能只是过拟合的提示词；如果另一个模型读完它，也能独立完成新任务，这至少说明规则具有一定可传递性。

可以安排 Author–Student–Verifier 三个角色：

1. Author 从执行轨迹中归纳 Skill。
2. 新 Student 只接收 Skill 文档，不接收原任务的答案或执行历史。
3. Verifier 在未见任务中检查 Student 的独立执行结果。
4. Author 根据 Student 的真实误用情况修订规则的先决条件和表达方式。

我最想测的不是「两个 Agent 能不能配合解决眼前任务」，而是**把实时 Teacher 移除以后，Skill 能否在不同 backbone 和不同 harness 上独立产生增益**。

当然，Teacher–Student 和 Skill Distillation 已经有不少相关工作。仅仅交换角色并不新；这里值得研究的是用 *teachability* 作为 Skill 质量的外部检验信号。

## 06 · Expertise Reversal Effect：对初学者有用的指导，可能拖累专家

专长反转效应（Expertise Reversal Effect）提醒我们：详细、显式的教学支架对初学者可能很有用，但对已有经验者可能造成冗余和干扰。

Agent Skill 也存在类似的可能性。弱模型也许需要逐步列出 API 调用、异常分支和检查清单；强模型可能只需几条关键约束。过长的 Skill 不仅消耗上下文，还可能强行覆盖模型本来正确的策略。

因此同一个 Skill 不一定只有一种写法。我想把它表示为几种**可验证的指导粒度**：简短原则、条件化决策规则、完整步骤、带异常恢复的详细操作方案。

让 Agent 根据目标模型的历史表现和任务风险选择指导粒度，并把无 Skill 也作为合法选项。研究的不是「强模型一定少看提示」，而是估计**某条额外指令是否真有正的边际收益**。

这也回应了 Skill 研究中的负迁移问题：即使一条 Skill 对某个模型有效，也不代表它适用于所有能力层级。

## 这些想法如何变成一项真正的实验？

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

## 这不是把教育理论直接套在语言模型上

这里始终要保留一个边界：人类教育理论讨论的是真实学习者在时间中的知识组织和能力改变，而 API-only Agent Skill 往往只是**冻结模型 + 可编辑的外部程序性知识**。二者不能直接等同。

不过，这也让假设变得更容易检验：我们可以清楚地区分模型参数没有变化时，究竟是任务选择、教学时机、Skill 表示还是调用策略在改变最终表现。

如果将来真能做出一篇论文，我希望它回答的不是「怎样写出更长、更聪明的 Skill」，而是：

**How should an agent practice today so that its skills become more useful tomorrow?**

---

### 阅读线索

**教育心理学**

- [Bjork & Bjork — Making Things Hard on Yourself, But in a Good Way](https://bjorklab.psych.ucla.edu/research/)
- [Schwartz & Bransford — A Time for Telling](https://doi.org/10.1207/S1532690XCI1604_4)
- [Dunlosky et al. — Improving Students' Learning With Effective Learning Techniques](https://doi.org/10.1177/1529100612453266)
- [Bloom — Learning for Mastery](https://eric.ed.gov/?id=ED053419)
- [Chi et al. — Self-Explanations: How Students Study and Use Examples](https://doi.org/10.1207/s15516709cog1302_1)
- [Kalyuga et al. — The Expertise Reversal Effect](https://doi.org/10.1207/S15326985EP3801_4)

**Agent Skill 方法**

- [SkillGen: Verified Inference-Time Agent Skill Synthesis](https://arxiv.org/abs/2605.10999)
- [Socratic Skill Learning](https://arxiv.org/abs/2610.17860)
- [SKILL-KD: Contrastive Skill Distillation](https://arxiv.org/abs/2607.28048)
- [COBRA-Skills: Contextual Bandit-Guided Skill Evolution](https://arxiv.org/abs/2609.11682)
