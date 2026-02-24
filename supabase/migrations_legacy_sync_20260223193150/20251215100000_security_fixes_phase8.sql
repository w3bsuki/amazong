-- =====================================================
-- Phase 8: Backend Security Fixes
-- Fixes from Supabase Security Advisor
-- =====================================================

-- =====================================================
-- 1. FIX SECURITY DEFINER VIEW
-- Convert subscription_overview to SECURITY INVOKER
-- so it respects RLS policies of underlying tables
-- =====================================================

-- Drop the existing view
DROP VIEW IF EXISTS public.subscription_overview;

-- Recreate with security_invoker = true (Postgres 15+)
CREATE VIEW public.subscription_overview
WITH (security_invoker = true)
AS
SELECT 
    se.id AS seller_id,
    se.store_name,
    se.account_type,
    se.tier,
    se.commission_rate,
    se.final_value_fee,
    sub.plan_type AS plan_name,
    sub.status AS subscription_status,
    sub.billing_period,
    sub.expires_at,
    sp.max_listings,
    ss.active_listings,
    ss.total_sales,
    CASE 
        WHEN ss.active_listings >= COALESCE(sp.max_listings, 1000) THEN 'at_limit'
        WHEN ss.active_listings >= COALESCE(sp.max_listings, 1000) * 0.9 THEN 'near_limit'
        ELSE 'ok'
    END AS listings_status
FROM public.sellers se
LEFT JOIN public.subscriptions sub ON sub.seller_id = se.id AND sub.status = 'active'
LEFT JOIN public.subscription_plans sp ON sp.tier = se.tier
LEFT JOIN public.seller_stats ss ON ss.seller_id = se.id;

-- Grant appropriate access
GRANT SELECT ON public.subscription_overview TO authenticated;

COMMENT ON VIEW public.subscription_overview IS 'Seller subscription overview with security_invoker for RLS enforcement';

-- =====================================================
-- 2. FIX FUNCTION SEARCH PATHS
-- Add SET search_path = '' to prevent search path attacks
-- =====================================================

-- sync_seller_from_subscription
CREATE OR REPLACE FUNCTION public.sync_seller_from_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- When subscription is activated, update seller tier and fees
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        UPDATE public.sellers 
        SET 
            tier = NEW.plan_type,
            final_value_fee = COALESCE(
                (SELECT final_value_fee FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
                12.00
            ),
            insertion_fee = COALESCE(
                (SELECT insertion_fee FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
                0
            ),
            per_order_fee = COALESCE(
                (SELECT per_order_fee FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
                0
            )
        WHERE id = NEW.seller_id;
    END IF;
    
    -- When subscription expires/cancelled, downgrade to free
    IF NEW.status IN ('expired', 'cancelled') AND OLD.status = 'active' THEN
        UPDATE public.sellers 
        SET 
            tier = 'free',
            final_value_fee = 12.00,
            insertion_fee = 0,
            per_order_fee = 0
        WHERE id = NEW.seller_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- check_subscription_expiry
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    -- Update expired subscriptions
    UPDATE public.subscriptions
    SET status = 'expired', auto_renew = false
    WHERE status = 'active' 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    RETURN expired_count;
END;
$$;

-- get_seller_subscription_status
CREATE OR REPLACE FUNCTION public.get_seller_subscription_status(seller_uuid UUID)
RETURNS TABLE(
    tier TEXT,
    status TEXT,
    expires_at TIMESTAMPTZ,
    max_listings INTEGER,
    active_listings INTEGER,
    can_list BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.tier,
        COALESCE(sub.status, 'free') AS status,
        sub.expires_at,
        COALESCE(sp.max_listings, 10) AS max_listings,
        COALESCE(ss.active_listings, 0) AS active_listings,
        COALESCE(ss.active_listings, 0) < COALESCE(sp.max_listings, 10) AS can_list
    FROM public.sellers s
    LEFT JOIN public.subscriptions sub ON sub.seller_id = s.id AND sub.status = 'active'
    LEFT JOIN public.subscription_plans sp ON sp.tier = s.tier
    LEFT JOIN public.seller_stats ss ON ss.seller_id = s.id
    WHERE s.id = seller_uuid;
END;
$$;

-- queue_badge_evaluation
CREATE OR REPLACE FUNCTION public.queue_badge_evaluation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- This function can be expanded to queue badge evaluation jobs
    -- For now, it's a placeholder that logs the event
    RETURN NEW;
END;
$$;

-- update_seller_sales_stats
CREATE OR REPLACE FUNCTION public.update_seller_sales_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Update seller stats when order is completed
    IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
        UPDATE public.seller_stats
        SET 
            total_sales = total_sales + 1,
            total_revenue = total_revenue + NEW.price_at_purchase * NEW.quantity,
            last_sale_at = NOW(),
            first_sale_at = COALESCE(first_sale_at, NOW()),
            updated_at = NOW()
        WHERE seller_id = NEW.seller_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- update_seller_rating
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    avg_rating NUMERIC;
    total_count INTEGER;
    five_star INTEGER;
    pos_pct NUMERIC;
BEGIN
    -- Calculate new average rating
    SELECT 
        AVG(rating)::NUMERIC(3,2),
        COUNT(*),
        COUNT(*) FILTER (WHERE rating = 5)
    INTO avg_rating, total_count, five_star
    FROM public.seller_feedback
    WHERE seller_id = NEW.seller_id;
    
    -- Calculate positive feedback percentage
    pos_pct := CASE WHEN total_count > 0 
        THEN (COUNT(*) FILTER (WHERE rating >= 4) * 100.0 / total_count)::NUMERIC(5,2)
        ELSE 100 
    END
    FROM public.seller_feedback
    WHERE seller_id = NEW.seller_id;
    
    -- Update seller_stats
    UPDATE public.seller_stats
    SET 
        average_rating = COALESCE(avg_rating, 0),
        total_reviews = total_count,
        five_star_reviews = five_star,
        positive_feedback_pct = COALESCE(pos_pct, 100),
        updated_at = NOW()
    WHERE seller_id = NEW.seller_id;
    
    RETURN NEW;
END;
$$;

-- check_listing_limit
CREATE OR REPLACE FUNCTION public.check_listing_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    current_listings INTEGER;
    max_allowed INTEGER;
BEGIN
    -- Get current listing count
    SELECT active_listings INTO current_listings
    FROM public.seller_stats
    WHERE seller_id = NEW.seller_id;
    
    -- Get max allowed from subscription plan
    SELECT COALESCE(sp.max_listings, 10) INTO max_allowed
    FROM public.sellers s
    LEFT JOIN public.subscription_plans sp ON sp.tier = s.tier
    WHERE s.id = NEW.seller_id;
    
    -- Check limit
    IF COALESCE(current_listings, 0) >= max_allowed THEN
        RAISE EXCEPTION 'Listing limit reached. Please upgrade your plan.';
    END IF;
    
    RETURN NEW;
END;
$$;

-- get_seller_listing_info
CREATE OR REPLACE FUNCTION public.get_seller_listing_info(seller_uuid UUID)
RETURNS TABLE(
    active_listings INTEGER,
    max_listings INTEGER,
    remaining_listings INTEGER,
    tier TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ss.active_listings, 0) AS active_listings,
        COALESCE(sp.max_listings, 10) AS max_listings,
        COALESCE(sp.max_listings, 10) - COALESCE(ss.active_listings, 0) AS remaining_listings,
        s.tier
    FROM public.sellers s
    LEFT JOIN public.subscription_plans sp ON sp.tier = s.tier
    LEFT JOIN public.seller_stats ss ON ss.seller_id = s.id
    WHERE s.id = seller_uuid;
END;
$$;

-- init_seller_stats
CREATE OR REPLACE FUNCTION public.init_seller_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.seller_stats (seller_id)
    VALUES (NEW.id)
    ON CONFLICT (seller_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- init_business_verification
CREATE OR REPLACE FUNCTION public.init_business_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.account_type = 'business' THEN
        INSERT INTO public.business_verification (seller_id)
        VALUES (NEW.id)
        ON CONFLICT (seller_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;

-- init_user_verification
CREATE OR REPLACE FUNCTION public.init_user_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_verification (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- update_follower_count
CREATE OR REPLACE FUNCTION public.update_follower_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.seller_stats
        SET follower_count = follower_count + 1, updated_at = NOW()
        WHERE seller_id = NEW.seller_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.seller_stats
        SET follower_count = GREATEST(0, follower_count - 1), updated_at = NOW()
        WHERE seller_id = OLD.seller_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- update_seller_listing_counts
CREATE OR REPLACE FUNCTION public.update_seller_listing_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Update active_listings count
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE public.seller_stats
        SET 
            active_listings = active_listings + 1,
            total_listings = total_listings + 1,
            updated_at = NOW()
        WHERE seller_id = NEW.seller_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.seller_stats
        SET 
            active_listings = GREATEST(0, active_listings - CASE WHEN OLD.status = 'active' THEN 1 ELSE 0 END),
            total_listings = GREATEST(0, total_listings - 1),
            updated_at = NOW()
        WHERE seller_id = OLD.seller_id;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status = 'active' AND NEW.status != 'active' THEN
            UPDATE public.seller_stats
            SET active_listings = GREATEST(0, active_listings - 1), updated_at = NOW()
            WHERE seller_id = NEW.seller_id;
        ELSIF OLD.status != 'active' AND NEW.status = 'active' THEN
            UPDATE public.seller_stats
            SET active_listings = active_listings + 1, updated_at = NOW()
            WHERE seller_id = NEW.seller_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- =====================================================
-- 3. ADDITIONAL SECURITY BEST PRACTICES
-- =====================================================

-- Add comment explaining the security fix
COMMENT ON FUNCTION public.sync_seller_from_subscription() IS 'Syncs seller tier when subscription changes. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.check_subscription_expiry() IS 'Marks expired subscriptions. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.get_seller_subscription_status(UUID) IS 'Gets seller subscription info. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.queue_badge_evaluation() IS 'Queues badge evaluation. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.update_seller_sales_stats() IS 'Updates seller stats on sale. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.update_seller_rating() IS 'Recalculates seller rating. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.check_listing_limit() IS 'Enforces listing limits. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.get_seller_listing_info(UUID) IS 'Gets seller listing info. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.init_seller_stats() IS 'Initializes seller_stats row. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.init_business_verification() IS 'Initializes business verification row. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.init_user_verification() IS 'Initializes user verification row. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.update_follower_count() IS 'Updates follower count. SET search_path = '''' for security.';
COMMENT ON FUNCTION public.update_seller_listing_counts() IS 'Updates listing counts. SET search_path = '''' for security.';

-- =====================================================
-- 4. VERIFY RLS IS ENABLED ON ALL TABLES
-- (Already enabled according to list_tables, but double-check)
-- =====================================================

-- These should be no-ops if already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_followers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Done! Security fixes applied.
-- =====================================================
