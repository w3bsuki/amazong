-- ========================================
-- BEAUTY CATEGORY COMPLETE EXPANSION V2
-- ========================================
-- Uses unique slug prefixes to avoid conflicts

DO $$
DECLARE
  v_beauty_id UUID;
  v_skincare_id UUID;
  v_haircare_id UUID;
  v_fragrance_id UUID;
  v_bath_body_id UUID;
  v_oral_care_id UUID;
  v_mens_grooming_id UUID;
  v_beauty_tools_id UUID;
  v_makeup_id UUID;
  v_serums_id UUID;
  v_face_masks_id UUID;
  v_sunscreen_id UUID;
  v_eye_cream_id UUID;
  v_shampoos_id UUID;
  v_conditioners_id UUID;
  v_hair_treatments_id UUID;
  v_styling_products_id UUID;
  -- New L2 IDs
  v_frag_women_id UUID;
  v_frag_men_id UUID;
  v_frag_unisex_id UUID;
  v_frag_sets_id UUID;
  v_bath_shower_id UUID;
  v_body_care_id UUID;
  v_hand_foot_id UUID;
  v_deodorants_id UUID;
  v_oral_toothpaste_id UUID;
  v_oral_toothbrush_id UUID;
  v_oral_mouthwash_id UUID;
  v_oral_whitening_id UUID;
  v_oral_floss_id UUID;
  v_mens_shaving_id UUID;
  v_mens_beard_id UUID;
  v_mens_hair_id UUID;
  v_mens_skin_id UUID;
  v_mens_body_id UUID;
  v_tools_face_id UUID;
  v_tools_hair_id UUID;
  v_tools_nail_id UUID;
  v_tools_devices_id UUID;
  v_tools_accessories_id UUID;
BEGIN
  -- Get existing category IDs
  SELECT id INTO v_beauty_id FROM categories WHERE slug = 'beauty';
  SELECT id INTO v_skincare_id FROM categories WHERE slug = 'skincare';
  SELECT id INTO v_haircare_id FROM categories WHERE slug = 'haircare';
  SELECT id INTO v_fragrance_id FROM categories WHERE slug = 'fragrance';
  SELECT id INTO v_bath_body_id FROM categories WHERE slug = 'bath-body';
  SELECT id INTO v_oral_care_id FROM categories WHERE slug = 'oral-care';
  SELECT id INTO v_mens_grooming_id FROM categories WHERE slug = 'mens-grooming';
  SELECT id INTO v_beauty_tools_id FROM categories WHERE slug = 'beauty-tools';
  SELECT id INTO v_makeup_id FROM categories WHERE slug = 'makeup';
  SELECT id INTO v_serums_id FROM categories WHERE slug = 'serums';
  SELECT id INTO v_face_masks_id FROM categories WHERE slug = 'face-masks';
  SELECT id INTO v_sunscreen_id FROM categories WHERE slug = 'sunscreen';
  SELECT id INTO v_eye_cream_id FROM categories WHERE slug = 'eye-cream';
  SELECT id INTO v_shampoos_id FROM categories WHERE slug = 'shampoos';
  SELECT id INTO v_conditioners_id FROM categories WHERE slug = 'conditioners';
  SELECT id INTO v_hair_treatments_id FROM categories WHERE slug = 'hair-treatments';
  SELECT id INTO v_styling_products_id FROM categories WHERE slug = 'styling-products';

  -- ========================================
  -- 1. SKINCARE - Add L3 subcategories
  -- ========================================
  
  -- Serums L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Vitamin C Serums', 'Серуми с витамин C', 'serum-vitamin-c', v_serums_id, 1),
    ('Hyaluronic Acid Serums', 'Серуми с хиалуронова киселина', 'serum-hyaluronic', v_serums_id, 2),
    ('Retinol Serums', 'Серуми с ретинол', 'serum-retinol', v_serums_id, 3),
    ('Niacinamide Serums', 'Серуми с ниацинамид', 'serum-niacinamide', v_serums_id, 4),
    ('Anti-Aging Serums', 'Анти-ейдж серуми', 'serum-antiaging', v_serums_id, 5),
    ('Brightening Serums', 'Избелващи серуми', 'serum-brightening', v_serums_id, 6),
    ('Acne Serums', 'Серуми против акне', 'serum-acne', v_serums_id, 7);

  -- Face Masks L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sheet Masks', 'Листови маски', 'facemask-sheet', v_face_masks_id, 1),
    ('Clay Masks', 'Глинени маски', 'facemask-clay', v_face_masks_id, 2),
    ('Peel-Off Masks', 'Пилинг маски', 'facemask-peeloff', v_face_masks_id, 3),
    ('Overnight Masks', 'Нощни маски', 'facemask-overnight', v_face_masks_id, 4),
    ('Hydrating Masks', 'Хидратиращи маски', 'facemask-hydrating', v_face_masks_id, 5),
    ('Exfoliating Masks', 'Ексфолиращи маски', 'facemask-exfoliating', v_face_masks_id, 6),
    ('Eye Masks', 'Маски за очи', 'facemask-eye', v_face_masks_id, 7),
    ('Lip Masks', 'Маски за устни', 'facemask-lip', v_face_masks_id, 8);

  -- Sunscreen L3 subcategories  
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Face Sunscreen', 'Слънцезащита за лице', 'sunscreen-face', v_sunscreen_id, 1),
    ('Body Sunscreen', 'Слънцезащита за тяло', 'sunscreen-body', v_sunscreen_id, 2),
    ('Tinted Sunscreen', 'Оцветен SPF', 'sunscreen-tinted', v_sunscreen_id, 3),
    ('Sunscreen Sprays', 'SPF спрейове', 'sunscreen-spray', v_sunscreen_id, 4),
    ('After Sun Care', 'След слънце', 'sunscreen-aftersun', v_sunscreen_id, 5),
    ('Kids Sunscreen', 'Детска слънцезащита', 'sunscreen-kids', v_sunscreen_id, 6),
    ('SPF Lip Balm', 'Балсам за устни с SPF', 'sunscreen-lip', v_sunscreen_id, 7);

  -- Eye Cream L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Anti-Wrinkle Eye Cream', 'Крем против бръчки', 'eyecream-wrinkle', v_eye_cream_id, 1),
    ('Dark Circle Eye Cream', 'Крем против тъмни кръгове', 'eyecream-darkcircle', v_eye_cream_id, 2),
    ('Depuffing Eye Cream', 'Крем против подпухналост', 'eyecream-depuff', v_eye_cream_id, 3),
    ('Eye Gels', 'Гел за очи', 'eyecream-gel', v_eye_cream_id, 4),
    ('Eye Serums', 'Серум за очи', 'eyecream-serum', v_eye_cream_id, 5);

  -- ========================================
  -- 2. HAIR CARE - Add L3 subcategories
  -- ========================================
  
  -- Shampoos L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Daily Shampoos', 'Шампоани за ежедневна употреба', 'shampoo-daily', v_shampoos_id, 1),
    ('Anti-Dandruff Shampoos', 'Против пърхот', 'shampoo-dandruff', v_shampoos_id, 2),
    ('Color-Treated Shampoos', 'За боядисана коса', 'shampoo-color', v_shampoos_id, 3),
    ('Volumizing Shampoos', 'За обем', 'shampoo-volume', v_shampoos_id, 4),
    ('Moisturizing Shampoos', 'Хидратиращи шампоани', 'shampoo-moisture', v_shampoos_id, 5),
    ('Clarifying Shampoos', 'Дълбоко почистващи', 'shampoo-clarify', v_shampoos_id, 6),
    ('Dry Shampoos', 'Сух шампоан', 'shampoo-dry', v_shampoos_id, 7),
    ('Sulfate-Free Shampoos', 'Без сулфати', 'shampoo-sulfatefree', v_shampoos_id, 8),
    ('Men''s Shampoos', 'Мъжки шампоани', 'shampoo-mens', v_shampoos_id, 9);

  -- Conditioners L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Daily Conditioners', 'Балсами за ежедневна употреба', 'conditioner-daily', v_conditioners_id, 1),
    ('Deep Conditioners', 'Дълбоко подхранващи балсами', 'conditioner-deep', v_conditioners_id, 2),
    ('Leave-In Conditioners', 'Балсами без отмиване', 'conditioner-leavein', v_conditioners_id, 3),
    ('Color-Treated Conditioners', 'За боядисана коса', 'conditioner-color', v_conditioners_id, 4),
    ('Volumizing Conditioners', 'За обем', 'conditioner-volume', v_conditioners_id, 5),
    ('Detangling Conditioners', 'За разресване', 'conditioner-detangle', v_conditioners_id, 6);

  -- Hair Treatments L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hair Masks', 'Маски за коса', 'hairtreat-mask', v_hair_treatments_id, 1),
    ('Hair Oils', 'Олия за коса', 'hairtreat-oil', v_hair_treatments_id, 2),
    ('Hair Serums', 'Серуми за коса', 'hairtreat-serum', v_hair_treatments_id, 3),
    ('Scalp Treatments', 'Грижа за скалпа', 'hairtreat-scalp', v_hair_treatments_id, 4),
    ('Hair Growth Treatments', 'За растеж на косата', 'hairtreat-growth', v_hair_treatments_id, 5),
    ('Keratin Treatments', 'Кератинови терапии', 'hairtreat-keratin', v_hair_treatments_id, 6),
    ('Bond Repair Treatments', 'Възстановяващи терапии', 'hairtreat-bond', v_hair_treatments_id, 7);

  -- Styling Products L3 subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hair Spray', 'Лак за коса', 'styling-spray', v_styling_products_id, 1),
    ('Hair Gel', 'Гел за коса', 'styling-gel', v_styling_products_id, 2),
    ('Hair Mousse', 'Пяна за коса', 'styling-mousse', v_styling_products_id, 3),
    ('Hair Wax', 'Вакса за коса', 'styling-wax', v_styling_products_id, 4),
    ('Hair Pomade', 'Помада за коса', 'styling-pomade', v_styling_products_id, 5),
    ('Heat Protectant', 'Термозащита', 'styling-heat', v_styling_products_id, 6),
    ('Curl Defining Products', 'За къдрици', 'styling-curl', v_styling_products_id, 7),
    ('Texturizing Products', 'За текстура', 'styling-texture', v_styling_products_id, 8);

  -- ========================================
  -- 3. FRAGRANCE - Add L2 Men's/Women's/Unisex + L3
  -- ========================================
  
  -- Women's Fragrances
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Women''s Fragrances', 'Дамски парфюми', 'fragrance-women', v_fragrance_id, '👩', 1)
  RETURNING id INTO v_frag_women_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Eau de Parfum (Women)', 'Парфюмна вода (дамска)', 'frag-w-edp', v_frag_women_id, 1),
    ('Eau de Toilette (Women)', 'Тоалетна вода (дамска)', 'frag-w-edt', v_frag_women_id, 2),
    ('Perfume (Women)', 'Парфюм (дамски)', 'frag-w-parfum', v_frag_women_id, 3),
    ('Body Mist (Women)', 'Спрей за тяло (дамски)', 'frag-w-mist', v_frag_women_id, 4),
    ('Floral Fragrances', 'Цветни аромати', 'frag-w-floral', v_frag_women_id, 5),
    ('Oriental Fragrances', 'Ориенталски аромати', 'frag-w-oriental', v_frag_women_id, 6),
    ('Fresh Fragrances', 'Свежи аромати', 'frag-w-fresh', v_frag_women_id, 7);

  -- Men's Fragrances
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Men''s Fragrances', 'Мъжки парфюми', 'fragrance-men', v_fragrance_id, '👨', 2)
  RETURNING id INTO v_frag_men_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Eau de Parfum (Men)', 'Парфюмна вода (мъжка)', 'frag-m-edp', v_frag_men_id, 1),
    ('Eau de Toilette (Men)', 'Тоалетна вода (мъжка)', 'frag-m-edt', v_frag_men_id, 2),
    ('Cologne', 'Одеколон', 'frag-m-cologne', v_frag_men_id, 3),
    ('After Shave Fragrance', 'Афтършейв парфюм', 'frag-m-aftershave', v_frag_men_id, 4),
    ('Woody Fragrances', 'Дървесни аромати', 'frag-m-woody', v_frag_men_id, 5),
    ('Aquatic Fragrances', 'Морски аромати', 'frag-m-aquatic', v_frag_men_id, 6),
    ('Spicy Fragrances', 'Пикантни аромати', 'frag-m-spicy', v_frag_men_id, 7);

  -- Unisex Fragrances
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Unisex Fragrances', 'Унисекс парфюми', 'fragrance-unisex', v_fragrance_id, '✨', 3)
  RETURNING id INTO v_frag_unisex_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Niche Fragrances', 'Нишови парфюми', 'frag-u-niche', v_frag_unisex_id, 1),
    ('Clean Fragrances', 'Чисти аромати', 'frag-u-clean', v_frag_unisex_id, 2),
    ('Citrus Fragrances', 'Цитрусови аромати', 'frag-u-citrus', v_frag_unisex_id, 3),
    ('Oud Fragrances', 'Уд аромати', 'frag-u-oud', v_frag_unisex_id, 4);

  -- Fragrance Sets & Accessories
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Fragrance Gift Sets', 'Подаръчни комплекти парфюми', 'fragrance-sets', v_fragrance_id, '🎁', 4)
  RETURNING id INTO v_frag_sets_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Women''s Gift Sets', 'Дамски комплекти', 'frag-set-women', v_frag_sets_id, 1),
    ('Men''s Gift Sets', 'Мъжки комплекти', 'frag-set-men', v_frag_sets_id, 2),
    ('Travel Size', 'Миниатюри за път', 'frag-set-travel', v_frag_sets_id, 3),
    ('Discovery Sets', 'Дискавъри комплекти', 'frag-set-discovery', v_frag_sets_id, 4);

  -- ========================================
  -- 4. BATH & BODY - Add L2 + L3 subcategories
  -- ========================================
  
  -- Bath & Shower
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Bath & Shower', 'Вана и душ', 'bb-bath-shower', v_bath_body_id, '🚿', 1)
  RETURNING id INTO v_bath_shower_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Shower Gels', 'Душ гелове', 'bb-showergel', v_bath_shower_id, 1),
    ('Body Wash', 'Течен сапун за тяло', 'bb-bodywash', v_bath_shower_id, 2),
    ('Bar Soap', 'Твърд сапун', 'bb-barsoap', v_bath_shower_id, 3),
    ('Bath Bombs', 'Бомби за вана', 'bb-bombs', v_bath_shower_id, 4),
    ('Bubble Bath', 'Пяна за вана', 'bb-bubble', v_bath_shower_id, 5),
    ('Bath Salts', 'Соли за вана', 'bb-salts', v_bath_shower_id, 6),
    ('Shower Oils', 'Душ олия', 'bb-showeroil', v_bath_shower_id, 7);

  -- Body Care (under Bath & Body)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Body Care', 'Грижа за тялото', 'bb-body-care', v_bath_body_id, '🧴', 2)
  RETURNING id INTO v_body_care_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Body Lotions', 'Лосиони за тяло', 'bb-body-lotion', v_body_care_id, 1),
    ('Body Creams', 'Кремове за тяло', 'bb-body-cream', v_body_care_id, 2),
    ('Body Butters', 'Масла за тяло', 'bb-body-butter', v_body_care_id, 3),
    ('Body Oils', 'Олия за тяло', 'bb-body-oil', v_body_care_id, 4),
    ('Body Scrubs', 'Скраб за тяло', 'bb-body-scrub', v_body_care_id, 5),
    ('Stretch Mark Creams', 'Против стрии', 'bb-stretchmark', v_body_care_id, 6),
    ('Cellulite Treatments', 'Против целулит', 'bb-cellulite', v_body_care_id, 7);

  -- Hand & Foot Care
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hand & Foot Care', 'Грижа за ръце и крака', 'bb-hand-foot', v_bath_body_id, '🦶', 3)
  RETURNING id INTO v_hand_foot_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hand Creams', 'Кремове за ръце', 'bb-hand-cream', v_hand_foot_id, 1),
    ('Hand Soaps', 'Сапуни за ръце', 'bb-hand-soap', v_hand_foot_id, 2),
    ('Hand Sanitizers', 'Дезинфектанти за ръце', 'bb-hand-sanitizer', v_hand_foot_id, 3),
    ('Foot Creams', 'Кремове за крака', 'bb-foot-cream', v_hand_foot_id, 4),
    ('Foot Scrubs', 'Скрабове за крака', 'bb-foot-scrub', v_hand_foot_id, 5),
    ('Foot Masks', 'Маски за крака', 'bb-foot-mask', v_hand_foot_id, 6),
    ('Cuticle Care', 'Грижа за кутикулите', 'bb-cuticle', v_hand_foot_id, 7);

  -- Deodorants & Antiperspirants
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Deodorants & Antiperspirants', 'Дезодоранти и антиперспиранти', 'bb-deodorants', v_bath_body_id, '💨', 4)
  RETURNING id INTO v_deodorants_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Women''s Deodorants', 'Дамски дезодоранти', 'bb-deo-women', v_deodorants_id, 1),
    ('Men''s Deodorants', 'Мъжки дезодоранти', 'bb-deo-men', v_deodorants_id, 2),
    ('Roll-On Deodorants', 'Рол-он дезодоранти', 'bb-deo-rollon', v_deodorants_id, 3),
    ('Spray Deodorants', 'Спрей дезодоранти', 'bb-deo-spray', v_deodorants_id, 4),
    ('Stick Deodorants', 'Стик дезодоранти', 'bb-deo-stick', v_deodorants_id, 5),
    ('Natural Deodorants', 'Натурални дезодоранти', 'bb-deo-natural', v_deodorants_id, 6);

  -- ========================================
  -- 5. ORAL CARE - Add L2 + L3 subcategories
  -- ========================================
  
  -- Toothpaste
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Toothpaste', 'Пасти за зъби', 'oc-toothpaste', v_oral_care_id, '🦷', 1)
  RETURNING id INTO v_oral_toothpaste_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Whitening Toothpaste', 'Избелващи пасти', 'oc-tp-whitening', v_oral_toothpaste_id, 1),
    ('Sensitive Toothpaste', 'За чувствителни зъби', 'oc-tp-sensitive', v_oral_toothpaste_id, 2),
    ('Kids Toothpaste', 'Детски пасти', 'oc-tp-kids', v_oral_toothpaste_id, 3),
    ('Natural Toothpaste', 'Натурални пасти', 'oc-tp-natural', v_oral_toothpaste_id, 4),
    ('Gum Care Toothpaste', 'За венци', 'oc-tp-gum', v_oral_toothpaste_id, 5),
    ('Cavity Protection', 'Против кариес', 'oc-tp-cavity', v_oral_toothpaste_id, 6);

  -- Toothbrushes
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Toothbrushes', 'Четки за зъби', 'oc-toothbrush', v_oral_care_id, '🪥', 2)
  RETURNING id INTO v_oral_toothbrush_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Electric Toothbrushes', 'Електрически четки', 'oc-tb-electric', v_oral_toothbrush_id, 1),
    ('Manual Toothbrushes', 'Обикновени четки', 'oc-tb-manual', v_oral_toothbrush_id, 2),
    ('Kids Toothbrushes', 'Детски четки', 'oc-tb-kids', v_oral_toothbrush_id, 3),
    ('Brush Heads', 'Резервни глави', 'oc-tb-heads', v_oral_toothbrush_id, 4),
    ('Travel Toothbrushes', 'За пътуване', 'oc-tb-travel', v_oral_toothbrush_id, 5);

  -- Mouthwash
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Mouthwash', 'Вода за уста', 'oc-mouthwash', v_oral_care_id, '💧', 3)
  RETURNING id INTO v_oral_mouthwash_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Antiseptic Mouthwash', 'Антисептична вода за уста', 'oc-mw-antiseptic', v_oral_mouthwash_id, 1),
    ('Whitening Mouthwash', 'Избелваща вода за уста', 'oc-mw-whitening', v_oral_mouthwash_id, 2),
    ('Kids Mouthwash', 'Детска вода за уста', 'oc-mw-kids', v_oral_mouthwash_id, 3),
    ('Alcohol-Free Mouthwash', 'Без алкохол', 'oc-mw-alcoholfree', v_oral_mouthwash_id, 4);

  -- Teeth Whitening
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Teeth Whitening', 'Избелване на зъби', 'oc-whitening', v_oral_care_id, '✨', 4)
  RETURNING id INTO v_oral_whitening_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Whitening Strips', 'Избелващи ленти', 'oc-wh-strips', v_oral_whitening_id, 1),
    ('Whitening Kits', 'Комплекти за избелване', 'oc-wh-kits', v_oral_whitening_id, 2),
    ('Whitening Pens', 'Избелващи моливи', 'oc-wh-pens', v_oral_whitening_id, 3),
    ('LED Whitening', 'LED избелване', 'oc-wh-led', v_oral_whitening_id, 4);

  -- Dental Floss & Accessories
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Dental Floss & Accessories', 'Конец за зъби и аксесоари', 'oc-floss', v_oral_care_id, '🧵', 5)
  RETURNING id INTO v_oral_floss_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dental Floss', 'Конец за зъби', 'oc-fl-thread', v_oral_floss_id, 1),
    ('Floss Picks', 'Клечки с конец', 'oc-fl-picks', v_oral_floss_id, 2),
    ('Water Flossers', 'Водни иригатори', 'oc-fl-water', v_oral_floss_id, 3),
    ('Interdental Brushes', 'Интердентални четки', 'oc-fl-interdental', v_oral_floss_id, 4),
    ('Tongue Cleaners', 'Почистващи за език', 'oc-fl-tongue', v_oral_floss_id, 5);

  -- ========================================
  -- 6. MEN'S GROOMING - Add L2 + L3 subcategories
  -- ========================================
  
  -- Shaving
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Shaving', 'Бръснене', 'mg-shaving', v_mens_grooming_id, '🪒', 1)
  RETURNING id INTO v_mens_shaving_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Razors', 'Самобръсначки', 'mg-sh-razors', v_mens_shaving_id, 1),
    ('Electric Shavers', 'Електрически самобръсначки', 'mg-sh-electric', v_mens_shaving_id, 2),
    ('Shaving Cream', 'Крем за бръснене', 'mg-sh-cream', v_mens_shaving_id, 3),
    ('Shaving Foam', 'Пяна за бръснене', 'mg-sh-foam', v_mens_shaving_id, 4),
    ('Shaving Gel', 'Гел за бръснене', 'mg-sh-gel', v_mens_shaving_id, 5),
    ('Pre-Shave', 'Преди бръснене', 'mg-sh-preshave', v_mens_shaving_id, 6),
    ('Aftershave Balm', 'Афтършейв балсам', 'mg-sh-afterbalm', v_mens_shaving_id, 7),
    ('Aftershave Lotion', 'Афтършейв лосион', 'mg-sh-afterlotion', v_mens_shaving_id, 8),
    ('Razor Blades', 'Ножчета за бръснене', 'mg-sh-blades', v_mens_shaving_id, 9),
    ('Shaving Brushes', 'Четки за бръснене', 'mg-sh-brushes', v_mens_shaving_id, 10);

  -- Beard Care
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Beard Care', 'Грижа за брадата', 'mg-beard', v_mens_grooming_id, '🧔', 2)
  RETURNING id INTO v_mens_beard_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Beard Oil', 'Олио за брада', 'mg-bd-oil', v_mens_beard_id, 1),
    ('Beard Balm', 'Балсам за брада', 'mg-bd-balm', v_mens_beard_id, 2),
    ('Beard Wax', 'Вакса за брада', 'mg-bd-wax', v_mens_beard_id, 3),
    ('Beard Shampoo', 'Шампоан за брада', 'mg-bd-shampoo', v_mens_beard_id, 4),
    ('Beard Conditioner', 'Балсам за брада', 'mg-bd-conditioner', v_mens_beard_id, 5),
    ('Beard Trimmers', 'Тримери за брада', 'mg-bd-trimmer', v_mens_beard_id, 6),
    ('Beard Combs & Brushes', 'Гребени и четки за брада', 'mg-bd-combs', v_mens_beard_id, 7),
    ('Beard Growth', 'За растеж на брада', 'mg-bd-growth', v_mens_beard_id, 8),
    ('Mustache Care', 'Грижа за мустаци', 'mg-bd-mustache', v_mens_beard_id, 9);

  -- Men's Hair Care
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Men''s Hair Care', 'Мъжка грижа за косата', 'mg-haircare', v_mens_grooming_id, '💈', 3)
  RETURNING id INTO v_mens_hair_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Men''s Shampoo', 'Мъжки шампоани', 'mg-hc-shampoo', v_mens_hair_id, 1),
    ('Men''s Conditioner', 'Мъжки балсами', 'mg-hc-conditioner', v_mens_hair_id, 2),
    ('Hair Loss Treatment', 'Против косопад', 'mg-hc-loss', v_mens_hair_id, 3),
    ('Men''s Hair Styling', 'Мъжки стайлинг', 'mg-hc-styling', v_mens_hair_id, 4),
    ('Hair Clippers', 'Машинки за подстригване', 'mg-hc-clippers', v_mens_hair_id, 5),
    ('Gray Hair Solutions', 'За сива коса', 'mg-hc-gray', v_mens_hair_id, 6);

  -- Men's Skincare
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Men''s Skincare', 'Мъжка грижа за кожата', 'mg-skincare', v_mens_grooming_id, '🧴', 4)
  RETURNING id INTO v_mens_skin_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Men''s Face Wash', 'Мъжки гел за лице', 'mg-sk-wash', v_mens_skin_id, 1),
    ('Men''s Moisturizer', 'Мъжки хидратант', 'mg-sk-moisturizer', v_mens_skin_id, 2),
    ('Men''s Anti-Aging', 'Мъжки анти-ейдж', 'mg-sk-antiaging', v_mens_skin_id, 3),
    ('Men''s Eye Cream', 'Мъжки крем за очи', 'mg-sk-eyecream', v_mens_skin_id, 4),
    ('Men''s Sunscreen', 'Мъжка слънцезащита', 'mg-sk-sunscreen', v_mens_skin_id, 5),
    ('Men''s Lip Balm', 'Мъжки балсам за устни', 'mg-sk-lipbalm', v_mens_skin_id, 6);

  -- Men's Body Care
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Men''s Body Care', 'Мъжка грижа за тялото', 'mg-bodycare', v_mens_grooming_id, '🚿', 5)
  RETURNING id INTO v_mens_body_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Men''s Body Wash', 'Мъжки душ гел', 'mg-bc-wash', v_mens_body_id, 1),
    ('Men''s Body Lotion', 'Мъжки лосион за тяло', 'mg-bc-lotion', v_mens_body_id, 2),
    ('Men''s Deodorant', 'Мъжки дезодоранти', 'mg-bc-deo', v_mens_body_id, 3),
    ('Men''s Body Grooming', 'Мъжки грумиране на тялото', 'mg-bc-grooming', v_mens_body_id, 4),
    ('Men''s Intimate Care', 'Мъжка интимна хигиена', 'mg-bc-intimate', v_mens_body_id, 5);

  -- ========================================
  -- 7. BEAUTY TOOLS - Add L2 + L3 subcategories
  -- ========================================
  
  -- Face Tools
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Face Tools', 'Инструменти за лице', 'bt-face', v_beauty_tools_id, '🪞', 1)
  RETURNING id INTO v_tools_face_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Facial Cleansing Brushes', 'Четки за почистване на лице', 'bt-fc-brush', v_tools_face_id, 1),
    ('Face Rollers', 'Ролери за лице', 'bt-fc-roller', v_tools_face_id, 2),
    ('Gua Sha', 'Гуа Ша', 'bt-fc-guasha', v_tools_face_id, 3),
    ('Pore Extractors', 'За почистване на пори', 'bt-fc-pore', v_tools_face_id, 4),
    ('Facial Steamers', 'Парни уреди за лице', 'bt-fc-steamer', v_tools_face_id, 5),
    ('Face Massagers', 'Масажори за лице', 'bt-fc-massager', v_tools_face_id, 6),
    ('Dermaplaning Tools', 'За дермапланинг', 'bt-fc-dermaplaning', v_tools_face_id, 7);

  -- Hair Tools
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hair Tools', 'Инструменти за коса', 'bt-hair', v_beauty_tools_id, '💇', 2)
  RETURNING id INTO v_tools_hair_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hair Dryers', 'Сешоари', 'bt-hr-dryer', v_tools_hair_id, 1),
    ('Flat Irons', 'Преси за коса', 'bt-hr-iron', v_tools_hair_id, 2),
    ('Curling Irons', 'Маши за къдрици', 'bt-hr-curling', v_tools_hair_id, 3),
    ('Hot Brushes', 'Топли четки', 'bt-hr-hotbrush', v_tools_hair_id, 4),
    ('Hair Brushes', 'Четки за коса', 'bt-hr-brush', v_tools_hair_id, 5),
    ('Combs', 'Гребени', 'bt-hr-comb', v_tools_hair_id, 6),
    ('Hair Rollers', 'Ролки за коса', 'bt-hr-roller', v_tools_hair_id, 7),
    ('Hair Clips & Accessories', 'Щипки и аксесоари', 'bt-hr-clips', v_tools_hair_id, 8);

  -- Nail Tools
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Nail Tools', 'Инструменти за нокти', 'bt-nail', v_beauty_tools_id, '💅', 3)
  RETURNING id INTO v_tools_nail_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Nail Files', 'Пили за нокти', 'bt-nl-file', v_tools_nail_id, 1),
    ('Nail Clippers', 'Ножички за нокти', 'bt-nl-clipper', v_tools_nail_id, 2),
    ('Cuticle Tools', 'За кутикули', 'bt-nl-cuticle', v_tools_nail_id, 3),
    ('Nail Buffers', 'Полиращи пили', 'bt-nl-buffer', v_tools_nail_id, 4),
    ('Nail Art Tools', 'За маникюр дизайн', 'bt-nl-art', v_tools_nail_id, 5),
    ('UV/LED Nail Lamps', 'UV/LED лампи', 'bt-nl-lamp', v_tools_nail_id, 6),
    ('Electric Nail Drills', 'Електрически пили', 'bt-nl-drill', v_tools_nail_id, 7),
    ('Manicure Sets', 'Комплекти за маникюр', 'bt-nl-set', v_tools_nail_id, 8);

  -- Beauty Devices
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Beauty Devices', 'Уреди за красота', 'bt-devices', v_beauty_tools_id, '⚡', 4)
  RETURNING id INTO v_tools_devices_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('LED Light Therapy', 'LED терапия', 'bt-dv-led', v_tools_devices_id, 1),
    ('Microcurrent Devices', 'Микротокови уреди', 'bt-dv-microcurrent', v_tools_devices_id, 2),
    ('RF Skin Tightening', 'RF устройства', 'bt-dv-rf', v_tools_devices_id, 3),
    ('IPL Hair Removal', 'IPL епилация', 'bt-dv-ipl', v_tools_devices_id, 4),
    ('Laser Hair Removal', 'Лазерна епилация', 'bt-dv-laser', v_tools_devices_id, 5),
    ('Ultrasonic Skin Devices', 'Ултразвукови уреди', 'bt-dv-ultrasonic', v_tools_devices_id, 6),
    ('Epilators', 'Епилатори', 'bt-dv-epilator', v_tools_devices_id, 7),
    ('Waxing Devices', 'Уреди за кола маска', 'bt-dv-wax', v_tools_devices_id, 8);

  -- Accessories & Organizers
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Beauty Accessories', 'Аксесоари за красота', 'bt-accessories', v_beauty_tools_id, '👜', 5)
  RETURNING id INTO v_tools_accessories_id;

  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Makeup Bags', 'Несесери за грим', 'bt-ac-bag', v_tools_accessories_id, 1),
    ('Cosmetic Organizers', 'Органайзери за козметика', 'bt-ac-organizer', v_tools_accessories_id, 2),
    ('Makeup Mirrors', 'Огледала за грим', 'bt-ac-mirror', v_tools_accessories_id, 3),
    ('Sponges & Applicators', 'Гъби и апликатори', 'bt-ac-sponge', v_tools_accessories_id, 4),
    ('Makeup Brush Cleaners', 'Почистващи за четки', 'bt-ac-cleaner', v_tools_accessories_id, 5),
    ('Headbands & Hair Wraps', 'Ленти и тюрбани', 'bt-ac-headband', v_tools_accessories_id, 6),
    ('Travel Containers', 'Контейнери за път', 'bt-ac-travel', v_tools_accessories_id, 7);

END $$;;
