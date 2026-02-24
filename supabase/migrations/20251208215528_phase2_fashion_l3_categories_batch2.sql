-- Phase 2.1.2: Fashion L3 Categories - Batch 2: Accessories, Clothing extras, Luggage
-- Target: Add L3 children to remaining Fashion L2 categories

-- =====================================================
-- ACCESSORIES L3 CATEGORIES  
-- =====================================================

-- Unisex Accessories (uni-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Phone Cases', 'Laptop Sleeves', 'Wallets', 'Keychains', 'Lanyards', 'Badge Holders', 'Tech Pouches', 'Cable Organizers']),
  unnest(ARRAY['uni-acc-phone-cases', 'uni-acc-laptop-sleeves', 'uni-acc-wallets', 'uni-acc-keychains', 'uni-acc-lanyards', 'uni-acc-badge-holders', 'uni-acc-tech-pouches', 'uni-acc-cable-organizers']),
  (SELECT id FROM categories WHERE slug = 'uni-accessories'),
  unnest(ARRAY['Калъфи за телефон', 'Калъфи за лаптоп', 'Портфейли', 'Ключодържатели', 'Връзки за бадж', 'Държачи за бадж', 'Техно калъфи', 'Организатори за кабели']),
  '🎀'
ON CONFLICT (slug) DO NOTHING;

-- Belts (acc-belts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Leather Belts', 'Canvas Belts', 'Braided Belts', 'Dress Belts', 'Casual Belts', 'Western Belts', 'Reversible Belts', 'Elastic Belts']),
  unnest(ARRAY['belts-leather', 'belts-canvas', 'belts-braided', 'belts-dress', 'belts-casual', 'belts-western', 'belts-reversible', 'belts-elastic']),
  (SELECT id FROM categories WHERE slug = 'acc-belts'),
  unnest(ARRAY['Кожени колани', 'Платнени колани', 'Плетени колани', 'Елегантни колани', 'Ежедневни колани', 'Уестърн колани', 'Двустранни колани', 'Еластични колани']),
  '👔'
ON CONFLICT (slug) DO NOTHING;

-- Gloves (acc-gloves)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Leather Gloves', 'Wool Gloves', 'Touchscreen Gloves', 'Driving Gloves', 'Winter Gloves', 'Fashion Gloves', 'Fingerless Gloves', 'Mittens']),
  unnest(ARRAY['gloves-leather', 'gloves-wool', 'gloves-touchscreen', 'gloves-driving', 'gloves-winter', 'gloves-fashion', 'gloves-fingerless', 'gloves-mittens']),
  (SELECT id FROM categories WHERE slug = 'acc-gloves'),
  unnest(ARRAY['Кожени ръкавици', 'Вълнени ръкавици', 'Ръкавици за тъчскрийн', 'Шофьорски ръкавици', 'Зимни ръкавици', 'Модни ръкавици', 'Ръкавици без пръсти', 'Ръкавици един пръст']),
  '🧤'
ON CONFLICT (slug) DO NOTHING;

-- Hair Accessories (acc-hair)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Clips', 'Headbands', 'Scrunchies', 'Hair Ties', 'Barrettes', 'Hair Pins', 'Hair Combs', 'Hair Bows', 'Hair Bands']),
  unnest(ARRAY['hair-clips', 'hair-headbands', 'hair-scrunchies', 'hair-ties', 'hair-barrettes', 'hair-pins', 'hair-combs', 'hair-bows', 'hair-bands']),
  (SELECT id FROM categories WHERE slug = 'acc-hair'),
  unnest(ARRAY['Фиби', 'Диадеми', 'Скрънчита', 'Ластици за коса', 'Барети', 'Шноли', 'Гребени за коса', 'Панделки за коса', 'Ленти за коса']),
  '🎀'
ON CONFLICT (slug) DO NOTHING;

-- Hats & Caps (acc-hats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Baseball Caps', 'Beanies', 'Fedoras', 'Sun Hats', 'Bucket Hats', 'Trucker Hats', 'Flat Caps', 'Panama Hats', 'Winter Hats', 'Visors']),
  unnest(ARRAY['hats-baseball-caps', 'hats-beanies', 'hats-fedoras', 'hats-sun', 'hats-bucket', 'hats-trucker', 'hats-flat', 'hats-panama', 'hats-winter', 'hats-visors']),
  (SELECT id FROM categories WHERE slug = 'acc-hats'),
  unnest(ARRAY['Бейзболни шапки', 'Шапки бийни', 'Федори', 'Слънчеви шапки', 'Шапки кофа', 'Тракер шапки', 'Каскети', 'Панама шапки', 'Зимни шапки', 'Козирки']),
  '🧢'
ON CONFLICT (slug) DO NOTHING;

-- Scarves (acc-scarves)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Silk Scarves', 'Wool Scarves', 'Cashmere Scarves', 'Cotton Scarves', 'Infinity Scarves', 'Bandanas', 'Shawls', 'Pashminas', 'Neck Scarves']),
  unnest(ARRAY['scarves-silk', 'scarves-wool', 'scarves-cashmere', 'scarves-cotton', 'scarves-infinity', 'scarves-bandanas', 'scarves-shawls', 'scarves-pashminas', 'scarves-neck']),
  (SELECT id FROM categories WHERE slug = 'acc-scarves'),
  unnest(ARRAY['Копринени шалове', 'Вълнени шалове', 'Кашмирени шалове', 'Памучни шалове', 'Безкрайни шалове', 'Бандани', 'Шалове', 'Пашмини', 'Шалчета за врат']),
  '🧣'
ON CONFLICT (slug) DO NOTHING;

-- Ties & Bowties (acc-ties)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Silk Ties', 'Knit Ties', 'Skinny Ties', 'Wide Ties', 'Bow Ties', 'Clip-On Ties', 'Cravats', 'Tie Sets', 'Tie Bars']),
  unnest(ARRAY['ties-silk', 'ties-knit', 'ties-skinny', 'ties-wide', 'ties-bow', 'ties-clip-on', 'ties-cravats', 'ties-sets', 'ties-bars']),
  (SELECT id FROM categories WHERE slug = 'acc-ties'),
  unnest(ARRAY['Копринени вратовръзки', 'Плетени вратовръзки', 'Тесни вратовръзки', 'Широки вратовръзки', 'Папионки', 'Вратовръзки с щипка', 'Кравати', 'Комплекти вратовръзки', 'Игли за вратовръзка']),
  '👔'
ON CONFLICT (slug) DO NOTHING;

-- Sunglasses (acc-sunglasses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Aviator Sunglasses', 'Wayfarer Sunglasses', 'Round Sunglasses', 'Cat Eye Sunglasses', 'Sport Sunglasses', 'Polarized Sunglasses', 'Designer Sunglasses', 'Oversized Sunglasses']),
  unnest(ARRAY['sunglasses-aviator', 'sunglasses-wayfarer', 'sunglasses-round', 'sunglasses-cat-eye', 'sunglasses-sport', 'sunglasses-polarized', 'sunglasses-designer', 'sunglasses-oversized']),
  (SELECT id FROM categories WHERE slug = 'acc-sunglasses'),
  unnest(ARRAY['Авиатор слънчеви очила', 'Уейфарър слънчеви очила', 'Кръгли слънчеви очила', 'Котешко око слънчеви очила', 'Спортни слънчеви очила', 'Поляризирани слънчеви очила', 'Дизайнерски слънчеви очила', 'Големи слънчеви очила']),
  '🕶️'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- CLOTHING L3 CATEGORIES
-- =====================================================

-- Unisex Clothing (uni-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['T-Shirts', 'Hoodies', 'Sweatshirts', 'Joggers', 'Shorts', 'Jackets', 'Vests', 'Pajamas']),
  unnest(ARRAY['uni-tshirts', 'uni-hoodies', 'uni-sweatshirts', 'uni-joggers', 'uni-shorts', 'uni-jackets', 'uni-vests', 'uni-pajamas']),
  (SELECT id FROM categories WHERE slug = 'uni-clothing'),
  unnest(ARRAY['Тениски', 'Суитшърти с качулка', 'Суитшърти', 'Джогъри', 'Къси панталони', 'Якета', 'Жилетки', 'Пижами']),
  '👕'
ON CONFLICT (slug) DO NOTHING;

-- Unisex Shoes (uni-shoes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sneakers', 'Running Shoes', 'Slip-Ons', 'Canvas Shoes', 'High Tops', 'Sandals', 'Slides', 'Clogs']),
  unnest(ARRAY['uni-sneakers', 'uni-running-shoes', 'uni-slip-ons', 'uni-canvas-shoes', 'uni-high-tops', 'uni-sandals', 'uni-slides', 'uni-clogs']),
  (SELECT id FROM categories WHERE slug = 'uni-shoes'),
  unnest(ARRAY['Маратонки', 'Бегачки', 'Мокасини', 'Платнени обувки', 'Високи кецове', 'Сандали', 'Чехли', 'Дървени обувки']),
  '👟'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- LUGGAGE L3 CATEGORIES
-- =====================================================

-- Carry-On Luggage (bags-luggage-carry-on)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hardside Carry-On', 'Softside Carry-On', 'Spinner Carry-On', 'Underseat Bags', 'Carry-On Backpacks', 'Carry-On Duffels']),
  unnest(ARRAY['carry-on-hardside', 'carry-on-softside', 'carry-on-spinner', 'carry-on-underseat', 'carry-on-backpacks', 'carry-on-duffels']),
  (SELECT id FROM categories WHERE slug = 'bags-luggage-carry-on'),
  unnest(ARRAY['Твърд ръчен багаж', 'Мек ръчен багаж', 'Спинър ръчен багаж', 'Чанти под седалката', 'Раници за ръчен багаж', 'Дъфел ръчен багаж']),
  '🧳'
ON CONFLICT (slug) DO NOTHING;

-- Checked Luggage (bags-luggage-checked)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Medium Checked Luggage', 'Large Checked Luggage', 'Expandable Luggage', 'Hardside Checked', 'Softside Checked', 'Spinner Checked']),
  unnest(ARRAY['checked-medium', 'checked-large', 'checked-expandable', 'checked-hardside', 'checked-softside', 'checked-spinner']),
  (SELECT id FROM categories WHERE slug = 'bags-luggage-checked'),
  unnest(ARRAY['Среден регистриран багаж', 'Голям регистриран багаж', 'Разширяем багаж', 'Твърд регистриран', 'Мек регистриран', 'Спинър регистриран']),
  '🧳'
ON CONFLICT (slug) DO NOTHING;

-- Luggage Sets (bags-luggage-sets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['2-Piece Sets', '3-Piece Sets', '4-Piece Sets', 'Family Sets', 'Hardside Sets', 'Softside Sets']),
  unnest(ARRAY['luggage-set-2pc', 'luggage-set-3pc', 'luggage-set-4pc', 'luggage-set-family', 'luggage-set-hardside', 'luggage-set-softside']),
  (SELECT id FROM categories WHERE slug = 'bags-luggage-sets'),
  unnest(ARRAY['Комплект от 2 части', 'Комплект от 3 части', 'Комплект от 4 части', 'Семейни комплекти', 'Комплект твърд багаж', 'Комплект мек багаж']),
  '🧳'
ON CONFLICT (slug) DO NOTHING;

-- Briefcases (bags-briefcases)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Leather Briefcases', 'Rolling Briefcases', 'Attache Cases', 'Expandable Briefcases', 'Slim Briefcases', 'Laptop Briefcases']),
  unnest(ARRAY['briefcase-leather', 'briefcase-rolling', 'briefcase-attache', 'briefcase-expandable', 'briefcase-slim', 'briefcase-laptop']),
  (SELECT id FROM categories WHERE slug = 'bags-briefcases'),
  unnest(ARRAY['Кожени бизнес чанти', 'Бизнес чанти с колелца', 'Аташе куфарчета', 'Разширяеми бизнес чанти', 'Тънки бизнес чанти', 'Бизнес чанти за лаптоп']),
  '💼'
ON CONFLICT (slug) DO NOTHING;

-- Clutches (bags-clutches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Envelope Clutches', 'Box Clutches', 'Wristlet Clutches', 'Fold-Over Clutches', 'Beaded Clutches', 'Leather Clutches']),
  unnest(ARRAY['clutch-envelope', 'clutch-box', 'clutch-wristlet', 'clutch-fold-over', 'clutch-beaded', 'clutch-leather']),
  (SELECT id FROM categories WHERE slug = 'bags-clutches'),
  unnest(ARRAY['Плик клъчове', 'Кутия клъчове', 'Клъчове с презрамка', 'Сгъваеми клъчове', 'Мънистени клъчове', 'Кожени клъчове']),
  '👛'
ON CONFLICT (slug) DO NOTHING;

-- Crossbody Bags (bags-crossbody)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Mini Crossbody', 'Saddle Bags', 'Camera Bags', 'Chain Strap Crossbody', 'Canvas Crossbody', 'Leather Crossbody']),
  unnest(ARRAY['crossbody-mini', 'crossbody-saddle', 'crossbody-camera', 'crossbody-chain', 'crossbody-canvas', 'crossbody-leather']),
  (SELECT id FROM categories WHERE slug = 'bags-crossbody'),
  unnest(ARRAY['Мини кросбоди', 'Седло чанти', 'Камера чанти', 'Кросбоди с верижка', 'Платнени кросбоди', 'Кожени кросбоди']),
  '👜'
ON CONFLICT (slug) DO NOTHING;

-- Tote Bags (bags-tote)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Canvas Totes', 'Leather Totes', 'Beach Totes', 'Work Totes', 'Reversible Totes', 'Zip-Top Totes', 'Open-Top Totes']),
  unnest(ARRAY['tote-canvas', 'tote-leather', 'tote-beach', 'tote-work', 'tote-reversible', 'tote-zip-top', 'tote-open-top']),
  (SELECT id FROM categories WHERE slug = 'bags-tote'),
  unnest(ARRAY['Платнени тотал чанти', 'Кожени тотал чанти', 'Плажни тотал чанти', 'Работни тотал чанти', 'Двустранни тотал чанти', 'Тотал чанти с цип', 'Отворени тотал чанти']),
  '👜'
ON CONFLICT (slug) DO NOTHING;;
