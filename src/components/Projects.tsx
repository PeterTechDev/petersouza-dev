"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { ExternalLink, Bot, Swords, BarChart3, ArrowRight } from "lucide-react";

type ProjectStatusKey = "live" | "comingSoon" | "inProgress";

interface Project {
  id: string;
  tags: string[];
  icon: typeof Bot;
  url?: string;
  caseStudyUrl?: string;
  statusKey: ProjectStatusKey;
  highlight?: boolean;
  gradient: string;
}

const projects: Project[] = [
  {
    id: "autovendas",
    tags: ["Next.js", "OpenAI", "Twilio", "Supabase", "Multi-Agent"],
    icon: Bot,
    url: "https://auto-vendas.vercel.app",
    caseStudyUrl: "/case-study/autovendas/",
    statusKey: "live",
    highlight: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "atriasWiki",
    tags: ["Next.js", "Sanity CMS", "AI", "Three.js"],
    icon: Swords,
    caseStudyUrl: "/case-study/atrias-wiki/",
    statusKey: "inProgress",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "nbaLiveFeed",
    tags: ["Next.js", "REST APIs", "Real-time", "Vercel"],
    icon: BarChart3,
    statusKey: "live",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

export default function Projects() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16" id="projects">
      <div className="max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${project.url ? "cursor-pointer" : ""}`}
              style={{
                background: theme.colors.card,
                borderColor: project.highlight ? theme.colors.accent + "40" : theme.colors.cardBorder,
              }}
              whileHover={{ y: -4 }}
              onClick={() => project.url && window.open(project.url, "_blank")}
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
                  style={{
                    background: project.statusKey === "live" ? theme.colors.accent + "20" : theme.colors.cardBorder,
                    color: project.statusKey === "live" ? theme.colors.accent : theme.colors.textMuted,
                  }}
                >
                  {t<string>(`projects.status.${project.statusKey as ProjectStatusKey}`)}
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
                  />
                )}
              </h3>

              <p className="mb-5 leading-relaxed text-sm sm:text-base" style={{ color: theme.colors.textMuted }}>
                {t<string>(`projects.items.${project.id}.description`)}
              </p>

              {/* Case study link (stops propagation so card click still works) */}
              {project.caseStudyUrl && (
                <Link
                  href={project.caseStudyUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold mb-5 transition-opacity hover:opacity-70"
                  style={{ color: theme.colors.accent }}
                >
                  {t<string>("projects.caseStudyLink")}
                  <ArrowRight size={12} />
                </Link>
              )}

              <div className="flex flex-wrap gap-2">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
