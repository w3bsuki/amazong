-- Canonical per-order fulfillment status derived from order_items.status
-- This avoids UI drift (orders.status remains payment/order lifecycle).

alter table public.orders
  add column if not exists fulfillment_status text not null default 'pending';

-- Optional: index for filtering (safe even if not used yet)
create index if not exists orders_fulfillment_status_idx
  on public.orders (fulfillment_status);

-- Recompute fulfillment status for a single order_id
create or replace function public.recompute_order_fulfillment_status(p_order_id uuid)
returns void
language plpgsql
as $$
declare
  v_total int;
  v_delivered int;
  v_shipped_or_delivered int;
  v_processingish int;
  v_cancelled int;
begin
  select
    count(*),
    count(*) filter (where status = 'delivered'),
    count(*) filter (where status in ('shipped','delivered')),
    count(*) filter (where status in ('received','processing')),
    count(*) filter (where status = 'cancelled')
  into v_total, v_delivered, v_shipped_or_delivered, v_processingish, v_cancelled
  from public.order_items
  where order_id = p_order_id;

  -- If no items (should be rare), keep pending.
  if v_total = 0 then
    update public.orders
      set fulfillment_status = 'pending'
    where id = p_order_id;
    return;
  end if;

  -- All cancelled
  if v_cancelled = v_total then
    update public.orders
      set fulfillment_status = 'cancelled'
    where id = p_order_id;
    return;
  end if;

  -- All delivered
  if v_delivered = v_total then
    update public.orders
      set fulfillment_status = 'delivered'
    where id = p_order_id;
    return;
  end if;

  -- Some shipped/delivered
  if v_shipped_or_delivered > 0 then
    if v_shipped_or_delivered = v_total then
      update public.orders
        set fulfillment_status = 'shipped'
      where id = p_order_id;
    else
      update public.orders
        set fulfillment_status = 'partially_shipped'
      where id = p_order_id;
    end if;
    return;
  end if;

  -- Some received/processing
  if v_processingish > 0 then
    update public.orders
      set fulfillment_status = 'processing'
    where id = p_order_id;
    return;
  end if;

  -- Default
  update public.orders
    set fulfillment_status = 'pending'
  where id = p_order_id;
end;
$$;

-- Trigger to keep orders.fulfillment_status in sync
create or replace function public.trg_recompute_order_fulfillment_status()
returns trigger
language plpgsql
as $$
begin
  perform public.recompute_order_fulfillment_status(coalesce(new.order_id, old.order_id));
  return null;
end;
$$;

drop trigger if exists order_items_recompute_order_fulfillment_status on public.order_items;
create trigger order_items_recompute_order_fulfillment_status
after insert or update of status or delete
on public.order_items
for each row
execute function public.trg_recompute_order_fulfillment_status();

-- Backfill for existing orders
update public.orders o
set fulfillment_status = 'pending'
where o.fulfillment_status is null;

-- Recompute all orders based on existing order_items
do $$
declare r record;
begin
  for r in (select distinct order_id from public.order_items) loop
    perform public.recompute_order_fulfillment_status(r.order_id);
  end loop;
end $$;
;
