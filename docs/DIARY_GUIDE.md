# 日记专栏使用说明

这个专栏使用 Jekyll 自定义集合 `_diary`。每一篇日记都是一个 Markdown 文件，提交到仓库后，`/diary/` 页面会自动按日期倒序展示。

## 1. 新建一篇日记

在 `_diary/` 目录中新建文件，例如：

```text
_diary/a-day-in-beijing.md
```

推荐从下面的模板开始：

```markdown
---
title: "日记标题"
date: 2026-08-25 20:00:00 +0800
subtitle: "可选的一句话副标题"
excerpt: "显示在日记列表中的简短摘要。"
cover: /images/diary/2026-08-25/cover.jpg
cover_alt: "准确描述封面内容，便于无障碍阅读"
cover_caption: "可选的封面说明"
location: "可选地点"
tags:
  - 日常
  - 随笔
---

这里开始写正文。

## 一个小标题

正文支持普通 Markdown，包括 **粗体**、*斜体*、链接、引用和代码块。

> 也可以写一段引用。
```

文件名会成为文章网址的一部分。例如 `_diary/a-day-in-beijing.md` 对应：

```text
https://yxwang1215.github.io/diary/a-day-in-beijing/
```

## 2. 添加图片

建议为每篇日记单独建一个图片目录：

```text
images/diary/2026-08-25/
├── cover.jpg
├── photo-01.jpg
└── photo-02.jpg
```

正文中插入单张图片：

```markdown
![图片说明](/images/diary/2026-08-25/photo-01.jpg)
```

需要说明文字时：

```html
<figure>
  <img src="/images/diary/2026-08-25/photo-01.jpg" alt="图片说明">
  <figcaption>这张照片的说明。</figcaption>
</figure>
```

并排展示多张图片：

```html
<div class="diary-gallery">
  <a href="/images/diary/2026-08-25/photo-01.jpg">
    <img src="/images/diary/2026-08-25/photo-01.jpg" alt="第一张图片说明">
  </a>
  <a href="/images/diary/2026-08-25/photo-02.jpg">
    <img src="/images/diary/2026-08-25/photo-02.jpg" alt="第二张图片说明">
  </a>
</div>
```

## 3. 控制排序与发布

- `date` 决定列表中的排序，时间越新越靠前。
- `excerpt` 是列表摘要，建议控制在一两句话。
- `cover` 不填时会显示默认占位图案。
- 暂时不想发布时，在 front matter 中加入 `published: false`。
- 删除文章时，删除对应的 `_diary/*.md` 文件即可；图片可以一并清理。

## 4. 图片建议

- 封面建议使用横图，比例接近 `16:9`。
- 上传前把长边压缩到约 `1600–2400 px`，优先使用 JPEG 或 WebP。
- 尽量把单张图片控制在 `1 MB` 以内，以提升手机端加载速度。
- 发布私人照片前，建议清除 EXIF 定位信息，并检查画面中是否出现证件、地址、二维码或其他敏感信息。

## 5. 本地预览

仓库已使用 Jekyll。安装依赖后运行：

```bash
bundle install
bundle exec jekyll serve
```

浏览器打开：

```text
http://127.0.0.1:4000/diary/
```

推送到 `main` 后，GitHub Pages 会按照仓库现有部署方式更新网站。
