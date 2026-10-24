"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme-context";
import { I18nProvider } from "@/lib/i18n-context";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export function PageWrapper({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ParticleField />
        <SiteHeader />
        <main className="relative pb-28">{children}</main>
        {footer}
        <ThemeSwitcher />
      </I18nProvider>
    </ThemeProvider>
  );
}
