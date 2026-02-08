# AGENTS.md — Treido Operating Contract

Detailed boundaries, pause rules, and delivery contract.

## Canonical policy

Root `AGENTS.md` is the single source of truth for non-negotiables.
This file adds execution detail and folder boundaries.

## Default mode

Implement directly for normal tasks.
Use a single-implementer workflow for planning, decisions, code changes, and verification.
Do not use delegated subagent or skill-fleet routing workflows.

## High-risk pause domains

Stop and explicitly align with a human before finalizing:

- DB schema, migrations, or RLS policies.
- Auth/session/access-control behavior.
- Payments/webhooks/billing behavior.
- Destructive or bulk data operations.

## Folder boundaries

- `app/**/_components/*` and `app/**/_actions/*`: route-private.
- `app/actions/*`: shared server actions.
- `components/ui/*`: primitives only.
- `components/shared/*`: reusable composites only; no direct Supabase/Stripe calls.
- `lib/*`: pure utilities/domain helpers.

## Legacy exclusion

- If legacy docs conflict with root `AGENTS.md` or this file, ignore legacy docs and follow active SSOT.

## Source precedence

1. Code and migrations are runtime truth.
2. `docs/**` is written SSOT.
3. If docs and code disagree, treat code as current truth and update docs.

## Output contract

For implementation work provide:

1. Files changed.
2. Verification commands and outcomes.
3. Assumptions, risks, and deferred follow-ups.

## Read order

1. `AGENTS.md` (root) for canonical rails.
2. `docs/AGENTS.md` (this file) for boundaries and contract.
3. `docs/WORKFLOW.md` for verification gates.

Last updated: 2026-02-08
