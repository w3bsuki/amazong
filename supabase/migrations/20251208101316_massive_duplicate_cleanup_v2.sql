
-- Massive duplicate cleanup - consolidate all L2 duplicates
DO $$
DECLARE
  v_rec RECORD;
  v_keeper_id UUID;
  v_dup RECORD;
BEGIN
  -- Find all duplicate L2 groups (same name_bg under same parent)
  FOR v_rec IN 
    WITH l2_cats AS (
      SELECT 
        c.id,
        c.slug,
        c.name_bg,
        c.parent_id,
        (SELECT COUNT(*) FROM categories c2 WHERE c2.parent_id = c.id) as child_count
      FROM categories c
      WHERE c.parent_id IS NOT NULL 
        AND c.name_bg IS NOT NULL
        AND EXISTS (SELECT 1 FROM categories gp WHERE c.parent_id = gp.id AND gp.parent_id IS NOT NULL)
    )
    SELECT 
      parent_id,
      name_bg,
      (SELECT id FROM l2_cats lc WHERE lc.parent_id = l2_cats.parent_id AND lc.name_bg = l2_cats.name_bg ORDER BY child_count DESC, slug LIMIT 1) as keeper_id
    FROM l2_cats
    GROUP BY parent_id, name_bg
    HAVING COUNT(*) > 1
  LOOP
    v_keeper_id := v_rec.keeper_id;
    
    -- For each duplicate (not the keeper)
    FOR v_dup IN 
      SELECT id FROM categories 
      WHERE parent_id = v_rec.parent_id 
        AND name_bg = v_rec.name_bg 
        AND id != v_keeper_id
    LOOP
      -- Move children to keeper
      UPDATE categories SET parent_id = v_keeper_id WHERE parent_id = v_dup.id;
      
      -- Delete the duplicate (if it has no children now)
      DELETE FROM categories WHERE id = v_dup.id AND NOT EXISTS (SELECT 1 FROM categories c WHERE c.parent_id = v_dup.id);
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Cleanup complete';
END $$;
;
