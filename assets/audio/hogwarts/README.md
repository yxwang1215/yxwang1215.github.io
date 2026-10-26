# Hogwarts scene soundtracks

The site plays the original film cues through **Spotify's official iFrame API**.
It does not bundle or host Harry Potter soundtrack recordings. There are no local
MP3s in this directory, and the soundtrack no longer requests nonexistent files.

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

The player API is loaded immediately on entry, including deep links. One
controller persists through room changes. A new cue is sent through
`loadEntity()`; rooms sharing one recording leave playback uninterrupted.
Opening or closing the small music panel does not pause or recreate the player.

## Playback and visitor preferences

After Spotify's `ready` event, the page requests `play()`. If playback has not
started, a click, touch release or keyboard interaction requests `resume()`
synchronously during that gesture. The player is loaded eagerly so this does not
depend on a later missing-file request or on first opening the music panel.

Autoplay is an attempt, not a guarantee. Spotify documents that programmatic
playback depends on the browser and the listener. The visible state follows
`playback_started` and `playback_update`, never the mere fact that `play()` was
called. If playback is not confirmed, the panel presents a Play control and the
original Spotify player. If the API fails to load, a standard Spotify embed and
a direct track link remain available. Spotify may provide a preview depending
on browser support and the listener's playback availability.

The **Mute soundtrack** control saves `hogwarts:score:enabled:v1 = off`.
Navigation, later gestures and page restoration honor that choice. Pausing
within Spotify's own controls also saves the preference; using Play there enables
sound again. A page lifecycle pause is temporary and does not change the saved
preference. A zero-volume choice from the former native player is migrated to
muted. Volume is controlled through Spotify or the device: the iFrame API does
not expose a volume method, so the page does not present an ineffective slider.

For browser diagnosis, `window.HogwartsSoundtrack.getState()` returns
`{ track, state, enabled, ready }`. The small music control also has a `data-state`
attribute. `playing` means Spotify reported playback; `waiting` means the page
has not received confirmation, and `unavailable` means automatic control failed.
At a reported terminal position the state becomes `ended`, even if Spotify's
preview player leaves `isPaused` false. If no fresh playback confirmation arrives
for 15 seconds, the indication becomes `unconfirmed`; this does not assert that
audio has stopped. Neither state changes the saved sound preference, pauses the
provider, or restarts playback on incidental scene clicks. The explicit Play
control can replay an ended cue or resume an unconfirmed player. A new provider
confirmation restores the playing indication.

Reference documentation:

- [Spotify iFrame API, events and autoplay notes](https://developer.spotify.com/documentation/embeds/references/iframe-api)
- [Spotify embed troubleshooting and preview limitations](https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting)
- [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay/)
- [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)

## Verification

Run these dependency-free Node tests at the repository root:

    node tests/hogwarts-maze-check.mjs
    node tests/hogwarts-map-check.mjs
    node tests/hogwarts-soundtrack-check.mjs

The soundtrack test asserts an explicit expected cue for **every one of the 49
atlas rooms**, verifies that the expected set exactly matches the atlas,
and exercises normal movement, browser Back/Forward, both hidden passages and
hash navigation. Playback checks cover eager loading, ready and gesture attempts,
confirmed playback state, one persistent controller, failed cue changes, saved
mute, late provider events, page restoration and the standard-player fallback.
Spotify is the external test boundary; these tests do not claim that every
listener's browser or account can stream a full recording. These checks run in
the `Hogwarts maze integrity` GitHub Actions workflow.
