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
- GitHub Actions deploys production: the `deploy` job in `.github/workflows/quality.yml` runs on push to `main`, and can also be started manually with `workflow_dispatch`, only on `main` and only after `lint` and `e2e` (`npm run cf:build`, then `npx wrangler deploy`).
- The Workers Builds production trigger for `main` was pointed at a branch that does not exist. In practice, `main` no longer publishes through Workers Builds, and only the preview trigger is left: every branch except `main`, with `wrangler versions upload`. The original configuration is kept at `/workspace/team/integration/workers-builds-prod-trigger-backup.json` (path on the shared team box, not in this repo).
- The repo is still connected to Vercel, but every build is canceled by the Ignored Build Step (`exit 0`) since 27/10, and Vercel does not serve production. Do not deploy by hand.

## Commands

```bash
npm run dev        # local dev server
npm run lint       # eslint
npm run build      # next build
npm run cf:build   # OpenNext build for Workers (writes .open-next/)
npm run verify     # tsc --noEmit + lint + build + Playwright
```

Set `PLAYWRIGHT_PORT` when running `npm run verify`. Ports 3000 and 3300–3399 may already be in use. Example: `PLAYWRIGHT_PORT=3150 npm run verify`.

## Rules

- Before saying "done": run `npm run verify` and report the real result. A check you did not run is "not run", never a guessed number.
- Do not change the `build` script. OpenNext runs `npm run build` itself; pointing `build` at OpenNext makes it loop.
- Do not rename the Quality checks (they should stay required): `lint and typecheck` and `build and playwright`.
- Keep the ElevenLabs Grant logo in the footer (`Contact.tsx`). It is a condition of the grant.
- `/playground/` ships bugs on purpose (see README). Do not "fix" the planted mode.
- Accessibility: follow correct semantics, not an experimental axe rule.
- Docs and comments do not cite PR numbers or the state of other branches.
