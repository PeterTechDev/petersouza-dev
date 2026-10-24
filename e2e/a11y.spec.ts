import AxeBuilder from "@axe-core/playwright";
import type { NodeResult, Result } from "axe-core";
import { expect, test, type Locator, type Page } from "@playwright/test";

import { AXE_EXCLUDED_PATHS } from "@/lib/playground-bugs";

/**
 * Locale is client-only: localStorage key `ps-locale` (`en` | `pt-BR`).
 * The server render is English; the client then sets `<html lang>`.
 */
const LOCALES = [
  { id: "en", storage: "en", htmlLang: "en" },
  { id: "pt-BR", storage: "pt-BR", htmlLang: "pt-BR" },
] as const;

/**
 * Planted /playground stays out of this product gate. AXE_EXCLUDED_PATHS is
 * the single source, and it is pathname-only, so a pathname check also
 * matches `/playground/?mode=fixed`. Fixed mode is not listed in
 * PRODUCT_ROUTES for that reason. playground-a11y.spec.ts scans `?mode=fixed`
 * and expects zero violations of every severity. Do not add that URL here:
 * this filter would skip it.
 */
function isAxeExcluded(route: string): boolean {
  const path = new URL(route, "http://127.0.0.1").pathname.replace(/\/$/, "") || "/";
  return AXE_EXCLUDED_PATHS.some((excluded) => (excluded.replace(/\/$/, "") || "/") === path);
}

const PRODUCT_ROUTES = [
  "/",
  "/blog/",
  "/blog/building-ai-first-products/",
  "/blog/conversational-ai-for-sales/",
  "/blog/from-law-to-code/",
  "/blog/from-qa-to-ai/",
  "/blog/why-i-built-a-multi-agent-ai-team/",
  "/case-study/atrias-wiki/",
] as const;

const ROUTES = PRODUCT_ROUTES.filter((route) => !isAxeExcluded(route));

const CHAT_OPEN_LABEL = "Open Ask Me Anything chat";
const CHAT_BADGE = "Ask me anything ✨";
const CHAT_PANEL_TITLE = "Ask Me Anything 💭";
const READY_TIMEOUT_MS = 15_000;

function isBlocking(violation: Result): boolean {
  return violation.impact === "serious" || violation.impact === "critical";
}

function formatSelector(selector: NodeResult["target"][number]): string {
  return Array.isArray(selector) ? selector.join(" >>> ") : selector;
}

function formatTarget(target: NodeResult["target"]): string {
  return target.map(formatSelector).join(" ");
}

function formatViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const shown = violation.nodes.slice(0, 3).map((node) => {
        const detail = node.failureSummary?.split("\n").slice(1).join(" ").trim();
        const target = formatTarget(node.target);
        return `${target}${detail ? `: ${detail}` : ""}`;
      });
      const extra =
        violation.nodes.length > shown.length ? ` (+${violation.nodes.length - shown.length} more)` : "";
      return `${violation.id} [${violation.impact}] ${violation.help} — ${shown.join(" | ")}${extra}`;
    })
    .join("\n");
}

/**
 * AskMeAnythingWidget animates the launcher with framer-motion (1.5s delay,
 * then a spring) and does not read prefers-reduced-motion. Axe during that
 * spring sometimes misses the badge contrast. Wait until opacity and
 * transform on the element and its ancestors have settled.
 */
async function waitUntilMotionSettled(locator: Locator) {
  await expect(locator).toBeVisible({ timeout: READY_TIMEOUT_MS });
  await expect
    .poll(
      () =>
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
      { timeout: READY_TIMEOUT_MS },
    )
    .toBe("settled");
}

async function openInLocale(page: Page, route: string, locale: (typeof LOCALES)[number]) {
  await page.addInitScript((value) => {
    localStorage.setItem("ps-locale", value);
  }, locale.storage);
  await page.goto(route);
  await expect(page.locator("html")).toHaveAttribute("lang", locale.htmlLang);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
    timeout: READY_TIMEOUT_MS,
  });
  await waitUntilMotionSettled(page.getByText(CHAT_BADGE));
  await expect(page.getByRole("button", { name: CHAT_OPEN_LABEL })).toBeVisible();
}

async function expectNoBlockingViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(isBlocking);
  expect(formatViolations(blocking), "serious or critical axe violations").toBe("");
}

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    test(`${route} has no serious or critical axe violations (${locale.id})`, async ({ page }) => {
      await openInLocale(page, route, locale);
      await expectNoBlockingViolations(page);
    });
  }
}

test("open chat on the home page has no serious or critical axe violations (en)", async ({ page }) => {
  const english = LOCALES[0];
  await openInLocale(page, "/", english);
  await page.getByRole("button", { name: CHAT_OPEN_LABEL }).click();
  await waitUntilMotionSettled(page.getByText(CHAT_PANEL_TITLE));
  // The badge fades out after open. Scan only once AnimatePresence has removed it,
  // or axe samples the half-transparent pill and the contrast ratio moves.
  await expect(page.getByText(CHAT_BADGE)).toHaveCount(0, { timeout: READY_TIMEOUT_MS });
  await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
  await expectNoBlockingViolations(page);
});
