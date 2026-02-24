-- =====================================================
-- SOFTWARE CATEGORY ATTRIBUTES - Phase 4 (Part 4)
-- AI-Specific, Gaming, and Additional Attributes
-- =====================================================

INSERT INTO category_attributes (
  id, category_id, name, name_bg, attribute_type, is_required, is_filterable, 
  options, options_bg, placeholder, placeholder_bg, sort_order
) VALUES

-- =====================================================
-- AI-SPECIFIC ATTRIBUTES (Key for AI marketplace!)
-- =====================================================

-- 46. AI-Generated
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'AI-Generated', 'Генерирано от AI', 'select', false, true,
'["Not AI Generated", "Partially AI Generated", "Fully AI Generated", "AI-Assisted Creation", "AI Model/Training Data"]'::jsonb,
'["Не е генерирано от AI", "Частично AI генерирано", "Напълно AI генерирано", "Създадено с AI помощ", "AI модел/Данни за обучение"]'::jsonb,
'AI generation status', 'Статус на AI генериране', 46),

-- 47. AI Technology Used
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'AI Technology Used', 'Използвана AI технология', 'multiselect', false, true,
'["GPT-4", "GPT-3.5", "Claude", "Gemini", "DALL-E", "Midjourney", "Stable Diffusion", "LLaMA", "Custom AI Model", "Machine Learning", "Deep Learning", "Neural Networks", "Computer Vision", "NLP", "Not Applicable"]'::jsonb,
'["GPT-4", "GPT-3.5", "Claude", "Gemini", "DALL-E", "Midjourney", "Stable Diffusion", "LLaMA", "Персонализиран AI модел", "Машинно обучение", "Дълбоко обучение", "Невронни мрежи", "Компютърно зрение", "NLP", "Не е приложимо"]'::jsonb,
'Select AI technologies', 'Изберете AI технологии', 47),

-- 48. AI Features Included
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'AI Features Included', 'Включени AI функции', 'multiselect', false, true,
'["AI Chat/Assistant", "AI Image Generation", "AI Writing", "AI Code Completion", "AI Translation", "AI Voice/Speech", "AI Video Generation", "AI Music Generation", "AI Upscaling", "AI Background Removal", "AI Object Detection", "AI Analytics", "AI Recommendations", "No AI Features"]'::jsonb,
'["AI чат/Асистент", "AI генериране на изображения", "AI писане", "AI код завършване", "AI превод", "AI глас/Реч", "AI видео генериране", "AI музика генериране", "AI уголемяване", "AI премахване на фон", "AI откриване на обекти", "AI анализи", "AI препоръки", "Без AI функции"]'::jsonb,
'Select AI features', 'Изберете AI функции', 48),

-- 49. AI Credits/Usage
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'AI Credits/Usage', 'AI кредити/Употреба', 'select', false, true,
'["Unlimited AI Usage", "Monthly Credits Included", "Pay Per Use", "Limited Free Tier", "Credits Sold Separately", "Not Applicable"]'::jsonb,
'["Неограничена AI употреба", "Месечни кредити включени", "Плащане при употреба", "Ограничен безплатен план", "Кредити се продават отделно", "Не е приложимо"]'::jsonb,
'AI usage model', 'Модел на AI употреба', 49),

-- =====================================================
-- GAMING-SPECIFIC ATTRIBUTES
-- =====================================================

-- 50. Game Genre
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Game Genre', 'Жанр на играта', 'multiselect', false, true,
'["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle", "Horror", "Shooter", "Fighting", "Platformer", "Open World", "Survival", "MMO", "Indie", "Casual", "VR", "Battle Royale", "Card Game"]'::jsonb,
'["Екшън", "Приключенска", "RPG", "Стратегия", "Симулация", "Спортна", "Състезателна", "Пъзел", "Хорър", "Шутър", "Бойна", "Платформър", "Отворен свят", "Оцеляване", "MMO", "Инди", "Казуална", "VR", "Battle Royale", "Карти"]'::jsonb,
'Select game genres', 'Изберете жанрове', 50),

-- 51. Game Platform
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Game Platform', 'Платформа за игри', 'multiselect', false, true,
'["Steam", "Epic Games Store", "GOG", "Origin/EA App", "Ubisoft Connect", "Battle.net", "Xbox/Microsoft Store", "PlayStation Store", "Nintendo eShop", "Standalone", "Web Browser"]'::jsonb,
'["Steam", "Epic Games Store", "GOG", "Origin/EA App", "Ubisoft Connect", "Battle.net", "Xbox/Microsoft Store", "PlayStation Store", "Nintendo eShop", "Самостоятелен", "Уеб браузър"]'::jsonb,
'Select game platforms', 'Изберете платформи за игри', 51),

-- 52. Multiplayer
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Multiplayer', 'Мултиплейър', 'select', false, true,
'["Single Player Only", "Local Co-op", "Online Co-op", "Online Competitive", "MMO", "Split Screen", "Cross-Platform Play"]'::jsonb,
'["Само сингъл плейър", "Локален кооп", "Онлайн кооп", "Онлайн състезателен", "MMO", "Сплит скрийн", "Крос-платформено играене"]'::jsonb,
'Multiplayer mode', 'Режим мултиплейър', 52),

-- 53. Game Age Rating
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Game Age Rating', 'Възрастова оценка', 'select', false, true,
'["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18", "ESRB E", "ESRB E10+", "ESRB T", "ESRB M", "ESRB AO", "Not Rated"]'::jsonb,
'["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18", "ESRB E", "ESRB E10+", "ESRB T", "ESRB M", "ESRB AO", "Без рейтинг"]'::jsonb,
'Game age rating', 'Възрастова оценка на играта', 53),

-- 54. DRM
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'DRM', 'DRM защита', 'select', false, true,
'["DRM-Free", "Steam DRM", "Denuvo", "Origin DRM", "Ubisoft DRM", "Epic Games DRM", "Microsoft DRM", "Other DRM"]'::jsonb,
'["Без DRM", "Steam DRM", "Denuvo", "Origin DRM", "Ubisoft DRM", "Epic Games DRM", "Microsoft DRM", "Друг DRM"]'::jsonb,
'DRM protection', 'DRM защита', 54),

-- =====================================================
-- ADDITIONAL ATTRIBUTES
-- =====================================================

-- 55. Trial Available
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Trial Available', 'Пробен период', 'select', false, true,
'["Yes - 7 Days", "Yes - 14 Days", "Yes - 30 Days", "Yes - Limited Features", "Demo Available", "Free Tier Available", "No Trial"]'::jsonb,
'["Да - 7 дни", "Да - 14 дни", "Да - 30 дни", "Да - Ограничени функции", "Демо налично", "Безплатен план", "Без пробен период"]'::jsonb,
'Trial availability', 'Наличност на пробен период', 55),

-- 56. Upgrade Path
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Upgrade Path', 'Път за надграждане', 'select', false, false,
'["Upgrade Available", "Competitive Upgrade", "Cross-Grade Available", "No Upgrades", "Subscription Auto-Upgrades"]'::jsonb,
'["Надграждане налично", "Конкурентно надграждане", "Крос-грейд наличен", "Без надграждане", "Авто-надграждане при абонамент"]'::jsonb,
'Upgrade path options', 'Опции за надграждане', 56),

-- 57. Training/Certification
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Training/Certification', 'Обучение/Сертификация', 'multiselect', false, false,
'["Free Online Courses", "Paid Courses", "Official Certification", "YouTube Tutorials", "Community Resources", "None Available"]'::jsonb,
'["Безплатни онлайн курсове", "Платени курсове", "Официална сертификация", "YouTube уроци", "Ресурси от общността", "Няма налични"]'::jsonb,
'Training options', 'Опции за обучение', 57),

-- 58. Condition
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Condition', 'Състояние', 'select', true, true,
'["New - Unused Key", "New - Sealed Physical", "Used - Working Key", "Used - Previously Activated", "Bundle Key", "Promotional Key"]'::jsonb,
'["Нов - Неизползван ключ", "Нов - Запечатан физически", "Употребяван - Работещ ключ", "Употребяван - Вече активиран", "Бъндъл ключ", "Промоционален ключ"]'::jsonb,
'Select product condition', 'Изберете състояние на продукта', 58),

-- 59. Source/Origin
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Source/Origin', 'Произход', 'select', false, true,
'["Official Retailer", "Authorized Reseller", "Key Reseller", "Bundle/Humble", "Giveaway", "Developer Direct", "Unknown"]'::jsonb,
'["Официален търговец", "Оторизиран дистрибутор", "Препродавач на ключове", "Бъндъл/Humble", "Подарък", "Директно от разработчик", "Неизвестен"]'::jsonb,
'Source of the license', 'Източник на лиценза', 59),

-- 60. Transferable
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Transferable', 'Прехвърляем', 'select', false, true,
'["Yes - Fully Transferable", "Yes - One Transfer", "No - Non-Transferable", "Account Bound", "Hardware Bound"]'::jsonb,
'["Да - Напълно прехвърляем", "Да - Еднократно прехвърляне", "Не - Непрехвърляем", "Свързан с акаунт", "Свързан с хардуер"]'::jsonb,
'License transferability', 'Прехвърляемост на лиценза', 60);
;
