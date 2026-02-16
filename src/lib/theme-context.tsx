"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { themes, defaultTheme, Theme } from "./themes";

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setTheme: (id: string) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const themeIds = Object.keys(themes);

function getInitialTheme(): string {
  if (typeof window === "undefined") return defaultTheme;
  const saved = localStorage.getItem("ps-theme");
  return saved && themes[saved] ? saved : defaultTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(getInitialTheme);

  const setTheme = useCallback((id: string) => {
    if (themes[id]) {
      setThemeId(id);
      localStorage.setItem("ps-theme", id);
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeId((prev) => {
      const idx = themeIds.indexOf(prev);
      const next = themeIds[(idx + 1) % themeIds.length];
      localStorage.setItem("ps-theme", next);
      return next;
    });
  }, []);

  // Apply theme background to body for smooth transitions
  useEffect(() => {
    const t = themes[themeId];
    document.body.style.backgroundColor = t.colors.bg;
    document.body.style.color = t.colors.text;
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
