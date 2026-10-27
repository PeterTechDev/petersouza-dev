# petersouza.dev: agent guide

Peter Souza's personal site, live at https://petersouza.dev.

## Stack (package.json is the source of truth)

- Next.js 16 (App Router), React 19, TypeScript in strict mode.
- Tailwind CSS 4. Write full class names; never build one with `${...}`, or Tailwind will not see it.
- Not a static export. There is an API route (`src/app/api/chat/route.ts`) and dynamic pages such as `/playground`.
- Two locales, EN and PT-BR, in `src/lib/i18n.ts`.
- Tests: Playwright e2e in `e2e/` (`playwright.config.ts`). No unit tests yet.

## Deploy

- Production runs on Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`, `open-next.config.ts`, `wrangler.jsonc`).
- Only GitHub Actions deploys production: the `deploy` job in `.github/workflows/quality.yml` runs on push to `main`, after `lint and typecheck` and `build and playwright` pass (`npm run cf:build`, then `npx wrangler deploy`).
- Vercel is not used. Do not deploy by hand.

## Commands

```bash
npm run dev        # local dev server
npm run lint       # eslint
npm run build      # next build
npm run cf:build   # OpenNext build for Workers (writes .open-next/)
npm run verify     # tsc --noEmit + lint + build + Playwright
```

Playwright reads `PLAYWRIGHT_PORT` for its local server.

## Rules

- Before saying "done": run `npm run verify` and report the real result. A check you did not run is "not run", never a guessed number.
- Do not change the `build` script. OpenNext runs `npm run build` itself; pointing `build` at OpenNext makes it loop.
- Do not rename the Quality jobs `lint and typecheck` and `build and playwright`; they are the merge checks.
- `/playground/` ships bugs on purpose (see README). Do not "fix" the planted mode.
- Accessibility: follow correct semantics, not an experimental axe rule.
- Docs and comments do not cite PR numbers or the state of other branches.
