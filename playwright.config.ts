import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const localBaseURL = `http://127.0.0.1:${PORT}`;
const previewBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const baseURL = previewBaseURL || localBaseURL;

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
        reuseExistingServer: !process.env.CI,
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
