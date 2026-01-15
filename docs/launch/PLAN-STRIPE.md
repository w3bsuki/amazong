# Stripe Production Plan (AI-Executable)

## Goal

Stripe must be deterministic and safe:
- correct webhook routing
- verified signatures
- idempotent DB writes
- production env vars correct

## 0) Inventory: what Stripe is used for in this repo

### Goods checkout (orders)
- Checkout session creation: `app/[locale]/(checkout)/_actions/checkout.ts` (`createCheckoutSession`)
- Webhook handler: `app/api/checkout/webhook/route.ts`
- Optional post-redirect verification: `verifyAndCreateOrder()` in the same action file

### Listing boosts (one-time payments)
Potential handlers exist in **multiple** places (must choose one canonical):
- `app/api/payments/webhook/route.ts` (boost via `checkout.session.completed`)
- `app/api/subscriptions/webhook/route.ts` (also processes listing boosts)

### Subscriptions (plans)
- Checkout: `app/api/subscriptions/checkout/route.ts`
- Portal: `app/api/subscriptions/portal/route.ts`
- Webhook: `app/api/subscriptions/webhook/route.ts`
- Server actions: `app/actions/subscriptions.ts`

### Saved payment methods (setup intents)
- Webhook: `app/api/payments/webhook/route.ts`
- Routes: `app/api/payments/setup`, `delete`, `set-default`

## 1) Environment variables (hard gate)

Required in deployment (Vercel):
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (supports multiple secrets split by comma/newline)
- `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SITE_URL` (used for auth redirects + sitemap)

**Acceptance:** app builds in production and can create a Stripe checkout session.

## 2) Webhook strategy (must avoid duplicates)

### 2.1 Decide canonical endpoints

Pick one of each:
- goods orders webhook: `app/api/checkout/webhook/route.ts`
- subscriptions webhook: `app/api/subscriptions/webhook/route.ts`
- saved payment methods webhook: `app/api/payments/webhook/route.ts`
- boosts webhook: pick **one** and remove/disable the other boost handler (recommended: consolidate boosts into the subscriptions webhook or payments webhook, but not both).

### 2.2 Configure Stripe dashboard accordingly

For each endpoint:
- set correct URL (production domain)
- subscribe to required event types only
- copy the signing secret into the correct env var

**Acceptance:** for a test event, signature verification succeeds and handler returns 200.

## 3) Idempotency and DB correctness checks

### 3.1 Orders

- Ensure order creation is idempotent by `stripe_payment_intent_id`.
- Confirm `order_items` inserts do not double-decrement stock (requires Supabase fixes).

### 3.2 Listing boosts

- Ensure idempotency uses a stable key (Stripe checkout session id is best).
- Ensure the product boost flags match the DB’s canonical boost record state.

### 3.3 Subscriptions

- Ensure idempotency uses `stripe_subscription_id`.
- Validate plan/price mapping (Supabase `subscription_plans` should match Stripe price ids).

## 4) End-to-end verification (hard gate)

Run these before launch:
- Manual: goods checkout (if in-scope) → order appears in DB and UI.
- Manual: subscription purchase → subscription row created/updated.
- Manual: listing boost purchase → listing_boost row created + product boost flags updated.

If you can, run:
- `pnpm test:e2e e2e/boost-checkout.spec.ts`
- `pnpm test:e2e e2e/orders.spec.ts` (requires test user credentials)

