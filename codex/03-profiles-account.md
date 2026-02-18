# [3] Profiles & Account Settings

> Public profile · Edit profile · Account settings · Security · Addresses · Billing · Payments · Following

## What Must Work

- Public profile at `/[username]` — stats, listings, reviews
- Edit profile — name, bio, avatar upload
- Account settings — email, preferences, notifications
- Security — password change
- Addresses — add/edit/delete saved addresses
- Billing — invoices
- Payment methods — saved cards via Stripe SetupIntent
- Following — list of followed sellers
- Wishlist management — see [7] Cart & Wishlist

**Key principle:** `/account` is for settings and personal management. Dashboard/analytics/charts belong in `/dashboard` (see [4] Business Dashboard), not here.

## Files to Audit

```
app/[locale]/(account)/                 → All pages + _components/ + @modal/
app/[locale]/[username]/                → Public profile + _components/

app/actions/profile.ts
app/actions/payments.ts
app/actions/seller-follows.ts
app/actions/blocked-users.ts
app/actions/username.ts

components/providers/wishlist-context.tsx
components/shared/wishlist/
hooks/use-badges.ts
lib/data/profile-page.ts
lib/cache/revalidate-profile-tags.ts
```

## Instructions

1. Read every file listed above
2. Audit for: dead code, duplication with `(business)`, over-engineering, dashboard UI that shouldn't be in account
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, Stripe customer/payment method APIs, auth logic.
