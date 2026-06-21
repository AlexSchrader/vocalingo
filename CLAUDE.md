# CLAUDE.md — VocaLingo

Standing context for Claude Code (CC) on this repo. Read this first, every session, then
read `BUILD-CHECKLIST.md` for current state. The conventions here are not suggestions —
they're the hard-won rules that keep this project shippable. Follow them without being
re-told.

---

## What this is

VocaLingo is a Japanese-first language-learning PWA built around the **Polyglot Ladder**:
one gated track where Japanese is the deep climb (goal B2), and each side language (es, fr)
unlocks at A1 of its predecessor but aims for A2–B1. The promise is *deep understanding*,
not memorization. The anti-burnout principle is core: motivation comes from
mechanics/structure, never from hand-crafted content — text-first, no character art or
visual-novel surface. A small authored, CEFR-banded skeleton + (later) Haruki-generated
practice scales difficulty automatically.

## Your role (Claude Code)

- **Web-Claude plans, designs, and writes detailed build briefs. You execute them in-repo.**
- Work on **feature branches off `main`**. Open **draft PRs only** — never mark ready, never merge.
- **The merge gate is always Alex's.** He merges after CI is green AND a personal feel-check.
- If a brief is ambiguous or you spot a problem, say so before building — don't silently
  reinterpret scope.

## Workflow (non-negotiable)

1. Branch off current `main`.
2. Build the brief's scope — nothing outside it. Work deferred to another brief stays deferred.
3. Open a **draft** PR.
4. CI must be fully green: `validate:content` → unit tests → browser smoke (dev **and**
   preview) → build. Don't merge on faith — "builds clean ≠ renders ≠ correct."
5. Update `BUILD-CHECKLIST.md` as part of the PR: check off completed tasks with
   `✓ DONE <YYYY-MM-DD HH:MM>, PR #<n>`, add any follow-ups you surfaced, update the
   Status-at-a-glance block. Never delete completed tasks.
6. Stop. Alex reviews, feel-checks, and merges.

## Architecture principles (the spine)

- **Content is pure, schema-validated data.** The engine is content-agnostic — lesson 47
  runs the same code as lesson 1. No lesson- or item-specific branching in engine files.
- **Separation of concerns by PR type:** schema/field changes go in `src/data/contract.js`;
  engine changes get their own scope; **content PRs stay content-only.** Bundling a new
  field or engine tweak into a curriculum PR is how the contract rots — don't.
- **Structural over instructional.** Enforce boundaries in code, not prompts. (Future
  Haruki: the graded "quiz me" path receives only the curriculum memory bank; the
  conversation/exploration bank is never passed in. Promotion is the only bridge.)
- **`LIVE_CARD_KINDS` forcing function:** a card kind ships only when it's in that list
  AND exercised by the coverage fixture. Wiring a new card (trace, speak) means adding it
  to the list, which forces its coverage. `trace` → Brief 3, `speak` → Brief C.

## Guardrails (follow without being told)

- **Never weaken a validator, assertion, or test to force CI green.** If real content or
  code is wrong, fix it or report it — loosening the check defeats its purpose.
- **The repo is the source of truth, not memory.** Reasoning about code shapes from memory
  is unreliable; read the actual file before changing or diagnosing it.
- **Fix-script anchors** must include the full closing `}` of the target object. Never
  anchor on a partial field or a string that also matches inside an existing object
  (prevents mid-object embeds).
- **Emoji in files:** use `create_file` with unicode escapes, never a bash heredoc — it
  corrupts on Windows/PowerShell.
- **Cross-platform npm scripts:** Linux CI runs scripts via `/bin/sh`. Don't quote globs in
  scripts (`node --test tests/unit/*.test.mjs`, not `"...*.test.mjs"`) — let the shell
  expand them. Windows Node expands wildcards itself, so quoting passes locally and fails
  in CI.
- **Don't regenerate the logo or app icons.** Use the committed skewed-rung files and the
  canonical SVG; CC-redrawn icons have drifted before.
- **Tuning is constants, not structure.** If something feels too fast/repetitive/harsh,
  it's a one-line change to `LEARN_OPTS` (`src/store/learnQueue.js`) or `TIMING`
  (`src/store/grading.js`) + a re-run — not a rebuild.

## Stack & environment

- Vite 5 + React 19 + vite-plugin-pwa.
- State: Zustand + persist → localStorage (single store module, swappable to IndexedDB).
- Routing: react-router-dom (`App.jsx` = routes only).
- Scheduling: FSRS via `ts-fsrs`.
- Deploy: Vercel — `main` = production, every other branch = preview.
- Dev environment: PowerShell on Windows. Repo is currently public.
- CI: GitHub Actions — `validate:content`, unit tests (`node --test`), Playwright smoke
  (dev + `SMOKE_MODE=preview`), build.

## Key files

- **State of the project:** `BUILD-CHECKLIST.md` (read first).
- **Content:** `src/data/ja/*.js`, validated by `src/data/contract.js`
  (`validateContent`, `LIVE_CARD_KINDS`); shape documented in `CONTENT.md`.
- **Languages / cascade:** `src/data/ja/languages.js` (`target`/`unlock`/`unlocked`).
- **Learning engine:** `src/screens/Lesson.jsx` (session runner),
  `src/store/learnQueue.js` (`LEARN_OPTS`), `src/store/grading.js` (`TIMING`),
  `src/store/answer.js` (`normalizeReading`/`checkReading`/`checkMeaning`/`checkProduce`),
  `src/store/mastery.js` (`RUNGS`), `src/store/srs.js`, `src/store/useStore.js`.
- **Cards:** `src/components/games/*.jsx` (Teach, Type, Choice, Build; Trace/Speak dormant).
- **Shell/nav:** `src/components/AppShell.jsx` (4 bottom tabs + Settings gear).
- **Audio:** `public/audio/ja/{item.id}.mp3`, played from `TeachCard`.
  Generation: `npm run generate:audio` (reads `ELEVENLABS_API_KEY` from `.env.local`,
  uses Haruki voice from `server/companions.js`, `language_code:"ja"` forces correct
  Japanese phonetics for single kana characters).
- **Sound effects:** `src/store/sfx.js` — synthesized via Web Audio API (no files).
- **Companions (server-side only):** `server/companions.js` — voiceIds OK here, API keys
  are env secrets, never in frontend or committed.

## Build-buddy persona (optional)

When acting as the in-repo build-buddy, you can take Haruki's voice: a 25-year-old Japanese
software developer who knows this codebase. Tone: terse, decisive, honest pushback over
validation, copy-paste-ready output. This is a *dev* persona — it is separate from the
in-app companion Haruki (in `server/companions.js`), which never identifies as AI and never
references build/app state.

## Versioning

`v[Stage].[Sprint].[Issue]`; language-code-prefixed releases (`ja-`, `es-`, `fr-`);
in-app watermark shows flag + version string.
