
-- KIDS CATEGORY IMPROVEMENT - PHASE 2F: Kids Clothing & Shoes L2/L3 Categories
-- ================================================================

-- Parent: kids-clothing (6217abb4-525d-491f-9c80-3f3c5b5e0326)

-- Add L2 categories for Kids Clothing
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Baby Clothing (0-24M)', 'Бебешко облекло (0-24М)', 'cloth-baby', '6217abb4-525d-491f-9c80-3f3c5b5e0326', '👶', 1),
('Toddler Clothing (2-5Y)', 'Облекло за малки деца (2-5Г)', 'cloth-toddler', '6217abb4-525d-491f-9c80-3f3c5b5e0326', '👧', 2),
('Kids Clothing (5-12Y)', 'Детско облекло (5-12Г)', 'cloth-kids', '6217abb4-525d-491f-9c80-3f3c5b5e0326', '🧒', 3),
('Baby Shoes', 'Бебешки обувки', 'cloth-baby-shoes', '6217abb4-525d-491f-9c80-3f3c5b5e0326', '👟', 4),
('Kids Shoes', 'Детски обувки', 'cloth-kids-shoes', '6217abb4-525d-491f-9c80-3f3c5b5e0326', '👞', 5),
('Kids Accessories', 'Детски аксесоари', 'cloth-accessories', '6217abb4-525d-491f-9c80-3f3c5b5e0326', '🎒', 6);
;
