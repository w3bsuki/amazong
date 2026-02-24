
-- STEP 3: Create L3 categories for MEN'S CLOTHING
-- Parent: b1000000-0000-0000-0001-000000000001 (Men's > Clothing)

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('T-Shirts & Polos', 'Тениски и поло', 'men-tshirts', 'b1000000-0000-0000-0001-000000000001', 1),
  ('Shirts', 'Ризи', 'men-shirts', 'b1000000-0000-0000-0001-000000000001', 2),
  ('Pants & Jeans', 'Панталони и дънки', 'men-pants', 'b1000000-0000-0000-0001-000000000001', 3),
  ('Shorts', 'Къси панталони', 'men-shorts', 'b1000000-0000-0000-0001-000000000001', 4),
  ('Jackets & Coats', 'Якета и палта', 'men-jackets', 'b1000000-0000-0000-0001-000000000001', 5),
  ('Sweaters & Hoodies', 'Пуловери и суитшъри', 'men-sweaters', 'b1000000-0000-0000-0001-000000000001', 6),
  ('Suits & Blazers', 'Костюми и сака', 'men-suits', 'b1000000-0000-0000-0001-000000000001', 7),
  ('Activewear', 'Спортно облекло', 'men-activewear', 'b1000000-0000-0000-0001-000000000001', 8),
  ('Underwear & Sleepwear', 'Бельо и пижами', 'men-underwear', 'b1000000-0000-0000-0001-000000000001', 9),
  ('Swimwear', 'Бански', 'men-swimwear', 'b1000000-0000-0000-0001-000000000001', 10);

-- L3 for MEN'S SHOES
-- Parent: b1000000-0000-0000-0001-000000000002 (Men's > Shoes)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Sneakers', 'Кецове', 'men-sneakers', 'b1000000-0000-0000-0001-000000000002', 1),
  ('Boots', 'Ботуши', 'men-boots', 'b1000000-0000-0000-0001-000000000002', 2),
  ('Formal Shoes', 'Официални обувки', 'men-formal-shoes', 'b1000000-0000-0000-0001-000000000002', 3),
  ('Sandals & Flip-Flops', 'Сандали и джапанки', 'men-sandals', 'b1000000-0000-0000-0001-000000000002', 4),
  ('Loafers & Slip-Ons', 'Мокасини', 'men-loafers', 'b1000000-0000-0000-0001-000000000002', 5),
  ('Sports Shoes', 'Спортни обувки', 'men-sports-shoes', 'b1000000-0000-0000-0001-000000000002', 6);

-- L3 for MEN'S ACCESSORIES
-- Parent: b1000000-0000-0000-0001-000000000003 (Men's > Accessories)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Wallets', 'Портфейли', 'men-wallets', 'b1000000-0000-0000-0001-000000000003', 1),
  ('Belts', 'Колани', 'men-belts', 'b1000000-0000-0000-0001-000000000003', 2),
  ('Bags & Backpacks', 'Чанти и раници', 'men-bags', 'b1000000-0000-0000-0001-000000000003', 3),
  ('Hats & Caps', 'Шапки и кепета', 'men-hats', 'b1000000-0000-0000-0001-000000000003', 4),
  ('Sunglasses', 'Слънчеви очила', 'men-sunglasses', 'b1000000-0000-0000-0001-000000000003', 5),
  ('Scarves & Gloves', 'Шалове и ръкавици', 'men-scarves', 'b1000000-0000-0000-0001-000000000003', 6),
  ('Ties & Bow Ties', 'Вратовръзки и папионки', 'men-ties', 'b1000000-0000-0000-0001-000000000003', 7);

-- L3 for MEN'S JEWELRY
-- Parent: b1000000-0000-0000-0001-000000000004 (Men's > Jewelry)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES 
  ('Watches', 'Часовници', 'men-watches', 'b1000000-0000-0000-0001-000000000004', 1),
  ('Bracelets', 'Гривни', 'men-bracelets', 'b1000000-0000-0000-0001-000000000004', 2),
  ('Rings', 'Пръстени', 'men-rings', 'b1000000-0000-0000-0001-000000000004', 3),
  ('Necklaces & Chains', 'Колиета и вериги', 'men-necklaces', 'b1000000-0000-0000-0001-000000000004', 4),
  ('Cufflinks', 'Ръкавели', 'men-cufflinks', 'b1000000-0000-0000-0001-000000000004', 5);
;
