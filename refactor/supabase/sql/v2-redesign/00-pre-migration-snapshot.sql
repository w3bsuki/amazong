-- CATEGORY REDESIGN v2
-- Step 0: Pre-migration snapshot safety net.
-- Draft only. Do not run in production without approval.

begin;

create schema if not exists migration_backups;

create table if not exists migration_backups.v2_category_redesign_products_category_snapshot (
  snapshot_at timestamptz not null,
  product_id uuid not null,
  category_id uuid,
  category_slug text,
  primary key (snapshot_at, product_id)
);

create table if not exists migration_backups.v2_category_redesign_category_attributes_active_snapshot (
  snapshot_at timestamptz not null,
  category_attribute_id uuid not null,
  row_data jsonb not null,
  primary key (snapshot_at, category_attribute_id)
);

create table if not exists migration_backups.v2_category_redesign_categories_snapshot (
  snapshot_at timestamptz not null,
  category_id uuid not null,
  row_data jsonb not null,
  primary key (snapshot_at, category_id)
);

do $$
declare
  v_snapshot_at timestamptz := now();
begin
  -- products.category_id mapping snapshot
  insert into migration_backups.v2_category_redesign_products_category_snapshot (
    snapshot_at,
    product_id,
    category_id,
    category_slug
  )
  select
    v_snapshot_at,
    p.id,
    p.category_id,
    c.slug
  from public.products p
  left join public.categories c on c.id = p.category_id;

  -- active category_attributes full rows snapshot
  insert into migration_backups.v2_category_redesign_category_attributes_active_snapshot (
    snapshot_at,
    category_attribute_id,
    row_data
  )
  select
    v_snapshot_at,
    ca.id,
    to_jsonb(ca)
  from public.category_attributes ca
  where coalesce(ca.is_active, true);

  -- categories full rows snapshot
  insert into migration_backups.v2_category_redesign_categories_snapshot (
    snapshot_at,
    category_id,
    row_data
  )
  select
    v_snapshot_at,
    c.id,
    to_jsonb(c)
  from public.categories c;
end $$;

commit;

-- Restore helpers (manual):
-- 1) products -> category_id mapping
--    update public.products p
--    set category_id = s.category_id
--    from migration_backups.v2_category_redesign_products_category_snapshot s
--    where s.snapshot_at = :snapshot_at
--      and s.product_id = p.id;
-- 2) categories/category_attributes restore should be done from row_data jsonb using explicit reviewed scripts.
