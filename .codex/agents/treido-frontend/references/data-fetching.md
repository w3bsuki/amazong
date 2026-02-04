# data-fetching.md — Treido Data Patterns

> `'use cache'` directive for data functions, `cacheTag` for invalidation, `cacheLife` for TTL profiles.

## Treido Pattern: `lib/data/` Functions

All data fetching in Treido uses the `'use cache'` directive pattern:

```tsx
// lib/data/products.ts
import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

export async function getProducts(type: QueryType, limit = 36): Promise<Product[]> {
  'use cache'
  cacheTag('products:list', `products:type:${type}`)
  cacheLife(type === 'deals' ? 'deals' : 'products')
  
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_LIST_SELECT)
    .limit(limit)
  
  return data ?? []
}
```

## The `'use cache'` Directive

Next.js 16 stable caching API (replaces `unstable_cache`):

```tsx
export async function getData() {
  'use cache'                              // Enable caching
  cacheTag('my-data')                      // Tag for invalidation
  cacheLife('products')                    // TTL profile from next.config.ts
  
  // Your async logic here
  const result = await fetchFromDB()
  return result
}
```

**Rules:**
- `'use cache'` must be first statement in function body
- `cacheTag()` and `cacheLife()` must immediately follow
- Function must be `async`
- Works in Server Components and route handlers

## Cache Profiles (Treido)

Defined in `next.config.ts`:

| Profile | Stale | Revalidate | Expire | Use Case |
|---------|-------|------------|--------|----------|
| `categories` | 5m | 1h | 1d | Category tree, rarely changes |
| `products` | 1m | 5m | 1h | Product listings |
| `deals` | 30s | 2m | 10m | Time-sensitive promotions |
| `user` | 5m | 1h | 1d | Public profiles, storefronts |
| `max` | 5m | 1h | 1d | Long-lived, invalidate by tag |

```tsx
// Use appropriate profile
export async function getCategories() {
  'use cache'
  cacheTag('categories')
  cacheLife('categories')  // 1 hour revalidate
  // ...
}

export async function getDeals() {
  'use cache'
  cacheTag('deals')
  cacheLife('deals')       // 2 minute revalidate (time-sensitive)
  // ...
}
```

## Cache Tag Hierarchy

Use hierarchical tags for granular invalidation:

```tsx
// Hierarchical tagging pattern
export async function getProductsByCategory(slug: string) {
  'use cache'
  cacheTag('products:list', `products:category:${slug}`)
  cacheLife('products')
  // ...
}

export async function getProduct(id: string) {
  'use cache'
  cacheTag(`product:${id}`)
  cacheLife('products')
  // ...
}
```

**Invalidation impact:**
- `revalidateTag('products:list')` → All product lists
- `revalidateTag('products:category:electronics')` → Just that category
- `revalidateTag('product:abc123')` → Single product

## Static vs Dynamic Supabase Clients

### `createStaticClient()` — For cached data

```tsx
import { createStaticClient } from '@/lib/supabase/server'

export async function getProducts() {
  'use cache'
  // ...
  
  // Static client: no cookies, safe for caching
  const supabase = createStaticClient()
  const { data } = await supabase.from('products').select('*')
  
  return data
}
```

### `createClient()` — For user-specific data

```tsx
import { createClient } from '@/lib/supabase/server'

export async function getMyOrders() {
  // Dynamic: accesses cookies, no caching
  const supabase = await createClient()
  const { data } = await supabase.from('orders').select('*')
  
  return data
}
```

## Server Actions for Mutations

```tsx
// app/actions/products.ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProduct(id: string, data: ProductData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
  
  if (error) throw error
  
  // Invalidate relevant caches
  revalidateTag(`product:${id}`)           // This product
  revalidateTag('products:list')           // All lists
  
  // Optionally revalidate paths
  revalidatePath('/products')
}
```

## View Model Transformation

Transform DB types to UI types at the data layer:

```tsx
// lib/data/products.ts

// DB type → UI type transformation
function toUIProduct(row: DBProduct): UIProduct {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    formattedPrice: formatPrice(row.price),
    imageUrl: normalizeImageUrl(row.images?.[0]),
    // ... transform as needed
  }
}

export async function getProducts(): Promise<UIProduct[]> {
  'use cache'
  cacheTag('products:list')
  cacheLife('products')
  
  const supabase = createStaticClient()
  const { data } = await supabase.from('products').select('*')
  
  return (data ?? []).map(toUIProduct)
}
```

## CRITICAL: Forbidden Patterns

### ❌ `new Date()` in cached functions

```tsx
// ❌ WRONG: Date changes every call → infinite ISR writes
export async function getProducts() {
  'use cache'
  const products = await db.select('*')
  return products.map(p => ({
    ...p,
    fetchedAt: new Date()  // ISR write storm!
  }))
}

// ✅ FIX: No runtime timestamps in cached data
export async function getProducts() {
  'use cache'
  const products = await db.select('*')
  return products  // Return stable data
}
```

### ❌ Client-side data fetching for initial render

```tsx
// ❌ WRONG: useEffect for initial data
'use client'
export function ProductList() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  
  return <Grid products={products} />
}

// ✅ FIX: Fetch in Server Component
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

### ❌ Cookies in cached functions

```tsx
// ❌ WRONG: cookies() makes function dynamic
export async function getProducts() {
  'use cache'
  const cookieStore = await cookies()  // Error: can't use dynamic functions
  // ...
}

// ✅ FIX: Use createStaticClient (no cookies)
export async function getProducts() {
  'use cache'
  const supabase = createStaticClient()  // No cookies
  // ...
}
```

## Prefetching & Parallel Fetching

### Parallel data fetching

```tsx
// ✅ Fetch in parallel, not waterfall
export default async function ProductPage({ params }: Props) {
  const { id } = await params
  
  // Start all fetches at once
  const [product, reviews, related] = await Promise.all([
    getProduct(id),
    getReviews(id),
    getRelatedProducts(id),
  ])
  
  return (
    <div>
      <ProductInfo product={product} />
      <Reviews reviews={reviews} />
      <RelatedProducts products={related} />
    </div>
  )
}
```

### Streaming independent sections

```tsx
// ✅ Stream independent data with Suspense
import { Suspense } from 'react'

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)  // Critical path
  
  return (
    <div>
      <ProductInfo product={product} />
      
      {/* These stream independently */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={id} />
      </Suspense>
      
      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts productId={id} />
      </Suspense>
    </div>
  )
}
```

## File Organization

```
lib/data/
├── products.ts      # getProducts, getProduct, getProductsByCategory
├── categories.ts    # getCategories, getCategoryBySlug
├── profile-page.ts  # getProfile, getProfileMeta
├── cart.ts          # getCart (dynamic, no cache)
├── orders.ts        # getOrders (dynamic, no cache)
└── index.ts         # Re-exports
```

**Naming conventions:**
- `get*` — Read operations (usually cached)
- `create*`, `update*`, `delete*` — Server Actions (never cached)
