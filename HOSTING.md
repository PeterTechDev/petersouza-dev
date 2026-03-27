# Hosting — petersouza.dev

## Platform: Cloudflare Workers (via OpenNext)

**Live URL:** https://petersouza.dev
**Worker URL:** https://petersouza-dev.peterleite-dev.workers.dev
**Cloudflare Account:** peterleite.dev@gmail.com

## Architecture

- **Framework:** Next.js 16 (App Router)
- **Build tool:** @opennextjs/cloudflare — compiles Next.js for Cloudflare Workers
- **Runtime:** Cloudflare Workers (NOT Pages static hosting)
- **DNS:** Cloudflare (custom domain routed to Worker)

## Deploy

```bash
# Build for Cloudflare
npm run cf:build

# Deploy to Cloudflare Workers
npm run cf:deploy

# Local preview
npm run cf:preview
```

Requires `CLOUDFLARE_API_TOKEN` env var (set in ~/.bashrc).

## Environment Variables (Secrets)

Set via `npx wrangler secret put <NAME>`:
- `OPENAI_API_KEY` — for the /api/chat widget

## History

- **Feb 2026:** Moved from Vercel to Cloudflare Pages (Vercel hitting 75% memory)
- **Mar 2026:** Migrated from Cloudflare Pages to Cloudflare Workers via @opennextjs/cloudflare
  (Pages couldn't run Next.js API routes; `output: 'export'` was removed for chat widget)

## Auto-Deploy

Currently **manual** (`npm run cf:deploy`).
Cloudflare Pages GitHub integration is still connected but builds fail (expects `out/` dir).
TODO: Set up GitHub Action for auto-deploy on push using wrangler.

## Gotcha

Vercel also has this repo connected and auto-builds on push.
The Vercel deploy is NOT the live site. petersouza.dev points to Cloudflare.
