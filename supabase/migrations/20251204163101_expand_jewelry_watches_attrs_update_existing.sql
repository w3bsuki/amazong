
-- ==============================================
-- JEWELRY & WATCHES ATTRIBUTES - Update Existing + Add New
-- Date: December 4, 2025
-- ==============================================

-- Update existing Metal Type with enhanced options
UPDATE category_attributes 
SET options = '["Gold 24K (999)", "Gold 22K (916)", "Gold 18K (750)", "Gold 14K (585)", "Gold 10K (417)", "Gold 9K (375)", "White Gold", "Rose Gold", "Platinum 950", "Platinum 900", "Sterling Silver 925", "Silver 800", "Stainless Steel", "Titanium", "Tungsten", "Palladium", "Vermeil", "Gold Filled", "Gold Plated", "Rhodium Plated", "Brass", "Copper", "Bronze", "Mixed Metals", "Other"]'::jsonb,
    options_bg = '["Злато 24К (999)", "Злато 22К (916)", "Злато 18К (750)", "Злато 14К (585)", "Злато 10К (417)", "Злато 9К (375)", "Бяло злато", "Розово злато", "Платина 950", "Платина 900", "Сребро 925", "Сребро 800", "Неръждаема стомана", "Титан", "Волфрам", "Паладий", "Вермейл", "Голд филд", "Позлата", "Родиево покритие", "Месинг", "Мед", "Бронз", "Комбинирани метали", "Друго"]'::jsonb,
    sort_order = 1
WHERE id = '2766f548-6c63-43e5-8d49-afdc84261883';

-- Update Gemstone with enhanced options
UPDATE category_attributes 
SET name = 'Main Stone',
    name_bg = 'Основен камък',
    options = '["Diamond", "Ruby", "Sapphire", "Emerald", "Opal", "Pearl", "Amethyst", "Topaz", "Aquamarine", "Garnet", "Tourmaline", "Tanzanite", "Peridot", "Citrine", "Turquoise", "Morganite", "Alexandrite", "Spinel", "Moissanite", "Cubic Zirconia", "Crystal", "Lab-Created Diamond", "Lab-Created Sapphire", "Lab-Created Ruby", "Lab-Created Emerald", "None", "Other"]'::jsonb,
    options_bg = '["Диамант", "Рубин", "Сапфир", "Изумруд", "Опал", "Перла", "Аметист", "Топаз", "Аквамарин", "Гранат", "Турмалин", "Танзанит", "Перидот", "Цитрин", "Тюркоаз", "Морганит", "Александрит", "Шпинел", "Моасанит", "Цирконий", "Кристал", "Лабораторен диамант", "Лабораторен сапфир", "Лабораторен рубин", "Лабораторен изумруд", "Без камък", "Друго"]'::jsonb,
    sort_order = 2
WHERE id = '0a71435c-85fe-4ad4-807c-4aa9f787e4ad';

-- Update Ring Size with EU sizes
UPDATE category_attributes 
SET name = 'Ring Size EU',
    name_bg = 'Размер пръстен (EU)',
    options = '["44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75"]'::jsonb,
    sort_order = 20
WHERE id = '4423850a-ac6e-43d8-a2d8-e1fb9f072897';

-- Update Watch Movement with enhanced options
UPDATE category_attributes 
SET options = '["Automatic (Self-Winding)", "Manual/Hand-Wound", "Quartz", "Solar/Eco-Drive", "Kinetic", "Spring Drive", "Tourbillon", "Mechanical", "Hybrid Smart", "Digital"]'::jsonb,
    options_bg = '["Автоматичен", "Ръчно навиване", "Кварц", "Соларен/Еко-драйв", "Кинетичен", "Спринг драйв", "Турбийон", "Механичен", "Хибриден смарт", "Дигитален"]'::jsonb,
    sort_order = 30
WHERE id = '1e15f509-fd15-4042-9ee3-d795d321d69d';

-- Update Watch Type with enhanced options
UPDATE category_attributes 
SET options = '["Dress/Formal", "Sport", "Dive/Diver", "Chronograph", "Pilot/Aviation", "Field/Military", "Racing/Motorsport", "GMT/World Time", "Skeleton", "Luxury/Collector", "Fashion", "Smart Watch", "Hybrid Smart", "Digital", "Pocket Watch", "Nurse/Medical", "Vintage/Antique"]'::jsonb,
    options_bg = '["Официален", "Спортен", "За гмуркане", "Хронограф", "Пилотски", "Военен", "За състезания", "GMT/Световно време", "Скелетон", "Луксозен/Колекционерски", "Моден", "Смарт часовник", "Хибриден смарт", "Дигитален", "Джобен", "Медицински", "Винтидж/Антикварен"]'::jsonb,
    sort_order = 31
WHERE id = '3ad9c9a1-14e9-4fec-9de2-f0e70d929343';

-- Update Water Resistant with enhanced options
UPDATE category_attributes 
SET name = 'Water Resistance',
    name_bg = 'Водоустойчивост',
    options = '["Not Water Resistant", "Water Resistant (Basic)", "3 ATM (30m)", "5 ATM (50m)", "10 ATM (100m)", "20 ATM (200m)", "30 ATM (300m)", "50+ ATM (500m+)", "Diver Certified (ISO 6425)"]'::jsonb,
    options_bg = '["Не е водоустойчив", "Водоустойчив (базов)", "3 ATM (30м)", "5 ATM (50м)", "10 ATM (100м)", "20 ATM (200м)", "30 ATM (300м)", "50+ ATM (500м+)", "Сертифициран за гмуркане (ISO 6425)"]'::jsonb,
    sort_order = 35
WHERE id = '40ef136b-436e-4a9e-9ff1-a276dd60aabe';

-- Update Jewelry Type 
UPDATE category_attributes 
SET options = '["Ring", "Necklace", "Pendant", "Bracelet", "Bangle", "Earrings", "Watch", "Brooch", "Pin", "Anklet", "Body Jewelry", "Hair Jewelry", "Cufflinks", "Tie Accessories", "Set", "Other"]'::jsonb,
    options_bg = '["Пръстен", "Колие", "Медальон", "Гривна", "Бангъл", "Обеци", "Часовник", "Брошка", "Пин", "Глезенно бижу", "Бижу за тяло", "Бижу за коса", "Ръкавели", "Аксесоари за вратовръзка", "Комплект", "Друго"]'::jsonb,
    sort_order = 3
WHERE id = 'b7c09c03-cbab-4172-93ac-92fe30fcecc9';
;
