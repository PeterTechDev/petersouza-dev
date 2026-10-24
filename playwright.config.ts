import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

/**
 * Shared machine: other agents already bind port 3000. Use a port in
 * 3300–3399, for example PLAYWRIGHT_PORT=3300. Nobody should use 3000 there.
 * PLAYWRIGHT_BASE_URL still wins over PLAYWRIGHT_PORT.
 *
 * reuseExistingServer stays false unless PLAYWRIGHT_REUSE_SERVER=1, and never
 * in CI. Reusing another agent's server can false-green a run (the server
 * under test is a different checkout) and can bill an LLM if that process
 * still has API keys.
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? "3000");
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(`PLAYWRIGHT_PORT must be an integer port, received ${process.env.PLAYWRIGHT_PORT}`);
}

function allowedPreviewBaseURL(): string | undefined {
  const raw = process.env.PLAYWRIGHT_BASE_URL?.trim();
  if (!raw) return undefined;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`PLAYWRIGHT_BASE_URL is not a URL: ${raw}`);
  }
  const host = url.hostname;
  const allowed =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") ||
    host === "petersouza.dev" ||
    host.endsWith(".petersouza.dev");
  if (!allowed) {
    throw new Error(
      `PLAYWRIGHT_BASE_URL host ${host} is not allowed. Use localhost, 127.0.0.1, *.vercel.app, or petersouza.dev.`,
    );
  }
  return raw;
}

const localBaseURL = `http://127.0.0.1:${PORT}`;
const previewBaseURL = allowedPreviewBaseURL();
const baseURL = previewBaseURL || localBaseURL;
const reuseExistingServer = !process.env.CI && process.env.PLAYWRIGHT_REUSE_SERVER === "1";

/**
 * CI builds first (`npm run build`), then this server serves that build.
 * A missing `.next` build (local `npm run test:e2e` on a clean tree) builds once.
 * LLM keys are cleared so `/api/chat` stays deterministic: no key means 503.
 */
function webServerCommand(): string {
  const start = `npm run start -- --hostname 127.0.0.1 --port ${PORT}`;
  if (existsSync(".next/BUILD_ID")) return start;
  return `npm run build && ${start}`;
}

function webServerEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) env[key] = value;
  }
  env.ANTHROPIC_API_KEY = "";
  env.OPENAI_API_KEY = "";
  return env;
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["line"],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    // The chat launcher does not read prefers-reduced-motion (framer-motion
    // runs anyway). a11y still waits until that motion settles. This only
    // disables the Tailwind `motion-safe` ping ring.
    reducedMotion: "reduce",
  },
  webServer: previewBaseURL
    ? undefined
    : {
        command: webServerCommand(),
        url: localBaseURL,
        reuseExistingServer,
        timeout: 180_000,
        env: webServerEnv(),
      },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        locale: "en-US",
      },
    },
  ],
});
