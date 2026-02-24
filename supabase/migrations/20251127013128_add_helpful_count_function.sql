-- Function to increment helpful count for reviews
create or replace function public.increment_helpful_count(review_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reviews
  set helpful_count = coalesce(helpful_count, 0) + 1
  where id = review_id;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.increment_helpful_count(uuid) to authenticated;;
