# Folder: `app/`

Status: Audited + shipped refactor batches (Phases 1/2/3/6/7; Phase 7 includes intentional API hardening)

Last updated: 2026-02-03

## Baseline gates (before refactor batches)

- `pnpm -s typecheck`: ✅ pass
- `pnpm -s lint`: ✅ pass (`608` warnings, `0` errors)
- `pnpm -s styles:gate`: ✅ pass
- `pnpm -s test:e2e:smoke`: ✅ pass (`20` passed, `1` skipped)

## Latest gates (Phase 7 — app-only cleanup + hardening)

- `pnpm -s typecheck`: ✅ pass
- `pnpm -s lint`: ✅ pass (`571` warnings, `0` errors)
- `pnpm -s styles:gate`: ✅ pass
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`: ✅ pass (`20` passed, `1` skipped)
- Notes: Turbopack “Persisting failed…” warnings observed; tests still passed.

## Why this folder exists (expected)

Next.js 16 App Router routes only. Shared logic should not “leak” into `app/` unless it is route-private.

## Inventory

### Top-level structure

`app/` contains:
- `app/[locale]/` (main App Router tree)
- `app/actions/` (shared server actions)
- `app/api/` (non-locale API route handlers)
- `app/auth/` (auth callbacks)
- global app files: `globals.css`, `global-error.tsx`, `global-not-found.tsx`, etc.

### Route groups under `app/[locale]/`

- `(main)`, `(account)`, `(checkout)`, `(auth)`, `(sell)`, `(chat)`, `(onboarding)`, `(plans)`, `(admin)`, `(business)`
- `[username]` (storefront + PDP)
- `api` (locale-prefixed API routes)

### App Router file counts (baseline snapshot)

- `page.tsx`: `102`
- `layout.tsx`: `16`
- `route.ts`: `51`
- `loading.tsx`: `57`
- `error.tsx`: `16`
- `not-found.tsx`: `4`
- `default.tsx` (parallel routes): `3`

### Parallel / intercept routes (`@modal`)

Current modal slots and intercept pages:
- `app/[locale]/(main)/categories/@modal/default.tsx`
- `app/[locale]/(main)/categories/@modal/(..)[username]/[productSlug]/page.tsx`
- `app/[locale]/(main)/search/@modal/default.tsx`
- `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`
- `app/[locale]/(account)/@modal/default.tsx`
- `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx`

**Note:** keep `@modal` scoped (do not hoist), due to prior cart→checkout locale 404 regression on client transitions.

### Placeholder / ComingSoon routes (baseline snapshot; proof: `ComingSoonPage` import)

These were placeholder pages under `(main)` at baseline:
- `/blog`, `/affiliates`, `/careers`, `/advertise`, `/accessibility`, `/investors`, `/store-locator`, `/free-shipping`, `/suppliers`

**Note:** Phase 6 deleted all of the above except `/accessibility` (see “Delete” section).

Robots noindex pages (proof: `robots: { index: false }`):
- `/registry` and most of the ComingSoon pages above.

### Providers (current)

Locale root providers live in `app/[locale]/locale-providers.tsx`:

`IntlClientProvider → ThemeProvider → children`

## Findings (high ROI)

1) **Provider bloat at locale root**: Auth/cart/wishlist/drawers/messages providers are mounted globally for *all* route groups. This is high bundle + hydration surface.
2) **High duplication of route boundaries**: `loading.tsx` count (`57`) suggests many per-route skeletons.
3) **`@modal` duplication**: quick-view intercept pages exist twice (categories + search).
4) **Dead route leftovers**: `(main)/demo*` directories exist but are empty; safe delete (Phase 1).

## Phase 7 (done) — App-only cleanup + hardening

**App root & locale root**
- `app/global-error.tsx`: removed server `PageShell` import; client-safe wrapper.
- `app/[locale]/global-drawers.tsx` → `app/[locale]/_components/global-drawers.tsx`
- `app/[locale]/intl-client-provider.tsx` → `app/[locale]/_providers/intl-client-provider.tsx`
- `app/[locale]/locale-providers.tsx`: removed duplicate `setRequestLocale` call.

**Storefront layout + modal dedupe**
- New `app/[locale]/_components/storefront-layout.tsx` and used in `(main)` + `[username]` layouts.
- New shared modal files: `product-quick-view-modal-page.tsx`, `modal-default.tsx`; both category + search modals re-export.

**Account / checkout**
- `app/[locale]/_components/address-form.tsx` extracted and used by checkout + account addresses.
- `/account/selling/edit` now redirects to `/account/selling/[id]/edit` when `id` is present; otherwise to `/account/selling`.

**Admin / business**
- Dead admin sidebar links removed.
- Business nav titles centralized in `app/[locale]/(business)/dashboard/_lib/routes.ts`.
- Shared currency formatter: `app/[locale]/_lib/format-currency.ts` and applied in admin + business cards.

**API + actions hardening (intentional behavior changes)**
- `app/api/assistant/*`: auth required (401 unauthenticated), no-store headers.
- `app/api/payments/set-default` + `/delete`: verify ownership + Stripe customer match (403 on mismatch).
- `app/api/products/[id]/view`: cookie `secure` in prod + `path: "/"`.
- Admin/service-role actions: added admin/self checks where required.

## Behavior changes (Phase 7, intentional)

- `POST /api/assistant/*` now returns 401 when unauthenticated.
- `POST /api/payments/set-default` and `/delete` return 403 on ownership/customer mismatch.
- `POST /api/products/[id]/view` sets `secure` cookie in production.

## Keep (core flows)

- Storefront: home, categories, search
- Product quick view (`@modal`) and PDP (`[username]/[productSlug]`)
- Cart → checkout flow (locale-safe client transitions)
- Wishlist (auth + share tokens)
- Account routes (auth-gated)
- Chat routes
- Auth routes

## Move/Merge (done + planned)

- **Phase 2 (done):** extracted + scoped commerce providers via `app/[locale]/_providers/commerce-providers.tsx`.
- **Phase 2 (done):** locale root providers now only `IntlClientProvider → ThemeProvider → children` (`app/[locale]/locale-providers.tsx`).
- **Phase 2C (done, temporary):** `(chat)` layout is wrapped with `CommerceProviders` to keep messaging context consistent.
- **Phase 2D (done):** removed redundant nested `IntlClientProvider` wrappers from `(auth)` and `(sell)` layouts.
- **Phase 3 (done):** consolidated `(main)` + `[username]` wrappers into `app/[locale]/_components/storefront-shell.tsx`.
- **Phase 4:** dedupe quick-view intercept route logic without hoisting `@modal`.
- **Phase 7 (done):** storefront layout wrapper + modal dedupe (`storefront-layout`, `product-quick-view-modal-page`, `modal-default`).
- **Phase 7 (done):** moved locale root providers into `_providers`/`_components`.
- **Phase 7 (done):** extracted address form fields and currency formatter.

## Delete (planned + evidence)

1) **Phase 1 (done):** deleted demo routes under `(main)`:
   - `app/[locale]/(main)/demo/` (included `demo/codex/page.tsx`)

2) **Phase 6 (done):** deleted ComingSoon marketing routes except `/accessibility` (and removed footer links).

   | Route | Placeholder proof | Link refs |
   |---|---|---|
   | `/advertise` | `app/[locale]/(main)/advertise/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:76`, `components/layout/footer/site-footer.tsx:119` |
   | `/affiliates` | `app/[locale]/(main)/affiliates/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:76`, `components/layout/footer/site-footer.tsx:118` |
   | `/blog` | `app/[locale]/(main)/blog/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:73`, `components/layout/footer/site-footer.tsx:96` |
   | `/careers` | `app/[locale]/(main)/careers/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:73`, `components/layout/footer/site-footer.tsx:95` |
   | `/free-shipping` | `app/[locale]/(main)/free-shipping/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:130` |
   | `/investors` | `app/[locale]/(main)/investors/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:73`, `components/layout/footer/site-footer.tsx:97` |
   | `/store-locator` | `app/[locale]/(main)/store-locator/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:117` |
   | `/suppliers` | `app/[locale]/(main)/suppliers/page.tsx` imports `ComingSoonPage` | `components/layout/footer/site-footer.tsx:76`, `components/layout/footer/site-footer.tsx:120` |

   Keep:
   - `/accessibility` (`app/[locale]/(main)/accessibility/page.tsx`) — compliance-facing.

3) **Phase 7 (done):** no route deletions (kept `/account/selling/edit` as redirect).

## Tool-driven signals (Phase 4.1)

- `pnpm -s dupes` (jscpd) flags several high-ROI dedupe clusters worth tackling next:
  - Shared filters: `components/shared/filters/filter-hub.tsx` ↔ `components/shared/filters/filter-modal.tsx` (large shared chunks).
  - Auth client UI: `app/[locale]/(auth)/_components/sign-up-form.tsx` ↔ `reset-password-client.tsx` / `sign-up-success-client.tsx` (repeated sections).
  - Loading skeletons: `app/[locale]/(admin)/admin/loading.tsx` ↔ `(business)/dashboard/*/loading.tsx` (similar loading blocks).

- `pnpm -s knip`:
  - Unused export: `isBoostActive` in `lib/boost/boost-status.ts`.
  - Unused files: `.codex/skills/treido-tailwind-v4-shadcn/templates/*` (safe to delete after agreeing whether repo should keep skill templates).

## Subagent prompt (copy/paste)

```text
AUDIT FOLDER: app/
Goal: reduce App Router boilerplate + dedupe layouts/modals + shrink "use client".
Output: Inventory + top delete/dedupe targets + 3 safe batches + verify commands.
```

## Risks

- Provider moves can affect locale transitions, cart→checkout state continuity, quick-view modals, and auth-driven UI updates.
- Cached-server rules: ensure no accidental `cookies()`/`headers()` usage enters cached code.
- E2E cold-start reliability: readiness checks should not depend on slow `/(locale)` renders.
- API hardening requires client flows to handle 401/403 responses.

## Verification (after each batch)

- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`
- `pnpm -s test:e2e:smoke` (whenever routes/layouts/providers are touched)
