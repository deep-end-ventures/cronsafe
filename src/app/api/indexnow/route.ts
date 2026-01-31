import { NextResponse } from "next/server";
import { getAllSlugs } from "@/content/blog";

const INDEXNOW_KEY = "4f11746b5428ba5244f19bb03a7667e0";
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://cronsafe-one.vercel.app";

function getAllUrls(): string[] {
  const blogSlugs = getAllSlugs();

  return [
    BASE_URL,
    `${BASE_URL}/blog`,
    ...blogSlugs.map((slug) => `${BASE_URL}/blog/${slug}`),
    `${BASE_URL}/free-cron-job-monitoring`,
    `${BASE_URL}/heartbeat-monitoring`,
    `${BASE_URL}/uptime-monitoring-scheduled-tasks`,
    `${BASE_URL}/pricing`,
  ];
}

export async function GET() {
  // Return all indexed URLs for inspection
  return NextResponse.json({
    key: INDEXNOW_KEY,
    urls: getAllUrls(),
    host: new URL(BASE_URL).host,
  });
}

export async function POST() {
  const urls = getAllUrls();
  const host = new URL(BASE_URL).host;

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    const status = response.status;
    let body = "";
    try {
      body = await response.text();
    } catch {
      // empty response is fine for 200/202
    }

    return NextResponse.json({
      success: status === 200 || status === 202,
      status,
      body,
      urlsSubmitted: urls.length,
      urls,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
