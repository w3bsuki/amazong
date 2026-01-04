# Agents Guide (GPT-5.2) — Amazong Marketplace

This file is for coding agents (including GPT-5.2) working in this repo.
Goal: ship to production with fewer regressions, lower Vercel/Supabase cost, and less “AI slop”.

## Repo snapshot

- App: Next.js 16 (App Router) + React 19 + TypeScript
- UI: Tailwind CSS v4 + shadcn/ui (Radix) + lucide-react
- i18n: next-intl
- Backend: Supabase (Postgres + Auth + Storage) via `@supabase/ssr`
- Payments: Stripe
- Mobile wrappers: Capacitor (android/ + ios/)
- Tests: Vitest unit tests in `__tests__/`, Playwright E2E in `e2e/`

## Non-negotiable rails

- No “rewrite” PRs. Prefer small, verifiable changes.
- No new architectural layers (stores/query libraries/DI frameworks) during cleanup.
- No redesigns. Refactors must preserve behavior + styling.
- Prefer deleting dead code over reorganizing folders “for neatness”.
- Don’t touch secrets. Never log keys, JWTs, or full request bodies.

Verification rule for any non-trivial change:
- Typecheck + at least one targeted test suite (unit or E2E smoke).

## How to run (preferred VS Code Tasks)

- Dev server: `pnpm dev`
- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- Unit tests: `pnpm test:unit`
- E2E smoke: `pnpm test:e2e:smoke`
- Full E2E (Chromium): `pnpm test:e2e`

## Where code should live (boundaries)

These boundaries are enforced by `eslint.config.mjs` warnings.

- Route-owned code (private to its route group):
  - `app/[locale]/(group)/**/_components/**`
  - `app/[locale]/(group)/**/_actions/**`
  - `app/[locale]/(group)/**/_lib/**`
  - Do not import these across route groups.

- Shared layers:
  - `components/ui/**`: primitives only (shadcn-style). No feature composites. No app hooks.
  - `components/common/**`: shared composites (cards/sections) used across routes.
  - `components/layout/**`: shells (headers/nav/sidebars).
  - `components/providers/**`: React providers/contexts (keep these small).
  - `hooks/**`: reusable hooks. Never create/import hooks from `components/ui/**`.
  - `lib/**`: pure utilities/clients/domain helpers. Must not import from `app/**`.

## UI/UX + styling rules (Tailwind v4 + shadcn)

Canonical design docs:
- `docs/DESIGN.md` (points to the design-system folder)

Practical constraints:
- No gradients.
- Cards are flat: `border`, `rounded-md` max, no heavy shadows.
- Prefer dense spacing: mobile `gap-2`, desktop `gap-3`.
- Avoid arbitrary Tailwind values (`h-[42px]`, `text-[13px]`) unless absolutely necessary.
- Use semantic tokens/classes already present in `app/globals.css`.

## Next.js 16 caching + ISR (cost + correctness)

This repo enables Cache Components:
- `next.config.ts` sets `cacheComponents: true` and defines `cacheLife` profiles.

Rules:
- Use `'use cache'` for cacheable server functions/components.
- Always pair cached data with `cacheLife('<profile>')`.
- Use granular `cacheTag()`; avoid broad tags like `products` unless you truly mean “invalidate everything”.
- Avoid `cookies()`/`headers()`/per-user data inside cached functions (it makes output dynamic).

Important Next.js 16 API gotcha:
- `revalidateTag()` takes TWO args: `revalidateTag(tag, profile)`.
  - In this repo, use profile values like `'max'` when you need SWR semantics.

To reduce ISR writes:
- Add `generateStaticParams()` for locale + key dynamic segments where feasible.
- Don’t accidentally make “unique per user” pages static.

References:
- `docs/VERCEL_USAGE_OPTIMIZATION_PLAN.md`
- `docs/production/01-nextjs.md`
- `docs/production/07-performance.md`

## Vercel usage: what to optimize first

Common cost drivers (seen in this repo):
- ISR writes explosion from missing `generateStaticParams`.
- Fast Origin Transfer spikes from over-fetching (wide selects, deep nested joins).
- Edge request volume from middleware running on every request (including static assets).

Guidelines:
- Field projection: select only what list views need.
- Avoid deep nested joins for categories; use flatter queries and dedicated RPCs for breadcrumbs.
- Add middleware matchers to skip `_next/static`, `_next/image`, and file assets.
- Ensure auth checks in middleware run only for protected routes.

## Supabase rules (security + perf)

Client usage:
- Server Components / Server Actions: `lib/supabase/server.ts` `createClient()` (cookie-aware).
- Cached/public reads: `createStaticClient()` (no cookies; safe for `'use cache'`).
- Route handlers: `createRouteHandlerClient()`.
- Admin (bypass RLS): `createAdminClient()` ONLY for truly server-internal ops.

Security rules:
- RLS must be enforced end-to-end for user-facing writes.
- In middleware, validate sessions with `getUser()` (not `getSession()`).
- Never ship `SUPABASE_SERVICE_ROLE_KEY` to client bundles.

Performance rules:
- Don’t `select('*')` in hot paths.
- Prefer `(select auth.uid())` in RLS policies (evaluates once per query).

Supabase MCP quick calls (if available in your environment):
- `mcp_supabase_get_advisors({ type: "security" })`
- `mcp_supabase_get_advisors({ type: "performance" })`
- `mcp_supabase_list_tables({ schemas: ["public"] })`
- `mcp_supabase_execute_sql({ query: "..." })` (DML only)
- `mcp_supabase_apply_migration({ name: "...", query: "..." })` (DDL)

References:
- `docs/production/02-supabase.md`

## Refactoring strategy (how we stop writing poor code)

Canonical plans:
- `docs/production/MASTER_PLAN.md` (launch gates)
- `docs/production/PRODUCTION_CLEANUP_PLAN.md` (phased cleanup)

Strategy:
- Work “layer-by-layer” where possible (data layer → actions → components → routes),
  but keep each change deployable.
- Prefer extracting pure helpers into `lib/` before splitting React components/hooks.
- Keep providers thin: move IO/realtime logic into `lib/**` modules.

Every refactor PR should include:
- A short “what changed” + “how verified” note.
- One measurable outcome (smaller payload, fewer queries, fewer imports, fewer lines) when possible.

## Testing expectations

Minimum for most PRs:
- Typecheck + E2E smoke.

When touching data fetching/caching/middleware:
- Also run unit tests and verify a couple key routes in the browser.

When touching auth/checkout/seller flows:
- Run the relevant Playwright spec(s) (or E2E seller routes).

## If you’re unsure where to start

Production push order (practical):
1) Fix Vercel usage regressions (ISR + middleware + payload size)
2) Lock down Supabase security + advisors (especially leaked password protection)
3) Stabilize E2E smoke (no skips)
4) Then do larger refactors (providers/monster files) with strict verification

If a change risks a cascade, stop and propose a smaller slice.
