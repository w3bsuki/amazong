# Production Guide (Canonical)

This is the canonical “how we ship” checklist: correctness, safety, and go-live steps.

Related:
- Engineering rails: `docs/ENGINEERING.md`
- Backend specifics: `docs/BACKEND.md`
- Testing gates: `docs/TESTING.md`

---

## Non-negotiables

- Keep batches small and verifiable (no rewrites / no redesigns).
- Never log secrets/JWTs/full request bodies or customer PII.
- Don’t ship UI drift (no gradients, no arbitrary Tailwind values).

---

## Required gates

Minimum for any non-trivial batch:

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Pre-release (recommended):

```bash
pnpm -s lint
pnpm test:unit
pnpm -s build
pnpm test:e2e
```

---

## Deployment checklist (Vercel + domains)

- Set `NEXT_PUBLIC_APP_URL` in Vercel production env (e.g. `https://treido.eu`).
- Set `NEXT_PUBLIC_SITE_URL` as the same base URL (used by auth redirects + metadata/sitemaps).
- Set Supabase env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- If you use the revalidation endpoint, set `REVALIDATION_SECRET`.
- Verify DNS + TLS for apex + www.
- Confirm auth redirects land on the correct domain/locale.
 
Next.js proxy:
- This repo uses `proxy.ts` (do not add `middleware.ts` unless the project explicitly migrates back).

Environment separation:
- Local: `.env.local` (never committed)
- Staging: Vercel preview/staging + Stripe test mode
- Production: Vercel production + Stripe live mode
Never reuse Stripe live keys in staging (or vice versa).

---

## Supabase go-live checklist

- Critical migrations applied in production.
- Supabase Security Advisor: 0 warnings (or explicitly accepted + documented).
- Storage buckets + policies match app usage (`product-images`, `avatars`).
- Enable leaked password protection in Supabase Auth settings (dashboard setting).
- Supabase Auth redirect URLs include:
  - `https://<domain>/auth/confirm`
  - `https://<domain>/auth/callback`
- Supabase email templates link back to the production domain.

---

## Stripe go-live checklist (if charging money)

- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set in Vercel.
- Webhook secrets set in Vercel (`STRIPE_WEBHOOK_SECRET`, `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`, `STRIPE_CONNECT_WEBHOOK_SECRET`).
- Webhook endpoints configured in Stripe dashboard for the production URL(s).
- At least one end-to-end checkout verified in the deployment environment (test/live as appropriate).
- Environment separation: use Stripe test keys + webhook secrets in preview/staging and live keys + secrets only in production (no mixing).

---

## Manual QA checklist (15–45 minutes)

Run on staging, then again on production after go-live:

- Locales: `/en` and `/bg` routing works.
- Auth: signup → confirm email → login → reset password.
- Browse/search: home, categories, search filters.
- Product page renders correctly (images, price, seller info).
- Seller flow: create/edit listing with images.
- Messaging: start chat, send message, upload image.
- Checkout/orders (if in scope): add to cart → checkout → order appears for buyer + seller.
- Reviews (if exposed): submit + helpful vote + delete own review.

---

## Rollback

- Keep a known-good Vercel deployment ready to promote back to production.
- Avoid schema changes that can’t be safely rolled back without a data migration plan.
