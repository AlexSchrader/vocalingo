import { test, expect } from "@playwright/test";

// ---- helpers ---------------------------------------------------------------

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// A persisted FSRS-ish card that is already due (so the item enters reviews).
// stability/difficulty present so the store's migrate() leaves it untouched.
function dueCard() {
  return {
    due: new Date(Date.now() - 60_000).toISOString(),
    stability: 2,
    difficulty: 5,
    elapsed_days: 1,
    scheduled_days: 1,
    reps: 1,
    lapses: 0,
    learning_steps: 0,
    state: 2,
    last_review: new Date(Date.now() - 86_400_000).toISOString(),
  };
}

const LANGUAGES = {
  ja: { id: "ja", name: "Japanese", flag: "🇯🇵", target: "B2", unlock: null, unlocked: true, level: "pre-A1", xp: 0 },
  es: { id: "es", name: "Spanish", flag: "🇪🇸", target: "A1", unlock: { lang: "ja", level: "A1" }, unlocked: false, level: "pre-A1", xp: 0 },
  fr: { id: "fr", name: "French", flag: "🇫🇷", target: "A1", unlock: { lang: "es", level: "A1" }, unlocked: false, level: "pre-A1", xp: 0 },
};

// 5 vocab already due, at mixed rungs → 3 multiple-choice + 2 typed reviews.
function reviewState() {
  const v = [
    ["ja-u1l1-ohayou", "おはよう", "ohayō", "good morning", 1],
    ["ja-u1l1-konnichiwa", "こんにちは", "konnichiwa", "hello", 1],
    ["ja-u1l1-sayounara", "さようなら", "sayōnara", "goodbye", 1],
    ["ja-u1l1-hai", "はい", "hai", "yes", 2],
    ["ja-u1l1-iie", "いいえ", "iie", "no", 2],
  ];
  const items = {};
  for (const [id, front, reading, meaning, rung] of v) {
    items[id] = { id, type: "vocab", front, reading, meaning, lang: "ja", unit: 1, lesson: 1, example: null, accept: [], rung, srs: dueCard() };
  }
  return {
    state: {
      items,
      languages: LANGUAGES,
      streak: { current: 0, longest: 0, freezes: 2, lastActive: null },
      stats: { xpTotal: 0 },
      daily: { date: todayISO(), reviewsCleared: false, lessonDone: false },
      ui: {},
    },
    version: 1,
  };
}

// Plays whichever card is on screen by answering CORRECTLY. Returns false once
// the finish screen ("Back to Today") shows.
async function playCard(page) {
  const finish = page.getByRole("button", { name: "Back to Today" });
  const teach = page.getByRole("button", { name: "Got it" });
  const typeCard = page.getByTestId("type-card");
  const option = page.locator('[data-correct="true"]');

  await Promise.race([
    finish.waitFor({ state: "visible", timeout: 8000 }),
    teach.waitFor({ state: "visible", timeout: 8000 }),
    typeCard.waitFor({ state: "visible", timeout: 8000 }),
    option.first().waitFor({ state: "visible", timeout: 8000 }),
  ]).catch(() => {});

  if (await finish.isVisible().catch(() => false)) return false;

  if (await teach.isVisible().catch(() => false)) {
    await teach.click();
    return true;
  }
  if (await typeCard.isVisible().catch(() => false)) {
    const answer = await typeCard.getAttribute("data-answer");
    await page.getByTestId("type-input").fill(answer);
    await page.getByRole("button", { name: "Check" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    return true;
  }
  if (await option.first().isVisible().catch(() => false)) {
    await option.first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    return true;
  }
  return false;
}

// ---- tests -----------------------------------------------------------------

test("app mounts, no blank screen, no page errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); // attach before navigation
  await page.goto("/");
  // Give the app a beat to mount (and throw, if it's going to) before asserting.
  await page.locator("#root > *").first().waitFor({ state: "attached", timeout: 8000 }).catch(() => {});
  // Surface mount-time crashes with their message before the empty-root check.
  expect(errors, errors.join("; ")).toEqual([]);
  await expect(page.locator("#root")).not.toBeEmpty();
  await expect(page.getByText("VocaLingo")).toBeVisible();
});

test("can navigate all four tabs", async ({ page }) => {
  await page.goto("/");
  for (const tab of ["Today", "Ladder", "Haruki", "Stats"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await expect(page.locator("#root")).not.toBeEmpty();
  }
});

test("new words are taught, the loop completes, and it persists", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/"); // fresh state — nothing due, 10 items to teach
  await page.getByRole("button", { name: /start reviews/i }).click();

  for (let i = 0; i < 30; i++) {
    if (!(await playCard(page))) break;
    await page.waitForTimeout(30);
  }
  await page.getByRole("button", { name: "Back to Today" }).click();

  await expect(page.getByText("Lesson complete")).toBeVisible();
  await expect(page.getByText(/1 day\b/)).toBeVisible(); // streak ticked
  await page.reload();
  await expect(page.getByText("Lesson complete")).toBeVisible(); // persisted
  expect(errors).toEqual([]);
});

test("reviews are app-judged — no self-grading, grades persist", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  // Seed ONCE — addInitScript runs before every navigation (incl. reload), so
  // guard it or the reload would clobber the session's persisted progress (the
  // very thing this test verifies).
  await page.addInitScript(
    (json) => {
      if (!localStorage.getItem("vocalingo-v1")) localStorage.setItem("vocalingo-v1", json);
    },
    JSON.stringify(reviewState())
  );
  await page.goto("/");
  await page.getByRole("button", { name: /start reviews/i }).click();

  // A review card is up; there are NO self-grade buttons anywhere.
  await page.locator('[data-correct],[data-testid="type-card"]').first().waitFor({ state: "visible" });
  for (const g of ["Again", "Hard", "Good", "Easy"]) {
    await expect(page.getByRole("button", { name: g, exact: true })).toHaveCount(0);
  }

  for (let i = 0; i < 20; i++) {
    if (!(await playCard(page))) break;
    await page.waitForTimeout(40);
  }
  await page.getByRole("button", { name: "Back to Today" }).click();

  await expect(page.getByText("Reviews cleared")).toBeVisible();
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Reviews cleared")).toBeVisible(); // grades persisted
  expect(errors).toEqual([]);
});
