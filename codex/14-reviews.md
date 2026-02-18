# [14] Reviews & Feedback

> Product reviews · Buyer feedback · Seller feedback · Ratings

## What Must Work

- Buyers can leave product reviews (rating + text)
- Buyer feedback on seller after order
- Seller feedback on buyer after order
- Ratings displayed on profiles and products

## Files to Audit

```
app/actions/reviews.ts
app/actions/buyer-feedback.ts
app/actions/seller-feedback.ts

lib/data/product-reviews.ts
```

## Instructions

1. Read every file listed above
2. Audit for: duplication across the three action files, dead code, over-engineering
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, review table structure.
