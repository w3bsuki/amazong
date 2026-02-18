# [8] Checkout & Payments

> Checkout flow · Stripe payment · Address · Shipping · Success · Webhooks

## What Must Work

- Checkout page with order summary, address selection, shipping method, payment
- Stripe Checkout Session creation
- Webhook receives `checkout.session.completed` → creates order in DB
- Webhook is idempotent (no duplicate orders on event replay)
- Checkout success page with order confirmation
- Stripe environment separation (test vs prod keys)
- Fee calculation via `lib/stripe-connect.ts`

## Files to Audit

```
app/[locale]/(checkout)/                → All pages + _actions/ + _components/
app/api/checkout/webhook/route.ts

lib/stripe.ts
lib/stripe-connect.ts
lib/stripe-locale.ts
lib/env.ts
```

## Instructions

1. Read every file listed above
2. Audit for: dead code, over-engineering, webhook correctness, idempotency
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** Stripe webhook signature verification, `constructEvent()` calls, DB schema.
**Launch blockers:** LAUNCH-001 (webhook idempotency), LAUNCH-003 (env separation) — verify these work.
