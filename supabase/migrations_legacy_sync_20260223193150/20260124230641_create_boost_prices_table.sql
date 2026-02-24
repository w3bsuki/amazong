-- Create boost_prices config table (missing in current DB)

create table if not exists public.boost_prices (
  id uuid primary key default gen_random_uuid(),
  duration_days integer not null,
  price numeric(10, 2) not null,
  currency text not null default 'EUR',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.boost_prices enable row level security;

-- Only allow reads of active prices.
drop policy if exists "Anyone can view boost prices" on public.boost_prices;
create policy "Anyone can view boost prices"
  on public.boost_prices for select
  using (is_active = true);

-- Prevent accidental DML access from anon/authenticated.
revoke all on table public.boost_prices from public, anon, authenticated;

-- Allow public reads (used by /api/boost/checkout GET which uses anon key).
grant select on table public.boost_prices to anon, authenticated;

-- Seed v1 EUR pricing (aligned with DEFAULT_BOOST_PRICING).
insert into public.boost_prices (duration_days, price, currency, is_active)
values
  (1, 0.99, 'EUR', true),
  (7, 4.99, 'EUR', true),
  (30, 14.99, 'EUR', true);

-- Guardrail: only one active price per duration.
create unique index if not exists idx_boost_prices_duration_days_active
  on public.boost_prices (duration_days)
  where is_active = true;
;
