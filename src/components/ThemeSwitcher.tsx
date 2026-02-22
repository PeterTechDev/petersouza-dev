"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";
import { themes } from "@/lib/themes";
import { Palette } from "lucide-react";

export default function ThemeSwitcher() {
  const { themeId, setTheme, theme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 items-end">
      <motion.button
        onClick={toggleLocale}
        className="h-10 px-4 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm border transition-all text-xs font-bold tracking-wider"
        style={{
          background: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          color: theme.colors.textMuted,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label={t<string>("ui.language.ariaLabel")}
      >
        <span style={{ color: locale === "en" ? theme.colors.accent : theme.colors.textMuted }}>
          {t<string>("ui.language.enShort")}
        </span>
        <span className="mx-2 opacity-60">|</span>
        <span style={{ color: locale === "pt-BR" ? theme.colors.accent : theme.colors.textMuted }}>
          {t<string>("ui.language.ptShort")}
        </span>
      </motion.button>

      <motion.button
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
      >
        <Palette size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 sm:bottom-[4.5rem] right-0 flex flex-col gap-2 p-3 rounded-2xl shadow-2xl backdrop-blur-md border"
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
