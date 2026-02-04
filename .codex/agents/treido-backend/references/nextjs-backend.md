# nextjs-backend.md — Next.js 16 Backend Patterns

> Server Actions, API Routes, Caching for Treido.

## Server Actions (Next.js 16)

### File-Level Directive

```tsx
// app/actions/products.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// All exports are Server Actions
export async function createProduct(formData: FormData) { /* ... */ }
export async function updateProduct(id: string, data: ProductUpdate) { /* ... */ }
export async function deleteProduct(id: string) { /* ... */ }
```

### Inline in Server Components

```tsx
// app/[locale]/(main)/products/page.tsx
export default async function ProductsPage() {
  async function addToCart(formData: FormData) {
    'use server';
    const productId = formData.get('productId') as string;
    const supabase = await createClient();
    // ... add to cart logic
  }
  
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={product.id} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

### Standard Pattern Structure

```tsx
export async function serverAction(formData: FormData) {
  // 1. Get auth client
  const supabase = await createClient();
  
  // 2. Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  // 3. Validate input with Zod
  const schema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
  });
  
  const parsed = schema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
  });
  
  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() };
  }
  
  // 4. Database operation
  const { data, error } = await supabase
    .from('products')
    .insert({ ...parsed.data, seller_id: user.id })
    .select()
    .single();
  
  if (error) {
    console.error('Database error:', error);
    return { error: 'Failed to create product' };
  }
  
  // 5. Revalidate and/or redirect
  revalidateTag('products');
  redirect(`/products/${data.slug}`);
}
```

### Calling from Client Components

```tsx
'use client';

import { createProduct } from '@/app/actions/products';
import { useActionState, startTransition } from 'react';

export function CreateProductForm() {
  const [state, action, isPending] = useActionState(createProduct, null);
  
  return (
    <form action={action}>
      <input name="name" required />
      <input name="price" type="number" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Product'}
      </button>
      {state?.error && <p className="text-destructive">{state.error}</p>}
    </form>
  );
}
```

---

## API Route Handlers

### Basic Pattern

```tsx
// app/api/products/[id]/route.ts
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase } = createRouteHandlerClient(request);
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, applyCookies } = createRouteHandlerClient(request);
  
  const body = await request.json();
  
  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 400 }));
  }
  
  return applyCookies(NextResponse.json(data));
}
```

### Webhook Handler (No Auth)

```tsx
// app/api/webhooks/stripe/route.ts
import { createAdminClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Use admin client for webhooks (no user context)
  const supabase = createAdminClient();
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle checkout...
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

---

## Caching with 'use cache' (Next.js 16)

### Basic Cached Function

```tsx
// lib/data/products.ts
import { createStaticClient } from '@/lib/supabase/server';
import { cacheTag, cacheLife } from 'next/cache';

export async function getActiveProducts() {
  'use cache';
  cacheTag('products');
  cacheLife('hours');  // Revalidate every hour
  
  const supabase = createStaticClient();  // NO cookies!
  
  const { data, error } = await supabase
    .from('products')
    .select('id, title, price, images, slug')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data;
}
```

### Cached with Parameters

```tsx
export async function getProductsByCategory(categoryId: string) {
  'use cache';
  cacheTag('products', `category:${categoryId}`);
  cacheLife('hours');
  
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('id, title, price, images, slug')
    .contains('category_ancestors', [categoryId])
    .eq('status', 'active')
    .limit(50);
  
  if (error) throw error;
  return data;
}
```

### Cache Life Options

```tsx
import { cacheLife } from 'next/cache';

// Predefined profiles
cacheLife('seconds');  // Short-lived
cacheLife('minutes');  // Few minutes
cacheLife('hours');    // Hour-based
cacheLife('days');     // Day-based
cacheLife('weeks');    // Week-based
cacheLife('max');      // Maximum allowed

// Custom (in seconds)
cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
```

### Revalidation Patterns

```tsx
import { revalidateTag, revalidatePath } from 'next/cache';

// After mutation in server action
export async function updateProduct(id: string, data: ProductUpdate) {
  // ... update logic
  
  // Revalidate all products
  revalidateTag('products');
  
  // Revalidate specific category
  revalidateTag(`category:${product.category_id}`);
  
  // Revalidate specific path
  revalidatePath('/products');
  revalidatePath(`/products/${product.slug}`);
}
```

---

## CRITICAL Rules

### Never Use cookies() in Cached Functions

```tsx
// ❌ WRONG
async function getCachedData() {
  'use cache';
  const supabase = await createClient();  // Uses cookies!
  // ...
}

// ✅ CORRECT
async function getCachedData() {
  'use cache';
  const supabase = createStaticClient();  // No cookies
  // ...
}
```

### Params are Async in Next.js 16

```tsx
// ❌ WRONG (Next.js 15 style)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;  // Error in Next.js 16!
}

// ✅ CORRECT (Next.js 16)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
}
```

### SearchParams Also Async

```tsx
// ❌ WRONG
export default function Page({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query;  // Error!
}

// ✅ CORRECT
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
}
```

---

## Treido File Locations

| Type | Location |
|------|----------|
| Server Actions | `app/actions/*.ts` |
| API Routes | `app/api/**/*.ts` |
| Cached Data | `lib/data/*.ts` |
| Auth Helpers | `lib/auth/*.ts` |

### Existing Actions

| File | Purpose |
|------|---------|
| `app/actions/orders.ts` | Order management |
| `app/actions/products.ts` | Product CRUD |
| `app/actions/payments.ts` | Payment processing |
| `app/actions/profile.ts` | Profile updates |
| `app/actions/reviews.ts` | Product reviews |
| `app/actions/onboarding.ts` | User onboarding |

---

## See Also

- SKILL.md — Main backend skill
- supabase.md — Supabase client patterns
- mcp-tools.md — MCP tool usage
