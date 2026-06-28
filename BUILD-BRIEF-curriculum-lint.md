# BUILD BRIEF — Curriculum Lint + Autonomous Authoring

> Transcribed into the repo by CC (the chat copy arrived with mojibake'd Japanese
> examples; those are restored here). Design + intent unchanged.

## Goal
CC authors units **autonomously, in batches, without per-unit human approval.** Everything
mechanical is enforced by an automated lint (CC's PRs self-certify in CI); language naturalness —
the one thing no lint can check — is handled by **periodic native-speaker review on batches**,
not per unit and not by Claude in the path.

---

## Part 1 — Curriculum Lint (`npm run lint:curriculum`, or fold into `validate:content`)
Turn every rule Claude has been checking by hand into an automated gate. A unit fails CI if any
of these fail; CC fixes before merge. No human needed for this layer.

**Schema & structure**
- Each item matches its type's exact key set; no stray keys (kana / vocab / kanji shapes).
- `id` format `^ja-u\d+l\d+-[a-z0-9]+$`, globally unique.
- Required fields present per type; `stage` present and in `{pre-a1,a1,a2,b1,b2}`.

**Reading format**
- Romaji, lowercase; long vowels as macron (ō/ū); `ei` stays `ei`, `ii` stays `ii`.
- を reading is `"wo"`.

**Kana / kanji integrity**
- Every kana & kanji `front` has a KanjiVG stroke entry (hard error).
- Vocab fronts globally unique; kanji fronts globally unique; kana→vocab reuse allowed (the #37 rule).
- Kana introduced in gojūon order within a script unit (rows in order; dakuten g/z/d/b/p).

**Scope (the mechanical slice of it)**
- A kana/kanji used in a **teach front** must already be introduced by this point in the queue.
  Vocab and example words are EXEMPT (reading carries them — existing convention).
- Kanji items only in `stage: a1`+ units (no kanji in pre-a1).

**Density**
- ~5–8 vocab per lesson (warn outside, error at 0). `accept[]` present (may be empty) on every vocab.

Output: pass/fail per rule, naming the offending `id`. Green = mechanically sound.

---

## Part 2 — What the lint CANNOT check (so it's clear what's NOT covered)
The lint can't read meaning. It cannot tell whether:
- a particle is natural (が vs は, を placement),
- です / だ register is right for the context,
- a verb collocation is idiomatic (しゃしんを **とる**, not しゃしんを つくる),
- an example is something a native would actually say (これ vs こちら for a person).

`これはりょうしんです` passed every automated check and was still wrong (これ for a *person*; こちら
is natural). These are invisible to any test — they are the **language gate**, and that gate is
native-speaker review (below). It is also the non-negotiable gate before any "professional /
certified / JLPT-aligned" claim or store launch.

---

## Part 3 — Autonomous workflow (no per-unit human approval)
1. CC authors the next queued unit(s) in-repo against `CONTENT.md` + the authoring guide.
2. `lint:curriculum` + `validate:content` + tests + smoke must be green. Red → CC fixes, no merge.
3. CC merges green units to `main`. Alex playtests in **Dev Mode** — the running app is the live check.
4. **Batch language review:** every batch (recommend one sub-section — each kanji batch, or every
   ~5 grammar units), send the batch to a **native speaker**. Corrections return as one fix PR.
5. Claude is available for spot-review **on request** (e.g. a grammar unit CC is unsure of) but is
   NOT a required gate. Required gates = lint (mechanical, automated) + native review (language, batched).

> NOTE (CC): Part 3 overrides CLAUDE.md's standing "draft PRs only — Alex always merges" rule for
> curriculum. Pending Alex's explicit go-ahead before CC self-merges any unit. Part 1 (this lint)
> ships as a normal draft PR.

---

## Definition of Done (the lint)
- `lint:curriculum` implemented with all Part 1 rules, wired into CI so PRs fail on violation.
- Backfilled against Units 1–10 — must pass clean (it should; #37 already deduped).
- Documented in `CONTENT.md`.

**Sequence:** build the lint BEFORE churning the A1 grammar units (U12+). Grammar is where both
mechanical slips and naturalness errors spike — the lint catches the mechanical half automatically
so the only thing left for the batch native pass is genuine language judgment.
