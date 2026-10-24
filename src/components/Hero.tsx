"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import Link from "next/link";
import { ArrowDown, Download, Github, Linkedin, Mail, BookOpen, Bug } from "lucide-react";

const EMAIL = "peterleite.dev@gmail.com";

export function Hero() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <section
      className="relative flex flex-col items-center justify-center px-6 pt-20 pb-10 sm:px-8 sm:pt-24 sm:pb-14 md:min-h-[78vh] md:px-12 md:py-24 lg:px-20"
      style={{ color: theme.colors.text }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-6xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center min-h-11 px-4 mb-6 rounded-full border text-xs sm:text-sm font-semibold tracking-wide"
          style={{
            color: theme.colors.accent,
            borderColor: theme.colors.accent + "55",
            background: theme.colors.accent + "14",
          }}
        >
          {t<string>("hero.availability")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-4 leading-[0.95]"
        >
          Peter{" "}
          <span
            style={{
              background: theme.colors.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Souza
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl mb-4 font-semibold"
          style={{ color: theme.colors.accent }}
        >
          {t<string>("hero.role")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
          style={{ color: theme.colors.textMuted }}
        >
          {t<string>("hero.credentials")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-3 sm:gap-4 justify-center mb-4"
        >
          {[
            { icon: Github, href: "https://github.com/PeterTechDev", label: "GitHub", external: true },
            { icon: Linkedin, href: "https://www.linkedin.com/in/petertechdev/", label: "LinkedIn", external: true },
            { icon: Mail, href: `mailto:${EMAIL}`, label: "Email", external: false },
          ].map(({ icon: Icon, href, label, external }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="w-12 h-12 rounded-full flex items-center justify-center border transition-all"
              style={{
                borderColor: theme.colors.cardBorder,
                color: theme.colors.textMuted,
              }}
              whileHover={{
                scale: 1.1,
                borderColor: theme.colors.accent,
                color: theme.colors.accent,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        <motion.a
          href={`mailto:${EMAIL}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          className="inline-flex items-center justify-center min-h-11 mb-8 text-base font-semibold underline-offset-4 hover:underline"
          style={{ color: theme.colors.text }}
        >
          {EMAIL}
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.a
              href="/cv-peter-v2.pdf"
              download
              className="inline-flex items-center justify-center gap-2 min-h-11 px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all"
              style={{
                background: theme.colors.gradient,
                color: theme.isDark ? theme.colors.bg : "#ffffff",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} />
              {t<string>("hero.downloadCv")}
            </motion.a>
            <motion.a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-base border transition-all"
              style={{
                color: theme.colors.accent,
                borderColor: theme.colors.accent + "40",
                background: theme.colors.accent + "10",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDown size={18} />
              {t<string>("hero.cta")}
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/blog/"
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-base border transition-all"
                style={{
                  color: theme.colors.text,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <BookOpen size={18} />
                {t<string>("hero.writing")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/playground/"
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-base border transition-all"
                style={{
                  color: theme.colors.text,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <Bug size={18} />
                {t<string>("hero.playground")}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="hidden md:block mt-16"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ color: theme.colors.accent, opacity: 0.75 }}
        >
          <ArrowDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
}
