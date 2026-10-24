import AxeBuilder from "@axe-core/playwright";
import type { NodeResult, Result } from "axe-core";
import { expect, test, type Locator, type Page } from "@playwright/test";

import { AXE_EXCLUDED_PATHS, PLAYGROUND_FIXED_MODE, PLAYGROUND_MODE_PARAM } from "@/lib/playground-bugs";

/**
 * Planted /playground is the only playground URL excluded from axe. The
 * checkout plants a missing label and a keyboard trap, so that scan is
 * expected to fail and is not a gate.
 *
 * AXE_EXCLUDED_PATHS lists the pathname only (`/playground`, `/playground/`).
 * The module comment says to skip that pathname with or without `?mode=fixed`.
 * This file does not do that. Fixed mode is scanned, and every severity must
 * be clean. A real violation stays a failure.
 */
const LOCALES = [
  { id: "en", storage: "en", htmlLang: "en" },
  { id: "pt-BR", storage: "pt-BR", htmlLang: "pt-BR" },
] as const;

const FIXED_URL = `/playground/?${PLAYGROUND_MODE_PARAM}=${PLAYGROUND_FIXED_MODE}`;
const CHAT_BADGE = "Ask me anything ✨";
const READY_TIMEOUT_MS = 15_000;

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
 * then a spring) and does not read prefers-reduced-motion. The playground
 * title does the same for 0.6s. reducedMotion in the Playwright config only
 * stops the Tailwind ping. Wait until opacity and transform have settled on
 * the element and its ancestors before scanning.
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

test("AXE_EXCLUDED_PATHS matches planted /playground and would also match fixed mode", () => {
  expect([...AXE_EXCLUDED_PATHS]).toEqual(["/playground", "/playground/"]);
  const fixedPath = new URL(FIXED_URL, "http://127.0.0.1").pathname.replace(/\/$/, "") || "/";
  const sourceWouldSkipFixed = AXE_EXCLUDED_PATHS.some(
    (excluded) => (excluded.replace(/\/$/, "") || "/") === fixedPath,
  );
  expect(sourceWouldSkipFixed).toBe(true);
});

for (const locale of LOCALES) {
  test(`/playground/?mode=fixed has zero axe violations (${locale.id})`, async ({ page }) => {
    await page.addInitScript((value) => {
      localStorage.setItem("ps-locale", value);
    }, locale.storage);
    await page.goto(FIXED_URL);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.htmlLang);
    await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "fixed");
    await waitUntilMotionSettled(page.getByRole("heading", { level: 1 }));
    await waitUntilMotionSettled(page.getByText(CHAT_BADGE));

    const results = await new AxeBuilder({ page }).analyze();
    expect(formatViolations(results.violations), "axe violations of any severity").toBe("");
  });
}
