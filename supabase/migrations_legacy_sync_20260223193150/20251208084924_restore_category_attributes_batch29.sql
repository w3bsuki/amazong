DO $$
DECLARE
    v_category_id UUID;
BEGIN
    -- Food & Grocery - Fresh Produce
    SELECT id INTO v_category_id FROM categories WHERE slug = 'fresh-produce' OR slug = 'produce' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Fruits", "Vegetables", "Herbs", "Mushrooms", "Salads"]', '["Плодове", "Зеленчуци", "Подправки", "Гъби", "Салати"]', 1),
            (v_category_id, 'Organic', 'Органичен', 'boolean', false, true, NULL, NULL, 2),
            (v_category_id, 'Origin', 'Произход', 'select', false, true, '["Local", "Bulgarian", "Imported", "EU"]', '["Местен", "Български", "Вносен", "ЕС"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Food & Grocery - Dairy
    SELECT id INTO v_category_id FROM categories WHERE slug = 'dairy' OR slug = 'dairy-products' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Milk", "Cheese", "Yogurt", "Butter", "Cream", "Eggs"]', '["Мляко", "Сирене", "Кисело мляко", "Масло", "Сметана", "Яйца"]', 1),
            (v_category_id, 'Fat Content', 'Масленост', 'select', false, true, '["Fat-Free", "Low-Fat", "Regular", "Full-Fat"]', '["Обезмаслено", "Нискомаслено", "Обикновено", "Пълномаслено"]', 2),
            (v_category_id, 'Lactose-Free', 'Без лактоза', 'boolean', false, true, NULL, NULL, 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Food & Grocery - Bakery
    SELECT id INTO v_category_id FROM categories WHERE slug = 'bakery' OR slug = 'bakery-products' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Bread", "Pastries", "Cakes", "Cookies", "Pies", "Bagels"]', '["Хляб", "Тестени", "Торти", "Бисквити", "Пайове", "Гевреци"]', 1),
            (v_category_id, 'Dietary', 'Диетично', 'multiselect', false, true, '["Gluten-Free", "Whole Grain", "Sugar-Free", "Vegan", "Low-Carb"]', '["Без глутен", "Пълнозърнест", "Без захар", "Веган", "Нисковъглехидратен"]', 2)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Food & Grocery - Beverages
    SELECT id INTO v_category_id FROM categories WHERE slug = 'beverages' OR slug = 'drinks' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Beverage Type', 'Тип напитка', 'select', true, true, '["Water", "Soft Drinks", "Juice", "Coffee", "Tea", "Energy Drinks", "Sports Drinks"]', '["Вода", "Безалкохолни", "Сок", "Кафе", "Чай", "Енергийни", "Спортни"]', 1),
            (v_category_id, 'Size', 'Размер', 'select', false, true, '["Small (< 500ml)", "Medium (500ml-1L)", "Large (1-2L)", "Multi-Pack"]', '["Малък (< 500мл)", "Среден (500мл-1л)", "Голям (1-2л)", "Пакет"]', 2),
            (v_category_id, 'Sugar Content', 'Захар', 'select', false, true, '["Regular", "Low Sugar", "Sugar-Free", "Diet"]', '["Обикновен", "Нискозахарен", "Без захар", "Диетичен"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Food & Grocery - Meat & Seafood
    SELECT id INTO v_category_id FROM categories WHERE slug = 'meat-seafood' OR slug = 'meat' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Type', 'Тип', 'select', true, true, '["Beef", "Pork", "Chicken", "Turkey", "Lamb", "Fish", "Seafood", "Game"]', '["Телешко", "Свинско", "Пилешко", "Пуешко", "Агнешко", "Риба", "Морски дарове", "Дивеч"]', 1),
            (v_category_id, 'Cut', 'Разфасовка', 'select', false, true, '["Whole", "Fillet", "Steak", "Ground", "Cubed", "Sliced"]', '["Цяло", "Филе", "Стек", "Кайма", "На кубчета", "Нарязано"]', 2),
            (v_category_id, 'Preparation', 'Обработка', 'select', false, true, '["Fresh", "Frozen", "Smoked", "Cured", "Marinated"]', '["Прясно", "Замразено", "Пушено", "Осолено", "Мариновано"]', 3)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Collectibles - Coins
    SELECT id INTO v_category_id FROM categories WHERE slug = 'coins' OR slug = 'coin-collecting' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Coin Type', 'Тип монета', 'select', true, true, '["Circulated", "Uncirculated", "Proof", "Commemorative", "Bullion", "Ancient"]', '["Циркулационна", "Нециркулационна", "Пруф", "Възпоменателна", "Кюлче", "Антична"]', 1),
            (v_category_id, 'Metal', 'Метал', 'select', false, true, '["Gold", "Silver", "Copper", "Bronze", "Nickel", "Mixed"]', '["Злато", "Сребро", "Мед", "Бронз", "Никел", "Смесен"]', 2),
            (v_category_id, 'Year', 'Година', 'number', false, true, NULL, NULL, 3),
            (v_category_id, 'Grade', 'Състояние', 'select', false, true, '["Poor", "Fair", "Good", "Very Good", "Fine", "Very Fine", "Extremely Fine", "Uncirculated"]', '["Лошо", "Задоволително", "Добро", "Много добро", "Отлично", "Превъзходно", "Изключително", "Нециркулационно"]', 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Collectibles - Stamps
    SELECT id INTO v_category_id FROM categories WHERE slug = 'stamps' OR slug = 'stamp-collecting' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Stamp Type', 'Тип марка', 'select', true, true, '["Definitive", "Commemorative", "Special", "Airmail", "Revenue", "First Day Cover"]', '["Стандартна", "Възпоменателна", "Специална", "Въздушна поща", "Гербова", "Първи ден"]', 1),
            (v_category_id, 'Condition', 'Състояние', 'select', false, true, '["Mint", "Used", "Cancelled", "Hinged", "Never Hinged"]', '["Нова", "Използвана", "Погасена", "С марка", "Без марка"]', 2),
            (v_category_id, 'Country', 'Държава', 'text', false, true, NULL, NULL, 3),
            (v_category_id, 'Year', 'Година', 'number', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;

    -- Collectibles - Trading Cards
    SELECT id INTO v_category_id FROM categories WHERE slug = 'trading-cards' LIMIT 1;
    IF v_category_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
        VALUES 
            (v_category_id, 'Card Game', 'Игра', 'select', true, true, '["Pokemon", "Magic: The Gathering", "Yu-Gi-Oh!", "Sports Cards", "Other"]', '["Покемон", "Magic", "Yu-Gi-Oh!", "Спортни", "Друга"]', 1),
            (v_category_id, 'Condition', 'Състояние', 'select', false, true, '["Mint", "Near Mint", "Excellent", "Good", "Played"]', '["Мента", "Почти мента", "Отлично", "Добро", "Играно"]', 2),
            (v_category_id, 'Rarity', 'Рядкост', 'select', false, true, '["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare"]', '["Обикновена", "Необикновена", "Рядка", "Ултра рядка", "Секретна"]', 3),
            (v_category_id, 'Graded', 'Оценена', 'boolean', false, true, NULL, NULL, 4)
        ON CONFLICT (name, category_id) DO NOTHING;
    END IF;
END $$;;
