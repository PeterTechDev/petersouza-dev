"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  Brain,
  Layers,
  Wrench,
  GitBranch,
  MessageSquare,
  Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "Persistent Memory",
    description:
      "Structured file-based memory that survives session boundaries. Context about projects, decisions, and patterns persists across restarts — no re-explaining required.",
  },
  {
    icon: Layers,
    title: "Multi-Agent Orchestration",
    description:
      "Complex tasks spawn specialized sub-agents: one researches, one codes, one reviews. The main agent coordinates, delegates, and synthesizes results.",
  },
  {
    icon: Wrench,
    title: "Tool Integration",
    description:
      "Web search, code execution, file system access, messaging, and external APIs. Agents pick the right tool for each step rather than guessing from memory.",
  },
  {
    icon: GitBranch,
    title: "Autonomous Coding",
    description:
      "Coding tasks run in isolated sessions with full codebase access. Agents explore, modify, test, and iterate — delivering working code, not just suggestions.",
  },
  {
    icon: MessageSquare,
    title: "Cross-Channel Awareness",
    description:
      "Integrated with Telegram for real-time communication. Agents surface updates, ask clarifying questions, and deliver results directly in-chat.",
  },
  {
    icon: Zap,
    title: "Progressive Delegation",
    description:
      "From answering a quick question to managing a full sprint independently. The system scales from single-turn to multi-day autonomous workflows.",
  },
];

const architectureLines = [
  "  Human  ──────────────────────────────────",
  "    │                                       ",
  "    ▼                                       ",
  "  Main Agent  (orchestrator + memory)       ",
  "    │                                       ",
  "    ├── Memory Layer  (SESSION-STATE.md)     ",
  "    │                                       ",
  "    ├── Tool Layer                          ",
  "    │     ├── web_search / web_fetch        ",
  "    │     ├── exec (bash)                   ",
  "    │     ├── read / write / edit           ",
  "    │     └── message (Telegram)            ",
  "    │                                       ",
  "    └── Sub-Agent Pool                      ",
  "          ├── Coding Agent (Claude Code)    ",
  "          ├── Research Agent               ",
  "          └── Review Agent                 ",
];

export default function AIAgents() {
  const { theme } = useTheme();

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6" id="ai-agents">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
            style={{ color: theme.colors.accent }}
          >
            How I Work
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
            style={{ color: theme.colors.text }}
          >
            AI Infrastructure
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mb-16"
            style={{ color: theme.colors.textMuted }}
          >
            I've built a personal AI system that runs alongside my development workflow — not a tool I use occasionally, but infrastructure I operate daily. Here's how it works.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 mb-16 overflow-x-auto"
          style={{
            background: theme.colors.card,
            borderColor: theme.colors.cardBorder,
          }}
        >
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: theme.colors.accent }}
          >
            System Architecture
          </p>
          <pre
            className="text-xs sm:text-sm leading-relaxed font-mono whitespace-pre"
            style={{ color: theme.colors.textMuted }}
          >
            {architectureLines.join("\n")}
          </pre>
        </motion.div>

        {/* Capability cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <cap.icon
                size={22}
                className="mb-4"
                style={{ color: theme.colors.accent }}
              />
              <h3
                className="text-base font-bold mb-2"
                style={{ color: theme.colors.text }}
              >
                {cap.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: theme.colors.textMuted }}
              >
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-sm text-center"
          style={{ color: theme.colors.textMuted }}
        >
          The system runs on Anthropic Claude with a custom orchestration layer. No vendor lock-in on the AI layer — just clean interfaces.
        </motion.p>
      </div>
    </section>
  );
}
