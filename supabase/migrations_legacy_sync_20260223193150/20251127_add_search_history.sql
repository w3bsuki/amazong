-- User Search History Table
-- This table stores user search queries for personalized search suggestions
-- Each user can have up to 50 recent searches stored

create table public.search_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  query text not null,
  category text, -- optional: the category filter used with this search
  result_count integer, -- optional: how many results were returned
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for fast lookups
create index idx_search_history_user_id on public.search_history(user_id);
create index idx_search_history_created_at on public.search_history(created_at desc);
create index idx_search_history_user_query on public.search_history(user_id, query);

-- Enable RLS
alter table public.search_history enable row level security;

-- RLS Policies: Users can only see and manage their own search history
create policy "Users can view own search history"
  on public.search_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own search history"
  on public.search_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own search history"
  on public.search_history for delete
  using (auth.uid() = user_id);

-- Function to clean up old search history entries (keeps only 50 most recent per user)
create or replace function public.cleanup_old_search_history()
returns trigger as $$
begin
  -- Delete old entries if user has more than 50 searches
  delete from public.search_history
  where user_id = NEW.user_id
  and id not in (
    select id from public.search_history
    where user_id = NEW.user_id
    order by created_at desc
    limit 50
  );
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to automatically clean up old search history
create trigger cleanup_search_history
  after insert on public.search_history
  for each row execute procedure public.cleanup_old_search_history();

-- Create a function to add search and avoid duplicates (updates timestamp if same query exists)
create or replace function public.add_search_history(
  p_user_id uuid,
  p_query text,
  p_category text default null,
  p_result_count integer default null
)
returns void as $$
begin
  -- First, try to delete any existing entry with the same query
  delete from public.search_history
  where user_id = p_user_id and lower(query) = lower(p_query);
  
  -- Then insert the new entry (this moves it to the top)
  insert into public.search_history (user_id, query, category, result_count)
  values (p_user_id, p_query, p_category, p_result_count);
end;
$$ language plpgsql security definer;

-- Popular/Trending Searches View (aggregated, anonymous)
create or replace view public.trending_searches as
select 
  lower(query) as query,
  count(*) as search_count
from public.search_history
where created_at > now() - interval '7 days'
group by lower(query)
order by search_count desc
limit 20;

-- Grant access to the view (public, anonymous data)
grant select on public.trending_searches to anon, authenticated;
