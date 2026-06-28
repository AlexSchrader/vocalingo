// Planned units not yet authored — shown as "Coming soon" on the Ladder so the
// climb ahead is visible and the app doesn't feel empty. These are PLACEHOLDERS
// (title + theme only, no content). When a unit is authored it moves into UNITS
// and drops off this list. Keyed by language so the Ladder stays data-driven.
// `stage` matches the unit `stage` enum (contract.js) so the Ladder groups these
// under the same section headers as authored units. (Katakana is fully authored
// in Units 4-6, so it's no longer a roadmap placeholder.)
export const ROADMAP = {
  ja: [
    { title: "More kanji", theme: "Days, time, and everyday N5 kanji", cefr: "A1", stage: "a1" },
    { title: "Particles & grammar", theme: "Build sentences — は・が・を・に・で", cefr: "A1", stage: "a1" },
    { title: "A2 — N4", theme: "More grammar, kanji and vocabulary", cefr: "A2", stage: "a2" },
  ],
};

export const roadmapFor = (lang) => ROADMAP[lang] ?? [];
