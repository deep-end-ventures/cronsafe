#!/bin/bash
# CronSafe Infrastructure Setup Script
# Run this after creating external service accounts
#
# Prerequisites:
# 1. Supabase project created (https://supabase.com/dashboard)
# 2. Supabase SQL migration run (supabase/migrations/001_initial_schema.sql)
# 3. Supabase Auth providers configured (Email + GitHub OAuth)
# 4. Resend account created (https://resend.com)
# 5. Domain registered and pointing to Vercel
#
# Usage:
#   export SUPABASE_URL="https://xxx.supabase.co"
#   export SUPABASE_ANON_KEY="eyJ..."
#   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
#   export RESEND_API_KEY="re_xxx"
#   export APP_DOMAIN="cronsafe.io"  # or your chosen domain
#   ./scripts/setup-infra.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔧 CronSafe Infrastructure Setup"
echo "================================="
echo ""

# Check required env vars
MISSING=0
for var in SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY RESEND_API_KEY; do
  if [ -z "${!var:-}" ]; then
    echo -e "${RED}✗ Missing: $var${NC}"
    MISSING=1
  else
    echo -e "${GREEN}✓ Found: $var${NC}"
  fi
done

if [ "$MISSING" -eq 1 ]; then
  echo ""
  echo -e "${RED}Please set all required environment variables first.${NC}"
  exit 1
fi

APP_DOMAIN="${APP_DOMAIN:-cronsafe.vercel.app}"
APP_URL="https://${APP_DOMAIN}"
CRON_SECRET=$(openssl rand -hex 32)

echo ""
echo -e "${YELLOW}App URL: ${APP_URL}${NC}"
echo -e "${YELLOW}Cron Secret: ${CRON_SECRET}${NC}"
echo ""

# Set Vercel environment variables
echo "📦 Setting Vercel environment variables..."

vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL" 2>/dev/null || \
  echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY" 2>/dev/null || \
  echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_ROLE_KEY" 2>/dev/null || \
  echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

vercel env add RESEND_API_KEY production <<< "$RESEND_API_KEY" 2>/dev/null || \
  echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY production

vercel env add CRON_SECRET production <<< "$CRON_SECRET" 2>/dev/null || \
  echo "$CRON_SECRET" | vercel env add CRON_SECRET production

vercel env add NEXT_PUBLIC_APP_URL production <<< "$APP_URL" 2>/dev/null || \
  echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo -e "${GREEN}✓ Vercel environment variables set${NC}"

# Also set for preview and development
echo "📦 Setting preview + development env vars..."
for env in preview development; do
  echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL $env 2>/dev/null || true
  echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY $env 2>/dev/null || true
  echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY $env 2>/dev/null || true
  echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY $env 2>/dev/null || true
  echo "$CRON_SECRET" | vercel env add CRON_SECRET $env 2>/dev/null || true
  echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL $env 2>/dev/null || true
done
echo -e "${GREEN}✓ Preview + development env vars set${NC}"

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "================================="
echo -e "${GREEN}✅ CronSafe deployed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Add custom domain in Vercel: vercel domains add ${APP_DOMAIN}"
echo "  2. Update Supabase Site URL to ${APP_URL}"
echo "  3. Add ${APP_URL}/auth/callback to Supabase redirect URLs"
echo "  4. Add domain to Resend for custom sender address"
echo "  5. Test: curl ${APP_URL}/api/health"
echo ""
echo "Cron secret (save this): ${CRON_SECRET}"
