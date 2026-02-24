
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4H: ADDITIONAL ATTRIBUTES
-- Investment, agent, maintenance, and special features
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Maintenance Fee
    (v_real_estate_id, 'Monthly Maintenance', 'Месечна такса', 'select', false, true,
     '["No Fee", "Under 50 BGN", "50-100 BGN", "100-200 BGN", "200-500 BGN", "500-1000 BGN", "Over 1000 BGN"]'::jsonb,
     '["Без такса", "Под 50 лв", "50-100 лв", "100-200 лв", "200-500 лв", "500-1000 лв", "Над 1000 лв"]'::jsonb,
     'Monthly maintenance fee', 'Месечна такса поддръжка', 66),
    
    -- Investment Yield (for investment properties)
    (v_real_estate_id, 'Rental Yield', 'Доходност от наем', 'select', false, true,
     '["Under 3%", "3-5%", "5-7%", "7-10%", "Over 10%", "Not Applicable"]'::jsonb,
     '["Под 3%", "3-5%", "5-7%", "7-10%", "Над 10%", "Неприложимо"]'::jsonb,
     'Annual rental yield', 'Годишна доходност', 67),
    
    -- Current Rental Status
    (v_real_estate_id, 'Current Status', 'Текущ статус', 'select', false, true,
     '["Vacant", "Owner Occupied", "Tenant Occupied", "Short-Term Rental", "Under Renovation"]'::jsonb,
     '["Празен", "Обитаван от собственика", "Под наем", "Краткосрочен наем", "В ремонт"]'::jsonb,
     'Current occupancy status', 'Текущо състояние', 68),
    
    -- Seller Type
    (v_real_estate_id, 'Seller Type', 'Тип продавач', 'select', false, true,
     '["Owner (Private)", "Agency", "Developer", "Bank", "Company", "Court/Bailiff"]'::jsonb,
     '["Собственик (частен)", "Агенция", "Строител", "Банка", "Фирма", "Съд/ЧСИ"]'::jsonb,
     'Type of seller', 'Тип продавач', 69),
    
    -- Commission
    (v_real_estate_id, 'Agent Commission', 'Комисиона', 'select', false, false,
     '["No Commission", "1 Month Rent", "2%", "3%", "By Agreement", "Included"]'::jsonb,
     '["Без комисиона", "1 наем", "2%", "3%", "По договаряне", "Включена"]'::jsonb,
     'Agent commission', 'Комисиона на агента', 70),
    
    -- Virtual Tour Available
    (v_real_estate_id, 'Virtual Tour', 'Виртуална разходка', 'boolean', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Has virtual tour', 'Има виртуална разходка', 71),
    
    -- Video Available
    (v_real_estate_id, 'Video Tour', 'Видео обиколка', 'boolean', false, false,
     '[]'::jsonb, '[]'::jsonb,
     'Has video tour', 'Има видео обиколка', 72),
    
    -- Negotiable Price
    (v_real_estate_id, 'Price Negotiable', 'Цената е по договаряне', 'boolean', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Price is negotiable', 'Цената е по договаряне', 73),
    
    -- Urgent Sale
    (v_real_estate_id, 'Urgent Sale', 'Спешна продажба', 'boolean', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Urgent sale', 'Спешна продажба', 74),
    
    -- Exchange Possible
    (v_real_estate_id, 'Exchange Possible', 'Възможна замяна', 'boolean', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Exchange possible', 'Възможна замяна', 75);
END $$;
;
