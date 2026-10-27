# Hosting

petersouza.dev runs on Cloudflare Workers, built with OpenNext (`npm run cf:build`, config in `open-next.config.ts` and `wrangler.jsonc`). Production deploys only from GitHub Actions: the `deploy` job in `.github/workflows/quality.yml` runs `npx wrangler deploy` on push to `main`, after the `lint and typecheck` and `build and playwright` jobs pass, and needs the `CLOUDFLARE_API_TOKEN` repository secret. Cloudflare preview builds per pull request continue as before. Vercel is turned off and does not serve the site.
