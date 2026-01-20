# Product Rules — Accounts, Badges, Plans, Fees

This folder is for **business rules** that must be implemented consistently in DB + backend + UI.

## Account types (core)
- `personal`: default for Bulgarian C2C adoption.
- `business`: gated dashboard features + different fees/tier limits.

## Badges (UX rules)
Keep badges as **derived state** (computed from DB):
- New seller: personal account, recently onboarded (or low sales/reviews)
- Business: business account (optionally “verified” when verification is complete)

Do not hardcode colors/icons per-page; treat badge as a variant rendered by the design system.

## Plans & fees (source of truth)
Reference: `PLAN-monetization-strategy.md`.
- Plans must live in DB (`subscription_plans`) and be the single source for:
  - buyer protection percent/fixed/cap
  - seller fee percent (business)
  - listing limits, boosts included, badge type
- Stripe product/price ids map to DB plans deterministically.

