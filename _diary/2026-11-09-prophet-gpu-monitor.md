---
title: "谁占着这批显卡：我写的 Prophet 监控"
date: 2026-11-09 15:10:00 +0800
subtitle: "点开一个分区，就能看到每个用户占了多少卡。"
excerpt: "按项目和型号看占卡。这篇里直接放了可交互的监控界面。"
page_class: journal-monitor
tags:
  - 工具
  - GPU
  - Prophet
---

<div class="monitor-stage">
  <iframe src="{{ '/monitor/' | relative_url }}" title="Prophet 显卡占用监控" loading="lazy"></iframe>
</div>

<p class="monitor-note">界面里是同一套页面配上的模拟任务，筛选、展开分区、看任务明细都可以直接试。<a href="{{ '/monitor/' | relative_url }}">全屏打开</a> · 源码在 <a href="https://github.com/yxwang1215/yxwang1215.github.io/tree/main/code/prophet-dashboard">code/prophet-dashboard</a>。</p>
