-- Add business-essential fields to products table for inventory management
-- SKU: Stock Keeping Unit for internal inventory tracking
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

-- Barcode: UPC/EAN for scanning and inventory systems
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);

-- Status: Product visibility/lifecycle status
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'out_of_stock'));

-- Cost price: For profit margin calculations and accounting
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10,2) CHECK (cost_price IS NULL OR cost_price >= 0);

-- Weight: For shipping calculations
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight NUMERIC(10,3) CHECK (weight IS NULL OR weight >= 0);

-- Weight unit: kg, g, lb, oz
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_unit VARCHAR(10) DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'g', 'lb', 'oz'));

-- Condition: new, used, refurbished (important for marketplace)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished', 'like_new', 'good', 'fair'));

-- Track inventory: whether to track stock levels
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products(condition);

-- Add comments for documentation
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit - seller internal inventory code';
COMMENT ON COLUMN public.products.barcode IS 'UPC/EAN barcode for scanning';
COMMENT ON COLUMN public.products.status IS 'Product status: active (visible), draft (hidden), archived (delisted), out_of_stock';
COMMENT ON COLUMN public.products.cost_price IS 'Cost price for profit margin calculations';
COMMENT ON COLUMN public.products.weight IS 'Product weight for shipping calculations';
COMMENT ON COLUMN public.products.weight_unit IS 'Weight unit: kg, g, lb, oz';
COMMENT ON COLUMN public.products.condition IS 'Product condition: new, used, refurbished, like_new, good, fair';
COMMENT ON COLUMN public.products.track_inventory IS 'Whether to track and enforce stock levels';;
