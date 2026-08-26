---
permalink: /journal/
title: "Journal"
excerpt: "生活、照片与不成体系的想法。"
author_profile: false
redirect_from:
  - /diary/
  - /dairy/
  - /daiy/
---

{% assign diary_entries = site.diary | sort: "date" | reverse %}
{% assign featured_entry = diary_entries | first %}
{%- capture journal_tag_string -%}
  {%- for entry in diary_entries -%}
    {%- for tag in entry.tags -%}{{ tag }}|||{%- endfor -%}
  {%- endfor -%}
{%- endcapture -%}
{% assign journal_tags = journal_tag_string | split: "|||" | uniq | sort %}

<section class="journal-feed-hero journal-feed-hero--v2" aria-labelledby="journal-title">
  <div class="journal-feed-hero__copy">
    <p class="journal-feed-hero__eyebrow">YUXUAN'S JOURNAL</p>
    <h1 id="journal-title">日常、旅途，和没有结论的片刻。</h1>
    <p class="journal-feed-hero__intro">把照片与文字放在一起，记录研究之外偶尔值得停下来的时刻。</p>
    <div class="journal-feed-hero__links">
      <a href="#latest">开始阅读</a>
      <a href="#archive">按年份浏览</a>
    </div>
  </div>
  <div class="journal-feed-hero__stats" aria-label="Journal statistics">
    <div><strong>{{ diary_entries | size }}</strong><span>篇记录</span></div>
    <div><strong>{{ journal_tags | size }}</strong><span>个标签</span></div>
    {% if featured_entry %}
    <div><strong>{{ featured_entry.date | date: "%Y.%m" }}</strong><span>最近更新</span></div>
    {% endif %}
  </div>
</section>

{% if featured_entry %}
{% capture featured_search_text %}{{ featured_entry.title }} {{ featured_entry.excerpt }} {{ featured_entry.location }} {{ featured_entry.tags | join: " " }}{% endcapture %}
<section id="latest" class="journal-feature-section" aria-labelledby="journal-feature-title">
  <div class="journal-section-heading">
    <div>
      <p>LATEST NOTE</p>
      <h2 id="journal-feature-title">最近一篇</h2>
    </div>
    <span>{{ featured_entry.date | date: "%Y年%m月%d日" }}</span>
  </div>

  <article class="journal-featured"
    data-journal-item
    data-tags="{{ featured_entry.tags | join: '|' | downcase | escape }}"
    data-search="{{ featured_search_text | strip_html | strip_newlines | downcase | escape }}">
    <a class="journal-featured__cover" href="{{ featured_entry.url | relative_url }}" aria-label="阅读：{{ featured_entry.title | escape }}">
      {% if featured_entry.cover %}
        {% if featured_entry.cover contains '://' %}
          {% assign featured_cover_url = featured_entry.cover %}
        {% else %}
          {% assign featured_cover_url = featured_entry.cover | relative_url %}
        {% endif %}
        <img src="{{ featured_cover_url }}" alt="{{ featured_entry.cover_alt | default: featured_entry.title | escape }}" decoding="async">
      {% else %}
        <span class="journal-featured__placeholder" aria-hidden="true">记</span>
      {% endif %}
      <span class="journal-featured__date">{{ featured_entry.date | date: "%m.%d" }}</span>
    </a>
    <div class="journal-featured__body">
      <span class="journal-featured__label">FEATURED · 最新记录</span>
      <h2><a href="{{ featured_entry.url | relative_url }}">{{ featured_entry.title }}</a></h2>
      {% if featured_entry.subtitle %}<p class="journal-featured__subtitle">{{ featured_entry.subtitle }}</p>{% endif %}
      {% assign featured_excerpt = featured_entry.excerpt | default: featured_entry.content %}
      <p class="journal-featured__excerpt">{{ featured_excerpt | markdownify | strip_html | strip_newlines | truncate: 180 }}</p>
      <div class="journal-featured__meta">
        <span>{% if featured_entry.location %}⌖ {{ featured_entry.location }}{% else %}随笔{% endif %}</span>
        {% if featured_entry.tags %}
        <div class="journal-tags" aria-label="标签">
          {% for tag in featured_entry.tags limit:3 %}<span>#{{ tag }}</span>{% endfor %}
        </div>
        {% endif %}
      </div>
      <a class="journal-featured__read" href="{{ featured_entry.url | relative_url }}">阅读全文 <span aria-hidden="true">→</span></a>
    </div>
  </article>
</section>
{% endif %}

{% if diary_entries.size > 0 %}
<section class="journal-discovery" data-journal-toolbar aria-labelledby="journal-all-title">
  <div class="journal-discovery__heading">
    <div>
      <p>DISCOVER</p>
      <h2 id="journal-all-title">浏览全部记录</h2>
    </div>
    <span data-journal-visible-count>{{ diary_entries | size }} 篇可见</span>
  </div>

  <div class="journal-discovery__controls">
    <label class="journal-search">
      <span class="sr-only">搜索 Journal</span>
      <span aria-hidden="true">⌕</span>
      <input type="search" placeholder="搜索标题、地点或关键词" autocomplete="off" data-journal-search>
      <kbd>Esc</kbd>
    </label>

    <div class="journal-filter-list" role="group" aria-label="按标签筛选">
      <button type="button" class="is-active" data-journal-filter="all" aria-pressed="true">全部</button>
      {% for tag in journal_tags %}
      <button type="button" data-journal-filter="{{ tag | downcase | escape }}" aria-pressed="false">#{{ tag }}</button>
      {% endfor %}
    </div>
  </div>
</section>

{% if diary_entries.size > 1 %}
<section class="journal-list journal-list--v2" aria-label="Journal 列表">
  {% for entry in diary_entries offset:1 %}
  {% capture entry_search_text %}{{ entry.title }} {{ entry.excerpt }} {{ entry.location }} {{ entry.tags | join: " " }}{% endcapture %}
  <article class="journal-card"
    data-journal-item
    data-tags="{{ entry.tags | join: '|' | downcase | escape }}"
    data-search="{{ entry_search_text | strip_html | strip_newlines | downcase | escape }}">
    <a class="journal-card__cover" href="{{ entry.url | relative_url }}" aria-label="阅读：{{ entry.title | escape }}">
      {% if entry.cover %}
        {% if entry.cover contains '://' %}
          {% assign journal_card_cover_url = entry.cover %}
        {% else %}
          {% assign journal_card_cover_url = entry.cover | relative_url %}
        {% endif %}
      <img src="{{ journal_card_cover_url }}" alt="{{ entry.cover_alt | default: entry.title | escape }}" loading="lazy" decoding="async">
      {% else %}
      <span class="journal-card__placeholder" aria-hidden="true">记</span>
      {% endif %}
      <span class="journal-card__image-shade" aria-hidden="true"></span>
      <time class="journal-card__date-badge" datetime="{{ entry.date | date_to_xmlschema }}">{{ entry.date | date: "%m月%d日" }}</time>
    </a>

    <div class="journal-card__body">
      <h2 class="journal-card__title"><a href="{{ entry.url | relative_url }}">{{ entry.title }}</a></h2>
      {% assign journal_excerpt = entry.excerpt | default: entry.content %}
      <p class="journal-card__excerpt">{{ journal_excerpt | markdownify | strip_html | strip_newlines | truncate: 118 }}</p>
      <div class="journal-card__footer">
        <span class="journal-card__place">{% if entry.location %}⌖ {{ entry.location }}{% else %}随笔{% endif %}</span>
        {% if entry.tags %}
        <div class="journal-tags" aria-label="标签">
          {% for tag in entry.tags limit:2 %}<span>#{{ tag }}</span>{% endfor %}
        </div>
        {% endif %}
      </div>
    </div>
  </article>
  {% endfor %}
</section>
{% endif %}

<div class="journal-no-results" data-journal-no-results hidden>
  <span aria-hidden="true">⌕</span>
  <h2>没有找到对应记录</h2>
  <p>换一个关键词，或选择“全部”标签。</p>
</div>

{% assign diary_entries_by_year = diary_entries | group_by_exp: "entry", "entry.date | date: '%Y'" %}
<section id="archive" class="journal-archive" aria-labelledby="journal-archive-title">
  <div class="journal-section-heading">
    <div>
      <p>ARCHIVE</p>
      <h2 id="journal-archive-title">按年份归档</h2>
    </div>
    <span>从最近到更早</span>
  </div>

  <div class="journal-archive__years">
    {% for year in diary_entries_by_year %}
    <section class="journal-archive__year" aria-labelledby="journal-year-{{ year.name }}">
      <div class="journal-archive__year-label">
        <strong id="journal-year-{{ year.name }}">{{ year.name }}</strong>
        <span>{{ year.items | size }} notes</span>
      </div>
      <ol>
        {% for entry in year.items %}
        <li>
          <time datetime="{{ entry.date | date_to_xmlschema }}">{{ entry.date | date: "%m.%d" }}</time>
          <a href="{{ entry.url | relative_url }}">{{ entry.title }}</a>
          {% if entry.location %}<span>{{ entry.location }}</span>{% endif %}
        </li>
        {% endfor %}
      </ol>
    </section>
    {% endfor %}
  </div>
</section>

<section class="journal-crosslink">
  <div>
    <span>RESEARCH, BUT LESS FORMAL</span>
    <p>想看看此刻正在关注的问题，而不是只看已经完成的结果？</p>
  </div>
  <a href="{{ '/now/' | relative_url }}">打开 Now 页面 <span aria-hidden="true">→</span></a>
</section>
{% else %}
<div class="journal-empty">
  <span aria-hidden="true">☁</span>
  <h2>第一篇记录正在路上</h2>
  <p>在 <code>_diary</code> 目录中添加 Markdown 文件后，它会自动出现在这里。</p>
</div>
{% endif %}
