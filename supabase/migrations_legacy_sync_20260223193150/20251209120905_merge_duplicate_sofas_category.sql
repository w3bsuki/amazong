-- Merge sofas (under Living Room Furniture) into furn-sofas (main Sofas & Couches)
DO $$
DECLARE
  canonical_id UUID;
  duplicate_id UUID;
BEGIN
  -- Get the canonical (furn-sofas - has children)
  SELECT id INTO canonical_id FROM categories WHERE slug = 'furn-sofas';
  -- Get the duplicate (sofas - no children)
  SELECT id INTO duplicate_id FROM categories WHERE slug = 'sofas';
  
  IF canonical_id IS NOT NULL AND duplicate_id IS NOT NULL THEN
    -- Move any children to canonical
    UPDATE categories SET parent_id = canonical_id WHERE parent_id = duplicate_id;
    -- Move any products to canonical
    UPDATE products SET category_id = canonical_id WHERE category_id = duplicate_id;
    -- Delete the duplicate
    DELETE FROM categories WHERE id = duplicate_id;
    RAISE NOTICE 'Merged sofas into furn-sofas';
  END IF;
END $$;;
