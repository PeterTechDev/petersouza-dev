"use client";

/**
 * Synthetic checkout for the bug-bash playground.
 *
 * Defects are intentional. Do not "fix" the default mode in this file.
 * Every planted behavior is decided in src/lib/playground-bugs.ts, and it
 * runs only when `mode` is "planted". `?mode=fixed` passes mode "fixed".
 */

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n-context";
import { useTheme } from "@/lib/theme-context";
import {
  CART_LINES,
  PLAYGROUND_BUGS,
  displayedLineCents,
  displayedTotalCents,
  emailErrorKey,
  emailLabelAssociated,
  formatMoney,
  isBugActive,
  isEmailAccepted,
  keyboardTrapActive,
  noteDismissIsButton,
  observeBug,
  playgroundHref,
  shouldIgnoreExtraSubmit,
  submitLabelKey,
  type BugObservation,
  type PlaygroundMode,
} from "@/lib/playground-bugs";

const SEVERITY_KEY = {
  critical: "playground.severityCritical",
  major: "playground.severityMajor",
  minor: "playground.severityMinor",
} as const;

export function PlaygroundCheckout({ mode }: { mode: PlaygroundMode }) {
  const { theme } = useTheme();
  const { locale, t } = useLocale();
  const [revealed, setRevealed] = useState(false);

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
            {t<string>("playground.back")}
          </Link>
        </div>
      </nav>

      <header className="px-5 sm:px-6 pt-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: theme.colors.accent }}>
              {t<string>("playground.kicker")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">{t<string>("playground.title")}</h1>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: theme.colors.textMuted }}>
              {t<string>("playground.subtitle")}
            </p>
          </motion.div>
        </div>
      </header>

      <div className="px-5 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <p
            className="rounded-2xl border p-4 text-sm leading-relaxed"
            style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder, color: theme.colors.text }}
          >
            {t<string>("playground.warning")}
          </p>

          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.colors.textMuted }}>
              {t<string>("playground.modeLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              <ModeLink mode="planted" current={mode} label={t<string>("playground.modePlanted")} />
              <ModeLink mode="fixed" current={mode} label={t<string>("playground.modeFixed")} />
            </div>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>
              {mode === "fixed" ? t<string>("playground.modeFixedHint") : t<string>("playground.modePlantedHint")}
            </p>
          </div>

          <CheckoutForm key={mode} mode={mode} />

          <section aria-labelledby="bug-reports-heading" className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center min-h-11 px-5 rounded-full border text-sm font-bold"
                style={{ borderColor: theme.colors.cardBorder, color: theme.colors.text }}
                aria-expanded={revealed}
                onClick={() => setRevealed((open) => !open)}
              >
                {revealed ? t<string>("playground.hide") : t<string>("playground.reveal")}
              </button>
            </div>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>
              {t<string>("playground.revealHint")}
            </p>
            {revealed ? (
              <div id="bug-reports" className="space-y-4">
                <h2 id="bug-reports-heading" className="text-xl font-black">
                  {t<string>("playground.reveal")}
                </h2>
                {PLAYGROUND_BUGS.map((bug) => {
                  const active = isBugActive(bug.id, mode);
                  return (
                    <article
                      key={bug.id}
                      className="rounded-2xl border p-5 sm:p-6 space-y-3"
                      style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-lg font-bold">{bug.title[locale]}</h3>
                        <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.colors.textMuted }}>
                          {t<string>("playground.severity")}: {t<string>(SEVERITY_KEY[bug.severity])}
                          {" · "}
                          {active ? t<string>("playground.active") : t<string>("playground.inactive")}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.colors.textMuted }}>
                          {t<string>("playground.steps")}
                        </h4>
                        <ol className="mt-1 list-decimal pl-5 space-y-1 text-sm">
                          {bug.steps[locale].map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <ReportLine label={t<string>("playground.expected")} text={bug.expected[locale]} />
                      <ReportLine label={t<string>("playground.actual")} text={bug.actual[locale]} />
                      <ReportLine label={t<string>("playground.observed")} text={observationText(observeBug(bug.id, mode), t)} />
                    </article>
                  );
                })}
              </div>
            ) : (
              <h2 id="bug-reports-heading" className="sr-only">
                {t<string>("playground.reveal")}
              </h2>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function observationText(
  observed: BugObservation,
  t: <T = string>(key: string, vars?: Record<string, string | number>) => T,
): string {
  switch (observed.id) {
    case "validation":
      return t<string>(
        observed.accepted ? "playground.observe.emailAccepted" : "playground.observe.emailRejected",
        { sample: observed.sample },
      );
    case "rounding":
      return t<string>("playground.observe.total", {
        lines: observed.lines.join(" + "),
        total: observed.total,
      });
    case "a11y-label":
      return t<string>(observed.associated ? "playground.observe.labelYes" : "playground.observe.labelNo");
    case "double-submit":
      return t<string>(
        observed.blocksRepeat ? "playground.observe.repeatBlocked" : "playground.observe.repeatAllowed",
      );
    case "i18n-string":
      return t<string>("playground.observe.key", {
        key: observed.key,
        resolved: t<string>(observed.key),
      });
    case "keyboard-trap":
      return t<string>(observed.trapped ? "playground.observe.trapped" : "playground.observe.notTrapped");
  }
}

function ReportLine({ label, text }: { label: string; text: string }) {
  const { theme } = useTheme();
  return (
    <p className="text-sm leading-relaxed">
      <span className="font-semibold" style={{ color: theme.colors.textMuted }}>
        {label}:{" "}
      </span>
      {text}
    </p>
  );
}

function ModeLink({ mode, current, label }: { mode: PlaygroundMode; current: PlaygroundMode; label: string }) {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const selected = mode === current;
  return (
    <Link
      href={playgroundHref(mode, locale)}
      aria-current={selected ? "page" : undefined}
      className="inline-flex items-center justify-center min-h-11 px-4 rounded-full border text-sm font-bold"
      style={{
        borderColor: selected ? theme.colors.accent : theme.colors.cardBorder,
        color: selected ? theme.colors.accent : theme.colors.text,
        background: selected ? theme.colors.accent + "14" : "transparent",
      }}
    >
      {label}
    </Link>
  );
}

function CheckoutForm({ mode }: { mode: PlaygroundMode }) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [noteOpen, setNoteOpen] = useState(false);
  const placedRef = useRef(0);
  const noteTriggerRef = useRef<HTMLButtonElement>(null);
  const emailAssociated = emailLabelAssociated(mode);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (shouldIgnoreExtraSubmit(placedRef.current, mode)) return;

    const nameOk = name.trim().length > 0;
    const emailOk = isEmailAccepted(email, mode);
    setNameError(!nameOk);
    setEmailError(!emailOk);
    if (!nameOk || !emailOk) return;

    placedRef.current += 1;
    setOrderCount(placedRef.current);
  }

  function closeNote() {
    setNoteOpen(false);
    noteTriggerRef.current?.focus();
  }

  const fieldStyle = {
    background: theme.colors.bg,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.text,
  };

  return (
    <div className="space-y-6" data-mode={mode}>
      <section
        aria-labelledby="cart-heading"
        className="rounded-2xl border p-5 sm:p-6 space-y-4"
        style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
      >
        <h2 id="cart-heading" className="text-xl font-black">
          {t<string>("playground.cartTitle")}
        </h2>
        <p className="text-sm" style={{ color: theme.colors.textMuted }}>
          {t<string>("playground.synthetic")}
        </p>
        <ul className="space-y-2">
          {CART_LINES.map((line) => (
            <li key={line.id} className="flex items-baseline justify-between gap-4 text-sm">
              <span>{t<string>(line.nameKey)}</span>
              <span className="font-semibold tabular-nums">{formatMoney(displayedLineCents(line.cents, mode))}</span>
            </li>
          ))}
        </ul>
        <p id="checkout-total" className="flex items-baseline justify-between gap-4 text-base font-bold">
          <span>{t<string>("playground.total")}</span>
          <span className="tabular-nums">{formatMoney(displayedTotalCents(mode))}</span>
        </p>
      </section>

      <section
        aria-labelledby="checkout-heading"
        className="rounded-2xl border p-5 sm:p-6"
        style={{ background: theme.colors.card, borderColor: theme.colors.cardBorder }}
      >
        <h2 id="checkout-heading" className="text-xl font-black mb-4">
          {t<string>("playground.formTitle")}
        </h2>
        <form noValidate className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label htmlFor="checkout-name" className="block text-sm font-semibold">
              {t<string>("playground.name")}
            </label>
            <input
              id="checkout-name"
              name="name"
              type="text"
              autoComplete="off"
              value={name}
              aria-invalid={nameError || undefined}
              aria-describedby={nameError ? "checkout-name-error" : undefined}
              onChange={(event) => {
                setName(event.target.value);
                setNameError(false);
              }}
              className="w-full min-h-11 rounded-lg border px-3 text-base"
              style={fieldStyle}
            />
            {nameError ? (
              <p id="checkout-name-error" role="alert" className="text-sm" style={{ color: theme.colors.accent }}>
                {t<string>("playground.nameError")}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            {emailAssociated ? (
              <label htmlFor="checkout-email" className="block text-sm font-semibold">
                {t<string>("playground.email")}
              </label>
            ) : (
              <span data-testid="email-visual-label" className="block text-sm font-semibold">
                {t<string>("playground.email")}
              </span>
            )}
            <input
              id="checkout-email"
              name="email"
              type="text"
              autoComplete="off"
              value={email}
              aria-invalid={emailError || undefined}
              aria-describedby={emailError ? "checkout-email-error" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError(false);
              }}
              className="w-full min-h-11 rounded-lg border px-3 text-base"
              style={fieldStyle}
            />
            {emailError ? (
              <p id="checkout-email-error" role="alert" className="text-sm" style={{ color: theme.colors.accent }}>
                {t<string>(emailErrorKey(mode))}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            ref={noteTriggerRef}
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-full border text-sm font-bold"
            style={{ borderColor: theme.colors.cardBorder, color: theme.colors.text }}
            onClick={() => setNoteOpen(true)}
          >
            {t<string>("playground.noteOpen")}
          </button>

          <button
            id="checkout-submit"
            type="submit"
            disabled={shouldIgnoreExtraSubmit(orderCount, mode)}
            className="inline-flex items-center justify-center min-h-11 px-5 rounded-full text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: theme.colors.gradient, color: theme.isDark ? theme.colors.bg : "#ffffff" }}
          >
            {t<string>(submitLabelKey(mode))}
          </button>

          {orderCount > 0 ? (
            <p role="status" className="text-sm font-semibold">
              {t<string>("playground.placed", { count: orderCount })}
            </p>
          ) : null}
        </form>
      </section>

      {noteOpen ? <NoteDialog mode={mode} onClose={closeNote} /> : null}
    </div>
  );
}

function NoteDialog({ mode, onClose }: { mode: PlaygroundMode; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const onCloseRef = useRef(onClose);
  const trapped = keyboardTrapActive(mode);
  const dismissIsButton = noteDismissIsButton(mode);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    noteRef.current?.focus();
    const node = dialogRef.current;
    if (!node) return;
    const dialog: HTMLDivElement = node;

    function handleKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (trapped) return;
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      if (trapped) {
        event.preventDefault();
        noteRef.current?.focus();
        return;
      }

      const focusable = [...dialog.querySelectorAll<HTMLElement>("button, textarea, input, a[href]")].filter(
        (element) => !element.hasAttribute("disabled"),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    dialog.addEventListener("keydown", handleKey);
    return () => dialog.removeEventListener("keydown", handleKey);
  }, [trapped]);

  let dismiss: ReactNode;
  if (dismissIsButton) {
    dismiss = (
      <button
        type="button"
        className="inline-flex items-center justify-center min-h-11 px-4 rounded-full text-sm font-bold"
        style={{ background: theme.colors.gradient, color: theme.isDark ? theme.colors.bg : "#ffffff" }}
        onClick={onClose}
      >
        {t<string>("playground.noteDismiss")}
      </button>
    );
  } else {
    dismiss = (
      // Planted keyboard trap: this control is not focusable. See playground-bugs.ts (keyboard-trap).
      <span
        data-testid="note-dismiss"
        className="inline-flex items-center justify-center min-h-11 px-4 rounded-full text-sm font-bold cursor-pointer"
        style={{ background: theme.colors.gradient, color: theme.isDark ? theme.colors.bg : "#ffffff" }}
        onClick={onClose}
      >
        {t<string>("playground.noteDismiss")}
      </span>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0, 0, 0, 0.72)" }}
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (trapped) return;
        // Cancel the focus move to the body. The click below restores the opener.
        event.preventDefault();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        if (trapped) return;
        onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal={trapped ? undefined : true}
        aria-labelledby="order-note-title"
        className="w-full max-w-md rounded-2xl border p-5 space-y-3"
        style={{ background: theme.colors.bg, borderColor: theme.colors.cardBorder, color: theme.colors.text }}
      >
        <h2 id="order-note-title" className="text-lg font-black">
          {t<string>("playground.noteTitle")}
        </h2>
        <label htmlFor="order-note" className="block text-sm font-semibold">
          {t<string>("playground.noteLabel")}
        </label>
        <textarea
          id="order-note"
          ref={noteRef}
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-base"
          style={{
            background: theme.colors.bg,
            borderColor: theme.colors.cardBorder,
            color: theme.colors.text,
          }}
        />
        {dismiss}
      </div>
    </div>
  );
}
