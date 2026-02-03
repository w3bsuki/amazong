# treido-backend

Comprehensive backend rules for Treido: server actions, route handlers, Supabase queries, RLS policies, Stripe webhooks, and data contracts.

## When to Apply

- Writing server actions or route handlers
- Querying Supabase (select, insert, update, delete)
- Working with RLS policies or migrations
- Implementing Stripe webhooks or payment logic
- Debugging data contract mismatches

---

## Rules by Priority

### CRITICAL - Auth & Security

| Rule | Description |
|------|-------------|
| `auth-verify-user` | Always verify auth via `supabase.auth.getUser()` in server actions |
| `auth-no-admin-default` | Never use `createAdminClient()` without explicit guard |
| `auth-webhook-signature` | Always verify Stripe webhook signatures |
| `auth-no-log-secrets` | Never log cookies, headers, tokens, or PII |

#### ✅ Do

```tsx
'use server';
export async function updateProfile(data: ProfileData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');
  
  // Safe: user verified, RLS applies
  await supabase.from('profiles').update(data).eq('id', user.id);
}
```

#### ❌ Don't

```tsx
'use server';
export async function updateProfile(data: ProfileData) {
  // DANGEROUS: No auth check, bypasses RLS
  const supabase = await createAdminClient();
  await supabase.from('profiles').update(data).eq('id', data.userId);
}
```

---

### CRITICAL - Webhooks

| Rule | Description |
|------|-------------|
| `webhook-signature` | Verify `Stripe-Signature` header with `constructEvent()` |
| `webhook-idempotent` | Store processed event IDs to prevent duplicate processing |
| `webhook-no-log-payload` | Never log raw webhook payloads (contains PII) |

#### ✅ Do

```tsx
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }
  
  const body = await request.text();
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Check idempotency
  const existing = await db.from('processed_events')
    .select('id').eq('event_id', event.id).single();
  
  if (existing.data) {
    return NextResponse.json({ received: true, status: 'already_processed' });
  }
  
  // Process event...
  console.log('Processing webhook', { eventId: event.id, type: event.type });
}
```

#### ❌ Don't

```tsx
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // BAD: No signature verification
  // BAD: Logging full payload (PII leak)
  console.log('Webhook received:', body);
  
  // BAD: No idempotency - processes duplicates
  await processPayment(body.data.object);
}
```

---

### HIGH - Supabase Queries

| Rule | Description |
|------|-------------|
| `query-explicit-select` | Always select explicit fields, never `select('*')` |
| `query-context-client` | Use `createClient()` for user context, `createStaticClient()` for cached public reads |
| `query-rls-default` | Default to RLS-safe queries; service role only with explicit guard |

#### ✅ Do

```tsx
// Explicit fields - stable contract
const { data } = await supabase
  .from('products')
  .select('id, title, price, thumbnail_url, seller_id')
  .eq('id', productId)
  .single();
```

#### ❌ Don't

```tsx
// Wildcard - unstable contract, potential data leak
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId)
  .single();
```

#### Client Context Guide

| Context | Client | Use Case |
|---------|--------|----------|
| User mutation | `createClient()` | Server actions with auth |
| Cached public read | `createStaticClient()` | Product pages, public listings |
| Admin-only operation | `createAdminClient()` | Webhooks, admin routes (guarded) |

---

### HIGH - Caching Rules

| Rule | Description |
|------|-------------|
| `cache-no-request-apis` | `'use cache'` functions cannot use `cookies()`, `headers()`, or auth |
| `cache-revalidate-tags` | Use `revalidateTag(tag)` after mutations |
| `cache-pure-reads` | Cached functions must be pure (same input = same output) |

#### ✅ Do

```tsx
// Cached public read - no auth, no cookies
'use cache';
export async function getPublicProduct(id: string) {
  const supabase = createStaticClient();
  return supabase.from('products').select('id, title, price').eq('id', id).single();
}

// Mutation with revalidation
'use server';
export async function updateProduct(id: string, data: ProductData) {
  const supabase = await createClient();
  await supabase.from('products').update(data).eq('id', id);
  revalidateTag('products');
}
```

#### ❌ Don't

```tsx
// BROKEN: Cache with auth dependency
'use cache';
export async function getMyProducts() {
  const supabase = await createClient(); // Uses cookies!
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('products').select('*').eq('seller_id', user?.id);
}
```

---

### MEDIUM - Input Validation

| Rule | Description |
|------|-------------|
| `validate-boundary` | Validate all external input at the boundary with Zod |
| `validate-before-query` | Never trust input types - runtime validation required |

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
  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() };
  }
  
  const { productId, quantity } = parsed.data;
  // Now types are guaranteed at runtime
}
```

---

### MEDIUM - Error Handling

| Rule | Description |
|------|-------------|
| `error-structured` | Return structured errors with codes, not raw exceptions |
| `error-log-safe` | Log error metadata (IDs, types), never PII or secrets |
| `error-user-friendly` | User-facing errors are actionable; internal errors are generic |

#### ✅ Do

```tsx
try {
  await processOrder(orderId);
} catch (err) {
  // Safe logging - IDs only, no PII
  console.error('Order processing failed', { 
    orderId, 
    errorCode: err.code,
    errorType: err.name 
  });
  
  // User-friendly response
  return { 
    error: { 
      code: 'ORDER_FAILED', 
      message: 'Unable to process order. Please try again.' 
    } 
  };
}
```

#### ❌ Don't

```tsx
try {
  await processOrder(orderId);
} catch (err) {
  // BAD: Logs entire objects (may contain PII)
  console.error('Failed', { user, order, err });
  
  // BAD: Exposes internal error to user
  throw err;
}
```

---

## PAUSE CONDITIONS

**Stop and ask for human approval before implementing:**

- Database schema changes (new tables, columns, types)
- Migration files (`supabase/migrations/*`)
- RLS policies (create, alter, drop)
- Auth/access control changes
- Stripe/payment logic changes
- Data deletion or truncation

These are high-risk changes that require explicit approval.

---

## Common Fixes

### Fix: Missing auth verification

```tsx
// Before (wrong)
'use server';
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from('products').delete().eq('id', id);
}

// After (correct)
'use server';
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // RLS will also enforce ownership
  await supabase.from('products').delete().eq('id', id).eq('seller_id', user.id);
}
```

### Fix: Wildcard select

```tsx
// Before (wrong)
const { data } = await supabase.from('orders').select('*');

// After (correct)
const { data } = await supabase.from('orders')
  .select('id, status, total, created_at, buyer_id');
```

---

## Verification

After any backend change:

```powershell
pnpm -s typecheck      # TypeScript errors
pnpm -s lint           # ESLint issues
```

After auth/checkout/webhook changes:

```powershell
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Key Files

| Purpose | Location |
|---------|----------|
| User-context client | `lib/supabase/server.ts` → `createClient()` |
| Static client (cached) | `lib/supabase/server.ts` → `createStaticClient()` |
| Admin client (guarded) | `lib/supabase/server.ts` → `createAdminClient()` |
| Generated DB types | `lib/supabase/database.types.ts` |
| Server actions | `app/actions/*` |
| Webhooks | `app/api/**/webhook/route.ts` |
| Migrations | `supabase/migrations/*` |

---

## Data Contract Alignment

When debugging "field is undefined" or "data not showing":

1. **Check schema** - Does the column exist? (Use Supabase MCP or dashboard)
2. **Check backend** - Is the field selected in the query?
3. **Check DTO** - Is the field returned to the frontend?
4. **Check frontend** - Is the field accessed correctly?

```
Schema → Backend Query → DTO → Frontend
   ↓          ↓          ↓        ↓
column    .select()   return   {field}
exists?    field?      field?   used?
```

If any step is missing, you found the bug.
