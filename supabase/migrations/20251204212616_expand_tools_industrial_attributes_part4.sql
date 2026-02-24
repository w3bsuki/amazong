-- =====================================================
-- TOOLS & INDUSTRIAL ATTRIBUTES - PART 4
-- Size, Capacity, Pricing & Bulgarian Market
-- Category ID: e6f6ece0-ec00-4c0f-8b57-c52ae40a7399
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
VALUES
  -- SIZE & CAPACITY (53-62)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Cutting Depth - Wood', 'Дълбочина на рязане - Дърво', 'select',
   '["Up to 25mm", "25-50mm", "50-65mm", "65-80mm", "80-100mm", "100mm+", "N/A"]'::jsonb,
   '["До 25мм", "25-50мм", "50-65мм", "65-80мм", "80-100мм", "100мм+", "Не е приложимо"]'::jsonb,
   false, true, 53),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Cutting Depth - Metal', 'Дълбочина на рязане - Метал', 'select',
   '["Up to 3mm", "3-6mm", "6-10mm", "10-15mm", "15mm+", "N/A"]'::jsonb,
   '["До 3мм", "3-6мм", "6-10мм", "10-15мм", "15мм+", "Не е приложимо"]'::jsonb,
   false, true, 54),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Drilling Capacity - Concrete', 'Капацитет на пробиване - Бетон', 'select',
   '["Up to 10mm", "10-16mm", "16-26mm", "26-40mm", "40mm+", "N/A"]'::jsonb,
   '["До 10мм", "10-16мм", "16-26мм", "26-40мм", "40мм+", "Не е приложимо"]'::jsonb,
   false, true, 55),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Tank/Hopper Capacity', 'Капацитет на резервоара', 'select',
   '["Up to 5L", "5-10L", "10-20L", "20-50L", "50-100L", "100L+", "N/A"]'::jsonb,
   '["До 5L", "5-10L", "10-20L", "20-50L", "50-100L", "100L+", "Не е приложимо"]'::jsonb,
   false, true, 56),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Cable/Hose Length', 'Дължина на кабела/маркуча', 'select',
   '["Up to 2m", "2-4m", "4-6m", "6-10m", "10-15m", "15m+", "N/A"]'::jsonb,
   '["До 2м", "2-4м", "4-6м", "6-10м", "10-15м", "15м+", "Не е приложимо"]'::jsonb,
   false, true, 57),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Work Surface Size', 'Размер на работната повърхност', 'select',
   '["Compact (under 50cm)", "Medium (50-100cm)", "Large (100-150cm)", "XL (150cm+)", "N/A"]'::jsonb,
   '["Компактна (под 50см)", "Средна (50-100см)", "Голяма (100-150см)", "XL (150см+)", "Не е приложимо"]'::jsonb,
   false, false, 58),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Set Size', 'Брой в комплекта', 'select',
   '["Single Item", "2-5 Pieces", "6-10 Pieces", "11-20 Pieces", "21-50 Pieces", "51-100 Pieces", "100+ Pieces"]'::jsonb,
   '["Единична бройка", "2-5 части", "6-10 части", "11-20 части", "21-50 части", "51-100 части", "100+ части"]'::jsonb,
   false, true, 59),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Size Range (Metric)', 'Обхват на размерите (метрични)', 'text',
   '[]'::jsonb, '[]'::jsonb,
   false, false, 60),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Drive Size', 'Размер на задвижването', 'select',
   '["1/4\"", "3/8\"", "1/2\"", "3/4\"", "1\"", "Multiple Sizes", "N/A"]'::jsonb,
   '["1/4\"", "3/8\"", "1/2\"", "3/4\"", "1\"", "Множество размери", "Не е приложимо"]'::jsonb,
   false, true, 61),

  -- PRICING & AVAILABILITY (62-67)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Pack Quantity', 'Количество в опаковката', 'select',
   '["Single", "Pair (2)", "3-Pack", "5-Pack", "10-Pack", "Bulk (25+)", "Bulk (100+)"]'::jsonb,
   '["Единична", "Чифт (2)", "3 броя", "5 броя", "10 броя", "Насипно (25+)", "Насипно (100+)"]'::jsonb,
   false, true, 62),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Rental Available', 'Наличен под наем', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 63),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Bulk Discount Available', 'Налична отстъпка за количество', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, false, 64),

  -- BULGARIAN MARKET SPECIFIC (65-75)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Invoice Available', 'Фактура', 'select',
   '["Bulgarian Invoice", "EU Invoice", "Receipt Only", "No Document"]'::jsonb,
   '["Българска фактура", "ЕС фактура", "Само касова бележка", "Без документ"]'::jsonb,
   false, true, 65),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'VAT Included', 'ДДС включено', 'select',
   '["Yes (20% VAT Included)", "No (VAT Not Included)", "VAT Exempt"]'::jsonb,
   '["Да (включено 20% ДДС)", "Не (без ДДС)", "Освободено от ДДС"]'::jsonb,
   false, true, 66),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Warranty Service Location', 'Гаранционен сервиз', 'select',
   '["Bulgaria Authorized Service", "EU Service Center", "International Service", "Seller Warranty Only"]'::jsonb,
   '["Оторизиран сервиз в България", "ЕС сервизен център", "Международен сервиз", "Само гаранция от продавача"]'::jsonb,
   false, true, 67),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Local Availability', 'Локална наличност', 'select',
   '["In Stock Sofia", "In Stock Regional", "Warehouse Stock", "Order Only (3-5 days)", "Order Only (1-2 weeks)", "Special Order (2-4 weeks)"]'::jsonb,
   '["Наличен в София", "Наличен в региона", "На склад", "По поръчка (3-5 дни)", "По поръчка (1-2 седмици)", "Специална поръчка (2-4 седмици)"]'::jsonb,
   false, true, 68),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Delivery Type', 'Вид доставка', 'select',
   '["Express (Next Day)", "Standard (2-3 days)", "Economy (5-7 days)", "Heavy Item (Scheduled)", "Store Pickup Only", "Free Shipping"]'::jsonb,
   '["Експресна (следващ ден)", "Стандартна (2-3 дни)", "Икономична (5-7 дни)", "Тежък товар (по договорка)", "Само от магазин", "Безплатна доставка"]'::jsonb,
   false, true, 69),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Payment Options', 'Начини на плащане', 'multiselect',
   '["Cash on Delivery", "Bank Transfer", "Credit Card", "Leasing Available", "Installments", "PayPal"]'::jsonb,
   '["Наложен платеж", "Банков превод", "Кредитна карта", "Лизинг", "Разсрочено плащане", "PayPal"]'::jsonb,
   false, false, 70),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Return Policy', 'Политика за връщане', 'select',
   '["14 Days (Standard EU)", "30 Days Extended", "Exchange Only", "No Returns (Sale)", "Warranty Exchange Only"]'::jsonb,
   '["14 дни (стандартен ЕС)", "30 дни удължен", "Само замяна", "Без връщане (разпродажба)", "Само гаранционна замяна"]'::jsonb,
   false, true, 71),

  -- ADDITIONAL FEATURES (72-78)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Smart Features', 'Интелигентни функции', 'multiselect',
   '["Bluetooth Connectivity", "App Control", "Battery Status Display", "Usage Tracking", "Auto-Stop", "Smart Torque", "None"]'::jsonb,
   '["Bluetooth свързаност", "Управление чрез приложение", "Дисплей за батерията", "Проследяване на употребата", "Автоматично спиране", "Интелигентен въртящ момент", "Няма"]'::jsonb,
   false, true, 72),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Special Features', 'Специални характеристики', 'multiselect',
   '["Quick-Change System", "Tool-Free Adjustment", "Depth Gauge", "Laser Guide", "Digital Display", "Memory Settings", "Kickback Detection", "Automatic Speed Adjustment"]'::jsonb,
   '["Бърза смяна", "Безинструментална настройка", "Измервател на дълбочина", "Лазерен водач", "Дигитален дисплей", "Запаметени настройки", "Откриване на откат", "Автоматична скорост"]'::jsonb,
   false, true, 73),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Compact/Subcompact', 'Компактен/Субкомпактен', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 74),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Color', 'Цвят', 'select',
   '["Blue (Bosch Pro)", "Teal (Makita)", "Yellow (DeWalt)", "Red (Milwaukee/Hilti)", "Green (Bosch DIY/Hitachi)", "Black", "Orange (Fein)", "Gray", "Other"]'::jsonb,
   '["Син (Bosch Pro)", "Тюркоазен (Makita)", "Жълт (DeWalt)", "Червен (Milwaukee/Hilti)", "Зелен (Bosch DIY/Hitachi)", "Черен", "Оранжев (Fein)", "Сив", "Друг"]'::jsonb,
   false, false, 75),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Year of Manufacture', 'Година на производство', 'select',
   '["2024", "2023", "2022", "2021", "2020", "2019", "2018 or Earlier", "Unknown"]'::jsonb,
   '["2024", "2023", "2022", "2021", "2020", "2019", "2018 или по-рано", "Неизвестна"]'::jsonb,
   false, false, 76),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Model Number', 'Модел номер', 'text',
   '[]'::jsonb, '[]'::jsonb,
   false, false, 77),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Original Box/Packaging', 'Оригинална кутия/опаковка', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, false, 78)
ON CONFLICT DO NOTHING;;
