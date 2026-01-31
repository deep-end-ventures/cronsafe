# Incident Report: CronSafe Vercel Deployment Failure

**Date:** 2026-01-30  
**Severity:** Critical (production down)  
**Duration:** ~30 minutes  
**Status:** ✅ Resolved  

---

## Summary

CronSafe production deployments were failing on Vercel with `● Error` status. The site returned `500 MIDDLEWARE_INVOCATION_FAILED` on all pages.

## Root Causes

Two issues were identified:

### 1. Build-Time Crash — Top-Level Supabase Client Initialization

**File:** `src/app/api/payment/claim/route.ts`  
**Commit that introduced it:** `8d25f9f` ("Add pricing page, payment infrastructure, and Pro tier")

The `createClient()` call was at **module top-level**, causing it to execute during Next.js static analysis at build time. Since environment variables are not available during Vercel's build phase (they're injected at runtime), the call threw:

```
Error: supabaseUrl is required.
```

This caused `Failed to collect page data for /api/payment/claim`, aborting the entire build.

**Fix:** Moved `createClient()` into a lazy-init helper function `getCentralSupabase()` that's only called inside the POST handler at runtime.

### 2. Missing Vercel Environment Variables

**No environment variables were configured on the Vercel project at all.** Even after the build fix, the middleware crashed at runtime because `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were `undefined`.

**Fix:** Added all required environment variables via `vercel env add`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Timeline

| Time | Event |
|------|-------|
| ~22:24 ET | Commit `8d25f9f` deployed — build fails, deployment status: Error |
| ~22:47 ET | Issue identified: top-level `createClient()` in payment/claim route |
| ~22:48 ET | Fix committed: `1f33b25` — lazy-init Supabase client |
| ~22:49 ET | Redeployed — build succeeds but site returns 500 (missing env vars) |
| ~22:50 ET | Discovered zero env vars configured on Vercel |
| ~22:52 ET | All env vars added, redeployed |
| ~22:55 ET | Deployment ● Ready — all endpoints returning 200 |

## Verification

```
Homepage:     200 ✅
/api/health:  200 ✅
/pricing:     200 ✅
```

## Lessons Learned

1. **Never initialize SDK clients at module top-level in Next.js API routes.** Always use lazy initialization (factory function called inside the handler). This is a known Next.js pattern for Vercel deployments.

2. **Environment variables must be configured on Vercel before deploying.** The `.env.local` file is only for local development. Use `vercel env add` or the Vercel dashboard for production variables.

3. **The deploy checklist in `DEPLOY.md` Step 5 explicitly covers this** — it was skipped when the pricing/payment feature was added.

## Outstanding Items

- [ ] `SUPABASE_SERVICE_ROLE_KEY` not yet set on Vercel (payment/claim and metrics/report endpoints will fail gracefully but won't persist data)
- [ ] Consider adding a pre-deploy CI check that runs `npm run build` with empty env vars
- [ ] Set up Vercel GitHub integration for automatic deploys with proper env vars

## Commit History

- `8d25f9f` — ❌ Introduced bug (top-level createClient)
- `1f33b25` — ✅ Fix: lazy-init Supabase client in payment/claim route
