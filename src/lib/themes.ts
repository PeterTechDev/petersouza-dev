export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    card: string;
    cardBorder: string;
    gradient: string;
  };
  particles: {
    color: string;
    count: number;
    speed: number;
    shape: "sphere" | "star" | "cube" | "dot" | "diamond";
  };
  font: {
    heading: string;
    body: string;
    cssVar: string;
  };
  decoration: "court" | "starfield" | "none" | "borders" | "scanlines";
}

export const themes: Record<string, Theme> = {
  basketball: {
    id: "basketball",
    name: "Court",
    emoji: "🏀",
    colors: {
      bg: "#0a0a0a",
      bgSecondary: "#141414",
      text: "#ffffff",
      textMuted: "#a0a0a0",
      accent: "#ff6b2b",
      accentHover: "#ff8c57",
      card: "rgba(255, 107, 43, 0.05)",
      cardBorder: "rgba(255, 107, 43, 0.2)",
      gradient: "linear-gradient(135deg, #ff6b2b 0%, #ff2b6b 100%)",
    },
    particles: { color: "#ff6b2b", count: 80, speed: 0.3, shape: "sphere" },
    font: { heading: "var(--font-bebas)", body: "var(--font-inter)", cssVar: "--font-bebas" },
    decoration: "court",
  },
  starwars: {
    id: "starwars",
    name: "Galaxy",
    emoji: "⚔️",
    colors: {
      bg: "#000000",
      bgSecondary: "#0a0a14",
      text: "#e8e6e3",
      textMuted: "#9a9a8a",
      accent: "#ffe81f",
      accentHover: "#fff44f",
      card: "rgba(255, 232, 31, 0.05)",
      cardBorder: "rgba(255, 232, 31, 0.2)",
      gradient: "linear-gradient(135deg, #ffe81f 0%, #ff6b2b 100%)",
    },
    particles: { color: "#ffe81f", count: 200, speed: 0.1, shape: "star" },
    font: { heading: "var(--font-orbitron)", body: "var(--font-dm-sans)", cssVar: "--font-orbitron" },
    decoration: "starfield",
  },
  minimal: {
    id: "minimal",
    name: "Clean",
    emoji: "◻️",
    colors: {
      bg: "#fafafa",
      bgSecondary: "#ffffff",
      text: "#111111",
      textMuted: "#666666",
      accent: "#0066cc",
      accentHover: "#0044aa",
      card: "rgba(0, 0, 0, 0.02)",
      cardBorder: "rgba(0, 0, 0, 0.1)",
      gradient: "linear-gradient(135deg, #111111 0%, #444444 100%)",
    },
    particles: { color: "#cccccc", count: 30, speed: 0.1, shape: "dot" },
    font: { heading: "var(--font-dm-sans)", body: "var(--font-dm-sans)", cssVar: "--font-dm-sans" },
    decoration: "none",
  },
  corporate: {
    id: "corporate",
    name: "LinkedIn",
    emoji: "💼",
    colors: {
      bg: "#f3f2ef",
      bgSecondary: "#ffffff",
      text: "#191919",
      textMuted: "#666666",
      accent: "#0a66c2",
      accentHover: "#004182",
      card: "rgba(10, 102, 194, 0.03)",
      cardBorder: "rgba(10, 102, 194, 0.15)",
      gradient: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    },
    particles: { color: "#0a66c2", count: 40, speed: 0.15, shape: "diamond" },
    font: { heading: "var(--font-playfair)", body: "var(--font-inter)", cssVar: "--font-playfair" },
    decoration: "borders",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Neon",
    emoji: "🌆",
    colors: {
      bg: "#0a0014",
      bgSecondary: "#120020",
      text: "#e0dfe6",
      textMuted: "#a89fd4",
      accent: "#ff00ff",
      accentHover: "#ff44ff",
      card: "rgba(255, 0, 255, 0.05)",
      cardBorder: "rgba(255, 0, 255, 0.3)",
      gradient: "linear-gradient(135deg, #ff00ff 0%, #00fff5 100%)",
    },
    particles: { color: "#ff00ff", count: 120, speed: 0.5, shape: "cube" },
    font: { heading: "var(--font-space-mono)", body: "var(--font-space-mono)", cssVar: "--font-space-mono" },
    decoration: "scanlines",
  },
};

export const defaultTheme = "basketball";
