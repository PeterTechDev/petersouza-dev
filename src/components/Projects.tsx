"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { ExternalLink, Bot, Film, Swords, BarChart3 } from "lucide-react";

const projects = [
  {
    title: "AutoVendas",
    description: "AI-powered CRM for Brazilian car dealerships. Multi-agent WhatsApp assistant that qualifies leads, answers inventory questions, and closes deals 24/7.",
    tags: ["Next.js", "OpenAI", "Twilio", "Supabase", "Multi-Agent"],
    icon: Bot,
    url: "https://auto-vendas.vercel.app",
    status: "Live",
    highlight: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "Video Automation Platform",
    description: "Programmatic video generation for social media. Automated templates, batch rendering, multi-language support.",
    tags: ["Remotion", "React", "FFmpeg", "TypeScript"],
    icon: Film,
    status: "Coming Soon",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    title: "Átrias Wiki",
    description: "Interactive D&D world encyclopedia. 176 entities, 7 continents, AI narrator. A love letter to collaborative storytelling.",
    tags: ["Next.js", "Sanity CMS", "AI", "Three.js"],
    icon: Swords,
    status: "In Progress",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    title: "NBA Live Feed",
    description: "Real-time NBA scores, standings, player comparisons, and social feed powered by Reddit integration.",
    tags: ["Next.js", "REST APIs", "Real-time", "Vercel"],
    icon: BarChart3,
    status: "Live",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

export default function Projects() {
  const { theme } = useTheme();

  return (
    <section className="py-32 px-6" id="projects">
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
            What I&apos;m Building
          </p>
          <h2
            className="text-4xl md:text-5xl font-black mb-16"
            style={{ color: theme.colors.text }}
          >
            Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl p-8 border transition-all duration-300 cursor-pointer"
              style={{
                background: theme.colors.card,
                borderColor: project.highlight ? theme.colors.accent + "40" : theme.colors.cardBorder,
              }}
              whileHover={{ y: -4 }}
              onClick={() => project.url && window.open(project.url, "_blank")}
            >
              {/* Gradient thumbnail */}
              <div
                className="w-full h-32 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative"
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
                    background: project.status === "Live" ? theme.colors.accent + "20" : theme.colors.cardBorder,
                    color: project.status === "Live" ? theme.colors.accent : theme.colors.textMuted,
                  }}
                >
                  {project.status}
                </span>
              </div>

              <h3
                className="text-2xl font-bold mb-3 flex items-center gap-2"
                style={{ color: theme.colors.text }}
              >
                {project.title}
                {project.url && (
                  <ExternalLink
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: theme.colors.accent }}
                  />
                )}
              </h3>

              <p className="mb-6 leading-relaxed" style={{ color: theme.colors.textMuted }}>
                {project.description}
              </p>

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
