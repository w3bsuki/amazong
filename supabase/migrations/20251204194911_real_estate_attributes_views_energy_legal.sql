
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4F: VIEWS, ENERGY & LEGAL ATTRIBUTES
-- Energy certificate, ownership, encumbrances
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Views
    (v_real_estate_id, 'View', 'Изглед', 'multiselect', false, true,
     '["Sea View", "Mountain View", "City View", "Park View", "Garden View", "River View", "Lake View", "Panoramic View", "Street View", "Yard View", "No Special View"]'::jsonb,
     '["Морска гледка", "Планинска гледка", "Градска гледка", "Паркова гледка", "Дворна гледка", "Речна гледка", "Езерна гледка", "Панорамна гледка", "Към улицата", "Към двора", "Без изглед"]'::jsonb,
     'Property views', 'Гледки от имота', 48),
    
    -- Exposure/Orientation
    (v_real_estate_id, 'Exposure', 'Изложение', 'multiselect', false, true,
     '["North", "South", "East", "West", "Northeast", "Northwest", "Southeast", "Southwest"]'::jsonb,
     '["Север", "Юг", "Изток", "Запад", "Североизток", "Северозапад", "Югоизток", "Югозапад"]'::jsonb,
     'Property exposure', 'Изложение на имота', 49),
    
    -- Energy Certificate
    (v_real_estate_id, 'Energy Rating', 'Енергиен клас', 'select', false, true,
     '["A+", "A", "B", "C", "D", "E", "F", "G", "Not Rated", "In Process"]'::jsonb,
     '["A+", "A", "B", "C", "D", "E", "F", "G", "Без сертификат", "В процес"]'::jsonb,
     'Energy efficiency rating', 'Енергийна ефективност', 50),
    
    -- Ownership Type
    (v_real_estate_id, 'Ownership Type', 'Вид собственост', 'select', false, true,
     '["Private Ownership", "Company Ownership", "State/Municipal", "Cooperative", "Right of Building", "Usufruct", "Shared Ownership"]'::jsonb,
     '["Частна собственост", "Фирмена собственост", "Държавна/Общинска", "Кооперативна", "Право на строеж", "Вещно право", "Споделена собственост"]'::jsonb,
     'Type of ownership', 'Вид собственост', 51),
    
    -- Title Status
    (v_real_estate_id, 'Title Status', 'Статус на собствеността', 'select', false, true,
     '["Clean Title", "Title Search Required", "Multiple Owners", "Inheritance in Progress", "Court Case Pending"]'::jsonb,
     '["Чиста собственост", "Изисква проверка", "Множество собственици", "В процес на наследство", "Съдебно дело"]'::jsonb,
     'Title status', 'Статус на собствеността', 52),
    
    -- Encumbrances
    (v_real_estate_id, 'Encumbrances', 'Тежести', 'select', false, true,
     '["No Encumbrances", "Mortgage", "Court Claim", "Tax Lien", "Right of Way", "Other Encumbrance"]'::jsonb,
     '["Без тежести", "Ипотека", "Съдебен иск", "Данъчна тежест", "Право на преминаване", "Друга тежест"]'::jsonb,
     'Property encumbrances', 'Тежести върху имота', 53),
    
    -- Available From
    (v_real_estate_id, 'Available From', 'Свободен от', 'select', false, true,
     '["Immediately", "Within 1 Month", "1-3 Months", "3-6 Months", "Upon Agreement", "After Completion"]'::jsonb,
     '["Веднага", "До 1 месец", "1-3 месеца", "3-6 месеца", "По договаряне", "След завършване"]'::jsonb,
     'Availability date', 'Дата на свободност', 54),
    
    -- Rental Terms (for rentals)
    (v_real_estate_id, 'Rental Terms', 'Условия за наем', 'select', false, true,
     '["Long-Term (1+ Year)", "Short-Term (Under 1 Year)", "Monthly", "Weekly", "Daily", "Negotiable"]'::jsonb,
     '["Дългосрочен (1+ год)", "Краткосрочен (под 1 год)", "Месечен", "Седмичен", "Дневен", "По договаряне"]'::jsonb,
     'Rental duration', 'Срок на наема', 55),
    
    -- Deposit
    (v_real_estate_id, 'Deposit Required', 'Депозит', 'select', false, true,
     '["1 Month", "2 Months", "3 Months", "Negotiable", "No Deposit"]'::jsonb,
     '["1 наем", "2 наема", "3 наема", "По договаряне", "Без депозит"]'::jsonb,
     'Deposit amount', 'Размер на депозита', 56);
END $$;
;
