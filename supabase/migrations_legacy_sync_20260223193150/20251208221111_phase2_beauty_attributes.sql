-- Phase 2.3: Beauty Attributes
-- Target: Add filterable attributes to Beauty L0/L1/L2 categories

-- =====================================================
-- SKINCARE ATTRIBUTES (for skincare L1 and L2 categories)
-- =====================================================

-- Skin Type attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Skin Type',
  'Тип кожа',
  'multiselect',
  false,
  true,
  '["Normal", "Dry", "Oily", "Combination", "Sensitive", "All Skin Types"]',
  '["Нормална", "Суха", "Мазна", "Комбинирана", "Чувствителна", "Всички типове"]',
  1
FROM categories 
WHERE slug IN ('skincare', 'skincare-moisturizers', 'skincare-serums', 'skincare-cleansers', 'skincare-masks', 'skincare-toners', 'skincare-eye-care', 'skincare-exfoliators', 'skincare-acne-treatments', 'skincare-anti-aging', 'skincare-sunscreen')
ON CONFLICT (category_id, name) DO NOTHING;

-- Skin Concern attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Skin Concern',
  'Проблем на кожата',
  'multiselect',
  false,
  true,
  '["Acne", "Aging", "Dark Spots", "Dryness", "Dullness", "Fine Lines", "Pores", "Redness", "Uneven Texture", "Wrinkles"]',
  '["Акне", "Стареене", "Тъмни петна", "Сухота", "Безжизненост", "Фини линии", "Пори", "Зачервяване", "Неравна текстура", "Бръчки"]',
  2
FROM categories 
WHERE slug IN ('skincare', 'skincare-moisturizers', 'skincare-serums', 'skincare-cleansers', 'skincare-masks', 'skincare-acne-treatments', 'skincare-anti-aging')
ON CONFLICT (category_id, name) DO NOTHING;

-- Key Ingredients attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Key Ingredients',
  'Ключови съставки',
  'multiselect',
  false,
  true,
  '["Hyaluronic Acid", "Retinol", "Vitamin C", "Niacinamide", "Salicylic Acid", "Glycolic Acid", "Ceramides", "Peptides", "Collagen", "Squalane", "Tea Tree", "Aloe Vera"]',
  '["Хиалуронова киселина", "Ретинол", "Витамин C", "Ниацинамид", "Салицилова киселина", "Гликолова киселина", "Керамиди", "Пептиди", "Колаген", "Скуалан", "Чаено дърво", "Алое вера"]',
  3
FROM categories 
WHERE slug IN ('skincare', 'skincare-serums', 'skincare-moisturizers', 'skincare-anti-aging', 'skincare-acne-treatments')
ON CONFLICT (category_id, name) DO NOTHING;

-- SPF Level attribute (for sunscreen)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'SPF Level',
  'SPF фактор',
  'select',
  false,
  true,
  '["SPF 15", "SPF 30", "SPF 50", "SPF 50+", "SPF 70+"]',
  '["SPF 15", "SPF 30", "SPF 50", "SPF 50+", "SPF 70+"]',
  1
FROM categories 
WHERE slug IN ('skincare-sunscreen')
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- MAKEUP ATTRIBUTES
-- =====================================================

-- Coverage attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Coverage',
  'Покритие',
  'select',
  false,
  true,
  '["Sheer", "Light", "Medium", "Full", "Buildable"]',
  '["Прозрачно", "Леко", "Средно", "Пълно", "Градивно"]',
  1
FROM categories 
WHERE slug IN ('makeup', 'makeup-foundation', 'makeup-concealers', 'makeup-bb-cc-creams')
ON CONFLICT (category_id, name) DO NOTHING;

-- Finish attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Finish',
  'Финиш',
  'select',
  false,
  true,
  '["Matte", "Satin", "Dewy", "Natural", "Radiant", "Shimmer", "Glitter"]',
  '["Матов", "Сатенен", "Сияен", "Естествен", "Лъчист", "Блестящ", "Глитер"]',
  2
FROM categories 
WHERE slug IN ('makeup', 'makeup-foundation', 'makeup-blush', 'makeup-highlighters', 'makeup-bronzers', 'makeup-eyeshadow', 'makeup-lipstick', 'makeup-lip-gloss')
ON CONFLICT (category_id, name) DO NOTHING;

-- Shade Range attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Shade Range',
  'Цветова гама',
  'select',
  false,
  true,
  '["Fair", "Light", "Light-Medium", "Medium", "Medium-Tan", "Tan", "Deep", "Universal"]',
  '["Светла", "Лека", "Светло-средна", "Средна", "Средно-тен", "Тен", "Тъмна", "Универсална"]',
  3
FROM categories 
WHERE slug IN ('makeup-foundation', 'makeup-concealers', 'makeup-bb-cc-creams', 'makeup-powder')
ON CONFLICT (category_id, name) DO NOTHING;

-- Formula attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Formula',
  'Формула',
  'select',
  false,
  true,
  '["Liquid", "Cream", "Powder", "Stick", "Gel", "Mousse", "Pencil"]',
  '["Течна", "Кремообразна", "Пудра", "Стик", "Гел", "Мус", "Молив"]',
  4
FROM categories 
WHERE slug IN ('makeup', 'makeup-foundation', 'makeup-blush', 'makeup-highlighters', 'makeup-bronzers', 'makeup-concealers')
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- HAIR CARE ATTRIBUTES
-- =====================================================

-- Hair Type attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Hair Type',
  'Тип коса',
  'multiselect',
  false,
  true,
  '["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick", "Normal", "All Hair Types"]',
  '["Права", "Вълнообразна", "Къдрава", "Спирална", "Фина", "Гъста", "Нормална", "Всички типове"]',
  1
FROM categories 
WHERE slug IN ('hair-care', 'haircare', 'hc-shampoo', 'hc-conditioner', 'hc-treatments', 'hc-styling', 'haircare-shampoo', 'haircare-conditioner', 'haircare-treatments', 'haircare-styling')
ON CONFLICT (category_id, name) DO NOTHING;

-- Hair Concern attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Hair Concern',
  'Проблем на косата',
  'multiselect',
  false,
  true,
  '["Damage Repair", "Color Protection", "Volume", "Frizz Control", "Hydration", "Dandruff", "Hair Loss", "Split Ends", "Oily Scalp", "Dry Scalp"]',
  '["Възстановяване", "Защита на цвета", "Обем", "Контрол на чуплива", "Хидратация", "Пърхот", "Косопад", "Цъфнали краища", "Мазен скалп", "Сух скалп"]',
  2
FROM categories 
WHERE slug IN ('hair-care', 'haircare', 'hc-shampoo', 'hc-conditioner', 'hc-treatments', 'haircare-shampoo', 'haircare-conditioner', 'haircare-treatments', 'haircare-hair-loss', 'hc-hairloss')
ON CONFLICT (category_id, name) DO NOTHING;

-- Hold Strength attribute (for styling)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Hold Strength',
  'Сила на задържане',
  'select',
  false,
  true,
  '["Flexible", "Light", "Medium", "Strong", "Extra Strong"]',
  '["Гъвкаво", "Леко", "Средно", "Силно", "Екстра силно"]',
  3
FROM categories 
WHERE slug IN ('hc-styling', 'haircare-styling')
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- FRAGRANCE ATTRIBUTES
-- =====================================================

-- Fragrance Family attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Fragrance Family',
  'Семейство аромати',
  'select',
  false,
  true,
  '["Floral", "Oriental", "Woody", "Fresh", "Citrus", "Fruity", "Gourmand", "Aquatic", "Spicy", "Musky"]',
  '["Цветен", "Ориенталски", "Дървесен", "Свеж", "Цитрусов", "Плодов", "Гурме", "Воден", "Пикантен", "Мускусен"]',
  1
FROM categories 
WHERE slug IN ('fragrance', 'womens-perfume', 'mens-cologne', 'fragrance-unisex', 'luxury-niche-fragrance')
ON CONFLICT (category_id, name) DO NOTHING;

-- Concentration attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Concentration',
  'Концентрация',
  'select',
  false,
  true,
  '["Parfum", "Eau de Parfum", "Eau de Toilette", "Eau de Cologne", "Eau Fraiche", "Body Mist"]',
  '["Парфюм", "Парфюмна вода", "Тоалетна вода", "Одеколон", "Свежа вода", "Спрей за тяло"]',
  2
FROM categories 
WHERE slug IN ('fragrance', 'womens-perfume', 'mens-cologne', 'fragrance-unisex')
ON CONFLICT (category_id, name) DO NOTHING;

-- Longevity attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Longevity',
  'Дълготрайност',
  'select',
  false,
  true,
  '["2-4 hours", "4-6 hours", "6-8 hours", "8-12 hours", "12+ hours"]',
  '["2-4 часа", "4-6 часа", "6-8 часа", "8-12 часа", "12+ часа"]',
  3
FROM categories 
WHERE slug IN ('fragrance', 'womens-perfume', 'mens-cologne', 'fragrance-unisex', 'luxury-niche-fragrance')
ON CONFLICT (category_id, name) DO NOTHING;

-- Season attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Season',
  'Сезон',
  'multiselect',
  false,
  true,
  '["Spring", "Summer", "Fall", "Winter", "All Year"]',
  '["Пролет", "Лято", "Есен", "Зима", "Целогодишно"]',
  4
FROM categories 
WHERE slug IN ('fragrance', 'womens-perfume', 'mens-cologne', 'fragrance-unisex')
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- MEN'S GROOMING ATTRIBUTES
-- =====================================================

-- Beard Type attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Beard Type',
  'Тип брада',
  'select',
  false,
  true,
  '["Short Beard", "Medium Beard", "Long Beard", "Stubble", "All Beard Types"]',
  '["Къса брада", "Средна брада", "Дълга брада", "Брадясал", "Всички типове"]',
  1
FROM categories 
WHERE slug IN ('mg-beard', 'beard-care')
ON CONFLICT (category_id, name) DO NOTHING;

-- Skin Sensitivity attribute (for shaving)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Skin Sensitivity',
  'Чувствителност на кожата',
  'select',
  false,
  true,
  '["Normal", "Sensitive", "Very Sensitive", "All Skin Types"]',
  '["Нормална", "Чувствителна", "Много чувствителна", "Всички типове"]',
  1
FROM categories 
WHERE slug IN ('mens-shaving')
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- COMMON BEAUTY ATTRIBUTES (Cruelty-Free, Vegan, etc.)
-- =====================================================

-- Cruelty-Free attribute (apply to many beauty categories)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Cruelty-Free',
  'Без тестване върху животни',
  'select',
  false,
  true,
  '["Yes", "No"]',
  '["Да", "Не"]',
  10
FROM categories 
WHERE slug IN ('beauty', 'skincare', 'makeup', 'hair-care', 'haircare', 'fragrance')
ON CONFLICT (category_id, name) DO NOTHING;

-- Vegan attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Vegan',
  'Веган',
  'select',
  false,
  true,
  '["Yes", "No"]',
  '["Да", "Не"]',
  11
FROM categories 
WHERE slug IN ('beauty', 'skincare', 'makeup', 'hair-care', 'haircare')
ON CONFLICT (category_id, name) DO NOTHING;

-- Clean Beauty attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Clean Beauty',
  'Чиста козметика',
  'select',
  false,
  true,
  '["Yes", "No"]',
  '["Да", "Не"]',
  12
FROM categories 
WHERE slug IN ('beauty', 'skincare', 'makeup')
ON CONFLICT (category_id, name) DO NOTHING;

-- Brand Tier attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Brand Tier',
  'Ниво на марката',
  'select',
  false,
  true,
  '["Budget", "Drugstore", "Mid-Range", "Prestige", "Luxury", "Indie"]',
  '["Бюджетна", "Аптечна", "Среден клас", "Престижна", "Луксозна", "Инди"]',
  13
FROM categories 
WHERE slug IN ('beauty', 'skincare', 'makeup', 'hair-care', 'haircare', 'fragrance')
ON CONFLICT (category_id, name) DO NOTHING;;
