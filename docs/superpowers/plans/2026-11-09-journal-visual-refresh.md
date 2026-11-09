# Journal Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh the Journal index typography and visual hierarchy to match the homepage's blue editorial language.

**Architecture:** Keep the existing Liquid and JavaScript interfaces unchanged. Add a final Journal-scoped CSS layer and bump the shared stylesheet cache version so the deployed page receives the new rules.

**Tech Stack:** Jekyll/Liquid, plain CSS, existing site CSS imports, existing Journal JavaScript.

**Spec:** `docs/superpowers/specs/2026-11-09-journal-visual-refresh-design.md`

## Global Constraints

- Preserve Journal content, routes, search, tag filtering, archive grouping, and responsive behavior.
- Scope new rules under `.journal-shell`.
- Use homepage blue `#315f9f` and hover blue `#214a83`.
- Do not add dependencies.

## Review Focus

- Small screens: card and archive text must remain readable without horizontal overflow.
- Existing CSS order: the new layer must load after prior Journal rules.
- Interactive states: filter, link, focus, and hover states must retain sufficient contrast.
- Existing JavaScript selectors: markup and `data-journal-*` attributes must remain untouched.

### Task 1: Add the Journal visual refresh layer

**Files:**
- Create: `assets/css/journal-visual-refresh.css`
- Modify: `assets/css/site-polish.css`
- Modify: `_includes/head/custom.html`

- [ ] Add blue visual tokens and final type sizes for the masthead, hero, discovery toolbar, cards, tags, archive, and crosslink.
- [ ] Add mobile overrides for the existing 760px breakpoint.
- [ ] Import the file last in `site-polish.css` and bump the shared cache query in `custom.html`.

### Task 2: Validate the generated site

**Files:**
- Test: generated Jekyll site output and browser inspection.

- [ ] Run the existing Journal CSS tests and a Jekyll production build.
- [ ] Inspect desktop and mobile Journal output for readable text, blue controls/tags, archive grouping, and preserved links.
- [ ] Commit the completed source state and publish it through the existing GitHub Pages workflow.
