// Dev Mode — pure logic for the hidden playtest panel (Settings → unlock code).
// Everything here is store-agnostic and side-effect-free so it can be unit-tested
// and, critically, so a Dev-Mode lesson run can be proven NOT to touch real state.
//
// This is an unlock *convenience* for solo playtesting, NOT security: the code
// below ships in the client bundle. Nothing sensitive is gated behind it.

import { seedItems, UNITS } from "../data/index.js";
import { getLesson } from "../data/index.js";
import { KANJIVG } from "../data/kanjivg.js";
import { newCard } from "./srs.js";

// The unlock code. Intentionally in the bundle — see note above.
export const DEV_CODE = "L071201";

export function matchesDevCode(input) {
  return String(input ?? "").trim().toUpperCase() === DEV_CODE;
}

// Preview states for the layout-state preview: view a lesson as fresh /
// mid-progress / mastered to check those UI states without grinding to them.
export const PREVIEW_STATES = ["fresh", "mid", "mastered"];

export const PREVIEW_LABEL = {
  fresh: "Fresh",
  mid: "Mid-progress",
  mastered: "Mastered",
};

// Rung + FSRS-stability overrides applied to the target lesson's items for each
// preview state. `fresh` leaves items at rung 0 (a real first-teach lesson);
// `mid`/`mastered` lift them into the review track at the matching depth so the
// review runner surfaces the recall / produce card UIs.
const PREVIEW_OVERRIDES = {
  fresh: { rung: 0, stability: 0 },
  mid: { rung: 2, stability: 8 },
  mastered: { rung: 5, stability: 60 },
};

// Build a THROWAWAY items map for an isolated Dev-Mode run. Starts from a clean
// seed (every item rung 0 / fresh FSRS card) and applies the preview override to
// the target lesson's items only. Pure: never reads or writes the persisted
// store, so the run is fully sandboxed by construction.
export function buildSandboxItems(lessonId, previewState = "fresh") {
  const seed = seedItems();
  const items = {};
  for (const [id, it] of Object.entries(seed)) items[id] = { ...it, srs: newCard() };

  const lesson = getLesson(lessonId);
  if (!lesson?.items) return items;

  const ov = PREVIEW_OVERRIDES[previewState] ?? PREVIEW_OVERRIDES.fresh;
  const duePast = new Date(Date.now() - 1000);
  for (const def of lesson.items) {
    const it = items[def.id];
    if (!it) continue;
    items[def.id] = {
      ...it,
      rung: ov.rung,
      srs: { ...it.srs, stability: ov.stability, due: duePast },
    };
  }
  return items;
}

// The isolation contract, made explicit and testable. A runner asks for the
// store writers it would call; in sandbox mode every one is swapped for a no-op,
// guaranteeing a Dev-Mode run leaves persisted state byte-identical. Real mode
// returns the genuine writers untouched.
export const NOOP = () => {};

export function runnerWriters(sandbox, real) {
  if (!sandbox) return real;
  const out = {};
  for (const key of Object.keys(real)) out[key] = NOOP;
  return out;
}

// Diagnostics readout — the "is the new unit wired right" check. Pure: reads the
// static UNITS data + KanjiVG table, no store. Flags any kana missing stroke data.
export function devDiagnostics() {
  const items = Object.values(seedItems());
  const kana = items.filter((it) => it.type === "kana");
  const kanaMissing = kana.filter((it) => !KANJIVG[it.front]).map((it) => it.front);

  const units = UNITS.map((u) => {
    const lessons = u.lessons.filter((l) => l.items);
    return {
      id: u.id,
      title: u.title,
      order: u.order ?? null,
      lessonCount: lessons.length,
      itemCount: lessons.reduce((n, l) => n + l.items.length, 0),
    };
  });

  return {
    unitCount: UNITS.length,
    lessonCount: units.reduce((n, u) => n + u.lessonCount, 0),
    itemCount: items.length,
    kanaTotal: kana.length,
    kanaWithStroke: kana.length - kanaMissing.length,
    kanaMissing,
    units,
  };
}

// Build the route for an isolated run of a lesson in a given preview state.
// Fresh runs the teach flow (a real first-teach); mid/mastered run the review
// flow at the matching depth. Both carry sandbox=1 so the runners isolate.
export function sandboxRoute(lessonId, previewState) {
  if (previewState === "fresh") {
    return `/lesson/${lessonId}?sandbox=1&state=fresh`;
  }
  return `/review?sandbox=1&state=${previewState}&lesson=${lessonId}`;
}
