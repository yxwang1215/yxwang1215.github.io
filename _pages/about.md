---
permalink: /
title: "Home"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# About Me
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="highlight-box" markdown="1">
I am a third-year undergraduate at **Xidian University**, majoring in **Software Engineering (Intelligent Direction)**. I rank <span class="academic-emphasis">**1st/335**</span> in all Software Engineering and <span class="academic-emphasis">**1st/1342**</span> in the Computer Category for the 2023-2024 academic year. Additionally, I am proficient in **English** (CET-6: 591) and **French** (College French Test Band 4: Excellence).

**Research Interests:**
<span class="tag">Multimodal LLMs</span>
<span class="tag tag--green">Efficient AI</span>
<span class="tag tag--orange">Large Language Models</span>
<span class="tag tag--purple">Omni LLMs</span>
<span class="tag tag--blue">Token Pruning</span>
<span class="tag tag--blue">KV Cache Optimization</span>
</div>

<span class='anchor' id='educations'></span>

# Education
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="edu-card">
<img src="/images/xidian.png" alt="Xidian University" class="edu-logo">
<div class="edu-content" markdown="1">
**[Xidian University](https://www.xidian.edu.cn/)** · Xi'an, China
<br> *B.Eng. in Software Engineering* &emsp; *Sep. 2023 - Jun. 2027 (expected)*
<br> As a top-ranked student with a perfect **GPA of 4.0/4.0**, I have demonstrated consistent academic excellence in core courses such as Physics (99), Programming Design (98), Circuits (98), Discrete Math (98).
</div>
</div>

<div class="edu-card">
<img src="/images/UCLA.png" alt="UCLA" class="edu-logo">
<div class="edu-content" markdown="1">
**[University of California, Los Angeles](https://www.ucla.edu/)** · Los Angeles, USA
<br> *Visiting Student, Summer Session* &emsp; *Jun. 2024 - Aug. 2024*
<br> Mastered mathematical modeling techniques via intensive study in Numerical Analysis.
</div>
</div>

<div class="edu-card">
<img src="/images/zhenhai.png" alt="Zhenhai High School" class="edu-logo">
<div class="edu-content" markdown="1">
**[Zhenhai High School of Ningbo](https://baike.baidu.com/item/%E5%AE%81%E6%B3%A2%E5%B8%82%E9%95%87%E6%B5%B7%E4%B8%AD%E5%AD%A6/8479981)** · Ningbo, China
<br> *Innovation Class (Jiaochuan Academy)* &emsp; *Sep. 2020 - Jun. 2023*
<br> Selected for the *Innovation Class* at Zhejiang's top-ranked high school; 15 classmates and ~70 students school-wide are admitted to **Peking University** or **Tsinghua University** annually.
</div>
</div>

<!--
My research interest includes neural machine translation and computer vision. I have published more than 100 papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'>google scholar citations <strong><span id='total_cit'>260000+</span></strong></a> (You can also use google scholar badge <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>).
-->

<span class='anchor' id='publications'></span>

# Publications
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="pub-card pub-card--accepted" markdown="1">
[**Accelerating Diffusion Large Language Models with SlowFast: The Three Golden Principles**](https://arxiv.org/abs/2506.10848)
<br> Q. Wei, Y. Zhang, Z. Liu, P. Zeng, **Y. Wang**, D. Liu, L. Zhang
<br> <span class="publication-status">Accepted to ICLR 2026 (CCF-A)</span>
<br> *Proposed SlowFast Sampling, a dynamic strategy that adaptively alternates between exploratory and accelerated stages based on token certainty, convergence, and positional principles. Achieved 15.63x speedup on LLaDA.*
<br> <a href="https://arxiv.org/abs/2506.10848" class="btn--research btn--paper">Paper</a> <a href="https://github.com/LiangrunFlora/Slow-Fast-Sampling" class="btn--research btn--code">Code</a>
</div>

<div class="pub-card pub-card--accepted" markdown="1">
[**UltraHiT: A Hierarchical Transformer Architecture for Generalizable Internal Carotid Artery Robotic Ultrasonography**](https://arxiv.org/abs/2509.13832)
<br> T. Wang\*, H. Jiang\*, **Y. Wang\***, Z. Sun, X. Yan, X. Li, G. Huang (\* denotes Equal Contribution)
<br> <span class="publication-status">Accepted to ICRA 2026 (CCF-B)</span>
<br> *Proposed UltraHiT, a hierarchical Transformer for autonomous robotic ultrasonography, significantly improving generalization across diverse ICA anatomies.*
<br> <a href="https://arxiv.org/abs/2509.13832" class="btn--research btn--paper">Paper</a> <a href="https://github.com/LeapLabTHU/UltraHiT" class="btn--research btn--code">Code</a> <a href="https://yxwang1215.github.io/UltraHiT/" class="btn--research btn--project">Project Page</a>
</div>

<div class="pub-card pub-card--accepted" markdown="1">
[**AudioKV: KV Cache Eviction in Efficient Large Audio Language Models**](https://arxiv.org/abs/2604.06694)
<br> **Y. Wang**, P. He, X. Gui, X. Liu, J. He, X. Liu, X. Hu, L. Zhang
<br> **First Author**; <span class="publication-status">Accepted to ACM MM 2026 (CCF-A)</span>.
<br> *Proposed AudioKV, prioritizing audio-critical attention heads via semantic-acoustic alignment. Reduces memory overhead by 60% with Spectral Score Smoothing (SSS).*
<br> <a href="https://arxiv.org/abs/2604.06694" class="btn--research btn--paper">Paper</a> <a href="https://github.com/yxwang1215/Audio_kvcache" class="btn--research btn--code">Code</a>
</div>

<div class="pub-card pub-card--accepted" markdown="1">
[**VA-Adapter: Adapting Ultrasound Foundation Model to Echocardiography Probe Guidance**](https://arxiv.org/abs/2510.06809)
<br> T. Wang, H. Jiang, **Y. Wang**, Z. Sun, S. Song, G. Huang
<br> <span class="publication-status">Accepted to MICCAI 2026 (CCF-B)</span>
<br> *Parameter-efficient Vision-Action Adapter for real-time probe guidance.*
<br> <a href="https://arxiv.org/abs/2510.06809" class="btn--research btn--paper">Paper</a> <a href="https://github.com/LeapLabTHU/VA-Adapter" class="btn--research btn--code">Code</a>
</div>

<span class='anchor' id='projects'></span>

# Projects
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="pub-card pub-card--submitted" markdown="1">
[**Thinking inside the Mask: In-place Prompting in Diffusion LLMs**](https://arxiv.org/abs/2508.10736)
<br> X. Jin, **Y. Wang**, Y. Gao, Z. Wen, B. Qi, D. Liu, L. Zhang
<br> **Second Author**; Submitted to **ACL 2026 (CCF-A)**.
<br> *Proposed In-Place Prompting, integrating reasoning chains directly into the mask denoising process for Diffusion LLMs.*
<br> <a href="https://arxiv.org/abs/2508.10736" class="btn--research btn--paper">Paper</a> <a href="https://github.com/Lueci4er/ICE" class="btn--research btn--code">Code</a>
</div>

<div class="pub-card pub-card--submitted" markdown="1">
[**Self Speculative Decoding for Diffusion Large Language Models**](https://arxiv.org/abs/2510.04147)
<br> Y. Gao\*, Z. Ji\*, **Y. Wang**, B. Qi, H. Xu, L. Zhang (\* denotes Equal Contribution)
<br> Submitted to **ACL 2026 (CCF-A)**.
<br> *Developed SSD for Diffusion LLMs, accelerating inference via internal self-drafting and parallel verification.*
<br> <a href="https://arxiv.org/abs/2510.04147" class="btn--research btn--paper">Paper</a>
</div>

<div class="pub-card pub-card--submitted" markdown="1">
[**AudioMarathon: A Comprehensive Benchmark for Long-Context Audio Understanding and Efficiency in Audio LLMs**](https://arxiv.org/abs/2510.07293)
<br> P. He\*, Z. Wen\*, Y. Wang\*, **Y. Wang**, X. Liu, J. Huang, Z. Lei, Z. Gu, X. Jin, J. Yang, _et al._ (\* denotes Equal Contribution)
<br> Submitted to **ACL 2026 (CCF-A)**.
<br> <a href="https://arxiv.org/abs/2510.07293" class="btn--research btn--paper">Paper</a> <a href="https://github.com/DabDans/AudioMarathon" class="btn--research btn--code">Code</a> <a href="https://huggingface.co/datasets/Hezep/AudioMarathon" class="btn--research btn--dataset">Dataset</a>
</div>

<div class="pub-card" markdown="1">
[**Operating System Review**](https://aiydpfs7gq6.feishu.cn/docx/Ppa6ddgF4ozcS4xQcMFcbVyAnVh?from=from_copylink) (June 2025)
<br> *Open-source study guide for Xidian Software Engineering students, covering Modern Operating Systems.*
<br> <a href="https://aiydpfs7gq6.feishu.cn/docx/Ppa6ddgF4ozcS4xQcMFcbVyAnVh?from=from_copylink" class="btn--research btn--project">Read Guide</a>
</div>

<span class='anchor' id='internships'></span>

# Internships
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="intern-card">
<img src="/images/SJTU.png" alt="Shanghai Jiao Tong University" class="intern-logo">
<div class="intern-content" markdown="1">
[**EPIC Lab**](https://epic-lab.github.io/), [School of Artificial Intelligence](https://soai.sjtu.edu.cn/), [Shanghai Jiao Tong University](https://en.sjtu.edu.cn/), China.
<br> *Research Assistant* &emsp; August 2025 - February 2026
<br> Developed efficient diffusion LLM inference methods and KV cache eviction techniques for Audio LLMs.
<br> <span class="publication-status">Accepted to ICLR 2026 and ACM MM 2026.</span>
</div>
</div>

<div class="intern-card">
<img src="/images/tsinghua.png" alt="Tsinghua University" class="intern-logo">
<div class="intern-content" markdown="1">
[**LEAP Lab**](https://www.leaplab.ai/), [Department of Automation](https://www.au.tsinghua.edu.cn/index.htm), [Tsinghua University](https://www.tsinghua.edu.cn/), China.
<br> *Research Assistant* &emsp; March 2025 - September 2025
<br> Participated in the implementation of autonomous robotic ultrasonography and real-time probe-guidance projects. My work was conducted onsite at Tsinghua University's Central Main Building, room 601.
<br> <span class="publication-status">Accepted to MICCAI 2026 and ICRA 2026.</span>
</div>
</div>

<span class='anchor' id='honors-and-awards'></span>

# Selected Awards
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="award-item" markdown="1">
*2025.12*: **Huawei Scholarship** (Top 0.1%) - Issued by Huawei Xi'an Research Institute
</div>
<div class="award-item" markdown="1">
*2023 - 2025*: **National Scholarship** (Twice, 2023-2024, 2024-2025)
</div>
<div class="award-item" markdown="1">
*2025.04*: **National First Prize**, National English Competition for College Students (NECCS)
</div>
<div class="award-item" markdown="1">
*2024.12*: **First Prize**, National Undergraduate Mathematical Modeling Contest
</div>
<div class="award-item" markdown="1">
*2024.11*: **First Prize**, 16th National Undergraduate Mathematics Competition
</div>
<div class="award-item" markdown="1">
*2024.01*: **National First Prize**, *Vocabulary Star* National English Vocabulary Competition
</div>
<div class="award-item" markdown="1">
*2024.01*: **Honorable Mention**, Mathematical Contest in Modeling (MCM)
</div>

<span class='anchor' id='activities'></span>

# Activities
{: style="margin-top: 0.8em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="intern-card" markdown="1">
**Xidian Inspur Club**, President (2025 - 2026)
<br> *Club Management*: Directed daily operations and spearheaded club recruitment, while organizing academic workshops and orientations to grow the research community.
</div>

<span class='anchor' id='friends'></span>

# Friends
{: style="margin-top: 1.2em; margin-bottom: 10px;"}
<div class="section-divider"></div>

<div class="friend-card" markdown="1">
[**Krysdal C. Warhol**](https://vegebirrd.github.io/), a junior at **Peking University** (CS), who plans to apply for a Master's degree in the United States. He learned **Spanish** and **Japanese**, whereas I learned **French**.
</div>
<br>
<!-- <br> -->

<div class="last-updated">
  <em>Last updated: 2026/8/26.</em>
</div>

<br>
<br>
<br>
<br>
<br>