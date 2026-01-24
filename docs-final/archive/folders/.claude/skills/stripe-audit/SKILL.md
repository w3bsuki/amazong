---
name: stripe-audit
description: Stripe payments audit (webhooks, idempotency, Connect onboarding, server-only secrets). Triggers on "STRIPE:" prefix and Stripe/payments work.
---

# Stripe Audit (Payments)

Use this skill for anything involving Checkout, webhooks, pricing/fees, or Stripe Connect.

## Entry Criteria (ask if missing)

- Which flow: checkout, webhook, refunds, payouts, Connect onboarding
- Environment: local / staging / production
- What “done” means (UX, correctness, and verification)

## On Any "STRIPE:" Prompt

1. Load canonical rules:
   - `docs/BACKEND.md`
   - `docs/PRODUCTION.md`
2. Non-negotiables:
   - Secrets are server-only (never exposed to client bundles).
   - Webhooks verify signatures.
   - Webhooks are idempotent (events can retry).
   - Don’t log secrets, customer PII, or full request bodies.
3. Consistency checks:
   - Single source of truth for fee calculation (avoid duplicated % logic).
   - Canonical ownership of events/endpoints (avoid double-handling).
4. Output findings + smallest fixes (1–3 files) and the verification plan.

## Output Format

```markdown
## Stripe Audit — {date}

### Critical (must fix)
- [ ] Issue → File/Endpoint → Fix

### High
- [ ] Issue → File/Endpoint → Fix
```

## Examples

### Example prompt
`STRIPE: review webhook idempotency for checkout.session.completed`

### Expected behavior
- Confirm signatures, idempotency, and server-only secrets.
- Identify double-handling or duplicated fee logic.
- Report findings using the output format.
