---
name: treido-stripe
description: Stripe integration specialist for Treido. Use for Checkout sessions, PaymentIntents, webhooks, idempotency, and go-live safety. Not for UI styling.
---

# treido-stripe

Treido Stripe specialist focused on production-safe checkout, webhook correctness, and payout/Connect workflows.

## When to Apply

- Creating or modifying checkout/session/payment flows.
- Webhook route changes for orders, subscriptions, boosts, or connect.
- Idempotency/event dedupe hardening.
- Live-readiness checks for Stripe configuration.

## When NOT to Apply

- Pure UI styling changes unrelated to Stripe behavior.
- General DB schema work with no Stripe integration impact.
- Auth/session-only work.

## Non-Negotiables

- Webhooks must verify signature before processing body.
- Webhooks must be idempotent (event dedupe and safe re-entry).
- Do not log full Stripe payloads or user PII.
- Prefer Checkout Sessions for on-session payments unless a concrete Treido flow requires PaymentIntents.
- Keep return URLs locale-safe and deterministic.
- Stripe/payment changes are high-risk and require explicit approval before execution.

## Treido-Specific Surfaces

- `/api/checkout/webhook`
- `/api/payments/webhook`
- `/api/subscriptions/webhook`
- `/api/connect/webhook`

## Verification Checklist

- Duplicate webhook event test does not duplicate side effects.
- Signature verification fails closed on invalid headers.
- Retry paths are safe (no duplicate orders/transfers).
- Locale return/cancel URLs resolve correctly (`/bg`, `/en`).

## Output Template

```md
## Scope
- <which stripe surface is changing>

## Safety Checks
- signature verification
- idempotency path
- logging hygiene

## Verification
- <commands/tests + manual checks>
```

## References

- `docs/PAYMENTS.md`
- `docs/LAUNCH.md`
- `docs/PRODUCTION-PUSH.md`
- `docs/AGENTS.md`
- `docs/WORKFLOW.md`
