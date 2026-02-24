
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4B: BUILDING & CONDITION ATTRIBUTES
-- Bulgarian market specific: панел, ЕПК, тухла, Акт 16
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Year Built
    (v_real_estate_id, 'Year Built', 'Година на строеж', 'select', false, true,
     '["Before 1950", "1950-1970", "1971-1990", "1991-2000", "2001-2010", "2011-2015", "2016-2020", "2021-2023", "2024", "2025", "Under Construction"]'::jsonb,
     '["Преди 1950", "1950-1970", "1971-1990", "1991-2000", "2001-2010", "2011-2015", "2016-2020", "2021-2023", "2024", "2025", "В строеж"]'::jsonb,
     'Year of construction', 'Година на строителство', 14),
    
    -- Construction Type (Bulgarian specific)
    (v_real_estate_id, 'Construction Type', 'Тип строителство', 'select', true, true,
     '["Panel", "Brick", "EPK", "Reinforced Concrete", "Wood", "Stone", "Mixed", "Steel Frame", "Prefab", "Other"]'::jsonb,
     '["Панел", "Тухла", "ЕПК", "Стоманобетон", "Дърво", "Камък", "Смесено", "Метална конструкция", "Сглобяемо", "Друго"]'::jsonb,
     'Type of construction', 'Тип на строителството', 15),
    
    -- Property Condition
    (v_real_estate_id, 'Property Condition', 'Състояние', 'select', true, true,
     '["New Build", "Excellent", "Very Good", "Good", "Satisfactory", "Needs Renovation", "For Demolition", "Under Renovation"]'::jsonb,
     '["Ново строителство", "Отлично", "Много добро", "Добро", "Задоволително", "За ремонт", "За събаряне", "В ремонт"]'::jsonb,
     'Property condition', 'Състояние на имота', 16),
    
    -- Act 16 Status (Bulgarian specific - crucial!)
    (v_real_estate_id, 'Act 16 Status', 'Статут Акт 16', 'select', true, true,
     '["With Act 16", "Without Act 16", "Act 14", "Act 15", "In Progress", "Not Applicable"]'::jsonb,
     '["С Акт 16", "Без Акт 16", "Акт 14", "Акт 15", "В процес", "Неприложимо"]'::jsonb,
     'Act 16 completion status', 'Статут на Акт 16', 17),
    
    -- Furnishing Level
    (v_real_estate_id, 'Furnishing', 'Обзавеждане', 'select', true, true,
     '["Unfurnished", "Partially Furnished", "Fully Furnished", "Luxury Furnished", "Semi-Furnished"]'::jsonb,
     '["Необзаведен", "Частично обзаведен", "Напълно обзаведен", "Луксозно обзаведен", "Полуобзаведен"]'::jsonb,
     'Furnishing level', 'Ниво на обзавеждане', 18),
    
    -- Renovation Status
    (v_real_estate_id, 'Renovation Status', 'Ремонт', 'select', false, true,
     '["Not Renovated", "Cosmetic Renovation", "Partial Renovation", "Full Renovation", "Newly Renovated", "Designer Renovation"]'::jsonb,
     '["Без ремонт", "Козметичен ремонт", "Частичен ремонт", "Основен ремонт", "Ново ремонтиран", "Дизайнерски ремонт"]'::jsonb,
     'Renovation status', 'Статус на ремонта', 19),
    
    -- Building Type
    (v_real_estate_id, 'Building Type', 'Вид сграда', 'select', false, true,
     '["Residential Building", "Commercial Building", "Mixed Use", "Detached House", "Villa Complex", "Apartment Complex", "Industrial Building", "Historic Building"]'::jsonb,
     '["Жилищна сграда", "Търговска сграда", "Смесено ползване", "Самостоятелна къща", "Комплекс вили", "Жилищен комплекс", "Промишлена сграда", "Историческа сграда"]'::jsonb,
     'Type of building', 'Вид на сградата', 20),
    
    -- Apartment Position
    (v_real_estate_id, 'Apartment Position', 'Позиция', 'select', false, true,
     '["Street Facing", "Yard Facing", "Corner", "Through", "Single-Sided"]'::jsonb,
     '["Към улицата", "Към двора", "Ъглов", "Проходен", "Едностранен"]'::jsonb,
     'Position in building', 'Позиция в сградата', 21),
    
    -- Number of Levels
    (v_real_estate_id, 'Property Levels', 'Нива на имота', 'select', false, true,
     '["1 Level", "2 Levels", "3 Levels", "4+ Levels"]'::jsonb,
     '["1 ниво", "2 нива", "3 нива", "4+ нива"]'::jsonb,
     'Number of levels', 'Брой нива', 22);
END $$;
;
