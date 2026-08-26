---
permalink: /now/
title: "Now"
excerpt: "Current work and research questions."
author_profile: false
wide: true
page_class: "now-page"
---

<header class="subpage-hero subpage-hero--now">
  <div>
    <p class="subpage-hero__eyebrow">Updated 26 August 2026</p>
    <h1>Now</h1>
    <p class="subpage-hero__lead">
      A short update on the projects and questions I am currently working on.
    </p>
  </div>
  <aside class="now-signal" aria-label="Current focus">
    <span><i aria-hidden="true"></i> Current focus</span>
    <strong>Efficient inference for multimodal models</strong>
    <p>Reducing latency and memory use while preserving model quality.</p>
  </aside>
</header>

<section class="now-grid" aria-label="Current activities">
  <article class="now-card">
    <p class="now-card__label">Project</p>
    <h2>Audio LLM memory efficiency</h2>
    <p>Developing cache-retention methods that use semantic and acoustic signals to preserve important context.</p>
    <div class="now-card__tags"><span>AudioKV</span><span>KV Cache</span><span>Audio LLMs</span></div>
  </article>

  <article class="now-card">
    <p class="now-card__label">Research</p>
    <h2>Diffusion LLM inference</h2>
    <p>Evaluating sampling and verification methods with end-to-end latency and hardware utilization.</p>
    <div class="now-card__tags"><span>Diffusion LLMs</span><span>Inference</span><span>Systems</span></div>
  </article>

  <article class="now-card">
    <p class="now-card__label">Personal</p>
    <h2>Journal</h2>
    <p>Keeping notes on travel, reading, photographs, and daily life outside research.</p>
    <div class="now-card__tags"><span>Travel</span><span>Reading</span><span>Notes</span></div>
  </article>
</section>

<section class="open-questions" aria-labelledby="open-questions-title">
  <div class="open-questions__heading">
    <p>Questions</p>
    <h2 id="open-questions-title">Current research questions</h2>
  </div>
  <ol>
    <li>
      <span>01</span>
      <p>Can an Audio LLM retain the most useful cache entries without using an additional large model?</p>
    </li>
    <li>
      <span>02</span>
      <p>Which diffusion-LLM acceleration methods still improve end-to-end latency after verification and scheduling costs?</p>
    </li>
    <li>
      <span>03</span>
      <p>How should long-context audio benchmarks report quality, memory use, and latency together?</p>
    </li>
  </ol>
</section>

<section class="now-links" aria-label="Related pages">
  <a href="{{ '/research/' | relative_url }}"><span>Research</span><strong>Selected papers and projects.</strong></a>
  <a href="{{ '/journal/' | relative_url }}"><span>Journal</span><strong>Travel, reading, photographs, and notes.</strong></a>
  <a href="https://github.com/yxwang1215"><span>GitHub</span><strong>Public code and repositories.</strong></a>
</section>
