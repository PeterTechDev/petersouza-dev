"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme-context";
import { I18nProvider } from "@/lib/i18n-context";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ParticleField />
        <main className="relative">{children}</main>
        <ThemeSwitcher />
      </I18nProvider>
    </ThemeProvider>
  );
}
