import AxeBuilder from "@axe-core/playwright";
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
 * Feature 2 (`/playground`) is a bug-bash with planted accessibility defects
 * (missing label, keyboard trap, and others). That page is a demo, not a
 * product surface, so it is excluded from this gate. It is not shipped on
 * this branch; the filter stays so listing it below cannot turn those
 * planted bugs into a failing quality check.
 */
const AXE_EXCLUDED_ROUTES = ["/playground", "/playground/"] as const;

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

const ROUTES = PRODUCT_ROUTES.filter(
  (route) => !(AXE_EXCLUDED_ROUTES as readonly string[]).includes(route),
);

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);
const CHAT_OPEN_LABEL = "Open Ask Me Anything chat";
const READY_TIMEOUT_MS = 15_000;

type AxeNode = { target: string[]; failureSummary?: string };
type AxeViolation = {
  id: string;
  impact?: string | null;
  help: string;
  nodes: AxeNode[];
};

function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map((violation) => {
      const shown = violation.nodes.slice(0, 3).map((node) => {
        const detail = node.failureSummary?.split("\n").slice(1).join(" ").trim();
        return `${node.target.join(" ")}${detail ? `: ${detail}` : ""}`;
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
  // The chat launcher animates in late. Wait for it so the scan sees a settled page.
  await expect(page.getByRole("button", { name: CHAT_OPEN_LABEL })).toBeVisible({
    timeout: READY_TIMEOUT_MS,
  });
}

async function expectNoBlockingViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact != null && BLOCKING_IMPACTS.has(violation.impact),
  );
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
  await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
  await expectNoBlockingViolations(page);
});
