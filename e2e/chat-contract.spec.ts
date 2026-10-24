import { type APIRequestContext, type TestInfo, test } from "@playwright/test";

import { expect, test as chatTest } from "./chat-server";

const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT = 20;
const NO_KEY = "No AI API key configured.";
const TOO_LONG = "Message too long. Please keep messages under 500 characters.";
const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const PREVIEW_API_SKIP =
  "PLAYWRIGHT_BASE_URL is set. Real POST /api/chat calls are skipped so a preview or production host is never billed for LLM traffic and does not share its rate-limit window with this suite. UI tests mock /api/chat with page.route and still run.";
const LOCAL_RATE_LIMIT_REASON =
  "Local-only. Sends 21 valid POSTs on a fresh server and expects 429 on the last one. It does not run in CI and does not run when PLAYWRIGHT_BASE_URL is set. No window poll.";

/**
 * A provider 502 needs a configured key and a non-OK HTTP response from
 * Anthropic or OpenAI. This suite clears both keys, so a valid message stops
 * at 503 and never calls a provider. A fake key would hit the public API and
 * depend on the network, so the 502 case is not in the suite.
 *
 * Quota isolation does not use X-Forwarded-For and does not treat "429 before
 * parse" as a contract. Each real POST test starts its own server (see
 * chat-server.ts), so one test's valid posts cannot fill the bucket of the
 * next. Per test, valid (no-key 503) posts stay under 20 except the rate-limit
 * test, which owns that 21st response:
 * - slash-less redirect: 1
 * - 500/501 length: 1
 * - UTF-16 characterization: 2
 * - missing/empty/string messages: 0
 * - array or number body: 0
 * - null body: 0
 * - rate limit: 21, on its own server
 * The four security tests also use their own servers. r3 and r4 fill a bucket
 * on purpose and must not share it with the contract tests.
 */

const EMOJI = "😀";
const CEDILLA = "ç";

type ChatBody = string | Record<string, unknown> | Buffer;

async function postChat(
  request: APIRequestContext,
  origin: string,
  path: string,
  body: ChatBody,
  extraHeaders?: Record<string, string>,
) {
  return request.post(`${origin}${path}`, {
    maxRedirects: 0,
    headers: {
      "content-type": "application/json",
      ...extraHeaders,
    },
    data: body,
  });
}

function userMessage(content: string) {
  return { messages: [{ role: "user", content }] };
}

async function readError(response: Awaited<ReturnType<APIRequestContext["post"]>>) {
  const body = (await response.json()) as { error?: unknown };
  return { status: response.status(), error: body.error, raw: body };
}

chatTest.describe("real POST /api/chat/", () => {
  chatTest.beforeEach(() => {
    chatTest.skip(Boolean(PREVIEW_BASE_URL), PREVIEW_API_SKIP);
  });

  chatTest("redirects a slash-less POST to /api/chat/ with 308", async ({ request, chatOrigin }) => {
    const response = await postChat(request, chatOrigin, "/api/chat", userMessage("hi"));
    expect(response.status()).toBe(308);
    expect(response.headers().location ?? "").toMatch(/\/api\/chat\/?$/);
  });

  chatTest("accepts a last message of 500 characters and rejects 501", async ({ request, chatOrigin }) => {
    const accepted = await readError(
      await postChat(request, chatOrigin, "/api/chat/", userMessage("a".repeat(MAX_MESSAGE_LENGTH))),
    );
    expect(accepted.status).toBe(503);
    expect(accepted.error).toBe(NO_KEY);

    const rejected = await readError(
      await postChat(request, chatOrigin, "/api/chat/", userMessage("a".repeat(MAX_MESSAGE_LENGTH + 1))),
    );
    expect(rejected.status).toBe(400);
    expect(rejected.error).toBe(TOO_LONG);
  });

  // Characterization test: documents the route's current length check, which
  // uses JavaScript string length (UTF-16 code units), not Unicode code points.
  chatTest("counts the 500 limit in UTF-16 code units, including emoji and ç", async ({ request, chatOrigin }) => {
    // 😀 is one code point and two UTF-16 code units. 250 of them are exactly
    // 500 code units, so the route accepts them. 251 are 502 code units and
    // are rejected. ç is one code unit (two UTF-8 bytes) and follows the same
    // 500 / 501 boundary.
    expect(EMOJI.length).toBe(2);
    expect(CEDILLA.length).toBe(1);

    const emojiOk = await postChat(request, chatOrigin, "/api/chat/", userMessage(EMOJI.repeat(250)));
    expect(emojiOk.status(), "250 emoji = 500 UTF-16 units").toBe(503);

    const emojiOver = await postChat(request, chatOrigin, "/api/chat/", userMessage(EMOJI.repeat(251)));
    expect(emojiOver.status(), "251 emoji = 502 UTF-16 units").toBe(400);

    const cedillaOk = await postChat(
      request,
      chatOrigin,
      "/api/chat/",
      userMessage(CEDILLA.repeat(MAX_MESSAGE_LENGTH)),
    );
    expect(cedillaOk.status(), "500 × ç").toBe(503);

    const cedillaOver = await postChat(
      request,
      chatOrigin,
      "/api/chat/",
      userMessage(CEDILLA.repeat(MAX_MESSAGE_LENGTH + 1)),
    );
    expect(cedillaOver.status(), "501 × ç").toBe(400);
  });

  chatTest("returns 400 Invalid messages for a missing, empty, or string messages field", async ({
    request,
    chatOrigin,
  }) => {
    const cases: Array<{ slot: string; body: ChatBody }> = [
      { slot: "missing", body: {} },
      { slot: "empty", body: { messages: [] } },
      { slot: "string", body: { messages: "hi" } },
    ];

    for (const entry of cases) {
      const response = await readError(await postChat(request, chatOrigin, "/api/chat/", entry.body));
      expect(response.status, entry.slot).toBe(400);
      expect(response.error, entry.slot).toBe("Invalid messages");
    }
  });

  chatTest("returns 400 and a JSON error for an array or number body", async ({ request, chatOrigin }) => {
    const cases: Array<{ slot: string; body: Buffer }> = [
      { slot: "array", body: Buffer.from("[]") },
      { slot: "number", body: Buffer.from("123") },
    ];

    for (const entry of cases) {
      const response = await readError(await postChat(request, chatOrigin, "/api/chat/", entry.body));
      expect(response.status, entry.slot).toBe(400);
      expect(response.error, entry.slot).toEqual(expect.any(String));
      expect(typeof response.error === "string" ? response.error.length : 0, entry.slot).toBeGreaterThan(0);
    }
  });

  // A null body is 400 with a JSON error. The assertion does not lock the text.
  chatTest("returns 400 when the JSON body is null", async ({ request, chatOrigin }) => {
    const response = await readError(await postChat(request, chatOrigin, "/api/chat/", Buffer.from("null")));
    expect(response.status).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(typeof response.error === "string" ? response.error.length : 0).toBeGreaterThan(0);
  });
});

chatTest.describe("rate limit on its own server", () => {
  chatTest.describe.configure({ mode: "serial" });
  chatTest.beforeEach(() => {
    chatTest.skip(Boolean(PREVIEW_BASE_URL), PREVIEW_API_SKIP);
    chatTest.skip(!!process.env.CI, LOCAL_RATE_LIMIT_REASON);
  });

  chatTest("returns 429 after 20 valid posts", async ({ request, chatOrigin }) => {
    const payload = userMessage("What is Peter's current role?");

    for (let attempt = 1; attempt <= RATE_LIMIT; attempt += 1) {
      const response = await postChat(request, chatOrigin, "/api/chat/", payload);
      expect(response.status(), `request ${attempt}`).toBe(503);
    }

    const blocked = await postChat(request, chatOrigin, "/api/chat/", payload);
    expect(blocked.status(), "429 after 20 valid posts").toBe(429);
  });
});

const RISK_STILL_OPEN =
  "Security risk still present. Remove test.fail when the backlog item is fixed.";

function annotateSecurityRisk(description: string) {
  chatTest.info().annotations.push({ type: "security-risk", description });
}

async function proveServerAnswered(
  testInfo: TestInfo,
  response: { status: number; raw: unknown },
) {
  expect(response.status, "server responded with a status").toEqual(expect.any(Number));
  expect(response.raw, "server responded with a body").toEqual(expect.any(Object));
  await testInfo.attach("risk-observation", {
    body: JSON.stringify({ status: response.status, body: response.raw }),
    contentType: "application/json",
  });
  chatTest.fail(true, RISK_STILL_OPEN);
}

chatTest.describe("security risks that fail until the route is fixed", () => {
  chatTest.beforeEach(() => {
    chatTest.skip(Boolean(PREVIEW_BASE_URL), PREVIEW_API_SKIP);
  });

  chatTest("earlier messages have no length limit", async ({ request, chatOrigin }, testInfo) => {
    annotateSecurityRisk(
      "Peter backlog item 1: histórico sem limite. Mensagens totalizando ~5000 caracteres passam da validação (503 sem chave). O esperado é 400.",
    );
    const messages = Array.from({ length: 10 }, () => ({
      role: "user",
      content: "a".repeat(MAX_MESSAGE_LENGTH),
    }));
    const response = await readError(await postChat(request, chatOrigin, "/api/chat/", { messages }));
    await proveServerAnswered(testInfo, response);
    expect(response.status, `observed ${response.status} ${JSON.stringify(response.raw)}`).toBe(400);
  });

  chatTest("non-string content is not validated", async ({ request, chatOrigin }, testInfo) => {
    annotateSecurityRisk(
      "Peter backlog item 2: content não-string. Um número em content chega no 503 sem chave. O esperado é 400.",
    );
    const response = await readError(
      await postChat(request, chatOrigin, "/api/chat/", {
        messages: [{ role: "user", content: 42 }],
      }),
    );
    await proveServerAnswered(testInfo, response);
    expect(response.status, `observed ${response.status} ${JSON.stringify(response.raw)}`).toBe(400);
  });

  chatTest("invalid requests still consume the rate-limit quota", async ({ request, chatOrigin }, testInfo) => {
    annotateSecurityRisk(
      "Peter backlog item 3: cota consumida antes do parse. Depois de 20 corpos inválidos, um POST válido não pode receber 429.",
    );
    for (let attempt = 1; attempt <= RATE_LIMIT; attempt += 1) {
      const invalid = await postChat(request, chatOrigin, "/api/chat/", {});
      expect(invalid.status(), `invalid ${attempt}`).toBe(400);
    }

    const valid = await readError(
      await postChat(request, chatOrigin, "/api/chat/", userMessage("What is Peter's current role?")),
    );
    await proveServerAnswered(testInfo, valid);
    expect(
      valid.status,
      `valid after ${RATE_LIMIT} invalid observed ${valid.status} ${JSON.stringify(valid.raw)}`,
    ).not.toBe(429);
  });

  chatTest("a client-supplied x-forwarded-for bypasses the 429", async ({ request, chatOrigin }, testInfo) => {
    annotateSecurityRisk(
      "Peter backlog item 4: trocar x-forwarded-for não pode zerar o limite. provavelmente vale em produção (Cloudflare), não verificado.",
    );
    const payload = userMessage("What is Peter's current role?");
    for (let attempt = 1; attempt <= RATE_LIMIT; attempt += 1) {
      const response = await postChat(request, chatOrigin, "/api/chat/", payload);
      expect(response.status(), `request ${attempt}`).toBe(503);
    }

    const blocked = await postChat(request, chatOrigin, "/api/chat/", payload);
    expect(blocked.status(), "bucket is full before the XFF swap").toBe(429);

    const swapped = await readError(
      await postChat(request, chatOrigin, "/api/chat/", payload, { "x-forwarded-for": "203.0.113.50" }),
    );
    await proveServerAnswered(testInfo, swapped);
    expect(swapped.status, `XFF swap observed ${swapped.status} ${JSON.stringify(swapped.raw)}`).toBe(429);
  });
});

test("GET /api/chat/ returns 405 and Allow: POST", async ({ request }) => {
  const response = await request.get("/api/chat/", { maxRedirects: 0 });
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe("POST");
  expect(((await response.json()) as { error?: string }).error).toBe("Method not allowed");
});

test("GET /api/chat without a slash redirects to /api/chat/", async ({ request }) => {
  const response = await request.get("/api/chat", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location ?? "").toMatch(/\/api\/chat\/?$/);
});
