# [12] Product Boosts

> Boost listing for visibility · Stripe checkout · Webhook activation · Display

## What Must Work

- Seller can boost a listing (pay via Stripe)
- Boost creates a Stripe checkout session
- Webhook confirms payment → activates boost in DB
- Boosted products show visual indicator
- Boost duration/status tracking
- Plan-based boost limits

## Files to Audit

```
app/actions/boosts.ts
app/api/boost/checkout/
app/api/payments/webhook/

lib/boost/boost-status.ts
```

## Instructions

1. Read every file listed above
2. Audit for: dead code, scattered logic, over-engineering
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** Stripe webhook signature verification, DB schema.
