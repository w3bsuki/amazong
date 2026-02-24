
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4E: BUILDING AMENITIES & SECURITY
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- Building Amenities
    (v_real_estate_id, 'Building Amenities', 'Удобства в сградата', 'multiselect', false, true,
     '["Concierge", "Security Guard", "Gym", "Spa", "Sauna", "Common Terrace", "Rooftop Lounge", "Meeting Room", "Children Playground", "BBQ Area", "Bike Storage", "Car Wash", "Electric Vehicle Charging", "Mailroom", "Package Lockers"]'::jsonb,
     '["Консиерж", "Охрана", "Фитнес", "СПА", "Сауна", "Обща тераса", "Покривен бар", "Зала за срещи", "Детска площадка", "Барбекю зона", "Велопаркинг", "Автомивка", "Зарядна станция", "Поща", "Пощенски шкафове"]'::jsonb,
     'Building amenities', 'Удобства в сградата', 43),
    
    -- Security Features
    (v_real_estate_id, 'Security', 'Сигурност', 'multiselect', false, true,
     '["24/7 Security", "CCTV", "Gated Community", "Alarm System", "Access Control", "Security Door", "Fire Alarm", "Smoke Detectors", "Sprinkler System", "Safe Room"]'::jsonb,
     '["24/7 охрана", "Видеонаблюдение", "Затворен комплекс", "Алармена система", "Контрол на достъпа", "Бронирана врата", "Пожарна аларма", "Датчици за дим", "Спринклерна система", "Безопасна стая"]'::jsonb,
     'Security features', 'Характеристики на сигурността', 44),
    
    -- Pet Policy
    (v_real_estate_id, 'Pet Policy', 'Домашни любимци', 'select', false, true,
     '["Pets Allowed", "Small Pets Only", "Cats Only", "Dogs Only", "No Pets", "Negotiable"]'::jsonb,
     '["Домашни любимци - да", "Само малки", "Само котки", "Само кучета", "Без любимци", "По договаряне"]'::jsonb,
     'Pet policy', 'Политика за домашни любимци', 45),
    
    -- Internet/Cable
    (v_real_estate_id, 'Internet & Cable', 'Интернет и кабелна', 'multiselect', false, true,
     '["Fiber Optic", "High-Speed Internet", "Cable TV", "Satellite TV", "Smart TV Ready", "No Internet"]'::jsonb,
     '["Оптика", "Високоскоростен интернет", "Кабелна телевизия", "Сателитна телевизия", "Smart TV готов", "Без интернет"]'::jsonb,
     'Internet and cable', 'Интернет и кабелна', 46),
    
    -- Water & Utilities
    (v_real_estate_id, 'Utilities', 'Комунални услуги', 'multiselect', false, true,
     '["Municipal Water", "Well", "Septic Tank", "Municipal Sewage", "Natural Gas", "Solar Panels", "Central Hot Water", "Individual Boiler"]'::jsonb,
     '["Градски водопровод", "Кладенец", "Септична яма", "Градска канализация", "Газ", "Соларни панели", "Центр. топла вода", "Индивидуален бойлер"]'::jsonb,
     'Utilities available', 'Налични комунални услуги', 47);
END $$;
;
