# shadcn/ui Audit + Refactor — Report

Completed: 2026-02-20

## Findings

- `components/ui/*` primitives are clean: no `app/` imports, no Supabase usage, no data fetching, and no Next routing usage.
- CVA + semantic-token styling is consistently used and `pnpm -s styles:gate` passes.
- Marketplace-specific badge variants are correctly handled outside primitives via `components/shared/marketplace-badge.tsx` (keeps `components/ui/badge.tsx` variant surface minimal).

## Changes Made

- No shadcn primitive refactors were required in this pass.

## What Was NOT Changed (and why)

- No UI/UX changes were made (pixel parity preserved).
- No auth/payments/DB-sensitive areas were touched (out of scope).

## Recommendations

- Keep `components/ui/` primitive-only and continue routing/domain composition in `components/shared/` or route-private `_components/`.
- If more design-system composites accumulate (e.g., navigation shells), consider a dedicated folder (`components/layout/` or `components/mobile/`) to keep `components/ui/` strictly primitive.

