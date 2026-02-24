-- Backend production hardening (2026-01-30)
-- 1) Tighten RLS policy roles from PUBLIC to authenticated
-- 2) Remove anon EXECUTE on write RPC `increment_helpful_count`

-- 1) RLS: policy role tightening (defense-in-depth)
do $$
begin
  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_update_own'
  ) then
    execute 'alter policy "orders_update_own" on public.orders to authenticated;';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'order_items_insert_with_order'
  ) then
    execute 'alter policy "order_items_insert_with_order" on public.order_items to authenticated;';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'sellers_update_own_order_items'
  ) then
    execute 'alter policy "sellers_update_own_order_items" on public.order_items to authenticated;';
  end if;
end
$$;

-- 2) Reviews: remove anon write amplification surface
do $$
begin
  if to_regprocedure('public.increment_helpful_count(uuid)') is not null then
    revoke execute on function public.increment_helpful_count(uuid) from anon;
    grant execute on function public.increment_helpful_count(uuid) to authenticated;
    grant execute on function public.increment_helpful_count(uuid) to service_role;
    grant execute on function public.increment_helpful_count(uuid) to postgres;
  end if;
end
$$;
