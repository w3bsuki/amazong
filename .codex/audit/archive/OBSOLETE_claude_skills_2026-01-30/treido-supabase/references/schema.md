# Database Schema Conventions for Treido

## Naming Conventions

### Tables
- Plural, snake_case: `products`, `order_items`, `user_profiles`
- Junction tables: `product_categories`, `order_products`

### Columns
- snake_case: `created_at`, `seller_id`, `is_active`
- Foreign keys: `{table_singular}_id` (e.g., `product_id`, `user_id`)
- Booleans: `is_` or `has_` prefix (e.g., `is_active`, `has_verified`)
- Timestamps: `_at` suffix (e.g., `created_at`, `updated_at`, `deleted_at`)

### Indexes
- `{table}_{column}_idx`: `products_seller_id_idx`
- Composite: `{table}_{col1}_{col2}_idx`: `orders_buyer_id_status_idx`
- Unique: `{table}_{column}_key`: `users_email_key`

### Constraints
- Primary key: `{table}_pkey`
- Foreign key: `{table}_{column}_fkey`
- Check: `{table}_{column}_check`

## Standard Columns

### Every Table Should Have
```sql
create table public.example (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
```

### Soft Delete Pattern
```sql
create table public.products (
  -- ... other columns
  deleted_at timestamptz, -- NULL = not deleted
  
  -- Filter out deleted in queries by default
  constraint products_not_deleted check (
    deleted_at is null or deleted_at <= now()
  )
);

-- Index for filtering deleted
create index products_deleted_at_idx on public.products(deleted_at) 
  where deleted_at is null;
```

## Common Column Types

### IDs
```sql
id uuid primary key default gen_random_uuid()  -- Preferred
id bigint primary key generated always as identity  -- When needed
```

### Money/Price
```sql
price numeric(10,2) not null check (price >= 0)  -- 2 decimal places
amount_cents integer not null check (amount_cents >= 0)  -- Store as cents
```

### Status/Enum
```sql
-- Using check constraint (simpler)
status text not null default 'draft' 
  check (status in ('draft', 'active', 'sold', 'archived'))

-- Using enum type (stronger typing)
create type product_status as enum ('draft', 'active', 'sold', 'archived');
status product_status not null default 'draft'
```

### JSON/JSONB
```sql
-- For flexible/varying data
metadata jsonb default '{}'::jsonb
images text[] -- Array for simple lists
```

### Timestamps
```sql
created_at timestamptz default now() not null
updated_at timestamptz default now() not null
published_at timestamptz  -- Nullable for draft items
expires_at timestamptz
```

## Relationships

### One-to-Many
```sql
-- Products belong to a seller
create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade
);

create index products_seller_id_idx on public.products(seller_id);
```

### Many-to-Many
```sql
-- Products have many categories
create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create index product_categories_category_idx on public.product_categories(category_id);
```

### Self-Referencing
```sql
-- Category hierarchy
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null
);
```

## Indexes

### When to Create Indexes
1. Foreign keys (always)
2. Columns used in WHERE clauses
3. Columns used in ORDER BY
4. Columns used in JOIN conditions

### Types
```sql
-- B-tree (default, most common)
create index products_seller_id_idx on public.products(seller_id);

-- Partial (filter to subset)
create index products_active_idx on public.products(created_at desc) 
  where status = 'active';

-- Composite (multiple columns)
create index orders_user_status_idx on public.orders(user_id, status);

-- GIN for JSONB/arrays
create index products_tags_idx on public.products using gin(tags);

-- GIN for full-text search
create index products_search_idx on public.products 
  using gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
```

## Triggers

### Updated At Trigger
```sql
-- Create function once
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add to each table
create trigger set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();
```

## Treido-Specific Tables

### Core Tables
- `profiles` - User profiles (extends auth.users)
- `products` - Product listings
- `categories` - Product categories
- `orders` - Purchase orders
- `order_items` - Line items in orders
- `cart_items` - Shopping cart
- `reviews` - Product reviews
- `messages` - User messages

### Seller Tables
- `seller_profiles` - Seller-specific info
- `payouts` - Seller payouts
- `seller_stats` - Aggregated seller metrics

### System Tables
- `notifications` - User notifications
- `activity_log` - Audit trail
- `feature_flags` - Feature toggles
