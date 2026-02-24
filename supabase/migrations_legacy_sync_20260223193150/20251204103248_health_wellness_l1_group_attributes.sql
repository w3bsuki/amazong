
-- ============================================================================
-- HEALTH & WELLNESS L1 GROUP ATTRIBUTES
-- Attributes for the 5 new major L1 grouping categories
-- ============================================================================

-- 💊 SUPPLEMENTS & VITAMINS (d1cdc34b-0001-4000-8000-000000000001)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order) VALUES
-- Form & Delivery
('d1cdc34b-0001-4000-8000-000000000001', 'Supplement Form', 'Форма на добавката', 'select',
 '["Capsules", "Tablets", "Softgels", "Gummies", "Powder", "Liquid", "Drops", "Spray", "Chewables", "Lozenges", "Effervescent"]',
 '["Капсули", "Таблетки", "Меки капсули", "Желирани бонбони", "Прах", "Течност", "Капки", "Спрей", "Дъвчащи", "Пастили", "Ефервесцентни"]',
 true, true, 1),

('d1cdc34b-0001-4000-8000-000000000001', 'Serving Size', 'Размер на порцията', 'text', NULL, NULL, false, false, 2),

('d1cdc34b-0001-4000-8000-000000000001', 'Servings Per Container', 'Порции в опаковка', 'select',
 '["30", "60", "90", "120", "180", "200", "250", "365"]',
 '["30", "60", "90", "120", "180", "200", "250", "365"]',
 false, true, 3),

('d1cdc34b-0001-4000-8000-000000000001', 'Dietary Preference', 'Диетични предпочитания', 'multiselect',
 '["Vegan", "Vegetarian", "Gluten-Free", "Non-GMO", "Organic", "Kosher", "Halal", "Sugar-Free", "Dairy-Free", "Soy-Free", "Nut-Free", "Keto-Friendly", "Paleo-Friendly"]',
 '["Веган", "Вегетарианско", "Без глутен", "Без ГМО", "Органично", "Кошер", "Халал", "Без захар", "Без млечни", "Без соя", "Без ядки", "Кето", "Палео"]',
 false, true, 4),

('d1cdc34b-0001-4000-8000-000000000001', 'Certifications', 'Сертификати', 'multiselect',
 '["GMP Certified", "NSF Certified", "USP Verified", "FDA Registered", "Third-Party Tested", "cGMP", "Informed Sport", "USDA Organic", "Non-GMO Project Verified"]',
 '["GMP сертифициран", "NSF сертифициран", "USP верифициран", "FDA регистриран", "Тестван от трета страна", "cGMP", "Informed Sport", "USDA органичен", "Non-GMO Project"]',
 false, true, 5),

('d1cdc34b-0001-4000-8000-000000000001', 'Target Audience', 'Целева аудитория', 'multiselect',
 '["Adults", "Seniors 50+", "Men", "Women", "Children", "Teens", "Pregnant Women", "Athletes", "Vegans/Vegetarians"]',
 '["Възрастни", "Сеньори 50+", "Мъже", "Жени", "Деца", "Тийнейджъри", "Бременни жени", "Атлети", "Вегани/Вегетарианци"]',
 false, true, 6),

('d1cdc34b-0001-4000-8000-000000000001', 'Primary Benefit', 'Основна полза', 'multiselect',
 '["Immune Support", "Energy", "Sleep", "Stress Relief", "Bone Health", "Heart Health", "Brain Health", "Digestive Health", "Joint Health", "Skin Health", "Hair & Nails", "Eye Health", "Weight Management", "Muscle Recovery", "Detox", "Anti-Aging", "Mood Support"]',
 '["Имунна подкрепа", "Енергия", "Сън", "Облекчаване на стреса", "Здраве на костите", "Здраве на сърцето", "Здраве на мозъка", "Храносмилане", "Здраве на ставите", "Здраве на кожата", "Коса и нокти", "Здраве на очите", "Контрол на теглото", "Мускулно възстановяване", "Детокс", "Анти-ейджинг", "Настроение"]',
 false, true, 7);

-- 🧬 SPECIALTY & TARGETED HEALTH (d1cdc34b-0002-4000-8000-000000000002)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order) VALUES
('d1cdc34b-0002-4000-8000-000000000002', 'Target Demographic', 'Целева демография', 'select',
 '["Women", "Men", "Children 0-3", "Children 4-12", "Teens 13-17", "Adults 18-49", "Seniors 50+", "Pregnant", "Nursing", "Athletes"]',
 '["Жени", "Мъже", "Деца 0-3", "Деца 4-12", "Тийнейджъри 13-17", "Възрастни 18-49", "Сеньори 50+", "Бременни", "Кърмещи", "Атлети"]',
 true, true, 1),

('d1cdc34b-0002-4000-8000-000000000002', 'Life Stage', 'Етап от живота', 'select',
 '["Prenatal", "Postnatal", "Menstrual", "Perimenopause", "Menopause", "Puberty", "Middle Age", "Senior", "Active Lifestyle"]',
 '["Пренатален", "Постнатален", "Менструален", "Перименопауза", "Менопауза", "Пубертет", "Средна възраст", "Сеньор", "Активен начин на живот"]',
 false, true, 2),

('d1cdc34b-0002-4000-8000-000000000002', 'Health Focus', 'Здравен фокус', 'multiselect',
 '["Hormonal Balance", "Reproductive Health", "Cardiovascular", "Metabolic", "Cognitive", "Bone Density", "Prostate", "Breast Health", "Thyroid", "Adrenal", "Blood Sugar", "Cholesterol", "Blood Pressure", "Liver", "Kidney"]',
 '["Хормонален баланс", "Репродуктивно здраве", "Сърдечно-съдово", "Метаболитно", "Когнитивно", "Костна плътност", "Простата", "Здраве на гърдите", "Щитовидна жлеза", "Надбъбречни жлези", "Кръвна захар", "Холестерол", "Кръвно налягане", "Черен дроб", "Бъбреци"]',
 false, true, 3),

('d1cdc34b-0002-4000-8000-000000000002', 'Condition Support', 'Подкрепа при състояние', 'multiselect',
 '["Diabetes Management", "Heart Disease Prevention", "Arthritis", "Osteoporosis", "PCOS", "Endometriosis", "BPH", "Anxiety", "Depression", "ADHD", "Insomnia", "Chronic Fatigue", "Inflammation"]',
 '["Управление на диабет", "Превенция на сърдечни заболявания", "Артрит", "Остеопороза", "СПКЯ", "Ендометриоза", "ДПХ", "Тревожност", "Депресия", "ХАДВ", "Безсъние", "Хронична умора", "Възпаление"]',
 false, true, 4);

-- 🏋️ SPORTS & FITNESS NUTRITION (d1cdc34b-0003-4000-8000-000000000003)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order) VALUES
('d1cdc34b-0003-4000-8000-000000000003', 'Fitness Goal', 'Фитнес цел', 'multiselect',
 '["Muscle Building", "Muscle Recovery", "Weight Loss", "Weight Gain", "Lean Muscle", "Endurance", "Strength", "Energy Boost", "Pre-Workout", "Post-Workout", "Intra-Workout", "Hydration", "Performance", "Cutting", "Bulking"]',
 '["Изграждане на мускули", "Мускулно възстановяване", "Отслабване", "Качване на тегло", "Чиста мускулна маса", "Издръжливост", "Сила", "Енергиен буст", "Преди тренировка", "След тренировка", "По време на тренировка", "Хидратация", "Представяне", "Дефиниция", "Обем"]',
 true, true, 1),

('d1cdc34b-0003-4000-8000-000000000003', 'Sport Type', 'Вид спорт', 'multiselect',
 '["Bodybuilding", "CrossFit", "Running", "Cycling", "Swimming", "MMA/Combat", "Team Sports", "Powerlifting", "Olympic Lifting", "Endurance Sports", "Yoga/Pilates", "General Fitness", "HIIT"]',
 '["Бодибилдинг", "КросФит", "Бягане", "Колоездене", "Плуване", "ММА/Бойни", "Отборни спортове", "Пауърлифтинг", "Олимпийско вдигане", "Спортове за издръжливост", "Йога/Пилатес", "Общ фитнес", "ВИИТ"]',
 false, true, 2),

('d1cdc34b-0003-4000-8000-000000000003', 'Flavor', 'Вкус', 'select',
 '["Unflavored", "Chocolate", "Vanilla", "Strawberry", "Banana", "Cookies & Cream", "Peanut Butter", "Caramel", "Coffee/Mocha", "Mint Chocolate", "Fruit Punch", "Berry", "Tropical", "Citrus/Orange", "Watermelon", "Grape", "Green Apple", "Blue Raspberry"]',
 '["Без вкус", "Шоколад", "Ванилия", "Ягода", "Банан", "Бисквитки и сметана", "Фъстъчено масло", "Карамел", "Кафе/Мока", "Ментов шоколад", "Плодов пунш", "Горски плодове", "Тропически", "Цитрус/Портокал", "Диня", "Грозде", "Зелена ябълка", "Синя малина"]',
 false, true, 3),

('d1cdc34b-0003-4000-8000-000000000003', 'Protein Content', 'Съдържание на протеин', 'select',
 '["0-10g", "10-20g", "20-25g", "25-30g", "30-40g", "40g+"]',
 '["0-10г", "10-20г", "20-25г", "25-30г", "30-40г", "40г+"]',
 false, true, 4),

('d1cdc34b-0003-4000-8000-000000000003', 'Caffeine Content', 'Съдържание на кофеин', 'select',
 '["Caffeine-Free", "Low (50-100mg)", "Medium (100-200mg)", "High (200-300mg)", "Extreme (300mg+)"]',
 '["Без кофеин", "Ниско (50-100мг)", "Средно (100-200мг)", "Високо (200-300мг)", "Екстремно (300мг+)"]',
 false, true, 5),

('d1cdc34b-0003-4000-8000-000000000003', 'Sugar Content', 'Съдържание на захар', 'select',
 '["Sugar-Free", "Low Sugar (<5g)", "Regular"]',
 '["Без захар", "Ниска захар (<5г)", "Обикновено"]',
 false, true, 6);

-- 🏥 MEDICAL & PERSONAL CARE (d1cdc34b-0004-4000-8000-000000000004)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order) VALUES
('d1cdc34b-0004-4000-8000-000000000004', 'Product Category', 'Категория продукт', 'select',
 '["First Aid", "Monitoring Devices", "Mobility Aids", "Vision Care", "Hearing Care", "Respiratory", "Wound Care", "Pain Relief", "Orthopedic", "Diagnostic", "PPE/Safety", "Hygiene", "Incontinence", "Skin Care", "Hair Care", "Oral Care"]',
 '["Първа помощ", "Устройства за мониторинг", "Помощни средства за мобилност", "Грижа за зрението", "Грижа за слуха", "Респираторни", "Грижа за рани", "Облекчаване на болка", "Ортопедични", "Диагностични", "ЛПС/Безопасност", "Хигиена", "Инконтиненция", "Грижа за кожата", "Грижа за косата", "Устна хигиена"]',
 true, true, 1),

('d1cdc34b-0004-4000-8000-000000000004', 'Medical Grade', 'Медицински клас', 'boolean', NULL, NULL, false, true, 2),

('d1cdc34b-0004-4000-8000-000000000004', 'Prescription Required', 'Изисква рецепта', 'boolean', NULL, NULL, false, true, 3),

('d1cdc34b-0004-4000-8000-000000000004', 'Reusable', 'За многократна употреба', 'boolean', NULL, NULL, false, true, 4),

('d1cdc34b-0004-4000-8000-000000000004', 'Power Source', 'Захранване', 'select',
 '["Battery (AA/AAA)", "Rechargeable Battery", "USB Rechargeable", "AC Power", "Manual/No Power", "Solar"]',
 '["Батерия (AA/AAA)", "Акумулаторна батерия", "USB зареждане", "AC захранване", "Ръчно/Без захранване", "Соларно"]',
 false, true, 5),

('d1cdc34b-0004-4000-8000-000000000004', 'Connectivity', 'Свързаност', 'multiselect',
 '["Bluetooth", "WiFi", "App Compatible", "No Connectivity", "USB Data Transfer"]',
 '["Bluetooth", "WiFi", "Съвместимо с приложение", "Без свързаност", "USB трансфер"]',
 false, true, 6);

-- 🌿 NATURAL & ALTERNATIVE WELLNESS (d1cdc34b-0005-4000-8000-000000000005)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order) VALUES
('d1cdc34b-0005-4000-8000-000000000005', 'Wellness Category', 'Категория уелнес', 'select',
 '["CBD Products", "Functional Mushrooms", "Adaptogens", "Herbal Remedies", "Aromatherapy", "Traditional Medicine", "Ayurveda", "TCM (Traditional Chinese)", "Homeopathy", "Flower Essences", "Essential Oils"]',
 '["CBD продукти", "Функционални гъби", "Адаптогени", "Билкови средства", "Ароматерапия", "Традиционна медицина", "Аюрведа", "ТКМ (Традиционна китайска)", "Хомеопатия", "Цветни есенции", "Етерични масла"]',
 true, true, 1),

('d1cdc34b-0005-4000-8000-000000000005', 'Extract Type', 'Тип екстракт', 'select',
 '["Full Spectrum", "Broad Spectrum", "Isolate", "Whole Plant", "Standardized Extract", "Raw/Crude", "CO2 Extracted", "Alcohol Extracted", "Water Extracted", "Dual Extracted"]',
 '["Пълен спектър", "Широк спектър", "Изолат", "Цяло растение", "Стандартизиран екстракт", "Суров/Необработен", "CO2 екстрахиран", "Алкохолно екстрахиран", "Водно екстрахиран", "Двойно екстрахиран"]',
 false, true, 2),

('d1cdc34b-0005-4000-8000-000000000005', 'Primary Ingredient', 'Основна съставка', 'select',
 '["CBD", "CBG", "CBN", "THC-Free Hemp", "Lions Mane", "Reishi", "Chaga", "Cordyceps", "Turkey Tail", "Ashwagandha", "Rhodiola", "Ginseng", "Maca", "Holy Basil", "Valerian", "Passionflower", "Lavender", "Chamomile", "Elderberry", "Echinacea", "Turmeric", "Ginger"]',
 '["CBD", "CBG", "CBN", "Коноп без ТХК", "Лъвска грива", "Рейши", "Чага", "Кордицепс", "Пуешка опашка", "Ашваганда", "Родиола", "Женшен", "Мака", "Свещен босилек", "Валериана", "Пасифлора", "Лавандула", "Лайка", "Бъз", "Ехинацея", "Куркума", "Джинджифил"]',
 false, true, 3),

('d1cdc34b-0005-4000-8000-000000000005', 'Strength/Potency', 'Сила/Потентност', 'select',
 '["Low Strength", "Medium Strength", "High Strength", "Extra Strength", "Maximum Strength"]',
 '["Ниска сила", "Средна сила", "Висока сила", "Екстра сила", "Максимална сила"]',
 false, true, 4),

('d1cdc34b-0005-4000-8000-000000000005', 'Effect/Benefit', 'Ефект/Полза', 'multiselect',
 '["Relaxation", "Sleep Support", "Stress Relief", "Pain Relief", "Anti-Anxiety", "Focus & Clarity", "Energy", "Mood Enhancement", "Immune Support", "Anti-Inflammatory", "Neuroprotective", "Adaptogenic", "Calming", "Grounding", "Uplifting"]',
 '["Релаксация", "Подкрепа за сън", "Облекчаване на стрес", "Облекчаване на болка", "Анти-тревожност", "Фокус и яснота", "Енергия", "Подобряване на настроението", "Имунна подкрепа", "Противовъзпалително", "Невропротективен", "Адаптогенен", "Успокояващ", "Заземяващ", "Повдигащ"]',
 false, true, 5),

('d1cdc34b-0005-4000-8000-000000000005', 'Lab Tested', 'Лабораторно тестван', 'boolean', NULL, NULL, false, true, 6),

('d1cdc34b-0005-4000-8000-000000000005', 'COA Available', 'COA наличен', 'boolean', NULL, NULL, false, true, 7);
;
