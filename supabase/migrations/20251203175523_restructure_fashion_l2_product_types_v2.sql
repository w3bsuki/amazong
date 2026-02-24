
-- STEP 2: Create L2 categories (Product Types: Clothing, Shoes, Accessories, Jewelry)
-- Using unique slugs to avoid conflicts

-- ========== MEN'S L2 ==========
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES 
  ('b1000000-0000-0000-0001-000000000001', 'Clothing', 'Облекло', 'men-clothing', 'a1000000-0000-0000-0000-000000000001', 1, 'tshirt'),
  ('b1000000-0000-0000-0001-000000000002', 'Shoes', 'Обувки', 'men-shoes', 'a1000000-0000-0000-0000-000000000001', 2, 'shoe'),
  ('b1000000-0000-0000-0001-000000000003', 'Accessories', 'Аксесоари', 'men-accessories', 'a1000000-0000-0000-0000-000000000001', 3, 'bag'),
  ('b1000000-0000-0000-0001-000000000004', 'Jewelry & Watches', 'Бижута и часовници', 'men-jewelry', 'a1000000-0000-0000-0000-000000000001', 4, 'diamond');

-- ========== WOMEN'S L2 ==========
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES 
  ('b1000000-0000-0000-0002-000000000001', 'Clothing', 'Облекло', 'women-clothing', 'a1000000-0000-0000-0000-000000000002', 1, 'dress'),
  ('b1000000-0000-0000-0002-000000000002', 'Shoes', 'Обувки', 'women-shoes', 'a1000000-0000-0000-0000-000000000002', 2, 'shoe'),
  ('b1000000-0000-0000-0002-000000000003', 'Accessories', 'Аксесоари', 'women-accessories', 'a1000000-0000-0000-0000-000000000002', 3, 'bag'),
  ('b1000000-0000-0000-0002-000000000004', 'Jewelry & Watches', 'Бижута и часовници', 'women-jewelry', 'a1000000-0000-0000-0000-000000000002', 4, 'diamond');

-- ========== KIDS L2 ==========
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES 
  ('b1000000-0000-0000-0003-000000000001', 'Clothing', 'Облекло', 'child-clothing', 'a1000000-0000-0000-0000-000000000003', 1, 'tshirt'),
  ('b1000000-0000-0000-0003-000000000002', 'Shoes', 'Обувки', 'child-shoes', 'a1000000-0000-0000-0000-000000000003', 2, 'shoe'),
  ('b1000000-0000-0000-0003-000000000003', 'Accessories', 'Аксесоари', 'child-accessories', 'a1000000-0000-0000-0000-000000000003', 3, 'bag');

-- ========== UNISEX L2 ==========
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES 
  ('b1000000-0000-0000-0004-000000000001', 'Clothing', 'Облекло', 'uni-clothing', 'a1000000-0000-0000-0000-000000000004', 1, 'tshirt'),
  ('b1000000-0000-0000-0004-000000000002', 'Shoes', 'Обувки', 'uni-shoes', 'a1000000-0000-0000-0000-000000000004', 2, 'shoe'),
  ('b1000000-0000-0000-0004-000000000003', 'Accessories', 'Аксесоари', 'uni-accessories', 'a1000000-0000-0000-0000-000000000004', 3, 'bag');
;
