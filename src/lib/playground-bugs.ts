import type { Locale } from "@/lib/i18n";

/**
 * INTENTIONAL BUGS. This module is the bug-bash fixture for /playground.
 *
 * Do not "fix" the default mode. The six defects below are planted on purpose
 * so someone can practice finding them. Correct behavior runs only when the
 * page is opened with `?mode=fixed`. The checkout and the "reveal bugs" panel
 * both read this file. If a report and the form disagree, this file is wrong.
 *
 * AXE GATE EXCLUSION
 * Keep /playground out of the future axe accessibility gate. The default mode
 * plants a missing accessible name and a keyboard trap, so an axe scan of this
 * route is expected to fail and must not fail CI.
 *
 * Automação QA applies this exclusion in the axe spec, not in playwright.config.
 * Import AXE_EXCLUDED_PATHS from this module. Skip every URL whose pathname is
 * listed here, with or without `?mode=fixed` and `?lang=`. Suggested check:
 *
 *   const path = new URL(page.url()).pathname.replace(/\/$/, "") || "/";
 *   const skipAxe = AXE_EXCLUDED_PATHS.some(
 *     (excluded) => excluded.replace(/\/$/, "") === path,
 *   );
 */
export const AXE_EXCLUDED_PATHS = ["/playground", "/playground/"] as const;

export const PLAYGROUND_MODE_PARAM = "mode";
export const PLAYGROUND_FIXED_MODE = "fixed";

export const VALIDATION_SAMPLE = "a@";
export const VALID_EMAIL_SAMPLE = "qa@example.com";

export const SUBMIT_LABEL_KEY = "playground.checkout.submit";
/** Absent from src/lib/i18n.ts on purpose. t() renders this key verbatim. */
export const SUBMIT_LABEL_MISSING_KEY = "playground.checkout.ctaMissing";

export type PlaygroundMode = "planted" | "fixed";

export type BugId =
  | "validation"
  | "rounding"
  | "a11y-label"
  | "double-submit"
  | "i18n-string"
  | "keyboard-trap";

export type BugSeverity = "critical" | "major" | "minor";

export type PlaygroundBug = {
  id: BugId;
  severity: BugSeverity;
  title: Record<Locale, string>;
  steps: Record<Locale, readonly string[]>;
  expected: Record<Locale, string>;
  actual: Record<Locale, string>;
};

export const BUG_IDS = [
  "validation",
  "rounding",
  "a11y-label",
  "double-submit",
  "i18n-string",
  "keyboard-trap",
] as const satisfies readonly BugId[];

export function modeFromParam(value: string | string[] | undefined): PlaygroundMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === PLAYGROUND_FIXED_MODE ? "fixed" : "planted";
}

export function isBugActive(_id: BugId, mode: PlaygroundMode): boolean {
  return mode !== PLAYGROUND_FIXED_MODE;
}

export function playgroundHref(mode: PlaygroundMode, locale: Locale): string {
  const params = new URLSearchParams();
  if (mode === "fixed") params.set(PLAYGROUND_MODE_PARAM, PLAYGROUND_FIXED_MODE);
  params.set("lang", locale);
  return `/playground/?${params.toString()}`;
}

/** Synthetic fixture prices, in integer cents. Not a real catalog. */
export const CART_LINES = [
  { id: "mug", cents: 1999, nameKey: "playground.cart.mug" },
  { id: "sticker", cents: 29, nameKey: "playground.cart.sticker" },
] as const;

export const CURRENCY_PREFIX = "$";

/**
 * Planted rounding bug: `Math.floor((cents / 100) * 100)` drops a cent when the
 * binary float is just under the integer (19.99 and 0.29 in this cart).
 * Fixed mode returns the original integer cents.
 */
export function displayedLineCents(cents: number, mode: PlaygroundMode): number {
  if (!isBugActive("rounding", mode)) return cents;
  return Math.floor((cents / 100) * 100);
}

export function displayedTotalCents(mode: PlaygroundMode): number {
  return CART_LINES.reduce((sum, line) => sum + displayedLineCents(line.cents, mode), 0);
}

export function formatMoney(cents: number): string {
  return `${CURRENCY_PREFIX}${(cents / 100).toFixed(2)}`;
}

/**
 * Planted validation: any string that contains "@" is accepted, including "a@".
 * Fixed mode requires a local part, an "@", a domain, a dot, and a tld.
 */
export function isEmailAccepted(value: string, mode: PlaygroundMode): boolean {
  const trimmed = value.trim();
  if (isBugActive("validation", mode)) return trimmed.includes("@");
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function emailErrorKey(mode: PlaygroundMode): string {
  return isBugActive("validation", mode)
    ? "playground.checkout.emailErrorPlanted"
    : "playground.checkout.emailError";
}

export function submitLabelKey(mode: PlaygroundMode): string {
  return isBugActive("i18n-string", mode) ? SUBMIT_LABEL_MISSING_KEY : SUBMIT_LABEL_KEY;
}

/** Planted mode never blocks a repeat submit. Fixed mode blocks once one order exists. */
export function shouldIgnoreExtraSubmit(alreadyPlaced: number, mode: PlaygroundMode): boolean {
  if (isBugActive("double-submit", mode)) return false;
  return alreadyPlaced > 0;
}

/** Planted mode leaves the email input without an associated label. */
export function emailLabelAssociated(mode: PlaygroundMode): boolean {
  return !isBugActive("a11y-label", mode);
}

/**
 * Planted mode traps Tab inside the note field and ignores Escape.
 * The dismiss control is not a button. Fixed mode uses a real close button,
 * cycles Tab between the note and that button, and closes on Escape.
 */
export function keyboardTrapActive(mode: PlaygroundMode): boolean {
  return isBugActive("keyboard-trap", mode);
}

export function noteDismissIsButton(mode: PlaygroundMode): boolean {
  return !keyboardTrapActive(mode);
}

const plantedLinePrices = CART_LINES.map((line) => formatMoney(displayedLineCents(line.cents, "planted")));
const fixedLinePrices = CART_LINES.map((line) => formatMoney(displayedLineCents(line.cents, "fixed")));
const plantedTotal = formatMoney(displayedTotalCents("planted"));
const fixedTotal = formatMoney(displayedTotalCents("fixed"));
const fixedModeQuery = `?${PLAYGROUND_MODE_PARAM}=${PLAYGROUND_FIXED_MODE}`;
const lineCountWord: Record<Locale, string> = {
  en: (["zero", "one", "two"] as const)[CART_LINES.length] ?? String(CART_LINES.length),
  "pt-BR": (["zero", "um", "dois"] as const)[CART_LINES.length] ?? String(CART_LINES.length),
};

export const PLAYGROUND_BUGS: readonly PlaygroundBug[] = [
  {
    id: "validation",
    severity: "major",
    title: { en: "Email validation", "pt-BR": "Validação de e-mail" },
    steps: {
      en: [
        "Enter any name.",
        `Enter ${VALIDATION_SAMPLE} in the email field.`,
        "Submit the checkout.",
      ],
      "pt-BR": [
        "Informe qualquer nome.",
        `Digite ${VALIDATION_SAMPLE} no campo de e-mail.`,
        "Envie o checkout.",
      ],
    },
    expected: {
      en: `${VALIDATION_SAMPLE} is rejected. The session order count stays at 0.`,
      "pt-BR": `${VALIDATION_SAMPLE} é recusado. A contagem de pedidos da sessão continua em 0.`,
    },
    actual: {
      en: `${VALIDATION_SAMPLE} is accepted. The planted check only looks for an "@" character, and an order is placed.`,
      "pt-BR": `${VALIDATION_SAMPLE} é aceito. A checagem plantada só procura um caractere "@", e um pedido é feito.`,
    },
  },
  {
    id: "rounding",
    severity: "major",
    title: { en: "Cart rounding", "pt-BR": "Arredondamento do carrinho" },
    steps: {
      en: [
        `Read the ${lineCountWord.en} line prices and the cart total.`,
        `Open the same page with ${fixedModeQuery} and compare the figures.`,
      ],
      "pt-BR": [
        `Leia os ${lineCountWord["pt-BR"]} preços e o total do carrinho.`,
        `Abra a mesma página com ${fixedModeQuery} e compare os valores.`,
      ],
    },
    expected: {
      en: `Prices are integer cents. Lines ${fixedLinePrices[0]} and ${fixedLinePrices[1]} total ${fixedTotal}.`,
      "pt-BR": `Os preços são centavos inteiros. As linhas ${fixedLinePrices[0]} e ${fixedLinePrices[1]} somam ${fixedTotal}.`,
    },
    actual: {
      en: `Each line uses Math.floor((cents / 100) * 100), and the total adds those results. Lines show ${plantedLinePrices[0]} and ${plantedLinePrices[1]}, total ${plantedTotal}.`,
      "pt-BR": `Cada linha usa Math.floor((cents / 100) * 100), e o total soma esses resultados. As linhas mostram ${plantedLinePrices[0]} e ${plantedLinePrices[1]}, total ${plantedTotal}.`,
    },
  },
  {
    id: "a11y-label",
    severity: "major",
    title: { en: "Email accessible name", "pt-BR": "Nome acessível do e-mail" },
    steps: {
      en: [
        "Find the email field. A visible email label sits above it.",
        "Inspect the field's accessible name (accessibility tree, or the input's labels).",
      ],
      "pt-BR": [
        "Ache o campo de e-mail. Um rótulo visível fica acima dele.",
        "Inspecione o nome acessível do campo (árvore de acessibilidade, ou labels do input).",
      ],
    },
    expected: {
      en: "The accessible name is the visible email label, from a label element tied to the input.",
      "pt-BR": "O nome acessível é o rótulo visível de e-mail, vindo de um elemento label ligado ao input.",
    },
    actual: {
      en: "The visible text is a span with no htmlFor. The input has no accessible name.",
      "pt-BR": "O texto visível é um span sem htmlFor. O input não tem nome acessível.",
    },
  },
  {
    id: "double-submit",
    severity: "critical",
    title: { en: "Double submit", "pt-BR": "Envio duplicado" },
    steps: {
      en: [
        "Enter a name.",
        `Enter ${VALID_EMAIL_SAMPLE} in the email field.`,
        "Submit once, then submit again.",
      ],
      "pt-BR": [
        "Informe um nome.",
        `Digite ${VALID_EMAIL_SAMPLE} no campo de e-mail.`,
        "Envie uma vez e envie de novo.",
      ],
    },
    expected: {
      en: "One order. After the first accepted submit the button is disabled, and a second submit is ignored.",
      "pt-BR": "Um pedido. Depois do primeiro envio aceito o botão fica desabilitado, e um segundo envio é ignorado.",
    },
    actual: {
      en: "Each submit places another order. The button stays enabled and the session count increases.",
      "pt-BR": "Cada envio faz outro pedido. O botão continua habilitado e a contagem da sessão aumenta.",
    },
  },
  {
    id: "i18n-string",
    severity: "minor",
    title: { en: "Missing i18n string", "pt-BR": "String de i18n ausente" },
    steps: {
      en: [
        "Read the submit button in English.",
        "Switch the language to pt-BR and read the button again.",
      ],
      "pt-BR": [
        "Leia o botão de envio em inglês.",
        "Troque o idioma para pt-BR e leia o botão de novo.",
      ],
    },
    expected: {
      en: `The button is a sentence in the active language, from the key ${SUBMIT_LABEL_KEY}.`,
      "pt-BR": `O botão é uma frase no idioma ativo, vinda da chave ${SUBMIT_LABEL_KEY}.`,
    },
    actual: {
      en: `The button shows the missing key ${SUBMIT_LABEL_MISSING_KEY} in both languages.`,
      "pt-BR": `O botão mostra a chave ausente ${SUBMIT_LABEL_MISSING_KEY} nos dois idiomas.`,
    },
  },
  {
    id: "keyboard-trap",
    severity: "critical",
    title: { en: "Keyboard trap", "pt-BR": "Armadilha de teclado" },
    steps: {
      en: [
        "Activate Order note.",
        "Press Tab, then Shift+Tab.",
        "Press Escape.",
        "Try to reach Close, or the rest of the page, with the keyboard only.",
      ],
      "pt-BR": [
        "Ative Nota do pedido.",
        "Pressione Tab e depois Shift+Tab.",
        "Pressione Escape.",
        "Tente chegar em Fechar, ou no resto da página, só com o teclado.",
      ],
    },
    expected: {
      en: "Escape closes the note and returns focus to Order note. Close is a button. Tab moves between the note and Close.",
      "pt-BR": "Escape fecha a nota e devolve o foco para Nota do pedido. Fechar é um botão. Tab alterna entre a nota e Fechar.",
    },
    actual: {
      en: "Tab and Shift+Tab stay on the note field. Escape does nothing. The Close text is not a focusable control, and the backdrop click does not dismiss it.",
      "pt-BR": "Tab e Shift+Tab ficam no campo da nota. Escape não faz nada. O texto Fechar não é um controle focável, e o clique no fundo não fecha.",
    },
  },
];

export type BugObservation =
  | { id: "validation"; sample: typeof VALIDATION_SAMPLE; accepted: boolean }
  | { id: "rounding"; lines: string[]; total: string }
  | { id: "a11y-label"; associated: boolean }
  | { id: "double-submit"; blocksRepeat: boolean }
  | { id: "i18n-string"; key: string }
  | { id: "keyboard-trap"; trapped: boolean };

export function observeBug(id: BugId, mode: PlaygroundMode): BugObservation {
  switch (id) {
    case "validation":
      return { id, sample: VALIDATION_SAMPLE, accepted: isEmailAccepted(VALIDATION_SAMPLE, mode) };
    case "rounding":
      return {
        id,
        lines: CART_LINES.map((line) => formatMoney(displayedLineCents(line.cents, mode))),
        total: formatMoney(displayedTotalCents(mode)),
      };
    case "a11y-label":
      return { id, associated: emailLabelAssociated(mode) };
    case "double-submit":
      return { id, blocksRepeat: shouldIgnoreExtraSubmit(1, mode) };
    case "i18n-string":
      return { id, key: submitLabelKey(mode) };
    case "keyboard-trap":
      return { id, trapped: keyboardTrapActive(mode) };
  }
}

function assertPlaygroundFixture(): void {
  const ids = PLAYGROUND_BUGS.map((bug) => bug.id);
  if (ids.join("|") !== BUG_IDS.join("|")) {
    throw new Error("PLAYGROUND_BUGS must list BUG_IDS in the same order.");
  }
  if (displayedTotalCents("planted") === displayedTotalCents("fixed")) {
    throw new Error("Rounding fixture no longer drifts. Keep cent prices that floor() drops.");
  }
  if (!isEmailAccepted(VALIDATION_SAMPLE, "planted") || isEmailAccepted(VALIDATION_SAMPLE, "fixed")) {
    throw new Error("Validation fixture must accept the sample only in planted mode.");
  }
  if (!isEmailAccepted(VALID_EMAIL_SAMPLE, "fixed") || !isEmailAccepted(VALID_EMAIL_SAMPLE, "planted")) {
    throw new Error("Both modes must accept the valid email sample.");
  }
  if (isEmailAccepted("not-an-email", "planted")) {
    throw new Error("Planted validation must still reject a value with no @.");
  }
  if (submitLabelKey("planted") !== SUBMIT_LABEL_MISSING_KEY || submitLabelKey("fixed") !== SUBMIT_LABEL_KEY) {
    throw new Error("i18n fixture must use the missing key only in planted mode.");
  }
  if (emailLabelAssociated("planted") || !emailLabelAssociated("fixed")) {
    throw new Error("Email label must be associated only in fixed mode.");
  }
  if (shouldIgnoreExtraSubmit(1, "planted") || !shouldIgnoreExtraSubmit(1, "fixed")) {
    throw new Error("Repeat submits must be blocked only in fixed mode.");
  }
  if (!keyboardTrapActive("planted") || keyboardTrapActive("fixed") || noteDismissIsButton("planted")) {
    throw new Error("Keyboard trap must be active only in planted mode.");
  }
  if (!noteDismissIsButton("fixed")) {
    throw new Error("Fixed mode must render a real close button.");
  }
}

assertPlaygroundFixture();
