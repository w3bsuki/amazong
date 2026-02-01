# Next.js 16 App Router Reference for Treido

## Server vs Client Components

### Server Components (Default)
```tsx
// app/[locale]/(main)/products/page.tsx
// No directive needed - Server Component by default

import { getProducts } from '@/lib/products';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

### Client Components
```tsx
// app/[locale]/(main)/products/_components/product-filter.tsx
'use client';

import { useState } from 'react';

export function ProductFilter() {
  const [category, setCategory] = useState('all');
  return (
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="all">All</option>
      <option value="electronics">Electronics</option>
    </select>
  );
}
```

### When to Use Client Components
- Event handlers (onClick, onChange, onSubmit)
- React hooks (useState, useEffect, useContext, useRef)
- Browser APIs (window, localStorage, navigator)
- Third-party libraries that use client features

### Composition Pattern
Keep client boundaries small:

```tsx
// ✅ Good - small client boundary
// Server Component
export default function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} /> {/* Only this is client */}
    </div>
  );
}

// Client Component - minimal
'use client';
export function AddToCartButton({ productId }) {
  const handleClick = () => { /* add to cart */ };
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

## Caching with 'use cache'

### Basic Cached Function
```tsx
'use cache';

import { cacheLife, cacheTag } from 'next/cache';

export async function getFeaturedProducts() {
  cacheLife('hours'); // Cache for hours
  cacheTag('products', 'featured');
  
  // Fetch data
  const products = await db.products.findMany({ featured: true });
  return products;
}
```

### Cache Invalidation
```tsx
import { revalidateTag } from 'next/cache';

// In a Server Action
export async function updateProduct(id: string, data: any) {
  await db.products.update({ where: { id }, data });
  revalidateTag('products');
}
```

### ⚠️ FORBIDDEN in Cached Functions
```tsx
'use cache';

// ❌ NEVER do this
import { cookies, headers } from 'next/headers';

export async function getCachedData() {
  const session = await cookies(); // FORBIDDEN
  const userAgent = await headers(); // FORBIDDEN
}
```

## Route Organization

```
app/
├── [locale]/
│   ├── (main)/              # Main layout group
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Home
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── _components/ # Route-private components
│   │   └── cart/
│   │       └── page.tsx
│   ├── (auth)/              # Auth layout group
│   │   ├── layout.tsx
│   │   ├── login/
│   │   └── register/
│   └── (seller)/            # Seller layout group
│       ├── layout.tsx
│       └── dashboard/
├── actions/                  # Shared server actions
└── api/                      # API routes
```

## Server Actions

### Basic Server Action
```tsx
// app/actions/cart.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function addToCart(productId: string, quantity: number) {
  // Validate input
  if (quantity < 1) throw new Error('Invalid quantity');
  
  // Perform action
  await db.cartItems.create({ data: { productId, quantity } });
  
  // Revalidate cache
  revalidateTag('cart');
}
```

### Using in Client Component
```tsx
'use client';

import { addToCart } from '@/app/actions/cart';

export function AddToCartButton({ productId }) {
  const handleClick = async () => {
    await addToCart(productId, 1);
  };
  
  return <button onClick={handleClick}>Add</button>;
}
```

## Loading & Error States

### Loading UI
```tsx
// app/[locale]/(main)/products/loading.tsx
export default function ProductsLoading() {
  return <ProductGridSkeleton />;
}
```

### Error UI
```tsx
// app/[locale]/(main)/products/error.tsx
'use client';

export default function ProductsError({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found
```tsx
// app/[locale]/(main)/products/[id]/not-found.tsx
export default function ProductNotFound() {
  return <h2>Product not found</h2>;
}
```

## Metadata

```tsx
// app/[locale]/(main)/products/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.title,
    description: product.description,
  };
}
```
