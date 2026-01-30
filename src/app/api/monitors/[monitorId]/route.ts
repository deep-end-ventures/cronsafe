import { createServerComponentClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { monitorId: string } }
) {
  const supabase = createServerComponentClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitorId = params.monitorId;

  // Verify ownership
  const { data: monitor } = await supabase
    .from("monitors")
    .select("id, user_id")
    .eq("id", monitorId)
    .single();

  if (!monitor || monitor.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete pings first (cascade should handle this, but being explicit)
  await supabase.from("pings").delete().eq("monitor_id", monitorId);
  await supabase.from("alert_logs").delete().eq("monitor_id", monitorId);

  const { error } = await supabase
    .from("monitors")
    .delete()
    .eq("id", monitorId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { monitorId: string } }
) {
  const supabase = createServerComponentClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitorId = params.monitorId;

  // Verify ownership
  const { data: existingMonitor } = await supabase
    .from("monitors")
    .select("id, user_id")
    .eq("id", monitorId)
    .single();

  if (!existingMonitor || existingMonitor.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Only allow updating specific fields
  const allowedFields = [
    "name",
    "is_paused",
    "alert_email",
    "webhook_url",
  ];
  const updateData: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  // Handle pause/unpause status change
  if ("is_paused" in updateData) {
    updateData.status = updateData.is_paused ? "paused" : "new";
  }

  updateData.updated_at = new Date().toISOString();

  const { data: monitor, error } = await supabase
    .from("monitors")
    .update(updateData)
    .eq("id", monitorId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ monitor });
}
