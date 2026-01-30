import { createServerComponentClient } from "@/lib/supabase-server";
import { CreateMonitorInput, unitToSeconds } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MAX_FREE_MONITORS = 20;

export async function GET() {
  const supabase = createServerComponentClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: monitors, error } = await supabase
    .from("monitors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ monitors });
}

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateMonitorInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate
  if (!body.name || body.name.trim().length === 0) {
    return NextResponse.json(
      { error: "Monitor name is required" },
      { status: 400 }
    );
  }

  if (body.name.length > 100) {
    return NextResponse.json(
      { error: "Monitor name must be 100 characters or less" },
      { status: 400 }
    );
  }

  if (!body.interval_value || body.interval_value < 1) {
    return NextResponse.json(
      { error: "Interval must be at least 1" },
      { status: 400 }
    );
  }

  if (!["minutes", "hours", "days"].includes(body.interval_unit)) {
    return NextResponse.json(
      { error: "Invalid interval unit" },
      { status: 400 }
    );
  }

  if (body.grace_value < 0) {
    return NextResponse.json(
      { error: "Grace period cannot be negative" },
      { status: 400 }
    );
  }

  // Validate webhook URL if provided
  if (body.webhook_url) {
    try {
      const url = new URL(body.webhook_url);
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook URL" },
        { status: 400 }
      );
    }
  }

  // Check monitor limit
  const { count, error: countError } = await supabase
    .from("monitors")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count || 0) >= MAX_FREE_MONITORS) {
    return NextResponse.json(
      {
        error: `Free tier limit reached. Maximum ${MAX_FREE_MONITORS} monitors allowed.`,
      },
      { status: 403 }
    );
  }

  const intervalSeconds = unitToSeconds(body.interval_value, body.interval_unit);
  const graceSeconds = unitToSeconds(body.grace_value, body.grace_unit);

  // Generate a unique slug (URL-safe, unguessable)
  const slug = crypto.randomBytes(12).toString("base64url");

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      user_id: user.id,
      name: body.name.trim(),
      slug,
      interval_seconds: intervalSeconds,
      grace_seconds: graceSeconds,
      status: "new",
      alert_email: body.alert_email ?? true,
      webhook_url: body.webhook_url || null,
      is_paused: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating monitor:", error);
    return NextResponse.json(
      { error: "Failed to create monitor" },
      { status: 500 }
    );
  }

  return NextResponse.json({ monitor }, { status: 201 });
}
