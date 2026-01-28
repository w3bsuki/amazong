# app/ — Refactor Audit (2026-01-28)

## Snapshot

- Size: ~80,742 lines across 442 files (`refactor/app.files.md`)
- Client files: 129 (`"use client"` inside `app/`)
- Route groups in `app/[locale]/`: `(account)`, `(admin)`, `(auth)`, `(business)`, `(chat)`, `(checkout)`, `(main)`, `(plans)`, `(sell)`, `[username]`

## Route Group Map (what belongs where)

- `(auth)` — signup/login/reset/confirm flows
- `(main)` — home/search/categories/cart/wishlist/product discovery
- `(checkout)` — checkout UI + Stripe redirects
- `(account)` — buyer account settings, orders, wishlist, billing/plans
- `(sell)` — seller onboarding + listing creation + seller orders
- `(chat)` — chat list + threads
- `(business)` — business dashboard surfaces
- `(admin)` — admin-only surfaces (must be server-only + locked down)
- `[username]` — public profile + product pages

## Hotspots (largest files to split first)

- `app/api/admin/docs/seed/templates.ts` — huge payload in route tree (move to `scripts/` or data module)
- `app/[locale]/design-system2/page.tsx` — dev-only surface, heavy Tailwind offenders
- `app/[locale]/(checkout)/_components/checkout-page-client.tsx` — massive client island
- `app/[locale]/(sell)/_components/fields/attributes-field.tsx` — massive form step
- `app/[locale]/design-system/_components/design-system-client.tsx` — dev-only surface

## Treido Audit — app/ (lane: nextjs/docs) — 2026-01-28

### Critical (blocks release)

- [ ] Remove or hard-gate dev routes (`app/[locale]/(main)/demo*`, `app/[locale]/design-system*`) → these show up in `pnpm -s styles:scan` offenders
- [ ] Strip noisy logs from route handlers (`app/api/**/route.ts`) → replace with `lib/structured-log.ts` and scrub payloads
- [ ] Replace `select('*')` in account read path → `app/[locale]/(account)/account/page.tsx` should project fields

### High (next sprint)

- [ ] Split “god” client pages into server page + small client islands (start with checkout) → `app/[locale]/(checkout)/_components/checkout-page-client.tsx`
- [ ] Delete unused files flagged by Knip → `app/[locale]/(checkout)/_components/checkout-page-client-new.tsx`
- [ ] Move large non-route code out of `app/` when it’s not routing-specific (e.g. admin docs seeding templates)
- [ ] Standardize route-private boundaries: keep `(group)/_components` + `(group)/_actions` private; move shared to `components/shared` or `app/actions`

### Deferred (backlog)

- [ ] Reduce client-component surface area by pushing data fetching to Server Components and passing props (avoid client fetch-on-mount patterns)
- [ ] Normalize caching tags/profiles for category/product reads (keep invalidation granular; avoid caching anything user-specific)

## Inventory

- Full file list: `refactor/app.files.md`

