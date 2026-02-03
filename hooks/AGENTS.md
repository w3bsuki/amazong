# hooks/ — Hooks Boundary Rules

These rules apply to everything under `hooks/`.

## Non‑negotiables

- Hooks must be reusable and UI-agnostic. Avoid business/domain logic.
- No direct data fetching (Supabase/Stripe) inside hooks.
- No logging of secrets/PII.
- No hardcoded user-facing copy; use `next-intl` in components or return message keys (not strings).

## See SSOT

- `docs/03-ARCHITECTURE.md`
- `docs/10-I18N.md`

