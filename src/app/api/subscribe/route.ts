import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const FROM_EMAIL = "CronSafe <hello@deependventures.com>";
const AUDIENCE_NAME = "CronSafe Subscribers";

// Lazy init to avoid build-time crash when env var is missing
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

async function getOrCreateAudience(): Promise<string> {
  const resend = getResend();
  // List existing audiences
  const { data: audiences } = await resend.audiences.list();
  const existing = audiences?.data?.find(
    (a: { name: string }) => a.name === AUDIENCE_NAME
  );
  if (existing) return existing.id;

  // Create new audience
  const { data: created } = await resend.audiences.create({
    name: AUDIENCE_NAME,
  });
  if (!created?.id) throw new Error("Failed to create audience");
  return created.id;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 requests per IP per minute
    const ip = getClientIp(req);
    const rl = rateLimit(`subscribe:${ip}`, { limit: 5, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
      );
    }

    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const resend = getResend();
    const audienceId = await getOrCreateAudience();

    // Add contact to audience
    await resend.contacts.create({
      audienceId,
      email: email.toLowerCase().trim(),
      firstName: source || "homepage",
      unsubscribed: false,
    });

    // Send welcome email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email.toLowerCase().trim(),
      subject: "Welcome to CronSafe — You're In 🛡️",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #0d9488; margin: 0;">CronSafe</h1>
            <p style="color: #71717a; font-size: 14px; margin-top: 4px;">Cron Job Monitoring Made Dead Simple</p>
          </div>
          <p style="color: #27272a; font-size: 16px; line-height: 1.6;">Hey! 👋</p>
          <p style="color: #27272a; font-size: 16px; line-height: 1.6;">
            Thanks for subscribing to CronSafe updates. You'll get practical tips on:
          </p>
          <ul style="color: #27272a; font-size: 16px; line-height: 1.8;">
            <li>Cron job monitoring best practices</li>
            <li>Debugging silent failures in scheduled tasks</li>
            <li>DevOps reliability patterns</li>
            <li>New CronSafe features & product updates</li>
          </ul>
          <p style="color: #27272a; font-size: 16px; line-height: 1.6;">
            While you're here — <a href="https://cronsafe.deependventures.com" style="color: #0d9488; text-decoration: none; font-weight: 600;">start monitoring your cron jobs for free</a>. Setup takes 60 seconds.
          </p>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e4e4e7;">
            <p style="color: #a1a1aa; font-size: 13px;">
              CronSafe — a <a href="https://deependventures.com" style="color: #a1a1aa;">Deep End Ventures</a> company
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
