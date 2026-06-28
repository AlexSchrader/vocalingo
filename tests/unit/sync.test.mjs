import test from "node:test";
import assert from "node:assert/strict";
import { chooseSource, hasMeaningfulProgress, extractProgress, SYNC_KEYS } from "../../src/store/sync.js";

const withProgress = { items: { "ja-u1l1-a": { rung: 2 } } };
const empty = { items: { "ja-u1l1-a": { rung: 0 } }, streak: { count: 0 }, stats: {} };

test("first login (no cloud row) → push the local progress up", () => {
  assert.equal(chooseSource({ updatedAt: 100, blob: withProgress }, null), "push");
  assert.equal(chooseSource({ updatedAt: 100, blob: withProgress }, { updatedAt: 0, blob: null }), "push");
});

test("fresh device with no real progress → pull (never overwrite cloud with empty)", () => {
  // Local is newer by clock, but it's empty — must still PULL.
  assert.equal(
    chooseSource({ updatedAt: 999, blob: empty }, { updatedAt: 1, blob: withProgress }),
    "pull"
  );
});

test("cloud newer than a device that has progress → pull", () => {
  assert.equal(
    chooseSource({ updatedAt: 100, blob: withProgress }, { updatedAt: 200, blob: withProgress }),
    "pull"
  );
});

test("local newer (or equal) and has progress → push", () => {
  assert.equal(
    chooseSource({ updatedAt: 200, blob: withProgress }, { updatedAt: 100, blob: withProgress }),
    "push"
  );
  assert.equal(
    chooseSource({ updatedAt: 100, blob: withProgress }, { updatedAt: 100, blob: withProgress }),
    "push"
  );
});

test("hasMeaningfulProgress: rung>0, streak, or any positive stat counts", () => {
  assert.equal(hasMeaningfulProgress({ items: { x: { rung: 1 } } }), true);
  assert.equal(hasMeaningfulProgress({ streak: { count: 3 } }), true);
  assert.equal(hasMeaningfulProgress({ stats: { learned: 5 } }), true);
  assert.equal(hasMeaningfulProgress({ items: { x: { rung: 0 } }, streak: { count: 0 }, stats: {} }), false);
  assert.equal(hasMeaningfulProgress({}), false);
});

test("extractProgress copies exactly the synced keys, nothing else", () => {
  const full = { items: 1, languages: 2, streak: 3, stats: 4, daily: 5, devMode: 6, settings: 7, ui: 99, junk: 0 };
  assert.deepEqual(Object.keys(extractProgress(full)).sort(), [...SYNC_KEYS].sort());
  assert.equal(extractProgress(full).ui, undefined);
});
