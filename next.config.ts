import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: 'output: export' removed to enable API routes (chat widget) and ISR (GitHub strip)
  // Primary deploy: Vercel (supports these features)
  // Cloudflare: manual static export no longer available — use Vercel
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
