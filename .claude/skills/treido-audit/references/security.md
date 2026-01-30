# Security Audit Checklist for Treido

## Authentication & Session

### Supabase Auth
- [ ] User sessions validated on server-side
- [ ] No client-side trust of user claims
- [ ] Proper logout clears all session data
- [ ] Password reset tokens expire appropriately

### Session Handling
```tsx
// ✅ CORRECT - always verify on server
const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();

if (!user) {
  throw new Error('Unauthorized');
}

// ❌ WRONG - trusting client claims
const userId = request.headers.get('x-user-id'); // Never trust this
```

## Data Exposure

### Logging
```tsx
// ❌ CRITICAL - never log sensitive data
console.log('User:', user);
console.log('Session:', session);
console.log('Token:', accessToken);
console.log('Password:', password);
console.log('Email:', email);
console.log('Address:', shippingAddress);

// ✅ CORRECT - log only identifiers
console.log('Processing user:', user.id);
console.log('Order created:', order.id);
```

### API Responses
```tsx
// ❌ WRONG - exposing internal data
return NextResponse.json({
  user,  // May contain sensitive fields
  error: error.stack,  // Stack traces leak internals
});

// ✅ CORRECT - explicit safe fields
return NextResponse.json({
  user: { id: user.id, name: user.name },
  error: 'An error occurred',
});
```

### Query Projections
```tsx
// ❌ WRONG - may expose sensitive columns
const { data } = await supabase.from('users').select('*');

// ✅ CORRECT - explicit safe columns
const { data } = await supabase
  .from('users')
  .select('id, name, avatar_url');
```

## Payment Security (Stripe)

### Webhook Verification
```tsx
// ❌ CRITICAL - unverified webhook
export async function POST(req: Request) {
  const event = await req.json();  // NEVER DO THIS
}

// ✅ CORRECT - signature verified
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers.get('stripe-signature')!;
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }
}
```

### Idempotent Processing
```tsx
// ✅ CORRECT - prevent duplicate processing
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  // Check if already processed
  const existing = await db.orders.findFirst({
    where: { stripe_session_id: session.id }
  });
  
  if (existing) {
    console.log('Already processed:', session.id);
    return;
  }
  
  // Process...
}
```

### Price Validation
```tsx
// ❌ WRONG - trusting client-provided prices
const price = request.body.price;  // Client can manipulate

// ✅ CORRECT - always fetch from database
const product = await db.products.findUnique({ where: { id: productId } });
const price = product.price;  // Trusted source
```

## Row Level Security (RLS)

### Required for All User Tables
```sql
-- ❌ CRITICAL - RLS not enabled
create table public.orders (...);
-- Anyone can read/write!

-- ✅ CORRECT - RLS enabled
create table public.orders (...);
alter table public.orders enable row level security;
```

### Policy Coverage
```sql
-- ✅ Ensure all operations are covered
create policy "select" on orders for select using (...);
create policy "insert" on orders for insert with check (...);
create policy "update" on orders for update using (...) with check (...);
create policy "delete" on orders for delete using (...);
```

## Input Validation

### User Input
```tsx
// ❌ WRONG - no validation
const { title, price } = await request.json();
await db.products.create({ data: { title, price } });

// ✅ CORRECT - validated input
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive().max(1000000),
});

const { title, price } = schema.parse(await request.json());
```

### SQL Injection Prevention
```tsx
// ❌ WRONG - string interpolation
const query = `SELECT * FROM products WHERE id = '${id}'`;

// ✅ CORRECT - parameterized query (Supabase handles this)
const { data } = await supabase
  .from('products')
  .select()
  .eq('id', id);
```

## Environment Variables

### Required Secrets
- `STRIPE_SECRET_KEY` - Never expose
- `STRIPE_WEBHOOK_SECRET` - Never expose
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only

### Public Variables
- `NEXT_PUBLIC_SUPABASE_URL` - OK to expose
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - OK to expose
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - OK to expose

```tsx
// ❌ CRITICAL - exposing secret key
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY); // NO!

// ✅ CORRECT - server-only secret
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

## File Upload Security

### Validation
```tsx
// ✅ CORRECT - validate file type and size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('Invalid file type');
}

if (file.size > MAX_SIZE) {
  throw new Error('File too large');
}
```

### Storage Policies
```sql
-- Restrict uploads to authenticated users
create policy "Users upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Quick Security Audit

```bash
# Search for console.log with potential sensitive data
grep -rn "console.log" --include="*.ts" --include="*.tsx" | grep -E "(user|token|session|password|email|address)"

# Search for select('*')
grep -rn "select\('\*'\)" --include="*.ts" --include="*.tsx"

# Search for unverified webhooks
grep -rn "req.json()" --include="*.ts" app/api/webhooks/
```
