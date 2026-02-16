"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { themes, defaultTheme, Theme } from "./themes";

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setTheme: (id: string) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const themeIds = Object.keys(themes);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(defaultTheme);

  const setTheme = useCallback((id: string) => {
    if (themes[id]) setThemeId(id);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeId((prev) => {
      const idx = themeIds.indexOf(prev);
      return themeIds[(idx + 1) % themeIds.length];
    });
  }, []);

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
