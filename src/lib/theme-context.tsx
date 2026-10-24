"use client";

import { createContext, useContext, useCallback, useEffect, useSyncExternalStore, ReactNode } from "react";
import { themes, defaultTheme, Theme } from "./themes";

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setTheme: (id: string) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const themeIds = Object.keys(themes);

const THEME_EVENT = "ps-theme-change";

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readTheme(): string {
  const saved = localStorage.getItem("ps-theme");
  return saved && themes[saved] ? saved : defaultTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server snapshot is the default theme. A saved theme is read after hydration.
  const themeId = useSyncExternalStore(subscribeTheme, readTheme, () => defaultTheme);

  const setTheme = useCallback((id: string) => {
    if (!themes[id]) return;
    localStorage.setItem("ps-theme", id);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const cycleTheme = useCallback(() => {
    const current = readTheme();
    const idx = themeIds.indexOf(current);
    const next = themeIds[(idx + 1) % themeIds.length];
    localStorage.setItem("ps-theme", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  // Apply theme background to body for smooth transitions
  useEffect(() => {
    const t = themes[themeId];
    document.body.style.backgroundColor = t.colors.bg;
    document.body.style.color = t.colors.text;
    document.documentElement.style.setProperty("--theme-heading-font", t.font.heading);
    document.documentElement.style.setProperty("--theme-body-font", t.font.body);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ theme: themes[themeId], themeId, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
