"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { TestTube2, Brain, Monitor, Server } from "lucide-react";

const categories = [
  {
    nameKey: "qualityEngineering",
    icon: TestTube2,
    techs: ["Playwright", "TypeScript", "Cypress", "Postman", "Selenium", "Jest"],
  },
  {
    nameKey: "aiAutomation",
    icon: Brain,
    techs: ["OpenAI API", "LangChain", "Multi-Agent Systems", "Whisper", "ElevenLabs"],
  },
  {
    nameKey: "frontend",
    icon: Monitor,
    techs: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    nameKey: "backendCloud",
    icon: Server,
    techs: ["Supabase", "Node.js", "Vercel", "Twilio", "PostgreSQL", "Sentry"],
  },
];

export default function Skills() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6" id="skills">
      <div className="max-w-5xl mx-auto">
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
            {t<string>("skills.kicker")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 sm:mb-14"
            style={{ color: theme.colors.text }}
          >
            {t<string>("skills.title")}
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.nameKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group"
            >
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 py-5 sm:py-6 px-4 sm:px-6 rounded-lg transition-colors duration-200"
                style={{
                  borderLeft: `4px solid ${theme.colors.accent}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.colors.card;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex items-center gap-3 sm:w-[200px] shrink-0">
                  <cat.icon size={20} style={{ color: theme.colors.accent }} />
                  <h3
                    className="text-base font-bold"
                    style={{ color: theme.colors.text }}
                  >
                    {t<string>(`skills.categories.${cat.nameKey}`)}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:ml-4">
                  {cat.techs.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm px-3 py-1.5 rounded-full font-medium"
                      style={{
                        background: theme.colors.accent + "15",
                        color: theme.colors.accent,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {i < categories.length - 1 && (
                <div
                  className="h-px mx-4 sm:mx-6"
                  style={{ background: theme.colors.cardBorder }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
