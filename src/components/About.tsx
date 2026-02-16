"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { MapPin, Briefcase, Cpu, Heart } from "lucide-react";

const stats = [
  { label: "Years in Tech", value: "4+", icon: Briefcase },
  { label: "AI Projects", value: "6+", icon: Cpu },
  { label: "Location", value: "Brazil", icon: MapPin },
  { label: "Driven By", value: "Family", icon: Heart },
];

export default function About() {
  const { theme } = useTheme();

  return (
    <section className="py-32 px-6" id="about">
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
            Who I Am
          </p>
          <h2
            className="text-4xl md:text-5xl font-black mb-8"
            style={{ color: theme.colors.text }}
          >
            About
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12">
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: theme.colors.textMuted }}
            >
              I&apos;m a software engineer from Brazil who believes technology should solve
              real problems for real people. I dropped out of law school because I wanted
              to <em>build things</em>, not just argue about them.
            </p>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: theme.colors.textMuted }}
            >
              Today I split my time between quality engineering at an international company
              and building AI-first products — from multi-agent WhatsApp assistants to
              automated video platforms. Every product I ship starts with one question:{" "}
              <strong style={{ color: theme.colors.accent }}>
                &quot;Does this make someone&apos;s life easier?&quot;
              </strong>
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              When I&apos;m not coding, I&apos;m playing basketball, running D&amp;D campaigns,
              or chasing my daughter around the house. I&apos;m a firm believer that the best
              engineers are the ones who never stop being curious.
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
                className="rounded-2xl p-6 border text-center"
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
