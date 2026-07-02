import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end verification of the Phase 3 UX features after the DB upgrade
 * (migration 0004):
 *   - Advanced filter & sort on /tours (client, no auth) — independent of DB state.
 *   - Wishlist (Supabase, per-user): requires login; saved tours appear on
 *     /wishlist and drive the nav badge.
 *   - Reviews (Supabase, public read / auth write): a signed-in user posts a
 *     review; it is then visible to an anonymous visitor.
 *
 * Requires the dev server + Supabase configured, and migration 0004 applied.
 * Tests run serially (workers: 1); the reviews visibility check reads a review
 * created by an earlier test, shared via a module-level marker.
 */

const TS = Date.now();
const REVIEW_TOUR_SLUG = "tour-langbiang";

const userA = {
  username: `QA W ${TS}`,
  email: `qa-e2e-w-${TS}@newwaytourist.test`,
  password: "QaTest123!"
};

const REVIEW_MARKER = `QA-REVIEW-${TS}`;

async function register(page: Page, user: typeof userA) {
  await page.goto("/register");
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/login/, { timeout: 20_000 });
}

async function login(page: Page, user: { email: string; password: string }) {
  await page.goto("/login");
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
}

async function cardPrices(page: Page): Promise<number[]> {
  const texts = await page.getByTestId("tour-price").allInnerTexts();
  return texts.map((t) => Number(t.replace(/[^\d]/g, "")));
}

test.describe("Phase 3 — Advanced filter & sort", () => {
  test("sort by price ascending then descending reorders the grid", async ({ page }) => {
    await page.goto("/tours");
    await expect(page.getByTestId("tour-card").first()).toBeVisible();

    await page.getByLabel("Sắp xếp tour").selectOption("price-asc");
    await page.waitForURL(/[?&]sort=price-asc/);
    await expect
      .poll(async () => {
        const prices = await cardPrices(page);
        return JSON.stringify(prices) === JSON.stringify([...prices].sort((a, b) => a - b));
      })
      .toBe(true);

    await page.getByLabel("Sắp xếp tour").selectOption("price-desc");
    await page.waitForURL(/[?&]sort=price-desc/);
    await expect
      .poll(async () => {
        const prices = await cardPrices(page);
        return JSON.stringify(prices) === JSON.stringify([...prices].sort((a, b) => b - a));
      })
      .toBe(true);
  });

  test("duration filter narrows the results and is reflected in the URL", async ({ page }) => {
    await page.goto("/tours");
    await expect(page.getByTestId("tour-card").first()).toBeVisible();

    const durationSelect = page.getByLabel("Lọc theo thời lượng");
    const value = await durationSelect.locator("option").nth(1).getAttribute("value");
    expect(value, "there should be at least one duration option").toBeTruthy();

    await durationSelect.selectOption(value!);
    await page.waitForURL(/[?&]duration=/);

    await expect(page.getByTestId("tour-card").first()).toBeVisible();
    expect(await page.getByTestId("tour-card").count()).toBeGreaterThan(0);
  });
});

test.describe("Phase 3 — Wishlist (Supabase, per-user)", () => {
  test("anonymous heart click redirects to login", async ({ page }) => {
    await page.goto("/tours");
    const firstCard = page.getByTestId("tour-card").first();
    await expect(firstCard).toBeVisible();
    await firstCard.getByTestId("wishlist-toggle").click();
    await page.waitForURL(/\/login/, { timeout: 20_000 });
    expect(new URL(page.url()).searchParams.get("next")).toBeTruthy();
  });

  test("signed-in user saves a tour, sees it on /wishlist + nav badge, then removes it", async ({
    page
  }) => {
    await register(page, userA);
    await login(page, userA);

    await page.goto("/tours");
    const firstCard = page.getByTestId("tour-card").first();
    await expect(firstCard).toBeVisible();
    const title = (await firstCard.getByRole("heading").innerText()).trim();

    await firstCard.getByTestId("wishlist-toggle").click();
    await expect(firstCard.getByTestId("wishlist-toggle")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    // Fresh server render of /wishlist reflects the save (header badge + item).
    await page.goto("/wishlist");
    await expect(page.getByTestId("wishlist-count")).toHaveText("1");
    const items = page.getByTestId("wishlist-item");
    await expect(items).toHaveCount(1);
    await expect(items.first().getByText(title, { exact: true })).toBeVisible();

    // Remove → empty state.
    await items.first().getByRole("button", { name: "Bỏ khỏi yêu thích" }).click();
    await expect(page.getByTestId("wishlist-item")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Chưa có tour nào được lưu" })
    ).toBeVisible();
  });
});

test.describe("Phase 3 — Reviews (Supabase, public read / auth write)", () => {
  test("anonymous visitor sees the login prompt instead of the form", async ({ page }) => {
    await page.goto(`/tours/${REVIEW_TOUR_SLUG}`);
    await expect(page.getByTestId("tour-reviews")).toBeVisible();
    await expect(page.getByTestId("review-login-prompt")).toBeVisible();
    await expect(page.getByTestId("review-form")).toHaveCount(0);
  });

  test("signed-in user submits a review (empty is rejected, valid is saved)", async ({
    page
  }) => {
    // Reuse the wishlist user (already registered above); serial run guarantees order.
    await login(page, userA);
    await page.goto(`/tours/${REVIEW_TOUR_SLUG}`);

    const reviews = page.getByTestId("tour-reviews");
    await expect(reviews.getByTestId("review-form")).toBeVisible();

    const before = await reviews.getByTestId("review-item").count();

    // Empty comment → rejected by the server action.
    await reviews.getByRole("button", { name: "Gửi đánh giá" }).click();
    await expect(reviews.getByRole("alert")).toBeVisible();

    // Valid review → saved and rendered.
    await reviews.getByTestId("star-4").click();
    await reviews.getByLabel("Nhận xét").fill(REVIEW_MARKER);
    await reviews.getByRole("button", { name: "Gửi đánh giá" }).click();

    const item = reviews.getByTestId("review-item").filter({ hasText: REVIEW_MARKER });
    await expect(item).toBeVisible();
    await expect(item.getByText(userA.username)).toBeVisible();
    await expect(reviews.getByTestId("review-item")).toHaveCount(before + 1);
  });

  test("the review is publicly visible to an anonymous visitor", async ({ page }) => {
    await page.goto(`/tours/${REVIEW_TOUR_SLUG}`);
    const reviews = page.getByTestId("tour-reviews");
    await expect(
      reviews.getByTestId("review-item").filter({ hasText: REVIEW_MARKER })
    ).toBeVisible();
    // And an anonymous visitor still cannot post.
    await expect(page.getByTestId("review-login-prompt")).toBeVisible();
  });
});
