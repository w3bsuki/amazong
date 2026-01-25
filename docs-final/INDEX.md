# docs-final (Archive + Migration Notes)

Goal: keep a **small set of canonical docs in repo root**, and move legacy markdown/audit notes here so the repo stays navigable.

## Canonical Docs (Root) — SSOT

### Core Workflow Docs (Read First)

| Doc | Purpose |
|-----|---------|
| `CLAUDE.md` | Agent entry point |
| `PRD.md` | Product vision, scope, roadmap |
| `FEATURES.md` | Feature checklist (✅/🚧/⬜) |
| `TASKS.md` | Current sprint tasks |
| `ISSUES.md` | Bug/issue registry |

### Reference Docs

| Doc | Purpose |
|-----|---------|
| `ARCHITECTURE.md` | Stack, boundaries, caching, Supabase, Stripe |
| `DESIGN.md` | UI tokens, patterns, anti-patterns |
| `TESTING.md` | Gates, debugging |
| `PRODUCTION.md` | Deployment checklists |
| `REQUIREMENTS.md` | Detailed launch requirements |
| `WORKFLOW.md` | Dev process loop |

## What lives here

- `docs-final/archive/**`: legacy docs, audits, logs, and prior planning artifacts.

## Archive inventory

- `docs-final/archive/root-archived-2026-01-25/`
  - Archived: `ENGINEERING.md`, `BACKEND.md`, `FRONTEND.md`, `PRODUCT.md` (consolidated into ARCHITECTURE.md and PRD.md)
  - Archived: `TASKS_ARCHIVE_2026-01-25.md` (old P0-P10 phases)
- `docs-final/archive/root/`
  - Legacy audits + `supabase_tasks.md`
- `docs-final/archive/docs/`
  - Legacy audits/plans (escrow plan, etc.)
- `docs-final/archive/supabase-info/`
  - Schema snapshots

## Deletion policy

Anything under `docs-final/archive/` is safe to delete **after** we confirm the canonical docs cover what we need.
