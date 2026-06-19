import { test, expect } from "@playwright/test";

test("app mounts, no blank screen, no page errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("#root")).not.toBeEmpty();
  await expect(page.getByText("VocaLingo")).toBeVisible();
  expect(errors).toEqual([]);
});

test("can navigate all four tabs", async ({ page }) => {
  await page.goto("/");
  for (const tab of ["Today", "Ladder", "Haruki", "Stats"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await expect(page.locator("#root")).not.toBeEmpty();
  }
});

// Plays whatever card is currently on screen. Returns false once the session is
// over (the "Back to Today" button is showing).
async function playOneCard(page) {
  const done = page.getByRole("button", { name: "Back to Today" });
  // Wait for the next card's control (or the finish screen) to actually render
  // before probing, so we don't read a mid-transition frame.
  const anyControl =
    '[data-testid="reveal"],[data-testid="trace-pad"],[data-testid="record"],[data-testid="tile"]';
  await Promise.race([
    page.locator(anyControl).first().waitFor({ state: "visible", timeout: 8000 }),
    done.waitFor({ state: "visible", timeout: 8000 }),
  ]).catch(() => {});

  if (await done.isVisible().catch(() => false)) {
    return false;
  }
  // Recall card
  const reveal = page.getByTestId("reveal");
  if (await reveal.isVisible().catch(() => false)) {
    await reveal.click();
    await page.getByRole("button", { name: "Good" }).click();
    return true;
  }
  // Trace card — tap the pad, then continue
  const pad = page.getByTestId("trace-pad");
  if (await pad.isVisible().catch(() => false)) {
    await pad.click();
    await page.getByRole("button", { name: "Continue" }).click();
    return true;
  }
  // Build card — tap every tile, then continue
  const tiles = page.getByTestId("tile");
  if (await tiles.first().isVisible().catch(() => false)) {
    const n = await tiles.count();
    for (let i = 0; i < n; i++) await tiles.nth(i).click();
    await page.getByRole("button", { name: "Continue" }).click();
    return true;
  }
  // Speak card (testid avoids the "Record" / "Record to continue" name clash)
  const record = page.getByTestId("record");
  if (await record.isVisible().catch(() => false)) {
    await record.click();
    await page.getByRole("button", { name: "Continue" }).click();
    return true;
  }
  // Nothing actionable found — stop so the loop fails fast instead of spinning.
  return false;
}

test("daily loop runs end to end and persists", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await page.getByRole("button", { name: /start reviews/i }).click();

  // Play through every card in the seeded session.
  for (let i = 0; i < 60; i++) {
    const more = await playOneCard(page);
    if (!more) break;
    await page.waitForTimeout(40);
  }

  // Finish → back to Today.
  await page.getByRole("button", { name: "Back to Today" }).click();

  // The loop is satisfied: the lesson step reads complete, not locked.
  await expect(page.getByText("Lesson complete")).toBeVisible();

  // Streak incremented from completing the daily goal.
  await expect(page.getByText(/1 day\b/)).toBeVisible();

  // Reload — progress persists (the lesson still reads complete).
  await page.reload();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  expect(errors).toEqual([]);
});
