# Hosting

petersouza.dev runs on Cloudflare Workers, built with OpenNext (`npm run cf:build`, config in `open-next.config.ts` and `wrangler.jsonc`). Production deploys from GitHub Actions: the `deploy` job in `.github/workflows/quality.yml` runs `npx wrangler deploy` on push to `main`, after the `lint and typecheck` and `build and playwright` jobs pass, and needs the `CLOUDFLARE_API_TOKEN` repository secret.

The Workers Builds production trigger for `main` was pointed at a branch that does not exist. In practice, `main` no longer publishes through Workers Builds, and only the preview trigger is left: every branch except `main`, with `wrangler versions upload`. The original configuration is kept at `/workspace/team/integration/workers-builds-prod-trigger-backup.json` (path on the shared team box, not in this repo).

Worker runtime secrets `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are set with `wrangler secret put`. Without them, `/api/chat` responds 503.

The repo is still connected to Vercel, but every build is canceled by the Ignored Build Step (`exit 0`) since 27/10, and it does not serve production.
