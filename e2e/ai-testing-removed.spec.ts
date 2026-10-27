import { expect, test, type Page } from "@playwright/test";

test("removed /ai-testing routes respond 404 and the home page does not link to them", async ({
  page,
  request,
}) => {
  const missing = await request.get("/ai-testing/", { maxRedirects: 0 });
  expect(missing.status(), "/ai-testing/").toBe(404);

  // next.config trailingSlash redirects every slash-less path, including this one.
  const redirected = await request.get("/ai-testing", { maxRedirects: 0 });
  expect(redirected.status(), "/ai-testing").toBe(308);
  expect(redirected.headers().location ?? "", "/ai-testing location").toBe("/ai-testing/");
  const followed = await request.get(redirected.headers().location ?? "", { maxRedirects: 0 });
  expect(followed.status(), "GET /ai-testing follows to a 404").toBe(404);

  const chatMissing = await request.get("/api/chat/", { maxRedirects: 0 });
  expect(chatMissing.status(), "/api/chat/").toBe(404);

  const chatRedirected = await request.get("/api/chat", { maxRedirects: 0 });
  expect(chatRedirected.status(), "/api/chat").toBe(308);
  expect(chatRedirected.headers().location ?? "", "/api/chat location").toBe("/api/chat/");
  const chatFollowed = await request.get(chatRedirected.headers().location ?? "", { maxRedirects: 0 });
  expect(chatFollowed.status(), "GET /api/chat follows to a 404").toBe(404);

  const sitemap = await request.get("/sitemap.xml", { maxRedirects: 0 });
  expect(sitemap.status(), "/sitemap.xml").toBe(200);
  expect(await sitemap.text()).not.toContain("/ai-testing");

  await page.addInitScript(() => {
    const locale = sessionStorage.getItem("e2e-locale") ?? "en";
    localStorage.setItem("ps-locale", locale);
  });
  await expectHomeHasNoAiTestingLink(page, "en");
  await page.evaluate(() => sessionStorage.setItem("e2e-locale", "pt-BR"));
  await expectHomeHasNoAiTestingLink(page, "pt-BR");
});

async function expectHomeHasNoAiTestingLink(page: Page, locale: "en" | "pt-BR") {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  await expect(page.getByRole("heading", { level: 1, name: "Peter Souza" })).toBeVisible();

  const hrefs = await page.getByRole("link").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") ?? ""),
  );
  expect(hrefs.filter((href) => href.includes("/ai-testing"))).toEqual([]);
}
