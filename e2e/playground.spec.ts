import { expect, test, type Page } from "@playwright/test";

import { BUG_IDS, type BugId } from "@/lib/playground-bugs";

/**
 * BUG_IDS only enumerates which cases exist. Expected results are literals in
 * this file, checked on the UI. Catalog functions and the reveal panel's
 * "Observed" line use the same code as the checkout, so neither is an oracle.
 */
const MODES = ["planted", "fixed"] as const;
type Mode = (typeof MODES)[number];

const SAMPLE_EMAIL = "a@";
const VALID_EMAIL = "qa@example.com";
const PLANTED_SUBMIT_LABEL = "playground.checkout.ctaMissing";
const FIXED_SUBMIT_LABEL = { en: "Place order", "pt-BR": "Fazer pedido" } as const;
const PLACED = (count: number) => `Order placed. Count in this session: ${count}.`;
const FIXED_EMAIL_ERROR = "Enter an email with a name, a domain, and a dot.";

/** Integer cents. The expected money is this sum, not the catalog's floor(). */
const CART = [
  { name: "Synthetic mug", cents: 1999 },
  { name: "Synthetic sticker", cents: 29 },
] as const;

function formatCents(cents: number): string {
  const whole = Math.trunc(cents / 100);
  const fraction = Math.abs(cents % 100);
  return `$${whole}.${String(fraction).padStart(2, "0")}`;
}

const CORRECT_LINES = CART.map((line) => formatCents(line.cents));
const CORRECT_TOTAL = formatCents(CART.reduce((sum, line) => sum + line.cents, 0));
const PLANTED_LINES = ["$19.98", "$0.28"] as const;
const PLANTED_TOTAL = "$20.26";

if (PLANTED_TOTAL === CORRECT_TOTAL || PLANTED_LINES.join() === CORRECT_LINES.join()) {
  throw new Error("Planted prices must stay different from the integer-cent prices.");
}

function routeFor(mode: Mode): string {
  return mode === "fixed" ? "/playground/?mode=fixed" : "/playground/";
}

async function openPlayground(page: Page, mode: Mode) {
  await page.goto(routeFor(mode));
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "Bug-bash playground" })).toBeVisible();
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", mode);
}

async function checkValidation(page: Page, mode: Mode) {
  await page.locator("#checkout-name").fill("Ada");
  await page.locator("#checkout-email").fill(SAMPLE_EMAIL);
  await page.locator("#checkout-submit").click();
  const form = page.locator("form");
  const status = form.getByRole("status");
  if (mode === "planted") {
    await expect(status).toHaveText(PLACED(1));
    await expect(form.getByRole("alert")).toHaveCount(0);
    return;
  }
  await expect(form.getByRole("alert")).toHaveText(FIXED_EMAIL_ERROR);
  await expect(status).toHaveCount(0);
}

async function checkRounding(page: Page, mode: Mode) {
  const items = page.getByRole("listitem");
  await expect(items).toHaveCount(CART.length);
  const lines = mode === "fixed" ? CORRECT_LINES : PLANTED_LINES;
  const total = mode === "fixed" ? CORRECT_TOTAL : PLANTED_TOTAL;
  for (const [index, line] of CART.entries()) {
    await expect(items.nth(index)).toContainText(line.name);
    await expect(items.nth(index)).toContainText(lines[index]);
  }
  await expect(page.locator("#checkout-total")).toContainText("Total");
  await expect(page.locator("#checkout-total")).toContainText(total);
}

async function checkLabel(page: Page, mode: Mode) {
  const email = page.locator("#checkout-email");
  if (mode === "fixed") {
    await expect(email).toHaveAccessibleName("Email");
    await expect(page.locator('label[for="checkout-email"]')).toHaveText("Email");
    return;
  }
  await expect(email).toHaveAccessibleName("");
  await expect
    .poll(() => email.evaluate((element) => (element as HTMLInputElement).labels?.length ?? 0))
    .toBe(0);
  await expect(page.getByTestId("email-visual-label")).toHaveText("Email");
  await expect(page.locator('label[for="checkout-email"]')).toHaveCount(0);
}

async function checkDoubleSubmit(page: Page, mode: Mode) {
  await page.locator("#checkout-name").fill("Ada");
  await page.locator("#checkout-email").fill(VALID_EMAIL);
  const submit = page.locator("#checkout-submit");
  const status = page.locator("form").getByRole("status");
  await submit.click();
  await expect(status).toHaveText(PLACED(1));
  if (mode === "fixed") {
    await expect(submit).toBeDisabled();
    await page.locator("form").evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });
    await expect(status).toHaveText(PLACED(1));
    await expect(submit).toBeDisabled();
    return;
  }
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(status).toHaveText(PLACED(2));
  await expect(submit).toBeEnabled();
}

async function checkI18n(page: Page, mode: Mode) {
  const submit = page.locator("#checkout-submit");
  if (mode === "planted") {
    await expect(submit).toHaveText(PLANTED_SUBMIT_LABEL);
    await page.getByRole("button", { name: "Switch language" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(submit).toHaveText(PLANTED_SUBMIT_LABEL);
    return;
  }
  await expect(submit).toHaveText(FIXED_SUBMIT_LABEL.en);
  await page.getByRole("button", { name: "Switch language" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(submit).toHaveText(FIXED_SUBMIT_LABEL["pt-BR"]);
}

async function checkKeyboard(page: Page, mode: Mode) {
  const open = page.getByRole("button", { name: "Order note" });
  await open.click();
  const note = page.locator("#order-note");
  await expect(note).toBeFocused();
  await page.keyboard.press("Tab");
  if (mode === "planted") {
    await expect(note).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(note).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(note).toBeFocused();
    await expect(page.getByRole("button", { name: "Close" })).toHaveCount(0);
    await expect(page.getByTestId("note-dismiss")).toHaveText("Close");
    return;
  }
  const close = page.getByRole("button", { name: "Close" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(note).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(open).toBeFocused();
}

async function checkBug(page: Page, id: BugId, mode: Mode) {
  switch (id) {
    case "validation":
      await checkValidation(page, mode);
      return;
    case "rounding":
      await checkRounding(page, mode);
      return;
    case "a11y-label":
      await checkLabel(page, mode);
      return;
    case "double-submit":
      await checkDoubleSubmit(page, mode);
      return;
    case "i18n-string":
      await checkI18n(page, mode);
      return;
    case "keyboard-trap":
      await checkKeyboard(page, mode);
      return;
    default: {
      const unreachable: never = id;
      throw new Error(`Unhandled playground bug id ${unreachable}`);
    }
  }
}

test("the catalog lists exactly these six bugs", () => {
  expect([...BUG_IDS]).toEqual([
    "validation",
    "rounding",
    "a11y-label",
    "double-submit",
    "i18n-string",
    "keyboard-trap",
  ]);
});

for (const id of BUG_IDS) {
  for (const mode of MODES) {
    test(`${id} is ${mode === "planted" ? "present" : "gone"} on ${routeFor(mode)}`, async ({ page }) => {
      await openPlayground(page, mode);
      await checkBug(page, id, mode);
    });
  }
}

async function openPlantedTrap(page: Page) {
  await openPlayground(page, "planted");
  await page.getByRole("button", { name: "Order note" }).click();
  const note = page.locator("#order-note");
  await expect(note).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(note).toBeFocused();
}

async function expectTabLeavesContent(page: Page) {
  await expect(page.locator("#order-note")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.evaluate(() => {
    document.body.tabIndex = -1;
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

/**
 * The planted trap listens on the dialog node. A full `page.goto` loads a new
 * document, so a listener leak cannot survive it and that case cannot fail.
 * The back link is a Next.js client navigation: `window` stays, and a document
 * keydown listener that still calls preventDefault on Tab fails the assertions
 * below (focus never leaves <main>, and Tab does not visit a second element).
 */
test("the planted keyboard trap does not leak after the back link", async ({ page }) => {
  await openPlantedTrap(page);
  await page.getByRole("link", { name: "Back to portfolio" }).evaluate((link: HTMLAnchorElement) => {
    link.click();
  });
  await expect(page.getByRole("heading", { level: 1, name: "Peter Souza" })).toBeVisible();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/");
  await expectTabLeavesContent(page);
});

test("`?mode=FIXED` runs fixed mode", async ({ page }) => {
  await page.goto("/playground/?mode=FIXED");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "fixed");
  await expect(page.locator("#checkout-submit")).toHaveText(FIXED_SUBMIT_LABEL.en);
  await expect(page.locator("#checkout-email")).toHaveAccessibleName("Email");
  await expect(page.locator('label[for="checkout-email"]')).toHaveCount(1);
});

test("`?mode=FIXED` runs fixed mode in pt-BR", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ps-locale", "pt-BR");
  });
  await page.goto("/playground/?mode=FIXED");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "fixed");
  await expect(page.locator("#checkout-submit")).toHaveText(FIXED_SUBMIT_LABEL["pt-BR"]);
  await expect(page.locator("#checkout-email")).toHaveAccessibleName("E-mail");
  await expect(page.locator('label[for="checkout-email"]')).toHaveCount(1);
});

const OG_ROUTES = ["/playground/", "/playground/?mode=fixed"] as const;

for (const route of OG_ROUTES) {
  test(`${route} publishes og:image, og:site_name, and og:locale`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status() ?? 0).toBeLessThan(400);
    for (const property of ["og:image", "og:site_name", "og:locale"] as const) {
      await expect(page.locator(`meta[property="${property}"]`).first(), property).toHaveAttribute(
        "content",
        /\S/,
      );
    }
  });
}
