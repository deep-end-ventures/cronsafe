import { createServerComponentClient } from "@/lib/supabase-server";
import { validateUrlNotInternal } from "@/lib/ssrf-protection";
import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint for webhook configuration.
 * Users can hit this to verify their webhook URL format.
 * Requires authentication to prevent SSRF abuse.
 */
export async function POST(request: NextRequest) {
  // Require authentication
  const supabase = createServerComponentClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.webhook_url) {
    return NextResponse.json(
      { error: "webhook_url is required" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(body.webhook_url);
    if (!["http:", "https:"].includes(url.protocol)) {
      return NextResponse.json(
        { error: "Only http and https URLs are supported" },
        { status: 400 }
      );
    }

    // SSRF protection: reject internal/private IPs
    try {
      await validateUrlNotInternal(body.webhook_url);
    } catch (ssrfErr) {
      return NextResponse.json(
        { error: "Webhook URL targets a blocked address. Only public URLs are allowed." },
        { status: 400 }
      );
    }

    const payload = {
      text: "[CronSafe] 🧪 Test webhook — your integration is working!",
      embeds: [
        {
          title: "✅ Webhook Test Successful",
          description:
            "This is a test notification from CronSafe. Your webhook is configured correctly!",
          color: 0x22c55e,
          footer: { text: "CronSafe" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(body.webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: responseText.slice(0, 200),
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to send",
      },
      { status: 500 }
    );
  }
}
