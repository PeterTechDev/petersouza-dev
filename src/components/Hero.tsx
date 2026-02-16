"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const roles = [
  "Software Engineer",
  "AI Builder",
  "Problem Solver",
  "Full-Stack Developer",
];

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      style={{ color: theme.colors.text }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl"
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm tracking-[0.3em] uppercase mb-6 font-medium"
          style={{ color: theme.colors.accent }}
        >
          Hello, world
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-4"
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

        {/* Animated roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl md:text-2xl mb-8 h-8"
          style={{ color: theme.colors.textMuted }}
        >
          <RoleSwitcher roles={roles} accent={theme.colors.accent} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: theme.colors.textMuted }}
        >
          Building products that solve real problems.
          <br />
          From <strong style={{ color: theme.colors.accent }}>Brazil</strong> to the world.
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-4 justify-center mb-16"
        >
          {[
            { icon: Github, href: "https://github.com/petersouzadev", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/petersouza", label: "LinkedIn" },
            { icon: Mail, href: "mailto:peterleite.dev@gmail.com", label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ color: theme.colors.textMuted }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function RoleSwitcher({ roles, accent }: { roles: string[]; accent: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ color: accent }}
        className="font-semibold inline-block"
      >
        {roles[index]}
      </motion.span>
    </AnimatePresence>
  );
}
