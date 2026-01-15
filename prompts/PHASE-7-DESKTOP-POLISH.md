# Phase 7 — Desktop Polish (Post-Phase 6)

You are working in the Treido marketplace repo (Next.js 16 App Router, React 19, TS, Tailwind v4, shadcn/ui, next-intl).

## Goal
Ship a small, high-confidence “polish” slice after Phase 6 (Footer + Titles), focusing on remaining global UX/SEO correctness issues. Keep scope tight: 1–3 files if possible.

## Constraints (non‑negotiable)
- No gradients.
- No arbitrary Tailwind values.
- All user-facing strings must be i18n via `next-intl` (`messages/en.json`, `messages/bg.json`).
- Do not reorganize unrelated code.
- Run gates: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `pnpm -s test:unit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`.

## Suggested Phase 7 slice (pick ONE)
Choose one item that can be completed cleanly without cascading changes.

### Option A — Fix remaining “duplicate/odd” titles
- Find any routes still producing titles like `Treido | Treido` or titles that include extra suffixes (e.g. `... | Treido Community`).
- Standardize to return **page name only** from `generateMetadata` and rely on the global template `%s | Treido`.
- Ensure i18n: use `getTranslations()` for metadata on localized pages.

### Option B — Remove non-i18n hardcoded user strings in desktop pages
- Search for obvious English/Bulgarian literals in app routes/components that render user-facing copy (especially in desktop-only areas).
- Replace with `useTranslations()` (client) or `getTranslations()` (server) + add keys in both locales.

### Option C — Production hygiene: devtools visibility
- Confirm no dev-only UI/overlays leak into production builds.
- If there’s a devtools component toggled by env, ensure it’s guarded by `NODE_ENV !== 'production'` and/or a feature flag.

## Deliverables
- Code changes for the chosen option.
- Tests/gates green.
- Short summary of what changed, with file links.

## Helpful starting searches
- `"| Treido | Treido"` in `app/`
- `title:` in `generateMetadata` and `export const metadata`
- `MISSING_MESSAGE` / `IntlError` in runtime logs
