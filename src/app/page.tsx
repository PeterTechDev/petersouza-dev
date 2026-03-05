"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme-context";
import { I18nProvider } from "@/lib/i18n-context";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import AIAgents from "@/components/AIAgents";
import Contact from "@/components/Contact";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import KonamiCode from "@/components/KonamiCode";
import ThemeDecorations from "@/components/ThemeDecorations";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export default function Home() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ParticleField />
        <ThemeDecorations />
        <main className="relative">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <AIAgents />
          <Contact />
        </main>
        <ThemeSwitcher />
        <KonamiCode />
      </I18nProvider>
    </ThemeProvider>
  );
}
