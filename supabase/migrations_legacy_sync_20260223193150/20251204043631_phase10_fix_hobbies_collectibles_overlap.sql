
-- ============================================
-- FIX HOBBIES/COLLECTIBLES OVERLAP
-- Collectibles = Trading Cards, Pokemon, Sports Cards (standalone)
-- Hobbies = DIY, Crafts, Model Building, etc (standalone)
-- ============================================

-- Rename Hobbies to remove "Collectibles" from it
UPDATE categories 
SET name = 'Hobbies & Crafts',
    name_bg = 'Хоби и занаяти'
WHERE slug = 'hobbies' AND parent_id IS NULL;

-- Rename Collectibles to be clearer
UPDATE categories 
SET name = 'Trading Cards & Collectibles',
    name_bg = 'Карти и колекции'
WHERE slug = 'collectibles' AND parent_id IS NULL;

-- Move collectibles to right after Gaming (they're related - gamers collect)
UPDATE categories SET display_order = 11 WHERE slug = 'collectibles' AND parent_id IS NULL;
UPDATE categories SET display_order = 12 WHERE slug = 'pets' AND parent_id IS NULL;
UPDATE categories SET display_order = 13 WHERE slug = 'grocery' AND parent_id IS NULL;
UPDATE categories SET display_order = 14 WHERE slug = 'jewelry-watches' AND parent_id IS NULL;
UPDATE categories SET display_order = 15 WHERE slug = 'hobbies' AND parent_id IS NULL;
UPDATE categories SET display_order = 16 WHERE slug = 'tools-home' AND parent_id IS NULL;
UPDATE categories SET display_order = 17 WHERE slug = 'software' AND parent_id IS NULL;
UPDATE categories SET display_order = 18 WHERE slug = 'services' AND parent_id IS NULL;
UPDATE categories SET display_order = 19 WHERE slug = 'real-estate' AND parent_id IS NULL;
UPDATE categories SET display_order = 20 WHERE slug = 'wholesale' AND parent_id IS NULL;
UPDATE categories SET display_order = 21 WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
UPDATE categories SET display_order = 22 WHERE slug = 'cbd-wellness' AND parent_id IS NULL;
;
