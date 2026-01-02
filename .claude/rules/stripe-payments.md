---
paths: app/**/api/stripe/**/*.ts, app/**/api/webhooks/**/*.ts, lib/stripe*.ts
---

# Stripe Payments

## Non-negotiables

- **Never** handle Stripe secrets on the client
- Use server-side route handlers or server actions for Stripe calls
- Webhooks: validate signature with **raw request body** (don't parse before verification)
- Handle retries: webhook delivery is at-least-once; implement **idempotency**
- Reconcile Stripe → DB as source of truth (don't trust client redirect alone)

## Workflow

1. **Identify the operation**:
   - Creating checkout / payment intents
   - Handling webhooks
   - Reconciling orders/payments in DB

2. **Keep responsibilities clear**:
   - Stripe routes handle Stripe protocol concerns
   - Business logic lives in server actions / lib helpers

3. **Debugging**:
   - Confirm env vars exist (Stripe secret key, webhook secret)
   - Inspect the webhook route handler
   - Ensure idempotency for "create order" operations

## Verification

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- Build: `pnpm build` (after Stripe routes/actions changes)
- E2E: `pnpm test:e2e` (after checkout flow changes)

## Trigger Prompts

- "Add a Stripe checkout flow for buying a listing"
- "Fix webhook handler not updating orders"
- "Prevent duplicate order creation from retries"
