import test from "node:test";
import assert from "node:assert/strict";
import { lintCurriculum } from "../../src/data/lint.js";
import { UNITS } from "../../src/data/index.js";

// A minimal valid kana-script unit, used as a base the rejection tests mutate.
function kanaUnit(overrides = {}) {
  return {
    id: "ja-u1", lang: "ja", order: 1, stage: "pre-a1", title: "T",
    lessons: [
      {
        id: "ja-u1l1", unit: 1, lesson: 1, title: "L", dominantMode: "recall", canDo: "c", cefr: "A1",
        items: [
          { id: "ja-u1l1-a", type: "kana", front: "あ", reading: "a", meaning: null, example: null },
          { id: "ja-u1l1-i", type: "kana", front: "い", reading: "i", meaning: null, example: null },
          { id: "ja-u1l1-v1", type: "vocab", front: "ねこ", reading: "neko", meaning: "cat", example: { jp: "ねこ。", en: "Cat." }, accept: [] },
          { id: "ja-u1l1-v2", type: "vocab", front: "いぬ", reading: "inu", meaning: "dog", example: { jp: "いぬ。", en: "Dog." }, accept: [] },
          { id: "ja-u1l1-v3", type: "vocab", front: "すし", reading: "sushi", meaning: "sushi", example: { jp: "すし。", en: "Sushi." }, accept: [] },
          { id: "ja-u1l1-v4", type: "vocab", front: "みず", reading: "mizu", meaning: "water", example: { jp: "みず。", en: "Water." }, accept: [] },
          { id: "ja-u1l1-v5", type: "vocab", front: "やま", reading: "yama", meaning: "mountain", example: { jp: "やま。", en: "Mountain." }, accept: [] },
        ],
      },
    ],
    ...overrides,
  };
}

test("real curriculum passes the lint with no errors", () => {
  const { errors } = lintCurriculum(UNITS);
  assert.deepEqual(errors, [], `Real content fails the lint:\n${errors.join("\n")}`);
});

test("flags a reading that spells a long vowel as ou/oo/uu instead of a macron", () => {
  const u = kanaUnit();
  u.lessons[0].items[2].reading = "nekou"; // contrived ou
  const { errors } = lintCurriculum([u]);
  assert.ok(errors.find((e) => e.includes("macron")), `expected a macron error, got:\n${errors.join("\n")}`);
});

test("flags a stray key on a kana item (e.g. accept)", () => {
  const u = kanaUnit();
  u.lessons[0].items[0].accept = []; // accept is not allowed on kana
  const { errors } = lintCurriculum([u]);
  assert.ok(errors.find((e) => e.includes("ja-u1l1-a") && e.includes("accept")), `got:\n${errors.join("\n")}`);
});

test("requires を to read \"wo\"", () => {
  const u = kanaUnit();
  u.lessons[0].items[1] = { id: "ja-u1l1-wo", type: "kana", front: "を", reading: "o", meaning: null, example: null };
  const { errors } = lintCurriculum([u]);
  assert.ok(errors.find((e) => e.includes("wo")), `got:\n${errors.join("\n")}`);
});

test("flags kana out of gojūon order within a unit", () => {
  const u = kanaUnit();
  // か (rank 5) before あ (rank 0) → out of order
  u.lessons[0].items[0] = { id: "ja-u1l1-ka", type: "kana", front: "か", reading: "ka", meaning: null, example: null };
  u.lessons[0].items[1] = { id: "ja-u1l1-a", type: "kana", front: "あ", reading: "a", meaning: null, example: null };
  const { errors } = lintCurriculum([u]);
  assert.ok(errors.find((e) => e.includes("gojūon")), `got:\n${errors.join("\n")}`);
});

test("flags a word front taught twice", () => {
  const u = kanaUnit();
  u.lessons[0].items[3].front = "ねこ"; // duplicate of items[2]
  u.lessons[0].items[3].reading = "neko";
  const { errors } = lintCurriculum([u]);
  assert.ok(errors.find((e) => e.includes("already taught")), `got:\n${errors.join("\n")}`);
});
