# Deployment Plan (Vercel + Supabase) — AI-Executable

## Goal

Deploy safely with a repeatable checklist and no “it worked locally” surprises.

## 1) Environment separation (hard rule)

Maintain separate environments:
- **Local**: `.env.local` (never committed)
- **Staging**: Vercel preview/staging + staging Supabase + Stripe test mode
- **Production**: Vercel production + production Supabase + Stripe live mode

**Never** reuse Stripe live keys in staging, or vice versa.

## 2) Vercel configuration (hard gate)

### 2.1 Required env vars (production)

Set in Vercel Production Environment:
- `NEXT_PUBLIC_APP_URL` (e.g. `https://yourdomain.com`)
- `NEXT_PUBLIC_SITE_URL` (same base URL; used by auth redirects + sitemap)
- Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Stripe (if charging money):
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
- Cache invalidation webhook (recommended):
  - `REVALIDATION_SECRET`

### 2.2 Proxy (Next.js 16)

Confirm `proxy.ts` exists and is deployed (Next.js 16 proxy replaces `middleware.ts`).

## 3) Supabase configuration (hard gate)

In Supabase Auth settings:
- Add redirect URLs for:
  - `https://yourdomain.com/auth/confirm`
  - `https://yourdomain.com/auth/callback`
  - (and any locale variations if needed)
- Ensure email templates link back to your production domain.
- Enable “leaked password protection” (see `TASK-enable-leaked-password-protection.md`).

In Supabase Storage:
- Buckets exist: `product-images`, `avatars`
- Policies match app expectations (see `docs/launch/PLAN-SUPABASE.md`)

## 4) Stripe configuration (hard gate if charging money)

Follow `docs/launch/PLAN-STRIPE.md`.

At minimum:
- Webhook endpoints are configured to the correct production URLs.
- You are not sending the same events to multiple overlapping webhook handlers.

## 5) Pre-deploy checks (local)

Run:
- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `pnpm -s test:unit`
- `pnpm -s build`

Optional but recommended:
- `pnpm -s test:prod`

## 6) Post-deploy checks (staging → production)

1) Run `docs/launch/CHECKLIST-QA.md` on staging.
2) Deploy to production.
3) Re-run the same checklist on production.
4) Verify Stripe webhook delivery logs show 200s and correct event processing.

## 7) Rollback plan

- Keep a known-good Vercel deployment ready to promote back to production.
- Avoid schema changes that cannot be safely rolled back without data migration.
