# [13] Product Detail Page (PDP)

> Full product page: gallery · info · seller · reviews · actions · related

## What Must Work

- PDP at `/[username]/[productSlug]`
- Image gallery (swipeable on mobile)
- Product info — title, price, condition, description, attributes
- Seller card with rating, follow button
- Add to cart / Buy now buttons
- Product reviews section
- Category badge
- Share product
- Report product
- Related/similar products

**Key principle:** Desktop/mobile should be responsive CSS, not separate component trees.

## Files to Audit

```
app/[locale]/[username]/[productSlug]/  → page.tsx + _components/ (desktop/, mobile/, pdp/)

app/actions/reviews.ts
app/api/products/[id]/view/
app/api/products/quick-view/
app/api/assistant/find-similar/

lib/data/product-page.ts
lib/data/product-reviews.ts
lib/view-models/product-page.ts
components/shared/product/pdp/category-badge.tsx
```

## Instructions

1. Read every file listed above
2. Audit for: desktop/mobile component duplication, over-componentization in pdp/, dead code
3. Refactor — same features, less code, responsive instead of separate trees
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, AI find-similar API, image CDN URLs.
