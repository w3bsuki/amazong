-- =====================================================
-- SOFTWARE CATEGORY ATTRIBUTES - Phase 4 (Part 2)
-- Product Details, Delivery & Support Attributes
-- =====================================================

INSERT INTO category_attributes (
  id, category_id, name, name_bg, attribute_type, is_required, is_filterable, 
  options, options_bg, placeholder, placeholder_bg, sort_order
) VALUES

-- =====================================================
-- PRODUCT DETAILS ATTRIBUTES
-- =====================================================

-- 17. Software Version
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Software Version', 'Версия на софтуера', 'text', false, false,
null, null,
'e.g., 2024, v14.0, Build 12345', 'напр. 2024, v14.0, Build 12345', 17),

-- 18. Release Year
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Release Year', 'Година на издаване', 'select', false, true,
'["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "Older"]'::jsonb,
'["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "По-стар"]'::jsonb,
'Select release year', 'Изберете година на издаване', 18),

-- 19. Edition
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Edition', 'Издание', 'select', false, true,
'["Free", "Home", "Personal", "Standard", "Professional", "Business", "Enterprise", "Ultimate", "Student", "Academic", "Developer", "Starter", "Essential", "Premium", "Platinum"]'::jsonb,
'["Безплатно", "Домашно", "Лично", "Стандартно", "Професионално", "Бизнес", "Корпоративно", "Ултимейт", "Студентско", "Академично", "За разработчици", "Стартер", "Есеншъл", "Премиум", "Платинум"]'::jsonb,
'Select edition', 'Изберете издание', 19),

-- 20. Developer/Publisher
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Developer/Publisher', 'Разработчик/Издател', 'text', false, true,
null, null,
'e.g., Microsoft, Adobe, Autodesk', 'напр. Microsoft, Adobe, Autodesk', 20),

-- 21. Brand
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Brand', 'Марка', 'text', false, true,
null, null,
'Software brand name', 'Име на марката', 21),

-- 22. Language Support
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Language Support', 'Езикова поддръжка', 'multiselect', false, true,
'["English", "Bulgarian", "German", "French", "Spanish", "Italian", "Russian", "Chinese", "Japanese", "Korean", "Portuguese", "Polish", "Turkish", "Multilingual"]'::jsonb,
'["Английски", "Български", "Немски", "Френски", "Испански", "Италиански", "Руски", "Китайски", "Японски", "Корейски", "Португалски", "Полски", "Турски", "Многоезичен"]'::jsonb,
'Select supported languages', 'Изберете поддържани езици', 22),

-- 23. Bulgarian Interface
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Bulgarian Interface', 'Български интерфейс', 'select', false, true,
'["Full Bulgarian", "Partial Bulgarian", "English Only", "Language Pack Available"]'::jsonb,
'["Пълен български", "Частичен български", "Само английски", "Наличен езиков пакет"]'::jsonb,
'Bulgarian interface availability', 'Наличност на български интерфейс', 23),

-- 24. Download Size
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Download Size', 'Размер за изтегляне', 'text', false, false,
null, null,
'e.g., 500 MB, 2.5 GB', 'напр. 500 MB, 2.5 GB', 24),

-- 25. Product Code/SKU
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Product Code/SKU', 'Продуктов код/SKU', 'text', false, false,
null, null,
'Manufacturer product code', 'Продуктов код на производителя', 25),

-- =====================================================
-- DELIVERY & SUPPORT ATTRIBUTES
-- =====================================================

-- 26. Delivery Method
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Delivery Method', 'Метод на доставка', 'select', true, true,
'["Digital Download", "License Key Only", "Physical DVD/USB", "Cloud Access", "Instant Email Delivery", "Download Link", "Account Credentials", "Mixed (Physical + Digital)"]'::jsonb,
'["Дигитално изтегляне", "Само лицензен ключ", "Физически DVD/USB", "Облачен достъп", "Незабавна имейл доставка", "Линк за изтегляне", "Данни за акаунт", "Смесен (Физически + Дигитален)"]'::jsonb,
'Select delivery method', 'Изберете метод на доставка', 26),

-- 27. Support Level
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Support Level', 'Ниво на поддръжка', 'select', false, true,
'["Community Only", "Email Support", "Phone Support", "Live Chat", "24/7 Support", "Priority Support", "Dedicated Account Manager", "No Support"]'::jsonb,
'["Само общност", "Имейл поддръжка", "Телефонна поддръжка", "Жив чат", "24/7 поддръжка", "Приоритетна поддръжка", "Личен мениджър", "Без поддръжка"]'::jsonb,
'Select support level', 'Изберете ниво на поддръжка', 27),

-- 28. Update Policy
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Update Policy', 'Политика за актуализации', 'select', false, true,
'["Free Lifetime Updates", "Free Updates for 1 Year", "Free Updates for Subscription", "Major Updates Paid", "No Updates", "Automatic Updates", "Manual Updates Only"]'::jsonb,
'["Безплатни доживотни актуализации", "Безплатни актуализации 1 година", "Безплатни при абонамент", "Платени големи актуализации", "Без актуализации", "Автоматични актуализации", "Само ръчни актуализации"]'::jsonb,
'Select update policy', 'Изберете политика за актуализации', 28),

-- 29. Documentation
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Documentation', 'Документация', 'multiselect', false, false,
'["Online Help", "PDF Manual", "Video Tutorials", "Knowledge Base", "Forum Support", "In-App Help", "Quick Start Guide", "API Documentation"]'::jsonb,
'["Онлайн помощ", "PDF ръководство", "Видео уроци", "Знание база", "Форум поддръжка", "Вградена помощ", "Бързо ръководство", "API документация"]'::jsonb,
'Select available documentation', 'Изберете налична документация', 29),

-- 30. Warranty/Guarantee
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Warranty/Guarantee', 'Гаранция', 'select', false, true,
'["30-Day Money Back", "60-Day Money Back", "90-Day Money Back", "No Refunds", "Satisfaction Guarantee", "As-Is (No Warranty)"]'::jsonb,
'["30 дни връщане", "60 дни връщане", "90 дни връщане", "Без възстановяване", "Гаранция за удовлетворение", "Без гаранция"]'::jsonb,
'Select warranty/guarantee', 'Изберете гаранция', 30),

-- 31. Technical Support Duration
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Technical Support Duration', 'Продължителност на техн. поддръжка', 'select', false, true,
'["90 Days", "1 Year", "2 Years", "3 Years", "Subscription Duration", "Lifetime", "None"]'::jsonb,
'["90 дни", "1 година", "2 години", "3 години", "Срок на абонамента", "Доживотна", "Няма"]'::jsonb,
'Select support duration', 'Изберете продължителност на поддръжка', 31);
;
