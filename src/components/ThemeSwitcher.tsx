"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { themes } from "@/lib/themes";
import { Palette } from "lucide-react";

export default function ThemeSwitcher() {
  const { themeId, setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border transition-all"
        style={{
          background: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          color: theme.colors.accent,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch theme"
      >
        <Palette size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-18 right-0 flex flex-col gap-2 p-3 rounded-2xl shadow-2xl backdrop-blur-md border"
            style={{
              background: theme.colors.bgSecondary + "ee",
              borderColor: theme.colors.cardBorder,
            }}
          >
            {Object.values(themes).map((t) => (
              <motion.button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm whitespace-nowrap"
                style={{
                  background: themeId === t.id ? theme.colors.accent + "20" : "transparent",
                  color: themeId === t.id ? theme.colors.accent : theme.colors.textMuted,
                }}
                whileHover={{ x: 4 }}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="font-medium">{t.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
