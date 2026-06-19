import { LANGUAGES } from "./ja/languages.js";
import { UNIT1 } from "./ja/unit1.js";

// All units across all languages. Only Japanese Unit 1 exists for now.
export const UNITS = [UNIT1];

export { LANGUAGES };

// Flatten every lesson with playable items into a list of seed Items.
// `lang`, `unit`, and `lesson` are stamped onto each item here in code so the
// seed data files stay terse (no hand-repeating per item).
export function seedItems() {
  const out = {};
  for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      if (!lesson.items) continue; // locked stub lessons have no items yet
      for (const item of lesson.items) {
        out[item.id] = {
          ...item,
          lang: unit.lang,
          unit: lesson.unit,
          lesson: lesson.lesson,
          meaning: item.meaning ?? null,
          example: item.example ?? null,
          // srs (an FSRS card) is attached by the store's seedOnce, not here,
          // so this stays a pure content loader.
          rung: 0,
        };
      }
    }
  }
  return out;
}

// Look up a lesson definition (with its items) by id.
export function getLesson(lessonId) {
  for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      if (lesson.id === lessonId) return { ...lesson, lang: unit.lang };
    }
  }
  return null;
}
