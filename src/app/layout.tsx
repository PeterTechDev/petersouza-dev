import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Peter Souza — Software Engineer & AI Builder",
  description:
    "Building AI-first products that solve real problems. Software Engineer from Brazil.",
  openGraph: {
    title: "Peter Souza — Software Engineer & AI Builder",
    description: "Building AI-first products that solve real problems.",
    url: "https://petersouza.dev",
    siteName: "Peter Souza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Souza — Software Engineer & AI Builder",
    description: "Building AI-first products that solve real problems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
