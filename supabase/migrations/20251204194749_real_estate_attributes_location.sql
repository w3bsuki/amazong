
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 4C: LOCATION ATTRIBUTES
-- Bulgarian cities, neighborhoods, and proximity
-- ============================================================================

DO $$
DECLARE
    v_real_estate_id UUID := 'ae77bc52-4b8f-4126-b2af-0cf760248996';
BEGIN
    INSERT INTO category_attributes (
        category_id, name, name_bg, attribute_type, is_required, is_filterable,
        options, options_bg, placeholder, placeholder_bg, sort_order
    ) VALUES
    -- City
    (v_real_estate_id, 'City', 'Град', 'select', true, true,
     '["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen", "Pernik", "Haskovo", "Yambol", "Pazardzhik", "Blagoevgrad", "Veliko Tarnovo", "Vratsa", "Gabrovo", "Asenovgrad", "Vidin", "Kazanlak", "Kyustendil", "Kardzhali", "Montana", "Dimitrovgrad", "Lovech", "Silistra", "Targovishte", "Dupnitsa", "Svishtov", "Other"]'::jsonb,
     '["София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора", "Плевен", "Сливен", "Добрич", "Шумен", "Перник", "Хасково", "Ямбол", "Пазарджик", "Благоевград", "Велико Търново", "Враца", "Габрово", "Асеновград", "Видин", "Казанлък", "Кюстендил", "Кърджали", "Монтана", "Димитровград", "Ловеч", "Силистра", "Търговище", "Дупница", "Свищов", "Друг"]'::jsonb,
     'Select city', 'Изберете град', 23),
    
    -- Sofia Districts (most common search)
    (v_real_estate_id, 'Sofia District', 'Район в София', 'select', false, true,
     '["Center", "Lozenets", "Mladost", "Lyulin", "Studentski grad", "Vitosha", "Oborishte", "Iztok", "Krasno selo", "Nadezhda", "Serdika", "Poduyane", "Slatina", "Ovcha kupel", "Druzhba", "Ilinden", "Bankya", "Pancharevo", "Novi Iskar", "Kremikovtsi", "Other"]'::jsonb,
     '["Център", "Лозенец", "Младост", "Люлин", "Студентски град", "Витоша", "Оборище", "Изток", "Красно село", "Надежда", "Сердика", "Подуяне", "Слатина", "Овча купел", "Дружба", "Илинден", "Банкя", "Панчарево", "Нови Искър", "Кремиковци", "Друг"]'::jsonb,
     'District in Sofia', 'Район в София', 24),
    
    -- Neighborhood
    (v_real_estate_id, 'Neighborhood', 'Квартал', 'text', false, true,
     '[]'::jsonb, '[]'::jsonb,
     'Enter neighborhood name', 'Въведете име на квартала', 25),
    
    -- Address
    (v_real_estate_id, 'Address', 'Адрес', 'text', false, false,
     '[]'::jsonb, '[]'::jsonb,
     'Street address', 'Улица и номер', 26),
    
    -- Proximity to Metro
    (v_real_estate_id, 'Metro Proximity', 'Близост до метро', 'select', false, true,
     '["Next to Metro", "Under 5 min walk", "5-10 min walk", "10-15 min walk", "Over 15 min", "No Metro"]'::jsonb,
     '["До метростанция", "Под 5 мин пеша", "5-10 мин пеша", "10-15 мин пеша", "Над 15 мин", "Няма метро"]'::jsonb,
     'Distance to metro', 'Разстояние до метро', 27),
    
    -- Proximity to Center
    (v_real_estate_id, 'Distance to Center', 'Разстояние до центъра', 'select', false, true,
     '["In the Center", "Under 5 min", "5-15 min", "15-30 min", "30-45 min", "Over 45 min"]'::jsonb,
     '["В центъра", "Под 5 мин", "5-15 мин", "15-30 мин", "30-45 мин", "Над 45 мин"]'::jsonb,
     'Distance to city center', 'Разстояние до центъра', 28),
    
    -- Proximity to Beach (for coastal)
    (v_real_estate_id, 'Beach Proximity', 'Близост до плаж', 'select', false, true,
     '["Beachfront", "First Line", "Second Line", "Under 500m", "500m-1km", "1-2km", "2-5km", "Over 5km", "N/A"]'::jsonb,
     '["На плажа", "Първа линия", "Втора линия", "Под 500м", "500м-1км", "1-2км", "2-5км", "Над 5км", "Неприложимо"]'::jsonb,
     'Distance to beach', 'Разстояние до плажа', 29),
    
    -- Proximity to Ski
    (v_real_estate_id, 'Ski Lift Proximity', 'Близост до лифт', 'select', false, true,
     '["Ski-In/Ski-Out", "Under 100m", "100-500m", "500m-1km", "1-2km", "Over 2km", "N/A"]'::jsonb,
     '["Ски-ин/Ски-аут", "Под 100м", "100-500м", "500м-1км", "1-2км", "Над 2км", "Неприложимо"]'::jsonb,
     'Distance to ski lift', 'Разстояние до лифта', 30),
    
    -- Nearby Amenities
    (v_real_estate_id, 'Nearby Amenities', 'Наблизо', 'multiselect', false, true,
     '["Metro", "Bus Stop", "Tram", "School", "Kindergarten", "University", "Hospital", "Pharmacy", "Supermarket", "Mall", "Park", "Gym", "Restaurant", "Bank", "ATM"]'::jsonb,
     '["Метро", "Автобус", "Трамвай", "Училище", "Детска градина", "Университет", "Болница", "Аптека", "Супермаркет", "Мол", "Парк", "Фитнес", "Ресторант", "Банка", "Банкомат"]'::jsonb,
     'Select nearby amenities', 'Изберете какво има наблизо', 31);
END $$;
;
