import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WebsiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cronsafe-one.vercel.app"),
  title: "CronSafe — Cron Job Monitoring Made Dead Simple",
  description:
    "Your cron jobs fail silently. We don't. Dead-simple monitoring for cron jobs, background tasks, and scheduled pipelines. Get alerted when things stop running.",
  keywords: [
    "cron monitoring",
    "cron job alerts",
    "uptime monitoring",
    "heartbeat monitoring",
    "dead man's switch",
    "scheduled task monitoring",
  ],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "CronSafe — Cron Job Monitoring Made Dead Simple",
    description:
      "Your cron jobs fail silently. We don't. Get alerted when your scheduled tasks stop running.",
    url: "https://cronsafe.dev",
    siteName: "CronSafe",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CronSafe — Cron Job Monitoring Made Dead Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CronSafe — Cron Job Monitoring",
    description: "Your cron jobs fail silently. We don't.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <WebsiteJsonLd />
        <link rel="alternate" type="application/rss+xml" title="CronSafe Blog" href="/blog/rss.xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
