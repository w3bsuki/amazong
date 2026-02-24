
-- Restore massive batch of L3 categories - batch 4 (Fashion, Home, Health)
DO $$
DECLARE
  -- Fashion L2 IDs
  v_womens_dresses_id UUID;
  v_womens_tops_id UUID;
  v_womens_pants_id UUID;
  v_mens_shirts_id UUID;
  v_mens_pants_id UUID;
  v_womens_heels_id UUID;
  v_mens_dress_shoes_id UUID;
  v_handbags_id UUID;
  v_backpacks_id UUID;
  -- Home L2 IDs  
  v_living_room_id UUID;
  v_bedroom_id UUID;
  v_cookware_id UUID;
  v_sheets_id UUID;
  v_wall_art_id UUID;
  v_ceiling_lights_id UUID;
  -- Health L2 IDs
  v_multivitamins_id UUID;
  v_face_moisturizers_id UUID;
  v_foundation_id UUID;
  v_shampoo_id UUID;
BEGIN
  -- Get Fashion L2 IDs
  SELECT id INTO v_womens_dresses_id FROM categories WHERE slug = 'womens-dresses';
  SELECT id INTO v_womens_tops_id FROM categories WHERE slug = 'womens-tops-blouses';
  SELECT id INTO v_womens_pants_id FROM categories WHERE slug = 'womens-pants-jeans';
  SELECT id INTO v_mens_shirts_id FROM categories WHERE slug = 'mens-shirts';
  SELECT id INTO v_mens_pants_id FROM categories WHERE slug = 'mens-pants-jeans';
  SELECT id INTO v_womens_heels_id FROM categories WHERE slug = 'womens-heels';
  SELECT id INTO v_mens_dress_shoes_id FROM categories WHERE slug = 'mens-dress-shoes';
  SELECT id INTO v_handbags_id FROM categories WHERE slug = 'handbags';
  SELECT id INTO v_backpacks_id FROM categories WHERE slug = 'backpacks';

  -- Get Home L2 IDs
  SELECT id INTO v_living_room_id FROM categories WHERE slug = 'living-room-furniture';
  SELECT id INTO v_bedroom_id FROM categories WHERE slug = 'bedroom-furniture';
  SELECT id INTO v_cookware_id FROM categories WHERE slug = 'cookware';
  SELECT id INTO v_sheets_id FROM categories WHERE slug = 'sheets';
  SELECT id INTO v_wall_art_id FROM categories WHERE slug = 'wall-art';
  SELECT id INTO v_ceiling_lights_id FROM categories WHERE slug = 'ceiling-lights';

  -- Get Health L2 IDs
  SELECT id INTO v_multivitamins_id FROM categories WHERE slug = 'multivitamins';
  SELECT id INTO v_face_moisturizers_id FROM categories WHERE slug = 'face-moisturizers';
  SELECT id INTO v_foundation_id FROM categories WHERE slug = 'foundation';
  SELECT id INTO v_shampoo_id FROM categories WHERE slug = 'shampoo';

  -- WOMENS DRESSES L3
  IF v_womens_dresses_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Cocktail Dresses', 'Коктейлни рокли', 'cocktail-dresses', v_womens_dresses_id, 1),
    ('Maxi Dresses', 'Макси рокли', 'maxi-dresses', v_womens_dresses_id, 2),
    ('Mini Dresses', 'Мини рокли', 'mini-dresses', v_womens_dresses_id, 3),
    ('Midi Dresses', 'Миди рокли', 'midi-dresses', v_womens_dresses_id, 4),
    ('Evening Dresses', 'Вечерни рокли', 'evening-dresses', v_womens_dresses_id, 5),
    ('Casual Dresses', 'Ежедневни рокли', 'casual-dresses', v_womens_dresses_id, 6),
    ('Wedding Guest Dresses', 'Рокли за сватба', 'wedding-guest-dresses', v_womens_dresses_id, 7),
    ('Bodycon Dresses', 'Боди кон рокли', 'bodycon-dresses', v_womens_dresses_id, 8),
    ('Wrap Dresses', 'Преплетени рокли', 'wrap-dresses', v_womens_dresses_id, 9),
    ('Shirt Dresses', 'Рокли-ризи', 'shirt-dresses', v_womens_dresses_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- WOMENS TOPS L3
  IF v_womens_tops_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Blouses', 'Блузи', 'blouses', v_womens_tops_id, 1),
    ('T-Shirts', 'Тениски', 'womens-tshirts', v_womens_tops_id, 2),
    ('Tank Tops', 'Потници', 'tank-tops', v_womens_tops_id, 3),
    ('Crop Tops', 'Къси топове', 'crop-tops', v_womens_tops_id, 4),
    ('Camisoles', 'Камизоли', 'camisoles', v_womens_tops_id, 5),
    ('Tunics', 'Туники', 'tunics', v_womens_tops_id, 6),
    ('Bodysuits', 'Бодита', 'bodysuits', v_womens_tops_id, 7),
    ('Off-Shoulder Tops', 'Топове с голи рамене', 'off-shoulder-tops', v_womens_tops_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- MENS SHIRTS L3
  IF v_mens_shirts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dress Shirts', 'Елегантни ризи', 'mens-dress-shirts', v_mens_shirts_id, 1),
    ('Casual Shirts', 'Ежедневни ризи', 'mens-casual-shirts', v_mens_shirts_id, 2),
    ('Polo Shirts', 'Поло ризи', 'polo-shirts', v_mens_shirts_id, 3),
    ('Flannel Shirts', 'Фланелки', 'flannel-shirts', v_mens_shirts_id, 4),
    ('Denim Shirts', 'Дънкови ризи', 'denim-shirts', v_mens_shirts_id, 5),
    ('Linen Shirts', 'Ленени ризи', 'linen-shirts', v_mens_shirts_id, 6),
    ('Oxford Shirts', 'Оксфордски ризи', 'oxford-shirts', v_mens_shirts_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HANDBAGS L3
  IF v_handbags_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Designer Handbags', 'Дизайнерски чанти', 'designer-handbags', v_handbags_id, 1),
    ('Shoulder Bags', 'Чанти през рамо', 'shoulder-bags', v_handbags_id, 2),
    ('Satchels', 'Чанти сачел', 'satchels', v_handbags_id, 3),
    ('Hobo Bags', 'Хобо чанти', 'hobo-bags', v_handbags_id, 4),
    ('Bucket Bags', 'Чанти кофа', 'bucket-bags', v_handbags_id, 5),
    ('Wristlets', 'Гривни чанти', 'wristlets', v_handbags_id, 6),
    ('Evening Bags', 'Вечерни чанти', 'evening-bags', v_handbags_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- BACKPACKS L3
  IF v_backpacks_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('School Backpacks', 'Ученически раници', 'school-backpacks', v_backpacks_id, 1),
    ('Laptop Backpacks', 'Раници за лаптоп', 'laptop-backpacks', v_backpacks_id, 2),
    ('Travel Backpacks', 'Туристически раници', 'travel-backpacks', v_backpacks_id, 3),
    ('Mini Backpacks', 'Мини раници', 'mini-backpacks', v_backpacks_id, 4),
    ('Hiking Backpacks', 'Туристически раници', 'hiking-backpacks', v_backpacks_id, 5),
    ('Anti-Theft Backpacks', 'Противокражбени раници', 'anti-theft-backpacks', v_backpacks_id, 6),
    ('Rolling Backpacks', 'Раници с колелца', 'rolling-backpacks', v_backpacks_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- LIVING ROOM FURNITURE L3
  IF v_living_room_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sofas', 'Дивани', 'sofas', v_living_room_id, 1),
    ('Sectionals', 'Ъглови дивани', 'sectionals', v_living_room_id, 2),
    ('Loveseats', 'Двуместни дивани', 'loveseats', v_living_room_id, 3),
    ('Accent Chairs', 'Акцентни столове', 'accent-chairs', v_living_room_id, 4),
    ('Recliners', 'Реклайнери', 'recliners', v_living_room_id, 5),
    ('Coffee Tables', 'Холни масички', 'coffee-tables', v_living_room_id, 6),
    ('End Tables', 'Странични масички', 'end-tables', v_living_room_id, 7),
    ('TV Stands', 'ТВ шкафове', 'tv-stands', v_living_room_id, 8),
    ('Bookcases', 'Библиотеки', 'bookcases', v_living_room_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- BEDROOM FURNITURE L3
  IF v_bedroom_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Beds', 'Легла', 'beds', v_bedroom_id, 1),
    ('Mattresses', 'Матраци', 'mattresses', v_bedroom_id, 2),
    ('Dressers', 'Скринове', 'dressers', v_bedroom_id, 3),
    ('Nightstands', 'Нощни шкафчета', 'nightstands', v_bedroom_id, 4),
    ('Wardrobes', 'Гардероби', 'wardrobes', v_bedroom_id, 5),
    ('Bedroom Sets', 'Спални комплекти', 'bedroom-sets', v_bedroom_id, 6),
    ('Headboards', 'Табли за легло', 'headboards', v_bedroom_id, 7),
    ('Vanities', 'Тоалетки', 'vanities', v_bedroom_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- COOKWARE L3
  IF v_cookware_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pots', 'Тенджери', 'pots', v_cookware_id, 1),
    ('Pans', 'Тигани', 'pans', v_cookware_id, 2),
    ('Cookware Sets', 'Комплекти за готвене', 'cookware-sets', v_cookware_id, 3),
    ('Dutch Ovens', 'Чугунени тенджери', 'dutch-ovens', v_cookware_id, 4),
    ('Skillets', 'Скилети', 'skillets', v_cookware_id, 5),
    ('Woks', 'Уоци', 'woks', v_cookware_id, 6),
    ('Griddles', 'Грил плочи', 'griddles', v_cookware_id, 7),
    ('Roasting Pans', 'Тави за печене', 'roasting-pans', v_cookware_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- WALL ART L3
  IF v_wall_art_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Canvas Art', 'Картини на платно', 'canvas-art', v_wall_art_id, 1),
    ('Framed Art', 'Рамкирани картини', 'framed-art', v_wall_art_id, 2),
    ('Metal Wall Art', 'Метален декор за стена', 'metal-wall-art', v_wall_art_id, 3),
    ('Wall Tapestries', 'Гоблени', 'wall-tapestries', v_wall_art_id, 4),
    ('Wall Decals', 'Стикери за стена', 'wall-decals', v_wall_art_id, 5),
    ('Photography Prints', 'Фотографски принтове', 'photography-prints', v_wall_art_id, 6),
    ('Posters', 'Постери', 'posters-home', v_wall_art_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CEILING LIGHTS L3
  IF v_ceiling_lights_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Flush Mount Lights', 'Плафони', 'flush-mount-lights', v_ceiling_lights_id, 1),
    ('Semi-Flush Lights', 'Полуплафони', 'semi-flush-lights', v_ceiling_lights_id, 2),
    ('Pendant Lights', 'Висящи лампи', 'pendant-lights', v_ceiling_lights_id, 3),
    ('Chandeliers', 'Полилеи', 'chandeliers-ceiling', v_ceiling_lights_id, 4),
    ('Track Lighting', 'Релсово осветление', 'track-lighting', v_ceiling_lights_id, 5),
    ('Recessed Lighting', 'Вградено осветление', 'recessed-lighting', v_ceiling_lights_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- FACE MOISTURIZERS L3
  IF v_face_moisturizers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Day Creams', 'Дневни кремове', 'day-creams', v_face_moisturizers_id, 1),
    ('Night Creams', 'Нощни кремове', 'night-creams', v_face_moisturizers_id, 2),
    ('Gel Moisturizers', 'Гел хидратанти', 'gel-moisturizers', v_face_moisturizers_id, 3),
    ('Oil-Free Moisturizers', 'Безмаслени хидратанти', 'oil-free-moisturizers', v_face_moisturizers_id, 4),
    ('Tinted Moisturizers', 'Тониращи кремове', 'tinted-moisturizers', v_face_moisturizers_id, 5),
    ('Anti-Aging Creams', 'Анти-ейдж кремове', 'anti-aging-creams', v_face_moisturizers_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- FOUNDATION L3
  IF v_foundation_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Liquid Foundation', 'Течен фон дьо тен', 'liquid-foundation', v_foundation_id, 1),
    ('Powder Foundation', 'Пудра фон дьо тен', 'powder-foundation', v_foundation_id, 2),
    ('Cream Foundation', 'Кремообразен фон дьо тен', 'cream-foundation', v_foundation_id, 3),
    ('Stick Foundation', 'Стик фон дьо тен', 'stick-foundation', v_foundation_id, 4),
    ('BB Cream', 'BB крем', 'bb-cream', v_foundation_id, 5),
    ('CC Cream', 'CC крем', 'cc-cream', v_foundation_id, 6),
    ('Mousse Foundation', 'Мус фон дьо тен', 'mousse-foundation', v_foundation_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- SHAMPOO L3
  IF v_shampoo_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Anti-Dandruff Shampoo', 'Против пърхот', 'anti-dandruff-shampoo', v_shampoo_id, 1),
    ('Volumizing Shampoo', 'За обем', 'volumizing-shampoo', v_shampoo_id, 2),
    ('Moisturizing Shampoo', 'Хидратиращ', 'moisturizing-shampoo', v_shampoo_id, 3),
    ('Color-Safe Shampoo', 'За боядисана коса', 'color-safe-shampoo', v_shampoo_id, 4),
    ('Clarifying Shampoo', 'Дълбоко почистващ', 'clarifying-shampoo', v_shampoo_id, 5),
    ('Dry Shampoo', 'Сух шампоан', 'dry-shampoo', v_shampoo_id, 6),
    ('Sulfate-Free Shampoo', 'Без сулфати', 'sulfate-free-shampoo', v_shampoo_id, 7),
    ('Natural Shampoo', 'Натурален шампоан', 'natural-shampoo', v_shampoo_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Massive L3 categories batch 4 restored';
END $$;
;
