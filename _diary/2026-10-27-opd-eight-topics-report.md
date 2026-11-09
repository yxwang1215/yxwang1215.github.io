---
title: "OPD: Eight Topics and Internal Experiments"
date: 2026-10-27 10:00:00 +0800
subtitle: "Recent Advances and Emerging Research Directions"
excerpt: "This report examines the design and efficiency trade-offs of on-policy distillation, drawing on recent research and internal experiments."
cover: /images/works/opd-eight-topics-report-cover.png
cover_alt: "Cover slide of OPD: Eight Topics and Internal Experiments"
cover_caption: "OPD: Eight Topics and Internal Experiments · Peking University–360 Joint Laboratory paper reading, 27 October 2026."
redirect_from:
  - /journal/2026-11-09-opd-eight-topics-report/
tags:
  - 科研随想
  - 知识蒸馏
  - 研究报告
  - OPD
related_resources:
  - title: "OPD: Eight Topics and Internal Experiments"
    url: /assets/downloads/opd-eight-topics-report.pdf
    format: PDF
    description: "Read the full report."
    action: "View PDF"
  - title: "OPD: Eight Topics and Internal Experiments"
    url: /assets/downloads/opd-eight-topics-report.pptx
    format: PPTX
    description: "Download the original presentation slides."
    action: "Download PPTX"
---

**Recent Advances and Emerging Research Directions**

This report examines the design and efficiency trade-offs of on-policy distillation, drawing on recent research and internal experiments.

[**[PDF]**](/assets/downloads/opd-eight-topics-report.pdf) · [**[PPTX]**](/assets/downloads/opd-eight-topics-report.pptx)

## 关于这份报告

On-Policy Distillation（OPD）让 Student 在自己的生成分布上接受 Teacher 监督，但实际效果不仅取决于优化目标，还受到 rollout、Teacher 访问方式、数据选择和计算预算等因素影响。

这份报告围绕八个主题整理相关研究与内部实验：

1. **Optimization Objectives**：蒸馏目标函数与优化行为。
2. **Rollout Strategies**：采样策略及其训练成本。
3. **Teacher Access**：何时、如何获取 Teacher 监督。
4. **Multi-Teacher Distillation**：多教师监督的设计与代价。
5. **Data-Centric Methods**：训练数据的构造与选择。
6. **Verifiable Rewards**：可验证奖励与蒸馏信号的关系。
7. **Exploration**：探索与样本效率之间的权衡。
8. **Internal Experiments**：内部实验观察与尚待解决的问题。

比起罗列方法，报告更关注一个实际问题：**在训练质量相近时，哪些设计决定了 OPD 的总成本；在预算固定时，哪些取舍值得优先考虑？**

本报告曾用于 **2026 年 10 月 27 日北京大学–360 联合实验室的 paper reading**。PDF 适合直接阅读，PPTX 可用于查看原始幻灯片。
