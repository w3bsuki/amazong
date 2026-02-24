-- Restore Fashion & Clothing L3 categories

-- Men's Tops L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('T-Shirts', 'mens-tshirts', 'Тениски', 1),
  ('Polo Shirts', 'mens-polos', 'Поло тениски', 2),
  ('Dress Shirts', 'mens-dress-shirts', 'Ризи', 3),
  ('Casual Shirts', 'mens-casual-shirts', 'Ежедневни ризи', 4),
  ('Sweaters', 'mens-sweaters', 'Пуловери', 5),
  ('Hoodies', 'mens-hoodies', 'Суитшърти', 6),
  ('Tank Tops', 'mens-tanks', 'Потници', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mens-tops'
ON CONFLICT (slug) DO NOTHING;

-- Men's Bottoms L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Jeans', 'mens-jeans', 'Дънки', 1),
  ('Chinos', 'mens-chinos', 'Чино панталони', 2),
  ('Dress Pants', 'mens-dress-pants', 'Официални панталони', 3),
  ('Cargo Pants', 'mens-cargo', 'Карго панталони', 4),
  ('Shorts', 'mens-shorts', 'Къси панталони', 5),
  ('Joggers', 'mens-joggers', 'Джогъри', 6),
  ('Sweatpants', 'mens-sweatpants', 'Анцузи', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mens-bottoms'
ON CONFLICT (slug) DO NOTHING;

-- Men's Outerwear L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Winter Jackets', 'mens-winter-jackets', 'Зимни якета', 1),
  ('Rain Jackets', 'mens-rain-jackets', 'Дъждобрани', 2),
  ('Leather Jackets', 'mens-leather-jackets', 'Кожени якета', 3),
  ('Blazers', 'mens-blazers', 'Блейзъри', 4),
  ('Vests', 'mens-vests', 'Жилетки', 5),
  ('Coats', 'mens-coats', 'Палта', 6),
  ('Windbreakers', 'mens-windbreakers', 'Ветровки', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mens-outerwear'
ON CONFLICT (slug) DO NOTHING;

-- Men's Suits L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Business Suits', 'suits-business', 'Бизнес костюми', 1),
  ('Wedding Suits', 'suits-wedding', 'Сватбени костюми', 2),
  ('Casual Suits', 'suits-casual', 'Ежедневни костюми', 3),
  ('Tuxedos', 'suits-tuxedos', 'Смокинги', 4),
  ('Suit Jackets', 'suits-jackets', 'Сака', 5),
  ('Suit Pants', 'suits-pants', 'Панталони за костюм', 6),
  ('Suit Vests', 'suits-vests', 'Жилетки за костюм', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mens-suits'
ON CONFLICT (slug) DO NOTHING;

-- Women's Tops L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Blouses', 'womens-blouses', 'Блузи', 1),
  ('T-Shirts', 'womens-tshirts', 'Тениски', 2),
  ('Tank Tops', 'womens-tanks', 'Потници', 3),
  ('Sweaters', 'womens-sweaters', 'Пуловери', 4),
  ('Cardigans', 'womens-cardigans', 'Жилетки', 5),
  ('Crop Tops', 'womens-crop-tops', 'Къси топове', 6),
  ('Bodysuits', 'womens-bodysuits', 'Бодита', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'womens-tops'
ON CONFLICT (slug) DO NOTHING;

-- Women's Bottoms L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Jeans', 'womens-jeans', 'Дънки', 1),
  ('Leggings', 'womens-leggings', 'Клинове', 2),
  ('Skirts', 'womens-skirts', 'Поли', 3),
  ('Dress Pants', 'womens-dress-pants', 'Официални панталони', 4),
  ('Shorts', 'womens-shorts', 'Къси панталони', 5),
  ('Culottes', 'womens-culottes', 'Кюлоти', 6),
  ('Joggers', 'womens-joggers', 'Джогъри', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'womens-bottoms'
ON CONFLICT (slug) DO NOTHING;

-- Women's Dresses L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Casual Dresses', 'dresses-casual', 'Ежедневни рокли', 1),
  ('Cocktail Dresses', 'dresses-cocktail', 'Коктейлни рокли', 2),
  ('Evening Dresses', 'dresses-evening', 'Вечерни рокли', 3),
  ('Maxi Dresses', 'dresses-maxi', 'Макси рокли', 4),
  ('Mini Dresses', 'dresses-mini', 'Мини рокли', 5),
  ('Midi Dresses', 'dresses-midi', 'Миди рокли', 6),
  ('Shirt Dresses', 'dresses-shirt', 'Рокли тип риза', 7),
  ('Bodycon Dresses', 'dresses-bodycon', 'Вталени рокли', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'womens-dresses'
ON CONFLICT (slug) DO NOTHING;

-- Women's Outerwear L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Coats', 'womens-coats', 'Палта', 1),
  ('Jackets', 'womens-jackets', 'Якета', 2),
  ('Blazers', 'womens-blazers', 'Блейзъри', 3),
  ('Trench Coats', 'womens-trench', 'Тренч палта', 4),
  ('Puffer Jackets', 'womens-puffer', 'Пухенки', 5),
  ('Leather Jackets', 'womens-leather', 'Кожени якета', 6),
  ('Capes', 'womens-capes', 'Пелерини', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'womens-outerwear'
ON CONFLICT (slug) DO NOTHING;

-- Shoes L3 - Men
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Sneakers', 'shoes-mens-sneakers', 'Маратонки', 1),
  ('Dress Shoes', 'shoes-mens-dress', 'Официални обувки', 2),
  ('Boots', 'shoes-mens-boots', 'Ботуши', 3),
  ('Loafers', 'shoes-mens-loafers', 'Мокасини', 4),
  ('Sandals', 'shoes-mens-sandals', 'Сандали', 5),
  ('Athletic Shoes', 'shoes-mens-athletic', 'Спортни обувки', 6),
  ('Slippers', 'shoes-mens-slippers', 'Пантофи', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'shoes-men'
ON CONFLICT (slug) DO NOTHING;

-- Shoes L3 - Women
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Heels', 'shoes-womens-heels', 'Обувки на ток', 1),
  ('Flats', 'shoes-womens-flats', 'Равни обувки', 2),
  ('Boots', 'shoes-womens-boots', 'Ботуши', 3),
  ('Sneakers', 'shoes-womens-sneakers', 'Маратонки', 4),
  ('Sandals', 'shoes-womens-sandals', 'Сандали', 5),
  ('Wedges', 'shoes-womens-wedges', 'Платформи', 6),
  ('Mules', 'shoes-womens-mules', 'Чехли', 7),
  ('Loafers', 'shoes-womens-loafers', 'Мокасини', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'shoes-women'
ON CONFLICT (slug) DO NOTHING;

-- Accessories L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Necklaces', 'jewelry-necklaces', 'Колиета', 1),
  ('Earrings', 'jewelry-earrings', 'Обеци', 2),
  ('Bracelets', 'jewelry-bracelets', 'Гривни', 3),
  ('Rings', 'jewelry-rings', 'Пръстени', 4),
  ('Watches', 'jewelry-watches', 'Часовници', 5),
  ('Brooches', 'jewelry-brooches', 'Брошки', 6),
  ('Anklets', 'jewelry-anklets', 'Гривни за глезен', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'accessories-jewelry'
ON CONFLICT (slug) DO NOTHING;

-- Bags L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Handbags', 'bags-handbags', 'Дамски чанти', 1),
  ('Crossbody Bags', 'bags-crossbody', 'Чанти през рамо', 2),
  ('Tote Bags', 'bags-tote', 'Тотове', 3),
  ('Clutches', 'bags-clutches', 'Клъчове', 4),
  ('Backpacks', 'bags-backpacks', 'Раници', 5),
  ('Messenger Bags', 'bags-messenger', 'Пощальонски чанти', 6),
  ('Wallets', 'bags-wallets', 'Портфейли', 7),
  ('Briefcases', 'bags-briefcases', 'Куфарчета', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'accessories-bags'
ON CONFLICT (slug) DO NOTHING;;
