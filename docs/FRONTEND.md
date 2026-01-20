# Frontend Guide (Canonical)

This is the canonical reference for UI/UX work in this repo.

Related:
- UI tokens + styling rails: `docs/DESIGN.md`
- Boundaries, caching, and backend rules: `docs/ENGINEERING.md`
- Verification gates: `docs/TESTING.md`

---

## Required gates (after non-trivial changes)

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Optional (UI drift):

```bash
pnpm -s styles:scan
```

---

## Component boundaries (import rules)

- `components/ui/**` — shadcn/ui primitives only (no app hooks, no feature logic).
- `components/shared/**` — shared composites (cards, product/search/filter UI, `Field` system).
- `components/layout/**` — shells (headers, nav, sidebars, footer).
- `components/providers/**` — thin providers/contexts.
- `hooks/**` — reusable hooks.
- Route-private (do not import across route groups):
  - `app/[locale]/(group)/**/_components/**`
  - `app/[locale]/(group)/**/_actions/**`
  - `app/[locale]/(group)/**/_lib/**`

If a component is only used by one route group, keep it route-private.

---

## Server vs client components (Next.js App Router)

- Default to Server Components; add `"use client"` only when needed (state, effects, event handlers).
- Fetch data in Server Components or shared server fetchers in `lib/data/**`.
- Prefer Server Actions for mutations; avoid client-side data mutation patterns unless required.
- Keep client components “dumb”: data passed as props; avoid fetching from client unless necessary.

---

## i18n (next-intl)

- No hardcoded user-facing strings.
- Client Components: `useTranslations()`.
- Server Components / metadata: `getTranslations()` and `setRequestLocale()`.
- Use localized routing helpers from `@/i18n/routing` (don’t hand-roll locale prefixes).
- Keep keys in sync between `messages/en.json` and `messages/bg.json`.

---

## UX + accessibility checklist

- Touch targets ≥32px (use `h-touch-*` utilities from `app/globals.css`).
- Use `components/ui/*` primitives for consistent focus/disabled states.
- Forms: use `components/shared/field.tsx` helpers (`Field`, `FieldLabel`, `FieldError`, etc).
- Images: meaningful `alt`, avoid layout shift (use `next/image`).
- Keyboard: all interactive controls reachable + visible focus.
- Don’t introduce gradients or arbitrary Tailwind values (see `docs/DESIGN.md`).

---

## “Done” checklist

- Mobile + desktop sanity check (at least one critical flow touched).
- No new hardcoded strings (i18n keys added where needed).
- Gates pass: `tsc --noEmit` + `e2e:smoke`.
