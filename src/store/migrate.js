import { newCard } from "./srs.js";

// Persisted-state version. Bumped from the implicit v0 (old toy scheduler) to
// v1 when item.srs became an FSRS Card. Increment + extend migrateState for
// future shape changes.
export const PERSIST_VERSION = 1;

// One-time migration run by Zustand's persist on rehydrate. Any item whose srs
// predates FSRS (no stability/difficulty fields) gets a fresh FSRS card, while
// rung and every other piece of progress is preserved. Never throws on missing
// or partial state.
export function migrateState(persisted, _version) {
  if (!persisted || !persisted.items) return persisted;
  const items = {};
  for (const [id, it] of Object.entries(persisted.items)) {
    const hasCard =
      it?.srs && it.srs.stability != null && it.srs.difficulty != null;
    items[id] = hasCard ? it : { ...it, srs: newCard() };
  }
  return { ...persisted, items };
}
