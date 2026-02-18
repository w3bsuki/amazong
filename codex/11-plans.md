# [11] Plans & Subscriptions

> Pricing page · Stripe subscriptions · Customer portal · Plan limits · Webhooks

## What Must Work

- Plans page at `/plans` showing tiers (Free, Pro, Business, etc.)
- Subscription checkout via Stripe
- Stripe customer portal for managing subscription
- Plan limits enforced (listing count, boosts, features)
- Upgrade prompts in relevant places
- Plan display in account
- Webhook handles subscription events (create, update, cancel)

## Files to Audit

```
app/[locale]/(plans)/
app/[locale]/(account)/account/plans/
app/[locale]/(account)/account/plans/upgrade/
app/[locale]/(business)/dashboard/upgrade/

app/actions/subscriptions.ts
app/api/subscriptions/checkout/
app/api/subscriptions/portal/
app/api/subscriptions/webhook/
app/api/plans/

lib/data/plans.ts
```

## Instructions

1. Read every file listed above
2. Audit for: duplication across the three plan/upgrade locations, dead code, over-engineering
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** Stripe subscription API calls, webhook signature verification, DB schema.
