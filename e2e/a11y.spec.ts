import AxeBuilder from "@axe-core/playwright";
import type { NodeResult, Result } from "axe-core";
import { expect, test, type Page } from "@playwright/test";

/**
 * Locale is client-only: localStorage key `ps-locale` (`en` | `pt-BR`).
 * The server render is English; the client then sets `<html lang>`.
 */
const LOCALES = [
  { id: "en", storage: "en", htmlLang: "en" },
  { id: "pt-BR", storage: "pt-BR", htmlLang: "pt-BR" },
] as const;

/**
 * Product routes only. `/playground/` is a bug-bash fixture, not production
 * UI (README on #8): planted mode is expected to fail axe, and `?mode=fixed`
 * stays in the gate with zero violations. That fixed scan lives in the
 * playground spec as the literal `/playground/?mode=fixed`. This file does
 * not list the URL and does not exclude it. No shared path list.
 */
const ROUTES = [
  "/",
  "/blog/",
  "/blog/building-ai-first-products/",
  "/blog/conversational-ai-for-sales/",
  "/blog/from-law-to-code/",
  "/blog/from-qa-to-ai/",
  "/blog/why-i-built-a-multi-agent-ai-team/",
  "/case-study/atrias-wiki/",
] as const;

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

async function openInLocale(page: Page, route: string, locale: (typeof LOCALES)[number]) {
  await page.addInitScript((value) => {
    localStorage.setItem("ps-locale", value);
  }, locale.storage);
  await page.goto(route);
  await expect(page.locator("html")).toHaveAttribute("lang", locale.htmlLang);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
    timeout: READY_TIMEOUT_MS,
  });
}

type TextOpacitySnapshot = {
  faint: number;
  total: number;
  signature: string;
};

/**
 * whileInView keeps opacity at 0 until the block intersects the viewport.
 * The app has no useReducedMotion, so Playwright's reducedMotion does not
 * render that final state (it only stops the Tailwind motion-safe ping).
 * Scroll the document in viewport steps, then wait until entrance opacity
 * has stopped changing. A static utility such as opacity-60 on the language
 * separator is design, not an in-progress entrance, and stays below 1.
 */
async function scrollPageToEnd(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(1, Math.floor(window.innerHeight * 0.7));
    let previous = -1;
    for (let guard = 0; guard < 100; guard += 1) {
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (window.scrollY >= max - 1 || window.scrollY === previous) break;
      previous = window.scrollY;
      window.scrollBy(0, step);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

async function textOpacitySnapshot(page: Page): Promise<TextOpacitySnapshot> {
  return page.evaluate(() => {
    const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let faint = 0;
    let total = 0;
    const partial: string[] = [];
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent ?? "";
      if (!text.trim()) continue;
      const start = walker.currentNode.parentElement;
      if (!start || skip.has(start.tagName)) continue;
      let current: Element | null = start;
      let minOpacity = 1;
      let hidden = false;
      while (current && current instanceof HTMLElement) {
        const style = getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden") {
          hidden = true;
          break;
        }
        const opacity = Number(style.opacity);
        if (Number.isFinite(opacity) && opacity < minOpacity) minOpacity = opacity;
        current = current.parentElement;
      }
      if (hidden) continue;
      total += 1;
      if (minOpacity < 0.1) faint += 1;
      if (minOpacity < 0.99) partial.push(minOpacity.toFixed(2));
    }
    partial.sort();
    return { faint, total, signature: partial.join(",") };
  });
}

async function revealPageForAxe(page: Page) {
  await scrollPageToEnd(page);
  await expect
    .poll(
      async () => {
        const first = await textOpacitySnapshot(page);
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
        const second = await textOpacitySnapshot(page);
        if (first.faint !== 0 || second.faint !== 0) {
          return `faint ${second.faint} of ${second.total}`;
        }
        if (first.signature !== second.signature) return `animating ${second.signature}`;
        return "settled";
      },
      { timeout: READY_TIMEOUT_MS },
    )
    .toBe("settled");

  const settled = await textOpacitySnapshot(page);
  expect(
    settled.faint,
    `texts with opacity < 0.1 before axe (scanned ${settled.total} text nodes)`,
  ).toBe(0);
}

async function expectNoBlockingViolations(page: Page) {
  await revealPageForAxe(page);
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
