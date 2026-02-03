---
paths:
  - "app/api/**/*.ts"
---

# API Route Rules (Auto-Applied)

These rules apply automatically when editing any file in `app/api/`.

## Webhook Invariants

### Stripe Webhooks MUST:

```tsx
export async function POST(request: NextRequest) {
  // 1. Get signature
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }
  
  // 2. Verify signature
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // 3. Check idempotency
  const supabase = await createAdminClient();  // Webhooks = admin context
  const { data: existing } = await supabase
    .from('processed_events')
    .select('id')
    .eq('event_id', event.id)
    .single();
    
  if (existing) {
    return NextResponse.json({ status: 'already_processed' });
  }
  
  // 4. Store event ID before processing
  await supabase.from('processed_events').insert({ event_id: event.id });
  
  // 5. Process event
  // ...
  
  // 6. Return 200 quickly
  return NextResponse.json({ received: true });
}
```

### Webhook DON'Ts

❌ Never skip signature verification
❌ Never process without idempotency check
❌ Never log raw event payload (PII)
❌ Never block response with heavy processing

## Public API Routes

```tsx
export async function GET(request: NextRequest) {
  // 1. Validate input
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  
  // 2. Fetch data
  const supabase = createStaticClient();  // Public read = static client
  const { data, error } = await supabase
    .from('products')
    .select('id, title, price')
    .eq('id', id)
    .single();
    
  // 3. Handle errors
  if (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // 4. Return data
  return NextResponse.json(data);
}
```

## Auth-Protected Routes

```tsx
export async function POST(request: NextRequest) {
  // 1. Get user from cookies
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. Process with user context
  // ...
}
```

## Response Pattern

```tsx
// Success
return NextResponse.json({ data: result });
return NextResponse.json({ data: result }, { status: 201 });  // Created

// Error
return NextResponse.json({ error: 'message' }, { status: 400 });  // Bad request
return NextResponse.json({ error: 'message' }, { status: 401 });  // Unauthorized
return NextResponse.json({ error: 'message' }, { status: 404 });  // Not found
return NextResponse.json({ error: 'message' }, { status: 500 });  // Server error
```

## Verification

See `docs/WORKFLOW.md` for the standard gate checklist.
