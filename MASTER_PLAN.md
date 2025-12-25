# Master Plan (Index)

This repo’s active plan is intentionally consolidated into existing top-level markdown files (there is no `docs/` planning tree in this workspace).

## Canonical execution plan

- [STRUCTURE.md](STRUCTURE.md) — the phased plan we will follow (ownership rules, phase gates, acceptance criteria).

## UX alignment (correctness-first)

- [UX.md](UX.md) — UX correctness + frontend/backend alignment plan (recommended before broad cleanup/dependency pruning).

## Post-refactor product plan

- [PRODUCT_IMPROVEMENTS_PLAN.md](PRODUCT_IMPROVEMENTS_PLAN.md) — UI/UX + behavior improvements to execute after the structural refactor.

## Evidence / inputs (read before deleting anything)

- [cleanup/FULL_CODEBASE_AUDIT.md](cleanup/FULL_CODEBASE_AUDIT.md) — audit results (dead code, duplicates, cycles).
- [cleanup/FILE_INVENTORY.md](cleanup/FILE_INVENTORY.md) — used/unused inventory (treat as a lead, not a verdict).

## Execution checklists

- [production/02-CLEANUP.md](production/02-CLEANUP.md) — deletion + dependency cleanup workflow (Windows/PowerShell oriented).
- [cleanup/CLEANUP_EXECUTION_PLAN.md](cleanup/CLEANUP_EXECUTION_PLAN.md) — older checklist, now aligned to the canonical workflow.
- [production/03-REFACTOR.md](production/03-REFACTOR.md) — refactor notes; deferred items are explicitly marked.

## How to run in a new chat

“Use [STRUCTURE.md](STRUCTURE.md) as the single source of truth. Use the audit/inventory files only as inputs. Do not delete anything without verifying references and passing the gates.”
