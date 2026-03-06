"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { MapPin, Briefcase, Cpu, Heart, Code2, BookOpen, Trophy, Dices, Bot } from "lucide-react";

const interestIcons = [Trophy, Dices, Bot, BookOpen];

export default function About() {
  const { theme } = useTheme();
  const { t } = useLocale();

  const stats = [
    { label: t<string>("about.stats.yearsLabel"), value: t<string>("about.stats.yearsValue"), icon: Briefcase },
    { label: t<string>("about.stats.aiLabel"), value: t<string>("about.stats.aiValue"), icon: Cpu },
    { label: t<string>("about.stats.locationLabel"), value: t<string>("about.stats.locationValue"), icon: MapPin },
    { label: t<string>("about.stats.drivenLabel"), value: t<string>("about.stats.drivenValue"), icon: Heart },
  ];

  const timelineItems = t<{ year: string; event: string }[]>("about.timeline");
  const interests = t<string[]>("about.interests");

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6" id="about">
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
            {t<string>("about.kicker")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-8"
            style={{ color: theme.colors.text }}
          >
            {t<string>("about.title")}
          </h2>
        </motion.div>

        {/* Main content: story + stats */}
        <div className="grid md:grid-cols-5 gap-10 lg:gap-12 mb-16">
          <motion.div
            className="md:col-span-3 space-y-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              {t<string>("about.p1.beforeEm")}
              <em>{t<string>("about.p1.em")}</em>
              {t<string>("about.p1.afterEm")}
            </p>
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
              {t<string>("about.p3")}
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              {t<string>("about.p4")}
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-2 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 sm:p-6 border text-center"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <stat.icon
                  size={24}
                  className="mx-auto mb-3"
                  style={{ color: theme.colors.accent }}
                />
                <p className="text-2xl font-black" style={{ color: theme.colors.text }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Interests + Timeline in two columns */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              className="rounded-2xl border p-6 sm:p-8 h-full"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <BookOpen size={18} style={{ color: theme.colors.accent }} />
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: theme.colors.accent }}
                >
                  {t<string>("about.outsideCode")}
                </p>
              </div>
              <div className="space-y-3">
                {interests.map((label, idx) => {
                  const Icon = interestIcons[idx];
                  return (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={18} className="mt-0.5 shrink-0" style={{ color: theme.colors.accent }} />
                      <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6 }}
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
      </div>
    </section>
  );
}
