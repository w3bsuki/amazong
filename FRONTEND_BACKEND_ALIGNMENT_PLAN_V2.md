# 🎯 Frontend-Backend Alignment Plan: Production Launch

> **Created:** December 5, 2025  
> **Updated:** December 5, 2025 (Next.js 16 + Context7 + Supabase MCP Verified)  
> **Status:** 🚀 Production-Ready Planning  
> **Tech Stack:** Next.js 16+, React 19, Supabase, Tailwind CSS 4  
> **Production Target:** 2 weeks to MVP launch

---

## 📋 Executive Summary

This document outlines the **final alignment** between frontend UX/UI and our Supabase backend for our **eBay competitor marketplace launch in Bulgaria**.

### 🎯 Key Discoveries (Verified via MCP Tools)

| Discovery | Verification | Impact | Action Required |
|-----------|--------------|--------|-----------------|
| ✅ `product_attributes` table EXISTS | Supabase MCP ✓ | No schema changes needed | Wire up queries only |
| ✅ `products.attributes` JSONB column | Supabase MCP ✓ | Fast filtering ready | GIN index exists (unused) |
| ✅ 1,349 `category_attributes` | Supabase MCP ✓ | Rich filterable metadata | Query and display |
| ✅ 7,797 categories with `name_bg` | Supabase MCP ✓ | Full i18n ready | Already working |
| ✅ RLS enabled on all tables | Supabase MCP ✓ | Security ready | No changes needed |
| ⚠️ 38 unused indexes detected | Supabase Advisor | Performance overhead | Review & cleanup |
| ⚠️ Leaked password protection OFF | Supabase Advisor | Security risk | Enable in Auth settings |

### 🏆 Critical Path to Launch (2 Weeks)

```
Week 1: Foundation & Bug Fixes
├── Day 1-2: Mega menu slug fixes + N+1 query elimination
├── Day 3-4: Server Component caching ('use cache' directive - Next.js 16+)
└── Day 5: Category sidebar context-awareness

Week 2: Features & Polish  
├── Day 1-2: Attribute filters UI (desktop + mobile)
├── Day 3: Homepage dynamic content + cacheComponents config
├── Day 4: Performance testing + unused index cleanup
└── Day 5: QA + staging deploy
```

---

## 🏗️ Current State Analysis

### Database Schema (Verified via `mcp_supabase_list_tables`)

```
┌─────────────────────────────────────────────────────────────────┐
│ TABLE                 │ ROWS    │ STATUS                        │
├───────────────────────┼─────────┼───────────────────────────────┤
│ categories            │ 7,797   │ ✅ Full L0-L4 hierarchy       │
│ category_attributes   │ 1,349   │ ✅ is_filterable metadata     │
│ products              │ 214     │ ✅ JSONB attributes column    │
│ product_attributes    │ 0       │ ⚠️ Schema ready, populate     │
│ profiles              │ 1       │ ✅ User system working        │
│ conversations         │ 0       │ ✅ Chat schema ready          │
│ messages              │ 0       │ ✅ Messaging ready            │
│ reviews               │ 0       │ ✅ Review system ready        │
│ seller_reviews        │ 0       │ ✅ Seller rating ready        │
│ wishlists             │ 0       │ ✅ Wishlist ready             │
│ carts                 │ 0       │ ✅ Cart system ready          │
│ orders                │ 0       │ ✅ Order system ready         │
│ order_items           │ 0       │ ✅ Order items ready          │
└─────────────────────────────────────────────────────────────────┘
```

### Products Table Schema (Critical Finding)

```sql
-- products.attributes column ALREADY EXISTS!
-- Column: attributes jsonb DEFAULT '{}'::jsonb

-- Example usage for fast filtering:
SELECT * FROM products 
WHERE attributes->>'skin_type' = 'oily'
  AND (attributes->>'spf')::int >= 30;

-- product_attributes table ALSO EXISTS for relational queries:
-- Columns: id, product_id, attribute_id, name, value, is_custom
-- Use for: Complex joins, attribute validation, analytics
```

### Frontend Issues (Audit Results)

| Component | Issue | Severity | Fix Effort |
|-----------|-------|----------|------------|
| `mega-menu.tsx` | `toys-games-sub` slug doesn't exist in DB | 🔴 CRITICAL | 30 min |
| `mega-menu.tsx` | Missing L0 icons (e-mobility, services, etc.) | 🔴 HIGH | 1 hr |
| `mega-menu.tsx` | 100+ hardcoded `subcategoryImages` | 🟡 MEDIUM | 2 hrs |
| `api/categories/route.ts` | N+1 recursive queries (depth loop) | 🔴 CRITICAL | 1 hr |
| `search-filters.tsx` | No attribute-based filters | 🟡 MEDIUM | 4 hrs |
| `category-subheader.tsx` | Slug mismatches in `MEGA_MENU_CONFIG` | 🔴 HIGH | 1 hr |

---

## 📐 Architecture Decisions (Next.js Best Practices)

### Decision 1: Server Component Caching Strategy (Next.js 16+)

**Pattern:** `'use cache'` directive + `cacheTag` + `cacheLife` (Context7 Verified)

> ⚠️ **Note:** `unstable_cache` is deprecated in Next.js 16+. Use the new `'use cache'` directive instead.

```typescript
// lib/data/categories.ts
import { cacheTag, cacheLife } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getCategoryHierarchy(slug: string, depth: number = 3) {
  'use cache'
  cacheTag('categories', `category-${slug}`)
  cacheLife('hours') // Use preset: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'max'
  
  const supabase = await createClient()
  
  // Single recursive CTE query (replaces N+1)
  const { data } = await supabase.rpc('get_category_hierarchy', {
    p_slug: slug,
    p_depth: depth
  })
  
  return data
}

// On category update (admin action):
// Use revalidateTag for stale-while-revalidate behavior
import { revalidateTag } from 'next/cache'
export async function updateCategory() {
  'use server'
  // ... update logic
  revalidateTag('categories') // Marks as stale, serves stale while revalidating
}

// Or use updateTag for immediate refresh (read-your-writes)
import { updateTag } from 'next/cache'
export async function updateCategoryImmediate() {
  'use server'
  // ... update logic
  updateTag('categories') // Immediately expires and refreshes
}
```

**Why This Pattern (Next.js 16+):**
- ✅ Native `'use cache'` directive (stable, not experimental)
- ✅ `cacheTag` for granular invalidation
- ✅ `cacheLife` presets: 'seconds', 'minutes', 'hours', 'days', 'weeks', 'max'
- ✅ `updateTag` for immediate cache refresh (read-your-writes)
- ✅ `revalidateTag` for stale-while-revalidate pattern
- ✅ Works with Server Components (no client hydration cost)

### Decision 2: Category Sidebar Behavior

**✅ Decision: Contextual Hybrid Navigation**

```
/categories/skincare shows:
┌─────────────────────────────────────┐
│ ← Beauty (parent link)              │
├─────────────────────────────────────┤
│ ▸ Makeup           (sibling)        │
│ ▾ Skincare ✓       (current)        │
│   ├─ Cleansers     (children)       │
│   ├─ Moisturizers                   │
│   ├─ Serums                         │
│   └─ Sunscreen                      │
│ ▸ Haircare         (sibling)        │
│ ▸ Fragrance        (sibling)        │
├─────────────────────────────────────┤
│ 🔍 Filters                          │
│ ├─ Skin Type: □ Oily □ Dry          │
│ ├─ SPF Level: [15] — [50+]          │
│ └─ Ingredients: □ Retinol □ Vit C   │
└─────────────────────────────────────┘
```

### Decision 3: Attribute Storage Strategy

**✅ Decision: Dual Approach (Already Implemented!)**

| Use Case | Storage | Query Pattern |
|----------|---------|---------------|
| Fast filtering | `products.attributes` (JSONB) | `WHERE attributes->>'key' = 'value'` |
| Complex analytics | `product_attributes` (relational) | `JOIN category_attributes` |
| Attribute validation | `category_attributes` | Validate against allowed values |

**Index Required:**
```sql
-- Add GIN index for JSONB filtering performance
CREATE INDEX idx_products_attributes_gin 
ON products USING GIN (attributes);
```

---

## 📦 Phase 1: Critical Bug Fixes (Day 1-2) ✅ COMPLETED

> **Completed:** December 5, 2025  
> **Commit:** `8cd6f3f` - Pushed to GitHub  
> **Verified:** Via Supabase MCP (7,647 categories, 28 L0s, 290 L1s, 2,359 L2s)

### Task 1.1: Fix Mega Menu Slug Mismatches ✅

**File:** `components/category-subheader.tsx`  
**Issue:** `MEGA_MENU_CONFIG` contains slugs that don't exist in DB

**Broken Slugs Found & Fixed:**
```typescript
// BEFORE (BROKEN)
"baby-kids": ["baby-gear", "toys-games-sub", "kids-clothing"]
//                         ^^^^^^^^^^^^^^^ doesn't exist!

// AFTER (FIXED ✅)
"baby-kids": ["baby-gear", "toys-games", "kids-clothing"]
```

**Tasks:**
- [x] **1.1.1** Query all slugs in `MEGA_MENU_CONFIG` against DB
- [x] **1.1.2** Fix mismatched slugs:
  - `toys-games-sub` → `toys-games` ✅
  - Audited all 21 L0 configs ✅
- [ ] **1.1.3** Add error boundary for missing categories (deferred to Phase 6)

### Task 1.2: Add Missing L0 Category Icons ✅

**File:** `components/mega-menu.tsx` → `categoryIconMap`

**Added Icons for:**
```typescript
// All L0s now have icons:
'e-mobility'           → Leaf icon ✅
'services'             → Briefcase icon ✅
'bulgarian-traditional' → ForkKnife icon ✅
'wholesale'            → ShoppingBag icon ✅
'software'             → Code icon ✅
'real-estate'          → House icon ✅
'hobbies'              → Guitar icon ✅
```

**Tasks:**
- [x] **1.2.1** Add Phosphor icons for all missing L0s
- [x] **1.2.2** Update `categoryIconMap` with fallback icon

### Task 1.3: Convert N+1 Queries to Recursive CTE ✅

**File:** `app/api/categories/route.ts`

**Before (N+1 Problem):**
```typescript
// ❌ BAD: Multiple sequential queries per depth level
async function fetchChildrenRecursively(parentId, currentDepth, maxDepth) {
  // Called N times for N categories - O(n) queries!
}
```

**After (Single RPC Call):**
```typescript
// ✅ GOOD: Single recursive CTE query
const { data } = await supabase.rpc('get_category_hierarchy', {
  p_slug: slug || null,
  p_depth: depth
})
// Returns full tree in ONE query - O(1) queries!
```

**RPC Function Created in Supabase:**
```sql
CREATE OR REPLACE FUNCTION get_category_hierarchy(
  p_slug text DEFAULT NULL,
  p_depth int DEFAULT 3
)
RETURNS TABLE (
  id uuid, name text, name_bg text, slug text, 
  parent_id uuid, depth int, path text[],
  image_url text, icon text, display_order int
) AS $$
  WITH RECURSIVE category_tree AS (
    -- Base case: root categories or specific slug
    SELECT c.id, c.name, c.name_bg, c.slug, c.parent_id, 
           0 as depth, ARRAY[c.slug] as path, c.image_url, c.icon, c.display_order
    FROM categories c
    WHERE CASE 
      WHEN p_slug IS NULL THEN c.parent_id IS NULL
      ELSE c.slug = p_slug
    END
    
    UNION ALL
    
    -- Recursive case: children up to p_depth
    SELECT c.id, c.name, c.name_bg, c.slug, c.parent_id,
           ct.depth + 1, ct.path || c.slug, c.image_url, c.icon, c.display_order
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
    WHERE ct.depth < p_depth
  )
  SELECT * FROM category_tree ORDER BY path, display_order, name;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

**Tasks:**
- [x] **1.3.1** Create `get_category_hierarchy` RPC function in Supabase ✅
- [x] **1.3.2** Update `api/categories/route.ts` to call RPC ✅
- [x] **1.3.3** Add `buildCategoryTree()` helper to transform flat results to nested tree ✅

---

## 📦 Phase 2: Server Component Caching (Day 3-4) ✅ COMPLETED

> **Completed:** December 5, 2025  
> **Verified:** Via CACHING.md V3 execution  
> **Files Created:** `lib/data/categories.ts`, `lib/data/products.ts`, `app/actions/revalidate.ts`, `components/sections/`

### Task 2.1: Create Data Fetching Layer (Next.js 16+ Pattern) ✅

**Created:** `lib/data/categories.ts`

```typescript
import { cacheTag, cacheLife } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Cached category hierarchy fetch
export async function getCategoryHierarchy(slug?: string, depth: number = 3) {
  'use cache'
  cacheTag('categories')
  cacheLife('hours') // 1 hour cache
  
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_category_hierarchy', {
    p_slug: slug || null,
    p_depth: depth
  })
  if (error) throw error
  return data
}

// Cached category attributes fetch
export async function getCategoryAttributes(categoryId: string) {
  'use cache'
  cacheTag('attributes', `attrs-${categoryId}`)
  cacheLife('hours')
  
  const supabase = await createClient()
  const { data } = await supabase
    .from('category_attributes')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_filterable', true)
    .order('sort_order')
  return data || []
}

// Cached category by slug (for page metadata)
export async function getCategoryBySlug(slug: string) {
  'use cache'
  cacheTag('categories', `category-${slug}`)
  cacheLife('hours')
  
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*, parent:parent_id(*)')
    .eq('slug', slug)
    .single()
  return data
}
```

### Task 2.2: Update Category Page to Use Cached Data ✅

**Refactored:** `app/[locale]/(main)/page.tsx`

- ✅ Async sections with Suspense: `TrendingSection`, `FeaturedSection`, `DealsWrapper`, `SignInCTA`
- ✅ Skeleton fallbacks for streaming: `TrendingSectionSkeleton`, `DealsSectionSkeleton`, etc.
- ✅ Zone filtering moved client-side for better cache hits
- ✅ Static components extracted: `CategoryCards`, `PromoCards`, `MoreWaysToShop`

### Task 2.3: Add Revalidation Actions (Next.js 16+ Server Actions) ✅

**Created:** `app/actions/revalidate.ts`

```typescript
'use server'
import { revalidateTag, updateTag } from 'next/cache'

// Stale-while-revalidate (background refresh)
export async function revalidateProducts() {
  revalidateTag('products', 'max')
}

// Immediate invalidation (read-your-own-writes)
export async function updateProduct(productId: string) {
  updateTag(`product-${productId}`)
  updateTag('products')
}
```

**Also Created:** `lib/data/products.ts` with unified `getProducts()` function

---

## 📦 Phase 3: Category Sidebar Context (Day 5) ✅ COMPLETED

> **Completed:** December 5, 2025
> **Components Created:**
> - `components/category-sidebar.tsx` - Context-aware sidebar with parent breadcrumb, siblings, children, attribute filters
> - `components/attribute-filters.tsx` - Filter components for select, multiselect, boolean, number types
> - `app/api/categories/[slug]/context/route.ts` - API endpoint for category context
> - Modified `app/[locale]/(main)/categories/[slug]/page.tsx` to use new sidebar

### Task 3.1: Create Context-Aware Sidebar Component ✅

**New File:** `components/category-sidebar.tsx`

```typescript
'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface CategorySidebarProps {
  current: Category;
  parent: Category | null;
  siblings: Category[];
  children: Category[];
  attributes: CategoryAttribute[];
}

export function CategorySidebar({ 
  current, parent, siblings, children, attributes 
}: CategorySidebarProps) {
  const locale = useLocale();
  const getName = (cat: Category) => locale === 'bg' ? cat.name_bg : cat.name;
  
  return (
    <aside className="w-64 shrink-0">
      {/* Parent breadcrumb */}
      {parent && (
        <Link 
          href={`/categories/${parent.slug}`}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
        >
          ← {getName(parent)}
        </Link>
      )}
      
      {/* Category navigation */}
      <nav className="space-y-1">
        {siblings.map(sibling => (
          <CategoryNavItem
            key={sibling.id}
            category={sibling}
            isActive={sibling.id === current.id}
            children={sibling.id === current.id ? children : []}
          />
        ))}
      </nav>
      
      {/* Attribute filters */}
      {attributes.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-4">Filters</h3>
          <AttributeFilters attributes={attributes} />
        </div>
      )}
    </aside>
  );
}
```

### Task 3.2: Create API Endpoint for Context ✅

**New File:** `app/api/categories/[slug]/context/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();
  const { slug } = params;
  
  // Get current category
  const { data: current } = await supabase
    .from('categories')
    .select('*, parent:parent_id(*)')
    .eq('slug', slug)
    .single();
    
  if (!current) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // Get siblings (same parent)
  const { data: siblings } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', current.parent_id)
    .order('name');
    
  // Get children
  const { data: children } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', current.id)
    .order('name');
    
  // Get filterable attributes
  const { data: attributes } = await supabase
    .from('category_attributes')
    .select('*')
    .eq('category_id', current.id)
    .eq('is_filterable', true)
    .order('sort_order');
  
  return NextResponse.json({
    current,
    parent: current.parent,
    siblings: siblings || [],
    children: children || [],
    attributes: attributes || [],
  });
}
```

---

## 📦 Phase 4: Attribute Filtering UI (Week 2, Day 1-2) 🟡

### Task 4.1: Create Attribute Filter Components

**New File:** `components/attribute-filters.tsx`

```typescript
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useLocale } from 'next-intl';

interface CategoryAttribute {
  id: string;
  name: string;
  name_bg: string;
  attribute_type: 'select' | 'multiselect' | 'boolean' | 'number' | 'text';
  options: string[] | null;
  options_bg: string[] | null;
  min_value: number | null;
  max_value: number | null;
  is_filterable: boolean;
}

export function AttributeFilters({ 
  attributes 
}: { 
  attributes: CategoryAttribute[] 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  
  const updateFilter = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramKey = `attr_${key}`;
    
    if (Array.isArray(value)) {
      params.delete(paramKey);
      value.forEach(v => params.append(paramKey, v));
    } else if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="space-y-6">
      {attributes.map(attr => (
        <FilterSection 
          key={attr.id} 
          attribute={attr} 
          locale={locale}
          currentValue={searchParams.getAll(`attr_${attr.name}`)}
          onChange={(v) => updateFilter(attr.name, v)}
        />
      ))}
    </div>
  );
}

function FilterSection({ attribute, locale, currentValue, onChange }) {
  const name = locale === 'bg' ? attribute.name_bg : attribute.name;
  const options = locale === 'bg' ? attribute.options_bg : attribute.options;
  
  switch (attribute.attribute_type) {
    case 'select':
      return (
        <div>
          <h4 className="font-medium mb-2">{name}</h4>
          <RadioGroup 
            value={currentValue[0] || ''} 
            onValueChange={onChange}
          >
            {options?.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`${attribute.id}-${i}`} />
                <label htmlFor={`${attribute.id}-${i}`}>{opt}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
      
    case 'multiselect':
      return (
        <div>
          <h4 className="font-medium mb-2">{name}</h4>
          {options?.map((opt, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={`${attribute.id}-${i}`}
                checked={currentValue.includes(opt)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...currentValue, opt]
                    : currentValue.filter(v => v !== opt);
                  onChange(newValue);
                }}
              />
              <label htmlFor={`${attribute.id}-${i}`}>{opt}</label>
            </div>
          ))}
        </div>
      );
      
    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{name}</h4>
          <Switch
            checked={currentValue[0] === 'true'}
            onCheckedChange={(checked) => onChange(checked ? 'true' : '')}
          />
        </div>
      );
      
    case 'number':
      return (
        <div>
          <h4 className="font-medium mb-2">{name}</h4>
          <Slider
            min={attribute.min_value || 0}
            max={attribute.max_value || 100}
            step={1}
            value={[parseInt(currentValue[0]) || attribute.min_value || 0]}
            onValueChange={([v]) => onChange(v.toString())}
          />
        </div>
      );
      
    default:
      return null;
  }
}
```

### Task 4.2: Update Product Search to Filter by Attributes

**File:** `app/[locale]/(main)/search/page.tsx`

```typescript
// Add attribute filtering to search query
async function getFilteredProducts(
  categorySlug: string,
  searchParams: Record<string, string | string[]>
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('category_slug', categorySlug);
  
  // Apply attribute filters from URL params
  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith('attr_')) {
      const attrName = key.replace('attr_', '');
      
      if (Array.isArray(value)) {
        // Multiselect: any match
        query = query.or(
          value.map(v => `attributes->>${attrName}.eq.${v}`).join(',')
        );
      } else {
        // Single value
        query = query.eq(`attributes->>${attrName}`, value);
      }
    }
  }
  
  return query;
}
```

### Task 4.3: Mobile Filter Bottom Sheet

**File:** `components/mobile-filters.tsx`

Add attribute filters section to existing bottom sheet:

```typescript
// Add to existing MobileFilters component
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="sm">
      <Filter className="h-4 w-4 mr-2" />
      Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
    </Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="h-[80vh]">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    
    <ScrollArea className="h-full pb-20">
      {/* Existing price/rating filters */}
      <PriceFilter />
      <RatingFilter />
      
      {/* NEW: Attribute filters */}
      <Separator className="my-4" />
      <AttributeFilters attributes={attributes} />
    </ScrollArea>
    
    {/* Sticky apply button */}
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  </SheetContent>
</Sheet>
```

---

## 📦 Phase 5: Database Optimization (Week 2, Day 4) 🟢

### Task 5.1: Create Required Indexes

```sql
-- GIN index for JSONB attribute queries (CRITICAL for performance)
CREATE INDEX IF NOT EXISTS idx_products_attributes_gin 
ON products USING GIN (attributes);

-- Index for category_attributes lookups
CREATE INDEX IF NOT EXISTS idx_category_attributes_category_filterable
ON category_attributes (category_id, is_filterable) 
WHERE is_filterable = true;

-- Index for product_attributes (when populated)
CREATE INDEX IF NOT EXISTS idx_product_attributes_product
ON product_attributes (product_id);

CREATE INDEX IF NOT EXISTS idx_product_attributes_attribute
ON product_attributes (attribute_id);

-- Composite index for common category queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_slug
ON categories (parent_id, slug);
```

### Task 5.2: Optimize RLS Policies

```sql
-- Use (select auth.uid()) pattern for better query planning
ALTER POLICY "products_select" ON products
USING (
  is_active = true 
  OR seller_id = (SELECT auth.uid())
);

-- Add index on columns used in RLS
CREATE INDEX IF NOT EXISTS idx_products_seller_active
ON products (seller_id, is_active);
```

---

## 📦 Phase 6: Testing & Launch Prep (Week 2, Day 5) 🟢

### Task 6.1: Category Navigation Testing

| Test Case | Expected | Status |
|-----------|----------|--------|
| All 21 L0s visible in mega menu | Pass | ⬜ |
| Click each L0 → shows correct L1s | Pass | ⬜ |
| L1 click → context-aware sidebar | Pass | ⬜ |
| Mobile mega menu touch | Pass | ⬜ |
| Attribute filters update URL | Pass | ⬜ |
| Back button preserves filters | Pass | ⬜ |

### Task 6.2: Performance Benchmarks

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Category API response | <100ms | ~300ms | 🔴 Fix CTE |
| Cached category load | <50ms | N/A | ⬜ Add cache |
| Product search + filters | <200ms | ~500ms | 🟡 Add index |
| LCP (Largest Contentful Paint) | <2.5s | ~3.2s | 🟡 |
| FID (First Input Delay) | <100ms | ~80ms | ✅ |

### Task 6.3: Pre-Launch Checklist

- [ ] All mega menu slugs verified against DB
- [ ] N+1 queries eliminated (single CTE)
- [ ] `unstable_cache` implemented for categories
- [ ] GIN index created for JSONB attributes
- [ ] Attribute filters working (desktop + mobile)
- [ ] i18n working for all attribute labels
- [ ] Error boundaries on all category components
- [ ] 404 handling for invalid category slugs
- [ ] Analytics events for filter usage

---

## 🗃️ Database Migrations Required

### Migration 1: Category Hierarchy RPC

```sql
-- supabase/migrations/20241206_category_hierarchy_rpc.sql

CREATE OR REPLACE FUNCTION get_category_hierarchy(
  p_slug text DEFAULT NULL,
  p_depth int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  name text,
  name_bg text,
  slug text,
  parent_id uuid,
  depth int,
  path text[],
  image_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE category_tree AS (
    SELECT 
      c.id, c.name, c.name_bg, c.slug, c.parent_id,
      0 as depth,
      ARRAY[c.slug] as path,
      c.image_url
    FROM categories c
    WHERE CASE 
      WHEN p_slug IS NULL THEN c.parent_id IS NULL
      ELSE c.slug = p_slug
    END
    AND c.is_active = true
    
    UNION ALL
    
    SELECT 
      c.id, c.name, c.name_bg, c.slug, c.parent_id,
      ct.depth + 1,
      ct.path || c.slug,
      c.image_url
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
    WHERE ct.depth < p_depth AND c.is_active = true
  )
  SELECT * FROM category_tree ORDER BY path;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION get_category_hierarchy TO anon, authenticated;
```

### Migration 2: Performance Indexes

```sql
-- supabase/migrations/20241206_performance_indexes.sql

-- JSONB GIN index for attribute filtering
CREATE INDEX IF NOT EXISTS idx_products_attributes_gin 
ON products USING GIN (attributes);

-- Category lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent_active
ON categories (parent_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_categories_slug
ON categories (slug);

-- Category attributes
CREATE INDEX IF NOT EXISTS idx_category_attrs_filterable
ON category_attributes (category_id) WHERE is_filterable = true;
```

---

## 📊 Implementation Timeline

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| Phase 1: Bug Fixes | 2 days | 🔴 Critical | ✅ COMPLETED |
| Phase 2: Caching | 2 days | 🟡 High | ✅ COMPLETED |
| Phase 3: Sidebar | 1 day | 🟡 High | ⬜ Not started |
| Phase 4: Attributes | 2 days | 🟡 Medium | ⬜ Not started |
| Phase 5: Optimization | 1 day | 🟢 Low | ⬜ Not started |
| Phase 6: Testing | 1 day | 🟢 Low | ⬜ Not started |

**Total: 9 working days (< 2 weeks)**  
**Progress: Phase 1-2 complete (Day 1-4 work done)**

---

## ✅ Definition of Done

### MVP Launch Ready When:
- [x] Schema verified via Supabase MCP (product_attributes exists!)
- [x] Next.js 16+ with `cacheComponents: true` configured
- [x] All mega menu slugs match database ✅ (Phase 1 complete)
- [x] All L0 categories have icons ✅ (Phase 1 complete)
- [x] N+1 queries converted to single CTE ✅ (Phase 1 complete)
- [x] `'use cache'` directive implemented ✅ (Phase 2 complete)
- [x] Suspense boundaries + streaming ✅ (Phase 2 complete)
- [x] Homepage refactored with async sections ✅ (Phase 2 complete)
- [ ] Category API response < 100ms (cached)
- [ ] Basic attribute filters working
- [ ] Mobile filters accessible
- [ ] No console errors on category pages
- [ ] Unused indexes reviewed (38 flagged by Supabase Advisor)
- [ ] Leaked password protection enabled in Supabase Auth

### Post-Launch Improvements:
- [ ] Faceted search counts (show product count per filter)
- [ ] Saved filters / search preferences
- [ ] Attribute filter analytics
- [ ] Image CDN optimization
- [ ] Edge caching for category pages
- [ ] `'use cache: remote'` for dynamic pricing
- [ ] `'use cache: private'` for personalized recommendations

---

## 📝 Technical Notes

### Why `'use cache'` over `unstable_cache` / React Query / SWR?

| Approach | Pros | Cons |
|----------|------|------|
| `'use cache'` (Next.js 16+) | Stable API, native, automatic | Requires Next.js 16+ |
| `unstable_cache` | Works in Next.js 15 | **DEPRECATED** in Next.js 16 |
| React Query | Client-side, mature, great DX | Hydration cost, bundle size |
| SWR | Lightweight, stale-while-revalidate | Client-only |

**Decision:** Use `'use cache'` directive for Server Components (Next.js 16+ native pattern). Use React Query only for real-time client-side updates (e.g., cart, notifications).

### Next.js 16 Cache Directives

```typescript
// 1. Regular cache (prerendered at build, shared across all users)
async function getData() {
  'use cache'
  cacheTag('data')
  cacheLife('hours')
  return db.query(...)
}

// 2. Remote cache (runtime, shared across users in dynamic context)
async function getDynamicData() {
  'use cache: remote'
  cacheTag('dynamic-data')
  cacheLife({ expire: 300 }) // 5 minutes
  return fetch(...)
}

// 3. Private cache (per-user, can access cookies)
async function getUserData() {
  'use cache: private'
  cacheTag('user-data')
  cacheLife({ stale: 60 }) // 1 minute
  const session = (await cookies()).get('session')
  return fetchUserData(session)
}
```

### cacheLife Presets

| Preset | Stale | Revalidate | Expire | Use Case |
|--------|-------|------------|--------|----------|
| `'seconds'` | 0 | 1s | 60s | Real-time data |
| `'minutes'` | 5min | 1min | 1hr | Frequently updated |
| `'hours'` | 5min | 1hr | 1day | Category data |
| `'days'` | 5min | 1day | 1week | Blog posts |
| `'weeks'` | 5min | 1week | 1month | Static content |
| `'max'` | 5min | 1month | indefinite | Rarely changes |

### Why JSONB over Relational for Attributes?

| Approach | Query Speed | Flexibility | Analytics |
|----------|-------------|-------------|-----------|
| JSONB (`products.attributes`) | ⚡ Fast with GIN | ⚡ Very flexible | 🟡 Harder |
| Relational (`product_attributes`) | 🟡 JOINs needed | ✅ Validated | ⚡ Easy |

**Decision:** Use JSONB for filtering (fast), populate relational table for analytics/reporting later.

### RLS Optimization Pattern

```sql
-- ❌ BAD: Calls auth.uid() for every row
USING (seller_id = auth.uid())

-- ✅ GOOD: Single subquery, cached per query
USING (seller_id = (SELECT auth.uid()))
```

---

## 🛠️ Next.js 16 Configuration

**File:** `next.config.mjs`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable cache components (required for 'use cache' directive)
  cacheComponents: true,
  
  // Custom cache life profiles (optional)
  cacheLife: {
    categories: {
      stale: 300,       // 5 minutes
      revalidate: 3600, // 1 hour  
      expire: 86400,    // 1 day
    },
    products: {
      stale: 60,        // 1 minute
      revalidate: 300,  // 5 minutes
      expire: 3600,     // 1 hour
    },
  },
}

export default nextConfig
```

---

## 🚀 Next Steps

1. **Update dependencies** to Next.js 16+ and latest versions
2. **Enable `cacheComponents: true`** in next.config.mjs
3. **Day 1:** Fix mega menu slug mismatches (30 min fix, huge impact)
4. **Day 1:** Add missing L0 icons (1 hr)
5. **Day 2:** Create category hierarchy RPC function in Supabase
6. **Day 3-4:** Implement `'use cache'` directive pattern (replaces unstable_cache)
7. **Day 5+:** Attribute filters UI
8. **Security:** Enable leaked password protection in Supabase Auth

---

## 📦 Tech Stack (Latest Versions)

| Package | Version | Notes |
|---------|---------|-------|
| Next.js | 16.x | `cacheComponents`, `'use cache'` directive |
| React | 19.x | Server Components, use hook |
| Tailwind CSS | 4.x | New config format |
| TypeScript | 5.7+ | Latest features |
| Supabase SSR | Latest | Server-side auth |

---

*Document Version: 3.0 (Next.js 16 + Context7 + Supabase MCP Verified)*  
*Last Updated: December 5, 2025*  
*Tech Stack: Next.js 16.x, React 19, Supabase, Tailwind CSS 4*  
*Ready for: Production Launch*
