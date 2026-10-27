import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No 'output: export': the site has API routes (chat) and ISR (GitHub strip).
  // Production is Cloudflare Workers via OpenNext; see HOSTING.md.
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
