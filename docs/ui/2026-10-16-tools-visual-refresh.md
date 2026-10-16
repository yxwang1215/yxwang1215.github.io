# Tools visual refresh

This change extends the already merged Paper Studio. It does not replace the editor,
file parsers, compression engines, worker implementations, or existing tool routes.

## Visual references

Reviewed 2026-10-16:

- shadcn/ui: https://github.com/shadcn-ui/ui (about 126k stars),
  https://ui.shadcn.com/blocks/sidebar — restrained controls and contextual navigation.
- Tabler: https://github.com/tabler/tabler (about 42k stars),
  https://preview.tabler.io/layout-fluid.html — fluid workspaces and consistent spacing.

These are layout references, not added dependencies. All new styles, navigation DOM,
and SVG path drawings are local, original implementations. No new fonts, analytics,
external scripts, UI frameworks, or file uploads are introduced.

## Layout contract

- A neutral gray-white surface, forest-green accent, clearer type and controls across Tools.
- Main Studio: retain the canvas, 18 presets, filmstrip, image/PDF handoffs, mobile
  inspector, undo and exports. Add a compact eight-tool menu next to the brand.
- Six standalone utilities: one persistent desktop sidebar with descriptions; native
  disclosure navigation on smaller screens. Left and right panels share the same
  desktop top and bottom edges. Long settings scroll internally, with exports at the bottom.
- At phone widths, panels return to normal document flow. Do not stretch blank panels
  or clip a tall form to force equal heights on a narrow screen.
- Independent-page navigation does not transfer unsaved local files; say so in the menu.
- Preserve old /tools/#compress links, including opening the actual compression inspector.

## Verification

Run `node --test tests/*.test.mjs tests/*.test.cjs`, then
`python tests/tools-ui-layout.py` and the existing browser suites.
The new HTTP suite checks all six legacy routes at 320, 390, 768, 1024, 1280 and
1440 pixel widths, panel alignment, navigation state, keyboard dismissal, mobile
inspector bounds and root compression links.

`TOOLS_UI_OFFLINE=1` is a sandbox-only DOM packaging mode (requires beautifulsoup4).
It is useful for screenshots and geometry when browser HTTP navigation is unavailable;
it is not evidence that HTTP, CSP, module fetching, or CDN loading works. CI uses real
HTTP, unchanged CSP, real workers and the existing export regressions. Deployed-site
checks remain separate from branch tests.
