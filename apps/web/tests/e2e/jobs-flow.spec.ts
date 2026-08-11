import { expect, test } from "@playwright/test";

/**
 * Critical web user flow: open Jobs, confirm the table loads from the API,
 * open a job detail drawer, then search the list.
 */
test.describe("Jobs critical flow", () => {
  test("lists jobs, opens details, and searches", async ({ page }) => {
    await page.goto("/jobs");

    await expect(page.getByRole("heading", { name: "Jobs" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create job" }),
    ).toBeVisible();

    const search = page.getByRole("textbox", { name: "Search jobs" });
    await expect(search).toBeVisible();

    // Prefer success path; if API is down, surface the error for debugging.
    const viewButton = page.getByRole("button", { name: "View" }).first();
    const errorTitle = page.getByText("Unable to load jobs");
    await expect(viewButton.or(errorTitle)).toBeVisible({ timeout: 60_000 });
    await expect(errorTitle).toHaveCount(0);
    await expect(viewButton).toBeVisible();

    await viewButton.click();
    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();

    await page
      .getByRole("button", { name: "Close drawer", exact: true })
      .click();

    await search.fill("a");
    await expect
      .poll(async () => page.getByRole("button", { name: "View" }).count(), {
        timeout: 20_000,
      })
      .toBeGreaterThan(0);
  });
});
