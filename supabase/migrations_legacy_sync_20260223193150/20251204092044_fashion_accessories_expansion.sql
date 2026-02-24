
-- ============================================================
-- FASHION EXPANSION - PART 2: Accessories (Standalone L1)
-- ============================================================
-- Adding comprehensive Accessories L1 category with full L2/L3 hierarchy
-- This is in addition to gender-specific accessories already in the system

DO $$
DECLARE
  fashion_id UUID;
  accessories_id UUID;
  belts_id UUID;
  hats_id UUID;
  scarves_id UUID;
  gloves_id UUID;
  sunglasses_id UUID;
  hair_acc_id UUID;
  ties_id UUID;
  keychains_id UUID;
  umbrellas_id UUID;
  tech_acc_id UUID;
BEGIN
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  
  -- ============================================================
  -- L1: Accessories (Main)
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Accessories', 'Аксесоари', 'fashion-accessories-main', fashion_id, '🕶️', 6, 'Fashion accessories including belts, hats, scarves, sunglasses and more', 'Модни аксесоари - колани, шапки, шалове, слънчеви очила и др.')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO accessories_id;
  
  -- ============================================================
  -- L2: Belts
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Belts', 'Колани', 'accessories-belts', accessories_id, '⌨️', 1, 'Leather, fabric and designer belts')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO belts_id;
  
  -- L3: Belt subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Leather Belts', 'Кожени колани', 'belts-leather', belts_id, 1),
    ('Fabric Belts', 'Текстилни колани', 'belts-fabric', belts_id, 2),
    ('Designer Belts', 'Дизайнерски колани', 'belts-designer', belts_id, 3),
    ('Dress Belts', 'Официални колани', 'belts-dress', belts_id, 4),
    ('Casual Belts', 'Ежедневни колани', 'belts-casual', belts_id, 5),
    ('Braided Belts', 'Плетени колани', 'belts-braided', belts_id, 6),
    ('Reversible Belts', 'Двустранни колани', 'belts-reversible', belts_id, 7),
    ('Stretch Belts', 'Еластични колани', 'belts-stretch', belts_id, 8),
    ('Chain Belts', 'Верижни колани', 'belts-chain', belts_id, 9),
    ('Western Belts', 'Уестърн колани', 'belts-western', belts_id, 10),
    ('Belt Buckles', 'Токи за колани', 'belts-buckles', belts_id, 11)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Hats & Caps
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Hats & Caps', 'Шапки и кепета', 'accessories-hats', accessories_id, '🧢', 2, 'Baseball caps, beanies, fedoras and more')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hats_id;
  
  -- L3: Hat subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Baseball Caps', 'Бейзболни шапки', 'hats-baseball', hats_id, 1),
    ('Beanies', 'Плетени шапки', 'hats-beanies', hats_id, 2),
    ('Fedoras', 'Федори', 'hats-fedoras', hats_id, 3),
    ('Sun Hats', 'Слънцезащитни шапки', 'hats-sun', hats_id, 4),
    ('Bucket Hats', 'Рибарски шапки', 'hats-bucket', hats_id, 5),
    ('Trucker Hats', 'Шапки с мрежа', 'hats-trucker', hats_id, 6),
    ('Panama Hats', 'Панами', 'hats-panama', hats_id, 7),
    ('Straw Hats', 'Сламени шапки', 'hats-straw', hats_id, 8),
    ('Berets', 'Барети', 'hats-berets', hats_id, 9),
    ('Flat Caps', 'Плоски шапки', 'hats-flat', hats_id, 10),
    ('Visors', 'Козирки', 'hats-visors', hats_id, 11),
    ('Winter Hats', 'Зимни шапки', 'hats-winter', hats_id, 12),
    ('Snapback Caps', 'Снепбек шапки', 'hats-snapback', hats_id, 13)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Scarves & Wraps
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Scarves & Wraps', 'Шалове и шамии', 'accessories-scarves', accessories_id, '🧣', 3, 'Winter scarves, silk scarves and wraps')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO scarves_id;
  
  -- L3: Scarf subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Winter Scarves', 'Зимни шалове', 'scarves-winter', scarves_id, 1),
    ('Silk Scarves', 'Копринени шалове', 'scarves-silk', scarves_id, 2),
    ('Cashmere Scarves', 'Кашмирени шалове', 'scarves-cashmere', scarves_id, 3),
    ('Cotton Scarves', 'Памучни шалове', 'scarves-cotton', scarves_id, 4),
    ('Infinity Scarves', 'Безкрайни шалове', 'scarves-infinity', scarves_id, 5),
    ('Bandanas', 'Бандани', 'scarves-bandanas', scarves_id, 6),
    ('Neck Warmers', 'Уважители за врат', 'scarves-neck-warmers', scarves_id, 7),
    ('Shawls', 'Шалове', 'scarves-shawls', scarves_id, 8),
    ('Wraps & Ponchos', 'Наметала и пончота', 'scarves-wraps', scarves_id, 9),
    ('Head Scarves', 'Забрадки', 'scarves-head', scarves_id, 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Gloves & Mittens
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Gloves & Mittens', 'Ръкавици', 'accessories-gloves', accessories_id, '🧤', 4, 'Winter gloves, leather gloves and touchscreen gloves')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO gloves_id;
  
  -- L3: Glove subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Leather Gloves', 'Кожени ръкавици', 'gloves-leather', gloves_id, 1),
    ('Winter Gloves', 'Зимни ръкавици', 'gloves-winter', gloves_id, 2),
    ('Touchscreen Gloves', 'Ръкавици за сензорен екран', 'gloves-touchscreen', gloves_id, 3),
    ('Driving Gloves', 'Шофьорски ръкавици', 'gloves-driving', gloves_id, 4),
    ('Mittens', 'Ръкавици без пръсти', 'gloves-mittens', gloves_id, 5),
    ('Fingerless Gloves', 'Ръкавици без пръсти', 'gloves-fingerless', gloves_id, 6),
    ('Knit Gloves', 'Плетени ръкавици', 'gloves-knit', gloves_id, 7),
    ('Dress Gloves', 'Официални ръкавици', 'gloves-dress', gloves_id, 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Sunglasses & Eyewear
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Sunglasses & Eyewear', 'Слънчеви очила', 'accessories-sunglasses', accessories_id, '🕶️', 5, 'Designer sunglasses, sport eyewear and reading glasses')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO sunglasses_id;
  
  -- L3: Sunglasses subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Aviator Sunglasses', 'Авиаторски очила', 'sunglasses-aviator', sunglasses_id, 1),
    ('Wayfarer Sunglasses', 'Уейфеър очила', 'sunglasses-wayfarer', sunglasses_id, 2),
    ('Round Sunglasses', 'Кръгли очила', 'sunglasses-round', sunglasses_id, 3),
    ('Cat Eye Sunglasses', 'Котешки очила', 'sunglasses-cat-eye', sunglasses_id, 4),
    ('Sport Sunglasses', 'Спортни очила', 'sunglasses-sport', sunglasses_id, 5),
    ('Polarized Sunglasses', 'Поляризирани очила', 'sunglasses-polarized', sunglasses_id, 6),
    ('Oversized Sunglasses', 'Уголемени очила', 'sunglasses-oversized', sunglasses_id, 7),
    ('Designer Sunglasses', 'Дизайнерски очила', 'sunglasses-designer', sunglasses_id, 8),
    ('Vintage Sunglasses', 'Винтидж очила', 'sunglasses-vintage', sunglasses_id, 9),
    ('Reading Glasses', 'Очила за четене', 'sunglasses-reading', sunglasses_id, 10),
    ('Blue Light Glasses', 'Очила против синя светлина', 'sunglasses-blue-light', sunglasses_id, 11),
    ('Eyeglass Cases', 'Калъфи за очила', 'sunglasses-cases', sunglasses_id, 12)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Hair Accessories
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Hair Accessories', 'Аксесоари за коса', 'accessories-hair', accessories_id, '💇', 6, 'Hair clips, headbands, scrunchies and hair ties')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hair_acc_id;
  
  -- L3: Hair accessory subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hair Clips & Barrettes', 'Фиби и шноли', 'hair-clips', hair_acc_id, 1),
    ('Headbands', 'Диадеми', 'hair-headbands', hair_acc_id, 2),
    ('Scrunchies', 'Ластици за коса', 'hair-scrunchies', hair_acc_id, 3),
    ('Hair Ties', 'Връзки за коса', 'hair-ties', hair_acc_id, 4),
    ('Hair Pins', 'Фиби', 'hair-pins', hair_acc_id, 5),
    ('Claw Clips', 'Щипки', 'hair-claw-clips', hair_acc_id, 6),
    ('Hair Combs', 'Гребени за коса', 'hair-combs', hair_acc_id, 7),
    ('Hair Bows', 'Панделки за коса', 'hair-bows', hair_acc_id, 8),
    ('Tiaras & Crowns', 'Корони и диадеми', 'hair-tiaras', hair_acc_id, 9),
    ('Wigs & Extensions', 'Перуки и удължения', 'hair-wigs', hair_acc_id, 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Ties & Formal Accessories
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Ties & Formal Accessories', 'Вратовръзки и официални аксесоари', 'accessories-ties', accessories_id, '👔', 7, 'Neckties, bow ties, pocket squares and cufflinks')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO ties_id;
  
  -- L3: Ties subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Neckties', 'Вратовръзки', 'ties-neckties', ties_id, 1),
    ('Bow Ties', 'Папионки', 'ties-bow', ties_id, 2),
    ('Pocket Squares', 'Кърпички за джоб', 'ties-pocket-squares', ties_id, 3),
    ('Cufflinks', 'Ръкавели', 'ties-cufflinks', ties_id, 4),
    ('Tie Clips & Bars', 'Щипки за вратовръзка', 'ties-clips', ties_id, 5),
    ('Suspenders', 'Тиранти', 'ties-suspenders', ties_id, 6),
    ('Lapel Pins', 'Значки за ревер', 'ties-lapel-pins', ties_id, 7),
    ('Tie & Cufflink Sets', 'Комплекти', 'ties-sets', ties_id, 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Keychains & Small Accessories
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Keychains & Small Accessories', 'Ключодържатели и малки аксесоари', 'accessories-keychains', accessories_id, '🔑', 8, 'Keychains, charms and small fashion items')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO keychains_id;
  
  -- L3: Keychain subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fashion Keychains', 'Модни ключодържатели', 'keychains-fashion', keychains_id, 1),
    ('Designer Keychains', 'Дизайнерски ключодържатели', 'keychains-designer', keychains_id, 2),
    ('Leather Keychains', 'Кожени ключодържатели', 'keychains-leather', keychains_id, 3),
    ('Bag Charms', 'Украшения за чанти', 'keychains-bag-charms', keychains_id, 4),
    ('Lanyards', 'Връзки за бадж', 'keychains-lanyards', keychains_id, 5),
    ('ID Holders', 'Калъфи за лична карта', 'keychains-id-holders', keychains_id, 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Umbrellas
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Umbrellas', 'Чадъри', 'accessories-umbrellas', accessories_id, '☂️', 9, 'Compact, golf and fashion umbrellas')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO umbrellas_id;
  
  -- L3: Umbrella subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Compact Umbrellas', 'Компактни чадъри', 'umbrellas-compact', umbrellas_id, 1),
    ('Golf Umbrellas', 'Голф чадъри', 'umbrellas-golf', umbrellas_id, 2),
    ('Fashion Umbrellas', 'Модни чадъри', 'umbrellas-fashion', umbrellas_id, 3),
    ('Automatic Umbrellas', 'Автоматични чадъри', 'umbrellas-automatic', umbrellas_id, 4),
    ('Windproof Umbrellas', 'Ветроустойчиви чадъри', 'umbrellas-windproof', umbrellas_id, 5),
    ('Clear Umbrellas', 'Прозрачни чадъри', 'umbrellas-clear', umbrellas_id, 6),
    ('Kids Umbrellas', 'Детски чадъри', 'umbrellas-kids', umbrellas_id, 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Tech Accessories (Fashion)
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Tech Accessories', 'Технологични аксесоари', 'accessories-tech', accessories_id, '📱', 10, 'Phone cases, watch straps and tech fashion items')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tech_acc_id;
  
  -- L3: Tech accessory subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Designer Phone Cases', 'Дизайнерски калъфи за телефон', 'tech-phone-cases', tech_acc_id, 1),
    ('Watch Straps & Bands', 'Каишки за часовници', 'tech-watch-straps', tech_acc_id, 2),
    ('AirPods Cases', 'Калъфи за AirPods', 'tech-airpods-cases', tech_acc_id, 3),
    ('Laptop Sleeves', 'Калъфи за лаптоп', 'tech-laptop-sleeves', tech_acc_id, 4),
    ('Tablet Cases', 'Калъфи за таблет', 'tech-tablet-cases', tech_acc_id, 5),
    ('Camera Straps', 'Ремъци за фотоапарат', 'tech-camera-straps', tech_acc_id, 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
END $$;
;
