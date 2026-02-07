# AGENTS.md — Treido Operating Contract

Detailed boundaries, pause rules, and delivery contract.

## Canonical policy

Root `AGENTS.md` is the single source of truth for non-negotiables.
This file adds execution detail and folder boundaries.

## Default mode

Implement directly for normal tasks. Skills are optional specialist tools, not mandatory middleware.
Do not use subagents by default; use them only when the user explicitly requests them (for example, `run subagents`).
The main agent is the implementation owner for planning, decisions, and code changes.
If subagents are requested, default them to audit/search support only unless the user explicitly requests delegated code edits.

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

## Skills inventory (consolidated)

Canonical location: `.claude/skills/*`  
Codex compatibility mirror: `.agents/skills/*`

- `treido-styling`
- `treido-design`
- `treido-nextjs`
- `treido-data`
- `treido-payments`
- `treido-testing`
- `treido-a11y`

## Legacy exclusion

- `.codex/agents/*` and old orchestration playbooks are legacy archives, not runtime policy.
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
4. Path-local `*/AGENTS.md` for folder-specific rules.

Last updated: 2026-02-07
