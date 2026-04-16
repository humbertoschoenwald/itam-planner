import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UnderConstructionBanner } from "@/components/under-construction-banner";

import "./globals.css";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const sans = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itam.humbertoschoenwald.com"),
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com",
  },
  manifest: "/manifest.webmanifest",
  title: {
    default: "ITAM Planner",
    template: "%s | ITAM Planner",
  },
  applicationName: "ITAM Planner",
  description:
    "Planner académico para alumnos del ITAM con catálogo público precalculado, estado local en el navegador y sin cuentas.",
  category: "education",
  creator: "Humberto Schoenwald",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  keywords: [
    "ITAM",
    "ITAM Planner",
    "horarios ITAM",
    "boletines ITAM",
    "calendario ITAM",
    "planes ITAM",
    "planeación académica ITAM",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ITAM Planner",
  },
  openGraph: {
    title: "ITAM Planner",
    description:
      "Planner académico para alumnos del ITAM con catálogo público precalculado, estado local en el navegador y sin cuentas.",
    siteName: "ITAM Planner",
    locale: "es_MX",
    type: "website",
    url: "https://itam.humbertoschoenwald.com",
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@humbertoschoenwald",
    title: "ITAM Planner",
    description:
      "Planner académico para alumnos del ITAM con catálogo público precalculado y estado local en el navegador.",
  },
};

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
