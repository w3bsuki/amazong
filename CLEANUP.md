# TREIDO Production Cleanup Plan

**Created**: 2026-01-25  
**Updated**: 2026-01-25  
**Goal**: Nuke all over-engineered stuff, duplicates, and dead code before production launch  
**Method**: Folder-by-folder systematic cleanup with checkmarks. Each folder is a "unit of work."

---

## Cleanup Session Log (2026-01-25)

### Completed ✅
| Item | Action | Lines Removed |
|------|--------|---------------|
| `components/shared/boost/boost-dialog.tsx` | DELETED (duplicate of account/selling version) | -273 |
| `app/api/products/create/route.ts` | DELETED (unused, sell form uses server action) | -379 |
| `app/api/products/deals/route.ts` | DELETED (no frontend calls) | -85 |
| `app/api/products/nearby/route.ts` | DELETED (no frontend calls) | -90 |
| `lib/data/products.ts` | REFACTORED (extracted `mapRowToProduct()` helper) | -30 (deduped) |
| `lib/sell-form-schema-v4.ts` | DELETED (unused barrel, imports updated to lib/sell/schema-v4) | -4 |
| **Total** | | **~861 lines** |

### lib/ Full Audit (Session 2)
**Result**: All lib/ files actively used. Knip reports no unused exports.
- Deleted `lib/sell-form-schema-v4.ts` (unused re-export barrel)
- Updated `ai-listing-assistant.tsx` to import from canonical `lib/sell/schema-v4`
- Updated `vitest.config.ts` to remove deleted file from coverage exclusions
- Reviewed all 17 subfolders and 30+ root files — all actively imported

### components/ Full Audit (Session 3)
**Result**: All components actively used or serve architectural purposes. No deletions needed.
- **components/ui/**: Shadcn component kit - exports for completeness (TableFooter, BreadcrumbEllipsis, etc.)
- **components/layout/sidebar/**: Cleaned - unused fns defined but NOT exported (correct pattern)
- **components/shared/filters/**: Internal duplication is render patterns, not dead code. Helper components properly extracted.
- **components/mobile/drawers/**: Different patterns serve different UX (controlled vs self-contained)
- **Quick view components**: Already properly deduplicated via shared `ProductQuickViewContent`
- TypeScript check: ✅ Pass
- Knip: ✅ No issues

### Reviewed & Kept (Not Duplicates)
- `product-card.tsx` vs `product-card-list.tsx` — Different layouts (grid vs list view)
- `admin/notes` vs `admin/tasks` — Different features (pinned notes vs kanban board)  
- `pricing-field.tsx` vs `step-pricing.tsx` — Different UX (desktop compact vs mobile wizard)
- `plans/upgrade` page + modal — Correct Next.js intercepting routes pattern
- `products/feed` + `products/newest` API routes — Actively used by frontend
- `lib/data/categories.ts` internal `getCategoryAttributeKey` — Private helper, not duplicate of exported one in lib/filters/

### Commits
- `afc967a` - Deduplicate boost-dialog, extract mapRowToProduct helper
- `5e83e52` - Delete unused API routes
- `148b4ea` - Audit components/ folder - all kept with reasons

---

## How to Use This File

1. **Pick an unchecked folder** from the list below
2. **Open a fresh chat** (clean context window)
3. **Reference this file** and say: "I'm cleaning folder X per CLEANUP.md"
4. **Complete the cleanup** for that folder
5. **Mark the checkbox** `[x]` when done
6. **Commit the changes** (optional: small commits per folder)
7. **Repeat** with the next folder

---

## Codex Review (2026-01-25)

**Approved to run**: Yes — with guardrails.

**Guardrails (recommended)**:
- Work on a branch; merge sequentially (avoid parallel conflicting edits).
- Split work by folder (one folder = one PR or a small set of commits).
- After each folder: run `pnpm -s exec tsc -p tsconfig.json --noEmit` + `pnpm test:unit`.
- After high-impact folders (`components/shared/filters`, `app/api`, `lib/data`): also run `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`.
- Avoid deleting docs/tests unless you verified all references/routes (especially `docs-site/` content).
- Use `git mv` for moves so history isn’t lost.

**If you + Opus run it together**:
- Pick non-overlapping folders (no two agents touching the same folder tree).
- Maintain a shared checklist ownership note per folder (who is doing what) and merge in order.

## Quick Reference: Known Issues

### From `cleanup/knip-report.txt` (Unused Exports)
- 2 unused dependencies: `@ai-sdk/gateway`, `@radix-ui/react-toggle`
- 21 unused exports (mostly in sidebar.tsx, table.tsx, toast.tsx, breadcrumb.tsx, sheet.tsx)
- 5 unused exported types

### From `cleanup/dupes-report.txt` (Code Clones)
- **Filters**: filter-modal.tsx, filter-hub.tsx, filter-list.tsx, size-tiles.tsx, color-swatches.tsx have massive duplication
- **Product Cards**: product-card.tsx, product-card-list.tsx share duplicated code
- **Drawers**: cart-drawer.tsx, wishlist-drawer.tsx, messages-drawer.tsx duplicate patterns
- **Boost Dialog**: Two near-identical boost dialogs (account/selling vs shared/boost)
- **Pricing**: pricing-field.tsx and step-pricing.tsx are 80% duplicated
- **Category Nav**: category-quick-pills.tsx and category-tabs.tsx duplicate logic

### From `audit/CODEBASE_AUDIT_REFACTOR_2026-01-24.md` (Critical Issues)
- Duplicated product creation flows
- Multiple overlapping product feed endpoints
- Category tree logic duplicated
- Three docs folders (docs/, docs-site/, docs-final/)
- Token sprawl across globals.css, legacy-vars.css, shadcn-components.css

---

## Pre-Cleanup Gates

Run these before starting cleanup to establish baseline:

- [x] `pnpm -s exec tsc -p tsconfig.json --noEmit` — No type errors (2026-01-25)
- [x] `pnpm test:unit` — All unit tests pass (26 files / 407 tests) (2026-01-25)
- [x] `pnpm -s lint` — No lint errors (warnings only) (2026-01-25)
- [x] `pnpm -s build` — Production build succeeds (2026-01-25)
- [x] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` — 18 passed / 1 skipped (2026-01-25)

---

## Folder Checklist

### 📁 Root Config Files
- [x] **package.json** — Remove unused deps ✅ (Codex removed them already - knip clean)
- [ ] **Root .md files** — Consolidate/archive redundant docs (AI_ASSISTANT.md, CLAUDE.md, etc.)
- [ ] **.env files** — Ensure no secrets, proper .env.example exists

---

### 📁 `lib/` — Core Library Code

**Session 2026-01-25**: Full audit complete. Knip reports no unused exports. All files actively used.

#### `lib/` root files
- [x] **lib/utils.ts** — ✅ KEPT (cn + safeAvatarSrc helpers, actively used)
- [x] **lib/currency.ts** — ✅ KEPT (used by pricing components)
- [x] **lib/format-price.ts** — ✅ KEPT (used across app, has unit tests)
- [x] **lib/geolocation.ts** — ✅ KEPT (used by location features, has unit tests)
- [x] **lib/image-utils.ts** — ✅ KEPT (normalizeImageUrl, distinct from compression)
- [x] **lib/image-compression.ts** — ✅ KEPT (client-side compression for photos-field)
- [x] **lib/normalize-image-url.ts** — ✅ KEPT (used by data layer)
- [x] **lib/order-status.ts** — ✅ KEPT (used by order components, has unit tests)
- [x] **lib/safe-json.ts** — ✅ KEPT (used by API routes, has unit tests)
- [x] **lib/shipping.ts** — ✅ KEPT (used by checkout flow, has unit tests)
- [x] **lib/stripe.ts** — ✅ KEPT (Stripe initialization)
- [x] **lib/stripe-locale.ts** — ✅ KEPT (locale mapping for Stripe, has unit tests)
- [x] **lib/stripe-connect.ts** — ✅ KEPT (seller onboarding flow)
- [x] **lib/logger.ts** — ✅ KEPT (centralized logging, used by 10+ files)
- [x] **lib/structured-log.ts** — ✅ KEPT (backing impl for logger.ts)
- [x] **lib/env.ts** — ✅ KEPT (environment variable helpers)
- [x] **lib/feature-flags.ts** — ✅ KEPT (feature flag management)
- [x] **lib/category-display.ts** — ✅ KEPT (category name i18n helper)
- [x] **lib/category-tree.ts** — ✅ KEPT (tree types used by navigation)
- [x] **lib/category-icons.tsx** — ✅ KEPT (icon mapping for categories)
- [x] **lib/category-attribute-config.ts** — ✅ KEPT (static config)
- [x] **lib/analytics-drawer.ts** — ✅ KEPT (used by drawer-context)
- [x] **lib/avatar-palettes.ts** — ✅ KEPT (boring avatar colors)
- [x] **lib/bulgarian-cities.ts** — ✅ KEPT (geolocation data)
- [x] **lib/product-card-hero-attributes.ts** — ✅ KEPT (hero spec extraction, has unit tests)
- [x] **lib/order-conversations.ts** — ✅ KEPT (used by checkout webhook)
- [x] **lib/url-utils.ts** — ✅ KEPT (URL helpers, has unit tests)
- [x] **lib/filter-priority.ts** — ✅ KEPT (used by quick-filter-row)
- [x] **lib/sell-form-schema-v4.ts** — ✅ DELETED (unused barrel, updated ai-listing-assistant.tsx to use canonical lib/sell/schema-v4)

#### `lib/ai/`
- [x] ✅ KEPT — AI assistant features, used by assistant API routes, feature-flagged via isAiAssistantEnabled

#### `lib/api/`
- [x] ✅ KEPT — response-helpers.ts used by API routes

#### `lib/auth/`
- [x] ✅ KEPT — admin.ts, business.ts, require-auth.ts all actively used by protected routes

#### `lib/boost/`
- [x] ✅ KEPT — boost-status.ts used by products.ts and search, has unit tests

#### `lib/data/`
- [x] **products.ts** — ✅ Extracted `mapRowToProduct()` helper to deduplicate mapping logic
- [x] **categories.ts** — ✅ KEPT (category data fetching, internal getCategoryAttributeKey is private helper)
- [x] **plans.ts** — ✅ KEPT (subscription plans)
- [x] **product-page.ts** — ✅ KEPT (product page data)
- [x] **product-reviews.ts** — ✅ KEPT (reviews fetching)
- [x] **profile-page.ts** — ✅ KEPT (profile page data)

#### `lib/filters/`
- [x] ✅ KEPT — category-attribute.ts and pending-attributes.ts used by filter-modal/filter-hub

#### `lib/next/`
- [x] ✅ KEPT — is-next-prerender-interrupted.ts used by API routes

#### `lib/sell/`
- [x] ✅ KEPT — schema-v4.ts is canonical sell form schema, used by all sell components

#### `lib/supabase/`
- [x] ✅ KEPT — client.ts, server.ts, middleware.ts, messages.ts, database.types.ts all essential

#### `lib/types/`
- [x] ✅ KEPT — badges.ts, messages.ts used by components and providers

#### `lib/upload/`
- [x] ✅ KEPT — image-upload.ts used by photos-field

#### `lib/utils/`
- [x] ✅ KEPT — category-type.ts used by product CTAs (automotive/real-estate specialization)

#### `lib/validations/`
- [x] ✅ KEPT — auth.ts, password-strength.ts used by auth forms, has unit tests

#### `lib/view-models/`
- [x] ✅ KEPT — product-page.ts used by product page components

#### `lib/attributes/`
- [x] ✅ KEPT — normalize-attribute-key.ts used by categories and sell actions

---

### 📁 `components/` — UI Components

**Session 2026-01-25**: Full audit complete. All components either actively used or serve shadcn/responsive architecture purposes.

#### `components/ui/` — Shadcn Components
- [x] **accordion.tsx** — ✅ KEPT (shadcn component, arbitrary values are intentional)
- [x] **breadcrumb.tsx** — ✅ KEPT (shadcn kit - BreadcrumbEllipsis for completeness)
- [x] **pagination.tsx** — ✅ KEPT (shadcn component, internal duplication is acceptable)
- [x] **sheet.tsx** — ✅ KEPT (shadcn kit - SheetClose for completeness)
- [x] **table.tsx** — ✅ KEPT (shadcn kit - TableFooter/TableCaption for completeness)
- [x] **toast.tsx** — ✅ KEPT (shadcn kit - ToastProvider etc. for completeness)
- [x] **toggle.tsx** — ✅ KEPT (shadcn component)
- [x] **radio-group.tsx** — ✅ KEPT (shadcn component)
- [x] **textarea.tsx** — ✅ KEPT (shadcn component)
- [x] **All other ui/ components** — ✅ KEPT (shadcn kit pattern, exports for completeness)

#### `components/auth/`
- [x] ✅ KEPT — Auth forms actively used by auth flow

#### `components/category/`
- [x] ✅ KEPT — Category navigation components

#### `components/charts/`
- [x] ✅ KEPT — Analytics/dashboard charts

#### `components/desktop/`
- [x] **desktop-search.tsx** — ✅ KEPT (internal duplication acceptable, not dead code)
- [x] **desktop-home.tsx** — ✅ KEPT (internal duplication acceptable)
- [x] **product/product-quick-view-dialog.tsx** — ✅ KEPT (uses shared ProductQuickViewContent, desktop wrapper)
- [x] **product/desktop-specs-accordion.tsx** — ✅ KEPT (internal duplication acceptable)
- [x] **All other desktop components** — ✅ KEPT (actively used)

#### `components/dropdowns/`
- [x] ✅ KEPT — Dropdown menu components

#### `components/layout/`
- [x] **sidebar/sidebar.tsx** — ✅ KEPT (unused fns defined but NOT exported - correct pattern. Only actively used exports)
- [x] **header/cart/mobile-cart-dropdown.tsx** — ✅ KEPT (self-contained trigger+drawer, different from CartDrawer which is controlled)
- [x] **All other layout components** — ✅ KEPT (actively used)

#### `components/mobile/`
- [x] **drawers/cart-drawer.tsx** — ✅ KEPT (controlled drawer for programmatic opening, different from MobileCartDropdown)
- [x] **drawers/messages-drawer.tsx** — ✅ KEPT (distinct feature)
- [x] **drawers/product-quick-view-drawer.tsx** — ✅ KEPT (uses shared ProductQuickViewContent, mobile wrapper)
- [x] **product/mobile-product-page.tsx** — ✅ KEPT (mobile-specific layout)
- [x] **product/mobile-gallery-v2.tsx** — ✅ KEPT (internal duplication acceptable)
- [x] **category-nav/quick-filter-row.tsx** — ✅ KEPT (internal duplication acceptable)
- [x] **category-nav/contextual-double-decker-nav.tsx** — ✅ KEPT (different UX from subcategory-pills)
- [x] **category-nav/category-quick-pills.tsx** — ✅ KEPT (different UX from category-tabs)
- [x] **category-nav/smart-anchor-nav.tsx** — ✅ KEPT (type export for props pattern)
- [x] **mobile-category-browser.tsx** — ✅ KEPT (internal duplication acceptable)
- [x] **All other mobile components** — ✅ KEPT (actively used)

#### `components/navigation/`
- [x] ✅ KEPT — Navigation components actively used

#### `components/orders/`
- [x] ✅ KEPT — Order management components

#### `components/pricing/`
- [x] ✅ KEPT — Pricing display components

#### `components/providers/`
- [x] **wishlist-context.tsx** — ✅ KEPT (auth-gate pattern is shared intentionally)
- [x] **All other providers** — ✅ KEPT (cart, drawer, theme contexts)

#### `components/sections/`
- [x] ✅ KEPT — Page section components

#### `components/seller/`
- [x] ✅ KEPT — Seller dashboard components

#### `components/shared/`
- [x] **filters/filter-modal.tsx** — ✅ KEPT (internal duplication = checkbox patterns, not dead code. Extracts helper components)
- [x] **filters/filter-hub.tsx** — ✅ KEPT (same as above, both use ColorSwatches/SizeTiles/FilterList)
- [x] **filters/filter-list.tsx** — ✅ KEPT (helper component for both filter-modal and filter-hub)
- [x] **filters/size-tiles.tsx** — ✅ KEPT (helper component for size selection)
- [x] **filters/color-swatches.tsx** — ✅ KEPT (helper component for color selection)
- [x] **product/product-card.tsx** — ✅ KEPT (grid view, different layout from list)
- [x] **product/product-card-list.tsx** — ✅ KEPT (list view, different layout from grid)
- [ ] **product/write-review-dialog.tsx** — Pattern duplicated elsewhere
- [ ] **product/product-page-layout.tsx** — Duplicated by mobile-product-page.tsx
- [x] **boost/boost-dialog.tsx** — ✅ DELETED (using account/selling version instead)
- [ ] **auth/auth-gate-card.tsx** — Pattern duplicated in wishlist-context
- [ ] **wishlist/wishlist-drawer.tsx** — Duplicates cart-drawer patterns
- [ ] Review other shared components

#### `components/support/`
- [ ] Review support components

---

### 📁 `app/` — Next.js App Router

#### `app/` root files
- [ ] **globals.css** — Token sprawl, review consolidation
- [ ] **legacy-vars.css** — Should this be removed?
- [ ] **shadcn-components.css** — Review consolidation with globals.css
- [ ] **utilities.css** — Review usage
- [ ] **global-error.tsx** — Review
- [ ] **global-not-found.tsx** — Review
- [ ] **sitemap.ts** — Review

#### `app/actions/`
- [ ] Review server actions for duplication

#### `app/api/`
- [x] **products/create/route.ts** — ✅ DELETED (unused, sell form uses server action instead)
- [x] **products/feed/route.ts** — ✅ KEPT (used by desktop-home.tsx)
- [x] **products/newest/route.ts** — ✅ KEPT (used by e2e tests, hooks, scripts)
- [x] **products/deals/route.ts** — ✅ DELETED (unused, no frontend calls)
- [x] **products/nearby/route.ts** — ✅ DELETED (unused, no frontend calls)
- [ ] **categories/route.ts** — Duplicates lib/data/categories.ts logic
- [ ] Review other API routes

#### `app/auth/`
- [ ] Review auth routes

#### `app/[locale]/` — Locale Routes

##### `app/[locale]/(account)/`
- [x] **account/selling/_components/boost-dialog.tsx** — ✅ KEPT (canonical version, shared one deleted)
- [ ] **account/wishlist/_components/account-wishlist-toolbar.tsx** — Has internal duplication
- [ ] **account/orders/_components/buyer-order-actions.tsx** — Duplicates seller-rate-buyer-actions
- [ ] **account/orders/_components/account-orders-grid.tsx** — Has internal duplication
- [ ] **account/orders/[id]/page.tsx** — Duplicates order-detail-content.tsx
- [ ] **account/(settings)/notifications/** — Has internal duplication
- [x] **plans/upgrade/** — ✅ KEPT (correct Next.js intercepting routes pattern - page + modal share UpgradeContent)
- [ ] Review other account components

##### `app/[locale]/(admin)/`
- [x] **admin/notes/_components/notes-content.tsx** — ✅ KEPT (simple pinned notes, different from tasks)
- [x] **admin/tasks/_components/tasks-content.tsx** — ✅ KEPT (kanban board with status/priority, different from notes)
- [ ] **admin/docs/_components/docs-content.tsx** — Has internal duplication
- [ ] Review other admin components

##### `app/[locale]/(sell)/`
- [ ] **_components/steps/step-details.tsx** — Has internal duplication
- [x] **_components/steps/step-pricing.tsx** — ✅ KEPT (mobile step-wizard UI, used by mobile-layout)
- [x] **_components/fields/pricing-field.tsx** — ✅ KEPT (desktop compact field, used by desktop-layout)
- [ ] **_components/fields/photos-field.tsx** — Has internal duplication
- [ ] **_components/fields/category-field.tsx** — Has internal duplication
- [ ] **_components/fields/attributes-field.tsx** — Has internal duplication
- [ ] **_components/ui/category-modal/index.tsx** — Has internal duplication
- [ ] **sell/orders/_components/seller-rate-buyer-actions.tsx** — Duplicates buyer-order-actions
- [ ] Review other sell components

##### `app/[locale]/(main)/`
- [ ] Review main layout components

##### `app/[locale]/(auth)/`
- [ ] Review auth pages

##### `app/[locale]/(business)/`
- [ ] Review business pages

##### `app/[locale]/(chat)/`
- [ ] Review chat pages

##### `app/[locale]/(checkout)/`
- [ ] Review checkout pages

##### `app/[locale]/(plans)/`
- [ ] Review plans pages

##### `app/[locale]/demo/`
- [ ] **product-adaptive/_components/product-page-desktop.tsx** — Duplicates desktop-specs-accordion
- [ ] Is demo folder needed in production?

##### `app/[locale]/[username]/`
- [ ] Review username pages

---

### 📁 `hooks/`
- [ ] Review all hooks for dead code
- [ ] Check if any hooks duplicate React Query or other patterns

---

### 📁 `i18n/`
- [ ] **routing.ts** — Has unused exports `permanentRedirect`, `getPathname`
- [ ] Review translation completeness

---

### 📁 `messages/`
- [ ] Review message files for unused keys

---

### 📁 `scripts/`
- [ ] Review scripts for dead/unused scripts
- [ ] **audit-treido.mjs** vs **audit-treido-v2.mjs** — Which is current?

---

### 📁 `supabase/`
- [ ] Review migrations
- [ ] Consider squashing old migrations

---

### 📁 `supabase-codex/`
- [ ] Review documentation accuracy
- [ ] Archive if not needed

---

### 📁 `supabase-info/`
- [ ] Review schema snapshots
- [ ] Archive if not needed

---

### 📁 `docs/` `docs-site/` `docs-final/`
- [x] **CONSOLIDATE**: Canonical docs live in repo root; delete legacy `docs/`; keep `docs-final/` as archive; keep `docs-site/` as separate public docs app (2026-01-25)
- [x] Prune `docs-final/archive/` bloat (removed old codex-xhigh logs + archived claude/spec folders) (2026-01-25)

---

### 📁 `audit/`
- [ ] Review audit documents
- [ ] Archive completed audits

---

### 📁 `cleanup/`
- [ ] Keep reports for reference
- [ ] Delete after cleanup complete

---

### 📁 `e2e/`
- [ ] Review E2E tests for dead tests

---

### 📁 `__tests__/`
- [ ] Review unit tests for dead tests

---

### 📁 `test/`
- [ ] Review test utilities

---

### 📁 `public/`
- [ ] Review public assets for unused files

---

## Post-Cleanup Validation

After ALL folders are checked, run these gates:

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` — No type errors
- [ ] `pnpm test:unit` — All unit tests pass  
- [ ] `pnpm -s lint` — No lint errors
- [ ] `pnpm -s build` — Production build succeeds
- [ ] `pnpm -s knip` — Regenerate knip report, should show fewer issues
- [ ] E2E smoke tests pass

---

## Cleanup Principles

1. **Delete > Refactor** — If code isn't used, delete it. Don't refactor dead code.
2. **One Source of Truth** — Pick one implementation, delete duplicates
3. **Preserve Tests** — Don't delete tests unless the code they test is deleted
4. **Small Commits** — Commit after each folder for easy rollback
5. **Run Gates** — Run type check + tests after each major change

---

## Priority Order (Suggested)

Start with highest-impact folders:

1. **Root package.json** — Remove unused deps
2. **components/shared/filters/** — Massive duplication
3. **components/shared/boost/** — Clear duplicate
4. **app/[locale]/(sell)/_components/** — Pricing duplication
5. **components/layout/sidebar/** — Many unused exports
6. **lib/data/products.ts** — Internal duplication
7. **docs folders** — Consolidate
8. **Everything else** — Alphabetically

---

## Notes / Log

_Add notes here as you progress:_

- 2026-01-25: Created this cleanup plan
- 2026-01-25: Docs cleanup (no Supabase lane changes):
  - Promoted canonical guides to repo root: `ENGINEERING.md`, `FRONTEND.md`, `BACKEND.md`
  - Updated doc references in `TASKS.md`, `docs-final/INDEX.md`, `audit/README.md`
  - Removed legacy `docs/` folder and archived/moved old audit notes into `docs-final/archive/**`
  - Deleted major archive bloat: `docs-final/archive/codex-xhigh/**`, `docs-final/archive/folders/**`, `docs-final/archive/root/{agents,RULES,TODO}.md`
  - Guardrail: **do not delete** `CODEX_FULL_AUDIT_PLAN.md` (kept)
- 2026-01-25: E2E audit hygiene:
  - Moved Playwright audit screenshots output to `test-results/audit-screenshots/` (gitignored) via `e2e/mobile-ux-audit-detailed.spec.ts`
- 2026-01-25: Filters/search attribute key canonicalization (attr_{key}):
  - Added `lib/attributes/normalize-attribute-key.ts` (NOTE: currently untracked; must be added before final release commit)
  - Updated category/search pages + product endpoints + filter UIs to normalize `attr_*` keys and de-dup values; backward compatible with old `attr_{Name}` links
  - Key files: `components/shared/filters/filter-hub.tsx`, `components/shared/filters/filter-modal.tsx`, `components/desktop/desktop-filter-modal.tsx`, `app/api/products/{newest,count}/route.ts`, `app/[locale]/(main)/{search,categories/[slug]}/**`
- 2026-01-25: Category attributes typing/inheritance hardening:
  - Expanded `CategoryAttribute` to include `attribute_key` + hero spec fields; added `date` to `AttributeType`
  - Fixed attribute inheritance to merge all ancestor filterable attributes for deep leaf categories
  - Key file: `lib/data/categories.ts`
- 2026-01-25: Sell flow UI consistency (payout gating):
  - Simplified `SellerPayoutSetup` to a single surface, uses badge variants (no ad-hoc `bg-success`), improved content rhythm
  - Improved `/sell` payout gating header scale to match account/dashboard feel
  - Key files: `components/shared/seller/seller-payout-setup.tsx`, `app/[locale]/(sell)/sell/client.tsx`, `app/[locale]/(main)/seller/settings/payouts/page.tsx`
- 2026-01-25: Product create UX safety:
  - Leaf category DB constraint handled gracefully (return user-friendly message instead of generic failure)
  - Attributes JSONB now uses canonical keys (and includes `condition` key) for consistent filtering
  - Key files: `app/api/products/create/route.ts`, `app/[locale]/(sell)/_actions/sell.ts`, `app/actions/products.ts`
