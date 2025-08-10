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


I am a third-year Software Engineering student at the College of Computer Science and Technology, Xidian University, expected to earn my B.S. in Engineering in 2027. My research interests primarily focus on Efficient Large Language Models (LLMs), with additional interests in Reinforcement Learning (RL), Multimodal Large Language Models (MLLMs), and Embodied AI.

<!--
My research interest includes neural machine translation and computer vision. I have published more than 100 papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'>google scholar citations <strong><span id='total_cit'>260000+</span></strong></a> (You can also use google scholar badge <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>).
-->

# 🔥 News
- *2025.07*: &nbsp;🎉🎉 I ranked **1st out of 343** in Software Engineering Major(2024-2025).

# 📝 Publications 
<div class='paper-box'><div class='paper-box-image'><div><div class="badge">(AAAI 2026 submitted)</div><img src='images/thinking_inside_the_mask.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">  

[Thinking Inside the Mask: In-Place Prompting in Diffusion LLMs](https://github.com/yxwang1215/yxwang1215.github.io/blob/main/_pdf/11075_Thinking_Inside_the_Mask.pdf) \| [code](https://github.com/Lueci4er/early-exit)

Xiangqi Jin, **Yuxuan Wang**, Yifeng Gao, Zichen Wen, Biqing Qi, Dongrui Liu, Linfeng Zhang

- **ICE: In-Place Chain-of-Thought Prompting**
ICE is a novel framework that brings in-place prompting to diffusion large language models (dLLMs). It directly embeds prompts into masked token positions during a dLLM's iterative refinement process, enabling more flexible, bidirectional information flow.To boost efficiency, ICE features a confidence-aware early exit mechanism. Our results show it delivers a 17.29% accuracy increase and a 4.12x speedup on GSM8K, while achieving up to 276.67x acceleration on MMLU with strong performance.

</div>
</div>


<div class='paper-box'><div class='paper-box-image'><div><div class="badge">(BIBM 2026 submitted)</div><img src='images/va-adapter.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">  

[VA-adapter: Adapting Ultrasound Foundation Model
to Echocardiography Probe Guidance](https://github.com/yxwang1215/yxwang1215.github.io/blob/main/_pdf/2506_BIBM_Adapting_Ultrasound_Foundation_Model_to_Echocardiography_Probe_Guidance.pdf)

Haojun Jiang, Teng Wang, **Yuxuan Wang**, Gao Huang

- We propose a parameter-efficient Vision-Action Adapter (VA-Adapter) that adapts large ultrasound foundation models for real-time probe guidance in echocardiography. The VA-Adapter encodes vision-action sequences and leverages the model’s sequential reasoning to help junior sonographers acquire high-quality cardiac ultrasound images. By fine-tuning only a small subset of parameters, our approach surpasses strong baselines and improves accessibility to timely heart disease diagnosis. 
</div>
</div>

<!--
<div class='paper-box'><div class='paper-box-image'><div><div class="badge">CVPR 2016</div><img src='images/500x300.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">  

[Deep Residual Learning for Image Recognition](https://openaccess.thecvf.com/content_cvpr_2016/papers/He_Deep_Residual_Learning_CVPR_2016_paper.pdf)

**Kaiming He**, Xiangyu Zhang, Shaoqing Ren, Jian Sun

[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>
- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
</div>
</div>

- [Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet](https://github.com), A, B, C, **CVPR 2020**
-->

# 🚀 Project
- [Operating System Review](https://aiydpfs7gq6.feishu.cn/docx/Ppa6ddgF4ozcS4xQcMFcbVyAnVh?from=from_copylink) (June 2025)
An open-source study guide I created to help Xidian University Software Engineering students prepare for their exams, based on [Modern Operating System, fourth Edition](https://csc-knu.github.io/sys-prog/books/Andrew%20S.%20Tanenbaum%20-%20Modern%20Operating%20Systems.pdf). The project has garnered over 2,000 views and engaged more than 800 users.

# 🥇 Honors and Awards
- *2025.05*: Finals of the National English Competition for College Students  - **First Prize, Final**
- *2024.12*: National Undergraduate Mathematical Modeling Competition  - **Provincial First Prize**
- *2024.11*: National Mathematical Competition for College Students - **Provincial First Prize**
- *2024.09*: Awarded the <span class="highlight">National Scholarship</span>
- *2024.07*: I ranked <span style="color:red">**1st out of 1360**</span> in Computer Category Major(2023-2024)
- *2024.05*: "Foreign Language Society Word Master Cup" National College English Vocabulary Competition - **First Prize, Final**
- *2024.02*: US College Mathematics Modeling Competition (MCM) - **Honorable Mention**

# 💻 Internships
- [LEAP Lab](https://www.leaplab.ai/), [Department of Automation](https://www.au.tsinghua.edu.cn/index.htm), [Tsinghua University](https://www.tsinghua.edu.cn/), China.
  *Research Intern* July 2025 - August 2025 \
   Participated in the implementation of the internal carotid artery ultrasound autonomous navigation project. My work was conducted onsite at Tsinghua University's Central Main Building, room 601.
  
# 📖 Educations
- *2023.06 - 2024.09 (now)*, [Xidian University](https://www.xidian.edu.cn/). I am currently pursuing a Bachelor’s degree in Software Engineering.
- *2024.06 - 2024.08*, [University of California,Los Angeles](https://www.ucla.edu/). I took courses in Numerical Analysis and Film Directing.
- *2020.09 - 2023.06*, [Zhenhai High School of Ningbo](https://baike.baidu.com/item/%E5%AE%81%E6%B3%A2%E5%B8%82%E9%95%87%E6%B5%B7%E4%B8%AD%E5%AD%A6/8479981). I was a student in the experimental class of Zhenhai High School of Ningbo, with 15 classmates admitted to Peking University and Tsinghua University, ~70 students admitted in total.

<!--
# 💬 Invited Talks  🌐
- *2021.06*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2021.03*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  \| [\[video\]](https://github.com/)
-->


