import { test, expect } from "@playwright/test";

test("search updates the URL and filters the table", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Users dashboard" }),
  ).toBeVisible();
  await expect(page.getByText("Total users")).toBeVisible();

  await page.getByRole("searchbox", { name: "Search users" }).fill("emily");

  // State is server-driven via the URL.
  await expect(page).toHaveURL(/q=emily/);
  await expect(page.locator("table tbody tr").first()).toContainText("Emily");
});

test("sorting by age is reflected in the URL", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Age", exact: true }).click();
  await expect(page).toHaveURL(/sort=age/);
});

test("opening a user shows the detail page", async ({ page }) => {
  await page.goto("/");
  await page.locator("table tbody a").first().click();

  await expect(page).toHaveURL(/\/users\/\d+/);
  await expect(page.getByText("Back to dashboard")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Posts" })).toBeVisible();
});
