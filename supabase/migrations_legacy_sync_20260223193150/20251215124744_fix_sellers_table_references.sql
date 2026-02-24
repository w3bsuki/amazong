-- =====================================================
-- FIX: Replace references to public.sellers with public.profiles
-- Date: 2025-12-15
-- Purpose: The sellers table was merged into profiles
-- These functions still reference the non-existent sellers table
-- =====================================================

-- 1. Fix get_seller_stats function
CREATE OR REPLACE FUNCTION public.get_seller_stats(target_seller_id uuid DEFAULT NULL)
RETURNS TABLE(
  seller_id uuid,
  store_name text,
  product_count bigint,
  order_count bigint,
  total_revenue numeric,
  avg_product_rating numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as seller_id,
    COALESCE(p.display_name, p.business_name, p.username, p.full_name) as store_name,
    COUNT(DISTINCT pr.id) as product_count,
    COUNT(DISTINCT oi.order_id) as order_count,
    COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) as total_revenue,
    COALESCE(AVG(pr.rating), 0) as avg_product_rating
  FROM public.profiles p
  LEFT JOIN public.products pr ON pr.seller_id = p.id
  LEFT JOIN public.order_items oi ON oi.seller_id = p.id
  WHERE (target_seller_id IS NULL OR p.id = target_seller_id)
    AND p.is_seller = true
  GROUP BY p.id, p.display_name, p.business_name, p.username, p.full_name;
END;
$function$;

-- 2. Fix sync_seller_from_subscription function
CREATE OR REPLACE FUNCTION public.sync_seller_from_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    tier = NEW.plan_type,
    final_value_fee = (SELECT final_value_fee FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
    updated_at = NOW() 
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$function$;

-- 3. Fix get_user_conversations function
CREATE OR REPLACE FUNCTION public.get_user_conversations(p_user_id uuid)
RETURNS TABLE(
  id uuid,
  buyer_id uuid,
  seller_id uuid,
  product_id uuid,
  order_id uuid,
  subject character varying,
  status character varying,
  last_message_at timestamp with time zone,
  buyer_unread_count integer,
  seller_unread_count integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
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
  last_message_created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    COALESCE(sp.display_name, sp.business_name, sp.username, sp.full_name) AS store_name,
    sp.username AS store_slug,
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
$function$;

-- 4. Fix check_subscription_expiry function
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Mark expired subscriptions
  UPDATE public.subscriptions 
  SET status = 'expired', auto_renew = false
  WHERE status = 'active' AND expires_at < NOW();
  
  -- Reset seller tier to free when subscription expires
  UPDATE public.profiles p 
  SET tier = 'free', final_value_fee = 12.00
  FROM public.subscriptions sub 
  WHERE sub.seller_id = p.id AND sub.status = 'expired';
END;
$function$;

-- 5. Fix get_seller_listing_info function
CREATE OR REPLACE FUNCTION public.get_seller_listing_info(seller_uuid uuid)
RETURNS TABLE(current_listings integer, max_listings integer, tier text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY 
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.products WHERE seller_id = seller_uuid AND status = 'active'),
    COALESCE(sp.max_listings, 10)::INTEGER,
    COALESCE(sp.tier, 'free')::TEXT
  FROM public.profiles p 
  LEFT JOIN public.subscriptions sub ON sub.seller_id = p.id AND sub.status = 'active'
  LEFT JOIN public.subscription_plans sp ON sp.tier = sub.plan_type 
  WHERE p.id = seller_uuid;
END;
$function$;

-- 6. Fix check_listing_limit function
CREATE OR REPLACE FUNCTION public.check_listing_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE 
  current_count INTEGER; 
  max_allowed INTEGER;
BEGIN
  SELECT COUNT(*) INTO current_count 
  FROM public.products 
  WHERE seller_id = NEW.seller_id AND status = 'active';
  
  SELECT COALESCE(sp.max_listings, 10) INTO max_allowed 
  FROM public.profiles p
  LEFT JOIN public.subscriptions sub ON sub.seller_id = p.id AND sub.status = 'active'
  LEFT JOIN public.subscription_plans sp ON sp.tier = sub.plan_type 
  WHERE p.id = NEW.seller_id;
  
  -- Default to 10 if no profile found
  IF max_allowed IS NULL THEN
    max_allowed := 10;
  END IF;
  
  IF current_count >= max_allowed THEN 
    RAISE EXCEPTION 'Listing limit reached. Upgrade your plan.'; 
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Verify no more references to public.sellers
-- SELECT proname FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
-- WHERE n.nspname = 'public' AND prosrc LIKE '%public.sellers%';;
