---
permalink: /research/
title: "Research"
excerpt: "Research areas and selected work."
author_profile: false
wide: true
page_class: "research-map-page"
---

<header class="subpage-hero subpage-hero--research">
  <div>
    <p class="subpage-hero__eyebrow">Selected work</p>
    <h1>Research</h1>
    <p class="subpage-hero__lead">
      I work on efficient inference for diffusion and audio language models, as well as robotic ultrasound. Selected projects are grouped below by topic.
    </p>
  </div>
  <aside class="subpage-hero__aside">
    <span>Areas</span>
    <strong>Diffusion LLMs · Audio LLMs · Robotic ultrasound</strong>
    <a href="{{ '/#publications' | relative_url }}">Full publication list →</a>
  </aside>
</header>

{% include section-pager.html position="top" previous_url="/journal/" previous_label="Journal" next_url="/journey/" next_label="Journey" %}

<section class="research-principles" aria-label="Main research areas">
  <div>
    <span>01</span>
    <strong>Diffusion LLM inference</strong>
    <p>Sampling, prompting, and verification methods for faster generation.</p>
  </div>
  <div>
    <span>02</span>
    <strong>Audio LLM efficiency</strong>
    <p>Long-context memory and practical KV-cache management.</p>
  </div>
  <div>
    <span>03</span>
    <strong>Robotic ultrasound</strong>
    <p>Navigation and probe guidance for medical robotics.</p>
  </div>
</section>

<section class="research-clusters" aria-label="Research areas">
  <article class="research-cluster">
    <header class="research-cluster__header">
      <span class="research-cluster__number">01</span>
      <div>
        <p>Diffusion language models</p>
        <h2>Diffusion LLM inference</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Work on sampling, prompting, and self-speculative decoding for faster diffusion language-model inference.
    </p>
    <div class="research-work-grid">
      <article class="research-work">
        <span class="research-work__status">ICLR 2026 · Accepted · CCF-A</span>
        <h3>SlowFast Sampling</h3>
        <p>Switches between exploratory and accelerated stages using token certainty, convergence, and position; 15.63× speedup on LLaDA.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2506.10848">Paper</a>
          <a href="https://github.com/LiangrunFlora/Slow-Fast-Sampling">Code</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">ACL 2026 · Submitted</span>
        <h3>Thinking inside the Mask</h3>
        <p>Integrates intermediate reasoning into the mask-denoising process through in-place prompting.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2508.10736">Paper</a>
          <a href="https://github.com/Lueci4er/ICE">Code</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">ACL 2026 · Submitted</span>
        <h3>Self-Speculative Decoding</h3>
        <p>Uses self-drafting and parallel verification to accelerate diffusion language-model inference.</p>
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
        <h2>Audio LLM memory</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Work on preserving important acoustic and linguistic context while reducing memory use.
    </p>
    <div class="research-work-grid research-work-grid--two">
      <article class="research-work">
        <span class="research-work__status">ACM MM 2026 · Accepted · First author</span>
        <h3>AudioKV</h3>
        <p>Uses semantic-acoustic alignment and Spectral Score Smoothing to retain important KV-cache entries; 60% lower memory overhead.</p>
        <div class="research-work__links">
          <a href="https://arxiv.org/abs/2604.06694">Paper</a>
          <a href="https://github.com/yxwang1215/Audio_kvcache">Code</a>
        </div>
      </article>
      <article class="research-work">
        <span class="research-work__status">ACL 2026 · Submitted</span>
        <h3>AudioMarathon</h3>
        <p>A benchmark for long-context audio understanding and efficiency.</p>
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
        <h2>Robotic ultrasound</h2>
      </div>
    </header>
    <p class="research-cluster__question">
      Work on autonomous navigation and real-time probe guidance for ultrasonography.
    </p>
    <div class="research-work-grid research-work-grid--two">
      <article class="research-work">
        <span class="research-work__status">ICRA 2026 · Accepted · CCF-B · Equal contribution</span>
        <h3>UltraHiT</h3>
        <p>A hierarchical Transformer for generalizable internal-carotid-artery robotic ultrasonography.</p>
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

{% include section-pager.html position="bottom" previous_url="/journal/" previous_label="Journal" next_url="/journey/" next_label="Journey" %}
