# [7] Cart & Wishlist

> Add to cart · Cart page · Wishlist · Shared wishlist · Persistence

## What Must Work

- Add product to cart (persisted)
- Cart page with items, quantities, pricing summary
- Cart icon with badge count in header
- Remove from cart / update quantity
- Proceed to checkout from cart
- Wishlist add/remove (heart button)
- Wishlist page with grid
- Share wishlist via token URL
- Cart/wishlist drawers on mobile

## Files to Audit

```
app/[locale]/(main)/cart/
app/[locale]/(main)/wishlist/
app/[locale]/(main)/wishlist/shared/[token]/
app/[locale]/(account)/account/wishlist/

components/providers/cart-context.tsx
components/providers/wishlist-context.tsx
components/shared/wishlist/
components/layout/header/cart/
components/mobile/drawers/cart-drawer.tsx
components/dropdowns/wishlist-dropdown.tsx

app/api/wishlist/[token]/
```

## Instructions

1. Read every file listed above
2. Audit for: scattered state/UI across too many locations, over-engineering, duplication
3. Refactor — same features, less code, consolidate cart/wishlist each to minimal files
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, API response shapes.
