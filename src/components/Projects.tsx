"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { ExternalLink, Bot, Film, Brain, Network, ArrowRight, ChevronDown, ChevronUp, Zap, Users, BarChart2, CheckCircle } from "lucide-react";

type ProjectStatusKey = "live" | "comingSoon" | "inProgress" | "beta";

interface CaseStudy {
  problem: string;
  solution: string;
  keyFeatures: string[];
  status: string;
}

interface Project {
  id: string;
  tags: string[];
  icon: typeof Bot;
  url?: string;
  caseStudyUrl?: string;
  statusKey: ProjectStatusKey;
  highlight?: boolean;
  gradient: string;
  caseStudy: CaseStudy;
}

const projects: Project[] = [
  {
    id: "autovendas",
    tags: ["Next.js", "OpenAI", "Twilio", "Supabase", "Sentry", "Vercel"],
    icon: Bot,
    url: "https://autovendas.vercel.app",
    caseStudyUrl: "/case-study/autovendas/",
    statusKey: "live",
    highlight: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    caseStudy: {
      problem:
        "Brazilian used car dealerships lose leads because they can't respond to WhatsApp messages fast enough.",
      solution:
        "AI-powered WhatsApp assistant that qualifies leads, answers inventory questions, and routes hot leads to salespeople — all without human intervention.",
      keyFeatures: [
        "Multi-tenant CRM with per-dealership configuration",
        "AI lead qualification and intent scoring",
        "Real-time inventory sync via WhatsApp",
        "Escalation workflows to human agents",
      ],
      status: "Live with paying client · B2B SaaS model",
    },
  },
  {
    id: "vover",
    tags: ["Next.js 14", "Tailwind", "shadcn/ui", "NextAuth", "Drizzle", "TMDB API"],
    icon: Film,
    statusKey: "beta",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    caseStudy: {
      problem:
        "There's no good social movie/TV tracking app built for friend groups — just isolated lists with no social layer.",
      solution:
        "A Netflix-style social platform where friends track, rate, and discover shows together. Built with a rich activity feed and smart recommendations based on friend preferences.",
      keyFeatures: [
        "Social watchlist — see what friends are watching",
        "Friend activity feed with ratings and reviews",
        "Personalized recommendations based on social graph",
        "Invite system with private group rooms",
      ],
      status: "In development · Invite-only beta",
    },
  },
  {
    id: "mindPalace",
    tags: ["Next.js", "React", "File-system API", "Markdown", "Dark theme"],
    icon: Brain,
    statusKey: "live",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    caseStudy: {
      problem:
        "Knowledge gets scattered across markdown files, notes, and docs with no unified view or way to navigate the graph.",
      solution:
        "A visual knowledge base + AI agent dashboard that reads markdown brain docs directly from the file system, providing structured browsing, graph visualization, and daily journaling.",
      keyFeatures: [
        "Brain doc viewer with full markdown rendering",
        "AI agent monitoring and output display",
        "Daily entry interface for continuous capture",
        "Graph visualization of linked concepts",
      ],
      status: "Live · Personal daily use",
    },
  },
  {
    id: "openclawAgents",
    tags: ["OpenClaw", "Claude API", "SOUL.md", "AGENTS.md", "Custom skills"],
    icon: Network,
    statusKey: "live",
    highlight: true,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    caseStudy: {
      problem:
        "A solo developer can't do research, build features, run QA, and produce content simultaneously without dropping something.",
      solution:
        "8 specialized AI agents orchestrated through OpenClaw — each with its own personality, memory, and skill set — handling parallel workstreams while the developer stays in control.",
      keyFeatures: [
        "Parallel agent spawning for simultaneous workstreams",
        "Skill enforcement protocol preventing hallucinated implementations",
        "Self-improving memory via GROWTH.md and mission logs",
        "Content intelligence pipeline powering all other projects",
      ],
      status: "Live · Daily use · Powers all other projects",
    },
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const { t } = useLocale();

  const statusColors: Record<ProjectStatusKey, { bg: string; text: string }> = {
    live: { bg: theme.colors.accent + "20", text: theme.colors.accent },
    beta: { bg: "#f59e0b20", text: "#f59e0b" },
    inProgress: { bg: theme.colors.cardBorder, text: theme.colors.textMuted },
    comingSoon: { bg: theme.colors.cardBorder, text: theme.colors.textMuted },
  };

  const statusStyle = statusColors[project.statusKey] ?? statusColors.inProgress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative rounded-2xl border transition-all duration-300"
      style={{
        background: theme.colors.card,
        borderColor: expanded
          ? theme.colors.accent + "60"
          : project.highlight
          ? theme.colors.accent + "40"
          : theme.colors.cardBorder,
      }}
    >
      {/* Main card content — always visible */}
      <div
        className="p-6 sm:p-8 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
      >
        {/* Gradient thumbnail */}
        <div
          className="w-full h-28 sm:h-32 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative"
          style={{ background: project.gradient }}
        >
          <project.icon size={40} className="text-white/80 relative z-10" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between mb-4">
          <project.icon size={28} style={{ color: theme.colors.accent }} />
          <span
            className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full"
            style={{ background: statusStyle.bg, color: statusStyle.text }}
          >
            {t<string>(`projects.status.${project.statusKey}`)}
          </span>
        </div>

        <h3
          className="text-2xl font-bold mb-3 flex items-center gap-2"
          style={{ color: theme.colors.text }}
        >
          {t<string>(`projects.items.${project.id}.title`)}
          {project.url && (
            <ExternalLink
              size={16}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.accent }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.url, "_blank");
              }}
            />
          )}
        </h3>

        <p className="mb-5 leading-relaxed text-sm sm:text-base" style={{ color: theme.colors.textMuted }}>
          {t<string>(`projects.items.${project.id}.description`)}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: theme.colors.accent + "10",
                color: theme.colors.accent,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expand hint */}
        <div
          className="flex items-center gap-1.5 text-xs font-semibold mt-2 transition-opacity"
          style={{ color: theme.colors.textMuted }}
        >
          {expanded ? (
            <>
              <ChevronUp size={14} />
              {t<string>("projects.collapseDetails")}
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              <span className="group-hover:opacity-100 opacity-60 transition-opacity">
                {t<string>("projects.expandDetails")}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Expandable case study section */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="case-study"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t"
              style={{ borderColor: theme.colors.accent + "20" }}
            >
              {/* Problem */}
              <div className="mt-5">
                <div
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: theme.colors.accent }}
                >
                  <Zap size={12} />
                  {t<string>("projects.caseStudy.problem")}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  {t<string>(`projects.items.${project.id}.problem`)}
                </p>
              </div>

              {/* Solution */}
              <div className="mt-5">
                <div
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: theme.colors.accent }}
                >
                  <Users size={12} />
                  {t<string>("projects.caseStudy.solution")}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  {t<string>(`projects.items.${project.id}.solution`)}
                </p>
              </div>

              {/* Key Features */}
              <div className="mt-5">
                <div
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: theme.colors.accent }}
                >
                  <BarChart2 size={12} />
                  {t<string>("projects.caseStudy.keyFeatures")}
                </div>
                <ul className="space-y-2">
                  {(t<string[]>(`projects.items.${project.id}.features`) as unknown as string[]).map(
                    (feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: theme.colors.textMuted }}>
                        <CheckCircle
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{ color: theme.colors.accent }}
                        />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Results/Status */}
              <div className="mt-5">
                <div
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: theme.colors.accent }}
                >
                  <CheckCircle size={12} />
                  {t<string>("projects.caseStudy.results")}
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.text }}
                >
                  {t<string>(`projects.items.${project.id}.statusText`)}
                </p>
              </div>

              {/* Action links */}
              <div className="flex gap-4 mt-6">
                {project.caseStudyUrl && (
                  <Link
                    href={project.caseStudyUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                    style={{ color: theme.colors.accent }}
                  >
                    {t<string>("projects.caseStudyLink")}
                    <ArrowRight size={12} />
                  </Link>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {t<string>("projects.visitProject")}
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Projects() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="projects">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-16"
        >
          <div>
            <p
              className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
              style={{ color: theme.colors.accent }}
            >
              {t<string>("projects.kicker")}
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black"
              style={{ color: theme.colors.text }}
            >
              {t<string>("projects.title")}
            </h2>
          </div>
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 text-sm font-medium shrink-0"
            style={{ color: theme.colors.accent }}
          >
            {t<string>("projects.blogLink")}
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
