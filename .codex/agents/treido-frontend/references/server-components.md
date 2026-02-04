# server-components.md — React Server Components

> Server Components by default, `'use client'` only when required.

## Decision Tree

```
Is it a component?
├── Need hooks (useState, useEffect, useRef)?      → 'use client'
├── Need event handlers (onClick, onChange)?       → 'use client'
├── Need browser APIs (localStorage, window)?      → 'use client'
├── Need to render on client after hydration?      → 'use client'
└── Everything else                                → Server Component ✅
```

## Server Components (Default)

Server Components run only on the server. No JS shipped to client.

```tsx
// ✅ Server Component - default, no directive needed
export default async function ProductPage({ params }: Props) {
  const { id } = await params;  // Next.js 16: params is Promise
  const product = await getProduct(id);
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* Can render Client Components as children */}
      <AddToCartButton productId={id} />
    </div>
  );
}
```

**Server Components can:**
- `async`/`await` at component level
- Access server-only resources (DB, filesystem, env secrets)
- Fetch data directly (no useEffect)
- Import `server-only` modules
- Pass serializable props to Client Components

**Server Components cannot:**
- Use hooks (`useState`, `useEffect`, `useContext`)
- Use browser APIs (`window`, `localStorage`)
- Use event handlers (`onClick`, `onChange`)
- Access `React.createContext` consumers

## Client Components

Client Components run on server (SSR) and hydrate on client.

```tsx
// ✅ Client Component - explicit directive
'use client';

import { useState, useTransition } from 'react';
import { addToCart } from '@/app/actions/cart';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  
  function handleClick() {
    startTransition(async () => {
      await addToCart(productId);
    });
  }
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

**Client Components can:**
- Use React hooks
- Use browser APIs
- Use event handlers
- Maintain client-side state

**Client Components cannot:**
- Be `async` functions
- Import `server-only` modules
- Access server-only resources directly

## Composition Patterns

### Pattern 1: Server wraps Client

```tsx
// ✅ Server Component fetches, passes to Client
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  
  return (
    <div>
      <ProductInfo product={product} />           {/* Server */}
      <AddToCartButton productId={id} />          {/* Client */}
      <ProductReviews productId={id} />           {/* Server */}
    </div>
  );
}
```

### Pattern 2: Client receives Server children

```tsx
// ✅ Client Component receives Server Components as children
'use client';

export function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div>
      <TabList onSelect={setActiveTab} />
      <TabPanel index={activeTab}>
        {children}  {/* Server Components rendered here */}
      </TabPanel>
    </div>
  );
}

// Usage in Server Component
<Tabs>
  <ProductDetails product={product} />  {/* Server Component */}
</Tabs>
```

### Pattern 3: Props boundary

```tsx
// ✅ Server Component passes serializable props
export default async function Page() {
  const data = await getData();  // Complex object
  
  // Only pass what Client needs (serializable)
  return <ClientChart data={data.chartPoints} title={data.title} />;
}

// ❌ WRONG: Passing non-serializable props
return <ClientComp fn={() => {}} />;  // Functions not serializable!
```

## Streaming with Suspense

```tsx
// ✅ Stream independent data fetches
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    <>
      {/* Static - renders immediately */}
      <Header />
      
      {/* Streaming - each boundary independent */}
      <Suspense fallback={<ProductInfoSkeleton />}>
        <ProductInfo />
      </Suspense>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews />         {/* Slow query */}
      </Suspense>
      
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />        {/* Another slow query */}
      </Suspense>
    </>
  );
}

// Each async component streams independently
async function ProductReviews() {
  const reviews = await getReviews();  // 2s query
  return <ReviewsList reviews={reviews} />;
}
```

## Server Actions

Server Actions are async functions that run on the server.

```tsx
// app/actions/cart.ts
'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addToCart(productId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;
  
  await db.cart.addItem({ cartId, productId });
  
  revalidateTag('cart');
}
```

```tsx
// In Client Component
'use client';

import { addToCart } from '@/app/actions/cart';

export function AddButton({ productId }: { productId: string }) {
  return (
    <form action={addToCart.bind(null, productId)}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

## Common Mistakes

### ❌ Hooks in Server Components

```tsx
// ❌ WRONG: useState in Server Component
export default function ProductPage() {
  const [count, setCount] = useState(0);  // Error!
  return <div>{count}</div>;
}

// ✅ FIX: Extract to Client Component
'use client';
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### ❌ Async Client Components

```tsx
// ❌ WRONG: async Client Component
'use client';
export async function ClientComp() {  // Error!
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ FIX: Fetch in Server Component, pass as prop
export default async function Page() {
  const data = await fetchData();
  return <ClientComp data={data} />;
}
```

### ❌ Importing server-only in Client

```tsx
// ❌ WRONG: DB import in Client Component
'use client';
import { db } from '@/lib/db';  // Server code in client bundle!

// ✅ FIX: Use Server Action
'use client';
import { saveData } from '@/app/actions/data';
```

### ❌ Context in Server Components

```tsx
// ❌ WRONG: useContext in Server Component
export default function Page() {
  const theme = useContext(ThemeContext);  // Error!
}

// ✅ FIX: Pass as prop or use Client Component
export default function Page() {
  return <ThemeAwareContent />;  // Client Component handles context
}
```

## Props Serialization

Only serializable data can cross Server → Client boundary:

| ✅ Serializable | ❌ Not Serializable |
|-----------------|---------------------|
| `string` | Functions |
| `number` | Classes |
| `boolean` | Symbols |
| `null` | Map/Set |
| `undefined` | JSX (rendered) |
| Plain objects | Circular refs |
| Arrays | Date (use ISO string) |

```tsx
// ✅ CORRECT: Serialize dates
const product = await getProduct(id);
return (
  <ClientComp 
    createdAt={product.createdAt.toISOString()}  // String, not Date
  />
);
```

## 'use client' Boundary Rules

1. **Directive must be first** (before imports)
2. **Applies to entire file** (all exports become Client)
3. **Children can still be Server Components** (when passed as `children`)
4. **Imports become client-side** (watch bundle size)

```tsx
// ✅ Correct position
'use client';

import { useState } from 'react';

// ❌ WRONG: Directive not first
import { useState } from 'react';
'use client';  // Error: must be before imports
```
