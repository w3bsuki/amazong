-- =====================================================
-- SECURITY FIX: Lock down SECURITY DEFINER RPCs
-- Date: 2026-01-30
-- Purpose:
--   - Prevent horizontal access by ignoring/guarding caller-supplied user IDs
--   - Ensure EXECUTE is not granted to PUBLIC/anon by default
-- =====================================================

-- Wishlist sharing: require auth.uid() (allow admin/service_role override explicitly)
create or replace function public.enable_wishlist_sharing(p_user_id uuid default null)
returns table(share_token varchar(32), share_url text) as $$
declare
  actual_user_id uuid;
  share_token varchar(32);
begin
  actual_user_id := auth.uid();

  if auth.role() = 'service_role' and p_user_id is not null then
    actual_user_id := p_user_id;
  elsif public.is_admin() and p_user_id is not null then
    actual_user_id := p_user_id;
  end if;

  if actual_user_id is null then
    raise exception 'User not authenticated';
  end if;

  -- Preserve existing token when present (stable share URLs)
  select w.share_token
  into share_token
  from public.wishlists w
  where w.user_id = actual_user_id and w.share_token is not null
  limit 1;

  if share_token is null then
    share_token := public.generate_share_token();
  end if;

  update public.wishlists
  set
    share_token = share_token,
    is_public = true
  where user_id = actual_user_id;

  return query
  select
    share_token as share_token,
    '/wishlist/shared/' || share_token as share_url;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

create or replace function public.disable_wishlist_sharing(p_user_id uuid default null)
returns void as $$
declare
  actual_user_id uuid;
begin
  actual_user_id := auth.uid();

  if auth.role() = 'service_role' and p_user_id is not null then
    actual_user_id := p_user_id;
  elsif public.is_admin() and p_user_id is not null then
    actual_user_id := p_user_id;
  end if;

  if actual_user_id is null then
    raise exception 'User not authenticated';
  end if;

  update public.wishlists
  set
    is_public = false
  where user_id = actual_user_id;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.enable_wishlist_sharing(uuid) from public;
revoke all on function public.enable_wishlist_sharing(uuid) from anon;
grant execute on function public.enable_wishlist_sharing(uuid) to authenticated;
grant execute on function public.enable_wishlist_sharing(uuid) to service_role;

revoke all on function public.disable_wishlist_sharing(uuid) from public;
revoke all on function public.disable_wishlist_sharing(uuid) from anon;
grant execute on function public.disable_wishlist_sharing(uuid) to authenticated;
grant execute on function public.disable_wishlist_sharing(uuid) to service_role;

-- Chat: ignore caller-supplied user ID by default; lock down privileges
create or replace function public.get_user_conversations(p_user_id uuid)
returns table (
  id uuid,
  buyer_id uuid,
  seller_id uuid,
  product_id uuid,
  order_id uuid,
  subject character varying,
  status character varying,
  last_message_at timestamptz,
  buyer_unread_count integer,
  seller_unread_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  buyer_full_name text,
  buyer_avatar_url text,
  seller_full_name text,
  seller_avatar_url text,
  store_name text,
  store_slug text,
  product_title text,
  product_images text[],
  last_message_id uuid,
  last_message_content text,
  last_message_sender_id uuid,
  last_message_type character varying,
  last_message_created_at timestamptz
)
language sql
security definer
set search_path = public, pg_temp
as $$
  with target as (
    select
      case
        when auth.role() = 'service_role' and p_user_id is not null then p_user_id
        when public.is_admin() and p_user_id is not null then p_user_id
        else auth.uid()
      end as user_id
  )
  select
    c.id,
    c.buyer_id,
    c.seller_id,
    c.product_id,
    c.order_id,
    c.subject,
    c.status,
    c.last_message_at,
    c.buyer_unread_count,
    c.seller_unread_count,
    c.created_at,
    c.updated_at,
    bp.full_name as buyer_full_name,
    bp.avatar_url as buyer_avatar_url,
    sp.full_name as seller_full_name,
    sp.avatar_url as seller_avatar_url,
    coalesce(sp.display_name, sp.business_name, sp.username, sp.full_name) as store_name,
    sp.username as store_slug,
    p.title as product_title,
    p.images as product_images,
    lm.id as last_message_id,
    lm.content as last_message_content,
    lm.sender_id as last_message_sender_id,
    lm.message_type as last_message_type,
    lm.created_at as last_message_created_at
  from public.conversations c
  left join public.profiles bp on c.buyer_id = bp.id
  left join public.profiles sp on c.seller_id = sp.id
  left join public.products p on c.product_id = p.id
  left join lateral (
    select m.id, m.content, m.sender_id, m.message_type, m.created_at
    from public.messages m
    where m.conversation_id = c.id
    order by m.created_at desc
    limit 1
  ) lm on true
  cross join target t
  where t.user_id is not null and (c.buyer_id = t.user_id or c.seller_id = t.user_id)
  order by c.last_message_at desc nulls last;
$$;

create or replace function public.get_user_conversation_ids(p_user_id uuid)
returns table (conversation_id uuid)
language sql
security definer
set search_path = public, pg_temp
as $$
  with target as (
    select
      case
        when auth.role() = 'service_role' and p_user_id is not null then p_user_id
        when public.is_admin() and p_user_id is not null then p_user_id
        else auth.uid()
      end as user_id
  )
  select c.id as conversation_id
  from public.conversations c
  cross join target t
  where t.user_id is not null and (c.buyer_id = t.user_id or c.seller_id = t.user_id);
$$;

revoke all on function public.get_user_conversations(uuid) from public;
revoke all on function public.get_user_conversations(uuid) from anon;
grant execute on function public.get_user_conversations(uuid) to authenticated;
grant execute on function public.get_user_conversations(uuid) to service_role;

revoke all on function public.get_user_conversation_ids(uuid) from public;
revoke all on function public.get_user_conversation_ids(uuid) from anon;
grant execute on function public.get_user_conversation_ids(uuid) to authenticated;
grant execute on function public.get_user_conversation_ids(uuid) to service_role;
;
