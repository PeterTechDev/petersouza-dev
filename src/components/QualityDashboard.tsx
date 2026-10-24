"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/i18n-context";
import { useTheme } from "@/lib/theme-context";
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

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute} UTC`;
}

export function QualityDashboard({ report }: { report: QualityReport }) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const missing = t<string>("quality.missing");

  function statusLabel(value: string | null): string {
    if (!value) return missing;
    if (!STATUSES.has(value)) return t<string>("quality.unknown");
    return t<string>(`quality.status.${value}`);
  }

  function conclusionLabel(value: string | null): string {
    if (!value) return missing;
    if (!CONCLUSIONS.has(value)) return t<string>("quality.unknown");
    return t<string>(`quality.conclusion.${value}`);
  }

  function field(label: string, value: ReactNode, valueId?: string) {
    return (
      <div className="min-w-0">
        <dt className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.colors.textMuted }}>
          {label}
        </dt>
        <dd id={valueId} className="mt-1 text-sm break-words" style={{ color: theme.colors.text }}>
          {value}
        </dd>
      </div>
    );
  }

  function runCard(run: QualityRun | null) {
    const cardKey = run ? String(run.id) : report.state;
    const commitId = `quality-run-${cardKey}-commit`;
    const sha = run?.sha ?? missing;
    const dateText = run?.startedAt ? formatWhen(run.startedAt) : missing;
    const duration = run && run.durationMs !== null ? formatDuration(run.durationMs) : missing;
    const status = statusLabel(run?.status ?? null);
    const conclusion = conclusionLabel(run?.conclusion ?? null);
    const date = run?.startedAt ? <time dateTime={run.startedAt}>{dateText}</time> : dateText;
    const placeholderName =
      run === null
        ? t<string>(report.state === "error" ? "quality.errorCardName" : "quality.emptyCardName")
        : null;
    const labelId = `quality-run-${cardKey}-name`;

    return (
      <article
        key={cardKey}
        aria-labelledby={placeholderName ? labelId : commitId}
        className="rounded-2xl border p-5 sm:p-6"
        style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
      >
        {placeholderName ? (
          <span id={labelId} className="sr-only">
            {missing} {placeholderName}
          </span>
        ) : null}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field(t<string>("quality.fields.status"), status)}
          {field(t<string>("quality.fields.conclusion"), conclusion)}
          {field(t<string>("quality.fields.date"), date)}
          {field(
            t<string>("quality.fields.commit"),
            placeholderName ? missing : sha,
            placeholderName ? undefined : commitId,
          )}
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
                  aria-label={t<string>("quality.openRunLabel", { sha, date: dateText })}
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

      <section className="px-5 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          {report.state === "ready" ? (
            report.runs.map((run) => runCard(run))
          ) : (
            <div className="space-y-4">
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
