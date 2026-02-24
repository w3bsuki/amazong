-- ============================================================================
-- MIGRATION: Create get_badge_specs() RPC function
-- ============================================================================
-- Returns category-aware badge specs for a product.
-- Walks up category tree to find badge specs (child > parent precedence).
-- Used by product cards to show contextually relevant badges.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_badge_specs(
  p_product_id uuid,
  p_locale text DEFAULT 'en'
)
RETURNS TABLE(
  attribute_key text,
  label text,
  value text,
  priority integer,
  unit_suffix text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_category_id UUID;
  v_parent_id UUID;
  v_attributes JSONB;
  v_condition TEXT;
BEGIN
  -- Get product's category, attributes, and condition
  SELECT category_id, COALESCE(attributes, '{}'::jsonb), condition
  INTO v_category_id, v_attributes, v_condition
  FROM products
  WHERE id = p_product_id;

  IF v_category_id IS NULL THEN
    RETURN;
  END IF;

  -- Get parent category if exists
  SELECT parent_id INTO v_parent_id FROM categories WHERE id = v_category_id;

  -- Return badge specs with category inheritance
  RETURN QUERY
  WITH badge_specs AS (
    -- Get badge specs from current category (highest priority)
    SELECT
      ca.attribute_key as attr_key,
      CASE WHEN p_locale = 'bg' AND ca.name_bg IS NOT NULL THEN ca.name_bg ELSE ca.name END as display_name,
      ca.badge_priority,
      ca.unit_suffix as suffix,
      1 as source_priority
    FROM category_attributes ca
    WHERE ca.category_id = v_category_id
      AND ca.is_badge_spec = true
      AND ca.badge_priority IS NOT NULL

    UNION ALL

    -- Fallback to parent category if current has no badge specs
    SELECT
      ca.attribute_key as attr_key,
      CASE WHEN p_locale = 'bg' AND ca.name_bg IS NOT NULL THEN ca.name_bg ELSE ca.name END as display_name,
      ca.badge_priority,
      ca.unit_suffix as suffix,
      2 as source_priority
    FROM category_attributes ca
    WHERE ca.category_id = v_parent_id
      AND v_parent_id IS NOT NULL
      AND ca.is_badge_spec = true
      AND ca.badge_priority IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM category_attributes ca2
        WHERE ca2.category_id = v_category_id AND ca2.is_badge_spec = true
      )

    UNION ALL

    -- Fallback to grandparent (L0) category
    SELECT
      ca.attribute_key as attr_key,
      CASE WHEN p_locale = 'bg' AND ca.name_bg IS NOT NULL THEN ca.name_bg ELSE ca.name END as display_name,
      ca.badge_priority,
      ca.unit_suffix as suffix,
      3 as source_priority
    FROM category_attributes ca
    WHERE ca.category_id IN (
      SELECT parent_id FROM categories WHERE id = v_parent_id
    )
      AND ca.is_badge_spec = true
      AND ca.badge_priority IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM category_attributes ca2
        WHERE ca2.category_id = v_category_id AND ca2.is_badge_spec = true
      )
      AND NOT EXISTS (
        SELECT 1 FROM category_attributes ca3
        WHERE ca3.category_id = v_parent_id AND ca3.is_badge_spec = true
      )
  ),
  matched_specs AS (
    SELECT DISTINCT ON (bs.attr_key)
      bs.attr_key,
      bs.display_name as label,
      CASE 
        -- Special handling for condition: use dedicated column
        WHEN bs.attr_key = 'condition' THEN v_condition
        ELSE COALESCE(
          v_attributes->>bs.attr_key,
          v_attributes->>(REPLACE(bs.attr_key, '_', '-'))
        )
      END as raw_value,
      bs.badge_priority as priority,
      bs.suffix,
      bs.source_priority
    FROM badge_specs bs
    ORDER BY bs.attr_key, bs.source_priority
  )
  SELECT 
    ms.attr_key as attribute_key,
    ms.label,
    CASE 
      WHEN ms.suffix IS NOT NULL AND ms.raw_value IS NOT NULL 
      THEN ms.raw_value || ' ' || ms.suffix
      ELSE ms.raw_value
    END as value,
    ms.priority,
    ms.suffix as unit_suffix
  FROM matched_specs ms
  WHERE ms.raw_value IS NOT NULL AND ms.raw_value != ''
  ORDER BY ms.priority;
END;
$$;

-- Grant execute to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_badge_specs(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_badge_specs(uuid, text) TO anon;

COMMENT ON FUNCTION public.get_badge_specs IS 
  'Returns category-aware badge specifications for a product. Walks up category tree for inheritance.';;
