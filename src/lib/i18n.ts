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
      roles: ["Software Engineer", "AI Builder", "Problem Solver", "Full-Stack Developer"],
      tagline: {
        line1: "Building products that solve real problems.",
        line2Prefix: "From ",
        country: "Brazil",
        line2Suffix: " to the world.",
      },
    },
    about: {
      kicker: "Who I Am",
      title: "About",
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
    },
    projects: {
      kicker: "What I'm Building",
      title: "Projects",
      status: {
        live: "Live",
        comingSoon: "Coming Soon",
        inProgress: "In Progress",
      },
      items: {
        autovendas: {
          title: "AutoVendas",
          description:
            "AI-powered CRM for Brazilian car dealerships. Multi-agent WhatsApp assistant that qualifies leads, answers inventory questions, and closes deals 24/7.",
        },
        videoAutomation: {
          title: "Video Automation Platform",
          description:
            "Programmatic video generation for social media. Automated templates, batch rendering, multi-language support.",
        },
        atriasWiki: {
          title: "Átrias Wiki",
          description:
            "Interactive D&D world encyclopedia. 176 entities, 7 continents, AI narrator. A love letter to collaborative storytelling.",
        },
        nbaLiveFeed: {
          title: "NBA Live Feed",
          description:
            "Real-time NBA scores, standings, player comparisons, and social feed powered by Reddit integration.",
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
      roles: ["Engenheiro de Software", "Construtor de IA", "Resolvedor de Problemas", "Full-Stack Developer"],
      tagline: {
        line1: "Criando produtos que resolvem problemas reais.",
        line2Prefix: "Do ",
        country: "Brasil",
        line2Suffix: " para o mundo.",
      },
    },
    about: {
      kicker: "Quem sou",
      title: "Sobre",
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
    },
    projects: {
      kicker: "O que estou construindo",
      title: "Projetos",
      status: {
        live: "No ar",
        comingSoon: "Em breve",
        inProgress: "Em andamento",
      },
      items: {
        autovendas: {
          title: "AutoVendas",
          description:
            "CRM com IA para concessionárias no Brasil. Assistente multiagente no WhatsApp que qualifica leads, responde dúvidas de estoque e fecha negócios 24/7.",
        },
        videoAutomation: {
          title: "Plataforma de Automação de Vídeo",
          description:
            "Geração programática de vídeos para redes sociais. Templates automatizados, renderização em lote e suporte a múltiplos idiomas.",
        },
        atriasWiki: {
          title: "Átrias Wiki",
          description:
            "Enciclopédia interativa de um mundo de D&D. 176 entidades, 7 continentes, narrador com IA. Uma carta de amor à narrativa colaborativa.",
        },
        nbaLiveFeed: {
          title: "NBA Live Feed",
          description:
            "Placar e estatísticas da NBA em tempo real, classificação, comparativos de jogadores e feed social com integração ao Reddit.",
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

