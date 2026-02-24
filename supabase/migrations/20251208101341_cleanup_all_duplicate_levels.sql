
-- Clean up ALL duplicate categories at any level (same name_bg under same parent)
DO $$
DECLARE
  v_rec RECORD;
  v_keeper_id UUID;
  v_dup RECORD;
BEGIN
  -- Find all duplicate groups (same name_bg under same parent, at any level)
  FOR v_rec IN 
    SELECT 
      parent_id,
      name_bg,
      (SELECT id FROM categories c2 
       WHERE c2.parent_id = c.parent_id AND c2.name_bg = c.name_bg 
       ORDER BY (SELECT COUNT(*) FROM categories c3 WHERE c3.parent_id = c2.id) DESC, slug 
       LIMIT 1) as keeper_id
    FROM categories c
    WHERE parent_id IS NOT NULL AND name_bg IS NOT NULL
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
      
      -- Delete the duplicate
      DELETE FROM categories WHERE id = v_dup.id;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'All level cleanup complete';
END $$;
;
