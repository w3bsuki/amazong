# Lean Sweep — Extractions Log

> Append-only. Log every meaningful change here.
> Format: what changed, why, from where → to where, lines before/after.

---

_Lean Sweep started: 2026-02-18_
_Phases: A (Dead Code) → B (Actions) → C (Shared Primitives) → D (Providers) → E (Utilities) → F (Data Layer) → G (Polish)_

---

## Baseline Metrics (pre-Lean Sweep)

| Metric | Value |
|--------|-------|
| Source files | 809 |
| Total lines | ~43,271 |
| `"use client"` files | 215 |
| >300-line files | 31 |
| >500-line files | ~15 (excl. auto-gen) |
| Clone % | 3.06% |

---

_Log entries below this line._

### 2026-02-18 — Preflight Stabilization + Phase A (Dead Code Purge)

- Preflight:
  - Fixed home prop drift in `app/[locale]/(main)/page.tsx` by removing stale payload branches and aligning props with `MobileHome`/`DesktopHome`.
  - Captured baseline snapshot at `.tmp/lean-sweep-baseline.json`.
- Dead code/files removed:
  - Deleted `app/[locale]/(main)/_components/responsive-home.tsx` (unused file).
  - Deleted `app/[locale]/(main)/_components/mobile/home-chip-styles.ts` (unused file).
  - Deleted `components/ui/toggle.tsx` after inlining `toggleVariants` into `components/ui/toggle-group.tsx`.
- Unused exports removed:
  - Removed `getDealsProducts` and obsolete legacy product constants from `lib/data/products.ts`.
  - Removed `MOBILE_CONTEXT_BANNER_CLASS` from `components/mobile/chrome/mobile-control-recipes.ts` and its re-export chain in `app/[locale]/(main)/_lib/mobile-rail-class-recipes.ts`.
- Audit results:
  - `pnpm -s knip` is now clean (no findings).
  - TODO/FIXME/HACK/TEMP triage found no actionable comment debt in `app/`, `components/`, `lib/`, `hooks/`.
  - AI SDK provider audit kept `@ai-sdk/google`, `@ai-sdk/openai`, and `@ai-sdk/groq` (all actively used by `lib/ai/models.ts`).
- Approximate impact:
  - Files: `809 -> 806`
  - `"use client"` files: `216 -> 215` (architecture scan)
  - Clone %: `3.06 -> 3.05`

### 2026-02-18 — Phase B + C/D/E Progress (Action/Provider/Utility Sweep)

- Phase B — action consolidation:
  - Split oversized action modules with stable re-export surfaces:
    - `app/actions/orders.ts` → `orders-reads.ts`, `orders-rating.ts`, `orders-status.ts`, `orders-support.ts`, `orders-shared.ts`
    - `app/actions/products.ts` → `products-create.ts`, `products-update.ts`, `products-bulk.ts`, `products-discounts.ts`, `products-shared.ts`
    - `app/actions/username.ts` → `username-availability.ts`, `username-account.ts`, `username-profile.ts`, `username-shared.ts`
  - Migrated auth checks in these action families to `requireAuth()`-based flows.
  - Canonicalized seller rating eligibility path to `canSellerRateBuyer` in split `orders` actions; duplicate removed from `buyer-feedback`.

- Phase C — shared primitives extracted:
  - Added `components/shared/stat-card.tsx` and migrated desktop stats-card rendering in:
    - `app/[locale]/(account)/account/orders/_components/account-orders-stats.tsx`
    - `app/[locale]/(account)/account/wishlist/_components/account-wishlist-stats.tsx`
    - `app/[locale]/(business)/_components/business-stats-cards.tsx`
  - Added `components/shared/header-dropdown.tsx` and migrated:
    - `components/dropdowns/messages-dropdown.tsx`
    - `components/dropdowns/wishlist-dropdown.tsx`
    - `components/dropdowns/account-dropdown.tsx`

- Phase D — provider/context simplification:
  - Replaced multi-boolean drawer state API with single `activeDrawer` model in `components/providers/drawer-context.tsx`.
  - Removed Storybook fallback branch from `useDrawer`.
  - Migrated drawer consumers to the new contract:
    - `app/[locale]/_components/global-drawers.tsx`
    - `app/[locale]/_components/mobile-tab-bar.tsx`
    - `app/[locale]/_providers/commerce-providers.tsx`
    - `components/shared/product/card/mobile.tsx`
    - `components/shared/product/card/desktop.tsx`
    - `components/layout/header/cart/mobile-cart-dropdown.tsx`
    - `components/shared/wishlist/mobile-wishlist-button.tsx`
    - `components/mobile/drawers/account-drawer.tsx`
  - Replaced parallel header setters with discriminated single-state channel in `components/providers/header-context.tsx`.
  - Updated all header sync clients and `app/[locale]/_components/app-header.tsx` to new `setHeaderState` contract.

- Phase E — utility consolidation:
  - Added `lib/data/search-products.ts` with shared filter/sort query helpers.
  - Refactored both route-private search query modules to consume shared logic:
    - `app/[locale]/(main)/search/_lib/search-products.ts`
    - `app/[locale]/(main)/categories/[slug]/_lib/search-products.ts`
  - Image utility audit completed; `image-utils`, `image-compression`, and `normalize-image-url` kept as distinct responsibilities.

- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
