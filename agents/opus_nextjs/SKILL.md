# opus_nextjs — Next.js 15+ App Router Specialist

## Identity
**opus_nextjs** — Next.js 15+ App Router authority. Server/client boundaries, caching, RSC patterns.

**Trigger**: `OPUS-NEXTJS:` | **Mode**: AUDIT-only

## Decision Tree
```
Need useState/useEffect/useContext?     → 'use client'
Need onClick/onChange/browser APIs?     → 'use client'
Everything else?                        → Server Component ✅
```

## Server Components (Default)
```tsx
export default async function Page() {
  const data = await fetchData()
  return <div>{data.title}</div>
}
```

## Client Components
```tsx
'use client'
import { useState } from 'react'
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Caching Patterns

### fetch() options
```tsx
await fetch(url)                              // Static (default)
await fetch(url, { cache: 'force-cache' })    // Static explicit
await fetch(url, { cache: 'no-store' })       // Dynamic (every request)
await fetch(url, { next: { revalidate: 3600 } }) // Time-based ISR
await fetch(url, { next: { tags: ['products'] } }) // Tag-based
```

### 'use cache' directive (Next.js 15+)
```tsx
import { cacheLife, cacheTag } from 'next/cache'

async function getProducts(categoryId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`products-${categoryId}`)
  
  const { data } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('category_id', categoryId)
  return data
}
```

### Cache Invalidation
```tsx
import { revalidateTag, updateTag } from 'next/cache'

// Eventual consistency (stale-while-revalidate, background refresh)
export async function createPost(data: FormData) {
  'use server'
  await db.insert(data)
  revalidateTag('posts')  // Background revalidation
}

// Immediate consistency (same request, instant)
export async function updateCart(itemId: string) {
  'use server'
  await db.update(itemId)
  updateTag('cart')  // Instant invalidation
}
```

### ❌ NEVER in cached functions
```tsx
async function bad() {
  'use cache'
  await cookies()           // ❌ Request-specific
  await headers()           // ❌ Request-specific  
  supabase.auth.getUser()   // ❌ User-specific
}
```

## Server Actions
```tsx
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, qty: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { error } = await supabase
    .from('cart_items')
    .upsert({ user_id: user.id, product_id: productId, quantity: qty })
  
  if (error) return { error: 'Failed' }
  revalidatePath('/cart')
  return { success: true }
}
```

## Treido-Specific
- `proxy.ts` handles API proxying (NOT middleware.ts)
- `middleware.ts` only refreshes auth sessions

## Route Structure
```
app/[locale]/
├── (marketing)/     # Landing pages
├── (shop)/          # Products, categories  
├── (account)/       # Profile, orders
└── (seller)/        # Seller dashboard
```

| Segment | Purpose |
|---------|---------|
| `[param]` | Dynamic |
| `[...slug]` | Catch-all |
| `(group)` | Route group |
| `_folder` | Private (excluded) |

## Patterns

### Parallel fetch
```tsx
const [products, categories] = await Promise.all([getProducts(), getCategories()])
```

### Streaming
```tsx
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

### Promise passing to client (React 19 use())
```tsx
// Server Component
export default async function Page() {
  const dataPromise = fetchData() // Don't await
  return <ClientComponent dataPromise={dataPromise} />
}

// Client Component
'use client'
import { use } from 'react'
export function ClientComponent({ dataPromise }) {
  const data = use(dataPromise) // Suspends until resolved
  return <div>{data}</div>
}
```

## Audit Checklist
- [ ] Server Components by default
- [ ] `'use client'` only when needed
- [ ] No cookies()/headers() in cached functions
- [ ] Proper cacheLife/cacheTag usage
- [ ] Suspense boundaries for async
- [ ] Parallel fetching where possible
