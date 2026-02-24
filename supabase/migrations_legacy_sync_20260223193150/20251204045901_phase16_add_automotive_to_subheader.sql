
-- Add Automotive back - now 15 categories in subheader
UPDATE categories SET display_order = 1 WHERE slug = 'fashion' AND parent_id IS NULL;
UPDATE categories SET display_order = 2 WHERE slug = 'electronics' AND parent_id IS NULL;
UPDATE categories SET display_order = 3 WHERE slug = 'home' AND parent_id IS NULL;
UPDATE categories SET display_order = 4 WHERE slug = 'beauty' AND parent_id IS NULL;
UPDATE categories SET display_order = 5 WHERE slug = 'health-wellness' AND parent_id IS NULL;
UPDATE categories SET display_order = 6 WHERE slug = 'sports' AND parent_id IS NULL;
UPDATE categories SET display_order = 7 WHERE slug = 'baby-kids' AND parent_id IS NULL;
UPDATE categories SET display_order = 8 WHERE slug = 'gaming' AND parent_id IS NULL;
UPDATE categories SET display_order = 9 WHERE slug = 'automotive' AND parent_id IS NULL;  -- Automotive added!
UPDATE categories SET display_order = 10 WHERE slug = 'pets' AND parent_id IS NULL;
UPDATE categories SET display_order = 11 WHERE slug = 'real-estate' AND parent_id IS NULL;
UPDATE categories SET display_order = 12 WHERE slug = 'software' AND parent_id IS NULL;
UPDATE categories SET display_order = 13 WHERE slug = 'cbd-wellness' AND parent_id IS NULL;
UPDATE categories SET display_order = 14 WHERE slug = 'collectibles' AND parent_id IS NULL;
UPDATE categories SET display_order = 15 WHERE slug = 'wholesale' AND parent_id IS NULL;

-- Rest in More
UPDATE categories SET display_order = 16 WHERE slug = 'jewelry-watches' AND parent_id IS NULL;
UPDATE categories SET display_order = 17 WHERE slug = 'grocery' AND parent_id IS NULL;
UPDATE categories SET display_order = 18 WHERE slug = 'tools-home' AND parent_id IS NULL;
UPDATE categories SET display_order = 19 WHERE slug = 'hobbies' AND parent_id IS NULL;
UPDATE categories SET display_order = 20 WHERE slug = 'e-mobility' AND parent_id IS NULL;
UPDATE categories SET display_order = 21 WHERE slug = 'services' AND parent_id IS NULL;
UPDATE categories SET display_order = 22 WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
;
