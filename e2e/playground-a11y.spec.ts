import AxeBuilder from "@axe-core/playwright";
import type { NodeResult, Result } from "axe-core";
import { expect, test, type Locator } from "@playwright/test";

/**
 * Planted /playground is not a clean-page gate: it plants a missing email
 * label and a keyboard trap. A separate test asserts axe reports that label.
 * /playground/?mode=fixed is scanned for every severity, including region.
 * A real violation stays a failure. The URL is a literal, not a catalog constant.
 */
const LOCALES = [
  { id: "en", storage: "en", htmlLang: "en" },
  { id: "pt-BR", storage: "pt-BR", htmlLang: "pt-BR" },
] as const;

const FIXED_URL = "/playground/?mode=fixed";
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

test("axe reports the missing email label in planted mode", async ({ page }) => {
  await page.goto("/playground/");
  const email = page.locator("#checkout-email");
  await expect(email).toBeVisible();
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "planted");

  const results = await new AxeBuilder({ page }).analyze();
  const label = results.violations.find((violation) => violation.id === "label");
  expect(label, formatViolations(results.violations)).toBeTruthy();
  const targets = label?.nodes.flatMap((node) => node.target.map(formatSelector)).join("\n") ?? "";
  expect(targets).toContain("checkout-email");
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
