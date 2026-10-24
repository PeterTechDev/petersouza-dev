/**
 * Open Graph fields shared by the root layout and standalone pages.
 *
 * Import this module instead of src/app/layout.tsx. A full metadata helper
 * can wait for a later tidy.
 */

export const siteName = "Peter Souza";

export const siteLocale = "en_US";

export const siteOgImage = {
  url: "https://petersouza.dev/og-image.png",
  width: 1200,
  height: 630,
  alt: "Peter Souza — QA Automation & AI Testing Engineer",
} as const;
