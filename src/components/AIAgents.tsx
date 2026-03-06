"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import {
  Brain,
  Layers,
  Wrench,
  GitBranch,
  MessageSquare,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const capabilityKeys = [
  { icon: Brain, key: "persistentMemory" },
  { icon: Layers, key: "multiAgent" },
  { icon: Wrench, key: "toolIntegration" },
  { icon: GitBranch, key: "autonomousCoding" },
  { icon: MessageSquare, key: "crossChannel" },
  { icon: Zap, key: "progressiveDelegation" },
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

export function AIAgents() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="ai-agents">
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
            {t<string>("aiAgents.kicker")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
            style={{ color: theme.colors.text }}
          >
            {t<string>("aiAgents.title")}
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mb-8 md:mb-16"
            style={{ color: theme.colors.textMuted }}
          >
            {t<string>("aiAgents.subtitle")}
          </p>
        </motion.div>

        {/* Mobile toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 mb-6 md:hidden text-sm font-bold tracking-wider uppercase px-4 py-2 rounded-full border"
          style={{
            color: theme.colors.accent,
            borderColor: theme.colors.accent + "40",
          }}
        >
          {showDetails ? t<string>("aiAgents.hideDetails") : t<string>("aiAgents.showDetails")}
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Detailed content — always visible on md+, toggled on mobile */}
        <div className={`${showDetails ? "block" : "hidden"} md:block`}>
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
              {t<string>("aiAgents.architectureLabel")}
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
            {capabilityKeys.map((cap, i) => (
              <motion.div
                key={cap.key}
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
                  {t<string>(`aiAgents.capabilities.${cap.key}.title`)}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.colors.textMuted }}
                >
                  {t<string>(`aiAgents.capabilities.${cap.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
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
          {t<string>("aiAgents.bottomNote")}
        </motion.p>
      </div>
    </section>
  );
}
