
-- STEP 5: Create L3 categories for KIDS

-- L3 for KIDS CLOTHING
-- Parent: b1000000-0000-0000-0003-000000000001 (Kids > Clothing)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Boys'' Clothing', 'Момчешко облекло', 'kids-boys-clothing', 'b1000000-0000-0000-0003-000000000001', 1),
  ('Girls'' Clothing', 'Момичешко облекло', 'kids-girls-clothing', 'b1000000-0000-0000-0003-000000000001', 2),
  ('Baby Clothing (0-24m)', 'Бебешко облекло (0-24м)', 'kids-baby-clothing', 'b1000000-0000-0000-0003-000000000001', 3),
  ('School Uniforms', 'Училищни униформи', 'kids-uniforms', 'b1000000-0000-0000-0003-000000000001', 4),
  ('Activewear', 'Спортно облекло', 'kids-activewear', 'b1000000-0000-0000-0003-000000000001', 5),
  ('Swimwear', 'Бански', 'kids-swimwear', 'b1000000-0000-0000-0003-000000000001', 6),
  ('Sleepwear', 'Пижами', 'kids-sleepwear', 'b1000000-0000-0000-0003-000000000001', 7);

-- L3 for KIDS SHOES
-- Parent: b1000000-0000-0000-0003-000000000002 (Kids > Shoes)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Boys'' Shoes', 'Момчешки обувки', 'kids-boys-shoes', 'b1000000-0000-0000-0003-000000000002', 1),
  ('Girls'' Shoes', 'Момичешки обувки', 'kids-girls-shoes', 'b1000000-0000-0000-0003-000000000002', 2),
  ('Baby Shoes', 'Бебешки обувки', 'kids-baby-shoes', 'b1000000-0000-0000-0003-000000000002', 3),
  ('Sneakers', 'Кецове', 'kids-sneakers', 'b1000000-0000-0000-0003-000000000002', 4),
  ('Boots', 'Ботуши', 'kids-boots', 'b1000000-0000-0000-0003-000000000002', 5),
  ('Sandals', 'Сандали', 'kids-sandals', 'b1000000-0000-0000-0003-000000000002', 6),
  ('School Shoes', 'Училищни обувки', 'kids-school-shoes', 'b1000000-0000-0000-0003-000000000002', 7);

-- L3 for KIDS ACCESSORIES
-- Parent: b1000000-0000-0000-0003-000000000003 (Kids > Accessories)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Backpacks & Bags', 'Раници и чанти', 'kids-backpacks', 'b1000000-0000-0000-0003-000000000003', 1),
  ('Hats & Caps', 'Шапки и кепета', 'kids-hats', 'b1000000-0000-0000-0003-000000000003', 2),
  ('Belts', 'Колани', 'kids-belts', 'b1000000-0000-0000-0003-000000000003', 3),
  ('Watches', 'Часовници', 'kids-watches', 'b1000000-0000-0000-0003-000000000003', 4),
  ('Sunglasses', 'Слънчеви очила', 'kids-sunglasses', 'b1000000-0000-0000-0003-000000000003', 5),
  ('Hair Accessories', 'Аксесоари за коса', 'kids-hair', 'b1000000-0000-0000-0003-000000000003', 6);
;
