# Next.js Audit (App Router) — 2026-01-24

## Current state snapshot

- Framework: Next.js `16.1.4` (`package.json`)
- React: `19.2.3` (`package.json`)
- i18n: `next-intl` with plugin in `next.config.ts` + routing helpers in `i18n/routing.ts`
- App Router structure:
  - Locale segment: `app/[locale]/*` with multiple route groups `(main)`, `(auth)`, `(account)`, etc.
  - Non-localized auth handlers: `app/auth/callback/route.ts`, `app/auth/confirm/route.ts`
- Scale (repo scan):
  - Pages: `94` (`rg --files app | rg "page.tsx$"`)
  - Route handlers: `56` (`rg --files app | rg "route.ts$"`)
  - Layouts: `19` (`rg --files app | rg "layout.tsx$"`)
  - Client components: `277` (`rg -l '^\\s*\"use client\"' app components lib hooks`)

## Key config and entrypoints

- Next config: `next.config.ts`
  - `cacheComponents: true`
  - `cacheLife` profiles: `categories`, `products`, `deals`, `user`
  - Image remote patterns + E2E `unoptimized` flag
- i18n + auth + geo cookies middleware/proxy:
  - `proxy.ts` (next-intl middleware + shipping-region cookies + `updateSession`)
  - `lib/supabase/middleware.ts` (`updateSession()` guards `/account`, `/sell`, `/chat`)
  - `app/[locale]/(account)/layout.tsx` reads `x-pathname` from `headers()` (set by `proxy.ts`)

## Caching and data fetching

- `'use cache'` is used in `lib/data/*` and some `app/api/*` route handlers.
- Cache primitives in use: `cacheLife()`, `cacheTag()`, `revalidateTag()`.
- Static/cached reads should use `createStaticClient()` (`lib/supabase/server.ts`) and must not read per-user `cookies()` / `headers()`.

## Server/client boundaries (risk area)

- 277 `"use client"` files is a strong signal of:
  - too many top-level interactive components,
  - too many providers or route-level client layouts,
  - UI state leaking into shared components.

### Verified (good)

- No `"use client"` file imports `@/lib/supabase/server` (quick scan).

## Duplication hotspots (observed)

- Headers: multiple mobile/desktop variants + contextual state via HeaderContext.
  - Entry: `components/layout/header/app-header.tsx`
  - Variants: `components/layout/header/mobile/*`, `components/layout/header/desktop/*`
- Product cards/pages: parallel implementations across mobile/desktop/shared.
  - Example: `components/shared/product/product-card.tsx` vs `components/shared/product/product-card-list.tsx`
- Filters: `components/shared/filters/*` contains repeated patterns between modal/hub/list.

## Findings (Phase 1)

### Critical (blocks release)

- [ ] **Confirm `proxy.ts` is the intended Next.js request hook** → i18n + auth gating + `x-pathname` header depend on it; if the hook doesn’t run, locale routing and “next” redirects can degrade or break → Evidence: `proxy.ts` exists, no `middleware.ts` at repo root; `app/[locale]/(account)/layout.tsx` reads `x-pathname` from headers.
- [ ] **Reduce route-level client surface area** → 277 client modules increases hydration + bundle cost and makes refactors harder → Evidence: repo scan count (see snapshot).

### High (next sprint)

- [ ] **API route duplication (products/categories)** → multiple endpoints share the same query/business rules → Evidence: `app/api/products/*/route.ts`, `app/api/categories/*/route.ts`, plus overlap with `lib/data/products.ts` and `lib/data/categories.ts`.
- [ ] **Header system complexity** → route parsing + context overrides + many variants causes “edit one component, but another is used” → Evidence: `components/layout/header/app-header.tsx` + `components/providers/header-context.tsx`.
- [ ] **Provider over-stacking at locale root** → lots of contexts at `app/[locale]/locale-providers.tsx` makes everything “client-adjacent” and harder to reason about → Evidence: `app/[locale]/locale-providers.tsx`.

### Deferred (backlog)

- [ ] **Route inventory + ownership** → generate a route map (route → layout → data deps) to prevent accidental drift.
- [ ] **Standardize request/runtime config** → ensure long-running handlers (webhooks/uploads) declare appropriate runtime/limits.

## Refactor approach (target: ~50% LOC reduction)

1) **Collapse duplicate data access paths**
   - Prefer “server components + `lib/data/*`” for reads.
   - Prefer server actions for authenticated writes.
   - Keep `app/api/*` for webhooks, integrations, and truly public unauthenticated endpoints.

2) **Make layouts do the selection**
   - Pass header variants and required props from layout/server components.
   - Reduce reliance on route parsing and context overrides.

3) **Introduce domain “kits”**
   - Product kit: card (grid/list), price, badges, gallery, buy box, reviews, quick view.
   - Category kit: tree, breadcrumbs, filters, counts, attribute UI.

4) **Enforce boundaries**
   - `components/ui/*` stays primitive-only.
   - `components/shared/*` gets data-free composites.
   - data fetching only in server components/actions/lib/data.

## Quick verification gates

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s test:unit
pnpm -s test:e2e:smoke
```
