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
    readingTime: "5 min read",
    category: "Personal",
    tags: ["Career", "Story", "Mindset"],
    content: `
<h2>The Moment I Knew</h2>
<p>I was in my second year of law school when I first wrote a script that automated something I'd been doing manually for three hours every week. It was 40 lines of Python. It was the most satisfying thing I'd ever created.</p>
<p>Law school had taught me to argue persuasively. But that script <em>did</em> something. It moved atoms. It saved time. It existed in the world as a fact, not an opinion. I couldn't stop thinking about it.</p>

<h2>The Fear</h2>
<p>Dropping out of law school in Brazil isn't nothing. Law is a prestige career. My family didn't fully understand software engineering — "you want to work with computers?" There was a real cost to walking away from the credential, the network, the clear path.</p>
<p>What tipped me over: I realized I was already spending my law school free time building things. Not studying. Building. The decision had already been made by my actions; I just hadn't said it out loud yet.</p>

<h2>The First Two Years Were Hard</h2>
<p>Self-taught is romanticized. The reality: lots of tutorial hell, lots of projects I abandoned, lots of not knowing what I didn't know. The turning point was getting my first real job — not a freelance gig, a real engineering position where other engineers would read my code and tell me when it was wrong.</p>
<p>Code review humbles you fast. And fast humbling is the fastest growth.</p>

<h2>Four Years Later</h2>
<p>I'm an SDET at an international company. I've shipped production AI systems. I have a company of my own. I'm a main provider for my family. None of this was visible from the law school dropout point.</p>
<p>The law school training wasn't wasted, by the way. Learning to structure arguments, read critically, and present evidence clearly — that's just good engineering communication with different vocabulary.</p>
<p>If you're at the fork, here's my honest advice: don't decide based on prestige or fear. Decide based on which path you find yourself choosing with your free time when no one is watching.</p>
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
