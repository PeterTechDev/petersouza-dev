import type { Metadata } from "next";
import { Inter, Bebas_Neue, Orbitron, Playfair_Display, Space_Mono, DM_Sans } from "next/font/google";
import { siteLocale, siteName, siteOgImage } from "@/lib/site-metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petersouza.dev"),
  title: {
    default: "Peter Souza — QA Automation & AI Testing Engineer",
    template: "%s — Peter Souza",
  },
  description:
    "Peter Souza is a QA Automation & AI Testing Engineer in Brazil (UTC-3) and the solo QA engineer at NDG Communications (USA). Playwright and TypeScript, test planning, manual testing, and LLM system testing. Open to remote QA and SDET roles.",
  keywords: [
    "Peter Souza",
    "QA Automation",
    "AI testing",
    "SDET",
    "Playwright",
    "TypeScript",
    "QA engineer",
    "NDG Communications",
    "Brazil",
    "remote QA",
  ],
  authors: [{ name: "Peter Souza", url: "https://petersouza.dev" }],
  creator: "Peter Souza",
  openGraph: {
    title: "Peter Souza — QA Automation & AI Testing Engineer",
    description:
      "QA Automation & AI Testing Engineer in Brazil (UTC-3). Solo QA at NDG Communications (USA). Playwright, TypeScript, and LLM system testing. Open to remote QA and SDET roles.",
    url: "https://petersouza.dev",
    siteName,
    locale: siteLocale,
    alternateLocale: ["pt_BR"],
    type: "website",
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Souza — QA Automation & AI Testing Engineer",
    description:
      "QA Automation & AI Testing Engineer in Brazil. Solo QA at NDG Communications. Open to remote QA and SDET roles.",
    images: [siteOgImage.url],
    creator: "@petersouza",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://petersouza.dev",
    languages: {
      en: "https://petersouza.dev/?lang=en",
      "pt-BR": "https://petersouza.dev/?lang=pt-BR",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Peter Souza",
  url: "https://petersouza.dev",
  jobTitle: "SDET · QA Automation & AI-assisted Testing",
  email: "peterleite.dev@gmail.com",
  description:
    "QA Automation & AI Testing Engineer in Brazil. Solo QA engineer at NDG Communications, working remotely for a US company.",
  sameAs: [
    "https://github.com/PeterTechDev",
    "https://www.linkedin.com/in/petertechdev/",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Multi-Agent Systems",
    "Next.js",
    "TypeScript",
    "QA Automation",
    "Playwright",
    "Software Testing",
    "Software Engineering",
    "WhatsApp Business API",
    "OpenAI API",
  ],
  worksFor: {
    "@type": "Organization",
    name: "NDG Communications",
  },
};

import { AskMeAnythingWidget } from "@/components/AskMeAnythingWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} ${orbitron.variable} ${playfair.variable} ${spaceMono.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
        <AskMeAnythingWidget />
      </body>
    </html>
  );
}
