import { defineConfig, devices } from "@playwright/test";

const MODE = process.env.SMOKE_MODE || "dev";
const PORT = MODE === "preview" ? 4173 : 5173;
// Preview mode must rebuild first — `vite preview` only serves the existing
// dist/, so without a build it would smoke-test a stale bundle (the exact
// blank-on-prod trap this suite exists to catch).
const command =
  MODE === "preview"
    ? "npm run build && npm run preview -- --port 4173"
    : "npm run dev -- --port 5173";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js", // Playwright owns *.spec.js; node:test owns tests/unit/*.test.mjs
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Pixel 5"],
  },
  webServer: {
    command,
    url: `http://localhost:${PORT}`,
    // Never reuse a running server in preview mode — a stale one would skip the
    // rebuild and serve an old bundle.
    reuseExistingServer: MODE === "preview" ? false : !process.env.CI,
    timeout: 120000,
  },
});
