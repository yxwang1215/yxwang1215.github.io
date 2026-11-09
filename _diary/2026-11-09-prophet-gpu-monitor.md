---
title: "谁占着这批显卡：我写的 Prophet 监控"
date: 2026-11-09 15:10:00 +0800
subtitle: "点开一个分区，就能看到每个用户占了多少卡。"
excerpt: "按项目和型号看占卡。这篇里放了竖屏界面，也可以直接试交互。"
cover: /images/diary/2026-11-09-prophet-monitor/overview.png
cover_alt: "Prophet 显卡监控的竖屏界面，上面是占用概览和用户排行，下面是任务明细"
cover_caption: "整页界面。上面是分区占卡和用户排行，下面是任务明细。"
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
