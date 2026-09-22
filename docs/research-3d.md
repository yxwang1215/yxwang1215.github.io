# Research in Motion — homepage 3D module

Added 2026-09-11; animation reliability fix 2026-09-22. A self-contained visual accent, not a redesign of the academic site.

## Integration

`_layouts/default.html` loads `assets/css/research-3d.css` and `assets/js/research-3d.js` only when `page.url == '/'`, then includes `_includes/research-3d.html` after the existing homepage shortcuts. The page content, biography, publications, navigation, domain, CNAME and build workflows are not edited. Both animation asset URLs use version `20260922-1` to invalidate old cached copies.

No npm packages, third-party CDN, fonts, textures, API keys or tracking are added. CSS selectors are scoped to `#research-3d`. All three shapes are artistic generative studies, not experimental data or literal simulations of KV-cache behavior.

## Features

- A neural sphere with satellite rings, an acoustic wave landscape, and a trefoil KV-inspired orbit. Rotation and wave motion are now more perceptible on both renderers.
- Continuous particle morphing, pointer proximity response, drag rotation and click-to-pulse.
- Focus the canvas: arrow keys rotate, 1/2/3 select shapes, Space toggles playback, Home resets the view.
- Explicit Play/Pause text, reset, selected-state shape buttons and an explanation when reduced motion, saved pause or Save-Data prevents autoplay.

## Renderers and performance

The preferred renderer is native WebGL 1 with static vertex buffers, shader-based morphs and two or three draw calls per frame. Desktop particle count is 5,600; coarse-pointer, low-memory or data-saving devices use 2,600. Pixel ratio is capped at 2 or 1.5 respectively. Rendering is capped at 60 fps, or 30 fps for the low-power path.

The shared `u_lines` uniform explicitly uses `mediump` in both shaders. Previously the vertex default was `highp` and the fragment default was `mediump`, a shader-linking incompatibility. Both shader compilation and program linking are checked.

Unavailable WebGL, context creation exceptions, shader compilation/linking failures and GPU context loss now switch to an **animated Canvas 2D projection**, with one-quarter the particle count and a 30 fps cap. Recovery creates a fresh canvas: a canvas that has acquired WebGL cannot acquire a 2D context. Interaction is delegated to the stable stage, preserving drag and keyboard controls after replacement; keyboard focus is preserved. After context loss, the CPU renderer remains active for this page visit rather than repeatedly retrying the GPU.

Only when neither graphics context is available, or JavaScript is disabled, does the inline static SVG remain visible.

Animation starts paused for `prefers-reduced-motion`, saved pause preferences and Save-Data. An explicit Play action enables it. The render loop stops outside the viewport, on hidden tabs and on `pagehide`. Canvas interaction keeps native vertical touch scrolling. Storage access is optional and guarded. The module is omitted from print output.

## Validation of the fix

Run the standalone component regression suite from the repository root:

```sh
python -m pip install playwright
python -m playwright install chromium
python tests/research-3d-regression.py
node --check assets/js/research-3d.js
```

To use an existing browser, set `CHROMIUM_EXECUTABLE` to its path. There are no new production dependencies or build steps.

Local result: **15 tests passed, 1 native-WebGL test skipped**. Tests cover shared-uniform precision, all three moving shapes, injected context/compile/link failures, injected context loss, replacement-canvas drag and keyboard controls, pause/resume, reduced motion, saved pause, Save-Data, unavailable storage, offscreen stopping/reentry, pagehide/pageshow, no-JavaScript/no-context SVG fallback, and horizontal overflow at 320/375/768/1280 px and in a narrow article container. No JavaScript page errors were observed. `node --check` and `git diff --check` passed.

**Limits:** Browser frames were verified with the real Canvas 2D renderer. WebGL failure/context-loss tests use injected API behavior; these are not proof of GPU rendering. Storage uses a test-local mock because the fixture has an opaque origin. The environment cannot create native WebGL, so shader compilation on a real GPU and the full Jekyll/Pages build remain unverified. Safari, Firefox and physical mobile devices were not tested. Review the normal Pages build and run the native-WebGL test in a capable browser before merging.

## Review and rollback

Review this change on its fix branch first. Merging the PR is the separate publication step; no production branch, DNS or Pages settings are changed by creating the PR. Rollback is a normal revert of the fix. To remove only the effect, remove the homepage include and the two asset tags from `_layouts/default.html`.

## Design references

- MDN canvas context modes: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
- MDN WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- MDN reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
