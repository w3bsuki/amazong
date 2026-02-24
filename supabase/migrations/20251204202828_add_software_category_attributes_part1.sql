-- =====================================================
-- SOFTWARE CATEGORY ATTRIBUTES - Phase 4 (Part 1)
-- License, Pricing & Platform Attributes
-- =====================================================

INSERT INTO category_attributes (
  id, category_id, name, name_bg, attribute_type, is_required, is_filterable, 
  options, options_bg, placeholder, placeholder_bg, sort_order
) VALUES

-- =====================================================
-- LICENSE & PRICING ATTRIBUTES
-- =====================================================

-- 1. License Type
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d', 
'License Type', 'Тип лиценз', 'select', true, true,
'["Perpetual License", "Subscription", "Freemium", "Open Source", "Trial/Demo", "OEM License", "Volume License", "Educational License", "NFR (Not For Resale)", "Site License"]'::jsonb,
'["Постоянен лиценз", "Абонамент", "Безплатна версия", "Отворен код", "Пробна версия", "OEM лиценз", "Обемен лиценз", "Образователен лиценз", "NFR (Не за продажба)", "Лиценз за сайт"]'::jsonb,
'Select license type', 'Изберете тип лиценз', 1),

-- 2. Subscription Period
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Subscription Period', 'Период на абонамент', 'select', false, true,
'["Monthly", "Quarterly", "6 Months", "Annual", "2 Years", "3 Years", "Lifetime", "One-time Purchase"]'::jsonb,
'["Месечен", "Тримесечен", "6 месеца", "Годишен", "2 години", "3 години", "Доживотен", "Еднократна покупка"]'::jsonb,
'Select subscription period', 'Изберете период на абонамент', 2),

-- 3. License Seats
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'License Seats', 'Брой лицензи', 'select', true, true,
'["Single User (1 PC)", "Single User (3 PCs)", "Single User (5 PCs)", "Family (Up to 6 users)", "Small Team (Up to 10)", "Business (Up to 25)", "Enterprise (Up to 100)", "Unlimited Users", "Per Seat"]'::jsonb,
'["Един потребител (1 PC)", "Един потребител (3 PC)", "Един потребител (5 PC)", "Семеен (до 6 потребители)", "Малък екип (до 10)", "Бизнес (до 25)", "Корпоративен (до 100)", "Неограничен брой", "На потребител"]'::jsonb,
'Select number of seats', 'Изберете брой лицензи', 3),

-- 4. Activation Method
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Activation Method', 'Метод на активиране', 'select', false, true,
'["License Key", "Online Account", "Hardware Dongle", "Phone Activation", "Email Activation", "Auto-Activation", "Offline Activation Available", "No Activation Required"]'::jsonb,
'["Лицензен ключ", "Онлайн акаунт", "Хардуерен донгъл", "Телефонно активиране", "Имейл активиране", "Автоматично активиране", "Офлайн активиране", "Без активиране"]'::jsonb,
'Select activation method', 'Изберете метод на активиране', 4),

-- 5. Price
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Price', 'Цена', 'number', true, true,
null, null,
'Enter price in BGN', 'Въведете цена в лева', 5),

-- 6. Original Price
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Original Price', 'Оригинална цена', 'number', false, false,
null, null,
'Original price before discount', 'Оригинална цена преди отстъпка', 6),

-- 7. Discount Percentage
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Discount Percentage', 'Процент отстъпка', 'number', false, true,
null, null,
'Enter discount percentage', 'Въведете процент отстъпка', 7),

-- =====================================================
-- PLATFORM & COMPATIBILITY ATTRIBUTES
-- =====================================================

-- 8. Platform
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Platform', 'Платформа', 'multiselect', true, true,
'["Windows", "macOS", "Linux", "iOS", "Android", "Web Browser", "Chrome OS", "Cross-Platform", "Universal"]'::jsonb,
'["Windows", "macOS", "Linux", "iOS", "Android", "Уеб браузър", "Chrome OS", "Кросплатформен", "Универсален"]'::jsonb,
'Select supported platforms', 'Изберете поддържани платформи', 8),

-- 9. Windows Versions
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Windows Versions', 'Версии на Windows', 'multiselect', false, true,
'["Windows 11", "Windows 10", "Windows 8.1", "Windows 7", "Windows Server 2022", "Windows Server 2019", "Windows Server 2016"]'::jsonb,
'["Windows 11", "Windows 10", "Windows 8.1", "Windows 7", "Windows Server 2022", "Windows Server 2019", "Windows Server 2016"]'::jsonb,
'Select Windows versions', 'Изберете версии на Windows', 9),

-- 10. macOS Versions
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'macOS Versions', 'Версии на macOS', 'multiselect', false, true,
'["macOS Sequoia (15)", "macOS Sonoma (14)", "macOS Ventura (13)", "macOS Monterey (12)", "macOS Big Sur (11)", "macOS Catalina (10.15)"]'::jsonb,
'["macOS Sequoia (15)", "macOS Sonoma (14)", "macOS Ventura (13)", "macOS Monterey (12)", "macOS Big Sur (11)", "macOS Catalina (10.15)"]'::jsonb,
'Select macOS versions', 'Изберете версии на macOS', 10),

-- 11. Architecture
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Architecture', 'Архитектура', 'multiselect', false, true,
'["64-bit (x64)", "32-bit (x86)", "ARM64", "Apple Silicon (M1/M2/M3)", "Universal Binary"]'::jsonb,
'["64-битова (x64)", "32-битова (x86)", "ARM64", "Apple Silicon (M1/M2/M3)", "Универсален бинарен"]'::jsonb,
'Select supported architectures', 'Изберете поддържани архитектури', 11),

-- 12. Minimum RAM
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Minimum RAM', 'Минимална RAM', 'select', false, true,
'["1 GB", "2 GB", "4 GB", "8 GB", "16 GB", "32 GB", "64 GB"]'::jsonb,
'["1 GB", "2 GB", "4 GB", "8 GB", "16 GB", "32 GB", "64 GB"]'::jsonb,
'Select minimum RAM', 'Изберете минимална RAM', 12),

-- 13. Minimum Storage
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Minimum Storage', 'Минимално дисково пространство', 'select', false, true,
'["100 MB", "500 MB", "1 GB", "2 GB", "5 GB", "10 GB", "20 GB", "50 GB", "100 GB+"]'::jsonb,
'["100 MB", "500 MB", "1 GB", "2 GB", "5 GB", "10 GB", "20 GB", "50 GB", "100 GB+"]'::jsonb,
'Select minimum storage', 'Изберете минимално пространство', 13),

-- 14. GPU Required
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'GPU Required', 'Изисква се GPU', 'select', false, true,
'["No GPU Required", "Integrated Graphics OK", "Dedicated GPU Recommended", "NVIDIA GPU Required", "AMD GPU Required", "CUDA Required", "OpenCL Required", "Metal Required (Mac)"]'::jsonb,
'["Не се изисква GPU", "Интегрирана графика ОК", "Препоръчва се дискретен GPU", "Изисква се NVIDIA GPU", "Изисква се AMD GPU", "Изисква се CUDA", "Изисква се OpenCL", "Изисква се Metal (Mac)"]'::jsonb,
'Select GPU requirements', 'Изберете изисквания за GPU', 14),

-- 15. Browser Compatibility
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Browser Compatibility', 'Съвместимост с браузъри', 'multiselect', false, true,
'["Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Safari", "Opera", "Brave", "All Modern Browsers"]'::jsonb,
'["Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Safari", "Opera", "Brave", "Всички модерни браузъри"]'::jsonb,
'Select compatible browsers', 'Изберете съвместими браузъри', 15),

-- 16. Internet Required
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Internet Required', 'Изисква се интернет', 'select', false, true,
'["No Internet Required", "Internet Required for Activation", "Internet Required for Updates", "Always Online Required", "Partial Offline Mode", "Full Offline Mode Available"]'::jsonb,
'["Не се изисква интернет", "Интернет за активиране", "Интернет за актуализации", "Винаги онлайн", "Частичен офлайн режим", "Пълен офлайн режим"]'::jsonb,
'Select internet requirements', 'Изберете изисквания за интернет', 16);
;
