import type { Metadata } from "next";
import { Inter, Bebas_Neue, Orbitron, Playfair_Display, Space_Mono, DM_Sans } from "next/font/google";
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
    default: "Peter Souza — Software Engineer & AI Builder",
    template: "%s — Peter Souza",
  },
  description:
    "Peter Souza is a Software Engineer and AI builder from Brazil. He builds AI-first products including AutoVendas (multi-agent WhatsApp CRM) and autonomous agent infrastructure. SDET at NDG Communications.",
  keywords: [
    "Peter Souza",
    "software engineer",
    "AI builder",
    "multi-agent AI",
    "WhatsApp AI",
    "AutoVendas",
    "Brazil developer",
    "Next.js",
    "TypeScript",
    "SDET",
    "full-stack developer",
    "AI agent systems",
    "OpenAI",
    "Supabase",
  ],
  authors: [{ name: "Peter Souza", url: "https://petersouza.dev" }],
  creator: "Peter Souza",
  openGraph: {
    title: "Peter Souza — Software Engineer & AI Builder",
    description:
      "Building AI-first products that solve real problems. Multi-agent systems, WhatsApp AI, and autonomous agent infrastructure. From Brazil to the world.",
    url: "https://petersouza.dev",
    siteName: "Peter Souza",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    type: "website",
    images: [
      {
        url: "https://petersouza.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peter Souza — Software Engineer & AI Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Souza — Software Engineer & AI Builder",
    description: "Building AI-first products that solve real problems. From Brazil.",
    images: ["https://petersouza.dev/og-image.png"],
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
  jobTitle: "Software Engineer & AI Builder",
  description:
    "Software Engineer from Brazil specializing in AI-first products, multi-agent systems, and full-stack development.",
  sameAs: [
    "https://github.com/PeterTechDev",
    "https://www.linkedin.com/in/petertechdev/",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Multi-Agent Systems",
    "Next.js",
    "TypeScript",
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
