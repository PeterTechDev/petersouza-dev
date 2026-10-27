import { expect, test, type Page } from "@playwright/test";

/**
 * Public routes on this branch.
 * /quality is not in the tree. /playground is covered with the playground specs.
 * A page-level openGraph object replaces the layout tags, so image, site name,
 * and locale have to be present on the page itself.
 */
const PUBLIC_ROUTES = [
  "/",
  "/blog/",
  "/blog/building-ai-first-products/",
  "/blog/conversational-ai-for-sales/",
  "/blog/from-law-to-code/",
  "/blog/from-qa-to-ai/",
  "/blog/why-i-built-a-multi-agent-ai-team/",
  "/case-study/atrias-wiki/",
] as const;

const OG_PROPERTIES = ["og:image", "og:site_name", "og:locale"] as const;

async function expectOpenGraph(page: Page) {
  for (const property of OG_PROPERTIES) {
    const tag = page.locator(`meta[property="${property}"]`).first();
    await expect(tag, property).toHaveAttribute("content", /\S/);
  }
}

for (const route of PUBLIC_ROUTES) {
  test(`${route} publishes og:image, og:site_name, and og:locale`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status() ?? 0).toBeLessThan(400);
    await expectOpenGraph(page);
  });
}
