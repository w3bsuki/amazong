
-- KIDS CATEGORY IMPROVEMENT - PHASE 2G: Toys & Games Cleanup and New L2s
-- ================================================================

-- Remove duplicates (keep better organized ones)
DELETE FROM categories WHERE slug = 'baby-educational-toys';  -- duplicate of educational-toys
DELETE FROM categories WHERE slug = 'baby-outdoor-toys';  -- duplicate of outdoor-play  
DELETE FROM categories WHERE slug = 'dolls';  -- duplicate of dolls-playsets

-- Rename and reorder existing L2s with icons
UPDATE categories SET name = 'Building & Construction', name_bg = 'Конструктори', icon = '🧱', display_order = 1 WHERE slug = 'building-toys';
UPDATE categories SET name = 'Dolls & Accessories', name_bg = 'Кукли и аксесоари', icon = '🎀', display_order = 2 WHERE slug = 'dolls-playsets';
UPDATE categories SET name = 'Educational & STEM', name_bg = 'Образователни и STEM', icon = '🎓', display_order = 3 WHERE slug = 'educational-toys';
UPDATE categories SET name = 'Action Figures', name_bg = 'Екшън фигурки', icon = '🦸', display_order = 4 WHERE slug = 'action-figures';
UPDATE categories SET name = 'Outdoor & Sports Toys', name_bg = 'Играчки за навън', icon = '🪁', display_order = 5 WHERE slug = 'outdoor-play';
UPDATE categories SET name = 'Ride-On Toys', name_bg = 'Играчки за каране', icon = '🚲', display_order = 6 WHERE slug = 'ride-on-toys';
UPDATE categories SET name = 'Arts & Crafts', name_bg = 'Изкуства и занаяти', icon = '🎨', display_order = 7 WHERE slug = 'arts-crafts';
UPDATE categories SET name = 'Games & Puzzles', name_bg = 'Игри и пъзели', icon = '🧩', display_order = 8 WHERE slug = 'puzzles-games';
UPDATE categories SET name = 'Plush & Stuffed Toys', name_bg = 'Плюшени играчки', icon = '🧸', display_order = 9 WHERE slug = 'plush-toys';

-- Add new L2 categories for Toys
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Baby & Toddler Toys', 'Играчки за бебета', 'toys-baby', 'a0000000-0000-0000-0000-000000000012', '👶', 0),
('Pretend Play', 'Ролеви игри', 'toys-pretend', 'a0000000-0000-0000-0000-000000000012', '👨‍🍳', 10),
('Remote Control', 'Дистанционно управление', 'toys-rc', 'a0000000-0000-0000-0000-000000000012', '🎮', 11),
('Electronic Toys', 'Електронни играчки', 'toys-electronic', 'a0000000-0000-0000-0000-000000000012', '🤖', 12);
;
