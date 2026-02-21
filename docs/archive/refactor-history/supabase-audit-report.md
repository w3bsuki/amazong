# Supabase Audit + Refactor — Report

Completed: 2026-02-20

## Findings

- Client selection appears consistent with `docs/STACK.md`:
  - Cached/public reads in `lib/data/**` use `createStaticClient()` and keep `"use cache"` functions deterministic (no cookies/headers/`new Date()`).
  - Route handlers generally use `createRouteHandlerClient(request)` when cookies need to be applied.
  - No `select('*')` found (mechanically enforced; confirmed via scan).
- Performance hotspots worth follow-up (kept read-only in this pass):
  - Seller search aggregation loads large datasets and filters/paginates in JS (`app/[locale]/(main)/search/_lib/search-sellers.ts`).
  - Search count queries embed related profile fields primarily to enable predicates (`app/[locale]/(main)/search/_lib/search-products.ts`).
  - Some public list mappers rely on `as unknown as ...` because PostgREST select strings are not typed (`lib/data/products/**`).

## Changes Made

- No Supabase query/client changes were applied in this pass (avoided behavioral risk and auth/payments-sensitive surfaces).

## What Was NOT Changed (and why)

- DB schema, migrations, and RLS policies (`supabase/`): out of scope.
- Auth/session/access control logic and payments/webhooks routes: out of scope and require explicit human approval.

## Recommendations

- Refactor `searchSellers` to push paging/sorting/aggregation into SQL/PostgREST (bounded result sets) while preserving existing sort semantics.
- Where safe, prefer more precise typing of Supabase responses (or centralized boundary parsing) to reduce `as unknown as` drift in `lib/data/**`.

