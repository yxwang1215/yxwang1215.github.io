# Research in Motion — homepage 3D module

Added 2026-09-11. A self-contained visual accent, not a redesign of the academic site.

## Integration

`_layouts/default.html` loads `assets/css/research-3d.css` and `assets/js/research-3d.js` only when `page.url == '/'`, then includes `_includes/research-3d.html` after the existing homepage shortcuts. The page content, biography, publications, navigation, domain, CNAME and build workflows are not edited.

No npm packages, third-party CDN, fonts, textures, API keys or tracking are added. CSS selectors are scoped to `#research-3d`. All three shapes are artistic generative studies, not experimental data or literal simulations of KV-cache behavior.

## Features

- A neural sphere with satellite rings, an acoustic wave landscape, and a trefoil KV-inspired orbit.
- Continuous particle morphing, pointer proximity response, drag rotation and click-to-pulse.
- Focus the canvas: arrow keys rotate, 1/2/3 select shapes, Space toggles playback, Home resets the view.
- Pause/play and reset are available as labeled native buttons; shape buttons expose their selected state.

## Renderers and performance

The preferred renderer is native WebGL 1 with static vertex buffers, shader-based morphs and two or three draw calls per frame. Desktop particle count is 5,600; coarse-pointer, low-memory or data-saving devices use 2,600. Pixel ratio is capped at 2 or 1.5 respectively. Rendering is capped at 60 fps, or 30 fps for the low-power path.

When no WebGL context can be created, Canvas 2D uses a real 3D coordinate projection with one-quarter the particle count and a 30 fps cap. When neither graphics context is available, or JavaScript is disabled, an inline static SVG remains visible. A shader-initialization failure falls back to SVG rather than attempting to reuse a WebGL canvas as a 2D canvas.

Animation starts paused for `prefers-reduced-motion`, saved pause preferences and Save-Data. An explicit Play action enables it. The render loop stops outside the viewport, on hidden tabs and on `pagehide`. Canvas interaction keeps native vertical touch scrolling. Storage access is optional and guarded. The module is omitted from print output.

## Validation performed

The standalone component passed 23 Chromium/Playwright smoke checks: initialization, changing animation frames, all three morph states, pause/resume, keyboard rotation and shape selection, offscreen stopping and resuming, no horizontal overflow at 320/375/390/650/768/1280 px, a narrow article container, no JavaScript page errors, no external requests, reduced-motion behavior and no-JavaScript SVG fallback. `node --check` passed.

**Limits:** The test environment could not create a WebGL context, so browser rendering tests exercised the Canvas fallback, not the GPU shader path. The complete existing Jekyll site was not built locally, and real-device Safari/Firefox/mobile GPU compatibility has not been verified. The original layout was reconstructed from the connected repository and its Git blob SHA was checked before adding the five integration lines. Review the normal Pages build and test a WebGL-capable browser before merging.

## Review and rollback

Review this change on its feature branch first. Merging the PR is the separate publication step; no production branch, DNS or Pages settings are changed by creating the PR. Rollback is a normal revert of this feature commit. To remove only the effect, remove the homepage include and the two asset tags from `_layouts/default.html`.

## Design references

- MDN WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- MDN reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
