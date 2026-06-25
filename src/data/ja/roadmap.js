// Planned units not yet authored — shown as "Coming soon" on the Ladder so the
// climb ahead is visible and the app doesn't feel empty. These are PLACEHOLDERS
// (title + theme only, no content). When a unit is authored it moves into UNITS
// and drops off this list. Keyed by language so the Ladder stays data-driven.
export const ROADMAP = {
  ja: [
    { title: "濁点・半濁点", theme: "Voiced sounds — が・ざ・だ・ば・ぱ", cefr: "A1" },
    { title: "カタカナ", theme: "The katakana script", cefr: "A1" },
    { title: "Particles", theme: "Build sentences — は・が・を・に", cefr: "A2" },
    { title: "First kanji", theme: "Numbers, days, everyday kanji", cefr: "A2" },
  ],
};

export const roadmapFor = (lang) => ROADMAP[lang] ?? [];
