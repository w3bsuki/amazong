# i18n — next-intl

## Invariants (non-negotiable)
- All user-facing strings must be in `messages/en.json` and `messages/bg.json`.
- Avoid per-component translation objects (drift risk).

## Preferred error handling pattern
- Server actions return **error codes** (or keys), UI localizes with `next-intl`.

