// Real spaced repetition via FSRS. This module is the single seam between the
// app and the scheduling algorithm: screens and the store only ever call
// newCard / schedule / isDue, so the algorithm can be tuned (or swapped for
// trained weights) without touching anything else.
import { fsrs, generatorParameters, createEmptyCard, Rating } from "ts-fsrs";

// FSRS parameters kept in one exported place so we can tune (or load trained
// weights) later. enable_fuzz spreads due dates slightly to avoid pile-ups.
export const FSRS_PARAMS = generatorParameters({ enable_fuzz: true });

const f = fsrs(FSRS_PARAMS);

const GRADE = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

// A brand-new FSRS card (State.New, due now).
export const newCard = () => createEmptyCard(Date.now());

// Run FSRS for one review and return the updated card. The returned card
// carries due, stability, difficulty, state, reps, lapses, last_review, etc.
// Tolerates cards whose date fields are ISO strings (rehydrated from storage).
export function schedule(card, grade, now = new Date()) {
  return f.repeat(card, now)[GRADE[grade]].card;
}

// Is this card due for review at `now`? Works whether card.due is a Date
// (fresh) or an ISO string (rehydrated from localStorage).
export const isDue = (card, now = Date.now()) =>
  new Date(card.due).getTime() <= now;

// Start of tomorrow (local) as a Date — used when a lesson introduces an item
// and we want its first review the next day rather than immediately.
export function startOfTomorrow() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
}
