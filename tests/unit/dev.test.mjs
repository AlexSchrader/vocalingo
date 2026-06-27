import test from "node:test";
import assert from "node:assert/strict";
import {
  matchesDevCode,
  DEV_CODE,
  buildSandboxItems,
  runnerWriters,
  NOOP,
  devDiagnostics,
  sandboxRoute,
  PREVIEW_STATES,
} from "../../src/store/dev.js";
import { initLearn, currentStep, answerStep } from "../../src/store/learnQueue.js";
import { getLesson } from "../../src/data/index.js";
import { useStore } from "../../src/store/useStore.js";

test("dev code matches case-insensitively and trims, rejects others", () => {
  assert.ok(matchesDevCode(DEV_CODE));
  assert.ok(matchesDevCode(`  ${DEV_CODE.toLowerCase()} `));
  assert.ok(!matchesDevCode("nope"));
  assert.ok(!matchesDevCode(""));
  assert.ok(!matchesDevCode(null));
});

test("buildSandboxItems is a clean throwaway map; only the target lesson is touched", () => {
  const lesson = getLesson("ja-u1l1");
  const ids = lesson.items.map((d) => d.id);

  const fresh = buildSandboxItems("ja-u1l1", "fresh");
  for (const id of ids) assert.equal(fresh[id].rung, 0, `${id} fresh → rung 0`);

  const mastered = buildSandboxItems("ja-u1l1", "mastered");
  for (const id of ids) {
    assert.equal(mastered[id].rung, 5, `${id} mastered → rung 5`);
    assert.ok(mastered[id].srs.stability > 0, `${id} mastered → stability > 0`);
  }

  // Items outside the previewed lesson stay at the rung-0 seed in every state.
  const otherId = Object.keys(mastered).find((id) => !ids.includes(id));
  assert.equal(mastered[otherId].rung, 0, "non-lesson items untouched");
});

test("runnerWriters swaps every writer for a no-op in sandbox, passthrough otherwise", () => {
  const real = { a: () => 1, b: () => 2 };
  assert.equal(runnerWriters(false, real), real, "real mode → genuine writers");
  const sb = runnerWriters(true, real);
  for (const k of Object.keys(real)) assert.equal(sb[k], NOOP, `${k} → NOOP in sandbox`);
});

// THE CRITICAL ISOLATION TEST: a full Dev-Mode lesson run must leave the
// persisted store byte-identical. We drive the real learn queue against the
// sandbox items and the sandbox writers, exactly as the runner does.
test("a dev (sandbox) lesson run leaves the persisted store unchanged", () => {
  const store = useStore.getState();
  store.seedOnce();

  // Do a real graduation first so the store holds non-trivial state to protect.
  const realLesson = getLesson("ja-u1l1");
  store.graduateItem(realLesson.items[0].id, "good");
  store.completeLesson(realLesson.id);

  const persistedKeys = ["items", "languages", "streak", "stats", "daily", "devMode"];
  const snapshot = () => {
    const s = useStore.getState();
    return JSON.stringify(Object.fromEntries(persistedKeys.map((k) => [k, s[k]])));
  };
  const before = snapshot();

  // Simulate the Dev-Mode runner: sandbox items + no-op writers.
  const sandboxItems = buildSandboxItems("ja-u2l1", "fresh");
  const writers = runnerWriters(true, {
    graduateItem: useStore.getState().graduateItem,
    completeLesson: useStore.getState().completeLesson,
    rollDailyGoal: useStore.getState().rollDailyGoal,
  });

  const freshIds = Object.values(sandboxItems)
    .filter((it) => it.lesson === 1 && it.unit === 2 && (it.rung ?? 0) < 1)
    .map((it) => it.id);
  assert.ok(freshIds.length > 0, "sandbox lesson has fresh items to teach");

  let st = initLearn(freshIds);
  let guard = 0;
  while (currentStep(st) && guard++ < 500) {
    const step = currentStep(st);
    const result = step.step === "teach" ? null : { pass: true, clean: true };
    const r = answerStep(st, result);
    if (r.graduated) writers.graduateItem(r.graduated.id, r.graduated.grade);
    st = r.state;
  }
  writers.completeLesson("ja-u2l1");
  writers.rollDailyGoal();

  assert.equal(snapshot(), before, "persisted store is byte-identical after a dev run");
});

test("devDiagnostics reports coherent counts and flags missing stroke data", () => {
  const d = devDiagnostics();
  assert.ok(d.unitCount >= 1);
  assert.ok(d.lessonCount >= 1);
  assert.ok(d.itemCount > 0);
  assert.equal(d.kanaWithStroke + d.kanaMissing.length, d.kanaTotal, "stroke counts add up");
  assert.ok(Array.isArray(d.units) && d.units.length === d.unitCount);
});

test("sandboxRoute: fresh → lesson teach flow, mid/mastered → review flow, all sandboxed", () => {
  assert.equal(sandboxRoute("ja-u1l1", "fresh"), "/lesson/ja-u1l1?sandbox=1&state=fresh");
  assert.equal(sandboxRoute("ja-u1l1", "mid"), "/review?sandbox=1&state=mid&lesson=ja-u1l1");
  assert.equal(sandboxRoute("ja-u1l1", "mastered"), "/review?sandbox=1&state=mastered&lesson=ja-u1l1");
  for (const s of PREVIEW_STATES) assert.ok(sandboxRoute("ja-u1l1", s).includes("sandbox=1"));
});
