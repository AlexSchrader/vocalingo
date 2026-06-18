# VocaLingo

A phone-first PWA for learning languages through a tight daily loop:
**clear reviews → lesson → prove it**. This is Build Brief 1 — an end-to-end
scaffold with all four screens, a persistent data layer, and one fully playable
lesson (Japanese Unit 1, Lesson 1: Greetings).

## Stack
- Vite 5 + React 19
- PWA via `vite-plugin-pwa` (`autoUpdate`, installable, offline precache)
- Zustand + `persist` → localStorage (isolated behind `store/` so it can swap to
  IndexedDB later)
- `react-router-dom` (App.jsx holds routes only)
- Inline style tokens from `theme.js`; fluid layout, no device breakpoints

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run preview    # serve the build
```

## Architecture
- `src/store/useStore.js` — the whole app state + actions (seed, grade, daily
  loop, streak, cascade).
- `src/store/srs.js` — simple swappable interval scheduler (FSRS drops in later).
- `src/store/mastery.js` — mastery rungs (`SEEN…MASTERED`) and gate checks.
- `src/data/` — language defs + cascade and seeded lesson content.
- `src/screens/` — Today, Ladder, Haruki, Stats, Lesson (session runner).
- `src/components/games/` — RecallCard (wired), Trace/Speak/Build (visual).

## Tests
```bash
npx playwright install chromium   # one-time; needs network access to the
                                  # Playwright CDN
npm test                          # dev mode
SMOKE_MODE=preview npm test       # against the production build
```
`tests/smoke.spec.js` guards "works in dev, blank on prod": it asserts the app
mounts with no console errors, all four tabs navigate, and the daily loop runs
end to end and persists across reload.

> Note: the smoke tests require the Playwright Chromium browser. In sandboxes
> where `cdn.playwright.dev` is not on the network allowlist, run them on a
> machine with network access (or add the host to the egress settings).

## Icons
`scripts/generate-icons.mjs` renders the rung-mark PWA icons (192 + 512) with no
image dependencies. Re-run with `node scripts/generate-icons.mjs`.

## Not in this brief
Real FSRS tuning · Whisper speech grading · KanjiVG tracing · LLM practice · the
Haruki API · Units 2–5 content · A1 gate math + real cascade · leaderboards.
