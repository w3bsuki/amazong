# Phase 02 - Data Layer and API Consolidation

## Objective

Consolidate Supabase query patterns and API contracts while preserving behavior.

## Context7 docs used (date + links)

- Date: 2026-02-07
- https://github.com/supabase/ssr/blob/main/docs/design.md
- https://context7.com/supabase/ssr/llms.txt
- https://context7.com/supabase/supabase-js/llms.txt

## Checklist

- [x] Enforce server/browser client boundaries.
- [x] Consolidate repeated select strings into `lib/supabase/selects/*`.
- [x] Ensure bounded list queries and explicit error handling.
- [x] Audit API route usage and remove dead routes only with compatibility checks.
- [x] Normalize shared action/route response envelopes.
- [x] Run full gates and record output.

## Files touched

- `lib/supabase/selects/billing.ts`
- `lib/api/envelope.ts`
- `app/actions/subscriptions.ts`
- `app/actions/payments.ts`
- `app/actions/boosts.ts`
- `app/[locale]/(account)/account/payments/payments-content.tsx`
- `app/api/boost/checkout/route.ts`
- `app/api/subscriptions/checkout/route.ts`
- `app/api/billing/invoices/route.ts`
- `app/api/subscriptions/portal/route.ts`
- `app/api/payments/setup/route.ts`
- `app/api/payments/delete/route.ts`
- `app/api/payments/set-default/route.ts`

## API route usage audit (2026-02-07)

- Scope audited: every `app/api/**/route.ts` endpoint.
- Classification result:
  - `internally-used`: 14
  - `compatibility-public`: 32
  - `removal-candidate`: 1 (`/api/badges/feature/[badgeId]`)
- Compatibility decision:
  - `/api/subscriptions/*` and `/api/payments/*` remain **compatibility-public** this phase (documented, payment-facing contracts).
  - No route removals in Phase 02 due compatibility/public-contract risk without runtime traffic evidence.

## Verification output

- `pnpm -s typecheck`: pass
- `pnpm -s lint`: pass (warnings only, 377 warnings)
- `pnpm -s styles:gate`: pass
- `pnpm -s test:unit`: pass (29 files, 405 tests)
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`: pass (22 passed, 2 skipped)
- Focused boundary audit:
  - no `createClient()` usage under `app/api/**`
  - `createRouteHandlerClient(...)` usage under `app/api/**`: 20 files
  - no client-component service-role leakage found in touched paths

## Decision log

- Added canonical billing select constants in `lib/supabase/selects/billing.ts` and migrated billing/payment/checkout flows to them.
- Removed duplicated inline select strings (`stripe_customer_id`, payment-method ownership verification tuple) in touched actions/routes.
- Updated cookie propagation in `app/api/billing/invoices/route.ts` and `app/api/payments/setup/route.ts` so all response branches apply pending auth cookies.
- Added shared additive response-envelope helper in `lib/api/envelope.ts` and normalized touched actions/routes to include `success: true|false` while preserving existing top-level payload keys (`url`, `error`, `errorKey`, `sessionId`, `invoices`, `charges`, etc.).
- Added HTTP method compatibility for `app/api/payments/delete/route.ts` (`POST` + `DELETE` equivalent handling).
- Updated the payments action consumer (`app/[locale]/(account)/account/payments/payments-content.tsx`) to preserve existing UX with normalized action envelopes.

## Done

- [x] Phase 02 complete
