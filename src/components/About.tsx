"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { Code2, Trophy, Dices, Bot, BookOpen } from "lucide-react";

const interestIcons = [Trophy, Dices, Bot, BookOpen];

export default function About() {
  const { theme } = useTheme();
  const { t } = useLocale();

  const stats = [
    { label: t<string>("about.stats.yearsLabel"), value: t<string>("about.stats.yearsValue") },
    { label: t<string>("about.stats.aiLabel"), value: t<string>("about.stats.aiValue") },
    { label: t<string>("about.stats.locationLabel"), value: t<string>("about.stats.locationValue") },
    { label: t<string>("about.stats.drivenLabel"), value: t<string>("about.stats.drivenValue") },
  ];

  const timelineItems = t<{ year: string; event: string }[]>("about.timeline");
  const interests = t<string[]>("about.interests");

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6" id="about">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
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
            {t<string>("about.kicker")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 sm:mb-14"
            style={{ color: theme.colors.text }}
          >
            {t<string>("about.title")}
          </h2>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 mb-14 sm:mb-20 py-8 rounded-2xl border"
          style={{ borderColor: theme.colors.cardBorder, background: theme.colors.card }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center px-4 relative"
            >
              {i < stats.length - 1 && (
                <div
                  className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10"
                  style={{ background: theme.colors.cardBorder }}
                />
              )}
              <p
                className="text-3xl sm:text-4xl font-black leading-none"
                style={{ color: theme.colors.text }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs sm:text-sm mt-1.5 font-medium"
                style={{ color: theme.colors.textMuted }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Two-column: bio + timeline */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 mb-14 sm:mb-20">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              {t<string>("about.p2.beforeQuote")}
              <strong style={{ color: theme.colors.accent }}>
                {t<string>("about.p2.quote")}
              </strong>
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              {t<string>("about.p4")}
            </p>
          </motion.div>

          <motion.div
            className=""
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <div
              className="rounded-2xl border p-6 sm:p-8 h-full"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Code2 size={18} style={{ color: theme.colors.accent }} />
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: theme.colors.accent }}
                >
                  {t<string>("about.careerTimeline")}
                </p>
              </div>
              <div className="space-y-4">
                {timelineItems.map((item, i) => (
                  <div key={item.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: theme.colors.accent }}
                      />
                      {i < timelineItems.length - 1 && (
                        <div
                          className="w-px flex-1 mt-1"
                          style={{ background: theme.colors.cardBorder }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className="text-xs font-bold mb-0.5"
                        style={{ color: theme.colors.accent }}
                      >
                        {item.year}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>
                        {item.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interests row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} style={{ color: theme.colors.accent }} />
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: theme.colors.accent }}
            >
              {t<string>("about.outsideCode")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {interests.map((label, idx) => {
              const Icon = interestIcons[idx];
              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium"
                  style={{
                    background: theme.colors.accent + "10",
                    color: theme.colors.textMuted,
                  }}
                >
                  <Icon size={16} style={{ color: theme.colors.accent }} />
                  {label}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
