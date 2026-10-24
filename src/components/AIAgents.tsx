"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { ArrowRight } from "lucide-react";

export function AIAgents() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <section className="py-16 sm:py-20 px-6 md:px-12 lg:px-20" id="ai-agents">
      <div className="max-w-3xl mx-auto">
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
            {t<string>("aiAgents.kicker")}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ color: theme.colors.text }}
          >
            {t<string>("aiAgents.title")}
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-6"
            style={{ color: theme.colors.textMuted }}
          >
            {t<string>("aiAgents.subtitle")}
          </p>
          <Link
            href="/blog/why-i-built-a-multi-agent-ai-team/"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-bold"
            style={{ color: theme.colors.accent }}
          >
            {t<string>("aiAgents.blogLink")}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
