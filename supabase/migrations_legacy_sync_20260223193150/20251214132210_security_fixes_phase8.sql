-- Phase 8 Security Fixes

-- 1. Fix subscription_overview view with security_invoker
DROP VIEW IF EXISTS subscription_overview;

CREATE VIEW subscription_overview 
WITH (security_invoker = true)
AS
SELECT 
  s.id as subscription_id,
  s.seller_id,
  s.status,
  s.starts_at,
  s.expires_at,
  s.auto_renew,
  s.plan_type,
  sp.name as plan_name,
  sp.tier,
  sp.price_monthly,
  sp.price_yearly,
  sp.max_listings,
  sp.boosts_included,
  sp.final_value_fee,
  p.full_name,
  p.email
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_type = sp.tier
JOIN profiles p ON s.seller_id = p.id;

-- 2. Drop all functions that need changes
DROP FUNCTION IF EXISTS check_subscription_expiry();
DROP FUNCTION IF EXISTS get_seller_subscription_status(uuid);
DROP FUNCTION IF EXISTS get_seller_listing_info(uuid);

-- 3. Recreate all functions with SET search_path = ''

CREATE OR REPLACE FUNCTION sync_seller_from_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.sellers SET tier = NEW.plan_type,
    final_value_fee = (SELECT final_value_fee FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
    updated_at = NOW() WHERE id = NEW.seller_id;
  RETURN NEW;
END; $$;

CREATE FUNCTION check_subscription_expiry()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.subscriptions SET status = 'expired', auto_renew = false
  WHERE status = 'active' AND expires_at < NOW();
  UPDATE public.sellers s SET tier = 'free', final_value_fee = 0.10
  FROM public.subscriptions sub WHERE sub.seller_id = s.id AND sub.status = 'expired';
END; $$;

CREATE FUNCTION get_seller_subscription_status(seller_uuid UUID)
RETURNS TABLE(has_subscription boolean, plan_name text, tier text, status text, expires_at timestamptz, auto_renew boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  RETURN QUERY SELECT true, sp.name, sp.tier::text, s.status::text, s.expires_at, s.auto_renew
  FROM public.subscriptions s JOIN public.subscription_plans sp ON s.plan_type = sp.tier
  WHERE s.seller_id = seller_uuid AND s.status = 'active' LIMIT 1;
  IF NOT FOUND THEN RETURN QUERY SELECT false, 'Free'::text, 'free'::text, 'none'::text, NULL::timestamptz, false; END IF;
END; $$;

CREATE OR REPLACE FUNCTION queue_badge_evaluation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN PERFORM pg_notify('badge_evaluation', json_build_object('user_id', NEW.user_id)::text); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION update_seller_sales_stats()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.seller_stats SET total_sales = total_sales + NEW.total_price, total_orders = total_orders + 1, updated_at = NOW()
  WHERE seller_id = NEW.seller_id; RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE avg_rating DECIMAL(3,2); total_count INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*) INTO avg_rating, total_count FROM public.seller_feedback
  WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id);
  UPDATE public.seller_stats SET average_rating = COALESCE(avg_rating, 0), total_reviews = total_count, updated_at = NOW()
  WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id);
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE OR REPLACE FUNCTION check_listing_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE current_count INTEGER; max_allowed INTEGER;
BEGIN
  SELECT COUNT(*) INTO current_count FROM public.products WHERE seller_id = NEW.seller_id AND status = 'active';
  SELECT COALESCE(sp.max_listings, 10) INTO max_allowed FROM public.sellers s
  LEFT JOIN public.subscriptions sub ON sub.seller_id = s.id AND sub.status = 'active'
  LEFT JOIN public.subscription_plans sp ON sp.tier = sub.plan_type WHERE s.id = NEW.seller_id;
  IF current_count >= max_allowed THEN RAISE EXCEPTION 'Listing limit reached. Upgrade your plan.'; END IF;
  RETURN NEW;
END; $$;

CREATE FUNCTION get_seller_listing_info(seller_uuid UUID)
RETURNS TABLE(current_listings INTEGER, max_listings INTEGER, tier TEXT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  RETURN QUERY SELECT (SELECT COUNT(*)::INTEGER FROM public.products WHERE seller_id = seller_uuid AND status = 'active'),
    COALESCE(sp.max_listings, 10)::INTEGER, COALESCE(sp.tier, 'free')::TEXT
  FROM public.sellers s LEFT JOIN public.subscriptions sub ON sub.seller_id = s.id AND sub.status = 'active'
  LEFT JOIN public.subscription_plans sp ON sp.tier = sub.plan_type WHERE s.id = seller_uuid;
END; $$;

CREATE OR REPLACE FUNCTION init_seller_stats()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN INSERT INTO public.seller_stats (seller_id) VALUES (NEW.id) ON CONFLICT (seller_id) DO NOTHING; RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION init_business_verification()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.account_type = 'business' THEN INSERT INTO public.business_verification (seller_id) VALUES (NEW.id) ON CONFLICT (seller_id) DO NOTHING; END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION init_user_verification()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN INSERT INTO public.user_verification (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING; RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN UPDATE public.seller_stats SET follower_count = follower_count + 1 WHERE seller_id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN UPDATE public.seller_stats SET follower_count = GREATEST(follower_count - 1, 0) WHERE seller_id = OLD.seller_id;
  END IF; RETURN COALESCE(NEW, OLD);
END; $$;

CREATE OR REPLACE FUNCTION update_seller_listing_counts()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.seller_stats SET 
    active_listings = (SELECT COUNT(*) FROM public.products WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id) AND status = 'active'),
    total_listings = (SELECT COUNT(*) FROM public.products WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)),
    updated_at = NOW() WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id);
  RETURN COALESCE(NEW, OLD);
END; $$;;
