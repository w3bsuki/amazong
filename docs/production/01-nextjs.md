# Phase 1: Next.js 16 Audit & Best Practices

> **Priority:** 🔴 Critical  
> **Estimated Time:** 4-8 hours  
> **Goal:** Ensure Next.js 16 best practices for performance, SEO, and reliability  
> **Tools:** `pnpm typecheck`, `pnpm build`, dev server + browser console/Network tab  
> **Documentation:** [Next.js Docs](https://nextjs.org/docs)

---

## 📋 Pre-Audit Checklist

- [ ] Commit current work (clean git state required for codemods)
- [ ] Run `pnpm build` - note any warnings/errors
- [ ] Run `pnpm typecheck` - should be zero errors
- [ ] Check Next.js version is 16+ (`pnpm list next`)

**Workflow rule:** Prefer existing **VS Code Tasks** and the Next.js dev overlay/terminal logs for diagnostics. Avoid running lots of ad-hoc commands unless there is no task that provides the same signal.

---

## ✅ Current Configuration Status

**Your project has excellent Next.js 16 configuration:**
- ✅ `cacheComponents: true` - Cache Components/PPR enabled
- ✅ Custom `cacheLife` profiles for categories, products, deals, user data
- ✅ Bundle analyzer configured
- ✅ next-intl plugin for i18n

---

## 🔍 Audit Categories

### 1. Server vs Client Components (RSC Best Practices)

**Goal:** Minimize client-side JavaScript bundle using Server Components by default

#### Best Practices (Next.js 16):
- **Default to Server Components** - Only add `"use client"` when you need state, effects, or browser APIs
- **Push Client Components Down** - Add `"use client"` to the smallest possible component
- **Interleaving Pattern** - Server Components can render Client Components via `children` prop
- **Use `server-only` package** - Prevent accidental import of server code in client bundles

#### Checks:
- [ ] All components default to Server Components unless they need interactivity
- [ ] `"use client"` directives are pushed as far down the component tree as possible
- [ ] No accidental client components (using hooks in what should be server components)
- [ ] Heavy dependencies (charts, animations) are lazy loaded
- [ ] Third-party components wrapped if they need `"use client"`
- [ ] Context providers are Client Components wrapping Server Component children

#### Common Patterns:

```tsx
// ❌ Bad: Entire component is client
"use client"
export function ProductPage({ product }) {
  // Product display doesn't need client
  return <div>...</div>
}

// ✅ Good: Only interactive part is client
export function ProductPage({ product }) {
  return (
    <div>
      <ProductInfo product={product} /> {/* Server */}
      <AddToCartButton productId={product.id} /> {/* Client */}
    </div>
  )
}

// ✅ Server Component rendering Client Component with children slot
// Server Component (layout.tsx)
import ClientModal from './modal'
import ServerCart from './cart'

export default function Layout() {
  return (
    <ClientModal>
      <ServerCart /> {/* Server Component as children */}
    </ClientModal>
  )
}

// ✅ Protecting server-only code
import 'server-only'
export async function getData() {
  const res = await fetch('...', {
    headers: { authorization: process.env.API_KEY }
  })
  return res.json()
}
```

#### Files to Audit:
- [ ] `app/[locale]/page.tsx` - Home page
- [ ] `app/[locale]/product/[slug]/page.tsx` - Product page
- [ ] `app/[locale]/search/page.tsx` - Search page
- [ ] `components/product/*` - Product components
- [ ] `components/mobile/*` - Mobile components
- [ ] `components/providers/*` - Context providers

---

### 2. Cache Components & `use cache` Directive (Next.js 16 Feature)

**Goal:** Leverage Cache Components for optimal static + dynamic rendering

#### Key Concepts (Next.js 16):
- **`cacheComponents: true`** ✅ Already enabled in your config
- **`'use cache'` directive** - Cache function/component output
- **`cacheLife()`** - Control cache duration (you have custom profiles!)
- **`cacheTag()` + `revalidateTag()`** - Tag-based cache invalidation
- **`updateTag()`** - Immediate cache refresh within same request

#### Cache Profiles Available (from next.config.ts):
| Profile | Stale | Revalidate | Expire |
|---------|-------|------------|--------|
| `categories` | 5 min | 1 hour | 1 day |
| `products` | 1 min | 5 min | 1 hour |
| `deals` | 30 sec | 2 min | 10 min |
| `user` | 30 sec | 1 min | 5 min |

#### Implementation Patterns:

```tsx
// ✅ Cache entire page
import { cacheLife, cacheTag } from 'next/cache'

export default async function ProductPage({ params }) {
  'use cache'
  cacheLife('products') // Use your custom profile!
  cacheTag(`product-${(await params).slug}`)
  
  const product = await getProduct((await params).slug)
  return <ProductDisplay product={product} />
}

// ✅ Cache at function level for reusability
export async function getCategories() {
  'use cache'
  cacheLife('categories')
  cacheTag('categories')
  return await db.query('SELECT * FROM categories')
}

// ✅ Cache invalidation in Server Actions
import { revalidateTag, updateTag } from 'next/cache'

export async function addToCart(productId: string) {
  'use server'
  await db.cart.add(productId)
  updateTag('cart') // Immediate refresh
}

export async function updateProduct(data: FormData) {
  'use server'
  await db.products.update(data)
  revalidateTag('products') // Background revalidation
}
```

#### Checks:
- [ ] Static content marked with `'use cache'` + appropriate `cacheLife`
- [ ] Dynamic content (runtime APIs) wrapped in `<Suspense>`
- [ ] Cache tags used for granular invalidation
- [ ] Server Actions use `updateTag`/`revalidateTag` appropriately
- [ ] No `export const dynamic = 'force-static'` - use `'use cache'` instead
- [ ] No `export const fetchCache` - handled by `'use cache'` scope

---

### 3. Data Fetching Best Practices (Next.js 16)

**Goal:** Efficient data fetching with proper caching and streaming

#### Key Changes in Next.js 15+:
- ⚠️ **`fetch()` is NOT cached by default** - must explicitly opt-in
- **Use `cache: 'force-cache'`** for static data
- **Use `'use cache'`** directive for component-level caching (preferred in 16)
- **Parallel fetching** with `Promise.all()` or component composition
- **Streaming** with `<Suspense>` boundaries

#### Patterns:

```tsx
// ✅ Cached fetch (opt-in)
const data = await fetch('https://...', { cache: 'force-cache' })

// ✅ Revalidating fetch
const data = await fetch('https://...', { next: { revalidate: 3600 } })

// ✅ Dynamic fetch (default behavior)
const data = await fetch('https://...') // No caching

// ✅ Parallel data fetching
async function Page({ params }) {
  const productData = getProduct(params.slug)
  const reviewsData = getReviews(params.slug)
  const [product, reviews] = await Promise.all([productData, reviewsData])
  return <ProductPage product={product} reviews={reviews} />
}

// ✅ Deduplicate with React.cache() for non-fetch data
import { cache } from 'react'
import 'server-only'

export const getProduct = cache(async (id: string) => {
  return await db.products.findUnique({ where: { id } })
})

// ✅ Preload pattern for conditional rendering
const preload = (id: string) => void getProduct(id)

export default async function Page({ params }) {
  preload(params.id) // Start loading early
  const isAvailable = await checkAvailability()
  if (!isAvailable) return null
  const product = await getProduct(params.id) // Already started!
  return <Product data={product} />
}
```

#### Checks:
- [ ] Data fetched in Server Components, not Client Components
- [ ] Route Handlers NOT called from Server Components (call DB directly)
- [ ] Parallel data fetching with `Promise.all()` where appropriate
- [ ] `React.cache()` used for memoizing DB/ORM queries
- [ ] Preload pattern used for conditional rendering

---

### 4. Async Request APIs (Next.js 15+ Breaking Change)

**Goal:** Properly handle async dynamic APIs

#### APIs Now Async:
- `cookies()` → `await cookies()`
- `headers()` → `await headers()`
- `draftMode()` → `await draftMode()`
- `params` → `await params`
- `searchParams` → `await searchParams`

#### Patterns:

```tsx
// ✅ Async params/searchParams handling
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { query } = await searchParams
  return <ProductList slug={slug} query={query} />
}

// ✅ Runtime data with Suspense
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  )
}

async function CartContent() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  const cart = await getCart(sessionId)
  return <Cart items={cart} />
}

// ✅ Suspense boundary for searchParams
export default async function Page({ searchParams }) {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList searchParamsPromise={searchParams} />
    </Suspense>
  )
}
```

#### Checks:
- [ ] All `cookies()`, `headers()` calls are awaited
- [ ] `params` and `searchParams` are awaited in page components
- [ ] Runtime data access wrapped in `<Suspense>`
- [ ] No blocking of entire page due to runtime API access

---

### 5. Routing, Navigation & Streaming

**Goal:** Optimal user experience with fast navigation and streaming

#### Best Practices:
- **Use `<Link>`** for all internal navigation (prefetching)
- **`loading.tsx`** for route-level loading states
- **`<Suspense>`** for granular streaming within pages
- **Error boundaries** for graceful error recovery
- **Partial Prerendering (PPR)** - automatic with `cacheComponents: true`

#### File Convention Audit:
```
app/
├── [locale]/
│   ├── layout.tsx         ✅ Root locale layout
│   ├── page.tsx           ✅ Home page
│   ├── loading.tsx        ❓ REQUIRED for streaming
│   ├── error.tsx          ❓ REQUIRED for error handling
│   ├── not-found.tsx      ❓ REQUIRED for 404s
│   └── product/
│       └── [slug]/
│           ├── page.tsx   ✅ Product page
│           ├── loading.tsx ❓ REQUIRED for streaming
│           └── error.tsx  ❓ REQUIRED for errors
├── global-error.tsx       ✅ Exists
└── global-not-found.tsx   ✅ Exists
```

#### Streaming Pattern:
```tsx
import { Suspense } from 'react'

export default function ProductPage({ params }) {
  return (
    <>
      {/* Static shell - immediately rendered */}
      <header><h1>Product Page</h1></header>
      
      {/* Dynamic content - streams when ready */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
      
      {/* Another stream for reviews */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews params={params} />
      </Suspense>
    </>
  )
}
```

#### Checks:
- [ ] All internal links use `<Link>` component (not `<a>`)
- [ ] `loading.tsx` exists in key route segments
- [ ] `error.tsx` exists in key route segments
- [ ] `not-found.tsx` for 404 handling
- [ ] `<Suspense>` used for parallel streaming within pages
- [ ] Skeleton components match final UI structure

---

### 6. Image Optimization

**Goal:** Optimized images with no layout shift

#### Best Practices:
- **Always use `<Image>`** from `next/image`
- **Specify dimensions** - `width` + `height` or `fill`
- **Use `sizes`** for responsive images
- **`priority`** on above-fold LCP images
- **`placeholder="blur"`** for smooth loading

```tsx
import Image from 'next/image'

// ✅ Fixed dimensions
<Image 
  src="/product.jpg" 
  width={400} 
  height={400}
  alt="Product image"
  sizes="(max-width: 768px) 100vw, 400px"
/>

// ✅ Fill container
<div className="relative h-64 w-full">
  <Image 
    src="/hero.jpg"
    fill
    alt="Hero"
    priority // LCP image
    className="object-cover"
    sizes="100vw"
  />
</div>
```

#### Search for Issues:
```bash
# Find raw img tags
grep -r "<img" --include="*.tsx" --include="*.jsx" app/ components/
```

#### Checks:
- [ ] All images use `<Image>` component
- [ ] All images have `width`/`height` or `fill`
- [ ] Proper `sizes` attribute for responsive images
- [ ] `priority` on above-fold images (LCP)
- [ ] No raw `<img>` tags

---

### 7. Metadata & SEO

**Goal:** Complete SEO setup for marketplace

#### Next.js 16 Metadata Best Practices:
- Use `generateMetadata` for dynamic pages
- Include Open Graph and Twitter cards
- `sitemap.ts` and `robots.txt` configured

```tsx
import type { Metadata } from 'next'

// Static metadata
export const metadata: Metadata = {
  title: 'Amazong - Bulgarian Marketplace',
  description: 'Best deals on electronics, fashion, and more',
  openGraph: {
    title: 'Amazong',
    description: 'Bulgarian Marketplace',
    images: ['/og-image.jpg'],
  },
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  }
}
```

#### Checks:
- [ ] `metadata` or `generateMetadata` in all pages
- [ ] Proper `title`, `description` for each page
- [ ] Open Graph images configured
- [ ] `app/sitemap.ts` ✅ Exists - verify working
- [ ] `app/robots.txt` ✅ Exists - verify content

---

### 8. Error Handling

**Goal:** Graceful error handling without crashes

#### Checks:
- [ ] `global-error.tsx` handles root errors ✅
- [ ] `error.tsx` in key route segments
- [ ] `not-found.tsx` for 404s
- [ ] Error boundaries recover gracefully with retry buttons
- [ ] Errors are logged appropriately

---

### 9. Build & Bundle Analysis

**Goal:** Identify large bundles and optimize

#### Commands:
```bash
# Build and analyze
pnpm build

# Bundle analyzer (configured in your next.config.ts)
pnpm analyze  # or ANALYZE=true pnpm build

# Check for large dependencies
```

#### Red Flags:
- First Load JS > 100KB per route
- Client bundles > 200KB
- Large node_modules in client bundle (check charts, animation libs)
- Duplicate dependencies

---

## 🧪 Runtime Diagnostics (No Special Tooling)

Use these when something “looks fine in code” but fails at runtime.

```bash
# Start the dev server (repo defaults to webpack)
pnpm dev

# Validate production build behavior
pnpm build
```

Checks to perform:
- Next.js dev overlay shows no runtime errors.
- Browser Console: no hydration warnings or uncaught errors.
- Network tab: no 4xx/5xx on critical routes.
- Repro in production mode: `pnpm build` + `pnpm start` for the failing route.

---

## 🛠️ MCP Tools (AI-Agent Workflow)

If you’re running the dev server locally, Next.js exposes an MCP surface that an AI agent (e.g. in VS Code) can call for high-signal diagnostics.

```bash
# Start dev server (MCP is enabled automatically in Next.js 16+)
pnpm dev
```

Then from your MCP client:

```
nextjs_index
```

Common calls:

```
nextjs_call({ port: "3000", toolName: "get_errors" })
nextjs_call({ port: "3000", toolName: "get_routes" })
nextjs_call({ port: "3000", toolName: "get_project_metadata" })
nextjs_call({ port: "3000", toolName: "get_logs" })
```

---

## 🔧 Common Refactoring Patterns

### Pattern 1: Convert Page to Use Cache Components
```tsx
// Before (Next.js 14 style)
export const revalidate = 3600

export default async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}

// After (Next.js 16 style)
import { cacheLife, cacheTag } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('categories') // Use your custom profile
  cacheTag('category-page')
  
  const data = await fetch('...')
  return <div>{data}</div>
}
```

### Pattern 2: Split Interactive Components
```tsx
// Before: Large client component
'use client'
export function ProductCard({ product }) {
  const [qty, setQty] = useState(1)
  return (
    <div>
      <Image src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <input value={qty} onChange={e => setQty(e.target.value)} />
      <AddToCartButton product={product} qty={qty} />
    </div>
  )
}

// After: Server component with client island
// ProductCard.tsx (Server Component)
export function ProductCard({ product }) {
  return (
    <div>
      <Image src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <ProductQuantitySelector product={product} /> {/* Client */}
    </div>
  )
}

// ProductQuantitySelector.tsx (Client Component)
'use client'
export function ProductQuantitySelector({ product }) {
  const [qty, setQty] = useState(1)
  return (
    <>
      <input value={qty} onChange={e => setQty(e.target.value)} />
      <AddToCartButton product={product} qty={qty} />
    </>
  )
}
```

### Pattern 3: Streaming with Suspense
```tsx
// Before: Sequential blocking
export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)
  const reviews = await getReviews(params.slug)
  const recommendations = await getRecommendations(params.slug)
  
  return (
    <div>
      <ProductDetails product={product} />
      <Reviews reviews={reviews} />
      <Recommendations items={recommendations} />
    </div>
  )
}

// After: Parallel streaming
import { Suspense } from 'react'

export default async function ProductPage({ params }) {
  const { slug } = await params
  
  return (
    <div>
      {/* Product details can cache */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails slug={slug} />
      </Suspense>
      
      {/* Reviews stream independently */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews slug={slug} />
      </Suspense>
      
      {/* Recommendations stream independently */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations slug={slug} />
      </Suspense>
    </div>
  )
}
```

### Pattern 4: Server Actions with Cache Invalidation
```tsx
// actions.ts
'use server'
import { cacheTag, updateTag, revalidateTag } from 'next/cache'

export async function addToCart(productId: string) {
  await db.cart.add(productId)
  updateTag('cart') // Immediate refresh in same request
}

export async function updateInventory(productId: string, qty: number) {
  await db.inventory.update(productId, qty)
  revalidateTag(`product-${productId}`) // Background revalidation
}
```

---

## ⚠️ Things to Look For During Refactor

### Anti-patterns to Fix:
1. **`"use client"` at top of page components** - Move down to interactive parts
2. **Fetching data in Client Components** - Move to Server Components
3. **Calling API routes from Server Components** - Call DB/service directly
4. **Missing Suspense boundaries** - Add for runtime data access
5. **Sync usage of `cookies()`/`headers()`** - Make async with await
6. **`export const dynamic = 'force-static'`** - Replace with `'use cache'`
7. **`export const fetchCache`** - Remove, handled by `'use cache'` scope
8. **Raw `<img>` tags** - Convert to `<Image>` from next/image
9. **`<a>` tags for internal links** - Convert to `<Link>`

### Next.js 16 Migration Checklist:
- [ ] Replace `revalidate` export with `cacheLife()` calls
- [ ] Replace `fetchCache` with `'use cache'` directive
- [ ] Add `await` to all `cookies()`, `headers()`, `params`, `searchParams`
- [ ] Wrap runtime data access in `<Suspense>`
- [ ] Add `cacheTag()` for granular invalidation
- [ ] Use `updateTag()` in Server Actions for immediate updates

---

## ✅ Phase 1 Completion Checklist

### Server/Client Architecture
- [ ] All components default to Server Components
- [ ] `"use client"` only on interactive leaves
- [ ] Third-party client libs wrapped properly
- [ ] Context providers are Client Components

### Caching & Data Fetching
- [ ] `'use cache'` + `cacheLife()` on cached pages/functions
- [ ] `cacheTag()` for cache invalidation
- [ ] Data fetched in Server Components
- [ ] Parallel fetching with `Promise.all()` or streaming

### Async APIs
- [ ] All `cookies()`, `headers()` are awaited
- [ ] `params` and `searchParams` are awaited
- [ ] Runtime data wrapped in `<Suspense>`

### Navigation & Streaming
- [ ] `loading.tsx` in key routes
- [ ] `error.tsx` in key routes
- [ ] `<Suspense>` for granular streaming
- [ ] All links use `<Link>` component

### Images & SEO
- [ ] All images use `<Image>` component
- [ ] `priority` on LCP images
- [ ] Metadata on all pages
- [ ] Sitemap and robots.txt working

### Build Quality
- [ ] `pnpm build` passes with no errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] First Load JS < 100KB per route
- [ ] No build warnings

---

## 📊 Metrics to Track

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| Build time | < 60s | ? | |
| First Load JS (home) | < 100KB | ? | Check build output |
| First Load JS (product) | < 100KB | ? | Check build output |
| Largest bundle | < 200KB | ? | Use bundle analyzer |
| Type errors | 0 | ? | `pnpm typecheck` |
| Build warnings | 0 | ? | `pnpm build` |
| LCP | < 2.5s | ? | Lighthouse |
| CLS | < 0.1 | ? | Lighthouse |

---

## 📚 Reference Documentation

- [Server & Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag)

---

## 🏁 Next Step

→ Proceed to [Phase 2: Supabase](./02-supabase.md)
