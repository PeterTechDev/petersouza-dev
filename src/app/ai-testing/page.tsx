import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { AiTestingFooter, AiTestingShowcase } from "@/components/ai-testing/AiTestingShowcase";

export const metadata: Metadata = {
  title: "AI testing",
  openGraph: {
    title: "AI testing — Peter Souza",
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
  twitter: {
    card: "summary_large_image",
    title: "AI testing — Peter Souza",
    images: ["https://petersouza.dev/og-image.png"],
    creator: "@petersouza",
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
    <PageWrapper footer={<AiTestingFooter />}>
      <AiTestingShowcase />
    </PageWrapper>
  );
}
