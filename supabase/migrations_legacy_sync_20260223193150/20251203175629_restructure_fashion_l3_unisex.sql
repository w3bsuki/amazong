
-- STEP 6: Create L3 categories for UNISEX

-- L3 for UNISEX CLOTHING
-- Parent: b1000000-0000-0000-0004-000000000001 (Unisex > Clothing)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('T-Shirts', 'Тениски', 'unisex-tshirts', 'b1000000-0000-0000-0004-000000000001', 1),
  ('Hoodies & Sweatshirts', 'Суитшъри', 'unisex-hoodies', 'b1000000-0000-0000-0004-000000000001', 2),
  ('Joggers & Sweatpants', 'Спортни панталони', 'unisex-joggers', 'b1000000-0000-0000-0004-000000000001', 3),
  ('Jackets', 'Якета', 'unisex-jackets', 'b1000000-0000-0000-0004-000000000001', 4),
  ('Activewear', 'Спортно облекло', 'unisex-activewear', 'b1000000-0000-0000-0004-000000000001', 5);

-- L3 for UNISEX SHOES
-- Parent: b1000000-0000-0000-0004-000000000002 (Unisex > Shoes)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Sneakers', 'Кецове', 'unisex-sneakers', 'b1000000-0000-0000-0004-000000000002', 1),
  ('Running Shoes', 'Маратонки', 'unisex-running', 'b1000000-0000-0000-0004-000000000002', 2),
  ('Sandals & Slides', 'Сандали и чехли', 'unisex-sandals', 'b1000000-0000-0000-0004-000000000002', 3),
  ('Slippers', 'Пантофи', 'unisex-slippers', 'b1000000-0000-0000-0004-000000000002', 4);

-- L3 for UNISEX ACCESSORIES
-- Parent: b1000000-0000-0000-0004-000000000003 (Unisex > Accessories)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Backpacks', 'Раници', 'unisex-backpacks', 'b1000000-0000-0000-0004-000000000003', 1),
  ('Caps & Beanies', 'Шапки', 'unisex-caps', 'b1000000-0000-0000-0004-000000000003', 2),
  ('Sunglasses', 'Слънчеви очила', 'unisex-sunglasses', 'b1000000-0000-0000-0004-000000000003', 3),
  ('Scarves', 'Шалове', 'unisex-scarves', 'b1000000-0000-0000-0004-000000000003', 4),
  ('Watches', 'Часовници', 'unisex-watches', 'b1000000-0000-0000-0004-000000000003', 5);
;
