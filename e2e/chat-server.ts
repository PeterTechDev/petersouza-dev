import { type ChildProcess, spawn } from "node:child_process";
import { openSync } from "node:fs";
import net from "node:net";

import { test as base } from "@playwright/test";

/**
 * Each real POST test gets its own `next start` inside 3300–3399. The slot
 * comes from parallelIndex, which stays in 0..workers-1 when a worker restarts
 * (workerIndex does not). The search then takes the first port in that range
 * that binds, skipping PLAYWRIGHT_PORT so the chat process never shares the
 * suite's webServer. The route keeps the rate-limit map in memory for one hour
 * and does not read CHAT_RATE_WINDOW_MS, so a shared server would fill the
 * 20-request bucket across `--repeat-each`. A fresh process resets the map.
 * Tests do not send X-Forwarded-For to buy a new bucket: that header is risk 4,
 * and the suite must still pass if it is ignored.
 */
const CHAT_PORT_MIN = 3300;
const CHAT_PORT_SPAN = 100;

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

function reservedChatPorts(): Set<number> {
  const reserved = new Set<number>();
  const main = Number(process.env.PLAYWRIGHT_PORT ?? "3000");
  if (Number.isInteger(main) && main >= CHAT_PORT_MIN && main < CHAT_PORT_MIN + CHAT_PORT_SPAN) {
    reserved.add(main);
  }
  return reserved;
}

function chatPortOrder(parallelIndex: number): number[] {
  const reserved = reservedChatPorts();
  const start = (parallelIndex * 7 + 20) % CHAT_PORT_SPAN;
  const ports: number[] = [];
  for (let step = 0; step < CHAT_PORT_SPAN; step += 1) {
    const port = CHAT_PORT_MIN + ((start + step) % CHAT_PORT_SPAN);
    if (!reserved.has(port)) ports.push(port);
  }
  return ports;
}

function bindPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
  });
}

async function allocateChatPort(parallelIndex: number): Promise<number> {
  for (const port of chatPortOrder(parallelIndex)) {
    if (await bindPort(port)) return port;
  }
  throw new Error(`no free chat server port in ${CHAT_PORT_MIN}-${CHAT_PORT_MIN + CHAT_PORT_SPAN - 1}`);
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
  chatOrigin: async ({}, provide, testInfo) => {
    if (process.env.PLAYWRIGHT_BASE_URL?.trim()) {
      await provide("http://preview.invalid");
      return;
    }

    const port = await allocateChatPort(testInfo.parallelIndex);
    if (port < CHAT_PORT_MIN || port >= CHAT_PORT_MIN + CHAT_PORT_SPAN) {
      throw new Error(`chat server port ${port} is outside ${CHAT_PORT_MIN}-${CHAT_PORT_MIN + CHAT_PORT_SPAN - 1}`);
    }

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
      await provide(`http://127.0.0.1:${port}`);
    } finally {
      stopServer(child);
      await waitForPort(port, false, 15_000);
    }
  },
});

export { expect } from "@playwright/test";
