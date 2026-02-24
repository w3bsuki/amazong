
-- Add Wholesale to visible subheader (position 13)
UPDATE categories SET display_order = 13 WHERE slug = 'wholesale' AND parent_id IS NULL;

-- Push others down
UPDATE categories SET display_order = 14 WHERE slug = 'automotive' AND parent_id IS NULL;
UPDATE categories SET display_order = 15 WHERE slug = 'gaming' AND parent_id IS NULL;
UPDATE categories SET display_order = 16 WHERE slug = 'jewelry-watches' AND parent_id IS NULL;
UPDATE categories SET display_order = 17 WHERE slug = 'grocery' AND parent_id IS NULL;
UPDATE categories SET display_order = 18 WHERE slug = 'tools-home' AND parent_id IS NULL;
UPDATE categories SET display_order = 19 WHERE slug = 'hobbies' AND parent_id IS NULL;
UPDATE categories SET display_order = 20 WHERE slug = 'e-mobility' AND parent_id IS NULL;
UPDATE categories SET display_order = 21 WHERE slug = 'services' AND parent_id IS NULL;
UPDATE categories SET display_order = 22 WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
;
