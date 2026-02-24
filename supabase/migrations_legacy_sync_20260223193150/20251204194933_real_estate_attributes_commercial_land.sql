
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4G: COMMERCIAL & LAND SPECIFIC ATTRIBUTES
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Commercial Specific
    (v_real_estate_id, 'Commercial Use', 'Търговско ползване', 'select', false, true,
     '["Retail", "Office", "Restaurant", "Warehouse", "Production", "Service", "Medical", "Educational", "Mixed Use", "Other"]'::jsonb,
     '["Търговия", "Офис", "Ресторант", "Склад", "Производство", "Услуги", "Медицинско", "Образователно", "Смесено", "Друго"]'::jsonb,
     'Commercial use type', 'Вид търговско ползване', 57),
    
    -- Ceiling Height
    (v_real_estate_id, 'Ceiling Height', 'Височина таван', 'select', false, true,
     '["Under 2.5m", "2.5-3m", "3-4m", "4-6m", "6-8m", "Over 8m"]'::jsonb,
     '["Под 2.5м", "2.5-3м", "3-4м", "4-6м", "6-8м", "Над 8м"]'::jsonb,
     'Ceiling height', 'Височина на тавана', 58),
    
    -- Loading Dock
    (v_real_estate_id, 'Loading Facilities', 'Товарни съоръжения', 'multiselect', false, true,
     '["Loading Dock", "Ground Level Door", "Ramp", "Freight Elevator", "Overhead Crane", "Forklift Access"]'::jsonb,
     '["Товарна рампа", "Врата на ниво земя", "Рампа", "Товарен асансьор", "Мостов кран", "Достъп за мотокар"]'::jsonb,
     'Loading facilities', 'Товарни съоръжения', 59),
    
    -- Zoning
    (v_real_estate_id, 'Zoning', 'Предназначение', 'select', false, true,
     '["Residential", "Commercial", "Industrial", "Mixed", "Agricultural", "Recreational", "Special Purpose"]'::jsonb,
     '["Жилищно", "Търговско", "Промишлено", "Смесено", "Земеделско", "Рекреационно", "Специално"]'::jsonb,
     'Zoning designation', 'Предназначение на територията', 60),
    
    -- Land Specific
    (v_real_estate_id, 'Land Type', 'Вид земя', 'select', false, true,
     '["Building Plot (УПИ)", "Agricultural (Нива)", "Forest", "Pasture", "Vineyard", "Orchard", "Industrial", "Recreational"]'::jsonb,
     '["Парцел (УПИ)", "Земеделска (Нива)", "Горска", "Пасище", "Лозе", "Овощна градина", "Промишлена", "Рекреационна"]'::jsonb,
     'Type of land', 'Вид земя', 61),
    
    -- Regulation Status
    (v_real_estate_id, 'Regulation Status', 'Регулация', 'select', false, true,
     '["Regulated (В регулация)", "Unregulated (Извън регулация)", "Pending Regulation", "Agricultural Only"]'::jsonb,
     '["В регулация", "Извън регулация", "В процес на регулация", "Само земеделска"]'::jsonb,
     'Regulation status', 'Статут на регулация', 62),
    
    -- Terrain
    (v_real_estate_id, 'Terrain', 'Терен', 'select', false, true,
     '["Flat", "Slight Slope", "Moderate Slope", "Steep", "Terraced", "Mixed"]'::jsonb,
     '["Равен", "Лек наклон", "Умерен наклон", "Стръмен", "Терасиран", "Смесен"]'::jsonb,
     'Terrain type', 'Вид терен', 63),
    
    -- Road Access
    (v_real_estate_id, 'Road Access', 'Достъп до път', 'select', false, true,
     '["Asphalt Road", "Paved Road", "Gravel Road", "Dirt Road", "No Direct Access", "Highway Access"]'::jsonb,
     '["Асфалтов път", "Павиран път", "Чакълен път", "Черен път", "Без директен достъп", "Магистрален достъп"]'::jsonb,
     'Road access type', 'Вид пътен достъп', 64),
    
    -- Utilities for Land
    (v_real_estate_id, 'Land Utilities', 'Комуникации към парцела', 'multiselect', false, true,
     '["Electricity", "Water", "Sewage", "Gas", "Phone/Internet", "All Utilities", "No Utilities", "Partially Connected"]'::jsonb,
     '["Електричество", "Вода", "Канализация", "Газ", "Телефон/Интернет", "Всички комуникации", "Без комуникации", "Частично свързан"]'::jsonb,
     'Utilities available', 'Налични комуникации', 65);
END $$;
;
