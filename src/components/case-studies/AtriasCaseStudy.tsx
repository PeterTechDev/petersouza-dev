"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  ArrowLeft,
  Swords,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Layers,
  Users,
  Map,
} from "lucide-react";

const techStack = [
  { name: "Next.js", role: "Frontend + API layer", group: "Core" },
  { name: "TypeScript", role: "Type-safe throughout", group: "Core" },
  { name: "Three.js", role: "3D world map visualization", group: "Graphics" },
  { name: "Sanity CMS", role: "Headless content management", group: "Content" },
  { name: "OpenAI API", role: "AI narrator + embeddings", group: "AI" },
  { name: "Vercel", role: "Global deployment", group: "Infra" },
];

const results = [
  { metric: "176+", label: "Entities catalogued", icon: Layers },
  { metric: "7", label: "Continents mapped in 3D", icon: Map },
  { metric: "4 yrs", label: "Campaign world preserved", icon: TrendingUp },
  { metric: "NL", label: "Natural language lore queries", icon: Users },
];

const archLines = [
  "  Content Authoring",
  "       │",
  "       ▼",
  "  Sanity CMS  (headless, structured content)",
  "       │",
  "       ├── Entities (NPCs, locations, artifacts...)",
  "       ├── Events   (historical timeline)",
  "       └── Relations (faction graphs, lineages)",
  "       │",
  "       ▼",
  "  Next.js API Routes",
  "       │",
  "   ┌───┴─────────────────────┐",
  "   ▼                         ▼",
  " Three.js                 AI Narrator",
  " 3D World Map             (OpenAI GPT)",
  " (7 continents)           (vector embeddings)",
  "   │                         │",
  "   └──────────┬──────────────┘",
  "              ▼",
  "        Browser Client",
  "   (GM view / Player view)",
];

export function AtriasCaseStudy() {
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
                style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
              >
                <Swords size={28} className="text-white" />
              </div>
              <div>
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-black leading-none"
                  style={{ color: theme.colors.text }}
                >
                  Átrias Wiki
                </h1>
                <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
                  Interactive D&D World Encyclopedia
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["In Progress", "Personal Project", "AI / RAG", "3D / Three.js"].map((tag) => (
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
              Scale
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
                After four years of running a D&D campaign set in the world of Átrias, the world had grown to <strong style={{ color: theme.colors.text }}>176+ entities</strong> — NPCs with full backstories, locations with political history, factions with competing agendas, artifacts with lore chains, timelines spanning hundreds of years.
              </p>
              <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                All of this lived in a chaotic mix of Google Docs, Notion pages, and hand-written notes. Sessions regularly got derailed because a player asked "wait, wasn't that kingdom destroyed in the war?" and no one could find the answer quickly. The world was becoming too big to hold in anyone's head.
              </p>
              <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                The secondary problem: as the Game Master, I wanted a tool that could answer player questions <em>in character</em>, with the voice of the world itself — not just retrieve facts, but <em>narrate</em> them.
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
                  Headless CMS as World Brain
                </h3>
                <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  Sanity CMS became the structured backbone of Átrias. Every entity (NPC, location, faction, artifact, event) has a typed schema with relationships. An NPC has a faction allegiance, a home location, a historical event that shaped them. The graph of relationships is queryable — "give me all NPCs connected to the Black Throne faction" is a single query.
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
                  AI Narrator with RAG
                </h3>
                <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  Players can ask natural language questions to the AI narrator — "tell me about the Fall of Valdris" or "who rules the Sunken Reaches?" The system retrieves relevant entities via vector embeddings, then generates an in-character narrative response using a custom system prompt that captures the world's voice and tone.
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
                  3D World Map
                </h3>
                <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  Seven continents rendered in Three.js with interactive region selection. Clicking a region surfaces entities from that location. The 3D visualization makes the geographical scale of the world immediately legible — something no spreadsheet could achieve.
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

          {/* Reflection */}
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
              Why This Project Matters to Me
            </h2>
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <p className="text-base leading-relaxed" style={{ color: theme.colors.textMuted }}>
                Átrias Wiki is the only project I've built purely for love of the craft. No revenue model, no user acquisition strategy. Just a world I've been building with friends for four years, and a tool that makes that world feel more real. It's where I learned Three.js, RAG pipelines, and the limits of LLM context — all because the problem was interesting enough to justify the exploration. Every engineer should have a project like this.
              </p>
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
              href="/case-study/autovendas/"
              className="text-sm font-medium"
              style={{ color: theme.colors.textMuted }}
            >
              ← AutoVendas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
