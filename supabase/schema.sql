-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- For fuzzy search

-- PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  parent_id uuid references public.categories(id),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) not null,
  category_id uuid references public.categories(id),
  title text not null,
  description text,
  price decimal(10, 2) not null,
  list_price decimal(10, 2), -- For strike-through pricing
  stock integer default 0 not null,
  images text[] default '{}', -- Array of image URLs
  rating decimal(3, 2) default 0,
  review_count integer default 0,
  search_vector tsvector, -- For Full Text Search
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  total_amount decimal(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  seller_id uuid references public.profiles(id) not null,
  quantity integer not null,
  price_at_purchase decimal(10, 2) not null
);

-- RLS POLICIES (Comprehensive Security)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Helper function for Admin check
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- PROFILES
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- CATEGORIES
create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Admins can insert categories." on public.categories for insert with check (public.is_admin());
create policy "Admins can update categories." on public.categories for update using (public.is_admin());
create policy "Admins can delete categories." on public.categories for delete using (public.is_admin());

-- PRODUCTS
create policy "Products are viewable by everyone." on public.products for select using (true);
create policy "Sellers can insert products." on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products." on public.products for update using (auth.uid() = seller_id);
create policy "Sellers can delete own products." on public.products for delete using (auth.uid() = seller_id);

-- REVIEWS
create policy "Reviews are viewable by everyone." on public.reviews for select using (true);
create policy "Users can insert reviews." on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews." on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews." on public.reviews for delete using (auth.uid() = user_id);

-- ORDERS
create policy "Users can view own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders." on public.orders for insert with check (auth.uid() = user_id);

-- ORDER ITEMS
create policy "Users can view own order items." on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Sellers can view order items for their products." on public.order_items for select using (
  seller_id = auth.uid()
);

-- INDEXES for Performance
create index if not exists idx_products_seller_id on public.products(seller_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_seller_id on public.order_items(seller_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- SECURITY: Protect sensitive columns from updates
create or replace function public.protect_sensitive_columns()
returns trigger as $$
begin
  -- Protect 'role' in profiles
  if TG_TABLE_NAME = 'profiles' then
    if new.role is distinct from old.role then
      raise exception 'You cannot change your own role.';
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger protect_profiles_update
  before update on public.profiles
  for each row execute procedure public.protect_sensitive_columns();

-- FULL TEXT SEARCH TRIGGER
-- Automatically update search_vector on insert/update
create function public.handle_new_product_search()
returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
  return new;
end;
$$ language plpgsql;

create trigger on_product_created
  before insert or update on public.products
  for each row execute procedure public.handle_new_product_search();
