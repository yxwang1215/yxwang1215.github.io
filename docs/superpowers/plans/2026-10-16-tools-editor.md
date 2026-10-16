# Tools editor implementation plan

**Goal:** Replace the tool landing page with the user-approved light canvas-first image/PDF editor.

**Architecture:** Preserve existing image processing and PDF-kit engines and all legacy routes. Add one shared stateful UI with independently retained image/PDF sessions and contextual controls; lazy-load PDF.js for rendering. No file uploads or server compute.

**Spec:** ../specs/2026-10-16-tools-editor.md

## Work completed
- [x] Read existing repository and detect concurrent PDF-suite update; use latest main tree without overwriting that suite.
- [x] Implement range parsing and bounded undo/redo history; run failing then passing Node tests.
- [x] Implement neutral light editor, actual preset previews, export dialog and mobile inspector drawer.
- [x] Reuse unchanged image engine and test genuine JPG/PNG/WebP/ZIP/PDF outputs in local browser CPU-fallback mode.
- [x] Add PDF integration with page selection, copying, rotation, extraction, splitting, optional raster compression and image-workspace handoff.
- [ ] Run normal HTTP/module/worker and PDF regression in GitHub Actions; check legacy site/Jekyll build.
- [ ] Inspect final diff, merge without force, and verify published entry and assets.

## Review focus
1. Do not overwrite concurrent main-branch changes or break existing converter URLs.
2. PDF structural exports retain searchable page text and rotations; raster exports explicitly lose searchable text.
3. Switching workspaces retains both file lists, including cross-workspace handoffs.
4. Mobile drawer remains inside viewport; desktop stays canvas-first without horizontal overflow.
5. Cancellation is between files/pages; decode/component failures show errors rather than fake success.

## Verification boundaries
Local browser networking is restricted by the execution environment. Local in-memory tests verify the unchanged CPU fallback and DOM interactions, not HTTP/module loading or remote PDF component loading. A separate normal-HTTP CI run must validate those paths before deployment claims.
