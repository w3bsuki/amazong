# Phase 01 - Next.js Runtime and Cache Simplification

## Objective

Reduce App Router and cache complexity without changing behavior.

## Context7 docs used (date + links)

- Date: 2026-02-07
- https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/01-getting-started/09-caching-and-revalidating.mdx
- https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/03-api-reference/04-functions/revalidateTag.mdx
- https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/03-api-reference/04-functions/revalidatePath.mdx
- https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/02-guides/incremental-static-regeneration.mdx

## Checklist

- [x] Build route/layout keep-remove-simplify map.
- [x] Remove redundant locale-level `generateStaticParams`.
- [x] Remove true pass-through layouts.
- [x] Replace broad cache invalidation with targeted tags where safe.
- [x] Simplify `next.config.ts` to essential validated settings.
- [x] Keep legacy redirect routes and document compatibility intent.
- [x] Run full gates and record output.

## Files touched

- `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx`
- `app/[locale]/(main)/(legal)/cookies/page.tsx`
- `app/[locale]/(main)/(legal)/privacy/page.tsx`
- `app/[locale]/(main)/(legal)/returns/page.tsx`
- `app/[locale]/(main)/(legal)/terms/page.tsx`
- `app/[locale]/(main)/(support)/contact/page.tsx`
- `app/[locale]/(main)/(support)/customer-service/page.tsx`
- `app/[locale]/(main)/(support)/faq/page.tsx`
- `app/[locale]/(main)/(support)/feedback/page.tsx`
- `app/[locale]/(main)/(support)/help/page.tsx`
- `app/[locale]/(main)/(support)/security/page.tsx`
- `app/[locale]/(main)/about/page.tsx`
- `app/[locale]/(main)/accessibility/page.tsx`
- `app/[locale]/(main)/cart/page.tsx`
- `app/[locale]/(main)/categories/page.tsx`
- `app/[locale]/(main)/gift-cards/page.tsx`
- `app/[locale]/(main)/members/page.tsx`
- `app/[locale]/(main)/page.tsx`
- `app/[locale]/(main)/registry/page.tsx`
- `app/[locale]/(main)/seller/dashboard/page.tsx`
- `app/[locale]/(main)/sellers/page.tsx`
- `app/[locale]/(main)/wishlist/page.tsx`
- `app/[locale]/(sell)/sell/page.tsx`
- `app/[locale]/(main)/search/layout.tsx` (removed)
- `app/[locale]/(main)/categories/layout.tsx` (removed)
- `app/actions/boosts.ts`
- `next.config.ts`

## Verification output

- `pnpm -s typecheck`: pass
- `pnpm -s lint`: pass (warnings only, 377 warnings)
- `pnpm -s styles:gate`: pass
- `pnpm -s test:unit`: pass (29 files, 405 tests)
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`: pass (22 passed, 2 skipped)
- Complexity deltas:
  - `generateStaticParams` occurrences under `app/[locale]`: `37 -> 18`
  - layout files under `app/[locale]`: `17 -> 11`
  - `revalidatePath(...)` usage under `app/actions` + `lib`: `1 -> 0`

## Decision log

- Kept `generateStaticParams` only where dynamic/static pre-rendering is still justified:
  - `app/[locale]/layout.tsx`
  - `app/[locale]/(account)/layout.tsx`
  - `app/[locale]/(auth)/layout.tsx`
  - `app/[locale]/(chat)/layout.tsx`
  - `app/[locale]/(checkout)/layout.tsx`
  - `app/[locale]/(sell)/layout.tsx`
  - `app/[locale]/(chat)/chat/[conversationId]/page.tsx`
  - `app/[locale]/(main)/categories/[slug]/[subslug]/page.tsx`
  - `app/[locale]/(business)/dashboard/orders/[orderId]/page.tsx`
  - `app/[locale]/(business)/dashboard/products/[productId]/edit/page.tsx`
  - `app/[locale]/(account)/account/orders/[id]/page.tsx`
  - `app/[locale]/(account)/account/selling/[id]/edit/page.tsx`
  - `app/[locale]/[username]/page.tsx`
  - `app/[locale]/[username]/[productSlug]/page.tsx`
- Removed redundant locale-only `generateStaticParams` from static pages in legal/support/main/sell entry routes.
- Removed pass-through layouts:
  - `app/[locale]/(main)/search/layout.tsx`
  - `app/[locale]/(main)/categories/layout.tsx`
- Replaced broad route-group path invalidation in `app/actions/boosts.ts` with targeted tag invalidation (`products:list`, `profiles`, `product:{id}`, `seller-{id}`, `seller-products-{id}`).
- Simplified `next.config.ts` by dropping speculative/host-specific experimental options (`cpus`, `workerThreads`, `turbopackFileSystemCacheForDev`, `optimisticClientCache`) while keeping production-relevant cache/image/server-action settings.
- Explicit compatibility redirects retained:
  - `app/[locale]/(main)/messages/page.tsx` (`/messages` -> `/chat`)
  - `app/[locale]/(main)/seller/dashboard/page.tsx` (`/seller/dashboard` -> `/dashboard`)

## Done

- [x] Phase 01 complete
