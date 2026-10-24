import { expect, test, type Page } from "@playwright/test";

/**
 * /playground joins the open-graph check once the page exists. The other
 * public routes are asserted on test/ai-testing-e2e. /quality is not in the
 * tree. This check does not require the page to be indexable.
 *
 * A page-level openGraph object replaces the layout tags. image, site name,
 * and locale have to be present on the page itself.
 */
const PLAYGROUND_ROUTES = ["/playground/", "/playground/?mode=fixed"] as const;

const OG_PROPERTIES = ["og:image", "og:site_name", "og:locale"] as const;

async function expectOpenGraph(page: Page) {
  for (const property of OG_PROPERTIES) {
    const tag = page.locator(`meta[property="${property}"]`).first();
    await expect(tag, property).toHaveAttribute("content", /\S/);
  }
}

for (const route of PLAYGROUND_ROUTES) {
  test(`${route} publishes og:image, og:site_name, and og:locale`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status() ?? 0).toBeLessThan(400);
    await expectOpenGraph(page);
  });
}
