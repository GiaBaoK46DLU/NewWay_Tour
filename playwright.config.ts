import { defineConfig, devices } from "@playwright/test";

// E2E config for the Phase 2 booking-management verification. The dev server is
// expected to already be running on :3000 (started separately), so no webServer
// block here. Tests run serially with a single worker because they share state
// through the real Supabase DB (a booking created in one test is read in later
// ones).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    acceptDownloads: true,
    trace: "off",
    screenshot: "only-on-failure"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
