-- Add attributes to remaining L1 categories (Movies & Music, Software, Services, Wholesale)

-- Movies & Music L1s
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Format', 'Genre', 'Condition', 'Region', 'Year']),
  unnest(ARRAY['Формат', 'Жанр', 'Състояние', 'Регион', 'Година']),
  unnest(ARRAY['select', 'select', 'select', 'select', 'text']),
  unnest(ARRAY[false, false, true, false, false]),
  true,
  unnest(ARRAY[
    '["Blu-ray","4K UHD","DVD","VHS","CD","Vinyl","Cassette","Digital"]',
    '["Action","Comedy","Drama","Horror","Sci-Fi","Documentary","Animation","Music","Other"]',
    '["New Sealed","Like New","Very Good","Good","Acceptable"]',
    '["Region Free","Region A/1","Region B/2","Region C/3"]',
    NULL
  ])::jsonb,
  unnest(ARRAY[
    '["Blu-ray","4K UHD","DVD","VHS","CD","Винил","Касета","Дигитален"]',
    '["Екшън","Комедия","Драма","Хорър","Научна фантастика","Документален","Анимация","Музика","Друг"]',
    '["Ново запечатано","Като ново","Много добро","Добро","Приемливо"]',
    '["Без региони","Регион A/1","Регион B/2","Регион C/3"]',
    NULL
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
FROM categories c
WHERE c.slug IN ('movies-4k-uhd', 'cassettes', 'mm-concerts', 'digital-music', 'movies-dvd', 'movie-memorabilia', 'music-memorabilia', 'mm-instruments', 'turntables', 'tv-series', 'movies-vhs')
ON CONFLICT DO NOTHING;

-- Software L1s
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Platform', 'License Type', 'Delivery', 'Users', 'Condition']),
  unnest(ARRAY['Платформа', 'Тип лиценз', 'Доставка', 'Потребители', 'Състояние']),
  unnest(ARRAY['multiselect', 'select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, false, true]),
  true,
  unnest(ARRAY[
    '["Windows","macOS","Linux","iOS","Android","Web","Cross-Platform"]',
    '["One-Time Purchase","Subscription Monthly","Subscription Yearly","Free","Open Source"]',
    '["Digital Download","Key Only","Physical Media","Cloud"]',
    '["Single User","Multi-User","Team","Enterprise"]',
    '["New","Used License"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Windows","macOS","Linux","iOS","Android","Уеб","Крос-платформен"]',
    '["Еднократна покупка","Месечен абонамент","Годишен абонамент","Безплатен","Отворен код"]',
    '["Дигитално изтегляне","Само ключ","Физически носител","Облак"]',
    '["Един потребител","Много потребители","Екип","Корпоративен"]',
    '["Нов","Използван лиценз"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
FROM categories c
WHERE c.slug IN ('cloud-saas', 'communication-collab', 'development-tools', 'educational-software', 'games-software', 'mobile-apps', 'multimedia-software', 'office-software', 'operating-systems', 'productivity-software', 'scientific-engineering', 'utilities-system', 'web-development')
ON CONFLICT DO NOTHING;

-- Services L1s (base attributes)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Service Area', 'Availability', 'Pricing Type', 'Experience']),
  unnest(ARRAY['Зона на обслужване', 'Наличност', 'Тип ценообразуване', 'Опит']),
  unnest(ARRAY['select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, false]),
  true,
  unnest(ARRAY[
    '["Local Only","City-Wide","Regional","National","Remote/Online"]',
    '["Weekdays","Weekends","24/7","By Appointment","Flexible"]',
    '["Fixed Price","Hourly Rate","Project-Based","Negotiable","Free Estimate"]',
    '["Less than 1 year","1-3 years","3-5 years","5-10 years","10+ years"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Само локално","В целия град","Регионално","Национално","Дистанционно/Онлайн"]',
    '["Делнични дни","Уикенди","24/7","По уговорка","Гъвкаво"]',
    '["Фиксирана цена","Почасова ставка","По проект","По договаряне","Безплатна оценка"]',
    '["Под 1 година","1-3 години","3-5 години","5-10 години","10+ години"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4])
FROM categories c
WHERE c.slug IN ('agricultural-services', 'events-entertainment', 'freelance-creative', 'gift-cards', 'legal-financial', 'lessons-classes', 'moving-relocation', 'personal-services', 'pet-services', 'repairs-maintenance', 'security-services', 'tech-it-services', 'tickets', 'transportation-services', 'wedding-services', 'wellness-services')
ON CONFLICT DO NOTHING;

-- Wholesale L1s
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Minimum Order', 'Pricing Tier', 'Lead Time', 'Sample Available', 'Dropshipping']),
  unnest(ARRAY['Минимална поръчка', 'Ценова категория', 'Срок за доставка', 'Налични мостри', 'Дропшипинг']),
  unnest(ARRAY['select', 'select', 'select', 'boolean', 'boolean']),
  unnest(ARRAY[false, false, false, false, false]),
  true,
  unnest(ARRAY[
    '["1-10 units","10-50 units","50-100 units","100-500 units","500+ units"]',
    '["Tier 1 (Small)","Tier 2 (Medium)","Tier 3 (Large)","Custom Quote"]',
    '["Same Day","1-3 Days","3-7 Days","1-2 Weeks","2-4 Weeks","Custom"]',
    NULL,
    NULL
  ])::jsonb,
  unnest(ARRAY[
    '["1-10 броя","10-50 броя","50-100 броя","100-500 броя","500+ броя"]',
    '["Ниво 1 (Малко)","Ниво 2 (Средно)","Ниво 3 (Голямо)","Индивидуална оферта"]',
    '["Същия ден","1-3 дни","3-7 дни","1-2 седмици","2-4 седмици","По договаряне"]',
    NULL,
    NULL
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
FROM categories c
WHERE c.slug IN ('wholesale-automotive', 'wholesale-baby', 'wholesale-beauty', 'wholesale-crafts', 'wholesale-health', 'wholesale-home', 'wholesale-industrial', 'wholesale-jewelry', 'business-supplies', 'wholesale-packaging', 'wholesale-pet', 'wholesale-printing', 'wholesale-raw-materials', 'wholesale-restaurant', 'wholesale-seasonal', 'wholesale-sports', 'wholesale-toys')
ON CONFLICT DO NOTHING;;
