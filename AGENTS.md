# AGENTS.md — Treido

Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Stripe, next-intl.
Mobile-first marketplace. Phase: production hardening and launch-readiness.

## Rules
1. Zod at boundaries, typed data inside.
2. Code > docs. If they disagree, trust code, then update docs.
3. Semantic tokens only — no palette classes, raw hex, or token-alpha.
4. `supabase.auth.getUser()` not `getSession()` for auth checks.
5. No `select('*')` in hot paths; project required columns.
6. Correct Supabase client per context (server/static/route/admin/browser).
7. Route-private `_components/`, `_actions/`, `_lib/`, `_providers/` stay in their route group.
8. Webhook signatures verified before any DB write. Handlers idempotent.
9. Server Components by default. `"use client"` only when needed.
10. DB/auth/payments/destructive changes need human approval before merge.

## Context (load ONE per task)
| Task | Read |
|------|------|
| Code change | `ARCHITECTURE.md` |
| UI / frontend | `docs/DESIGN.md` |
| Auth / DB / payments / API / routes / i18n | `docs/DOMAINS.md` |
| Why a pattern exists | `docs/DECISIONS.md` |

Load only when needed: `REQUIREMENTS.md`, `TASKS.md`, `docs/generated/db-schema.md`.

## Verify
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```
When touching business logic: `pnpm -s test:unit`
When touching user flows: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

## High-Risk Pause
Stop and get human approval before finalizing changes to:
- DB schema, migrations, or RLS policies
- Auth/session/access control
- Payments/webhooks/billing
- Destructive or bulk data operations

## Output
1. Files changed (modified/created/deleted)
2. Verification commands run + pass/fail
3. Assumptions, risks, follow-ups

*Last updated: 2026-02-15*
