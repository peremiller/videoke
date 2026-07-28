# VideokePH 🎤 Kanta Na!

A single-file videoke / karaoke machine for Filipino sing-along nights — styled like the
real coin-op units, complete with a 5-digit song-code remote, singing queue, and the
classic (generous) scoring screen.

**Live:** https://videoke-six.vercel.app

## Features

- **127-song songbook (as of July 2026)** across 7 categories:
  🔥 2025–26 Hits (BINI, SB19, XONARA, dwta, Cup of Joe, Dionela, Maki, Lola Amour) ·
  💜 P-Pop · 🎙 OPM Classics ("Kung Sakali", "Kung Ako Na Lang Sana", "Anak") ·
  💘 Love Songs · 🎸 Band/Rock (Eraserheads, Aegis, Rivermaya) ·
  🎉 Party/Novelty · 🌏 English staples
- **Videoke remote** — punch a 5-digit code (e.g. `12001` = Anak) on a number pad with a
  green LED display, key beeps, and live song matching
- **Singing queue** — reserve songs with singer names (recent singers become quick chips),
  reorder, skip, Now Playing stage card
- **Mic scoring** — Web Audio measures how much you actually sang (76–100); falls back to
  "judge's discretion" 80–99 if the mic is unavailable. Score reveal with fanfare,
  confetti, and Taglish verdicts
- **🏆 Hall of Fame** — best score per singer, performance history, JSON export/import
- **YouTube karaoke** — one tap opens a karaoke search for the current song's backing track

## Tech

One self-contained `index.html` — vanilla JS, no build step, no runtime dependencies.
State persists in `localStorage` (`videokeph.v1`). Sounds are synthesized with the
Web Audio API; scoring uses `getUserMedia` + an analyser node (RMS activity).

## Run locally

Serve the folder with any static server, e.g.:

```bash
python3 -m http.server 4725 --directory .
```

Then open http://localhost:4725.

## Deploy

```bash
vercel deploy --prod
```
