# Phase 3 — Next.js 16 App Router Best Practices (Server/Client Boundaries, Caching, Debloat)

Purpose: make the core Next.js layer **correct, boring, and production-safe**:
- predictable server/client boundaries
- correct caching usage (Next.js 16.0.7 + React 19)
- fewer client bundles / less over-engineering
- fewer route-level surprises

This phase is the “platform refactor” phase. UI styling is Phase 1. Supabase correctness is Phase 2.

---

## Inputs (existing repo evidence)

Use these as constraints and source-of-truth:
- `APP.md` (app router structure + cleanup map)
- `CACHING.md` (verified Next.js 16.0.7 caching APIs + profiles)
- `SERVER_CLIENT_CACHING_AUDIT.md` (what’s working, what’s over-clientized)
- `MASTER_REFACTOR.md` (production readiness checklist + known issues)

---

## Scope

In scope:
- App Router conventions: layouts, route groups, error/loading/not-found handling.
- Server vs client component boundaries (`use client` only where required).
- Correct usage of caching primitives (`'use cache'`, `cacheTag`, `cacheLife`, `updateTag`, `revalidateTag(tag, profile)`).
- Reducing over-clientization and unnecessary providers.
- Removing dead/duplicate code when usage is proven.

Out of scope:
- Visual redesign, copywriting polish (Phase 1)
- Schema/RLS changes (Phase 2)
- Playwright release harness (Phase 4)

---

## Quality Gates (must stay green)

- [ ] Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Lint: `pnpm lint`
- [ ] Build: `pnpm build`
- [ ] Smoke routes (dev): `/`, `/[locale]/categories`, `/[locale]/search`, `/[locale]/product/...`, `/[locale]/account`, `/[locale]/sell`

---

## AI Execution Protocol (required)

When executing Phase 3, the agent MUST:

- Work in small batches (1–3 changes), then re-run typecheck/lint and smoke the affected route.
- Never remove `use client` blindly:
  - First confirm whether the component uses hooks, event handlers, state, effects, context, or client-only APIs.
- Prefer “thin client wrappers” around server-rendered content:
  - Keep the server component responsible for data fetching + markup.
  - Keep the client component responsible only for interaction (scroll, toggles, local state).
- Treat caching as correctness:
  - If a component uses `cookies()`, `headers()`, or auth-dependent queries, it’s dynamic; ensure it’s isolated behind Suspense boundaries.

---

## Work Queue (prioritized)

### P0 — Architecture correctness (launch blockers)

#### 0) **FIX BUILD FAILURE: API routes using `cookies()` during prerendering** (CRITICAL)
**This task must be completed first - it blocks `pnpm build`.**

The production build fails because these API routes call `cookies()` but are being prerendered:
- `/api/billing/invoices` → `app/api/billing/invoices/route.ts`
- `/api/badges` → `app/api/badges/route.ts`
- `/api/plans` → `app/api/plans/route.ts`
- `/api/seller/limits` → `app/api/seller/limits/route.ts`

Error: `HANGING_PROMISE_REJECTION` - "During prerendering, `cookies()` rejects when the prerender is complete"

- [ ] Add `export const dynamic = 'force-dynamic'` to each affected API route.
- Acceptance:
  - `pnpm build` completes successfully
  - Routes still function correctly at runtime
- Verify: `pnpm build` exits with code 0

#### 1) Validate App Router boundaries and route groups
(You already have a structure map in `APP.md`.)
- [ ] Confirm `app/[locale]/layout.tsx` is the single place for locale providers and global wrappers.
- [ ] Confirm route groups don’t leak cross-concerns:
  - `(main)` = browsing
  - `(account)` = authenticated user dashboard
  - `(auth)` = login/signup/reset
  - `(sell)` = seller flow
- [ ] Ensure each major area has appropriate `error.tsx`, `loading.tsx`, `not-found.tsx` where it matters.
- Acceptance:
  - A broken fetch doesn’t crash the whole app; it hits the nearest error boundary.

#### 2) Fix “dynamic leakage” caused by `cookies()` usage in cached sections
(Per `SERVER_CLIENT_CACHING_AUDIT.md` and `CACHING.md`.)
- [ ] Identify components/sections that call `cookies()` or `headers()`.
- [ ] Move user-specific reads to a minimal boundary:
  - server component reads cookie once
  - passes zone/user context down to client for filtering
  - keeps global product lists cached (`'use cache'` + `createStaticClient()`)
- Acceptance:
  - homepage and core lists are cache-friendly
  - user-zone personalization does not force entire pages dynamic

#### 3) Enforce correct cache invalidation API usage
(Per `CACHING.md`: `revalidateTag(tag)` with 1 arg is deprecated.)
- [ ] Search for any outdated cache invalidation calls.
- [ ] Replace with:
  - `revalidateTag(tag, 'max')` for stale-while-revalidate
  - `updateTag(tag)` for read-your-own-writes
- Acceptance:
  - all invalidation paths use the correct Next.js 16.0.7 signature

#### 4) Remove obvious dead app artifacts
(From `APP.md`: backups and demo routes.)
- [ ] Delete `app/globals.css.backup`.
- [ ] Evaluate `app/[locale]/(main)/demo/` and `app/[locale]/(main)/sell/demo1/`:
  - if unused: remove
  - if used: mark as internal-only and ensure it’s not in navigation
- Acceptance:
  - no `.backup` files in `app/`
  - no demo routes exposed in production nav

---

### P1 — Reduce over-clientization (performance + maintainability)

#### 5) Audit and shrink the `use client` footprint
(Per audit: ~52 client components, some likely unnecessary.)
- [ ] Inventory all files containing `"use client"`.
- [ ] Categorize:
  - required (Radix/shadcn primitives, hooks, interaction)
  - suspicious (pure presentational)
- [ ] Convert suspicious ones to server components where safe.

Acceptance:
- fewer client components OR at least fewer heavy client components
- no behavior regressions on key pages

#### 6) Refactor “heavy client sections” into server + thin client wrapper
Targets suggested by your audit:
- `components/trending-products-section.tsx`
- `components/tabbed-product-section.tsx`
- `components/sidebar-menu.tsx`

Pattern:
- server component renders list markup and passes props
- client wrapper handles minimal state/scroll only

Acceptance:
- reduced client bundle size for home and category pages
- UI remains identical

---

### P2 — Data layer alignment (Next.js ↔ Supabase ↔ caching)

#### 7) Ensure cached data functions are the only place doing public reads
(Per `CACHING.md`: `lib/data/*` is the canonical cached data layer.)
- [ ] Identify pages/components doing direct Supabase reads for public data.
- [ ] Move those reads to `lib/data/*` and make pages consume them.
- Acceptance:
  - public browsing reads come from cached functions
  - fewer duplicated queries

#### 8) Isolate auth-dependent queries
- [ ] Ensure auth-dependent reads always use `createClient()` (cookie-based) and are isolated.
- [ ] Ensure they don’t accidentally become cacheable.
- Acceptance:
  - account/sell flows are dynamic where needed
  - public pages remain cache-friendly

---

### P3 — Routing & API hygiene

#### 9) Route handler consistency in `app/api/*`
- [ ] For each handler in `app/api/`, confirm:
  - method handling is explicit
  - returns consistent JSON shapes
  - errors don’t leak sensitive details
- [ ] Ensure server actions are used where appropriate instead of ad-hoc API calls.

Acceptance:
- consistent status codes and error responses
- reduced duplication between actions and API handlers

---

## Verification Checklist (end-of-phase)

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] Manual smoke (desktop + mobile widths):
  - [ ] Home loads quickly and streams sections (no blank page)
  - [ ] Categories + product pages load without console spam
  - [ ] Search renders consistently
  - [ ] Account + sell flows still require auth as expected

---

## Deliverables (must be true)

- [ ] Server/client boundaries are sane (no over-clientization).
- [ ] Dynamic sources (`cookies()`, auth) are isolated; they don’t poison caching.
- [ ] Caching + invalidation uses correct Next.js 16 APIs.
- [ ] App folder has no backup/demo junk exposed to production.
- [ ] Build is green and core routes smoke clean.
