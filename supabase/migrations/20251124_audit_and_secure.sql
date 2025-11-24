-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
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
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- SELLERS
drop policy if exists "Sellers are viewable by everyone." on public.sellers;
drop policy if exists "Users can create their own seller profile." on public.sellers;
drop policy if exists "Sellers can update their own profile." on public.sellers;

create policy "Sellers are viewable by everyone." on public.sellers for select using (true);
create policy "Users can create their own seller profile." on public.sellers for insert with check (auth.uid() = id);
create policy "Sellers can update their own profile." on public.sellers for update using (auth.uid() = id);

-- CATEGORIES
drop policy if exists "Categories are viewable by everyone." on public.categories;
drop policy if exists "Admins can insert categories." on public.categories;
drop policy if exists "Admins can update categories." on public.categories;
drop policy if exists "Admins can delete categories." on public.categories;

create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Admins can insert categories." on public.categories for insert with check (public.is_admin());
create policy "Admins can update categories." on public.categories for update using (public.is_admin());
create policy "Admins can delete categories." on public.categories for delete using (public.is_admin());

-- PRODUCTS
drop policy if exists "Products are viewable by everyone." on public.products;
drop policy if exists "Sellers can insert products." on public.products;
drop policy if exists "Sellers can update own products." on public.products;
drop policy if exists "Sellers can delete own products." on public.products;

create policy "Products are viewable by everyone." on public.products for select using (true);
create policy "Sellers can insert products." on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products." on public.products for update using (auth.uid() = seller_id);
create policy "Sellers can delete own products." on public.products for delete using (auth.uid() = seller_id);

-- REVIEWS
drop policy if exists "Reviews are viewable by everyone." on public.reviews;
drop policy if exists "Users can insert reviews." on public.reviews;
drop policy if exists "Users can update own reviews." on public.reviews;
drop policy if exists "Users can delete own reviews." on public.reviews;

create policy "Reviews are viewable by everyone." on public.reviews for select using (true);
create policy "Users can insert reviews." on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews." on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews." on public.reviews for delete using (auth.uid() = user_id);

-- ORDERS
drop policy if exists "Users can view own orders." on public.orders;
drop policy if exists "Users can insert own orders." on public.orders;
drop policy if exists "Users can update own orders." on public.orders; -- e.g. cancel

create policy "Users can view own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders." on public.orders for insert with check (auth.uid() = user_id);
-- Optional: Allow users to cancel (update status) if pending?
-- create policy "Users can update own orders." on public.orders for update using (auth.uid() = user_id);

-- ORDER ITEMS
drop policy if exists "Users can view own order items." on public.order_items;
drop policy if exists "Sellers can view order items for their products." on public.order_items;

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
  
  -- Protect 'verified' in sellers
  if TG_TABLE_NAME = 'sellers' then
    if new.verified is distinct from old.verified then
      raise exception 'You cannot verify your own store.';
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

drop trigger if exists protect_profiles_update on public.profiles;
create trigger protect_profiles_update
  before update on public.profiles
  for each row execute procedure public.protect_sensitive_columns();

drop trigger if exists protect_sellers_update on public.sellers;
create trigger protect_sellers_update
  before update on public.sellers
  for each row execute procedure public.protect_sensitive_columns();
