# Next.js Project-Specific Patterns

Reference document for `opus_nextjs` agent. Contains patterns specific to the Treido marketplace project.

## Proxy Pattern (NOT Middleware)

**Important**: This project uses `proxy.ts` instead of Next.js middleware for API proxying.

### Why proxy.ts instead of middleware.ts?

1. **Separation of concerns**: Middleware handles auth session refresh only
2. **Performance**: Proxy logic runs only on specific routes
3. **Flexibility**: More control over request/response transformation
4. **Debugging**: Easier to debug isolated proxy logic

### middleware.ts - Auth Only

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Only handle auth session refresh
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### proxy.ts - External API Proxying

```typescript
// proxy.ts - handles external API calls
// Implementation details...
```

## Route Organization

```
app/
├── [locale]/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx          # Landing page
│   │   ├── about/
│   │   └── faq/
│   │
│   ├── (shop)/               # Product browsing (public + auth)
│   │   ├── products/
│   │   │   ├── page.tsx      # Product listing
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx  # Product detail
│   │   │   │   └── _actions/ # Route-private actions
│   │   │   └── _components/  # Route-private components
│   │   ├── categories/
│   │   └── search/
│   │
│   ├── (account)/            # User account (auth required)
│   │   ├── profile/
│   │   ├── orders/
│   │   ├── favorites/
│   │   └── settings/
│   │
│   └── (seller)/             # Seller dashboard (seller role required)
│       ├── dashboard/
│       ├── listings/
│       ├── orders/
│       └── analytics/
│
├── api/
│   ├── webhooks/
│   │   └── stripe/route.ts
│   └── ...
│
└── auth/
    ├── callback/route.ts
    ├── confirm/route.ts
    └── ...
```

## Caching Strategy

### Product Listings (Hourly Revalidation)

```typescript
async function getProducts(categoryId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`products-${categoryId}`)
  
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, price, image_url, seller_id')
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20)
  
  return data ?? []
}
```

### Product Details (Tag-Based)

```typescript
async function getProduct(id: string) {
  'use cache'
  cacheTag(`product-${id}`)
  
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, description, price, images, status,
      seller:profiles(id, display_name, avatar_url),
      category:categories(id, name, slug)
    `)
    .eq('id', id)
    .single()
  
  return data
}
```

### Revalidation After Mutation

```typescript
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

export async function updateProduct(id: string, data: ProductInput) {
  // ... update logic
  
  // Revalidate specific product
  revalidateTag(`product-${id}`)
  
  // Revalidate category listings
  revalidateTag(`products-${categoryId}`)
  
  // Revalidate seller's products page
  revalidatePath(`/[locale]/(seller)/listings`, 'page')
}
```

## Internationalization (next-intl)

### Message Files

```
messages/
├── en.json
└── bg.json
```

### Server Component Usage

```typescript
import { getTranslations } from 'next-intl/server'

export default async function ProductPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('Products')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### Client Component Usage

```typescript
'use client'

import { useTranslations } from 'next-intl'

export function AddToCartButton() {
  const t = useTranslations('Cart')
  
  return <button>{t('addToCart')}</button>
}
```

### Never Hardcode User-Facing Strings

```typescript
// ❌ Hardcoded
<button>Add to Cart</button>

// ✅ i18n
const t = useTranslations('Cart')
<button>{t('addToCart')}</button>
```

## Server Action Patterns

### Treido Standard Pattern

```typescript
// app/[locale]/(shop)/products/[id]/_actions/add-to-cart.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(99)
})

type ActionResult = 
  | { success: true; data: { cartItemId: string } }
  | { success: false; error: string }

export async function addToCart(
  productId: string, 
  quantity: number
): Promise<ActionResult> {
  // 1. Validate input
  const parsed = AddToCartSchema.safeParse({ productId, quantity })
  if (!parsed.success) {
    return { success: false, error: 'Invalid input' }
  }
  
  // 2. Get authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }
  
  // 3. Execute operation (RLS enforced)
  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      product_id: parsed.data.productId,
      quantity: parsed.data.quantity
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: 'Failed to add item' }
  }
  
  // 4. Revalidate relevant caches
  revalidateTag(`cart-${user.id}`)
  revalidatePath('/cart')
  
  // 5. Return typed result
  return { success: true, data: { cartItemId: data.id } }
}
```

## Error Handling

### Error Boundary

```typescript
// app/[locale]/(shop)/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-4 text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-8">Try again</Button>
    </div>
  )
}
```

### Not Found

```typescript
// app/[locale]/(shop)/products/[id]/not-found.tsx
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('Errors')
  
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold">{t('productNotFound')}</h2>
    </div>
  )
}
```

## Performance Patterns

### Parallel Data Fetching

```typescript
export default async function ProductPage({ params }: Props) {
  const { id, locale } = await params
  
  // Fetch in parallel
  const [product, relatedProducts, reviews] = await Promise.all([
    getProduct(id),
    getRelatedProducts(id),
    getProductReviews(id)
  ])
  
  if (!product) {
    notFound()
  }
  
  return (
    <div>
      <ProductDetails product={product} />
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts products={relatedProducts} />
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews reviews={reviews} />
      </Suspense>
    </div>
  )
}
```

### Streaming with Suspense

```typescript
export default async function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsAsync />
      </Suspense>
    </div>
  )
}

async function ProductsAsync() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```
