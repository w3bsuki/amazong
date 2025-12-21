# 🚀 CLEANUP EXECUTION PLAN (Protocol, Not a Laundry List)

This file describes *how* we delete and prune safely. It intentionally does not try to be the “full refactor plan”.

Canonical plan: [STRUCTURE.md](../STRUCTURE.md)

Evidence inputs (candidate lists, not truth):
- [FULL_CODEBASE_AUDIT.md](./FULL_CODEBASE_AUDIT.md)
- [FILE_INVENTORY.md](./FILE_INVENTORY.md)

**Risk Reality:** cleanup is not “low risk” if we trust the inventory blindly. The protocol below is designed to keep risk low.

---

## Protocol 0: Gates

Run after every batch:

```powershell
pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false
pnpm -s build
```

For bigger batches:

```powershell
pnpm -s lint
pnpm test:e2e
```

---

## Protocol 1: “Verify Then Delete”

For each candidate file or folder:

1) Prove no references (imports/usages):

```powershell
git grep -n "<path-or-import>" -- app components lib hooks
```

2) Delete with history:

```powershell
git rm -- path/to/file
# or
git rm -r -- path/to/folder
```

3) Run gates.

---

## Protocol 2: “Prefer the Better Implementation”

If the audit labels something “unused” but it’s cleaner than the current “used” code:

- Do not delete it.
- Promote it to the canonical implementation during the refactor phase.
- Delete the worse implementation only after imports converge.

## Protocol 3: Dependencies (Only After Code)

Do dependency pruning after code convergence (otherwise you risk removing a dependency you actually want to keep).

Workflow:

```powershell
git grep -n "<package-name>" -- app components lib hooks
pnpm remove <package-name>
pnpm install
pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false
pnpm -s build
```

---

## Where the candidate deletions live

- Candidate file list: [FILE_INVENTORY.md](./FILE_INVENTORY.md)
- Candidate dependency list: [FULL_CODEBASE_AUDIT.md](./FULL_CODEBASE_AUDIT.md)
- Execution checklist: [production/02-CLEANUP.md](../production/02-CLEANUP.md)

---

## Duplicates: treat as “convergence”, not “cleanup”

When you see duplicates, the correct move is:

1) Pick the best implementation.
2) Make it canonical.
3) Add re-export shims.
4) Update imports until everything converges.
5) Delete the losers.

If you want a concrete list of known duplicates and extraction candidates, use [FULL_CODEBASE_AUDIT.md](./FULL_CODEBASE_AUDIT.md).

**Create:** `lib/data/seller-stats.ts`

```typescript
// lib/data/seller-stats.ts
import { createStaticClient } from '@/lib/supabase/static-client'

export interface SellerStats {
  totalSales: number
  averageRating: number
  reviewCount: number
  positiveCount: number
  positiveFeedbackPercentage: number
  followerCount: number
}

export async function getSellerStats(sellerId: string): Promise<SellerStats> {
  const supabase = createStaticClient()
  if (!supabase) {
    return {
      totalSales: 0,
      averageRating: 0,
      reviewCount: 0,
      positiveCount: 0,
      positiveFeedbackPercentage: 100,
      followerCount: 0
    }
  }

  // Fetch order items
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("quantity")
    .eq("seller_id", sellerId)

  const totalSales = orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

  // Fetch seller feedback
  const { data: feedback } = await supabase
    .from("seller_feedback")
    .select("rating")
    .eq("seller_id", sellerId)

  let averageRating = 0
  let reviewCount = 0
  let positiveCount = 0

  if (feedback && feedback.length > 0) {
    reviewCount = feedback.length
    averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / reviewCount
    positiveCount = feedback.filter(f => f.rating >= 4).length
  }

  const positiveFeedbackPercentage = reviewCount > 0
    ? Math.round((positiveCount / reviewCount) * 100)
    : 100

  // Fetch follower count
  const { count: followerCount } = await supabase
    .from("store_followers")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)

  return {
    totalSales,
    averageRating,
    reviewCount,
    positiveCount,
    positiveFeedbackPercentage,
    followerCount: followerCount || 0
  }
}
```

**Update:** `lib/data/profile-data.ts` and `lib/data/store.ts` to use shared function.

### 3.2 Extract Category Flatten Utility

**Create:** `lib/category-utils.ts`

```typescript
// lib/category-utils.ts
import { useMemo } from 'react'

export interface Category {
  id: string
  name: string
  name_bg?: string | null
  slug: string
  children?: Category[]
}

export interface FlatCategory extends Category {
  path: Category[]
  fullPath: string
  searchText: string
}

export function flattenCategories(
  categories: Category[],
  locale: string
): FlatCategory[] {
  const result: FlatCategory[] = []

  function flatten(cats: Category[], path: Category[] = []) {
    for (const cat of cats) {
      const currentPath = [...path, cat]
      const fullPath = currentPath
        .map((c) => (locale === 'bg' && c.name_bg ? c.name_bg : c.name))
        .join(' › ')

      result.push({
        ...cat,
        path: currentPath,
        fullPath,
        searchText: `${cat.name} ${cat.name_bg || ''} ${cat.slug}`.toLowerCase(),
      })

      if (cat.children?.length) {
        flatten(cat.children, currentPath)
      }
    }
  }

  flatten(categories)
  return result
}

export function useFlatCategories(categories: Category[], locale: string) {
  return useMemo(
    () => flattenCategories(categories, locale),
    [categories, locale]
  )
}

export function searchCategories(
  flatCategories: FlatCategory[],
  query: string,
  limit: number = 20
): FlatCategory[] {
  if (!query.trim()) return []
  const searchQuery = query.toLowerCase()
  return flatCategories
    .filter((cat) => cat.searchText.includes(searchQuery))
    .slice(0, limit)
}
```

**Update:** 
- `components/sell/ui/smart-category-picker.tsx`
- `components/sell/ui/category-modal/index.tsx`

### 3.3 Create Server Action Wrapper

**Create:** `lib/server-action.ts`

```typescript
// lib/server-action.ts
import { createClient } from '@/lib/supabase/server'

export type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function withServerAction<T>(
  tableName: string,
  action: (
    supabase: Awaited<ReturnType<typeof createClient>>
  ) => Promise<{ data?: T; error?: Error | null }>
): Promise<ActionResult<T>> {
  'use server'
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'No database connection' }
  }

  const { data, error } = await action(supabase)
  
  if (error) {
    console.error(`Error in ${tableName}:`, error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
```

**Update:** `lib/data/badges.ts` and similar files to use wrapper.

### 3.4 Extract Dimension Input Component

**Create:** `components/sell/ui/dimension-input.tsx`

```typescript
// components/sell/ui/dimension-input.tsx
import { Input } from '@/components/ui/input'

interface DimensionInputProps {
  label: string
  value: number | null | undefined
  onChange: (value: string) => void
  unit: string
  min?: number
  step?: number
}

export function DimensionInput({
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = 0.1
}: DimensionInputProps) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="pr-8 h-10 rounded-lg"
          min={min}
          step={step}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  )
}
```

**Update:** `components/sell/sections/shipping-section.tsx`

---

## 🧹 PHASE 4: CLEANUP UNUSED EXPORTS (1 hour)

### 4.1 Remove Duplicate Exports

**Files to update:**
1. `components/geo-welcome-modal.tsx` - Remove named export, keep default
2. `lib/data/products.ts` - Remove `filterByShippingZone`, keep `filterByZone`
3. `components/reviews-section-server.tsx` - Remove named export
4. `components/reviews-section-client.tsx` - Remove named export
5. `components/sell/ui/category-modal/index.tsx` - Remove named export

### 4.2 Remove Clearly Unused Exports

**Strategy:** Only remove exports that are DEFINITELY unused. Keep potentially useful utilities.

Remove from `components/ui/sidebar.tsx`:
- `SidebarMenuSkeleton`
- `SidebarRail` 
- All other unused sidebar exports if not planned for use

Remove from `components/ui/dropdown-menu.tsx`:
- `DropdownMenuShortcut`
- Other clearly unused exports

### 4.3 Mark Potentially Useful Exports

Add JSDoc comments to exports that might be useful:
```typescript
/**
 * @internal Currently unused but kept for future API expansion
 */
export function getDeliveryEstimate() { ... }
```

---

## 🔄 PHASE 5: FIX CIRCULAR DEPENDENCY (15 mins)

### 5.1 Break the Sales Page Cycle

**Current:**
```
page.tsx → sales-table.tsx → page.tsx
```

**Fix:** Move shared types to separate file

**Create:** `app/[locale]/(account)/account/sales/types.ts`

```typescript
// types.ts
export interface SalesItem {
  id: string
  // ... other fields
}

export interface SalesTableProps {
  items: SalesItem[]
  // ... other props
}
```

**Update:** Both `page.tsx` and `sales-table.tsx` to import from `types.ts`

---

## ✅ PHASE 6: VERIFICATION (30 mins)

### 6.1 Run Full Test Suite

```bash
# TypeScript check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build

# E2E tests
pnpm test:e2e

# Re-run audit tools
pnpm dlx knip
pnpm dlx depcheck
pnpm dlx madge --circular --extensions ts,tsx ./app ./components ./lib
```

### 6.2 Update Audit Reports

```bash
# Regenerate reports
pnpm dlx knip > audit-results/knip-report.txt 2>&1
pnpm dlx depcheck > audit-results/depcheck-report.txt 2>&1
```

---

## 📊 EXPECTED RESULTS

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Files | 667 | ~575 | -14% |
| Dependencies | 89 | 68 | -24% |
| Bundle Size | ~X MB | ~X-0.4 MB | -10-15% |
| Unused Exports | 206 | <50 | -75% |
| Code Duplicates | 50+ | <10 | -80% |
| Circular Deps | 1 | 0 | -100% |

---

## 🔐 SAFETY CHECKLIST

- [ ] Created git branch: `cleanup/codebase-audit-dec-2025`
- [ ] Backed up current state
- [ ] All tests passing before changes
- [ ] Changes committed in small, reversible chunks
- [ ] Each phase tested independently
- [ ] Final full test suite passed
- [ ] PR created for review

---

## 📝 POST-CLEANUP TASKS

1. **Update Documentation**
   - Remove references to deleted files
   - Update component documentation

2. **Configure CI**
   - Add knip to CI pipeline
   - Add bundle size limits
   - Add circular dependency check

3. **Team Communication**
   - Document removed features
   - Announce deprecated patterns
   - Share new utilities (seller-stats, category-utils, etc.)
