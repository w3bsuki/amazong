-- Drop existing functions to recreate with fixed search_path
DROP FUNCTION IF EXISTS public.get_user_conversations(UUID);
DROP FUNCTION IF EXISTS public.get_user_conversation_ids(UUID);

-- Recreate get_user_conversations with empty search_path
CREATE FUNCTION public.get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  buyer_id UUID,
  seller_id UUID,
  product_id UUID,
  order_id UUID,
  subject VARCHAR(255),
  status VARCHAR(20),
  last_message_at TIMESTAMPTZ,
  buyer_unread_count INTEGER,
  seller_unread_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  buyer_full_name TEXT,
  buyer_avatar_url TEXT,
  seller_full_name TEXT,
  seller_avatar_url TEXT,
  store_name TEXT,
  store_slug TEXT,
  product_title TEXT,
  product_images TEXT[],
  last_message_id UUID,
  last_message_content TEXT,
  last_message_sender_id UUID,
  last_message_type VARCHAR(20),
  last_message_created_at TIMESTAMPTZ
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
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
    bp.full_name AS buyer_full_name,
    bp.avatar_url AS buyer_avatar_url,
    sp.full_name AS seller_full_name,
    sp.avatar_url AS seller_avatar_url,
    s.store_name,
    s.store_slug,
    p.title AS product_title,
    p.images AS product_images,
    lm.id AS last_message_id,
    lm.content AS last_message_content,
    lm.sender_id AS last_message_sender_id,
    lm.message_type AS last_message_type,
    lm.created_at AS last_message_created_at
  FROM public.conversations c
  LEFT JOIN public.profiles bp ON c.buyer_id = bp.id
  LEFT JOIN public.profiles sp ON c.seller_id = sp.id
  LEFT JOIN public.sellers s ON c.seller_id = s.id
  LEFT JOIN public.products p ON c.product_id = p.id
  LEFT JOIN LATERAL (
    SELECT m.id, m.content, m.sender_id, m.message_type, m.created_at
    FROM public.messages m 
    WHERE m.conversation_id = c.id 
    ORDER BY m.created_at DESC 
    LIMIT 1
  ) lm ON true
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id
  ORDER BY c.last_message_at DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_conversations(UUID) TO authenticated;

-- Recreate get_user_conversation_ids with empty search_path
CREATE FUNCTION public.get_user_conversation_ids(p_user_id UUID)
RETURNS TABLE (conversation_id UUID)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT c.id
  FROM public.conversations c
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_conversation_ids(UUID) TO authenticated;

-- Fix expire_listing_boosts
CREATE OR REPLACE FUNCTION public.expire_listing_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.products
  SET is_boosted = false, boost_expires_at = NULL, listing_type = 'normal'
  WHERE is_boosted = true AND boost_expires_at < NOW();
  
  UPDATE public.listing_boosts
  SET is_active = false
  WHERE is_active = true AND expires_at < NOW();
END;
$$;

-- Fix on_listing_boost_created trigger function
CREATE OR REPLACE FUNCTION public.on_listing_boost_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.products
  SET 
    is_boosted = true,
    boost_expires_at = NEW.expires_at,
    listing_type = 'boosted'
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;;
