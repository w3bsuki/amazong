# Code Cleanup Guide

**Project:** amazong-marketplace (treido.eu)  
**Created:** December 29, 2025

---

## Quick Commands

```bash
# Dead code detection
pnpm knip

# Duplicate code detection  
pnpm jscpd ./ --reporters console

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

---

## Phase 1: Dead Code Removal (Knip)

### Status: ✅ Files Deleted | ⚠️ Exports Need Review

#### Completed ✅
- **4 unused files deleted:**
  - ~~`app/[locale]/_lib/delivery-date.ts`~~ (duplicate of `lib/currency.ts` functions)
  - ~~`components/shared/product/mobile-product-summary.tsx`~~ (replaced by `MobileSellerCard`)
  - ~~`app/[locale]/(account)/_actions/subscriptions.ts`~~ (consolidated into `app/actions/subscriptions.ts`)
  - ~~`app/[locale]/(plans)/_actions/subscriptions.ts`~~ (consolidated into `app/actions/subscriptions.ts`)

#### Remaining: Unused Exports (327)

Most unused exports fall into these categories and should **NOT** be removed:

1. **shadcn/ui component re-exports** - Standard library pattern (barrel files)
2. **Database types** - Auto-generated, may be used in future
3. **Barrel file re-exports** - Intentional for clean imports

**Categories safe to keep:**
- `components/ui/*.tsx` exports
- `types/database.types.ts` exports  
- `lib/supabase/database.types.ts` exports
- Index file (`index.ts`) re-exports

**Consider removing (unused business logic):**
- Run `pnpm knip` and review functions in `app/actions/` not called anywhere
- Review helper functions in `lib/` files

### Tasks

- [x] Delete unused files
- [ ] Review and update `knip.json` to ignore intentional library patterns
- [ ] Remove unused devDependencies (see below)

#### Unused devDependencies
- `jscpd` - Keep if using for duplicate detection
- `tailwindcss` - **FALSE POSITIVE** - Required for CSS
- `tailwindcss-animate` - **FALSE POSITIVE** - Required for animations

---

## Phase 2: Duplicate Code (JSCPD)

### Status: ✅ Major Consolidation Done

### Completed ✅
| Consolidation | Lines Saved |
|---------------|-------------|
| Subscription actions (3→1 file) | ~138 |
| Legal pages layout | ~350 |
| CarouselScrollButton | ~22 |
| DropdownProductItem | ~28 |
| StarRatingDialog | ~162 |
| **Error boundary pages (10→1 shared)** | **~400** |
| **Image upload routes (2→1 shared)** | **~160** |
| **Total** | **~1260** |

### New Shared Components Created
- `components/shared/error-boundary-ui.tsx` - Reusable error boundary UI
- `lib/upload/image-upload.ts` - Shared image upload handler

### Pages Updated to Use ErrorBoundaryUI
- `app/[locale]/error.tsx`
- `app/[locale]/[username]/error.tsx`
- `app/[locale]/(main)/wishlist/error.tsx`
- `app/[locale]/(main)/search/error.tsx`
- `app/[locale]/(main)/cart/error.tsx`
- `app/[locale]/(main)/categories/error.tsx`
- `app/[locale]/(main)/categories/[slug]/error.tsx`
- `app/[locale]/(main)/todays-deals/error.tsx`
- `app/[locale]/(main)/members/error.tsx`
- `app/[locale]/(main)/seller/dashboard/error.tsx`
- `app/[locale]/(account)/account/error.tsx`

### Routes Updated to Use Shared Upload
- `app/api/upload-image/route.ts`
- `app/api/upload-chat-image/route.ts`

### Remaining (Intentionally NOT consolidated - different business logic)
| Duplicate | Lines | Reason to Keep |
|-----------|-------|----------------|
| Search/Category pages | 67+51 | Different data sources, similar UI is intentional |
| Wishlist/Cart dropdown | 84 | Cart has quantity controls, wishlist doesn't |
| Buyer/Seller actions | 83 | Different feedback targets and API calls |
| Deals/Trending sections | 50 | Different card components and data |
| Business sidebar internal | 108 | Self-duplicate within same file, refactor later |

### Commands
```bash
# Generate fresh report
pnpm jscpd ./ --reporters json --output cleanup/

# View top duplicates
node -e "const r=require('./cleanup/jscpd-report.json'); r.duplicates.sort((a,b)=>b.lines-a.lines).slice(0,10).forEach((d,i)=>console.log((i+1)+'. '+d.lines+'L: '+d.firstFile.name+' <-> '+d.secondFile.name))"
```

---

## Phase 3: Circular Dependencies

### Status: ✅ Complete

### Setup
```bash
pnpm add -D madge
```

### Run
```bash
npx madge --circular --extensions ts,tsx ./app ./components ./lib
```

### Completed ✅
- **1 circular dependency found and fixed:**
  - `app/[locale]/(sell)/_components/ai/ai-listing-assistant.tsx` - Self-referential import via `LazyAiListingAssistant`

### Fix Applied
- Removed unused `LazyAiListingAssistant` export (was importing itself via `import("./ai-listing-assistant")`)
- Removed unused `MemoizedAiListingAssistant` export (dead code)
- Removed unused `Suspense`, `lazy`, `memo` imports from React
- Removed unused `SellFormDataV4` type import
- Updated `_components/index.ts` barrel file to remove dead exports

### Tasks
- [x] Install madge
- [x] Run circular dependency check
- [x] Fix any circular imports found

---

## Phase 4: Code Quality Plugins

### Status: ✅ Complete

### Installed ESLint Plugins
```bash
pnpm add -D eslint-plugin-sonarjs eslint-plugin-unicorn
```

**eslint-plugin-sonarjs v3.x** - Detects:
- Bug patterns (duplicated branches, empty collections, gratuitous expressions)
- Cognitive complexity (threshold: 25)
- Code smells (duplicate strings, identical functions, nested conditionals)

**eslint-plugin-unicorn** - Enforces:
- Modern JS practices (`Number.parseInt`, `String#replaceAll`, `Array#includes`)
- Better error handling (`throw new Error()`)
- Consistent function scoping
- Preferred APIs (`String#slice` over `substring`)

### Configuration Added to `eslint.config.mjs`
- All rules set to **warn** level (non-blocking)
- Relaxed thresholds for gradual improvement
- Test and config files excluded from strict rules
- Fixes auto-applied via `pnpm lint --fix` (144 auto-fixable warnings fixed)

### Results
- **0 errors** (was 1 error after fix)
- **228 warnings** (down from 383 initial warnings)
- TypeScript check: **passing**

### Common Warning Categories
| Rule | Count | Fix Strategy |
|------|-------|--------------|
| `sonarjs/cognitive-complexity` | ~30 | Break large components into smaller functions |
| `unicorn/consistent-function-scoping` | ~25 | Move inner functions to module scope |
| `sonarjs/no-duplicate-string` | ~10 | Extract to constants |
| `unicorn/prefer-number-properties` | ~15 | Use `Number.parseInt` etc |
| `sonarjs/no-nested-template-literals` | ~15 | Extract inner templates |

### Tasks
- [x] Install plugins
- [x] Add to `eslint.config.mjs`
- [x] Run `pnpm lint` and fix issues
- [x] Auto-fix 156 warnings via `--fix`
- [x] Fix ref mutation during render (`prompt-input.tsx`)
- [x] Fix TypeScript errors (`safe-json.test.ts`, `mobile-product-page.tsx`)

---

## Phase 5: Cleanup Folder

### Status: ✅ Complete

The `/cleanup` folder has been organized.

### Completed ✅
- Deleted stale generated reports:
  - `jscpd-report.json`
  - `knip-latest.json`
  - `knip-phase1-analysis.txt`
  - `knip-report.json`
  - `tsc-last.log`
  - `palette-scan-report.txt`
- Archived superseded plan files to `cleanup/archive/`:
  - `desktop-product-page-audit-and-refactor-plan.md`
  - `desktop-product-page-audit-and-refactor-plan-backup.md`
  - `mobile-product-page-audit-and-refactor-plan.md`
  - `mobile-product-page-improvement-plan-v2.md`
  - `product-page-plans-audit-2025-12-27.md`
  - `mobile-audit-todo.md`
- Updated `.gitignore` to ignore all cleanup output patterns (`*.json`, `*.log`, `*.txt`, `archive/`)

### Active Plans (kept in `/cleanup`)
- `desktop-product-page-masterpiece-plan.md` - Authoritative desktop PDP plan
- `mobile-product-page-masterpiece-plan.md` - Authoritative mobile PDP plan
- `mobile-design-tokens.md` - Active mobile token reference
- `onboarding-refactor-plan.md` - Future work for seller onboarding

---

## Ongoing Maintenance

Add to CI pipeline:
```yaml
- pnpm typecheck
- pnpm lint
- pnpm knip --no-exit-code
```

Run monthly:
- `pnpm jscpd ./` - Check for new duplicates
- `npx madge --circular ./` - Check for circular deps

---

## Progress Log

| Date | Action | Result |
|------|--------|--------|
| Dec 29, 2025 | JSCPD consolidation session | ~700 lines removed |
| Dec 29, 2025 | Phase 1: Deleted 4 unused files | `delivery-date.ts`, `mobile-product-summary.tsx`, 2x duplicate `subscriptions.ts` |
| Dec 29, 2025 | Fixed missing Button import | `customer-reviews-hybrid.tsx` |
| Dec 29, 2025 | Updated knip.json | Added `tailwindcss` to ignoreDependencies, enabled `ignoreExportsUsedInFile` |
| Dec 29, 2025 | Knip report reduced | 327 → 148 unused exports (intentional library patterns now ignored) |
| Dec 29, 2025 | Phase 2: Error boundary consolidation | Created `ErrorBoundaryUI` component, updated 11 error pages |
| Dec 29, 2025 | Phase 2: Image upload consolidation | Created `handleImageUpload` utility, updated 2 API routes |
| Dec 29, 2025 | Phase 3: Circular dependencies | Fixed 1 self-referential import in `ai-listing-assistant.tsx`, removed unused exports || Dec 29, 2025 | Phase 4: Install code quality plugins | Installed `eslint-plugin-sonarjs@3.0.5`, `eslint-plugin-unicorn@62.0.0` |
| Dec 29, 2025 | Phase 4: Configure ESLint plugins | Added sonarjs + unicorn rules to `eslint.config.mjs` with warn level |
| Dec 29, 2025 | Phase 4: Auto-fix lint warnings | 156 warnings auto-fixed via `--fix` (383 → 227 warnings) |
| Dec 29, 2025 | Phase 4: Fix ref mutation | Fixed `filesRef.current = files` during render in `prompt-input.tsx` |
| Dec 29, 2025 | Phase 4: Fix TypeScript errors | Fixed test arg in `safe-json.test.ts`, fixed `.slice()` on object in `mobile-product-page.tsx` |
| Dec 29, 2025 | Phase 4: Final status | 0 errors, 228 warnings, TypeScript passing |
| Dec 29, 2025 | Phase 5: Cleanup folder | Deleted 6 stale reports, archived 6 superseded plans, updated `.gitignore` |