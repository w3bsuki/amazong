-- =====================================================
-- FIX: Auto-update seller_stats on product changes
-- Date: 2025-12-13
-- Purpose: Keep seller_stats.active_listings and total_listings accurate
-- =====================================================

-- Step 1: Create function to update listing counts
CREATE OR REPLACE FUNCTION public.update_seller_listing_counts()
RETURNS TRIGGER AS $$
DECLARE
  v_seller_id UUID;
  v_active_count INTEGER;
  v_total_count INTEGER;
BEGIN
  -- Determine which seller to update
  IF TG_OP = 'DELETE' THEN
    v_seller_id := OLD.seller_id;
  ELSE
    v_seller_id := NEW.seller_id;
  END IF;
  
  -- Count all products and active products (stock > 0)
  SELECT 
    COUNT(*)::INTEGER,
    COUNT(*) FILTER (WHERE stock > 0)::INTEGER
  INTO v_total_count, v_active_count
  FROM public.products
  WHERE seller_id = v_seller_id;
  
  -- Update seller_stats
  UPDATE public.seller_stats
  SET 
    total_listings = v_total_count,
    active_listings = v_active_count,
    updated_at = NOW()
  WHERE seller_id = v_seller_id;
  
  -- If no stats row exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.seller_stats (seller_id, total_listings, active_listings)
    VALUES (v_seller_id, v_total_count, v_active_count)
    ON CONFLICT (seller_id) DO UPDATE SET
      total_listings = EXCLUDED.total_listings,
      active_listings = EXCLUDED.active_listings,
      updated_at = NOW();
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create triggers for product changes
DROP TRIGGER IF EXISTS update_seller_listing_counts_insert ON public.products;
CREATE TRIGGER update_seller_listing_counts_insert
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_listing_counts();

DROP TRIGGER IF EXISTS update_seller_listing_counts_delete ON public.products;
CREATE TRIGGER update_seller_listing_counts_delete
  AFTER DELETE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_listing_counts();

DROP TRIGGER IF EXISTS update_seller_listing_counts_update ON public.products;
CREATE TRIGGER update_seller_listing_counts_update
  AFTER UPDATE OF stock ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_listing_counts();

-- Step 3: Backfill accurate counts for all existing sellers
UPDATE public.seller_stats ss
SET 
  total_listings = (
    SELECT COUNT(*) FROM public.products p WHERE p.seller_id = ss.seller_id
  ),
  active_listings = (
    SELECT COUNT(*) FROM public.products p WHERE p.seller_id = ss.seller_id AND p.stock > 0
  ),
  updated_at = NOW();

COMMENT ON FUNCTION public.update_seller_listing_counts() IS 'Keeps seller_stats listing counts accurate on product INSERT/UPDATE/DELETE';;
