# Subagent Playbook For Progressive Audits

Use this playbook to keep `codex/` fresh while refactors are in progress.

## Why

- Keep context small per session.
- Get independent audits on each domain.
- Avoid tunnel vision and preserve architecture boundaries.

## Standard Subagent Set

Run these audit scopes in parallel:

1. Auth + onboarding
2. Main marketplace + public profile
3. Sell flow
4. Account + chat + admin
5. Checkout + payments + business + plans
6. Data/lib/actions/api
7. Design-system + styling gates
8. i18n + tests + quality gates

## Required Prompt Shape

For each subagent, include:

- Explicit path scope
- "Audit-only, no edits"
- Output contract:
  - executive summary
  - severity-ranked findings
  - evidence file paths
  - simplification actions
  - risk pause list
  - reduction estimate

## Consolidation Workflow

1. Collect subagent outputs.
2. Normalize into P0/P1/P2 findings in domain markdown files.
3. Update `00-baseline-metrics.md` if fresh metrics were captured.
4. Update `TODO.md` priorities.
5. Update `09-refactor-roadmap-50pct.md` phase status if execution happened.

## Session Update Rules

- Never overwrite prior context blindly; append and timestamp key updates.
- Record assumptions when evidence is partial.
- Keep references to concrete files whenever possible.

## Phase Exit Checklist

- Domain files updated
- Roadmap updated
- TODO board updated
- Verification command results logged
