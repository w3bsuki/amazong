# caching.md — Next.js 16 Caching Strategies

> Comprehensive caching guide for Treido marketplace.

## Caching Layers

```
┌─────────────────────────────────────────────┐
│           Request Memoization               │  ← Same request deduped
├─────────────────────────────────────────────┤
│              Data Cache                     │  ← Persisted fetch results
├─────────────────────────────────────────────┤
│           Full Route Cache                  │  ← Static HTML/RSC payload
├─────────────────────────────────────────────┤
│            Router Cache                     │  ← Client-side cache
└─────────────────────────────────────────────┘
```

## 1. Request Memoization

Same fetch request called multiple times in one render = deduped automatically.

```tsx
// Both components fetch same URL — only 1 request made
async function Header() {
  const user = await fetch('/api/user');
  return <div>{user.name}</div>;
}

async function Sidebar() {
  const user = await fetch('/api/user');  // Deduped!
  return <div>{user.avatar}</div>;
}
```

**Scope:** Single render pass only. Does NOT persist across requests.

## 2. Data Cache (fetch)

### Default behavior (cached)
```tsx
// Cached indefinitely by default
const data = await fetch('https://api.example.com/data');
```

### Opt out with no-store
```tsx
// Never cache
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});
```

### Time-based revalidation
```tsx
// Revalidate every 60 seconds
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
});
```

### Tag-based revalidation
```tsx
// Tag the fetch
const data = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] },
});

// Revalidate by tag
import { revalidateTag } from 'next/cache';
revalidateTag('products');
```

## 3. Route Segment Config

Control caching at page/layout level:

```tsx
// Force dynamic rendering (no cache)
export const dynamic = 'force-dynamic';

// Force static rendering
export const dynamic = 'force-static';

// Revalidate entire page every N seconds
export const revalidate = 60;

// Allow dynamic (default)
export const dynamic = 'auto';
```

## 4. 'use cache' Directive (Preferred)

**Next.js 16 stable API** — preferred over `unstable_cache`.

```tsx
import { cacheTag, cacheLife } from 'next/cache';

export async function getProducts(category: string) {
  'use cache'                                   // Enable caching
  cacheTag('products:list', `products:category:${category}`)  // Tags
  cacheLife('products')                         // TTL profile
  
  return db.product.findMany({ where: { category } });
}
```

**Treido cache profiles** (from `next.config.ts`):

| Profile | Stale | Revalidate | Expire | Use Case |
|---------|-------|------------|--------|----------|
| `categories` | 5m | 1h | 1d | Category tree |
| `products` | 1m | 5m | 1h | Product listings |
| `deals` | 30s | 2m | 10m | Time-sensitive |
| `user` | 5m | 1h | 1d | Public profiles |
| `max` | 5m | 1h | 1d | Generic long-lived |

→ Full patterns: [data-fetching.md](data-fetching.md)

## 5. unstable_cache (Legacy)

> Prefer `'use cache'` directive for new code.

Cache any async function (not just fetch):

```tsx
import { unstable_cache } from 'next/cache';

// Cache database queries
const getProducts = unstable_cache(
  async (category: string) => {
    return db.product.findMany({
      where: { category },
    });
  },
  ['products'],  // Cache key parts
  {
    revalidate: 3600,      // 1 hour
    tags: ['products'],    // For invalidation
  }
);

// Use in Server Component
export default async function ProductsPage() {
  const products = await getProducts('electronics');
}
```

## 6. Server Actions & Revalidation

```tsx
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createProduct(data: FormData) {
  await db.product.create({ /* ... */ });
  
  // Revalidate paths
  revalidatePath('/products');                    // Specific path
  revalidatePath('/products', 'layout');          // Include layouts
  revalidatePath('/[locale]/products', 'page');   // Dynamic route
  
  // Revalidate tags
  revalidateTag('products');
}
```

## Treido Caching Strategy

### Static pages (cached)
- Home page (revalidate: 3600)
- Category pages (revalidate: 1800)  
- Static content pages

### Dynamic pages (no cache)
- User dashboard
- Cart
- Checkout
- Order history

### Hybrid pages
- Product detail: Static shell + dynamic stock/price
- Search results: Static filters + dynamic results

## Patterns

### Pattern 1: ISR with tags
```tsx
// page.tsx
export const revalidate = 3600;  // Baseline: 1 hour

export default async function ProductsPage() {
  const products = await fetch('...', {
    next: { tags: ['products'] },
  });
  // ...
}

// action.ts
export async function updateProduct() {
  await db.product.update(/* ... */);
  revalidateTag('products');  // Instant invalidation
}
```

### Pattern 2: User-specific with cookies
```tsx
import { cookies } from 'next/headers';

export default async function CartPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  // Using cookies makes page dynamic automatically
  const cart = await getCart(userId);
}
```

### Pattern 3: Static shell + dynamic data
```tsx
export default function ProductPage() {
  return (
    <>
      {/* Static: cached */}
      <ProductInfo />
      
      {/* Dynamic: real-time */}
      <Suspense fallback={<StockSkeleton />}>
        <StockLevel />
      </Suspense>
    </>
  );
}

// StockLevel uses no-store
async function StockLevel() {
  const stock = await fetch('/api/stock', { cache: 'no-store' });
  // ...
}
```

### Pattern 4: On-demand revalidation API
```tsx
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { tag, path, secret } = await request.json();
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  if (tag) revalidateTag(tag);
  if (path) revalidatePath(path);
  
  return NextResponse.json({ revalidated: true });
}
```

## Cache Debugging

```tsx
// See cache status in dev
const res = await fetch(url);
console.log(res.headers.get('x-nextjs-cache'));
// HIT | MISS | STALE
```

## Common Mistakes

```tsx
// ❌ WRONG: Dynamic function makes entire route dynamic
export default async function Page() {
  const cookieStore = await cookies();  // This makes whole page dynamic
  return <StaticContent />;
}

// ✅ RIGHT: Isolate dynamic data
export default function Page() {
  return (
    <>
      <StaticContent />
      <Suspense>
        <DynamicPart />  {/* Only this is dynamic */}
      </Suspense>
    </>
  );
}

async function DynamicPart() {
  const cookieStore = await cookies();
  // ...
}
```

```tsx
// ❌ WRONG: Cache key doesn't include params
const getProduct = unstable_cache(
  async (id: string) => db.product.findUnique({ where: { id } }),
  ['product'],  // All products share same cache!
);

// ✅ RIGHT: Include params in cache key
const getProduct = unstable_cache(
  async (id: string) => db.product.findUnique({ where: { id } }),
  ['product', id],  // Unique cache per product
);
```
