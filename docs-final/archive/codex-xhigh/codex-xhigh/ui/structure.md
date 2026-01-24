# UI System — Tailwind v4 + shadcn/ui

## Repo rails (non-negotiable)
- No gradients.
- No arbitrary Tailwind values.
- All user-facing strings via `next-intl`.
- `components/ui/*` stays shadcn primitives only (no app hooks).

## Target: token-first UI
- Tokens live in `app/globals.css`.
- Components consume tokens via semantic Tailwind classes/variables.
- “Design debt” is tracked via audits (don’t reintroduce violations).

