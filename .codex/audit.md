# Manual Audit + Fix Log (2026-02-21)

This file tracks repro steps, root causes, fix strategy, touched files, and verification per issue during the manual audit sprint.

---

## A) Browse / Search / Filters — **Fixed (verified)**

### Issue: Search pagination duplicates locale prefix

- Repro:
  - Open `/bg/search`, go to page 2.
  - Observed URL became `/bg/bg/search?page=2` (double locale prefix).
- Root cause:
  - `SearchPagination` built a locale-prefixed path and then rendered it through `Link` from `@/i18n/routing`, which prefixes the locale again.
- Fix strategy:
  - Strip the current locale prefix from `usePathname()` output and return a locale-less href so `Link` applies locale exactly once.
- Files touched:
  - `app/[locale]/(main)/_components/search-controls/search-pagination.tsx`
- Verification:
  - `pnpm -s test:e2e:smoke` ✅ (`search pagination preserves locale`)

### Issue: Mobile home rails regression broke smoke landing hierarchy

- Repro:
  - `pnpm -s test:e2e:smoke` failed `homepage mobile landing hierarchy and geometry stay consistent` with missing `home-v4-*` test ids.
- Root cause:
  - Mobile home no longer rendered the expected rails/banner structure (test ids removed), causing E2E smoke to fail.
- Fix strategy:
  - Restore a dedicated `MobileHomeRails` component that renders:
    - `home-v4-primary-rail`, `home-v4-secondary-rail`, `home-v4-context-banner`
    - scope controls (`home-v4-scope-*`), filter trigger, and more-categories trigger.
- Files touched:
  - `app/[locale]/(main)/_components/mobile-home.tsx`
  - `app/[locale]/(main)/_components/mobile-home/mobile-home-rails.tsx`
- Verification:
  - `pnpm -s test:e2e:smoke` ✅ (`homepage mobile landing hierarchy...`)

### Issue: DesktopFilters optional props under `exactOptionalPropertyTypes`

- Repro:
  - `pnpm -s typecheck` failed when passing `categorySlug ?? undefined` to `<DesktopFilters />`.
- Root cause:
  - With `exactOptionalPropertyTypes`, optional props must be omitted rather than explicitly passed `undefined`.
- Fix strategy:
  - Conditional spread (`...(categorySlug ? { categorySlug } : {})`) to only pass defined optional props.
- Files touched:
  - `app/[locale]/(main)/search/_components/search-page-layout.tsx`
- Verification:
  - `pnpm -s typecheck` ✅

### Issue: Search results/filters not truly end-to-end (category depth, deals, location, live count)

- Repro (code-path issues found during audit):
  - Category filtering only considered `category_id IN (...)` for root + immediate subcategories → misses deeper category descendants.
  - Deals-only path swapped to `deal_products` and then attempted location filtering by `seller_city` → brittle/inconsistent with count endpoint.
  - City-only selection (`?city=...` without `nearby=true`) did not filter results at all.
  - Filter Hub “Show results” count ignored location (and verified), so live counts could disagree with final results.
  - Desktop sidebar category navigation linked to `/categories/*`, dropping search query/filter context.
- Root cause:
  - Search listing query + page plumbing diverged from the canonical patterns used elsewhere (`category_ancestors` + cached category context), and the count endpoint did not apply the same filters as the UI.
- Fix strategy:
  - Use cached category fetchers (`getCategoryHierarchy`, `getCategoryContext`) in `search/page.tsx` so search no longer depends on ad-hoc category queries and can resolve deep category IDs.
  - Update listing search query to:
    - filter by `category_ancestors` (descendant-safe)
    - apply deals semantics on `products` (no view limitations)
    - apply city filter when `city` is set (and default Sofia when `nearby=true` without city)
    - apply public visibility filter (`status=active` or NULL)
  - Make Filter Hub live counts match by sending `deals/verified/city/nearby` and teaching `/api/products/count` to apply `verified` + location filters.
  - Keep category selection inside `/search` on non-categories surfaces by setting the `category` query param (categories surfaces still switch `/categories/[slug]`).
  - Update desktop category navigation to stay inside search (preserve query params).
- Files touched:
  - `app/[locale]/(main)/search/page.tsx`
  - `app/[locale]/(main)/search/_lib/search-products.ts`
  - `app/[locale]/(main)/_components/filters/filter-hub.tsx`
  - `app/[locale]/(main)/_components/filters/use-filter-count.ts`
  - `app/[locale]/(main)/_components/filters/filter-hub/filter-hub-utils.ts`
  - `app/api/products/count/route.ts`
  - `app/[locale]/(main)/search/_components/filters/search-filters.tsx`
  - `app/[locale]/(main)/search/_components/filters/sections/category-navigation.tsx`
- Verification:
  - `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅
  - `pnpm -s test:e2e:smoke` ✅

---

## B) Account / Settings Mobile — **Fixed (verified)**

### Issue: Account chrome + navigation inconsistent on mobile/tablet (locale-prefixed pathname, wrong active states, tab bar breakpoint)

- Repro (code-path issues found during audit):
  - On locale-prefixed routes (e.g. `/bg/account/orders`), `usePathname()` returns a locale-prefixed pathname, but account chrome compared it against locale-less paths like `/account/orders`.
    - Header title could fall back to “My Account” instead of the current section.
    - Sidebar/tab-bar active states could fail to highlight the current section.
  - Some account toolbars built URLs using `pathname` and then called `router.replace(...)` via next-intl navigation wrappers, risking double locale prefixes (`/bg/bg/...`) in the same way search pagination previously did.
  - Account bottom tab bar was visible on `md` widths even though the sidebar appears at `md`, and content padding only switched at `lg`.
- Root cause:
  - `createNavigation(routing)` uses `localePrefix: "always"`, so `usePathname()` yields locale-prefixed paths.
  - Account UI treated `pathname` as locale-less and, in billing, manually prefixed locale again.
  - Breakpoints for account padding/tab bar didn’t align with sidebar breakpoint (`md`).
- Fix strategy:
  - Normalize `usePathname()` by stripping `/${locale}` before doing route comparisons or building URLs for `Link`/`router`.
  - Remove manual locale prefixing from billing links (pass locale-less hrefs to next-intl `Link`).
  - Align account “desktop” padding and tab bar visibility with `md` (sidebar breakpoint).
- Files touched:
  - `app/[locale]/(account)/_components/account-layout-content.tsx`
  - `app/[locale]/(account)/account/_components/account-header.tsx`
  - `app/[locale]/(account)/account/_components/account-sidebar.tsx`
  - `app/[locale]/(account)/account/_components/account-tab-bar.tsx`
  - `app/[locale]/(account)/account/orders/_components/account-orders-toolbar.tsx`
  - `app/[locale]/(account)/account/wishlist/_components/account-wishlist-toolbar.tsx`
  - `app/[locale]/(account)/account/billing/billing-content.tsx`
  - `app/[locale]/(account)/account/billing/billing-current-plan-card.tsx`
  - `app/[locale]/(account)/account/billing/billing-history-tabs.tsx`
- Verification:
  - `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅

---

## C) Sell Flow UX — **Improved (verified)**

### Issue: Build/typecheck failure in sell stepper reduced-motion handling

- Repro:
  - `pnpm -s build` failed TypeScript with `Property 'addListener' does not exist on type 'never'.`
- Root cause:
  - `window.matchMedia(...)` returns `MediaQueryList` where `addEventListener` is always present in TS libs, making the fallback `addListener` branch statically unreachable → `mql` narrowed to `never`.
- Fix strategy:
  - Use the standard `addEventListener("change", ...)`/`removeEventListener` path only.
- Files touched:
  - `app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx`
- Verification:
  - Included in `pnpm -s build` + `pnpm -s typecheck`.

### Issue: Mobile sell wizard blocked on Details step; review “Edit” links jumped to wrong step

- Repro (UX issues found during audit):
  - Mobile flow could force users to satisfy the 50-character description requirement in the middle of the wizard (Details step), even though the Review screen already communicates missing required fields.
  - Review “Edit” actions were based on an older step numbering scheme; editing Item Specifics / Pricing could send users to the wrong step in the 5-step flow.
- Root cause:
  - `MobileLayout` validated `description` on step 3 via `trigger(["condition","description"])` and `canContinue` gating.
  - `StepReview` remapped an older 3-step review edit contract onto the new 5-step wizard, while category/condition/description live on different steps now.
- Fix strategy:
  - Move the `DescriptionField` to the Review step (keeps the publish requirement, but removes mid-flow blocking).
  - Relax step 3 validation to only gate on `condition` (which has a safe default).
  - Update Review edit links to use the new step numbers directly (1/2/3/4) and route description errors to step 5.
- Files touched:
  - `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
  - `app/[locale]/(sell)/_components/steps/step-details.tsx`
  - `app/[locale]/(sell)/_components/steps/step-review.tsx`
  - `app/[locale]/(sell)/_components/fields/review-field.tsx`
- Verification:
  - `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅

---

## D) Stripe Webhook Idempotency — **Verified (unit)**

- Orders (`app/api/checkout/webhook/route.ts`)
  - Idempotency key: `stripe_payment_intent_id` (upsert) + guard against duplicate `order_items` inserts.
  - Unit: `__tests__/checkout-webhook-idempotency.test.ts` ✅ (includes signature-failure “no DB work” assertion)
- Listing boosts (`app/api/payments/webhook/route.ts`)
  - Idempotency key: `stripe_checkout_session_id` (unique). On retry, fetch existing `expires_at` so replays cannot extend duration.
  - Unit: `__tests__/payments-webhook-idempotency.test.ts` ✅ (includes signature-failure “no DB work” assertion)
- Subscriptions (`app/api/subscriptions/webhook/route.ts`)
  - Signature verified before DB writes; subscription row uses `upsert(..., { onConflict: "stripe_subscription_id" })`; other events are update-only.
  - No changes required in this pass.

---

## Build / Prerender / Cache Components — **Fixed**

### Issue: `pnpm -s build` fails with “Uncached data was accessed outside of `<Suspense>`”

- Repro:
  - `pnpm -s build` failed during prerender with Next.js Cache Components “blocking-route” errors (e.g. `/[locale]/categories/[slug]`).
- Root cause:
  - `app/[locale]/locale-providers.tsx` is an async Server Component (awaits `getScopedMessages(...)`) and was rendered from `app/[locale]/layout.tsx` without a `<Suspense>` boundary.
  - In Cache Components mode, this makes dynamic routes “blocking” and fails `next build --turbopack`.
- Fix strategy:
  - Wrap `<LocaleProviders>` in `<Suspense fallback={null}>` inside the locale layout so the provider can suspend without making the whole route blocking.
  - Reduce category-route prerender surface to placeholder-only params to avoid expensive or brittle build-time generation.
  - Ensure members list data is cookie-free + cached for prerender safety.
- Files touched:
  - `app/[locale]/layout.tsx`
  - `app/[locale]/(main)/categories/[slug]/page.tsx`
  - `app/[locale]/(main)/categories/[slug]/[subslug]/page.tsx`
  - `app/[locale]/(main)/members/_lib/get-members-page-data.ts`
- Verification:
  - `pnpm -s build` ✅
  - `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅ (lint warnings only)
- Remaining risks / follow-ups:
  - Build logs intermittently show `[api/seller/top] Supabase query failed` during prerender. This doesn’t break build, but may indicate RLS/relationship-query issues for that endpoint at runtime.
  - Category routes now rely on placeholder-only SSG and runtime rendering for real slugs; confirm UX + performance on real category paths.
