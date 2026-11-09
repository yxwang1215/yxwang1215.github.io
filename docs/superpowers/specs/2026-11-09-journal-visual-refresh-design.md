# Journal Visual Refresh Design

## Intent

Make the Journal index easier to read and visually consistent with the homepage while preserving its current content, search behavior, tag filtering, links, and responsive layout.

## Goals

- Increase the size and contrast of Journal headings, search text, filter controls, card copy, tags, and archive rows.
- Use the homepage blue accent (`#315f9f`, hover `#214a83`) instead of the current pink/gray tag treatment.
- Give the discovery toolbar and archive a clearer card hierarchy with restrained borders and shadows.
- Keep all existing Liquid markup and JavaScript behavior intact.

## Non-goals

- No changes to Journal entries, tag names, archive grouping, routes, or filtering logic.
- No change to the homepage or the public audience of the site.

## Approach

Add one Journal-scoped CSS override layer imported at the end of `site-polish.css`, then bump the stylesheet cache version in the shared head include. Existing markup and responsive breakpoints remain the interface contract; the override layer owns the visual tokens and final type scale.

## Acceptance

At desktop and mobile widths, the Journal page shows readable controls and card text, blue filter/tag states, clearly grouped archive years, and no regressions in search/filter behavior or links.
