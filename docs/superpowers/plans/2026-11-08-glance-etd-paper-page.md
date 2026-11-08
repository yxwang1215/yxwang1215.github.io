# Glance-ETD Paper Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a polished `/papers/glance-etd/` project page for the supplied Glance-ETD CVPR 2027 review PDF and connect it to the site’s paper directory, homepage Works catalogue, and Research page.

**Architecture:** Reuse the existing Jekyll `paper-project` page class and `paper-project.css`. Store the PDF and selected source figures under `papers/assets/`, author the page as a static Jekyll HTML source, and update the existing data-driven/hand-authored indexes to point at the same route.

**Tech Stack:** Jekyll, Liquid, HTML, CSS, JSON, Python unittest, local PDF/PNG assets.

**Spec:** `docs/superpowers/specs/2026-11-08-glance-etd-paper-page-design.md`

## Global Constraints

- Use `/papers/glance-etd/` and the `glance-etd` asset prefix.
- Preserve the supplied PDF’s anonymous CVPR review status; do not invent authors, affiliations, arXiv, or code links.
- Reuse `page_class: paper-project` and the existing `assets/css/paper-project.css` component system.
- Keep the page free of new JavaScript and external dependencies.
- Surface only numbers from the supplied review copy, with captions/notes identifying that source.

## Review Focus

- Anonymous paper metadata: the page must say “Anonymous CVPR submission” and must not imply a named author or public venue. Test in the page contract.
- Asset paths: source and built pages must contain the PDF plus every referenced figure. Test source paths and rendered paths.
- Mobile layout: use existing responsive classes and avoid new fixed-width markup. Test that the page uses the shared `paper-project` class and figure elements rather than a bespoke layout.
- Navigation consistency: the paper directory, homepage Works item, and Research card must all point to `/papers/glance-etd/`. Test each source file.
- Evidence accuracy: key numbers and the Glance/ETD two-stage terms must be present in the page copy. Test the exact strings.

### Task 1: Extend paper-page contract tests

**Files:**
- Modify: `tests/test_papers_pages.py`

**Interfaces:**
- Produces source-level assertions for the Glance-ETD route, assets, page evidence, and index links.

- [ ] **Step 1: Add failing assertions**

  Extend the expected source paths with `papers/glance-etd/index.html`, `papers/glance-etd/README.md`, `papers/assets/glance-etd-paper.pdf`, and the selected PNG assets. Add a test that checks the Glance-ETD page for its permalink, title, anonymous status, `role="img"`, `fig_overview`, `fig_motivation`, `fig_efficiency`, `90.3`, `91.7`, `2.9×`, and the two method labels. Add directory/home/Research link assertions and rendered-route expectations.

- [ ] **Step 2: Run the focused test and confirm it fails**

  Run: `python3 tests/test_papers_pages.py -v`

  Expected: FAIL because the new page and assets do not exist yet.

### Task 2: Add Glance-ETD assets and project page

**Files:**
- Create: `papers/glance-etd/index.html`
- Create: `papers/glance-etd/README.md`
- Create: `papers/assets/glance-etd-paper.pdf`
- Create: `papers/assets/glance-etd-overview.png`
- Create: `papers/assets/glance-etd-motivation.png`
- Create: `papers/assets/glance-etd-efficiency.png`
- Create: `papers/assets/glance-etd-acceleration.png`

**Interfaces:**
- Consumes: supplied source files under `/home/jovyan/zhaoguangxiang-data-zzzc/wangyuxuan/opd/efficient/LT-OPD/paper/`.
- Produces: a Jekyll page at `/papers/glance-etd/` using the shared `paper-project` markup and stable local asset URLs.

- [ ] **Step 1: Copy the source PDF and selected figures**

  Copy `full.pdf` to `papers/assets/glance-etd-paper.pdf` and copy `fig_overview.png`, `fig_motivation.png`, `fig_efficiency.png`, and `fig_acceleration.png` to the corresponding `glance-etd-*` names. Record intrinsic dimensions in the `<img>` attributes.

- [ ] **Step 2: Write the project page**

  Add front matter with `permalink: /papers/glance-etd/`, `page_class: paper-project`, `wide: true`, and anonymous CVPR review metadata. Build sections for: breadcrumb/hero and links; overview teaser; abstract; the two stages (glance encoder and ETD); strict-5% headline results; efficiency and answer-evidence figures; takeaways; artifacts. Use accessible alt text, `figure` captions, and SVG only if a small comparison chart improves readability without duplicating the paper figures.

- [ ] **Step 3: Add the directory README**

  Explain that `papers/glance-etd/` contains the Glance-ETD project page and list its immediate `index.html` child and relationship to the shared assets directory.

### Task 3: Connect the new page to existing site indexes

**Files:**
- Modify: `papers/index.html`
- Modify: `_data/works.json`
- Modify: `_pages/research.md`

**Interfaces:**
- Consumes: `/papers/glance-etd/` and the `glance-etd-*` asset names from Task 2.
- Produces: discoverable links from the Paper Projects directory, homepage Works catalogue, and the efficient multimodal research cluster.

- [ ] **Step 1: Add the paper directory card**

  Update the featured/list copy and count so the directory includes a Glance-ETD card linking to `/papers/glance-etd/`, with the paper title and a short two-stage description.

- [ ] **Step 2: Add a Works catalogue item**

  Add an `audio` or `systems`-appropriate item (choose `audio` only if the existing taxonomy remains semantically correct; otherwise use `systems`) with id `glance-etd`, title, anonymous authors string, description, local overview image, dimensions, venue `CVPR 2027 review · 2026`, and links for `Project page` and `PDF`.

- [ ] **Step 3: Add a Research card**

  Add Glance-ETD to the “Audio and multimodal LLMs” cluster as an efficient multimodal token-selection project, with a Project link and local PDF link.

### Task 4: Run full verification and review the generated route

**Files:**
- Modify: none unless verification exposes a defect.

- [ ] **Step 1: Run source tests**

  Run: `python3 tests/test_papers_pages.py -v`

  Expected: PASS.

- [ ] **Step 2: Build the Jekyll site**

  Run the repository’s existing local build command with temporary/cache directories on the shared data disk, then run `python3 tests/test_papers_pages.py --site _site -v`.

  Expected: PASS, including `_site/papers/glance-etd/index.html`, the four PNGs, and the PDF.

- [ ] **Step 3: Inspect the diff and generated route**

  Check `git diff --check`, verify all new links resolve to the intended local route, and inspect the rendered HTML for the title, anonymous status, figures, and download link.
