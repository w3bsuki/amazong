# components/ — Shared UI Boundaries

These rules apply to everything under `components/`.

## What belongs here

- Reusable UI: layout shells, shared composites, and presentational components.
- Keep business/data logic in `app/` and `lib/` (not in shared UI components).

## Non‑negotiables

- No direct data fetching (Supabase/Stripe) from shared components.
- No server actions in shared components.
- All user-facing strings must use `next-intl` message keys.
- Tailwind v4 rails only: no gradients, no arbitrary values, no palette classes, no hardcoded colors.

## shadcn boundary

- `components/ui/*` must remain primitives only (no app logic; no importing from `app/`).

## See SSOT

- `docs/03-ARCHITECTURE.md`
- `docs/04-DESIGN.md`

