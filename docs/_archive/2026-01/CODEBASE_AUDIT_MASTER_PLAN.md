# Codebase Audit & Cleanup Master Plan

> **Goal:** Reduce codebase by ~30% while maintaining identical functionality
> **Generated:** January 1, 2026
> **Estimated Impact:** 150-200 files, 15,000+ lines of code

---

## 🎯 Current Progress (Updated January 1, 2026)

| Phase | Status | Notes |
|-------|--------|-------|
| **Phase 1: Dead Code** | ✅ COMPLETE | 48 files deleted, 159 exports removed, knip reports 0 issues |
| **Phase 2: Duplicates** | 🔄 IN PROGRESS | 262 clones detected (4,634 lines), ready to consolidate |
| **Phase 3: Config Files** | ⏳ NOT STARTED | database.types.ts duplicate identified |
| **Phase 4: Console Logs** | ⏳ NOT STARTED | ~100+ console statements to remove |
| **Phase 5: TODOs** | ⏳ NOT STARTED | 15 TODO comments to address |
| **Phase 6: Archives** | ⏳ NOT STARTED | cleanup/ and docs/archive/ folders to delete |
| **Phase 7: Barrels** | ⏳ NOT STARTED | Barrel exports already cleaned in Phase 1 |

### Phase 1 Results
- **Deleted 48 files** including unused components, sections, dropdowns
- **Removed 159 unused exports** via `pnpm knip:fix`
- **Removed 30 unused types**
- **Cleaned 6 barrel files** (fields/index.ts, ui/index.ts, dropdowns/index.ts, etc.)
- **All tests passing** (88/88 unit tests)
- **TypeScript clean** (0 errors)

---

## Executive Summary

Your codebase has significant cleanup potential. Based on automated analysis:

| Issue Category | Count | Priority |
|----------------|-------|----------|
| **Unused Files** | 9 | 🔴 Critical |
| **Unused Exports** | 153 | 🔴 Critical |
| **Unused Types** | 30 | 🟡 Medium |
| **Unused DevDeps** | 3 | 🟢 Low |
| **Code Clones** | 290 | 🔴 Critical |
| **Console Statements** | ~100+ | 🟡 Medium |
| **TODO Comments** | 15 | 🟢 Low |
| **Duplicate Config Files** | 2+ | 🔴 Critical |
| **Archive/Dead Docs** | ~15 files | 🟢 Low |

---

## 🛠️ Tools Already Configured

Your project already has excellent tooling:

### ✅ Already Installed
```bash
pnpm knip        # Dead code detection - READY TO USE
pnpm knip:fix    # Auto-fix dead code - READY TO USE
jscpd            # Duplicate detection - READY TO USE (devDep)
madge            # Circular deps - READY TO USE (devDep)
eslint           # Linting with sonarjs + unicorn - READY TO USE
```

### 📦 Recommended Additional
```bash
# No additional tools needed - your setup is comprehensive!
# Consider adding to CI:
pnpm knip        # Block merges with dead code
```

---

## 📋 Phase 1: Dead Code Removal (Knip)

### Unused Files (DELETE)
```
lib/result.ts                                    # 0 imports
components/desktop/index.ts                      # Barrel with no consumers
components/shared/trust-bar.tsx                  # Orphaned component
components/common/wishlist/wishlist-button.tsx   # Orphaned component
components/mobile/product/index.ts               # Barrel with no consumers
components/mobile/product/mobile-product-info.tsx
components/mobile/product/mobile-quantity-stepper.tsx
components/shared/product/mobile-seller-card.tsx
components/shared/product/mobile-sticky-bar.tsx
```

### Unused DevDependencies (REMOVE from package.json)
```json
"@typescript-eslint/eslint-plugin": "^8.51.0",  // Unused (using flat config)
"jscpd": "^4.0.5",                               // Only for manual audits
"madge": "^8.0.0"                                // Only for manual audits
```

### Unused Exports (153 total) - TOP OFFENDERS
```typescript
// i18n/routing.ts - Remove or use:
redirect, getPathname

// lib/shipping.ts - Remove or use:
getDeliveryLabel, getRegionName

// lib/currency.ts - Remove:
formatNumber

// lib/data/products.ts - Remove:
getProductById, filterByZone

// lib/env.ts - 7 unused exports
getSupabaseServiceRoleKey, getAppUrl, getAuthCookieDomain,
getSupabaseFetchTimeout, isProduction, isDevelopment, getSupabaseConfig, getStripeConfig

// components/ai-elements/*.tsx - 20+ unused AI component exports
// components/dropdowns/*.tsx - 6 unused dropdown exports
// components/sections/*.tsx - 7 unused section exports
// app/[locale]/(sell)/_components/*.tsx - 30+ unused memoized field exports
```

### Execution
```bash
# Preview what will be fixed
pnpm knip

# Auto-fix (removes unused exports)
pnpm knip:fix

# Manually delete unused files after reviewing
```

---

## 📋 Phase 2: Duplicate Code Cleanup (290 clones!)

### Highest Impact Duplicates

#### 1. **Sell Form Drawer Components** (~400 lines saveable)
```
app/[locale]/(sell)/_components/ui/drawer-select.tsx
app/[locale]/(sell)/_components/ui/multi-select-drawer.tsx
app/[locale]/(sell)/_components/ui/select-drawer.tsx
```
**Fix:** Create single `GenericDrawerSelect` component with `multiple?: boolean` prop

#### 2. **Smart Category Picker Internal** (~200 lines)
```
app/[locale]/(sell)/_components/ui/smart-category-picker.tsx
  - Lines 533-546 duplicated at 287-300
  - Lines 573-583 duplicated at 327-337
  - Lines 595-605 duplicated at 349-359
  - Lines 614-626 duplicated at 406-418
```
**Fix:** Extract repeated JSX patterns into sub-components

#### 3. **Attributes Field** (~300 lines)
```
app/[locale]/(sell)/_components/fields/attributes-field.tsx
  - 5 separate internal duplications
```
**Fix:** Extract render functions, use composition

#### 4. **Photos Field** (~150 lines)
```
app/[locale]/(sell)/_components/fields/photos-field.tsx
  - Lines 341-420 duplicated at 264-356
```
**Fix:** Extract photo upload/preview logic into shared function

#### 5. **Pricing Components** (~150 lines)
```
app/[locale]/(sell)/_components/fields/pricing-field.tsx
app/[locale]/(sell)/_components/ui/price-suggestion.tsx
app/[locale]/(sell)/_components/ui/quantity-stepper.tsx
```
**Fix:** `pricing-field.tsx` re-implements these components internally - just import them

#### 6. **Orders Page Duplicates** (~100 lines)
```
app/[locale]/(account)/account/orders/[id]/page.tsx
app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx
```
**Fix:** Page should just render the component, not duplicate its content

#### 7. **Category Icons** (~200 lines)
```
lib/category-icons.tsx
  - megaMenuIconMap and subheaderIconMap are 95% identical
```
**Fix:** Single icon map with size parameter

### Execution
```bash
# Run duplicate detection with stricter settings
npx jscpd --min-lines 8 --min-tokens 40 --format "typescript,tsx" \
  --ignore "node_modules,**/*.test.*,**/*.spec.*,e2e/**,.next/**" .
```

---

## 📋 Phase 3: Duplicate Config/Type Files

### CRITICAL: Duplicate Database Types
```
lib/supabase/database.types.ts    # 2,361 lines
types/database.types.ts           # 2,375 lines  ← DELETE THIS
```
These are nearly identical (14 line difference). Keep the `lib/supabase/` version.

**Fix:**
```bash
# 1. Find all imports of types/database.types.ts
grep -r "from ['\"]@/types/database" --include="*.ts" --include="*.tsx"

# 2. Update imports to use lib/supabase/database.types.ts

# 3. Delete types/database.types.ts
```

### Re-export Pattern Cleanup
```typescript
// lib/sell-form-schema-v4.ts - Contains only:
export * from "./sell/schema-v4";
```
**Fix:** Delete the file, update imports to use `@/lib/sell/schema-v4` directly

---

## 📋 Phase 4: Console Statement Cleanup

### Production Code (Must Remove)
```typescript
// app/[locale]/(sell)/sell/_lib/categories.ts:119
console.log(...)  // DELETE

// app/[locale]/(business)/dashboard/_lib/categories.ts:108
console.log(...)  // DELETE

// app/api/subscriptions/webhook/route.ts:85, 156
console.log(...)  // Convert to proper logging or DELETE

// playwright.config.ts:47
console.log('[Playwright Config]...')  // DELETE (dev noise)
```

### Keep These (Intentional Warnings)
```typescript
// lib/supabase/middleware.ts:62 - Config warning
// lib/supabase/client.ts:33 - Env warning  
// i18n/routing.ts:37 - Fallback warning
// i18n/request.ts:109 - Missing translation
```

### Execution
```bash
# Find all console statements in source
grep -rn "console\.\(log\|warn\|info\|debug\|error\)" \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules --exclude-dir=.next \
  --exclude-dir=scripts --exclude-dir=e2e

# Use ESLint to enforce no-console in production
```

### ESLint Config Addition (optional)
```javascript
// eslint.config.mjs - add rule:
{
  files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
}
```

---

## 📋 Phase 5: TODO Comment Cleanup

### Current TODOs (15 found)
```typescript
// lib/auth/business.ts:745,781,782 - Placeholder values
pendingReviews: 0, // TODO: Add when reviews table is set up
hasShippingSetup: true, // TODO: Add shipping settings
hasPaymentSetup: true, // TODO: Add payout settings

// components/shared/product/product-buy-box.tsx:108
// TODO: Implement add to cart functionality

// app/[locale]/(sell)/_components/fields/pricing-field.tsx:231
// TODO: Fetch actual price suggestions based on category

// app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx:195,214
// TODO: Implement return request server action
const shipping = 0 // TODO: Get from order

// app/[locale]/(chat)/_components/conversation-list.tsx:188
const isOwnMessage = false // TODO: Check if last message

// app/[locale]/(business)/_components/orders-table.tsx:279
// TODO: Implement bulk status update action

// app/[locale]/(business)/_components/order-detail-view.tsx:164
// TODO: Implement status update action

// app/api/checkout/webhook/route.ts:181
// TODO: Integrate with email service
```

### Action
- **Keep** TODOs that are actual planned work
- **Convert** placeholder TODOs to `// PLACEHOLDER:` or remove if never planned
- **Remove** obvious/stale TODOs

---

## 📋 Phase 6: Archive/Documentation Cleanup

### Delete Entirely
```
cleanup/                              # All planning docs - no longer needed
  archive/                            # 6 obsolete plan files
  desktop-product-page-masterpiece-plan.md
  mobile-design-tokens.md
  mobile-product-page-masterpiece-plan.md
  onboarding-refactor-plan.md
  ux-audit-20251228-phase2/
  ux-audit-20251231-phase2/

docs/archive/                         # Obsolete planning docs
  MOBILE_PRODUCT_PAGE_MASTERPLAN.md
  PRODUCT_PAGE_MASTERPLAN.md
```

### Review for Deletion
```
docs/audits/                          # May contain useful reference
docs/MASTER_FIX_PLAN.md              # Check if still relevant
docs/mobile_audit.md                  # Check if still relevant
docs/desktop_audit.md                 # Check if still relevant
```

---

## 📋 Phase 7: Barrel Export Optimization

### Remove/Simplify These Index Files
```typescript
// components/desktop/index.ts - Knip says unused
// components/mobile/product/index.ts - Knip says unused

// These barrel files re-export things that are also directly imported:
// components/sections/index.ts
// components/dropdowns/index.ts
```

### Best Practice
Use direct imports instead of barrel files in a Next.js app:
```typescript
// ❌ Avoid (tree-shaking issues)
import { Button, Card } from '@/components/ui'

// ✅ Prefer (better tree-shaking)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

---

## 🚀 Execution Order

### Step 1: Safe Automated Cleanup (30 min)
```bash
# Remove unused devDependencies
pnpm remove @typescript-eslint/eslint-plugin jscpd madge

# Run knip auto-fix for unused exports
pnpm knip:fix

# Verify build still works
pnpm build
```

### Step 2: Manual File Deletion (1 hour)
```bash
# Delete unused files identified by knip
rm lib/result.ts
rm components/desktop/index.ts
rm components/shared/trust-bar.tsx
rm components/common/wishlist/wishlist-button.tsx
rm components/mobile/product/index.ts
rm components/mobile/product/mobile-product-info.tsx
rm components/mobile/product/mobile-quantity-stepper.tsx
rm components/shared/product/mobile-seller-card.tsx
rm components/shared/product/mobile-sticky-bar.tsx

# Delete duplicate database types
rm types/database.types.ts
# Update imports across codebase

# Delete archive folders
rm -rf cleanup/
rm -rf docs/archive/

# Delete re-export file
rm lib/sell-form-schema-v4.ts
# Update imports to @/lib/sell/schema-v4
```

### Step 3: Console Log Cleanup (30 min)
```bash
# Remove production console.logs
# Search and manually remove in:
# - app/[locale]/(sell)/sell/_lib/categories.ts
# - app/[locale]/(business)/dashboard/_lib/categories.ts
# - app/api/subscriptions/webhook/route.ts
# - playwright.config.ts
```

### Step 4: Duplicate Code Refactoring (4-8 hours)
Priority order:
1. Drawer components consolidation (~2 hours)
2. Pricing field deduplication (~1 hour)
3. Category icons consolidation (~30 min)
4. Orders page deduplication (~30 min)
5. Attributes/Photos fields refactoring (~3 hours)

### Step 5: Final Verification
```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
pnpm knip  # Should show 0 issues
```

---

## 📊 Expected Results

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| TypeScript Files | ~689 | ~650 | -6% |
| Total Lines | ~100k+ | ~70k | -30% |
| Unused Exports | 153 | 0 | -100% |
| Code Clones | 290 | <30 | -90% |
| Database Type Files | 2 | 1 | -50% |

---

## 🔧 CI/CD Recommendations

Add to your CI pipeline:
```yaml
# .github/workflows/quality.yml
- name: Dead Code Check
  run: pnpm knip

- name: Duplicate Detection  
  run: npx jscpd --min-lines 15 --threshold 3 --format "typescript,tsx" .

- name: Type Check
  run: pnpm typecheck
```

---

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking production | Run full test suite after each phase |
| Removing used code | Knip is conservative; manually verify |
| Git history loss | Create a pre-cleanup tag |
| Merge conflicts | Coordinate with team, do in single sprint |

---

## 📅 Timeline

| Phase | Time | Dependencies |
|-------|------|--------------|
| Phase 1 (Knip) | 1-2 hours | None |
| Phase 2 (Duplicates) | 4-8 hours | Phase 1 |
| Phase 3 (Config) | 30 min | Phase 1 |
| Phase 4 (Console) | 30 min | None |
| Phase 5 (TODOs) | 30 min | None |
| Phase 6 (Archives) | 15 min | None |
| Phase 7 (Barrels) | 30 min | Phase 1 |
| **Total** | **8-12 hours** | |

---

## ✅ Ready to Execute

Run these commands in order:

```bash
# 1. Create safety branch
git checkout -b cleanup/codebase-audit

# 2. Phase 1: Dead code
pnpm knip:fix
pnpm build && pnpm test:unit

# 3. Continue with manual phases...
```

**Next Step:** Start with Phase 1 (pnpm knip:fix) - it's safe and automated!
