# AGENTS.md — Treido Agent Contract

> Pointer-first execution contract for coding agents.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever workflow/gates change |

## Context Loading (Default)

Load only this default pack first:

1. `AGENTS.md`
2. `docs/INDEX.md`
3. `docs/PROJECT.md`
4. `docs/WORKFLOW.md`
5. `docs/QA.md`
6. `docs/RISK.md`

Then load deeper context only when task scope needs it:

- `REQUIREMENTS.md`
- `TASKS.md`
- `ARCHITECTURE.md`
- `docs/REFERENCE.md`
- `docs/PRINCIPLES.md`
- `docs/QUALITY.md`
- `docs/DECISIONS.md`

## Optional Context

- `docs/public/**` is runtime legal/help content. Load when editing policy/help/legal pages.
- `context/business/**` is archive-only strategy context and not implementation SSOT.
- `context/business/**` must not override runtime behavior, schema, API contracts, or test outcomes.

## Execution Rules

- Use one loop: frame -> implement -> verify -> report.
- Keep batches small and scope-bound.
- Prefer mechanical checks over prose interpretation.
- If docs and code disagree, code and migrations are runtime truth.

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

Docs gates:

```bash
pnpm -s docs:check
pnpm -s docs:advisory
```

## High-Risk Pause

Stop and ask a human before finalizing changes in:

- DB schema, migrations, RLS, or destructive data operations
- Auth/session/access control behavior
- Payments, webhooks, billing, payouts, refunds, or disputes

## Output Contract

Every implementation response must include:

1. Files changed (modified/created/deleted)
2. Verification commands run with pass/fail outcomes
3. Assumptions, risks, and deferred follow-ups

*Last updated: 2026-02-13*
