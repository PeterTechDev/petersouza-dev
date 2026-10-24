"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/i18n-context";

type Principle = { title: string; body: string };
type AiCase = {
  id: string;
  scope: string;
  status: string;
  title: string;
  expect: string;
  detail: string;
};
type ResultRow = { id: string; label: string; value: string };

function asArray<T>(value: T[] | string): T[] {
  return Array.isArray(value) ? value : [];
}

export function AiTestingShowcase() {
  const { theme } = useTheme();
  const { t } = useLocale();

  const principles = asArray(t<Principle[]>("aiTesting.principles"));
  const order = asArray(t<string[]>("aiTesting.order"));
  const cases = asArray(t<AiCase[]>("aiTesting.cases"));
  const uiPoints = asArray(t<string[]>("aiTesting.uiPoints"));
  const resultRows = asArray(t<ResultRow[]>("aiTesting.resultRows"));
  const statusRow = resultRows.find((row) => row.id === "status");
  const detailRows = statusRow ? resultRows.filter((row) => row !== statusRow) : resultRows;

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

      <header className="px-5 sm:px-6 pt-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
            style={{ color: theme.colors.accent }}
          >
            {t<string>("aiTesting.kicker")}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-[1.05]">
            {t<string>("aiTesting.title")}
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: theme.colors.textMuted }}
          >
            {t<string>("aiTesting.lede")}
          </p>
        </div>
      </header>

      <div className="px-5 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto min-w-0 space-y-12">
          <section aria-labelledby="ai-testing-method">
            <h2 id="ai-testing-method" className="text-2xl sm:text-3xl font-black mb-4">
              {t<string>("aiTesting.methodTitle")}
            </h2>
            <div className="grid gap-4">
              {principles.map((item) => (
                <article
                  key={item.title}
                  className="min-w-0 rounded-2xl border p-5 sm:p-6"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p
                    className="min-w-0 text-sm sm:text-base leading-relaxed [overflow-wrap:anywhere]"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="ai-testing-scope">
            <h2 id="ai-testing-scope" className="text-2xl sm:text-3xl font-black mb-4">
              {t<string>("aiTesting.scopeTitle")}
            </h2>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <article
                className="min-w-0 rounded-2xl border p-5 sm:p-6"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3 className="text-sm font-bold tracking-wide uppercase mb-2" style={{ color: theme.colors.accent }}>
                  {t<string>("aiTesting.scopeRouteLabel")}
                </h3>
                <p
                  className="min-w-0 text-sm sm:text-base leading-relaxed [overflow-wrap:anywhere]"
                  style={{ color: theme.colors.textMuted }}
                >
                  {t<string>("aiTesting.scopeRoute")}
                </p>
              </article>
              <article
                className="min-w-0 rounded-2xl border p-5 sm:p-6"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3 className="text-sm font-bold tracking-wide uppercase mb-2" style={{ color: theme.colors.accent }}>
                  {t<string>("aiTesting.scopeWidgetLabel")}
                </h3>
                <p
                  className="min-w-0 text-sm sm:text-base leading-relaxed [overflow-wrap:anywhere]"
                  style={{ color: theme.colors.textMuted }}
                >
                  {t<string>("aiTesting.scopeWidget")}
                </p>
              </article>
            </div>
          </section>

          <section aria-labelledby="ai-testing-order">
            <h2 id="ai-testing-order" className="text-2xl sm:text-3xl font-black mb-4">
              {t<string>("aiTesting.orderTitle")}
            </h2>
            <ol className="space-y-3 list-none" role="list">
              {order.map((step, index) => (
                <li
                  key={step}
                  className="min-w-0 rounded-2xl border p-4 sm:p-5 flex gap-3"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  <span
                    className="font-mono text-sm font-bold shrink-0 pt-0.5"
                    style={{ color: theme.colors.accent }}
                  >
                    {index + 1}
                  </span>
                  <p
                    className="min-w-0 text-sm sm:text-base leading-relaxed [overflow-wrap:anywhere]"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="ai-testing-cases">
            <h2 id="ai-testing-cases" className="text-2xl sm:text-3xl font-black mb-3">
              {t<string>("aiTesting.casesTitle")}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-2" style={{ color: theme.colors.textMuted }}>
              {t<string>("aiTesting.casesIntro")}
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: theme.colors.textMuted }}>
              {t<string>("aiTesting.literalsNote")}
            </p>
            <div className="grid gap-4">
              {cases.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border p-5 sm:p-6"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="font-mono text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: theme.colors.accent + "20",
                        color: theme.colors.accent,
                      }}
                    >
                      {item.status}
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full border"
                      style={{
                        borderColor: theme.colors.cardBorder,
                        color: theme.colors.text,
                      }}
                    >
                      {item.scope}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-2 break-words">{item.expect}</p>
                  <p className="text-sm leading-relaxed break-words" style={{ color: theme.colors.textMuted }}>
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="ai-testing-ui">
            <h2 id="ai-testing-ui" className="text-2xl sm:text-3xl font-black mb-3">
              {t<string>("aiTesting.uiTitle")}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: theme.colors.textMuted }}>
              {t<string>("aiTesting.uiIntro")}
            </p>
            <ul className="space-y-3">
              {uiPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-2xl border p-4 sm:p-5 text-sm sm:text-base leading-relaxed break-words"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                    color: theme.colors.textMuted,
                  }}
                >
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="ai-testing-results">
            <h2 id="ai-testing-results" className="text-2xl sm:text-3xl font-black mb-4">
              {t<string>("aiTesting.resultsTitle")}
            </h2>
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                background: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              {statusRow ? (
                <dl className="mb-3">
                  <div>
                    <dt
                      className="text-xs font-bold tracking-wide uppercase mb-1"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {statusRow.label}
                    </dt>
                    <dd className="text-3xl sm:text-4xl font-black">{statusRow.value}</dd>
                  </div>
                </dl>
              ) : null}
              <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: theme.colors.textMuted }}>
                {t<string>("aiTesting.resultsBody")}
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {detailRows.map((row) => (
                  <div key={row.id}>
                    <dt className="text-xs font-bold tracking-wide uppercase mb-1" style={{ color: theme.colors.textMuted }}>
                      {row.label}
                    </dt>
                    <dd className="text-base font-semibold break-words">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </div>

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
