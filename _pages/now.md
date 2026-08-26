---
permalink: /now/
title: "Now"
excerpt: "A living page for current research themes and open questions."
author_profile: false
wide: true
page_class: "now-page"
---

<header class="subpage-hero subpage-hero--now">
  <div>
    <p class="subpage-hero__eyebrow">NOW · UPDATED AUGUST 26, 2026</p>
    <h1>What I am paying attention to now.</h1>
    <p class="subpage-hero__lead">
      This is a living page: less formal than a CV, more current than a biography, and intentionally focused on questions rather than announcements.
    </p>
  </div>
  <aside class="now-signal" aria-label="Current signal">
    <span><i aria-hidden="true"></i> CURRENT SIGNAL</span>
    <strong>Efficient multimodal intelligence</strong>
    <p>Speed, memory, and long-context behavior that remain meaningful outside an isolated benchmark.</p>
  </aside>
</header>

<section class="now-grid" aria-label="Current activities">
  <article class="now-card">
    <span class="now-card__icon" aria-hidden="true">↗</span>
    <p class="now-card__label">BUILDING</p>
    <h2>Memory-aware systems for Audio LLMs</h2>
    <p>Exploring how semantic and acoustic evidence can guide KV-cache retention instead of relying on uniform compression.</p>
    <div class="now-card__tags"><span>AudioKV</span><span>KV Cache</span><span>Efficient AI</span></div>
  </article>

  <article class="now-card">
    <span class="now-card__icon" aria-hidden="true">∿</span>
    <p class="now-card__label">THINKING</p>
    <h2>When diffusion parallelism becomes real speed</h2>
    <p>Looking beyond theoretical parallel decoding toward strategies whose gains survive scheduling, verification, and wall-clock measurement.</p>
    <div class="now-card__tags"><span>Diffusion LLM</span><span>Inference</span><span>Systems</span></div>
  </article>

  <article class="now-card">
    <span class="now-card__icon" aria-hidden="true">✦</span>
    <p class="now-card__label">WRITING</p>
    <h2>A quieter record beside the research page</h2>
    <p>Using the Journal for travel, photographs, reading, and thoughts that do not need to become a polished research claim.</p>
    <div class="now-card__tags"><span>Journal</span><span>Notes</span><span>Life</span></div>
  </article>
</section>

<section class="open-questions" aria-labelledby="open-questions-title">
  <div class="open-questions__heading">
    <p>OPEN QUESTIONS</p>
    <h2 id="open-questions-title">Questions worth keeping visible</h2>
  </div>
  <ol>
    <li>
      <span>01</span>
      <p>Can cache compression become semantic-aware without introducing a second expensive model?</p>
    </li>
    <li>
      <span>02</span>
      <p>Which diffusion-LLM acceleration gains remain after end-to-end latency and hardware utilization are counted?</p>
    </li>
    <li>
      <span>03</span>
      <p>How should long-context audio benchmarks balance understanding quality, memory footprint, and response latency?</p>
    </li>
  </ol>
</section>

<section class="now-links" aria-label="Continue exploring">
  <a href="{{ '/research/' | relative_url }}"><span>Research Map</span><strong>See how these themes connect to papers and artifacts.</strong></a>
  <a href="{{ '/journal/' | relative_url }}"><span>Journal</span><strong>Read the less formal side of the website.</strong></a>
  <a href="https://github.com/yxwang1215"><span>GitHub</span><strong>Browse public code and repositories.</strong></a>
</section>

<p class="now-maintenance">Maintenance note: update this page directly in <code>_pages/now.md</code> whenever the center of gravity changes.</p>
