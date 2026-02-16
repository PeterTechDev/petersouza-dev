"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { Send } from "lucide-react";

export default function Contact() {
  const { theme } = useTheme();

  return (
    <section className="py-32 px-6" id="contact">
      <div className="max-w-3xl mx-auto text-center">
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
            Let&apos;s Connect
          </p>
          <h2
            className="text-4xl md:text-5xl font-black mb-6"
            style={{ color: theme.colors.text }}
          >
            Got an idea?
          </h2>
          <p
            className="text-xl mb-12 leading-relaxed"
            style={{ color: theme.colors.textMuted }}
          >
            I&apos;m always open to interesting conversations, collaborations,
            and opportunities. Let&apos;s build something great together.
          </p>

          <motion.a
            href="mailto:peterleite.dev@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all"
            style={{
              background: theme.colors.gradient,
              color: theme.colors.bg === "#fafafa" || theme.colors.bg === "#f3f2ef" ? "#ffffff" : theme.colors.bg,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
            Say Hello
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-sm"
          style={{ color: theme.colors.textMuted + "80" }}
        >
          © {new Date().getFullYear()} Peter Souza. Built with Next.js, Three.js & a lot of coffee.
        </motion.p>
      </div>
    </section>
  );
}
