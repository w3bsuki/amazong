# [4] Business Dashboard

> Seller dashboard for business accounts: products · orders · stats · analytics · settings

## What Must Work

- Dashboard overview at `/dashboard` with stats, quick actions, recent activity
- Products list — CRUD, edit via page
- Orders management — view, detail, ship, track
- Inventory tracking
- Analytics — charts, performance metrics
- Settings — business-specific configuration
- Upgrade plan prompt
- `requireDashboardAccess()` on all dashboard routes

**Key principle:** Marketing, discounts, accounting, customers pages — if they're empty shells with no real functionality, delete them. Only keep what actually works.

## Files to Audit

```
app/[locale]/(business)/                → All pages + _components/ + _lib/

lib/auth/business.ts
```

Also cross-reference with `(account)` to find duplication: stats cards, orders, activity feeds, sidebars, headers.

## Instructions

1. Read every file listed above
2. Audit for: empty shell pages, duplication with `(account)`, over-engineering, dead code
3. Delete empty placeholder pages that have no real content
4. Refactor — same features, less code
5. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
6. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, Stripe Connect, auth logic.
