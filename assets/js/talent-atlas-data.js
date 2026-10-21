/* Talent Atlas v1.0 — original, exploratory self-report item bank.
   Each dimension contains three facets × three items. No proprietary test items. */
(function (root) {
  "use strict";
  const dimensions = [
    {
      id: "analysis", zh: "分析推理", en: "Analytical reasoning",
      subtitle: "寻找规律，拆解复杂问题", subtitleEn: "Find patterns and unpack complex problems",
      icon: "◈", color: "#5475c4",
      action: "选一个尚未解决的问题，写下三个假设和验证它们的最小实验。",
      actionEn: "Pick an open problem; write three hypotheses and a minimal experiment for each.",
      interest: [
        ["我喜欢把一个复杂问题拆成几个可以逐步解决的小问题。", "I enjoy splitting a complex problem into smaller solvable parts."],
        ["比起直接接受结论，我更愿意追问证据来自哪里。", "I prefer tracing the evidence behind a conclusion rather than accepting it immediately."],
        ["比较不同解释并找出它们的差异，会让我投入其中。", "Comparing explanations and their differences holds my attention."]
      ],
      ease: [
        ["面对信息混乱的情况，我通常能找到关键变量。", "I can usually identify key variables in a messy situation."],
        ["当推理链条很长时，我往往难以指出哪一步最不可靠。", "I often struggle to locate the weakest step in a long argument."],
        ["我能较快看出两个看似不同的问题是否具有相似结构。", "I quickly notice when two different-looking problems share a structure."]
      ],
      evidence: [
        ["过去六个月，我曾主动检验过一个自己原本相信的判断。", "In the past six months, I have actively tested a belief I held."],
        ["过去六个月，我曾通过分解问题解决一件原先难以推进的事。", "In the past six months, decomposing a problem helped me make progress."],
        ["过去六个月，我曾依据新证据修正过自己的方案。", "In the past six months, new evidence led me to revise a plan."]
      ]
    },
    {
      id: "exploration", zh: "探索学习", en: "Learning & exploration",
      subtitle: "主动求知，跨领域迁移", subtitleEn: "Explore and transfer knowledge",
      icon: "✳", color: "#427e9b",
      action: "挑选一个陌生领域，持续一周做学习笔记，并尝试迁移一条方法到熟悉的问题。",
      actionEn: "Study an unfamiliar field for a week and apply one idea to a familiar challenge.",
      interest: [
        ["即使没有考试或任务要求，我也想了解陌生领域的基本原理。", "Even without an assignment, I want to understand unfamiliar fields."],
        ["发现两个学科之间的联系，会让我格外兴奋。", "Discovering a connection between disciplines excites me."],
        ["我愿意花时间弄明白一个暂时用不上的概念。", "I am willing to understand a concept without immediate practical use."]
      ],
      ease: [
        ["初次接触新主题时，我通常能自己规划入门路径。", "I can usually plan how to get started with a new subject."],
        ["没有人规定学习步骤时，我常常不知道从哪里开始。", "Without a prescribed path, I often have no idea where to start learning."],
        ["我能较快筛选出有助于理解新知识的资料。", "I can quickly identify resources that help me learn a new topic."]
      ],
      evidence: [
        ["过去六个月，我曾自发学习一项工作或课程之外的新知识。", "In the past six months, I learned something beyond course or job requirements."],
        ["过去六个月，我曾把一个领域的方法用到另一个领域。", "In the past six months, I applied a method from one field to another."],
        ["过去六个月，我曾持续追踪一个问题，直到理解发生明显变化。", "In the past six months, I followed a question until my understanding changed."]
      ]
    },
    {
      id: "creation", zh: "创意构想", en: "Creative ideation",
      subtitle: "生成新视角与原创方案", subtitleEn: "Generate original perspectives",
      icon: "✦", color: "#a86b9e",
      action: "为一个日常痛点提出至少十种不同解决思路，挑选一种制作可展示的草案。",
      actionEn: "Generate ten solutions to an everyday problem and prototype one.",
      interest: [
        ["面对开放式问题，我喜欢尝试不止一种解决方式。", "I like exploring multiple answers to open-ended problems."],
        ["把原本无关的想法组合成新方案会让我感到满足。", "I enjoy combining unrelated ideas into something new."],
        ["相比套用熟悉模板，我更愿意尝试不同的表达或设计。", "I often prefer exploring new forms over relying on a familiar template."]
      ],
      ease: [
        ["没有现成答案时，我通常能提出一些可供尝试的方向。", "When there is no ready answer, I can propose several directions."],
        ["需要从零构想方案时，我经常完全想不出替代思路。", "Starting from scratch, I often cannot think of alternative approaches."],
        ["我能把模糊灵感转化为别人看得懂的初步方案。", "I can turn vague inspiration into a sketch others understand."]
      ],
      evidence: [
        ["过去六个月，我曾为同一个问题提出多种明显不同的方案。", "In the past six months, I proposed distinct alternatives for one problem."],
        ["过去六个月，我曾将新想法做成文字、设计或原型。", "In the past six months, I made an idea tangible in text, design, or a prototype."],
        ["过去六个月，我曾根据反馈迭代过自己的原创作品。", "In the past six months, I revised an original work after feedback."]
      ]
    },
    {
      id: "building", zh: "实践构建", en: "Hands-on building",
      subtitle: "动手试验，系统排障", subtitleEn: "Make, test, and troubleshoot",
      icon: "⌘", color: "#4b8b78",
      action: "做一个可实际使用的小工具或实物，记录三次测试结果和下一轮改进。",
      actionEn: "Build something usable and log three tests and one iteration.",
      interest: [
        ["相比只讨论方案，我喜欢亲手把它做出来。", "I prefer building an idea rather than only discussing it."],
        ["看到设备、软件或流程出现问题时，我会想试着修复。", "When a tool, system, or process breaks, I want to fix it."],
        ["通过实际试验观察结果，比只读说明更吸引我。", "Experimenting hands-on appeals to me more than only reading instructions."]
      ],
      ease: [
        ["我通常能把一个想法拆成可动手执行的步骤。", "I can usually break an idea into practical implementation steps."],
        ["遇到工具故障或操作难题时，我很难开展独立排查。", "When tools fail, I have trouble beginning troubleshooting on my own."],
        ["我能通过小规模测试逐步缩小故障范围。", "Small tests help me narrow down what is going wrong."]
      ],
      evidence: [
        ["过去六个月，我曾独立完成一件可使用的作品或工具。", "In the past six months, I finished a usable artifact or tool."],
        ["过去六个月，我曾找出并修复过一个具体故障的原因。", "In the past six months, I identified and repaired the cause of a failure."],
        ["过去六个月，我曾依据实测结果改进一个方案。", "In the past six months, I improved a solution based on test results."]
      ]
    },
    {
      id: "empathy", zh: "共情协作", en: "Empathy & collaboration",
      subtitle: "理解他人，建立信任", subtitleEn: "Understand and support others",
      icon: "♡", color: "#ce846b",
      action: "与一位合作者进行开放式访谈，复述对方的真实需求并一起拟定下一步。",
      actionEn: "Interview a collaborator, reflect their needs, and plan one shared next step.",
      interest: [
        ["我愿意花时间理解他人与自己不同的考虑。", "I want to understand perspectives different from my own."],
        ["帮助团队成员找到更好的合作方式会让我有成就感。", "Helping teammates collaborate better feels rewarding."],
        ["朋友或同事遇到困难时，我愿意认真倾听。", "I am willing to listen carefully when someone faces difficulties."]
      ],
      ease: [
        ["在讨论中，我通常能察觉有人尚未说出口的顾虑。", "I often notice concerns that have not yet been voiced."],
        ["发生分歧时，我经常无法理解对方为何持有不同立场。", "In disagreements, I often cannot see why others hold their positions."],
        ["我能调整自己的沟通方式，让不同性格的人参与讨论。", "I can adapt how I communicate to involve different personalities."]
      ],
      evidence: [
        ["过去六个月，我曾帮助两位意见不同的人理解彼此。", "In the past six months, I helped people with differing views understand each other."],
        ["过去六个月，我曾根据他人的需要改变支持方式。", "In the past six months, I changed how I helped someone based on their needs."],
        ["过去六个月，有人因我的倾听或协作获得实质帮助。", "In the past six months, my listening or collaboration tangibly helped someone."]
      ]
    },
    {
      id: "expression", zh: "表达沟通", en: "Communication & expression",
      subtitle: "清晰传达，组织故事", subtitleEn: "Explain clearly and tell stories",
      icon: "❝", color: "#9179c7",
      action: "把你熟悉的复杂概念分别讲给新人和熟手，比较两版表达并征求反馈。",
      actionEn: "Explain one complex idea to a novice and an expert, then compare the two versions.",
      interest: [
        ["我喜欢思考怎样把复杂内容讲得更清楚。", "I enjoy finding clearer ways to explain complicated ideas."],
        ["写作、演讲或叙事表达会让我愿意反复打磨。", "I am drawn to revising writing, presentations, or stories."],
        ["我喜欢尝试让不同听众理解同一个观点。", "I enjoy making one idea accessible to different audiences."]
      ],
      ease: [
        ["需要介绍复杂概念时，我通常能迅速组织表达结构。", "I can usually structure an explanation of a complex topic quickly."],
        ["即使自己理解了内容，我也经常难以清楚讲给别人。", "Even when I understand something, I often struggle to explain it clearly."],
        ["我能根据听众反馈及时调整表达细节。", "I can adapt explanations in response to audience feedback."]
      ],
      evidence: [
        ["过去六个月，我曾写出或讲出一份让别人受益的说明。", "In the past six months, I made an explanation others found useful."],
        ["过去六个月，我曾根据具体听众修改过展示或文稿。", "In the past six months, I revised a presentation or document for its audience."],
        ["过去六个月，我曾向别人讲解一个原本难理解的问题。", "In the past six months, I explained something initially difficult to others."]
      ]
    },
    {
      id: "initiative", zh: "领导推动", en: "Initiative & influence",
      subtitle: "主动承担，凝聚行动", subtitleEn: "Mobilize and take initiative",
      icon: "↗", color: "#b57e49",
      action: "为一件你在意的小事召集两三个人，明确目标、分工和复盘方式。",
      actionEn: "Bring two or three people together around a small goal; set roles and review outcomes.",
      interest: [
        ["在方向不明确时，我愿意主动促成下一步行动。", "I like initiating action when the direction is unclear."],
        ["协调不同人的目标并达成一致，会让我投入。", "Aligning different goals is engaging to me."],
        ["当一个好想法缺少推动者时，我愿意尝试牵头。", "I am interested in leading a promising idea that lacks an owner."]
      ],
      ease: [
        ["需要团队决策时，我通常能提出可执行的优先顺序。", "I can usually propose workable priorities for team decisions."],
        ["即使需要有人负责，我也常常无法主动承担协调工作。", "Even when coordination is needed, I often cannot step forward to own it."],
        ["我能在不同意见之间找到共同目标并推动前进。", "I can find a shared objective across differing views."]
      ],
      evidence: [
        ["过去六个月，我曾主动发起一件需要他人参与的事。", "In the past six months, I initiated something that involved others."],
        ["过去六个月，我曾推动一个停滞事项重新开始。", "In the past six months, I helped restart something that had stalled."],
        ["过去六个月，我曾组织协作并根据结果调整过安排。", "In the past six months, I coordinated an effort and revised the plan."]
      ]
    },
    {
      id: "execution", zh: "规划执行", en: "Planning & execution",
      subtitle: "建立秩序，持续交付", subtitleEn: "Organize and follow through",
      icon: "▦", color: "#568a87",
      action: "把一个两周目标拆为里程碑，设置检查点并记录遇到干扰时的调整。",
      actionEn: "Break a two-week goal into milestones and record adjustments when plans change.",
      interest: [
        ["我喜欢把模糊目标转化为清晰的计划与里程碑。", "I enjoy turning vague goals into plans and milestones."],
        ["设计更省力、更可靠的工作流程会让我有满足感。", "Improving a workflow's efficiency and reliability appeals to me."],
        ["面对多项任务时，我喜欢找出合理的优先级。", "I enjoy deciding priorities across competing tasks."]
      ],
      ease: [
        ["多件事情并行时，我通常能保持进度清晰。", "I can usually keep track of several tasks at once."],
        ["即使制定了计划，我也经常无法持续追踪执行情况。", "Even with a plan, I often fail to track follow-through."],
        ["突发变化后，我能较快重新安排任务顺序。", "I can reprioritize quickly after unexpected changes."]
      ],
      evidence: [
        ["过去六个月，我曾按自己设计的计划完成一个阶段性目标。", "In the past six months, I completed a milestone using my own plan."],
        ["过去六个月，我曾把重复性工作整理成可复用流程。", "In the past six months, I turned repeated work into a reusable process."],
        ["过去六个月，原计划受干扰时，我曾通过调整仍完成关键任务。", "In the past six months, I adapted a disrupted plan and delivered what mattered."]
      ]
    }
  ];

  const facets = {
    interest: { zh: "兴趣驱动", en: "Motivation", note: "我是否愿意做", noteEn: "What I want to do" },
    ease: { zh: "自然上手", en: "Perceived ease", note: "我是否感觉容易", noteEn: "What feels easier" },
    evidence: { zh: "近期实践", en: "Recent practice", note: "过去半年是否做过", noteEn: "What I have practiced recently" }
  };

  root.TALENT_ATLAS_DATA = Object.freeze({
    version: "1.0.0",
    dimensions,
    facets,
    modes: { quick: 2, full: 3 },
    weights: { interest: 0.4, ease: 0.3, evidence: 0.3 }
  });
})(window);
