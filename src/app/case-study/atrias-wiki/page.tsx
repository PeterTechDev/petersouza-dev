import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { AtriasCaseStudy } from "@/components/case-studies/AtriasCaseStudy";

export const metadata: Metadata = {
  title: "Átrias Wiki Case Study",
  description:
    "Building an interactive D&D world encyclopedia with Three.js 3D visualization, Sanity CMS, and an AI narrator powered by OpenAI and vector embeddings.",
  openGraph: {
    title: "Átrias Wiki Case Study — Peter Souza",
    description:
      "Interactive D&D world encyclopedia. 176+ entities, 7 continents in 3D, AI narrator with RAG.",
    url: "https://petersouza.dev/case-study/atrias-wiki/",
    siteName: "Peter Souza",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    type: "website",
    images: [
      {
        url: "https://petersouza.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peter Souza — QA Automation & AI Testing Engineer",
      },
    ],
  },
  alternates: { canonical: "https://petersouza.dev/case-study/atrias-wiki/" },
};

export default function Page() {
  return (
    <PageWrapper>
      <AtriasCaseStudy />
    </PageWrapper>
  );
}
