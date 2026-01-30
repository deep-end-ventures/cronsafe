# CronSafe Deployment Guide

## Status: Ready to Deploy ✅

The codebase is complete and builds successfully. This guide covers the remaining infrastructure setup.

## Infrastructure Checklist

### 1. Domain Registration ($12/yr)
**Available options (checked 2026-01-30):**
- `cronsafe.io` — Available ✅ (best for dev tools)
- `cronsafe.co` — Available ✅
- `cronsafe.sh` — Available ✅ (cool, dev-friendly)
- `cronsafe.dev` — ❌ Taken
- `cronsafe.app` — Unverified (check Google Domains)

**Recommended:** `cronsafe.io` or `cronsafe.sh`

Register via Cloudflare Registrar (Account: 70842acaff226d7c47bf58096768fee5) for at-cost pricing.

### 2. Supabase Project (Free Tier)
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign up with ops email
3. Create new project:
   - **Name:** cronsafe
   - **Region:** US East (closest to Vercel)
   - **Password:** Generate a strong one
4. Go to **SQL Editor** → paste contents of `supabase/migrations/001_initial_schema.sql` → Run
5. Go to **Authentication** → **Providers**:
   - Enable **Email** (magic link enabled)
   - Enable **GitHub** (create OAuth app at github.com/settings/developers)
6. Go to **Settings** → **API** and copy:
   - `Project URL` → SUPABASE_URL
   - `anon public` key → SUPABASE_ANON_KEY
   - `service_role` key → SUPABASE_SERVICE_ROLE_KEY
7. Set **Site URL** to your app URL (e.g., `https://cronsafe.io`)
8. Add redirect URL: `https://cronsafe.io/auth/callback`

### 3. Resend (Free Tier — 100 emails/day)
1. Go to [resend.com](https://resend.com)
2. Sign up with ops email
3. Create API key → RESEND_API_KEY
4. (Optional) Add custom domain for branded emails (e.g., `alerts@cronsafe.io`)
   - Until domain is verified, use Resend's sandbox domain

### 4. GitHub OAuth App (for social login)
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Create new OAuth App:
   - **App name:** CronSafe
   - **Homepage URL:** `https://cronsafe.io`
   - **Callback URL:** `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
3. Copy Client ID + Client Secret → paste into Supabase Auth settings

### 5. Deploy to Vercel

**Option A — Automated (recommended):**
```bash
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_ANON_KEY="eyJ..."
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
export RESEND_API_KEY="re_xxx"
export APP_DOMAIN="cronsafe.io"
./scripts/setup-infra.sh
```

**Option B — Manual:**
```bash
# Set env vars in Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add RESEND_API_KEY production
vercel env add CRON_SECRET production  # generate: openssl rand -hex 32
vercel env add NEXT_PUBLIC_APP_URL production  # https://cronsafe.io

# Deploy
vercel --prod
```

### 6. Custom Domain
```bash
# Add domain to Vercel
vercel domains add cronsafe.io

# In Cloudflare (if using CF registrar):
# Add CNAME record: cronsafe.io → cname.vercel-dns.com
```

## Post-Deploy Verification

```bash
# Health check
curl https://cronsafe.io/api/health

# Landing page
curl -s https://cronsafe.io | head -20

# Test ping endpoint (need a monitor first)
curl https://cronsafe.io/api/ping/test-slug
```

## Architecture

```
GitHub (deep-end-ventures/cronsafe)
    ↓ (auto-deploy on push)
Vercel (Next.js 14 App Router)
    ├── Landing page (static)
    ├── Dashboard (server-rendered)
    ├── /api/ping/* (edge runtime)
    ├── /api/cron/check (every 1 min)
    └── /api/monitors/* (CRUD)
         ↓
Supabase (Postgres + Auth)
    ├── monitors table (RLS)
    ├── pings table
    └── alert_logs table
         ↓
Resend (email alerts)
Discord/Slack (webhook alerts)
```

## Cost Estimate (Month 1)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Resend | Free (100/day) | $0 |
| Domain | .io | ~$1/mo |
| **Total** | | **~$1/mo** |
