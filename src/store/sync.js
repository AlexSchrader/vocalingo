// Cloud-sync decision logic — PURE and dependency-free so it's unit-tested in
// isolation (no Supabase, no network). The actual transport (Supabase client,
// auth, debounced upload) lives in the wiring layer; this module only answers
// the one question that's easy to get dangerously wrong:
//
//   "On sign-in, should this device PUSH its local progress up, or PULL the
//    cloud's progress down?"
//
// Model: last-write-wins by timestamp, with a new-device safety. Each cloud row
// carries an `updatedAt`; the local store carries a `lastModified` (bumped on any
// progress change). Simultaneous edits on two devices are vanishingly rare for a
// solo learner, so a merge engine isn't worth the complexity or the risk — but
// silently clobbering real progress IS the thing to prevent, so:
//
//   - No cloud row yet            → PUSH  (first login = migrate this device up)
//   - Local has no real progress  → PULL  (fresh device must not overwrite cloud)
//   - Cloud newer than local      → PULL
//   - otherwise                   → PUSH

// The persisted slice that travels to/from the cloud. Must mirror `partialize`
// in useStore.js — keep the two in lockstep when either changes.
export const SYNC_KEYS = ["items", "languages", "streak", "stats", "daily", "devMode", "settings"];

// Pull just the synced slice out of a full store snapshot.
export function extractProgress(state = {}) {
  const out = {};
  for (const k of SYNC_KEYS) if (state[k] !== undefined) out[k] = state[k];
  return out;
}

// Does this blob represent a learner who has actually done something? A brand-new
// device (seeded items at rung 0, no streak/stats) has NO meaningful progress, so
// signing in there must PULL the cloud rather than push an empty store over it.
export function hasMeaningfulProgress(blob = {}) {
  const items = blob.items ?? {};
  for (const id in items) {
    if ((items[id]?.rung ?? 0) > 0) return true;
  }
  if ((blob.streak?.count ?? blob.streak ?? 0) > 0) return true;
  const stats = blob.stats ?? {};
  for (const k in stats) {
    if (Number(stats[k]) > 0) return true;
  }
  return false;
}

// The core decision. `local` / `cloud` are { updatedAt:number|null, blob:object|null }.
// `cloud` is null when no row exists yet. Returns "push" | "pull".
export function chooseSource(local, cloud) {
  if (!cloud || cloud.blob == null) return "push"; // first login: migrate up
  if (!hasMeaningfulProgress(local?.blob)) return "pull"; // fresh device safety
  const localAt = Number(local?.updatedAt) || 0;
  const cloudAt = Number(cloud?.updatedAt) || 0;
  return cloudAt > localAt ? "pull" : "push";
}
