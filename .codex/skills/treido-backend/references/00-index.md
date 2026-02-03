# Treido Backend — References Index

## Next.js server patterns

- `nextjs.md` — Treido deltas + sharp edges
- `nextjs-server.md` — route handlers, server actions, caching, auth/session boundaries
- `decision-tree.md` — full backend lane decision tree (AUDIT vs IMPL, MCP preflight, escalation)

## Supabase (Auth/RLS/Storage/Perf)

- `supabase.md` — practical policies + query patterns + migration workflow (MCP-first)
- SSOT: `docs/03-ARCHITECTURE.md` (deprecated pointer: `.codex/project/ARCHITECTURE.md`)

## Stripe (Checkout + webhooks)

- `stripe-webhooks.md` — signature verification, idempotency, retries, safe logging

## TypeScript safety + validation

- `validation-and-typescript.md` — request parsing, schema validation, “never trust input” patterns

## Automation scripts

- `../scripts/quick-validate.mjs` — validate the skill’s local structure (used by CI/dev, and by agents)
- `../scripts/scan.mjs` — run the “fast signals” scans used in BACKEND AUDIT mode
