---
permalink: /research/
title: "Research"
excerpt: "Research themes and selected work."
author_profile: false
wide: true
page_class: "research-map-page"
---

<header class="subpage-hero subpage-hero--research">
  <div>
    <p class="subpage-hero__eyebrow">Research</p>
    <h1>Research themes and selected work</h1>
    <p class="subpage-hero__lead">
      My recent work focuses on efficient inference, multimodal models, and embodied medical AI. The projects below are grouped by topic so that their connections are easier to see.
    </p>
  </div>
  <aside class="subpage-hero__aside">
    <span>Current themes</span>
    <strong>Efficient inference · Audio and multimodal LLMs · Robotic ultrasound</strong>
    <a href="{{ '/#publications' | relative_url }}">Publication list →</a>
  </aside>
</header>

<section class="research-principles" aria-label="Research approach">
  <div>
    <span>01</span>
    <strong>Find the real bottleneck</strong>
    <p>I start by measuring where latency, memory, or generalization is actually lost.</p>
  </div>
  <div>
    <span>02</span>
    <strong>Keep the system in view</strong>
    <p>A useful model-level idea should still matter in end-to-end behavior.</p>
  </div>
  <div>
    <span>03</span>
    <strong>Make the work reusable</strong>
    <p>Whenever possible, I release code, datasets, benchmarks, or project pages.</p>
  </div>
</section>

<section class="research-clusters" aria-label="Research themes">
  <article class="research-cluster">
    <header class="research-cluster__header">
      <span class="research-cluster__number">01</span>
      <div>
        <p>Diffusion language models</p>
        <h2>Efficient generation for diffusion language models</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      This line of work studies how confidence, denoising dynamics, verification, and scheduling affect real inference speed.
    </p>
    <div class="research-work-grid">
      <article class="research-work">
        <span class="research-work__status">ICLR 2026 · Accepted · CCF-A</span>
        <h3>SlowFast Sampling</h3>
        <p>Alternates exploratory and accelerated stages using certainty, convergence, and positional principles; the homepage reports a 15.63× speedup on LLaDA.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2506.10848">Paper</a>
          <a href="https://github.com/LiangrunFlora/Slow-Fast-Sampling">Code</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">ACL 2026 · Submitted</span>
        <h3>Thinking inside the Mask</h3>
        <p>Places reasoning directly into the mask-denoising process through in-place prompting.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2508.10736">Paper</a>
          <a href="https://github.com/Lueci4er/ICE">Code</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">ACL 2026 · Submitted</span>
        <h3>Self-Speculative Decoding</h3>
        <p>Uses internal self-drafting and parallel verification to accelerate diffusion language-model inference.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2510.04147">Paper</a>
        </div>
      </article>
    </div>
  </article>

  <article class="research-cluster">
    <header class="research-cluster__header">
      <span class="research-cluster__number">02</span>
      <div>
        <p>Audio and multimodal LLMs</p>
        <h2>Memory-efficient long-context audio models</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Long audio contexts make memory allocation a semantic decision. The goal is to preserve acoustically and linguistically important evidence without treating every token or attention head equally.
    </p>
    <div class="research-work-grid research-work-grid--two">
      <article class="research-work">
        <span class="research-work__status">ACM MM 2026 · Accepted · First author</span>
        <h3>AudioKV</h3>
        <p>Prioritizes audio-critical attention heads through semantic-acoustic alignment and Spectral Score Smoothing; the homepage reports 60% lower memory overhead.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2604.06694">Paper</a>
          <a href="https://github.com/yxwang1215/Audio_kvcache">Code</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">ACL 2026 · Submitted</span>
        <h3>AudioMarathon</h3>
        <p>A benchmark for evaluating long-context audio understanding together with efficiency.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2510.07293">Paper</a>
          <a href="https://github.com/DabDans/AudioMarathon">Code</a>
          <a href="https://huggingface.co/datasets/Hezep/AudioMarathon">Dataset</a>
        </div>
      </article>
    </div>
  </article>

  <article class="research-cluster">
    <header class="research-cluster__header">
      <span class="research-cluster__number">03</span>
      <div>
        <p>Embodied medical intelligence</p>
        <h2>Generalizable robotic ultrasound guidance</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Robotic ultrasonography brings together visual representation, anatomy-aware generalization, and real-time action guidance under strong safety and data constraints.
    </p>
    <div class="research-work-grid research-work-grid--two">
      <article class="research-work">
        <span class="research-work__status">ICRA 2026 · Accepted · CCF-B · Equal contribution</span>
        <h3>UltraHiT</h3>
        <p>A hierarchical Transformer architecture for generalizable internal-carotid-artery robotic ultrasonography.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2509.13832">Paper</a>
          <a href="https://github.com/LeapLabTHU/UltraHiT">Code</a>
          <a href="{{ '/UltraHiT/' | relative_url }}">Project</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">MICCAI 2026 · Accepted · CCF-B</span>
        <h3>VA-Adapter</h3>
        <p>A parameter-efficient vision-action adapter for real-time echocardiography probe guidance.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2510.06809">Paper</a>
          <a href="https://github.com/LeapLabTHU/VA-Adapter">Code</a>
        </div>
      </article>
    </div>
  </article>
</section>

<section class="subpage-next">
  <p>See how these projects developed over time.</p>
  <a href="{{ '/journey/' | relative_url }}">Education and research timeline <span aria-hidden="true">→</span></a>
</section>
