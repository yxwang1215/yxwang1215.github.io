---
permalink: /diary/
title: "Diary"
excerpt: "生活、照片与不成体系的想法。"
author_profile: true
---

<section class="diary-hero" aria-labelledby="diary-title">
  <div class="diary-hero__content">
    <p class="diary-hero__eyebrow">DIARY · 随笔</p>
    <h1 id="diary-title">把生活里值得记住的片段，慢慢留在这里。</h1>
    <p class="diary-hero__intro">照片、旅途、读书、研究之外的想法，以及偶尔不需要结论的文字。</p>
  </div>
  <div class="diary-hero__mark" aria-hidden="true">日</div>
</section>

{% assign diary_entries = site.diary | sort: "date" | reverse %}

<div class="diary-section-heading">
  <div>
    <p class="diary-section-heading__eyebrow">LATEST NOTES</p>
    <h2>最近记录</h2>
  </div>
  <span class="diary-section-heading__count">{{ diary_entries | size }} 篇</span>
</div>

{% if diary_entries.size > 0 %}
<div class="diary-list">
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
      <span class="diary-card__placeholder" aria-hidden="true">✦</span>
      {% endif %}
    </a>

    <div class="diary-card__body">
      <div class="diary-card__meta">
        <time datetime="{{ entry.date | date_to_xmlschema }}">{{ entry.date | date: "%Y.%m.%d" }}</time>
        {% if entry.location %}
        <span aria-hidden="true">·</span>
        <span>{{ entry.location }}</span>
        {% endif %}
      </div>

      <h2 class="diary-card__title">
        <a href="{{ entry.url | relative_url }}">{{ entry.title }}</a>
      </h2>

      {% assign diary_excerpt = entry.excerpt | default: entry.content %}
      <p class="diary-card__excerpt">{{ diary_excerpt | markdownify | strip_html | strip_newlines | truncate: 170 }}</p>

      <div class="diary-card__footer">
        {% if entry.tags %}
        <div class="diary-tags" aria-label="标签">
          {% for tag in entry.tags %}
          <span># {{ tag }}</span>
          {% endfor %}
        </div>
        {% endif %}
        <a class="diary-card__read" href="{{ entry.url | relative_url }}">继续阅读 <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </article>
  {% endfor %}
</div>
{% else %}
<div class="diary-empty">
  <span aria-hidden="true">☁</span>
  <h2>第一篇日记正在路上</h2>
  <p>在 <code>_diary</code> 目录中添加 Markdown 文件后，它会自动出现在这里。</p>
</div>
{% endif %}
