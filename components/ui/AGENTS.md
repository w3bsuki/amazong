# components/ui/ — shadcn Primitives Boundary

These rules apply to everything under `components/ui/`.

## Purpose

- This folder is for **UI primitives** (shadcn-style): small, composable, app-agnostic building blocks.

## Non‑negotiables

- No imports from `app/` (route code) or other app-specific modules.
- No Supabase, Stripe, server actions, or business logic.
- Keep props generic and reusable; accept `className`, `children`, and semantic props.
- Tailwind v4 rails only: no gradients, no arbitrary values, no palette classes, no hardcoded colors.

## See SSOT

- `docs/04-DESIGN.md`

