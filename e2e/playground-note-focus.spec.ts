import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Fixed mode only (`/playground/?mode=fixed`). Planted mode is a different
 * trap and is not asserted here. The expected focus target and the order
 * copy are literals checked on the UI.
 */
const FIXED_URL = "/playground/?mode=fixed";
const NAME_VALUE = "Ada";
const EMAIL_VALUE = "qa@example.com";

const LOCALES = [
  {
    id: "en",
    storage: "en",
    htmlLang: "en",
    open: "Order note",
    title: "Order note",
    noteLabel: "Note",
    close: "Close",
    name: "Name",
    email: "Email",
    placedOne: "Order placed. Count in this session: 1.",
  },
  {
    id: "pt-BR",
    storage: "pt-BR",
    htmlLang: "pt-BR",
    open: "Nota do pedido",
    title: "Nota do pedido",
    noteLabel: "Nota",
    close: "Fechar",
    name: "Nome",
    email: "E-mail",
    placedOne: "Pedido feito. Contagem nesta sessão: 1.",
  },
] as const;

type Copy = (typeof LOCALES)[number];

async function activeSummary(page: Page): Promise<string> {
  return page.evaluate(() => {
    const active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) return "body";
    const id = active.id ? `#${active.id}` : "";
    const text = (active.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
    return `${active.tagName.toLowerCase()}${id} "${text}"`;
  });
}

async function openFixed(page: Page, copy: Copy) {
  await page.addInitScript((value) => {
    localStorage.setItem("ps-locale", value);
  }, copy.storage);
  await page.goto(FIXED_URL);
  await expect(page.locator("html")).toHaveAttribute("lang", copy.htmlLang);
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "fixed");
  await page.getByLabel(copy.name).fill(NAME_VALUE);
  await page.getByLabel(copy.email).fill(EMAIL_VALUE);
  const open = page.getByRole("button", { name: copy.open });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const note = dialog.getByRole("textbox");
  await expect(note).toBeFocused();
  return { open, dialog, note };
}

async function boxOf(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  if (!box) throw new Error("element has no box");
  return box;
}

async function dragAcross(page: Page, locator: Locator) {
  const box = await boxOf(locator);
  const y = box.y + box.height / 2;
  const startX = box.x + Math.min(4, box.width / 4);
  const endX = box.x + box.width - Math.min(4, box.width / 4);
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 12 });
  await page.mouse.up();
}

async function pressTitleReleaseOnBackdrop(page: Page, title: Locator) {
  const box = await boxOf(title);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(12, 12, { steps: 8 });
  await page.mouse.up();
}

async function expectInside(dialog: Locator, page: Page) {
  const summary = await activeSummary(page);
  expect(
    await dialog.evaluate((node) => node.contains(document.activeElement)),
    `active element is outside the dialog (${summary})`,
  ).toBe(true);
}

/**
 * Shift+Tab lands on Close. Tab and Shift+Tab then walk the dialog, including
 * the wrap at either end. Enter activates Close: the dialog goes away, focus
 * returns to the opener, and the session count stays at zero.
 */
async function expectKeysStayInsideAndDoNotOrder(
  page: Page,
  dialog: Locator,
  note: Locator,
  close: Locator,
  open: Locator,
  placedOne: string,
) {
  await page.keyboard.press("Shift+Tab");
  await expect(close, `after Shift+Tab, focus is ${await activeSummary(page)}`).toBeFocused();
  await expectInside(dialog, page);

  await page.keyboard.press("Tab");
  await expect(note, `after Tab, focus is ${await activeSummary(page)}`).toBeFocused();
  await expectInside(dialog, page);

  await page.keyboard.press("Tab");
  await expect(close, `after the forward wrap, focus is ${await activeSummary(page)}`).toBeFocused();
  await expectInside(dialog, page);

  await page.keyboard.press("Shift+Tab");
  await expect(note, `after Shift+Tab, focus is ${await activeSummary(page)}`).toBeFocused();
  await expectInside(dialog, page);

  await page.keyboard.press("Shift+Tab");
  await expect(close, `after the backward wrap, focus is ${await activeSummary(page)}`).toBeFocused();
  await expectInside(dialog, page);

  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(open, `after Enter, focus is ${await activeSummary(page)}`).toBeFocused();
  await expect(page.getByText(placedOne, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveCount(0);
}

for (const copy of LOCALES) {
  test(`clicking the order-note title keeps focus in the dialog (${copy.id})`, async ({ page }) => {
    const { open, dialog, note } = await openFixed(page, copy);
    await dialog.getByRole("heading", { name: copy.title }).click();
    await expect(dialog).toBeVisible();
    await expectKeysStayInsideAndDoNotOrder(
      page,
      dialog,
      note,
      dialog.getByRole("button", { name: copy.close }),
      open,
      copy.placedOne,
    );
  });

  test(`dragging across the order-note title keeps focus in the dialog (${copy.id})`, async ({ page }) => {
    const { open, dialog, note } = await openFixed(page, copy);
    await dragAcross(page, dialog.getByRole("heading", { name: copy.title }));
    await expect(dialog).toBeVisible();
    await expectKeysStayInsideAndDoNotOrder(
      page,
      dialog,
      note,
      dialog.getByRole("button", { name: copy.close }),
      open,
      copy.placedOne,
    );
  });

  test(`dragging across the order-note label keeps focus in the dialog (${copy.id})`, async ({ page }) => {
    const { open, dialog, note } = await openFixed(page, copy);
    await dragAcross(page, dialog.getByText(copy.noteLabel, { exact: true }));
    await expect(dialog).toBeVisible();
    await expectKeysStayInsideAndDoNotOrder(
      page,
      dialog,
      note,
      dialog.getByRole("button", { name: copy.close }),
      open,
      copy.placedOne,
    );
  });

  test(`triple-clicking the order-note label keeps focus in the dialog (${copy.id})`, async ({ page }) => {
    const { open, dialog, note } = await openFixed(page, copy);
    await dialog.getByText(copy.noteLabel, { exact: true }).click({ clickCount: 3 });
    await expect(dialog).toBeVisible();
    await expectKeysStayInsideAndDoNotOrder(
      page,
      dialog,
      note,
      dialog.getByRole("button", { name: copy.close }),
      open,
      copy.placedOne,
    );
  });

  test(`pressing the order-note title and releasing on the backdrop keeps focus in the dialog (${copy.id})`, async ({
    page,
  }) => {
    const { open, dialog, note } = await openFixed(page, copy);
    await pressTitleReleaseOnBackdrop(page, dialog.getByRole("heading", { name: copy.title }));
    await expect(dialog).toBeVisible();
    await expectKeysStayInsideAndDoNotOrder(
      page,
      dialog,
      note,
      dialog.getByRole("button", { name: copy.close }),
      open,
      copy.placedOne,
    );
  });
}
