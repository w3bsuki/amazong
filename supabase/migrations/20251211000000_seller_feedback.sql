-- =====================================================
-- SELLER FEEDBACK SYSTEM
-- Date: 2025-12-11
-- Purpose: Enable buyers to leave feedback/reviews for sellers
-- This is separate from product reviews - these are seller-level reviews
-- =====================================================

-- Step 1: Create seller_feedback table
CREATE TABLE IF NOT EXISTS public.seller_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  -- Feedback categories (like eBay)
  item_as_described BOOLEAN DEFAULT true,
  shipping_speed BOOLEAN DEFAULT true,
  communication BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate feedback for same order
  UNIQUE(buyer_id, order_id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seller_feedback_seller_id ON public.seller_feedback(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_buyer_id ON public.seller_feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_order_id ON public.seller_feedback(order_id);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_rating ON public.seller_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_created_at ON public.seller_feedback(created_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE public.seller_feedback ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Everyone can view feedback (public store profiles)
CREATE POLICY "seller_feedback_select_all"
  ON public.seller_feedback FOR SELECT
  USING (true);

-- Buyers can insert feedback for orders they've made
CREATE POLICY "seller_feedback_insert_buyer"
  ON public.seller_feedback FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id
    AND (
      order_id IS NULL 
      OR EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_id 
        AND orders.user_id = auth.uid()
        AND orders.status IN ('delivered', 'completed')
      )
    )
  );

-- Buyers can update their own feedback within 30 days
CREATE POLICY "seller_feedback_update_own"
  ON public.seller_feedback FOR UPDATE
  USING (
    auth.uid() = buyer_id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
  WITH CHECK (auth.uid() = buyer_id);

-- Buyers can delete their own feedback or admin can delete
CREATE POLICY "seller_feedback_delete_own_or_admin"
  ON public.seller_feedback FOR DELETE
  USING (
    auth.uid() = buyer_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 5: Add store_slug column to sellers if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sellers' AND column_name = 'store_slug'
  ) THEN
    ALTER TABLE public.sellers ADD COLUMN store_slug TEXT UNIQUE;
    
    -- Create index for store_slug lookups
    CREATE INDEX IF NOT EXISTS idx_sellers_store_slug ON public.sellers(store_slug);
    
    -- Generate slugs for existing sellers from store_name
    UPDATE public.sellers
    SET store_slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(store_name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
    WHERE store_slug IS NULL;
  END IF;
END $$;

-- Step 6: Create function to auto-generate store_slug on insert/update
CREATE OR REPLACE FUNCTION public.generate_store_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.store_slug IS NULL OR NEW.store_slug = '' THEN
    NEW.store_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.store_name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 7: Create trigger for auto-generating store_slug
DROP TRIGGER IF EXISTS trigger_generate_store_slug ON public.sellers;
CREATE TRIGGER trigger_generate_store_slug
  BEFORE INSERT OR UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_store_slug();

-- Step 8: Add updated_at trigger for seller_feedback
CREATE OR REPLACE FUNCTION public.update_seller_feedback_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trigger_update_seller_feedback_timestamp ON public.seller_feedback;
CREATE TRIGGER trigger_update_seller_feedback_timestamp
  BEFORE UPDATE ON public.seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_feedback_timestamp();
