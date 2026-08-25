---
permalink: /diary/
title: "Diary"
excerpt: "生活、照片与不成体系的想法。"
author_profile: false
redirect_from:
  - /dairy/
  - /daiy/
---

{% assign diary_entries = site.diary | sort: "date" | reverse %}

<section class="diary-feed-hero" aria-labelledby="diary-title">
  <div class="diary-feed-hero__copy">
    <p class="diary-feed-hero__eyebrow">YUXUAN'S DIARY</p>
    <h1 id="diary-title">日常、旅途，和没有结论的片刻。</h1>
    <p class="diary-feed-hero__intro">把照片与文字放在一起，记录研究之外偶尔值得停下来的时刻。</p>
  </div>
  <div class="diary-feed-hero__count" aria-label="公开日记数量">
    <strong>{{ diary_entries | size }}</strong>
    <span>篇记录</span>
  </div>
</section>

<div class="diary-feed-toolbar">
  <div class="diary-feed-toolbar__title">
    <span class="diary-feed-toolbar__dot" aria-hidden="true"></span>
    <strong>最新记录</strong>
  </div>
  <span class="diary-feed-toolbar__hint">图文随记 · 按时间倒序</span>
</div>

{% if diary_entries.size > 0 %}
<section class="diary-list" aria-label="日记列表">
  {% for entry in diary_entries %}
  <article class="diary-card">
    <a class="diary-card__cover" href="{{ entry.url | relative_url }}" aria-label="阅读：{{ entry.title | escape }}">
      {% if entry.cover %}
        {% if entry.cover contains '://' %}
          {% assign diary_card_cover_url = entry.cover %}
        {% else %}
          {% assign diary_card_cover_url = entry.cover | relative_url %}
        {% endif %}
      <img src="{{ diary_card_cover_url }}" alt="{{ entry.cover_alt | default: entry.title | escape }}" loading="lazy" decoding="async">
      {% else %}
      <span class="diary-card__placeholder" aria-hidden="true">日</span>
      {% endif %}
      <span class="diary-card__image-shade" aria-hidden="true"></span>
      <time class="diary-card__date-badge" datetime="{{ entry.date | date_to_xmlschema }}">{{ entry.date | date: "%m月%d日" }}</time>
    </a>

    <div class="diary-card__body">
      <h2 class="diary-card__title">
        <a href="{{ entry.url | relative_url }}">{{ entry.title }}</a>
      </h2>

      {% assign diary_excerpt = entry.excerpt | default: entry.content %}
      <p class="diary-card__excerpt">{{ diary_excerpt | markdownify | strip_html | strip_newlines | truncate: 118 }}</p>

      <div class="diary-card__footer">
        <span class="diary-card__place">
          {% if entry.location %}⌖ {{ entry.location }}{% else %}随笔{% endif %}
        </span>
        {% if entry.tags %}
        <div class="diary-tags" aria-label="标签">
          {% for tag in entry.tags limit:2 %}
          <span>#{{ tag }}</span>
          {% endfor %}
        </div>
        {% endif %}
      </div>
    </div>
  </article>
  {% endfor %}
</section>
{% else %}
<div class="diary-empty">
  <span aria-hidden="true">☁</span>
  <h2>第一篇日记正在路上</h2>
  <p>在 <code>_diary</code> 目录中添加 Markdown 文件后，它会自动出现在这里。</p>
</div>
{% endif %}
