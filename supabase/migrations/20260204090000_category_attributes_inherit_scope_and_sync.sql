-- =====================================================
-- Category Attributes Inheritance + Attribute Sync
-- Date: 2026-02-04
-- Purpose:
--  - Add inherit_scope to category_attributes
--  - Normalize attribute keys in DB
--  - Sync product_attributes (EAV) -> products.attributes (JSONB)
--  - Backfill missing EAV rows from legacy JSONB
--  - Tighten cart/wishlist policies to authenticated
-- =====================================================

-- ------------------------------
-- 1) Inherit scope enum + column
-- ------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'category_attribute_inherit_scope'
  ) THEN
    CREATE TYPE public.category_attribute_inherit_scope AS ENUM ('self_only', 'inherit', 'global');
  END IF;
END $$;

ALTER TABLE public.category_attributes
  ADD COLUMN IF NOT EXISTS inherit_scope public.category_attribute_inherit_scope DEFAULT 'self_only';

-- ------------------------------
-- 2) Normalize attribute keys
-- ------------------------------

CREATE OR REPLACE FUNCTION public.normalize_attribute_key(name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN name IS NULL THEN NULL
    ELSE NULLIF(
      regexp_replace(
        regexp_replace(
          regexp_replace(lower(trim(name)), '\([^)]*\)', '', 'g'),
          '[^a-z0-9]+', '_', 'g'
        ),
        '^_+|_+$', '', 'g'
      ),
    '')
  END;
$$;

CREATE OR REPLACE FUNCTION public.handle_category_attribute_key_normalization()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.attribute_key IS NULL OR length(trim(NEW.attribute_key)) = 0 THEN
    NEW.attribute_key := public.normalize_attribute_key(NEW.name);
  ELSE
    NEW.attribute_key := public.normalize_attribute_key(NEW.attribute_key);
    IF NEW.attribute_key IS NULL OR length(trim(NEW.attribute_key)) = 0 THEN
      NEW.attribute_key := public.normalize_attribute_key(NEW.name);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_category_attributes_normalize_key ON public.category_attributes;
CREATE TRIGGER trg_category_attributes_normalize_key
  BEFORE INSERT OR UPDATE ON public.category_attributes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_category_attribute_key_normalization();

UPDATE public.category_attributes
SET attribute_key = COALESCE(
  public.normalize_attribute_key(attribute_key),
  public.normalize_attribute_key(name)
)
WHERE attribute_key IS DISTINCT FROM COALESCE(
  public.normalize_attribute_key(attribute_key),
  public.normalize_attribute_key(name)
);

-- ------------------------------
-- 3) Backfill inherit_scope defaults
-- ------------------------------

-- Global attributes (category_id IS NULL)
UPDATE public.category_attributes
SET inherit_scope = 'global'::public.category_attribute_inherit_scope
WHERE category_id IS NULL
  AND (inherit_scope IS NULL OR inherit_scope = 'self_only'::public.category_attribute_inherit_scope);

-- Universal keys inherit to descendants
UPDATE public.category_attributes
SET inherit_scope = CASE
  WHEN category_id IS NULL THEN 'global'::public.category_attribute_inherit_scope
  ELSE 'inherit'::public.category_attribute_inherit_scope
END
WHERE COALESCE(
    public.normalize_attribute_key(attribute_key),
    public.normalize_attribute_key(name)
  ) IN ('condition', 'brand', 'size', 'color', 'material', 'gender', 'season', 'style')
  AND (inherit_scope IS NULL OR inherit_scope = 'self_only'::public.category_attribute_inherit_scope);

-- Any remaining NULLs -> self_only
UPDATE public.category_attributes
SET inherit_scope = 'self_only'::public.category_attribute_inherit_scope
WHERE inherit_scope IS NULL;

-- ------------------------------
-- 4) EAV -> JSONB sync
-- ------------------------------

CREATE OR REPLACE FUNCTION public.sync_product_attributes_jsonb(p_product_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  v_attrs jsonb;
  v_condition text;
BEGIN
  SELECT condition INTO v_condition FROM public.products WHERE id = p_product_id;

  WITH attr_rows AS (
    SELECT
      pa.product_id,
      COALESCE(
        ca.attribute_key,
        public.normalize_attribute_key(pa.name),
        public.normalize_attribute_key(ca.name)
      ) AS attr_key,
      pa.value AS attr_value
    FROM public.product_attributes pa
    LEFT JOIN public.category_attributes ca ON ca.id = pa.attribute_id
    WHERE pa.product_id = p_product_id
  ),
  aggregated AS (
    SELECT jsonb_object_agg(attr_key, attr_value)
      FILTER (WHERE attr_key IS NOT NULL AND attr_key <> '') AS attrs
    FROM attr_rows
  )
  SELECT COALESCE(attrs, '{}'::jsonb) INTO v_attrs FROM aggregated;

  IF (v_attrs ? 'condition') IS FALSE
     AND v_condition IS NOT NULL
     AND length(trim(v_condition)) > 0 THEN
    v_attrs := v_attrs || jsonb_build_object('condition', v_condition);
  END IF;

  UPDATE public.products
  SET attributes = v_attrs
  WHERE id = p_product_id;
END;
$$;

-- ------------------------------
-- 5) Backfill EAV from JSONB
-- ------------------------------

WITH RECURSIVE category_ancestors AS (
  SELECT id AS category_id, id AS ancestor_id, 0 AS depth
  FROM public.categories
  UNION ALL
  SELECT ca.category_id, c.parent_id, ca.depth + 1
  FROM category_ancestors ca
  JOIN public.categories c ON c.id = ca.ancestor_id
  WHERE c.parent_id IS NOT NULL
),
jsonb_attrs AS (
  SELECT
    p.id AS product_id,
    p.category_id,
    e.key AS raw_key,
    public.normalize_attribute_key(e.key) AS attr_key,
    e.value AS attr_value
  FROM public.products p
  CROSS JOIN LATERAL jsonb_each_text(COALESCE(p.attributes, '{}'::jsonb)) e
  WHERE p.attributes IS NOT NULL
),
matched AS (
  SELECT
    ja.product_id,
    ja.raw_key,
    ja.attr_key,
    ja.attr_value,
    ca.id AS attribute_id,
    ca.name AS attribute_name,
    COALESCE(ca.name, ja.raw_key) AS target_name,
    ROW_NUMBER() OVER (
      PARTITION BY ja.product_id, ja.attr_key
      ORDER BY ca_depth.depth ASC
    ) AS rn
  FROM jsonb_attrs ja
  LEFT JOIN category_ancestors ca_depth
    ON ca_depth.category_id = ja.category_id
  LEFT JOIN public.category_attributes ca
    ON ca.category_id = ca_depth.ancestor_id
   AND ca.attribute_key = ja.attr_key
)
INSERT INTO public.product_attributes (product_id, attribute_id, name, value, is_custom)
SELECT
  m.product_id,
  m.attribute_id,
  m.target_name,
  m.attr_value,
  CASE WHEN m.attribute_id IS NULL THEN true ELSE false END
FROM matched m
WHERE m.rn = 1
  AND m.attr_key IS NOT NULL
  AND m.attr_key <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM public.product_attributes pa
    WHERE pa.product_id = m.product_id
      AND (
        pa.name = m.target_name
        OR (m.attribute_id IS NOT NULL AND pa.attribute_id = m.attribute_id)
        OR (m.attribute_id IS NULL AND public.normalize_attribute_key(pa.name) = m.attr_key)
      )
  );

-- ------------------------------
-- 6) Resync JSONB for all products
-- ------------------------------

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT id FROM public.products LOOP
    PERFORM public.sync_product_attributes_jsonb(r.id);
  END LOOP;
END $$;

-- ------------------------------
-- 7) Trigger: keep JSONB in sync
-- ------------------------------

CREATE OR REPLACE FUNCTION public.handle_product_attributes_sync()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.sync_product_attributes_jsonb(COALESCE(NEW.product_id, OLD.product_id));
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_product_attributes_sync_jsonb ON public.product_attributes;
CREATE TRIGGER trg_product_attributes_sync_jsonb
  AFTER INSERT OR UPDATE OR DELETE ON public.product_attributes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_product_attributes_sync();

-- ------------------------------
-- 8) Tighten cart + wishlist policies
-- ------------------------------

DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
CREATE POLICY "cart_items_select_own"
  ON public.cart_items FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
CREATE POLICY "cart_items_insert_own"
  ON public.cart_items FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
CREATE POLICY "cart_items_update_own"
  ON public.cart_items FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
CREATE POLICY "cart_items_delete_own"
  ON public.cart_items FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can add to their own wishlist" ON public.wishlists;
CREATE POLICY "Users can add to their own wishlist"
  ON public.wishlists FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON public.wishlists;
CREATE POLICY "Users can remove from their own wishlist"
  ON public.wishlists FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlists;
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlists FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = user_id) OR (is_public = true));
