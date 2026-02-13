# ROUTES.md — Routes Domain Contract

> Route groups, ownership boundaries, and locale routing rules for the Next.js App Router.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever routing changes |

## Scope

Route groups, layouts, navigation behavior, and the “route-private” conventions that keep the app modular.

## Runtime Truth Paths

- `proxy.ts` (next-intl middleware + session update + geo cookies)
- `i18n/routing.ts` (locale routing contract; locale prefix always)
- `app/[locale]/(main)/**`
- `app/[locale]/(account)/**`
- `app/[locale]/(auth)/**`
- `app/[locale]/(onboarding)/**`
- `app/[locale]/(sell)/**`
- `app/[locale]/(checkout)/**`
- `app/[locale]/(business)/**`
- `app/[locale]/(chat)/**`
- `app/[locale]/(plans)/**`
- `app/[locale]/(admin)/**`
- `app/[locale]/[username]/**` (public profiles + PDP)

## Locale Routing Contract

- All user-facing routes are locale-scoped under `app/[locale]/`.
- Locale prefix is always present (`/en/...`, `/bg/...`) per `i18n/routing.ts`.
- Middleware (`proxy.ts`) runs on app routes and sets a request header `x-pathname` for layout conditional rendering.

## Route Groups (Ownership Map)

See `ARCHITECTURE.md` for the canonical group map. In practice:

- `(main)`: browsing/search/categories/cart shell
- `(auth)`: login/signup/reset flows (minimal chrome)
- `(account)`: account settings/orders/profile
- `(sell)`: listing creation and seller surfaces
- `(checkout)`: payment flow
- `(onboarding)`: post-signup onboarding wizard
- `(chat)`: messaging
- `(business)`: business dashboard and upgrades
- `(admin)`: admin surfaces

## Route-Private Conventions (Non-Negotiable)

Keep route-specific code private inside the route tree:

- `_components/` (route-private UI)
- `_actions/` (route-private server actions)
- `_lib/` (route-private utilities)
- `_providers/` (route-private contexts)

Rule: never import route-private modules across route groups.

## Common Gotchas

- `app/api/**` is excluded from the middleware matcher (by design); do not assume locale headers/cookies exist there.
- If you introduce a new group, decide its layout chrome explicitly (header/footer/mobile nav).

## Verification

- Route behavior changes: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

## Deep Dive

- Pre-cutover full reference: [`docs/archive/2026-02-doc-reset/pre-cutover-docs/ROUTES.md`](../archive/2026-02-doc-reset/pre-cutover-docs/ROUTES.md)

## See Also

- [`ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`docs/QA.md`](../QA.md)
- [`REQUIREMENTS.md`](../../REQUIREMENTS.md)

*Last updated: 2026-02-13*

