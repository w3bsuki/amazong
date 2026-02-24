-- Enable RLS for sellers (already enabled in schema, but good to ensure)
alter table public.sellers enable row level security;

-- Allow public read access to sellers
create policy "Sellers are viewable by everyone." 
on public.sellers for select 
using (true);

-- Allow authenticated users to create a seller profile (store)
create policy "Users can create their own seller profile." 
on public.sellers for insert 
with check (auth.uid() = id);

-- Allow sellers to update their own profile
create policy "Sellers can update their own profile." 
on public.sellers for update 
using (auth.uid() = id);
