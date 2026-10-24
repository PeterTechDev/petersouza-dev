import { expect, test, type Page, type Route } from "@playwright/test";

import { test as chatTest } from "./chat-server";

const CHAT_PATH = "/api/chat/";

const USER_MESSAGE = "Where is Peter based?";
const MOCK_REPLY = "He is based in Linhares, Brazil.";
const GENERIC_ERROR = "Oops, something went wrong. Try again in a moment.";
const SESSION_LIMIT_MESSAGE =
  "You've reached the session limit. Refresh the page to start a new conversation!";
const OPEN_CHAT = "Open Ask Me Anything chat";
const SEND_MESSAGE = "Send message";
const CHAT_TITLE = "Ask Me Anything 💭";
const CHAT_READY_TIMEOUT_MS = 15_000;

const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_BASE_URL?.trim();

const PREVIEW_API_SKIP =
  "PLAYWRIGHT_BASE_URL is set. Real POST /api/chat calls are skipped so a preview or production host is never billed for LLM traffic and does not share its rate-limit window with this suite. UI tests mock /api/chat with page.route and still run.";

// Length, the no-key 503 text, invalid message objects, and 429 after N valid
// posts live in chat-contract.spec.ts. A 429 from an invalid body is risk 3
// and is not a contract assertion. This file keeps the unparsed body, plus
// null, empty, and non-object bodies, and the mocked widget UI.
chatTest.describe("real POST /api/chat", () => {
  chatTest.beforeEach(() => {
    chatTest.skip(Boolean(PREVIEW_BASE_URL), PREVIEW_API_SKIP);
  });

  // Contract: a body that is not JSON is 400 with a JSON error.
  // Buffer keeps Playwright from JSON.stringifying the payload into a quoted string.
  chatTest("returns 400 when the JSON body cannot be parsed", async ({ request, chatOrigin }) => {
    const response = await request.post(`${chatOrigin}${CHAT_PATH}`, {
      headers: { "content-type": "application/json" },
      data: Buffer.from("{"),
    });
    expect(response.status()).toBe(400);
    const body = (await response.json()) as { error?: string };
    expect(body.error).toEqual(expect.any(String));
    expect(body.error?.length ?? 0).toBeGreaterThan(0);
  });

  // null, an empty payload, and a JSON value that is not an object are all 400
  // with a non-empty JSON error. The error text is not part of the contract.
  chatTest("returns 400 and a JSON error for null, empty, and non-object bodies", async ({ request, chatOrigin }) => {
    const cases: Array<{ slot: string; body: Buffer }> = [
      { slot: "null", body: Buffer.from("null") },
      { slot: "empty", body: Buffer.from("") },
      { slot: "array", body: Buffer.from("[]") },
      { slot: "number", body: Buffer.from("123") },
    ];

    for (const entry of cases) {
      const response = await request.post(`${chatOrigin}${CHAT_PATH}`, {
        headers: { "content-type": "application/json" },
        data: entry.body,
      });
      expect(response.status(), entry.slot).toBe(400);
      const body = (await response.json()) as { error?: string };
      expect(body.error, entry.slot).toEqual(expect.any(String));
      expect(body.error?.length ?? 0, entry.slot).toBeGreaterThan(0);
    }
  });
});

async function mockChat(page: Page, handler: (route: Route) => Promise<void>) {
  await page.route(/\/api\/chat\/?$/, async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    await handler(route);
  });
}

async function openChat(page: Page) {
  await page.goto("/");
  const opener = page.getByRole("button", { name: OPEN_CHAT });
  await expect(opener).toBeVisible({ timeout: CHAT_READY_TIMEOUT_MS });
  await opener.click();
  await expect(page.getByText(CHAT_TITLE)).toBeVisible();
  await expect(page.getByRole("textbox")).toBeVisible();
}

async function sendChat(page: Page, message: string) {
  await page.getByRole("textbox").fill(message);
  await page.getByRole("button", { name: SEND_MESSAGE }).click();
}

test("shows the assistant reply when /api/chat succeeds", async ({ page }) => {
  await mockChat(page, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ reply: MOCK_REPLY }),
    });
  });

  await openChat(page);
  await sendChat(page, USER_MESSAGE);

  await expect(page.getByText(USER_MESSAGE)).toBeVisible();
  await expect(page.getByText(MOCK_REPLY)).toBeVisible();
  await expect(page.getByText("1/10 messages")).toBeVisible();
});

test("shows an error message when /api/chat fails", async ({ page }) => {
  await mockChat(page, async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "No AI API key configured." }),
    });
  });

  await openChat(page);
  await sendChat(page, USER_MESSAGE);

  await expect(page.getByText(USER_MESSAGE)).toBeVisible();
  await expect(page.getByText(GENERIC_ERROR)).toBeVisible();
  await expect(page.getByText(MOCK_REPLY)).toHaveCount(0);
});

test("shows the session-limit copy when /api/chat returns 429", async ({ page }) => {
  await mockChat(page, async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ error: "You've sent too many messages. Please wait a while before trying again." }),
    });
  });

  await openChat(page);
  await sendChat(page, USER_MESSAGE);

  await expect(page.getByText(SESSION_LIMIT_MESSAGE)).toBeVisible();
  await expect(page.getByText(GENERIC_ERROR)).toHaveCount(0);
});

test("keeps the composer disabled while /api/chat is loading", async ({ page }) => {
  let release = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });

  await mockChat(page, async (route) => {
    await pending;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ reply: MOCK_REPLY }),
    });
  });

  try {
    await openChat(page);
    await sendChat(page, USER_MESSAGE);

    await expect(page.getByText(USER_MESSAGE)).toBeVisible();
    await expect(page.getByRole("textbox")).toBeDisabled();
    await expect(page.getByRole("button", { name: SEND_MESSAGE })).toBeDisabled();
    await expect(page.getByText(MOCK_REPLY)).toHaveCount(0);

    release();

    await expect(page.getByText(MOCK_REPLY)).toBeVisible();
    await expect(page.getByRole("textbox")).toBeEnabled();
  } finally {
    release();
  }
});
