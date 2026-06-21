# Content schema reference

Run `npm run validate:content` to check your changes before pushing.
Hard-rule violations exit non-zero; warnings are advisory.

---

## Hierarchy

```
LANGUAGES[]           one entry per supported language
UNIT[]
  └─ LESSON[]
       ├─ (locked stub)   — { id, title, locked: true } only
       └─ (playable)      — full object with items[]
            └─ ITEM[]     — kana or vocab
```

---

## Language

| field     | type      | required | notes |
|-----------|-----------|----------|-------|
| id        | string    | ✓        | 2-char ISO 639-1 code (`"ja"`, `"es"`) |
| name      | string    | ✓        |       |
| flag      | string    | ✓        | emoji flag |
| target    | CEFR      | ✓        | learner goal level (`"A1"`–`"B2"`) |
| unlock    | `null` or `{ lang, level }` | ✓ | null for the starter language |
| unlocked  | boolean   | ✓        | true for the starter language; false for locked ones |

---

## Unit

| field    | type     | required | notes |
|----------|----------|----------|-------|
| id       | string   | ✓        | pattern `^[a-z]{2}-u\d+$` — e.g. `"ja-u1"` |
| lang     | string   | ✓        | must match a known language id |
| title    | string   | ✓        | shown in the unit list |
| order    | integer  | ✓        | 1-indexed, contiguous per language (no gaps) |
| lessons  | LESSON[] | ✓        | at least one entry |

---

## Lesson (playable)

| field        | type     | required | notes |
|--------------|----------|----------|-------|
| id           | string   | ✓        | pattern `^[a-z]{2}-u\d+l\d+$` — e.g. `"ja-u1l1"` |
| unit         | integer  | ✓        | must match parent unit's number |
| lesson       | integer  | ✓        | 1-indexed within unit; sequential, no gaps |
| title        | string   | ✓        |       |
| cefr         | CEFR     | ✓        | `"A1"` / `"A2"` / `"B1"` / `"B2"` |
| dominantMode | string   | ✓        | `"recall"` / `"recognize"` / `"produce"` / `"speak"` / `"trace"` |
| canDo        | string   | ✓        | one-sentence learner outcome (shown on lesson card) |
| items        | ITEM[]   | ✓        | at least one item |

## Lesson (locked stub)

Only three fields are allowed — any additional field is a validation error.

```js
{ id: "ja-u1l2", title: "か row", locked: true }
```

---

## Item — kana

| field   | type    | required | notes |
|---------|---------|----------|-------|
| id      | string  | ✓        | pattern `^[a-z]{2}-u\d+l\d+-[a-z0-9]+$` |
| type    | `"kana"` | ✓       |       |
| front   | string  | ✓        | the hiragana/katakana character(s) displayed |
| reading | string  | ✓        | romaji; must be `[a-z]+` after `normalizeReading()` |
| meaning | `null`  | ✓        | must be `null` for kana |
| example | `null`  | ✓        | must be `null` for kana |
| hint    | string (opt) |     | visual/sound mnemonic shown on TeachCard; must be non-empty if present |

Each kana **character** (not item) may appear in the corpus at most once.

## Item — vocab

| field   | type              | required | notes |
|---------|-------------------|----------|-------|
| id      | string            | ✓        | same id pattern |
| type    | `"vocab"`         | ✓        |       |
| front   | string            | ✓        | Japanese word/phrase |
| reading | string            | ✓        | romaji; `[a-z]+` after normalization |
| meaning | string            | ✓        | English gloss; non-empty |
| example | `{ jp, en }`      | ✓        | one sentence in each language |
| accept  | string[] (opt)    |          | alternate accepted meanings for typed answers |
| hint    | string (opt)      |          | memory hook shown on TeachCard; must be non-empty if present |

---

## CEFR levels

Valid values (in order): `"A1"` `"A2"` `"B1"` `"B2"`.

---

## Card kinds (`LIVE_CARD_KINDS`)

The lesson runner routes items to one of these card types based on the item's
mastery rung. `LIVE_CARD_KINDS` in `src/data/contract.js` is the canonical list.
Adding a new card kind requires updating that list; wiring it without updating
the list will throw at runtime and fail CI smoke.

| kind          | rung         | description |
|---------------|--------------|-------------|
| `teach`       | 0 (learn)    | presentation card; no testing |
| `choice`      | 1 (RECOGNIZED) + learn check1 | 4-option multiple choice |
| `type:meaning`| 2 (RECALLED) + vocab learn check2 | type the English meaning |
| `type:produce`| 3+ kana + kana learn check2 | type the rōmaji / kana |
| `build`       | 3+ vocab (PRODUCED) | assemble the reading from tiles |

Dormant (not yet wired):

| kind    | brief      | description |
|---------|------------|-------------|
| `trace` | Brief 3    | KanjiVG touch-to-trace |
| `speak` | Brief C    | Whisper speech recognition |

---

## Validation rules (hard — exit non-zero)

1. All ids match their respective regex patterns.
2. No duplicate unit, lesson, or item id across the corpus.
3. Unit `order` values are 1-indexed and contiguous per language.
4. Lesson `lesson` numbers are 1-indexed and contiguous per unit.
5. Locked lesson stubs contain only `{ id, title, locked }`.
6. Every playable lesson has a valid `cefr` field.
7. Kana items have `meaning: null` and `example: null`.
8. Vocab items have a non-empty `meaning` and a `{ jp, en }` example.
9. Each `reading` is `[a-z]+` after `normalizeReading()` (no stray kana or spaces).
10. Each kana *character* appears in at most one item across the corpus.
11. Items contain only known fields: `{ id, type, front, reading, meaning, example, accept, hint }`.
    Any unknown key is a hard error. `hint` must be a non-empty string if present.

## Validation rules (warnings — advisory)

- A choice card needs ≥ 3 same-type distractors at/below the item's CEFR level.
  Fewer options make guessing trivial.
- Multi-word vocab meanings (e.g. `"good morning"`) with an empty or absent `accept[]`
  will reject plausible typed paraphrases (e.g. `"morning"`). Add synonyms to `accept`.
