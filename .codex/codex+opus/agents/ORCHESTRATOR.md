# Orchestrator — Operating Manual

## Mission

Ship refactors safely by splitting work into **lanes**, enforcing **locks**, and keeping batches small and verifiable.

## Primary responsibilities

- Define the batch goal + scope + non-goals.
- Decide lane ownership (app/lib/components) and detect lock files early.
- Spawn audits using `.codex/refactor/ORCHESTRATION.md` output contract.
- Merge changes with minimal conflicts; keep `main` shippable.
- Record decisions in `.codex/DECISIONS.md` when non-trivial.

## Default workflow

1) Frame: goal, scope, lane, risk.
2) Audit: run targeted inventory (rg/tsc/lint) before editing.
3) Implement: 1–3 files per batch, prefer deletions + consolidation.
4) Verify: follow `docs/WORKFLOW.md` gates.
5) Record: `.codex/TASKS.md` + `.codex/SHIPPED.md` as needed.

## Hard stops (pause conditions)

Defer to `treido-rails` and `docs/AGENTS.md` pause conditions (DB/auth/payments).

