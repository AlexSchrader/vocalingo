# Lingua — Build Checklist & Progress Tracker

**Purpose:** single source of truth for project state. If Alex steps away for a while, opening this cold should answer "what's done, what's next, where did I leave off" in under a minute. Lives at repo root (`BUILD-CHECKLIST.md`); **CC (Claude Code) commits updates** to it as part of every PR.

---

## How to use this doc — READ FIRST

**If you're Alex, resuming after a break:** read **Status at a glance** below, then jump to the first `[ ]` (or `[!]`) item under the current phase. That's your next action. The checked history above it is what's already shipped. Check **Dead ends & gotchas** before retrying anything that "should work" — it may already have failed for a known reason.

**If you're CC, maintaining this doc — marking protocol (follow verbatim):**
This file is updated as part of the PR that completes work. When a task is finished (PR merged to `main`), do ALL of:

1. Change `[ ]` to `[x]`.
2. Append ` — DONE <YYYY-MM-DD HH:MM local>, PR #<n>`.
   Example: `- [x] Add validateContent — DONE 2026-06-21 15:40, PR #11 (CC)`
3. If the work surfaced follow-ups, add them as new `[ ]` items under the correct phase, with a one-line note on *why*.
4. Update the **Status at a glance** block (current phase, last updated, next action).
5. **Never delete** a completed task. The checked list *is* the project memory. Tasks stay in their phase section, checked in place — don't move them to a "done pile."
6. Mark work that's actively being built (PR open, not merged) as `[~]` with ` — STARTED <date>`. Flip to `[x]` only on merge.
7. Use `[!] — BLOCKED ON: <thing>` for anything stuck on a dependency (e.g. Phase 6 is blocked on the Phase 5 backend), so it's never mistaken for a plain todo.
8. When you discover a gotcha that wasn't obvious from the docs — a React 19 / Zustand ordering trap, a CI-vs-local difference, a content-contract subtlety — append it to **Dead ends & gotchas** so the next session doesn't re-walk it. Bugs fixed *within* a feature PR (like the `useSyncExternalStore` ordering fix in PR #11) should also be noted on the parent item so the history is preserved.

---

## Status at a glance

- **Current phase:** Phase 4 (tracing) in flight on `feat/trace-card`. **Curriculum thread is active** — Unit 2 shipped (PR #20, Alex-reviewed); Unit 3 (dakuten rows) is next.
- **In flight:** Phase 4 trace card (`feat/trace-card`, PR #19) — Web Speech API, 46-kana stroke data, ready for feel-check + merge.
- **⚡️ Single next action (Alex):** feel-check `feat/trace-card` → merge → then Unit 3 curriculum.
- **Phase numbers = dependency map, not a queue.** Curriculum runs as the default thread between every feature sprint. Onboarding (Phase 5) and audio (Phase 3) slot in when curriculum has momentum, not before.
- **Last updated:** 2026-06-23

---

## Legend

- `[ ]` todo
- `[~]` in progress (PR open) — stamped ` — STARTED <date>`
- `[x]` done — stamped ` — DONE <YYYY-MM-DD HH:MM>, PR #<n>`
- `[!]` blocked (note what it's blocked on)
- `(pre-tracker)` = completed before this tracker existed; no reliable timestamp
- **Owner tags:** `(Alex)` = phone `?dev` feel-checks, decisions, merges · `(CC)` = repo edits, commits, PRs · `(Claude)` = planning, briefs, content authoring

---

## Phase 0 — Engine foundation *(complete)*

The learning engine: scheduling, active recall, in-session learning, self-paced loop, app shell. This is the "not flashcards" core, and it's live on `main`.

- [x] App scaffold — Vite + React 19 + PWA, routing, Zustand+persist store — DONE PR #1 (pre-tracker) (CC)
- [x] FSRS scheduler via ts-fsrs — DONE PR #2 (pre-tracker) (CC)
- [x] Active recall — app-judged cards, computed FSRS grade from correctness+speed, no self-grading — DONE PR #5 (pre-tracker) (CC)
- [x] Settings screen — DONE PR #6 (pre-tracker) (CC)
- [x] Companions config — server-side (`server/companions.js`), Haruki split (in-app persona only) — DONE PR #7 (pre-tracker) (CC/Claude)
- [x] Brief A.1 — in-session learning steps (teach → recognition → recall → graduate) + self-paced loop, no daily cap — DONE PR #8 (pre-tracker) (CC)
- [x] Settings → gear icon (top-right of header), bottom nav back to 4 tabs (Today/Ladder/Haruki/Stats) — DONE PR #9 (2026-06-21) (CC)
- [x] Today zero-reviews UX — review step resolves to "done" when nothing due, step rows tappable when active, zero-reviews-due smoke test — DONE PR #10 (2026-06-21) (CC)

---

## Phase 1 — Content contract + validator *(complete)*

The structural lock: content becomes pure schema-validated data; bad content can't ship. Must land before mass curriculum. Brief: `BUILD-BRIEF-content-contract.md`.

- [x] `src/data/contract.js` — `validateContent()` (11 hard rules) + `LIVE_CARD_KINDS`; `scripts/validate-content.mjs` CLI; `CONTENT.md` schema reference — DONE 2026-06-21, PR #11 (CC)
- [x] Hard validation rules — global id uniqueness, id patterns, per-type field rules, lesson/unit numbering, kana-no-duplicates invariant, reading normalizability (via `normalizeReading`), item key allowlist — DONE 2026-06-21, PR #11 (CC)
- [x] Validation warning — distractor sparseness (≥3 same-type peers needed for 4-option choice card) — DONE 2026-06-21, PR #11 (CC)
- [x] Validation warning — empty `accept[]` on multi-word vocab (typed-meaning check rejects valid paraphrases; advisory only) — DONE 2026-06-21, PR #11 (CC)
- [x] Add `cefr` field to every existing lesson — `ja-u1l1` is the only playable lesson; `cefr: "A1"` added — DONE 2026-06-21, PR #11 (CC)
- [x] Validate existing `languages.js` shape (`target`/`unlock`/`unlocked`/`id`) — checked in `validateContent`; no migration needed — DONE 2026-06-21, PR #11 (CC)
- [x] `inventoryFor({lang, maxLevel, maxRung})` selector — on-topic curriculum filter for future Haruki — DONE 2026-06-21, PR #13 (CC)
- [x] Card-kind coverage matrix — `kindFixtureState` fixture in smoke tests exercises every `LIVE_CARD_KINDS` entry; runner asserts with `assertLiveKind`; `test.skip` stubs for `trace`/`speak` — DONE 2026-06-21, PR #11 (CC)
- [x] CI wiring — `validate:content` first, then `test:unit` (30 tests, `node --test` glob), broken-fixture coverage in `contract.test.mjs` — DONE 2026-06-21, PR #11 (CC)
- [x] App fix included in PR #11: React 19 / Zustand `useSyncExternalStore` ordering bug in `Lesson.jsx` (`setLearn` before `graduateItem`) — root cause of lesson sessions getting stuck at `type:produce` — DONE 2026-06-21, PR #11 (CC) — *see gotchas*
- [ ] Alex `?dev` phone feel-check of A.1 reinforcement rhythm + timing fairness (can run in parallel with Phase 3; report vibe → tune constants if off) (Alex)

---

## Phase 2 — Curriculum *(Unit 1 + 2 complete — ongoing)*

The make-or-break thread. Units 1–2 (46 base hiragana, あ-ん) shipped and Alex-reviewed. Dakuten/handakuten rows, vocab expansion, and eventually kanji live here. **This phase never fully closes** — curriculum authoring is the default work between every feature sprint.

- [x] Author Unit 1 lessons 2–5 as contract-valid data — か/さ/た/な rows (5 kana + 6 vocab each, 44 new items); all validate:content clean — DONE 2026-06-21, PR #13 (Claude/CC)
- [x] `cefr: "A1"` band on every new lesson — all 4 new lessons tagged — DONE 2026-06-21, PR #13 (CC)
- [x] Fill `accept[]` synonym arrays — added to all new vocab items (and retro-fitted to lesson 1 vocab) to reduce typed-answer friction — DONE 2026-06-21, PR #13 (Claude/CC)
- [x] Kana memory hooks — `hint` field on every kana item; displayed on TeachCard as "Memory hook: …" in soft italic box — DONE 2026-06-21, PR #13 (Claude/CC) — neurodivergent-friendly: visual-association mnemonics for each character
- [x] Dynamic lesson progression — Today screen advances `currentLesson` to the first lesson with rung-0 items; no hardcoded lesson 1; shows "Lesson N/5 · ~X min" — DONE 2026-06-21, PR #13 (CC)
- [x] Fix kana learn-step pedagogy — `recallMode()` now returns "meaning" for all items at check2 (kana: show character → type rōmaji); "produce" kana only at rung 3+ in reviews — DONE 2026-06-21, PR #13 (CC) — *see gotchas*
- [x] `inventoryFor({lang, maxLevel, maxRung})` selector — on-topic curriculum filter for Haruki; pure store selector, CEFR+rung scoped — DONE 2026-06-21, PR #13 (CC)
- [x] Validation warning — empty `accept[]` on multi-word vocab — DONE 2026-06-21, PR #11 (CC)
- [x] Generalize `checkCascade` — now reads `unlock: {lang, level}` from LANGUAGES data; handles ja→es AND es→fr; no hardcoding — DONE 2026-06-21, PR #13 (CC)
- [x] Define the "A1 complete" predicate — `isLevelComplete(langId, "A1", items)` in useStore.js; fires from `completeLesson` and `rollDailyGoal` — DONE 2026-06-21, PR #13 (CC)
- [x] Fix `es`/`fr` `target` — changed from `"A1"` to `"B1"` (aspirational side-language goal) — DONE 2026-06-21, PR #13 (CC)
- [x] Replace Ladder A1% XP placeholder with real progress math — `a1PercentFor(langId, items)` counts rung≥1 items / total A1 items — DONE 2026-06-21, PR #13 (CC)
- [x] Unit 2 — よろしく — は/ひ/ふ/へ/ほ, ま/み/む/め/も, や/ゆ/よ, ら/り/る/れ/ろ, わ・を・ん; 5 lessons, 21 kana + 28 vocab; hiragana set complete; Alex-reviewed line-by-line — DONE 2026-06-23, PR #20 (Claude/CC)
- [ ] Alex `?dev` feel-check of 5-lesson progression rhythm (report any timing/pacing that feels off → tune constants) (Alex)
- [ ] Unit 3 — dakuten/handakuten rows (が/ざ/だ/ば/ぱ + combinations); completes "full hiragana + voiced" — brief to be authored (Claude/CC)
- [ ] Unit 4+ — vocab expansion, particles, basic grammar; scope TBD after Unit 3 ships (Claude/CC)
- [ ] JLPT dual-tagging — add a `jlpt` tag (N5/N4/…) alongside `cefr` on Japanese-track items; align vocab to community-reconstructed N5 list as units grow. CEFR stays the engine's universal spine (cross-language); JLPT is an additional Japanese-only recognition tag. Low-cost now, expensive to retrofit — fold in as units are authored. (CC)
- [ ] を reading edge — if playtest shows learners typing "o" (を is phonetically /o/ in modern Japanese), fold wo↔o tolerance into `checkReading`. (CC)
- [ ] Non-blocking content polish from Unit 2 review: ja-u2l2-mono example (これはなんですか preferred over このものはなんですか); ja-u2l4-roku example (ろくじです introduces time-telling ahead of where it's taught). Fix in a content-only PR. (Claude/CC)

---

## Phase 3 — Brief B — Audio out (no backend)

Web Speech API (window.speechSynthesis, lang:"ja-JP") replaces ElevenLabs MP3 pipeline. Ships with Phase 4.

- [~] Switch TeachCard to Web Speech API — no files, no staleness, autoplay on reveal, replay button — STARTED 2026-06-22, PR #19 (CC)

---

## Phase 4 — Brief 3 — KanjiVG tracing

Real stroke-order tracing; completes the "produce/write" half of the mastery ladder.

- [~] KanjiVG stroke data (`src/data/kanjivg.js`) — 46-kana SVG paths from KanjiVG (CC BY-SA 3.0); fetch script unit-agnostic — STARTED 2026-06-22, PR #19 (CC)
- [~] TraceCard component — guided mode (animation → trace, check2 in learn phase) + free mode (draw from memory, rung 3+ reviews) — STARTED 2026-06-22, PR #19 (CC)
- [~] Wire TraceCard into Lesson runner; route rung-appropriate kana to trace instead of typed card — STARTED 2026-06-22, PR #19 (CC)
- [~] Add `trace` to `LIVE_CARD_KINDS`, un-skip coverage stub, add fixture coverage — STARTED 2026-06-22, PR #19 (CC)
- [~] Stroke-data validator in contract.js — hard-errors if a kana item has no kanjivg entry; covers all 46 base hiragana — STARTED 2026-06-22, PR #19 (CC)

---

## Phase 5 — Onboarding + User Profile

Front-door UX and the user profile data shape. Frontend-only — no backend required. Spec: `ONBOARDING-SPEC.md`. **Do not start until Phase 4 closes and Unit 3 curriculum is moving** — a front door to one room isn't worth much yet.

- [!] Convert `ONBOARDING-SPEC.md` to a full build brief — BLOCKED ON: Phase 4 complete (Claude)
- [!] Upfront onboarding flow (~4 taps): language pick (one active, others locked), display name, why (travel/heritage/work/fun), optional reminder time — BLOCKED ON: Phase 4 complete (CC)
- [!] User profile in Zustand persist store (`activeLanguage`, `displayName`, `reason`, `reminderTime`; sync-ready shape) — BLOCKED ON: Phase 4 complete (CC)
- [!] One-language lock enforced in code: `activeLanguage` set once; others stay locked via existing `unlock: {lang, level}` cascade until A1 — BLOCKED ON: Phase 4 complete (CC)
- [!] Lazy-collected fields: `location` (asked before location-grammar lesson), `selfReference` (asked before first gendered-agreement lesson) — BLOCKED ON: Phase 4 complete (CC)
- [!] Content-contract extension: profile templating tokens (`{displayName}`, `{location.city}`) + `requires: []` lesson field + validator (token references known field + non-null fallback exists) — BLOCKED ON: Phase 4 complete (CC)
- [!] Account system (display name + email + auth + cross-device sync) — BLOCKED ON: Phase 6 (backend foundation) (CC)

---

## Phase 6 — Brief E — Backend foundation

Serverless infra. Required for graded speaking and real Haruki — both core, both staged last after the no-backend wins. API keys are env secrets, never frontend.

- [ ] Serverless setup (Vercel functions / edge) (CC)
- [ ] `/api/speak.js` edge function for per-character TTS (CC)
- [ ] Secret/env handling for ElevenLabs + Claude keys (CC)

---

## Phase 7 — Brief C — Whisper speech grading

- [!] Serverless Whisper endpoint for speech accuracy — BLOCKED ON: Phase 6 (backend foundation) (CC)
- [!] Wire `SpeakCard` into the runner (exists, unrouted) — BLOCKED ON: Phase 6 (CC)
- [!] Add `speak` to `LIVE_CARD_KINDS`, un-skip its coverage stub, add fixture coverage — BLOCKED ON: Phase 6 (CC)
- [!] SPOKEN rung climbs via graded speaking — BLOCKED ON: Phase 6 (CC)

---

## Phase 8 — Brief D — Real Haruki

Claude brain + ElevenLabs voice, multi-tutor from `companions.js`. The two-bank memory architecture from the design sessions.

- [!] Write the Haruki agent spec doc (persona + memory architecture + tool boundaries + quiz-vs-chat routing) — BLOCKED ON: Phase 6 (Claude)
- [!] Curriculum memory bank (on-topic) = `inventoryFor` output; the ONLY thing the graded "quiz me" path reads — BLOCKED ON: Phase 6 (CC)
- [!] Conversation memory bank (off-topic) = free-text chat context; never passed to graded quizzes — BLOCKED ON: Phase 6 (CC)
- [!] Structural separation enforced in CODE (quiz path receives only the curriculum bank), not just prompt instructions — BLOCKED ON: Phase 6 (CC)
- [!] Default-scoped / override-explicit (vague "quiz me" → curriculum only; explicit ask opens off-topic bank) — BLOCKED ON: Phase 6 (CC)
- [!] Promotion bridge — explicit action moves an explored word into the formal SRS track; nothing leaks automatically — BLOCKED ON: Phase 6 (CC)
- [!] Multi-tutor live from day 1 (Haruki/ja, Nacho/es, Mathieu/fr) using `companions.js` — BLOCKED ON: Phase 6 (CC)
- [!] Generated cards pass the same `validateContent` item checks before reaching the learner — BLOCKED ON: Phase 6 (CC)

---

## Phase 9 — Later / optional

- [ ] Leaderboards (CC)
- [ ] Commitment mode (CC)
- [ ] Money stakes (optional, OFF by default) (CC)
- [ ] Additional language content beyond ja/es/fr scaffolding (Claude/CC)

---

## Phase 10 — App Store submission

- [ ] **HARD GATE — Native-speaker content review:** a qualified native Japanese speaker reviews ALL curriculum content before any "professional / certified / JLPT-aligned" marketing claim or App Store submission. AI-authored content is not course-grade until reviewed. This gate must be cleared before listing in the App Store. (Alex)

---

## Continuous (ongoing, not a phase)

- [ ] Tuning from playtests — `LEARN_OPTS` (learnQueue.js), `TIMING` (grading.js), FSRS params. Report a vibe → one-line constant change. (Alex/CC)
- [ ] Per-phase `?dev` feel-checks before merging anything that changes the learning feel. (Alex)
- [ ] `accept[]` synonym arrays — fill as typed-answer gaps surface. (Claude/CC)

---

## Parking lot — loose ends to confirm / decide

- [ ] Verify the app-icon fix landed (committed skewed-rung icons vs. CC's drifted redraw; canonical logo SVG pinned). Status unconfirmed.
- [ ] GitHub setting: enable auto-delete-head-branches (sandbox git proxy 403 blocks remote branch deletion).
- [ ] Move repo off OneDrive to `C:\dev` eventually (OneDrive causes node flakiness).
- [ ] Repo is currently PUBLIC. Decide whether to keep it public (lets web-Claude read code for precise briefs) or re-private after this work.

---

## Dead ends & gotchas (don't re-walk these)

- **React 19 + Zustand `useSyncExternalStore` ordering** — in `Lesson.jsx`, calling `graduateItem` before `setLearn` caused sessions to get stuck at `type:produce` because the store snapshot read during render was stale. Fix: `setLearn` must run *before* `graduateItem`. Burned real diagnosis time in PR #11.
- **Kana learn-step pedagogy** — `recallMode()` was returning "produce" for kana too early (asking "type the kana shown" before the learner had it memorized). Correct rule: at check2, all items use "meaning" mode (show kana → type rōmaji). "Produce" kana only kicks in at rung 3+ in reviews. Fixed in PR #13.
- **Content/engine separation is non-negotiable.** Bundling a new field or engine tweak into a curriculum PR is how the contract rots. Schema changes go in `src/data/contract.js`; engine changes get their own PR; content PRs stay content-only.
- **Never weaken a validator, assertion, or test to force CI green.** If real content or code is wrong, fix it — loosening the check defeats its purpose.
- **`LIVE_CARD_KINDS` is the forcing function.** A card kind ships only when it's in that list AND exercised by the coverage fixture. Adding `trace` or `speak` requires both — the smoke test will fail loud if one is missing.
- **Emoji in files corrupt on Windows/PowerShell heredocs** — use `create_file` with unicode escapes (`\u{2728}` etc.) instead of `cat <<EOF` containing raw emoji.
- **Cross-platform npm scripts: don't quote globs.** Linux CI runs scripts via `/bin/sh`. `node --test "tests/unit/*.test.mjs"` passes locally on Windows (Node expands the wildcard itself) and fails in CI (the shell doesn't expand quoted globs). Use unquoted: `node --test tests/unit/*.test.mjs`.
- **OneDrive causes intermittent node flakiness** in the working directory. Builds and tests pass on Vercel and fail locally for no apparent reason. Long-term move the repo to `C:\dev`; short-term, retry locally before assuming a real failure.
- **Sandbox git proxy returns 403 on remote branch deletion** — that's why the GitHub auto-delete-head-branches setting matters. Until that's enabled, dead branches pile up on the remote.
- **Don't regenerate the logo or app icons.** Use the committed skewed-rung files and the canonical SVG; CC-redrawn icons have drifted before. Treat the icon set as canonical content, not regeneration fodder.
- **The repo is the source of truth, not memory.** Reasoning about code shapes from memory is unreliable; read the actual file before changing or diagnosing it. (This rule has bitten more than once.)
- **Fix-script anchors must include the full closing `}`** of the target object. Anchoring on a partial field or a string that also appears mid-object will embed the fix in the wrong place.
- **Curriculum correctness is not schema-correctness.** `validate:content` catches structure, not natural Japanese. Verb collocations, particle usage, register, and concept-sequencing require an authoring eye. Every new unit needs Alex's line-by-line review before merge — not just CI green.
- **ElevenLabs MP3 pipeline abandoned** — stale files caused pronunciation regressions (PR #18 fixed katakana, but cached MP3s pre-dated the fix and played wrong). Replaced with `window.speechSynthesis` (lang:"ja-JP") in PR #19. No audio files needed; no regeneration step.
