# supabase.md — Supabase Client Setup

> Client configuration and common patterns for Treido.

## Client Files

### Server Client (lib/supabase/server.ts)

```tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  );
}
```

### Browser Client (lib/supabase/client.ts)

```tsx
import { createBrowserClient as createClient } from '@supabase/ssr';

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Service Client (lib/supabase/service.ts)

```tsx
import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

## When to Use Each Client

| Scenario | Client |
|----------|--------|
| Server Component data fetch | `createClient()` |
| Server Action | `createClient()` |
| API Route | `createClient()` |
| Client Component | `createBrowserClient()` |
| Webhook handler | `createServiceClient()` |
| Admin operation | `createServiceClient()` |

## Query Patterns

### Pagination

```tsx
async function getProducts(page = 1, pageSize = 20) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to);
  
  return {
    data,
    total: count,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}
```

### Search with filters

```tsx
async function searchProducts({
  query,
  category,
  minPrice,
  maxPrice,
  sortBy = 'created_at',
  sortOrder = 'desc',
}) {
  const supabase = await createClient();
  
  let queryBuilder = supabase
    .from('products')
    .select('*, seller:profiles(name)')
    .eq('status', 'active');
  
  if (query) {
    queryBuilder = queryBuilder.textSearch('name', query);
  }
  
  if (category) {
    queryBuilder = queryBuilder.eq('category_id', category);
  }
  
  if (minPrice !== undefined) {
    queryBuilder = queryBuilder.gte('price', minPrice);
  }
  
  if (maxPrice !== undefined) {
    queryBuilder = queryBuilder.lte('price', maxPrice);
  }
  
  return queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });
}
```

### Real-time subscriptions

```tsx
'use client';

useEffect(() => {
  const supabase = createBrowserClient();
  
  const channel = supabase
    .channel('order-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Order updated:', payload.new);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);
```

### Transactions (using RPC)

```sql
-- Create function
CREATE OR REPLACE FUNCTION transfer_funds(
  from_user UUID,
  to_user UUID,
  amount DECIMAL
) RETURNS void AS $$
BEGIN
  UPDATE wallets SET balance = balance - amount WHERE user_id = from_user;
  UPDATE wallets SET balance = balance + amount WHERE user_id = to_user;
END;
$$ LANGUAGE plpgsql;
```

```tsx
const { error } = await supabase.rpc('transfer_funds', {
  from_user: fromUserId,
  to_user: toUserId,
  amount: 100.00,
});
```

## Error Handling

```tsx
async function getProduct(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    // Other errors
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
}
```

### Common error codes

| Code | Meaning |
|------|---------|
| PGRST116 | No rows returned (single) |
| 23505 | Unique violation |
| 23503 | Foreign key violation |
| 42501 | RLS policy violation |

## Type Safety

### Generate types

```bash
pnpm supabase gen types typescript --local > lib/database.types.ts
```

### Use in client

```tsx
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';

// Types are inferred automatically
const { data } = await supabase
  .from('products')
  .select('*');
// data: Database['public']['Tables']['products']['Row'][]
```

### Type helpers

```tsx
import type { Database } from '@/lib/database.types';

type Tables = Database['public']['Tables'];

export type Product = Tables['products']['Row'];
export type ProductInsert = Tables['products']['Insert'];
export type ProductUpdate = Tables['products']['Update'];
```
