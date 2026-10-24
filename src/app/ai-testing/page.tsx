import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { AiTestingShowcase } from "@/components/ai-testing/AiTestingShowcase";

export const metadata: Metadata = {
  title: "AI testing",
  description:
    "How petersouza.dev tests its own chat: a deterministic suite with fixed API requests and mocked widget responses, no model API key. Results stay unpublished until a real run exists.",
  openGraph: {
    title: "AI testing — Peter Souza",
    description:
      "Deterministic checks for the portfolio chat. No model API key. No score until a real run exists.",
    url: "https://petersouza.dev/ai-testing/",
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
  alternates: {
    canonical: "https://petersouza.dev/ai-testing/",
    languages: {
      en: "https://petersouza.dev/ai-testing/?lang=en",
      "pt-BR": "https://petersouza.dev/ai-testing/?lang=pt-BR",
    },
  },
};

export default function AiTestingPage() {
  return (
    <PageWrapper>
      <AiTestingShowcase />
    </PageWrapper>
  );
}
