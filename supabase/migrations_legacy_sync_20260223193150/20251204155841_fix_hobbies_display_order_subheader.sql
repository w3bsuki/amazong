
-- Fix Hobbies display order to show in subheader
-- Move Hobbies to position 15 (replacing missing position between 14 and 16)
UPDATE categories SET display_order = 15 WHERE slug = 'hobbies';

-- Verify the order
SELECT name, slug, display_order
FROM categories 
WHERE parent_id IS NULL AND display_order < 9990
ORDER BY display_order ASC;
;
