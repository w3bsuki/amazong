
-- Restore Services, Health, Beauty L3 categories

DO $$
DECLARE
  -- Services
  services_id UUID;
  home_services_id UUID;
  cleaning_services_id UUID;
  tech_services_id UUID;
  beauty_services_id UUID;
  education_services_id UUID;
  event_services_id UUID;
  -- Health
  health_id UUID;
  vitamins_id UUID;
  fitness_health_id UUID;
  medical_id UUID;
  natural_health_id UUID;
  -- Beauty
  beauty_id UUID;
  skincare_id UUID;
  makeup_id UUID;
  haircare_id UUID;
  fragrance_id UUID;
  mens_grooming_id UUID;
BEGIN
  -- SERVICES
  SELECT id INTO services_id FROM categories WHERE slug = 'services';
  SELECT id INTO home_services_id FROM categories WHERE slug = 'home-services' AND parent_id = services_id;
  SELECT id INTO cleaning_services_id FROM categories WHERE slug = 'cleaning-services' AND parent_id = services_id;
  SELECT id INTO tech_services_id FROM categories WHERE slug = 'tech-services' AND parent_id = services_id;
  SELECT id INTO beauty_services_id FROM categories WHERE slug = 'beauty-wellness-services' AND parent_id = services_id;
  SELECT id INTO education_services_id FROM categories WHERE slug = 'education-tutoring' AND parent_id = services_id;
  SELECT id INTO event_services_id FROM categories WHERE slug = 'events-entertainment' AND parent_id = services_id;

  -- Home Services L3
  IF home_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Plumbing', 'ВиК услуги', 'plumbing-services', home_services_id, '🔧', 1),
    ('Electrical', 'Електроуслуги', 'electrical-services', home_services_id, '⚡', 2),
    ('HVAC', 'Климатизация', 'hvac-services', home_services_id, '❄️', 3),
    ('Carpentry', 'Дърводелски услуги', 'carpentry-services', home_services_id, '🪚', 4),
    ('Painting', 'Боядисване', 'painting-services', home_services_id, '🎨', 5),
    ('Roofing', 'Покривни услуги', 'roofing-services', home_services_id, '🏠', 6),
    ('Flooring', 'Подови настилки', 'flooring-services', home_services_id, '🪵', 7),
    ('Landscaping', 'Озеленяване', 'landscaping-services', home_services_id, '🌳', 8),
    ('Handyman', 'Майстор на час', 'handyman-services', home_services_id, '🔨', 9),
    ('Appliance Repair', 'Ремонт на уреди', 'appliance-repair-services', home_services_id, '🔧', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cleaning Services L3
  IF cleaning_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('House Cleaning', 'Почистване на дома', 'house-cleaning', cleaning_services_id, '🏠', 1),
    ('Deep Cleaning', 'Основно почистване', 'deep-cleaning', cleaning_services_id, '✨', 2),
    ('Office Cleaning', 'Почистване на офиси', 'office-cleaning', cleaning_services_id, '🏢', 3),
    ('Carpet Cleaning', 'Почистване на килими', 'carpet-cleaning', cleaning_services_id, '🧹', 4),
    ('Window Cleaning', 'Почистване на прозорци', 'window-cleaning', cleaning_services_id, '🪟', 5),
    ('Move In/Out Cleaning', 'Почистване при преместване', 'move-cleaning', cleaning_services_id, '📦', 6),
    ('Post-Construction', 'След строителство', 'post-construction-cleaning', cleaning_services_id, '🏗️', 7),
    ('Pressure Washing', 'Миене под налягане', 'pressure-washing', cleaning_services_id, '💦', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tech Services L3
  IF tech_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Computer Repair', 'Ремонт на компютри', 'computer-repair-services', tech_services_id, '💻', 1),
    ('Phone Repair', 'Ремонт на телефони', 'phone-repair-services', tech_services_id, '📱', 2),
    ('Data Recovery', 'Възстановяване на данни', 'data-recovery-services', tech_services_id, '💾', 3),
    ('Network Setup', 'Настройка на мрежи', 'network-setup-services', tech_services_id, '🌐', 4),
    ('Smart Home Setup', 'Smart Home инсталация', 'smart-home-setup', tech_services_id, '🏠', 5),
    ('IT Support', 'IT поддръжка', 'it-support-services', tech_services_id, '🖥️', 6),
    ('Website Design', 'Уеб дизайн', 'website-design-services', tech_services_id, '🌐', 7),
    ('App Development', 'Разработка на приложения', 'app-development-services', tech_services_id, '📲', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Beauty & Wellness Services L3
  IF beauty_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hair Salons', 'Фризьорски салони', 'hair-salon-services', beauty_services_id, '💇', 1),
    ('Nail Salons', 'Маникюр салони', 'nail-salon-services', beauty_services_id, '💅', 2),
    ('Spa Services', 'Спа услуги', 'spa-services', beauty_services_id, '🧖', 3),
    ('Massage', 'Масаж', 'massage-services', beauty_services_id, '💆', 4),
    ('Makeup Artists', 'Гримьори', 'makeup-artist-services', beauty_services_id, '💄', 5),
    ('Personal Training', 'Персонални тренировки', 'personal-training-services', beauty_services_id, '💪', 6),
    ('Yoga Classes', 'Йога класове', 'yoga-class-services', beauty_services_id, '🧘', 7),
    ('Tattoo & Piercing', 'Татуировки и пиърсинг', 'tattoo-piercing-services', beauty_services_id, '🎨', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Education & Tutoring L3
  IF education_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Math Tutoring', 'Уроци по математика', 'math-tutoring', education_services_id, '🔢', 1),
    ('Language Tutoring', 'Езикови уроци', 'language-tutoring', education_services_id, '🗣️', 2),
    ('Science Tutoring', 'Уроци по науки', 'science-tutoring', education_services_id, '🔬', 3),
    ('Music Lessons', 'Уроци по музика', 'music-lesson-services', education_services_id, '🎵', 4),
    ('Art Classes', 'Уроци по изкуство', 'art-class-services', education_services_id, '🎨', 5),
    ('Test Prep', 'Подготовка за изпити', 'test-prep-services', education_services_id, '📝', 6),
    ('College Counseling', 'Кариерно консултиране', 'college-counseling', education_services_id, '🎓', 7),
    ('Online Tutoring', 'Онлайн уроци', 'online-tutoring', education_services_id, '💻', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Events & Entertainment L3
  IF event_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('DJs & Musicians', 'Диджеи и музиканти', 'dj-musician-services', event_services_id, '🎧', 1),
    ('Photographers', 'Фотографи', 'photographer-services', event_services_id, '📷', 2),
    ('Videographers', 'Видеографи', 'videographer-services', event_services_id, '🎥', 3),
    ('Catering', 'Кетъринг', 'catering-services', event_services_id, '🍽️', 4),
    ('Event Planning', 'Организиране на събития', 'event-planning-services', event_services_id, '📋', 5),
    ('Party Rentals', 'Парти екипировка под наем', 'party-rental-services', event_services_id, '🎈', 6),
    ('Entertainers', 'Забавления', 'entertainer-services', event_services_id, '🎭', 7),
    ('Florists', 'Цветари', 'florist-services', event_services_id, '💐', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HEALTH & WELLNESS
  SELECT id INTO health_id FROM categories WHERE slug = 'health-wellness';
  SELECT id INTO vitamins_id FROM categories WHERE slug = 'vitamins-supplements' AND parent_id = health_id;
  SELECT id INTO fitness_health_id FROM categories WHERE slug = 'fitness-health' AND parent_id = health_id;
  SELECT id INTO medical_id FROM categories WHERE slug = 'medical-supplies' AND parent_id = health_id;
  SELECT id INTO natural_health_id FROM categories WHERE slug = 'natural-wellness' AND parent_id = health_id;

  -- Vitamins & Supplements L3
  IF vitamins_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Multivitamins', 'Мултивитамини', 'multivitamins', vitamins_id, '💊', 1),
    ('Vitamin D', 'Витамин D', 'vitamin-d', vitamins_id, '☀️', 2),
    ('Vitamin C', 'Витамин C', 'vitamin-c', vitamins_id, '🍊', 3),
    ('B Vitamins', 'Б витамини', 'b-vitamins', vitamins_id, '💊', 4),
    ('Omega 3', 'Омега 3', 'omega-3', vitamins_id, '🐟', 5),
    ('Probiotics', 'Пробиотици', 'probiotics', vitamins_id, '🦠', 6),
    ('Protein Supplements', 'Протеинови добавки', 'protein-supplements', vitamins_id, '💪', 7),
    ('Pre-Workout', 'Пред-тренировка', 'pre-workout', vitamins_id, '⚡', 8),
    ('Collagen', 'Колаген', 'collagen-supplements', vitamins_id, '✨', 9),
    ('Iron Supplements', 'Желязо', 'iron-supplements', vitamins_id, '💊', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Natural Wellness L3
  IF natural_health_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Essential Oils', 'Етерични масла', 'essential-oils', natural_health_id, '🌿', 1),
    ('Herbal Supplements', 'Билкови добавки', 'herbal-supplements', natural_health_id, '🌱', 2),
    ('CBD Products', 'CBD продукти', 'cbd-products-health', natural_health_id, '🌿', 3),
    ('Aromatherapy', 'Ароматерапия', 'aromatherapy', natural_health_id, '🕯️', 4),
    ('Homeopathy', 'Хомеопатия', 'homeopathy', natural_health_id, '💧', 5),
    ('Ayurveda', 'Аюрведа', 'ayurveda', natural_health_id, '🧘', 6),
    ('Mushroom Supplements', 'Гъбени добавки', 'mushroom-supplements', natural_health_id, '🍄', 7),
    ('Adaptogens', 'Адаптогени', 'adaptogens', natural_health_id, '🌿', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- BEAUTY
  SELECT id INTO beauty_id FROM categories WHERE slug = 'beauty';
  SELECT id INTO skincare_id FROM categories WHERE slug = 'skincare' AND parent_id = beauty_id;
  SELECT id INTO makeup_id FROM categories WHERE slug = 'makeup' AND parent_id = beauty_id;
  SELECT id INTO haircare_id FROM categories WHERE slug = 'haircare' AND parent_id = beauty_id;
  SELECT id INTO fragrance_id FROM categories WHERE slug = 'fragrance' AND parent_id = beauty_id;
  SELECT id INTO mens_grooming_id FROM categories WHERE slug = 'mens-grooming' AND parent_id = beauty_id;

  -- Skincare L3
  IF skincare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Facial Cleansers', 'Почистващи продукти', 'facial-cleansers', skincare_id, '🧴', 1),
    ('Toners', 'Тоници', 'toners', skincare_id, '💧', 2),
    ('Moisturizers', 'Хидратанти', 'moisturizers', skincare_id, '✨', 3),
    ('Serums', 'Серуми', 'serums', skincare_id, '💎', 4),
    ('Face Masks', 'Маски за лице', 'face-masks', skincare_id, '🎭', 5),
    ('Eye Creams', 'Кремове за очи', 'eye-creams', skincare_id, '👁️', 6),
    ('Sunscreen', 'Слънцезащитни продукти', 'sunscreen', skincare_id, '☀️', 7),
    ('Anti-Aging', 'Анти-ейдж', 'anti-aging', skincare_id, '⏳', 8),
    ('Acne Treatment', 'Лечение на акне', 'acne-treatment', skincare_id, '💊', 9),
    ('Exfoliators', 'Ексфолианти', 'exfoliators', skincare_id, '✨', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Makeup L3
  IF makeup_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Foundation', 'Фон дьо тен', 'foundation', makeup_id, '🎨', 1),
    ('Concealer', 'Коректор', 'concealer', makeup_id, '🎨', 2),
    ('Powder', 'Пудра', 'powder', makeup_id, '✨', 3),
    ('Blush', 'Руж', 'blush', makeup_id, '🌸', 4),
    ('Bronzer', 'Бронзант', 'bronzer', makeup_id, '☀️', 5),
    ('Highlighter', 'Хайлайтър', 'highlighter', makeup_id, '✨', 6),
    ('Lipstick', 'Червило', 'lipstick', makeup_id, '💄', 7),
    ('Lip Gloss', 'Гланц', 'lip-gloss', makeup_id, '💋', 8),
    ('Eyeshadow', 'Сенки за очи', 'eyeshadow', makeup_id, '👁️', 9),
    ('Eyeliner', 'Очна линия', 'eyeliner', makeup_id, '✏️', 10),
    ('Mascara', 'Спирала', 'mascara', makeup_id, '👁️', 11),
    ('Brow Products', 'Продукти за вежди', 'brow-products', makeup_id, '🖊️', 12),
    ('Makeup Brushes', 'Четки за грим', 'makeup-brushes', makeup_id, '🖌️', 13),
    ('Makeup Palettes', 'Палитри', 'makeup-palettes', makeup_id, '🎨', 14)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Haircare L3
  IF haircare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Shampoo', 'Шампоан', 'shampoo', haircare_id, '🧴', 1),
    ('Conditioner', 'Балсам', 'conditioner', haircare_id, '🧴', 2),
    ('Hair Masks', 'Маски за коса', 'hair-masks', haircare_id, '✨', 3),
    ('Hair Oil', 'Масло за коса', 'hair-oil', haircare_id, '🫒', 4),
    ('Styling Products', 'Стилизиращи продукти', 'styling-products', haircare_id, '💇', 5),
    ('Hair Color', 'Боя за коса', 'hair-color', haircare_id, '🎨', 6),
    ('Hair Tools', 'Уреди за коса', 'hair-tools', haircare_id, '💨', 7),
    ('Hair Treatments', 'Терапии за коса', 'hair-treatments', haircare_id, '💊', 8),
    ('Hair Extensions', 'Удължения за коса', 'hair-extensions', haircare_id, '💇', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fragrance L3
  IF fragrance_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Women Perfume', 'Дамски парфюми', 'women-perfume', fragrance_id, '🌸', 1),
    ('Men Cologne', 'Мъжки парфюми', 'men-cologne', fragrance_id, '🧔', 2),
    ('Unisex Fragrance', 'Унисекс парфюми', 'unisex-fragrance', fragrance_id, '💫', 3),
    ('Body Mists', 'Спрейове за тяло', 'body-mists', fragrance_id, '💨', 4),
    ('Gift Sets', 'Подаръчни комплекти', 'fragrance-gift-sets', fragrance_id, '🎁', 5),
    ('Rollerballs', 'Ролери', 'rollerballs', fragrance_id, '💫', 6),
    ('Travel Size', 'Пътни размери', 'travel-size-fragrance', fragrance_id, '✈️', 7),
    ('Luxury Niche', 'Луксозни нишови', 'luxury-niche-fragrance', fragrance_id, '💎', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men's Grooming L3
  IF mens_grooming_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Shaving', 'Бръснене', 'shaving', mens_grooming_id, '🪒', 1),
    ('Beard Care', 'Грижа за брада', 'beard-care', mens_grooming_id, '🧔', 2),
    ('Men''s Skincare', 'Мъжка грижа за лице', 'mens-skincare', mens_grooming_id, '🧴', 3),
    ('Men''s Haircare', 'Мъжка грижа за коса', 'mens-haircare', mens_grooming_id, '💇‍♂️', 4),
    ('Deodorants', 'Дезодоранти', 'deodorants', mens_grooming_id, '🧴', 5),
    ('Body Care', 'Грижа за тяло', 'mens-body-care', mens_grooming_id, '🛁', 6),
    ('Grooming Kits', 'Комплекти за грижа', 'grooming-kits', mens_grooming_id, '✂️', 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Services, Health, Beauty L3 categories restoration complete';
END $$;
;
