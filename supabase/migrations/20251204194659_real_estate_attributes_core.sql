
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4A: CORE ATTRIBUTES (Property Basics & Size)
-- All attributes with bilingual support and proper schema
-- ============================================================================

-- Get the Real Estate root category ID
DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    -- Insert core property attributes
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Listing Type (Sale/Rent)
    (v_real_estate_id, 'Listing Type', 'Тип обява', 'select', true, true,
     '["For Sale", "For Rent", "For Lease", "Auction"]'::jsonb,
     '["Продава", "Под наем", "Дългосрочен наем", "Търг"]'::jsonb,
     'Select listing type', 'Изберете тип обява', 1),
    
    -- Property Type
    (v_real_estate_id, 'Property Type', 'Тип имот', 'select', true, true,
     '["Apartment", "House", "Villa", "Maisonette", "Penthouse", "Studio", "Office", "Shop", "Warehouse", "Land", "Garage", "Other"]'::jsonb,
     '["Апартамент", "Къща", "Вила", "Мезонет", "Пентхаус", "Студио", "Офис", "Магазин", "Склад", "Парцел", "Гараж", "Друго"]'::jsonb,
     'Select property type', 'Изберете тип имот', 2),
    
    -- Price
    (v_real_estate_id, 'Price', 'Цена', 'number', true, true,
     '[]'::jsonb, '[]'::jsonb,
     'Enter price in EUR or BGN', 'Въведете цена в EUR или лв.', 3),
    
    -- Price Currency
    (v_real_estate_id, 'Price Currency', 'Валута', 'select', true, true,
     '["EUR", "BGN", "USD"]'::jsonb,
     '["Евро", "Лева", "Долари"]'::jsonb,
     'Select currency', 'Изберете валута', 4),
    
    -- Price per sqm
    (v_real_estate_id, 'Price per sqm', 'Цена на кв.м', 'number', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Price per square meter', 'Цена на квадратен метър', 5),
    
    -- Total Area
    (v_real_estate_id, 'Total Area (sqm)', 'Обща площ (кв.м)', 'number', true, true,
     '[]'::jsonb, '[]'::jsonb,
     'Total area in sqm', 'Обща площ в кв.м', 6),
    
    -- Living Area
    (v_real_estate_id, 'Living Area (sqm)', 'Жилищна площ (кв.м)', 'number', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Living area in sqm', 'Жилищна площ в кв.м', 7),
    
    -- Plot Size
    (v_real_estate_id, 'Plot Size (sqm)', 'Площ парцел (кв.м)', 'number', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Plot/land size in sqm', 'Площ на парцела в кв.м', 8),
    
    -- Rooms
    (v_real_estate_id, 'Rooms', 'Стаи', 'select', true, true,
     '["Studio", "1", "2", "3", "4", "5", "6+"]'::jsonb,
     '["Студио", "1", "2", "3", "4", "5", "6+"]'::jsonb,
     'Number of rooms', 'Брой стаи', 9),
    
    -- Bedrooms
    (v_real_estate_id, 'Bedrooms', 'Спални', 'select', true, true,
     '["0", "1", "2", "3", "4", "5", "6+"]'::jsonb,
     '["0", "1", "2", "3", "4", "5", "6+"]'::jsonb,
     'Number of bedrooms', 'Брой спални', 10),
    
    -- Bathrooms
    (v_real_estate_id, 'Bathrooms', 'Бани', 'select', true, true,
     '["1", "2", "3", "4", "5+"]'::jsonb,
     '["1", "2", "3", "4", "5+"]'::jsonb,
     'Number of bathrooms', 'Брой бани', 11),
    
    -- Floor Number
    (v_real_estate_id, 'Floor Number', 'Етаж', 'select', false, true,
     '["Basement", "Ground", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11-15", "16-20", "21+", "Last"]'::jsonb,
     '["Сутерен", "Партер", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11-15", "16-20", "21+", "Последен"]'::jsonb,
     'Floor number', 'Номер на етажа', 12),
    
    -- Total Floors
    (v_real_estate_id, 'Total Floors in Building', 'Общо етажи в сградата', 'select', false, true,
     '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11-15", "16-20", "21+"]'::jsonb,
     '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11-15", "16-20", "21+"]'::jsonb,
     'Total floors', 'Общо етажи', 13);
END $$;
;
