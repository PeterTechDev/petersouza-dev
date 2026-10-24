import { expect, test, type Page } from "@playwright/test";

import { createTranslator, type Locale } from "@/lib/i18n";
import {
  CART_LINES,
  PLAYGROUND_BUGS,
  PLAYGROUND_FIXED_MODE,
  PLAYGROUND_MODE_PARAM,
  VALID_EMAIL_SAMPLE,
  emailErrorKey,
  observeBug,
  type PlaygroundMode,
} from "@/lib/playground-bugs";

/**
 * Each bug is driven from src/lib/playground-bugs.ts. Planted mode must still
 * show the defect. `?mode=fixed` must match the corrected observation. A bug
 * that stops reproducing, or a fixed mode that stops fixing it, fails here.
 * There is no second copy of the bug list in this file.
 */
const MODES = ["planted", "fixed"] as const satisfies readonly PlaygroundMode[];

const tEn = createTranslator("en").t;
const tPt = createTranslator("pt-BR").t;

function t(locale: Locale) {
  return locale === "en" ? tEn : tPt;
}

function playgroundUrl(mode: PlaygroundMode): string {
  if (mode === "fixed") return `/playground/?${PLAYGROUND_MODE_PARAM}=${PLAYGROUND_FIXED_MODE}`;
  return "/playground/";
}

async function openPlayground(page: Page, mode: PlaygroundMode, locale: Locale = "en") {
  await page.addInitScript((value) => {
    localStorage.setItem("ps-locale", value);
  }, locale);
  await page.goto(playgroundUrl(mode));
  await expect(page.locator("html")).toHaveAttribute("lang", locale === "en" ? "en" : "pt-BR");
  await expect(page.getByRole("heading", { level: 1, name: t(locale)("playground.title") })).toBeVisible();
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", mode);
}

for (const bug of PLAYGROUND_BUGS) {
  for (const mode of MODES) {
    test(`${bug.id} matches the fixture when mode is ${mode}`, async ({ page }) => {
      const observed = observeBug(bug.id, mode);
      await openPlayground(page, mode);

      switch (observed.id) {
        case "validation": {
          await page.locator("#checkout-name").fill("Ada");
          await page.locator("#checkout-email").fill(observed.sample);
          await page.locator("#checkout-submit").click();
          const status = page.locator("form").getByRole("status");
          if (observed.accepted) {
            await expect(status).toHaveText(tEn("playground.placed", { count: 1 }));
          } else {
            await expect(page.getByRole("alert")).toHaveText(tEn(emailErrorKey(mode)));
            await expect(status).toHaveCount(0);
          }
          break;
        }
        case "rounding": {
          const items = page.getByRole("listitem");
          await expect(items).toHaveCount(CART_LINES.length);
          for (const [index, line] of CART_LINES.entries()) {
            await expect(items.nth(index)).toContainText(tEn(line.nameKey));
            await expect(items.nth(index)).toContainText(observed.lines[index]);
          }
          await expect(page.locator("#checkout-total")).toContainText(observed.total);
          await expect(page.locator("#checkout-total")).toContainText(tEn("playground.total"));
          break;
        }
        case "a11y-label": {
          const email = page.locator("#checkout-email");
          const labelText = tEn("playground.email");
          if (observed.associated) {
            await expect(email).toHaveAccessibleName(labelText);
            await expect(page.locator('label[for="checkout-email"]')).toHaveText(labelText);
          } else {
            await expect(email).toHaveAccessibleName("");
            expect(await email.evaluate((element) => (element as HTMLInputElement).labels?.length ?? 0)).toBe(0);
            await expect(page.getByTestId("email-visual-label")).toHaveText(labelText);
            await expect(page.locator('label[for="checkout-email"]')).toHaveCount(0);
          }
          break;
        }
        case "double-submit": {
          await page.locator("#checkout-name").fill("Ada");
          await page.locator("#checkout-email").fill(VALID_EMAIL_SAMPLE);
          const submit = page.locator("#checkout-submit");
          const status = page.locator("form").getByRole("status");
          await submit.click();
          if (observed.blocksRepeat) {
            await expect(submit).toBeDisabled();
            await expect(status).toHaveText(tEn("playground.placed", { count: 1 }));
            await page.locator("form").evaluate((form) => {
              (form as HTMLFormElement).requestSubmit();
            });
            await expect(status).toHaveText(tEn("playground.placed", { count: 1 }));
            await expect(submit).toBeDisabled();
          } else {
            await expect(submit).toBeEnabled();
            await submit.click();
            await expect(status).toHaveText(tEn("playground.placed", { count: 2 }));
            await expect(submit).toBeEnabled();
          }
          break;
        }
        case "i18n-string": {
          const submit = page.locator("#checkout-submit");
          await expect(submit).toHaveText(tEn(observed.key));
          await page.getByRole("button", { name: tEn("ui.language.ariaLabel") }).click();
          await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
          await expect(submit).toHaveText(tPt(observed.key));
          break;
        }
        case "keyboard-trap": {
          const open = page.getByRole("button", { name: tEn("playground.noteOpen") });
          await open.click();
          const note = page.locator("#order-note");
          await expect(note).toBeFocused();
          await page.keyboard.press("Tab");
          if (observed.trapped) {
            await expect(note).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(note).toBeFocused();
            await page.keyboard.press("Escape");
            await expect(page.getByRole("dialog")).toBeVisible();
            await expect(note).toBeFocused();
            await expect(page.getByRole("button", { name: tEn("playground.noteDismiss") })).toHaveCount(0);
            await expect(page.getByTestId("note-dismiss")).toHaveText(tEn("playground.noteDismiss"));
          } else {
            const close = page.getByRole("button", { name: tEn("playground.noteDismiss") });
            await expect(close).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(note).toBeFocused();
            await page.keyboard.press("Tab");
            await expect(close).toBeFocused();
            await page.keyboard.press("Escape");
            await expect(page.getByRole("dialog")).toHaveCount(0);
            await expect(open).toBeFocused();
          }
          break;
        }
        default: {
          const unreachable: never = observed;
          throw new Error(`Unhandled playground bug: ${JSON.stringify(unreachable)}`);
        }
      }
    });
  }
}

/**
 * The planted trap listens on the dialog node and removes that listener on
 * unmount. Leaving the page must restore ordinary Tab order: focus reaches
 * controls outside <main>, and it does not stay on one element.
 */
async function openPlantedTrap(page: Page) {
  const observed = observeBug("keyboard-trap", "planted");
  expect(observed.trapped).toBe(true);
  await openPlayground(page, "planted");
  await page.getByRole("button", { name: tEn("playground.noteOpen") }).click();
  const note = page.locator("#order-note");
  await expect(note).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(note).toBeFocused();
}

async function expectTabLeavesContent(page: Page) {
  await expect(page.locator("#order-note")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    document.body.focus();
  });

  const seen: string[] = [];
  let leftMain = false;
  for (let step = 0; step < 8; step += 1) {
    await page.keyboard.press("Tab");
    const snapshot = await page.evaluate(() => {
      const active = document.activeElement;
      const main = document.querySelector("main");
      const insideMain = !!active && !!main && main.contains(active);
      const isDocument = active === document.body || active === document.documentElement;
      const label = active?.getAttribute("aria-label") ?? "";
      const id = active instanceof HTMLElement ? active.id : "";
      return {
        insideMain,
        isDocument,
        key: active ? `${active.tagName}#${id}.${label}` : "none",
      };
    });
    if (!snapshot.isDocument) seen.push(snapshot.key);
    if (!snapshot.insideMain && !snapshot.isDocument) leftMain = true;
  }

  expect(leftMain, `Tab never left <main>. Focus order: ${seen.join(" -> ")}`).toBe(true);
  expect(new Set(seen).size, `Tab stayed on one element: ${seen.join(" -> ")}`).toBeGreaterThan(1);
}

test("the planted keyboard trap does not leak after the back link", async ({ page }) => {
  await openPlantedTrap(page);
  await page.getByRole("link", { name: tEn("playground.back") }).evaluate((link: HTMLAnchorElement) => {
    link.click();
  });
  await expect(page.getByRole("heading", { level: 1, name: "Peter Souza" })).toBeVisible();
  await expectTabLeavesContent(page);
});

test("the planted keyboard trap does not leak after goto", async ({ page }) => {
  await openPlantedTrap(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Peter Souza" })).toBeVisible();
  await expectTabLeavesContent(page);
});
