-- Phase 14: Update follower count trigger to also update buyer_stats.stores_following
-- This ensures both seller and buyer stats are properly maintained when following/unfollowing

CREATE OR REPLACE FUNCTION public.update_follower_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN 
    -- Update seller follower count
    UPDATE public.seller_stats SET follower_count = follower_count + 1 WHERE seller_id = NEW.seller_id;
    -- Update buyer stores following count (upsert to handle new buyers)
    INSERT INTO public.buyer_stats (user_id, stores_following)
    VALUES (NEW.follower_id, 1)
    ON CONFLICT (user_id) DO UPDATE SET 
      stores_following = buyer_stats.stores_following + 1,
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN 
    -- Update seller follower count
    UPDATE public.seller_stats SET follower_count = GREATEST(follower_count - 1, 0) WHERE seller_id = OLD.seller_id;
    -- Update buyer stores following count
    UPDATE public.buyer_stats SET 
      stores_following = GREATEST(stores_following - 1, 0),
      updated_at = NOW()
    WHERE user_id = OLD.follower_id;
  END IF; 
  RETURN COALESCE(NEW, OLD);
END; $function$;

-- Add comment for documentation
COMMENT ON FUNCTION public.update_follower_count() IS 
  'Updates both seller_stats.follower_count and buyer_stats.stores_following when follows change';
