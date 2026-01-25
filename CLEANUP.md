# TREIDO Production Cleanup Plan

**Created**: 2026-01-25  
**Goal**: Nuke all over-engineered stuff, duplicates, and dead code before production launch  
**Method**: Folder-by-folder systematic cleanup with checkmarks. Each folder is a "unit of work."

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

#### `lib/` root files
- [ ] **lib/utils.ts** — Check for dead code, consolidate with lib/utils/
- [ ] **lib/currency.ts** — Review usage
- [ ] **lib/format-price.ts** — Review usage
- [ ] **lib/geolocation.ts** — Review usage
- [ ] **lib/image-utils.ts** — Check for duplicates with image-compression.ts
- [ ] **lib/image-compression.ts** — Consolidate with image-utils.ts
- [ ] **lib/normalize-image-url.ts** — Review usage
- [ ] **lib/order-status.ts** — Review usage
- [ ] **lib/safe-json.ts** — Review usage
- [ ] **lib/shipping.ts** — Review usage
- [ ] **lib/stripe.ts** — Review for dead code
- [ ] **lib/stripe-locale.ts** — Has duplicated code per dupes-report
- [ ] **lib/stripe-connect.ts** — Review usage
- [ ] **lib/logger.ts** — Review usage across codebase
- [ ] **lib/structured-log.ts** — Consolidate with logger.ts?
- [ ] **lib/env.ts** — Review usage
- [ ] **lib/feature-flags.ts** — Review active flags
- [ ] **lib/category-*.ts files** — Multiple category files, consolidate
- [ ] **lib/analytics-drawer.ts** — Review usage
- [ ] **lib/avatar-palettes.ts** — Review usage
- [ ] **lib/bulgarian-cities.ts** — Review usage
- [ ] **lib/product-card-hero-attributes.ts** — Review usage
- [ ] **lib/order-conversations.ts** — Review usage
- [ ] **lib/url-utils.ts** — Review usage
- [ ] **lib/filter-priority.ts** — Review usage
- [ ] **lib/sell-form-schema-v4.ts** — Why v4? Any legacy versions?

#### `lib/ai/`
- [ ] Review AI model usage, remove unused schemas
- [ ] Check if AI features are production-ready or should be feature-flagged

#### `lib/api/`
- [ ] Review API utilities

#### `lib/auth/`
- [ ] Review auth utilities

#### `lib/boost/`
- [ ] Review boost utilities

#### `lib/data/`
- [x] **products.ts** — ✅ Extracted `mapRowToProduct()` helper to deduplicate mapping logic
- [ ] Review category data fetching

#### `lib/filters/`
- [ ] Review filter utilities

#### `lib/next/`
- [ ] Review Next.js utilities

#### `lib/sell/`
- [ ] Review sell utilities

#### `lib/supabase/`
- [ ] Review Supabase client setup

#### `lib/types/`
- [ ] Review type definitions for dead types

#### `lib/upload/`
- [ ] Review upload utilities

#### `lib/utils/`
- [ ] Review utilities, consolidate with lib/utils.ts

#### `lib/validations/`
- [ ] Review validation schemas

#### `lib/view-models/`
- [ ] Review view models

---

### 📁 `components/` — UI Components

#### `components/ui/` — Shadcn Components
- [ ] **accordion.tsx** — Has arbitrary values `[3px]`
- [ ] **breadcrumb.tsx** — Has unused export `BreadcrumbEllipsis`
- [ ] **pagination.tsx** — Has internal duplication
- [ ] **sheet.tsx** — Has unused export `SheetClose`
- [ ] **table.tsx** — Has unused exports `TableFooter`, `TableCaption`
- [ ] **toast.tsx** — Has multiple unused exports
- [ ] **toggle.tsx** — Has arbitrary values `[3px]`
- [ ] **radio-group.tsx** — Has arbitrary values `[3px]`
- [ ] **textarea.tsx** — Has arbitrary values `[3px]`
- [ ] Review all other ui/ components for dead code

#### `components/auth/`
- [ ] Review auth components

#### `components/category/`
- [ ] Review category components

#### `components/charts/`
- [ ] Review chart components

#### `components/desktop/`
- [ ] **desktop-search.tsx** — Has significant internal duplication
- [ ] **desktop-home.tsx** — Has internal duplication
- [ ] **product/product-quick-view-dialog.tsx** — Duplicates mobile drawer
- [ ] **product/desktop-specs-accordion.tsx** — Has internal duplication
- [ ] Review other desktop components

#### `components/dropdowns/`
- [ ] Review dropdown components

#### `components/layout/`
- [ ] **sidebar/sidebar.tsx** — Has 10+ unused exports (SidebarGroupAction, SidebarInput, etc.)
- [ ] **header/cart/mobile-cart-dropdown.tsx** — Duplicates cart-drawer.tsx
- [ ] Review other layout components

#### `components/mobile/`
- [ ] **drawers/cart-drawer.tsx** — Duplicates with layout/header/cart and wishlist-drawer
- [ ] **drawers/messages-drawer.tsx** — Duplicates wishlist-drawer patterns
- [ ] **drawers/product-quick-view-drawer.tsx** — Duplicates desktop quick view
- [ ] **product/mobile-product-page.tsx** — Duplicates product-page-layout.tsx
- [ ] **product/mobile-gallery-v2.tsx** — Has internal duplication
- [ ] **category-nav/quick-filter-row.tsx** — Has internal duplication
- [ ] **category-nav/contextual-double-decker-nav.tsx** — Duplicates subcategory-pills.tsx
- [ ] **category-nav/category-quick-pills.tsx** — Duplicates category-tabs.tsx
- [ ] **category-nav/smart-anchor-nav.tsx** — Has unused exported type
- [ ] **mobile-category-browser.tsx** — Has internal duplication
- [ ] Review other mobile components

#### `components/navigation/`
- [ ] Review navigation components

#### `components/orders/`
- [ ] Review order components

#### `components/pricing/`
- [ ] Review pricing components

#### `components/providers/`
- [ ] **wishlist-context.tsx** — Duplicates auth-gate-card patterns
- [ ] Review other providers

#### `components/sections/`
- [ ] Review section components

#### `components/seller/`
- [ ] Review seller components

#### `components/shared/`
- [ ] **filters/filter-modal.tsx** — MAJOR duplication hub (7+ clones)
- [ ] **filters/filter-hub.tsx** — MAJOR duplication hub (6+ clones)
- [ ] **filters/filter-list.tsx** — Duplicates filter-modal, size-tiles
- [ ] **filters/size-tiles.tsx** — Duplicated by filter-list, color-swatches
- [ ] **filters/color-swatches.tsx** — Duplicates size-tiles
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
- [ ] **products/create/route.ts** — Duplicates actions/products.ts
- [ ] **products/feed/route.ts** — Overlaps with other feed endpoints
- [ ] **products/newest/route.ts** — Overlaps with feed
- [ ] **products/deals/route.ts** — Overlaps with feed
- [ ] **products/nearby/route.ts** — Overlaps with feed
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
