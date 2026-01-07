# Supabase Tasks (run via Supabase MCP)

## P0 — Make `/categories/[slug]` fast + correct (category ancestry)

### 0) Quick sanity checks

```sql
-- How many products have a category but no ancestry cached?
select
  count(*) filter (where category_id is not null) as with_category,
  count(*) filter (where category_id is not null and category_ancestors is null) as missing_ancestors
from public.products;

-- Spot-check a few products
select id, category_id, category_ancestors
from public.products
where category_id is not null
order by updated_at desc
limit 20;
```

### 1) Backfill `products.category_ancestors`

```sql
update public.products
set category_ancestors = public.get_category_ancestor_ids(category_id)
where category_id is not null
  and (category_ancestors is null or array_length(category_ancestors, 1) is null);
```

### 2) Keep `category_ancestors` correct on insert/update

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

### 3) Index for `category_ancestors` queries

```sql
-- NOTE: CONCURRENTLY cannot run inside a transaction.
create index concurrently if not exists products_category_ancestors_gin
on public.products
using gin (category_ancestors);
```

### 4) Optional: index `categories.parent_id` (descendant traversal)

```sql
create index concurrently if not exists categories_parent_id_idx
on public.categories (parent_id);
```

