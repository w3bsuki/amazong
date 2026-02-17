# Sell Domain Audit

## Scope

- `app/[locale]/(sell)`
- `app/[locale]/(sell)/_actions/sell.ts`
- `lib/sell/schema.ts`
- `app/actions/products.ts`
- `app/actions/orders.ts` (sell-adjacent behavior)
- `components/mobile/drawers/product-quick-view-drawer.tsx`
- `hooks/use-product-quick-view-details.ts`

## Current State Summary

- Sell UX is feature-rich but spread across large route/client/action files.
- Validation and listing creation logic is repeated across multiple entry points.

## Findings

## P0

- `app/[locale]/(sell)/sell/sell-page-client.tsx` (`215 lines`) mixes auth gate, onboarding checks, payout checks, and full render orchestration.
- `app/[locale]/(sell)/_components/sell-form-unified.tsx` (`372 lines`) includes client-side auth checks that overlap server action checks.
- Listing creation logic is duplicated between:
  - `app/[locale]/(sell)/_actions/sell.ts`
  - `app/actions/products.ts` (`828 lines`)

## P1

- Business rules/validation are repeated across Zod schemas and action-level checks.
- Quick-view data flow adds another fetch path (`use-product-quick-view-details`) instead of reusing existing data contracts.

## P2

- `app/actions/orders.ts` (`947 lines`) mixes order, notification, and conversation side effects.

## Simplification Targets

1. Separate sell route gating from sell form rendering.
2. Use one canonical listing creation service.
3. Normalize validation once at boundary; avoid repeated downstream checks.
4. Decouple order updates from messaging/notification side effects.

## Suggested Module Boundaries

- `sell/data`: seller state, payout readiness, category metadata.
- `sell/gating`: auth/onboarding/payout gating components.
- `sell/form`: form-only state and UI orchestration.
- `sell/actions`: thin server actions delegating to shared listing service.
- `sell/ux`: optional/secondary UX layers (quick-view, helpers).

## High-Risk Pause Areas

- Seller payout readiness logic.
- Any change touching payment-adjacent listing/order flows.
- Notification/conversation integrity on order updates.

## Success Criteria

- One listing creation implementation path.
- Reduced client auth duplication.
- Smaller, clearer sell route files.
- Existing listing creation flow remains production-safe.
