# Stripe — Target Payment Surface

## What Stripe is doing here
Reference: `docs/launch/PLAN-STRIPE.md`.

- Goods checkout (orders)
- Subscriptions (plans)
- Stripe Connect (seller payouts)
- One-time payments (e.g. listing boosts)

## Invariants (non-negotiable)
- Signature verification on all webhooks.
- Idempotent DB writes (stable Stripe ids).
- One canonical handler per concern (no double-processing across endpoints).
- Environment variables are explicit and consistent across staging/prod.

