# Queue Index

Specs ready to be started, in priority order:

## P0 — Release Blockers (START HERE)
1. `p0-turbopack-crash/` — Fix Turbopack crash after sign-in
2. `p0-stripe-connect-500/` — Fix Stripe Connect onboarding 500
3. `p0-e2e-checkout-order/` — E2E test for full purchase flow

## P1 — Auth & Onboarding
4. `p1-auth-onboarding/` — Full auth + onboarding audit

## P2 — Seller Experience
_(Create specs when P0/P1 complete)_
- `p2-audit-listing/`
- `p2-audit-seller-dashboard/`
- `p2-audit-order-fulfillment/`
- `p2-audit-payouts/`

## P3 — Buyer Experience
_(Create specs when P0/P1 complete)_
- `p3-audit-browse/`
- `p3-audit-search/`
- `p3-audit-pdp/`
- `p3-audit-cart-checkout/`
- `p3-audit-order-tracking/`

## P4 — Payments & Orders
_(Create specs when P2/P3 in progress)_
- `p4-audit-stripe-checkout/`
- `p4-audit-webhooks/`
- `p4-audit-order-lifecycle/`
- `p4-audit-reviews/`

## P5 — Architecture
_(Create specs when ready for polish)_
- `p5-audit-nextjs/`
- `p5-audit-typescript/`
- `p5-audit-supabase/`

## P6 — Performance & Polish
_(Create specs last)_
- `p6-audit-performance/`
- `p6-audit-a11y/`
- `p6-audit-i18n/`

---

## How to Start a Spec

```bash
# Move from queue to active
mv .specs/queue/<spec-name> .specs/active/

# Start working
TREIDO: Work on .specs/active/<spec-name>
```
