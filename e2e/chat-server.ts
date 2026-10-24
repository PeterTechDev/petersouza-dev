import { type ChildProcess, spawn } from "node:child_process";
import { openSync } from "node:fs";
import net from "node:net";

import { test as base } from "@playwright/test";

/**
 * Each real POST test gets its own `next start` in 3320–3399 (3300–3319 stay
 * free for other agents on this machine). The route keeps the rate-limit map
 * in memory for one hour and does not read CHAT_RATE_WINDOW_MS, so a shared
 * server would fill the 20-request bucket across `--repeat-each`. A fresh
 * process resets the map. Tests do not send X-Forwarded-For to buy a new
 * bucket: that header is risk 4, and the suite must still pass if it is ignored.
 */
const CHAT_PORT_BASE = 3320;

function portIsOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });
    const finish = (open: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(open);
    };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
  });
}

async function waitForPort(port: number, open: boolean, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((await portIsOpen(port)) === open) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`port ${port} did not become ${open ? "open" : "closed"} within ${timeoutMs}ms`);
}

function stopServer(child: ChildProcess) {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {
      // The process already exited.
    }
  }
}

export const test = base.extend<{ chatOrigin: string }>({
  chatOrigin: async ({}, use, testInfo) => {
    if (process.env.PLAYWRIGHT_BASE_URL?.trim()) {
      await use("http://preview.invalid");
      return;
    }

    const port = CHAT_PORT_BASE + testInfo.workerIndex;
    if (port < 3300 || port > 3399) {
      throw new Error(`chat server port ${port} is outside 3300-3399`);
    }

    await waitForPort(port, false, 15_000);

    const log = openSync(`/tmp/chat-server-${port}.log`, "a");
    const child = spawn("npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", String(port)], {
      cwd: process.cwd(),
      detached: true,
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: "",
        OPENAI_API_KEY: "",
      },
      stdio: ["ignore", log, log],
    });

    const deadline = Date.now() + 60_000;
    let ready = false;
    while (Date.now() < deadline) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/api/chat/`);
        if (response.status === 405) {
          ready = true;
          break;
        }
      } catch {
        // The process is still booting.
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    if (!ready) {
      stopServer(child);
      throw new Error(`chat server on ${port} did not return 405 from GET /api/chat/`);
    }

    try {
      await use(`http://127.0.0.1:${port}`);
    } finally {
      stopServer(child);
      await waitForPort(port, false, 15_000);
    }
  },
});

export { expect } from "@playwright/test";
