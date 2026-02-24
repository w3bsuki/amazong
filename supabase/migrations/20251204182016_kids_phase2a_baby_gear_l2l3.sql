
-- KIDS CATEGORY IMPROVEMENT - PHASE 2A: Baby Gear L2/L3 Categories
-- ================================================================

-- Get baby-gear parent ID: 199c6ea7-63f6-44d7-998a-ec9455e24cf8

-- First, update existing L2s with better slugs and add icons
UPDATE categories SET slug = 'gear-strollers', icon = '🚼', display_order = 1 WHERE slug = 'babygear-strollers';
UPDATE categories SET slug = 'gear-carseats', icon = '🚗', display_order = 2 WHERE slug = 'babygear-carseats';
UPDATE categories SET slug = 'gear-carriers', icon = '👶', display_order = 3 WHERE slug = 'babygear-carriers';
UPDATE categories SET slug = 'gear-cribs', icon = '🛏️', display_order = 4 WHERE slug = 'babygear-cribs';
UPDATE categories SET slug = 'gear-highchairs', icon = '🪑', display_order = 5 WHERE slug = 'babygear-highchairs';

-- Add new L2 categories for Baby Gear
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Baby Walkers', 'Проходилки', 'gear-walkers', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', '🚶', 6),
('Play Yards & Gates', 'Кошари и порти', 'gear-playyards', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', '🏠', 7),
('Bouncers & Swings', 'Шезлонги и люлки', 'gear-bouncers', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', '🎠', 8),
('Travel Accessories', 'Аксесоари за пътуване', 'gear-travel-acc', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', '✈️', 9);
;
