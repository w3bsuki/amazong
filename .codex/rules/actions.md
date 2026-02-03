---
paths:
  - "app/actions/**/*.ts"
---

# Server Action Rules (Auto-Applied)

These rules apply automatically when editing any file in `app/actions/`.

## Security Invariants

### 1. Always Verify User
```tsx
'use server';

export async function anyMutation(input: unknown) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };  // ✅
    // throw new Error('Unauthorized'); // Also acceptable
  }
  
  // ... rest of action
}
```

### 2. Always Validate Input
```tsx
import { z } from 'zod';

const Schema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export async function action(input: unknown) {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  // Types now guaranteed
  const { id, quantity } = parsed.data;
}
```

### 3. Never Trust Incoming IDs
```tsx
// ❌ WRONG - trusts client-provided userId
await supabase.from('products').delete().eq('seller_id', input.userId);

// ✅ CORRECT - uses verified user
await supabase.from('products').delete()
  .eq('id', input.productId)
  .eq('seller_id', user.id);  // from getUser()
```

### 4. Return Structured Response
```tsx
// ✅ Typed return
type ActionResult<T> = { data: T } | { error: string };

export async function action(): Promise<ActionResult<Product>> {
  // ...
  if (error) return { error: 'Failed to save' };
  return { data: product };
}
```

## Logging Invariants

```tsx
// ✅ Safe to log
console.log('Processing order:', orderId);
console.log('User action:', user.id, 'type:', actionType);

// ❌ NEVER log
console.log('User data:', user);           // PII
console.log('Request headers:', headers);   // Secrets
console.log('Order details:', orderData);   // Customer info
```

## Client Selection

| Situation | Use |
|-----------|-----|
| User mutation | `createClient()` |
| Never in actions | `createStaticClient()` (for cached reads only) |
| Webhook only | `createAdminClient()` (with explicit guard) |

## Verification

See `docs/WORKFLOW.md` for the standard gate checklist.
