-- =====================================================
-- FIX: Auto-evaluate badges on key events
-- Date: 2025-12-13
-- Purpose: Trigger badge evaluation when stats change
-- =====================================================

-- Step 1: Create function to queue badge evaluation
CREATE OR REPLACE FUNCTION public.queue_badge_evaluation()
RETURNS TRIGGER AS $$
BEGIN
  -- This function marks that badge evaluation is needed
  -- The actual evaluation happens via API call to avoid complex logic in trigger
  
  -- Update the updated_at to signal evaluation needed
  IF TG_TABLE_NAME = 'seller_stats' THEN
    -- Stats changed - badges may need update
    UPDATE public.seller_stats
    SET updated_at = NOW()
    WHERE seller_id = NEW.seller_id;
  ELSIF TG_TABLE_NAME = 'user_verification' THEN
    -- Verification changed - update trust score
    UPDATE public.user_verification
    SET 
      trust_score = (
        CASE WHEN NEW.email_verified THEN 10 ELSE 0 END +
        CASE WHEN NEW.phone_verified THEN 15 ELSE 0 END +
        CASE WHEN NEW.id_verified THEN 20 ELSE 0 END +
        CASE WHEN NEW.address_verified THEN 5 ELSE 0 END
      ),
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'business_verification' THEN
    -- Business verification changed - update level
    UPDATE public.business_verification
    SET 
      verification_level = (
        CASE WHEN NEW.vat_verified THEN 2 ELSE 0 END +
        CASE WHEN NEW.registration_verified THEN 2 ELSE 0 END +
        CASE WHEN NEW.bank_verified THEN 1 ELSE 0 END
      ),
      updated_at = NOW()
    WHERE seller_id = NEW.seller_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create triggers for badge evaluation
DROP TRIGGER IF EXISTS queue_badge_eval_stats ON public.seller_stats;
CREATE TRIGGER queue_badge_eval_stats
  AFTER UPDATE OF total_sales, average_rating, total_reviews ON public.seller_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_badge_evaluation();

DROP TRIGGER IF EXISTS queue_badge_eval_user_verification ON public.user_verification;
CREATE TRIGGER queue_badge_eval_user_verification
  AFTER UPDATE OF email_verified, phone_verified, id_verified, address_verified ON public.user_verification
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_badge_evaluation();

DROP TRIGGER IF EXISTS queue_badge_eval_business_verification ON public.business_verification;
CREATE TRIGGER queue_badge_eval_business_verification
  AFTER UPDATE OF vat_verified, registration_verified, bank_verified ON public.business_verification
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_badge_evaluation();

-- Step 3: Create function to update sales stats when order completes
CREATE OR REPLACE FUNCTION public.update_seller_sales_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when order status changes to 'delivered'
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    -- Update each seller's stats from this order
    UPDATE public.seller_stats ss
    SET 
      total_sales = total_sales + oi.quantity,
      total_revenue = total_revenue + (oi.price_at_purchase * oi.quantity),
      last_sale_at = NOW(),
      first_sale_at = COALESCE(first_sale_at, NOW()),
      updated_at = NOW()
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND ss.seller_id = oi.seller_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger for order completion
DROP TRIGGER IF EXISTS update_seller_sales_on_order ON public.orders;
CREATE TRIGGER update_seller_sales_on_order
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_sales_stats();

-- Step 5: Create function to update seller rating when feedback is added
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating NUMERIC;
  v_total_reviews INTEGER;
  v_five_star INTEGER;
  v_positive_pct NUMERIC;
BEGIN
  -- Calculate new averages
  SELECT 
    AVG(rating)::NUMERIC(3,2),
    COUNT(*),
    COUNT(*) FILTER (WHERE rating = 5),
    (COUNT(*) FILTER (WHERE rating >= 4)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC(5,2)
  INTO v_avg_rating, v_total_reviews, v_five_star, v_positive_pct
  FROM public.seller_feedback
  WHERE seller_id = NEW.seller_id;
  
  -- Update seller_stats
  UPDATE public.seller_stats
  SET 
    average_rating = COALESCE(v_avg_rating, 0),
    total_reviews = v_total_reviews,
    five_star_reviews = v_five_star,
    positive_feedback_pct = COALESCE(v_positive_pct, 100),
    updated_at = NOW()
  WHERE seller_id = NEW.seller_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger for seller feedback
DROP TRIGGER IF EXISTS update_seller_rating_trigger ON public.seller_feedback;
CREATE TRIGGER update_seller_rating_trigger
  AFTER INSERT OR UPDATE OF rating ON public.seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_rating();

COMMENT ON FUNCTION public.update_seller_sales_stats() IS 'Updates seller sales statistics when an order is delivered';
COMMENT ON FUNCTION public.update_seller_rating() IS 'Updates seller rating statistics when feedback is added';;
