import { KANJIVG } from "./kanjivg.js";

// Curriculum lint — the mechanical authoring rules CC used to check by hand, now
// an automated gate (BUILD-BRIEF-curriculum-lint.md, Part 1). This is a LAYER ON
// TOP of contract.js's `validateContent` (which already enforces id format +
// uniqueness, stage enum, kana-front and vocab-front uniqueness, KanjiVG-for-kana,
// and reading normalizability). Here we add the rules a lint can mechanically
// enforce but the contract didn't yet: per-type key sets, the romaji/macron
// reading STYLE, を=wo, gojūon ordering within a script unit, teach-front scope,
// per-lesson density, and forward-compatible kanji rules.
//
// What the lint CANNOT check is language NATURALNESS (particle choice, register,
// idiomatic collocation) — that's the batched native-speaker gate (brief Part 2),
// never a test and never in Claude's required path.
//
// Returns { errors, warnings }. errors → CI fails; warnings → advisory.

const VALID_STAGE = ["pre-a1", "a1", "a2", "b1", "b2"];
const STAGE_RANK = { "pre-a1": 0, a1: 1, a2: 2, b1: 3, b2: 4 };

// Exact key set allowed per item type. A key outside the set is a stray-key error;
// every required key must be present.
const TYPE_KEYS = {
  kana: { required: ["id", "type", "front", "reading", "meaning", "example"], optional: ["hint"] },
  vocab: { required: ["id", "type", "front", "reading", "meaning", "example", "accept"], optional: ["hint"] },
  // Forward-compatible: a `kanji` item type doesn't exist in the contract yet
  // (validateContent rejects it). When it ships, these rules activate.
  kanji: { required: ["id", "type", "front", "reading", "meaning", "example", "accept"], optional: ["hint"] },
};

// Gojūon order as CHARACTERS (not readings — ぢ/づ share readings with じ/ず, so a
// reading-keyed rank would mis-order the d-row). Base 46 → dakuten → handakuten,
// for hiragana and katakana. A kana item's rank is its front char's index here;
// within a single-script unit the ranks must be non-decreasing in authored order.
const HIRA_ORDER =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
  "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
const KATA_ORDER =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
const GOJUON_RANK = {};
[HIRA_ORDER, KATA_ORDER].forEach((s) => [...s].forEach((ch, i) => { GOJUON_RANK[ch] = i; }));

const isKana = (ch) => {
  const cp = ch.codePointAt(0);
  return (cp >= 0x3040 && cp <= 0x309f) || (cp >= 0x30a0 && cp <= 0x30ff);
};

// A reading is well-formed romaji: lowercase, only a-z + the long-vowel macrons,
// and it spells long o/u with a macron (ō/ū) rather than ou/oo/uu. Per the brief,
// ei stays ei and ii stays ii (native long vowels), so those are NOT flagged.
const READING_CHARSET = /^[a-zāēīōū]+$/;
const MACRON_SHOULD_BE = /(ou|oo|uu)/; // these long vowels should be ō/ū

export function lintCurriculum(units = []) {
  const errors = [];
  const warnings = [];
  const e = (msg) => errors.push(msg);
  const w = (msg) => warnings.push(msg);

  const vocabFronts = new Map(); // front → id  (kanji included; kana→word reuse stays allowed)
  const introduced = new Set(); // kana/kanji chars introduced so far, in queue order

  for (const unit of units) {
    if (!Array.isArray(unit.lessons)) continue;
    const unitStage = unit.stage;
    const kanaRanksInUnit = []; // [{rank, id}] for gojūon-order check

    for (const lesson of unit.lessons) {
      if (lesson.locked || !Array.isArray(lesson.items)) continue;

      let vocabCount = 0;
      for (const item of lesson.items) {
        const id = item.id ?? "(no id)";
        const type = item.type;

        // --- per-type exact key set ---
        const spec = TYPE_KEYS[type];
        if (spec) {
          const allowed = new Set([...spec.required, ...spec.optional]);
          for (const k of Object.keys(item)) {
            if (!allowed.has(k)) e(`item ${id}: key "${k}" is not allowed on a ${type} item`);
          }
          for (const k of spec.required) {
            if (!(k in item)) e(`item ${id}: ${type} item is missing required key "${k}"`);
          }
        }

        // --- reading style (romaji / macron) ---
        const r = item.reading;
        if (typeof r === "string" && r.length) {
          if (r !== r.toLowerCase()) e(`item ${id}: reading "${r}" must be lowercase`);
          else if (!READING_CHARSET.test(r))
            e(`item ${id}: reading "${r}" has characters outside [a-z] + macrons (ō ū ā ē ī)`);
          else if (MACRON_SHOULD_BE.test(r))
            e(`item ${id}: reading "${r}" spells a long vowel as ou/oo/uu — use a macron (ō/ū)`);
        }

        // --- を / ヲ must read "wo" ---
        if ((item.front === "を" || item.front === "ヲ") && r !== "wo")
          e(`item ${id}: "${item.front}" must have reading "wo" (got "${r}")`);

        if (type === "vocab" || type === "kanji") {
          vocabCount++; // both are "word" cards for density purposes
          // accept[] present (may be empty)
          if (!Array.isArray(item.accept))
            w(`item ${id}: ${type} should have an accept[] array (may be empty)`);
          // global word-front uniqueness (kana→word reuse allowed: kana fronts not tracked here)
          if (typeof item.front === "string") {
            if (vocabFronts.has(item.front))
              e(`item ${id}: word front "${item.front}" already taught in ${vocabFronts.get(item.front)}`);
            else vocabFronts.set(item.front, id);
          }
        }

        if (type === "kana" || type === "kanji") {
          // stroke data required
          if (typeof item.front === "string" && !KANJIVG[item.front])
            e(`item ${id}: ${type} "${item.front}" has no KanjiVG stroke entry`);
          // kanji only in a1+ stages
          if (type === "kanji" && (STAGE_RANK[unitStage] ?? 0) < STAGE_RANK.a1)
            e(`item ${id}: kanji items are not allowed in a "${unitStage}" unit (a1+ only)`);
          // scope: every char in a teach front must already be introduced (or be
          // this item's own single new glyph). Vocab/example words are exempt.
          if (typeof item.front === "string") {
            const chars = [...item.front].filter(isKana);
            const newGlyph = chars.length === 1 ? chars[0] : null;
            for (const ch of chars) {
              if (ch !== newGlyph && !introduced.has(ch))
                e(`item ${id}: teach front uses "${ch}" before it is introduced`);
            }
            if (type === "kana" && chars.length !== 1)
              e(`item ${id}: a kana item's front must be exactly one kana (got "${item.front}")`);
            chars.forEach((ch) => introduced.add(ch));
          }
          // collect gojūon rank for the unit-order check
          if (type === "kana" && GOJUON_RANK[item.front] !== undefined)
            kanaRanksInUnit.push({ rank: GOJUON_RANK[item.front], id });
        }
      }

      // --- density: ~5–8 word cards per lesson; 0 is an error ---
      if (vocabCount === 0) e(`lesson ${lesson.id}: has no vocab/kanji word cards`);
      else if (vocabCount < 5 || vocabCount > 8)
        w(`lesson ${lesson.id}: ${vocabCount} word cards (recommend 5–8)`);
    }

    // --- gojūon order within this (script) unit ---
    for (let i = 1; i < kanaRanksInUnit.length; i++) {
      if (kanaRanksInUnit[i].rank < kanaRanksInUnit[i - 1].rank) {
        e(`item ${kanaRanksInUnit[i].id}: kana is out of gojūon order within ${unit.id}`);
        break; // one message per unit is enough
      }
    }
  }

  return { errors, warnings };
}
