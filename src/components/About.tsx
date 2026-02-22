"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { MapPin, Briefcase, Cpu, Heart } from "lucide-react";

export default function About() {
  const { theme } = useTheme();
  const { t } = useLocale();

  const stats = [
    { label: t<string>("about.stats.yearsLabel"), value: t<string>("about.stats.yearsValue"), icon: Briefcase },
    { label: t<string>("about.stats.aiLabel"), value: t<string>("about.stats.aiValue"), icon: Cpu },
    { label: t<string>("about.stats.locationLabel"), value: t<string>("about.stats.locationValue"), icon: MapPin },
    { label: t<string>("about.stats.drivenLabel"), value: t<string>("about.stats.drivenValue"), icon: Heart },
  ];

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

        <div className="grid md:grid-cols-5 gap-10 lg:gap-12">
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed mb-6"
              style={{ color: theme.colors.textMuted }}
            >
              {t<string>("about.p1.beforeEm")}
              <em>{t<string>("about.p1.em")}</em>
              {t<string>("about.p1.afterEm")}
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed mb-6"
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
      </div>
    </section>
  );
}
