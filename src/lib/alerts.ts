import { Monitor, formatInterval } from "@/types";
import { sendAlertEmail, sendRecoveryEmail } from "./resend";
import { createAdminSupabaseClient } from "./supabase";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://cronsafe.dev";

interface AlertResult {
  type: "email" | "webhook";
  success: boolean;
  error?: string;
}

async function logAlert(
  monitorId: string,
  type: "email" | "webhook",
  message: string,
  success: boolean,
  error?: string
) {
  const supabase = createAdminSupabaseClient();
  await supabase.from("alert_logs").insert({
    monitor_id: monitorId,
    alert_type: type,
    message,
    success,
    error: error || null,
  });
}

export async function sendWebhookAlert(
  webhookUrl: string,
  monitor: Monitor,
  type: "down" | "recovered"
): Promise<AlertResult> {
  const isDown = type === "down";
  const color = isDown ? 0xef4444 : 0x22c55e;
  const status = isDown ? "DOWN 🔴" : "RECOVERED ✅";

  // Format for Discord/Slack compatible webhook
  const payload = {
    // Slack format
    text: `[CronSafe] Monitor ${status}: ${monitor.name}`,
    // Discord embed format
    embeds: [
      {
        title: `${status}: ${monitor.name}`,
        description: isDown
          ? `Monitor has not received a ping within the expected window.`
          : `Monitor is back online and pinging normally.`,
        color,
        fields: [
          {
            name: "Monitor",
            value: monitor.name,
            inline: true,
          },
          {
            name: "Expected",
            value: formatInterval(monitor.interval_seconds),
            inline: true,
          },
          {
            name: "Last Ping",
            value: monitor.last_ping_at
              ? new Date(monitor.last_ping_at).toUTCString()
              : "Never",
            inline: false,
          },
        ],
        footer: {
          text: "CronSafe",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const error = `Webhook returned ${response.status}: ${body.slice(0, 200)}`;
      await logAlert(
        monitor.id,
        "webhook",
        `${type} alert webhook`,
        false,
        error
      );
      return { type: "webhook", success: false, error };
    }

    await logAlert(monitor.id, "webhook", `${type} alert webhook`, true);
    return { type: "webhook", success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    await logAlert(
      monitor.id,
      "webhook",
      `${type} alert webhook`,
      false,
      error
    );
    return { type: "webhook", success: false, error };
  }
}

export async function sendDownAlerts(
  monitor: Monitor,
  userEmail: string
): Promise<AlertResult[]> {
  const results: AlertResult[] = [];

  // Send email alert
  if (monitor.alert_email && userEmail) {
    const emailResult = await sendAlertEmail({
      to: userEmail,
      monitorName: monitor.name,
      monitorSlug: monitor.slug,
      lastPingAt: monitor.last_ping_at,
      expectedInterval: formatInterval(monitor.interval_seconds),
      dashboardUrl: `${APP_URL}/dashboard`,
    });

    await logAlert(
      monitor.id,
      "email",
      `Down alert to ${userEmail}`,
      emailResult.success,
      emailResult.error
    );

    results.push({
      type: "email",
      success: emailResult.success,
      error: emailResult.error,
    });
  }

  // Send webhook alert
  if (monitor.webhook_url) {
    const webhookResult = await sendWebhookAlert(
      monitor.webhook_url,
      monitor,
      "down"
    );
    results.push(webhookResult);
  }

  return results;
}

export async function sendRecoveryAlerts(
  monitor: Monitor,
  userEmail: string
): Promise<AlertResult[]> {
  const results: AlertResult[] = [];

  if (monitor.alert_email && userEmail) {
    const emailResult = await sendRecoveryEmail({
      to: userEmail,
      monitorName: monitor.name,
      dashboardUrl: `${APP_URL}/dashboard`,
    });

    await logAlert(
      monitor.id,
      "email",
      `Recovery alert to ${userEmail}`,
      emailResult.success,
      emailResult.error
    );

    results.push({
      type: "email",
      success: emailResult.success,
      error: emailResult.error,
    });
  }

  if (monitor.webhook_url) {
    const webhookResult = await sendWebhookAlert(
      monitor.webhook_url,
      monitor,
      "recovered"
    );
    results.push(webhookResult);
  }

  return results;
}
