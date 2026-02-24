-- PHASE 7 — Attribute cleanup + migration ledger
--
-- 7a) Audit attribute usage (run the SELECTs below to report counts).
-- 7b) Add category_attributes.is_active and mark inactive definitions.
-- 7c) Record all 20260224 phases into supabase_migrations.schema_migrations.

-- -----------------------------------------------------------------------------
-- 7a) Audit queries (run separately; do NOT execute in this migration)
-- -----------------------------------------------------------------------------
--
-- A) How many category_attributes are linked to categories that have active products?
--
-- WITH RECURSIVE active_cats AS (
--   SELECT DISTINCT p.category_id AS id
--   FROM public.products p
--   WHERE p.category_id IS NOT NULL
--     AND p.status = 'active'
--   UNION
--   SELECT c.parent_id
--   FROM public.categories c
--   JOIN active_cats a ON c.id = a.id
--   WHERE c.parent_id IS NOT NULL
-- )
-- SELECT
--   count(*) FILTER (WHERE ca.category_id IN (SELECT id FROM active_cats)) AS linked_to_active_categories,
--   count(*) AS total_category_attributes
-- FROM public.category_attributes ca;
--
-- B) How many product_attributes reference valid category_attributes?
--
-- SELECT
--   count(*) FILTER (WHERE pa.attribute_id IS NOT NULL) AS with_attribute_id,
--   count(*) FILTER (
--     WHERE pa.attribute_id IS NOT NULL
--       AND EXISTS (SELECT 1 FROM public.category_attributes ca WHERE ca.id = pa.attribute_id)
--   ) AS valid_attribute_id,
--   count(*) AS total_product_attributes
-- FROM public.product_attributes pa;

BEGIN;

-- -----------------------------------------------------------------------------
-- 7b) Add is_active flag + mark inactive definitions
-- -----------------------------------------------------------------------------

ALTER TABLE public.category_attributes
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

WITH RECURSIVE active_cats AS (
  SELECT DISTINCT p.category_id AS id
  FROM public.products p
  WHERE p.category_id IS NOT NULL
    AND p.status = 'active'
  UNION
  SELECT c.parent_id
  FROM public.categories c
  JOIN active_cats a ON c.id = a.id
  WHERE c.parent_id IS NOT NULL
)
UPDATE public.category_attributes ca
SET is_active = false
WHERE ca.category_id IS NOT NULL
  AND ca.category_id NOT IN (SELECT id FROM active_cats);

-- Ensure categories in the active subtree remain active (idempotency)
WITH RECURSIVE active_cats AS (
  SELECT DISTINCT p.category_id AS id
  FROM public.products p
  WHERE p.category_id IS NOT NULL
    AND p.status = 'active'
  UNION
  SELECT c.parent_id
  FROM public.categories c
  JOIN active_cats a ON c.id = a.id
  WHERE c.parent_id IS NOT NULL
)
UPDATE public.category_attributes ca
SET is_active = true
WHERE ca.category_id IN (SELECT id FROM active_cats);

-- -----------------------------------------------------------------------------
-- 7c) Record migrations in the ledger
-- -----------------------------------------------------------------------------

INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES
  ('20260224010000', 'security_hardening'),
  ('20260224020000', 'drop_unused_indexes'),
  ('20260224030000', 'data_integrity_fixes'),
  ('20260224040000', 'category_browseable_layer'),
  ('20260224050000', 'fix_product_leaf_mapping'),
  ('20260224060000', 'app_code_browseable_filter'),
  ('20260224070000', 'attribute_cleanup')
ON CONFLICT (version) DO UPDATE
SET
  name = EXCLUDED.name;

COMMIT;
