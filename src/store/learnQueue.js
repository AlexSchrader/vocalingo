// Session-local learning queue (Brief A.1). New items run a fixed in-session
// sequence — teach, then an interleaved recognition check, then a recall check —
// before graduating to FSRS spaced review. This is hand-rolled (NOT ts-fsrs
// learning state, which is wall-clock minutes); spacing here is by queue
// POSITION within one sitting. FSRS/rung/XP fire only at graduation, never per
// check — the runner calls store.graduateItem once when an item passes.
//
// Pure + ephemeral: the runner holds this in component state; nothing persists.
// An abandoned session just re-teaches next time.

export const LEARN_OPTS = {
  off1: 3, // recognition check ~3 cards after teach
  off2: 6, // recall check ~6 cards after teach
  missOffset: 2, // a missed check re-appears ~2 cards later
  maxMisses: 2, // after this many misses on a step, graduate anyway (as `hard`)
};

// Build the initial interleaved queue. Each item contributes teach + check1 +
// check2 at virtual slots (i, i+off1, i+off2); a stable sort by slot interleaves
// them and clamps past-the-end checks to the tail. The tie-rank (teach 0 <
// check1 1 < check2 2) guarantees, per item, teach < check1 < check2 and that a
// check never lands right after its own teach (no echo).
export function buildLearnQueue(ids, opts = LEARN_OPTS) {
  const entries = [];
  ids.forEach((id, i) => {
    entries.push({ id, step: "teach", k: i * 10 + 0 });
    entries.push({ id, step: "check1", k: (i + opts.off1) * 10 + 1 });
    entries.push({ id, step: "check2", k: (i + opts.off2) * 10 + 2 });
  });
  entries.sort((a, b) => a.k - b.k);
  return entries.map(({ id, step }) => ({ id, step }));
}

export function initLearn(ids, opts = LEARN_OPTS) {
  const status = {};
  for (const id of ids) {
    status[id] = { c1: false, c2: false, m1: 0, m2: 0, clean: true, graduated: false };
  }
  return { queue: buildLearnQueue(ids, opts), pos: 0, status, opts };
}

export function currentStep(st) {
  return st.pos < st.queue.length ? st.queue[st.pos] : null;
}

// Advance the queue by one step.
//   result: { pass, clean } for a check; null/undefined for a teach.
// Returns { state, graduated } where graduated is { id, grade } the one time an
// item passes both checks (grade `good` if clean, else `hard`), else null.
export function answerStep(st, result) {
  const cur = st.queue[st.pos];
  if (!cur) return { state: st, graduated: null };

  const queue = st.queue.slice();
  const status = { ...st.status };
  const pos = st.pos + 1;
  let graduated = null;

  if (cur.step !== "teach") {
    const s = { ...status[cur.id] };
    const passKey = cur.step === "check1" ? "c1" : "c2";
    const missKey = cur.step === "check1" ? "m1" : "m2";

    if (result && result.pass) {
      s[passKey] = true;
      if (!result.clean) s.clean = false;
    } else {
      s[missKey] += 1;
      s.clean = false;
      if (s[missKey] < st.opts.maxMisses) {
        // repeat this step a couple of cards later
        const at = Math.min(pos + st.opts.missOffset, queue.length);
        queue.splice(at, 0, { id: cur.id, step: cur.step });
      } else {
        s[passKey] = true; // graduate anyway, no frustration loop
      }
    }

    if (s.c1 && s.c2 && !s.graduated) {
      s.graduated = true;
      graduated = { id: cur.id, grade: s.clean ? "good" : "hard" };
    }
    status[cur.id] = s;
  }

  return { state: { ...st, queue, pos, status }, graduated };
}
