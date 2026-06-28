import test from "node:test";
import assert from "node:assert/strict";
import { validateContent, LIVE_CARD_KINDS } from "../../src/data/contract.js";
import { UNITS, LANGUAGES } from "../../src/data/index.js";

// ---- real corpus passes ------------------------------------------------------

test("real content passes validateContent with no errors", () => {
  const { errors } = validateContent(UNITS, LANGUAGES);
  assert.deepEqual(
    errors,
    [],
    `Real content has validation errors:\n${errors.join("\n")}`
  );
});

// ---- hard-rule rejection fixtures -------------------------------------------

test("rejects a unit containing a duplicate item id", () => {
  // Every field is valid; only the repeated item id is wrong.
  const broken = {
    id: "ja-u1",
    lang: "ja",
    order: 1,
    title: "Broken",
    lessons: [
      {
        id: "ja-u1l1",
        unit: 1,
        lesson: 1,
        title: "Dupe items",
        dominantMode: "recall",
        canDo: "test",
        cefr: "A1",
        items: [
          {
            id: "ja-u1l1-x",
            type: "vocab",
            front: "テスト",
            reading: "tesuto",
            meaning: "test",
            example: { jp: "テスト", en: "test" },
            accept: [],
          },
          {
            id: "ja-u1l1-x", // intentional duplicate
            type: "vocab",
            front: "テスト2",
            reading: "tesuto2",
            meaning: "test 2",
            example: { jp: "テスト2", en: "test 2" },
            accept: [],
          },
        ],
      },
    ],
  };

  const { errors } = validateContent([broken], LANGUAGES);
  const dupe = errors.find(
    (er) => er.includes("ja-u1l1-x") && er.includes("duplicate")
  );
  assert.ok(
    dupe,
    `Expected a duplicate-id error for ja-u1l1-x, got:\n${errors.join("\n")}`
  );
});

test("rejects a playable lesson missing cefr", () => {
  const noCefr = {
    id: "ja-u1",
    lang: "ja",
    order: 1,
    title: "NoCefr",
    lessons: [
      {
        id: "ja-u1l1",
        unit: 1,
        lesson: 1,
        title: "No cefr lesson",
        dominantMode: "recall",
        canDo: "test",
        // cefr intentionally omitted → undefined
        items: [
          {
            id: "ja-u1l1-x",
            type: "vocab",
            front: "テスト",
            reading: "tesuto",
            meaning: "test",
            example: { jp: "テスト", en: "test" },
            accept: [],
          },
        ],
      },
    ],
  };

  const { errors } = validateContent([noCefr], LANGUAGES);
  const cefrErr = errors.find(
    (er) => er.includes("ja-u1l1") && er.includes("cefr")
  );
  assert.ok(
    cefrErr,
    `Expected a missing-cefr error for ja-u1l1, got:\n${errors.join("\n")}`
  );
});

test("rejects a locked stub that has stray fields", () => {
  const strayStub = {
    id: "ja-u1",
    lang: "ja",
    order: 1,
    title: "Stray stub",
    lessons: [
      { id: "ja-u1l1", title: "ok", locked: true },
      // locked stub with extra dominantMode field
      { id: "ja-u1l2", title: "stray", locked: true, dominantMode: "recall" },
    ],
  };

  const { errors } = validateContent([strayStub], LANGUAGES);
  const strayErr = errors.find(
    (er) => er.includes("ja-u1l2") && er.includes("stray")
  );
  assert.ok(
    strayErr,
    `Expected a stray-fields error for ja-u1l2, got:\n${errors.join("\n")}`
  );
});

test("rejects an item with an unknown field", () => {
  const unit = {
    id: "ja-u1",
    lang: "ja",
    order: 1,
    title: "Junk field",
    lessons: [
      {
        id: "ja-u1l1",
        unit: 1,
        lesson: 1,
        title: "Junk item",
        dominantMode: "recall",
        canDo: "test",
        cefr: "A1",
        items: [
          {
            id: "ja-u1l1-x",
            type: "vocab",
            front: "テスト",
            reading: "tesuto",
            meaning: "test",
            example: { jp: "テスト", en: "test" },
            accept: [],
            junk: "not allowed", // unknown field — must be an error
          },
        ],
      },
    ],
  };

  const { errors } = validateContent([unit], LANGUAGES);
  const strayErr = errors.find(
    (er) => er.includes("ja-u1l1-x") && er.includes("junk")
  );
  assert.ok(
    strayErr,
    `Expected an unknown-field error for item ja-u1l1-x, got:\n${errors.join("\n")}`
  );
});

test("accepts a kana item with a hint field", () => {
  // hint is optional but when present must be a non-empty string.
  // Build a minimal valid unit with enough peers to suppress distractor warnings.
  const items = [
    { id: "ja-u1l1-a", type: "kana", front: "あ", reading: "a", meaning: null, example: null, hint: "First kana — like the letter A." },
    { id: "ja-u1l1-i", type: "kana", front: "い", reading: "i", meaning: null, example: null },
    { id: "ja-u1l1-u", type: "kana", front: "う", reading: "u", meaning: null, example: null },
    { id: "ja-u1l1-e", type: "kana", front: "え", reading: "e", meaning: null, example: null },
    { id: "ja-u1l1-v1", type: "vocab", front: "ねこ",   reading: "neko",   meaning: "cat",  example: { jp: "ねこ。",   en: "Cat." } },
    { id: "ja-u1l1-v2", type: "vocab", front: "いぬ",   reading: "inu",    meaning: "dog",  example: { jp: "いぬ。",   en: "Dog." } },
    { id: "ja-u1l1-v3", type: "vocab", front: "すし",   reading: "sushi",  meaning: "sushi", example: { jp: "すし。",  en: "Sushi." } },
    { id: "ja-u1l1-v4", type: "vocab", front: "さかな", reading: "sakana", meaning: "fish", example: { jp: "さかな。", en: "Fish." } },
  ];
  const unit = {
    id: "ja-u1",
    lang: "ja",
    order: 1,
    stage: "pre-a1",
    title: "Hint test",
    lessons: [{ id: "ja-u1l1", unit: 1, lesson: 1, title: "Hint kana", dominantMode: "recall", canDo: "test", cefr: "A1", items }],
  };

  const { errors } = validateContent([unit], LANGUAGES);
  const hintErr = errors.find((er) => er.includes("hint"));
  assert.ok(
    !hintErr,
    `Did not expect a hint-related error, got:\n${errors.join("\n")}`
  );
  assert.deepEqual(errors, [], `Expected no errors at all, got:\n${errors.join("\n")}`);
});

test("rejects a unit with a missing or invalid stage", () => {
  const base = {
    id: "ja-u1",
    lang: "ja",
    order: 1,
    title: "Stage test",
    lessons: [
      {
        id: "ja-u1l1", unit: 1, lesson: 1, title: "L1", dominantMode: "recall", canDo: "test", cefr: "A1",
        items: [{ id: "ja-u1l1-x", type: "vocab", front: "テスト", reading: "tesuto", meaning: "test", example: { jp: "テスト", en: "test" }, accept: [] }],
      },
    ],
  };

  // Missing stage → error.
  const missing = validateContent([base], LANGUAGES).errors.find(
    (er) => er.includes("ja-u1") && er.includes("stage")
  );
  assert.ok(missing, `Expected a missing-stage error, got none`);

  // Bogus stage value → error.
  const bogus = validateContent([{ ...base, stage: "A1" }], LANGUAGES).errors.find(
    (er) => er.includes("ja-u1") && er.includes("stage")
  );
  assert.ok(bogus, `Expected an invalid-stage error for "A1", got none`);

  // Valid stage → no stage error.
  const ok = validateContent([{ ...base, stage: "pre-a1" }], LANGUAGES).errors.find(
    (er) => er.includes("stage")
  );
  assert.ok(!ok, `Did not expect a stage error for a valid stage, got: ${ok}`);
});

// ---- LIVE_CARD_KINDS canonical set ------------------------------------------

// This test defines the expected set. If you add a new card kind to the runner,
// add it to LIVE_CARD_KINDS in contract.js AND update this expected list.
test("LIVE_CARD_KINDS is exactly the current active set", () => {
  assert.deepEqual(
    [...LIVE_CARD_KINDS].sort(),
    ["build", "choice", "teach", "trace", "type:meaning"],
    "Update both LIVE_CARD_KINDS in contract.js and this assertion when adding a new card kind"
  );
});
