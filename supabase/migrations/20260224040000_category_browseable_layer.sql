-- PHASE 4 — Category taxonomy: add browseable layer
--
-- Adds public.categories.is_browseable for a user-facing browse tree that excludes empty branches.

BEGIN;

-- -----------------------------------------------------------------------------
-- 4a) Add column
-- -----------------------------------------------------------------------------

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS is_browseable boolean NOT NULL DEFAULT false;

-- -----------------------------------------------------------------------------
-- 4b) Mark categories that have active inventory in their subtree as browseable
-- -----------------------------------------------------------------------------

-- Reset first for idempotency (then mark true for populated roots/subtrees)
UPDATE public.categories
SET is_browseable = false;

WITH RECURSIVE populated AS (
  -- Categories directly containing active products
  SELECT DISTINCT p.category_id AS id
  FROM public.products p
  WHERE p.category_id IS NOT NULL
    AND p.status = 'active'
  UNION
  -- Their ancestors
  SELECT c.parent_id
  FROM public.categories c
  JOIN populated p ON c.id = p.id
  WHERE c.parent_id IS NOT NULL
)
UPDATE public.categories
SET is_browseable = true
WHERE id IN (SELECT id FROM populated);

-- Always mark L0 (root) categories as browseable (top-level navigation)
UPDATE public.categories
SET is_browseable = true
WHERE parent_id IS NULL;

-- -----------------------------------------------------------------------------
-- 4c) Create index for browseable queries
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_categories_browseable
  ON public.categories (parent_id, display_order)
  WHERE is_browseable = true;

-- -----------------------------------------------------------------------------
-- 4d) Refresh function (call after product inserts/deletes)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.refresh_browseable_categories()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.categories SET is_browseable = false;

  -- Mark L0 always browseable
  UPDATE public.categories SET is_browseable = true WHERE parent_id IS NULL;

  -- Mark anything with active products in subtree
  WITH RECURSIVE populated AS (
    SELECT DISTINCT p.category_id AS id
    FROM public.products p
    WHERE p.category_id IS NOT NULL
      AND p.status = 'active'
    UNION
    SELECT c.parent_id
    FROM public.categories c
    JOIN populated p ON c.id = p.id
    WHERE c.parent_id IS NOT NULL
  )
  UPDATE public.categories
  SET is_browseable = true
  WHERE id IN (SELECT id FROM populated);
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_browseable_categories() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.refresh_browseable_categories() TO service_role;

COMMIT;

-- Verify (run separately):
--   SELECT is_browseable, count(*) FROM public.categories GROUP BY is_browseable;
-- Expected: browseable ~O(100) and not-browseable ~O(13k) for current dataset.
