# Workflow (SSOT)

This repo runs on a simple loop:

1. Capture the user report in `ISSUES.md`
2. Break it into small, verifiable steps in `TASKS.md`
3. Codex verifies the task list (scope/rails/completeness)
4. Implement tasks in small batches
5. Codex verifies implementation (gates + review)
6. Mark the issue/tasks done and update `REQUIREMENTS.md` when a feature is “locked”

## Roles (Claude ↔ Codex)

- **Opus/Claude**: implement, fix, create
- **Codex**: verify, review, run gates, prevent regressions

## Rails (non-negotiable)

- No secrets/PII in logs.
- All user-facing strings via `next-intl` (`messages/en.json` + `messages/bg.json`).
- No gradients; no arbitrary Tailwind values unless unavoidable.
- Small, verifiable batches (no rewrites / no redesigns).

## Canonical Docs (Root)

**Workflow layer** (frequently updated):
- `WORKFLOW.md` — this process
- `ISSUES.md` — issue registry
- `TASKS.md` — execution checklist
- `REQUIREMENTS.md` — launch feature checklist (what "done" means)

**Reference layer** (read as needed):
- `ARCHITECTURE.md` — stack, boundaries, caching, Supabase/Stripe
- `DESIGN.md` — UI tokens, patterns, anti-patterns
- `TESTING.md` — gates, debugging tips
- `FEATURES.md` — route/action/DB/test map
- `PRODUCTION.md` — deployment + go-live checklists
- `PRODUCT.md` — scope, roadmap, monetization

**Agent entry point**: `CLAUDE.md` (read on every prompt).

Legacy/archived docs: `docs-final/archive/` (reference only).

## Task writing rules

- Each task references exactly one issue: `(ISSUE-####)`.
- Each task includes a quick verification note (“how we know it’s done”).
- Keep tasks small (ideally ≤ 1 day each).
- If a task changes product scope, update `REQUIREMENTS.md` in the same batch.

