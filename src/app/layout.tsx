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
  title: "Peter Souza — Software Engineer & AI Builder",
  description:
    "Building AI-first products that solve real problems. Software Engineer from Brazil.",
  openGraph: {
    title: "Peter Souza — Software Engineer & AI Builder",
    description: "Building AI-first products that solve real problems.",
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
    description: "Building AI-first products that solve real problems.",
    images: ["https://petersouza.dev/og-image.png"],
  },
  alternates: {
    canonical: "https://petersouza.dev",
    languages: {
      en: "https://petersouza.dev/?lang=en",
      "pt-BR": "https://petersouza.dev/?lang=pt-BR",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable} ${orbitron.variable} ${playfair.variable} ${spaceMono.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
