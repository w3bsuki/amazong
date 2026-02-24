-- Phase 2.1.4: Fashion Attributes - Batch 1: Core Fashion Attributes
-- Add comprehensive attributes to Fashion L0 and key L1/L2 categories

-- =====================================================
-- FASHION L0 ATTRIBUTES (Universal for all fashion items)
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'fashion'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Size', 'Размер', 'select', true, '["XXS","XS","S","M","L","XL","XXL","XXXL","One Size"]', '["XXS","XS","S","M","L","XL","XXL","XXXL","Един размер"]', 1),
  ('Color', 'Цвят', 'select', true, '["Black","White","Navy","Gray","Red","Blue","Green","Pink","Purple","Orange","Yellow","Brown","Beige","Cream","Gold","Silver","Multi-Color"]', '["Черен","Бял","Тъмносин","Сив","Червен","Син","Зелен","Розов","Лилав","Оранжев","Жълт","Кафяв","Бежов","Кремав","Златен","Сребърен","Многоцветен"]', 2),
  ('Material', 'Материал', 'select', false, '["Cotton","Polyester","Wool","Silk","Linen","Denim","Leather","Suede","Cashmere","Nylon","Viscose","Acrylic","Blended"]', '["Памук","Полиестер","Вълна","Коприна","Лен","Дънков","Кожа","Велур","Кашмир","Найлон","Вискоза","Акрил","Смесен"]', 3),
  ('Style', 'Стил', 'select', false, '["Casual","Formal","Business","Sport","Vintage","Bohemian","Classic","Modern","Streetwear","Minimalist","Romantic","Elegant"]', '["Ежедневен","Официален","Бизнес","Спортен","Винтидж","Бохо","Класически","Модерен","Улична мода","Минималистичен","Романтичен","Елегантен"]', 4),
  ('Brand', 'Марка', 'text', false, '[]', '[]', 5),
  ('Condition', 'Състояние', 'select', true, '["New with Tags","New without Tags","Like New","Very Good","Good","Acceptable"]', '["Ново с етикет","Ново без етикет","Като ново","Много добро","Добро","Приемливо"]', 6),
  ('Season', 'Сезон', 'select', false, '["Spring/Summer","Fall/Winter","All Season","Summer","Winter","Spring","Fall"]', '["Пролет/Лято","Есен/Зима","Целогодишен","Лято","Зима","Пролет","Есен"]', 7),
  ('Gender', 'Пол', 'select', true, '["Women","Men","Unisex","Girls","Boys","Kids"]', '["Жени","Мъже","Унисекс","Момичета","Момчета","Деца"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- WOMEN'S CLOTHING L1 ATTRIBUTES
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'women-clothing'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Fit', 'Кройка', 'select', false, '["Slim","Regular","Relaxed","Oversized","Fitted","Loose"]', '["Тясна","Стандартна","Свободна","Оувърсайз","Прилепнала","Широка"]', 10),
  ('Length', 'Дължина', 'select', false, '["Short","Regular","Long","Maxi","Midi","Mini","Cropped"]', '["Къса","Стандартна","Дълга","Макси","Миди","Мини","Къса"]', 11),
  ('Neckline', 'Деколте', 'select', false, '["Round","V-Neck","Scoop","Square","Boat","Off-Shoulder","Turtleneck","Halter","Cowl"]', '["Кръгло","V-образно","Дълбоко","Квадратно","Лодка","Паднало рамо","Поло","Холтър","Каул"]', 12),
  ('Sleeve Length', 'Дължина на ръкав', 'select', false, '["Sleeveless","Short Sleeve","3/4 Sleeve","Long Sleeve","Cap Sleeve"]', '["Без ръкав","Къс ръкав","3/4 ръкав","Дълъг ръкав","Прихванат ръкав"]', 13),
  ('Pattern', 'Шарка', 'select', false, '["Solid","Striped","Floral","Polka Dot","Plaid","Animal Print","Geometric","Abstract","Paisley"]', '["Едноцветен","На райета","Флорален","На точки","Каре","Животински принт","Геометричен","Абстрактен","Пейсли"]', 14),
  ('Occasion', 'Повод', 'select', false, '["Casual","Work","Party","Wedding","Beach","Date Night","Vacation","Special Occasion"]', '["Ежедневие","Работа","Парти","Сватба","Плаж","Среща","Ваканция","Специален повод"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- MEN'S CLOTHING L1 ATTRIBUTES
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'men-clothing'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Fit', 'Кройка', 'select', false, '["Slim Fit","Regular Fit","Relaxed Fit","Athletic Fit","Classic Fit","Modern Fit"]', '["Тясна","Стандартна","Свободна","Атлетична","Класическа","Модерна"]', 10),
  ('Collar', 'Яка', 'select', false, '["Spread","Point","Button-Down","Mandarin","Wing","Cutaway"]', '["Разпъната","Класическа","С копчета","Мандарин","Крило","Отрязана"]', 11),
  ('Rise', 'Кройка талия', 'select', false, '["Low Rise","Mid Rise","High Rise","Regular Rise"]', '["Ниска талия","Средна талия","Висока талия","Стандартна талия"]', 12),
  ('Closure', 'Закопчаване', 'select', false, '["Button","Zipper","Snap","Pull-On","Hook & Eye"]', '["Копчета","Цип","Тик-так","Без закопчаване","Кукички"]', 13),
  ('Pattern', 'Шарка', 'select', false, '["Solid","Striped","Checkered","Plaid","Paisley","Geometric","Camo"]', '["Едноцветен","На райета","На квадратчета","Каре","Пейсли","Геометричен","Камуфлаж"]', 14),
  ('Inseam', 'Дължина крачол', 'select', false, '["28\"","30\"","32\"","34\"","36\""]', '["28\"","30\"","32\"","34\"","36\""]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CHILDREN'S CLOTHING L1 ATTRIBUTES
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'child-clothing'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Age Range', 'Възрастова група', 'select', true, '["0-3 Months","3-6 Months","6-12 Months","1-2 Years","2-3 Years","3-4 Years","4-5 Years","5-6 Years","6-8 Years","8-10 Years","10-12 Years","12-14 Years"]', '["0-3 месеца","3-6 месеца","6-12 месеца","1-2 години","2-3 години","3-4 години","4-5 години","5-6 години","6-8 години","8-10 години","10-12 години","12-14 години"]', 10),
  ('Character', 'Герой', 'select', false, '["Disney","Marvel","Paw Patrol","Peppa Pig","Pokemon","Minecraft","Frozen","Spider-Man","Barbie","None"]', '["Дисни","Марвел","Пес Патрул","Прасето Пепа","Покемон","Майнкрафт","Замръзналото кралство","Спайдърмен","Барби","Без герой"]', 11),
  ('Closure', 'Закопчаване', 'select', false, '["Snap","Zipper","Button","Velcro","Pull-On","Elastic"]', '["Тик-так","Цип","Копчета","Велкро","Без закопчаване","Ластик"]', 12),
  ('Care Instructions', 'Инструкции за грижа', 'select', false, '["Machine Wash","Hand Wash","Dry Clean","Tumble Dry","Hang Dry"]', '["Машинно пране","Ръчно пране","Химическо чистене","Сушилня","Въздушно сушене"]', 13)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SHOES ATTRIBUTES (Women, Men, Kids, Unisex)
-- =====================================================

-- Women's Shoes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'women-shoes'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Shoe Size EU', 'Размер EU', 'select', true, '["35","36","37","38","39","40","41","42","43"]', '["35","36","37","38","39","40","41","42","43"]', 10),
  ('Shoe Size US', 'Размер US', 'select', false, '["5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"]', '["5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"]', 11),
  ('Width', 'Ширина', 'select', false, '["Narrow","Regular","Wide","Extra Wide"]', '["Тясна","Стандартна","Широка","Много широка"]', 12),
  ('Heel Height', 'Височина ток', 'select', false, '["Flat (0-1\")","Low (1-2\")","Mid (2-3\")","High (3-4\")","Very High (4\"+)"]', '["Плосък (0-2.5см)","Нисък (2.5-5см)","Среден (5-7.5см)","Висок (7.5-10см)","Много висок (10см+)"]', 13),
  ('Heel Type', 'Вид ток', 'select', false, '["Stiletto","Block","Wedge","Kitten","Platform","Cone","Stacked"]', '["Стилето","Блок","Платформа","Котка","Платформа","Конус","Наслоен"]', 14),
  ('Toe Shape', 'Форма пръсти', 'select', false, '["Round","Pointed","Square","Almond","Peep Toe","Open Toe"]', '["Кръгли","Заострени","Квадратни","Бадемови","Отворени отпред","Отворени"]', 15),
  ('Upper Material', 'Материал горна част', 'select', false, '["Leather","Suede","Textile","Synthetic","Canvas","Patent","Mesh"]', '["Кожа","Велур","Текстил","Синтетика","Платно","Лак","Мрежа"]', 16)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Men's Shoes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'men-shoes'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Shoe Size EU', 'Размер EU', 'select', true, '["39","40","41","42","43","44","45","46","47","48"]', '["39","40","41","42","43","44","45","46","47","48"]', 10),
  ('Shoe Size US', 'Размер US', 'select', false, '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12","13","14"]', '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12","13","14"]', 11),
  ('Width', 'Ширина', 'select', false, '["Narrow","Regular","Wide","Extra Wide"]', '["Тясна","Стандартна","Широка","Много широка"]', 12),
  ('Upper Material', 'Материал горна част', 'select', false, '["Leather","Suede","Textile","Synthetic","Canvas","Mesh","Knit"]', '["Кожа","Велур","Текстил","Синтетика","Платно","Мрежа","Плетиво"]', 13),
  ('Sole Material', 'Материал подметка', 'select', false, '["Rubber","Leather","EVA","TPU","Cork","Crepe"]', '["Гума","Кожа","EVA","TPU","Корк","Креп"]', 14),
  ('Closure Type', 'Закопчаване', 'select', false, '["Lace-Up","Slip-On","Buckle","Velcro","Zipper","Elastic"]', '["Връзки","Без закопчаване","Катарама","Велкро","Цип","Ластик"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Kids Shoes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'child-shoes'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Shoe Size EU', 'Размер EU', 'select', true, '["18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38"]', '["18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38"]', 10),
  ('Age Group', 'Възраст', 'select', true, '["Baby (0-1)","Toddler (1-4)","Little Kid (4-8)","Big Kid (8-12)","Teen (12+)"]', '["Бебе (0-1)","Малко дете (1-4)","Дете (4-8)","Голямо дете (8-12)","Тийнейджър (12+)"]', 11),
  ('Closure Type', 'Закопчаване', 'select', false, '["Velcro","Lace-Up","Slip-On","Buckle","Zipper","Elastic"]', '["Велкро","Връзки","Без закопчаване","Катарама","Цип","Ластик"]', 12),
  ('Light-Up', 'Светещи', 'select', false, '["Yes","No"]', '["Да","Не"]', 13),
  ('Character', 'Герой', 'select', false, '["Disney","Marvel","Paw Patrol","Peppa Pig","Pokemon","Frozen","Spider-Man","None"]', '["Дисни","Марвел","Пес Патрул","Прасето Пепа","Покемон","Замръзналото кралство","Спайдърмен","Без герой"]', 14)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;;
