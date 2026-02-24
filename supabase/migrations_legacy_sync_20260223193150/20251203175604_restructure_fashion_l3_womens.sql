
-- STEP 4: Create L3 categories for WOMEN'S

-- L3 for WOMEN'S CLOTHING
-- Parent: b1000000-0000-0000-0002-000000000001 (Women's > Clothing)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Dresses', 'Рокли', 'women-dresses', 'b1000000-0000-0000-0002-000000000001', 1),
  ('Tops & Blouses', 'Топове и блузи', 'women-tops', 'b1000000-0000-0000-0002-000000000001', 2),
  ('Pants & Jeans', 'Панталони и дънки', 'women-pants', 'b1000000-0000-0000-0002-000000000001', 3),
  ('Skirts', 'Поли', 'women-skirts', 'b1000000-0000-0000-0002-000000000001', 4),
  ('Jackets & Coats', 'Якета и палта', 'women-jackets', 'b1000000-0000-0000-0002-000000000001', 5),
  ('Sweaters & Cardigans', 'Пуловери и жилетки', 'women-sweaters', 'b1000000-0000-0000-0002-000000000001', 6),
  ('Activewear', 'Спортно облекло', 'women-activewear', 'b1000000-0000-0000-0002-000000000001', 7),
  ('Swimwear', 'Бански', 'women-swimwear', 'b1000000-0000-0000-0002-000000000001', 8),
  ('Lingerie & Sleepwear', 'Бельо и пижами', 'women-lingerie', 'b1000000-0000-0000-0002-000000000001', 9),
  ('Jumpsuits & Rompers', 'Гащеризони', 'women-jumpsuits', 'b1000000-0000-0000-0002-000000000001', 10);

-- L3 for WOMEN'S SHOES
-- Parent: b1000000-0000-0000-0002-000000000002 (Women's > Shoes)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Heels & Pumps', 'Токчета', 'women-heels', 'b1000000-0000-0000-0002-000000000002', 1),
  ('Sneakers', 'Кецове', 'women-sneakers', 'b1000000-0000-0000-0002-000000000002', 2),
  ('Boots & Booties', 'Ботуши и боти', 'women-boots', 'b1000000-0000-0000-0002-000000000002', 3),
  ('Flats & Loafers', 'Равни обувки', 'women-flats', 'b1000000-0000-0000-0002-000000000002', 4),
  ('Sandals', 'Сандали', 'women-sandals', 'b1000000-0000-0000-0002-000000000002', 5),
  ('Sports Shoes', 'Спортни обувки', 'women-sports-shoes', 'b1000000-0000-0000-0002-000000000002', 6),
  ('Wedges & Platforms', 'Платформи', 'women-wedges', 'b1000000-0000-0000-0002-000000000002', 7);

-- L3 for WOMEN'S ACCESSORIES
-- Parent: b1000000-0000-0000-0002-000000000003 (Women's > Accessories)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Handbags', 'Дамски чанти', 'women-handbags', 'b1000000-0000-0000-0002-000000000003', 1),
  ('Wallets & Clutches', 'Портмонета и клъчове', 'women-wallets', 'b1000000-0000-0000-0002-000000000003', 2),
  ('Backpacks', 'Раници', 'women-backpacks', 'b1000000-0000-0000-0002-000000000003', 3),
  ('Belts', 'Колани', 'women-belts', 'b1000000-0000-0000-0002-000000000003', 4),
  ('Hats & Hair Accessories', 'Шапки и аксесоари за коса', 'women-hats', 'b1000000-0000-0000-0002-000000000003', 5),
  ('Sunglasses', 'Слънчеви очила', 'women-sunglasses', 'b1000000-0000-0000-0002-000000000003', 6),
  ('Scarves & Wraps', 'Шалове', 'women-scarves', 'b1000000-0000-0000-0002-000000000003', 7),
  ('Gloves', 'Ръкавици', 'women-gloves', 'b1000000-0000-0000-0002-000000000003', 8);

-- L3 for WOMEN'S JEWELRY
-- Parent: b1000000-0000-0000-0002-000000000004 (Women's > Jewelry)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Necklaces', 'Колиета', 'women-necklaces', 'b1000000-0000-0000-0002-000000000004', 1),
  ('Earrings', 'Обеци', 'women-earrings', 'b1000000-0000-0000-0002-000000000004', 2),
  ('Bracelets', 'Гривни', 'women-bracelets', 'b1000000-0000-0000-0002-000000000004', 3),
  ('Rings', 'Пръстени', 'women-rings', 'b1000000-0000-0000-0002-000000000004', 4),
  ('Watches', 'Часовници', 'women-watches', 'b1000000-0000-0000-0002-000000000004', 5),
  ('Jewelry Sets', 'Комплекти бижута', 'women-jewelry-sets', 'b1000000-0000-0000-0002-000000000004', 6),
  ('Anklets', 'Гривни за глезен', 'women-anklets', 'b1000000-0000-0000-0002-000000000004', 7);
;
