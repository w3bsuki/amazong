-- ============================================================================
-- PRODUCT PROMOTIONAL FIELDS - Seller UX Controls
-- ============================================================================

-- Add promotional control columns to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sale_percent INTEGER DEFAULT 0 CHECK (sale_percent >= 0 AND sale_percent <= 99),
  ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS free_shipping BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_limited_stock BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS condition TEXT CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  ADD COLUMN IF NOT EXISTS shipping_days INTEGER DEFAULT NULL;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON public.products(is_on_sale) WHERE is_on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_free_shipping ON public.products(free_shipping) WHERE free_shipping = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured_until) WHERE featured_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products(condition);

-- Add comments
COMMENT ON COLUMN public.products.is_on_sale IS 'Whether the product is currently on sale (seller controlled)';
COMMENT ON COLUMN public.products.sale_percent IS 'Sale discount percentage (0-99)';
COMMENT ON COLUMN public.products.sale_end_date IS 'When the sale ends (optional)';
COMMENT ON COLUMN public.products.free_shipping IS 'Whether seller offers free shipping';
COMMENT ON COLUMN public.products.is_limited_stock IS 'Show low stock urgency indicator';
COMMENT ON COLUMN public.products.stock_quantity IS 'Actual stock count for urgency display';
COMMENT ON COLUMN public.products.featured_until IS 'Featured placement end date';
COMMENT ON COLUMN public.products.condition IS 'Item condition: new, like-new, good, fair, poor';
COMMENT ON COLUMN public.products.shipping_days IS 'Estimated shipping time in days';

-- Create view for deal products (on sale or discounted)
CREATE OR REPLACE VIEW public.deal_products AS
SELECT 
  p.*,
  CASE 
    WHEN p.is_on_sale AND p.sale_percent > 0 THEN p.sale_percent
    WHEN p.list_price IS NOT NULL AND p.list_price > p.price 
      THEN ROUND(((p.list_price - p.price) / p.list_price * 100)::numeric)::integer
    ELSE 0
  END as effective_discount
FROM public.products p
WHERE 
  (p.is_on_sale = true AND p.sale_percent > 0)
  OR (p.list_price IS NOT NULL AND p.list_price > p.price)
ORDER BY 
  CASE 
    WHEN p.is_on_sale AND p.sale_percent > 0 THEN p.sale_percent
    WHEN p.list_price IS NOT NULL AND p.list_price > p.price 
      THEN ROUND(((p.list_price - p.price) / p.list_price * 100)::numeric)::integer
    ELSE 0
  END DESC;

-- Grant access to deal_products view
GRANT SELECT ON public.deal_products TO authenticated, anon;;
