# Phase 03 - Components and Styling Cleanup

## Objective

Shrink component duplication and enforce shadcn/Tailwind boundaries without UI regressions.

## Context7 docs used (date + links)

- Date: 2026-02-07
- https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/functions-and-directives.mdx
- https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/theme.mdx

## Checklist

- [x] Enforced `components/ui/*` primitive-only contract (no app/business imports added to primitives).
- [x] Moved app-specific composites to `components/shared/*` or route-private `_components`.
- [x] Removed dead components and wrappers confirmed unused in runtime paths.
- [x] Removed Storybook story sprawl (`52 -> 0` stories).
- [x] Kept `styles:gate` clean after component and class changes.
- [x] Ran full gates and recorded output in Phase 06.

## Files touched

- `components/shared/navigation/app-breadcrumb.tsx` (moved from `components/navigation/app-breadcrumb.tsx`)
- `components/shared/charts/chart-area-interactive.tsx` (moved from `components/charts/chart-area-interactive.tsx`)
- `components/shared/orders/order-status-badge.tsx` (moved from `components/orders/order-status-badge.tsx`)
- `components/shared/orders/order-status-config.ts` (moved from `components/orders/order-status-config.ts`)
- `components/shared/seller/follow-seller-button.tsx` (moved from `components/seller/follow-seller-button.tsx`)
- `app/[locale]/(onboarding)/onboarding/_components/account-type-card.tsx` (moved from `components/onboarding/account-type-card.tsx`)
- `app/[locale]/(onboarding)/onboarding/_components/interest-chip.tsx` (moved from `components/onboarding/interest-chip.tsx`)
- `app/[locale]/(onboarding)/onboarding/_components/onboarding-shell.tsx` (moved from `components/onboarding/onboarding-shell.tsx`)
- `app/[locale]/(account)/account/_components/plan-card.tsx` (moved from `components/pricing/plan-card.tsx`)
- `components/mobile/mobile-category-browser.tsx`
- `app/[locale]/(main)/categories/[slug]/page.tsx`
- `components/layout/cookie-consent.tsx`
- `components/mobile/mobile-tab-bar.tsx`
- `e2e/mobile-responsiveness.spec.ts`
- Deleted:
  - `hooks/use-current-username.ts`
  - `components/mobile/home-newest-controls.tsx`
  - `components/mobile/mobile-menu-sheet.tsx`
  - `components/mobile/mobile-category-browser-traditional.tsx`
  - `components/sections/start-selling-banner.tsx`
  - `components/storybook/introduction.mdx`
  - all `components/**/*.stories.*` story files

## Verification output

- `pnpm -s styles:gate` -> pass (no semantic token/palette/arbitrary violations)
- `pnpm -s typecheck` -> pass
- `pnpm -s lint` -> pass with warnings (no errors)

## Decision log

- Reduced `MobileCategoryBrowser` to contextual-only surface and removed traditional mode component.
- Kept auth/payment behavior unchanged while removing dead wrappers and stale paths.
- Removed empty legacy folders after moves (`components/navigation`, `components/charts`, `components/orders`, `components/onboarding`, `components/pricing`).

## Done

- [x] Phase 03 complete
