import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { PlaygroundCheckout } from "@/components/PlaygroundCheckout";
import { modeFromParam } from "@/lib/playground-bugs";
import { siteLocale, siteName, siteOgImage } from "@/lib/site-metadata";

// Axe exclusion: see AXE_EXCLUDED_PATHS in src/lib/playground-bugs.ts.
// Only the planted mode stays out of the axe gate. ?mode=fixed must have zero violations.

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Synthetic checkout for bug-bash practice. Defects on this page are planted on purpose. Add ?mode=fixed to turn them off.",
  openGraph: {
    title: "Playground — Peter Souza",
    description: "Synthetic bug-bash checkout. Planted defects, with a fixed mode.",
    url: "https://petersouza.dev/playground/",
    siteName,
    locale: siteLocale,
    alternateLocale: ["pt_BR"],
    type: "website",
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground — Peter Souza",
    description: "Synthetic bug-bash checkout. Planted defects, with a fixed mode.",
    images: [siteOgImage.url],
    creator: "@petersouza",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://petersouza.dev/playground/",
    languages: {
      en: "https://petersouza.dev/playground/?lang=en",
      "pt-BR": "https://petersouza.dev/playground/?lang=pt-BR",
    },
  },
};

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const mode = modeFromParam(params.mode);

  return (
    <PageWrapper>
      <PlaygroundCheckout mode={mode} />
    </PageWrapper>
  );
}
