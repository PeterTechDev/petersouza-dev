import { NextRequest, NextResponse } from "next/server";

const PETER_CONTEXT = `You are a helpful AI assistant on Peter Souza's personal website. You answer questions about Peter based on the context below. Be friendly, concise, and professional. If asked something you don't know from the context, say you're not sure but encourage them to reach out to Peter directly.

## About Peter Souza
- Name: Peter Souza
- Location: Linhares, Espírito Santo, Brazil
- Age: 32
- Languages: Portuguese (native), English (fluent, actively improving)

## Current Role
- SDET/QA at NDG Communications (remote, US-based company)
- Playwright + TypeScript, Page Object Model, CI/CD practices
- Tools: Jira, Git/GitHub, Postman, SQL, Confluence

## Side Projects
- **AutoVendas** — B2B SaaS for used car dealerships. CRM + AI-powered WhatsApp assistant that qualifies leads and answers inventory questions. Stack: Vercel, Twilio, OpenAI, Supabase, Sentry. Multi-tenant architecture.
- **Mind Palace** — Personal knowledge base and AI agent dashboard. Next.js, reads from markdown brain docs.
- **Phantom Zone** — Agent command center for managing AI agents. Real-time monitoring.
- **My NBA Feed** — Personalized NBA news aggregator. Deployed on Vercel.

## Tech Stack
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Supabase, PostgreSQL, Drizzle ORM
- AI/ML: OpenAI API, Claude API, OpenClaw multi-agent orchestration
- Testing: Playwright, Jest/Vitest
- DevOps: Vercel, GitHub Actions, systemd, Tailscale
- Tools: OpenClaw (AI agent platform), yt-dlp, ffmpeg, Whisper

## What Makes Peter Different
- Runs a multi-agent AI team (8 specialized agents) orchestrated for development, content, QA, and research
- Real production experience with AI — not just demos, shipping products with AI at the core
- QA mindset + developer skills = builds things that actually work, tested
- Building in public, learning fast, shipping faster

## Availability
- Open to freelance projects, consulting, and full-time opportunities
- Interested in: AI-first applications, developer tools, automation
- Timezone: GMT-3 (Brazil)

## Contact
- Email: peter@petersouza.dev
- GitHub: github.com/devsavisado
- Instagram: @devsavisado`;

// ── Server-side IP rate limiting ──────────────────────────────────────────────
// Simple in-memory store: ip → { count, windowStart }
// Resets per IP after RATE_WINDOW_MS (1 hour).
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  // Vercel / most proxies set x-forwarded-for
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  // Fall back to a placeholder — unknown IPs still share a bucket
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT) {
    return false; // blocked
  }

  entry.count += 1;
  return true; // allowed
}

// ── Message length constraint ─────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 500;

// ── Route handlers ────────────────────────────────────────────────────────────

// Return 405 for GET requests instead of falling through to a 500
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    {
      status: 405,
      headers: { Allow: "POST" },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    // ── IP-based rate limiting (server-enforced) ──────────────────────────────
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "You've sent too many messages. Please wait a while before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages } = body as {
      messages: Array<{ role: string; content: string }>;
    };
    // Note: sessionCount from the client is intentionally ignored — we enforce
    // limits server-side via IP tracking above.

    // ── Validate messages ─────────────────────────────────────────────────────
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // ── Validate message length ───────────────────────────────────────────────
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.content &&
      lastMessage.content.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Message too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (anthropicKey) {
      // Use Anthropic Claude
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 512,
          system: PETER_CONTEXT,
          messages: messages.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Anthropic error:", err);
        return NextResponse.json({ error: "AI service error" }, { status: 502 });
      }

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";
      return NextResponse.json({ reply: text });
    } else if (openaiKey) {
      // Use OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 512,
          messages: [
            { role: "system", content: PETER_CONTEXT },
            ...messages.slice(-10).map((m) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("OpenAI error:", err);
        return NextResponse.json({ error: "AI service error" }, { status: 502 });
      }

      const data = await response.json();
      const text =
        data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
      return NextResponse.json({ reply: text });
    } else {
      return NextResponse.json(
        { error: "No AI API key configured." },
        { status: 503 }
      );
    }
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
