import { expect, test, type Page } from "@playwright/test";

const PAGE = "/ai-testing/";

async function resultsRegion(page: Page, name: string) {
  const region = page.getByRole("region", { name });
  await expect(region).toBeVisible();
  await expect(region).not.toContainText(/\d/);
  return region;
}

test("English results say Not yet run and show no score", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "Testing this site's chat" })).toBeVisible();
  const results = await resultsRegion(page, "Results");
  await expect(results.getByText("Not yet run").first()).toBeVisible();
  await expect(results.getByText("—").first()).toBeVisible();
});

test("Portuguese results say Ainda não executado and show no score", async ({ page }) => {
  await page.goto(PAGE);
  await page.getByRole("button", { name: "Switch language" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(
    page.getByRole("heading", { level: 1, name: "Como o chat deste site é testado" }),
  ).toBeVisible();
  const results = await resultsRegion(page, "Resultados");
  await expect(results.getByText("Ainda não executado").first()).toBeVisible();
  await expect(results.getByText("—").first()).toBeVisible();
});
