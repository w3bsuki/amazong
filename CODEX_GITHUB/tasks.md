# Tasks (Phased Plan)

## Phase 0 — Baseline & Gates
- Run scans: gradient/arbitrary/palette scripts; capture counts in cleanup reports.
- Verify current gates: `pnpm -s exec tsc -p tsconfig.json --noEmit` and `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`.
- Inventory cacheable data paths and Supabase tables touched by the app.

## Phase 1 — Design System Alignment (Frontend)
- Remove remaining gradients; align surfaces to flat cards (`border`, `rounded-md`, token backgrounds).
- Replace arbitrary Tailwind values with tokenized equivalents; adopt Tailwind v4 var syntax.
- Complete typography audit (AGENT-1): sizes/weights/leading vs baseline.
- Complete spacing/layout audit (AGENT-2): gaps/padding/touch targets; mobile gap-2, desktop gap-3 defaults.
- Colors/theming audit (AGENT-3): hardcoded palette -> tokens; verify dark mode parity on high-traffic pages.

## Phase 2 — Frontend UX & Boundaries
- Enforce component boundaries: primitives in `components/ui`, composites in `components/common`, route-owned UI under route groups.
- Migrate unnecessary `"use client"` components to server; move data fetching out of client components.
- Enforce next-intl routing: replace localized `next/navigation` usage with `@/i18n/routing` helpers; ensure locale-agnostic hrefs.
- Accessibility sweep: focus rings, aria labels, keyboard navigation for dialogs/menus; fix auth/checkout/seller flows.

## Phase 3 — Caching & Data Hygiene (Backend)
- Audit cached functions/components: apply `'use cache'` + `cacheLife(<profile>)` + `cacheTag()`; remove per-user data from cached paths.
- Ensure `revalidateTag(tag, profile)` signature everywhere; add `generateStaticParams()` for `[locale]` and key static segments.
- Data fetching: replace `select('*')`/wide joins with field projections; clamp pagination/filter params; add schema validation for mutations.
- Add targeted cache tags for product/category/deal endpoints to avoid broad invalidations.

## Phase 4 — Security & Platform Readiness
- Supabase: enable leaked password protection; clear advisor warnings; validate RLS coverage for all write paths; ensure admin client only used server-side.
- Stripe: configure products/prices and webhook secrets; validate webhook idempotency and environment variables.
- Middleware/proxy: confirm BG geo default is intended; add tests for i18n + geo + session update; ensure matcher continues to skip static assets.

## Phase 5 — Tooling, Tests, and Performance
- Playwright: enable free-port selection in `playwright.config.ts`; keep smoke stable.
- Tailwind scan scripts: reduce false positives; keep reports actionable.
- Bundle analyzer runs for large pages; lazy-load heavy visuals.
- Add unit coverage for middleware/proxy and critical lib helpers.

## Verification per Batch
- Minimum: `tsc` + `e2e:smoke`.
- If touching auth/checkout/seller flows: run relevant Playwright specs.
- If changing caching/data: add unit tests where possible and re-run smoke.
- Document what changed + how verified in each PR/batch.
