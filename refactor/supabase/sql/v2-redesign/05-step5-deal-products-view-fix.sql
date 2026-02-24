-- CATEGORY REDESIGN v2
-- Step 5: deal_products compatibility fix + products.is_prime removal.
-- Draft only. Do not run in production without approval.

begin;

-- 5a) Must DROP then CREATE (CREATE OR REPLACE cannot remove columns from a view).
drop view if exists public.deal_products;
create view public.deal_products as
select
  p.id,
  p.seller_id,
  p.category_id,
  p.category_ancestors,
  p.title,
  p.description,
  p.price,
  p.list_price,
  p.stock,
  p.images,
  p.rating,
  p.review_count,
  p.search_vector,
  p.created_at,
  p.updated_at,
  p.tags,
  p.meta_title,
  p.meta_description,
  p.slug,
  p.brand_id,
  p.is_boosted,
  p.boost_expires_at,
  p.is_featured,
  p.listing_type,
  p.ships_to_bulgaria,
  p.ships_to_europe,
  p.ships_to_usa,
  p.ships_to_worldwide,
  p.pickup_only,
  p.attributes,
  p.ships_to_uk,
  p.status,
  p.weight,
  p.weight_unit,
  p.condition,
  p.track_inventory,
  p.is_on_sale,
  p.sale_percent,
  p.sale_end_date,
  p.free_shipping,
  p.is_limited_stock,
  p.stock_quantity,
  p.featured_until,
  p.shipping_days,
  case
    when p.is_on_sale and p.sale_percent > 0 then p.sale_percent
    when p.list_price is not null and p.list_price > p.price
      then round((p.list_price - p.price) / p.list_price * 100::numeric)::integer
    else 0
  end as effective_discount
from public.products p
where (
    p.is_on_sale = true
    and p.sale_percent > 0
    and (p.sale_end_date is null or p.sale_end_date > now())
  )
  or (
    p.list_price is not null
    and p.list_price > p.price
  )
order by
  case
    when p.is_on_sale and p.sale_percent > 0 then p.sale_percent
    when p.list_price is not null and p.list_price > p.price
      then round((p.list_price - p.price) / p.list_price * 100::numeric)::integer
    else 0
  end desc;

-- 5b) Drop deprecated products.is_prime column.
alter table public.products
  drop column if exists is_prime;

commit;

-- Rollback (manual):
-- begin;
-- alter table public.products
--   add column if not exists is_prime boolean default false;
--
-- create or replace view public.deal_products as
-- select
--   p.id,
--   p.seller_id,
--   p.category_id,
--   p.category_ancestors,
--   p.title,
--   p.description,
--   p.price,
--   p.list_price,
--   p.stock,
--   p.images,
--   p.rating,
--   p.review_count,
--   p.is_prime,
--   p.search_vector,
--   p.created_at,
--   p.updated_at,
--   p.tags,
--   p.meta_title,
--   p.meta_description,
--   p.slug,
--   p.brand_id,
--   p.is_boosted,
--   p.boost_expires_at,
--   p.is_featured,
--   p.listing_type,
--   p.ships_to_bulgaria,
--   p.ships_to_europe,
--   p.ships_to_usa,
--   p.ships_to_worldwide,
--   p.pickup_only,
--   p.attributes,
--   p.ships_to_uk,
--   p.status,
--   p.weight,
--   p.weight_unit,
--   p.condition,
--   p.track_inventory,
--   p.is_on_sale,
--   p.sale_percent,
--   p.sale_end_date,
--   p.free_shipping,
--   p.is_limited_stock,
--   p.stock_quantity,
--   p.featured_until,
--   p.shipping_days,
--   case
--     when p.is_on_sale and p.sale_percent > 0 then p.sale_percent
--     when p.list_price is not null and p.list_price > p.price
--       then round((p.list_price - p.price) / p.list_price * 100::numeric)::integer
--     else 0
--   end as effective_discount
-- from public.products p
-- where (
--     p.is_on_sale = true
--     and p.sale_percent > 0
--     and (p.sale_end_date is null or p.sale_end_date > now())
--   )
--   or (
--     p.list_price is not null
--     and p.list_price > p.price
--   )
-- order by
--   case
--     when p.is_on_sale and p.sale_percent > 0 then p.sale_percent
--     when p.list_price is not null and p.list_price > p.price
--       then round((p.list_price - p.price) / p.list_price * 100::numeric)::integer
--     else 0
--   end desc;
-- commit;
