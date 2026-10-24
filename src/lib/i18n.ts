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
      quality: "Quality",
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
    quality: {
      kicker: "Quality",
      title: "Pipeline",
      subtitle: "Latest GitHub Actions runs for quality.yml. A missing value is shown as —.",
      back: "Back to portfolio",
      unavailableTitle: "Data unavailable",
      notYetRun: "Not yet run",
      source: "Workflow file: .github/workflows/quality.yml. This page refreshes every 6 hours.",
      openRun: "Open run",
      openRunLabel: "Open run {sha} ({date})",
      missing: "—",
      unknown: "Unknown",
      fields: {
        status: "Status",
        conclusion: "Conclusion",
        date: "Date",
        commit: "Commit",
        duration: "Duration",
        link: "Run",
      },
      status: {
        completed: "Completed",
        in_progress: "In progress",
        queued: "Queued",
        waiting: "Waiting",
        requested: "Requested",
        pending: "Pending",
      },
      conclusion: {
        success: "Success",
        failure: "Failure",
        cancelled: "Cancelled",
        skipped: "Skipped",
        timed_out: "Timed out",
        neutral: "Neutral",
        action_required: "Action required",
        startup_failure: "Startup failure",
        stale: "Stale",
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
      quality: "Qualidade",
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
    quality: {
      kicker: "Qualidade",
      title: "Pipeline",
      subtitle: "Últimas execuções do GitHub Actions para quality.yml. Um valor ausente aparece como —.",
      back: "Voltar ao portfólio",
      unavailableTitle: "Dados indisponíveis",
      notYetRun: "Ainda não executado",
      source: "Arquivo do workflow: .github/workflows/quality.yml. Esta página atualiza a cada 6 horas.",
      openRun: "Abrir execução",
      openRunLabel: "Abrir execução {sha} ({date})",
      missing: "—",
      unknown: "Desconhecido",
      fields: {
        status: "Status",
        conclusion: "Conclusão",
        date: "Data",
        commit: "Commit",
        duration: "Duração",
        link: "Execução",
      },
      status: {
        completed: "Concluído",
        in_progress: "Em andamento",
        queued: "Na fila",
        waiting: "Aguardando",
        requested: "Solicitado",
        pending: "Pendente",
      },
      conclusion: {
        success: "Sucesso",
        failure: "Falha",
        cancelled: "Cancelado",
        skipped: "Ignorado",
        timed_out: "Tempo esgotado",
        neutral: "Neutro",
        action_required: "Ação necessária",
        startup_failure: "Falha na inicialização",
        stale: "Obsoleto",
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

