import { expect, test, type APIRequestContext, type TestInfo } from "@playwright/test";

import { CHAT_RATE_WINDOW_MS } from "./chat-rate";

const CHAT_PATH = "/api/chat/";
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT = 20;
const NO_KEY = "No AI API key configured.";
const TOO_LONG = "Message too long. Please keep messages under 500 characters.";
const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const PREVIEW_API_SKIP =
  "PLAYWRIGHT_BASE_URL is set. Real POST /api/chat calls are skipped so a preview or production host is never billed for LLM traffic and does not share its rate-limit window with this suite. UI tests mock /api/chat with page.route and still run.";

/**
 * A provider 502 needs a configured key and a non-OK HTTP response from
 * Anthropic or OpenAI. This suite clears both keys, so a valid message stops
 * at 503 and never calls a provider. A fake key would hit the public API and
 * depend on the network, so the 502 case is not in the suite.
 */

const EMOJI = "😀";
const CEDILLA = "ç";

function clientIp(testInfo: TestInfo, slot: string): string {
  return ["qa", testInfo.workerIndex, testInfo.repeatEachIndex, testInfo.retry, slot].join("-");
}

async function postChat(
  request: APIRequestContext,
  ip: string,
  body: string | Record<string, unknown> | Buffer,
) {
  return request.post(CHAT_PATH, {
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    data: body,
  });
}

function userMessage(content: string) {
  return { messages: [{ role: "user", content }] };
}

test.describe("real POST /api/chat/", () => {
  test.beforeEach(() => {
    test.skip(Boolean(PREVIEW_BASE_URL), PREVIEW_API_SKIP);
  });

  test("redirects a slash-less POST to /api/chat/ with 308", async ({ request }, testInfo) => {
    const response = await request.post("/api/chat", {
      maxRedirects: 0,
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": clientIp(testInfo, "redirect"),
      },
      data: userMessage("hi"),
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location ?? "").toMatch(/\/api\/chat\/?$/);
  });

  test("accepts a last message of 500 characters and rejects 501", async ({ request }, testInfo) => {
    const accepted = await postChat(
      request,
      clientIp(testInfo, "len-500"),
      userMessage("a".repeat(MAX_MESSAGE_LENGTH)),
    );
    expect(accepted.status()).toBe(503);
    expect(((await accepted.json()) as { error?: string }).error).toBe(NO_KEY);

    const rejected = await postChat(
      request,
      clientIp(testInfo, "len-501"),
      userMessage("a".repeat(MAX_MESSAGE_LENGTH + 1)),
    );
    expect(rejected.status()).toBe(400);
    expect(((await rejected.json()) as { error?: string }).error).toBe(TOO_LONG);
  });

  test("counts the 500 limit in UTF-16 code units, including emoji and ç", async ({ request }, testInfo) => {
    // 😀 is one code point and two UTF-16 code units. 250 of them are exactly
    // 500 code units, so the route accepts them. 251 are 502 code units and
    // are rejected. ç is one code unit (two UTF-8 bytes) and follows the same
    // 500 / 501 boundary.
    expect(EMOJI.length).toBe(2);
    expect(CEDILLA.length).toBe(1);

    const emojiOk = await postChat(
      request,
      clientIp(testInfo, "emoji-500"),
      userMessage(EMOJI.repeat(250)),
    );
    expect(emojiOk.status(), "250 emoji = 500 UTF-16 units").toBe(503);

    const emojiOver = await postChat(
      request,
      clientIp(testInfo, "emoji-502"),
      userMessage(EMOJI.repeat(251)),
    );
    expect(emojiOver.status(), "251 emoji = 502 UTF-16 units").toBe(400);

    const cedillaOk = await postChat(
      request,
      clientIp(testInfo, "cedilla-500"),
      userMessage(CEDILLA.repeat(MAX_MESSAGE_LENGTH)),
    );
    expect(cedillaOk.status(), "500 × ç").toBe(503);

    const cedillaOver = await postChat(
      request,
      clientIp(testInfo, "cedilla-501"),
      userMessage(CEDILLA.repeat(MAX_MESSAGE_LENGTH + 1)),
    );
    expect(cedillaOver.status(), "501 × ç").toBe(400);
  });

  test("returns 400 Invalid messages for a missing, empty, string, array, or number body", async ({
    request,
  }, testInfo) => {
    const cases: Array<{ slot: string; body: string | Record<string, unknown> | Buffer }> = [
      { slot: "missing", body: {} },
      { slot: "empty", body: { messages: [] } },
      { slot: "string", body: { messages: "hi" } },
      { slot: "array", body: Buffer.from("[]") },
      { slot: "number", body: Buffer.from("123") },
    ];

    for (const entry of cases) {
      const response = await postChat(request, clientIp(testInfo, entry.slot), entry.body);
      expect(response.status(), entry.slot).toBe(400);
      expect(((await response.json()) as { error?: string }).error, entry.slot).toBe("Invalid messages");
    }
  });

  // Bug: JSON null parses, then `const { messages } = body` throws, and the
  // generic catch returns 500 "Internal server error". A malformed body is
  // 400. `[]` and `123` already return 400. Leave null red until the route
  // returns 400. Do not skip it.
  test("returns 400 when the JSON body is null", async ({ request }, testInfo) => {
    const response = await postChat(request, clientIp(testInfo, "null"), Buffer.from("null"));
    expect(response.status()).toBe(400);
  });

  test("returns 429 before parsing a blocked body, then allows a request after the window", async ({
    request,
  }, testInfo) => {
    const ip = clientIp(testInfo, "window");
    const payload = userMessage("What is Peter's current role?");

    for (let attempt = 1; attempt <= RATE_LIMIT; attempt += 1) {
      const response = await postChat(request, ip, payload);
      expect(response.status(), `request ${attempt}`).toBe(503);
    }

    const blocked = await request.post(CHAT_PATH, {
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      data: Buffer.from("{"),
    });
    expect(blocked.status()).toBe(429);

    await expect
      .poll(
        async () => {
          const released = await postChat(request, ip, payload);
          return released.status();
        },
        { timeout: CHAT_RATE_WINDOW_MS + 10_000 },
      )
      .toBe(503);
  });
});

test("GET /api/chat/ returns 405 and Allow: POST", async ({ request }) => {
  const response = await request.get(CHAT_PATH, { maxRedirects: 0 });
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe("POST");
  expect(((await response.json()) as { error?: string }).error).toBe("Method not allowed");
});

test("GET /api/chat without a slash redirects to /api/chat/", async ({ request }) => {
  const response = await request.get("/api/chat", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location ?? "").toMatch(/\/api\/chat\/?$/);
});

function securityRisk(description: string) {
  test.info().annotations.push({ type: "security-risk", description });
  test.fixme(true, "Documented security risk, not an asserted contract. Peter decides whether to fix it.");
}

test("earlier messages have no length limit", async () => {
  securityRisk(
    "Only the last message is length-checked. A previous message of 501 characters is accepted (503 with no key). A caller can put an unbounded payload in earlier messages.",
  );
});

test("non-string content is not validated", async () => {
  securityRisk(
    "content that is a number, or a message that is null, skips the string length check and reaches the no-key 503. An array content uses Array.length, so 501 items happen to be 400, but the route never requires a string.",
  );
});

test("invalid requests still consume the rate-limit quota", async () => {
  securityRisk(
    "checkRateLimit runs before parsing and validation. A 400 or a 500 still spends one of the 20 slots, so bad traffic can lock an IP out.",
  );
});

test("a client-supplied x-forwarded-for bypasses the 429 on localhost", async () => {
  securityRisk(
    "The route trusts the first x-forwarded-for value as the client IP. On localhost a caller can send a new header value and open a fresh 20-request bucket after a 429.",
  );
});
