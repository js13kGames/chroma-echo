# 🌈 CHROMA ECHO

> **Every mistake leaves a rainbow.**

**CHROMA ECHO** is a tiny puzzle-action game built for **js13kGames 2026** and the theme **Unicorns and Rainbows**.

You are a tiny unicorn travelling through a fading magical world. Movement paints a rainbow memory behind you. When you rewind, your previous self returns as a translucent **Echo**, replaying the path you took.

The puzzle is not simply about avoiding failure:

**your past attempts become part of the solution.**

## 🎮 The core mechanic

1. Move through the level and collect every star.
2. Your route is recorded as a rainbow memory.
3. Press **R** to rewind.
4. Your previous run becomes an autonomous Echo.
5. Use Echoes to hold magical pads and open blocked paths.
6. Reach the portal after collecting all stars.

## Controls

### Desktop
- **WASD / Arrow keys** — Move
- **R** — Create a Rainbow Echo / rewind
- **Enter** — Start or continue
- **M** — Toggle sound

### Mobile
- Drag/touch toward the direction you want to move.
- Tap menus to start and continue.

## Why this concept

The competition already contains runners, combat games, roguelites, and several rainbow-trail interpretations. CHROMA ECHO focuses on a different emotional mechanic:

> **Failure is not erased. It becomes collaboration with your past self.**

The rainbow is therefore not only decoration. It is the visible history of how the player learned the level.

## Technical design

- Vanilla JavaScript
- HTML5 Canvas
- No framework
- No external runtime dependencies
- Procedural visuals
- Procedural Web Audio effects
- Desktop + touch controls
- Single-file competition build
- Offline playable

The project resources supplied with the competition explicitly include tiny Canvas/WebGL engines, procedural artwork techniques, Web Audio tools, and js13k-focused compression workflows.

## Project structure

```text
chroma-echo-js13k/
├── src/
│   ├── game.js              # readable development source
│   └── submission.html      # self-contained competition entry
├── tools/
│   └── build.py             # builds ZIP + enforces 13 KiB limit
├── docs/
│   ├── SUBMISSION.md
│   └── POSTMORTEM.md
├── assets/
│   └── chroma-echo-logo.svg # promotional/logo asset, NOT required in ZIP
├── dist/
│   ├── index.html
│   └── chroma-echo.zip
└── README.md
```

## Run locally

Open `src/submission.html` directly in Chrome, or run:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/src/submission.html`.

## Build the competition ZIP

```bash
python tools/build.py
```

The script creates:

```text
dist/chroma-echo.zip
```

and fails if the archive exceeds **13 KiB**.

## Deploy

The competition ZIP is the authoritative submission artifact.

For a public preview:

### GitHub Pages
1. Push the repository to GitHub.
2. Upload the contents of `dist/` or publish `src/submission.html` as `index.html`.
3. Enable GitHub Pages.

### Vercel / Netlify
Use the `dist` directory as the static output after running:

```bash
python tools/build.py
```

## Submission checklist

- [x] Theme: Unicorns and Rainbows
- [x] Playable offline
- [x] Desktop controls
- [x] Touch support
- [x] No external runtime assets
- [x] Self-contained submission HTML
- [x] Automated ZIP size check
- [x] README and submission notes
- [x] Original mechanic
- [ ] Final playtesting
- [ ] Final screenshot capture
- [ ] Upload ZIP to js13kGames
- [ ] Complete competition metadata before deadline

## Important

This repository gives you a working, playable foundation and a size-enforced build artifact. Before final submission, playtest it repeatedly in the actual browsers/devices you intend to support and verify the generated ZIP against the competition's current rules.

## Author

**Edward Victorhez**

Built for **js13kGames 2026**.
