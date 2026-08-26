---
permalink: /now/
title: "Now"
excerpt: "A brief note on current work and open questions."
author_profile: false
wide: true
page_class: "now-page"
---

<header class="subpage-hero subpage-hero--now">
  <div>
    <p class="subpage-hero__eyebrow">Updated 26 August 2026</p>
    <h1>What I am working on</h1>
    <p class="subpage-hero__lead">
      A brief note on the projects and questions taking most of my attention. I update this page when the focus changes.
    </p>
  </div>
  <aside class="now-signal" aria-label="Current focus">
    <span><i aria-hidden="true"></i> Current focus</span>
    <strong>Efficient multimodal intelligence</strong>
    <p>Speed, memory, and long-context behavior that remain meaningful outside an isolated benchmark.</p>
  </aside>
</header>

<section class="now-grid" aria-label="Current activities">
  <article class="now-card">
    <span class="now-card__icon" aria-hidden="true">↗</span>
    <p class="now-card__label">Building</p>
    <h2>Memory-aware systems for Audio LLMs</h2>
    <p>Exploring how semantic and acoustic evidence can guide KV-cache retention instead of relying on uniform compression.</p>
    <div class="now-card__tags"><span>AudioKV</span><span>KV Cache</span><span>Efficient AI</span></div>
  </article>

  <article class="now-card">
    <span class="now-card__icon" aria-hidden="true">∿</span>
    <p class="now-card__label">Thinking</p>
    <h2>When diffusion parallelism becomes real speed</h2>
    <p>Looking beyond theoretical parallel decoding toward strategies whose gains survive scheduling, verification, and wall-clock measurement.</p>
    <div class="now-card__tags"><span>Diffusion LLM</span><span>Inference</span><span>Systems</span></div>
  </article>

  <article class="now-card">
    <span class="now-card__icon" aria-hidden="true">✦</span>
    <p class="now-card__label">Writing</p>
    <h2>A quieter record beside the research page</h2>
    <p>Using the Journal for travel, photographs, reading, and thoughts that do not need to become a polished research claim.</p>
    <div class="now-card__tags"><span>Journal</span><span>Notes</span><span>Life</span></div>
  </article>
</section>

<section class="open-questions" aria-labelledby="open-questions-title">
  <div class="open-questions__heading">
    <p>Open questions</p>
    <h2 id="open-questions-title">Questions I am keeping in view</h2>
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
  <a href="{{ '/research/' | relative_url }}"><span>Research</span><strong>See how these themes connect to papers and artifacts.</strong></a>
  <a href="{{ '/journal/' | relative_url }}"><span>Journal</span><strong>Read the less formal side of the website.</strong></a>
  <a href="https://github.com/yxwang1215"><span>GitHub</span><strong>Browse public code and repositories.</strong></a>
</section>
