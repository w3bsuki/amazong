-- Migration: Badge Triggers and Functions
-- Run this migration after the badge tables have been created

-- Function to update seller stats when an order is completed
CREATE OR REPLACE FUNCTION update_seller_stats_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_seller_id UUID;
  v_product_seller_id UUID;
BEGIN
  -- Get seller_id from the product
  SELECT p.seller_id INTO v_product_seller_id
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  WHERE oi.order_id = NEW.id
  LIMIT 1;
  
  IF v_product_seller_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Update or insert seller stats
  INSERT INTO seller_stats (seller_id, total_sales, updated_at)
  VALUES (v_product_seller_id, 1, NOW())
  ON CONFLICT (seller_id)
  DO UPDATE SET
    total_sales = seller_stats.total_sales + 1,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update seller stats when feedback is given
CREATE OR REPLACE FUNCTION update_seller_stats_on_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Update seller stats with new rating info
  UPDATE seller_stats
  SET 
    total_reviews = (
      SELECT COUNT(*) FROM seller_feedback 
      WHERE seller_id = NEW.seller_id
    ),
    average_rating = (
      SELECT COALESCE(AVG(overall_rating), 0) FROM seller_feedback 
      WHERE seller_id = NEW.seller_id
    ),
    five_star_reviews = (
      SELECT COUNT(*) FROM seller_feedback 
      WHERE seller_id = NEW.seller_id AND overall_rating = 5
    ),
    positive_feedback_pct = (
      SELECT COALESCE(
        (COUNT(*) FILTER (WHERE overall_rating >= 4)::decimal / NULLIF(COUNT(*), 0)::decimal) * 100,
        0
      )
      FROM seller_feedback WHERE seller_id = NEW.seller_id
    ),
    updated_at = NOW()
  WHERE seller_id = NEW.seller_id;
  
  -- If no row was updated, create one
  IF NOT FOUND THEN
    INSERT INTO seller_stats (
      seller_id, total_reviews, average_rating, five_star_reviews, 
      positive_feedback_pct, updated_at
    )
    VALUES (
      NEW.seller_id, 1, NEW.overall_rating,
      CASE WHEN NEW.overall_rating = 5 THEN 1 ELSE 0 END,
      CASE WHEN NEW.overall_rating >= 4 THEN 100 ELSE 0 END,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update seller stats when a listing is created/updated
CREATE OR REPLACE FUNCTION update_seller_stats_on_listing()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update listing counts
    UPDATE seller_stats
    SET
      total_listings = (
        SELECT COUNT(*) FROM products WHERE seller_id = NEW.seller_id
      ),
      active_listings = (
        SELECT COUNT(*) FROM products 
        WHERE seller_id = NEW.seller_id AND status = 'active'
      ),
      updated_at = NOW()
    WHERE seller_id = NEW.seller_id;
    
    -- If no row was updated, create one
    IF NOT FOUND THEN
      INSERT INTO seller_stats (seller_id, total_listings, active_listings, updated_at)
      VALUES (
        NEW.seller_id,
        1,
        CASE WHEN NEW.status = 'active' THEN 1 ELSE 0 END,
        NOW()
      );
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update listing counts on delete
    UPDATE seller_stats
    SET
      total_listings = (
        SELECT COUNT(*) FROM products WHERE seller_id = OLD.seller_id
      ),
      active_listings = (
        SELECT COUNT(*) FROM products 
        WHERE seller_id = OLD.seller_id AND status = 'active'
      ),
      updated_at = NOW()
    WHERE seller_id = OLD.seller_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update buyer stats when they make a purchase
CREATE OR REPLACE FUNCTION update_buyer_stats_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert buyer stats
  INSERT INTO buyer_stats (user_id, total_purchases, updated_at)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_purchases = buyer_stats.total_purchases + 1,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update buyer stats when they leave feedback
CREATE OR REPLACE FUNCTION update_buyer_stats_on_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Update review count
  UPDATE buyer_stats
  SET
    reviews_given = reviews_given + 1,
    updated_at = NOW()
  WHERE user_id = NEW.buyer_id;
  
  -- If no row exists, create one
  IF NOT FOUND THEN
    INSERT INTO buyer_stats (user_id, reviews_given, updated_at)
    VALUES (NEW.buyer_id, 1, NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize user verification record on signup
CREATE OR REPLACE FUNCTION create_user_verification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_verification (user_id, email_verified, trust_score)
  VALUES (NEW.id, NEW.email_confirmed_at IS NOT NULL, 10)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize buyer stats on profile creation
CREATE OR REPLACE FUNCTION create_buyer_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO buyer_stats (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize seller stats when becoming a seller
CREATE OR REPLACE FUNCTION create_seller_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO seller_stats (seller_id)
  VALUES (NEW.id)
  ON CONFLICT (seller_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers (drop if exists first)
DROP TRIGGER IF EXISTS on_order_completed ON orders;
DROP TRIGGER IF EXISTS on_seller_feedback_created ON seller_feedback;
DROP TRIGGER IF EXISTS on_product_change ON products;
DROP TRIGGER IF EXISTS on_purchase_created ON orders;
DROP TRIGGER IF EXISTS on_buyer_feedback_created ON seller_feedback;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
DROP TRIGGER IF EXISTS on_seller_created ON sellers;

-- Trigger for order completion updating seller stats
CREATE TRIGGER on_order_completed
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_seller_stats_on_order();

-- Trigger for seller feedback updating stats
CREATE TRIGGER on_seller_feedback_created
  AFTER INSERT ON seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_stats_on_feedback();

-- Trigger for listing changes
CREATE TRIGGER on_product_change
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_stats_on_listing();

-- Trigger for purchases updating buyer stats
CREATE TRIGGER on_purchase_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_stats_on_purchase();

-- Trigger for buyer reviews
CREATE TRIGGER on_buyer_feedback_created
  AFTER INSERT ON seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_stats_on_feedback();

-- Trigger to create buyer stats when profile is created
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_buyer_stats();

-- Trigger to create seller stats when seller account is created
CREATE TRIGGER on_seller_created
  AFTER INSERT ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION create_seller_stats();
