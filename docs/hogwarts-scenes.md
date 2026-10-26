# Hogwarts scene repair — 2026-10-26

## What was wrong

The atlas already had 49 distinct raster backgrounds, but the renderer painted
procedural trees, furniture, teacher silhouettes, cauldrons, and framed doors
above them. Its tall stage used `cover`, cropping landscape art independently
of the fixed doorway coordinates. Seven sources were 960×720 and fourteen were
1440×810, making the combination particularly soft on a narrow display.

The original soundtrack routing had been repaired, but the playback path still
probed MP3 files that were not present. The Spotify player existed only while
its panel was open. See `assets/audio/hogwarts/README.md` for the repaired player.

## Images and rendering

Every room now renders a real `<img>` from `assets/js/hogwarts-scenes.js`, with
intrinsic dimensions. The stage uses that image's aspect ratio and the full
image stays visible on desktop and mobile. Synthetic scenery, opaque doorway
frames, extra darkening, grain, and blur transitions are removed. Only subtle
movement feedback and discoverable, transparent interaction targets remain.

Twenty-nine scenes were regenerated: all seven 960×720 sources, all fourteen
1440×810 sources, and eight outdoor views whose 1672-pixel files still contained
soft detail or baked-in white margins. The latter batch covers the lantern path,
south courtyard, stone viaduct, lake, boathouse, pier, glasshouse passage, and
herbology lesson. Visual review caught these source-image defects after the
dimension checks; they were replaced with new full-bleed compositions.
All 49 active backgrounds now have a native width of 1672
pixels. The new images are 1672×940 or 1672×941; they are **not 4K** and have not
been upscaled. The generator did not deliver the larger requested dimensions.

New images are in `assets/images/hogwarts-cinematic-v3/`. Their `provenance.json`
records exact prompts, actual native dimensions, final hashes, and WebP delivery
encoding (quality 94, method 6). This keeps fine detail while avoiding the much
larger lossless delivery files. Original generated PNGs are not shipped as
unused website assets.

## Passage behavior

Each room has explicit `[centerX, centerY, width, height]` exit regions in full
image percentages. The clickable region and picture therefore scale together.
The garden's wooden gate, office staircase, dungeon arch, tapestry, and carved
washbasin use the corresponding pictured feature. Borderless targets show only
a faint radial light on hover; keyboard focus remains visible. Destination
names appear in the existing scene caption when a passage is focused.

Clicking a passage preserves that chosen destination throughout the walk,
preventing another exit from intercepting the route. Arrow keys, WASD, touch
movement, browser history, both hidden passages, and the sorting ceremony remain
available. The ceremony requires deliberate target activation; simply walking
north through the Great Hall no longer opens it.

The current view remains visible while the destination image loads. A failed
load or timeout leaves the visitor in the current room and permits retrying.
A missing scene catalog shows a reload control without discarding the visit.
The Platform 9¾ entry condition, room URLs, graph, and map discovery rules stay
intact.

## Verification

Run these checks at the repository root:

```sh
node tests/hogwarts-maze-check.mjs
node tests/hogwarts-map-check.mjs
node tests/hogwarts-scenes-check.mjs
node tests/hogwarts-explorer-check.mjs
node tests/hogwarts-soundtrack-check.mjs
```

The scene check reads WebP headers and compares their encoded dimensions with
the manifest. The runtime explorer check covers all 49 room renders, intended
passage clicks, arrows/WASD, browser history, hidden passages, explicit ceremony
activation, missing catalogs, image errors, and timeout recovery. The soundtrack
check covers all 49 route mappings, confirmed playback state, visitor pause,
scene continuity, lifecycle restoration, and failed provider initialization.

These checks run in the Hogwarts maze workflow; the Site check workflow builds
the full Jekyll site for the pull request. Browser verification is separate from
the deterministic tests: an attempted player call is not proof of playback.
