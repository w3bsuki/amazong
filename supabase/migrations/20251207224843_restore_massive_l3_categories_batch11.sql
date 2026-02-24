
-- Batch 11: Health & Beauty, Baby & Kids, Grocery deep categories
DO $$
DECLARE
  v_health_id UUID;
  v_skincare_id UUID;
  v_makeup_id UUID;
  v_haircare_id UUID;
  v_fragrance_id UUID;
  v_supplements_id UUID;
  v_personal_care_id UUID;
  v_baby_id UUID;
  v_baby_gear_id UUID;
  v_baby_clothing_id UUID;
  v_toys_id UUID;
  v_grocery_id UUID;
  v_beverages_id UUID;
  v_snacks_id UUID;
  v_pantry_id UUID;
  v_organic_id UUID;
BEGIN
  SELECT id INTO v_health_id FROM categories WHERE slug = 'health-beauty';
  SELECT id INTO v_skincare_id FROM categories WHERE slug = 'skincare';
  SELECT id INTO v_makeup_id FROM categories WHERE slug = 'makeup-cosmetics';
  SELECT id INTO v_haircare_id FROM categories WHERE slug = 'haircare';
  SELECT id INTO v_fragrance_id FROM categories WHERE slug = 'fragrances';
  SELECT id INTO v_supplements_id FROM categories WHERE slug = 'vitamins-supplements';
  SELECT id INTO v_personal_care_id FROM categories WHERE slug = 'personal-care';
  SELECT id INTO v_baby_id FROM categories WHERE slug = 'baby-kids';
  SELECT id INTO v_baby_gear_id FROM categories WHERE slug = 'baby-gear';
  SELECT id INTO v_baby_clothing_id FROM categories WHERE slug = 'baby-clothing';
  SELECT id INTO v_toys_id FROM categories WHERE slug = 'toys-games';
  SELECT id INTO v_grocery_id FROM categories WHERE slug = 'grocery-gourmet';
  SELECT id INTO v_beverages_id FROM categories WHERE slug = 'beverages';
  SELECT id INTO v_snacks_id FROM categories WHERE slug = 'snacks-candy';
  SELECT id INTO v_pantry_id FROM categories WHERE slug = 'pantry-staples';
  SELECT id INTO v_organic_id FROM categories WHERE slug = 'organic-natural';
  
  -- Skincare deep categories
  IF v_skincare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Face Cleansers', 'Почистващи продукти за лице', 'skincare-cleansers', v_skincare_id, 1),
    ('Gel Cleansers', 'Гелове за измиване', 'skincare-cleansers-gel', v_skincare_id, 2),
    ('Foam Cleansers', 'Пени за измиване', 'skincare-cleansers-foam', v_skincare_id, 3),
    ('Oil Cleansers', 'Почистващи масла', 'skincare-cleansers-oil', v_skincare_id, 4),
    ('Moisturizers', 'Хидратиращи кремове', 'skincare-moisturizers', v_skincare_id, 5),
    ('Day Creams', 'Дневни кремове', 'skincare-moisturizers-day', v_skincare_id, 6),
    ('Night Creams', 'Нощни кремове', 'skincare-moisturizers-night', v_skincare_id, 7),
    ('Face Oils', 'Масла за лице', 'skincare-face-oils', v_skincare_id, 8),
    ('Serums', 'Серуми', 'skincare-serums', v_skincare_id, 9),
    ('Vitamin C Serums', 'Серуми с витамин C', 'skincare-serums-vitamin-c', v_skincare_id, 10),
    ('Retinol Serums', 'Серуми с ретинол', 'skincare-serums-retinol', v_skincare_id, 11),
    ('Hyaluronic Acid', 'Хиалуронова киселина', 'skincare-serums-hyaluronic', v_skincare_id, 12),
    ('Eye Creams', 'Кремове за очи', 'skincare-eye-creams', v_skincare_id, 13),
    ('Face Masks', 'Маски за лице', 'skincare-masks', v_skincare_id, 14),
    ('Sheet Masks', 'Лист маски', 'skincare-masks-sheet', v_skincare_id, 15),
    ('Clay Masks', 'Глинени маски', 'skincare-masks-clay', v_skincare_id, 16),
    ('Sunscreen', 'Слънцезащита', 'skincare-sunscreen', v_skincare_id, 17),
    ('SPF 30', 'SPF 30', 'skincare-sunscreen-spf30', v_skincare_id, 18),
    ('SPF 50', 'SPF 50', 'skincare-sunscreen-spf50', v_skincare_id, 19),
    ('Exfoliators', 'Ексфолианти', 'skincare-exfoliators', v_skincare_id, 20),
    ('Toners', 'Тонери', 'skincare-toners', v_skincare_id, 21),
    ('Acne Treatment', 'Лечение на акне', 'skincare-acne-treatment', v_skincare_id, 22),
    ('Anti-Aging', 'Анти-ейдж', 'skincare-anti-aging', v_skincare_id, 23),
    ('Body Lotions', 'Лосиони за тяло', 'skincare-body-lotions', v_skincare_id, 24),
    ('Body Butters', 'Масла за тяло', 'skincare-body-butters', v_skincare_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Makeup deep categories
  IF v_makeup_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Foundation', 'Фон дьо тен', 'makeup-foundation', v_makeup_id, 1),
    ('Liquid Foundation', 'Течен фон дьо тен', 'makeup-foundation-liquid', v_makeup_id, 2),
    ('Powder Foundation', 'Пудра фон дьо тен', 'makeup-foundation-powder', v_makeup_id, 3),
    ('BB Creams', 'BB кремове', 'makeup-bb-creams', v_makeup_id, 4),
    ('CC Creams', 'CC кремове', 'makeup-cc-creams', v_makeup_id, 5),
    ('Concealer', 'Коректор', 'makeup-concealer', v_makeup_id, 6),
    ('Setting Powder', 'Пудра за фиксиране', 'makeup-setting-powder', v_makeup_id, 7),
    ('Blush', 'Руж', 'makeup-blush', v_makeup_id, 8),
    ('Bronzer', 'Бронзант', 'makeup-bronzer', v_makeup_id, 9),
    ('Highlighter', 'Хайлайтър', 'makeup-highlighter', v_makeup_id, 10),
    ('Contour', 'Контуриране', 'makeup-contour', v_makeup_id, 11),
    ('Eye Makeup', 'Грим за очи', 'makeup-eye', v_makeup_id, 12),
    ('Eyeshadow', 'Сенки за очи', 'makeup-eyeshadow', v_makeup_id, 13),
    ('Eyeshadow Palettes', 'Палитри сенки', 'makeup-eyeshadow-palettes', v_makeup_id, 14),
    ('Eyeliner', 'Очна линия', 'makeup-eyeliner', v_makeup_id, 15),
    ('Mascara', 'Спирала', 'makeup-mascara', v_makeup_id, 16),
    ('False Lashes', 'Изкуствени мигли', 'makeup-false-lashes', v_makeup_id, 17),
    ('Eyebrow Products', 'Продукти за вежди', 'makeup-eyebrows', v_makeup_id, 18),
    ('Lip Products', 'Продукти за устни', 'makeup-lips', v_makeup_id, 19),
    ('Lipstick', 'Червило', 'makeup-lipstick', v_makeup_id, 20),
    ('Lip Gloss', 'Гланц за устни', 'makeup-lip-gloss', v_makeup_id, 21),
    ('Lip Liner', 'Молив за устни', 'makeup-lip-liner', v_makeup_id, 22),
    ('Makeup Brushes', 'Четки за грим', 'makeup-brushes', v_makeup_id, 23),
    ('Brush Sets', 'Комплекти четки', 'makeup-brush-sets', v_makeup_id, 24),
    ('Makeup Remover', 'Продукти за премахване на грим', 'makeup-remover', v_makeup_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Haircare deep categories
  IF v_haircare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Shampoo', 'Шампоан', 'haircare-shampoo', v_haircare_id, 1),
    ('Dry Shampoo', 'Сух шампоан', 'haircare-shampoo-dry', v_haircare_id, 2),
    ('Anti-Dandruff Shampoo', 'Шампоан против пърхот', 'haircare-shampoo-dandruff', v_haircare_id, 3),
    ('Conditioner', 'Балсам', 'haircare-conditioner', v_haircare_id, 4),
    ('Leave-In Conditioner', 'Незаличим балсам', 'haircare-conditioner-leave-in', v_haircare_id, 5),
    ('Hair Masks', 'Маски за коса', 'haircare-masks', v_haircare_id, 6),
    ('Hair Oil', 'Масло за коса', 'haircare-oil', v_haircare_id, 7),
    ('Argan Oil', 'Арганово масло', 'haircare-oil-argan', v_haircare_id, 8),
    ('Hair Serum', 'Серум за коса', 'haircare-serum', v_haircare_id, 9),
    ('Hair Styling', 'Стилизиране на коса', 'haircare-styling', v_haircare_id, 10),
    ('Hair Gel', 'Гел за коса', 'haircare-gel', v_haircare_id, 11),
    ('Hair Spray', 'Лак за коса', 'haircare-spray', v_haircare_id, 12),
    ('Hair Mousse', 'Пяна за коса', 'haircare-mousse', v_haircare_id, 13),
    ('Hair Wax', 'Восък за коса', 'haircare-wax', v_haircare_id, 14),
    ('Hair Color', 'Боя за коса', 'haircare-color', v_haircare_id, 15),
    ('Permanent Color', 'Трайна боя', 'haircare-color-permanent', v_haircare_id, 16),
    ('Semi-Permanent', 'Полутрайна боя', 'haircare-color-semi-permanent', v_haircare_id, 17),
    ('Hair Tools', 'Инструменти за коса', 'haircare-tools', v_haircare_id, 18),
    ('Hair Dryers', 'Сешоари', 'haircare-dryers', v_haircare_id, 19),
    ('Flat Irons', 'Преси за коса', 'haircare-flat-irons', v_haircare_id, 20),
    ('Curling Irons', 'Маши за коса', 'haircare-curling-irons', v_haircare_id, 21),
    ('Hair Brushes', 'Четки за коса', 'haircare-brushes', v_haircare_id, 22),
    ('Hair Combs', 'Гребени', 'haircare-combs', v_haircare_id, 23),
    ('Hair Loss Treatment', 'Лечение на косопад', 'haircare-hair-loss', v_haircare_id, 24),
    ('Hair Accessories', 'Аксесоари за коса', 'haircare-accessories', v_haircare_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Gear deep categories
  IF v_baby_gear_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Strollers', 'Колички', 'baby-strollers', v_baby_gear_id, 1),
    ('Travel Strollers', 'Пътнически колички', 'baby-strollers-travel', v_baby_gear_id, 2),
    ('Double Strollers', 'Двойни колички', 'baby-strollers-double', v_baby_gear_id, 3),
    ('Jogging Strollers', 'Колички за джогинг', 'baby-strollers-jogging', v_baby_gear_id, 4),
    ('Car Seats', 'Столчета за кола', 'baby-car-seats', v_baby_gear_id, 5),
    ('Infant Car Seats', 'Столчета за новородени', 'baby-car-seats-infant', v_baby_gear_id, 6),
    ('Convertible Car Seats', 'Конвертируеми столчета', 'baby-car-seats-convertible', v_baby_gear_id, 7),
    ('Booster Seats', 'Бустери', 'baby-car-seats-booster', v_baby_gear_id, 8),
    ('Baby Carriers', 'Кенгура', 'baby-carriers', v_baby_gear_id, 9),
    ('Soft Carriers', 'Меки кенгура', 'baby-carriers-soft', v_baby_gear_id, 10),
    ('Structured Carriers', 'Структурирани кенгура', 'baby-carriers-structured', v_baby_gear_id, 11),
    ('Baby Wraps', 'Бебешки слингове', 'baby-wraps', v_baby_gear_id, 12),
    ('High Chairs', 'Столчета за хранене', 'baby-high-chairs', v_baby_gear_id, 13),
    ('Portable High Chairs', 'Преносими столчета', 'baby-high-chairs-portable', v_baby_gear_id, 14),
    ('Cribs', 'Кошари', 'baby-cribs', v_baby_gear_id, 15),
    ('Portable Cribs', 'Преносими кошари', 'baby-cribs-portable', v_baby_gear_id, 16),
    ('Bassinets', 'Люлки', 'baby-bassinets', v_baby_gear_id, 17),
    ('Baby Monitors', 'Бебефони', 'baby-monitors', v_baby_gear_id, 18),
    ('Video Monitors', 'Видео бебефони', 'baby-monitors-video', v_baby_gear_id, 19),
    ('Diaper Bags', 'Чанти за пелени', 'baby-diaper-bags', v_baby_gear_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Toys & Games deep categories
  IF v_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Action Figures', 'Екшън фигурки', 'toys-action-figures', v_toys_id, 1),
    ('Superhero Figures', 'Супергерой фигурки', 'toys-figures-superhero', v_toys_id, 2),
    ('Building Toys', 'Конструктори', 'toys-building', v_toys_id, 3),
    ('LEGO', 'ЛЕГО', 'toys-lego', v_toys_id, 4),
    ('Building Blocks', 'Строителни блокове', 'toys-blocks', v_toys_id, 5),
    ('Dolls', 'Кукли', 'toys-dolls', v_toys_id, 6),
    ('Fashion Dolls', 'Модни кукли', 'toys-dolls-fashion', v_toys_id, 7),
    ('Baby Dolls', 'Бебешки кукли', 'toys-dolls-baby', v_toys_id, 8),
    ('Doll Houses', 'Къщи за кукли', 'toys-doll-houses', v_toys_id, 9),
    ('Vehicles', 'Превозни средства', 'toys-vehicles', v_toys_id, 10),
    ('Toy Cars', 'Колички', 'toys-cars', v_toys_id, 11),
    ('RC Cars', 'RC коли', 'toys-rc-cars', v_toys_id, 12),
    ('Toy Trains', 'Влакчета', 'toys-trains', v_toys_id, 13),
    ('Puzzles', 'Пъзели', 'toys-puzzles', v_toys_id, 14),
    ('Jigsaw Puzzles', 'Пъзели', 'toys-puzzles-jigsaw', v_toys_id, 15),
    ('3D Puzzles', '3D пъзели', 'toys-puzzles-3d', v_toys_id, 16),
    ('Board Games', 'Настолни игри', 'toys-board-games', v_toys_id, 17),
    ('Strategy Games', 'Стратегически игри', 'toys-games-strategy', v_toys_id, 18),
    ('Card Games', 'Карти за игра', 'toys-card-games', v_toys_id, 19),
    ('Educational Toys', 'Образователни играчки', 'toys-educational', v_toys_id, 20),
    ('STEM Toys', 'STEM играчки', 'toys-stem', v_toys_id, 21),
    ('Outdoor Toys', 'Играчки за навън', 'toys-outdoor', v_toys_id, 22),
    ('Water Toys', 'Водни играчки', 'toys-water', v_toys_id, 23),
    ('Plush Toys', 'Плюшени играчки', 'toys-plush', v_toys_id, 24),
    ('Arts & Crafts', 'Изкуства и занаяти', 'toys-arts-crafts', v_toys_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Grocery deep categories
  IF v_pantry_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pasta', 'Паста', 'pantry-pasta', v_pantry_id, 1),
    ('Spaghetti', 'Спагети', 'pantry-pasta-spaghetti', v_pantry_id, 2),
    ('Penne', 'Пене', 'pantry-pasta-penne', v_pantry_id, 3),
    ('Rice', 'Ориз', 'pantry-rice', v_pantry_id, 4),
    ('Basmati Rice', 'Басмати ориз', 'pantry-rice-basmati', v_pantry_id, 5),
    ('Brown Rice', 'Кафяв ориз', 'pantry-rice-brown', v_pantry_id, 6),
    ('Canned Goods', 'Консерви', 'pantry-canned', v_pantry_id, 7),
    ('Canned Vegetables', 'Консервирани зеленчуци', 'pantry-canned-vegetables', v_pantry_id, 8),
    ('Canned Beans', 'Консервиран боб', 'pantry-canned-beans', v_pantry_id, 9),
    ('Canned Tomatoes', 'Консервирани домати', 'pantry-canned-tomatoes', v_pantry_id, 10),
    ('Cooking Oils', 'Олио за готвене', 'pantry-oils', v_pantry_id, 11),
    ('Olive Oil', 'Зехтин', 'pantry-oils-olive', v_pantry_id, 12),
    ('Vegetable Oil', 'Растително масло', 'pantry-oils-vegetable', v_pantry_id, 13),
    ('Seasonings', 'Подправки', 'pantry-seasonings', v_pantry_id, 14),
    ('Herbs', 'Билки', 'pantry-herbs', v_pantry_id, 15),
    ('Spices', 'Подправки', 'pantry-spices', v_pantry_id, 16),
    ('Sauces', 'Сосове', 'pantry-sauces', v_pantry_id, 17),
    ('Pasta Sauce', 'Сос за паста', 'pantry-sauces-pasta', v_pantry_id, 18),
    ('Soy Sauce', 'Соев сос', 'pantry-sauces-soy', v_pantry_id, 19),
    ('Baking', 'Печене', 'pantry-baking', v_pantry_id, 20),
    ('Flour', 'Брашно', 'pantry-baking-flour', v_pantry_id, 21),
    ('Sugar', 'Захар', 'pantry-baking-sugar', v_pantry_id, 22),
    ('Cereals', 'Зърнени закуски', 'pantry-cereals', v_pantry_id, 23),
    ('Oatmeal', 'Овесени ядки', 'pantry-oatmeal', v_pantry_id, 24),
    ('Granola', 'Гранола', 'pantry-granola', v_pantry_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Beverages deep categories
  IF v_beverages_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Coffee', 'Кафе', 'beverages-coffee', v_beverages_id, 1),
    ('Ground Coffee', 'Мляно кафе', 'beverages-coffee-ground', v_beverages_id, 2),
    ('Coffee Beans', 'Кафе на зърна', 'beverages-coffee-beans', v_beverages_id, 3),
    ('Instant Coffee', 'Инстантно кафе', 'beverages-coffee-instant', v_beverages_id, 4),
    ('Coffee Pods', 'Кафе капсули', 'beverages-coffee-pods', v_beverages_id, 5),
    ('Tea', 'Чай', 'beverages-tea', v_beverages_id, 6),
    ('Green Tea', 'Зелен чай', 'beverages-tea-green', v_beverages_id, 7),
    ('Black Tea', 'Черен чай', 'beverages-tea-black', v_beverages_id, 8),
    ('Herbal Tea', 'Билков чай', 'beverages-tea-herbal', v_beverages_id, 9),
    ('Soft Drinks', 'Безалкохолни напитки', 'beverages-soft-drinks', v_beverages_id, 10),
    ('Cola', 'Кола', 'beverages-cola', v_beverages_id, 11),
    ('Energy Drinks', 'Енергийни напитки', 'beverages-energy-drinks', v_beverages_id, 12),
    ('Juices', 'Сокове', 'beverages-juices', v_beverages_id, 13),
    ('Orange Juice', 'Портокалов сок', 'beverages-juice-orange', v_beverages_id, 14),
    ('Apple Juice', 'Ябълков сок', 'beverages-juice-apple', v_beverages_id, 15),
    ('Water', 'Вода', 'beverages-water', v_beverages_id, 16),
    ('Sparkling Water', 'Газирана вода', 'beverages-water-sparkling', v_beverages_id, 17),
    ('Sports Drinks', 'Спортни напитки', 'beverages-sports-drinks', v_beverages_id, 18),
    ('Milk', 'Мляко', 'beverages-milk', v_beverages_id, 19),
    ('Plant Milk', 'Растително мляко', 'beverages-milk-plant', v_beverages_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
