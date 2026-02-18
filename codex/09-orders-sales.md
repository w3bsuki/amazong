# [9] Orders & Sales Management

> Buyer orders · Seller sales · Order detail · Timeline · Shipping · Tracking · Export

## What Must Work

- Buyer: order list at `/account/orders` with status, tracking
- Buyer: order detail at `/account/orders/[id]` with timeline
- Buyer: mark order as "received" with proof screenshot
- Seller: sales list at `/account/sales` with stats
- Seller: mark order as "received" (acknowledged), then "shipped" with tracking
- Order timeline showing all status changes
- Order notifications via chat (see [10])
- Sales export (CSV)
- Status flow: pending → confirmed → shipped → delivered → completed

## Files to Audit

```
app/[locale]/(account)/account/orders/
app/[locale]/(account)/account/orders/[id]/
app/[locale]/(account)/account/sales/
app/[locale]/(sell)/sell/orders/
app/[locale]/(business)/dashboard/orders/
app/[locale]/(business)/dashboard/orders/[orderId]/

app/actions/orders.ts
app/api/orders/[id]/ship/
app/api/orders/[id]/track/
app/api/sales/export/

lib/order-status.ts
lib/order-conversations.ts
lib/validation/orders.ts
```

## Instructions

1. Read every file listed above
2. Audit for: duplication across the three order locations, dead code, over-engineering
3. Orders exist in `(account)`, `(sell)`, and `(business)` — consolidate shared components
4. Refactor — same features, less code, one set of order components
5. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
6. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, order status enum values, webhook handlers.
