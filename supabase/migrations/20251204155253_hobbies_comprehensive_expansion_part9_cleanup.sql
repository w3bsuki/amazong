
-- =====================================================
-- HOBBIES PART 9: Cleanup Deprecated L1 Categories
-- =====================================================

-- Remove deprecated L1 categories that were replaced
DELETE FROM categories WHERE slug = 'hobby-scale-models' AND NOT EXISTS (
  SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id
);

DELETE FROM categories WHERE slug = 'hobby-collecting' AND NOT EXISTS (
  SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id
);

-- Update display order for cleaner L1 structure
UPDATE categories SET display_order = 1 WHERE slug = 'handmade';
UPDATE categories SET display_order = 2 WHERE slug = 'hobby-tcg';
UPDATE categories SET display_order = 3 WHERE slug = 'hobby-tabletop';
UPDATE categories SET display_order = 4 WHERE slug = 'hobby-model-building';
UPDATE categories SET display_order = 5 WHERE slug = 'musical-instruments';
UPDATE categories SET display_order = 6 WHERE slug = 'movies-music';
UPDATE categories SET display_order = 7 WHERE slug = 'books';
UPDATE categories SET display_order = 8 WHERE slug = 'hobby-outdoor';
UPDATE categories SET display_order = 9 WHERE slug = 'hobby-creative-arts';
UPDATE categories SET display_order = 10 WHERE slug = 'hobby-rc-drones';

-- Also fix the orphaned diecast-vehicles if it exists
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'hobby-diecast')
WHERE slug = 'diecast-vehicles' 
AND NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'diecast-vehicles' AND parent_id IS NOT NULL);
;
