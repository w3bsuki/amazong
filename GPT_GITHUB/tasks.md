# Tasks (Phased Plan)

## Phase 0 — Baseline and Gates
- Run gradient/arbitrary scans; record counts in cleanup reports.
- Verify gates: `pnpm -s exec tsc -p tsconfig.json --noEmit` and `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`.
- Inventory cacheable data paths and Supabase tables touched; list current cache tags and cacheLife profiles.

## Phase 1 — Design System Alignment (Frontend)
- Remove remaining gradients; enforce flat cards (border + rounded-md, shadow-sm max).
- Replace arbitrary Tailwind values with tokens using Tailwind v4 var syntax.
- Execute typography audit (AGENT-1): sizes/weights/line-heights vs baseline; document fixes per page.
- Execute spacing/layout audit (AGENT-2): gaps/padding/touch targets; mobile gap-2, desktop gap-3 defaults.
- Execute colors/theming audit (AGENT-3): hardcoded palette -> tokens; verify dark/light parity on priority pages.

## Phase 2 — Frontend Boundaries, i18n, and Client Split
- Enforce component boundaries: primitives-only in components/ui; move composites to components/common or route-owned _components.
- Migrate unnecessary "use client" components to server; move data fetching to server components/actions.
- Enforce next-intl routing helpers (@/i18n/routing) for localized links; ensure locale-agnostic hrefs and complete message coverage.
- Accessibility sweep: focus states, aria roles/labels, keyboard nav for dialogs/menus; fix auth/checkout/seller flows first.

## Phase 3 — Caching and Data Hygiene (Backend)
- Audit cached functions/components: add cacheLife(<profile>) + cacheTag(); strip per-user data from cached paths.
- Fix revalidateTag signature to (tag, profile); add generateStaticParams for [locale] and key segments to reduce ISR churn.
- Replace select('*')/wide joins with projections; clamp pagination/filter params; add zod validation for mutations and route handlers.
- Apply granular cache tags for product/category/deal endpoints to avoid broad invalidations.

## Phase 4 — Security, Payments, and Middleware
- Supabase security: enable leaked-password protection; clear advisor warnings; verify RLS for all writes; ensure createAdminClient server-only.
- Stripe readiness: align currency/price config; ensure webhook idempotency and signature verification; validate env vars; localize return/cancel URLs.
- Middleware/proxy: confirm BG geo default and cookie duration; add tests for i18n + geo + session update; keep matcher exclusions for static assets.

## Phase 5 — Tooling, Performance, and Tests
- Playwright: enable free-port selection; keep smoke stable; run targeted specs for auth/checkout/seller when touched.
- Tailwind scan scripts: reduce false positives; document remaining exceptions.
- Bundle analyzer for heavy pages; lazy-load charts/visuals; memoize heavy lists and stabilize keys.
- Add unit coverage for middleware/proxy and critical lib helpers; ensure structured logging (redacted) in APIs/actions.

## Verification per Batch
- Minimum: tsc + e2e:smoke.
- If touching auth/checkout/seller or payments: run relevant Playwright specs.
- If changing caching/data: add or update unit tests; rerun smoke.
- Record what changed + how verified in PR/batch notes.
