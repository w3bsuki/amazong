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
- `ENGINEERING.md` — engineering rules + rails
- `FRONTEND.md` — UI/UX + i18n guidance
- `BACKEND.md` — Supabase/Stripe backend guidance
- `DESIGN.md` — UI tokens, patterns, anti-patterns
- `TESTING.md` — gates, debugging tips
- `FEATURES.md` — route/action/DB/test map
- `PRODUCTION.md` — deployment checklists
- `PRODUCT.md` — scope, roadmap

## What lives here

- `docs-final/archive/**`: legacy docs, audits, logs, and prior planning artifacts kept only for reference.

## Archive inventory (kept)

- `docs-final/archive/root/`
  - Kept: select audits + `supabase_tasks.md` (legacy checklist; Supabase lane).
- `docs-final/archive/docs/`
  - Kept: legacy audits/plans that are still referenced (e.g. escrow plan) or useful as history.
- `docs-final/archive/supabase-info/`
  - Kept: schema snapshots (Supabase lane; delete only when Supabase owner is done).

## Deletion policy

Anything under `docs-final/archive/` is safe to delete **after** we confirm the canonical docs cover what we need and nothing in the app/tooling links to it.
