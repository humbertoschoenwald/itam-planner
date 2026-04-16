import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UnderConstructionBanner } from "@/components/under-construction-banner";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildSiteMetadata } from "@/lib/seo";

import "./globals.css";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const sans = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = buildSiteMetadata(DEFAULT_LOCALE);

export const viewport: Viewport = {
  colorScheme: "dark light",
  initialScale: 1,
  themeColor: [
    { color: "#1f4d3f", media: "(prefers-color-scheme: light)" },
    { color: "#0d1614", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div aria-hidden className="site-atmosphere">
          <span className="site-orb site-orb-primary" />
          <span className="site-orb site-orb-secondary" />
          <span className="site-noise" />
        </div>
        <SiteHeader />
        <UnderConstructionBanner />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
