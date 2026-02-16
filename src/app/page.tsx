"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme-context";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import KonamiCode from "@/components/KonamiCode";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export default function Home() {
  return (
    <ThemeProvider>
      <ParticleField />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <ThemeSwitcher />
      <KonamiCode />
    </ThemeProvider>
  );
}
