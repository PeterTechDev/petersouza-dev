"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";

export function AiTestingShowcase() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <div
      className="min-h-screen"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      <nav className="px-5 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-medium"
            style={{ color: theme.colors.textMuted }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t<string>("aiTesting.back")}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export function AiTestingFooter() {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <footer
      className="px-5 sm:px-6 py-8 border-t"
      style={{
        background: theme.colors.bg,
        color: theme.colors.text,
        borderColor: theme.colors.cardBorder,
      }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center min-h-11 text-sm font-medium"
          style={{ color: theme.colors.accent }}
        >
          {t<string>("aiTesting.footerHome")}
        </Link>
        <span className="text-xs" style={{ color: theme.colors.textMuted }}>
          © {new Date().getFullYear()} Peter Souza
        </span>
      </div>
    </footer>
  );
}
