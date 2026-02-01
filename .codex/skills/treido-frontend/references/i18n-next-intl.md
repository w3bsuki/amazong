# next-intl (Treido i18n Playbook)

Treido is Bulgarian-first, but supports at least `bg` + `en`.

Hard rule: **no hardcoded user-facing strings** in UI.

## Adding a string

1. Add the key to `messages/en.json`
2. Add the same key to `messages/bg.json`
3. Use it via next-intl

Key shape:

- group by feature/surface (`errors.*`, `auth.*`, `product.*`)
- avoid one-off keys (`copy1`, `label2`)

## Client components

Use `useTranslations()` in client components.

Rules:

- avoid concatenating translated strings
- prefer parameters (ICU messages) for values

## Server components

Prefer server rendering localized strings where possible.

Rules:

- keep formatting consistent (dates/currency) and locale-aware
- never leak locale through hardcoded paths; use locale-aware navigation helpers

## Acceptance checks

- all added keys exist in both locale files
- UI renders without fallback/missing-key errors

