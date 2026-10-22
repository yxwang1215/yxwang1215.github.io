# Hogwarts scene soundtracks

The website uses Spotify's **official track embeds** for film soundtrack playback.
No movie soundtrack audio is copied into this public repository.

- /platform-934/ — Platform Nine-and-Three-Quarters and the Journey to Hogwarts
- /hogwarts/ — Hedwig's Theme
- /hogwarts/great-hall/ — Entry into the Great Hall and the Banquet
- /hogwarts/staircases/ — Hogwarts Forever! and the Moving Stairs
- /hogwarts/quidditch/ — The Quidditch Match
- /hogwarts/chamber-of-secrets/ — The Chamber of Secrets
- /hogwarts/hogsmeade/ — A Window to the Past
- /hogwarts/astronomy-tower/ — Dumbledore's Farewell
- /hogwarts/potions/ — Polyjuice Potion
- /hogwarts/grounds/ — Harry's Wondrous World

## Native audio (only with appropriate permissions)

For low-volume, in-page background playback, provide properly licensed MP3s in this
directory, using these exact filenames:

- platform-934.mp3
- hedwigs-theme.mp3
- great-hall.mp3
- staircases.mp3
- quidditch.mp3
- chamber-of-secrets.mp3
- hogsmeade.mp3
- astronomy-tower.mp3
- potions.mp3
- grounds.mp3

The script automatically checks whether each file exists and activates local audio
if so. It attempts an entrance fade when autoplay is permitted, otherwise playback
can start after a user interaction. It remembers the local mute state and volume,
and pauses local audio when the official Spotify player opens.

**Important:** Buying a recording or having an MP3 does **not** automatically give
permission to distribute it or use it as background music on a public website.
Only add files for which you have the necessary online use rights.

## Maze / SPA integration

Include these two files on each future Hogwarts scene page:

    <link rel="stylesheet" href="/assets/css/hogwarts-soundtrack.css">
    <script src="/assets/js/hogwarts-soundtrack.js" defer></script>

URL changes made via history.pushState() can call
window.HogwartsSoundtrack.sync() or dispatch
new Event("hogwarts:scenechange") on window.

The playlist uses the longest matching URL path. A scene without its own entry
uses the general Hogwarts theme. Hash-based scenes, e.g.
/hogwarts/#/chamber-of-secrets/, are supported too.

Spotify embeds are intentionally created only after the visitor opens the small
music seal. Their playback may require the visitor to press Play due to browser
autoplay restrictions and Spotify's player policies. The seal does not indicate
any hidden door, route, or puzzle solution.
