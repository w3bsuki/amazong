# Refactor Session Log

> Append-only. Each session adds an entry. Reference only — not loaded by default.

---

### Session 1 — 2026-02-16

**Phase:** 0 (Baseline) + 1 (Architecture)
**Changes:**
- `next.config.ts`: expanded `optimizePackageImports` to full Phase 0 list
- Renamed `_types.ts` → `types.ts` in search filters for naming compliance
- Moved `components/shared/profile/*` → `app/[locale]/[username]/_components/profile/` (single-consumer route-private)
**Decisions:**
- Kept demo, registry, gift-cards, members routes (linked + implemented)
- Kept barrel exports in components/ (multi-export barrels with active imports)
**Metrics:** `"use client"` 358 → 358 (config-only session)

### Session 2 — 2026-02-16

**Phase:** 1 (Architecture completion)
**Changes:**
- Renamed generic `client.tsx` → `sell-page-client.tsx`, `seller-orders-client.tsx`
- Renamed `category-modal/index.tsx` → `category-selector.tsx`
- Moved `category-circle-visual.tsx`, `category-icons.tsx` → `(main)/_components/category/`
**Decisions:**
- Kept shared components that are transitively shared through component layer
**Metrics:** `"use client"` 358 → 358 (structure-only)

### Session 3 — 2026-02-17

**Phase:** Wave 0-2 (Metrics, Route Cleanup, Icon Consolidation)
**Changes:**
- Created `scripts/architecture-scan.mjs` (repeatable metrics scanner)
- Added `architecture:scan` and `architecture:gate` scripts
- Removed demo + registry routes, added redirects in `next.config.ts`
- Migrated all legacy icon imports to direct `lucide-react`
- Deleted `lib/icons/` compatibility layer (compat.tsx, phosphor.ts, tabler.ts, lucide-picker.ts)
- Added ESLint bans on legacy icon imports
**Metrics:** Files 762→762, `"use client"` 357→357, clones 3.06%→3.06%

### Session 4 — 2026-02-17 (Codex Phase 1)

**Phase:** 1 — Discovery Audit (all 3 agents)
**Changes:**
- Full folder-tree audit of components/, lib/, hooks/, app/
- Removed unnecessary `"use client"` from 139 files
- Split oversized files, fixed naming, moved misplaced files
- Added missing `loading.tsx` to all routes (38 → 0 missing)
**Metrics:** Files 762→803, `"use client"` 357→218, >300-line 125→121, missing loading 38→0

### Session 5 — 2026-02-17 (Codex Phase 2)

**Phase:** 2 — Client Boundary & Bundle
**Changes:**
- Further `"use client"` reduction (218→215)
- Dynamic imports for heavy components
- Bundle optimization
**Metrics:** Files 803→805, `"use client"` 218→215, >300-line 121→120, clones 3.86%→3.06%

---

### Session 6 — 2026-02-18 (Copilot — Lean Sweep Planning)

**Phase(s):** Planning — designed Lean Sweep refactor plan
**Changes:**
- Created `refactor/lean-sweep/` directory with 9 files
- Rewired `refactor/CURRENT.md` to Lean Sweep task queue
**Decisions:**
- Old Phase 3/4 kept but superseded by Lean Sweep (more targeted, audit-driven)
- 7 phases (A-G) ordered by risk: dead code first → shared primitives → polish
- Phase C (Shared Primitives) is the keystone — 7 extraction targets from cross-route duplication
**Metrics:** Pre-Lean Sweep: 809 files, ~43K lines, 215 "use client", 31 >300L files
**Next session should:**
- Execute Phase A (Dead Code Purge) via: `Read refactor/CURRENT.md. Execute the next unchecked task.`

---

*Append new sessions below this line.*

### Session 7 — 2026-02-18 (Codex Lean Sweep A)

**Phase(s):** Preflight Stabilization + Lean Sweep Phase A (Dead Code Purge)  
**Changes:**
- Fixed pre-existing `typecheck` break in `app/[locale]/(main)/page.tsx` by removing stale homepage payload branches and aligning props with current component contracts.
- Removed dead files found by knip:
  - `app/[locale]/(main)/_components/responsive-home.tsx`
  - `app/[locale]/(main)/_components/mobile/home-chip-styles.ts`
  - `components/ui/toggle.tsx` (after inlining `toggleVariants` into `components/ui/toggle-group.tsx`)
- Removed dead exports:
  - `getDealsProducts` + obsolete legacy constants in `lib/data/products.ts`
  - `MOBILE_CONTEXT_BANNER_CLASS` chain in mobile rail recipes.
- Captured baseline metrics artifact at `.tmp/lean-sweep-baseline.json`.

**Verification:**
- `pnpm -s knip` ✅ clean
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅ (lint warnings only; no errors)

**Metrics snapshot (architecture:scan):**
- Files: `806`
- `"use client"`: `215`
- `>300` lines: `121`
- Missing metadata: `53`
- Clone %: `3.05`

**Next session should:**
- Execute Phase B (Server Action Consolidation), starting with `requireAuth()` adoption and `canSellerRateBuyer` deduplication.

### Session 8 — 2026-02-18 (Codex Lean Sweep B + C/D/E sweep)

**Phase(s):** Phase B complete; substantial Phase C/D/E execution  
**Changes:**
- Completed action consolidation:
  - Split `orders.ts`, `products.ts`, and `username.ts` into focused modules with stable re-export barrels.
  - Migrated those action families from manual auth checks to `requireAuth()`-based flows.
  - Removed duplicate seller-rating eligibility implementation outside canonical orders path.
- Shared primitive extractions:
  - Added `components/shared/stat-card.tsx`; migrated account/business desktop stats consumers.
  - Added `components/shared/header-dropdown.tsx`; migrated account/messages/wishlist header dropdowns.
- Provider simplification:
  - Refactored drawer context to single `activeDrawer` model and centralized transition analytics.
  - Removed Storybook fallback branch from `useDrawer`.
  - Migrated global drawers, mobile tab bar, card triggers, cart/wishlist triggers, and account drawer actions to new drawer API.
  - Refactored header context from parallel setters to a discriminated `headerState` channel; migrated header sync clients + app-header.
- Utility consolidation:
  - Added shared query helper module `lib/data/search-products.ts` and adapted both route search modules.
  - Completed image utility overlap audit (kept files separate due non-overlapping concerns).

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan --write .tmp/lean-sweep-progress.json` captured current metrics

**Metrics snapshot (architecture:scan):**
- Files: `819`
- `"use client"`: `216`
- `>300` lines: `118`
- Missing metadata: `53`
- Clone %: `3.04`

**Next session should:**
- Continue Phase C large extractions (order list/detail primitives, dashboard shells, activity feed, account menu items), then run phase gate and mark C complete before moving F/G.

### Session 9 — 2026-02-18 (Codex Batch 1 completion)

**Phase(s):** Batch 1 finish — shared drawer/dropdown + account menu dedupe  
**Changes:**
- Added shared primitives:
  - `components/shared/drawer-shell.tsx`
  - `components/shared/account-menu-items.tsx`
- Refactored mobile drawers to use shared shell:
  - `components/mobile/drawers/account-drawer.tsx`
  - `components/mobile/drawers/messages-drawer.tsx`
  - `components/mobile/drawers/cart-drawer.tsx`
  - `components/mobile/drawers/auth-drawer.tsx`
  - `components/shared/wishlist/wishlist-drawer.tsx`
- Refactored account navigation rendering:
  - `components/dropdowns/account-dropdown.tsx` now uses shared account dropdown menu renderer.
  - `components/mobile/drawers/account-drawer.tsx` now uses shared account quick-links renderer.
- Completed supporting Batch 1 shared extractions in this cycle:
  - shared dropdown trigger/shell usage and shared product-card metadata mapping are now in place across account/messages/wishlist dropdowns and desktop/mobile cards.

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅
- `pnpm -s dupes` ✅

**Metrics snapshot (architecture:scan):**
- Files: `824`
- `"use client"`: `216`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `236` (`2.96%`)

**Next session should:**
- Start Batch 2 (cross-route shared primitives): sidebar shell, stat card convergence across account/business/admin, then order-list/detail shared primitives.

### Session 10 — 2026-02-18 (Codex Batch 2 slice)

**Phase(s):** Batch 2 (in progress) — sidebar/stat shared primitives  
**Changes:**
- Added `components/shared/dashboard-sidebar.tsx` and migrated all three dashboard sidebars to it:
  - `app/[locale]/(account)/account/_components/account-sidebar.tsx`
  - `app/[locale]/(business)/_components/business-sidebar.tsx`
  - `app/[locale]/(admin)/_components/admin-sidebar.tsx`
- Expanded shared stat-card adoption:
  - `app/[locale]/(admin)/_components/admin-stats-cards.tsx`
  - `app/[locale]/(account)/account/_components/account-addresses-stats.tsx`

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `825`
- `"use client"`: `216`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `237` (`2.97%`)

**Next session should:**
- Continue Batch 2 with higher-impact duplicate hotspots: activity feed and order list/detail shared primitives.

### Session 11 — 2026-02-18 (Codex Batch 2 continuation)

**Phase(s):** Batch 2 (in progress) — activity + order list/detail shared primitives  
**Changes:**
- Added shared activity primitives:
  - `components/shared/activity-feed.tsx`
  - Adopted in:
    - `app/[locale]/(account)/account/_components/account-recent-activity.tsx`
    - `app/[locale]/(business)/_components/business-recent-activity.tsx`
- Added shared order list primitives:
  - `components/shared/order-list-item.tsx` (shared status badge + product thumbnail)
  - Adopted in:
    - `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx`
    - `app/[locale]/(business)/_components/orders-table.tsx`
- Added shared order detail primitives:
  - `components/shared/order-detail/order-header.tsx`
  - `components/shared/order-detail/order-price-summary.tsx`
  - Adopted in:
    - `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx`
    - `app/[locale]/(business)/_components/order-detail-view.tsx`

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `829`
- `"use client"`: `216`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `237` (`2.97%`)

**Next session should:**
- Continue Batch 2/Phase C with remaining shared primitive targets (admin/activity alignment, remaining dashboard/order duplication cleanup), then decide Phase C completion criteria.

### Session 12 — 2026-02-18 (Codex Batch 2 continuation)

**Phase(s):** Batch 2 (in progress) — shared order-detail item-list primitive  
**Changes:**
- Added `components/shared/order-detail/order-items-list.tsx` with:
  - shared order-items list wrapper
  - shared order-detail item shell (thumbnail + content + trailing slots)
- Migrated both order-detail consumers:
  - `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx`
  - `app/[locale]/(business)/_components/order-detail-view.tsx`
- In account order detail, moved seller feedback dialog from inside each mapped item to a single shared dialog instance (same behavior, less duplicated UI tree).

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `830`
- `"use client"`: `216`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `237` (`2.97%`)

**Next session should:**
- Continue Batch 2/Phase C with remaining cross-route primitive candidates (admin/activity and dashboard order experience consistency), then evaluate whether Batch 2 exit criteria are met.

### Session 13 — 2026-02-18 (Codex Batch 2 continuation + Phase F cache slice)

**Phase(s):** Batch 2 (in progress) + Phase F (data-layer prework)  
**Changes:**
- Added shared dashboard/order primitives and expanded cross-route adoptions:
  - `components/shared/dashboard-header-shell.tsx`
  - `components/shared/order-detail/order-side-card.tsx`
  - `components/shared/order-summary-line.tsx`
  - Extended `components/shared/activity-feed.tsx` with reusable activity shells.
- Migrated dashboard headers to shared shell:
  - `app/[locale]/(account)/account/_components/account-header.tsx`
  - `app/[locale]/(business)/_components/business-header.tsx`
  - `app/[locale]/(admin)/_components/dashboard-header.tsx`
- Migrated activity surfaces to shared activity shells:
  - `app/[locale]/(account)/account/_components/account-recent-activity.tsx`
  - `app/[locale]/(business)/_components/business-recent-activity.tsx`
  - `app/[locale]/(admin)/_components/admin-recent-activity.tsx`
- Migrated order detail side-card scaffolding:
  - `app/[locale]/(account)/account/orders/[id]/_components/order-timeline.tsx`
  - `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx`
  - `app/[locale]/(business)/_components/order-detail-view.tsx`
- Migrated shared order summary rendering:
  - `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx`
  - `app/[locale]/(business)/_components/orders-table.tsx`
- Phase F data-layer improvement:
  - `lib/data/plans.ts:getPlansForUpgrade()` now uses `'use cache'`, `cacheTag("plans")`, `cacheLife("max")`, and `createStaticClient()`.

**Verification:**
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `833`
- `"use client"`: `217`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `237` (`2.96%`)

**Next session should:**
- Finish remaining Batch 2/Phase C exit checks, then execute Phase F cache/invalidation audit across remaining read-heavy fetchers.

### Session 14 — 2026-02-18 (Codex Phase F continuation)

**Phase(s):** Phase F (data-layer + cache correctness)  
**Changes:**
- Expanded cache coverage in `lib/data/` for deterministic wrapper fetchers:
  - `lib/data/category-attributes.ts`
    - `resolveCategoryAttributes(...)` now uses `'use cache'`, `cacheLife('categories')`, and dynamic category/attribute cache tags.
  - `lib/data/categories.ts`
    - `getSubcategoriesForBrowse(...)` now uses `'use cache'`, `cacheLife('categories')`, and subcategory/category-tree tags.
  - `lib/data/products.ts`
    - `getCategoryRowProducts(...)` now uses `'use cache'` + `products:category:*` tag.
    - `getBoostedProducts(...)` now uses `'use cache'` + `products:type:featured` tag.
- Verified modified cached fetchers use `createStaticClient()` only.
- Invalidation audit note:
  - No `revalidateTag(...plans...)` call found in `app/`/`lib/` search (tracked as follow-up risk if plan data mutability increases).

**Verification:**
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `833`
- `"use client"`: `217`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `237` (`2.96%`)

**Next session should:**
- Finalize Batch 2/Phase C completion criteria and then continue remaining Phase F Supabase-client context audit (non-webhook/non-auth surfaces first).

### Session 15 — 2026-02-18 (Codex finalization pass)

**Phase(s):** Program/Lean Sweep status finalization  
**Changes:**
- Finalized tracker state to match implemented work:
  - Marked Batch 2 as complete in program trackers.
  - Marked Lean Sweep phases C, D, and E as complete in task queue.
  - Set Batch 3 as current active batch.
- Documented completion checkpoint and open follow-up:
  - `currency-context` remains absent and there are no `useCurrency` consumers.
  - Phase F remains in progress pending invalidation + Supabase client-context audit closure.

**Verification:**
- No source/runtime code changed in this pass (docs-only finalization).

**Next session should:**
- Execute Batch 3 decomposition hotspots and continue remaining Phase F invalidation/client-context audit.

### Session 16 — 2026-02-18 (Codex Batch 3 quick-view decomposition)

**Phase(s):** Batch 3 (large-screen decomposition hotspots)  
**Changes:**
- Added shared quick-view chrome primitives:
  - `components/shared/product/quick-view/quick-view-chrome.tsx`
    - shared header icon actions (copy/wishlist/close)
    - shared seller skeleton card
    - shared buyer-protection card
    - shared buy/add footer CTA row
    - shared shipping badge helper
- Migrated quick-view content consumers:
  - `components/shared/product/quick-view/product-quick-view-desktop-content.tsx`
  - `components/shared/product/quick-view/product-quick-view-mobile-content.tsx`
- Preserved behavior and visual parity:
  - same handlers, labels, aria labels, button variants, and layout-specific classnames.

**Verification:**
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅ (lint warnings only)
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `839`
- `"use client"`: `217`
- `>300` lines: `117`
- Missing metadata: `53`
- Clones: `234` (`2.88%`)

**Next session should:**
- Continue Batch 3 with the next high-impact decomposition hotspot (likely admin notes/tasks content or checkout page client internals), then continue Phase F invalidation/client-context audit.

### Session 17 — 2026-02-18 (Codex Batch 3 admin notes/tasks decomposition)

**Phase(s):** Batch 3 (large-screen decomposition hotspots)  
**Changes:**
- Added shared admin-local primitives for duplicated card/dialog scaffolding:
  - `app/[locale]/(admin)/admin/_components/admin-card-hover-actions.tsx`
  - `app/[locale]/(admin)/admin/_components/admin-dialog-shell.tsx`
- Decomposed admin notes module:
  - Added `app/[locale]/(admin)/admin/notes/_components/types.ts`
  - Added `app/[locale]/(admin)/admin/notes/_components/note-card.tsx`
  - Added `app/[locale]/(admin)/admin/notes/_components/note-dialog.tsx`
  - Refactored `app/[locale]/(admin)/admin/notes/_components/notes-content.tsx` to orchestration-only.
- Decomposed admin tasks module:
  - Added `app/[locale]/(admin)/admin/tasks/_components/types.ts`
  - Added `app/[locale]/(admin)/admin/tasks/_components/tasks-content.constants.ts`
  - Added `app/[locale]/(admin)/admin/tasks/_components/task-card.tsx`
  - Added `app/[locale]/(admin)/admin/tasks/_components/task-dialog.tsx`
  - Refactored `app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx` to orchestration-only.
- Client-boundary hygiene:
  - Removed redundant `"use client"` directives from internal extracted submodules (kept only where boundary ownership is required).

**Verification:**
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅ (lint warnings only)
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `848`
- `"use client"`: `217`
- `>300` lines: `115`
- Missing metadata: `53`
- Clones: `232` (`2.80%`)

**Next session should:**
- Continue Batch 3 with the next high-impact decomposition hotspot (`checkout-page-client` internals or admin docs), then continue Phase F invalidation/client-context audit.

### Session 18 — 2026-02-18 (Codex Batch 3 admin docs decomposition)

**Phase(s):** Batch 3 (large-screen decomposition hotspots)  
**Changes:**
- Decomposed admin docs surface:
  - Added `app/[locale]/(admin)/admin/docs/_components/docs-types.ts`
  - Added `app/[locale]/(admin)/admin/docs/_components/docs-config.ts`
  - Added `app/[locale]/(admin)/admin/docs/_components/docs-table.tsx`
  - Added `app/[locale]/(admin)/admin/docs/_components/doc-editor.tsx`
  - Refactored `app/[locale]/(admin)/admin/docs/_components/docs-content.tsx` into orchestration-only state + persistence handlers.
- Preserved behavior parity:
  - search/category filtering, seed templates flow, row open/edit/delete interactions, modal open/close, markdown viewer, and create/edit flows remain unchanged.
- Subagent note:
  - attempted to use subagents for discovery/planning, but spawn is currently blocked by active thread cap (`max 6`), so this batch was executed directly.

**Verification:**
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅ (lint warnings only)
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `852`
- `"use client"`: `217`
- `>300` lines: `114`
- `>500` lines: `38`
- Missing metadata: `53`
- Clones: `232` (`2.80%`)

**Next session should:**
- Continue Batch 3 with checkout decomposition (`checkout-page-client.tsx`) while avoiding payment/webhook internals, then continue Phase F invalidation/client-context audit.

### Session 19 — 2026-02-18 (Codex Phase 0 rebaseline + workflow SSOT)

**Phase(s):** Preflight rebaseline before Domain 1  
**Changes:**
- Rebaselined stale refactor metrics/docs:
  - `refactor/CURRENT.md` metrics table now reflects live baseline (`852` files, `~115K` LOC, `217` `"use client"`, `114` `>300L`, `286` tiny `<50L`, `53` missing metadata, `2.80%` clones).
  - `refactor/PROGRAM.md` baseline snapshot aligned to live scan values.
  - `refactor/autopilot.md` current-state table corrected for `>300L` and key-insight percentages.
- Added workflow SSOT docs:
  - `docs/WORKFLOW.md` (canonical source-of-truth map + conflict policy).
  - `docs/GATES.md` (quality-gate runbook + canonical dead-code command).
  - `docs/FEATURE-MAP.md` (feature docs to route/component map).
- Added tracker deconfliction note:
  - `TASKS.md` now explicitly defers refactor queue/status to `refactor/CURRENT.md`.
- Fixed dead-code workflow blocker in protocol docs:
  - Updated `refactor/domains/07-cross-cutting-final.md` to use `pnpm -s knip` (stable command in this environment) instead of compact reporter mode.
- Captured immutable entry artifacts:
  - `.tmp/architecture-entry.json`
  - `.tmp/dupes-entry.txt`

**Verification:**
- `pnpm -s knip` ✅
- `pnpm -s architecture:scan --write .tmp/architecture-entry.json` ✅
- `pnpm -s dupes > .tmp/dupes-entry.txt` ✅

**Metrics snapshot (architecture:scan):**
- Files: `852`
- `"use client"`: `217`
- `>300` lines: `114`
- `>500` lines: `38`
- Missing metadata: `53`
- Clones: `232` (`2.80%`)

**Next session should:**
- Execute Domain 1 (`(account)`) audit/refactor loop with hotspot-first priority, then run full gate and update trackers.

### Session 20 — 2026-02-18 (Codex Domain 1 hotspot pass A)

**Phase(s):** Domain 1 (`(account)`) — hotspot-first decomposition (orders + billing + profile editor)  
**Audit findings (targeted):**
- Largest remaining `(account)` monoliths were still concentrated in `selling-products-list.tsx`, `profile-content.tsx`, and `public-profile-editor.tsx`, with secondary concentration in orders/billing internals.
- Prior split state had a broken `order-detail-content.tsx` extraction (type incompatibilities + stale imports) that blocked clean Domain 1 continuation.
- Account domain continued to carry avoidable client-boundary declarations on child-only modules.

**Changes:**
- Stabilized and completed in-progress orders split:
  - Added `app/[locale]/(account)/account/orders/[id]/_components/order-detail-feedback.tsx`
  - Added `app/[locale]/(account)/account/orders/[id]/_components/order-detail-items-card.tsx`
  - Refactored `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` into orchestration-first composition.
- Split account orders grid into mobile/desktop modules:
  - Added `app/[locale]/(account)/account/orders/_components/account-orders-grid-mobile.tsx`
  - Added `app/[locale]/(account)/account/orders/_components/account-orders-grid-desktop.tsx`
  - Refactored `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx` to lightweight coordinator.
- Decomposed billing monolith:
  - Added `app/[locale]/(account)/account/billing/billing.types.ts`
  - Added `app/[locale]/(account)/account/billing/billing-current-plan-card.tsx`
  - Added `app/[locale]/(account)/account/billing/billing-history-tabs.tsx`
  - Refactored `app/[locale]/(account)/account/billing/billing-content.tsx` from 729L to orchestration + child modules.
- Decomposed `public-profile-editor.tsx` hotspot:
  - Added `app/[locale]/(account)/account/profile/public-profile-editor.types.ts`
  - Added `app/[locale]/(account)/account/profile/public-profile-username-card.tsx`
  - Added `app/[locale]/(account)/account/profile/public-profile-banner-card.tsx`
  - Added `app/[locale]/(account)/account/profile/public-profile-info-card.tsx`
  - Added `app/[locale]/(account)/account/profile/public-profile-account-type-card.tsx`
  - Refactored `app/[locale]/(account)/account/profile/public-profile-editor.tsx` from 707L to orchestration module.
- Client-boundary cleanup:
  - Removed unnecessary `"use client"` from split child files where parent boundary already applies.

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `864`
- `"use client"`: `218`
- `>300` lines: `112`
- `>500` lines: `34`
- Missing metadata: `53`
- Clones: `236` (`2.84%`)

**Next session should:**
- Continue Domain 1 hotspot queue in strict order with `profile-content.tsx` and `selling-products-list.tsx`, while adding merge/deletion passes to offset file-count growth from decomposition.

### Session 21 — 2026-02-18 (Codex Domain 1 completion)

**Phase(s):** Domain 1 (`(account)`) — hotspot-first completion + gate + tracker closeout  
**Audit findings (targeted):**
- Remaining `(account)` files above 500 lines were reduced to three hotspots: `edit-product-client.tsx`, `account-wishlist-grid.tsx`, and `plans-content.tsx`.
- Domain 1 split work introduced type-location drift (wishlist type import path), fixed during completion pass.

**Changes:**
- Completed high-impact profile + selling decompositions:
  - Split `profile-content.tsx` into focused route-private modules:
    - `profile-account.types.ts`
    - `profile-avatar-card.tsx`
    - `profile-personal-info-card.tsx`
    - `profile-security-card.tsx`
    - `profile-email-dialog.tsx`
    - `profile-password-dialog.tsx`
  - Split `selling-products-list.tsx` into focused route-private modules:
    - `selling-products-list.types.ts`
    - `selling-products-mobile-list.tsx`
    - `selling-products-desktop-list.tsx`
    - `selling-products-discount-dialog.tsx`
- Completed final Domain 1 >500L reductions:
  - Added `app/[locale]/(account)/account/selling/edit/edit-product.types.ts`
  - Added `app/[locale]/(account)/account/selling/edit/edit-product.utils.ts`
  - Refactored `edit-product-client.tsx` to use extracted types/helpers.
  - Added `app/[locale]/(account)/account/wishlist/_components/account-wishlist.types.ts`
  - Refactored `account-wishlist-grid.tsx` and `wishlist-content.tsx` to use extracted wishlist types.
  - Added `app/[locale]/(account)/account/plans/plans-content.types.ts`
  - Refactored `plans-content.tsx` to use extracted plan mapping/types.
- Domain 1 exit criteria checkpoint:
  - `NO_FILES_OVER_500` within `app/[locale]/(account)`.

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan):**
- Files: `878`
- `"use client"`: `218`
- `>300` lines: `112`
- `>500` lines: `31`
- Missing metadata: `53`
- Clones: `236` (`2.82%`)

**Next session should:**
- Start Domain 2 (`(main)`) in strict hotspot-first order from `refactor/domains/02-main.md` and keep the same per-domain gate/log loop.

### Session 22 — 2026-02-18 (Codex Domain 2 completion)

**Phase(s):** Domain 2 (`(main)`) — full audit + refactor closeout  
**Audit findings (targeted):**
- Dead-code scan across `app/[locale]/(main)/_components` found no zero-import deletions after grep confirmation.
- Tiny-file pressure was concentrated in route-private type/utils fragments; 19 non-magic tiny files remained after the first consolidation wave.
- Late pass found four remaining Domain 2 hotspots over threshold (`mobile-home.tsx`, `search/page.tsx`, `mobile-seller-filter-controls.tsx`, and `mobile-category-browser-contextual.tsx`).

**Changes:**
- Completed final hotspot split for contextual mobile category browsing:
  - Added `app/[locale]/(main)/categories/[slug]/_components/mobile/mobile-category-browser-contextual-utils.ts`
  - Added `app/[locale]/(main)/categories/[slug]/_components/mobile/mobile-category-browser-contextual-view.tsx`
  - Reduced `mobile-category-browser-contextual.tsx` to 280L orchestration-only.
- Completed threshold cleanup for the remaining near-limit hotspots:
  - Added `app/[locale]/(main)/_components/mobile-home/use-home-city-storage.ts` and reduced `mobile-home.tsx` to 298L.
  - Added `app/[locale]/(main)/search/_lib/search-page-metadata.ts` and reduced `search/page.tsx` to 299L.
  - Added `app/[locale]/(main)/search/_components/mobile-seller-active-chips.tsx` and reduced `mobile-seller-filter-controls.tsx` to 279L.
- Completed tiny-file merge/deletion pass in `(main)` route group (pagination/types/utils/small presentational fragments merged into parent/sibling modules where cohesive).
- Finished Domain 2 `use client` audit and kept required client boundaries; no unsafe removals.
- Resolved strict typing regressions introduced by Domain 2 split modules:
  - unified local `Translate` signatures with `next-intl` value types
  - fixed `exactOptionalPropertyTypes` mismatches for optional props and nullable IDs
  - aligned cart/search/category extracted-section contracts.
- Marked Domain 2 complete in `refactor/CURRENT.md`, advanced current task to Domain 3, and refreshed metrics table.

**File count delta:**
- Source files: `878` → `888` (`+10` net)

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan + local source count):**
- Files: `888`
- LOC (source): `~129K`
- `"use client"`: `222`
- `>300` lines: `103`
- `>500` lines: `27`
- Tiny `<50L` files: `244`
- Missing metadata: `53`
- Clones: `234` (`2.78%`)

**Next session should:**
- Start Domain 3 (`(sell) + (business)`) via `refactor/domains/03-sell-business.md`, beginning with dead-code + tiny-file consolidation before hotspot splits.

### Session 23 — 2026-02-18 (Codex Domain 3 completion)

**Phase(s):** Domain 3 (`(sell)` + `(business)`) — full audit + refactor closeout  
**Audit findings (targeted):**
- Dead-code scan across route-private `_components` in both domains found **0 zero-import component files** (import-graph + grep confirmation).
- Tiny-file pressure was concentrated in `(sell)` barrel indirection and one-use helper files in `(business)/dashboard/inventory`.
- Core hotspots were still concentrated in:
  - `(business)`: `product-form-modal.tsx` (744L), `products-table.tsx` (715L)
  - `(sell)`: `ui/category-selector.tsx` (694L), `fields/attributes-field.tsx` (597L), `fields/shipping-field.tsx` (577L)

**Changes:**
- Tiny-file merge/deletion pass:
  - Removed `(sell)` route-private barrel files and rewired direct imports:
    - `app/[locale]/(sell)/_components/index.ts`
    - `app/[locale]/(sell)/_components/fields/index.ts`
    - `app/[locale]/(sell)/_components/layouts/index.ts`
    - `app/[locale]/(sell)/_components/steps/index.ts`
    - `app/[locale]/(sell)/_components/ui/index.ts`
  - Inlined one-use `(sell)` sign-in prompt into `sell/sell-page-client.tsx`; removed `app/[locale]/(sell)/_components/sign-in-prompt.tsx`.
  - Inlined one-use `(business)` inventory helpers into `dashboard/inventory/page.tsx`; removed:
    - `app/[locale]/(business)/dashboard/inventory/_components/inventory-header.tsx`
    - `app/[locale]/(business)/dashboard/inventory/_lib/format-currency.ts`
- `use client` audit:
  - Removed redundant child-level client directives where parent client boundaries already own hydration (safe-only removals in `(sell)` step/submodule files).
- Hotspot decomposition to `<300L`:
  - Split `(business)` product modal into focused modules:
    - `product-form-modal.tsx` → 253L orchestration
    - extracted schema/types/category-selector/main-column/side-column modules
  - Split `(business)` products table into focused modules:
    - `products-table.tsx` → 271L orchestration
    - extracted toolbar/grid/row/types/mappers modules
  - Split `(sell)` category selector:
    - `ui/category-selector.tsx` → 169L shell
    - extracted modal-content/shared/types modules
  - Split `(sell)` attributes field:
    - `fields/attributes-field.tsx` → 275L orchestration
    - extracted input/grid/custom/types modules
  - Split `(sell)` shipping field:
    - `fields/shipping-field.tsx` → 137L orchestration
    - extracted location/logistics section modules
- Marked Domain 3 complete in `refactor/CURRENT.md`, advanced current task to Domain 4, and refreshed metrics table.

**File count delta:**
- Source files (`app`+`components`+`lib`+`hooks`, ts/tsx): `888` → `899` (`+11` net)

**Verification:**
- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` ✅ (lint warnings only; no errors)
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan + local source count):**
- Files: `899`
- LOC (source): `~117K` (`117,291`)
- `"use client"`: `219`
- `>300` lines: `100`
- `>500` lines: `22`
- Tiny `<50L` files: `277`
- Missing metadata: `53`
- Clones: `227` (`2.64%`)

**Next session should:**
- Start Domain 4 (`small routes`) via `refactor/domains/04-small-routes.md`, beginning with dead-code + tiny-file consolidation before hotspot splits.

### Session 24 — 2026-02-18 (Codex Domain 4 completion)

**Phase(s):** Domain 4 (`(admin)` + `(chat)` + `(checkout)` + `(onboarding)` + `(auth)` + `(plans)` + `[username]`) — full audit + refactor closeout  
**Audit findings by sub-domain:**
- `(admin)`: no >300L hotspot remained; one unnecessary client boundary found in docs markdown renderer.
- `(chat)`: `chat-interface.tsx` was oversized; `messages-page-client.tsx` carried dead `showChat` state.
- `(checkout)`: both `checkout-page-client.tsx` and `_actions/checkout.ts` were oversized and tightly coupled.
- `(onboarding)`: over-fragmented tiny wrappers (`page.tsx`/`loading.tsx`) duplicated across steps.
- `(auth)`: `components/auth/sign-up-form-body.tsx` oversized; repeated tiny route loading wrappers.
- `(plans)`: `plans-page-client.tsx` oversized with mixed concerns and unreachable loading branch.
- `[username]`: `profile-client.tsx` oversized and route-private profile barrel (`_components/profile/index.ts`) became deletable after split.

**Concrete changes:**
- Wrote full per-file audit map (LOC + purpose) artifact:
  - `refactor/domains/04-small-routes-audit.md`
- Split required hotspots below 300L:
  - `app/[locale]/[username]/profile-client.tsx` → extracted:
    - `app/[locale]/[username]/profile-client.types.ts`
    - `app/[locale]/[username]/profile-client.helpers.tsx`
    - `app/[locale]/[username]/profile-client-tabs.tsx`
    - `app/[locale]/[username]/profile-client-header.tsx`
  - `app/[locale]/(chat)/_components/chat-interface.tsx` → extracted:
    - `app/[locale]/(chat)/_components/chat-interface-header.tsx`
    - `app/[locale]/(chat)/_components/chat-interface-messages.tsx`
    - `app/[locale]/(chat)/_components/chat-interface-input.tsx`
    - `app/[locale]/(chat)/_components/use-chat-interface-actions.ts`
  - `app/[locale]/(checkout)/_components/checkout-page-client.tsx` → extracted:
    - `app/[locale]/(checkout)/_components/checkout-page-layout.tsx`
    - `app/[locale]/(checkout)/_components/checkout-page-notice.ts`
    - `app/[locale]/(checkout)/_components/use-checkout-address-form.ts`
  - `app/[locale]/(checkout)/_actions/checkout.ts` → structural split only (session/fees/verify):
    - `app/[locale]/(checkout)/_actions/checkout-session.ts`
    - `app/[locale]/(checkout)/_actions/checkout-fees.ts`
    - `app/[locale]/(checkout)/_actions/checkout-verify.ts`
    - `app/[locale]/(checkout)/_actions/checkout-helpers.ts`
    - `app/[locale]/(checkout)/_actions/checkout.ts` reduced to barrel exports
  - `components/auth/sign-up-form-body.tsx` → extracted:
    - `components/auth/sign-up-form-fields.tsx`
    - `components/auth/sign-up-form-footer.tsx`
  - `app/[locale]/(plans)/_components/plans-page-client.tsx` → extracted:
    - `app/[locale]/(plans)/_components/plans-page-client.types.ts`
    - `app/[locale]/(plans)/_components/plans-page-client.config.tsx`
    - `app/[locale]/(plans)/_components/plans-page-client.helpers.ts`
    - `app/[locale]/(plans)/_components/plans-page-sections.tsx`
- Dead-code pass:
  - Removed dead route-private file after grep confirmation:
    - `app/[locale]/[username]/_components/profile/index.ts`
  - Removed dead chat state logic:
    - `showChat` state and related branch logic from `app/[locale]/(chat)/_components/messages-page-client.tsx`
- Tiny-file merge pass:
  - Consolidated duplicate onboarding loading wrappers via re-export to shared parent loading:
    - `app/[locale]/(onboarding)/onboarding/{account-type,business-profile,interests,profile,complete}/loading.tsx`
  - Consolidated duplicate auth loading wrappers via re-export to `auth/loading.tsx`:
    - `app/[locale]/(auth)/auth/{login,forgot-password,sign-up,error,reset-password,welcome}/loading.tsx`
  - Replaced tiny wrapper page components with direct re-exports:
    - onboarding step pages (`account-type`, `business-profile`, `interests`, `profile`, `complete`)
    - auth pages (`reset-password`, `sign-up-success`)
- `"use client"` audit:
  - Removed unnecessary directive from:
    - `app/[locale]/(admin)/admin/docs/_components/doc-markdown-content.tsx`

**File count delta:**
- Source files (`app` + `components` + `lib` + `hooks`, ts/tsx): `899` → `920` (`+21` net)

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan + local source count):**
- Files: `920`
- LOC (source): `~118K` (`118,261`)
- `"use client"`: `219`
- `>300` lines: `100`
- `>500` lines: `18`
- Tiny `<50L` files: `280`
- Missing metadata: `53`
- Clones: `234` (`2.77%`)

**Remaining risks / follow-ups:**
- Clone and tiny-file metrics regressed slightly due decomposition fan-out; Domain 5 should prioritize merge/consolidation over new extractions where possible.
- `architecture:scan` still reports high `>300` file count (`100`) outside Domain 4 scope; this remains the primary cross-domain debt.
- Lint remains warning-heavy project-wide (no errors), so follow-up should focus only on warnings introduced/owned by next domain scope.

### Session 25 — 2026-02-18 (Codex Domain 5 completion)

**Phase(s):** Domain 5 (`components/**`) — full audit + refactor closeout  
**Audit findings by sub-domain:**
- `components/shared` remained the highest churn area; filter modules were single-route `(main)` and several shared exports were dead.
- `components/layout` hotspot targets (`desktop-search`, `sidebar-menu`, `sidebar`) were successfully reduced below 300L.
- `components/providers` hotspot target (`cart-context`) was reduced and logic/types were extracted; provider usage scan found no zero-consumer provider files.
- `components/mobile` had a `(main)`-only `filter-sort-bar` still living in global components.
- `components/ui` was audited for usage only (no internal refactor), per constraints.
- Full per-file map + shared export usage matrix was generated at `refactor/domains/05-components-audit.md`.

**Concrete changes:**
- Completed hotspot splits to `<300L` for all required Domain 5 priorities:
  - `components/layout/header/desktop/desktop-search.tsx`
  - `components/layout/sidebar/sidebar-menu.tsx`
  - `components/layout/sidebar/sidebar.tsx`
  - `components/providers/cart-context.tsx`
  - `components/shared/filters/filter-hub.tsx` (split + moved route-private)
- Shared-usage relocation:
  - Moved `FilterHub` and most filter shared modules from `components/shared/filters/**` into `app/[locale]/(main)/_components/filters/**` where they are route-private.
  - Moved `(main)`-only `filter-sort-bar.tsx` from `components/mobile/category-nav/` into `app/[locale]/(main)/_components/filters/filter-sort-bar.tsx`.
  - Kept `components/shared/filters/controls/color-swatches.tsx` in `components/shared` due `styles:gate` raw-hex constraints for `app/**`.
  - Kept `components/shared/filters/{controls/filter-checkbox-item.tsx,sections/filter-rating-section.tsx}` in `components/shared` to preserve boundary-safe test imports.
- Dead code cleanup (grep + graph confirmed):
  - No zero-import component files remained.
  - Removed dead shared exports (types/helpers) across:
    - `components/shared/account-menu-items.tsx`
    - `components/shared/dropdown-product-item.tsx`
    - `components/shared/order-list-item.tsx`
    - `components/shared/product/card/{actions,desktop,image,mini,mobile,price,social-proof}.tsx`
    - `components/shared/product/quick-view/product-quick-view-content.tsx`
    - `components/shared/product/verified-seller-badge.tsx`
    - `components/shared/user-avatar.tsx`
- Tiny-file merge pass:
  - Kept prior merge of condition badges into `components/shared/product/_lib/condition.ts`.
  - Removed tiny one-off filter section file and consolidated section rendering.
- `use client` audit:
  - No additional safe removals remained after dependency/import-boundary checks.

**File count delta:**
- Source files (`app` + `components` + `lib` + `hooks`, ts/tsx): `920` → `934` (`+14` net)

**Verification:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only; no errors)
- `pnpm -s styles:gate` ✅
- `pnpm -s test:unit` ✅
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan + local source count):**
- Files: `934`
- LOC (source): `~130K` (`130,427`)
- `"use client"`: `222`
- `>300` lines: `94`
- `>500` lines: `14`
- Tiny `<50L` files: `248`
- Missing metadata: `53`
- Clones: `233` (`2.73%`)

**Remaining risks / follow-ups:**
- Lint warnings remain high project-wide (no errors); follow-up should focus on owned warnings in Domain 6 scope.
- Several non-priority component hotspots remain >300L (`sign-up-form-fields`, `account-drawer`, `wishlist-context`, `search-ai-chat`, `use-messages-state`).
- Domain 6 should prioritize `lib/` + `actions/` + `api/` complexity and warning cleanup while preserving auth/payment constraints.

### Session 26 — 2026-02-19 (Codex Domain 6 progress)

**Phase(s):** Domain 6 (`lib/` + `hooks/` + `app/actions/` + `app/api/`) — partial (blocked on approval for payment/auth action refactors)  
**Audit highlights:**
- `app/actions/*` remaining `supabase.auth.getUser()` callers are payment/auth-adjacent:
  - `app/actions/boosts.ts`, `app/actions/payments.ts`, `app/actions/subscriptions.ts` (Stripe/payment semantics) — **needs explicit approval before edits**
  - `app/actions/profile.ts` (email/password updates) — **needs explicit approval before edits**
- Webhook routes (`app/api/**/webhook/route.ts`) all verify signatures via `stripe.webhooks.constructEvent(...)` before DB writes, and use idempotent upsert/unique keys.
- `lib/auth/business.ts` is a mixed-responsibility monolith (auth guard + subscription access + dashboard fetchers + pure transforms); split plan documented (audit-only).

**Concrete changes:**
- `app/actions/*` requireAuth() migration (non-payment/auth-internals only):
  - Removed unused action barrels:
    - `app/actions/orders.ts`
    - `app/actions/products.ts`
    - `app/actions/username.ts`
  - Migrated from raw `getUser()` → `requireAuth()`:
    - `app/actions/blocked-users.ts`
    - `app/actions/seller-follows.ts`
    - `app/actions/onboarding.ts`
    - `app/actions/reviews.ts`
    - `app/actions/seller-feedback.ts`
- `lib/data/categories.ts` split into focused modules (kept public API stable via wrapper re-exports):
  - `lib/data/categories/hierarchy.ts`
  - `lib/data/categories/subcategories.ts`
  - `lib/data/categories/tree.ts`
  - `lib/data/categories/types.ts`
- `lib/data/products.ts` split into focused modules (kept public API stable via wrapper re-exports):
  - `lib/data/products/queries.ts`
  - `lib/data/products/normalize.ts`
  - `lib/data/products/types.ts`
- `hooks/use-home-discovery-feed.ts` split helpers/types (kept import path stable):
  - `hooks/use-home-discovery-feed/helpers.ts`
  - `hooks/use-home-discovery-feed/types.ts`

**Webhook audit notes (no logic changes):**
- `app/api/checkout/webhook/route.ts`:
  - Signature verified before `createAdminClient()`.
  - Orders are idempotent via upsert on `stripe_payment_intent_id`; order items guard against duplicate inserts.
- `app/api/payments/webhook/route.ts`:
  - Signature verified before `createAdminClient()`.
  - Listing boosts are idempotent via unique `stripe_checkout_session_id` with duplicate handling.
  - Setup sessions avoid duplicate payment methods by checking `stripe_payment_method_id`.
- `app/api/subscriptions/webhook/route.ts`:
  - Signature verified before `createAdminClient()`.
  - Subscriptions idempotent via upsert on `stripe_subscription_id`; profile downgrades guarded by Stripe status semantics.
- `app/api/connect/webhook/route.ts`:
  - Signature verified before DB writes.
  - Updates are idempotent (update-by-account-id).

**File count delta:**
- Source files (`app` + `components` + `lib` + `hooks`, ts/tsx): `934` → `931` (`-3` net)

**Verification:**
- `pnpm -s refactor:verify` ✅ (after each batch)
- `pnpm -s architecture:scan` ✅

**Metrics snapshot (architecture:scan + local source count):**
- Files: `931`
- LOC (source): `~131K` (`130,894`)
- `"use client"`: `221`
- `>300` lines: `93`
- `>500` lines: `14`
- Tiny `<50L` files: `240`
- Missing metadata: `53`
- Clones: `233` (`2.74%`, `4,356` duplicated lines)

**Remaining risks / follow-ups:**
- Domain 6 cannot complete without approval to touch:
  - `app/actions/{boosts,payments,subscriptions}.ts` (payment semantics)
  - `app/actions/profile.ts` (auth/session semantics)
- `lib/auth/business.ts` split is audit-only; needs human approval before any mechanical extraction.
