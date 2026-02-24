-- ========================================
-- BEAUTY CATEGORY ATTRIBUTES - COMPLETE
-- ========================================
-- Comprehensive attributes for beauty products with gender filtering

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
BEGIN
  -- Get category IDs
  SELECT id INTO v_beauty_id FROM categories WHERE slug = 'beauty';
  SELECT id INTO v_skincare_id FROM categories WHERE slug = 'skincare';
  SELECT id INTO v_haircare_id FROM categories WHERE slug = 'haircare';
  SELECT id INTO v_fragrance_id FROM categories WHERE slug = 'fragrance';
  SELECT id INTO v_bath_body_id FROM categories WHERE slug = 'bath-body';
  SELECT id INTO v_oral_care_id FROM categories WHERE slug = 'oral-care';
  SELECT id INTO v_mens_grooming_id FROM categories WHERE slug = 'mens-grooming';
  SELECT id INTO v_beauty_tools_id FROM categories WHERE slug = 'beauty-tools';
  SELECT id INTO v_makeup_id FROM categories WHERE slug = 'makeup';

  -- ========================================
  -- GLOBAL BEAUTY ATTRIBUTE - Gender (for filtering across all beauty)
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_beauty_id, 'Gender', 'Пол', 'select', false, true, 
     '["Women", "Men", "Unisex"]'::jsonb,
     '["Жени", "Мъже", "Унисекс"]'::jsonb, 1);

  -- ========================================
  -- SKINCARE ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_skincare_id, 'Skin Type', 'Тип кожа', 'multiselect', false, true, 
     '["Normal", "Dry", "Oily", "Combination", "Sensitive", "Mature", "Acne-Prone"]'::jsonb,
     '["Нормална", "Суха", "Мазна", "Смесена", "Чувствителна", "Зряла", "Склонна към акне"]'::jsonb, 1),
    
    (v_skincare_id, 'Skin Concern', 'Проблем на кожата', 'multiselect', false, true, 
     '["Anti-Aging", "Acne", "Dark Spots", "Wrinkles", "Pores", "Redness", "Dryness", "Dullness", "Uneven Texture"]'::jsonb,
     '["Анти-ейдж", "Акне", "Тъмни петна", "Бръчки", "Пори", "Зачервяване", "Сухота", "Липса на блясък", "Неравна текстура"]'::jsonb, 2),
    
    (v_skincare_id, 'Key Ingredients', 'Ключови съставки', 'multiselect', false, true, 
     '["Vitamin C", "Retinol", "Hyaluronic Acid", "Niacinamide", "Salicylic Acid", "Glycolic Acid", "Peptides", "Ceramides", "Collagen", "SPF", "Aloe Vera", "Tea Tree", "Snail Mucin", "Bakuchiol"]'::jsonb,
     '["Витамин C", "Ретинол", "Хиалуронова киселина", "Ниацинамид", "Салицилова киселина", "Гликолова киселина", "Пептиди", "Керамиди", "Колаген", "SPF", "Алое вера", "Чаено дърво", "Охлювен секрет", "Бакучиол"]'::jsonb, 3),
    
    (v_skincare_id, 'Product Form', 'Форма', 'select', false, true, 
     '["Cream", "Gel", "Serum", "Oil", "Foam", "Lotion", "Essence", "Toner", "Mist", "Balm", "Stick"]'::jsonb,
     '["Крем", "Гел", "Серум", "Масло", "Пяна", "Лосион", "Есенция", "Тоник", "Спрей", "Балсам", "Стик"]'::jsonb, 4),

    (v_skincare_id, 'SPF Level', 'SPF ниво', 'select', false, true, 
     '["None", "SPF 15", "SPF 30", "SPF 50", "SPF 50+"]'::jsonb,
     '["Без", "SPF 15", "SPF 30", "SPF 50", "SPF 50+"]'::jsonb, 5),

    (v_skincare_id, 'Cruelty Free', 'Без тестове върху животни', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6),
    (v_skincare_id, 'Vegan', 'Веган', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 7),
    (v_skincare_id, 'Organic', 'Органичен', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 8),

    (v_skincare_id, 'Size/Volume', 'Размер/Обем', 'select', false, true, 
     '["Travel Size (<30ml)", "Mini (30-50ml)", "Standard (50-100ml)", "Large (100-200ml)", "Value Size (200ml+)"]'::jsonb,
     '["За път (<30ml)", "Мини (30-50ml)", "Стандартен (50-100ml)", "Голям (100-200ml)", "Икономичен (200ml+)"]'::jsonb, 9);

  -- ========================================
  -- HAIR CARE ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_haircare_id, 'Hair Type', 'Тип коса', 'multiselect', false, true, 
     '["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick", "Normal"]'::jsonb,
     '["Права", "Вълниста", "Къдрава", "Много къдрава", "Фина", "Гъста", "Нормална"]'::jsonb, 1),
    
    (v_haircare_id, 'Hair Concern', 'Проблем на косата', 'multiselect', false, true, 
     '["Dry", "Oily", "Damaged", "Color-Treated", "Dandruff", "Hair Loss", "Frizzy", "Split Ends", "Thinning", "Gray Coverage"]'::jsonb,
     '["Суха", "Мазна", "Увредена", "Боядисана", "Пърхот", "Косопад", "Накъдряща се", "Цъфтящи краища", "Изтъняване", "Покриване на сива коса"]'::jsonb, 2),
    
    (v_haircare_id, 'Hair Length', 'Дължина на косата', 'select', false, true, 
     '["Short", "Medium", "Long", "All Lengths"]'::jsonb,
     '["Къса", "Средна", "Дълга", "Всички дължини"]'::jsonb, 3),

    (v_haircare_id, 'Sulfate Free', 'Без сулфати', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
    (v_haircare_id, 'Paraben Free', 'Без парабени', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (v_haircare_id, 'Silicone Free', 'Без силикони', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6);

  -- ========================================
  -- FRAGRANCE ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_fragrance_id, 'Fragrance Type', 'Тип парфюм', 'select', false, true, 
     '["Eau de Parfum", "Eau de Toilette", "Parfum/Extrait", "Eau de Cologne", "Body Mist"]'::jsonb,
     '["Парфюмна вода", "Тоалетна вода", "Парфюм/Екстракт", "Одеколон", "Спрей за тяло"]'::jsonb, 1),
    
    (v_fragrance_id, 'Scent Family', 'Ароматно семейство', 'multiselect', false, true, 
     '["Floral", "Oriental", "Woody", "Fresh", "Citrus", "Fruity", "Aquatic", "Spicy", "Musky", "Gourmand", "Green", "Powdery", "Amber", "Oud"]'::jsonb,
     '["Цветен", "Ориенталски", "Дървесен", "Свеж", "Цитрусов", "Плодов", "Воден/Морски", "Пикантен", "Мускусен", "Гурме", "Зелен", "Пудров", "Амбър", "Уд"]'::jsonb, 2),
    
    (v_fragrance_id, 'Longevity', 'Дълготрайност', 'select', false, true, 
     '["1-2 hours", "3-4 hours", "5-6 hours", "7-10 hours", "12+ hours"]'::jsonb,
     '["1-2 часа", "3-4 часа", "5-6 часа", "7-10 часа", "12+ часа"]'::jsonb, 3),
    
    (v_fragrance_id, 'Sillage', 'Шлейф', 'select', false, true, 
     '["Light", "Moderate", "Strong", "Enormous"]'::jsonb,
     '["Лек", "Умерен", "Силен", "Много силен"]'::jsonb, 4),
    
    (v_fragrance_id, 'Season', 'Сезон', 'multiselect', false, true, 
     '["Spring", "Summer", "Fall", "Winter", "All Seasons"]'::jsonb,
     '["Пролет", "Лято", "Есен", "Зима", "Всички сезони"]'::jsonb, 5),
    
    (v_fragrance_id, 'Occasion', 'Повод', 'multiselect', false, true, 
     '["Daily Wear", "Office", "Evening/Night Out", "Date Night", "Special Occasion", "Casual"]'::jsonb,
     '["Ежедневно", "Офис", "Вечерно/Излизане", "Среща", "Специален повод", "Ежедневно"]'::jsonb, 6),

    (v_fragrance_id, 'Fragrance Size', 'Размер', 'select', false, true, 
     '["5ml", "10ml", "30ml", "50ml", "75ml", "100ml", "150ml", "200ml+"]'::jsonb,
     '["5ml", "10ml", "30ml", "50ml", "75ml", "100ml", "150ml", "200ml+"]'::jsonb, 7);

  -- ========================================
  -- MAKEUP ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_makeup_id, 'Finish', 'Финиш', 'select', false, true, 
     '["Matte", "Dewy", "Satin", "Natural", "Luminous", "Shimmer", "Glitter", "Metallic"]'::jsonb,
     '["Матов", "Сияен", "Сатенен", "Естествен", "Блестящ", "Искрящ", "Глитер", "Металик"]'::jsonb, 1),
    
    (v_makeup_id, 'Coverage', 'Покритие', 'select', false, true, 
     '["Sheer", "Light", "Medium", "Full", "Buildable"]'::jsonb,
     '["Прозрачно", "Леко", "Средно", "Плътно", "Надграждащо се"]'::jsonb, 2),
    
    (v_makeup_id, 'Skin Tone', 'Тон на кожата', 'select', false, true, 
     '["Fair", "Light", "Light-Medium", "Medium", "Medium-Tan", "Tan", "Deep", "Very Deep"]'::jsonb,
     '["Много светла", "Светла", "Светла-средна", "Средна", "Средна-загоряла", "Загоряла", "Тъмна", "Много тъмна"]'::jsonb, 3),
    
    (v_makeup_id, 'Undertone', 'Подтон', 'select', false, true, 
     '["Cool", "Warm", "Neutral"]'::jsonb,
     '["Хладен", "Топъл", "Неутрален"]'::jsonb, 4),

    (v_makeup_id, 'Long Wearing', 'Дълготрайно', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (v_makeup_id, 'Waterproof', 'Водоустойчиво', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6),
    (v_makeup_id, 'Transfer Proof', 'Без отпечатване', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 7);

  -- ========================================
  -- BATH & BODY ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_bath_body_id, 'Scent', 'Аромат', 'select', false, true, 
     '["Unscented", "Floral", "Fruity", "Fresh", "Woody", "Sweet", "Citrus", "Coconut", "Vanilla", "Lavender", "Rose"]'::jsonb,
     '["Без аромат", "Цветен", "Плодов", "Свеж", "Дървесен", "Сладък", "Цитрусов", "Кокос", "Ванилия", "Лавандула", "Роза"]'::jsonb, 1),
    
    (v_bath_body_id, 'Skin Benefit', 'Полза за кожата', 'multiselect', false, true, 
     '["Moisturizing", "Exfoliating", "Firming", "Relaxing", "Energizing", "Soothing", "Anti-Cellulite", "Nourishing"]'::jsonb,
     '["Хидратиращ", "Ексфолиращ", "Стягащ", "Релаксиращ", "Енергизиращ", "Успокояващ", "Антицелулитен", "Подхранващ"]'::jsonb, 2),

    (v_bath_body_id, 'Natural/Organic', 'Натурален/Органичен', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 3);

  -- ========================================
  -- ORAL CARE ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_oral_care_id, 'Oral Care Benefit', 'Полза', 'multiselect', false, true, 
     '["Whitening", "Cavity Protection", "Sensitive Teeth", "Fresh Breath", "Gum Care", "Plaque Removal", "Enamel Strength"]'::jsonb,
     '["Избелване", "Защита от кариес", "Чувствителни зъби", "Свеж дъх", "Грижа за венците", "Премахване на плака", "Укрепване на емайла"]'::jsonb, 1),
    
    (v_oral_care_id, 'Fluoride', 'Флуорид', 'select', false, true, 
     '["With Fluoride", "Fluoride Free"]'::jsonb,
     '["С флуорид", "Без флуорид"]'::jsonb, 2),

    (v_oral_care_id, 'Flavor', 'Вкус', 'select', false, true, 
     '["Mint", "Spearmint", "Peppermint", "Bubblegum", "Fruit", "Unflavored"]'::jsonb,
     '["Мента", "Джоджен", "Пипермент", "Дъвка", "Плодов", "Без вкус"]'::jsonb, 3);

  -- ========================================
  -- MEN'S GROOMING ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_mens_grooming_id, 'Beard Length', 'Дължина на брадата', 'select', false, true, 
     '["Stubble", "Short", "Medium", "Long", "All Lengths"]'::jsonb,
     '["Четина", "Къса", "Средна", "Дълга", "Всички дължини"]'::jsonb, 1),
    
    (v_mens_grooming_id, 'Shaving Type', 'Тип бръснене', 'select', false, true, 
     '["Safety Razor", "Cartridge Razor", "Electric Shaver", "Straight Razor", "Disposable"]'::jsonb,
     '["Самобръсначка", "Картридж", "Електрическа", "Бръснач", "Еднократна"]'::jsonb, 2),
    
    (v_mens_grooming_id, 'Skin Sensitivity', 'Чувствителност на кожата', 'select', false, true, 
     '["Normal", "Sensitive", "Very Sensitive"]'::jsonb,
     '["Нормална", "Чувствителна", "Много чувствителна"]'::jsonb, 3),

    (v_mens_grooming_id, 'Scent (Men)', 'Аромат (мъже)', 'select', false, true, 
     '["Unscented", "Fresh", "Woody", "Spicy", "Citrus", "Classic"]'::jsonb,
     '["Без аромат", "Свеж", "Дървесен", "Пикантен", "Цитрусов", "Класически"]'::jsonb, 4);

  -- ========================================
  -- BEAUTY TOOLS ATTRIBUTES
  -- ========================================
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES
    (v_beauty_tools_id, 'Tool Type', 'Тип инструмент', 'select', false, true, 
     '["Manual", "Electric/Battery", "USB Rechargeable", "Corded"]'::jsonb,
     '["Ръчен", "Електрически/Батерии", "USB зареждане", "С кабел"]'::jsonb, 1),
    
    (v_beauty_tools_id, 'Material', 'Материал', 'select', false, true, 
     '["Stainless Steel", "Ceramic", "Titanium", "Silicone", "Wood", "Plastic", "Jade", "Rose Quartz"]'::jsonb,
     '["Неръждаема стомана", "Керамика", "Титан", "Силикон", "Дърво", "Пластмаса", "Жад", "Розов кварц"]'::jsonb, 2),
    
    (v_beauty_tools_id, 'Heat Settings', 'Настройки за топлина', 'select', false, true, 
     '["None", "Single", "Multiple", "Adjustable Temperature"]'::jsonb,
     '["Няма", "Единична", "Множество", "Регулируема температура"]'::jsonb, 3),

    (v_beauty_tools_id, 'Travel Friendly', 'За пътуване', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
    (v_beauty_tools_id, 'Professional Grade', 'Професионален клас', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5);

END $$;;
