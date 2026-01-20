# Stripe Audit Checklist

Start with: `docs/BACKEND.md` and `docs/PRODUCTION.md`.

## Webhooks
- [ ] Exactly one canonical boost handler exists (not duplicated).
- [ ] Orders/subscriptions/payment-method webhooks are separate and correct.
- [ ] Each endpoint uses the correct signing secret env var.

## Idempotency
- [ ] Orders: idempotent by `stripe_payment_intent_id`.
- [ ] Subscriptions: idempotent by `stripe_subscription_id`.
- [ ] Boosts/one-time: idempotent by `stripe_checkout_session_id`.

## Connect
- [ ] Seller payout readiness is enforced in seller flows (if payouts are in-scope).
- [ ] Account type (individual/company) maps cleanly to onboarding UX.

## Pricing/fees
- [ ] Fee calculation is driven by DB plan configuration (see `docs/PRODUCT.md`).
