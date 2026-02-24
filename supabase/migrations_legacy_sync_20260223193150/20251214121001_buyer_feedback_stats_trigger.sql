-- =====================================================
-- BUYER FEEDBACK STATISTICS TRIGGER
-- Updates buyer_stats when a seller rates a buyer
-- This enables the buyer reputation system
-- =====================================================

-- Function to update buyer stats when seller leaves feedback
CREATE OR REPLACE FUNCTION public.update_buyer_stats_from_feedback()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_avg NUMERIC;
  new_total INT;
BEGIN
  -- Calculate new average rating for this buyer
  SELECT 
    AVG(rating)::NUMERIC(3,2),
    COUNT(*)::INT
  INTO new_avg, new_total
  FROM buyer_feedback
  WHERE buyer_id = NEW.buyer_id;

  -- Update buyer_stats with new rating
  UPDATE buyer_stats
  SET 
    average_rating = COALESCE(new_avg, 0),
    total_ratings = COALESCE(new_total, 0),
    updated_at = NOW()
  WHERE user_id = NEW.buyer_id;

  -- If no buyer_stats row exists, create one
  IF NOT FOUND THEN
    INSERT INTO buyer_stats (user_id, average_rating, total_ratings, updated_at)
    VALUES (NEW.buyer_id, COALESCE(new_avg, 0), COALESCE(new_total, 0), NOW());
  END IF;

  RETURN NEW;
END;
$$;

-- Function to recalculate on update
CREATE OR REPLACE FUNCTION public.update_buyer_stats_on_feedback_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_avg NUMERIC;
  new_total INT;
  target_buyer_id UUID;
BEGIN
  -- Handle both UPDATE and DELETE
  target_buyer_id := COALESCE(NEW.buyer_id, OLD.buyer_id);

  SELECT 
    AVG(rating)::NUMERIC(3,2),
    COUNT(*)::INT
  INTO new_avg, new_total
  FROM buyer_feedback
  WHERE buyer_id = target_buyer_id;

  UPDATE buyer_stats
  SET 
    average_rating = COALESCE(new_avg, 0),
    total_ratings = COALESCE(new_total, 0),
    updated_at = NOW()
  WHERE user_id = target_buyer_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS on_buyer_feedback_insert ON buyer_feedback;
DROP TRIGGER IF EXISTS on_buyer_feedback_update ON buyer_feedback;
DROP TRIGGER IF EXISTS on_buyer_feedback_delete ON buyer_feedback;

CREATE TRIGGER on_buyer_feedback_insert
  AFTER INSERT ON buyer_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_stats_from_feedback();

CREATE TRIGGER on_buyer_feedback_update
  AFTER UPDATE OF rating ON buyer_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_stats_on_feedback_update();

CREATE TRIGGER on_buyer_feedback_delete
  AFTER DELETE ON buyer_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_stats_on_feedback_update();

-- Add unique constraint to prevent duplicate feedback per order
ALTER TABLE buyer_feedback
ADD CONSTRAINT buyer_feedback_unique_per_order 
UNIQUE NULLS NOT DISTINCT (seller_id, buyer_id, order_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_buyer_id ON buyer_feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_seller_id ON buyer_feedback(seller_id);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.update_buyer_stats_from_feedback() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_buyer_stats_on_feedback_update() TO authenticated;;
