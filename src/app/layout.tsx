import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saas.psyverse.fun"),
  title: "SaaS · Ranked | SaaS 工具排行榜",
  description:
    "Slack, Notion, Salesforce, HubSpot, Stripe, Snowflake, Databricks, Figma — 45+ B2B SaaS tools scored on 7 weighted criteria across 11 categories. Bilingual EN + 中文.",
  keywords: ["SaaS comparison", "best SaaS tools", "B2B software", "Slack", "Salesforce", "HubSpot", "Stripe", "Snowflake", "Databricks", "Figma", "Notion", "Linear", "Atlassian", "SaaS 排行", "B2B 软件对比"],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "SaaS · Ranked" }],
    title: "SaaS · Ranked",
    description: "45+ B2B SaaS tools scored on 7 criteria across 11 categories. 中英双语。",
    url: "https://saas.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "SaaS · Ranked",
    description: "45+ B2B SaaS tools scored on 7 criteria across 11 categories.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0908" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
