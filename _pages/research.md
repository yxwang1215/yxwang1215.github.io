---
permalink: /research/
title: "Research Map"
excerpt: "Research threads, questions, and artifacts."
author_profile: false
wide: true
page_class: "research-map-page"
---

<header class="subpage-hero subpage-hero--research">
  <div>
    <p class="subpage-hero__eyebrow">RESEARCH MAP · 研究脉络</p>
    <h1>Follow the questions behind the papers.</h1>
    <p class="subpage-hero__lead">
      A publication list is chronological; research is not. This page groups my work by the recurring questions it tries to answer.
    </p>
  </div>
  <aside class="subpage-hero__aside">
    <span>3 connected threads</span>
    <strong>Efficiency · Multimodality · Embodied AI</strong>
    <a href="{{ '/#publications' | relative_url }}">See the formal publication list →</a>
  </aside>
</header>

<section class="research-principles" aria-label="Research lens">
  <div>
    <span>01</span>
    <strong>Start from the bottleneck</strong>
    <p>Identify where time, memory, or generalization is actually lost before designing the method.</p>
  </div>
  <div>
    <span>02</span>
    <strong>Connect algorithm and system</strong>
    <p>Prefer improvements that remain visible in measurable end-to-end behavior.</p>
  </div>
  <div>
    <span>03</span>
    <strong>Leave reusable artifacts</strong>
    <p>Pair ideas with code, datasets, benchmarks, or project pages whenever possible.</p>
  </div>
</section>

<section class="research-clusters" aria-label="Research threads">
  <article class="research-cluster">
    <header class="research-cluster__header">
      <span class="research-cluster__number">THREAD 01</span>
      <div>
        <p>DIFFUSION LANGUAGE MODELS</p>
        <h2>How can parallel generation become genuinely faster?</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Diffusion LLMs expose parallelism, but useful acceleration depends on token confidence, denoising dynamics, verification cost, and the way reasoning is represented.
    </p>
    <div class="research-work-grid">
      <article class="research-work">
        <span class="research-work__status">ICLR 2026 · Accepted</span>
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
      <span class="research-cluster__number">THREAD 02</span>
      <div>
        <p>AUDIO & MULTIMODAL LLMS</p>
        <h2>What information deserves to stay in memory?</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Long audio contexts make memory allocation a semantic decision: compression must preserve acoustically and linguistically critical evidence rather than treating every token or head equally.
    </p>
    <div class="research-work-grid research-work-grid--two">
      <article class="research-work">
        <span class="research-work__status">ACM MM 2026 · Accepted · First Author</span>
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
      <span class="research-cluster__number">THREAD 03</span>
      <div>
        <p>EMBODIED MEDICAL INTELLIGENCE</p>
        <h2>How can models generalize from perception to physical guidance?</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Robotic ultrasonography couples visual representation, anatomy-aware generalization, and real-time action guidance under strong safety and data constraints.
    </p>
    <div class="research-work-grid research-work-grid--two">
      <article class="research-work">
        <span class="research-work__status">ICRA 2026 · Accepted · Equal Contribution</span>
        <h3>UltraHiT</h3>
        <p>A hierarchical Transformer architecture for generalizable internal-carotid-artery robotic ultrasonography.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2509.13832">Paper</a>
          <a href="https://github.com/LeapLabTHU/UltraHiT">Code</a>
          <a href="{{ '/UltraHiT/' | relative_url }}">Project</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">MICCAI 2026 · Accepted · Top 9%</span>
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
  <p>Research has a route as well as a result.</p>
  <a href="{{ '/journey/' | relative_url }}">Continue to the journey timeline <span aria-hidden="true">→</span></a>
</section>