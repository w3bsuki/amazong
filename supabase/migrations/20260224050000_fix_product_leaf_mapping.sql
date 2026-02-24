-- PHASE 5 — Category taxonomy: fix product-to-leaf mapping
--
-- Remap products assigned to non-leaf categories onto the best leaf descendant.

BEGIN;

-- -----------------------------------------------------------------------------
-- 5a) Helper function: walk down via lowest display_order child until leaf
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.find_best_leaf(p_category_id uuid)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  current_id uuid := p_category_id;
  child_id uuid;
BEGIN
  LOOP
    SELECT c.id
    INTO child_id
    FROM public.categories c
    WHERE c.parent_id = current_id
    ORDER BY c.display_order ASC
    LIMIT 1;

    IF child_id IS NULL THEN
      RETURN current_id; -- leaf reached
    END IF;

    current_id := child_id;
  END LOOP;
END;
$$;

-- -----------------------------------------------------------------------------
-- 5b) Update products on non-leaf categories
-- -----------------------------------------------------------------------------

UPDATE public.products p
SET category_id = public.find_best_leaf(p.category_id)
WHERE p.category_id IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.categories child
    WHERE child.parent_id = p.category_id
  );

-- -----------------------------------------------------------------------------
-- 5c) Rebuild category_ancestors for updated products
-- -----------------------------------------------------------------------------

UPDATE public.products p
SET category_ancestors = public.get_category_ancestor_ids(p.category_id)
WHERE p.category_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 5d) Refresh browseable flags
-- -----------------------------------------------------------------------------

SELECT public.refresh_browseable_categories();

-- -----------------------------------------------------------------------------
-- 5e) Drop helper (one-time use)
-- -----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.find_best_leaf(uuid);

COMMIT;

-- Verify (run separately):
-- 1) No categorized products remain on non-leaf categories:
--    SELECT count(*)
--    FROM public.products p
--    WHERE p.category_id IS NOT NULL
--      AND EXISTS (
--        SELECT 1
--        FROM public.categories child
--        WHERE child.parent_id = p.category_id
--      );
--    -- expect 0
--
-- 2) Browseable distribution remains reasonable:
--    SELECT is_browseable, count(*) FROM public.categories GROUP BY is_browseable;

