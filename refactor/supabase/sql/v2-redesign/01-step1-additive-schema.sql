-- CATEGORY REDESIGN v2
-- Step 1: Additive schema changes only (safe forward migration).
-- Draft only. Do not run in production without approval.

begin;

-- 1a) Listing mode columns on products (keep listing_type for boost state).
alter table public.products
  add column if not exists listing_kind text not null default 'item',
  add column if not exists transaction_mode text not null default 'checkout',
  add column if not exists fulfillment_mode text not null default 'shipping',
  add column if not exists pricing_mode text not null default 'fixed';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_listing_kind_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_listing_kind_check
      check (listing_kind in ('item', 'service', 'classified'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'products_transaction_mode_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_transaction_mode_check
      check (transaction_mode in ('checkout', 'contact'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'products_fulfillment_mode_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_fulfillment_mode_check
      check (fulfillment_mode in ('shipping', 'pickup', 'digital', 'onsite'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'products_pricing_mode_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_pricing_mode_check
      check (pricing_mode in ('fixed', 'auction', 'tiered'));
  end if;
end $$;

-- 1b) Category policy columns.
alter table public.categories
  add column if not exists allowed_listing_kinds text[] not null default array['item']::text[],
  add column if not exists allowed_transaction_modes text[] not null default array['checkout']::text[],
  add column if not exists allowed_fulfillment_modes text[] not null default array['shipping']::text[],
  add column if not exists default_fulfillment_mode text not null default 'shipping';

-- 1c) Aspect model extension columns.
alter table public.category_attributes
  add column if not exists is_variation boolean not null default false,
  add column if not exists is_searchable boolean not null default true,
  add column if not exists aspect_group text,
  add column if not exists depends_on_attribute_id uuid references public.category_attributes(id) on delete set null,
  add column if not exists depends_on_values text[] not null default array[]::text[];

-- 1d) Backfill listing modes for existing products.
update public.products
set
  listing_kind = coalesce(listing_kind, 'item'),
  transaction_mode = coalesce(transaction_mode, 'checkout'),
  fulfillment_mode = coalesce(fulfillment_mode, 'shipping'),
  pricing_mode = coalesce(pricing_mode, 'fixed')
where listing_kind is distinct from 'item'
   or transaction_mode is distinct from 'checkout'
   or fulfillment_mode is distinct from 'shipping'
   or pricing_mode is distinct from 'fixed';

-- Canonical write path: product_attributes -> products.attributes (compatibility trigger).
create or replace function public.sync_product_attributes_to_jsonb()
returns trigger
language plpgsql
set search_path = 'public', 'pg_temp'
as $$
begin
  perform public.sync_product_attributes_jsonb(coalesce(new.product_id, old.product_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_product_attributes_sync_jsonb_v2 on public.product_attributes;
create trigger trg_product_attributes_sync_jsonb_v2
  after insert or update or delete on public.product_attributes
  for each row execute function public.sync_product_attributes_to_jsonb();

-- IMPORTANT:
-- v2 originally proposed dropping public.products.is_prime in Step 1.
-- Live DB currently blocks this because public.deal_products view depends on is_prime.
-- Keep is_prime in Step 1. Remove only after deal_products is updated.

commit;

-- Rollback (manual):
-- begin;
-- drop trigger if exists trg_product_attributes_sync_jsonb_v2 on public.product_attributes;
-- drop function if exists public.sync_product_attributes_to_jsonb();
-- alter table public.category_attributes
--   drop column if exists depends_on_values,
--   drop column if exists depends_on_attribute_id,
--   drop column if exists aspect_group,
--   drop column if exists is_searchable,
--   drop column if exists is_variation;
-- alter table public.categories
--   drop column if exists default_fulfillment_mode,
--   drop column if exists allowed_fulfillment_modes,
--   drop column if exists allowed_transaction_modes,
--   drop column if exists allowed_listing_kinds;
-- alter table public.products
--   drop constraint if exists products_pricing_mode_check,
--   drop constraint if exists products_fulfillment_mode_check,
--   drop constraint if exists products_transaction_mode_check,
--   drop constraint if exists products_listing_kind_check,
--   drop column if exists pricing_mode,
--   drop column if exists fulfillment_mode,
--   drop column if exists transaction_mode,
--   drop column if exists listing_kind;
-- commit;
