import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { PlaygroundCheckout } from "@/components/PlaygroundCheckout";
import { modeFromParam } from "@/lib/playground-bugs";
import { metadata as siteMetadata } from "../layout";

// Axe exclusion: see AXE_EXCLUDED_PATHS in src/lib/playground-bugs.ts.
// This route stays out of the axe gate in both the planted mode and ?mode=fixed.

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Synthetic checkout for bug-bash practice. Defects on this page are planted on purpose. Add ?mode=fixed to turn them off.",
  openGraph: {
    ...siteMetadata.openGraph,
    title: "Playground — Peter Souza",
    description: "Synthetic bug-bash checkout. Planted defects, with a fixed mode.",
    url: "https://petersouza.dev/playground/",
  },
  twitter: {
    ...siteMetadata.twitter,
    title: "Playground — Peter Souza",
    description: "Synthetic bug-bash checkout. Planted defects, with a fixed mode.",
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
