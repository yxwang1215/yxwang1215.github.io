# Hogwarts geography and physical passages

## Intent

The visitor needs a separate URL explaining the complete maze and its spatial relationships. The routes must respect the novels where evidence is available and everyday spatial logic elsewhere. Every scene transition must originate at an actual visible passage, never a prop, window, wall, or an arbitrary image edge.

## Design decisions

- Keep the existing Jekyll website, room URLs, session-based discovery and individual AI-generated scene images.
- Publish a standalone `/hogwarts/atlas/` reference page. It contains an interactive relationship diagram, room/URL details, a route finder and cited canon notes. It is openly readable but does not grant access or fast-travel into unexplored rooms. Hidden routes are an explicit spoiler toggle.
- Use the live maze graph as the single source for diagram edges. Describe the chart as a schematic, not an authoritative architectural plan. Screen-local passage identifiers do not imply compass directions or equal distances.
- Classify original-book facts separately from reasonable connective interpretation and invented locations. Preserve legacy URL spellings even where a floor component is misleading; display verified or qualified floor information separately.
- Make classrooms, offices and other destination rooms leaves where their images and function justify only one entrance. Put circulation on corridors, landings, stairs and outdoor paths. Add connector scenes only where necessary.
- Replace broad elliptical hotspots with inspected polygons fitting real doors, paths, stairs and hatches. Use AI image generation for scenes that lack the necessary physical opening; do not paint fake architecture over a photograph.
- Ordinary clicks outside a passage do not navigate. Arrow/WASD selection plus Enter and normal Tab/Enter activate real passages; swipes do not teleport through image boundaries.
- Canonical secret mechanisms reveal an actual open passage in an image before a separate traversal action. Examining a basin or tapestry is not itself travel.
- Keep the photo unobstructed by persistent frames or signs. Hover/focus provides a restrained cue and destination caption; keyboard focus remains visible.

## Approaches considered

1. Merely reposition existing hotspots: insufficient because the graph and edge-trigger behavior are also wrong.
2. Rebuild all geography as a speculative floor plan: would present invented precision as canon and discard working imagery.
3. Correct known relationships, label interpretation, and fit every edge to a visible passage: selected implementation approach under the user's instruction to audit and adjust.

## Verification

Check actual images individually, graph connectivity and return routes, absence of classroom transit, polygon bounds/non-overlap, clicks on non-passages, reveal-then-traverse secrets, existing session gates, route-finder correctness, mobile layout and deployed assets. Review sources and the final branch independently before publication.
