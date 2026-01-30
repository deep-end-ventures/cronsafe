# ⏱ CronSafe

**Dead-simple cron job monitoring.** Your cron jobs fail silently. We don't.

Create a monitor → get a ping URL → add `curl` to your cron job → get alerted when things stop running.

## Stack

- **Frontend + API:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres + Auth)
- **Email Alerts:** Resend
- **Webhook Alerts:** Discord/Slack compatible
- **Monitoring:** Vercel Cron (runs every minute)
- **Styling:** Tailwind CSS

## Quick Start

### 1. Clone & Install

```bash
cd cronsafe
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → New Query
3. Paste and run the contents of `supabase/migrations/001_initial_schema.sql`
4. Go to **Authentication** → **Providers**:
   - Enable **Email** (magic link enabled)
   - Enable **GitHub** (add OAuth app credentials from [GitHub Developer Settings](https://github.com/settings/developers))
5. Set the **Site URL** to `http://localhost:3000` (or your Vercel URL)
6. Add redirect URL: `http://localhost:3000/auth/callback`

### 3. Set Up Resend

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain (or use the sandbox domain for testing)
3. Create an API key

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_api_key
CRON_SECRET=generate-a-random-string-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. The cron job (`/api/cron/check`) runs automatically every minute via `vercel.json`

> **Important:** Set `CRON_SECRET` in Vercel environment variables. Vercel automatically sends this as a Bearer token to cron endpoints.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Cron Job    │────▶│  GET /api/   │────▶│  Supabase    │
│  (curl)      │     │  ping/{slug} │     │  (pings +    │
│              │     │  (Edge)      │     │   monitors)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐             │
│  Resend      │◀────│  Vercel Cron │◀────────────┘
│  (email)     │     │  /api/cron/  │
│              │     │  check       │──────▶ Webhooks
└──────────────┘     │  (every min) │       (Discord/Slack)
                     └──────────────┘
```

### How It Works

1. **Ping Endpoint** (`/api/ping/[slug]`): Records a heartbeat in the `pings` table and updates the monitor's `last_ping_at` and `next_expected_at`.

2. **Cron Checker** (`/api/cron/check`): Runs every minute. For each active monitor:
   - If `now < next_expected_at` → all good
   - If `now > next_expected_at` but within grace → status = "grace"
   - If `now > next_expected_at + grace` → status = "down", send alerts

3. **Alerts**: Email via Resend + webhook (Discord/Slack format). Each incident only triggers one alert (tracked via `last_alert_at`).

## API

### Ping a Monitor
```bash
# GET request (use in cron jobs)
curl -fsS https://your-app.vercel.app/api/ping/YOUR_MONITOR_SLUG

# Also supports HEAD requests for minimal bandwidth
curl -fsS -I https://your-app.vercel.app/api/ping/YOUR_MONITOR_SLUG
```

### Response
```json
{
  "ok": true,
  "monitor_id": "abc123xyz",
  "pinged_at": "2024-01-15T10:30:00.000Z",
  "next_expected_at": "2024-01-15T11:30:00.000Z"
}
```

## Cron Job Examples

```bash
# Simple — ping after job completes
0 * * * * /usr/bin/backup.sh && curl -fsS https://cronsafe.dev/api/ping/abc123

# With error handling — only ping on success
0 2 * * * /usr/bin/nightly-job.sh && curl -fsS https://cronsafe.dev/api/ping/abc123 || true

# Parallel — don't block the job
0 * * * * /usr/bin/task.sh; curl -fsS https://cronsafe.dev/api/ping/abc123 &
```

## Free Tier Limits

- 20 monitors
- 1-minute check intervals
- Email + webhook alerts
- 7-day ping history

## License

MIT

---

Built by [Deep End Ventures](https://deependventures.com).
