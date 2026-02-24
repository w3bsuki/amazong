-- Phase 4: PETS Category Attributes (Part 2) - More Specific Attributes
DO $$
DECLARE
    pets_id UUID;
BEGIN
    SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
    
    -- Toy Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Toy Type', 'Тип играчка', 'select',
            '["Chew Toys", "Fetch Toys", "Tug Toys", "Interactive", "Puzzle", "Plush", "Squeaky", "Ball", "Rope", "Teething", "Catnip", "Feather", "Laser", "Electronic"]',
            '["За дъвчене", "За хвърляне", "За дърпане", "Интерактивни", "Пъзел", "Плюшени", "Пищящи", "Топка", "Въже", "За зъбки", "Коча билка", "Пера", "Лазер", "Електронни"]',
            false, true, 11)
    ON CONFLICT DO NOTHING;
    
    -- Durability
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Durability', 'Издръжливост', 'select',
            '["Light Chewers", "Moderate Chewers", "Aggressive Chewers", "Indestructible"]',
            '["Леко дъвчене", "Умерено дъвчене", "Агресивно дъвчене", "Неразрушими"]',
            false, true, 12)
    ON CONFLICT DO NOTHING;
    
    -- Collar/Harness Size
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Collar Size', 'Размер на нашийник', 'select',
            '["XXS (6-9 inches)", "XS (8-12 inches)", "S (10-14 inches)", "M (14-18 inches)", "L (18-22 inches)", "XL (22-26 inches)", "XXL (26+ inches)"]',
            '["XXS (15-23 см)", "XS (20-30 см)", "S (25-36 см)", "M (36-46 см)", "L (46-56 см)", "XL (56-66 см)", "XXL (66+ см)"]',
            false, true, 13)
    ON CONFLICT DO NOTHING;
    
    -- Bed Size
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Bed Size', 'Размер на легло', 'select',
            '["Small (Up to 25 lbs)", "Medium (25-50 lbs)", "Large (50-75 lbs)", "Extra Large (75+ lbs)", "Giant"]',
            '["Малко (до 11 кг)", "Средно (11-23 кг)", "Голямо (23-34 кг)", "Много голямо (34+ кг)", "Гигантско"]',
            false, true, 14)
    ON CONFLICT DO NOTHING;
    
    -- Bed Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Bed Type', 'Тип легло', 'select',
            '["Bolster", "Donut/Cuddler", "Flat/Mat", "Orthopedic", "Elevated/Cot", "Cave/Hooded", "Heated", "Cooling", "Travel", "Outdoor"]',
            '["С борд", "Кръгло/Прегръдка", "Плоско/Постелка", "Ортопедично", "Повдигнато", "Пещера/С качулка", "Отопляемо", "Охлаждащо", "За пътуване", "За открито"]',
            false, true, 15)
    ON CONFLICT DO NOTHING;
    
    -- Aquarium Size
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Aquarium Size', 'Размер на аквариум', 'select',
            '["Nano (Under 10 gal)", "Small (10-29 gal)", "Medium (30-55 gal)", "Large (56-100 gal)", "Extra Large (100+ gal)"]',
            '["Нано (под 40 л)", "Малък (40-110 л)", "Среден (115-210 л)", "Голям (210-380 л)", "Много голям (380+ л)"]',
            false, true, 16)
    ON CONFLICT DO NOTHING;
    
    -- Water Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Water Type', 'Тип вода', 'select',
            '["Freshwater", "Saltwater/Marine", "Brackish", "Pond"]',
            '["Сладководен", "Соленоводен/Морски", "Бракичен", "Езерен"]',
            false, true, 17)
    ON CONFLICT DO NOTHING;
    
    -- Cage/Habitat Size
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Habitat Size', 'Размер на местообитание', 'select',
            '["Small", "Medium", "Large", "Extra Large", "Custom/Modular"]',
            '["Малко", "Средно", "Голямо", "Много голямо", "Персонализирано/Модулно"]',
            false, true, 18)
    ON CONFLICT DO NOTHING;
    
    -- Leash Length
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Leash Length', 'Дължина на каишка', 'select',
            '["4 ft", "5 ft", "6 ft", "8 ft", "10 ft", "15 ft", "20+ ft", "Retractable"]',
            '["1.2 м", "1.5 м", "1.8 м", "2.4 м", "3 м", "4.5 м", "6+ м", "Разтегателна"]',
            false, true, 19)
    ON CONFLICT DO NOTHING;
    
    -- Health Condition/Benefit
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Health Benefit', 'Здравна полза', 'multiselect',
            '["Joint Health", "Skin & Coat", "Digestive Health", "Immune Support", "Heart Health", "Dental Health", "Weight Management", "Calming/Anxiety", "Mobility", "Senior Support", "Puppy/Kitten Development"]',
            '["Здраве на ставите", "Кожа и козина", "Храносмилателно здраве", "Имунна подкрепа", "Сърдечно здраве", "Здраве на зъбите", "Контрол на теглото", "Успокояване/Тревожност", "Подвижност", "Подкрепа за възрастни", "Развитие на малки"]',
            false, true, 20)
    ON CONFLICT DO NOTHING;
END $$;;
