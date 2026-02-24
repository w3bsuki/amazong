
-- ==============================================
-- JEWELRY & WATCHES - DIAMOND 4C's & WATCH ATTRIBUTES
-- Date: December 4, 2025
-- ==============================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
    -- Diamond Cut Grade
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Diamond Cut Grade', 'Качество на шлифовката', 'select', false, true,
     '["Excellent/Ideal", "Very Good", "Good", "Fair", "Poor", "N/A (Fancy Shape)", "Unknown"]'::jsonb,
     '["Отличен/Идеален", "Много добър", "Добър", "Задоволителен", "Слаб", "Неприложимо (фантазийна форма)", "Неизвестно"]'::jsonb, 26),
     
    -- Diamond Color Grade
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Diamond Color Grade', 'Цвят на диаманта', 'select', false, true,
     '["D (Colorless)", "E (Colorless)", "F (Colorless)", "G (Near Colorless)", "H (Near Colorless)", "I (Near Colorless)", "J (Near Colorless)", "K (Faint Yellow)", "L (Faint Yellow)", "M-Z (Light Yellow)", "Fancy Yellow", "Fancy Blue", "Fancy Pink", "Fancy Other", "Unknown"]'::jsonb,
     '["D (безцветен)", "E (безцветен)", "F (безцветен)", "G (почти безцветен)", "H (почти безцветен)", "I (почти безцветен)", "J (почти безцветен)", "K (бледо жълт)", "L (бледо жълт)", "M-Z (светло жълт)", "Фантазиен жълт", "Фантазиен син", "Фантазиен розов", "Фантазиен друг", "Неизвестен"]'::jsonb, 27),
     
    -- Diamond Clarity Grade
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Diamond Clarity Grade', 'Чистота на диаманта', 'select', false, true,
     '["FL (Flawless)", "IF (Internally Flawless)", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3", "Unknown"]'::jsonb,
     '["FL (безупречен)", "IF (вътрешно безупречен)", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3", "Неизвестна"]'::jsonb, 28),
     
    -- Stone Treatment
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Stone Treatment', 'Обработка на камъка', 'select', false, true,
     '["None (Natural)", "Heat Treated", "Irradiated", "Fracture Filled", "Laser Drilled", "HPHT", "Dyed", "Coated", "Glass Filled", "Oiled (Emerald)", "Lab-Created", "Unknown"]'::jsonb,
     '["Без (естествен)", "Термично обработен", "Облъчен", "Запълнени пукнатини", "Лазерно пробит", "HPHT", "Боядисан", "Покрит", "Запълнен със стъкло", "Омаслен (изумруд)", "Лабораторно създаден", "Неизвестна"]'::jsonb, 29),

    -- Watch Brand
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Watch Brand', 'Марка часовник', 'select', false, true,
     '["Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Cartier", "IWC", "Jaeger-LeCoultre", "Breitling", "TAG Heuer", "Tudor", "Grand Seiko", "Seiko", "Citizen", "Casio", "G-Shock", "Tissot", "Longines", "Hamilton", "Oris", "Bell & Ross", "Panerai", "Hublot", "Zenith", "Vacheron Constantin", "A. Lange & Söhne", "Blancpain", "Breguet", "Chopard", "Ulysse Nardin", "Bulgari", "Montblanc", "Swatch", "Fossil", "Michael Kors", "Apple", "Samsung", "Garmin", "Fitbit", "Timex", "Invicta", "Orient", "Other"]'::jsonb,
     '["Ролекс", "Омега", "Патек Филип", "Одемар Пиге", "Картие", "IWC", "Жежер-Льо Култр", "Брайтлинг", "ТАГ Хойер", "Тюдор", "Гранд Сейко", "Сейко", "Ситизен", "Касио", "Джи-Шок", "Тисо", "Лонжин", "Хамилтън", "Орис", "Бел и Рос", "Панераи", "Юбло", "Зенит", "Вашерон Константин", "А. Ланге и Сьоне", "Бланпен", "Бреге", "Шопар", "Улис Нарден", "Булгари", "Монблан", "Суотч", "Фосил", "Майкъл Корс", "Епъл", "Самсунг", "Гармин", "Фитбит", "Таймекс", "Инвикта", "Ориент", "Друга"]'::jsonb, 32),
     
    -- Case Material
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Case Material', 'Материал на корпуса', 'select', false, true,
     '["Stainless Steel", "Yellow Gold", "Rose Gold", "White Gold", "Platinum", "Titanium", "Ceramic", "Carbon Fiber", "Bronze", "PVD Coated", "Two-Tone", "Plastic/Resin", "Silver", "Tungsten"]'::jsonb,
     '["Неръждаема стомана", "Жълто злато", "Розово злато", "Бяло злато", "Платина", "Титан", "Керамика", "Въглеродни влакна", "Бронз", "PVD покритие", "Двуцветен", "Пластмаса/Смола", "Сребро", "Волфрам"]'::jsonb, 33),
     
    -- Case Diameter
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Case Diameter (mm)', 'Диаметър на корпуса (мм)', 'select', false, true,
     '["Under 30mm", "30-33mm", "34-36mm", "37-39mm", "40-41mm", "42-43mm", "44-45mm", "46-47mm", "48mm+"]'::jsonb,
     '["Под 30мм", "30-33мм", "34-36мм", "37-39мм", "40-41мм", "42-43мм", "44-45мм", "46-47мм", "48мм+"]'::jsonb, 34),
     
    -- Dial Color
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Dial Color', 'Цвят на циферблата', 'select', false, true,
     '["Black", "White", "Silver", "Blue", "Green", "Champagne", "Gold", "Brown", "Grey", "Red", "Mother of Pearl", "Skeleton", "Other"]'::jsonb,
     '["Черен", "Бял", "Сребрист", "Син", "Зелен", "Шампанско", "Златист", "Кафяв", "Сив", "Червен", "Седеф", "Скелетон", "Друг"]'::jsonb, 36),
     
    -- Crystal Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Crystal Type', 'Тип стъкло', 'select', false, true,
     '["Sapphire Crystal", "Mineral Crystal", "Acrylic/Hesalite", "Hardlex", "Plexiglass"]'::jsonb,
     '["Сапфирено стъкло", "Минерално стъкло", "Акрилно/Хезалит", "Хардлекс", "Плексиглас"]'::jsonb, 37);
;
