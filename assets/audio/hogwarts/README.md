# Hogwarts scene soundtracks

The site uses **official Spotify track embeds** for film-score playback. It does
not bundle, redistribute, or host any Harry Potter soundtrack recordings.

## Routing: the atlas is the source of truth

Do **not** add a second table of fictional short URLs such as
`/hogwarts/great-hall/`. The 49 traversable room URLs come exclusively from
`assets/js/hogwarts-atlas.js` (`HogwartsAtlas.rooms` and
`HogwartsAtlas.byPath`).

`assets/js/hogwarts-soundtrack.js` selects a track in this order:

1. Standalone pages: `/platform-934/` and `/hogwarts/sorting-ceremony/`.
2. A small number of stable **room ID** overrides (castle gate, Great Hall,
   Divination, North Battlements).
3. A semantic **room kind** group.
4. Hedwig's Theme for a non-atlas Hogwarts page or an unknown room kind.

No atlas room path is duplicated in the soundtrack file. Room IDs and kinds
are determined using `atlas.byPath[currentPath]` and `atlas.rooms[id]`.

| Room group | Film-score cue | Examples |
| --- | --- | --- |
| Castle entrance and ordinary rooms | Hedwig's Theme | Entrance Hall, lessons, corridors |
| Great Hall | Entry into the Great Hall and the Banquet | Great Hall |
| Staircases | Hogwarts Forever! and the Moving Stairs | Grand Staircase, Spiral Ascent |
| Dungeons and Potions | Polyjuice Potion | Potions, Dungeon Stairwell, Crypt |
| Chamber and underground water | The Chamber of Secrets | Serpent's Descent, Chamber, Reservoir |
| Quidditch | The Quidditch Match | Quidditch Pitch, Flying Lesson |
| Upper towers | Dumbledore's Farewell | Astronomy Tower, Owlery, Divination |
| Historical / quiet rooms | A Window to the Past | Library, Portrait Gallery, Room of Requirement |
| Castle grounds | Harry's Wondrous World | Lake, Forest, Courtyard, Greenhouses |

The separate Platform 9¾ and Sorting Ceremony pages retain their original cues.

For historical hash routes such as `/hogwarts/#/chamber-of-secrets/`,
the soundtrack finds the unique matching room from the atlas. Full nested
hash paths also resolve against the atlas. It does not reveal room routes
in the UI.

## Scene changes and browser history

The Hogwarts explorer calls `history.pushState()` when entering a room and
dispatches `hogwarts:scenechange` **after** the URL and room are updated.
It also dispatches the same event after restoring a room with `popstate`.
The soundtrack handles `hogwarts:scenechange`, `popstate`, and `hashchange`.
You can also call `window.HogwartsSoundtrack.sync()` explicitly.

When two rooms share a track, the current Spotify iframe is kept. When a
transition changes tracks, the old embed is removed (stopping that player);
if the panel is open, an iframe for the new track is created.

Spotify embeds require the listener to press Play: they cannot be made to
autoplay programmatically, and browser/Spotify playback policies still apply.

## Optional native audio — only with the required licenses

If you hold **separate, appropriate online distribution and playback rights**
for particular recordings, the script can also use local MP3s placed in this
directory with these filenames:

- `platform-934.mp3`
- `hedwigs-theme.mp3`
- `great-hall.mp3`
- `staircases.mp3`
- `quidditch.mp3`
- `chamber-of-secrets.mp3`
- `hogsmeade.mp3` (A Window to the Past)
- `astronomy-tower.mp3`
- `potions.mp3`
- `grounds.mp3`
- `sorting-ceremony.mp3`

None of these MP3s are included in the public repository. Owning a purchased
track or accessing it on Spotify does **not** grant the rights needed to
redistribute the original recording on a public website.

## Verification

Run these dependency-free Node tests at the repository root:

    node tests/hogwarts-maze-check.mjs
    node tests/hogwarts-map-check.mjs
    node tests/hogwarts-soundtrack-check.mjs

The soundtrack test asserts an explicit expected cue for **every one of the 49
atlas rooms**, verifies that the expected set exactly matches the atlas,
and exercises normal movement, browser Back/Forward, both hidden passages, hash
navigation, and the official Spotify iframe URLs. These checks run in the
`Hogwarts maze integrity` GitHub Actions workflow.
