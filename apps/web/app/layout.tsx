import type { Metadata } from "next";
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
  title: {
    default: "ITAM Planner",
    template: "%s | ITAM Planner",
  },
  applicationName: "ITAM Planner",
  description: "Privacy-first academic planning for ITAM students.",
  openGraph: {
    title: "ITAM Planner",
    description: "Privacy-first academic planning for ITAM students.",
    siteName: "ITAM Planner",
    type: "website",
    url: "https://itam.humbertoschoenwald.com",
  },
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
