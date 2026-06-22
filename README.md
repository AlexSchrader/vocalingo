# Lingua

A phone-first PWA for learning languages through a tight daily loop:
**clear reviews → lesson → prove it**. Japanese Unit 1 has 5 playable lessons
(あ/か/さ/た/な rows, greetings, and 54 items) with FSRS spaced
repetition, app-judged recall, and kana memory hooks.

## Stack
- Vite 5 + React 19
- PWA via `vite-plugin-pwa` (`autoUpdate`, installable, offline precache)
- `ts-fsrs` — open-source FSRS scheduler (Free Spaced Repetition Scheduler)
- Zustand + `persist` → localStorage (isolated behind `store/` so it can swap to
  IndexedDB later)
- `react-router-dom` (App.jsx holds routes only)
- Inline style tokens from `theme.js`; fluid layout, no device breakpoints

## Run
```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # production build
npm run preview          # serve the build
npm run validate:content # check content schema (hard errors + warnings)
```

## Tests
```bash
npx playwright install chromium   # one-time setup
npm run test:unit                 # 30 unit tests (FSRS, SRS logic, content schema)
npm test                          # 7 Playwright smoke tests (dev)
SMOKE_MODE=preview npm test       # same tests against the production build
```

`tests/smoke.spec.js` asserts: app mounts clean, all tabs navigate, the daily loop
runs end-to-end (teach → choice → typed recall → build → graduate), grades persist
across reload, and every `LIVE_CARD_KIND` is exercised in a single session.

> Playwright requires the Chromium browser. In sandboxes where
> `cdn.playwright.dev` is blocked, run smoke tests on a machine with network access.

## Architecture
- `src/store/useStore.js` — app state + actions (seed, grade, daily loop, streak, cascade, `inventoryFor`).
- `src/store/learnQueue.js` — in-session teach → check1 → check2 → graduate loop.
- `src/store/srs.js` / `fsrs.js` — FSRS scheduling (via `ts-fsrs`).
- `src/store/answer.js` — typed-answer checking with romaji normalisation.
- `src/store/grading.js` — derives FSRS grade from correctness + response speed.
- `src/data/contract.js` — `LIVE_CARD_KINDS` list + `validateContent()` (11 hard
  rules + 2 warnings; item key allowlist enforced; run via `validate:content`).
- `src/data/index.js` — imports all units, seeds items into the store on first run.
- `src/data/ja/unit1.js` — 5 lessons: あ/か/さ/た/な rows + thematic vocab.
- `src/screens/` — Today, Ladder, Haruki, Stats, Lesson (session runner).
- `src/components/games/` — TeachCard, ChoiceCard, TypeCard, BuildCard.
- `CONTENT.md` — schema reference for adding new content.

## Content
Content lives in `src/data/ja/`. Each unit file exports an object that matches the
schema in `CONTENT.md`. Run `npm run validate:content` after any content change —
it enforces id patterns, CEFR fields, kana-no-duplicates, reading normalisability,
and the item key allowlist. CI runs it first before any tests.

## Not yet built
Whisper speech grading · KanjiVG tracing · ElevenLabs audio · real Haruki agent · leaderboards.
