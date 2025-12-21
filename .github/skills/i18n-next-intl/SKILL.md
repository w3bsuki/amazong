---
name: i18n-next-intl
description: Implement or refactor localization in this repo using next-intl and `app/[locale]/...` routing. Use when adding new strings, fixing missing translations, changing locale routing, or updating language switch behavior.
---

# i18n (next-intl) in this repo

## Non-negotiables for this repo

- Localized routes are under `app/[locale]/...`.
- Translation messages live under `messages/` (per locale JSON files).
- Avoid hardcoding user-facing strings in UI that should be translated.
- Keep locale-aware navigation consistent (language switcher should preserve route when possible).

## Workflow

1. Add or change message keys
   - Add keys to the default locale JSON.
   - Add the same keys to other locale JSON files (even if temporarily copied) to avoid runtime “missing key” noise.

2. Use the right next-intl API for the component type
   - Server Components: prefer server-safe next-intl APIs where applicable.
   - Client Components: use hooks (e.g., `useTranslations`, `useLocale`) only in `'use client'` components.

3. Locale routing changes
   - Keep `app/[locale]` as the source of truth.
   - Ensure links and redirects preserve locale.
   - Verify the language switcher doesn’t drop query params or route segments unless intended.

## Verification

- Typecheck (when requested or before you call the task done): `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- E2E if navigation/locale switching changes: `pnpm test:e2e`

## Examples

- “Add translations for the sell flow fields.”
- “Fix missing key warnings in next-intl.”
- “Update language switcher to preserve current route.”
