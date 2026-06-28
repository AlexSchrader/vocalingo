import { normalizeReading } from "../store/answer.js";
import { KANJIVG } from "./kanjivg.js";

// The canonical list of card kinds the session runner actively routes.
// Adding a new card kind means: (1) add it here, (2) wire it in Lesson.jsx,
// (3) add a fixture item to the coverage smoke test.
// Dormant future kinds (trace, speak) are not in this list until their brief lands.
export const LIVE_CARD_KINDS = [
  "teach",
  "choice",
  "type:meaning",
  "build",
  "trace",
];

// --- internal constants -------------------------------------------------------

const CEFR_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3 };
const VALID_CEFR = Object.keys(CEFR_ORDER);
// Coarse CEFR stage a unit belongs to — drives the Ladder's section grouping.
// "pre-a1" is the scripts band (hiragana/katakana) that precedes A1 proper.
// Latin-alphabet languages simply won't have any pre-a1 units.
const VALID_STAGE = ["pre-a1", "a1", "a2", "b1", "b2"];
const VALID_DOMINANT_MODE = ["recall", "recognize", "produce", "speak", "trace"];
const VALID_ITEM_TYPES = ["kana", "vocab"];
const LOCKED_STUB_KEYS = new Set(["id", "title", "locked"]);
const ITEM_KEYS = new Set(["id", "type", "front", "reading", "meaning", "example", "accept", "hint"]);
const UNIT_ID_RE = /^[a-z]{2}-u\d+$/;
const LESSON_ID_RE = /^[a-z]{2}-u\d+l\d+$/;
const ITEM_ID_RE = /^[a-z]{2}-u\d+l\d+-[a-z0-9]+$/;

// --- validateContent ---------------------------------------------------------

// Validates a full corpus (all units + languages). Returns { errors, warnings }.
// errors[] → hard rule violations; the script / CI step exits non-zero.
// warnings[] → style issues that don't block but should be resolved before the
//   content ships to learners (e.g. too few distractors for choice card).
export function validateContent(units, languages) {
  const errors = [];
  const warnings = [];
  const e = (msg) => errors.push(msg);
  const w = (msg) => warnings.push(msg);

  // ---- languages ----
  const langIds = new Set();
  for (const lang of languages) {
    if (!lang.id || typeof lang.id !== "string") {
      e("language: missing id");
      continue;
    }
    langIds.add(lang.id);
    if (!VALID_CEFR.includes(lang.target))
      e(`language ${lang.id}: target "${lang.target}" is not a valid CEFR level`);
    if (typeof lang.unlocked !== "boolean")
      e(`language ${lang.id}: unlocked must be boolean`);
  }
  // Second pass: cross-reference unlock.lang (all ids are now collected).
  for (const lang of languages) {
    if (lang.unlock === null) continue;
    if (!lang.unlock || typeof lang.unlock !== "object") {
      e(`language ${lang.id}: unlock must be null or { lang, level }`);
      continue;
    }
    if (!langIds.has(lang.unlock.lang))
      e(`language ${lang.id}: unlock.lang "${lang.unlock.lang}" is not a known language`);
    if (!VALID_CEFR.includes(lang.unlock.level))
      e(`language ${lang.id}: unlock.level "${lang.unlock.level}" is not a valid CEFR level`);
  }

  // ---- units + lessons + items ----
  const unitIds = new Set();
  const lessonIds = new Set();
  const itemIds = new Set();
  const allItems = []; // { item, lessonCefr } — for cross-cutting checks
  const unitOrdersByLang = {}; // lang → [order]

  for (const unit of units) {
    if (!unit.id) { e("unit: missing id"); continue; }
    if (unitIds.has(unit.id)) e(`unit ${unit.id}: duplicate id`);
    unitIds.add(unit.id);

    if (!UNIT_ID_RE.test(unit.id))
      e(`unit ${unit.id}: id must match ${UNIT_ID_RE}`);
    if (!langIds.has(unit.lang))
      e(`unit ${unit.id}: lang "${unit.lang}" is not a known language`);
    if (!unit.title || typeof unit.title !== "string" || !unit.title.trim())
      e(`unit ${unit.id}: title is empty`);
    if (!Number.isInteger(unit.order) || unit.order < 1)
      e(`unit ${unit.id}: order must be a positive integer`);
    if (!VALID_STAGE.includes(unit.stage))
      e(`unit ${unit.id}: stage "${unit.stage}" is missing or not one of ${VALID_STAGE.join(" | ")}`);
    if (!Array.isArray(unit.lessons) || unit.lessons.length === 0)
      e(`unit ${unit.id}: lessons must be a non-empty array`);

    if (unit.lang) {
      if (!unitOrdersByLang[unit.lang]) unitOrdersByLang[unit.lang] = [];
      unitOrdersByLang[unit.lang].push(unit.order);
    }

    // Extract unit number for cross-checking lesson.unit fields.
    const unitNumMatch = unit.id.match(/u(\d+)$/);
    const unitNum = unitNumMatch ? parseInt(unitNumMatch[1], 10) : null;

    const playableLessonNums = [];
    for (const lesson of unit.lessons ?? []) {
      if (!lesson.id) { e(`unit ${unit.id}: lesson missing id`); continue; }
      if (lessonIds.has(lesson.id)) e(`lesson ${lesson.id}: duplicate id`);
      lessonIds.add(lesson.id);

      if (!LESSON_ID_RE.test(lesson.id))
        e(`lesson ${lesson.id}: id must match ${LESSON_ID_RE}`);

      if (lesson.locked) {
        // Locked stubs must be pure: only id, title, locked allowed.
        const stray = Object.keys(lesson).filter((k) => !LOCKED_STUB_KEYS.has(k));
        if (stray.length)
          e(`lesson ${lesson.id}: locked stub has stray fields: ${stray.join(", ")}`);
        if (!lesson.title || typeof lesson.title !== "string" || !lesson.title.trim())
          e(`lesson ${lesson.id}: title is empty`);
      } else {
        // Playable lesson.
        if (!lesson.title || typeof lesson.title !== "string" || !lesson.title.trim())
          e(`lesson ${lesson.id}: title is empty`);
        if (!VALID_DOMINANT_MODE.includes(lesson.dominantMode))
          e(`lesson ${lesson.id}: dominantMode "${lesson.dominantMode}" is not valid`);
        if (!lesson.canDo || typeof lesson.canDo !== "string" || !lesson.canDo.trim())
          e(`lesson ${lesson.id}: canDo is empty`);
        if (!VALID_CEFR.includes(lesson.cefr))
          e(`lesson ${lesson.id}: cefr "${lesson.cefr}" is missing or not a valid CEFR level`);
        if (!Array.isArray(lesson.items) || lesson.items.length === 0)
          e(`lesson ${lesson.id}: items must be a non-empty array`);
        if (unitNum !== null && lesson.unit !== unitNum)
          e(`lesson ${lesson.id}: unit field ${lesson.unit} does not match parent unit number ${unitNum}`);
        if (typeof lesson.lesson === "number")
          playableLessonNums.push(lesson.lesson);

        for (const item of lesson.items ?? []) {
          if (!item.id) { e(`lesson ${lesson.id}: item missing id`); continue; }
          if (itemIds.has(item.id)) e(`item ${item.id}: duplicate id`);
          itemIds.add(item.id);

          const strayItemKeys = Object.keys(item).filter((k) => !ITEM_KEYS.has(k));
          if (strayItemKeys.length)
            e(`item ${item.id}: unknown field(s): ${strayItemKeys.join(", ")}`);

          if (!ITEM_ID_RE.test(item.id))
            e(`item ${item.id}: id must match ${ITEM_ID_RE}`);
          if (!VALID_ITEM_TYPES.includes(item.type))
            e(`item ${item.id}: type "${item.type}" is not valid (must be kana or vocab)`);
          if (!item.front || typeof item.front !== "string" || !item.front.trim())
            e(`item ${item.id}: front is empty`);
          if (!item.reading || typeof item.reading !== "string" || !item.reading.trim())
            e(`item ${item.id}: reading is empty`);
          else {
            const norm = normalizeReading(item.reading);
            if (!/^[a-z]+$/.test(norm))
              e(`item ${item.id}: reading "${item.reading}" normalizes to "${norm}" which contains non-latin characters`);
          }

          if (item.hint !== undefined && (typeof item.hint !== "string" || !item.hint.trim()))
            e(`item ${item.id}: hint must be a non-empty string if present`);

          if (item.type === "kana") {
            if (item.meaning !== null)
              e(`item ${item.id}: kana item must have meaning: null`);
            if (item.example !== null)
              e(`item ${item.id}: kana item must have example: null`);
            if (!KANJIVG[item.front])
              e(`item ${item.id}: kana "${item.front}" has no stroke data in KANJIVG — add it to src/data/kanjivg.js`);
          } else if (item.type === "vocab") {
            if (!item.meaning || typeof item.meaning !== "string" || !item.meaning.trim())
              e(`item ${item.id}: vocab item must have a non-empty meaning`);
            if (
              !item.example ||
              typeof item.example !== "object" ||
              !item.example.jp ||
              !item.example.en
            )
              e(`item ${item.id}: vocab item must have example { jp, en }`);
          }

          allItems.push({ item, lessonCefr: lesson.cefr ?? null });
        }
      }

      // Lesson number continuity within this unit.
      const sortedNums = [...playableLessonNums].sort((a, b) => a - b);
      sortedNums.forEach((n, i) => {
        if (n !== i + 1)
          e(
            `unit ${unit.id}: lesson numbers are not sequential ` +
              `(expected ${i + 1}, found ${n})`
          );
      });
    }
  }

  // Unit order continuity per language.
  for (const [lang, orders] of Object.entries(unitOrdersByLang)) {
    const sorted = [...orders].sort((a, b) => a - b);
    sorted.forEach((o, i) => {
      if (o !== i + 1)
        e(
          `lang ${lang}: unit orders are not contiguous ` +
            `(expected ${i + 1}, found ${o})`
        );
    });
  }

  // Kana accumulation invariant: each kana character introduced at most once
  // across the entire corpus (no re-teaching the same hiragana in a later lesson).
  const kanaFronts = new Map(); // character → first item id
  for (const { item } of allItems) {
    if (item.type !== "kana") continue;
    for (const ch of item.front) {
      if (kanaFronts.has(ch))
        e(
          `item ${item.id}: kana character "${ch}" already introduced in item ${kanaFronts.get(ch)}`
        );
      else kanaFronts.set(ch, item.id);
    }
  }

  // Vocab front uniqueness: a given word (vocab front) gets exactly one home —
  // teaching the same word in two units is a duplicate to dedupe. A vocab front
  // MAY coincide with a kana item's front (e.g. the number-word に / ご is the
  // same single character as the kana — that kana→word reuse is intentional), so
  // this checks vocab against vocab only, never against kana.
  const vocabFronts = new Map(); // front → first item id
  for (const { item } of allItems) {
    if (item.type !== "vocab") continue;
    if (vocabFronts.has(item.front))
      e(
        `item ${item.id}: vocab front "${item.front}" is already taught in item ${vocabFronts.get(item.front)} — ` +
          `a word should have a single home (dedupe the duplicate)`
      );
    else vocabFronts.set(item.front, item.id);
  }

  // Warning: multi-word vocab with no accept[] synonyms. A typed-meaning check
  // against e.g. "good morning" will reject "morning" without an accept entry.
  for (const { item } of allItems) {
    if (item.type !== "vocab") continue;
    const meaning = item.meaning ?? "";
    if (meaning.trim().includes(" ") && (!item.accept || item.accept.length === 0))
      w(
        `item ${item.id}: multi-word meaning "${meaning}" has no accept[] synonyms — ` +
          `typed answers may reject valid paraphrases`
      );
  }

  // Warning: distractor sparseness. A choice card needs at least 3 same-type
  // peers at/below the item's CEFR level to show 4 options.
  for (const { item, lessonCefr } of allItems) {
    if (!lessonCefr) continue;
    const myIdx = CEFR_ORDER[lessonCefr] ?? 0;
    const peers = allItems.filter(
      ({ item: o, lessonCefr: oc }) =>
        o.id !== item.id &&
        o.type === item.type &&
        (CEFR_ORDER[oc] ?? 0) <= myIdx
    );
    if (peers.length < 3)
      w(
        `item ${item.id}: only ${peers.length} same-type distractor(s) at/below ${lessonCefr} ` +
          `(need 3 for a full 4-option choice card)`
      );
  }

  return { errors, warnings };
}
