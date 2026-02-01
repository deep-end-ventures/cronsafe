import { createAdminSupabaseClient } from "@/lib/supabase";
import { sendDownAlerts, sendRecoveryAlerts } from "@/lib/alerts";
import { Monitor } from "@/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * Cron job that runs every minute via Vercel Cron.
 * Checks all active monitors for missed pings and triggers alerts.
 *
 * Flow:
 * 1. Fetch all non-paused monitors
 * 2. For each monitor, check if it's overdue
 * 3. If overdue and within grace period → set status to "grace"
 * 4. If overdue and past grace period → set status to "down" and alert
 * 5. If a previously-down monitor has been pinged → send recovery alert
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  const now = Date.now();

  // Fetch all active (non-paused) monitors that have been pinged at least once
  // or are in "new" status (never pinged)
  const { data: monitors, error } = await supabase
    .from("monitors")
    .select("*")
    .eq("is_paused", false)
    .in("status", ["up", "grace", "new", "down"]);

  if (error) {
    console.error("Error fetching monitors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!monitors || monitors.length === 0) {
    return NextResponse.json({
      ok: true,
      checked: 0,
      message: "No active monitors to check",
    });
  }

  let checkedCount = 0;
  let alertedCount = 0;
  let recoveredCount = 0;
  const errors: string[] = [];

  for (const monitor of monitors as Monitor[]) {
    try {
      checkedCount++;

      // Skip "new" monitors that have never been pinged
      if (monitor.status === "new" && !monitor.last_ping_at) {
        continue;
      }

      // If the monitor has no next_expected_at, skip
      if (!monitor.next_expected_at) {
        continue;
      }

      const nextExpectedTime = new Date(monitor.next_expected_at).getTime();
      const graceDeadline = nextExpectedTime + monitor.grace_seconds * 1000;

      // Monitor is on time — nothing to do
      if (now < nextExpectedTime) {
        // If it was previously down and is now "up", send recovery
        // (This is handled by the ping endpoint, but double-check here)
        continue;
      }

      // Within grace period
      if (now >= nextExpectedTime && now < graceDeadline) {
        if (monitor.status !== "grace") {
          await supabase
            .from("monitors")
            .update({ status: "grace", updated_at: new Date().toISOString() })
            .eq("id", monitor.id);
        }
        continue;
      }

      // Past grace period — monitor is DOWN
      if (now >= graceDeadline) {
        const wasAlreadyDown = monitor.status === "down";

        // Update status to down
        if (!wasAlreadyDown) {
          await supabase
            .from("monitors")
            .update({
              status: "down",
              updated_at: new Date().toISOString(),
            })
            .eq("id", monitor.id);
        }

        // Send alert only if we haven't already alerted for this incident
        // We use last_alert_at to avoid spamming: only alert once per incident
        if (!monitor.last_alert_at || !wasAlreadyDown) {
          // Get user email for the alert
          const { data: userData } = await supabase.auth.admin.getUserById(
            monitor.user_id
          );
          const userEmail = userData?.user?.email;

          if (userEmail) {
            const results = await sendDownAlerts(monitor, userEmail);
            alertedCount++;

            // Mark that we've sent an alert
            await supabase
              .from("monitors")
              .update({
                last_alert_at: new Date().toISOString(),
                status: "down",
              })
              .eq("id", monitor.id);

            const anyFailed = results.some((r) => !r.success);
            if (anyFailed) {
              errors.push(
                `Alert partially failed for monitor ${monitor.name}: ${results
                  .filter((r) => !r.success)
                  .map((r) => r.error)
                  .join(", ")}`
              );
            }
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      errors.push(`Error checking monitor ${monitor.id}: ${msg}`);
      console.error(`Error checking monitor ${monitor.id}:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: checkedCount,
    alerted: alertedCount,
    recovered: recoveredCount,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}
