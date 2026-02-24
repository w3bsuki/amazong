-- =====================================================
-- SOFTWARE CATEGORY ATTRIBUTES - Phase 4 (Part 5 - Final)
-- Content Creator, Education, Business Specific Attributes
-- =====================================================

INSERT INTO category_attributes (
  id, category_id, name, name_bg, attribute_type, is_required, is_filterable, 
  options, options_bg, placeholder, placeholder_bg, sort_order
) VALUES

-- =====================================================
-- CONTENT CREATOR & PROFESSIONAL ATTRIBUTES
-- =====================================================

-- 61. Export Formats
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Export Formats', 'Формати за експорт', 'multiselect', false, false,
'["PDF", "DOCX", "XLSX", "PPTX", "PNG", "JPG", "SVG", "PSD", "AI", "EPS", "MP4", "MOV", "MP3", "WAV", "HTML", "CSS", "JSON", "XML", "CSV"]'::jsonb,
'["PDF", "DOCX", "XLSX", "PPTX", "PNG", "JPG", "SVG", "PSD", "AI", "EPS", "MP4", "MOV", "MP3", "WAV", "HTML", "CSS", "JSON", "XML", "CSV"]'::jsonb,
'Select export formats', 'Изберете формати за експорт', 61),

-- 62. Import Formats
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Import Formats', 'Формати за импорт', 'multiselect', false, false,
'["PDF", "DOCX", "XLSX", "PPTX", "PNG", "JPG", "RAW", "PSD", "AI", "EPS", "MP4", "MOV", "MP3", "WAV", "HTML", "JSON", "XML", "CSV"]'::jsonb,
'["PDF", "DOCX", "XLSX", "PPTX", "PNG", "JPG", "RAW", "PSD", "AI", "EPS", "MP4", "MOV", "MP3", "WAV", "HTML", "JSON", "XML", "CSV"]'::jsonb,
'Select import formats', 'Изберете формати за импорт', 62),

-- 63. Color Space Support
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Color Space Support', 'Поддръжка на цветови пространства', 'multiselect', false, false,
'["sRGB", "Adobe RGB", "ProPhoto RGB", "CMYK", "Lab Color", "Display P3", "Rec. 709", "Rec. 2020", "DCI-P3"]'::jsonb,
'["sRGB", "Adobe RGB", "ProPhoto RGB", "CMYK", "Lab Color", "Display P3", "Rec. 709", "Rec. 2020", "DCI-P3"]'::jsonb,
'Color space support', 'Поддръжка на цветови пространства', 63),

-- 64. Video Resolution Support
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Video Resolution Support', 'Поддържана видео резолюция', 'multiselect', false, true,
'["720p HD", "1080p Full HD", "2K", "4K UHD", "6K", "8K", "16K", "Custom Resolutions"]'::jsonb,
'["720p HD", "1080p Full HD", "2K", "4K UHD", "6K", "8K", "16K", "Персонализирани резолюции"]'::jsonb,
'Supported video resolutions', 'Поддържани видео резолюции', 64),

-- =====================================================
-- EDUCATION SPECIFIC ATTRIBUTES
-- =====================================================

-- 65. Target Audience
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Target Audience', 'Целева аудитория', 'multiselect', false, true,
'["Beginners", "Intermediate", "Advanced", "Professionals", "Students", "Kids (3-6)", "Kids (7-12)", "Teens", "Seniors", "Business Users", "Developers", "Designers", "Everyone"]'::jsonb,
'["Начинаещи", "Средно ниво", "Напреднали", "Професионалисти", "Студенти", "Деца (3-6)", "Деца (7-12)", "Тийнейджъри", "Възрастни", "Бизнес потребители", "Разработчици", "Дизайнери", "Всички"]'::jsonb,
'Select target audience', 'Изберете целева аудитория', 65),

-- 66. Difficulty Level
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Difficulty Level', 'Ниво на трудност', 'select', false, true,
'["Very Easy", "Easy", "Moderate", "Difficult", "Very Difficult", "Expert Only"]'::jsonb,
'["Много лесно", "Лесно", "Умерено", "Трудно", "Много трудно", "Само за експерти"]'::jsonb,
'Select difficulty level', 'Изберете ниво на трудност', 66),

-- 67. Learning Hours
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Learning Hours', 'Часове обучение', 'select', false, true,
'["< 1 hour", "1-5 hours", "5-10 hours", "10-20 hours", "20-50 hours", "50-100 hours", "100+ hours", "Self-paced"]'::jsonb,
'["< 1 час", "1-5 часа", "5-10 часа", "10-20 часа", "20-50 часа", "50-100 часа", "100+ часа", "Собствено темпо"]'::jsonb,
'Estimated learning time', 'Приблизително време за обучение', 67),

-- 68. Certificate Included
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Certificate Included', 'Сертификат включен', 'select', false, true,
'["Yes - Accredited Certificate", "Yes - Completion Certificate", "Yes - Professional Certificate", "No Certificate", "Certificate Extra Cost"]'::jsonb,
'["Да - Акредитиран сертификат", "Да - Сертификат за завършване", "Да - Професионален сертификат", "Без сертификат", "Сертификат срещу доплащане"]'::jsonb,
'Certificate availability', 'Наличност на сертификат', 68),

-- =====================================================
-- BUSINESS SPECIFIC ATTRIBUTES
-- =====================================================

-- 69. Industry Focus
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Industry Focus', 'Индустриален фокус', 'multiselect', false, true,
'["General Business", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Technology", "Legal", "Real Estate", "Marketing", "Construction", "Hospitality", "Non-Profit"]'::jsonb,
'["Общ бизнес", "Здравеопазване", "Финанси", "Образование", "Търговия", "Производство", "Технологии", "Право", "Недвижими имоти", "Маркетинг", "Строителство", "Хотелиерство", "Неправителствен сектор"]'::jsonb,
'Select industry focus', 'Изберете индустриален фокус', 69),

-- 70. Compliance Standards
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Compliance Standards', 'Стандарти за съответствие', 'multiselect', false, true,
'["GDPR", "HIPAA", "SOC 2", "ISO 27001", "PCI DSS", "CCPA", "FERPA", "FedRAMP", "NIST", "None Specified"]'::jsonb,
'["GDPR", "HIPAA", "SOC 2", "ISO 27001", "PCI DSS", "CCPA", "FERPA", "FedRAMP", "NIST", "Не е уточнено"]'::jsonb,
'Compliance certifications', 'Сертификати за съответствие', 70),

-- 71. User Capacity
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'User Capacity', 'Капацитет потребители', 'select', false, true,
'["1-5 users", "5-10 users", "10-25 users", "25-50 users", "50-100 users", "100-500 users", "500-1000 users", "1000+ users", "Unlimited"]'::jsonb,
'["1-5 потребители", "5-10 потребители", "10-25 потребители", "25-50 потребители", "50-100 потребители", "100-500 потребители", "500-1000 потребители", "1000+ потребители", "Неограничен"]'::jsonb,
'Select user capacity', 'Изберете капацитет потребители', 71),

-- 72. Storage Included
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Storage Included', 'Включено пространство', 'select', false, true,
'["1 GB", "5 GB", "10 GB", "50 GB", "100 GB", "500 GB", "1 TB", "2 TB", "5 TB", "Unlimited", "No Storage", "Local Only"]'::jsonb,
'["1 GB", "5 GB", "10 GB", "50 GB", "100 GB", "500 GB", "1 TB", "2 TB", "5 TB", "Неограничено", "Без пространство", "Само локално"]'::jsonb,
'Included cloud storage', 'Включено облачно пространство', 72),

-- 73. White Label Available
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'White Label Available', 'White Label наличен', 'select', false, true,
'["Yes - Full White Label", "Yes - Partial Branding", "Enterprise Only", "Not Available"]'::jsonb,
'["Да - Пълен White Label", "Да - Частичен брандинг", "Само за корпоративни", "Не е наличен"]'::jsonb,
'White label options', 'White Label опции', 73),

-- 74. Data Export
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Data Export', 'Експорт на данни', 'select', false, false,
'["Full Data Export", "Limited Export", "API Export Only", "No Export", "Export on Request"]'::jsonb,
'["Пълен експорт на данни", "Ограничен експорт", "Само API експорт", "Без експорт", "Експорт при поискване"]'::jsonb,
'Data export capabilities', 'Възможности за експорт на данни', 74),

-- 75. Backup Frequency
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Backup Frequency', 'Честота на архивиране', 'select', false, false,
'["Real-time", "Hourly", "Daily", "Weekly", "Monthly", "Manual Only", "Not Applicable"]'::jsonb,
'["В реално време", "На час", "Дневно", "Седмично", "Месечно", "Само ръчно", "Не е приложимо"]'::jsonb,
'Backup frequency', 'Честота на архивиране', 75);
;
