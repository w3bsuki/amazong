
-- KIDS CATEGORY IMPROVEMENT - PHASE 1: Cleanup & Reorganization
-- ================================================================

-- 1.1 Deprecate kids-toys (merge into toys-games-sub)
UPDATE categories 
SET 
  name = '[DEPRECATED] Kids Toys',
  name_bg = '[DEPRECATED] Детски играчки',
  display_order = 9996
WHERE slug = 'kids-toys';

-- 1.2 Move children from kids-toys to toys-games-sub
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000012'
WHERE parent_id = '78cc5292-90f5-43e4-bc94-a48cd7c231b4';

-- 1.3 Rename toys-games-sub to toys-games for clarity
UPDATE categories 
SET 
  slug = 'toys-games',
  display_order = 7
WHERE id = 'a0000000-0000-0000-0000-000000000012';

-- 1.4 Update L1 display orders and names for consistency
UPDATE categories SET display_order = 1, name_bg = 'Бебешки артикули и пътуване' WHERE slug = 'baby-gear';
UPDATE categories SET display_order = 2 WHERE slug = 'baby-feeding';
UPDATE categories SET display_order = 3, name = 'Diapering & Potty', name_bg = 'Пелени и гърне' WHERE slug = 'diapering';
UPDATE categories SET display_order = 4, name = 'Baby Safety & Health', name_bg = 'Безопасност и здраве' WHERE slug = 'baby-safety';
UPDATE categories SET display_order = 5, name = 'Nursery & Furniture', name_bg = 'Детска стая и мебели' WHERE slug = 'nursery';
UPDATE categories SET display_order = 6, name = 'Kids Clothing & Shoes', name_bg = 'Детско облекло и обувки' WHERE slug = 'kids-clothing';

-- 1.5 Remove duplicate L3 categories (keep the better slugs)
DELETE FROM categories WHERE slug IN ('building-lego', 'edu-stem', 'edu-science', 'edu-coding', 'edu-puzzles', 'edu-learning', 'building-magnetic');
;
