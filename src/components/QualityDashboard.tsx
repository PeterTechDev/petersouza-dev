"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/i18n-context";
import { useTheme } from "@/lib/theme-context";
import type { Locale } from "@/lib/i18n";
import type { QualityReport, QualityRun } from "@/lib/ci-status";

const STATUSES = new Set([
  "completed",
  "in_progress",
  "queued",
  "waiting",
  "requested",
  "pending",
]);

const CONCLUSIONS = new Set([
  "success",
  "failure",
  "cancelled",
  "skipped",
  "timed_out",
  "neutral",
  "action_required",
  "startup_failure",
  "stale",
]);

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(" ");
}

function formatWhen(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function QualityDashboard({ report }: { report: QualityReport }) {
  const { theme } = useTheme();
  const { locale, t } = useLocale();
  const missing = t<string>("quality.missing");

  function statusLabel(value: string | null): string {
    if (!value) return missing;
    if (!STATUSES.has(value)) return value;
    return t<string>(`quality.status.${value}`);
  }

  function conclusionLabel(value: string | null): string {
    if (!value) return missing;
    if (!CONCLUSIONS.has(value)) return value;
    return t<string>(`quality.conclusion.${value}`);
  }

  function field(label: string, value: ReactNode) {
    return (
      <div className="min-w-0">
        <dt className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.colors.textMuted }}>
          {label}
        </dt>
        <dd className="mt-1 text-sm break-words" style={{ color: theme.colors.text }}>
          {value}
        </dd>
      </div>
    );
  }

  function runCard(run: QualityRun | null) {
    const sha = run?.sha ?? missing;
    const duration = run && run.durationMs !== null ? formatDuration(run.durationMs) : missing;
    const status = statusLabel(run?.status ?? null);
    const conclusion = conclusionLabel(run?.conclusion ?? null);
    const date = run?.startedAt ? (
      <time dateTime={run.startedAt}>{formatWhen(run.startedAt, locale)}</time>
    ) : (
      missing
    );

    return (
      <article
        key={run?.id ?? "unavailable"}
        className="rounded-2xl border p-5 sm:p-6"
        style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
      >
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field(t<string>("quality.fields.status"), status)}
          {field(t<string>("quality.fields.conclusion"), conclusion)}
          {field(t<string>("quality.fields.date"), date)}
          {field(t<string>("quality.fields.commit"), sha)}
          {field(t<string>("quality.fields.duration"), duration)}
          <div className="min-w-0">
            <dt className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.colors.textMuted }}>
              {t<string>("quality.fields.link")}
            </dt>
            <dd className="mt-1 text-sm">
              {run?.url ? (
                <a
                  href={run.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 min-h-11 font-semibold underline-offset-4 hover:underline"
                  style={{ color: theme.colors.accent }}
                >
                  {t<string>("quality.openRun")}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              ) : (
                <span style={{ color: theme.colors.text }}>{missing}</span>
              )}
            </dd>
          </div>
        </dl>
      </article>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.colors.bg, color: theme.colors.text }}>
      <nav className="px-5 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-medium"
            style={{ color: theme.colors.textMuted }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t<string>("quality.back")}
          </Link>
        </div>
      </nav>

      <header className="px-5 sm:px-6 pt-10 pb-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: theme.colors.accent }}>
              {t<string>("quality.kicker")}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">{t<string>("quality.title")}</h1>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: theme.colors.textMuted }}>
              {t<string>("quality.subtitle")}
            </p>
          </motion.div>
        </div>
      </header>

      <section className="px-5 sm:px-6 pb-24" aria-labelledby="quality-runs-heading">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 id="quality-runs-heading" className="sr-only">
            {t<string>("quality.title")}
          </h2>
          {report.state === "ready" ? (
            report.runs.map((run) => runCard(run))
          ) : (
            <div role="status" className="space-y-4">
              <p className="text-lg font-semibold">
                {report.state === "empty"
                  ? t<string>("quality.notYetRun")
                  : t<string>("quality.unavailableTitle")}
              </p>
              {runCard(null)}
            </div>
          )}
          <p className="text-sm pt-2" style={{ color: theme.colors.textMuted }}>
            {t<string>("quality.source")}
          </p>
        </div>
      </section>
    </div>
  );
}
