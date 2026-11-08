# LP-SFT paper project page design

> Superseded during implementation: the requested source was corrected to `paper/latex_acl/2610.19685v1.pdf`, so the shipped page is SRP-SFT. The final page and assets under `papers/srp-sft/` are authoritative.

## Intent

Create a reusable paper-project area in the personal site, starting with a polished project page for the LP-SFT paper and its local reproduction work. The page should let a research visitor understand the problem, method, main result, and available artifacts within one scroll, while leaving a clear path for adding future paper pages under the same URL structure. The visual reference is the supplied double-column SRP-SFT paper: dense but readable academic hierarchy, compact metadata, blue citation accents, and diagrams that explain the objective before the details.

## Goals

- Add a first-level `/papers/` index for paper project pages.
- Add the LP-SFT project at `/papers/lp-sft/`.
- Present the paper title, authors, affiliations, short abstract, method intuition, motivation figure, key results, and artifact links.
- Include explanatory visualizations: a method flow diagram, a CE-vs-LP-SFT local-support comparison, and a benchmark comparison chart.
- Distinguish the paper's reported numbers from the local reproduction numbers and state the reproduction boundary clearly.
- Reuse the existing Jekyll build and site navigation without changing the homepage layout.
- Make the page responsive, keyboard accessible, and usable without JavaScript.

## Non-goals

- Rebuild the entire personal-site design system.
- Copy the full paper text or every appendix table into the page.
- Claim exact or bitwise reproduction when the project documents a reconstructed protocol and a directionally reproduced result.
- Add a live benchmark viewer, model inference demo, or external database integration.

## Constraints and source evidence

- The site is a Jekyll repository at `Project/yxwang1215.github.io`.
- The requested hierarchy is a dedicated first-level paper directory with one second-level directory per project: `papers/index.html` and `papers/lp-sft/index.html`.
- The LP-SFT source material is in `lp_sft_reproduction/`.
- Canonical paper title, author list, abstract, and reported UltraFeedback table come from `paper_source/templateArxiv.tex`.
- Reproduction numbers and limitations come from `docs/REPRODUCTION_STATUS.md`, `docs/ALL_METHODS_RESULTS.md`, and `artifacts/qwen3_4b_ultrafeedback/REPRODUCTION_RESULT.md` when present.
- Existing site assets use root-relative paths and the site has no active UltraHiT directory in the current checkout, so this page will not depend on that missing path.
- The motivation figure will be copied into the website's paper asset directory; large model/checkpoint files will not be copied.
- The supplied double-column reference is `lp_sft_reproduction/software_core/SRP_SFT__Selective_Rank_Preserving_Supervised_Fine_Tuning.pdf`; it is a visual reference only, not a source of LP-SFT claims.

## Approaches considered

1. **Dedicated static HTML pages under `papers/` (selected).** Keep the Jekyll build, but give the index and each project page their own HTML structure and scoped CSS. This matches the requested directory hierarchy, preserves freedom to design an academic landing page, and makes future project pages easy to add.
2. **Jekyll Markdown pages assembled from existing homepage components.** This would maximize theme reuse, but the project page would inherit homepage/sidebar assumptions and make a publication-oriented layout harder to control.
3. **A separate mini-site or JavaScript app.** This would offer the most freedom but adds an unnecessary build/runtime boundary and would make the paper index less integrated with the existing site.

The selected approach is option 1 because it satisfies the requested URL structure while keeping the implementation lightweight and compatible with GitHub Pages.

## Page structure

`/papers/` will contain a compact directory landing page with the section purpose, a featured LP-SFT card, project status, and a link to the project page. The structure should support future cards without changing the page shell.

`/papers/lp-sft/` will contain:

1. a restrained masthead with `LP-SFT`, full title, author line, affiliations, and links to paper, code, reproduction repository, and the papers index;
2. a short abstract and a four-part contribution strip;
3. a method/motivation section using the copied motivation figure and a concise explanation of target-token removal, top-K non-label support, and locally normalized KL;
4. a reported-paper result table for Qwen3-4B UltraFeedback;
5. a local reproduction result table comparing Base, CE, and LP-SFT, with the `directionally reproduced` label and protocol notes;
6. a small reproduction-status panel linking to the source documents and audit artifact;
7. a closing citation/artifact section and navigation back to `/papers/`.

The page should use semantic sections, real table headers, descriptive image alt text, visible focus styles, and a reduced-motion fallback for any reveal or hover treatment. JavaScript is optional and should be limited to progressive enhancement; the core content must work when scripts are unavailable.

## Visual direction

Use a quiet editorial research style inspired by the double-column paper: warm paper background, dark ink, one cool blue accent, thin rules, compact monospace metadata, and generous spacing around the hero. The project page should feel related to the personal site but visually distinct from the homepage cards. On desktop, the hero and method explanation use a two-column grid echoing the paper's first page; on mobile they collapse to one column. Results should combine high-contrast table rows with compact, labeled SVG charts so the visualizations clarify the evidence boundary instead of replacing it.

The visualizations are:

- **Local-support objective diagram:** an inline SVG with three lanes for CE, LP-SFT, and the preserved non-label support, showing which token is supervised and which alternatives are protected.
- **Method flow:** an inline SVG flow from frozen base logits to top-$K$ support, target-token removal, local normalization, and the final CE + local-KL objective.
- **Benchmark comparison:** a responsive bar chart for the paper's Qwen3-4B UltraFeedback average (CE 53.31 vs LP-SFT 58.67) and the local reproduction average (CE 52.43 vs LP-SFT 58.25), with values printed on the bars and a visible note that these are separate protocols.

The charts will be authored as accessible SVG with text labels and `role="img"`/`aria-labelledby`; no chart library or network-loaded asset is required.

## Remaining builder decisions

- Choose the exact asset filename and scoped stylesheet filename.
- Choose whether the root navigation receives a new `Papers` entry; default call is yes, pointing to `/papers/`, because the user asked for a durable paper directory.
- Choose the final wording for external links based on which URLs are available in the source repository; default call is to link the arXiv v2 page, the advertised GitHub repository, the local reproduction repository path if publishable, and the paper PDF copied into the project page.
- Choose a compact result subset for the page while linking to the full reports.
