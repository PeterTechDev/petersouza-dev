import { expect, test, type APIRequestContext, type Page, type Route, type TestInfo } from "@playwright/test";

const CHAT_PATH = "/api/chat/";
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT = 20;

const USER_MESSAGE = "Where is Peter based?";
const MOCK_REPLY = "He is based in Linhares, Brazil.";
const GENERIC_ERROR = "Oops, something went wrong. Try again in a moment.";
const SESSION_LIMIT_MESSAGE =
  "You've reached the session limit. Refresh the page to start a new conversation!";
const OPEN_CHAT = "Open Ask Me Anything chat";
const SEND_MESSAGE = "Send message";
const CHAT_TITLE = "Ask Me Anything 💭";
const CHAT_READY_TIMEOUT_MS = 15_000;

const VALID_MESSAGE = "What is Peter's current role?";
const TOO_LONG_MESSAGE = "a".repeat(MAX_MESSAGE_LENGTH + 1);
const AT_LIMIT_MESSAGE = "b".repeat(MAX_MESSAGE_LENGTH);

const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_BASE_URL?.trim();

/**
 * Feature 3 runs the 429 case only outside CI. Each attempt uses its own
 * X-Forwarded-For bucket, so this is not an ordering race between workers.
 * The skip is the local-only gate: the test sends 21 real POSTs to exhaust
 * the in-memory 20/hour window. It is not hiding a product failure.
 */
const LOCAL_RATE_LIMIT_REASON =
  "Local-only by feature 3. Sends 21 real POSTs from one IP to exhaust the in-memory 20-request window and expects 429. Unique X-Forwarded-For values keep this off other tests, so it is not skipped for being order-dependent. Unset CI to run it.";

const PREVIEW_API_SKIP =
  "PLAYWRIGHT_BASE_URL is set. Real POST /api/chat calls are skipped so a preview or production host is never billed for LLM traffic and does not share its rate-limit window with this suite. UI tests mock /api/chat with page.route and still run.";

function clientIp(testInfo: TestInfo, slot: string): string {
  return [
    "qa",
    testInfo.workerIndex,
    testInfo.repeatEachIndex,
    testInfo.retry,
    slot,
  ].join("-");
}

async function postChat(request: APIRequestContext, ip: string, body: string | Record<string, unknown>) {
  return request.post(CHAT_PATH, {
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    data: body,
  });
}

test.describe("real POST /api/chat", () => {
  test.beforeEach(() => {
    test.skip(Boolean(PREVIEW_BASE_URL), PREVIEW_API_SKIP);
  });

  test("returns 400 when the latest message is longer than 500 characters", async ({ request }, testInfo) => {
    const tooLong = await postChat(request, clientIp(testInfo, "too-long"), {
      messages: [{ role: "user", content: TOO_LONG_MESSAGE }],
    });
    expect(tooLong.status()).toBe(400);
    const tooLongBody = (await tooLong.json()) as { error?: string };
    expect(tooLongBody.error).toContain(String(MAX_MESSAGE_LENGTH));

    const atLimit = await postChat(request, clientIp(testInfo, "at-limit"), {
      messages: [{ role: "user", content: AT_LIMIT_MESSAGE }],
    });
    expect(atLimit.status()).toBe(503);
  });

  test("returns 503 when no LLM API key is configured", async ({ request }, testInfo) => {
    const response = await postChat(request, clientIp(testInfo, "no-key"), {
      messages: [{ role: "user", content: VALID_MESSAGE }],
    });
    expect(response.status()).toBe(503);
    const body = (await response.json()) as { error?: string };
    expect(body.error).toBe("No AI API key configured.");
  });

  test("returns 400 when messages are missing, empty, or not an array", async ({ request }, testInfo) => {
    const cases = [
      { slot: "missing", body: {} },
      { slot: "empty", body: { messages: [] } },
      { slot: "string", body: { messages: "hello" } },
    ];

    for (const [index, entry] of cases.entries()) {
      const response = await postChat(request, clientIp(testInfo, `${entry.slot}-${index}`), entry.body);
      expect(response.status(), entry.slot).toBe(400);
      const body = (await response.json()) as { error?: string };
      expect(body.error, entry.slot).toBe("Invalid messages");
    }
  });

  // Contract: a body that is not JSON is 400. route.ts does not do that.
  // req.json() throws and the generic catch returns 500 "Internal server error".
  // Leave this red until the route returns 400. Do not skip it.
  // Buffer keeps Playwright from JSON.stringifying the payload into a valid string.
  test("returns 400 when the JSON body cannot be parsed", async ({ request }, testInfo) => {
    const response = await request.post(CHAT_PATH, {
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": clientIp(testInfo, "bad-json"),
      },
      data: Buffer.from("{"),
    });
    expect(response.status()).toBe(400);
  });

  test("returns 429 on the 21st POST from the same IP @local-only", async ({ request }, testInfo) => {
    test.skip(!!process.env.CI, LOCAL_RATE_LIMIT_REASON);

    const ip = clientIp(testInfo, "rate-limit");
    const payload = { messages: [{ role: "user", content: VALID_MESSAGE }] };

    for (let attempt = 1; attempt <= RATE_LIMIT; attempt += 1) {
      const response = await postChat(request, ip, payload);
      expect(response.status(), `request ${attempt}`).toBe(503);
    }

    const blocked = await postChat(request, ip, payload);
    expect(blocked.status()).toBe(429);
    const body = (await blocked.json()) as { error?: string };
    expect(body.error).toBe("You've sent too many messages. Please wait a while before trying again.");
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
