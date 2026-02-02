# Next.js 16 App Router Best Practices Audit Report

**Project:** Treido Marketplace  
**Audit Date:** February 2, 2026  
**Auditor:** Automated Code Audit  
**Status:** READ-ONLY (No changes made)

---

## Executive Summary

The Treido codebase demonstrates **strong adherence** to Next.js 16 App Router best practices overall. The team has implemented proper caching patterns with `'use cache'` + `cacheLife()` + `cacheTag()`, created clear separation between static and auth-dependent Supabase clients, and uses proper streaming with Suspense boundaries.

### Severity Counts

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 High | 2 | Issues causing ISR storms or breaking static generation |
| 🟠 Medium | 8 | Patterns that impact performance or scalability |
| 🟡 Low | 12 | Minor improvements or best practice refinements |
| ✅ Good | N/A | Notable positive patterns |

---

## 1. App Router Patterns

### ✅ Positive Findings

- **Route Groups:** Well-organized route groups `(main)`, `(account)`, `(auth)`, `(sell)`, `(checkout)`, `(admin)`, `(business)` provide clear separation of concerns
- **generateStaticParams:** Properly implemented on key routes including `[locale]` layout, `[username]/page.tsx`, `[productSlug]/page.tsx`
- **Promise-based Params:** Correctly using Next.js 16's `Promise<{}>` pattern for `params` and `searchParams`
- **Layout Organization:** Clear layout hierarchy with locale-level layout wrapping route groups

### Findings Table - App Router

| Path:Line | Severity | Description | Proposed Fix | Phase |
|-----------|----------|-------------|--------------|-------|
| [app/[locale]/(main)/search/page.tsx:28](app/[locale]/(main)/search/page.tsx#L28) | 🟠 Medium | Uses `cookies()` which forces dynamic rendering, negating potential static generation | Move cookie-dependent shipping filter to client-side, or use searchParams for shipping zone | 3 |
| [app/[locale]/(main)/todays-deals/page.tsx:33](app/[locale]/(main)/todays-deals/page.tsx#L33) | 🟠 Medium | Uses `cookies()` for shipping zone, forcing dynamic rendering on a page that could be static | Move shipping filter to client-side using SWR or React Query; cache base data server-side | 3 |
| [app/[locale]/(main)/categories/[slug]/page.tsx](app/[locale]/(main)/categories/[slug]/page.tsx) | 🟡 Low | Missing explicit `generateStaticParams` for category slugs (relies on dynamic fallback) | Add `generateStaticParams` fetching top N categories for build-time pre-rendering | 4 |
| [components/shared/product/product-grid-skeleton.tsx:1](components/shared/product/product-grid-skeleton.tsx#L1) | 🟡 Low | "use client" on skeleton component that has no client-side interactivity | Remove "use client" - Skeleton can be a Server Component | 4 |

---

## 2. RSC Boundaries

### ✅ Positive Findings

- **Hooks Directory:** All hooks properly marked as "use client"
- **Interactive Components:** Client directives appropriately placed on interactive components (filters, modals, forms)
- **Data Fetching:** Clear separation with `lib/data/` using cached server functions

### Findings Table - RSC Boundaries

| Path:Line | Severity | Description | Proposed Fix | Phase |
|-----------|----------|-------------|--------------|-------|
| [components/shared/product/seller-verification-badge.tsx:1](components/shared/product/seller-verification-badge.tsx#L1) | 🟡 Low | "use client" but appears to be a pure display component with no hooks | Audit for hooks/event handlers; remove directive if none found | 4 |
| [components/shared/product/product-card-price.tsx:1](components/shared/product/product-card-price.tsx#L1) | 🟡 Low | "use client" on price display component | Review if client directive is needed; consider Server Component | 4 |
| [components/shared/product/product-card-seller.tsx:1](components/shared/product/product-card-seller.tsx#L1) | 🟡 Low | "use client" on seller info component | Review if client directive is needed; may be server-renderable | 4 |
| [components/shared/product/hero-specs.tsx:9](components/shared/product/hero-specs.tsx#L9) | 🟡 Low | "use client" on line 9 (not line 1) - potentially wraps server code | Move directive to line 1 or refactor component structure | 4 |
| [components/ui/separator.tsx:1](components/ui/separator.tsx#L1) | 🟡 Low | "use client" on Radix Separator that may not need interactivity | Test if Radix component works without client directive | 4 |

---

## 3. Caching Issues

### ✅ Positive Findings

- **Excellent Cache Pattern:** `lib/data/` files consistently use `'use cache'` + `cacheTag()` + `cacheLife()` triad
- **Static Client Separation:** `createStaticClient()` properly avoids cookies for cached queries
- **Tag-based Invalidation:** Proper `revalidateTag(tag, "max")` usage in server actions
- **Cache Profiles:** Custom cache profiles defined in `next.config.ts` (categories, products, deals, user)

### Findings Table - Caching

| Path:Line | Severity | Description | Proposed Fix | Phase |
|-----------|----------|-------------|--------------|-------|
| [app/[locale]/(main)/search/page.tsx:89](app/[locale]/(main)/search/page.tsx#L89) | 🔴 High | `cookies()` call inside page component breaks ISR caching - every request hits the server | Refactor to pass shipping zone via searchParams or client-side context | 2 |
| [app/[locale]/(main)/todays-deals/page.tsx:40](app/[locale]/(main)/todays-deals/page.tsx#L40) | 🔴 High | `cookies()` in cached data path causes ISR write storm | Use client-side filtering for shipping zone, keep product fetch static | 2 |
| [app/[locale]/[username]/[productSlug]/page.tsx:42](app/[locale]/[username]/[productSlug]/page.tsx#L42) | 🟠 Medium | `new Date().toISOString()` used in page component for boost checking | Move Date() calls to client-side or use Vercel's Edge time | 3 |
| [app/[locale]/(main)/search/_lib/search-products.ts:35](app/[locale]/(main)/search/_lib/search-products.ts#L35) | 🟠 Medium | `new Date().toISOString()` in search function creates non-deterministic cache keys | Pass timestamp from client or use db-side NOW() comparisons | 3 |
| [lib/data/plans.ts](lib/data/plans.ts) | 🟡 Low | `getActivePlans()` missing `'use cache'` directive | Add `'use cache'`, `cacheTag('plans')`, `cacheLife('products')` | 4 |
| [lib/data/plans.ts](lib/data/plans.ts) | 🟡 Low | `getPlansForUpgrade()` uses `createClient()` (cookies) but could be static | Use `createStaticClient()` and add cache directives | 4 |
| [app/api/products/search/route.ts](app/api/products/search/route.ts) | 🟡 Low | API route returns data without explicit cache headers in all cases | Ensure consistent cache control headers across all response paths | 4 |

---

## 4. Performance Anti-patterns

### ✅ Positive Findings

- **No `select('*')`:** Search across codebase shows no wide queries in hot paths - all use explicit field projections
- **Suspense Boundaries:** Proper streaming patterns with `<Suspense>` in layouts and pages
- **Parallel Fetching:** Pages use `Promise.all()` for concurrent data fetching
- **Planned Counts:** Category search uses `count: "planned"` for faster pagination

### Findings Table - Performance

| Path:Line | Severity | Description | Proposed Fix | Phase |
|-----------|----------|-------------|--------------|-------|
| [components/desktop/desktop-home.tsx:196](components/desktop/desktop-home.tsx#L196) | 🟠 Medium | Client-side `fetch()` for product feed - waterfall after initial render | Consider using Server Components with streaming, or use SWR with prefetch | 3 |
| [components/mobile/mobile-home.tsx:165](components/mobile/mobile-home.tsx#L165) | 🟠 Medium | Client-side `fetch()` for lazy-loaded category children | Add SWR for caching or preload via props where possible | 3 |
| [app/[locale]/(main)/categories/[slug]/page.tsx](app/[locale]/(main)/categories/[slug]/page.tsx) | 🟡 Low | Multiple sequential `use()` calls for category context - consider coalescing | Bundle related data fetches into single cached function | 4 |
| [components/shared/seller/boost-dialog.tsx:83](components/shared/seller/boost-dialog.tsx#L83) | 🟡 Low | Double fetch pattern (GET then POST) for boost checkout flow | Consider single mutation action or optimistic UI | 4 |

---

## 5. Next.js 16 Specific

### ✅ Positive Findings

- **Promise Params:** All route components correctly use `Promise<{ locale: string }>` pattern
- **Cache Components:** Enabled in next.config.ts with proper cache profiles
- **Route Handler Client:** `createRouteHandlerClient(request)` properly implemented
- **server-only Guards:** Data fetcher files import `'server-only'` to prevent client bundling

### Findings Table - Next.js 16

| Path:Line | Severity | Description | Proposed Fix | Phase |
|-----------|----------|-------------|--------------|-------|
| [app/auth/confirm/route.ts](app/auth/confirm/route.ts) | 🟠 Medium | Route handler uses `createClient()` instead of `createRouteHandlerClient(request)` | Switch to request-based client for proper cookie propagation | 3 |
| [lib/stripe-locale.ts:104](lib/stripe-locale.ts#L104) | 🟡 Low | References `headers()` async call - ensure not used in cached contexts | Verify usage context; pass locale as parameter where possible | 4 |

---

## Risk Assessment

### High Risk Areas

1. **ISR Storms from cookies():** The search and deals pages call `cookies()` which prevents static caching. This means every user request hits the origin server, potentially causing:
   - Higher Vercel function invocations (cost)
   - Slower TTFB for users
   - Database connection pressure

2. **Non-deterministic Cache Keys:** Using `new Date()` in server functions creates cache fragmentation where each request generates new cache entries instead of reusing existing ones.

### Mitigation Priority

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| P1 | Remove cookies() from search/deals pages | High | Medium |
| P2 | Move Date() calls to client or use DB time | High | Low |
| P3 | Add generateStaticParams to category routes | Medium | Low |
| P4 | Audit unnecessary "use client" directives | Low | Medium |

---

## Recommendations by Phase

### Phase 2 (Immediate)
- [ ] Refactor `/search` page to use searchParams for shipping zone instead of cookies
- [ ] Refactor `/todays-deals` to be static with client-side shipping filtering
- [ ] Remove `new Date()` calls from cached server functions

### Phase 3 (Short-term)
- [ ] Review auth routes for `createRouteHandlerClient` usage
- [ ] Add SWR caching layer for client-side data fetching
- [ ] Consolidate multiple `use()` calls in category pages

### Phase 4 (Backlog)
- [ ] Audit all "use client" directives for necessity
- [ ] Add cache headers to all API routes consistently
- [ ] Add generateStaticParams for high-traffic category slugs
- [ ] Consider adding `getPlansForUpgrade()` to cached data layer

---

## Notable Good Practices

The codebase demonstrates several exemplary patterns worth preserving:

1. **Supabase Client Strategy:**
   ```typescript
   createStaticClient()  // For 'use cache' functions - no cookies
   createClient()        // For auth-dependent queries
   createAdminClient()   // For bypassing RLS (verified auth only)
   ```

2. **Cache Triad Pattern:**
   ```typescript
   'use cache'
   cacheTag('products:list')
   cacheLife('products')
   ```

3. **Documentation:** Comments in cached functions explain WHY patterns are used (e.g., "NO new Date() here - would cause ISR write storm")

4. **Structured Logging:** `logEvent()` for debugging without polluting production logs

---

## Appendix: Files Audited

### Data Layer (lib/data/)
- ✅ products.ts - Excellent caching patterns
- ✅ categories.ts - Proper cache tags with hierarchy
- ✅ profile-page.ts - Good parallel query pattern
- ✅ product-page.ts - Entity-specific cache tags
- ⚠️ plans.ts - Missing cache directives

### API Routes (app/api/)
- ✅ categories/route.ts - Properly cached with 'use cache'
- ✅ products/search/route.ts - Uses static client
- ⚠️ auth routes - Need createRouteHandlerClient review

### Pages (app/[locale]/)
- ✅ (main)/page.tsx - Good streaming with Suspense
- ⚠️ (main)/search/page.tsx - cookies() issue
- ⚠️ (main)/todays-deals/page.tsx - cookies() issue
- ✅ [username]/page.tsx - Proper generateStaticParams
- ✅ [username]/[productSlug]/page.tsx - Proper generateStaticParams

---

*Report generated automatically. Manual review recommended for all findings.*
