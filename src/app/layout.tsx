import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
  openGraph: {
    title: "CronSafe — Cron Job Monitoring Made Dead Simple",
    description:
      "Your cron jobs fail silently. We don't. Get alerted when your scheduled tasks stop running.",
    url: "https://cronsafe.dev",
    siteName: "CronSafe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CronSafe — Cron Job Monitoring",
    description: "Your cron jobs fail silently. We don't.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
