
-- =====================================================
-- CATEGORY ATTRIBUTES SYSTEM
-- Allows category-specific form fields + custom seller fields
-- =====================================================

-- Category Attribute Definitions
-- These define what fields appear for each category
CREATE TABLE IF NOT EXISTS category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Make", "Model", "Year", "Color"
  name_bg TEXT, -- Bulgarian translation
  attribute_type TEXT NOT NULL CHECK (attribute_type IN ('text', 'number', 'select', 'multiselect', 'boolean', 'date')),
  is_required BOOLEAN DEFAULT false,
  is_filterable BOOLEAN DEFAULT true, -- Can users filter by this attribute?
  options JSONB DEFAULT '[]'::jsonb, -- For select/multiselect: ["BMW", "Mercedes", "Audi"]
  options_bg JSONB DEFAULT '[]'::jsonb, -- Bulgarian options
  placeholder TEXT,
  placeholder_bg TEXT,
  validation_rules JSONB DEFAULT '{}'::jsonb, -- {"min": 1900, "max": 2025} for Year
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint per category
  UNIQUE(category_id, name)
);

-- Product Attributes (the actual values)
-- Stores both predefined and custom attributes
CREATE TABLE IF NOT EXISTS product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES category_attributes(id) ON DELETE SET NULL, -- NULL for custom attributes
  name TEXT NOT NULL, -- Attribute name (denormalized for custom attrs)
  value TEXT NOT NULL, -- The actual value
  is_custom BOOLEAN DEFAULT false, -- True if seller-added custom field
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One value per attribute per product
  UNIQUE(product_id, name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_filterable ON product_attributes(name, value) 
  WHERE is_custom = false;

-- Enable RLS
ALTER TABLE category_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Category attributes: readable by all, writable by admins only
CREATE POLICY "Category attributes are viewable by everyone"
  ON category_attributes FOR SELECT
  USING (true);

-- Product attributes: readable by all, writable by product owner
CREATE POLICY "Product attributes are viewable by everyone"
  ON product_attributes FOR SELECT
  USING (true);

CREATE POLICY "Sellers can manage their product attributes"
  ON product_attributes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM products p 
      WHERE p.id = product_attributes.product_id 
      AND p.seller_id = auth.uid()
    )
  );

-- Comments
COMMENT ON TABLE category_attributes IS 'Defines dynamic form fields per category (like eBay Item Specifics)';
COMMENT ON TABLE product_attributes IS 'Stores product attribute values - both predefined and custom seller fields';
COMMENT ON COLUMN product_attributes.is_custom IS 'True if seller added this attribute themselves (not from category template)';
;
