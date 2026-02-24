-- Second pass cleanup of remaining duplicates
DO $$
DECLARE
  dup_record RECORD;
  canonical_id UUID;
  dup_id UUID;
  deleted_count INT := 0;
BEGIN
  -- Process each remaining duplicate group
  FOR dup_record IN 
    WITH duplicate_groups AS (
      SELECT name, parent_id
      FROM categories
      GROUP BY name, parent_id
      HAVING COUNT(*) > 1
    )
    SELECT dg.name, dg.parent_id
    FROM duplicate_groups dg
    ORDER BY dg.name
  LOOP
    -- Find the canonical category (shortest slug, then earliest created)
    SELECT id INTO canonical_id
    FROM categories c
    WHERE c.name = dup_record.name 
      AND (c.parent_id = dup_record.parent_id OR (c.parent_id IS NULL AND dup_record.parent_id IS NULL))
    ORDER BY LENGTH(c.slug), c.created_at
    LIMIT 1;
    
    -- For each non-canonical duplicate
    FOR dup_id IN 
      SELECT id FROM categories c
      WHERE c.name = dup_record.name 
        AND (c.parent_id = dup_record.parent_id OR (c.parent_id IS NULL AND dup_record.parent_id IS NULL))
        AND c.id != canonical_id
    LOOP
      -- Move children to canonical
      UPDATE categories SET parent_id = canonical_id WHERE parent_id = dup_id;
      
      -- Move products to canonical
      UPDATE products SET category_id = canonical_id WHERE category_id = dup_id;
      
      -- Delete attributes from duplicate
      DELETE FROM category_attributes WHERE category_id = dup_id;
      
      -- Delete the duplicate category
      DELETE FROM categories WHERE id = dup_id;
      deleted_count := deleted_count + 1;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Pass 2: Deleted % duplicate categories', deleted_count;
END $$;;
