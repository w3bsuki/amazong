# Engineering Guide

This doc captures the “rules of the road” for making changes without regressions or Vercel/Supabase cost spikes.

## Stack snapshot

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix) + lucide-react
- i18n: next-intl
- Backend: Supabase (Postgres + Auth + Storage) via `@supabase/ssr`
- Payments: Stripe
- Tests: Vitest (`__tests__/`), Playwright (`e2e/`)

## Repo boundaries (import rules)

- Route-owned (private to a route group):
  - `app/[locale]/(group)/**/_components/**`
  - `app/[locale]/(group)/**/_actions/**`
  - `app/[locale]/(group)/**/_lib/**`
  - Do not import these across route groups.
- Shared layers:
  - `components/ui/**`: primitives only (shadcn style).
  - `components/common/**`: shared composites used across routes.
  - `components/layout/**`: shells (header/nav/sidebars).
  - `components/providers/**`: thin providers/contexts.
  - `hooks/**`: reusable hooks (never from `components/ui/**`).
  - `lib/**`: pure utilities/clients/domain helpers; must not import from `app/**`.

## Next.js 16 caching (correctness + cost)

This repo enables Cache Components (`next.config.ts`).

Rules:

- Use `'use cache'` only for cacheable server functions/components.
- Always pair cached work with `cacheLife('<profile>')`.
- Use granular `cacheTag()`; avoid broad tags that invalidate everything.
- Avoid `cookies()` / `headers()` / per-user data inside cached functions (it makes output dynamic and defeats caching).
- `revalidateTag()` takes **two args**: `revalidateTag(tag, profile)`.

Cost drivers to watch:

- ISR write spikes from missing `generateStaticParams()` on locale/key segments.
- Middleware running on every request (including static assets).
- Over-fetching (wide selects / deep joins).

## i18n routing (next-intl)

- Use `Link` / `useRouter` from `@/i18n/routing` (not `next/navigation`) on localized routes.
- Keep hrefs locale-agnostic (e.g. `"/search"`), since the routing helpers prefix the active locale automatically.

## Supabase usage (security + perf)

Client selection:

- Server Components / Server Actions: `lib/supabase/server.ts` `createClient()` (cookie-aware).
- Cached/public reads: `createStaticClient()` (no cookies; safe for `'use cache'`).
- Route handlers: `createRouteHandlerClient()`.
- Admin (bypass RLS): `createAdminClient()` only for truly server-internal ops.

Security rules:

- RLS must be enforced end-to-end for user-facing writes.
- In middleware, validate sessions with `getUser()` (not `getSession()`).
- Never ship `SUPABASE_SERVICE_ROLE_KEY` to client bundles.

Performance rules:

- Don’t `select('*')` in hot paths; project only needed fields.
- Prefer `(select auth.uid())` patterns in RLS policies for performance.

## What a “good batch” looks like

- Scope: 1–3 files/features.
- Risk: low unless touching auth/checkout/seller flows.
- Verification (minimum): `tsc` + `e2e:smoke` (see `docs/guides/testing.md`).
- Notes: what changed + how verified.
