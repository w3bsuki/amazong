# Architecture (SSOT)

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + Storage)
- Stripe payments + Stripe Connect
- `next-intl` for i18n

## Repo boundaries (import rules)

- `components/ui/` — shadcn primitives only (no app hooks/imports)
- `components/shared/` — shared composites (cards, search/filter UI, fields)
- `components/layout/` — shells (headers, nav, sidebars, footer)
- `components/providers/` — thin providers/contexts
- `lib/` — pure utilities (no React, no app imports)
- `hooks/` — reusable React hooks
- `app/[locale]/(group)/_*` — route-private code (don’t import across groups)

## Next.js caching (correctness + cost)

This repo uses Next.js App Router caching. Rules:

- Use `'use cache'` only for cacheable server work.
- Pair cached work with `cacheLife('<profile>')`.
- Use granular `cacheTag()`; avoid broad tags that invalidate everything.
- Never read `cookies()` / `headers()` / other per-user data inside cached functions.
- `revalidateTag()` takes **two args**: `revalidateTag(tag, profile)`.

Common cost drivers:

- Missing `generateStaticParams()` on hot locale/key segments (ISR write spikes).
- Middleware running on every request (including static assets).
- Over-fetching (wide selects / deep joins).

## i18n routing (next-intl)

- Use `Link` / `useRouter` from `@/i18n/routing` (not `next/navigation`) on localized routes.
- Keep hrefs locale-agnostic (e.g. `"/search"`), since routing helpers prefix the active locale.

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
- Prefer efficient `auth.uid()` patterns in RLS policies.

## Data access rules (high level)

- Server-side reads/writes happen in server actions / route handlers.
- Treat Supabase RLS as required; avoid “service role everywhere” patterns.
- No caching of user-specific data.

## What a “good batch” looks like

- Scope: 1–3 files/features.
- Risk: low unless touching auth/checkout/seller flows.
- Verification: at least typecheck + relevant e2e smoke (see `TESTING.md`).

## Project rails (repeat)

- No secrets/PII in logs.
- All user-facing strings via `next-intl` (`messages/en.json` + `messages/bg.json`).
- No gradients; no arbitrary Tailwind values unless unavoidable.
- Small, verifiable batches.
