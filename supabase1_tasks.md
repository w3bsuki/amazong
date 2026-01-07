# Supabase Tasks (mobile tabs/category products)

## Goal
Ensure category-filtered product queries work (mobile tabs + category pages rely on `products.category_ancestors`).

## 0) Sanity checks
```sql
-- How many products have category_id but missing category_ancestors?
select
  count(*) filter (where category_id is not null) as with_category,
  count(*) filter (where category_id is not null and category_ancestors is null) as missing_ancestors
from public.products;

-- Spot-check recent products
select id, category_id, category_ancestors
from public.products
where category_id is not null
order by updated_at desc
limit 20;
```

## 1) Backfill category_ancestors
```sql
update public.products
set category_ancestors = public.get_category_ancestor_ids(category_id)
where category_id is not null
  and (category_ancestors is null or array_length(category_ancestors, 1) is null);
```

## 2) Ensure trigger keeps ancestors updated
```sql
create or replace function public.set_product_category_ancestors()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is null then
    new.category_ancestors := null;
  else
    new.category_ancestors := public.get_category_ancestor_ids(new.category_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_products_category_ancestors on public.products;

create trigger trg_products_category_ancestors
before insert or update of category_id on public.products
for each row
execute function public.set_product_category_ancestors();
```

## 3) Index for fast lookups
```sql
-- NOTE: CONCURRENTLY cannot run inside a transaction.
create index concurrently if not exists products_category_ancestors_gin
on public.products
using gin (category_ancestors);
```

## 4) Quick verification
```sql
-- Replace 'mens' with a real category slug to confirm results are non-zero.
select count(*)
from public.products p
where p.category_ancestors @> array[(
  select c.id from public.categories c where c.slug = 'mens' limit 1
)]::uuid[];
```
