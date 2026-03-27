export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  content: string; // markdown-ish HTML string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-i-built-a-multi-agent-ai-team",
    title: "Why I Built a Multi-Agent AI Team",
    description:
      "Running 8 specialized AI agents simultaneously — why one AI assistant wasn't enough, and how OpenClaw changed the way I work.",
    date: "2026-03-20",
    readingTime: "4 min read",
    category: "AI",
    tags: ["AI", "Agents", "OpenClaw"],
    content: `
<h2>One AI Wasn't Enough</h2>
<p>For a while, I used a single AI assistant for everything: drafting emails, debugging code, planning architecture, reviewing PRs. It worked. But it had a problem: context collapse. Every new task meant switching mental models, re-explaining the codebase, re-establishing tone. The AI had no memory of what it had done five minutes ago in a different window.</p>
<p>The solution isn't a better memory system for a single agent. The solution is specialization.</p>

<h2>The Team I Built</h2>
<p>Using OpenClaw, I run 8 agents simultaneously, each with a distinct role:</p>
<ul>
  <li><strong>T-800</strong> — The code builder. Touches no code without reading the project context first. Ships, verifies, commits.</li>
  <li><strong>Marvin</strong> — QA. Reviews every PR T-800 opens. Runs tests. Blocks merges if something smells wrong.</li>
  <li><strong>Ego</strong> — UI/UX reviewer. Screenshots every component. Compares against design intent. Catches visual regressions.</li>
  <li><strong>Kuroko</strong> — The orchestrator. Breaks big tasks into subtasks, assigns agents, monitors completion.</li>
  <li><strong>Jarvis</strong> — Architecture advisor. Reads the codebase and proposes refactors with seams and rollback points.</li>
  <li><strong>Ghost</strong> — Research. Reads docs, compares libraries, returns structured findings.</li>
  <li><strong>Phantom</strong> — DevOps. Handles deployments, environment configs, CI/CD pipeline changes.</li>
  <li><strong>Oracle</strong> — Data. Schema design, query optimization, RLS policies.</li>
</ul>

<h2>Why This Works</h2>
<p>Each agent has a narrow skill profile: a curated set of SKILL.md files it reads before any task. T-800 reads backend patterns before touching an API route. Ego reads the frontend design guide before reviewing a component. The skills encode the conventions that would otherwise live only in my head.</p>
<p>The result: I can delegate a feature and get back working, tested, committed code without babysitting the process. The agents hand off to each other — T-800 builds, Marvin reviews, Ego checks the UI — without me in the loop for every step.</p>

<h2>What I Learned</h2>
<p>Specialization beats generalization when the task boundary is clear. A single "do everything" agent has no strong priors for any domain. An agent that only does code review develops sharp instincts about what bad code looks like.</p>
<p>The other lesson: skills are the real asset. The agents are infrastructure. The SKILL.md files — encoding architecture patterns, design conventions, test standards — are the actual intellectual property. Build those first.</p>
<p>If you're building with AI and feeling like you're doing too much manual coordination, you're probably one abstraction layer below where you should be.</p>
    `.trim(),
  },
  {
    slug: "from-qa-to-ai",
    title: "From QA to AI: My Journey",
    description:
      "How I went from law school dropout to SDET to AI systems builder — the non-linear path, the pivots, and what I'd tell my 2021 self.",
    date: "2026-02-10",
    readingTime: "4 min read",
    category: "Personal",
    tags: ["Career", "Journey", "AI"],
    content: `
<h2>The Part Nobody Talks About</h2>
<p>Career change stories on the internet always have a clean arc: I hated my old life, I discovered coding, I got a job, now I'm happy. The messy middle gets edited out. Here's the messy middle.</p>
<p>I left law school in 2021 after two years. Not because I had a plan. Because I couldn't stop writing Python scripts when I should have been reading contracts. The decision was obvious in retrospect, terrifying in real time.</p>

<h2>The Self-Taught Trap</h2>
<p>The first year was tutorial hell. I'd finish a JavaScript course and feel ready to build something, then stare at a blank file and realize I had no idea where to start. YouTube makes coding look frictionless. The reality is that you spend 80% of your time confused and 20% of your time feeling like a genius.</p>
<p>What broke the loop was getting a real job where other engineers could read my code. Code review is brutal and educational. My first PR review had 23 comments. I went home convinced I'd made a mistake. I came back the next morning and fixed all 23. That was the actual turning point.</p>

<h2>Why QA Was the Right Next Step</h2>
<p>In 2022 I became an SDET — Software Development Engineer in Test. People sometimes treat QA as a lesser engineering role. It's not. QA forces you to think adversarially about your own code: what breaks? Under what conditions? What edge cases did you not consider?</p>
<p>An engineer who can build AND break things is twice as valuable as one who can only build. I shipped six products that year. I caught bugs that would have cost real money in production. I also built AutoVendas, an AI CRM for car dealerships, and got my first taste of what AI in production actually looks like.</p>

<h2>The AI Shift</h2>
<p>Late 2023: I started taking large language models seriously as an engineering primitive, not a toy. My SDET instincts kicked in immediately — I started stress-testing prompts, edge-casing AI responses, building evals for model output. Quality engineering transfers directly to AI systems engineering.</p>
<p>By 2024 I was building multi-agent architectures, running AI in production for real dealership customers, and learning Portuguese-language prompt engineering (harder than it sounds — tone matters enormously in sales contexts). By 2025 I had a team of 8 AI agents running on my own infrastructure.</p>

<h2>What I'd Tell 2021 Peter</h2>
<p>The path from law school to AI systems builder is not a straight line. There's no certification for it. Nobody hands you the roadmap. But the skills compound in ways you don't expect — legal training taught me to structure arguments clearly, which made me a better technical communicator. QA taught me adversarial thinking, which made me better at AI evals. Every pivot added something.</p>
<p>If I had one piece of advice: don't wait until you feel ready to build something real. Build something bad. Ship it. Break it. Fix it. The gap between knowing and doing is the only gap that matters.</p>
    `.trim(),
  },
  {
    slug: "building-ai-first-products",
    title: "Building AI-First Products: Lessons from AutoVendas",
    description:
      "What I learned shipping a multi-agent WhatsApp CRM to real car dealerships — the architecture decisions, the failures, and what actually worked.",
    date: "2026-01-15",
    readingTime: "8 min read",
    category: "Engineering",
    tags: ["AI", "Multi-Agent", "Product", "Lessons"],
    content: `
<h2>Start with the Problem, Not the Technology</h2>
<p>When I started building AutoVendas, I made the classic mistake: I was excited about multi-agent AI orchestration and wanted to build it. The business problem was almost secondary. Six weeks and two pivots later, I had learned that the technology should be invisible — the only thing that matters is whether a car gets sold.</p>
<p>The actual problem? Brazilian used car dealerships receive hundreds of WhatsApp messages per day. Leads arrive at midnight. On weekends. During lunch. The average response time was 4-6 hours. By then, the buyer had already talked to three competitors.</p>

<h2>Why Multi-Agent Architecture?</h2>
<p>The obvious solution is a chatbot. The problem with chatbots is they're bad at the thing sales requires most: <em>knowing when to stop talking and pass the customer to a human</em>.</p>
<p>I modeled the conversation flow as three distinct problems that needed different reasoning:</p>
<ul>
  <li><strong>Lead qualification:</strong> Is this person actually buying, or just browsing?</li>
  <li><strong>Inventory lookup:</strong> Do we have what they want? At what price?</li>
  <li><strong>Escalation judgment:</strong> Is this the moment to involve a real salesperson?</li>
</ul>
<p>Each of these is a different cognitive task. A single model doing all three tends to hallucinate inventory data and make bad escalation calls. Splitting them into specialized agents with clear handoffs — with an orchestrator managing the flow — produced dramatically better results.</p>

<h2>What Actually Surprised Me</h2>
<p>The hardest part wasn't the AI. It was trust. Dealership owners would ask: "What if it says the wrong price?" Fair question. Our solution: the inventory agent never quotes prices. It says "in that range" and directs to a human for exact figures. Scoping the AI's confidence boundary to what it can be certain about made the whole system more reliable.</p>
<p>The other surprise: Portuguese-language prompt engineering is harder than English. Nuance in sales language — the warm, trust-building way good salespeople talk — doesn't translate directly. We spent two weeks on tone alone.</p>

<h2>What's Next</h2>
<p>AutoVendas is in production with 3 dealerships as of early 2026. The next frontier: voice. WhatsApp voice messages are huge in Brazil. Real-time speech-to-text + intent classification + text-to-speech response is the roadmap. The architecture is ready for it.</p>
<p>If you're building AI for sales, the lesson is simple: design the human handoff first. Everything else is implementation detail.</p>
    `.trim(),
  },
  {
    slug: "from-law-to-code",
    title: "Why I Left Law School for Code (And Never Looked Back)",
    description:
      "The decision that changed everything: trading contracts for components, arguments for algorithms. An honest look at the path less traveled.",
    date: "2025-11-20",
    readingTime: "7 min read",
    category: "Personal",
    tags: ["Career", "Story", "Mindset", "AI"],
    content: `
<h2>The Moment I Knew</h2>
<p>I was in my second year of law school when I first wrote a script that automated something I'd been doing manually for three hours every week. It was 40 lines of Python. Ugly code. No error handling. It ran on my laptop and nowhere else. But it was the most satisfying thing I'd ever created.</p>
<p>Law school had taught me to argue persuasively. I could dissect a contract, build a case, and present it to a room full of people who were paid to disagree with me. But that script <em>did</em> something. It moved atoms. It saved real time. It existed in the world as a fact, not an opinion. I couldn't stop thinking about it.</p>
<p>I spent the next two weeks writing more scripts. Automating class notes. Scraping case law databases. Building a janky calculator for legal deadlines. Each one was terrible by any engineering standard. Each one felt more meaningful than anything I'd written in three semesters of legal briefs.</p>

<h2>The Fear</h2>
<p>Dropping out of law school in Brazil isn't nothing. Law is a prestige career. It's the kind of degree your family celebrates at dinner. My parents didn't fully understand software engineering — "you want to work with computers?" — and I couldn't blame them. I barely understood it myself.</p>
<p>There was a real cost to walking away from the credential, the network, the clear path. Law school gives you a roadmap: pass the bar, join a firm, build a practice. Software engineering in 2021 gave me a blank terminal and a blinking cursor. No roadmap. No safety net.</p>
<p>What tipped me over: I realized I was already spending my law school free time building things. Not studying case law. Not preparing for moot court. Building. The decision had already been made by my actions; I just hadn't said it out loud yet.</p>
<p>So I said it out loud. And then I left.</p>

<h2>The First Two Years Were Hard</h2>
<p>Self-taught is romanticized on the internet. The reality: tutorial hell, abandoned projects, and the crushing feeling of not knowing what you don't know. I'd finish a course, feel like I understood JavaScript, then try to build something real and realize I understood nothing.</p>
<p>The turning point was getting my first real job in 2022 — not a freelance gig, not a personal project, but a real engineering position where other engineers would read my code and tell me, politely but firmly, when it was wrong.</p>
<p>Code review humbles you fast. And fast humbling is the fastest growth. In six months, I learned more than I had in a year of self-study. I learned that writing code is the easy part. The hard part is writing code that other people can read, maintain, and trust.</p>
<p>By 2023, I'd become an SDET — Software Development Engineer in Test. It was the perfect role for someone who cared about quality and correctness. I shipped six products that year, including AutoVendas, an AI-powered CRM for car dealerships that would become my most ambitious project to date.</p>

<h2>The AI Turning Point</h2>
<p>When I first started experimenting with large language models in late 2023, something clicked. The same feeling from that first Python script came back, amplified by a thousand. Here was a technology that could understand natural language, reason about problems, and generate solutions — and it was accessible to anyone willing to learn how to use it.</p>
<p>I went deep. Multi-agent architectures. Prompt engineering in Portuguese (harder than English — the nuance in sales language doesn't translate directly). Voice synthesis with ElevenLabs. Real-time speech processing with Whisper. Each project taught me something new about what AI can and can't do.</p>
<p>The most important lesson: AI is a tool, not a replacement. The best systems I've built are the ones where AI handles the repetitive cognitive work and humans handle the judgment calls. AutoVendas doesn't replace salespeople — it makes sure no lead waits six hours for a reply at 2 AM.</p>

<h2>Four Years Later</h2>
<p>I'm an SDET at an international company, working remotely from Brazil for a US-based team. I've shipped production AI systems that handle real customer conversations. I have a company of my own. I'm a main provider for my family — my daughter, who I chase around the house when I close my laptop.</p>
<p>None of this was visible from the law school dropout point. When I walked out of that building in 2021, I couldn't have told you where I'd be in four years. I just knew I'd rather fail at building things than succeed at arguing about them.</p>
<p>The law school training wasn't wasted, by the way. Learning to structure arguments, read critically, and present evidence clearly — that's just good engineering communication with different vocabulary. Every design doc I write, every bug report I file, every stakeholder conversation I have — the legal training shows up in ways I didn't expect.</p>

<h2>AI Is the Great Equalizer</h2>
<p>Here's what I believe: AI is the most democratizing technology since the internet itself. A developer in Brazil with a laptop and an API key can build systems that compete with products from teams of fifty. Geography matters less. Credentials matter less. What matters is whether you can identify a real problem and build a real solution.</p>
<p>I'm not saying it's easy. It's not. The barrier to entry is lower, but the barrier to excellence is just as high as it's ever been. You still need to understand systems. You still need to write clean code. You still need to test your assumptions against reality.</p>
<p>But the opportunity is there in a way it wasn't five years ago. If you're standing at a fork like I was — wondering whether to leave the safe path for the uncertain one — look at what you do with your free time when no one is watching. That's your answer.</p>
<p>I left law school with one conviction: the world doesn't need more arguments. It needs more people who build things. Four years and a lot of coffee later, I haven't changed my mind.</p>
    `.trim(),
  },
  {
    slug: "conversational-ai-for-sales",
    title: "Designing Conversational AI for High-Stakes Sales",
    description:
      "Most chatbots are just FAQ machines. Here's how I designed a WhatsApp AI that actually closes deals — intent modeling, objection handling, and graceful fallbacks.",
    date: "2025-10-05",
    readingTime: "12 min read",
    category: "Technical",
    tags: ["AI", "Architecture", "WhatsApp", "Sales"],
    content: `
<h2>The FAQ Machine Problem</h2>
<p>Most "AI chatbots" deployed in sales contexts are FAQ machines with a language model veneer. They answer "do you have X?" and "what are your hours?" but they don't sell. They can't read intent. They don't know when to close. They confuse a curious browser with a motivated buyer.</p>
<p>Real sales conversations have a structure: awareness → interest → qualification → objection handling → close. An AI that can navigate this funnel is fundamentally different from one that just retrieves information.</p>

<h2>Intent Modeling First</h2>
<p>Before any response is generated, every incoming message in AutoVendas goes through an intent classification step. The classifier has five buckets:</p>
<ul>
  <li><strong>BROWSE</strong> — "what do you have?" style exploratory messages</li>
  <li><strong>QUALIFY</strong> — specific vehicle interest with some urgency signals</li>
  <li><strong>OBJECTION</strong> — price concerns, competitor mentions, hesitation language</li>
  <li><strong>READY</strong> — scheduling language, payment questions, commitment signals</li>
  <li><strong>OUT_OF_SCOPE</strong> — anything the AI shouldn't handle</li>
</ul>
<p>The orchestrator routes differently based on intent. READY intent triggers immediate human escalation. OBJECTION intent activates a specialized objection-handling prompt. This beats a monolithic prompt trying to do everything.</p>

<h2>Graceful Degradation</h2>
<p>The most important design decision: define the AI's confidence boundary clearly, and degrade gracefully when you hit it.</p>
<p>For AutoVendas, the rules are simple: the AI never quotes exact prices, never confirms vehicle availability without a real-time database check, and never makes promises about financing terms. When any of these come up, it acknowledges the question and routes to a human — but does so warmly, not like hitting a wall.</p>
<p>"Great question on financing — let me connect you with our specialist who can walk you through the exact options for this model. Can I get your preferred contact time?"</p>
<p>That's not a failure. That's a qualified handoff. The human gets a warm lead with context.</p>

<h2>Measuring AI Sales Effectiveness</h2>
<p>Standard metrics don't capture AI sales performance. "Response time" and "resolution rate" miss the point. What actually matters:</p>
<ul>
  <li>Lead-to-human-handoff rate (is the AI qualifying before escalating?)</li>
  <li>Human-contacted-after-AI rate (did the human follow up?)</li>
  <li>Deal close rate from AI-initiated conversations vs. direct human conversations</li>
  <li>Conversation abandonment rate (how often do leads go silent mid-AI-conversation?)</li>
</ul>
<p>The last metric is underrated. A sudden silence after a specific AI response is a signal. We review these weekly and adjust prompts accordingly. The AI is never "done" — it's a living system that improves with data.</p>
    `.trim(),
  },
];
