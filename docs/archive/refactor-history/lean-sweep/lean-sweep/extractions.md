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

### 2026-02-18 — Batch 1 completion (shared dropdown/drawer primitives)

- Shared primitives created:
  - `components/shared/header-icon-trigger.tsx` (header icon trigger with badge support)
  - `components/shared/header-dropdown-shell.tsx` (shared dropdown title/footer slots)
  - `components/shared/account-menu-items.tsx` (shared account dropdown + drawer item renderers)
  - `components/shared/drawer-shell.tsx` (shared drawer wrapper/header/close shell)
  - `components/shared/product/card/metadata.ts` (shared product-card metadata + quick-view payload mapping)
- Consumers refactored:
  - Dropdowns:
    - `components/dropdowns/account-dropdown.tsx`
    - `components/dropdowns/messages-dropdown.tsx`
    - `components/dropdowns/wishlist-dropdown.tsx`
  - Mobile drawers:
    - `components/mobile/drawers/account-drawer.tsx`
    - `components/mobile/drawers/messages-drawer.tsx`
    - `components/mobile/drawers/cart-drawer.tsx`
    - `components/mobile/drawers/auth-drawer.tsx`
    - `components/shared/wishlist/wishlist-drawer.tsx`
  - Product cards:
    - `components/shared/product/card/desktop.tsx`
    - `components/shared/product/card/mobile.tsx`
- Outcome:
  - Repeated drawer header/close button plumbing removed across mobile drawer surfaces.
  - Account navigation link rendering is now centralized and reused between desktop dropdown and mobile drawer.
  - Product-card metadata shaping and quick-view payload construction are centralized.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅

### 2026-02-18 — Batch 2 in progress (sidebar/stat primitives)

- Shared primitives created:
  - `components/shared/dashboard-sidebar.tsx` (shared shell for dashboard sidebars)
- Consumers refactored:
  - `app/[locale]/(account)/account/_components/account-sidebar.tsx`
  - `app/[locale]/(business)/_components/business-sidebar.tsx`
  - `app/[locale]/(admin)/_components/admin-sidebar.tsx`
- Additional shared stat-card adoptions:
  - `app/[locale]/(admin)/_components/admin-stats-cards.tsx`
  - `app/[locale]/(account)/account/_components/account-addresses-stats.tsx`
- Outcome:
  - Sidebar structural scaffolding (header/content/footer wrapper) is centralized for account/business/admin.
  - Admin and account-addresses stats now use shared stat primitives instead of repeated raw card scaffolding.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅

### 2026-02-18 — Batch 2 continuation (activity + order list/detail primitives)

- Shared primitives created:
  - `components/shared/activity-feed.tsx` (91 lines)
  - `components/shared/order-list-item.tsx` (125 lines)
  - `components/shared/order-detail/order-header.tsx` (86 lines)
  - `components/shared/order-detail/order-price-summary.tsx` (50 lines)
- Activity-feed consumers refactored:
  - `app/[locale]/(account)/account/_components/account-recent-activity.tsx` (now uses shared `ActivitySectionHeader`)
  - `app/[locale]/(business)/_components/business-recent-activity.tsx` (now uses shared `ActivityRow` + `ActivityThumbnail`)
- Order-list consumers refactored:
  - `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx` (`707 -> 631`)
  - `app/[locale]/(business)/_components/orders-table.tsx` (`636 -> 622`)
- Order-detail consumers refactored:
  - `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` (`793 -> 766`)
  - `app/[locale]/(business)/_components/order-detail-view.tsx` (`453 -> 429`)
- Outcome:
  - Shared order status badge + product thumbnail primitives now power account/business order list surfaces.
  - Shared order-detail header and price-summary rows now power both account and business detail pages.
  - Activity header/row/thumbnail primitives now cover both account and business dashboard activity views.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `829`
  - `"use client"`: `216`
  - `>300` lines: `117`
  - Missing metadata: `53`
  - Clones: `237` (`2.97%`)

### 2026-02-18 — Batch 2 continuation (order detail item-list primitive)

- Shared primitive created:
  - `components/shared/order-detail/order-items-list.tsx` (60 lines)
- Consumers refactored:
  - `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` (`766 -> 765`)
  - `app/[locale]/(business)/_components/order-detail-view.tsx` (`429 -> 435`)
- Additional dedupe in account order detail:
  - Seller feedback dialog moved from per-item render to a single shared dialog instance in `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` (parity preserved).
- Outcome:
  - Order-detail item row shell + list wrapper are now shared across account/business order detail pages.
  - Repeated item media/container scaffolding is centralized in shared primitives.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `830`
  - `"use client"`: `216`
  - `>300` lines: `117`
  - Missing metadata: `53`
  - Clones: `237` (`2.97%`)

### 2026-02-18 — Batch 2 continuation (dashboard/activity/order-shell convergence) + Phase F cache slice

- Shared primitives created:
  - `components/shared/dashboard-header-shell.tsx`
  - `components/shared/order-detail/order-side-card.tsx`
  - `components/shared/order-summary-line.tsx`
- Existing shared activity primitives extended:
  - `components/shared/activity-feed.tsx` now also exports reusable shells:
    - `ActivityCardShell`
    - `ActivityScrollList`
    - `ActivityEmptyState`
    - `ActivityListShell`
- Batch 2 consumers refactored:
  - Header shell adoption:
    - `app/[locale]/(account)/account/_components/account-header.tsx`
    - `app/[locale]/(business)/_components/business-header.tsx`
    - `app/[locale]/(admin)/_components/dashboard-header.tsx`
  - Activity shell adoption:
    - `app/[locale]/(account)/account/_components/account-recent-activity.tsx`
    - `app/[locale]/(business)/_components/business-recent-activity.tsx`
    - `app/[locale]/(admin)/_components/admin-recent-activity.tsx`
  - Order detail side-card adoption:
    - `app/[locale]/(account)/account/orders/[id]/_components/order-timeline.tsx`
    - `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx`
    - `app/[locale]/(business)/_components/order-detail-view.tsx`
  - Order summary primitive adoption:
    - `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx`
    - `app/[locale]/(business)/_components/orders-table.tsx`
- Phase F (data layer/caching) change:
  - `lib/data/plans.ts:getPlansForUpgrade()` updated to cached static-read pattern:
    - added `'use cache'`
    - added `cacheTag("plans")` + `cacheLife("max")`
    - switched `createClient()` -> `createStaticClient()`
  - Return shape/default mapping preserved (`commission_rate`, `is_active`, `features` fallbacks unchanged).
- Outcome:
  - Cross-route dashboard/order/activity structural duplication reduced further without changing routes/actions/API contracts.
  - Plan-upgrade fetch path is now cache-safe and aligned with `docs/STACK.md` cached Supabase rules.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `833`
  - `"use client"`: `217`
  - `>300` lines: `117`
  - Missing metadata: `53`
  - Clones: `237` (`2.96%`)

### 2026-02-18 — Phase F continuation (cache coverage for category/product wrappers)

- Cached fetchers updated:
  - `lib/data/category-attributes.ts`
    - `resolveCategoryAttributes(...)` now uses:
      - `'use cache'`
      - `cacheLife('categories')`
      - category/attribute tags (`category:*`, `attrs:category:*`, optional `attrs:global`)
  - `lib/data/categories.ts`
    - `getSubcategoriesForBrowse(...)` now uses:
      - `'use cache'`
      - `cacheLife('categories')`
      - `subcategories:*:counts` + related category tree/children tags
  - `lib/data/products.ts`
    - `getCategoryRowProducts(...)` now uses:
      - `'use cache'`
      - `cacheLife('products')`
      - `products:category:*` tag
    - `getBoostedProducts(...)` now uses:
      - `'use cache'`
      - `cacheLife('products')`
      - `products:type:featured` tag
- Supabase client correctness:
  - All modified cached fetchers use `createStaticClient()` (no cookie reads).
- Cache invalidation audit notes:
  - No direct `revalidateTag(...plans...)` call was found in `app/` or `lib/` (follow-up needed if plan content mutability expands).
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `833`
  - `"use client"`: `217`
  - `>300` lines: `117`
  - Missing metadata: `53`
  - Clones: `237` (`2.96%`)

### 2026-02-18 — Completion checkpoint (phase/batch finalization)

- Finalized completion bookkeeping for implemented phases:
  - Lean Sweep `C` (Shared Primitives) marked complete.
  - Lean Sweep `D` (Provider Simplification) marked complete.
  - Lean Sweep `E` (Utility Consolidation) marked complete.
- Program batch progression updated:
  - Batch 2 (Cross-route shared primitives) marked complete.
  - Batch 3 set as active next batch.
- Notes:
  - `components/providers/currency-context.tsx` is absent and `useCurrency` usage search returns no matches.
  - Phase `F` remains in progress (cache coverage expanded, invalidation/client-context audit still open).

### 2026-02-18 — Batch 3 continuation (quick-view chrome dedupe)

- Shared primitive created:
  - `components/shared/product/quick-view/quick-view-chrome.tsx` (205 lines)
- Consumers refactored:
  - `components/shared/product/quick-view/product-quick-view-desktop-content.tsx` (`246 -> 199`)
  - `components/shared/product/quick-view/product-quick-view-mobile-content.tsx` (`258 -> 210`)
- Outcome:
  - Shared quick-view action buttons now drive both desktop and mobile header controls (copy/wishlist/close).
  - Shared quick-view footer CTA row now drives both layouts (buy/add actions with existing labels/aria preserved).
  - Shared buyer-protection card and seller skeleton card now drive both layouts with layout-specific class props only.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `839`
  - `"use client"`: `217`
  - `>300` lines: `117`
  - Missing metadata: `53`
  - Clones: `234` (`2.88%`)

### 2026-02-18 — Batch 3 continuation (admin notes/tasks decomposition)

- Shared/admin-local primitives created:
  - `app/[locale]/(admin)/admin/_components/admin-card-hover-actions.tsx` (42 lines)
  - `app/[locale]/(admin)/admin/_components/admin-dialog-shell.tsx` (47 lines)
- Notes decomposition:
  - Extracted `app/[locale]/(admin)/admin/notes/_components/types.ts` (11 lines)
  - Extracted `app/[locale]/(admin)/admin/notes/_components/note-card.tsx` (63 lines)
  - Extracted `app/[locale]/(admin)/admin/notes/_components/note-dialog.tsx` (76 lines)
  - Refactored `app/[locale]/(admin)/admin/notes/_components/notes-content.tsx` (`~300+ -> 152`)
- Tasks decomposition:
  - Extracted `app/[locale]/(admin)/admin/tasks/_components/types.ts` (25 lines)
  - Extracted `app/[locale]/(admin)/admin/tasks/_components/tasks-content.constants.ts` (22 lines)
  - Extracted `app/[locale]/(admin)/admin/tasks/_components/task-card.tsx` (84 lines)
  - Extracted `app/[locale]/(admin)/admin/tasks/_components/task-dialog.tsx` (116 lines)
  - Refactored `app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx` (`~400+ -> 173`)
- Outcome:
  - Notes/tasks card hover edit/delete controls are now centralized in a shared admin-local primitive.
  - Notes/tasks create/edit dialog shell structure is now centralized in a shared admin-local primitive.
  - Both admin content modules are significantly smaller and now focused on data operations + orchestration only.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `848`
  - `"use client"`: `217`
  - `>300` lines: `115`
  - Missing metadata: `53`
  - Clones: `232` (`2.80%`)

### 2026-02-18 — Batch 3 continuation (admin docs decomposition)

- Docs decomposition:
  - Added `app/[locale]/(admin)/admin/docs/_components/docs-types.ts` (14 lines)
  - Added `app/[locale]/(admin)/admin/docs/_components/docs-config.ts` (75 lines)
  - Added `app/[locale]/(admin)/admin/docs/_components/docs-table.tsx` (198 lines)
  - Added `app/[locale]/(admin)/admin/docs/_components/doc-editor.tsx` (252 lines)
  - Refactored `app/[locale]/(admin)/admin/docs/_components/docs-content.tsx` (`679 -> 219`)
- Outcome:
  - Admin docs data operations now live in a thin orchestration layer (`docs-content.tsx`).
  - Table/filter rendering and doc view/edit UI are isolated into focused modules with unchanged UX/behavior.
  - Slug/category/status config and helpers are centralized in dedicated docs config/types modules.
- Verification:
  - `pnpm -s typecheck` ✅
  - `pnpm -s lint` ✅ (warnings only; no errors)
  - `pnpm -s styles:gate` ✅
  - `pnpm -s test:unit` ✅
  - `pnpm -s architecture:scan` ✅
- Metrics snapshot (`architecture:scan`):
  - Files: `852`
  - `"use client"`: `217`
  - `>300` lines: `114`
  - `>500` lines: `38`
  - Missing metadata: `53`
  - Clones: `232` (`2.80%`)
