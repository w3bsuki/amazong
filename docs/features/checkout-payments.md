# Feature: Checkout & Payments

## What it does
Cart → Stripe Checkout → webhook processes payment → order created.
Stripe Connect handles seller payouts with escrow/delayed release.

## Key files
- `app/[locale]/(checkout)/` — Checkout route group (UI)
- `app/[locale]/(checkout)/_actions/checkout.ts` — Checkout server action
- `app/api/checkout/webhook/route.ts` — Stripe checkout webhook (creates orders)
- `app/api/payments/webhook/route.ts` — Stripe payments webhook (boosts, saved cards)
- `app/api/subscriptions/webhook/route.ts` — Subscription webhook
- `app/api/connect/webhook/route.ts` — Stripe Connect account status
- `app/api/connect/onboarding/route.ts` — Stripe Connect onboarding flow
- `lib/stripe.ts` — Server-side Stripe instance
- `lib/stripe-connect.ts` — Connect utilities, fee calculations
- `lib/env.ts` — Environment variables (validated access, supports secret rotation)
- `app/actions/payments.ts` — Payment actions (saved cards, setup mode)

## How it works
**Checkout flow:** Cart → checkout action creates Stripe Checkout Session → redirect to Stripe → payment → webhook → order created in DB → success page.

**Webhook safety:**
1. Verify signature with `stripe.webhooks.constructEvent()` FIRST
2. Only then use `createAdminClient()` for DB writes
3. Idempotency: orders keyed by `stripe_payment_intent_id`, boosts by `stripe_checkout_session_id`

**Fee model:** Fees configured in DB (`subscription_plans`). Runtime: `getFeesForSeller()` + `calculateTransactionFees()` in `lib/stripe-connect.ts`. Never hardcode fees in UI.

**Secret rotation:** `STRIPE_WEBHOOK_SECRET` supports comma/newline-separated values for zero-downtime rotation.

## Conventions
- HIGH-RISK: Changes need human approval
- Webhook handlers exit early for unrelated session modes
- Checkout webhook ignores `subscription` and `setup` mode sessions
- All fee calculations server-side only

## Dependencies
- Stripe + Stripe Connect
- Supabase admin client (service role, bypasses RLS)
- Zod for webhook payload validation

## Last modified
- 2026-02-16: Documented during docs system creation
