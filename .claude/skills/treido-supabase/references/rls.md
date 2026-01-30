# Row Level Security (RLS) Reference for Treido

## RLS Fundamentals

### Always Enable RLS
```sql
-- Every table with user data MUST have RLS enabled
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;
```

### Policy Operations
- `select` - Read rows
- `insert` - Create new rows
- `update` - Modify existing rows
- `delete` - Remove rows
- `all` - All operations (use sparingly)

### USING vs WITH CHECK
- `using` - Filters which rows can be accessed (SELECT, UPDATE, DELETE)
- `with check` - Validates data on write (INSERT, UPDATE)

```sql
-- USING: "Which rows can this user see/modify?"
create policy "Users see own data"
  on public.profiles for select
  using (auth.uid() = user_id);

-- WITH CHECK: "Can this data be written?"
create policy "Users insert own data"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- UPDATE needs both
create policy "Users update own data"
  on public.profiles for update
  using (auth.uid() = user_id)      -- Can only update own rows
  with check (auth.uid() = user_id); -- Must still be own row after update
```

## Common Patterns

### Public Read, Owner Write
```sql
-- Anyone can view
create policy "Public products are visible"
  on public.products for select
  using (status = 'active');

-- Only owner can modify
create policy "Sellers manage own products"
  on public.products for all
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);
```

### Row-Level Ownership
```sql
-- Orders visible only to buyer or seller
create policy "Order participants can view"
  on public.orders for select
  using (
    auth.uid() = buyer_id or 
    auth.uid() = seller_id
  );
```

### Role-Based Access
```sql
-- Check user role from profiles table
create policy "Admins can view all"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Or using a separate roles table
create policy "Moderators can update"
  on public.products for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role in ('admin', 'moderator')
    )
  );
```

### Soft Delete Protection
```sql
-- Prevent hard deletes, only allow soft delete
create policy "No hard deletes"
  on public.products for delete
  using (false); -- Nobody can delete

create policy "Users can soft delete own products"
  on public.products for update
  using (auth.uid() = seller_id)
  with check (
    auth.uid() = seller_id and
    -- Can only change status to 'archived'
    (status = 'archived' or status = old.status)
  );
```

### Time-Based Access
```sql
-- Only access recent data
create policy "Recent orders visible"
  on public.orders for select
  using (
    auth.uid() = buyer_id and
    created_at > now() - interval '1 year'
  );
```

## Performance Considerations

### Index Columns Used in Policies
```sql
-- If policy checks seller_id, index it
create index products_seller_id_idx on public.products(seller_id);

-- If policy checks status, index it
create index products_status_idx on public.products(status);
```

### Avoid Complex Subqueries
```sql
-- ❌ Slow - subquery runs for every row
create policy "Slow policy"
  on public.products for select
  using (
    seller_id in (
      select user_id from public.verified_sellers
      where verified_at is not null
    )
  );

-- ✅ Better - use exists with indexed lookup
create policy "Fast policy"
  on public.products for select
  using (
    exists (
      select 1 from public.verified_sellers
      where user_id = products.seller_id
      and verified_at is not null
    )
  );
```

### Use Security Definer Functions for Complex Logic
```sql
-- Create a security definer function
create or replace function public.is_seller_verified(seller_uuid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.verified_sellers
    where user_id = seller_uuid and verified_at is not null
  )
$$;

-- Use in policy
create policy "Only verified sellers"
  on public.products for insert
  with check (
    public.is_seller_verified(auth.uid())
  );
```

## Testing RLS Policies

### Test as Specific User
```sql
-- In SQL editor, test as a specific user
set role authenticated;
set request.jwt.claim.sub = 'user-uuid-here';

-- Run your query
select * from public.products;

-- Reset
reset role;
```

### Common Test Cases
1. Unauthenticated user can only see public data
2. Authenticated user can only see/modify own data
3. Admin can access everything
4. Soft-deleted rows are hidden
5. Cross-user access is blocked

## Debugging RLS Issues

### Check Active Policies
```sql
select * from pg_policies where tablename = 'products';
```

### Enable RLS Logging (Development Only)
```sql
-- See which policy matched
set log_statement = 'all';
set log_min_messages = 'debug5';
```

### Common Mistakes
1. Forgetting to enable RLS on new tables
2. Using `all` operation when you need specific ones
3. Missing `with check` on UPDATE policies
4. Not indexing columns used in policy conditions
5. Complex subqueries causing slow queries
