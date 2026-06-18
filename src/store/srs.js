// Simple, swappable interval scheduler. Isolated here so FSRS can drop in later
// without touching screens or the store's calling convention.
//
// schedule(srs, grade) -> new srs state
//   grade ∈ {again, hard, good, easy}

export const DAY_MS = 24 * 60 * 60 * 1000;

// Start of "today" in local time, as an epoch-ms timestamp.
export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function schedule(srs, grade) {
  const prev = srs.intervalDays || 0;
  let { ease, reps, lapses } = srs;
  let intervalDays;

  switch (grade) {
    case "again":
      intervalDays = 0; // due today
      ease = Math.max(1.3, ease - 0.2);
      lapses += 1;
      break;
    case "hard":
      intervalDays = Math.max(1, Math.round(prev * 1.2));
      ease = Math.max(1.3, ease - 0.05);
      break;
    case "good":
      intervalDays = Math.max(1, Math.round((prev || 1) * ease));
      reps += 1;
      break;
    case "easy":
      intervalDays = Math.max(2, Math.round((prev || 1) * ease * 1.3));
      reps += 1;
      break;
    default:
      intervalDays = prev;
  }

  const due = startOfToday() + intervalDays * DAY_MS;
  return { ease, intervalDays, due, reps, lapses };
}
