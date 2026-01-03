# 🚀 PRODUCTION CLEANUP STRATEGY - FINAL PUSH

> **Date:** January 3, 2026  
> **Goal:** Production-ready codebase in 3 focused sprints  
> **Philosophy:** Layer-by-layer, not folder-by-folder

---

## 📊 CURRENT STATE ASSESSMENT

### ✅ What's Already Good
| Area | Status | Notes |
|------|--------|-------|
| TypeScript | ✅ CLEAN | 0 errors, strict mode |
| Unit Tests | ✅ PASSING | 106/106 tests |
| Knip (dead code) | ✅ MINIMAL | Cleaned in Sprint 1 |
| Branding | ✅ COMPLETE | Treido everywhere |
| Currency | ✅ COMPLETE | EUR consistently |
| Build | ✅ WORKING | Next.js 16.0.7 builds successfully |

### 🔴 What Needs Fixing (Prioritized)
| Issue | Count | Impact | Sprint |
|-------|-------|--------|--------|
| Console.logs in production code | ~20+ | Log pollution, PII risk | 1 |
| Dead routes (empty catch-all, duplicate products) | 3 | Build waste, confusion | 1 |
| Deprecated/duplicate API endpoints | 2 | API inconsistency | 1 |
| Unexported server actions (dead code) | 15+ functions | Bloat | 1 |
| Unused component files | 4 | Bundle size | 1 |
| `revalidateTag` wrong syntax | ~5 | Cache invalidation broken | 1 |
| Coming Soon placeholders | 7 pages | SEO, user confusion | 2 |
| Missing Suspense boundaries | High impact pages | TTFB | 2 |
| Code duplicates (drawer components) | ~400 lines | Maintainability | 3 |
| Inconsistent error response format | Many files | DX | 3 |

---

## 🎯 THE STRATEGY: LAYER-BY-LAYER (NOT FOLDER-BY-FOLDER)

### Why Layer-by-Layer is Better

**❌ Folder-by-folder approach problems:**
- Can't deploy incrementally (half-fixed folder is broken)
- No visible progress until entire folder is done
- Hard to test changes in isolation
- Team members can't work in parallel

**✅ Layer-by-layer benefits:**
- Each layer can be deployed independently
- Progress is measurable after each layer
- Easy to test and rollback
- Multiple people can work on different layers

### The Layers (In Execution Order)

```
┌─────────────────────────────────────────────────┐
│ LAYER 1: CRITICAL CLEANUP (2-3 hours)           │
│ • Console.logs removal                          │
│ • Dead route deletion                           │
│ • revalidateTag syntax fix                      │
│ • Knip unused files deletion                    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ LAYER 2: API CONSISTENCY (2-3 hours)            │
│ • Deprecate/remove duplicate endpoints          │
│ • Export dead server action functions           │
│ • Add proper logging utility                    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ LAYER 3: ROUTE OPTIMIZATION (3-4 hours)         │
│ • Add noindex to Coming Soon pages              │
│ • Redirect duplicate seller dashboards          │
│ • Add Suspense boundaries                       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ LAYER 4: CODE QUALITY (4-6 hours)               │
│ • Consolidate duplicate components              │
│ • Create requireAuth() helper                   │
│ • Standardize error responses                   │
└─────────────────────────────────────────────────┘
```

---

## 🔥 SPRINT 1: CRITICAL CLEANUP (4-6 hours total)

**Goal:** Remove everything that could cause production issues.  
**Deployable:** YES - each task is atomic.

### Task 1.1: Remove Console.logs in Webhooks (30 min)
**Files:**
- [app/api/checkout/webhook/route.ts](app/api/checkout/webhook/route.ts) - 9 console statements
- [app/api/subscriptions/webhook/route.ts](app/api/subscriptions/webhook/route.ts) - 7 console statements

**Action:** Replace with proper logging or remove entirely.

```typescript
// Option A: Remove entirely (simplest)
// Option B: Use your existing lib/logger.ts

// Before:
console.log('Processing checkout.session.completed:', session.id);

// After (if keeping):
import { logger } from '@/lib/logger';
logger.info('Processing checkout.session.completed', { sessionId: session.id });
```

### Task 1.2: Delete Dead Routes (15 min)
**Files to DELETE:**
```
app/[locale]/[...notFound]/           # Empty folder - does nothing
app/[locale]/(main)/product/[id]/     # Just calls notFound()
app/[locale]/(main)/product/[...slug]/ # Just calls notFound()
```

### Task 1.3: Fix revalidateTag Syntax (15 min)
**Search for:** `revalidateTag(.*,.*)`

The second argument is invalid. Fix:
```typescript
// Before:
revalidateTag("blocked-users", "max")

// After:
revalidateTag("blocked-users")
```

### Task 1.4: Delete Knip-identified Unused Files (15 min)
```bash
# Delete these files:
components/category/attribute-quick-filters.tsx
components/category/mobile-category-tabs.tsx
components/shared/product/product-attribute-badge.tsx
app/[locale]/(main)/categories/_lib/categories-data.ts
```

### Task 1.5: Remove/Export Unused Functions (1 hour)
**Files with unexported functions:**

| File | Dead Functions | Action |
|------|----------------|--------|
| `app/actions/blocked-users.ts` | `unblockUser`, `getBlockedUsers`, `isUserBlocked` | Export or delete |
| `app/actions/buyer-feedback.ts` | 6 functions | Export or delete |
| `app/actions/orders.ts` | `getBuyerOrders`, `getBuyerOrderDetails` | Export or delete |
| `app/actions/reviews.ts` | 4 functions | Export or delete |
| `app/actions/username.ts` | 3 functions | Export or delete |

**Decision Framework:**
- If function is called anywhere → Export it
- If function is never called → Delete it
- If function WILL be needed soon → Export with `// TODO: Connect to UI`

### Task 1.6: Run Verification
```bash
pnpm knip          # Should show fewer issues
pnpm typecheck     # Must pass
pnpm test:unit     # Must pass
pnpm build         # Must succeed
```

---

## 🔧 SPRINT 2: API & SERVER ACTION CONSISTENCY (4-6 hours)

**Goal:** Clean, predictable API layer.  
**Deployable:** YES after full sprint.

### Task 2.1: Deprecate `/api/stores` Properly (30 min)
**File:** `app/api/stores/route.ts`

Either:
- A) Add deprecation warning in response header
- B) Redirect to new endpoint
- C) Remove if nothing uses it

### Task 2.2: Consolidate Product Creation Endpoints (1 hour)
**Current:**
- `app/api/products/route.ts` - POST creates product
- `app/api/products/create/route.ts` - POST also creates product

**Action:** Keep one, redirect/remove the other.

### Task 2.3: Create Shared Auth Helper (1 hour)
**Problem:** Every server action repeats auth check boilerplate.

**Create:** `lib/auth/require-auth.ts`
```typescript
import { createClient } from "@/lib/supabase/server";

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("Not authenticated");
  }
  
  return { supabase, user };
}
```

**Usage:**
```typescript
// Before (repeated everywhere):
const supabase = await createClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) {
  return { success: false, error: "Not authenticated" }
}

// After:
const { supabase, user } = await requireAuth();
```

### Task 2.4: Standardize Server Action Returns (2 hours)
**Problem:** Inconsistent error responses.

**Standard format:**
```typescript
type ActionResult<T = void> = 
  | { success: true; data?: T }
  | { success: false; error: string };
```

**Files to update:** All files in `app/actions/`

### Task 2.5: Replace Console.logs with Logger (1 hour)
**Files with remaining console statements:**
- `app/[locale]/(sell)/sell/_lib/categories.ts`
- `app/[locale]/(checkout)/_actions/checkout.ts`
- `app/api/products/create/route.ts`
- `app/api/categories/route.ts`

---

## 🎨 SPRINT 3: ROUTE & UX OPTIMIZATION (6-8 hours)

**Goal:** Polished routes, better performance.  
**Deployable:** YES incrementally.

### Task 3.1: Handle Coming Soon Pages (1 hour)
**Files:** 7 placeholder pages

**Options:**
1. Add `noindex` meta tag (keep pages, hide from search)
2. Create single `/coming-soon/[feature]` route
3. Remove from navigation until ready

**Recommendation:** Option 1 - Add noindex, keep pages.

```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};
```

### Task 3.2: Redirect Duplicate Seller Dashboard (30 min)
**Current:**
- `(main)/seller/dashboard/` - Old dashboard
- `(business)/dashboard/` - New Shopify-style dashboard

**Action:** Redirect old → new
```typescript
// app/[locale]/(main)/seller/dashboard/page.tsx
import { redirect } from 'next/navigation';
export default function OldDashboard() {
  redirect('/dashboard');
}
```

### Task 3.3: Add Suspense Boundaries (3-4 hours)
**High-priority pages:**
- Product detail page
- Category pages
- Search results
- Account orders

**Pattern:**
```tsx
import { Suspense } from 'react';
import { ProductSkeleton } from '@/components/skeletons';

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent />
    </Suspense>
  );
}
```

### Task 3.4: Review & Delete Empty Discount Page (30 min)
**File:** `app/[locale]/(business)/dashboard/discounts/page.tsx`

This page has placeholder function that returns empty data. Either:
- Implement properly
- Remove from navigation until ready
- Add "Coming Soon" banner

---

## 📁 SPRINT 4: CODE DEDUPLICATION (6-8 hours)

**Goal:** Reduce maintenance burden.  
**Deployable:** YES - test each consolidation.

### Task 4.1: Consolidate Drawer Components (2-3 hours)
**Files:**
- `app/[locale]/(sell)/_components/ui/drawer-select.tsx`
- `app/[locale]/(sell)/_components/ui/multi-select-drawer.tsx`
- `app/[locale]/(sell)/_components/ui/select-drawer.tsx`

**Action:** Create single `GenericDrawerSelect` with `multiple?: boolean` prop.

### Task 4.2: Consolidate Category Icons (30 min)
**File:** `lib/category-icons.tsx`

`megaMenuIconMap` and `subheaderIconMap` are 95% identical.

**Action:** Single map with size parameter.

### Task 4.3: Consolidate Pricing Components (1-2 hours)
**Files:**
- `app/[locale]/(sell)/_components/fields/pricing-field.tsx`
- `app/[locale]/(sell)/_components/ui/price-suggestion.tsx`
- `app/[locale]/(sell)/_components/ui/quantity-stepper.tsx`

`pricing-field.tsx` re-implements these internally. Just import them.

### Task 4.4: DRY Up Smart Category Picker (2-3 hours)
**File:** `app/[locale]/(sell)/_components/ui/smart-category-picker.tsx`

Extract repeated JSX patterns into sub-components.

---

## ✅ VERIFICATION CHECKLIST

After each sprint, run:
```bash
# Must all pass:
pnpm knip          # Dead code check
pnpm typecheck     # TypeScript
pnpm test:unit     # Unit tests
pnpm build         # Full build
pnpm lint          # ESLint
```

---

## 📊 EXPECTED OUTCOMES

| Metric | Before | After Sprint 1 | After Sprint 4 |
|--------|--------|----------------|----------------|
| Unused files (knip) | 4 | 0 | 0 |
| Console.logs in prod | ~20+ | 0 | 0 |
| Dead routes | 3 | 0 | 0 |
| API endpoints | 45 | 43 | 43 |
| Server action exports | ~30 | ~45 (or fewer) | ~45 |
| Code duplicates | ~290 | ~290 | ~50 |
| Build time | X | X-10% | X-15% |

---

## 🚫 WHAT WE'RE NOT DOING

1. ❌ Rewriting working features
2. ❌ Changing database schema
3. ❌ Major architecture changes
4. ❌ Adding new features during cleanup
5. ❌ Updating dependencies during cleanup
6. ❌ Touching working tests

---

## 📅 RECOMMENDED TIMELINE

| Sprint | Duration | Can Deploy After? |
|--------|----------|-------------------|
| Sprint 1: Critical Cleanup | 4-6 hours | ✅ YES |
| Sprint 2: API Consistency | 4-6 hours | ✅ YES |
| Sprint 3: Route Optimization | 6-8 hours | ✅ YES |
| Sprint 4: Code Deduplication | 6-8 hours | ✅ YES |
| **Total** | **20-28 hours** | |

---

## 🏁 START HERE

**Immediate next steps:**

```bash
# 1. Create cleanup branch
git checkout -b cleanup/production-readiness

# 2. Start with Sprint 1, Task 1.1
# Remove console.logs from webhooks

# 3. After each task:
pnpm typecheck && pnpm test:unit

# 4. Commit after each task (atomic commits)
git commit -m "cleanup: remove console.logs from checkout webhook"
```

---

## 🔗 RELATED DOCS

- [APP_FOLDER_AUDIT.md](audits/APP_FOLDER_AUDIT.md) - Detailed route analysis
- [CODEBASE_AUDIT_MASTER_PLAN.md](CODEBASE_AUDIT_MASTER_PLAN.md) - Dead code analysis
- [MASTER_FIX_PLAN.md](MASTER_FIX_PLAN.md) - UX/branding fixes (mostly complete)

---

**Remember:** The goal is production readiness, not perfection. Ship clean, iterate later.

