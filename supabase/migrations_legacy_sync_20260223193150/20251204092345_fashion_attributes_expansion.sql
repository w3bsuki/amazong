
-- ============================================================
-- FASHION EXPANSION - PART 4: Comprehensive Attributes
-- ============================================================
-- Adding detailed attributes for Fashion categories (Clothing, Shoes, Bags, Watches, Accessories)

DO $$
DECLARE
  fashion_id UUID;
  bags_id UUID;
  watches_id UUID;
  accessories_id UUID;
BEGIN
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO bags_id FROM categories WHERE slug = 'bags-luggage';
  SELECT id INTO watches_id FROM categories WHERE slug = 'fashion-watches-main';
  SELECT id INTO accessories_id FROM categories WHERE slug = 'fashion-accessories-main';
  
  -- ============================================================
  -- FASHION (Global) - Additional Attributes
  -- ============================================================
  
  -- Fashion Condition (more specific than global)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Fashion Condition', 'Състояние', 'select', false, true, 
    '["New with Tags", "New without Tags", "Like New", "Very Good", "Good", "Fair", "For Parts/Repair"]',
    '["Нов с етикет", "Нов без етикет", "Като нов", "Много добро", "Добро", "Задоволително", "За части/ремонт"]',
    10)
  ON CONFLICT DO NOTHING;
  
  -- Fashion Brand (select with popular brands)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Fashion Brand', 'Марка', 'select', false, true, 
    '["Adidas", "Armani", "ASOS", "Balenciaga", "Balmain", "Burberry", "Calvin Klein", "Chanel", "Coach", "Diesel", "Dior", "DKNY", "Dolce & Gabbana", "Fendi", "Givenchy", "Gucci", "H&M", "Hugo Boss", "Lacoste", "Levis", "Louis Vuitton", "Mango", "Marc Jacobs", "Michael Kors", "Nike", "Off-White", "Polo Ralph Lauren", "Prada", "Puma", "Reebok", "Saint Laurent", "Superdry", "Supreme", "Tommy Hilfiger", "Valentino", "Versace", "Zara", "Other"]',
    '["Adidas", "Armani", "ASOS", "Balenciaga", "Balmain", "Burberry", "Calvin Klein", "Chanel", "Coach", "Diesel", "Dior", "DKNY", "Dolce & Gabbana", "Fendi", "Givenchy", "Gucci", "H&M", "Hugo Boss", "Lacoste", "Levis", "Louis Vuitton", "Mango", "Marc Jacobs", "Michael Kors", "Nike", "Off-White", "Polo Ralph Lauren", "Prada", "Puma", "Reebok", "Saint Laurent", "Superdry", "Supreme", "Tommy Hilfiger", "Valentino", "Versace", "Zara", "Друга"]',
    11)
  ON CONFLICT DO NOTHING;
  
  -- Fit (for clothing)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Fit', 'Кройка', 'select', false, true, 
    '["Regular Fit", "Slim Fit", "Relaxed Fit", "Loose Fit", "Oversized", "Skinny", "Athletic Fit", "Tailored"]',
    '["Стандартна кройка", "Тясна кройка", "Свободна кройка", "Широка кройка", "Оувърсайз", "Скини", "Атлетична кройка", "По мярка"]',
    12)
  ON CONFLICT DO NOTHING;
  
  -- Length (for clothing)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Length', 'Дължина', 'select', false, true, 
    '["Short", "Regular", "Long", "Mini", "Midi", "Maxi", "Cropped", "Ankle Length"]',
    '["Къса", "Стандартна", "Дълга", "Мини", "Миди", "Макси", "Къса/Кроп", "До глезена"]',
    13)
  ON CONFLICT DO NOTHING;
  
  -- Neckline (for tops/dresses)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Neckline', 'Деколте', 'select', false, true, 
    '["Crew Neck", "V-Neck", "Scoop Neck", "Boat Neck", "Turtleneck", "Mock Neck", "Off-Shoulder", "One Shoulder", "Halter", "Square Neck", "Cowl Neck", "Collared"]',
    '["Обло деколте", "V-образно", "Дълбоко обло", "Каре", "Поло/Долчевита", "Ниска яка", "Голи рамене", "Едно рамо", "Халтер", "Квадратно", "Драперия", "С яка"]',
    14)
  ON CONFLICT DO NOTHING;
  
  -- Sleeve Length
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Sleeve Length', 'Дължина на ръкав', 'select', false, true, 
    '["Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve", "Cap Sleeve", "Bell Sleeve", "Puff Sleeve"]',
    '["Без ръкав", "Къс ръкав", "3/4 ръкав", "Дълъг ръкав", "Малък ръкав", "Камбанка", "Буфан ръкав"]',
    15)
  ON CONFLICT DO NOTHING;
  
  -- Closure Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Closure Type', 'Тип закопчаване', 'select', false, true, 
    '["Button", "Zipper", "Snap", "Hook & Eye", "Tie", "Pull-On", "Buckle", "Velcro", "Toggle", "Drawstring"]',
    '["Копчета", "Цип", "Тик-так", "Кукичка", "Връзки", "Без закопчаване", "Катарама", "Велкро", "Тогъл", "Връв"]',
    16)
  ON CONFLICT DO NOTHING;
  
  -- Rise (for pants)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Rise', 'Талия', 'select', false, true, 
    '["Low Rise", "Mid Rise", "High Rise", "Ultra High Rise"]',
    '["Ниска талия", "Средна талия", "Висока талия", "Много висока талия"]',
    17)
  ON CONFLICT DO NOTHING;
  
  -- Occasion
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Occasion', 'Повод', 'multiselect', false, true, 
    '["Casual", "Work/Office", "Formal/Evening", "Party", "Wedding/Special", "Beach/Vacation", "Sport/Active", "Everyday"]',
    '["Ежедневно", "Работа/Офис", "Официално/Вечерно", "Парти", "Сватба/Специален повод", "Плаж/Ваканция", "Спорт/Активно", "Всекидневно"]',
    18)
  ON CONFLICT DO NOTHING;
  
  -- ============================================================
  -- SHOES - Specific Attributes
  -- ============================================================
  
  -- Heel Height
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Heel Height', 'Височина на ток', 'select', false, true, 
    '["Flat (0-1 cm)", "Low (1-3 cm)", "Mid (3-6 cm)", "High (6-9 cm)", "Very High (9+ cm)", "Platform", "Wedge"]',
    '["Равни (0-1 см)", "Нисък (1-3 см)", "Среден (3-6 см)", "Висок (6-9 см)", "Много висок (9+ см)", "Платформа", "Танкета"]',
    20)
  ON CONFLICT DO NOTHING;
  
  -- Heel Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Heel Type', 'Тип ток', 'select', false, true, 
    '["Stiletto", "Block", "Kitten", "Wedge", "Platform", "Cone", "Spool", "Flat"]',
    '["Стилето", "Блок", "Нисък тънък", "Танкета", "Платформа", "Конус", "Катерица", "Равен"]',
    21)
  ON CONFLICT DO NOTHING;
  
  -- Shoe Width
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Shoe Width', 'Ширина на обувката', 'select', false, true, 
    '["Narrow", "Standard", "Wide", "Extra Wide"]',
    '["Тясна", "Стандартна", "Широка", "Много широка"]',
    22)
  ON CONFLICT DO NOTHING;
  
  -- Toe Shape
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Toe Shape', 'Форма на пръстите', 'select', false, true, 
    '["Round", "Pointed", "Square", "Almond", "Peep Toe", "Open Toe", "Cap Toe"]',
    '["Кръгли", "Заострени", "Квадратни", "Бадемови", "Отворени отпред", "Изцяло отворени", "С капачка"]',
    23)
  ON CONFLICT DO NOTHING;
  
  -- Sole Material
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (fashion_id, 'Sole Material', 'Материал на подметката', 'select', false, true, 
    '["Rubber", "Leather", "Synthetic", "Cork", "EVA", "TPU", "Crepe", "Wood"]',
    '["Гума", "Кожа", "Синтетика", "Корк", "EVA", "TPU", "Креп", "Дърво"]',
    24)
  ON CONFLICT DO NOTHING;
  
  -- ============================================================
  -- BAGS - Specific Attributes
  -- ============================================================
  
  -- Bag Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Bag Size', 'Размер на чантата', 'select', false, true, 
    '["Mini", "Small", "Medium", "Large", "Extra Large", "Oversized"]',
    '["Мини", "Малка", "Средна", "Голяма", "Много голяма", "Огромна"]',
    1)
  ON CONFLICT DO NOTHING;
  
  -- Bag Style
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Bag Style', 'Стил на чантата', 'select', false, true, 
    '["Casual", "Business/Professional", "Evening/Formal", "Sport/Active", "Travel", "Designer/Luxury"]',
    '["Ежедневен", "Бизнес/Професионален", "Вечерен/Официален", "Спортен/Активен", "Пътуване", "Дизайнерски/Луксозен"]',
    2)
  ON CONFLICT DO NOTHING;
  
  -- Strap Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Strap Type', 'Тип дръжка', 'select', false, true, 
    '["No Strap", "Short Handle", "Long Strap", "Adjustable Strap", "Chain Strap", "Crossbody Strap", "Backpack Straps", "Convertible"]',
    '["Без дръжка", "Къса дръжка", "Дълга каишка", "Регулируема каишка", "Верижка", "Кросбоди", "Раничени презрамки", "Трансформируема"]',
    3)
  ON CONFLICT DO NOTHING;
  
  -- Bag Closure
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Bag Closure', 'Закопчаване', 'select', false, true, 
    '["Zipper", "Magnetic Snap", "Flap/Turn Lock", "Drawstring", "Buckle", "Open Top", "Clasp", "Kiss Lock"]',
    '["Цип", "Магнитна копчка", "Капак/Завъртане", "Връв", "Катарама", "Отворен връх", "Закопчалка", "Рамкова закопчалка"]',
    4)
  ON CONFLICT DO NOTHING;
  
  -- Bag Features
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Bag Features', 'Характеристики', 'multiselect', false, true, 
    '["Laptop Compartment", "Multiple Pockets", "RFID Protection", "Waterproof", "Expandable", "USB Port", "Trolley Sleeve", "Organizer Pockets", "Padded Straps", "Removable Strap"]',
    '["Отделение за лаптоп", "Много джобове", "RFID защита", "Водоустойчива", "Разширяема", "USB порт", "За куфар", "Органайзер джобове", "Подплатени презрамки", "Сменяема каишка"]',
    5)
  ON CONFLICT DO NOTHING;
  
  -- Luggage Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Luggage Type', 'Тип куфар', 'select', false, true, 
    '["Cabin/Carry-On (up to 55cm)", "Medium (56-69cm)", "Large (70-79cm)", "Extra Large (80cm+)", "Set"]',
    '["Ръчен багаж (до 55см)", "Среден (56-69см)", "Голям (70-79см)", "Много голям (80см+)", "Комплект"]',
    6)
  ON CONFLICT DO NOTHING;
  
  -- Wheels
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Wheels', 'Колела', 'select', false, true, 
    '["No Wheels", "2 Wheels", "4 Wheels (Spinner)", "8 Wheels (Double Spinner)"]',
    '["Без колела", "2 колела", "4 колела (Spinner)", "8 колела (Двоен Spinner)"]',
    7)
  ON CONFLICT DO NOTHING;
  
  -- Laptop Size (for laptop bags)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (bags_id, 'Laptop Size Fits', 'Размер за лаптоп', 'select', false, true, 
    '["Up to 13\"", "Up to 14\"", "Up to 15.6\"", "Up to 17\"", "17\"+ "]',
    '["До 13\"", "До 14\"", "До 15.6\"", "До 17\"", "17\"+"]',
    8)
  ON CONFLICT DO NOTHING;
  
  -- ============================================================
  -- WATCHES - Specific Attributes
  -- ============================================================
  
  -- Watch Movement
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Watch Movement', 'Механизъм', 'select', false, true, 
    '["Quartz", "Automatic", "Mechanical (Manual Wind)", "Solar", "Kinetic", "Smart/Digital", "Hybrid"]',
    '["Кварцов", "Автоматичен", "Механичен (ръчно навиване)", "Слънчев", "Кинетичен", "Смарт/Дигитален", "Хибриден"]',
    1)
  ON CONFLICT DO NOTHING;
  
  -- Case Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Case Size', 'Размер на корпуса', 'select', false, true, 
    '["Small (Under 35mm)", "Medium (35-40mm)", "Standard (40-44mm)", "Large (44-48mm)", "Extra Large (48mm+)"]',
    '["Малък (под 35мм)", "Среден (35-40мм)", "Стандартен (40-44мм)", "Голям (44-48мм)", "Много голям (48мм+)"]',
    2)
  ON CONFLICT DO NOTHING;
  
  -- Case Material
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Case Material', 'Материал на корпуса', 'select', false, true, 
    '["Stainless Steel", "Gold", "Rose Gold", "Titanium", "Ceramic", "Carbon Fiber", "Plastic/Resin", "Bronze", "Platinum"]',
    '["Неръждаема стомана", "Злато", "Розово злато", "Титан", "Керамика", "Карбон", "Пластмаса/Резин", "Бронз", "Платина"]',
    3)
  ON CONFLICT DO NOTHING;
  
  -- Band Material
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Band Material', 'Материал на каишката', 'select', false, true, 
    '["Leather", "Stainless Steel", "Silicone/Rubber", "NATO/Canvas", "Mesh", "Ceramic", "Titanium", "Gold", "Alligator/Croc"]',
    '["Кожа", "Неръждаема стомана", "Силикон/Гума", "НАТО/Платно", "Мрежа", "Керамика", "Титан", "Злато", "Алигатор/Крокодил"]',
    4)
  ON CONFLICT DO NOTHING;
  
  -- Dial Color
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Dial Color', 'Цвят на циферблата', 'select', false, true, 
    '["Black", "White", "Blue", "Silver", "Gold", "Green", "Brown", "Gray", "Champagne", "Mother of Pearl", "Skeleton"]',
    '["Черен", "Бял", "Син", "Сребърен", "Златен", "Зелен", "Кафяв", "Сив", "Шампанско", "Седеф", "Скелетон"]',
    5)
  ON CONFLICT DO NOTHING;
  
  -- Water Resistance
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Water Resistance', 'Водоустойчивост', 'select', false, true, 
    '["Not Water Resistant", "30m (Splash)", "50m (Swimming)", "100m (Snorkeling)", "200m (Scuba)", "300m+ (Professional Dive)"]',
    '["Не е водоустойчив", "30м (Пръски)", "50м (Плуване)", "100м (Гмуркане)", "200м (Скуба)", "300м+ (Професионално гмуркане)"]',
    6)
  ON CONFLICT DO NOTHING;
  
  -- Watch Features
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Watch Features', 'Функции', 'multiselect', false, true, 
    '["Chronograph", "Date Display", "Day/Date", "Moon Phase", "GMT/Dual Time", "Alarm", "World Time", "Tourbillon", "Power Reserve", "Luminous", "Rotating Bezel", "Tachymeter"]',
    '["Хронограф", "Дата", "Ден/Дата", "Лунна фаза", "GMT/Двойно време", "Аларма", "Световно време", "Турбийон", "Резерв на мощността", "Луминесцентен", "Въртяща се рамка", "Тахиметър"]',
    7)
  ON CONFLICT DO NOTHING;
  
  -- Crystal Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Crystal Type', 'Тип стъкло', 'select', false, true, 
    '["Sapphire Crystal", "Mineral Crystal", "Hardlex", "Acrylic/Plastic", "Sapphire Coated"]',
    '["Сапфирено стъкло", "Минерално стъкло", "Хардлекс", "Акрил/Пластмаса", "Сапфирено покритие"]',
    8)
  ON CONFLICT DO NOTHING;
  
  -- Watch Style
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Watch Style', 'Стил на часовника', 'select', false, true, 
    '["Dress", "Sport", "Dive", "Pilot/Aviation", "Field/Military", "Racing", "Casual", "Smart", "Vintage", "Luxury"]',
    '["Официален", "Спортен", "Водолазен", "Пилотски/Авиационен", "Полеви/Военен", "Състезателен", "Ежедневен", "Смарт", "Винтидж", "Луксозен"]',
    9)
  ON CONFLICT DO NOTHING;
  
  -- Watch Brand (select)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (watches_id, 'Watch Brand', 'Марка часовник', 'select', false, true, 
    '["Rolex", "Omega", "Cartier", "Tag Heuer", "Breitling", "Patek Philippe", "Audemars Piguet", "IWC", "Tudor", "Longines", "Tissot", "Seiko", "Citizen", "Casio", "G-Shock", "Fossil", "Michael Kors", "Apple", "Samsung", "Garmin", "Fitbit", "Daniel Wellington", "Swatch", "Timex", "Orient", "Other"]',
    '["Rolex", "Omega", "Cartier", "Tag Heuer", "Breitling", "Patek Philippe", "Audemars Piguet", "IWC", "Tudor", "Longines", "Tissot", "Seiko", "Citizen", "Casio", "G-Shock", "Fossil", "Michael Kors", "Apple", "Samsung", "Garmin", "Fitbit", "Daniel Wellington", "Swatch", "Timex", "Orient", "Друга"]',
    10)
  ON CONFLICT DO NOTHING;
  
  -- ============================================================
  -- ACCESSORIES - Specific Attributes
  -- ============================================================
  
  -- Belt Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Belt Size', 'Размер колан', 'select', false, true, 
    '["XS (70-80cm)", "S (80-90cm)", "M (90-100cm)", "L (100-110cm)", "XL (110-120cm)", "XXL (120-130cm)", "One Size/Adjustable"]',
    '["XS (70-80см)", "S (80-90см)", "M (90-100см)", "L (100-110см)", "XL (110-120см)", "XXL (120-130см)", "Един размер/Регулируем"]',
    1)
  ON CONFLICT DO NOTHING;
  
  -- Belt Width
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Belt Width', 'Ширина на колана', 'select', false, true, 
    '["Thin (Under 2.5cm)", "Medium (2.5-3.5cm)", "Wide (3.5-4.5cm)", "Extra Wide (4.5cm+)"]',
    '["Тънък (под 2.5см)", "Среден (2.5-3.5см)", "Широк (3.5-4.5см)", "Много широк (4.5см+)"]',
    2)
  ON CONFLICT DO NOTHING;
  
  -- Sunglasses Lens Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Lens Type', 'Тип лещи', 'select', false, true, 
    '["Standard", "Polarized", "Mirrored", "Gradient", "Photochromic", "Blue Light Blocking", "Prescription Ready"]',
    '["Стандартни", "Поляризирани", "Огледални", "Градиентни", "Фотохромни", "Блокиращи синя светлина", "За диоптри"]',
    3)
  ON CONFLICT DO NOTHING;
  
  -- Frame Material (for sunglasses)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Frame Material', 'Материал на рамката', 'select', false, true, 
    '["Plastic/Acetate", "Metal", "Titanium", "Wood", "Carbon Fiber", "Combination"]',
    '["Пластмаса/Ацетат", "Метал", "Титан", "Дърво", "Карбон", "Комбинация"]',
    4)
  ON CONFLICT DO NOTHING;
  
  -- UV Protection
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'UV Protection', 'UV защита', 'select', false, true, 
    '["UV400", "100% UV Protection", "Partial UV Protection", "Unknown"]',
    '["UV400", "100% UV защита", "Частична UV защита", "Неизвестно"]',
    5)
  ON CONFLICT DO NOTHING;
  
  -- Scarf Material
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Scarf Material', 'Материал на шала', 'select', false, true, 
    '["Silk", "Cashmere", "Wool", "Cotton", "Linen", "Acrylic", "Viscose", "Blend"]',
    '["Коприна", "Кашмир", "Вълна", "Памук", "Лен", "Акрил", "Вискоза", "Смес"]',
    6)
  ON CONFLICT DO NOTHING;
  
  -- Glove Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Glove Size', 'Размер ръкавици', 'select', false, true, 
    '["XS", "S", "M", "L", "XL", "XXL", "One Size"]',
    '["XS", "S", "M", "L", "XL", "XXL", "Един размер"]',
    7)
  ON CONFLICT DO NOTHING;
  
  -- Hat Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (accessories_id, 'Hat Size', 'Размер шапка', 'select', false, true, 
    '["XS (53-54cm)", "S (55-56cm)", "M (57-58cm)", "L (59-60cm)", "XL (61-62cm)", "One Size/Adjustable"]',
    '["XS (53-54см)", "S (55-56см)", "M (57-58см)", "L (59-60см)", "XL (61-62см)", "Един размер/Регулируем"]',
    8)
  ON CONFLICT DO NOTHING;
  
END $$;
;
