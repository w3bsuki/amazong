---
name: treido-backend
description: Backend rules for Treido marketplace - server actions, Supabase queries, auth, webhooks, caching, input validation.
---

# treido-backend

Server actions, route handlers, Supabase, Stripe, and data contracts.

## When to Apply

- Writing server actions or route handlers
- Querying Supabase (select, insert, update, delete)
- Working with RLS policies or migrations
- Implementing Stripe webhooks or payment logic
- Debugging data contract mismatches

## Rules by Priority

### CRITICAL - Auth & Security

| Rule | Description |
|------|-------------|
| `auth-verify-user` | Always `supabase.auth.getUser()` in server actions |
| `auth-no-admin-default` | Never `createAdminClient()` without explicit guard |
| `auth-webhook-signature` | Always verify Stripe webhook signatures |
| `auth-no-log-secrets` | Never log cookies, headers, tokens, or PII |

#### ✅ Do

```tsx
'use server';
export async function updateProfile(data: ProfileData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');
  
  await supabase.from('profiles').update(data).eq('id', user.id);
}
```

#### ❌ Don't

```tsx
'use server';
export async function updateProfile(data: ProfileData) {
  const supabase = await createAdminClient(); // Bypasses RLS!
  await supabase.from('profiles').update(data).eq('id', data.userId);
}
```

### CRITICAL - Webhooks

| Rule | Description |
|------|-------------|
| `webhook-signature` | Verify `Stripe-Signature` with `constructEvent()` |
| `webhook-idempotent` | Store processed event IDs to prevent duplicates |
| `webhook-no-log-payload` | Never log raw webhook payloads (PII) |

#### ✅ Do

```tsx
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  
  const body = await request.text();
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Check idempotency
  const existing = await db.from('processed_events')
    .select('id').eq('event_id', event.id).single();
  if (existing.data) return NextResponse.json({ status: 'already_processed' });
  
  // Process...
}
```

### HIGH - Supabase Queries

| Rule | Description |
|------|-------------|
| `query-explicit-select` | Always select explicit fields, never `select('*')` |
| `query-context-client` | `createClient()` for user context, `createStaticClient()` for cached reads |
| `query-rls-default` | Default to RLS-safe queries |

#### ✅ Do

```tsx
const { data } = await supabase
  .from('products')
  .select('id, title, price, thumbnail_url, seller_id')
  .eq('id', productId)
  .single();
```

#### ❌ Don't

```tsx
const { data } = await supabase
  .from('products')
  .select('*') // Unstable contract, potential data leak
  .eq('id', productId);
```

#### Client Context Guide

| Context | Client | Use Case |
|---------|--------|----------|
| User mutation | `createClient()` | Server actions with auth |
| Cached public read | `createStaticClient()` | Product pages, listings |
| Admin-only | `createAdminClient()` | Webhooks (guarded) |

### HIGH - Caching Rules

| Rule | Description |
|------|-------------|
| `cache-no-request-apis` | `'use cache'` cannot use `cookies()`, `headers()`, or auth |
| `cache-revalidate-tags` | Use `revalidateTag(tag)` after mutations |
| `cache-pure-reads` | Cached functions must be pure |

#### ✅ Do

```tsx
'use cache';
export async function getPublicProduct(id: string) {
  const supabase = createStaticClient();
  return supabase.from('products').select('id, title, price').eq('id', id).single();
}

'use server';
export async function updateProduct(id: string, data: ProductData) {
  const supabase = await createClient();
  await supabase.from('products').update(data).eq('id', id);
  revalidateTag('products');
}
```

#### ❌ Don't

```tsx
'use cache';
export async function getMyProducts() {
  const supabase = await createClient(); // Uses cookies!
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('products').select('*').eq('seller_id', user?.id);
}
```

### MEDIUM - Input Validation

| Rule | Description |
|------|-------------|
| `validate-boundary` | Validate all external input with Zod |
| `validate-before-query` | Never trust input types at runtime |

#### ✅ Do

```tsx
import { z } from 'zod';

const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
});

'use server';
export async function addToCart(input: unknown) {
  const parsed = AddToCartSchema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid input' };
  
  const { productId, quantity } = parsed.data;
  // Types guaranteed at runtime
}
```

### MEDIUM - Error Handling

| Rule | Description |
|------|-------------|
| `error-structured` | Return structured errors with codes |
| `error-log-safe` | Log IDs/types only, never PII |
| `error-user-friendly` | User errors actionable, internal errors generic |

## Common Fixes

### Missing auth verification
```tsx
// Before
'use server';
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from('products').delete().eq('id', id);
}

// After
'use server';
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  await supabase.from('products').delete().eq('id', id).eq('seller_id', user.id);
}
```

### Wildcard select
```tsx
// Before
const { data } = await supabase.from('orders').select('*');
// After
const { data } = await supabase.from('orders').select('id, status, total, created_at');
```

## Verification

```powershell
pnpm -s typecheck
pnpm -s lint
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke  # After auth/checkout changes
```

## Key Files

| Purpose | Location |
|---------|----------|
| User-context client | `lib/supabase/server.ts` → `createClient()` |
| Static client | `lib/supabase/server.ts` → `createStaticClient()` |
| Admin client | `lib/supabase/server.ts` → `createAdminClient()` |
| DB types | `lib/supabase/database.types.ts` |
| Server actions | `app/actions/*` |
| Webhooks | `app/api/**/webhook/route.ts` |

## Data Contract Debugging

When "field is undefined":

```
Schema → Backend Query → DTO → Frontend
   ↓          ↓          ↓        ↓
column    .select()   return   {field}
exists?    field?      field?   used?
```

Check each step. First missing link = your bug.
