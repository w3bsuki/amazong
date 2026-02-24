-- Harden anon privileges (production readiness)
--
-- Goals:
-- - Prevent anonymous callers from mutating public schema state by default.
-- - Stop granting anon EXECUTE on every RPC/function by default.
-- - Keep public reads working (we do NOT revoke SELECT in this migration).
--
-- Notes:
-- - RLS remains the primary control for authenticated access.
-- - This migration focuses on removing anon DML + broad RPC execution.

-- =============================================================================
-- 0) Ensure load-bearing RPCs exist in migrations
-- (These exist in the live DB but were missing from this repo historically.)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.increment_view_count(product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE products
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = product_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_hero_specs(p_product_id uuid, p_locale text DEFAULT 'en'::text)
RETURNS TABLE(label text, value text, priority integer, unit_suffix text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  -- Return hero specs with flexible key matching
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
  ),
  matched_specs AS (
    SELECT
      hs.display_name as label,
      -- Try exact key, then key with parentheses variations
      COALESCE(
        v_attributes->>hs.attribute_key,
        v_attributes->>(REPLACE(hs.attribute_key, '_', '_(')||')'),  -- mileage_km -> mileage_(km)
        v_attributes->>(REGEXP_REPLACE(hs.attribute_key, '_([a-z]+)$', '_(\\1)', 'g'))  -- mileage_km -> mileage_(km)
      ) as raw_value,
      hs.hero_priority as priority,
      hs.unit_suffix,
      hs.source_priority
    FROM hero_specs hs
  )
  SELECT
    ms.label,
    CASE
      WHEN ms.unit_suffix IS NOT NULL AND ms.raw_value IS NOT NULL
      THEN ms.raw_value || ' ' || ms.unit_suffix
      ELSE ms.raw_value
    END as value,
    ms.priority,
    ms.unit_suffix
  FROM matched_specs ms
  WHERE ms.raw_value IS NOT NULL AND ms.raw_value != ''
  ORDER BY ms.source_priority, ms.priority
  LIMIT 4;
END;
$function$;

-- =============================================================================
-- 1) Default privileges: stop auto-granting anon broad access
-- =============================================================================

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

DO $$
BEGIN
  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;
  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping ALTER DEFAULT PRIVILEGES for supabase_admin (insufficient privilege in this environment).';
END $$;

-- =============================================================================
-- 2) Existing objects: anon should not be able to mutate state
-- =============================================================================

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
  ON ALL TABLES IN SCHEMA public
  FROM anon;

REVOKE ALL
  ON ALL SEQUENCES IN SCHEMA public
  FROM anon;

-- =============================================================================
-- 3) Existing RPCs: remove broad anon EXECUTE; allow-list only what is needed
-- =============================================================================

REVOKE EXECUTE
  ON ALL FUNCTIONS IN SCHEMA public
  FROM PUBLIC;

REVOKE EXECUTE
  ON ALL FUNCTIONS IN SCHEMA public
  FROM anon;

-- Public surfaces used by unauthenticated pages/routes
GRANT EXECUTE ON FUNCTION public.get_shared_wishlist(character varying) TO anon;
GRANT EXECUTE ON FUNCTION public.get_hero_specs(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_category_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.increment_helpful_count(uuid) TO anon;
