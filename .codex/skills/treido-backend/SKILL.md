---
name: treido-backend
description: Treido backend development (server actions, route handlers, Stripe/webhooks, caching). Use for app/actions, app/api routes, auth/session, Supabase queries/perf; triggers on "BACKEND:" prefix.
deprecated: true
---

# Treido Backend

> Deprecated (2026-01-29). Use `treido-orchestrator` + `treido-impl-backend` (and `treido-audit-*` + `treido-verify`).

## Workflow (on any `BACKEND:` request)

1. Identify the entrypoint (route handler / action / webhook) and the contract (input/output, auth, error cases).
2. Keep changes shippable (1-3 files); split follow-ups if bigger.
3. No secrets/PII in logs (tokens, cookies, headers, emails, addresses); redact aggressively.
4. Supabase queries: avoid `select('*')` in hot paths; project fields (and paginate).
5. If schema/RLS/migrations/Storage/Auth are involved, switch to `treido-supabase-mcp` (MCP introspection + migrations).
6. Stripe webhooks: signature-verified + idempotent.
7. Cached server code (`'use cache'`): always `cacheLife()` + `cacheTag()`; never call `cookies()`/`headers()` inside cached functions.
8. Verify.

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
```

Optional (when relevant):

- `pnpm -s test:unit`
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

## Handoff signal

End task completion responses with:
- `OPUS: review?` when the change is cross-boundary or risky
- `DONE (no review needed)` otherwise

## References (load only if needed)

- `.codex/skills/treido-backend/references/nextjs.md`
- SSOT: `AGENTS.md`, `docs/ARCHITECTURE.md`
