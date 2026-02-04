# rls.md — Row Level Security Deep Dive

> Comprehensive RLS patterns for Treido marketplace.

## RLS Fundamentals

### Enable RLS (REQUIRED for all tables)

```sql
-- Enable on table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owner (recommended)
ALTER TABLE products FORCE ROW LEVEL SECURITY;
```

### Policy structure

```sql
CREATE POLICY "policy_name"
ON table_name
FOR operation  -- SELECT, INSERT, UPDATE, DELETE, ALL
TO role        -- public, authenticated, anon, service_role
USING (...)    -- Read filter (SELECT, UPDATE, DELETE)
WITH CHECK (...);  -- Write filter (INSERT, UPDATE)
```

## Common Patterns

### Pattern 1: Public Read

```sql
-- Anyone can read
CREATE POLICY "Public read"
ON products FOR SELECT
TO public
USING (true);

-- Anyone can read active only
CREATE POLICY "Public read active"
ON products FOR SELECT
TO public
USING (status = 'active');
```

### Pattern 2: Owner Access

```sql
-- Owner can read own data
CREATE POLICY "Owner read"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Owner can write own data
CREATE POLICY "Owner write"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Owner full access
CREATE POLICY "Owner all"
ON orders FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Pattern 3: Role-Based

```sql
-- Admin can do anything
CREATE POLICY "Admin full access"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Seller can manage own products
CREATE POLICY "Seller manage products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('seller', 'admin')
    AND (products.seller_id = auth.uid() OR profiles.role = 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('seller', 'admin')
  )
);
```

### Pattern 4: Relational Access

```sql
-- User can see orders for products they bought
CREATE POLICY "Buyer see order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Seller can see order items for their products
CREATE POLICY "Seller see order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = order_items.product_id
    AND products.seller_id = auth.uid()
  )
);
```

### Pattern 5: Time-Based

```sql
-- Can only edit within 24 hours of creation
CREATE POLICY "Edit within 24h"
ON orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id AND
  created_at > now() - interval '24 hours'
);

-- Can only delete drafts
CREATE POLICY "Delete drafts only"
ON products FOR DELETE
TO authenticated
USING (
  auth.uid() = seller_id AND
  status = 'draft'
);
```

## Treido-Specific Policies

### Products table

```sql
-- Anyone can view active products
CREATE POLICY "Public view active products"
ON products FOR SELECT
TO public
USING (status = 'active');

-- Seller can view all own products
CREATE POLICY "Seller view own products"
ON products FOR SELECT
TO authenticated
USING (seller_id = auth.uid());

-- Seller can insert products
CREATE POLICY "Seller insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  seller_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('seller', 'admin')
  )
);

-- Seller can update own products
CREATE POLICY "Seller update own products"
ON products FOR UPDATE
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (seller_id = auth.uid());

-- Seller can delete own draft products
CREATE POLICY "Seller delete draft products"
ON products FOR DELETE
TO authenticated
USING (
  seller_id = auth.uid() AND
  status = 'draft'
);
```

### Orders table

```sql
-- Buyer can view own orders
CREATE POLICY "Buyer view orders"
ON orders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Seller can view orders containing their products
CREATE POLICY "Seller view orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM order_items
    JOIN products ON products.id = order_items.product_id
    WHERE order_items.order_id = orders.id
    AND products.seller_id = auth.uid()
  )
);

-- Users can create orders
CREATE POLICY "User create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Only system can update orders (via service role)
-- No UPDATE policy for authenticated = users can't modify orders
```

### Messages table (chat)

```sql
-- Can read messages in conversations you're part of
CREATE POLICY "Read own conversations"
ON messages FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid() OR
  receiver_id = auth.uid()
);

-- Can send messages to anyone
CREATE POLICY "Send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

-- Can delete own sent messages within 5 minutes
CREATE POLICY "Delete recent messages"
ON messages FOR DELETE
TO authenticated
USING (
  sender_id = auth.uid() AND
  created_at > now() - interval '5 minutes'
);
```

## Performance Considerations

### Index for RLS

```sql
-- Index helps RLS policy evaluation
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite index for common query + RLS
CREATE INDEX idx_products_seller_status ON products(seller_id, status);
```

### Avoid expensive subqueries

```sql
-- ❌ SLOW: Subquery runs for every row
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ✅ FASTER: Use function with security definer
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Then in policy
USING (is_admin() OR seller_id = auth.uid());
```

## Debugging RLS

### Check if RLS is enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### List policies

```sql
SELECT *
FROM pg_policies
WHERE tablename = 'products';
```

### Test as specific user

```sql
-- Set role to test
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "user-uuid-here"}';

-- Run query
SELECT * FROM products;

-- Reset
RESET ROLE;
```

## Common Mistakes

```sql
-- ❌ WRONG: Missing WITH CHECK on INSERT
CREATE POLICY "Insert"
ON products FOR INSERT
TO authenticated
USING (seller_id = auth.uid());  -- USING doesn't work for INSERT!

-- ✅ RIGHT: Use WITH CHECK for INSERT
CREATE POLICY "Insert"
ON products FOR INSERT
TO authenticated
WITH CHECK (seller_id = auth.uid());


-- ❌ WRONG: Forgot to enable RLS
CREATE TABLE secrets (...);
CREATE POLICY "Owner only" ON secrets ...;
-- Table is still public!

-- ✅ RIGHT: Always enable RLS
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;


-- ❌ WRONG: Policy allows bypass via NULL
USING (seller_id = auth.uid());
-- If seller_id is NULL, auth.uid() = NULL is false but...

-- ✅ RIGHT: Handle NULLs explicitly
USING (seller_id IS NOT NULL AND seller_id = auth.uid());
```
