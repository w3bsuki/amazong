# NEXT.JS 16 BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "next.js"
2. mcp_context7_get-library-docs → topics: "caching", "Server Components", "Server Actions"
3. mcp_next-devtools_init → Initialize Next.js MCP context
4. mcp_next-devtools_nextjs_docs → action: "search", query: "cacheLife cacheTag cacheComponents"
5. mcp_next-devtools_nextjs_docs → action: "search", query: "Server Actions vs API routes"
```

---

## AUDIT SCOPE

### 1. CACHING (NEXT.JS 16 SPECIFIC)
**Files to check:**
- `next.config.ts` - verify `cacheComponents` experimental flag
- All files using `cacheLife`, `cacheTag`
- API routes for proper cache headers

**Questions:**
- [ ] Is `cacheComponents` enabled and used correctly?
- [ ] Are `cacheLife` profiles defined properly?
- [ ] Is `cacheTag` used for granular invalidation?
- [ ] Are we using `unstable_cache` (deprecated) vs new patterns?
- [ ] Is `revalidatePath` / `revalidateTag` used correctly in mutations?

**Search for cache usage:**
```typescript
grep_search: "cacheLife|cacheTag|revalidatePath|revalidateTag|unstable_cache"
```

### 2. SERVER vs CLIENT COMPONENTS
**Check for:**
- [ ] Are large components correctly split (server wrapper + client interactive)?
- [ ] Is `"use client"` only where necessary?
- [ ] Are we passing serializable props from Server to Client?
- [ ] Is `server-only` import used for server-exclusive code?
- [ ] Is `client-only` import used for browser-exclusive code?

**Anti-patterns:**
- [ ] Entire pages marked `"use client"` unnecessarily
- [ ] Importing server-only code in client components
- [ ] Fetching data in client components when server would work
- [ ] Using `useEffect` for data that could be server-fetched

**Search:**
```typescript
grep_search: '"use client"'
grep_search: "import.*server-only|import.*client-only"
```

### 3. SERVER ACTIONS vs API ROUTES
**When to use Server Actions:**
- Form submissions
- Mutations with `revalidatePath`/`revalidateTag`
- Simple CRUD operations

**When to use API Routes:**
- Webhooks
- External API integrations
- Complex request/response handling
- Rate limiting requirements

**Check:**
- [ ] Are we using API routes where Server Actions would be simpler?
- [ ] Are Server Actions properly typed?
- [ ] Is `"use server"` at top of action files?
- [ ] Are actions in `app/actions/` or colocated?

**Files to audit:**
- `app/api/**/*.ts` - should these be Server Actions?
- `app/actions/**/*.ts` - are these properly structured?

### 4. DATA FETCHING PATTERNS
**Good patterns:**
- [ ] Fetching in Server Components directly
- [ ] Using `Promise.all` for parallel fetches
- [ ] Streaming with `<Suspense>` boundaries
- [ ] Using `loading.tsx` for route-level loading

**Anti-patterns:**
- [ ] Fetching in Client Components with `useEffect`
- [ ] Waterfall fetches (sequential when parallel possible)
- [ ] Missing error boundaries
- [ ] Not using `error.tsx` for route errors

### 5. ROUTING & LAYOUTS
**Check:**
- [ ] Is `layout.tsx` used for shared UI?
- [ ] Are dynamic routes `[param]` properly typed?
- [ ] Is `generateStaticParams` used for static generation?
- [ ] Are parallel routes `@slot` used appropriately?
- [ ] Is `middleware.ts` lean and fast?

### 6. METADATA & SEO
**Check:**
- [ ] Is `generateMetadata` used for dynamic pages?
- [ ] Is static `metadata` export used for static pages?
- [ ] Are Open Graph images configured?
- [ ] Is `robots.ts` and `sitemap.ts` present?

---

## SPECIFIC FILES TO AUDIT

```
next.config.ts          - experimental flags, caching config
middleware.ts           - should be minimal
app/layout.tsx          - root layout patterns
app/[locale]/layout.tsx - i18n patterns
app/api/**/route.ts     - should these be Server Actions?
lib/supabase/server.ts  - server client for RSC
```

---

## PERFORMANCE CHECKS

### Use Next.js DevTools MCP:
```
mcp_next-devtools_nextjs_index → Discover running servers
mcp_next-devtools_nextjs_call → Check for:
  - Build errors
  - Hydration mismatches
  - Bundle size issues
```

### Check bundle:
```bash
pnpm build
pnpm analyze  # if @next/bundle-analyzer configured
```

---

## DELIVERABLES

1. **WRONG**: Patterns violating Next.js 16 docs
2. **OUTDATED**: Next.js 14/15 patterns that should be updated
3. **MISSING**: Caching, error boundaries, loading states
4. **OVER-ENGINEERED**: Complex solutions where Next.js has built-in
5. **FIXES**: Specific code changes needed

---

## QUICK REFERENCE - NEXT.JS 16 CHANGES

```typescript
// NEW: Cache Components (Next.js 16)
// next.config.ts
experimental: {
  cacheComponents: true
}

// NEW: cacheLife for fine-grained caching
import { cacheLife } from 'next/cache'
cacheLife('hours')  // predefined profile

// NEW: cacheTag for invalidation
import { cacheTag } from 'next/cache'
cacheTag('products')

// Invalidate
import { revalidateTag } from 'next/cache'
revalidateTag('products')
```
