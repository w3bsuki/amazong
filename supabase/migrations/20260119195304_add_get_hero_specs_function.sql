
-- ============================================
-- MIGRATION: Add get_hero_specs RPC function
-- 
-- This function returns the hero specs for a product by:
-- 1. Looking up the product's category
-- 2. Getting hero spec definitions from category_attributes (walking up hierarchy)
-- 3. Extracting values from the product's attributes JSONB
-- ============================================

CREATE OR REPLACE FUNCTION get_hero_specs(
  p_product_id UUID,
  p_locale TEXT DEFAULT 'en'
)
RETURNS TABLE(
  label TEXT,
  value TEXT,
  priority INTEGER,
  unit_suffix TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_category_id UUID;
  v_parent_id UUID;
  v_attributes JSONB;
BEGIN
  -- Get product's category and attributes
  SELECT category_id, COALESCE(attributes, '{}'::jsonb)
  INTO v_category_id, v_attributes
  FROM products
  WHERE id = p_product_id;

  IF v_category_id IS NULL THEN
    RETURN;
  END IF;

  -- Get parent category if exists
  SELECT parent_id INTO v_parent_id FROM categories WHERE id = v_category_id;

  -- Return hero specs: try current category first, then parent
  RETURN QUERY
  WITH hero_specs AS (
    -- Get hero specs from current category
    SELECT 
      ca.attribute_key,
      CASE WHEN p_locale = 'bg' AND ca.name_bg IS NOT NULL THEN ca.name_bg ELSE ca.name END as display_name,
      ca.hero_priority,
      ca.unit_suffix,
      1 as source_priority
    FROM category_attributes ca
    WHERE ca.category_id = v_category_id
      AND ca.is_hero_spec = true
      AND ca.hero_priority IS NOT NULL
    
    UNION ALL
    
    -- Fallback to parent category if current has no hero specs
    SELECT 
      ca.attribute_key,
      CASE WHEN p_locale = 'bg' AND ca.name_bg IS NOT NULL THEN ca.name_bg ELSE ca.name END as display_name,
      ca.hero_priority,
      ca.unit_suffix,
      2 as source_priority
    FROM category_attributes ca
    WHERE ca.category_id = v_parent_id
      AND v_parent_id IS NOT NULL
      AND ca.is_hero_spec = true
      AND ca.hero_priority IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM category_attributes ca2 
        WHERE ca2.category_id = v_category_id AND ca2.is_hero_spec = true
      )
  )
  SELECT 
    hs.display_name as label,
    CASE 
      WHEN hs.unit_suffix IS NOT NULL 
      THEN (v_attributes->>hs.attribute_key) || ' ' || hs.unit_suffix
      ELSE v_attributes->>hs.attribute_key
    END as value,
    hs.hero_priority as priority,
    hs.unit_suffix
  FROM hero_specs hs
  WHERE v_attributes ? hs.attribute_key
    AND (v_attributes->>hs.attribute_key) IS NOT NULL
    AND (v_attributes->>hs.attribute_key) != ''
  ORDER BY hs.source_priority, hs.hero_priority
  LIMIT 4;
END;
$$;

-- Grant access
GRANT EXECUTE ON FUNCTION get_hero_specs(UUID, TEXT) TO anon, authenticated;

COMMENT ON FUNCTION get_hero_specs IS 
  'Returns up to 4 hero specs for a product based on its category configuration. Walks up category hierarchy if needed.';
;
