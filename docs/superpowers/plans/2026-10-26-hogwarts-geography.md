# Hogwarts geography implementation plan

> **For agentic workers:** Use the execution workflow with independent research and visual review. Root owns graph integration, renderer and publication.

**Goal:** Publish an accurate, qualified maze overview and eliminate travel through non-passages.

**Architecture:** Retain the Jekyll site and atlas. Add geographical evidence metadata and an atlas page generated from the same graph; replace broad hit regions with visually audited polygons and explicit activation.

**Tech Stack:** Vanilla JavaScript, CSS, inline SVG, Jekyll, Node regression checks, generated WebP scenes.

**Spec:** `docs/superpowers/specs/2026-10-26-hogwarts-geography-design.md`

## Global constraints

- Preserve existing room URLs and station/session rules.
- Every traversable route must have a visible, physically plausible aperture in each view.
- Distinguish book evidence, inferred links and invention.
- Diagram edges come from the actual atlas, never a second hardcoded graph.
- No map-based teleportation; spoiler disclosure is opt-in.

## Review focus

1. Pointer clicks on walls, furniture, water and image corners must not move rooms.
2. Keyboard or touch browsing must not trigger a secret or an unrelated exit.
3. Secret opening images must be ready before a travel target becomes active; load failure allows retry.
4. Floor changes must be described as stairs/landings and leaf rooms must not carry through traffic.
5. Mobile diagrams and narrow photo passages must remain usable without enlarged hitboxes covering adjacent objects.

## Tasks

- [x] 1. Audit all 49 source images and original-book relationships; save evidence and exact passage polygons.
- [x] 2. Add failing runtime regressions for non-passage clicks and deliberate keyboard activation; implement physical passage handling in `assets/js/hogwarts-explore.js` and `assets/css/hogwarts-cinematic.css`.
- [x] 3. Revise `assets/js/hogwarts-atlas.js`, `assets/js/hogwarts-scenes.js` and necessary scene assets; verify reachability, reversible ordinary routes and destination-room constraints.
- [x] 4. Add `assets/js/hogwarts-geography.js`, the independent `/hogwarts/atlas/` page, overview logic/style and references; update the existing explorer map to the same geographical grouping.
- [x] 5. Verify graph, runtime, image and overview behavior; independently review desktop and mobile controls.
- [ ] 6. Run the hosted Jekyll build, publish and confirm the live site.

## Progress

- Baseline main: `e1b72cc6cd2cee6b6b30624552593bccd47871b7`.
- Initial diagnosis: broad rectangles remain the click target despite rounded styling; unselected click walks invoke edge exits; secret proximity immediately teleports; atlas forces reverse compass directions although camera orientation varies.
- Parallel work: book/graph audit, 25 interior-image audit, 24 exterior/depth-image audit. Root implements intent-safe interaction and overview.
- Integrated result: 53 nodes, 52 ordinary edges, two secret edges, 106 normal passage polygons, 21 newly generated WebP assets (15 replacements, four connectors, two reveal variants).
- Six local integrity suites passed, including 44 runtime regressions, 834 independent shortest-path checks, all source/evidence records, exact native image dimensions and 50 generation-provenance hashes.
- Browser review covered the standalone page, 390-pixel mobile layout, genuine chart zoom (850 to 977.5 pixels at 115%), image-to-passage alignment and non-passage clicks. Rendered diagram edges cross zero unrelated node labels.
- Independent review found and resolved held-key secret entry, revealed-state returns, canceled ceremony callbacks, mobile zoom and regional keyboard-focus issues. Final code verdict: ready to merge. Publication remains a separate external verification step.
