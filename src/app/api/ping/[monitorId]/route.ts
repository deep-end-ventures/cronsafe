import { createAdminSupabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { monitorId: string } }
) {
  const slug = params.monitorId;

  if (!slug || slug.length < 8) {
    return NextResponse.json(
      { error: "Invalid monitor ID" },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabaseClient();
  const now = new Date().toISOString();

  // Find the monitor by slug
  const { data: monitor, error: findError } = await supabase
    .from("monitors")
    .select("id, interval_seconds, is_paused, status")
    .eq("slug", slug)
    .single();

  if (findError || !monitor) {
    return NextResponse.json(
      { error: "Monitor not found" },
      { status: 404 }
    );
  }

  // Record the ping
  const sourceIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || null;

  const { error: pingError } = await supabase.from("pings").insert({
    monitor_id: monitor.id,
    received_at: now,
    source_ip: sourceIp,
    user_agent: userAgent,
  });

  if (pingError) {
    console.error("Error recording ping:", pingError);
    return NextResponse.json(
      { error: "Failed to record ping" },
      { status: 500 }
    );
  }

  // Calculate next expected time
  const nextExpectedAt = new Date(
    Date.now() + monitor.interval_seconds * 1000
  ).toISOString();

  // Update monitor: set last_ping, next_expected, status to up
  // If it was down, clear last_alert_at so recovery is tracked
  const wasDown = monitor.status === "down";
  const updateData: Record<string, unknown> = {
    last_ping_at: now,
    next_expected_at: nextExpectedAt,
    status: monitor.is_paused ? "paused" : "up",
    updated_at: now,
  };

  // Reset alert timestamp if recovering from down
  if (wasDown) {
    updateData.last_alert_at = null;
  }

  const { error: updateError } = await supabase
    .from("monitors")
    .update(updateData)
    .eq("id", monitor.id);

  if (updateError) {
    console.error("Error updating monitor:", updateError);
    // Ping was already recorded, so still return OK
  }

  return NextResponse.json(
    {
      ok: true,
      monitor_id: slug,
      pinged_at: now,
      next_expected_at: nextExpectedAt,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

// Also support HEAD requests (lightweight pings)
export async function HEAD(
  request: NextRequest,
  context: { params: { monitorId: string } }
) {
  const response = await GET(request, context);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
