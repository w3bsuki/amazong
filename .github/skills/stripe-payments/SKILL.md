---
name: stripe-payments
description: Implement or debug Stripe integration in this repo (checkout flows, webhooks, payment intents, subscriptions, Stripe SDK usage). Use when editing payment routes, server actions touching Stripe, or diagnosing payment/webhook failures.
---

# Stripe payments (Repo Playbook)

## Non-negotiables

- Never handle Stripe secrets on the client.
- Prefer server-side route handlers (`app/**/route.ts`) or server actions for Stripe calls.
- Treat webhooks as untrusted input; validate signature and handle idempotency.

## Webhooks (critical)

- Stripe signature verification must use the **raw request body** (don’t parse before verification).
- Handle retries: webhook delivery is at-least-once; implement **idempotency** for state transitions.
- Reconcile Stripe → DB as the source of truth for payment state (avoid trusting client redirect alone).

## Workflow

1. Identify the operation:
   - Creating checkout / payment intents
   - Handling webhooks
   - Reconciling orders/payments in DB (often Supabase)

2. Keep responsibilities clear:
   - Stripe routes handle Stripe protocol concerns.
   - Business logic lives in server actions / lib helpers.

3. When debugging:
   - Confirm required env vars exist (Stripe secret key, webhook secret).
   - Inspect the route handler that processes the webhook.
   - Ensure idempotency for “create order” style operations.

## Verification

- Typecheck (when requested or before you call the task done): `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- Build (when you changed Stripe routes/actions): `pnpm build`
- E2E if checkout flow changes: `pnpm test:e2e`

## Examples

- “Add a Stripe checkout flow for buying a listing.”
- “Fix webhook handler not updating orders.”
- “Prevent duplicate order creation from retries.”
