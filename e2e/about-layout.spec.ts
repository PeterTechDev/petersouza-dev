import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * About stats. Copy is literal on purpose: the test does not import the app.
 * The base renders each stat as two paragraphs (number, then label). PR #9
 * uses a description list (label, then value) and reverses the column so the
 * number stays on top. Either role is accepted. The geometry is the check.
 *
 * The row fades in with framer-motion, which ignores prefers-reduced-motion.
 * The project sets reducedMotion, and this spec sets it again, then waits
 * until opacity and transform have settled. No fixed sleep.
 *
 * Numbers on one grid row are grouped by the stat card's y, not by the
 * number's y. A number that sits 16px higher must stay in its card's row.
 */
const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 390, height: 800 },
  { width: 375, height: 800 },
] as const;

const LOCALES = [
  {
    id: "en",
    storage: "en",
    htmlLang: "en",
    stats: [
      { value: "2+", label: "Years in QA" },
      { value: "140", label: "Automated tests" },
      { value: "11 min", label: "CI run time" },
      { value: "5 hrs", label: "Regression time saved" },
    ],
  },
  {
    id: "pt-BR",
    storage: "pt-BR",
    htmlLang: "pt-BR",
    stats: [
      { value: "2+", label: "Anos em QA" },
      { value: "140", label: "Testes automatizados" },
      { value: "11 min", label: "Tempo de CI" },
      { value: "5 h", label: "Tempo de regressão economizado" },
    ],
  },
] as const;

const NUMBER_Y_TOLERANCE_PX = 2;
const CARD_ROW_TOLERANCE_PX = 2;

type StatCopy = { value: string; label: string };
type MeasuredStat = StatCopy & {
  numberY: number;
  numberHeight: number;
  numberBottom: number;
  labelY: number;
  lineHeight: number;
  cardY: number;
};

function exactText(name: string) {
  return new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
}

function statByRole(scope: Locator, name: string, roles: readonly ("term" | "definition" | "paragraph")[]) {
  // dt/dd expose role term/definition, but their accessible name is empty.
  // Match the role, then the visible text.
  const text = exactText(name);
  let locator = scope.getByRole(roles[0]).filter({ hasText: text });
  for (const role of roles.slice(1)) {
    locator = locator.or(scope.getByRole(role).filter({ hasText: text }));
  }
  return locator;
}

async function waitUntilMotionSettled(locator: Locator) {
  await expect(locator).toBeVisible({ timeout: 15_000 });
  await expect
    .poll(
      async () =>
        locator.evaluate((element) => {
          let current: Element | null = element;
          while (current) {
            const style = getComputedStyle(current);
            if (Number(style.opacity) < 0.99) return `opacity ${style.opacity}`;
            const transform = style.transform;
            if (transform && transform !== "none") {
              const match = /^matrix\(([^)]+)\)$/.exec(transform);
              if (!match) return `transform ${transform}`;
              const [a, b, c, d, tx, ty] = match[1].split(",").map((part) => Number(part.trim()));
              const settled =
                Math.abs(a - 1) < 0.02 &&
                Math.abs(b) < 0.02 &&
                Math.abs(c) < 0.02 &&
                Math.abs(d - 1) < 0.02 &&
                Math.abs(tx) < 1 &&
                Math.abs(ty) < 1;
              if (!settled) return `transform ${transform}`;
            }
            current = current.parentElement;
          }
          return "settled";
        }),
      { timeout: 15_000 },
    )
    .toBe("settled");
}

async function boxOf(locator: Locator, name: string) {
  const box = await locator.boundingBox();
  expect(box, `${name} has a bounding box`).not.toBeNull();
  return box!;
}

async function openAbout(page: Page, viewport: { width: number; height: number }, locale: (typeof LOCALES)[number]) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.addInitScript((value) => {
    localStorage.setItem("ps-locale", value);
  }, locale.storage);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", locale.htmlLang);

  const about = page.locator("#about");
  // The stat starts at opacity 0, so scrolling the label itself waits forever.
  // The section is in the layout; scrolling it lets whileInView run.
  await about.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await waitUntilMotionSettled(statByRole(about, locale.stats[0].label, ["term", "paragraph"]));
  return about;
}

async function measureStats(about: Locator, stats: readonly StatCopy[]): Promise<MeasuredStat[]> {
  const measured: MeasuredStat[] = [];
  for (const stat of stats) {
    const label = statByRole(about, stat.label, ["term", "paragraph"]);
    const number = statByRole(about, stat.value, ["definition", "paragraph"]);
    await expect(label).toHaveCount(1);
    await expect(number).toHaveCount(1);
    await waitUntilMotionSettled(number);

    const numberBox = await boxOf(number, stat.value);
    const labelBox = await boxOf(label, stat.label);
    const cardBox = await boxOf(label.locator("xpath=.."), `${stat.value} card`);
    const lineHeight = await number.evaluate((element) => {
      const style = getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize);
      if (style.lineHeight === "normal") return fontSize * 1.2;
      return Number.parseFloat(style.lineHeight);
    });
    measured.push({
      ...stat,
      numberY: numberBox.y,
      numberHeight: numberBox.height,
      numberBottom: numberBox.y + numberBox.height,
      labelY: labelBox.y,
      lineHeight,
      cardY: cardBox.y,
    });
  }
  return measured;
}

function gridRows(stats: MeasuredStat[]): MeasuredStat[][] {
  const rows: MeasuredStat[][] = [];
  for (const stat of stats) {
    const row = rows.find((candidate) => Math.abs(candidate[0].cardY - stat.cardY) <= CARD_ROW_TOLERANCE_PX);
    if (row) row.push(stat);
    else rows.push([stat]);
  }
  return rows;
}

for (const viewport of VIEWPORTS) {
  for (const locale of LOCALES) {
    const where = `${locale.id}, ${viewport.width}px`;

    test(`about stat numbers sit above their labels (${where})`, async ({ page }) => {
      const about = await openAbout(page, viewport, locale);
      const stats = await measureStats(about, locale.stats);
      for (const stat of stats) {
        expect(
          stat.numberBottom,
          `${where}: ${stat.value} should sit above "${stat.label}" (number bottom ${stat.numberBottom.toFixed(1)}px, label top ${stat.labelY.toFixed(1)}px)`,
        ).toBeLessThanOrEqual(stat.labelY);
      }
    });

    test(`about stat numbers stay on one line (${where})`, async ({ page }) => {
      const about = await openAbout(page, viewport, locale);
      const stats = await measureStats(about, locale.stats);
      for (const stat of stats) {
        expect(
          stat.numberHeight,
          `${where}: ${stat.value} should stay on one line (height ${stat.numberHeight.toFixed(1)}px, line-height ${stat.lineHeight.toFixed(1)}px)`,
        ).toBeLessThanOrEqual(stat.lineHeight * 1.5);
      }
    });

    test(`about stat numbers share a y on each grid row (${where})`, async ({ page }) => {
      const about = await openAbout(page, viewport, locale);
      const stats = await measureStats(about, locale.stats);
      for (const row of gridRows(stats)) {
        for (let i = 0; i < row.length; i += 1) {
          for (let j = i + 1; j < row.length; j += 1) {
            const left = row[i];
            const right = row[j];
            const delta = Math.abs(left.numberY - right.numberY);
            expect(
              delta,
              `${where}: "${left.value}" (${left.label}) y=${left.numberY.toFixed(1)} and "${right.value}" (${right.label}) y=${right.numberY.toFixed(1)} differ by ${delta.toFixed(1)}px on the same grid row (card y ${left.cardY.toFixed(1)} and ${right.cardY.toFixed(1)})`,
            ).toBeLessThanOrEqual(NUMBER_Y_TOLERANCE_PX);
          }
        }
      }
    });
  }
}
