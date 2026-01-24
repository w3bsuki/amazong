# docs-final (Archive + Migration Notes)

Goal: keep a **small set of canonical docs in repo root**, and move legacy markdown/audit notes here so the repo stays navigable.

## Canonical Docs (Root) — SSOT

**Agent entry point**: `CLAUDE.md`

**Workflow layer** (frequently updated):
- `WORKFLOW.md` — process loop
- `ISSUES.md` — issue registry
- `TASKS.md` — execution checklist
- `REQUIREMENTS.md` — launch feature checklist

**Reference layer** (read as needed):
- `ARCHITECTURE.md` — stack, boundaries, caching
- `DESIGN.md` — UI tokens, patterns, anti-patterns
- `TESTING.md` — gates, debugging tips
- `FEATURES.md` — route/action/DB/test map
- `PRODUCTION.md` — deployment checklists
- `PRODUCT.md` — scope, roadmap

## What lives here

- `docs-final/archive/**`: legacy docs, audits, logs, and prior planning artifacts kept only for reference.

## What was archived (2026-01-23)

- Old root workflow docs:
  - `docs-final/archive/root/agents.md`
  - `docs-final/archive/root/RULES.md`
  - `docs-final/archive/root/TODO.md`
  - `docs-final/archive/root/supabase_tasks.md`
- Prior canonical docs folder (now archived):
  - `docs-final/archive/docs/*`
- Prior audit/plan folders (now archived):
  - `docs-final/archive/codex-xhigh/codex-xhigh/*`
  - `docs-final/archive/supabase-info/supabase-info/*`
  - `docs-final/archive/folders/.claude/*`
  - `docs-final/archive/folders/.specs/*`

## Deletion policy

Anything under `docs-final/archive/` is safe to delete **after** we confirm the canonical docs cover what we need and nothing in the app/tooling links to it.
