# Folder: `components/`

Status: Not audited

## Why this folder exists (expected)

Shared UI building blocks and composites used across routes. `components/ui` is shadcn primitives only.

## Audit checklist

- [ ] Inventory `components/ui/*` primitives and enforce boundary.
- [ ] Identify duplicate composites across routes and merge/delete.
- [ ] Identify over-broad client components and split server/client appropriately.
- [ ] Ensure all user-facing copy is via `next-intl` (no hardcoded strings).

