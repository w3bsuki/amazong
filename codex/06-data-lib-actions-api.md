# Data, Lib, Actions, And API Audit

## Scope

- `lib/**`
- `hooks/**`
- `app/actions/**`
- `app/api/**`

## Current State Summary

- Shared data layer exists but several API routes/actions still reimplement logic locally.
- Monolithic action files are major complexity hotspots.

## Findings

## P0

- Category tree and transformation logic duplicated between:
  - `lib/data/categories.ts` (`754 lines`)
  - `app/api/categories/route.ts` (`306 lines`)
- Product normalization/helper duplication between:
  - `lib/view-models/product-page.ts` (`220 lines`)
  - `lib/data/product-page.ts` (`330 lines`)

## P1

- `app/api/products/newest/route.ts` (`332 lines`) and other product routes duplicate filter/transform behavior that belongs in `lib/data/products`.
- Action files are oversized and multi-concern:
  - `app/actions/orders.ts` (`947 lines`)
  - `app/actions/products.ts` (`828 lines`)
  - `app/actions/username.ts` (`665 lines`)

## P2

- Hook-local helper duplication (debounce/storage/etc.) can be consolidated.
- Inconsistent naming and exports across actions/routes increases cognitive load.

## Simplification Targets

1. Make `lib/data/*` canonical for transformation and tree-building logic.
2. Keep `app/api/*` as thin HTTP adapters.
3. Split large actions by concern and reuse shared helpers.
4. Consolidate hook utility helpers where reuse exists.

## Candidate Refactor Order

1. Consolidate category tree logic.
2. Consolidate product-page helper logic.
3. Route product APIs through canonical data helpers.
4. Split monolithic action files (`orders`, `products`, `username`).
5. Consolidate shared action auth guard helper.

## Success Criteria

- No duplicated core transform/tree logic in API routes.
- Reduced action file sizes and clearer concern boundaries.
- Better tree-shaking surface through focused module exports.
