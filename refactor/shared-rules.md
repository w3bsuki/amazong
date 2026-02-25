# Refactor — Shared Rules

These rules apply to all refactor work under `refactor/` unless a more specific plan overrides them.

## Safety + Verification

- Prefer mechanical refactors (rename/move/split/merge) over behavior changes.
- Run gates after each batch:
  - `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`
- If a gate fails, stop and fix before continuing.

## Architecture/Conventions (Treido)

- Server Components by default. Add `"use client"` only when necessary.
- Route-group privacy: `_components/`, `_actions/`, `_lib/`, `_providers/` are private to their route group — do not import across route groups.
- Navigation: use `Link` / `redirect` from `@/i18n/routing` (never `next/link`).
- Styling: semantic tokens only (`bg-background`, `text-foreground`). No palette classes, hex values, or arbitrary colors.
- Data: avoid `select('*')` in hot paths; keep list views lean.
- Logging: prefer `logger` from `@/lib/logger` over `console.*`.

## Scope Notes

- Generated files: do not hand-edit `lib/supabase/database.types.ts`.
- DB schema/RLS/migrations: follow the plan docs for any DB-touching work.

---

*Created: 2026-02-25*
