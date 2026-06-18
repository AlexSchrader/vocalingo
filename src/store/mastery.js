// Mastery rungs: the learner's depth of knowledge for a single item.
export const RUNGS = ["SEEN", "RECOGNIZED", "RECALLED", "PRODUCED", "SPOKEN", "MASTERED"];
export const MAX_RUNG = RUNGS.length - 1; // 5

export function rungName(rung) {
  return RUNGS[Math.max(0, Math.min(MAX_RUNG, rung))];
}

// Advance or hold an item's rung based on a review result.
// A correct answer (good/easy) climbs one rung; "hard" holds; a wrong answer
// (again) drops one rung. Clamped to [0, MAX_RUNG].
export function nextRung(item, grade) {
  const cur = item.rung ?? 0;
  let next = cur;
  if (grade === "again") next = cur - 1;
  else if (grade === "hard") next = cur; // hold
  else if (grade === "good" || grade === "easy") next = cur + 1;
  return Math.max(0, Math.min(MAX_RUNG, next));
}

// Gate check: is an item considered "due"-eligible? Items must have at least
// been RECOGNIZED (rung >= 1) to enter the review queue. Fresh (rung 0) items
// only enter via a lesson.
export function isReviewable(item) {
  return (item.rung ?? 0) >= 1;
}
