"use client";

import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";

export function SiteHeader() {
  const { theme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

  return (
    <header className="fixed top-0 right-0 z-50 p-3 sm:p-4">
      <button
        type="button"
        onClick={toggleLocale}
        className="min-h-11 px-4 rounded-full inline-flex items-center justify-center shadow-lg backdrop-blur-sm border text-xs font-bold tracking-wider"
        style={{
          background: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          color: theme.colors.textMuted,
        }}
        aria-label={t<string>("ui.language.ariaLabel")}
      >
        <span style={{ color: locale === "en" ? theme.colors.accent : theme.colors.textMuted }}>
          {t<string>("ui.language.enShort")}
        </span>
        <span className="mx-2 opacity-60">|</span>
        <span style={{ color: locale === "pt-BR" ? theme.colors.accent : theme.colors.textMuted }}>
          {t<string>("ui.language.ptShort")}
        </span>
      </button>
    </header>
  );
}
