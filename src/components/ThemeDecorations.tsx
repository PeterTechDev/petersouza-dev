"use client";

import { useTheme } from "@/lib/theme-context";
import { useEffect } from "react";

export default function ThemeDecorations() {
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;
    // Remove all decoration classes
    body.classList.remove("decoration-scanlines", "decoration-court", "decoration-borders");

    // Apply current theme decoration
    switch (theme.decoration) {
      case "scanlines":
        body.classList.add("decoration-scanlines");
        break;
      case "court":
        body.classList.add("decoration-court");
        break;
      case "borders":
        body.classList.add("decoration-borders");
        break;
    }

    return () => {
      body.classList.remove("decoration-scanlines", "decoration-court", "decoration-borders");
    };
  }, [theme.decoration]);

  // Star field for starwars is handled via the particle system (200 stars)
  // Minimal "none" = clean negative space, no decorations
  return null;
}
