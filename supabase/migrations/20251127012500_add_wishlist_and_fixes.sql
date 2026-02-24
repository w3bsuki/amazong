-- =============================================
-- WISHLIST TABLE
-- =============================================
create table if not exists public.wishlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

comment on table public.wishlists is 'User wishlist/saved items for later purchase';

-- Enable RLS
alter table public.wishlists enable row level security;

-- RLS Policies for Wishlist
create policy "Users can view their own wishlist"
  on public.wishlists for select
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own wishlist"
  on public.wishlists for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can remove from their own wishlist"
  on public.wishlists for delete
  using ((select auth.uid()) = user_id);

-- Indexes for wishlist performance
create index if not exists idx_wishlists_user_id on public.wishlists(user_id);
create index if not exists idx_wishlists_product_id on public.wishlists(product_id);

-- =============================================
-- FIX: Function search_path mutable
-- =============================================
-- Drop and recreate function with search_path set
drop function if exists public.ensure_single_primary_image cascade;

create or replace function public.ensure_single_primary_image()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_primary then
    update public.product_images
    set is_primary = false
    where product_id = new.product_id
      and id != new.id
      and is_primary = true;
  end if;
  return new;
end;
$$;

-- Recreate trigger
create trigger ensure_single_primary
  before insert or update on public.product_images
  for each row execute procedure public.ensure_single_primary_image();

-- =============================================
-- FIX: RLS Policies with select wrapper for auth functions
-- =============================================
-- Fix product_images policies
drop policy if exists "Sellers can insert their product images" on public.product_images;
drop policy if exists "Sellers can update their product images" on public.product_images;
drop policy if exists "Sellers can delete their product images" on public.product_images;

create policy "Sellers can insert their product images"
  on public.product_images for insert
  with check (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and products.seller_id = (select auth.uid())
    )
  );

create policy "Sellers can update their product images"
  on public.product_images for update
  using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and products.seller_id = (select auth.uid())
    )
  );

create policy "Sellers can delete their product images"
  on public.product_images for delete
  using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and products.seller_id = (select auth.uid())
    )
  );

-- =============================================
-- REVIEWS: Add helpful_count and title columns if not exists
-- =============================================
alter table public.reviews add column if not exists title text;
alter table public.reviews add column if not exists helpful_count integer default 0;;
