"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createTranslator, DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: <T = string>(key: string, vars?: Record<string, string | number>) => T;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function normalizeLocale(raw: string | null | undefined): Locale | null {
  if (!raw) return null;
  if (raw === "en" || raw === "pt-BR") return raw;
  const lower = raw.toLowerCase();
  if (lower.startsWith("pt")) return "pt-BR";
  if (lower.startsWith("en")) return "en";
  return null;
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const fromQuery = normalizeLocale(new URLSearchParams(window.location.search).get("lang"));
  if (fromQuery) return fromQuery;
  const saved = normalizeLocale(localStorage.getItem("ps-locale"));
  if (saved) return saved;
  const nav = normalizeLocale(window.navigator.language);
  return nav ?? DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, _setLocale] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    _setLocale(next);
    if (typeof window !== "undefined") localStorage.setItem("ps-locale", next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "pt-BR" : "en");
  }, [locale, setLocale]);

  const { t } = useMemo(() => createTranslator(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === "pt-BR" ? "pt-BR" : "en";
  }, [locale]);

  const value: I18nContextValue = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used within I18nProvider");
  return ctx;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
