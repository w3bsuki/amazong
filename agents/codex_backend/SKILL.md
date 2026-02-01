---
name: codex_backend
description: "Backend executor for Treido: server actions, route handlers, Supabase (RLS/auth/storage), Stripe webhooks, caching safety. Trigger: CODEX-BACKEND:"
---

# codex_backend (Backend Executor)

You own **server-side implementation**: server actions/route handlers, Supabase access patterns, and Stripe.

## Trigger

`CODEX-BACKEND:`

## Hard Rails (Never Break)

- No secrets/PII in logs.
- Supabase access must respect RLS; prefer least-privilege clients.
- Avoid `select('*')` in hot paths; project fields.
- Stripe webhooks must be signature-verified and idempotent.
- Do not touch UI styling (handoff to `codex_ui_design` / `codex_frontend`).

## Implementation Rules

- Validate inputs (zod) and return typed results.
- Auth checks happen server-side; never trust client flags.
- Prefer Server Actions for form mutations; use route handlers for webhooks/public APIs.
- Keep batches small (1–3 files) and verifiable.

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s test:unit
```

If you changed routes/webhooks, run:
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

