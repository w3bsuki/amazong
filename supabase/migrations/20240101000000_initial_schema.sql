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

-- SELLERS (Store details for users with role 'seller')
create table public.sellers (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  store_name text unique not null,
  description text,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  parent_id uuid references public.categories(id),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.sellers(id) not null,
  category_id uuid references public.categories(id),
  title text not null,
  description text,
  price decimal(10, 2) not null,
  list_price decimal(10, 2), -- For strike-through pricing
  stock integer default 0 not null,
  images text[] default '{}', -- Array of image URLs
  rating decimal(3, 2) default 0,
  review_count integer default 0,
  is_prime boolean default false,
  search_vector tsvector, -- For Full Text Search
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  total_amount decimal(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  seller_id uuid references public.sellers(id) not null,
  quantity integer not null,
  price_at_purchase decimal(10, 2) not null
);

-- RLS POLICIES (Basic Security)
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Products: Public read, Seller update
create policy "Products are viewable by everyone." on public.products for select using (true);
create policy "Sellers can insert products." on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products." on public.products for update using (auth.uid() = seller_id);

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
