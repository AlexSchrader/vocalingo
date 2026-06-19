import test from "node:test";
import assert from "node:assert/strict";
import { migrateState } from "../../src/store/migrate.js";
import { newCard } from "../../src/store/srs.js";

test("migrates old v0.1 srs shape to an FSRS card, preserving progress", () => {
  const persisted = {
    items: {
      "ja-u1l1-a": {
        id: "ja-u1l1-a",
        rung: 2,
        // the old toy scheduler shape
        srs: { ease: 2.3, intervalDays: 5, due: 1234567890, reps: 3, lapses: 1 },
      },
    },
    streak: { current: 4, longest: 9 },
    stats: { xpTotal: 120 },
  };

  const out = migrateState(persisted, 0);
  const item = out.items["ja-u1l1-a"];

  assert.equal(item.rung, 2, "rung is preserved");
  assert.ok(
    item.srs.stability != null && item.srs.difficulty != null,
    "srs is now an FSRS card"
  );
  assert.equal(item.srs.intervalDays, undefined, "old toy field is gone");
  assert.equal(out.streak.current, 4, "unrelated progress survives");
  assert.equal(out.stats.xpTotal, 120, "unrelated progress survives");
});

test("leaves already-FSRS cards untouched", () => {
  const card = newCard();
  const persisted = { items: { x: { id: "x", rung: 1, srs: card } } };
  const out = migrateState(persisted, 1);
  assert.equal(out.items.x.srs, card, "existing FSRS card is not replaced");
});

test("does not crash on missing or empty state", () => {
  assert.equal(migrateState(undefined, 0), undefined);
  assert.deepEqual(migrateState({}, 0), {});
  assert.deepEqual(migrateState({ items: {} }, 0), { items: {} });
});
