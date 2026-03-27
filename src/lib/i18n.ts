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
      greeting: "Hello, world",
      roles: ["AI Systems Builder", "SDET & Quality Engineer", "Full-Stack Developer", "Automation Specialist"],
      cta: "View My Work",
      tagline: {
        line1: "From law school dropout to AI engineer.",
      },
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
          "Today I split my time between quality engineering at an international company and building AI-first products — from multi-agent WhatsApp assistants to automated video platforms. Every product I ship starts with one question: ",
        quote: "\"Does this make someone's life easier?\"",
      },
      p3:
        "When I'm not coding, I'm playing basketball, running D&D campaigns, or chasing my daughter around the house. I'm a firm believer that the best engineers are the ones who never stop being curious.",
      p4:
        "I left law school with one conviction: the world doesn't need more arguments, it needs more people who build things. Four years in tech later, I haven't changed my mind.",
      stats: {
        yearsLabel: "Years in Tech",
        yearsValue: "4+",
        aiLabel: "AI Projects",
        aiValue: "6+",
        locationLabel: "Location",
        locationValue: "Brazil",
        drivenLabel: "Driven By",
        drivenValue: "Family",
      },
      timeline: [
        { year: "2021", event: "Left law school. First real commit pushed." },
        { year: "2022", event: "First engineering job. Code review humbled me fast." },
        { year: "2023", event: "Became SDET. Shipped 6+ products including AutoVendas." },
        { year: "2025", event: "Full-time at NDG Communications (remote, USA)." },
        { year: "2026", event: "Building AI-first products. Expanding globally." },
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
    projects: {
      kicker: "What I'm Building",
      title: "Projects",
      blogLink: "Read the blog",
      caseStudyLink: "View case study",
      expandDetails: "Click to see details",
      collapseDetails: "Collapse",
      visitProject: "Visit project",
      caseStudy: {
        problem: "Problem",
        solution: "Solution",
        keyFeatures: "Key Features",
        results: "Results / Status",
      },
      status: {
        live: "Live",
        comingSoon: "Coming Soon",
        inProgress: "In Progress",
        beta: "Beta",
      },
      items: {
        autovendas: {
          title: "AutoVendas",
          description:
            "AI-powered CRM for Brazilian car dealerships. Multi-agent WhatsApp assistant that qualifies leads, answers inventory questions, and closes deals 24/7.",
          problem:
            "Brazilian used car dealerships lose leads because they can't respond to WhatsApp messages fast enough.",
          solution:
            "AI-powered WhatsApp assistant that qualifies leads, answers inventory questions, and routes hot leads to salespeople — all without human intervention.",
          features: [
            "Multi-tenant CRM with per-dealership configuration",
            "AI lead qualification and intent scoring",
            "Real-time inventory sync via WhatsApp",
            "Escalation workflows to human agents",
          ],
          statusText: "Live with paying client · B2B SaaS model",
        },
        vover: {
          title: "Vover",
          description:
            "Netflix-style social platform for movie and TV tracking with friends. Rate, discover, and share what you're watching.",
          problem:
            "There's no good social movie/TV tracking app built for friend groups — just isolated lists with no social layer.",
          solution:
            "A Netflix-style social platform where friends track, rate, and discover shows together. Built with a rich activity feed and smart recommendations based on friend preferences.",
          features: [
            "Social watchlist — see what friends are watching",
            "Friend activity feed with ratings and reviews",
            "Personalized recommendations based on social graph",
            "Invite system with private group rooms",
          ],
          statusText: "In development · Invite-only beta",
        },
        mindPalace: {
          title: "Mind Palace",
          description:
            "Visual knowledge base and AI agent dashboard. Reads markdown brain docs, visualizes connections, and surfaces insights from your personal knowledge graph.",
          problem:
            "Knowledge gets scattered across markdown files, notes, and docs with no unified view or way to navigate the graph.",
          solution:
            "A visual knowledge base + AI agent dashboard that reads markdown brain docs directly from the file system, providing structured browsing, graph visualization, and daily journaling.",
          features: [
            "Brain doc viewer with full markdown rendering",
            "AI agent monitoring and output display",
            "Daily entry interface for continuous capture",
            "Graph visualization of linked concepts",
          ],
          statusText: "Live · Personal daily use",
        },
        openclawAgents: {
          title: "OpenClaw Multi-Agent System",
          description:
            "8 specialized AI agents orchestrated through OpenClaw — each with its own personality, memory, and skill set — running research, coding, QA, and content in parallel.",
          problem:
            "A solo developer can't do research, build features, run QA, and produce content simultaneously without dropping something.",
          solution:
            "8 specialized AI agents orchestrated through OpenClaw — each with its own personality, memory, and skill set — handling parallel workstreams while the developer stays in control.",
          features: [
            "Parallel agent spawning for simultaneous workstreams",
            "Skill enforcement protocol preventing hallucinated implementations",
            "Self-improving memory via GROWTH.md and mission logs",
            "Content intelligence pipeline powering all other projects",
          ],
          statusText: "Live · Daily use · Powers all other projects",
        },
      },
    },
    contact: {
      kicker: "Let's Connect",
      title: "Got an idea?",
      subtitle:
        "I'm always open to interesting conversations, collaborations, and opportunities. Let's build something great together.",
      cta: "Say Hello",
      footer: "© {year} Peter Souza. Built with Next.js, Three.js & a lot of coffee.",
      toggleShort: "EN",
    },
    aiAgents: {
      kicker: "How I Work",
      title: "AI Infrastructure",
      subtitle: "I've built a personal AI system that runs alongside my development workflow — not a tool I use occasionally, but infrastructure I operate daily. Here's how it works.",
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
      greeting: "Olá, mundo",
      roles: ["Construtor de Sistemas IA", "SDET & Engenheiro de Qualidade", "Full-Stack Developer", "Especialista em Automação"],
      cta: "Ver Meu Trabalho",
      tagline: {
        line1: "De desistente de Direito a engenheiro de IA.",
      },
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
          "Hoje eu divido meu tempo entre engenharia de qualidade em uma empresa internacional e a construção de produtos AI-first — de assistentes multiagentes no WhatsApp a plataformas de vídeo automatizadas. Todo produto que eu lanço começa com uma pergunta: ",
        quote: "\"Isso deixa a vida de alguém mais fácil?\"",
      },
      p3:
        "Quando não estou codando, estou jogando basquete, mestrando campanhas de D&D ou correndo atrás da minha filha pela casa. Acredito de verdade que os melhores engenheiros são os que nunca param de ser curiosos.",
      p4:
        "Saí da faculdade de Direito com uma convicção: o mundo não precisa de mais argumentos, precisa de mais gente que constrói coisas. Quatro anos em tech depois, não mudei de ideia.",
      stats: {
        yearsLabel: "Anos em Tech",
        yearsValue: "4+",
        aiLabel: "Projetos de IA",
        aiValue: "6+",
        locationLabel: "Local",
        locationValue: "Brasil",
        drivenLabel: "Motivado por",
        drivenValue: "Família",
      },
      timeline: [
        { year: "2021", event: "Saí da faculdade de Direito. Primeiro commit real." },
        { year: "2022", event: "Primeiro emprego em engenharia. Code review me humilhou rápido." },
        { year: "2023", event: "Virei SDET. Lancei 6+ produtos incluindo o AutoVendas." },
        { year: "2025", event: "Full-time na NDG Communications (remoto, EUA)." },
        { year: "2026", event: "Construindo produtos AI-first. Expandindo globalmente." },
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
    projects: {
      kicker: "O que estou construindo",
      title: "Projetos",
      blogLink: "Leia o blog",
      caseStudyLink: "Ver case study",
      expandDetails: "Clique para ver detalhes",
      collapseDetails: "Recolher",
      visitProject: "Visitar projeto",
      caseStudy: {
        problem: "Problema",
        solution: "Solução",
        keyFeatures: "Funcionalidades",
        results: "Resultados / Status",
      },
      status: {
        live: "No ar",
        comingSoon: "Em breve",
        inProgress: "Em andamento",
        beta: "Beta",
      },
      items: {
        autovendas: {
          title: "AutoVendas",
          description:
            "CRM com IA para concessionárias no Brasil. Assistente multiagente no WhatsApp que qualifica leads, responde dúvidas de estoque e fecha negócios 24/7.",
          problem:
            "Concessionárias de carros usados no Brasil perdem leads porque não conseguem responder mensagens no WhatsApp rápido o suficiente.",
          solution:
            "Assistente de WhatsApp com IA que qualifica leads, responde dúvidas de estoque e direciona os contatos quentes para os vendedores — sem intervenção humana.",
          features: [
            "CRM multi-tenant com configuração por concessionária",
            "Qualificação de leads e pontuação de intenção com IA",
            "Sincronização de estoque em tempo real via WhatsApp",
            "Fluxos de escalonamento para agentes humanos",
          ],
          statusText: "No ar com cliente pagante · Modelo B2B SaaS",
        },
        vover: {
          title: "Vover",
          description:
            "Plataforma social estilo Netflix para rastrear filmes e séries com amigos. Avalie, descubra e compartilhe o que está assistindo.",
          problem:
            "Não existe um bom app social de rastreamento de filmes/séries feito para grupos de amigos — só listas isoladas sem camada social.",
          solution:
            "Plataforma social estilo Netflix onde amigos rastreiam, avaliam e descobrem séries juntos. Construída com feed de atividade rico e recomendações baseadas no grafo social.",
          features: [
            "Watchlist social — veja o que seus amigos estão assistindo",
            "Feed de atividade com avaliações e reviews",
            "Recomendações personalizadas baseadas no grafo social",
            "Sistema de convites com salas privadas de grupo",
          ],
          statusText: "Em desenvolvimento · Beta por convite",
        },
        mindPalace: {
          title: "Mind Palace",
          description:
            "Base de conhecimento visual e dashboard de agentes IA. Lê docs markdown do brain, visualiza conexões e exibe insights do grafo de conhecimento pessoal.",
          problem:
            "O conhecimento se fragmenta em arquivos markdown, notas e docs sem visão unificada ou forma de navegar o grafo.",
          solution:
            "Base de conhecimento visual + dashboard de agentes IA que lê docs markdown diretamente do sistema de arquivos, com navegação estruturada, visualização em grafo e journaling diário.",
          features: [
            "Visualizador de brain docs com renderização markdown completa",
            "Monitoramento de agentes IA e exibição de outputs",
            "Interface de entrada diária para captura contínua",
            "Visualização em grafo de conceitos linkados",
          ],
          statusText: "No ar · Uso pessoal diário",
        },
        openclawAgents: {
          title: "OpenClaw Multi-Agent System",
          description:
            "8 agentes IA especializados orquestrados via OpenClaw — cada um com personalidade, memória e skills próprias — rodando pesquisa, código, QA e conteúdo em paralelo.",
          problem:
            "Um desenvolvedor solo não consegue fazer pesquisa, construir features, rodar QA e produzir conteúdo simultaneamente sem deixar algo cair.",
          solution:
            "8 agentes IA especializados orquestrados via OpenClaw — cada um com personalidade, memória e skill set próprios — gerenciando workstreams paralelos enquanto o desenvolvedor mantém o controle.",
          features: [
            "Spawn de agentes em paralelo para workstreams simultâneos",
            "Protocolo de enforcement de skills prevenindo implementações alucinadas",
            "Memória auto-evolutiva via GROWTH.md e logs de missão",
            "Pipeline de inteligência de conteúdo alimentando todos os outros projetos",
          ],
          statusText: "No ar · Uso diário · Alimenta todos os outros projetos",
        },
      },
    },
    contact: {
      kicker: "Vamos conversar",
      title: "Tem uma ideia?",
      subtitle:
        "Estou sempre aberto a boas conversas, colaborações e oportunidades. Vamos construir algo incrível juntos.",
      cta: "Diga oi",
      footer: "© {year} Peter Souza. Feito com Next.js, Three.js e muito café.",
      toggleShort: "PT",
    },
    aiAgents: {
      kicker: "Como Trabalho",
      title: "Infraestrutura de IA",
      subtitle: "Construí um sistema de IA pessoal que roda junto com meu fluxo de desenvolvimento — não é uma ferramenta que uso de vez em quando, mas infraestrutura que opero diariamente. Veja como funciona.",
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

