# petersouza.dev — CLAUDE.md

> Personal portfolio — Peter Souza, AI systems builder, SDET, full-stack dev from Brazil.
> Live at: **petersouza.dev**

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, **static export** — `output: 'export'`) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| 3D | Three.js via React Three Fiber + Drei (particle field) |
| Icons | Lucide React |
| Deploy | Vercel (primary) / Cloudflare Pages (wrangler.jsonc) |
| Lint | ESLint |

## Run

```bash
npm run dev       # dev server (localhost:3000)
npm run build     # static export → ./out/
npm run lint
```

## Deploy

**Vercel (primary):** Auto-deploy on push to `main`.

**Cloudflare (manual):**
```bash
npm run build && wrangler pages deploy out/
```

## Key Features

- **Multi-theme system** — Basketball, Galaxy, LinkedIn, Clean themes
- **AI Agents showcase** — architecture diagrams of multi-agent systems
- **Case studies** — AutoVendas + Atrias Wiki (technical deep-dives)
- **Blog** — engineering lessons from real products
- **i18n** — PT-BR / EN

## File Structure

```
src/
  app/           # Next.js App Router pages
    blog/        # Blog posts
    case-study/  # Case study pages
    layout.tsx
    page.tsx
  components/
    Hero.tsx
    About.tsx
    AIAgents.tsx
    Projects.tsx
    Contact.tsx
    ParticleField.tsx   # Three.js 3D particle bg
    KonamiCode.tsx      # Easter egg
    PageWrapper.tsx
```

## Important Notes

- Static export — NO server-side rendering, NO API routes, NO `use server`
- All content is static; no DB or backend
- ElevenLabs grant logo must stay in footer (grant condition — see TOOLS.md)
- `wrangler.jsonc` targets `./out` — always build before Cloudflare deploy

## Brain Doc

See `~/clawd/brain/projects/petersouza-dev.md` (if it exists) for strategic context.

## GitHub

`git@github.com:PeterTechDev/petersouza-dev.git`
