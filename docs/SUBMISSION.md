# js13kGames Submission Notes

## Game title
**CHROMA ECHO**

## Short description
A tiny unicorn puzzle where every rewind turns your past run into a Rainbow Echo. Use your previous selves to open paths, collect stars, and restore the last rainbow.

## Suggested categories
- Desktop
- Mobile

## Core hook
**Every mistake leaves a rainbow.**

## Technical highlights
- Procedural Canvas rendering
- No external game assets required
- Web Audio sound effects
- Keyboard and touch support
- Offline-first
- Single-file competition build

## Screenshot ideas
1. Two Echoes holding pads while the current unicorn reaches a portal.
2. A dense rainbow trail showing several failed attempts.
3. The title screen with the line: “Every mistake leaves a rainbow.”

## Final pre-submit verification
1. Run `python tools/build.py`.
2. Confirm the ZIP is at or below 13 KiB.
3. Open the generated `dist/index.html`.
4. Test keyboard controls.
5. Test touch controls.
6. Test audio after user interaction.
7. Confirm no external network request is required.
8. Upload the exact generated ZIP.
