# LP-SFT Paper Project Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable `/papers/` directory with a visually polished `/papers/lp-sft/` academic project page for LP-SFT, including double-column inspired layout, accessible SVG visualizations, results, source artifacts, and navigation.

**Architecture:** Use standalone static HTML pages inside the Jekyll repository so the requested first-level/second-level URL hierarchy remains explicit. Keep all styling scoped to a new paper-project stylesheet and keep the core page usable without JavaScript. Use copied local assets for the motivation figure and PDFs, with inline SVG for the diagrams and benchmark chart.

**Tech Stack:** Jekyll, semantic HTML, scoped CSS, inline SVG, existing site navigation YAML, Ruby Bundler/Jekyll build.

**Spec:** `docs/superpowers/specs/2026-11-07-lp-sft-project-page-design.md`

## Global Constraints

- Keep the requested hierarchy: `papers/index.html` and `papers/lp-sft/index.html`.
- Keep paper-reported scores separate from local reproduction scores.
- Use the supplied double-column SRP-SFT paper as a visual reference only.
- Use accessible SVG with text labels and `role="img"`/`aria-labelledby`.
- Do not copy model weights, caches, or checkpoints into the website repository.
- Preserve the existing homepage layout and use root-relative Jekyll paths.

## Review Focus

- Deep links: `/papers/` and `/papers/lp-sft/` must build to the expected URLs and work when opened directly.
- Asset paths: copied figure and PDFs must resolve from both GitHub Pages and local Jekyll builds.
- Evidence boundary: paper and reproduction tables/charts must have distinct labels and source links.
- Responsive layout: two-column desktop sections must collapse without horizontal overflow on narrow screens.
- Accessibility: SVGs, tables, focus states, and reduced-motion behavior must remain usable without JavaScript.

### Task 1: Add paper assets and navigation entry

**Files:**
- Create: `papers/assets/lp-sft-motivation.png`
- Create: `papers/assets/lp-sft-paper.pdf`
- Create: `papers/assets/lp-sft-reproduction.pdf`
- Modify: `_data/navigation.yml`

**Interfaces:**
- Produces stable local asset paths used by `papers/lp-sft/index.html`.

- [ ] **Step 1: Copy the source assets**

  Copy `lp_sft_reproduction/paper/motivation_figure.png` to `papers/assets/lp-sft-motivation.png`, `lp_sft_reproduction/references/paper_2607.04733v2.pdf` to `papers/assets/lp-sft-paper.pdf`, and `lp_sft_reproduction/software_core/SRP_SFT__Selective_Rank_Preserving_Supervised_Fine_Tuning.pdf` to `papers/assets/lp-sft-reproduction.pdf`.

- [ ] **Step 2: Add the `Papers` navigation item**

  Add `Papers` pointing to `/papers/` in `_data/navigation.yml`, next to the existing research-facing entries.

- [ ] **Step 3: Verify copied assets**

  Run `file papers/assets/*` and verify the PNG and two PDFs are recognized with non-zero sizes.

### Task 2: Build the paper directory index

**Files:**
- Create: `papers/index.html`
- Create: `assets/css/paper-directory.css`

**Interfaces:**
- Produces the `/papers/` entry page and a link to `/papers/lp-sft/`.

- [ ] **Step 1: Write the semantic index shell**

  Create a Jekyll page with title/permalink front matter, a directory masthead, one featured LP-SFT card, metadata, short description, and a link to the project page.

- [ ] **Step 2: Style the directory page**

  Add the paper-directory stylesheet with the warm paper palette, thin rules, blue accent, responsive card grid, visible focus state, and reduced-motion-safe hover treatment.

- [ ] **Step 3: Verify the index contract**

  Run `rg -n "permalink: /papers/|/papers/lp-sft/|LP-SFT" papers/index.html` and confirm all three markers are present.

### Task 3: Build the LP-SFT project page and visualizations

**Files:**
- Create: `papers/lp-sft/index.html`
- Create: `assets/css/paper-project.css`

**Interfaces:**
- Consumes the local asset paths from Task 1.
- Produces the `/papers/lp-sft/` project page with three accessible inline SVG visualizations.

- [ ] **Step 1: Add the paper masthead and abstract**

  Add front matter, a double-column-inspired hero, full title, author/affiliation line sourced from `paper_source/templateArxiv.tex`, links to arXiv/code/reproduction/PDF, and a concise abstract that preserves the paper's claim boundary.

- [ ] **Step 2: Add the local-support objective SVG**

  Add a labeled `role="img"` SVG with three lanes comparing CE, LP-SFT, and preserved non-label alternatives. Include a `<title>` and `<desc>` and text labels so the visual still communicates without color perception.

- [ ] **Step 3: Add the method-flow SVG and motivation figure**

  Add a second accessible SVG showing frozen base logits → top-K support → remove target → local normalization → CE + local KL. Place the copied motivation figure beside the explanation and link its caption to the source evidence.

- [ ] **Step 4: Add paper and reproduction results**

  Add the reported Qwen3-4B UltraFeedback table (CE vs LP-SFT) and the local reproduction table (Base vs CE vs LP-SFT) using the documented values. Add a visible `directionally reproduced` label and source links to the status/report documents.

- [ ] **Step 5: Add the benchmark comparison SVG**

  Add a labeled, responsive SVG bar chart for paper averages (53.31 vs 58.67) and reproduction averages (52.43 vs 58.25), printing values on bars and including a note that protocols are separate.

- [ ] **Step 6: Add artifact and citation sections**

  Link to the paper PDF, the supplied double-column reproduction PDF, source repository, and reproduction documentation. Add a short citation block and return link to `/papers/`.

- [ ] **Step 7: Style and responsive behavior**

  Implement the paper-project stylesheet with scoped classes, paper-like typography, desktop two-column sections, mobile single-column collapse, table overflow handling, focus-visible styles, and `prefers-reduced-motion` handling.

### Task 4: Build and verify the site

**Files:**
- Modify: none unless verification finds a build issue.

**Interfaces:**
- Validates all files from Tasks 1–3 as a Jekyll site.

- [ ] **Step 1: Run targeted content checks**

  Run `rg -n "role=\"img\"|aria-labelledby|directionally reproduced|53\.31|58\.67|52\.43|58\.25" papers/lp-sft/index.html` and verify all required visual and evidence markers exist.

- [ ] **Step 2: Run the Jekyll build**

  Run `bundle exec jekyll build --trace` from the site root with caches directed to the shared data disk if needed. Expected result: exit code 0 and generated `_site/papers/index.html` plus `_site/papers/lp-sft/index.html`.

- [ ] **Step 3: Verify generated routes and assets**

  Run `test -f _site/papers/index.html && test -f _site/papers/lp-sft/index.html && test -f _site/papers/assets/lp-sft-motivation.png && test -f _site/papers/assets/lp-sft-paper.pdf && test -f _site/papers/assets/lp-sft-reproduction.pdf`.

- [ ] **Step 4: Inspect the final diff**

  Run `git status --short` and `git diff --stat`, then report the exact files changed and the verification output.
