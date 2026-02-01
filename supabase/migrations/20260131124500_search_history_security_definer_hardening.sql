-- SECURITY: harden SECURITY DEFINER functions (fixed search_path + auth guard)

create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

create or replace function public.cleanup_old_search_history()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
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
$$;

create or replace function public.add_search_history(
  p_user_id uuid,
  p_query text,
  p_category text default null,
  p_result_count integer default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  actual_user_id uuid;
begin
  if auth.role() = 'service_role' then
    actual_user_id := coalesce(p_user_id, auth.uid());
  else
    actual_user_id := auth.uid();
    if p_user_id is not null and p_user_id <> actual_user_id then
      raise exception 'Cannot write search history for another user';
    end if;
  end if;

  if actual_user_id is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.search_history
  where user_id = actual_user_id and lower(query) = lower(p_query);

  insert into public.search_history (user_id, query, category, result_count)
  values (actual_user_id, p_query, p_category, p_result_count);
end;
$$;
