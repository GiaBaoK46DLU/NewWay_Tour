import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * End-to-end verification of the Phase 2 booking-management features against the
 * real dev server + Supabase DB:
 *   1. A signed-in customer's booking appears in their /profile history.
 *   2. RLS isolation — a second customer does NOT see the first one's booking.
 *   3. Admin booking-detail modal + CSV export on /dashboard/bookings.
 *
 * Runs serially (see playwright.config.ts) because later tests read the booking
 * created by the first. Each test() uses a fresh browser context, so the three
 * personas (User A / User B / admin) have independent sessions.
 */

const TS = Date.now();
const MARKER = `QA-E2E-${TS}`; // unique note, used to find "our" booking later
const TOUR_SLUG = "tour-san-may-cau-dat";
const TOUR_TITLE = "Tour săn mây Cầu Đất";
const PHONE = "0912345678";

const userA = {
  username: `QA A ${TS}`,
  email: `qa-e2e-a-${TS}@newwaytourist.test`,
  password: "QaTest123!"
};
const userB = {
  username: `QA B ${TS}`,
  email: `qa-e2e-b-${TS}@newwaytourist.test`,
  password: "QaTest123!"
};
// Pre-existing admin account promoted via SQL (see memory admin-booking-actions).
const admin = { email: "qa-test-admin@newwaytourist.test", password: "TestAdmin123!" };

const travelDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
})();

let bookingRef = "";

async function register(page: Page, user: typeof userA) {
  await page.goto("/register");
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  // register() redirects to /login?registered=1 (no auto-login).
  await page.waitForURL(/\/login/, { timeout: 20_000 });
}

async function login(page: Page, user: { email: string; password: string }) {
  await page.goto("/login");
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
}

test("User A: register, book a tour, and see it in /profile history", async ({ page }) => {
  await register(page, userA);
  await login(page, userA);
  // Regular users land on "/".
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });

  // Book the tour while signed in → createBooking() stamps user_id.
  await page.goto(`/tours/${TOUR_SLUG}`);
  await page.fill('input[name="full_name"]', `QA Nguyen ${TS}`);
  await page.fill('input[name="email"]', userA.email);
  await page.fill('input[name="phone"]', PHONE);
  await page.fill('input[name="travel_date"]', travelDate);
  await page.fill('input[name="guests"]', "2");
  await page.fill('textarea[name="note"]', MARKER);
  await page.click('button[type="submit"]');

  await page.waitForURL(/\/booking-confirmed/, { timeout: 20_000 });
  bookingRef = new URL(page.url()).searchParams.get("ref") ?? "";
  expect(bookingRef, "confirmation URL should carry a booking ref").not.toBe("");

  // History on /profile.
  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Lịch sử đặt tour" })).toBeVisible();

  const card = page.locator("li", { hasText: MARKER });
  await expect(card, "the just-created booking should appear in history").toBeVisible();
  await expect(card.getByText(TOUR_TITLE)).toBeVisible();
  await expect(card.getByText("Chờ xác nhận")).toBeVisible();
  await expect(card.getByText(bookingRef)).toBeVisible();
});

test("User B: cannot see User A's booking (RLS isolation)", async ({ page }) => {
  await register(page, userB);
  await login(page, userB);
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Lịch sử đặt tour" })).toBeVisible();
  // The core security assertion: User A's booking marker must not be present.
  await expect(page.getByText(MARKER)).toHaveCount(0);
});

test("Admin: booking detail modal + CSV export", async ({ page }) => {
  await login(page, admin);
  // Admins land on /dashboard. If this fails the QA admin account is gone.
  await page.waitForURL(/\/dashboard/, { timeout: 20_000 }).catch(() => {
    throw new Error(
      "Admin login did not reach /dashboard — the qa-test-admin account may have been removed from Supabase."
    );
  });

  await page.goto("/dashboard/bookings");
  const row = page.locator("tr", { hasText: MARKER });
  await expect(row, "admin should see User A's booking in the table").toBeVisible();

  // --- Detail modal ---
  await row.getByRole("button", { name: "Chi tiết" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(userA.email)).toBeVisible();
  await expect(dialog.getByText(PHONE)).toBeVisible();
  await expect(dialog.getByText(MARKER)).toBeVisible();
  // Close with Escape.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  // --- CSV export ---
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Xuất CSV" }).click()
  ]);
  const path = await download.path();
  expect(download.suggestedFilename()).toMatch(/^bookings-\d{4}-\d{2}-\d{2}\.csv$/);
  const csv = readFileSync(path, "utf8");
  expect(csv.charCodeAt(0), "CSV should start with a UTF-8 BOM for Excel").toBe(0xfeff);
  expect(csv).toContain("Khách hàng"); // header
  expect(csv).toContain(userA.email); // our booking row
  expect(csv).toContain(MARKER); // our note
});
