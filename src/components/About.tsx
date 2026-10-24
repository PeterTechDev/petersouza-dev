"use client";

import { type CSSProperties } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import {
  AUTOMATED_TESTS,
  CI_RUN_MINUTES,
  QA_YEARS,
  REGRESSION_HOURS_SAVED,
} from "@/lib/about-metrics";
import { Code2, Trophy, Dices, Bot, BookOpen } from "lucide-react";

const interestIcons = [Trophy, Dices, Bot, BookOpen];

export function About() {
  const { theme } = useTheme();
  const { t } = useLocale();

  const stats = [
    { label: t<string>("about.stats.qaYearsLabel"), value: QA_YEARS },
    { label: t<string>("about.stats.automatedTestsLabel"), value: AUTOMATED_TESTS },
    {
      label: t<string>("about.stats.ciRunTimeLabel"),
      value: t<string>("about.stats.ciRunTimeValue", { minutes: CI_RUN_MINUTES }),
    },
    {
      label: t<string>("about.stats.regressionSavedLabel"),
      value: t<string>("about.stats.regressionSavedValue", { hours: REGRESSION_HOURS_SAVED }),
    },
  ];

  const timelineItems = t<{ year: string; event: string }[]>("about.timeline");
  const interests = t<string[]>("about.interests");

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-6 md:px-12 lg:px-20" id="about">
      {/* Section header — centered */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p
          className="text-sm tracking-[0.3em] uppercase mb-3 font-medium"
          style={{ color: theme.colors.accent }}
        >
          {t<string>("about.kicker")}
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black"
          style={{ color: theme.colors.text }}
        >
          {t<string>("about.title")}
        </h2>
      </motion.div>

      {/* Stats row — label then value in the DOM; number stays visually on top */}
      <motion.dl
        className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6 }}
        style={{
          border: `1px solid ${theme.colors.cardBorder}`,
          borderRadius: "1rem",
          background: theme.colors.card,
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`about-stat text-center py-6 px-4 relative flex flex-col-reverse${
              i < stats.length - 1 ? " about-stat-divider" : ""
            }`}
            style={{ "--about-stat-divider": theme.colors.cardBorder } as CSSProperties}
          >
            <dt
              className="text-xs mt-1.5 font-medium"
              style={{ color: theme.colors.textMuted }}
            >
              {stat.label}
            </dt>
            <dd
              className="text-2xl sm:text-3xl font-black leading-none m-0"
              style={{ color: theme.colors.text }}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </motion.dl>

      {/* Bio — centered column, max-w-2xl */}
      <motion.div
        className="max-w-2xl mx-auto text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: theme.colors.textMuted }}>
          {t<string>("about.p2.beforeQuote")}
          <strong style={{ color: theme.colors.accent }}>
            {t<string>("about.p2.quote")}
          </strong>
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: theme.colors.textMuted }}>
          {t<string>("about.p4")}
        </p>
      </motion.div>

      {/* Timeline + Interests side by side — max-w-4xl */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-10">
        {/* Timeline */}
        <motion.div
          className="rounded-2xl border p-6 sm:p-8"
          style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Code2 size={16} style={{ color: theme.colors.accent }} />
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: theme.colors.accent }}>
              {t<string>("about.careerTimeline")}
            </p>
          </div>
          <div className="space-y-4">
            {timelineItems.map((item, i) => (
              <div key={item.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: theme.colors.accent }} />
                  {i < timelineItems.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: theme.colors.cardBorder }} />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-xs font-bold mb-0.5" style={{ color: theme.colors.accent }}>{item.year}</p>
                  <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          className="rounded-2xl border p-6 sm:p-8"
          style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={16} style={{ color: theme.colors.accent }} />
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: theme.colors.accent }}>
              {t<string>("about.outsideCode")}
            </p>
          </div>
          <div className="space-y-3">
            {interests.map((label, idx) => {
              const Icon = interestIcons[idx];
              return (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0" style={{ color: theme.colors.accent }} />
                  <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>{label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
