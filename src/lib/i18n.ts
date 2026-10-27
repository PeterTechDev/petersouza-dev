import { fixedModeQuery } from "@/lib/playground-mode";

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
      role: "SDET · QA Automation & AI-assisted Testing",
      credentials: "Playwright + TypeScript · LLM evals · remote from Brazil (UTC-3)",
      cta: "View My Work",
      downloadCv: "Download CV",
      writing: "Writing",
      quality: "Quality",
      aiTesting: "AI testing",
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
        automatedTestsLabel: "Automated tests (Playwright + TS)",
        criticalPathLabel: "Critical-path coverage in 6 months",
        criticalPathValue: "0% → 65%",
        rollbacksLabel: "Production rollbacks after moving to weekly releases",
        rollbacksValue: "0",
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
      emptyCardName: "Last run: not yet run",
      errorCardName: "Last run: data unavailable",
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
    aiTesting: {
      back: "Back to portfolio",
      kicker: "Chat API & UI tests",
      title: "Testing this site's chat",
      lede: "A deterministic suite for the portfolio chat. It uses fixed requests and mocked network responses, and it does not need a model API key. The cases that do not expect 429 are meant to run in CI. This page records no score until a real run exists.",
      methodTitle: "Method",
      principles: [
        {
          title: "Deterministic",
          body: "API cases send one fixed body and expect one status plus the error string the route actually returns. Widget cases intercept POST /api/chat/ with Playwright page.route and fulfill a fixed response. Nothing in the suite depends on model wording.",
        },
        {
          title: "No API key",
          body: "The CI cases leave ANTHROPIC_API_KEY and OPENAI_API_KEY unset. A valid message then ends at the route's 503. Widget checks that need an assistant reply get that reply from the mock, not from Claude or OpenAI.",
        },
        {
          title: "CI and local",
          body: "Every POST calls checkRateLimit first and consumes one of the 20 slots in process memory. That includes the length check, invalid messages, malformed JSON, and the missing-key response. Those four cases are the CI set because the status they expect is not 429. A run that stays on one process can fill the bucket by itself. The 429 case needs more requests than the limit of 20, inside one server process, so it stays on a local run.",
        },
      ],
      scopeTitle: "Code under test",
      scopeRouteLabel: "Route",
      scopeRoute: "POST /api/chat/ is implemented in src/app/api/chat/route.ts. next.config sets trailingSlash, so every method on /api/chat without the slash answers 308 to /api/chat/. The handler then checks the rate limit, parses JSON, validates messages, and calls a provider only when a key is present.",
      scopeWidgetLabel: "Widget",
      scopeWidget: "The widget on every page is AskMeAnythingWidget in src/components/AskMeAnythingWidget.tsx, mounted from src/app/layout.tsx.",
      orderTitle: "What POST does, in order",
      order: [
        "Rate limit runs first, against an in-memory map. A blocked IP receives 429 before the body is parsed.",
        "req.json() reads the body. Invalid JSON, including an empty body, returns 400 with error \"Invalid JSON body. Expected a JSON object.\" A value that parses but is not a JSON object — null, [], \"hi\", 42, or true — returns 400 with error \"Request body must be a JSON object.\" None of these is a 500.",
        "messages must be a non-empty array. Otherwise the response is 400 with error Invalid messages.",
        "Only the last message is length-checked. The limit is at most 500 characters (UTF-16 code units): content.length > 500 returns 400, so a length of 500 is accepted. The error string still says \"under 500 characters.\" sessionCount and conversationId are not read.",
        "ANTHROPIC_API_KEY, when set, calls claude-3-haiku-20240307 with the last 10 messages and max_tokens 512. Otherwise OPENAI_API_KEY, when set, calls gpt-4o-mini the same way. A non-OK HTTP response from the provider returns 502 with error AI service error. If fetch throws, or if parsing the provider JSON throws, the route catch returns 500 with error Internal server error. When both keys are absent the response is 503 with error No AI API key configured.",
        "GET /api/chat/ returns 405 with error Method not allowed and an Allow: POST header. GET /api/chat without the slash is a 308 to that path first. The 405 is part of the route, and it is outside the CI list below.",
      ],
      casesTitle: "Cases",
      casesIntro: "Statuses below are the ones the route returns today.",
      literalsNote: "Error strings below are the English literals the route returns.",
      cases: [
        {
          id: "length",
          scope: "CI",
          status: "400",
          title: "Last message past 500 UTF-16 code units",
          expect: "400 and error \"Message too long. Please keep messages under 500 characters.\"",
          detail: "MAX_MESSAGE_LENGTH is 500. The check is content.length > 500 on the last message only, and length counts UTF-16 code units. The limit is at most 500 characters (UTF-16 code units); 500 is accepted. An emoji outside the BMP is two code units, so 251 of those emojis are already over the limit. Earlier messages are ignored. The widget input sets maxLength to 500, in the same units, so this case is sent to the route directly, not typed into the widget.",
        },
        {
          id: "invalid-messages",
          scope: "CI",
          status: "400",
          title: "JSON with invalid messages",
          expect: "400 and error \"Invalid messages\".",
          detail: "The body is a JSON object, and messages is missing, not an array, or an empty array. {} is this case and returns 400 with error \"Invalid messages\". null, an array, a string, a number, and a boolean are a different 400: the body is not an object.",
        },
        {
          id: "bad-json",
          scope: "CI",
          status: "400",
          title: "Malformed JSON, empty body, or a non-object body",
          expect: "400 and error \"Invalid JSON body. Expected a JSON object.\" or \"Request body must be a JSON object.\"",
          detail: "Invalid JSON and an empty body fail in req.json() and return 400 with error \"Invalid JSON body. Expected a JSON object.\" null, [], \"hi\", 42, and true parse, then fail the object check and return 400 with error \"Request body must be a JSON object.\" {} is an object with no messages, so it is the Invalid messages case, not this one. None of these returns 500.",
        },
        {
          id: "no-key",
          scope: "CI",
          status: "503",
          title: "No model API key",
          expect: "503 and error \"No AI API key configured.\"",
          detail: "The request has already passed the rate limit and the message checks, and both ANTHROPIC_API_KEY and OPENAI_API_KEY are unset. Anthropic is preferred when both keys exist. A non-OK HTTP response from the provider is 502. A network failure on fetch, or a throw while parsing the provider body, is 500. This no-key case does not call the provider.",
        },
        {
          id: "rate-limit",
          scope: "Local only",
          status: "429",
          title: "The next request after 20 allowed ones, same IP and window",
          expect: "429 and error \"You've sent too many messages. Please wait a while before trying again.\"",
          detail: "RATE_LIMIT is 20 allowed requests. The window defaults to 1 hour (60 × 60 × 1000 ms). CHAT_RATE_WINDOW_MS replaces that window only when it is an integer of at least 1000. Unset, empty, non-integer, or smaller values keep 1 hour. The IP is the first x-forwarded-for value, or the shared bucket \"unknown\" when that header is missing. The map lives in the server process, and the check runs before JSON parsing, so a blocked IP gets 429 even when the body would have failed validation. This case is local only.",
        },
      ],
      uiTitle: "Widget checks",
      uiIntro: "UI checks open the real AskMeAnythingWidget and intercept POST /api/chat/ with Playwright page.route. The widget calls that slashed path, so the check does not depend on the 308. The fulfillment is a fixed status and body. No API key is read and no model is called.",
      uiPoints: [
        "Open control: button aria-label \"Open Ask Me Anything chat\". Close control: aria-label \"Close chat\". Escape also closes the panel.",
        "Send control: aria-label \"Send message\". Enter sends. A blank or whitespace-only input is not sent, because the widget trims first.",
        "An OK response (any 2xx) with { \"reply\": \"<fixed text>\" } renders that text as an assistant message. The widget checks res.ok, not a single status code.",
        "A fulfilled 429 does not show the route's JSON error. The assistant message is exactly: You've reached the session limit. Refresh the page to start a new conversation!",
        "Any other non-OK fulfillment, or a failed request, renders exactly: Oops, something went wrong. Try again in a moment.",
        "An OK response without reply renders: Sorry, something went wrong.",
        "The client posts messages, sessionCount, and conversationId from localStorage key ps-chat-session. The route ignores sessionCount and does not read conversationId.",
        "After 10 sent messages in one page load the client stops (MAX_MESSAGES). sessionCount is useState starting at 0, so a reload clears it. The client then shows \"Rate limit reached. Refresh to start a new conversation.\" A server 429 shows \"You've reached the session limit. Refresh the page to start a new conversation!\" Both tell the visitor to reload. The server allows 20 requests per IP per window and does not reset on reload. Two reloads of 10 messages use those 20 slots; the first message of a third session inside the same window is request 21 and receives 429. A shared IP, the first x-forwarded-for value or the shared \"unknown\" bucket, uses the slots sooner, so 429 can arrive before that third session. A widget check for 429 mocks the status with page.route. The API check for 429 calls the route directly.",
        "The input maxLength is 500, the same ceiling the route enforces with a greater-than check: at most 500 characters (UTF-16 code units), and 500 is accepted. The greeting and the error strings above are hardcoded English.",
      ],
      resultsTitle: "Results",
      resultsBody: "This page does not read a workflow, an artifact, or a local report. Specs for the suite live in this repository's end-to-end test folder. Until a real run exists, there is nothing to count.",
      resultRows: [
        { id: "status", label: "Status", value: "Not yet run" },
        { id: "last-run", label: "Last run", value: "—" },
        { id: "commit", label: "Commit", value: "—" },
        { id: "passed", label: "Passed", value: "—" },
        { id: "failed", label: "Failed", value: "—" },
        { id: "duration", label: "Duration", value: "—" },
      ],
      footerHome: "← petersouza.dev",
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
      theme: {
        switch: "Switch theme",
        select: "Select theme",
      },
    },
  },
  "pt-BR": {
    hero: {
      availability: "Aberto a vagas remotas de QA/SDET",
      role: "SDET · Automação de QA e Testes com IA",
      credentials: "Playwright + TypeScript · Evals de LLM · remoto do Brasil (UTC-3)",
      cta: "Ver meu trabalho",
      downloadCv: "Baixar CV",
      writing: "Textos",
      quality: "Qualidade",
      aiTesting: "Testes de IA",
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
        automatedTestsLabel: "Testes automatizados (Playwright + TS)",
        criticalPathLabel: "Cobertura dos fluxos críticos em 6 meses",
        criticalPathValue: "0% → 65%",
        rollbacksLabel: "Rollbacks em produção após migrar para releases semanais",
        rollbacksValue: "0",
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
      emptyCardName: "Última execução: ainda não executada",
      errorCardName: "Última execução: dados indisponíveis",
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
    aiTesting: {
      back: "Voltar ao portfólio",
      kicker: "Testes da API e da UI do chat",
      title: "Como o chat deste site é testado",
      lede: "Suíte determinística do chat do portfólio. Ela usa pedidos fixos e respostas de rede simuladas, e não precisa de chave de API de modelo. Os casos que não esperam 429 são feitos para rodar no CI. Esta página não publica nota enquanto não existir uma execução real.",
      methodTitle: "Método",
      principles: [
        {
          title: "Determinística",
          body: "Os casos de API enviam um body fixo e esperam um status mais a string de erro que a rota devolve de fato. Os casos de UI interceptam POST /api/chat/ com page.route do Playwright e respondem com um fulfillment fixo. Nada na suíte depende do texto gerado por um modelo.",
        },
        {
          title: "Sem chave de API",
          body: "Os casos de CI deixam ANTHROPIC_API_KEY e OPENAI_API_KEY sem valor. Uma mensagem válida termina no 503 da rota. Quando o widget precisa de uma resposta do assistente, essa resposta vem do mock, não do Claude nem da OpenAI.",
        },
        {
          title: "CI e local",
          body: "Todo POST chama checkRateLimit primeiro e consome 1 dos 20 espaços na memória do processo. Isso inclui tamanho, messages inválido, JSON malformado e a resposta sem chave. Esses quatro casos formam o conjunto de CI porque o status que esperam não é 429. Uma execução que permanece no mesmo processo pode encher o balde sozinha. O 429 precisa de mais pedidos do que o limite de 20, no mesmo processo do servidor, então fica numa execução local.",
        },
      ],
      scopeTitle: "Código sob teste",
      scopeRouteLabel: "Rota",
      scopeRoute: "POST /api/chat/ está em src/app/api/chat/route.ts. O next.config liga trailingSlash, então qualquer método em /api/chat sem a barra responde 308 para /api/chat/. O handler aplica o rate limit, faz o parse do JSON, valida messages, e só chama um provedor quando existe chave.",
      scopeWidgetLabel: "Widget",
      scopeWidget: "O widget presente em todas as páginas é AskMeAnythingWidget, em src/components/AskMeAnythingWidget.tsx, montado por src/app/layout.tsx.",
      orderTitle: "O que o POST faz, em ordem",
      order: [
        "O rate limit roda primeiro, num Map em memória. Um IP bloqueado recebe 429 antes do parse do body.",
        "req.json() lê o body. JSON inválido, inclusive um body vazio, devolve 400 com erro \"Invalid JSON body. Expected a JSON object.\" Um valor que faz parse mas não é objeto JSON — null, [], \"hi\", 42 ou true — devolve 400 com erro \"Request body must be a JSON object.\" Nenhum desses é 500.",
        "messages precisa ser um array não vazio. Caso contrário a resposta é 400 com erro Invalid messages.",
        "Só a última mensagem tem o tamanho verificado. O limite é no máximo 500 caracteres (unidades UTF-16): content.length > 500 devolve 400, então comprimento 500 é aceito. A string de erro ainda diz \"under 500 characters.\" sessionCount e conversationId não são lidos.",
        "ANTHROPIC_API_KEY, quando definida, chama claude-3-haiku-20240307 com as últimas 10 mensagens e max_tokens 512. Senão, OPENAI_API_KEY, quando definida, chama gpt-4o-mini do mesmo modo. Resposta HTTP não-OK do provedor devolve 502 com erro AI service error. Se o fetch lança, ou se o parse do JSON do provedor lança, o catch da rota devolve 500 com erro Internal server error. Sem as duas chaves, a resposta é 503 com erro No AI API key configured.",
        "GET /api/chat/ devolve 405 com erro Method not allowed e header Allow: POST. GET /api/chat sem a barra é um 308 para esse caminho antes. A resposta 405 faz parte da rota e fica fora da lista de CI abaixo.",
      ],
      casesTitle: "Casos",
      casesIntro: "Os status abaixo são os que a rota devolve hoje.",
      literalsNote: "As strings de erro abaixo são os literais em inglês que a rota devolve.",
      cases: [
        {
          id: "length",
          scope: "CI",
          status: "400",
          title: "Última mensagem acima de 500 unidades UTF-16",
          expect: "400 e erro \"Message too long. Please keep messages under 500 characters.\"",
          detail: "MAX_MESSAGE_LENGTH é 500. A comparação é content.length > 500 e vale só para a última mensagem. O tamanho conta unidades UTF-16. O limite é no máximo 500 caracteres (unidades UTF-16); 500 é aceito. Um emoji fora do BMP vale duas unidades, então 251 desses emojis já passam do limite. Mensagens anteriores são ignoradas. O input do widget usa maxLength 500, nas mesmas unidades, então este caso é enviado direto à rota, não digitado no widget.",
        },
        {
          id: "invalid-messages",
          scope: "CI",
          status: "400",
          title: "JSON com messages inválido",
          expect: "400 e erro \"Invalid messages\".",
          detail: "O body é um objeto JSON, e messages está ausente, não é um array, ou é um array vazio. {} é este caso e devolve 400 com erro \"Invalid messages\". null, um array, uma string, um número e um boolean são outro 400: o body não é objeto.",
        },
        {
          id: "bad-json",
          scope: "CI",
          status: "400",
          title: "JSON malformado, body vazio ou body que não é objeto",
          expect: "400 e erro \"Invalid JSON body. Expected a JSON object.\" ou \"Request body must be a JSON object.\"",
          detail: "JSON inválido e um body vazio falham em req.json() e devolvem 400 com erro \"Invalid JSON body. Expected a JSON object.\" null, [], \"hi\", 42 e true fazem parse, falham na checagem de objeto e devolvem 400 com erro \"Request body must be a JSON object.\" {} é um objeto sem messages, então cai no caso Invalid messages, não neste. Nenhum desses devolve 500.",
        },
        {
          id: "no-key",
          scope: "CI",
          status: "503",
          title: "Sem chave de API de modelo",
          expect: "503 e erro \"No AI API key configured.\"",
          detail: "O pedido já passou do rate limit e da validação de mensagens, e ANTHROPIC_API_KEY e OPENAI_API_KEY estão ambas ausentes. Com as duas chaves, a rota usa a Anthropic. Resposta HTTP não-OK do provedor é 502. Falha de rede no fetch, ou um throw ao ler o body do provedor, é 500. Este caso sem chave não chama o provedor.",
        },
        {
          id: "rate-limit",
          scope: "Só local",
          status: "429",
          title: "O pedido seguinte aos 20 permitidos, mesmo IP e mesma janela",
          expect: "429 e erro \"You've sent too many messages. Please wait a while before trying again.\"",
          detail: "RATE_LIMIT é 20 pedidos permitidos. A janela padrão é 1 hora (60 × 60 × 1000 ms). CHAT_RATE_WINDOW_MS substitui essa janela só quando é um inteiro de pelo menos 1000. Valor ausente, vazio, não inteiro ou menor mantém 1 hora. O IP é o primeiro valor de x-forwarded-for, ou o balde compartilhado \"unknown\" quando o header falta. O Map vive no processo do servidor, e a checagem ocorre antes do parse do JSON, então um IP bloqueado recebe 429 mesmo se o body falharia na validação. Este caso é só local.",
        },
      ],
      uiTitle: "Checagens do widget",
      uiIntro: "As checagens de UI abrem o AskMeAnythingWidget de verdade e interceptam POST /api/chat/ com page.route do Playwright. O widget chama esse caminho com barra, então a checagem não depende do 308. O fulfillment é um status e um body fixos. Nenhuma chave de API é lida e nenhum modelo é chamado.",
      uiPoints: [
        "Abrir: botão com aria-label \"Open Ask Me Anything chat\". Fechar: aria-label \"Close chat\". Escape também fecha o painel.",
        "Enviar: aria-label \"Send message\". Enter envia. Input vazio ou só com espaço não é enviado, porque o widget aplica trim antes.",
        "Uma resposta OK (qualquer 2xx) com { \"reply\": \"<texto fixo>\" } renderiza esse texto como mensagem do assistente. O widget olha res.ok, não um único status.",
        "Se o mock responde 429, o widget não mostra o JSON de erro da rota. A mensagem do assistente é exatamente: You've reached the session limit. Refresh the page to start a new conversation!",
        "Qualquer outro fulfillment não-OK, ou um pedido que falha, renderiza exatamente: Oops, something went wrong. Try again in a moment.",
        "Uma resposta OK sem reply renderiza: Sorry, something went wrong.",
        "O cliente envia messages, sessionCount e conversationId, lido da chave ps-chat-session no localStorage. A rota ignora sessionCount e não lê conversationId.",
        "Depois de 10 mensagens enviadas num carregamento, o cliente para (MAX_MESSAGES). sessionCount é um useState que começa em 0, então um reload zera o contador. O cliente mostra \"Rate limit reached. Refresh to start a new conversation.\" Um 429 do servidor mostra \"You've reached the session limit. Refresh the page to start a new conversation!\" As duas mensagens mandam recarregar. O servidor permite 20 pedidos por IP por janela e não zera no reload. Dois reloads de 10 mensagens gastam esses 20 espaços; a primeira mensagem de uma terceira sessão, na mesma janela, é o pedido 21 e recebe 429. Um IP compartilhado, o primeiro valor de x-forwarded-for ou o balde \"unknown\", gasta os espaços antes, então o 429 pode chegar antes dessa terceira sessão. A checagem de UI do 429 simula o status com page.route. A checagem de API do 429 chama a rota direto.",
        "O maxLength do input é 500, o mesmo teto que a rota aplica com uma comparação de maior que: no máximo 500 caracteres (unidades UTF-16), e 500 é aceito. A saudação e as strings de erro acima estão fixas em inglês.",
      ],
      resultsTitle: "Resultados",
      resultsBody: "Esta página não lê workflow, artefato nem relatório local. Os specs da suíte ficam na pasta de testes end-to-end deste repositório. Enquanto não existir uma execução real, não há o que contar.",
      resultRows: [
        { id: "status", label: "Status", value: "Ainda não executado" },
        { id: "last-run", label: "Última execução", value: "—" },
        { id: "commit", label: "Commit", value: "—" },
        { id: "passed", label: "Passou", value: "—" },
        { id: "failed", label: "Falhou", value: "—" },
        { id: "duration", label: "Duração", value: "—" },
      ],
      footerHome: "← petersouza.dev",
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
      theme: {
        switch: "Trocar tema",
        select: "Selecionar tema",
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

