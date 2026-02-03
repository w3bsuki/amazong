# lib/ — Pure Utilities and Domain Logic

These rules apply to everything under `lib/`.

## What belongs here

- Pure utilities, domain helpers, validators, and client wrappers.
- No React components (keep UI in `components/` and `app/`).

## Non‑negotiables

- No secrets/PII in logs.
- Keep APIs explicit: avoid `select('*')` and project fields where possible.
- Prefer deterministic functions; avoid implicit global state.

## See SSOT

- `docs/03-ARCHITECTURE.md`

