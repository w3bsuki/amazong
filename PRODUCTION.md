# Production Guide

This is the canonical "how we ship" checklist: correctness, safety, and go-live steps.

---

## Production Finalization Plan (Audit + Codebase Reduction) — 2026-01-23

Goal: ship production-safe (security + correctness) while deleting dead code and reducing complexity **without any UI/styling drift**.

### Phase 0 — Baseline + Freeze (do first)

- [ ] Freeze “no UI drift” rails: no className changes unless strictly refactor-only + visually identical.
- [ ] Run baseline gates and record pass/fail:
  - `pnpm -s typecheck`
  - `pnpm -s test:unit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
  - `pnpm -s styles:gate`
- [ ] Run discovery tools (paste findings into `TASKS.md`):
  - `pnpm -s knip`
  - `pnpm -s dupes`

### Phase 1 — Full Tech Stack Audit (lane-by-lane)

#### Next.js (App Router)

- [ ] Build is clean: `pnpm -s build` (no runtime-only env reliance during build).
- [ ] Caching correctness: no `cookies()` / `headers()` usage inside cached functions (`'use cache'`).
- [ ] Server Actions: validate auth + input; avoid returning sensitive errors to clients.
- [ ] Route handlers: verify auth gating, rate limiting where needed, and safe logging (no secrets/PII).
- [ ] `next/image`: ensure domains + sizing are correct; no layout shifts on PDP.
- [ ] SEO: metadata present for home/category/search/PDP + canonical URLs.
- [ ] Error boundaries: `app/global-error.tsx` and route-level `error.tsx` render safe UX (no leaks).

#### TypeScript

- [ ] Zero drift on safety gate: `pnpm -s ts:gate` (no new `any`, `as any`, non-null assertions).
- [ ] Remove unused exports/files via Knip (keep public APIs stable).
- [ ] Prefer narrow types for data fetchers + action payloads (avoid `Record<string, any>` shapes).

#### shadcn/ui

- [ ] `components/ui/**` stays primitives-only (no app hooks, no route imports).
- [ ] Remove unused shadcn primitives/exports once confirmed by Knip (batch in small PRs).

#### Tailwind CSS v4

- [ ] Tokens only (prefer semantic tokens; avoid hardcoded colors).
- [ ] No gradients; avoid arbitrary values unless unavoidable.
- [ ] Gate: `pnpm -s styles:gate` (must pass before release).

#### Supabase (Auth + Postgres + Storage)

- [ ] RLS: all user-facing tables protected; admin client used only server-side for internal ops.
- [ ] Advisor checks (security + performance) are clean (or explicitly documented exceptions).
- [ ] Query hygiene: avoid `select('*')` in hot paths; project needed fields only.
- [ ] Indexes: verify foreign keys + hot filters have indexes (search, categories, conversations).
- [ ] Storage: bucket policies match app usage (`product-images`, `avatars`).
- [ ] Auth redirects configured for production domain(s): `/auth/confirm`, `/auth/callback`.

#### Stripe (Payments + Connect)

- [ ] Webhooks idempotent and verified; no duplicate order creation on retries.
- [ ] Strict environment separation (test vs live keys, webhook secrets).
- [ ] Checkout success/cancel flows are resilient to refresh/back.

#### i18n (next-intl)

- [ ] No hardcoded user-visible strings outside `messages/*.json`.
- [ ] `/en` and `/bg` parity: keep `pnpm -s test:unit` green.
- [ ] Routing uses `@/i18n/routing` helpers consistently.

#### Testing / QA

- [ ] Automated: `pnpm -s test:all` (or at minimum `typecheck` + `test:unit` + `test:e2e:smoke`).
- [ ] Manual golden paths (staging → production):
  - [ ] Auth: signup → confirm → login → logout → reset password
  - [ ] Browse: home → category → search + filters
  - [ ] PDP: gallery → add to cart → wishlist
  - [ ] Checkout (if enabled): checkout → webhook → order visible for buyer + seller
  - [ ] Messaging: start chat → send message → unread clears

### Phase 2 — Codebase Reduction (targeted, no behavior changes)

Principles:
- Delete dead code before refactoring.
- Small, verifiable batches (1–3 files).
- Don’t touch files actively being edited in parallel terminals unless explicitly coordinated.

Tooling workflow:
- [ ] `pnpm -s knip` → delete unused files/exports and remove unused deps (then update lockfile).
- [ ] `pnpm -s dupes` → dedupe high-signal clones (extract helpers/components) while keeping markup/classes stable.
- [ ] `pnpm -s lint` + `pnpm -s ts:gate` → prevent “cleanup” regressions.

Known quick wins to pursue first:
- [ ] Remove unused dependencies flagged by Knip (keep lockfile consistent).
- [ ] Remove unused exports flagged by Knip from `components/ui/**` (only after confirming nothing imports them).
- [ ] Delete legacy/duplicate components that are no longer imported (Knip “unused files” list).

---

## Treido Audit - 2026-01-23

### Critical (blocks release)
- [ ] Remove or resolve TODO/FIXME in payment-critical code (`app/api/checkout/webhook/route.ts`, `app/[locale]/(checkout)/_actions/checkout.ts`).
- [ ] Audit all `console.*` usage in server/runtime paths (no secrets/JWTs/PII; prefer structured logging).
- [ ] Confirm Stripe webhook idempotency + retry safety (no duplicate orders/subscriptions on retries).
- [ ] Fix runtime errors surfaced by E2E warmup (missing `Plans.page` messages on `/en/plans`, and `app/[locale]/[username]/not-found.tsx` destructuring crash).
- [ ] Fix ESLint error: conditional hook usage in `components/mobile/subcategory-circles.tsx` (`react-hooks/rules-of-hooks`).

### High (next sprint)
- [ ] Remove unused dependencies reported by Knip (currently includes `@ai-sdk/*` and `ai`) and keep lockfile consistent.
- [ ] Remove unused exports reported by Knip (many in `components/ui/**`) in small, safe batches.
- [ ] Tailwind drift cleanup: reduce arbitrary values flagged by scans (coordinate with the styling terminal to avoid conflicts).
- [ ] Dedupe the top clones from `pnpm -s dupes` (product cards, filter modal/hub/list) without markup drift.

### Deferred (backlog)
- [ ] Decide an achievable code-reduction target based on baseline metrics (Knip + dupe % + file/LOC counts).

## Non-Negotiables

- Keep batches small and verifiable (no rewrites / no redesigns).
- Never log secrets/JWTs/full request bodies or customer PII.
- Don't ship UI drift (no gradients, no arbitrary Tailwind values).

---

## Required Gates

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

## Deployment Checklist (Vercel + Domains)

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

## Supabase Go-Live Checklist

- Critical migrations applied in production.
- Supabase Security Advisor: 0 warnings (or explicitly accepted + documented).
- Storage buckets + policies match app usage (`product-images`, `avatars`).
- Enable leaked password protection in Supabase Auth settings (dashboard setting).
- Supabase Auth redirect URLs include:
  - `https://<domain>/auth/confirm`
  - `https://<domain>/auth/callback`
- Supabase email templates link back to the production domain.

---

## Stripe Go-Live Checklist (If Charging Money)

- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set in Vercel.
- Webhook secrets set in Vercel (`STRIPE_WEBHOOK_SECRET`, `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`, `STRIPE_CONNECT_WEBHOOK_SECRET`).
- Webhook endpoints configured in Stripe dashboard for the production URL(s).
- At least one end-to-end checkout verified in the deployment environment (test/live as appropriate).
- Environment separation: use Stripe test keys + webhook secrets in preview/staging and live keys + secrets only in production (no mixing).

---

## Manual QA Checklist (15–45 Minutes)

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
- Avoid schema changes that can't be safely rolled back without a data migration plan.
