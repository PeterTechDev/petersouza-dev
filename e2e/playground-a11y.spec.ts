import AxeBuilder from "@axe-core/playwright";
import type { NodeResult, Result } from "axe-core";
import { expect, test, type Locator, type Page } from "@playwright/test";

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

/**
 * Focusable controls outside the open note. The dialog is inside the page,
 * so `inert` has to land on each control or on one of its ancestors.
 * `.-z-10` is the particle field: its canvas is tabindex -1, so it is not in
 * the focusable list, and the open-before-mount case still has to see it.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable]",
  "summary",
  "iframe",
].join(", ");

async function backgroundEscapes(page: Page): Promise<string[]> {
  return page.evaluate((selector) => {
    function labelOf(el: Element): string {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : "";
      const classes = [...el.classList]
        .slice(0, 4)
        .map((name) => `.${name}`)
        .join("");
      const aria = el.getAttribute("aria-label");
      const name = el.getAttribute("name");
      const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
      const bits = [`<${tag}${id}${classes}>`];
      if (aria) bits.push(`aria-label="${aria}"`);
      if (name) bits.push(`name="${name}"`);
      if (text) bits.push(`"${text}"`);
      return bits.join(" ");
    }

    const dialog = document.querySelector("[role='dialog']");
    if (!dialog) return ["dialog is not open"];
    const escapes: string[] = [];
    for (const el of document.querySelectorAll(selector)) {
      if (el === dialog || dialog.contains(el)) continue;
      if (el.closest("[inert]")) continue;
      escapes.push(labelOf(el));
    }
    for (const field of document.querySelectorAll(".-z-10")) {
      if (field.closest("[inert]")) continue;
      escapes.push(`${labelOf(field)} (particle field is not inert)`);
    }
    return escapes;
  }, FOCUSABLE_SELECTOR);
}

async function focusablesWithInertAncestor(page: Page): Promise<string[]> {
  return page.evaluate((selector) => {
    function labelOf(el: Element): string {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : "";
      const aria = el.getAttribute("aria-label");
      const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
      const bits = [`<${tag}${id}>`];
      if (aria) bits.push(`aria-label="${aria}"`);
      if (text) bits.push(`"${text}"`);
      return bits.join(" ");
    }

    const stuck: string[] = [];
    for (const el of document.querySelectorAll(selector)) {
      const ancestor = el.parentElement?.closest("[inert]");
      if (!ancestor) continue;
      stuck.push(labelOf(el));
    }
    return stuck;
  }, FOCUSABLE_SELECTOR);
}

async function expectBackgroundInert(page: Page) {
  await expect
    .poll(() => backgroundEscapes(page), {
      timeout: READY_TIMEOUT_MS,
      message:
        "focusable elements outside the dialog without [inert] on themselves or an ancestor",
    })
    .toEqual([]);
}

async function expectNoInertFocusables(page: Page) {
  await expect
    .poll(() => focusablesWithInertAncestor(page), {
      timeout: READY_TIMEOUT_MS,
      message: "focusable elements that still have an [inert] ancestor after the note closed",
    })
    .toEqual([]);
}

const NOTE_CLOSE = { en: "Close", "pt-BR": "Fechar" } as const;
const REVEAL = { en: "Reveal bugs", "pt-BR": "Revelar bugs" } as const;
const HIDE = { en: "Hide bugs", "pt-BR": "Esconder bugs" } as const;
const EMAIL_ERROR = {
  en: "Enter an email with a name, a domain, and a dot.",
  "pt-BR": "Informe um e-mail com nome, domínio e um ponto.",
} as const;
const PLACED_ONE = {
  en: "Order placed. Count in this session: 1.",
  "pt-BR": "Pedido feito. Contagem nesta sessão: 1.",
} as const;

async function openFixedLocale(page: Page, locale: (typeof LOCALES)[number]) {
  await page.addInitScript((value) => {
    localStorage.setItem("ps-locale", value);
  }, locale.storage);
  await page.goto(FIXED_URL);
  await expect(page.locator("html")).toHaveAttribute("lang", locale.htmlLang);
  await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "fixed");
}

async function scanFixedState(page: Page) {
  await waitUntilMotionSettled(page.getByRole("heading", { level: 1 }));
  await waitUntilMotionSettled(page.getByText(CHAT_BADGE));
  await revealPageForAxe(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(formatViolations(results.violations), "axe violations of any severity").toBe("");
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

const NOTE_OPEN = { en: "Order note", "pt-BR": "Nota do pedido" } as const;

/**
 * The particle field is a next/dynamic chunk (ssr: false). Recognize that
 * response by the markup it ships, not by a content hash, and do not let the
 * browser run it until `release` is called.
 */
async function holdParticleFieldChunk(page: Page) {
  let heldRequests = 0;
  let released = false;
  let openGate: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    openGate = resolve;
  });

  await page.route("**/_next/static/chunks/**", async (route) => {
    const url = route.request().url();
    if (url.includes(".map")) {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const body = await response.body();
    const source = body.toString("utf8");
    const isParticleField = source.includes("fixed inset-0 -z-10") && source.includes("pointsMaterial");
    if (!isParticleField) {
      await route.fulfill({ response, body });
      return;
    }
    heldRequests += 1;
    await gate;
    await route.fulfill({ response, body });
  });

  return {
    heldRequests: () => heldRequests,
    release() {
      if (released) return;
      released = true;
      openGate();
    },
  };
}

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

  test(`opening the order note before the particle field mounts still has zero axe violations (${locale.id})`, async ({
    page,
  }) => {
    const particle = await holdParticleFieldChunk(page);
    await page.addInitScript((value) => {
      localStorage.setItem("ps-locale", value);
    }, locale.storage);
    try {
      await page.goto(FIXED_URL);
      await expect(page.locator("html")).toHaveAttribute("lang", locale.htmlLang);
      await expect(page.locator("[data-mode]")).toHaveAttribute("data-mode", "fixed");
      // The lazy chunk is requested when the page hydrates. Holding it is what
      // keeps the field out of the document until the dialog is already open.
      await expect.poll(() => particle.heldRequests(), { timeout: READY_TIMEOUT_MS }).toBeGreaterThan(0);

      const open = page.getByRole("button", { name: NOTE_OPEN[locale.id] });
      const dialog = page.getByRole("dialog");
      await expect(async () => {
        if ((await dialog.count()) === 0) await open.click();
        await expect(dialog).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: READY_TIMEOUT_MS });

      const field = page.locator(".-z-10");
      await expect(field, "ParticleField was already mounted when the dialog opened").toHaveCount(0);
      await expectBackgroundInert(page);

      particle.release();
      await expect(field).toBeVisible();
      await expect(field.locator("canvas")).toBeAttached();
      await expect(field, "ParticleField was absent when axe ran").toHaveCount(1);
      await expectBackgroundInert(page);

      const results = await new AxeBuilder({ page }).analyze();
      expect(formatViolations(results.violations), "axe violations of any severity").toBe("");

      await page.getByRole("button", { name: NOTE_CLOSE[locale.id] }).click();
      await expect(dialog).toHaveCount(0);
      await expectNoInertFocusables(page);
    } finally {
      particle.release();
    }
  });

  test(`the open order note marks the background inert and clears it on close (${locale.id})`, async ({ page }) => {
    await openFixedLocale(page, locale);
    await page.getByRole("button", { name: NOTE_OPEN[locale.id] }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.locator(".-z-10")).toHaveCount(1);
    await expectBackgroundInert(page);

    await page.getByRole("button", { name: NOTE_CLOSE[locale.id] }).click();
    await expect(dialog).toHaveCount(0);
    await expectNoInertFocusables(page);
  });

  test(`fixed mode with the bug panel open has zero axe violations (${locale.id})`, async ({ page }) => {
    await openFixedLocale(page, locale);
    const reveal = page.locator('button[aria-controls="bug-reports"]');
    await expect(reveal).toHaveText(REVEAL[locale.id]);
    await reveal.click();
    await expect(reveal).toHaveAttribute("aria-expanded", "true");
    await expect(reveal).toHaveText(HIDE[locale.id]);
    await expect(page.locator("#bug-reports")).toBeVisible();
    await scanFixedState(page);
  });

  test(`fixed mode in the email error state has zero axe violations (${locale.id})`, async ({ page }) => {
    await openFixedLocale(page, locale);
    await page.locator("#checkout-name").fill("Ada");
    await page.locator("#checkout-email").fill("a@");
    await page.locator("#checkout-submit").click();
    await expect(page.locator("form").getByRole("alert")).toHaveText(EMAIL_ERROR[locale.id]);
    await scanFixedState(page);
  });

  test(`fixed mode after an order is placed has zero axe violations (${locale.id})`, async ({ page }) => {
    await openFixedLocale(page, locale);
    await page.locator("#checkout-name").fill("Ada");
    await page.locator("#checkout-email").fill("qa@example.com");
    await page.locator("#checkout-submit").click();
    await expect(page.getByText(PLACED_ONE[locale.id], { exact: true })).toBeVisible();
    await scanFixedState(page);
  });
}
