// Mastery rungs: the learner's depth of knowledge for a single item.
// Rung 0 = "NEW" — seeded into the deck but not yet started (NOT "seen"; every
// item, including future lessons, sits here until a lesson graduates it to rung 1).
// These are DISPLAY labels only; all rung logic is by index.
export const RUNGS = ["NEW", "RECOGNIZED", "RECALLED", "PRODUCED", "SPOKEN", "MASTERED"];
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

// --- Mastery (per-item depth, 0..1) ----------------------------------------
// Distinct from rung (the qualitative stage: recognize → recall → produce …).
// Mastery is QUANTITATIVE depth: how well-retained the item is, driven by FSRS
// `stability` (days of expected retention). Stability grows with each successful
// spaced review and is the real "you've mastered it = you'll still remember it
// weeks later" signal — better than a raw review count, which cramming inflates.
// Reachable with the cards we have today (no speaking required): just keep
// reviewing successfully and stability climbs.
//
// MASTERY_FULL_DAYS is the tuning knob: stability (in days) at which an item is
// considered fully mastered. Lower = easier to "master"; higher = stricter.
export const MASTERY_FULL_DAYS = 45;

export function masteryPct(item) {
  const stability = Number(item?.srs?.stability) || 0;
  return Math.max(0, Math.min(1, stability / MASTERY_FULL_DAYS));
}

export function isMastered(item) {
  return masteryPct(item) >= 1;
}
