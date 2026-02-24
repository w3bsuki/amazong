-- Cleanup duplicate categories by merging into canonical ones
-- Strategy: Keep the category with the most children (if tied, prefer shorter slug)

DO $$
DECLARE
  dup_record RECORD;
  canonical_id UUID;
  dup_id UUID;
  merged_count INT := 0;
  deleted_count INT := 0;
BEGIN
  -- Process each duplicate group
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
    -- Find the canonical category (most children, then shortest slug)
    SELECT id INTO canonical_id
    FROM categories c
    WHERE c.name = dup_record.name 
      AND (c.parent_id = dup_record.parent_id OR (c.parent_id IS NULL AND dup_record.parent_id IS NULL))
    ORDER BY (SELECT COUNT(*) FROM categories child WHERE child.parent_id = c.id) DESC, 
             LENGTH(c.slug),
             c.created_at
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
      
      -- Move products to canonical (if any)
      UPDATE products SET category_id = canonical_id WHERE category_id = dup_id;
      
      -- Move attributes to canonical (avoiding duplicates)
      INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, validation_rules, sort_order)
      SELECT canonical_id, ca.name, ca.name_bg, ca.attribute_type, ca.is_required, ca.is_filterable, ca.options, ca.options_bg, ca.placeholder, ca.placeholder_bg, ca.validation_rules, ca.sort_order
      FROM category_attributes ca
      WHERE ca.category_id = dup_id
        AND NOT EXISTS (
          SELECT 1 FROM category_attributes existing 
          WHERE existing.category_id = canonical_id AND existing.name = ca.name
        )
      ON CONFLICT DO NOTHING;
      
      -- Delete attributes from duplicate
      DELETE FROM category_attributes WHERE category_id = dup_id;
      
      -- Delete the duplicate category
      DELETE FROM categories WHERE id = dup_id;
      deleted_count := deleted_count + 1;
    END LOOP;
    
    merged_count := merged_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Merged % duplicate groups, deleted % duplicate categories', merged_count, deleted_count;
END $$;;
