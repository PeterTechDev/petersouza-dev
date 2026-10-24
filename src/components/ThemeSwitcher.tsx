"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { themes } from "@/lib/themes";
import { Palette } from "lucide-react";

export function ThemeSwitcher() {
  const { themeId, setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col gap-2 items-start">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border transition-all"
        style={{
          background: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          color: theme.colors.accent,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch theme"
        aria-expanded={open}
        aria-controls={menuId}
      >
        <Palette size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Select theme"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 sm:bottom-[4.5rem] left-0 flex flex-col gap-2 p-3 rounded-2xl shadow-2xl backdrop-blur-md border"
            style={{
              background: theme.colors.bgSecondary + "ee",
              borderColor: theme.colors.cardBorder,
            }}
          >
            {Object.values(themes).map((t) => (
              <motion.button
                key={t.id}
                type="button"
                role="menuitemradio"
                aria-checked={themeId === t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="flex items-center gap-3 min-h-11 px-4 py-2 rounded-xl transition-all text-sm whitespace-nowrap"
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
