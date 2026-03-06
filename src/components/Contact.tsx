"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { Send, Github, Linkedin } from "lucide-react";

export function Contact() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="contact">
      <div className="max-w-6xl mx-auto text-center">
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
            {t<string>("contact.kicker")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-6"
            style={{ color: theme.colors.text }}
          >
            {t<string>("contact.title")}
          </h2>
          <p
            className="text-base sm:text-xl mb-12 leading-relaxed"
            style={{ color: theme.colors.textMuted }}
          >
            {t<string>("contact.subtitle")}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <motion.a
              href="mailto:peterleite.dev@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm sm:text-base transition-all"
              style={{
                background: theme.colors.gradient,
                color: theme.isDark ? theme.colors.bg : "#ffffff",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={18} />
              {t<string>("contact.cta")}
            </motion.a>
            <motion.a
              href="https://github.com/PeterTechDev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm sm:text-base border transition-all"
              style={{
                borderColor: theme.colors.cardBorder,
                color: theme.colors.text,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={18} />
              GitHub
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/petertechdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm sm:text-base border transition-all"
              style={{
                borderColor: theme.colors.cardBorder,
                color: theme.colors.text,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={18} />
              LinkedIn
            </motion.a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 sm:mt-24 text-sm"
          style={{ color: theme.colors.textMuted + "80" }}
        >
          {t<string>("contact.footer", { year: new Date().getFullYear() })}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 pb-24 flex items-center justify-center gap-2"
        >
          <span className="text-xs" style={{ color: theme.colors.textMuted + "60" }}>
            Supported by
          </span>
          <a
            href="https://elevenlabs.io/startup-grants"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={theme.isDark
                ? "https://eleven-public-cdn.elevenlabs.io/payloadcms/cy7rxce8uki-IIElevenLabsGrants%201.webp"
                : "https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp"
              }
              alt="ElevenLabs Grants"
              style={{ width: "150px" }}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
