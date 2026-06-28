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
9. **Log everything, even concepts (Alex's standing rule, 2026-06-25).** Anything we add, change, or even just discuss as a future idea goes in this file — if it's not actionable now, park it in **Future / come back later** so nothing is lost. Don't rely on memory or chat history; the checklist is the record.

---

## Status at a glance

- **Shipped to `main`:** Phase 4 (trace card, 46-kana) + Unit 2 — PRs #19/#20 (2026-06-23). Phase 4.5 session structure (review/lesson split, teach-order, trace polish) — PR #21 merged 2026-06-24. Full hiragana あ-ん is live.
- **Shipped to `main` (2026-06-25):** Phase 3 real audio (PR #22) · Stats SEEN→NEW (PR #23) · PWA auto-update fix (PR #25, no stale builds after deploy) · **Ladder full-climb view (PR #24)** + bigger adaptive mascot & full-width progress (PR #27) · **Today warm-up/polish (PR #26)** — greeting, stat icons, adaptive mascot banner, fixed Up Next, hiragana strip.
- **Haruki LIVE (Phase 6.5 shipped, PR #29):** the Haruki tab is a real text+voice tutor — ElevenLabs Conversational Agent (Claude Haiku 4.5 + native-JP voice), serverless signed-URL auth (key server-side), unified chat. Also: desktop centered-column layout (PR #28).
- **Unit 4 (カタカナ) in review (PR #TBD, draft):** vowels + k/s/t/n rows — 25 katakana + 30 loanword vocab, 5 lessons. **CC-authored fresh in-repo** off the Curriculum Authoring Guide (Alex's file was unrecoverable through chat — mojibake stripped the bytes every transfer; base64 corrupted too; reconstruction is forbidden, so per Alex's call CC authored it clean directly in UTF-8). KanjiVG stroke data added for all 25 katakana. validate (4 units, 0 errors/warnings), 36 unit tests, smoke (dev+preview), build — all green. No audio yet. Claude reviews against the authored original.
- **Units 5–10 (A1 push) in review (draft PR, stacked on Unit 4):** U5–6 finish the katakana script (h/m/y/r/w + ン, then dakuten/handakuten g/z/d/b/p — KanjiVG for all 46 new katakana); U7–10 are the first A1 thematic vocab units (numbers/time, family, food + ～ます verbs, town/places). Every unit `stage`-tagged. validate 10 units / 0 errors / 0 warnings, 36 unit tests, build — green. Awaiting Alex line-by-line review + dedupe call. *(Pairs with the stage-sectioning PR #35; both touch `roadmap.js` → small merge resolve.)*
- **Queued:** speech grading (Brief C, design doc ready); capture agent voice settings → tune lesson clips; mastery-feel tuning; mascot costumes; mini-games (Future).
- **⚡️ Next build thread:** **Speech grading (Brief C / Phase 7)** — Alex's call: say-the-word → detect + grade → climb the SPOKEN rung. Design doc written (`BUILD-BRIEF-speech-grading.md`); decisions to lock before code. *Curriculum status:* Unit 3 shipped + corrected to Alex's real bytes (PR #30 + #31). Unit 4 (カタカナ) authored fresh in-repo, in review (see above). Next curriculum = Unit 5 (katakana part 2).
- **Phase numbers = dependency map, not a queue.** Curriculum runs as the default thread between every feature sprint. Onboarding (Phase 5), the Ladder screen (4.6), and the Haruki agent (6.5) slot in as their dependencies clear.
- **Shipped to `main` (2026-06-27):** **Dev Mode** — hidden playtest panel in Settings (unlock `L071201`), launches any unit/lesson bypassing gating in a fully-isolated sandbox run (byte-identical real state before/after). PR #32. See Phase 4.7. Remaining: Alex device feel-check.
- **Last updated:** 2026-06-27

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
- [x] Unit 3 — まいにち — dakuten/handakuten rows: が/ざ/だ/ば (dakuten) + ぱ (handakuten); 5 lessons, 25 voiced kana + 30 vocab. Stroke data added for all 25 (KanjiVG); eleven_v3 audio generated; validate:content clean. **Alex authored; the #30 upload arrived mojibake-garbled so CC reconstructed the Japanese — then Alex re-sent the real file gzip+base64 and PR #31 swapped in his exact bytes, fixing 3 drift items (このひと→あのひと "that person" error; さんぽをします; KEE/GEE hint).** — DONE 2026-06-27, PR #30 (initial) + PR #31 (real bytes) (Alex/CC)
- [ ] Unit 3 audio decision — `eleven_v3` clips for Unit 3 are on `main` (from #30), but Alex's note said "no audio yet" for these. Clips are the *good* pipeline (same as Units 1–2) and fronts didn't change, so they still match. **Keep (rec) or remove?** (Alex)
- [x] Unit 4 — カタカナ part 1 (vowels + k/s/t/n rows): 5 lessons, 25 katakana (ア-ノ) + 30 loanword vocab. Each kana hint anchors the glyph to its hiragana twin + sound + shape cue; ー long-vowel mark introduced in L1; シ/ツ disambiguated across L3/L4. KanjiVG stroke data added for all 25 (codepoints 30a2+). validate:content clean (4 units, 0 errors/0 warnings). No audio yet. **CC-authored fresh in-repo off the Curriculum Authoring Guide** — Alex's authored file never survived chat transfer (mojibake stripped UTF-8 continuation bytes every send; base64 also corrupted; reconstruction-from-romaji is forbidden by the guide), so on Alex's call CC authored a clean equivalent directly in UTF-8 for Claude to review against the original. — DONE 2026-06-27, PR #TBD (CC)
- [ ] **Unit 4 review (Claude):** check CC's katakana against the authored original — spellings (コーヒー/タクシー long vowels), readings (macrons), example naturalness, hints. Flag drift; Alex merges. (Claude/Alex)
- [~] **Units 5–10 — A1 push** — STARTED 2026-06-27, draft PR (CC, off `feat/unit-4-katakana`). Six units authored in-repo; Alex line-by-line review then merge. `validate:content` 10 units / 0 errors / 0 warnings, 36 unit tests, build — green.
  - [~] **Unit 5 — カタカナ 2** (`stage: pre-a1`): h/m/y/r/w rows + ン, 21 katakana + 33 loanword vocab, 5 lessons. ヘ flagged as identical to hiragana へ; ン disambiguated from ソ/シ. KanjiVG added for all 21. (CC)
  - [~] **Unit 6 — カタカナ゛゜** (`stage: pre-a1`): katakana dakuten/handakuten — g/z/d/b/p rows, 25 voiced katakana + 33 loanword vocab, 5 lessons. Reuses the Unit-3 ゛/゜ rule on katakana shapes; ヂ/ヅ taught as rare. KanjiVG added for all 25. **Katakana script now complete.** (CC)
  - [~] **Unit 7 — かず・じかん** (`stage: a1`): numbers 0–10,000, telling time, parts of the day. First vocab-only thematic unit. (CC)
  - [~] **Unit 8 — かぞく** (`stage: a1`): family + people; teaches the humble (ちち) vs honorific (おとうさん) split via distinct meanings. (CC)
  - [~] **Unit 9 — たべもの・まいにち** (`stage: a1`): food + the core ～ます verbs (たべます/いきます…) as learnable vocab. (CC)
  - [~] **Unit 10 — まち・ばしょ** (`stage: a1`): places in town, parts of a home, position words, first describing adjectives. (CC)
  - Design notes (CC authored the 6–10 progression off CLAUDE.md, no external guide in-repo): examples reuse ONLY Units 1–3 grammar (は/を/が/に/で/の + です/ます + fixed question frames); loanword vocab may use not-yet-taught katakana (whole-word recognition, as Unit 4 already did); no-space example convention kept (matches U1–6).
  - [ ] **Alex review + dedupe pass:** a few thematic words intentionally re-introduce an earlier incidental vocab in its proper systematic home — `ろく` (six, Unit 7) and the number words `に`/`ご` share a front with the kana items. Decide keep-vs-dedupe. Also `kazoku`/`gakkō`/etc. live as examples not new items. (Alex/Claude)
  - [ ] Run `npm run generate:audio` for Units 5–10 once content is locked (new items only). (CC)
- [ ] Unit 5+ — katakana dakuten/combos done (U6); **next: first kanji + particles/grammar** (A1), then A2. Small combos (ャ/ュ/ョ/ッ) still only introduced via hints/vocab, not as their own trace items — fold in if a stroke-trace for them is wanted. (Claude/CC)
- [ ] JLPT dual-tagging — add a `jlpt` tag (N5/N4/…) alongside `cefr` on Japanese-track items; align vocab to community-reconstructed N5 list as units grow. CEFR stays the engine's universal spine (cross-language); JLPT is an additional Japanese-only recognition tag. Low-cost now, expensive to retrofit — fold in as units are authored. (CC)
- [ ] を reading edge — if playtest shows learners typing "o" (を is phonetically /o/ in modern Japanese), fold wo↔o tolerance into `checkReading`. (CC)
- [ ] Non-blocking content polish from Unit 2 review: ja-u2l2-mono example (これはなんですか preferred over このものはなんですか); ja-u2l4-roku example (ろくじです introduces time-telling ahead of where it's taught). Fix in a content-only PR. (Claude/CC)

---

## Phase 3 — Brief B — Audio out (no backend)

Real per-item pronunciation clips (ElevenLabs Haruki voice), with Web Speech as last-resort fallback.

- [x] Switch TeachCard to Web Speech API — autoplay on reveal, replay button — DONE 2026-06-23, PR #19 (CC). Superseded as primary by the clip pipeline below; Web Speech is now only the fallback.
- [x] Real lesson-audio clips — `generate-audio.mjs` rewritten to **`eleven_v3` + bare call** (no language_code, no katakana, no custom voice_settings), iterates all units; 101 clips generated to `public/audio/ja/`. Shared `useItemAudio` hook (TeachCard + TraceCard) plays the mp3, falls back to Web Speech if missing — DONE 2026-06-25, PR #22 (CC). *Key finding: the old robot voice on isolated kana was caused by over-loaded TTS params, NOT a TTS limitation. `eleven_v3` bare call pronounces single kana correctly (Alex confirmed by ear). See gotchas.*
- [ ] Standing step when a unit ships: run `npm run generate:audio` (new items only; `--force` to regenerate all). (CC)
- [ ] Voice naturalness fine-tuning (deferred 2026-06-25) — clips pronounce correctly but **cut off final phonemes / sound clipped & too short**. Try: trailing padding/punctuation on the text (likely fixes cutoff), *mild* voice_settings (~0.5 stability, NOT the old 0.35/style 0.25 that broke kana), v3's recommended settings, or kana-vs-word handling. Regenerate with `--force` + judge by ear. (Alex/CC)

---

## Phase 4 — Brief 3 — KanjiVG tracing

Real stroke-order tracing; completes the "produce/write" half of the mastery ladder.

- [x] KanjiVG stroke data (`src/data/kanjivg.js`) — 46-kana SVG paths from KanjiVG (CC BY-SA 3.0); fetch script unit-agnostic — DONE 2026-06-23, PR #19 (CC)
- [x] TraceCard component — guided mode (animation → trace, check2 in learn phase) + free mode (draw from memory, rung 3+ reviews) — DONE 2026-06-23, PR #19 (CC). *Follow-ups in PR #21: ghost/stroke coordinate alignment, fit-to-viewport + 380px size cap, IS_WEBDRIVER animation skip for CI.*
- [x] Wire TraceCard into Lesson runner; route rung-appropriate kana to trace instead of typed card — DONE 2026-06-23, PR #19 (CC)
- [x] Add `trace` to `LIVE_CARD_KINDS`, un-skip coverage stub, add fixture coverage — DONE 2026-06-23, PR #19 (CC)
- [x] Stroke-data validator in contract.js — hard-errors if a kana item has no kanjivg entry; covers all 46 base hiragana — DONE 2026-06-23, PR #19 (CC)
- [ ] KanjiVG shows *handwritten* stroke forms (さ/き separated, not the connected printed-font shape). Pedagogically correct for stroke order, but may read as "wrong" against the printed font elsewhere in the app. Decide: keep handwritten-correct (rec) or font-match. (Alex)

---

## Phase 4.5 — Session structure (review/lesson split) `[feat/session-structure]`

Reviews and lessons are now **separate sessions**, per Alex's pedagogy call: review is the mandatory daily habit (streak triggers on it), lesson is an optional bonus. First-teach respects authored kana→vocab order so you can't be quizzed on はな before は and な are taught; reviews still interleave (good for retention).

- [x] Split `/review` and `/lesson` into separate routes + runners; Today CTA routes reviews-first, lesson when clear — DONE 2026-06-24, PR #21 (CC)
- [x] Teach-order fix — `buildLearnQueue` front-loads all teaches in authored order (kana before vocab); checks still interleave — DONE 2026-06-24, PR #21 (CC)
- [x] Daily goal — `rollDailyGoal` triggers streak on reviews cleared (lesson optional); fallback to lesson when nothing is due (new learner) — DONE 2026-06-24, PR #21 (CC)
- [x] TraceCard fit-to-viewport + 380px cap — square never overflows (no scroll), glyph stays a readable size — DONE 2026-06-24, PR #21 (CC)
- [x] TraceCard voice + romaji label + Continue gate — header shows the reading + speaker button, kana spoken on mount/completion, no auto-advance (taps Continue) — DONE 2026-06-24, PR #21 (CC)
- [ ] Alex `?dev` feel-check — review-first flow, teach-order (all kana before vocab), trace size on real device; scroll-test each card kind (teach/choice/type/build) at actual screen size (Alex)

---

## Phase 4.6 — Ladder screen: full climb view

Brief: `BUILD-BRIEF-ladder-display.md`. The app "looks blank" — the Ladder shows little beyond the active unit and an XP-placeholder A1%. Make the Ladder present the whole curriculum (done / current / coming units, CEFR rungs, future languages) so progress and the path ahead are visible. **Frontend-only, reads UNITS data, no backend dependency.** Alex expanded scope 2026-06-25: also a **kana section** (see learned characters) + a **per-letter mastery bar**. This screen is the focus for a while before Unit 3.

- [x] Full unit list for active language — DONE/CURRENT/COMING + roadmap "coming soon" rows (`src/data/ja/roadmap.js`, clearly-marked placeholders) — DONE 2026-06-25, PR #24 (CC)
- [x] CEFR level ladder — vertical rungs A1 → target, goal at top, "you're here" marker + progress on current rung; the visual spine — DONE 2026-06-25, PR #24 (CC)
- [x] Future languages — es/fr locked with unlock condition — DONE 2026-06-25, PR #24 (CC)
- [x] Real progress, not XP — A1% from items at rung ≥ 1; per-unit done/total — DONE 2026-06-25, PR #24 (CC)
- [x] Mascot warm-up — `lingua-proud` in the active-language hero — DONE 2026-06-25, PR #24 (CC)
- [x] Kana section — grid of all hiragana, learned ones highlighted, N/46 + mastered count — DONE 2026-06-25, PR #24 (CC)
- [x] Per-letter mastery bar + mastery model — `masteryPct(item)` from FSRS `stability` / `MASTERY_FULL_DAYS` (45); reachable with current cards, grows with successful spaced reviews — DONE 2026-06-25, PR #24 (CC). **Mastery definition still Alex's to confirm/tune by feel** (threshold + stability-vs-reps) — see Future section.
- [x] Kana progress bars appear on introduction — bar shows once a char is rung ≥ 1 (min 6% sliver), grows with mastery; un-introduced kana show no bar — DONE 2026-06-25, PR #24 (CC)
- [x] Contract-driven (no hardcoded unit names), fluid layout, CI green — DONE 2026-06-25, PR #24, Alex feel-checked ("looks good") (CC/Alex)
- [x] Mascot back on the Ladder — `lingua-proud` in the hero. Baked checkerboard stripped from all 8 `lingua-*` PNGs via `scripts/strip-mascot-bg.mjs` (edge flood-fill, removes checker + soft shadow, art preserved) — DONE 2026-06-25, PR #24 (CC)
- [ ] **Ladder must grow with content (standing):** kana section auto-includes dakuten (same `type:"kana"`) when Unit 3 ships, but katakana likely wants its own grouping and **kanji needs a new section** (different type/UI). Units + roadmap sections grow from data. Re-check the Ladder reflects reality whenever a unit ships. (CC)
- [ ] Mastery feel-check + tune — Alex does real reviews, judges whether bars fill too slow/fast; tune `MASTERY_FULL_DAYS` or swap the model. (Alex/CC)

---

## Phase 4.7 — Dev Mode (hidden playtest panel) `[claude/dev-mode-playtest-panel]`

A solo-playtesting console hidden behind an unlock code in Settings. The point is to
exercise any unit/lesson — including ones gated behind the ladder — without grinding to them,
and **without ever touching real progress**. Isolation is the hard requirement: a dev run must
leave the persisted store byte-identical.

- [x] Unlock — Settings code field (`L071201`) flips a persisted `devMode` flag (survives reloads); "Disable Dev Mode" toggles it back off. Convenience, not security — code ships in the bundle, nothing sensitive gated. `unlockDevMode`/`disableDevMode` in `useStore.js`, `devMode` added to `partialize`. — DONE 2026-06-27 19:34, PR #32 (CC)
- [x] Dev panel (`/dev`, visible only when unlocked) — lists every registered unit → its lessons from UNITS data (no hardcoded names), fluid layout. Tap any lesson to launch it directly, bypassing ladder/unlock gating. — DONE 2026-06-27 19:34, PR #32 (CC)
- [x] Layout-state preview — launch a lesson as **Fresh** (teach flow) / **Mid-progress** / **Mastered** (review flow at the matching rung+stability), to check those card UIs without grinding. — DONE 2026-06-27 19:34, PR #32 (CC)
- [x] Diagnostics readout (`devDiagnostics()` in `src/store/dev.js`) — units registered, lessons, item counts, total kana **with vs without KanjiVG stroke data** (flags any missing). The "is the new unit wired right" check. — DONE 2026-06-27 19:34, PR #32 (CC)
- [x] "Reset my real progress" (confirm-gated) — wipes progress via `resetAll`; leaves Dev Mode unlocked. — DONE 2026-06-27 19:34, PR #32 (CC)
- [x] **Fully isolated runs (critical)** — explicit `sandbox` flag the Lesson **and** Review runners respect (`?sandbox=1`): throwaway in-memory items (`buildSandboxItems`) + every store writer swapped for a no-op (`runnerWriters`). No FSRS/mastery/streak/XP/persistence writes. — DONE 2026-06-27 19:34, PR #32 (CC)
- [x] Test — `tests/unit/dev.test.mjs` asserts a full dev lesson run leaves the persisted store byte-identical; smoke test drives the unlock → panel → isolated run → disable flow in-browser and re-asserts byte-identity. — DONE 2026-06-27 19:34, PR #32 (CC)
- [ ] Alex feel-check — unlock flow on real device, launch a Unit 3 lesson before clearing Units 1–2, eyeball the diagnostics for the new unit, confirm real progress is untouched after a dev session. (Alex)

---

## Phase 5 — Onboarding + User Profile

Front-door UX and the user profile data shape. Frontend-only — no backend required. Spec: `ONBOARDING-SPEC.md`. **Do not start until Phase 4 closes and Unit 3 curriculum is moving** — a front door to one room isn't worth much yet.

- [!] Convert `ONBOARDING-SPEC.md` to a full build brief — BLOCKED ON: Phase 4 complete (Claude)
- [!] Upfront onboarding flow (~4 taps): language pick (one active, others locked), display name, why (travel/heritage/work/fun), optional reminder time — BLOCKED ON: Phase 4 complete (CC)
- [!] User profile in Zustand persist store (`activeLanguage`, `displayName`, `reason`, `reminderTime`; sync-ready shape) — BLOCKED ON: Phase 4 complete (CC)
- [!] One-language lock enforced in code: `activeLanguage` set once; others stay locked until A1 — BLOCKED ON: Phase 4 complete (CC)
- [!] **Language path is user-selectable, NOT a hardcoded ja→es→fr chain (Alex, 2026-06-25).** Today `languages.js` bakes the order (`es` unlocks at `ja` A1, `fr` at `es` A1). The data model must let the learner pick their *next* language after A1, not force Spanish-then-French. The app is built for Alex but must generalize to any learner. **Alex's personal preference: French next** (going to France 2028; Spain 2031) — a default *hint* for onboarding, never something to hardcode. Likely a data-model change: "unlock the *choice* of next language at A1," not a fixed predecessor chain. — BLOCKED ON: Phase 5 design (CC)
- [!] Lazy-collected fields: `location` (asked before location-grammar lesson), `selfReference` (asked before first gendered-agreement lesson) — BLOCKED ON: Phase 4 complete (CC)
- [!] Content-contract extension: profile templating tokens (`{displayName}`, `{location.city}`) + `requires: []` lesson field + validator (token references known field + non-null fallback exists) — BLOCKED ON: Phase 4 complete (CC)
- [!] Account system (display name + email + auth + cross-device sync) — BLOCKED ON: Phase 6 (backend foundation) (CC)

---

## Phase 6 — Brief E — Backend foundation

Serverless infra. Required for graded speaking and real Haruki. **No longer staged last** — Phase 6.5 (the agent-audio brief) pulls it forward, because the only voice pipeline that ever pronounced Japanese correctly runs through the backend. API keys are env secrets, never frontend.

- [x] Serverless setup (Vercel functions) — first fn `api/convai-session.js` (zero-config Vercel detects `/api`); ESM `export default handler(req,res)` — DONE 2026-06-25, PR #29 (CC)
- [x] Secret/env handling for ElevenLabs key — `ELEVENLABS_API_KEY` server-side only (Vercel env), never reaches the browser; client gets only an expiring signed URL — DONE 2026-06-25, PR #29 (CC). Claude key handled by the agent (ElevenLabs side), not ours.
- [ ] `/api/speak.js` per-character TTS — not needed: lesson clips are pre-generated (`generate-audio.mjs`), conversation uses the live agent. Keep parked unless a real-time per-item TTS need appears. (CC)

---

## Phase 6.5 — Haruki via ElevenLabs Conversational Agent (the audio that actually worked)

Brief: `BUILD-BRIEF-agent-audio.md`. **The key realization:** the old app's Haruki pronounced Japanese correctly because it ran through an ElevenLabs **Conversational AI agent with Claude as the LLM** — NOT a raw `voiceId` → `/v1/text-to-speech` call. The rebuild fought raw TTS for four rounds (#15–#18), never matched it, and fell back to robotic Web Speech. The fix is architectural: adopt the agent path. **This is the concrete, proven path for Phase 8 (Real Haruki)** and the reason the backend is pulled forward.

- [x] **Configure the Haruki agent in the ElevenLabs dashboard** — voice `YYufJjbyLSFHuWXzJAaG`, LLM = Claude Haiku 4.5, persona from `server/companions.js`, JP. Agent `agent_0301kt9sdhhaez59jdk1ba3xqzzn`. Pronunciation validated by ear. — DONE 2026-06-25 (Alex)
- [x] **CC: verify against CURRENT ElevenLabs docs/SDK before implementing** — confirmed via installed `@elevenlabs/react` v1.9.0 types: `ConversationProvider` + `useConversation()` → `startSession({signedUrl})`, `status`/`isSpeaking`/`endSession`; `get-signed-url` endpoint returns `signed_url` (wss). — DONE 2026-06-25 (CC)
- [x] Backend session-auth endpoint — `api/convai-session.js` (Vercel fn) mints the signed WebSocket URL from `get-signed-url`; `ELEVENLABS_API_KEY` stays server-side; reads `agentId` from `server/companions.js` — DONE 2026-06-25, PR #29 (CC). *First serverless function in the repo → also satisfies Phase 6 backend foundation. Gotcha: the Vercel env key must be the convai_write-scoped one + redeploy — a stale key → "ElevenLabs 401".*
- [x] Frontend connection — `@elevenlabs/react` v1.9.0 (NEW dep, lazy-loaded so its ~500KiB stays out of the main bundle); Haruki tab is a **unified text + voice chat** (type or call, one session/transcript, messaging-app layout) — DONE 2026-06-25, PR #29 (CC), Alex-confirmed live. *Only works on Vercel (the `/api` fn isn't served by `vite dev/preview`).*
- [ ] **Capture + document the agent's working speech config** (voice settings) once Alex confirms it sounds right live — source of truth for tuning lesson clips. (Alex/CC)
- [ ] Apply the captured agent config to the per-item clip generator (`generate-audio.mjs`) if it improves on bare `eleven_v3`. (CC)

*DoD: live Japanese voice conversation works end-to-end; Alex confirms pronunciation by ear; agent config captured for the clip generator. Curriculum (Unit 3) proceeds in parallel — content pipeline is unaffected.*

---

## Phase 7 — Brief C — Speech grading (say-the-word → detect + grade)

**Design doc:** `BUILD-BRIEF-speech-grading.md` (2026-06-27) — Alex named speech grading as the next big thread. Backend foundation is now partly unblocked (PR #29 shipped the first Vercel serverless fn + server-side ElevenLabs key), so this is no longer hard-blocked on Phase 6. **Brief recommends:** path A (transcript match) first via **ElevenLabs Scribe STT** (we already hold the key + serverless pattern; Japanese WER ≤5%), with a pluggable grader so Azure phoneme-scoring (path B, the only one returning per-phoneme Japanese accuracy) can drop in later. Graded path = discrete `SpeakCard` + scoring endpoint (structural), NOT the live conversation agent. ND-leniency is a hard constraint (no harsh mic fail; graceful fallback when no mic/network).

- [ ] **Decisions to lock first** (see brief §"Open decisions"): path A vs B for v1 · provider (Scribe rec) · speakable scope (kana vs vocab vs both — single-kana STT least reliable, may argue vocab-first) · capture UX · realtime vs upload (upload rec). (Alex/Claude)
- [ ] `/api/score-speech` serverless endpoint (mirrors `convai-session.js`, key server-side) — **de-risk isolated-word Japanese STT by ear/data before any UI** (same lesson as the TTS saga). (CC)
- [ ] Real mic capture in `SpeakCard` (MediaRecorder) + wire into the review runner at rung 4 (exists today as a visual stub: `// TODO: real Whisper speech scoring`). (CC)
- [ ] Grade mapping → FSRS — reuse `normalizeReading`/matching from `src/store/answer.js` (one notion of "correct reading", typed or spoken); clean→`good`, close→`hard`, miss→`again`; threshold as a tunable constant. (CC)
- [ ] ND-friendly grading — lenient default, penalty-free retry, warm framing, graceful fallback to ungraded "say it" when mic/permission/endpoint unavailable. (CC)
- [ ] Privacy/consent — mic-permission moment + "audio sent to vendor for scoring, not stored" note in Settings; confirm no clip persistence. (CC)
- [ ] Add `speak` to `LIVE_CARD_KINDS`, un-skip its coverage stub (`tests/smoke.spec.js:318`), add a fixture (mock the endpoint — no real mic/network in CI). (CC)
- [ ] SPOKEN rung (rung 4) climbs only via a graded spoken pass; confirm PRODUCED (rung 3) gates it. (CC)
- [ ] **Check-in items before building** (CLAUDE.md guardrails): new dep (STT SDK/fetch), new backend endpoint + possible new vendor key, engine-touching → own scoped PR. Confirm `speak` needs no new `contract.js` field (likely none). (CC)

---

## Phase 8 — Brief D — Real Haruki

Claude brain + ElevenLabs voice, multi-tutor from `companions.js`. The two-bank memory architecture from the design sessions. **Note:** the voice/conversation transport is now specified concretely in **Phase 6.5** (ElevenLabs Conversational Agent) — this phase is the memory architecture and tutor logic layered on top of that proven pipeline.

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

## Future / come back later (concepts & growth — not yet scheduled)

Parking for ideas and growth tasks we've named but aren't building yet. Per the standing rule (#9 above), everything we discuss lands here so it's not lost. Promote items into a real phase when they're ready to build.

- **Ladder content sections grow over time** — today it shows Hiragana. As content lands: dakuten folds into the kana grid automatically (`type:"kana"`); **Katakana** likely wants its own labeled section; **Kanji** needs a brand-new section (different type + likely different UI: meaning/reading, not stroke-grid). The Units list + roadmap grow from data. Standing check: when a unit ships, confirm the Ladder reflects it.
- **Mastery model still being settled** — currently FSRS `stability` / `MASTERY_FULL_DAYS` (45d). Alex to confirm by feel: threshold + whether stability is the right measure vs. a simpler review-count. Tune once there's real review data. (See `[[project-lesson-audio]]`-style memory `project-ladder-mastery` if created.)
- **Language path generalization** — see Phase 5; the ja→es→fr chain must become user-choice. Logged there; noted here so the concept isn't buried in a blocked phase.
- ~~**Mascot art needs real transparency**~~ — RESOLVED 2026-06-25, PR #24. Baked checkerboard stripped from all 8 `lingua-*` PNGs via `scripts/strip-mascot-bg.mjs` (edge flood-fill removes checker + soft drop-shadow; panda art preserved behind its black outline). Re-runnable if new mascot art is added with the same baked background.
- **Today screen feels empty (Alex, 2026-06-25)** — lots of dead space, especially once the daily goal is met (collapses to two checkmarks + stats). Warm it up *meaningfully* (mechanics over dopamine): the mascot (`lingua-*`, now transparent) in an encouraging pose; an "Up next" preview (next lesson's can-do / what you'll learn); a small progress glance (kana mastered this week, or next-review timing). Keep it calm/ND-friendly, no streak-bait. Likely its own small PR with Alex feel-check.
- **Mini-games (Alex, 2026-06-25) — "later we gotta add a couple mini games."** A few small game modes for variety. **Design constraint (non-negotiable):** they must reinforce *learning*, not be dopamine-bait — per the anti-burnout principle, mechanics over dopamine, no streak/score tricks. Good candidates that drill real recall: kana↔romaji matching/pairs, speed-recognition (timed but gentle), listening "which kana did you hear", sentence/word build-from-tiles against the clock. Each should run on the existing item/SRS data (a game session can feed grades back into FSRS so playing = reviewing). Decide whether they're a separate tab or woven into the session. Its own sprint; scope when picked up.
- **Dress Lingua up to match the language (Alex, 2026-06-25) — big effort, its own sprint.** The mascot (Lingua the panda) should be costumed/themed per the language being learned — e.g. Japanese touches for ja, a beret for fr, etc. Alex flags this as needing "some good time" — likely new art generation per language × the existing pose set (base/wave/proud/cheer/celebrate/sleepy/think/wistful), kept consistent. **Mascot art is Grok-generated** (Alex will supply more clips/poses); plan an attribution line ("made with Grok") where appropriate. Decide art pipeline, keep transparency-clean (re-run `strip-mascot-bg.mjs`). Ties into per-language identity + companion screens.

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
- **ElevenLabs MP3 pipeline abandoned then REVIVED** — was abandoned for Web Speech in PR #19 after rounds #15–#18 couldn't get isolated kana to pronounce right. **Root cause found 2026-06-24:** it was never a TTS limitation — it was over-loaded request params (`language_code:"ja"` + hiragana→katakana conversion + aggressive `voice_settings` stability 0.35/style 0.25 + `eleven_multilingual_v2`). A **bare `eleven_v3` call** (just `{text, model_id}`, raw character, voice defaults) pronounces single kana correctly. Confirmed by ear across multilingual/flash/turbo (all bad) vs v3 (good). The clip pipeline is back as the primary; Web Speech is now only the fallback. **Don't add language_code / katakana / custom voice_settings to the generator — that's what broke it.**
- **The conversational agent sounded good because of CONTEXT, not config.** Haruki's agent ([`BUILD-BRIEF-agent-audio.md`]) pronounces well because Claude feeds it full sentences. This briefly led to the wrong conclusion that lesson clips needed the agent or recorded human audio — they don't; bare `eleven_v3` handles isolated kana. The agent is still the right tool for live conversation, just not the only path to good clip audio.
