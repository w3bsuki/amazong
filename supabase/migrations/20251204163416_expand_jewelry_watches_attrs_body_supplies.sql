
-- ==============================================
-- JEWELRY & WATCHES - BODY JEWELRY & SUPPLIES ATTRIBUTES
-- Date: December 4, 2025
-- ==============================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
    -- Body Jewelry Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Body Jewelry Type', 'Тип бижу за тяло', 'select', false, true,
     '["Nose Ring/Stud", "Belly Button Ring", "Tongue Ring", "Lip Ring/Labret", "Eyebrow Ring", "Septum Ring", "Nipple Ring", "Dermal Anchor", "Industrial Barbell", "Toe Ring", "Anklet", "Body Chain", "Waist Chain", "Other"]'::jsonb,
     '["Пиърсинг за нос", "Пиърсинг за пъп", "Пиърсинг за език", "Пиърсинг за устна", "Пиърсинг за вежда", "Септум", "Пиърсинг за зърно", "Дермален анкер", "Индустриална щанга", "Пръстен за крак", "Гривна за глезен", "Верижка за тяло", "Верижка за талия", "Друго"]'::jsonb, 56),
     
    -- Body Jewelry Gauge
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Gauge Size', 'Размер на гейджа', 'select', false, true,
     '["20G (0.8mm)", "18G (1.0mm)", "16G (1.2mm)", "14G (1.6mm)", "12G (2.0mm)", "10G (2.4mm)", "8G (3.2mm)", "6G (4.0mm)", "4G (5.0mm)", "2G (6.0mm)", "0G (8.0mm)", "00G (10.0mm)"]'::jsonb,
     '["20G (0.8мм)", "18G (1.0мм)", "16G (1.2мм)", "14G (1.6мм)", "12G (2.0мм)", "10G (2.4мм)", "8G (3.2мм)", "6G (4.0мм)", "4G (5.0мм)", "2G (6.0мм)", "0G (8.0мм)", "00G (10.0мм)"]'::jsonb, 57),
     
    -- Supplies Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Supplies Type', 'Тип консумативи', 'select', false, true,
     '["Beads", "Findings", "Clasps", "Jump Rings", "Earring Components", "Chain by Length", "Wire", "Cord/String", "Tools", "Storage/Display", "Cleaning Supplies", "Packaging", "Other"]'::jsonb,
     '["Мъниста", "Фурнитура", "Закопчалки", "Халки", "Компоненти за обеци", "Верижка на метраж", "Тел", "Шнур", "Инструменти", "Съхранение/Дисплей", "Почистващи", "Опаковки", "Друго"]'::jsonb, 58),
     
    -- Bead Material
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Bead Material', 'Материал на мънистата', 'select', false, true,
     '["Glass", "Crystal", "Gemstone", "Pearl", "Metal", "Wood", "Ceramic", "Polymer Clay", "Lampwork", "Seed Bead", "Acrylic", "Bone/Horn", "Shell", "Other"]'::jsonb,
     '["Стъкло", "Кристал", "Полускъпоценен камък", "Перла", "Метал", "Дърво", "Керамика", "Полимерна глина", "Лампуърк", "Бисер", "Акрил", "Кост/Рог", "Мида", "Друго"]'::jsonb, 59),
     
    -- Secondary Stone
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Secondary Stone', 'Вторичен камък', 'multiselect', false, true,
     '["Diamond Accent", "Ruby", "Sapphire", "Emerald", "Opal", "Pearl", "Amethyst", "Topaz", "Aquamarine", "Garnet", "Tourmaline", "Peridot", "Citrine", "Cubic Zirconia", "None", "Other"]'::jsonb,
     '["Диамантен акцент", "Рубин", "Сапфир", "Изумруд", "Опал", "Перла", "Аметист", "Топаз", "Аквамарин", "Гранат", "Турмалин", "Перидот", "Цитрин", "Цирконий", "Без", "Друго"]'::jsonb, 60),
     
    -- Number of Stones
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Number of Stones', 'Брой камъни', 'select', false, false,
     '["1 Stone", "2 Stones", "3 Stones", "4-5 Stones", "6-10 Stones", "11-20 Stones", "20+ Stones", "Pave/Cluster"]'::jsonb,
     '["1 камък", "2 камъка", "3 камъка", "4-5 камъка", "6-10 камъка", "11-20 камъка", "20+ камъка", "Паве/Клъстер"]'::jsonb, 61),
     
    -- Resizable
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Resizable', 'Възможно преоразмеряване', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 62),
     
    -- Engraving Available
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Engraving Available', 'Възможен гравиране', 'boolean', false, false, '[]'::jsonb, '[]'::jsonb, 63),
     
    -- Gift Boxed
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Gift Boxed', 'В подаръчна кутия', 'boolean', false, false, '[]'::jsonb, '[]'::jsonb, 64),
     
    -- Hypoallergenic
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Hypoallergenic', 'Хипоалергенно', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 65);
;
