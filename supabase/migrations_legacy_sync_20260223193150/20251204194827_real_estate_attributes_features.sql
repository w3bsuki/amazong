
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4D: FEATURES & AMENITIES ATTRIBUTES
-- Heating, cooling, parking, outdoor spaces
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Heating Type (Bulgarian specific - ТЕЦ important!)
    (v_real_estate_id, 'Heating Type', 'Отопление', 'select', true, true,
     '["Central Heating (TEC)", "Gas Boiler", "Electric Heating", "Air Conditioner", "Fireplace", "Pellet Stove", "Floor Heating", "Heat Pump", "Wood Stove", "No Heating", "Mixed"]'::jsonb,
     '["ТЕЦ (парно)", "Газов котел", "Електрическо", "Климатик", "Камина", "Пелетна печка", "Подово отопление", "Термопомпа", "Печка на дърва", "Без отопление", "Смесено"]'::jsonb,
     'Type of heating', 'Тип отопление', 32),
    
    -- Air Conditioning
    (v_real_estate_id, 'Air Conditioning', 'Климатик', 'select', false, true,
     '["Yes - All Rooms", "Yes - Some Rooms", "Central AC", "VRV System", "No", "Prepared for AC"]'::jsonb,
     '["Да - във всички стаи", "Да - в някои стаи", "Централен климатик", "VRV система", "Не", "Подготовка за климатик"]'::jsonb,
     'Air conditioning', 'Климатична инсталация', 33),
    
    -- Elevator
    (v_real_estate_id, 'Elevator', 'Асансьор', 'select', false, true,
     '["Yes", "No", "2 Elevators", "Freight Elevator", "Panoramic Elevator"]'::jsonb,
     '["Да", "Не", "2 асансьора", "Товарен асансьор", "Панорамен асансьор"]'::jsonb,
     'Elevator availability', 'Наличие на асансьор', 34),
    
    -- Parking
    (v_real_estate_id, 'Parking', 'Паркиране', 'select', false, true,
     '["Garage", "Underground Parking", "Outdoor Parking", "Street Parking", "No Parking", "Parking Lot", "Multiple Spots"]'::jsonb,
     '["Гараж", "Подземен паркинг", "Открит паркинг", "Улично паркиране", "Без паркинг", "Паркинг място", "Няколко места"]'::jsonb,
     'Parking type', 'Тип паркиране', 35),
    
    -- Balcony/Terrace
    (v_real_estate_id, 'Balcony/Terrace', 'Балкон/Тераса', 'select', false, true,
     '["Balcony", "Terrace", "Multiple Balconies", "Large Terrace", "Rooftop Terrace", "Loggia", "French Balcony", "No Balcony"]'::jsonb,
     '["Балкон", "Тераса", "Няколко балкона", "Голяма тераса", "Покривна тераса", "Лоджия", "Френски балкон", "Без балкон"]'::jsonb,
     'Balcony or terrace', 'Балкон или тераса', 36),
    
    -- Garden
    (v_real_estate_id, 'Garden', 'Градина', 'select', false, true,
     '["Private Garden", "Shared Garden", "Roof Garden", "Landscaped Garden", "No Garden"]'::jsonb,
     '["Частна градина", "Обща градина", "Покривна градина", "Озеленена градина", "Без градина"]'::jsonb,
     'Garden availability', 'Наличие на градина', 37),
    
    -- Pool
    (v_real_estate_id, 'Pool', 'Басейн', 'select', false, true,
     '["Private Indoor Pool", "Private Outdoor Pool", "Shared Pool", "Infinity Pool", "No Pool"]'::jsonb,
     '["Частен закрит басейн", "Частен открит басейн", "Общ басейн", "Инфинити басейн", "Без басейн"]'::jsonb,
     'Pool availability', 'Наличие на басейн', 38),
    
    -- Storage
    (v_real_estate_id, 'Storage', 'Мазе/Таван', 'select', false, true,
     '["Basement Storage", "Attic Storage", "Both", "Storage Room", "No Storage"]'::jsonb,
     '["Мазе", "Таван", "Мазе и таван", "Складово помещение", "Без склад"]'::jsonb,
     'Storage availability', 'Наличие на склад', 39),
    
    -- Windows
    (v_real_estate_id, 'Windows', 'Дограма', 'select', false, true,
     '["PVC", "Aluminum", "Wood", "Wood-Aluminum", "Old Wooden", "Triple Glazed"]'::jsonb,
     '["PVC", "Алуминий", "Дърво", "Дърво-алуминий", "Стара дървена", "Троен стъклопакет"]'::jsonb,
     'Window type', 'Тип дограма', 40),
    
    -- Flooring
    (v_real_estate_id, 'Flooring', 'Подови настилки', 'multiselect', false, true,
     '["Laminate", "Parquet", "Tiles", "Marble", "Granite", "Carpet", "Vinyl", "Concrete", "Heated Floor"]'::jsonb,
     '["Ламинат", "Паркет", "Теракот", "Мрамор", "Гранит", "Мокет", "Винил", "Бетон", "Подово отопление"]'::jsonb,
     'Floor types', 'Типове настилки', 41),
    
    -- Interior Features
    (v_real_estate_id, 'Interior Features', 'Вътрешни удобства', 'multiselect', false, true,
     '["Built-in Wardrobes", "Walk-in Closet", "Laundry Room", "Dressing Room", "Open Kitchen", "Kitchen Island", "Fireplace", "Home Office", "Security Door", "Intercom", "Video Intercom", "Smart Home"]'::jsonb,
     '["Вградени гардероби", "Гардеробна", "Мокро помещение", "Съблекалня", "Отворена кухня", "Кухненски остров", "Камина", "Домашен офис", "Бронирана врата", "Домофон", "Видеодомофон", "Смарт дом"]'::jsonb,
     'Interior features', 'Вътрешни характеристики', 42);
END $$;
;
