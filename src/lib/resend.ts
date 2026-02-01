import { Resend } from "resend";

let resendClient: Resend | null = null;

/** HTML-escape user-supplied values to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getResendClient(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface SendAlertEmailParams {
  to: string;
  monitorName: string;
  monitorSlug: string;
  lastPingAt: string | null;
  expectedInterval: string;
  dashboardUrl: string;
}

export async function sendAlertEmail({
  to,
  monitorName,
  monitorSlug,
  lastPingAt,
  expectedInterval,
  dashboardUrl,
}: SendAlertEmailParams): Promise<{ success: boolean; error?: string }> {
  const resend = getResendClient();

  const lastPingText = lastPingAt
    ? new Date(lastPingAt).toUTCString()
    : "Never";

  // Escape all user-supplied values to prevent XSS in email HTML
  const safeMonitorName = escapeHtml(monitorName);
  const safeMonitorSlug = escapeHtml(monitorSlug);

  try {
    const { error } = await resend.emails.send({
      from: "CronSafe <alerts@cronsafe.dev>",
      to: [to],
      subject: `🚨 Monitor DOWN: ${safeMonitorName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f10; color: #e4e4e7; margin: 0; padding: 0;">
  <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="font-size: 24px; font-weight: 700; color: #ffffff;">⏱ Cron<span style="color: #818cf8;">Safe</span></span>
    </div>
    
    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: #7f1d1d; color: #fca5a5; padding: 4px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
          Monitor Down
        </div>
      </div>
      
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 24px;">
        ${safeMonitorName}
      </h1>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 14px;">Monitor ID</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #ffffff; font-size: 14px; text-align: right; font-family: monospace;">${safeMonitorSlug}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 14px;">Expected</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #ffffff; font-size: 14px; text-align: right;">${expectedInterval}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #a1a1aa; font-size: 14px;">Last Ping</td>
          <td style="padding: 12px 0; color: #fca5a5; font-size: 14px; text-align: right;">${lastPingText}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
        View Dashboard →
      </a>
    </div>
    
    <p style="text-align: center; color: #52525b; font-size: 12px; margin-top: 32px;">
      You're receiving this because you have alerts enabled for this monitor on CronSafe.
    </p>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

interface SendRecoveryEmailParams {
  to: string;
  monitorName: string;
  dashboardUrl: string;
}

export async function sendRecoveryEmail({
  to,
  monitorName,
  dashboardUrl,
}: SendRecoveryEmailParams): Promise<{ success: boolean; error?: string }> {
  const resend = getResendClient();

  const safeMonitorName = escapeHtml(monitorName);

  try {
    const { error } = await resend.emails.send({
      from: "CronSafe <alerts@cronsafe.dev>",
      to: [to],
      subject: `✅ Monitor RECOVERED: ${safeMonitorName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f10; color: #e4e4e7; margin: 0; padding: 0;">
  <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="font-size: 24px; font-weight: 700; color: #ffffff;">⏱ Cron<span style="color: #818cf8;">Safe</span></span>
    </div>
    
    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; text-align: center;">
      <div style="margin-bottom: 16px;">
        <div style="display: inline-block; background: #14532d; color: #86efac; padding: 4px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
          Recovered
        </div>
      </div>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 12px;">${safeMonitorName}</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin: 0;">This monitor is back online and pinging normally.</p>
    </div>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
        View Dashboard →
      </a>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
