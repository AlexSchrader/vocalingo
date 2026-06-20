import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLearnQueue,
  initLearn,
  currentStep,
  answerStep,
  LEARN_OPTS,
} from "../../src/store/learnQueue.js";

const idsOf = (q) => q.map((s) => `${s.id}:${s.step}`);

test("queue: teach < check1 < check2 per item, and no echo", () => {
  const q = buildLearnQueue(["a", "b", "c"]);
  assert.equal(q.length, 9, "3 steps per item");
  for (const id of ["a", "b", "c"]) {
    const t = q.findIndex((s) => s.id === id && s.step === "teach");
    const c1 = q.findIndex((s) => s.id === id && s.step === "check1");
    const c2 = q.findIndex((s) => s.id === id && s.step === "check2");
    assert.ok(t < c1 && c1 < c2, `${id}: teach<check1<check2 (${t},${c1},${c2})`);
    assert.ok(c1 - t >= 2, `${id}: check1 not echoed right after teach (gap ${c1 - t})`);
  }
});

test("queue: clamps past-end offsets to the tail (never drops steps)", () => {
  const q = buildLearnQueue(["a", "b"], { ...LEARN_OPTS, off1: 50, off2: 99 });
  assert.equal(q.length, 6);
  // both teaches come first, checks appended after
  assert.deepEqual(idsOf(q).slice(0, 2), ["a:teach", "b:teach"]);
});

// Drive a session by always passing cleanly → graduates `good`.
test("clean run graduates each item once as good", () => {
  let st = initLearn(["a", "b"]);
  const grads = [];
  let guard = 0;
  while (currentStep(st) && guard++ < 50) {
    const step = currentStep(st);
    const result = step.step === "teach" ? null : { pass: true, clean: true };
    const r = answerStep(st, result);
    if (r.graduated) grads.push(r.graduated);
    st = r.state;
  }
  assert.deepEqual(
    grads.sort((x, y) => x.id.localeCompare(y.id)),
    [{ id: "a", grade: "good" }, { id: "b", grade: "good" }]
  );
});

test("a miss re-queues the step and downgrades graduation to hard", () => {
  let st = initLearn(["a"]);
  let firstCheckMissed = false;
  let grad = null;
  let guard = 0;
  while (currentStep(st) && guard++ < 50) {
    const step = currentStep(st);
    let result = null;
    if (step.step !== "teach") {
      // miss the very first check once, pass everything else
      if (!firstCheckMissed) {
        firstCheckMissed = true;
        result = { pass: false, clean: false };
      } else {
        result = { pass: true, clean: true };
      }
    }
    const r = answerStep(st, result);
    if (r.graduated) grad = r.graduated;
    st = r.state;
  }
  assert.deepEqual(grad, { id: "a", grade: "hard" }, "miss → graduates hard, still graduates");
});

test("missing a step maxMisses times force-graduates (no infinite loop)", () => {
  let st = initLearn(["a"]);
  let grad = null;
  let guard = 0;
  while (currentStep(st) && guard++ < 100) {
    const step = currentStep(st);
    // always miss checks; teaches just advance
    const result = step.step === "teach" ? null : { pass: false, clean: false };
    const r = answerStep(st, result);
    if (r.graduated) grad = r.graduated;
    st = r.state;
  }
  assert.ok(guard < 100, "terminated — no infinite re-queue");
  assert.deepEqual(grad, { id: "a", grade: "hard" });
});
