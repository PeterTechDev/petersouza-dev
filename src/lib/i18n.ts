import { PLAYGROUND_FIXED_MODE, PLAYGROUND_MODE_PARAM } from "@/lib/playground-mode";

const fixedModeQuery = `?${PLAYGROUND_MODE_PARAM}=${PLAYGROUND_FIXED_MODE}`;

export type Locale = "en" | "pt-BR";

export const LOCALES: readonly Locale[] = ["en", "pt-BR"] as const;
export const DEFAULT_LOCALE: Locale = "en";

type Messages = Record<string, unknown>;

function getByPath(obj: Messages, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replaceAll(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    return v === undefined ? `{${k}}` : String(v);
  });
}

export const messages: Record<Locale, Messages> = {
  en: {
    hero: {
      availability: "Open to remote QA/SDET roles",
      role: "QA Automation & AI Testing Engineer",
      credentials: "Playwright/TypeScript · LLM system testing · remote from Brazil (UTC-3)",
      cta: "View My Work",
      downloadCv: "Download CV",
      writing: "Writing",
      playground: "Playground",
    },
    about: {
      kicker: "Who I Am",
      title: "About",
      careerTimeline: "Career Timeline",
      outsideCode: "Outside the Code",
      p1: {
        beforeEm: "I'm a software engineer from Brazil who believes technology should solve real problems for real people. I dropped out of law school because I wanted to ",
        em: "build things",
        afterEm: ", not just argue about them.",
      },
      p2: {
        beforeQuote:
          "I'm the solo QA engineer at NDG Communications (USA). I own the quality practice end to end: test planning, manual testing, and an automation suite I built from scratch with Playwright and TypeScript, plus the reports and documentation that go with it. The question I keep asking is ",
        quote: "\"Can the team trust this release?\"",
      },
      p3:
        "When I'm not coding, I'm playing basketball, running D&D campaigns, or chasing my daughter around the house. I'm a firm believer that the best engineers are the ones who never stop being curious.",
      p4:
        "I left law school to work in software. The role I want next is remote QA or SDET: planning, hands-on testing, and automation a team can trust.",
      stats: {
        qaYearsLabel: "Years in QA",
        automatedTestsLabel: "Automated tests",
        ciRunTimeLabel: "CI run time",
        ciRunTimeValue: "{minutes} min",
        regressionSavedLabel: "Regression time saved",
        regressionSavedValue: "{hours} hrs",
      },
      timeline: [
        { year: "2021", event: "Left law school and shipped the first production commit." },
        { year: "2022", event: "Started a first engineering role and learned the team's code review practice." },
        { year: "2023", event: "Moved into SDET work." },
        { year: "2025", event: "Solo QA engineer at NDG Communications (remote, United States)." },
        { year: "2026", event: "Owning test planning, manual testing, Playwright automation, reports, and documentation." },
      ],
      interests: [
        "Basketball (LeBron stan, Celtics fan — yes, both)",
        "D&D Game Master (4-year campaign, Átrias world)",
        "AI systems & autonomous agents",
        "Continuous learning — always mid-book",
      ],
    },
    skills: {
      kicker: "What I Work With",
      title: "Skills & Tech",
      categories: {
        qualityEngineering: "Quality Engineering",
        aiAutomation: "AI & Automation",
        frontend: "Frontend",
        backendCloud: "Backend & Cloud",
      },
    },
    contact: {
      kicker: "Contact",
      title: "Hiring?",
      subtitle: "Email me about remote QA and SDET roles.",
      cta: "Email me",
      footer: "© {year} Peter Souza. Built with Next.js, Three.js & a lot of coffee.",
      toggleShort: "EN",
    },
    aiAgents: {
      kicker: "How I Work",
      title: "AI Infrastructure",
      subtitle: "Alongside QA work I keep a personal multi-agent setup. The write-up covers how research, coding, and review are split across agents.",
      blogLink: "Read the write-up",
      showDetails: "Show Details",
      hideDetails: "Hide Details",
      architectureLabel: "System Architecture",
      bottomNote: "The system runs on Anthropic Claude with a custom orchestration layer. No vendor lock-in on the AI layer — just clean interfaces.",
      capabilities: {
        persistentMemory: {
          title: "Persistent Memory",
          description: "Structured file-based memory that survives session boundaries. Context about projects, decisions, and patterns persists across restarts — no re-explaining required.",
        },
        multiAgent: {
          title: "Multi-Agent Orchestration",
          description: "Complex tasks spawn specialized sub-agents: one researches, one codes, one reviews. The main agent coordinates, delegates, and synthesizes results.",
        },
        toolIntegration: {
          title: "Tool Integration",
          description: "Web search, code execution, file system access, messaging, and external APIs. Agents pick the right tool for each step rather than guessing from memory.",
        },
        autonomousCoding: {
          title: "Autonomous Coding",
          description: "Coding tasks run in isolated sessions with full codebase access. Agents explore, modify, test, and iterate — delivering working code, not just suggestions.",
        },
        crossChannel: {
          title: "Cross-Channel Awareness",
          description: "Integrated with Telegram for real-time communication. Agents surface updates, ask clarifying questions, and deliver results directly in-chat.",
        },
        progressiveDelegation: {
          title: "Progressive Delegation",
          description: "From answering a quick question to managing a full sprint independently. The system scales from single-turn to multi-day autonomous workflows.",
        },
      },
    },
    playground: {
      kicker: "Test fixture",
      title: "Bug-bash playground",
      subtitle:
        `Synthetic checkout for practice. The bugs on this page are planted on purpose. Do not fix the default mode. Use ${fixedModeQuery} to run the corrected checkout.`,
      warning:
        "Test playground. Defects in the default mode are intentional. The reveal panel and the form both read src/lib/playground-bugs.ts.",
      focusTrapWarning:
        `The order note traps keyboard focus on purpose. Reload the page, or open ${fixedModeQuery}, to leave it.`,
      back: "Back to portfolio",
      synthetic: "Synthetic USD fixture. These prices are not a store.",
      modeLabel: "Mode",
      modePlanted: "Planted bugs",
      modeFixed: "Fixed",
      modePlantedHint: "Default. Defects on this page are intentional.",
      modeFixedHint: `Query ${fixedModeQuery}. Every planted bug is off.`,
      cartTitle: "Cart",
      total: "Total",
      formTitle: "Checkout",
      name: "Name",
      email: "Email",
      nameError: "Enter a name.",
      placed: "Order placed. Count in this session: {count}.",
      reveal: "Reveal bugs",
      hide: "Hide bugs",
      reportsTitle: "Bug reports",
      newOrder: "New order",
      revealHint: "Mini bug reports for the planted defects. The checkout reads the same list.",
      steps: "Steps",
      expected: "Expected",
      actual: "Actual",
      severity: "Severity",
      severityCritical: "Critical",
      severityMajor: "Major",
      severityMinor: "Minor",
      active: "Active in this mode",
      inactive: "Off in this mode",
      observed: "Observed in this mode",
      noteOpen: "Order note",
      noteTitle: "Order note",
      noteLabel: "Note",
      noteDismiss: "Close",
      checkout: {
        submit: "Place order",
        emailErrorPlanted: "Enter a value that contains @.",
        emailError: "Enter an email with a name, a domain, and a dot.",
      },
      cart: {
        mug: "Synthetic mug",
        sticker: "Synthetic sticker",
      },
      observe: {
        emailAccepted: "Sample {sample} is accepted.",
        emailRejected: "Sample {sample} is rejected.",
        total: "Lines {lines}. Total {total}.",
        labelYes: "The email field is tied to its label.",
        labelNo: "The email field has no accessible name.",
        repeatBlocked: "A second submit is ignored.",
        repeatAllowed: "A second submit is accepted.",
        key: "Label key {key}. Resolved text: {resolved}.",
        trapped: "The note dialog traps keyboard focus.",
        notTrapped: "Escape closes the note dialog.",
      },
    },
    ui: {
      language: {
        enShort: "EN",
        ptShort: "PT",
        ariaLabel: "Switch language",
      },
    },
  },
  "pt-BR": {
    hero: {
      availability: "Aberto a vagas remotas de QA/SDET",
      role: "QA Automation & AI Testing Engineer",
      credentials: "Playwright/TypeScript · testes de sistemas LLM · remoto desde o Brasil (UTC-3)",
      cta: "Ver meu trabalho",
      downloadCv: "Baixar CV",
      writing: "Textos",
      playground: "Playground",
    },
    about: {
      kicker: "Quem sou",
      title: "Sobre",
      careerTimeline: "Trajetória",
      outsideCode: "Fora do Código",
      p1: {
        beforeEm:
          "Sou um engenheiro de software do Brasil e acredito que tecnologia deve resolver problemas reais para pessoas reais. Saí da faculdade de Direito porque eu queria ",
        em: "construir coisas",
        afterEm: ", não apenas discutir sobre elas.",
      },
      p2: {
        beforeQuote:
          "Sou o engenheiro de QA solo na NDG Communications (EUA). Eu cuido da qualidade de ponta a ponta: planejamento de testes, teste manual e uma suíte de automação que construí do zero com Playwright e TypeScript, além dos relatórios e da documentação. A pergunta que eu mantenho é ",
        quote: "\"O time pode confiar neste release?\"",
      },
      p3:
        "Quando não estou codando, estou jogando basquete, mestrando campanhas de D&D ou correndo atrás da minha filha pela casa. Acredito de verdade que os melhores engenheiros são os que nunca param de ser curiosos.",
      p4:
        "Saí da faculdade de Direito para trabalhar com software. A vaga que eu busco é QA ou SDET remoto: planejamento, teste na mão e automação em que o time confia.",
      stats: {
        qaYearsLabel: "Anos em QA",
        automatedTestsLabel: "Testes automatizados",
        ciRunTimeLabel: "Tempo de CI",
        ciRunTimeValue: "{minutes} min",
        regressionSavedLabel: "Tempo de regressão economizado",
        regressionSavedValue: "{hours} h",
      },
      timeline: [
        { year: "2021", event: "Saí da faculdade de Direito e fiz o primeiro commit de produção." },
        { year: "2022", event: "Comecei no primeiro cargo de engenharia e adotei a prática de code review do time." },
        { year: "2023", event: "Passei a atuar como SDET." },
        { year: "2025", event: "Engenheiro de QA solo na NDG Communications (remoto, Estados Unidos)." },
        { year: "2026", event: "Responsável por planejamento de testes, teste manual, automação com Playwright, relatórios e documentação." },
      ],
      interests: [
        "Basquete (fã do LeBron e dos Celtics — sim, os dois)",
        "Mestre de D&D (campanha de 4 anos, mundo Átrias)",
        "Sistemas de IA e agentes autônomos",
        "Aprendizado contínuo — sempre lendo algum livro",
      ],
    },
    skills: {
      kicker: "Com o que trabalho",
      title: "Habilidades & Tecnologias",
      categories: {
        qualityEngineering: "Engenharia de Qualidade",
        aiAutomation: "IA & Automação",
        frontend: "Frontend",
        backendCloud: "Backend & Cloud",
      },
    },
    contact: {
      kicker: "Contato",
      title: "Contratando?",
      subtitle: "Escreva para mim sobre vagas remotas de QA e SDET.",
      cta: "Enviar e-mail",
      footer: "© {year} Peter Souza. Feito com Next.js, Three.js e muito café.",
      toggleShort: "PT",
    },
    aiAgents: {
      kicker: "Como Trabalho",
      title: "Infraestrutura de IA",
      subtitle: "Além do trabalho de QA, mantenho um sistema pessoal de agentes. O texto explica como pesquisa, código e revisão se dividem entre eles.",
      blogLink: "Ler o texto",
      showDetails: "Ver Detalhes",
      hideDetails: "Esconder Detalhes",
      architectureLabel: "Arquitetura do Sistema",
      bottomNote: "O sistema roda no Anthropic Claude com uma camada de orquestração personalizada. Sem vendor lock-in na camada de IA — apenas interfaces limpas.",
      capabilities: {
        persistentMemory: {
          title: "Memória Persistente",
          description: "Memória estruturada baseada em arquivos que sobrevive entre sessões. Contexto sobre projetos, decisões e padrões persiste entre reinicializações — sem necessidade de re-explicar.",
        },
        multiAgent: {
          title: "Orquestração Multi-Agente",
          description: "Tarefas complexas geram sub-agentes especializados: um pesquisa, um codifica, um revisa. O agente principal coordena, delega e sintetiza resultados.",
        },
        toolIntegration: {
          title: "Integração de Ferramentas",
          description: "Busca na web, execução de código, acesso ao sistema de arquivos, mensagens e APIs externas. Agentes escolhem a ferramenta certa para cada etapa.",
        },
        autonomousCoding: {
          title: "Codificação Autônoma",
          description: "Tarefas de codificação rodam em sessões isoladas com acesso total ao codebase. Agentes exploram, modificam, testam e iteram — entregando código funcional, não apenas sugestões.",
        },
        crossChannel: {
          title: "Consciência Multi-Canal",
          description: "Integrado com Telegram para comunicação em tempo real. Agentes enviam atualizações, fazem perguntas e entregam resultados diretamente no chat.",
        },
        progressiveDelegation: {
          title: "Delegação Progressiva",
          description: "De responder uma pergunta rápida a gerenciar uma sprint inteira de forma independente. O sistema escala de single-turn a workflows autônomos de vários dias.",
        },
      },
    },
    playground: {
      kicker: "Fixture de teste",
      title: "Playground de bug-bash",
      subtitle:
        `Checkout sintético para praticar. Os bugs desta página foram plantados de propósito. Não corrija o modo padrão. Use ${fixedModeQuery} para rodar o checkout corrigido.`,
      warning:
        "Playground de teste. Os defeitos do modo padrão são intencionais. O painel de revelar bugs e o formulário leem src/lib/playground-bugs.ts.",
      focusTrapWarning:
        `A nota do pedido prende o foco do teclado de propósito. Recarregue a página, ou abra ${fixedModeQuery}, para sair.`,
      back: "Voltar ao portfólio",
      synthetic: "Fixture sintético em USD. Estes preços não são uma loja.",
      modeLabel: "Modo",
      modePlanted: "Bugs plantados",
      modeFixed: "Corrigido",
      modePlantedHint: "Padrão. Os defeitos desta página são intencionais.",
      modeFixedHint: `Query ${fixedModeQuery}. Todos os bugs plantados estão desligados.`,
      cartTitle: "Carrinho",
      total: "Total",
      formTitle: "Checkout",
      name: "Nome",
      email: "E-mail",
      nameError: "Informe um nome.",
      placed: "Pedido feito. Contagem nesta sessão: {count}.",
      reveal: "Revelar bugs",
      hide: "Esconder bugs",
      reportsTitle: "Relatos de bugs",
      newOrder: "Novo pedido",
      revealHint: "Mini bug reports dos defeitos plantados. O checkout lê a mesma lista.",
      steps: "Passos",
      expected: "Esperado",
      actual: "Obtido",
      severity: "Severidade",
      severityCritical: "Crítica",
      severityMajor: "Alta",
      severityMinor: "Baixa",
      active: "Ativo neste modo",
      inactive: "Desligado neste modo",
      observed: "Observado neste modo",
      noteOpen: "Nota do pedido",
      noteTitle: "Nota do pedido",
      noteLabel: "Nota",
      noteDismiss: "Fechar",
      checkout: {
        submit: "Fazer pedido",
        emailErrorPlanted: "Informe um valor que contenha @.",
        emailError: "Informe um e-mail com nome, domínio e um ponto.",
      },
      cart: {
        mug: "Caneca sintética",
        sticker: "Adesivo sintético",
      },
      observe: {
        emailAccepted: "A amostra {sample} é aceita.",
        emailRejected: "A amostra {sample} é recusada.",
        total: "Linhas {lines}. Total {total}.",
        labelYes: "O campo de e-mail está ligado ao rótulo.",
        labelNo: "O campo de e-mail não tem nome acessível.",
        repeatBlocked: "Um segundo envio é ignorado.",
        repeatAllowed: "Um segundo envio é aceito.",
        key: "Chave do rótulo {key}. Texto resolvido: {resolved}.",
        trapped: "O diálogo da nota prende o foco do teclado.",
        notTrapped: "Escape fecha o diálogo da nota.",
      },
    },
    ui: {
      language: {
        enShort: "EN",
        ptShort: "PT",
        ariaLabel: "Trocar idioma",
      },
    },
  },
};

export function createTranslator(locale: Locale) {
  function translate<T = string>(key: string, vars?: Record<string, string | number>): T {
    const primary = getByPath(messages[locale], key);
    const fallback = getByPath(messages[DEFAULT_LOCALE], key);
    const value = primary ?? fallback;

    if (typeof value === "string") return format(value, vars) as T;
    if (value === undefined) return key as T;
    return value as T;
  }

  return { t: translate };
}

