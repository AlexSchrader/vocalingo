# Lingua — Onboarding + User Profile Spec

A planning spec, not a build brief. It feeds two later deliverables: an onboarding build
brief and a small content-contract extension for profile templating. **Do not build until
Phase 4 closes and Unit 2 is moving** — curriculum is the make-or-break work; onboarding is
the front door, but a front door to one room isn't worth much yet.

---

## Guiding principles

1. **One language at a time, locked, gated on A1.** The discipline *is* the product —
   Lingua is for people who want to actually learn, not collect words across three languages
   at once. Parallel learning is the casual behavior we deliberately don't build for.
2. **Personalization = turn the user's own facts into lesson content.** Spelling *your* name,
   saying where *you* live. Personally-relevant input beats generic for retention — this is
   pedagogy, not data collection.
3. **Ask little upfront, collect the rest lazily.** 3–4 questions before the first lesson;
   everything else is asked in-context, right before the lesson that needs it — which also
   teaches the concept better because the question now has a reason.

---

## Upfront onboarding (no backend; local profile)

Keep it to ~4 taps. In order:

1. **Pick one language** — `ja` / `es` / `fr`. The other two show locked, labeled
   "Unlock by reaching A1." This sets `activeLanguage`. (More languages added later.)
2. **Display name** — used for personalization and the name-spelling lesson.
3. **Why are you learning?** — travel / heritage / work / for fun. One tap. Flavors companion
   tone and example-sentence selection.
4. **Daily reminder time** (optional, skippable) — fits the streak-as-a-floor philosophy.
   Collect the preference now; actual notification *delivery* is limited on iOS PWA until the
   native wrap (Phase 9), so store it and wire delivery later.

## Lazy-collected (asked in-context, before the lesson that needs it)

- **Location** (city / region / country) — asked when the "where do you live" lesson arrives,
  then templated into that lesson and reused. Falls in whatever unit teaches location grammar.
- **Self-reference for grammar** — framed as *"How should I refer to you in {language}?"*, not
  identity collection. Options include **prefer not to say → neutral phrasing**. Needed for
  gendered agreement (French *content/contente*, Spanish adjectives); Japanese rarely needs it.
  Asked only when the first lesson requiring self-reference appears.

## User profile data shape (local now, sync-ready later)

```js
userProfile = {
  activeLanguage: "ja",        // set once; others locked until A1
  displayName: "Alex",
  reason: "travel" | "heritage" | "work" | "fun" | null,
  reminderTime: "20:00" | null,
  // lazily collected:
  location: { city, region, country } | null,
  selfReference: "masc" | "fem" | "neutral" | null,  // grammar, not identity
  // future (backend, Phase 6): id, email, ...
}
```
Lives in the Zustand persist store (one place), swappable to backend sync later.

## Content-contract extension (small, later)

- **Profile templating:** lesson prompts/examples can reference profile tokens, e.g.
  `{displayName}`, `{location.city}`, resolved at render from `userProfile`. The validator
  must check every token references a known profile field AND that a non-null fallback exists,
  so a lesson can't break if the user skipped a lazy question.
- **Requirement declaration:** a lesson may declare `requires: ["location"]`; if that field is
  null when the lesson is reached, trigger the lazy-ask before starting it.

## The locked one-language rule (structural)

- `activeLanguage` is set once at onboarding. Other languages stay locked until the active one
  reaches A1 — uses the existing `unlock: {lang, level}` cascade fields. No parallel tracks in
  v1, enforced in code, not just UI.
- *Possible* future setting: an explicit opt-in "parallel mode." Note as future; do not build.
  Ship the opinionated version first — the opinion is the product.

## Account system — DEFERRED (Phase 6 / pre-App-Store)

Display name + email + password + cross-device sync. Requires the backend, plus real auth
(password hashing, reset flows — use a service like Supabase/Clerk, don't roll your own) and a
privacy policy for App Store submission. The profile shape above gains `id`/`email`. Captured
here so onboarding is designed account-ready; not in the onboarding build sprint.

---

## Sequencing

Phase 4 closes → Unit 2 + curriculum moving → *then* onboarding as a clean feature sprint:
this spec → onboarding build brief + the content-contract templating extension.

## Open questions for Alex

- Reminder delivery is unreliable on iOS PWA until native — OK to collect the preference now
  and deliver later (assumed yes)?
- Any upfront question to add or cut? (Current upfront set: language, name, why, reminder.)
- A "do you already know some?" placement check per language to skip absolute beginners past
  あいうえお — worth a v1, or a later refinement? (Leaning later.)
