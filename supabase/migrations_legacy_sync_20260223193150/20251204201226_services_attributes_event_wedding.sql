-- =====================================================
-- SERVICES ATTRIBUTES: EVENT & WEDDING SPECIFIC
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order) VALUES

-- EVENT SPECIFIC
('c1d2e3f4-0005-4000-8000-000000000001', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Event Type', 'Тип събитие', 'multiselect', false, true,
 '["Wedding", "Birthday", "Corporate Event", "Conference", "Concert", "Festival", "Private Party", "Graduation", "Anniversary", "Baby Shower", "Engagement Party", "Funeral", "Religious Event", "Sports Event", "Exhibition", "Other"]'::jsonb,
 '["Сватба", "Рожден ден", "Корпоративно събитие", "Конференция", "Концерт", "Фестивал", "Частно парти", "Абитуриентски бал", "Годишнина", "Baby Shower", "Годеж", "Погребение", "Религиозно събитие", "Спортно събитие", "Изложба", "Друго"]'::jsonb,
 'Select event types', 'Изберете типове събития', 41),

('c1d2e3f4-0005-4000-8000-000000000002', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Event Capacity', 'Капацитет на събитието', 'select', false, true,
 '["Up to 20 guests", "21-50 guests", "51-100 guests", "101-200 guests", "201-500 guests", "500+ guests"]'::jsonb,
 '["До 20 гости", "21-50 гости", "51-100 гости", "101-200 гости", "201-500 гости", "500+ гости"]'::jsonb,
 'Select capacity', 'Изберете капацитет', 42),

('c1d2e3f4-0005-4000-8000-000000000003', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Event Duration', 'Продължителност на събитието', 'select', false, true,
 '["1-2 hours", "3-4 hours", "Half day", "Full day", "Multi-day", "Weekend", "Week-long"]'::jsonb,
 '["1-2 часа", "3-4 часа", "Половин ден", "Цял ден", "Няколко дни", "Уикенд", "Цяла седмица"]'::jsonb,
 'Select duration', 'Изберете продължителност', 43),

('c1d2e3f4-0005-4000-8000-000000000004', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Venue Type', 'Тип на мястото', 'multiselect', false, true,
 '["Indoor", "Outdoor", "Both", "Hotel", "Restaurant", "Garden", "Beach", "Mountain", "Castle", "Villa", "Conference Center", "Tent/Marquee"]'::jsonb,
 '["На закрито", "На открито", "И двете", "Хотел", "Ресторант", "Градина", "Плаж", "Планина", "Замък", "Вила", "Конферентен център", "Шатра"]'::jsonb,
 'Select venue type', 'Изберете тип на мястото', 44),

('c1d2e3f4-0005-4000-8000-000000000005', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Catering Included', 'Кетъринг включен', 'select', false, true,
 '["Yes - Full Catering", "Yes - Partial", "No - Bring Your Own", "Optional Add-on", "External Catering Allowed"]'::jsonb,
 '["Да - Пълен кетъринг", "Да - Частичен", "Не - Собствен", "Допълнителна опция", "Разрешен външен кетъринг"]'::jsonb,
 'Catering options', 'Опции за кетъринг', 45),

-- WEDDING SPECIFIC
('c1d2e3f4-0005-4000-8000-000000000006', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Wedding Style', 'Стил на сватбата', 'multiselect', false, true,
 '["Traditional Bulgarian", "Modern/Contemporary", "Rustic/Bohemian", "Classic/Elegant", "Beach Wedding", "Destination Wedding", "Intimate/Elopement", "Vintage", "Garden Party", "Black Tie/Formal"]'::jsonb,
 '["Традиционна българска", "Модерна/Съвременна", "Рустик/Бохемска", "Класическа/Елегантна", "Плажна сватба", "Дестинация сватба", "Интимна/Бягство", "Винтидж", "Градинско парти", "Формална"]'::jsonb,
 'Select wedding style', 'Изберете стил на сватбата', 46),

('c1d2e3f4-0005-4000-8000-000000000007', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Guest Count Range', 'Брой гости', 'select', false, true,
 '["Intimate (up to 30)", "Small (31-60)", "Medium (61-100)", "Large (101-150)", "Grand (151-250)", "Mega (250+)"]'::jsonb,
 '["Интимна (до 30)", "Малка (31-60)", "Средна (61-100)", "Голяма (101-150)", "Грандиозна (151-250)", "Мега (250+)"]'::jsonb,
 'Select guest count range', 'Изберете диапазон гости', 47),

('c1d2e3f4-0005-4000-8000-000000000008', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Wedding Packages', 'Сватбени пакети', 'multiselect', false, true,
 '["Basic Package", "Standard Package", "Premium Package", "All-Inclusive", "À la carte", "Custom Package", "Elopement Package"]'::jsonb,
 '["Основен пакет", "Стандартен пакет", "Премиум пакет", "Всичко включено", "А ла карт", "Персонализиран пакет", "Пакет за бягство"]'::jsonb,
 'Select available packages', 'Изберете налични пакети', 48),

('c1d2e3f4-0005-4000-8000-000000000009', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Wedding Services Offered', 'Предлагани сватбени услуги', 'multiselect', false, true,
 '["Wedding Planning", "Day-of Coordination", "Venue Decoration", "Floral Design", "Photography", "Videography", "DJ/Music", "Live Band", "Catering", "Wedding Cake", "Hair & Makeup", "Transportation", "Officiant", "Photo Booth"]'::jsonb,
 '["Планиране на сватба", "Координация в деня", "Декорация на място", "Флорален дизайн", "Фотография", "Видеография", "DJ/Музика", "Жива музика", "Кетъринг", "Сватбена торта", "Прическа и грим", "Транспорт", "Водещ на церемония", "Фотокабина"]'::jsonb,
 'Select services offered', 'Изберете предлагани услуги', 49),

-- CLEANING SPECIFIC
('c1d2e3f4-0005-4000-8000-000000000010', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Cleaning Type', 'Тип почистване', 'multiselect', false, true,
 '["Regular Cleaning", "Deep Cleaning", "Move-in/Move-out", "Post-Construction", "Commercial Cleaning", "Carpet Cleaning", "Window Cleaning", "Upholstery Cleaning", "Office Cleaning", "Industrial Cleaning"]'::jsonb,
 '["Редовно почистване", "Основно почистване", "При нанасяне/изнасяне", "След ремонт", "Търговско почистване", "Почистване на килими", "Почистване на прозорци", "Почистване на мебели", "Офис почистване", "Индустриално почистване"]'::jsonb,
 'Select cleaning types', 'Изберете типове почистване', 50),

('c1d2e3f4-0005-4000-8000-000000000011', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Property Type', 'Тип имот', 'multiselect', false, true,
 '["Apartment", "House", "Villa", "Office", "Commercial Space", "Industrial", "Restaurant/Bar", "Hotel", "Medical Facility", "School", "Warehouse"]'::jsonb,
 '["Апартамент", "Къща", "Вила", "Офис", "Търговски обект", "Индустриален", "Ресторант/Бар", "Хотел", "Медицинско заведение", "Училище", "Склад"]'::jsonb,
 'Select property types', 'Изберете типове имоти', 51),

('c1d2e3f4-0005-4000-8000-000000000012', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Property Size', 'Размер на имота', 'select', false, true,
 '["Up to 50 sqm", "51-100 sqm", "101-150 sqm", "151-200 sqm", "201-300 sqm", "300+ sqm"]'::jsonb,
 '["До 50 кв.м", "51-100 кв.м", "101-150 кв.м", "151-200 кв.м", "201-300 кв.м", "300+ кв.м"]'::jsonb,
 'Select property size', 'Изберете размер на имота', 52),

('c1d2e3f4-0005-4000-8000-000000000013', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Cleaning Supplies', 'Материали за почистване', 'select', false, true,
 '["Provided by Cleaner", "Provided by Client", "Both Options", "Eco-Friendly Only"]'::jsonb,
 '["Осигурени от почистващия", "Осигурени от клиента", "И двете опции", "Само екологични"]'::jsonb,
 'Cleaning supplies option', 'Опция за материали', 53);;
