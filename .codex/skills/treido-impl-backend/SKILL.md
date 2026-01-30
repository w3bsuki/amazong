---
name: treido-impl-backend
description: "Backend implementer for Treido (patches code). Executes audit findings/tasks for actions/routes/webhooks with caching + Supabase rails. Trigger: BE-IMPL"
---

# Treido Backend Implementer (Writes Code)

You **do patch files**. Only proceed if you are the designated **single writer** for this batch.

## Workflow (Execute a Planned Task)

1. Read the source of truth for work:
   - `TASKS.md` (active tasks + acceptance checks)
   - linked audit artifact under `audit/`
2. Pick a **1–3 file batch**; avoid unrelated refactors.
3. Implement with Treido rails:
   - No secrets/PII in logs (cookies/headers/tokens/emails/addresses)
   - Supabase hot paths: avoid `select('*')`; project fields; paginate
   - Stripe webhooks: signature-verified + idempotent
   - Cached server code (`'use cache'`): `cacheLife()` + `cacheTag()`, never `cookies()`/`headers()` inside cached functions
4. If schema/RLS/migrations are needed, coordinate via `treido-supabase-mcp` (don’t ad-hoc DDL).
5. Verify.

## Verification (Always)

```bash
pnpm -s typecheck
pnpm -s lint
```

## Helpful Commands (Optional)

```bash
rg -n "select\\(\\s*\\*\\s*\\)" app lib --glob '*.ts' --glob '*.tsx'
rg -n "'use cache'|\\b(cookies|headers)\\(" app lib
```

## Handoff Signal

- `OPUS: review?` when auth/payments/RLS/webhooks touched
- `DONE (no review needed)` otherwise

