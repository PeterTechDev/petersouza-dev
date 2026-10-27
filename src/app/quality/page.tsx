import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { QualityDashboard } from "@/components/QualityDashboard";
import { fetchQualityRuns } from "@/lib/ci-status";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Quality",
  description:
    "Latest GitHub Actions runs for the quality.yml workflow. When no run is available, the page says so instead of showing numbers.",
  openGraph: {
    title: "Quality — Peter Souza",
    description: "Latest quality.yml GitHub Actions runs.",
    url: "https://petersouza.dev/quality/",
    siteName: "Peter Souza",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    type: "website",
    images: [
      {
        url: "https://petersouza.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peter Souza — SDET · QA Automation & AI-assisted Testing",
      },
    ],
  },
  alternates: {
    canonical: "https://petersouza.dev/quality/",
    languages: {
      en: "https://petersouza.dev/quality/?lang=en",
      "pt-BR": "https://petersouza.dev/quality/?lang=pt-BR",
    },
  },
};

export default async function QualityPage() {
  const report = await fetchQualityRuns();

  return (
    <PageWrapper>
      <QualityDashboard report={report} />
    </PageWrapper>
  );
}
