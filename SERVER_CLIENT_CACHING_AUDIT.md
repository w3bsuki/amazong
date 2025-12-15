# Next.js 16 Server/Client Components & Caching Audit

**Project:** AMZN Marketplace  
**Date:** December 15, 2025  
**Framework:** Next.js 16.x with App Router  
**Database:** Supabase with SSR  

---

## 📊 Executive Summary

| Category | Status | Grade | Notes |
|----------|--------|-------|-------|
| **Server/Client Split** | ⚠️ Needs Review | B+ | Good foundation, some over-clientization |
| **'use cache' Implementation** | ✅ Excellent | A | Properly implemented in data layer |
| **Supabase Caching** | ✅ Well Designed | A | Correct client separation |
| **Cache Invalidation** | ✅ Modern APIs | A | Using Next.js 16 `revalidateTag`/`updateTag` |
| **Client Component Usage** | ⚠️ Review Needed | B | ~52 client components, some may be unnecessary |

---

## 🔍 Detailed Findings

### 1. Server/Client Component Architecture

#### ✅ What's Working Well

**Data Layer (lib/data/\*)**
- All data fetching functions correctly use `'use cache'` directive
- `createStaticClient()` properly isolated for cacheable queries
- `cacheTag()` and `cacheLife()` correctly applied

```typescript
// CORRECT PATTERN (lib/data/products.ts)
export async function getProducts(type: QueryType, limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  'use cache'
  cacheTag('products', type)
  cacheLife('products')
  const supabase = createStaticClient()
  // ...
}
```

**Pages as Server Components**
- Most page.tsx files are proper async Server Components
- Data fetching happens at page level, passed down as props
- Homepage uses proper streaming with Suspense boundaries

**Server/Client Boundary**
- [app/[locale]/(main)/page.tsx](app/[locale]/(main)/page.tsx) - ✅ Server Component
- [app/[locale]/(main)/product/[...slug]/page.tsx](app/[locale]/(main)/product/[...slug]/page.tsx) - ✅ Server Component
- [app/[locale]/(main)/categories/[slug]/page.tsx](app/[locale]/(main)/categories/[slug]/page.tsx) - ✅ Server Component

#### ⚠️ Areas Needing Review

**Client Components Count: ~52 files with 'use client'**

| Type | Count | Assessment |
|------|-------|------------|
| UI Components (shadcn/ui) | ~25 | ✅ Required - use Radix primitives |
| Interactive Components | ~15 | ✅ Required - use state/effects |
| Potentially Over-clientized | ~12 | ⚠️ Review needed |

---

### 2. Client Component Audit

#### ✅ CORRECTLY Client Components (Required)

These components legitimately need `'use client'`:

| Component | Reason | Hooks Used |
|-----------|--------|------------|
| [components/ui/dialog.tsx](components/ui/dialog.tsx) | Radix primitives | Modal state |
| [components/ui/tabs.tsx](components/ui/tabs.tsx) | Radix primitives | Tab state |
| [components/ui/accordion.tsx](components/ui/accordion.tsx) | Radix primitives | Expand state |
| [components/add-to-cart.tsx](components/add-to-cart.tsx) | User interaction | `useCart()`, `onClick` |
| [components/wishlist-button.tsx](components/wishlist-button.tsx) | User interaction | `useState`, `onClick` |
| [components/theme-provider.tsx](components/theme-provider.tsx) | Context provider | `createContext` |
| [components/site-header.tsx](components/site-header.tsx) | Interactive navigation | `useState`, `useEffect` |
| [components/product-card.tsx](components/product-card.tsx) | Interactive (cart/wishlist) | `useCart()`, `onClick` |
| [components/error-boundary.tsx](components/error-boundary.tsx) | React error boundary | Required |

#### ⚠️ POTENTIALLY Over-Clientized Components

These should be audited for possible refactoring:

| Component | Current Reason | Potential Optimization |
|-----------|----------------|------------------------|
| [components/ui/table.tsx](components/ui/table.tsx) | `'use client'` | May not need interactivity - could be Server Component |
| [components/ui/scroll-area.tsx](components/ui/scroll-area.tsx) | Radix primitive | Consider native CSS `overflow-auto` for simple cases |
| [components/trending-products-section.tsx](components/trending-products-section.tsx) | Scroll buttons | Extract scroll logic to small client wrapper |
| [components/tabbed-product-section.tsx](components/tabbed-product-section.tsx) | Tab switching | Consider URL-based tabs (Server Component) |
| [components/sidebar-menu.tsx](components/sidebar-menu.tsx) | Heavy state | Many useState could be moved to URL params |

#### 📋 Refactoring Recommendations

**Priority 1: Table Component**
```typescript
// CURRENT (components/ui/table.tsx)
'use client'
// Just renders <table> elements - no interactivity

// RECOMMENDATION: Remove 'use client' directive
// Tables can be Server Components unless using:
// - Sortable columns (onClick)
// - Selectable rows (useState)
// - Expandable rows (useState)
```

**Priority 2: Section Components Pattern**
```typescript
// CURRENT PATTERN (over-clientized)
'use client'
export function TrendingSection({ products }) {
  const [scrollPos, setScrollPos] = useState(0)
  // ... scroll logic
  return <div>{products.map(p => <ProductCard key={p.id} {...p} />)}</div>
}

// RECOMMENDED PATTERN (minimal client)
// Server Component (renders products)
export function TrendingSection({ products }) {
  return (
    <ScrollContainer>  {/* Small client wrapper */}
      {products.map(p => <ProductCard key={p.id} {...p} />)}
    </ScrollContainer>
  )
}

// Client Component (only scroll logic)
'use client'
function ScrollContainer({ children }) {
  const ref = useRef()
  // scroll handlers only
  return <div ref={ref}>{children}</div>
}
```

---

### 3. Caching Strategy Analysis

#### ✅ Excellent: Next.js 16 Cache Configuration

```typescript
// next.config.ts - CORRECTLY CONFIGURED
const nextConfig: NextConfig = {
  cacheComponents: true,  // ✅ PPR enabled
  
  cacheLife: {
    categories: {
      stale: 300,       // 5 min stale
      revalidate: 3600, // 1 hour
      expire: 86400,    // 1 day
    },
    products: {
      stale: 60,        // 1 min
      revalidate: 300,  // 5 min
      expire: 3600,     // 1 hour
    },
    deals: {
      stale: 30,        // 30 sec
      revalidate: 120,  // 2 min
      expire: 600,      // 10 min
    },
    user: {
      stale: 30,
      revalidate: 60,
      expire: 300,
    },
  },
}
```

#### ✅ Excellent: Supabase Client Separation

```typescript
// lib/supabase/server.ts - CORRECTLY IMPLEMENTED

// Auth-dependent (CANNOT use 'use cache')
export async function createClient() {
  const cookieStore = await cookies()  // Dynamic!
  return createServerClient(...)
}

// Static (CAN use 'use cache')
export function createStaticClient() {
  return createSupabaseClient(...)  // No cookies
}

// Admin (bypasses RLS)
export function createAdminClient() {
  return createSupabaseClient(... SUPABASE_SERVICE_KEY)
}
```

#### ✅ Correct: Cache Tag Usage

| Data Function | Tags | Profile | Location |
|--------------|------|---------|----------|
| `getProducts()` | `products`, type | `products` | [lib/data/products.ts](lib/data/products.ts) |
| `getProductById()` | `products`, `product-${id}` | `products` | [lib/data/products.ts](lib/data/products.ts) |
| `getCategoryHierarchy()` | `categories`, hierarchy tag | `categories` | [lib/data/categories.ts](lib/data/categories.ts) |
| `getStoreByUsernameOrId()` | `stores`, `store-${id}` | `products` | [lib/data/store.ts](lib/data/store.ts) |
| `getPublicProfile()` | `profiles`, `profile-${id}` | N/A | [lib/data/profile-data.ts](lib/data/profile-data.ts) |

#### ✅ Correct: Cache Invalidation (Next.js 16 APIs)

```typescript
// app/actions/revalidate.ts - CORRECTLY IMPLEMENTED

// Stale-while-revalidate (background refresh)
export async function revalidateProducts() {
  revalidateTag('products', 'max')  // ✅ Correct API
}

// Immediate invalidation (read-your-own-writes)
export async function updateProduct(productId: string) {
  updateTag(`product-${productId}`)  // ✅ Correct API
  updateTag('products')
}
```

---

### 4. Dynamic Data Patterns

#### ⚠️ Issue: cookies() in Section Components

```typescript
// components/sections/trending-section.tsx
export async function TrendingSection() {
  const cookieStore = await cookies()  // ❌ Makes component dynamic
  const userZone = cookieStore.get('user-zone')?.value || 'WW'
  // ...
}
```

**Impact:** All section components using `cookies()` cannot be cached in the static shell.

**Recommendation:** 
```typescript
// OPTION 1: Pass zone from page level (already wrapped in Suspense)
export async function TrendingSection({ userZone }: { userZone: string }) {
  // No cookies() call here
}

// OPTION 2: Client-side zone filtering (products cached globally)
export async function TrendingSection() {
  'use cache'
  const allProducts = await getProducts('newest', 36)  // Cached!
  return <TrendingSectionClient products={allProducts} />  // Filter client-side
}
```

---

### 5. Missing Optimizations

#### 5.1 Request Memoization Not Used

React's `cache()` function isn't being used for database queries called multiple times per request.

```typescript
// CURRENT
export async function getProductById(id: string) {
  'use cache'  // Only caches across requests, not within
  // ...
}

// RECOMMENDED: Add React cache for same-request dedup
import { cache } from 'react'

export const getProductById = cache(async (id: string) => {
  'use cache'
  // ...
})
```

#### 5.2 Missing server-only Package

Some data files should use `server-only` to prevent accidental client imports:

```typescript
// RECOMMENDED: Add to lib/data/*.ts
import 'server-only'  // Fails build if imported in client component

export async function getProducts() {
  'use cache'
  // ...
}
```

#### 5.3 No Streaming for Heavy Pages

Some pages wait for all data before rendering:

```typescript
// CURRENT (some pages)
export default async function Page() {
  const data1 = await fetchData1()
  const data2 = await fetchData2()
  return <>{/* All at once */}</>
}

// RECOMMENDED: Stream independent sections
export default async function Page() {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <Section1 />  {/* Streams in */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Section2 />  {/* Streams in */}
      </Suspense>
    </>
  )
}
```

---

## 📈 Performance Metrics Targets

| Metric | Current (Est.) | Target | How to Achieve |
|--------|----------------|--------|----------------|
| **TTFB** | ~500ms | <200ms | More `'use cache'`, fewer `cookies()` |
| **FCP** | ~1.2s | <800ms | More streaming with Suspense |
| **Bundle Size** | ~150KB JS | <100KB JS | Move components to Server |
| **Cache Hit Rate** | ~70% | >90% | Better tag organization |

---

## 🎯 Action Plan

### Phase 1: Quick Wins (1-2 hours)

- [ ] **1.1** Add `import 'server-only'` to all `lib/data/*.ts` files
- [ ] **1.2** ✅ **CONFIRMED:** Remove `'use client'` from `components/ui/table.tsx` - **NO HOOKS/EVENTS USED**
- [ ] **1.3** ✅ **CONFIRMED:** `components/ui/badge.tsx` is already a Server Component (no directive)
- [ ] **1.4** ✅ **CONFIRMED:** `components/ui/card.tsx` is already a Server Component (no directive)

### Phase 2: Refactoring (4-6 hours)

- [ ] **2.1** Extract scroll logic from `trending-products-section.tsx` to minimal client wrapper
- [ ] **2.2** Extract scroll logic from `tabbed-product-section.tsx` to minimal client wrapper  
- [ ] **2.3** Consider URL-based tabs for `tabbed-product-section.tsx` (fully server-rendered)
- [ ] **2.4** Lift `cookies()` calls to page level, pass zone as prop to sections

### Phase 3: Advanced Optimizations (8+ hours)

- [ ] **3.1** Wrap React `cache()` around frequently-called data functions
- [ ] **3.2** Add more Suspense boundaries to category and search pages
- [ ] **3.3** Implement `'use cache: private'` for personalized recommendations
- [ ] **3.4** Consider edge runtime for hot paths (`export const runtime = 'edge'`)

### Phase 4: Monitoring

- [ ] **4.1** Add Vercel Analytics / Speed Insights
- [ ] **4.2** Monitor cache hit rates in production
- [ ] **4.3** Set up alerts for TTFB > 500ms

---

## 🔧 Component Migration Checklist

When reviewing a client component, ask:

1. **Does it use React hooks?** (`useState`, `useEffect`, `useContext`)
   - Yes → Likely needs `'use client'`
   - No → Can probably be Server Component

2. **Does it use browser APIs?** (`window`, `document`, `localStorage`)
   - Yes → Needs `'use client'`
   - No → Can be Server Component

3. **Does it have event handlers?** (`onClick`, `onChange`, `onSubmit`)
   - Yes → Needs `'use client'`
   - No → Can be Server Component

4. **Does it use Radix/headless UI primitives?**
   - Yes → Currently requires `'use client'` (Radix limitation)
   - Consider: Is there a simpler native HTML solution?

5. **Can interactivity be extracted to a small wrapper?**
   - Large component with small interactive parts → Extract wrapper
   - Entire component interactive → Keep as client

---

## 📚 Reference: Next.js 16 Best Practices

### Server Component (Default)
```typescript
// No directive needed - default in app/
export default async function Page() {
  const data = await fetchData()  // Server-side fetch
  return <div>{data.title}</div>
}
```

### Client Component (When Needed)
```typescript
'use client'  // Only when necessary

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Cached Data Function
```typescript
import { cacheTag, cacheLife } from 'next/cache'

export async function getData() {
  'use cache'
  cacheTag('my-data')
  cacheLife('products')  // Or custom profile
  
  return await db.query(...)
}
```

### Cache Invalidation
```typescript
'use server'
import { revalidateTag, updateTag } from 'next/cache'

// Background refresh (webhooks, admin)
export async function revalidateMyData() {
  revalidateTag('my-data', 'max')
}

// Immediate (user mutations)
export async function updateMyData() {
  updateTag('my-data')
}
```

### Streaming with Suspense
```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent />  {/* Streams when ready */}
    </Suspense>
  )
}
```

---

## ✅ Conclusion

**Overall Assessment: B+ / A-**

The project has a **solid foundation** with Next.js 16 caching best practices:

1. ✅ `'use cache'` directive properly used in data layer
2. ✅ Correct Supabase client separation (`createStaticClient` vs `createClient`)
3. ✅ Modern cache invalidation APIs (`revalidateTag`, `updateTag`)
4. ✅ Cache life profiles configured in `next.config.ts`
5. ✅ Pages are Server Components with data fetching

**Key improvements needed:**

1. ⚠️ Reduce unnecessary `'use client'` directives (~5-10 components)
2. ⚠️ Add `server-only` to data layer for safety
3. ⚠️ Lift `cookies()` calls higher to reduce dynamic scope
4. ⚠️ Add React `cache()` for request memoization

**No critical issues found.** The architecture follows Next.js 16 recommendations.
