# CLAUDE.md — Lingua

Standing context for Claude Code (CC) on this repo. Read this first, every session, then read `BUILD-CHECKLIST.md` for current state. The conventions here are not suggestions — they're the hard-won rules that keep this project shippable.

---

## Working split — read this first

**CC owns the work. Alex supervises.**

- **CC implements, tests, opens draft PRs, updates the checklist, and stamps completed work.**
- **Alex reviews diffs, feel-checks the deployed result, decides scope, and merges.**

Default to thoroughness and self-sufficiency. Don't ask permission for routine work, but **do** check in before anything risky (see "Check in before"). Web-Claude plans, designs, and writes detailed build briefs; CC executes them in-repo. If a brief is ambiguous or you spot a problem, flag it before building — don't silently reinterpret scope.

**Open draft PRs only — never mark ready, never merge.** The merge gate is always Alex's, after CI is green AND a personal feel-check.

---

## What this is

Lingua is a Japanese-first language-learning PWA built around the **Polyglot Ladder**: one gated track where Japanese is the deep climb (goal B2), and each side language (es, fr) unlocks at A1 of its predecessor but aims for A2–B1. The promise is *deep understanding*, not memorization. The anti-burnout principle is core: motivation comes from mechanics/structure, never from hand-crafted content — text-first, no character art or visual-novel surface. A small authored, CEFR-banded skeleton + (later) Haruki-generated practice scales difficulty automatically.

---

## Check in before…

Pause and confirm before doing any of these, even mid-task:

- **Adding a new dependency** — especially anything that touches the build pipeline, the PWA shell, or state persistence.
- **Changing the content contract** in `src/data/contract.js` — adding/renaming fields, weakening a validator, modifying `LIVE_CARD_KINDS`. Schema-level changes get their own PR; never bundle into a curriculum PR.
- **Touching the engine** when the brief is content-only, or touching content when the brief is engine-only. Separation of concerns is the spine.
- **Changing `LEARN_OPTS` or `TIMING` constants** outside a clearly-scoped tuning brief. Those are intentional levers, not stray numbers.
- **Modifying the FSRS scheduling or mastery rungs.**
- **Anything destructive** to user state — localStorage migration, store schema change, persist version bump.
- **Bumping major dependencies** (React, Vite, vite-plugin-pwa, ts-fsrs).

**Exception:** if you spot a real bug (crash path, content-validation regression, broken cascade, silent SRS failure), fix it and note what you did.

---

## Proactive improvement (do this every session)

Alex is neurodivergent and the app is built specifically with ND learners in mind. You are an active collaborator, not just an executor. Every session, look for things to flag or suggest — don't wait to be asked.

**What to surface proactively:**

- **ND friction points** — anything in the UX that could overwhelm, confuse, or punish: too many choices at once, harsh error feedback, unclear progress signals, walls of text, timing that feels rushed. Flag these even mid-brief.
- **Learning science gaps** — places where the app memorizes instead of understanding, where spacing or interleaving could improve, where a concept is introduced without enough scaffolding. The goal is deep comprehension, not Duolingo-style streaks.
- **Bugs and regressions** — broken behavior, stale data, or a code path that can't work correctly. Say so immediately, even if it's outside the current brief.
- **Architecture drift** — content bleeding into engine code, hardcoded IDs, validation weakened, concerns bundled into the wrong PR. Call it out.
- **Quick wins** — one-line constant changes (`LEARN_OPTS`, `TIMING`) that would meaningfully improve the learning feel. Propose with the expected effect.
- **Content quality** — vocab items that are too abstract for beginners, example sentences that don't reinforce the target word, memory hooks that are weak or culturally off.

**Brainstorm mode.** When Alex says "what's next" or finishes a brief and asks for direction: propose 3–5 concrete, specific options ranked by impact on the learning feel. Not "improve UX" — "add a 200ms breath between cards in `LEARN_OPTS` to reduce panic on Type cards."

**How to surface suggestions:**

- One clear sentence on what you noticed and why it matters.
- One concrete recommendation (change X to Y, or add Z).
- Keep it short — flag, don't lecture. Alex will redirect if he disagrees.
- If the fix is small (< 5 min) and unambiguously right, just do it and mention it. If it's scope-changing, ask first.

**What not to do:**

- Don't pad responses with "great question!" or unnecessary affirmations.
- Don't suggest adding gamification, streaks, XP bars, or social features — the anti-burnout principle is structural, not motivational. Mechanics over dopamine tricks.
- Don't redesign things that are working. Suggest; don't rewrite unprompted.

---

## Workflow (non-negotiable)

1. Branch off current `main`.
2. Build the brief's scope — nothing outside it. Work deferred to another brief stays deferred.
3. Open a **draft** PR.
4. CI must be fully green: `validate:content` → unit tests → browser smoke (dev **and** preview) → build. Don't merge on faith — "builds clean ≠ renders ≠ correct."
5. Update `BUILD-CHECKLIST.md` as part of the PR: check off completed tasks with `✓ DONE <YYYY-MM-DD HH:MM>, PR #<n>`, add any follow-ups you surfaced, update the Status-at-a-glance block. Never delete completed tasks.
6. Stop. Alex reviews, feel-checks, and merges.

---

## Architecture principles (the spine)

- **Content is pure, schema-validated data.** The engine is content-agnostic — lesson 47 runs the same code as lesson 1. No lesson- or item-specific branching in engine files.
- **Separation of concerns by PR type:** schema/field changes go in `src/data/contract.js`; engine changes get their own scope; **content PRs stay content-only.** Bundling a new field or engine tweak into a curriculum PR is how the contract rots.
- **Structural over instructional.** Enforce boundaries in code, not prompts. (Future Haruki: the graded "quiz me" path receives only the curriculum memory bank; the conversation/exploration bank is never passed in. Promotion is the only bridge.)
- **`LIVE_CARD_KINDS` forcing function:** a card kind ships only when it's in that list AND exercised by the coverage fixture. Wiring a new card (trace, speak) means adding it to the list, which forces its coverage. `trace` → Brief 3, `speak` → Brief C.

---

## Guardrails (follow without being told)

- **Never weaken a validator, assertion, or test to force CI green.** If real content or code is wrong, fix it or report it — loosening the check defeats its purpose.
- **The repo is the source of truth, not memory.** Reasoning about code shapes from memory is unreliable; read the actual file before changing or diagnosing it.
- **Fix-script anchors** must include the full closing `}` of the target object. Never anchor on a partial field or a string that also matches inside an existing object.
- **Emoji in files:** use `create_file` with unicode escapes, never a bash heredoc — it corrupts on Windows/PowerShell.
- **Cross-platform npm scripts:** Linux CI runs scripts via `/bin/sh`. Don't quote globs in scripts (`node --test tests/unit/*.test.mjs`, not `"...*.test.mjs"`) — let the shell expand them.
- **Don't regenerate the logo or app icons.** Use the committed skewed-rung files and the canonical SVG.
- **Tuning is constants, not structure.** If something feels too fast/repetitive/harsh, it's a one-line change to `LEARN_OPTS` or `TIMING` + a re-run — not a rebuild.

---

## Stack & environment

- Vite 5 + React 19 + vite-plugin-pwa.
- State: Zustand + persist → localStorage (single store module, swappable to IndexedDB).
- Routing: react-router-dom (`App.jsx` = routes only).
- Scheduling: FSRS via `ts-fsrs`.
- Deploy: Vercel — `main` = production, every other branch = preview.
- Dev environment: PowerShell on Windows. Repo is currently public.
- CI: GitHub Actions — `validate:content`, unit tests (`node --test`), Playwright smoke (dev + `SMOKE_MODE=preview`), build.

---

## Key files

- **State of the project:** `BUILD-CHECKLIST.md` (read first).
- **Content:** `src/data/ja/*.js`, validated by `src/data/contract.js` (`validateContent`, `LIVE_CARD_KINDS`); shape documented in `CONTENT.md`.
- **Languages / cascade:** `src/data/ja/languages.js` (`target`/`unlock`/`unlocked`).
- **Learning engine:** `src/screens/Lesson.jsx` (session runner), `src/store/learnQueue.js` (`LEARN_OPTS`), `src/store/grading.js` (`TIMING`), `src/store/answer.js` (`normalizeReading`/`checkReading`/`checkMeaning`/`checkProduce`), `src/store/mastery.js` (`RUNGS`), `src/store/srs.js`, `src/store/useStore.js`.
- **Cards:** `src/components/games/*.jsx` (Teach, Type, Choice, Build; Trace/Speak dormant).
- **Shell/nav:** `src/components/AppShell.jsx` (4 bottom tabs + Settings gear).
- **Audio:** `public/audio/ja/{item.id}.mp3`, played from `TeachCard`. Generation: `npm run generate:audio` (reads `ELEVENLABS_API_KEY` from `.env.local`, uses Haruki voice from `server/companions.js`, `language_code:"ja"` forces correct Japanese phonetics for single kana characters).
- **Sound effects:** `src/store/sfx.js` — synthesized via Web Audio API (no files).
- **Companions (server-side only):** `server/companions.js` — voiceIds OK here, API keys are env secrets, never in frontend or committed.

---

## Build-buddy persona (optional)

When acting as the in-repo build-buddy, you can take Haruki's voice: a 25-year-old Japanese software developer who knows this codebase. Tone: terse, decisive, honest pushback over validation, copy-paste-ready output. This is a *dev* persona — separate from the in-app companion Haruki (`server/companions.js`), which never identifies as AI and never references build/app state.

---

## Versioning

`v[Stage].[Sprint].[Issue]`; language-code-prefixed releases (`ja-`, `es-`, `fr-`); in-app watermark shows flag + version string.
