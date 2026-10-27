import { expect, test, type Page } from "@playwright/test";

/**
 * Locale is not a route and not a cookie.
 * The header button (`aria-label` from `ui.language.ariaLabel`) calls
 * `toggleLocale`, which stores `ps-locale` (`en` | `pt-BR`) in localStorage
 * and sets `<html lang>`. `?lang=` applies only when nothing is saved.
 * Blog and case-study body copy are not in the dictionary.
 */
const EN = {
  htmlLang: "en",
  toggle: "Switch language",
  availability: "Open to remote QA/SDET roles",
  credentials: "Playwright + TypeScript · LLM evals · remote from Brazil (UTC-3)",
  hiring: "Hiring?",
  downloadCv: "Download CV",
} as const;

const PT = {
  htmlLang: "pt-BR",
  toggle: "Trocar idioma",
  availability: "Aberto a vagas remotas de QA/SDET",
  credentials: "Playwright + TypeScript · Evals de LLM · remoto do Brasil (UTC-3)",
  hiring: "Contratando?",
  downloadCv: "Baixar CV",
} as const;

async function expectEnglish(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("lang", EN.htmlLang);
  await expect(page.getByRole("button", { name: EN.toggle })).toBeVisible();
  await expect(page.getByText(EN.availability)).toBeVisible();
  await expect(page.getByText(EN.credentials, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: EN.hiring, exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: EN.downloadCv })).toHaveCount(2);
  await expect(page.getByText(PT.availability)).toHaveCount(0);
}

async function expectPortuguese(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("lang", PT.htmlLang);
  await expect(page.getByRole("button", { name: PT.toggle })).toBeVisible();
  await expect(page.getByText(PT.availability)).toBeVisible();
  await expect(page.getByText(PT.credentials, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: PT.hiring, exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: PT.downloadCv })).toHaveCount(2);
  await expect(page.getByText(EN.availability)).toHaveCount(0);
}

test("a first visit in an English browser shows English copy", async ({ page }) => {
  await page.goto("/");
  await expectEnglish(page);
});

test("the header toggle switches home copy between English and Portuguese", async ({ page }) => {
  await page.goto("/");
  await expectEnglish(page);

  await page.getByRole("button", { name: EN.toggle }).click();
  await expectPortuguese(page);

  await page.getByRole("button", { name: PT.toggle }).click();
  await expectEnglish(page);
});

test("the chosen Portuguese locale survives a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: EN.toggle }).click();
  await expectPortuguese(page);

  await page.reload();
  await expectPortuguese(page);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("ps-locale"))).toBe("pt-BR");
});

test("?lang=pt-BR shows Portuguese when no locale is saved", async ({ page }) => {
  await page.goto("/?lang=pt-BR");
  await expectPortuguese(page);
});

test("a saved locale wins over the lang query", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ps-locale", "en");
  });
  await page.goto("/?lang=pt-BR");
  await expectEnglish(page);
});
