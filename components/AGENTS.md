# components/ — Shared UI Boundaries

These rules apply to everything under `components/`.

## Root policy first

- Root `AGENTS.md` is the canonical source for non-negotiables.
- This file adds only `components/`-specific boundaries.

## What belongs here

- Reusable UI: layout shells, shared composites, and presentational components.
- Keep business/data logic in `app/` and `lib/` (not in shared UI components).

## Component boundaries

- No direct data fetching (Supabase/Stripe) from shared components.
- No server actions in shared components.

## shadcn boundary

- `components/ui/*` must remain primitives only (no app logic; no importing from `app/`).

## See SSOT

- `AGENTS.md` (root)
- `docs/AGENTS.md`
- `docs/03-ARCHITECTURE.md`
- `docs/04-DESIGN.md`
