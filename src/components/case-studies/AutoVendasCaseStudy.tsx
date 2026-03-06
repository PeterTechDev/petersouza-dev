"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  ArrowLeft,
  Bot,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Layers,
} from "lucide-react";

const techStack = [
  { name: "Next.js 14", role: "Frontend + API Routes", group: "Core" },
  { name: "TypeScript", role: "Type safety throughout", group: "Core" },
  { name: "OpenAI API", role: "GPT-4o orchestration", group: "AI" },
  { name: "Twilio", role: "WhatsApp Business API", group: "Messaging" },
  { name: "Supabase", role: "PostgreSQL + Auth + Realtime", group: "Data" },
  { name: "Vercel", role: "Deployment + edge functions", group: "Infra" },
  { name: "Sentry", role: "Error tracking", group: "Infra" },
];

const results = [
  { metric: "< 5s", label: "Average AI response time", icon: TrendingUp },
  { metric: "24/7", label: "Lead coverage without headcount", icon: CheckCircle },
  { metric: "3", label: "Dealerships in production", icon: Layers },
  { metric: "40%", label: "More qualified leads per month", icon: TrendingUp },
];

const archLines = [
  "  WhatsApp User",
  "       │",
  "       ▼",
  "   Twilio API  ──────────────────────────────",
  "       │",
  "       ▼",
  "  Next.js API Route  (/api/whatsapp/webhook)",
  "       │",
  "       ▼",
  "  Orchestrator Agent  (intent classification)",
  "       │",
  "   ┌───┴──────────────────┐",
  "   ▼                      ▼",
  " Lead Qualifier      Inventory Lookup",
  " Agent               Agent",
  "   │                      │",
  "   └────────┬─────────────┘",
  "            ▼",
  "     Escalation Handler",
  "     (human handoff logic)",
  "            │",
  "            ▼",
  "       Supabase DB",
  "   (CRM + Vehicles + Leads)",
];

export function AutoVendasCaseStudy() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      {/* Nav */}
      <nav className="px-5 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: theme.colors.textMuted }}
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-5 sm:px-6 pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
              style={{ color: theme.colors.accent }}
            >
              Case Study
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <Bot size={28} className="text-white" />
              </div>
              <div>
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-black leading-none"
                  style={{ color: theme.colors.text }}
                >
                  AutoVendas
                </h1>
                <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
                  AI-Powered CRM for Brazilian Car Dealerships
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {["Live Product", "B2B SaaS", "AI / Multi-Agent", "WhatsApp"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: theme.colors.accent + "15",
                    color: theme.colors.accent,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://autovendas.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: theme.colors.accent }}
            >
              View Live Product
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </header>

      <div className="px-5 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Results */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-2xl sm:text-3xl font-black mb-8"
              style={{ color: theme.colors.text }}
            >
              Results
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-2xl border p-5 sm:p-6 text-center"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  <r.icon
                    size={20}
                    className="mx-auto mb-3"
                    style={{ color: theme.colors.accent }}
                  />
                  <p
                    className="text-2xl sm:text-3xl font-black mb-1"
                    style={{ color: theme.colors.text }}
                  >
                    {r.metric}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: theme.colors.textMuted }}>
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Problem */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle size={22} style={{ color: theme.colors.accent }} />
              <h2
                className="text-2xl sm:text-3xl font-black"
                style={{ color: theme.colors.text }}
              >
                The Problem
              </h2>
            </div>
            <div
              className="rounded-2xl border p-6 sm:p-8 space-y-4"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                Brazilian used car dealerships receive hundreds of WhatsApp messages daily. Leads arrive at midnight, on weekends, during lunch — but sales teams work 9-to-6. The average response time was <strong style={{ color: theme.colors.text }}>4-6 hours</strong>. By then, the buyer had already visited three competitors.
              </p>
              <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                Even when salespeople did respond, <strong style={{ color: theme.colors.text }}>60% of conversations</strong> were the same five questions: Do you have a 2020 Civic? What's the IPVA? What's the financing? Is there a warranty? This burned hours of skilled sales time on pre-qualification work.
              </p>
              <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                The goal: build a system that responds instantly, qualifies intent, answers inventory questions accurately, and hands off to a human at exactly the right moment — without losing the warm, personal tone that Brazilian sales culture requires.
              </p>
            </div>
          </motion.section>

          {/* Solution */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={22} style={{ color: theme.colors.accent }} />
              <h2
                className="text-2xl sm:text-3xl font-black"
                style={{ color: theme.colors.text }}
              >
                The Solution
              </h2>
            </div>
            <div className="space-y-6">
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
                  Multi-Agent Architecture
                </h3>
                <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  A single LLM trying to qualify leads, look up inventory, and decide when to escalate produces inconsistent results. The solution splits the problem into three specialized agents coordinated by an orchestrator — each focused on what it does best.
                </p>
              </div>
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
                  Confidence Boundary Design
                </h3>
                <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  The AI never quotes exact prices and never confirms availability without a live database check. When asked, it acknowledges the question and routes to a human — but does so warmly, as a handoff, not a dead end. This dramatically reduced hallucination risk in sales-critical scenarios.
                </p>
              </div>
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
                  Multi-Tenant CRM
                </h3>
                <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  Each dealership has isolated data (vehicles, leads, conversations) with a shared AI layer. Supabase Row Level Security enforces tenant isolation. Dealership admins get a dashboard view of all AI conversations, lead status, and escalation history.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Architecture */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-2xl sm:text-3xl font-black mb-6"
              style={{ color: theme.colors.text }}
            >
              Architecture
            </h2>
            <div
              className="rounded-2xl border p-6 sm:p-8 overflow-x-auto"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <pre
                className="text-xs sm:text-sm font-mono leading-relaxed"
                style={{ color: theme.colors.textMuted }}
              >
                {archLines.join("\n")}
              </pre>
            </div>
          </motion.section>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-2xl sm:text-3xl font-black mb-6"
              style={{ color: theme.colors.text }}
            >
              Tech Stack
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {techStack.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between rounded-xl border px-5 py-4"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.colors.text }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                      {t.role}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: theme.colors.accent + "15",
                      color: theme.colors.accent,
                    }}
                  >
                    {t.group}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Back CTA */}
          <div className="flex items-center gap-6 pt-4 border-t" style={{ borderColor: theme.colors.cardBorder }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: theme.colors.accent }}
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>
            <Link
              href="/case-study/atrias-wiki/"
              className="text-sm font-medium"
              style={{ color: theme.colors.textMuted }}
            >
              Next: Átrias Wiki →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
