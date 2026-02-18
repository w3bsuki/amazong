# FEATURE-MAP.md — Feature Docs to Code Map

This map links feature documentation to route groups and main implementation paths.

## Feature Index

| Feature doc | Primary routes | Core implementation paths |
|-------------|----------------|---------------------------|
| `docs/features/auth.md` | `app/[locale]/(auth)/**`, `app/[locale]/(onboarding)/**` | `components/auth/**`, `components/providers/auth-state-manager.tsx`, `lib/auth/**`, `lib/supabase/middleware.ts`, `proxy.ts` |
| `docs/features/bottom-nav.md` | `app/[locale]/(main)/**` (mobile surfaces) | `components/ui/mobile-bottom-nav.tsx`, `components/mobile/**`, `app/[locale]/_components/mobile-tab-bar.tsx` |
| `docs/features/checkout-payments.md` | `app/[locale]/(checkout)/**`, `app/api/checkout/**`, `app/api/payments/**`, `app/api/subscriptions/**`, `app/api/connect/**` | `app/[locale]/(checkout)/_actions/checkout.ts`, `app/actions/payments.ts`, `lib/stripe.ts`, `lib/stripe-connect.ts`, `lib/env.ts` |
| `docs/features/header.md` | Global locale shell + `(main)` browsing | `app/[locale]/_components/app-header.tsx`, `components/layout/header/**`, `components/layout/sidebar/**` |
| `docs/features/product-cards.md` | `(main)` listings/search/category, `[username]/[productSlug]` surfaces | `components/shared/product/card/**`, `components/shared/product/quick-view/**`, `components/shared/product/product-price.tsx` |
| `docs/features/search-filters.md` | `app/[locale]/(main)/search/**`, `app/[locale]/(main)/categories/**` | `components/shared/search/**`, `components/shared/filters/**`, `lib/data/products.ts`, `lib/data/categories.ts` |
| `docs/features/sell-flow.md` | `app/[locale]/(sell)/**`, business product editing routes | `app/[locale]/(sell)/_components/**`, `app/[locale]/(sell)/_actions/sell.ts`, `lib/sell/schema.ts`, `app/[locale]/(business)/_components/product-form-modal.tsx` |

## Route Group Coverage

- `(account)`: account dashboard, orders, billing, profile, wishlist, settings.
- `(main)`: home/search/categories/cart/wishlist/support/legal.
- `(sell)`: listing creation and seller order surfaces.
- `(business)`: seller dashboard and product/order management.
- `(checkout)`: checkout UI and checkout actions.
- `(chat)`: conversation and messages surfaces.
- `(auth)` + `(onboarding)`: identity and setup flow.
- `[username]`: public profile and product presentation surfaces.

## Update Rule

Update this map when:
- a feature doc gains/loses route groups
- main implementation paths for a feature move
- shared components are promoted/demoted between route-private and shared layers

*Last updated: 2026-02-18*
