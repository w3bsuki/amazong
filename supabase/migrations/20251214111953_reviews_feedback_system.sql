-- =====================================================
-- PHASE 5: REVIEWS & FEEDBACK SYSTEM
-- Date: 2025-12-14
-- Purpose: Add RPC functions, triggers, and indexes for reviews and seller feedback
-- =====================================================

-- =====================================================
-- PART 1: INCREMENT HELPFUL COUNT RPC FUNCTION
-- Used by reviews-section.tsx for helpful vote functionality
-- =====================================================

-- Drop existing function first if it exists
DROP FUNCTION IF EXISTS public.increment_helpful_count(UUID);

-- Create function to increment helpful count atomically
CREATE OR REPLACE FUNCTION public.increment_helpful_count(review_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.reviews
  SET helpful_count = COALESCE(helpful_count, 0) + 1
  WHERE id = review_id
  RETURNING helpful_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_helpful_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_helpful_count(UUID) TO anon;

-- =====================================================
-- PART 2: REVIEWS TABLE ENHANCEMENTS
-- =====================================================

-- Add unique constraint to prevent duplicate reviews per product/user
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reviews_user_product_unique'
  ) THEN
    ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_user_product_unique UNIQUE (user_id, product_id);
  END IF;
END $$;

-- Add indexes for common queries if they don't exist
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count ON public.reviews(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_purchase ON public.reviews(verified_purchase) WHERE verified_purchase = true;

-- =====================================================
-- PART 3: SELLER FEEDBACK TRIGGER FOR seller_stats
-- Automatically update seller_stats when feedback changes
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_seller_stats_from_feedback()
RETURNS trigger AS $$
DECLARE
  target_seller_id UUID;
  total_feedback INTEGER;
  avg_rating NUMERIC;
  positive_count INTEGER;
  item_described_count INTEGER;
  shipping_speed_count INTEGER;
  communication_count INTEGER;
BEGIN
  -- Determine the seller_id to update
  target_seller_id := COALESCE(NEW.seller_id, OLD.seller_id);
  
  -- Calculate aggregated stats from seller_feedback
  SELECT 
    COUNT(*),
    COALESCE(AVG(rating), 0),
    COUNT(*) FILTER (WHERE rating >= 4),
    COUNT(*) FILTER (WHERE item_as_described = true),
    COUNT(*) FILTER (WHERE shipping_speed = true),
    COUNT(*) FILTER (WHERE communication = true)
  INTO 
    total_feedback,
    avg_rating,
    positive_count,
    item_described_count,
    shipping_speed_count,
    communication_count
  FROM public.seller_feedback
  WHERE seller_id = target_seller_id;

  -- Update seller_stats with calculated values
  INSERT INTO public.seller_stats (
    seller_id,
    total_reviews,
    average_rating,
    positive_feedback_pct,
    item_described_pct,
    shipping_speed_pct,
    communication_pct,
    updated_at
  ) VALUES (
    target_seller_id,
    total_feedback,
    ROUND(avg_rating::numeric, 1),
    CASE WHEN total_feedback > 0 THEN ROUND((positive_count::numeric / total_feedback) * 100, 0) ELSE 100 END,
    CASE WHEN total_feedback > 0 THEN ROUND((item_described_count::numeric / total_feedback) * 100, 0) ELSE 100 END,
    CASE WHEN total_feedback > 0 THEN ROUND((shipping_speed_count::numeric / total_feedback) * 100, 0) ELSE 100 END,
    CASE WHEN total_feedback > 0 THEN ROUND((communication_count::numeric / total_feedback) * 100, 0) ELSE 100 END,
    NOW()
  )
  ON CONFLICT (seller_id) DO UPDATE SET
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    positive_feedback_pct = EXCLUDED.positive_feedback_pct,
    item_described_pct = EXCLUDED.item_described_pct,
    shipping_speed_pct = EXCLUDED.shipping_speed_pct,
    communication_pct = EXCLUDED.communication_pct,
    updated_at = EXCLUDED.updated_at;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create/replace trigger for seller_feedback
DROP TRIGGER IF EXISTS update_seller_stats_on_feedback ON public.seller_feedback;
CREATE TRIGGER update_seller_stats_on_feedback
  AFTER INSERT OR UPDATE OR DELETE ON public.seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_stats_from_feedback();

-- =====================================================
-- PART 4: REVIEW NOTIFICATIONS TRIGGER
-- Notify seller when they receive a new product review
-- =====================================================

CREATE OR REPLACE FUNCTION public.on_review_notify()
RETURNS trigger AS $$
DECLARE
  seller_id_var UUID;
  product_title TEXT;
BEGIN
  -- Only trigger on new reviews
  IF TG_OP = 'INSERT' THEN
    -- Get the seller_id and product title
    SELECT p.seller_id, p.title 
    INTO seller_id_var, product_title
    FROM public.products p
    WHERE p.id = NEW.product_id;
    
    -- Create notification for the seller
    IF seller_id_var IS NOT NULL THEN
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        body,
        product_id,
        data,
        created_at
      ) VALUES (
        seller_id_var,
        'review',
        'New ' || NEW.rating || '-star review',
        'Someone left a ' || NEW.rating || '-star review on "' || LEFT(product_title, 50) || CASE WHEN LENGTH(product_title) > 50 THEN '...' ELSE '' END || '"',
        NEW.product_id,
        jsonb_build_object(
          'rating', NEW.rating,
          'review_id', NEW.id,
          'verified_purchase', NEW.verified_purchase
        ),
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create/replace trigger for reviews
DROP TRIGGER IF EXISTS on_review_notify_trigger ON public.reviews;
CREATE TRIGGER on_review_notify_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.on_review_notify();

-- =====================================================
-- PART 5: SELLER FEEDBACK NOTIFICATIONS TRIGGER
-- Notify seller when they receive new feedback
-- =====================================================

CREATE OR REPLACE FUNCTION public.on_seller_feedback_notify()
RETURNS trigger AS $$
BEGIN
  -- Only trigger on new feedback
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      body,
      data,
      created_at
    ) VALUES (
      NEW.seller_id,
      'review',
      'New ' || NEW.rating || '-star feedback',
      CASE 
        WHEN NEW.comment IS NOT NULL AND LENGTH(NEW.comment) > 0 
        THEN 'A buyer left ' || NEW.rating || '-star feedback: "' || LEFT(NEW.comment, 80) || CASE WHEN LENGTH(NEW.comment) > 80 THEN '...' ELSE '' END || '"'
        ELSE 'A buyer left ' || NEW.rating || '-star feedback for your store'
      END,
      jsonb_build_object(
        'rating', NEW.rating,
        'feedback_id', NEW.id,
        'item_as_described', NEW.item_as_described,
        'shipping_speed', NEW.shipping_speed,
        'communication', NEW.communication
      ),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create/replace trigger for seller_feedback notifications
DROP TRIGGER IF EXISTS on_seller_feedback_notify_trigger ON public.seller_feedback;
CREATE TRIGGER on_seller_feedback_notify_trigger
  AFTER INSERT ON public.seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.on_seller_feedback_notify();

-- =====================================================
-- PART 6: ADDITIONAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Seller feedback indexes
CREATE INDEX IF NOT EXISTS idx_seller_feedback_created_desc ON public.seller_feedback(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_rating ON public.reviews(product_id, rating);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_seller_rating ON public.seller_feedback(seller_id, rating);

-- =====================================================
-- PART 7: FIVE STAR REVIEW TRACKING
-- Update five_star_reviews count in seller_stats
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_seller_five_star_count()
RETURNS trigger AS $$
DECLARE
  seller_id_var UUID;
  five_star_count INTEGER;
BEGIN
  -- Get seller_id from product
  SELECT p.seller_id INTO seller_id_var
  FROM public.products p
  WHERE p.id = COALESCE(NEW.product_id, OLD.product_id);
  
  IF seller_id_var IS NOT NULL THEN
    -- Count five-star reviews for this seller's products
    SELECT COUNT(*) INTO five_star_count
    FROM public.reviews r
    JOIN public.products p ON p.id = r.product_id
    WHERE p.seller_id = seller_id_var AND r.rating = 5;
    
    -- Update seller_stats
    UPDATE public.seller_stats
    SET five_star_reviews = five_star_count,
        updated_at = NOW()
    WHERE seller_id = seller_id_var;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for five-star tracking
DROP TRIGGER IF EXISTS update_seller_five_star_on_review ON public.reviews;
CREATE TRIGGER update_seller_five_star_on_review
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_five_star_count();

-- =====================================================
-- DONE
-- =====================================================

COMMENT ON FUNCTION public.increment_helpful_count(UUID) IS 'Atomically increment the helpful_count for a review';
COMMENT ON FUNCTION public.update_seller_stats_from_feedback() IS 'Update seller_stats when seller_feedback is modified';
COMMENT ON FUNCTION public.on_review_notify() IS 'Create notification for seller when new review is posted';
COMMENT ON FUNCTION public.on_seller_feedback_notify() IS 'Create notification for seller when new feedback is received';
COMMENT ON FUNCTION public.update_seller_five_star_count() IS 'Update five-star review count in seller_stats';;
