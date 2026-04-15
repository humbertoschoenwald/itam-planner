import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";

import { SiteHeader } from "@/components/site-header";

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
  manifest: "/manifest.webmanifest",
  title: {
    default: "ITAM Planner",
    template: "%s | ITAM Planner",
  },
  applicationName: "ITAM Planner",
  description: "Planeación académica para alumnos del ITAM con estado local y sin cuentas.",
  category: "education",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ITAM Planner",
  },
  openGraph: {
    title: "ITAM Planner",
    description: "Planeación académica para alumnos del ITAM con estado local y sin cuentas.",
    siteName: "ITAM Planner",
    type: "website",
    url: "https://itam.humbertoschoenwald.com",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  initialScale: 1,
  themeColor: "#1f4d3f",
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
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
