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
