
-- ==============================================
-- JEWELRY & WATCHES - WATCH COMPLICATIONS & CHAIN ATTRIBUTES
-- Date: December 4, 2025
-- ==============================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
    -- Watch Complications
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Complications', 'Компликации', 'multiselect', false, true,
     '["Date", "Day-Date", "Chronograph", "GMT/Dual Time", "Moon Phase", "Power Reserve", "Minute Repeater", "Perpetual Calendar", "Annual Calendar", "World Time", "Alarm", "Tourbillon", "Skeleton", "Tachymeter", "Regatta Timer", "Depth Gauge", "Altimeter", "None"]'::jsonb,
     '["Дата", "Ден-Дата", "Хронограф", "GMT/Двойно време", "Лунни фази", "Резерв на мощността", "Минутен репетир", "Вечен календар", "Годишен календар", "Световно време", "Аларма", "Турбийон", "Скелетон", "Тахиметър", "Регата таймер", "Дълбокомер", "Алтиметър", "Без"]'::jsonb, 38),
     
    -- Strap/Bracelet Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Watch Strap Type', 'Тип каишка', 'select', false, true,
     '["Metal Bracelet (Oyster)", "Metal Bracelet (Jubilee)", "Metal Bracelet (President)", "Metal Bracelet (Other)", "Leather Strap", "Alligator/Crocodile Strap", "Rubber/Silicone", "NATO/Canvas", "Milanese Mesh", "Ceramic Bracelet", "Fabric", "Other"]'::jsonb,
     '["Метална гривна (Ойстер)", "Метална гривна (Джубили)", "Метална гривна (Президент)", "Метална гривна (друга)", "Кожена каишка", "Алигатор/Крокодилска кожа", "Каучук/Силикон", "НАТО/Текстил", "Миланска мрежа", "Керамична гривна", "Плат", "Друга"]'::jsonb, 39),

    -- Chain Length
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Chain Length', 'Дължина на верижката', 'select', false, true,
     '["35cm - Collar", "40cm - Choker", "45cm - Princess", "50cm - Matinee", "55cm", "60cm - Opera", "75cm", "90cm - Rope", "Custom/Adjustable"]'::jsonb,
     '["35см - Яка", "40см - Чоукър", "45см - Принцеса", "50см - Матине", "55см", "60см - Опера", "75см", "90см - Въже", "Персонализирана/Регулируема"]'::jsonb, 40),
     
    -- Chain Style
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Chain Style', 'Стил на верижката', 'select', false, true,
     '["Cable/Link", "Rope", "Box", "Snake", "Figaro", "Curb/Cuban", "Wheat/Spiga", "Singapore", "Franco", "Mariner/Anchor", "Byzantine", "Herringbone", "Omega", "Bead/Ball", "Bar/Station", "Choker", "Multi-Strand", "Other"]'::jsonb,
     '["Верига/Звена", "Въже", "Бокс", "Змия", "Фигаро", "Панцер/Кубинска", "Пшеница/Спига", "Сингапур", "Франко", "Морска/Котва", "Византийска", "Рибена кост", "Омега", "Топки", "Станция", "Чоукър", "Многоредова", "Друга"]'::jsonb, 41),
     
    -- Chain Width
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Chain Width (mm)', 'Дебелина на верижката (мм)', 'select', false, true,
     '["0.5-1mm Delicate", "1.5-2mm Fine", "2.5-3mm Medium", "3.5-4mm Substantial", "5-6mm Bold", "7mm+ Statement"]'::jsonb,
     '["0.5-1мм Деликатна", "1.5-2мм Фина", "2.5-3мм Средна", "3.5-4мм Солидна", "5-6мм Смела", "7мм+ Изявена"]'::jsonb, 42),

    -- Bracelet Length
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Bracelet Length', 'Дължина на гривната', 'select', false, true,
     '["15cm Petite", "16.5cm Small", "17.5cm Standard", "19cm Medium", "20cm Large", "21.5cm X-Large", "23cm+ XX-Large", "Adjustable"]'::jsonb,
     '["15см Малка", "16.5см С", "17.5см Стандартна", "19см М", "20см Л", "21.5см ХЛ", "23см+ ХХЛ", "Регулируема"]'::jsonb, 43),
     
    -- Bracelet Style
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Bracelet Style', 'Стил на гривната', 'select', false, true,
     '["Bangle", "Cuff", "Chain Link", "Tennis", "Charm", "Beaded", "Wrap", "Cord/String", "Stretch", "Hinged", "Mesh", "ID/Bar", "Medical Alert", "Smart/Fitness", "Other"]'::jsonb,
     '["Бангъл", "Маншет", "Верижка", "Тенис", "С талисмани", "С мъниста", "Обвиваща", "Шнур", "Еластична", "С панта", "Мрежа", "ИД/Плочка", "Медицинска", "Смарт/Фитнес", "Друга"]'::jsonb, 44),
     
    -- Clasp Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Clasp Type', 'Тип закопчалка', 'select', false, true,
     '["Lobster Claw", "Spring Ring", "Toggle", "Box/Tongue", "Fold-Over", "Hook and Eye", "Magnetic", "Barrel/Screw", "S-Hook", "Sliding Adjustable", "None Slip-On", "Other"]'::jsonb,
     '["Омар", "Пружинен пръстен", "Тогъл", "Кутия", "Сгъваема", "Кука и око", "Магнитна", "Винтова", "S-кука", "Плъзгаща се", "Без навлачаща се", "Друга"]'::jsonb, 45);
;
