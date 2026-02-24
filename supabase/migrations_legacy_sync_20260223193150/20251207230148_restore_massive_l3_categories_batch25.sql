
-- Batch 25: Fashion deep categories - Shoes, Bags, Accessories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Men's Shoes L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Shoes', 'Официални обувки', 'mens-dress-shoes', v_parent_id, 1),
      ('Loafers', 'Мокасини', 'mens-loafers', v_parent_id, 2),
      ('Oxfords', 'Оксфорди', 'mens-oxfords', v_parent_id, 3),
      ('Boots', 'Ботуши', 'mens-boots', v_parent_id, 4),
      ('Sneakers', 'Маратонки', 'mens-sneakers', v_parent_id, 5),
      ('Sandals', 'Сандали', 'mens-sandals', v_parent_id, 6),
      ('Athletic Shoes', 'Спортни обувки', 'mens-athletic-shoes', v_parent_id, 7),
      ('Slippers', 'Пантофи', 'mens-slippers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Shoes L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Heels', 'Обувки на ток', 'womens-heels', v_parent_id, 1),
      ('Flats', 'Равни обувки', 'womens-flats', v_parent_id, 2),
      ('Boots', 'Ботуши', 'womens-boots', v_parent_id, 3),
      ('Sneakers', 'Маратонки', 'womens-sneakers', v_parent_id, 4),
      ('Sandals', 'Сандали', 'womens-sandals', v_parent_id, 5),
      ('Wedges', 'Платформи', 'womens-wedges', v_parent_id, 6),
      ('Loafers', 'Мокасини', 'womens-loafers', v_parent_id, 7),
      ('Slippers', 'Пантофи', 'womens-slippers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kids' Shoes L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kids-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Boys Shoes', 'Обувки за момчета', 'boys-shoes', v_parent_id, 1),
      ('Girls Shoes', 'Обувки за момичета', 'girls-shoes', v_parent_id, 2),
      ('Kids Sneakers', 'Детски маратонки', 'kids-sneakers', v_parent_id, 3),
      ('Kids Boots', 'Детски ботуши', 'kids-boots', v_parent_id, 4),
      ('Kids Sandals', 'Детски сандали', 'kids-sandals', v_parent_id, 5),
      ('School Shoes', 'Училищни обувки', 'school-shoes', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bags L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'handbags';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tote Bags', 'Тотбагове', 'tote-bags', v_parent_id, 1),
      ('Crossbody Bags', 'Чанти през рамо', 'crossbody-bags', v_parent_id, 2),
      ('Shoulder Bags', 'Чанти на рамо', 'shoulder-bags', v_parent_id, 3),
      ('Clutches', 'Клъчове', 'clutches', v_parent_id, 4),
      ('Satchels', 'Чанти сачел', 'satchels', v_parent_id, 5),
      ('Hobo Bags', 'Хобо чанти', 'hobo-bags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'luggage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Carry-On Luggage', 'Ръчен багаж', 'carry-on-luggage', v_parent_id, 1),
      ('Checked Luggage', 'Регистриран багаж', 'checked-luggage', v_parent_id, 2),
      ('Luggage Sets', 'Комплекти куфари', 'luggage-sets', v_parent_id, 3),
      ('Travel Bags', 'Пътни чанти', 'travel-bags', v_parent_id, 4),
      ('Garment Bags', 'Калъфи за дрехи', 'garment-bags', v_parent_id, 5),
      ('Duffel Bags', 'Сакове', 'duffel-bags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wallets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bifold Wallets', 'Двугънки портфейли', 'bifold-wallets', v_parent_id, 1),
      ('Trifold Wallets', 'Тригънки портфейли', 'trifold-wallets', v_parent_id, 2),
      ('Card Holders', 'Калъфи за карти', 'card-holders', v_parent_id, 3),
      ('Money Clips', 'Щипки за пари', 'money-clips', v_parent_id, 4),
      ('Travel Wallets', 'Пътни портфейли', 'travel-wallets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fashion Accessories L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'belts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Leather Belts', 'Кожени колани', 'leather-belts', v_parent_id, 1),
      ('Canvas Belts', 'Текстилни колани', 'canvas-belts', v_parent_id, 2),
      ('Dress Belts', 'Официални колани', 'dress-belts', v_parent_id, 3),
      ('Casual Belts', 'Ежедневни колани', 'casual-belts', v_parent_id, 4),
      ('Designer Belts', 'Дизайнерски колани', 'designer-belts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sunglasses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Aviator Sunglasses', 'Авиаторски слънчеви очила', 'aviator-sunglasses', v_parent_id, 1),
      ('Wayfarer Sunglasses', 'Уейфарър слънчеви очила', 'wayfarer-sunglasses', v_parent_id, 2),
      ('Round Sunglasses', 'Кръгли слънчеви очила', 'round-sunglasses', v_parent_id, 3),
      ('Sport Sunglasses', 'Спортни слънчеви очила', 'sport-sunglasses', v_parent_id, 4),
      ('Polarized Sunglasses', 'Поляризирани слънчеви очила', 'polarized-sunglasses', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hats-caps';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baseball Caps', 'Бейзболни шапки', 'baseball-caps', v_parent_id, 1),
      ('Beanies', 'Зимни шапки', 'beanies', v_parent_id, 2),
      ('Fedoras', 'Федори', 'fedoras', v_parent_id, 3),
      ('Bucket Hats', 'Рибарски шапки', 'bucket-hats', v_parent_id, 4),
      ('Sun Hats', 'Слънчеви шапки', 'sun-hats', v_parent_id, 5),
      ('Flat Caps', 'Плоски шапки', 'flat-caps', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'scarves';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Winter Scarves', 'Зимни шалове', 'winter-scarves', v_parent_id, 1),
      ('Silk Scarves', 'Копринени шалове', 'silk-scarves', v_parent_id, 2),
      ('Fashion Scarves', 'Модни шалове', 'fashion-scarves', v_parent_id, 3),
      ('Infinity Scarves', 'Снуд шалове', 'infinity-scarves', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gloves';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Leather Gloves', 'Кожени ръкавици', 'leather-gloves', v_parent_id, 1),
      ('Winter Gloves', 'Зимни ръкавици', 'winter-gloves', v_parent_id, 2),
      ('Driving Gloves', 'Шофьорски ръкавици', 'driving-gloves', v_parent_id, 3),
      ('Fashion Gloves', 'Модни ръкавици', 'fashion-gloves', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men's Clothing L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-shirts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Shirts', 'Официални ризи', 'dress-shirts', v_parent_id, 1),
      ('Casual Shirts', 'Ежедневни ризи', 'casual-shirts', v_parent_id, 2),
      ('Polo Shirts', 'Поло тениски', 'polo-shirts', v_parent_id, 3),
      ('Flannel Shirts', 'Фланелени ризи', 'flannel-shirts', v_parent_id, 4),
      ('Linen Shirts', 'Ленени ризи', 'linen-shirts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-pants';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Pants', 'Официални панталони', 'dress-pants', v_parent_id, 1),
      ('Chinos', 'Чино панталони', 'chinos', v_parent_id, 2),
      ('Cargo Pants', 'Карго панталони', 'cargo-pants', v_parent_id, 3),
      ('Joggers', 'Джогъри', 'joggers', v_parent_id, 4),
      ('Shorts', 'Къси панталони', 'mens-shorts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-jeans';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Slim Fit Jeans', 'Тесни дънки', 'slim-fit-jeans', v_parent_id, 1),
      ('Straight Fit Jeans', 'Прави дънки', 'straight-fit-jeans', v_parent_id, 2),
      ('Relaxed Fit Jeans', 'Свободни дънки', 'relaxed-fit-jeans', v_parent_id, 3),
      ('Skinny Jeans', 'Скини дънки', 'mens-skinny-jeans', v_parent_id, 4),
      ('Bootcut Jeans', 'Буткът дънки', 'bootcut-jeans', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-jackets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Leather Jackets', 'Кожени якета', 'mens-leather-jackets', v_parent_id, 1),
      ('Denim Jackets', 'Дънкови якета', 'mens-denim-jackets', v_parent_id, 2),
      ('Bomber Jackets', 'Бомбър якета', 'bomber-jackets', v_parent_id, 3),
      ('Blazers', 'Блейзъри', 'blazers', v_parent_id, 4),
      ('Windbreakers', 'Ветровки', 'windbreakers', v_parent_id, 5),
      ('Parkas', 'Парки', 'mens-parkas', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Clothing L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-tops';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blouses', 'Блузи', 'blouses', v_parent_id, 1),
      ('T-Shirts', 'Тениски', 'womens-tshirts', v_parent_id, 2),
      ('Tank Tops', 'Потници', 'tank-tops', v_parent_id, 3),
      ('Crop Tops', 'Къси топове', 'crop-tops', v_parent_id, 4),
      ('Tunics', 'Туники', 'tunics', v_parent_id, 5),
      ('Bodysuits', 'Бодита', 'bodysuits', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-dresses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Casual Dresses', 'Ежедневни рокли', 'casual-dresses', v_parent_id, 1),
      ('Formal Dresses', 'Официални рокли', 'formal-dresses', v_parent_id, 2),
      ('Cocktail Dresses', 'Коктейлни рокли', 'cocktail-dresses', v_parent_id, 3),
      ('Maxi Dresses', 'Макси рокли', 'maxi-dresses', v_parent_id, 4),
      ('Mini Dresses', 'Мини рокли', 'mini-dresses', v_parent_id, 5),
      ('Wrap Dresses', 'Рокли на прегъване', 'wrap-dresses', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-pants';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Pants', 'Официални панталони', 'womens-dress-pants', v_parent_id, 1),
      ('Leggings', 'Клинове', 'leggings', v_parent_id, 2),
      ('Wide Leg Pants', 'Широки панталони', 'wide-leg-pants', v_parent_id, 3),
      ('Capris', 'Капри панталони', 'capris', v_parent_id, 4),
      ('Culottes', 'Кюлоти', 'culottes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
