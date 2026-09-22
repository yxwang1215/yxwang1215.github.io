<p align="center"><samp>PERSONAL WEBSITE · RESEARCH NOTEBOOK</samp></p>

<h1 align="center">Yuxuan Wang · 王宇轩</h1>

<h3 align="center">Making every token count.</h3>

<p align="center">
  Efficient AI · Multimodal Understanding · From Perception to Action
</p>

<p align="center">
  <strong>Fourth-year undergraduate</strong> at Xidian University<br>
  <strong>Incoming Ph.D. Student</strong> at Peking University · <strong>2027–Future</strong>
</p>

<p align="center">
  <a href="https://yxwang1215.github.io"><strong>Visit my website ↗</strong></a>
  &nbsp; / &nbsp;
  <a href="https://yxwang1215.github.io/#publications">Publications</a>
  &nbsp; / &nbsp;
  <a href="https://scholar.google.com/citations?user=UQgYoZ4AAAAJ&amp;hl=en">Google Scholar</a>
  &nbsp; / &nbsp;
  <a href="https://github.com/yxwang1215">GitHub</a>
  &nbsp; / &nbsp;
  <a href="mailto:yxwang1215@gmail.com">Email</a>
</p>

---

## A few questions worth spending tokens on

I am interested in making large models more efficient without losing what makes them useful. My work spans audio-language models, diffusion language models, and multimodal systems that connect perception with action.

This repository is the source of my personal website: a home for papers, code, and the path between them.

### 01 / What should a model remember?

Long context is useful; keeping everything is expensive. I study **KV cache optimization, token pruning, and audio-aware inference**, with an emphasis on preserving the information that matters rather than treating every token alike.

### 02 / When does a model need to think harder?

Not every decoding step needs the same amount of work. I explore **efficient diffusion LLM inference**, including adaptive sampling, in-place reasoning, and speculative decoding.

### 03 / How does understanding become action?

A useful multimodal model should do more than describe an input. My research experience also includes **robotic ultrasonography and vision-action adaptation**, connecting visual representations to real-time decisions.

I also explore model distillation, agentic coding, and coding security through my foundation-model research internship at 360 ZhiNao.

## Selected work / four entry points

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>AudioKV</h3>
      <p><strong>ACM MM 2026 · First author</strong></p>
      <p><em>Remember the acoustics that matter.</em></p>
      <p>Audio-aware KV cache eviction through semantic-acoustic alignment and spectral score smoothing.</p>
      <p>
        <a href="https://arxiv.org/abs/2604.06694">Paper ↗</a>
        &nbsp; · &nbsp;
        <a href="https://github.com/yxwang1215/Audio_kvcache">Code ↗</a>
      </p>
    </td>
    <td width="50%" valign="top">
      <h3>SlowFast</h3>
      <p><strong>ICLR 2026</strong></p>
      <p><em>Spend computation where it counts.</em></p>
      <p>Adaptive sampling for diffusion language models, alternating exploratory and accelerated decoding stages.</p>
      <p>
        <a href="https://arxiv.org/abs/2506.10848">Paper ↗</a>
        &nbsp; · &nbsp;
        <a href="https://github.com/LiangrunFlora/Slow-Fast-Sampling">Code ↗</a>
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>UltraHiT</h3>
      <p><strong>ICRA 2026 · Equal contribution</strong></p>
      <p><em>Move from seeing to scanning.</em></p>
      <p>A hierarchical Transformer for generalizable internal carotid artery robotic ultrasonography.</p>
      <p>
        <a href="https://arxiv.org/abs/2509.13832">Paper ↗</a>
        &nbsp; · &nbsp;
        <a href="https://github.com/LeapLabTHU/UltraHiT">Code ↗</a>
        &nbsp; · &nbsp;
        <a href="https://yxwang1215.github.io/UltraHiT/">Project ↗</a>
      </p>
    </td>
    <td width="50%" valign="top">
      <h3>VA-Adapter</h3>
      <p><strong>MICCAI 2026</strong></p>
      <p><em>Turn representations into guidance.</em></p>
      <p>Parameter-efficient vision-action adaptation of an ultrasound foundation model for echocardiography probe guidance.</p>
      <p>
        <a href="https://arxiv.org/abs/2510.06809">Paper ↗</a>
        &nbsp; · &nbsp;
        <a href="https://github.com/LeapLabTHU/VA-Adapter">Code ↗</a>
      </p>
    </td>
  </tr>
</table>

More on the [publications page](https://yxwang1215.github.io/#publications), including a separate [projects section](https://yxwang1215.github.io/#projects) for work such as in-place prompting, self-speculative decoding, and AudioMarathon.

## The path / current and next

| When | Where | What |
| :--- | :--- | :--- |
| **2027–Future** | **[Peking University](https://www.pku.edu.cn/)** | **Incoming Ph.D. Student in Computer Science and Technology** · [School of Computer Science](https://cs.pku.edu.cn/) · Advisor: **[Tong Yang](https://yangtonghome.github.io/)** |
| **Sep. 2023–Jun. 2027 (expected)** | **[Xidian University](https://www.xidian.edu.cn/)** | Fourth-year undergraduate · B.Eng. in Software Engineering |
| **Jun.–Aug. 2024** | **[UCLA](https://www.ucla.edu/)** | Visiting Student, Summer Session · Numerical Analysis |

My research experience includes **360 ZhiNao**, **[EPIC Lab at Shanghai Jiao Tong University](https://epic-lab.github.io/)**, and **[LEAP Lab at Tsinghua University](https://www.leaplab.ai/)**. Roles and dates are listed on the [homepage](https://yxwang1215.github.io/#internships).

## Beyond the papers

English and French are part of my world too. I have also served as president of the **Xidian Inspur Club**, organizing student activities and academic workshops. For a less formal corner of the website, visit the [journal](https://yxwang1215.github.io/journal/).

For research conversations, please reach out at **[yxwang1215@gmail.com](mailto:yxwang1215@gmail.com)**.

---

<details>
<summary><strong>Behind the website / notes for future me</strong></summary>

### Where things live

| File or directory | Purpose |
| :--- | :--- |
| [`_pages/about.md`](_pages/about.md) | Homepage biography, education, publications, projects, and experience |
| [`README.md`](README.md) | This repository's personal introduction and research overview |
| [`_config.yml`](_config.yml) | Site identity, profile links, and Jekyll settings |
| [`_data/navigation.yml`](_data/navigation.yml) | Navigation labels and destinations |
| [`_diary/`](_diary/) | Journal entries |
| [`_sass/`](_sass/) and [`assets/`](assets/) | Styles and front-end assets |
| [`images/`](images/) | Profile images, institution logos, and other visual assets |
| [`.github/workflows/`](.github/workflows/) | Site checks and citation-data automation |
| [`google_scholar_crawler/`](google_scholar_crawler/) | Google Scholar citation-data collection |

### Preview locally

Use **Ruby 3.2**, matching the repository's site-check workflow, with Bundler installed.

```bash
git clone https://github.com/yxwang1215/yxwang1215.github.io.git
cd yxwang1215.github.io
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`. Restart the server after changing `_config.yml`.

Run the same build command used by the site check before publishing:

```bash
bundle exec jekyll build --trace
```

### Keep the story consistent

Update the homepage and this README together when education, affiliations, or publication details change. The Peking University entry is intentionally **Incoming Ph.D. Student**, with a **2027** start; do not describe it as an already-enrolled position before enrollment.

Keep personal content separate from the original theme's documentation. Do not replace this README with upstream demo copy during a theme update.

</details>

<sub>Built on <a href="https://github.com/RayeRen/acad-homepage.github.io">AcadHomepage</a>, with thanks to <a href="https://github.com/mmistakes/minimal-mistakes">Minimal Mistakes</a> and <a href="https://github.com/academicpages/academicpages.github.io">Academic Pages</a>. Original license and attribution notices are retained in the repository; see <a href="LICENSE">LICENSE</a>.</sub>

<p align="center"><em>Less wasted computation. More room for ideas.</em></p>
