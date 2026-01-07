# Backend Development Guide

Reference for Supabase, data fetching, caching, and API work on Treido. This is the **canonical backend guide** for both humans and agents.

## Quick Reference

**Gates (run after every change):**
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:e2e:smoke
```

**Supabase audits (MCP):**
```typescript
mcp_supabase_get_advisors({ type: "security" })
mcp_supabase_get_advisors({ type: "performance" })
```

---

## Supabase Client Types

| Client | File | Use Case |
|--------|------|----------|
| `createClient()` | `lib/supabase/server.ts` | Server Components, Server Actions (cookie-aware) |
| `createStaticClient()` | `lib/supabase/server.ts` | Cached/public reads (no cookies, safe for `'use cache'`) |
| `createRouteHandlerClient()` | `lib/supabase/server.ts` | Route handlers (`app/api/`) |
| `createAdminClient()` | `lib/supabase/server.ts` | Bypass RLS - server-internal ops ONLY |
| `createBrowserClient()` | `lib/supabase/client.ts` | Client Components |

### Usage Examples

```tsx
// Server Component (cookie-aware)
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('id, name, price');
  return <ProductList products={data} />;
}
```

```tsx
// Cached fetch (no user context)
import { createStaticClient } from '@/lib/supabase/server';

export async function getCategories() {
  'use cache';
  cacheLife('max');
  
  const supabase = createStaticClient();
  const { data } = await supabase.from('categories').select('*');
  return data;
}
```

## Row Level Security (RLS)

### Critical Rules
1. **RLS must be enabled** on all tables with user data
2. **Validate with `getUser()` or `getClaims()`** - never `getSession()` alone
3. **Never bypass RLS** in user-facing code paths
4. **Use `(select auth.uid())`** in policies (evaluates once per query)
5. **Add client-side filters** even with RLS for performance

### Policy Patterns
```sql
-- Users can read their own data
CREATE POLICY "Users read own data" ON orders
  FOR SELECT USING (user_id = (select auth.uid()));

-- Users can insert their own data
CREATE POLICY "Users insert own data" ON orders
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Public read for published items
CREATE POLICY "Public read published" ON products
  FOR SELECT USING (status = 'published');
```

## Query Optimization

### Field Projection
```tsx
// BAD - fetches all columns
const { data } = await supabase.from('products').select('*');

// GOOD - only what you need
const { data } = await supabase.from('products').select('id, name, price, image_url');
```

### Avoid Deep Joins
```tsx
// BAD - deeply nested, slow
const { data } = await supabase
  .from('products')
  .select('*, category:categories(*, parent:categories(*))');

// GOOD - flatter, use RPC for complex needs
const { data } = await supabase
  .from('products')
  .select('id, name, category_id');
```

### Pagination
```tsx
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 19)
  .order('created_at', { ascending: false });
```

## Next.js 16 Caching

### Cache Components (`'use cache'`)
```tsx
export async function getPublicProducts() {
  'use cache';
  cacheLife('products');  // Profile from next.config.ts
  cacheTag('products');   // For targeted invalidation
  
  const supabase = createStaticClient();
  const { data } = await supabase.from('products').select('id, name, price');
  return data;
}
```

### Cache Profiles
Defined in `next.config.ts`:
- `'max'` - Long-lived, SWR semantics
- `'products'` - Product listing cache
- `'categories'` - Category cache

### Invalidation

| Function | Context | Behavior |
|----------|---------|----------|
| `revalidateTag(tag, 'max')` | Server Actions, Route Handlers | Stale-while-revalidate |
| `updateTag(tag)` | Server Actions ONLY | Immediate expiration |

```tsx
import { revalidateTag, updateTag } from 'next/cache';

// Background revalidation (recommended)
export async function updateInventory(productId: string) {
  'use server';
  // ... update product ...
  revalidateTag('products', 'max');
}

// Immediate expiration (when user must see change)
export async function createProduct(data: ProductData) {
  'use server';
  const product = await db.products.create(data);
  updateTag('products');
  redirect(`/products/${product.id}`);
}
```

### What NOT to Cache
- User-specific data (uses cookies/headers)
- Real-time data (cart, notifications)
- Frequently changing data

## Server Actions

### Location
- Route-specific: `app/[locale]/(group)/**/_actions/`
- Shared: `app/actions/`

### Pattern
```tsx
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, data: ProductUpdate) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/products');
  return { success: true };
}
```

## Middleware

### Key Rules
1. **Add matchers** - Skip `_next/static`, `_next/image`, assets
2. **Minimal logic** - Auth checks only for protected routes
3. **Use `getUser()` or `getClaims()`** - Never `getSession()` alone

```tsx
// PREFERRED - validates JWT
const { data } = await supabase.auth.getClaims();

// ALSO VALID - network request
const { data: { user } } = await supabase.auth.getUser();

// NEVER for security-critical checks
const { data: { session } } = await supabase.auth.getSession();  // ❌ spoofable
```

## Stripe Integration

### Files
- `lib/stripe/` - Stripe client and utilities
- `app/api/webhooks/stripe/` - Webhook handler

### Webhook Security
1. Verify webhook signature
2. Handle idempotency (same event may arrive multiple times)
3. Return 200 quickly, process async if needed

## Error Handling

### Pattern
```tsx
const { data, error } = await supabase.from('products').select('*');

if (error) {
  console.error('Failed to fetch products:', error.message);
  throw new Error('Failed to load products');  // Don't expose internals
}
```

### Never Log
- Full request bodies
- JWTs or tokens
- User passwords
- API keys

## Verification Checklist

Before marking backend work complete:

- [ ] RLS policies cover the table
- [ ] Queries use field projection (no `select('*')` in hot paths)
- [ ] Proper client type used (cookie-aware vs static)
- [ ] Cached functions use `createStaticClient()`
- [ ] Invalidation uses correct tags
- [ ] Error handling doesn't expose internals
- [ ] No secrets logged
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` passes
- [ ] `pnpm test:e2e:smoke` passes
- [ ] If touching auth/checkout: run relevant E2E specs
