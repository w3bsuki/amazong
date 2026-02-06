---
name: treido-backend
description: Backend orchestrator for Treido. Use to route data/auth/payments work to the right specialist (Supabase, auth, Stripe, caching/Next.js server patterns).
---

# treido-backend

Backend orchestration skill for Treido. This skill routes tasks to backend specialists and enforces rails before execution.

## When to Apply

- Multi-file backend tasks spanning API/auth/payments/data access.
- Cases where you need to choose between `treido-supabase`, `treido-auth-supabase`, and `treido-stripe`.
- Planning backend verification and rollout order.

## When NOT to Apply

- Pure UI styling/layout work with no backend surface.
- Tailwind/shadcn-only changes.
- Single isolated domain tasks where a specialist skill is sufficient directly.

## Non-Negotiables

- Apply `treido-rails` first for safety and pause rules.
- Route DB query design to `treido-supabase`.
- Route session/access logic to `treido-auth-supabase`.
- Route billing/webhooks to `treido-stripe`.
- Respect pause conditions for DB/auth/payments/destructive operations.

## Routing Matrix

| Task Type | Primary Specialist |
|-----------|--------------------|
| Supabase query/model/RLS | `treido-supabase` |
| Session/cookie/protected routes | `treido-auth-supabase` |
| Checkout/webhooks/idempotency | `treido-stripe` |
| App Router server/caching boundaries | `treido-nextjs-16` |

## Output Template

```md
## Specialist
- <primary skill + why>

## Plan
- <2-6 concrete steps>

## Risks
- <auth / rls / idempotency / cache purity>

## Verification
- <exact commands and checks>
```

## References

- `docs/AGENTS.md`
- `docs/WORKFLOW.md`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/DATABASE.md`
- `docs/PAYMENTS.md`
- `docs/AUTH.md`
