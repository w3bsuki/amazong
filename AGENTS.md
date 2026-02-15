# AGENTS.md — Treido
> Self-contained execution contract for coding agents.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-15 |
| Refresh cadence | Weekly + whenever workflow/gates change |

## Stack
Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Stripe, next-intl.

## Product
Treido is a mobile-first marketplace built on Next.js, Supabase, Stripe, Tailwind CSS v4, and shadcn/ui.
Current phase: production hardening and launch-readiness.
P0 flows: auth, browse/search/category discovery, listings, checkout/order lifecycle, messaging, payouts.
Out of scope for current execution: native apps, auctions/bidding, and large post-launch initiatives.

## Key Rules (Non-Negotiable)
1. Parse at the boundary with Zod, then trust typed data inside.
2. Code and migrations are runtime truth; docs must follow code.
3. Use semantic tokens only; no palette classes, raw hex, or token-alpha hacks.
4. Use `supabase.auth.getUser()` for auth checks, not `getSession()`.
5. Avoid `select('*')` in hot paths; project required columns explicitly.
6. Use the correct Supabase client per context (server/static/route/admin/browser).
7. Keep route-private `_components/`, `_actions/`, `_lib/`, `_providers/` private.
8. Verify webhook signatures before any DB write; keep handlers idempotent.
9. Default to Server Components; add `"use client"` only when needed.
10. High-risk domains (DB/auth/payments/destructive operations) require human approval.

## Context Loading
Always loaded: this file (`AGENTS.md`).

Then load ONE doc matching task scope:

| Task Type | Load |
|---|---|
| Any code change | `ARCHITECTURE.md` |
| Workflow, verification, risk | `docs/GUIDE.md` |
| UI, frontend, design | `docs/DESIGN.md` |
| Domain-specific (auth/db/payments/api/routes/i18n) | `docs/DOMAINS.md` |
| Quality audit | `docs/QUALITY.md` |

Load only if task requires:
- Feature requirements: `REQUIREMENTS.md`
- Task backlog: `TASKS.md`
- Decision history: `docs/DECISIONS.md`
- DB schema reference: `docs/generated/db-schema.md`
- Legal/help content: `docs/public/**`

## Execution Rules
Execution loop:
1. Frame: define goal, scope boundaries, and risk lane.
2. Implement: ship small, scoped batches.
3. Verify: run matching mechanical gates.
4. Report: files changed, verification status, assumptions/risks/follow-ups.

General rules:
- Keep batches small and scope-bound.
- Prefer mechanical checks over prose interpretation.
- If docs and code disagree, trust runtime code/migrations and then update docs.

Verification baseline:
```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based verification:
```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

Docs gates (run when docs structure/contracts change):
```bash
pnpm -s docs:check
pnpm -s docs:advisory
```

## High-Risk Pause
Stop and get human approval before finalizing DB/auth/payments/destructive-operation changes; see `docs/GUIDE.md` for full stop-and-ask policy, approval log format, and rollback expectations.

## Output Contract
Every implementation response must include:
1. Files changed (modified/created/deleted)
2. Verification commands run with pass/fail outcomes
3. Assumptions, risks, and deferred follow-ups

*Last updated: 2026-02-15*
