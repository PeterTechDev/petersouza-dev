"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme-context";
import { I18nProvider } from "@/lib/i18n-context";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { AIAgents } from "@/components/AIAgents";
import { Contact } from "@/components/Contact";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { KonamiCode } from "@/components/KonamiCode";
import { ThemeDecorations } from "@/components/ThemeDecorations";
import { GitHubActivityStrip } from "@/components/GitHubActivityStrip";
import { GitHubActivity } from "@/lib/github-activity";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

interface HomeClientProps {
  githubActivity: GitHubActivity;
}

export function HomeClient({ githubActivity }: HomeClientProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ParticleField />
        <ThemeDecorations />
        <SiteHeader />
        <main className="relative pb-28">
          <Hero />
          <GitHubActivityStrip activity={githubActivity} />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <AIAgents />
        </main>
        <ThemeSwitcher />
        <KonamiCode />
      </I18nProvider>
    </ThemeProvider>
  );
}
