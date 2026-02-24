
-- ============================================
-- ADD ATTRIBUTES FOR ELECTRIC VEHICLES CATEGORY
-- ============================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order)
SELECT 
    '9d898c0f-8660-4145-8314-58cb4791c7e0'::uuid, -- electric-vehicles
    name, name_bg, attribute_type, is_required, is_filterable, 
    options::jsonb, options_bg::jsonb, placeholder, placeholder_bg, sort_order
FROM (VALUES
    ('Brand', 'Марка', 'select', true, true, 
     '["Tesla", "BMW", "Mercedes-Benz", "Audi", "Porsche", "Polestar", "Lucid", "Rivian", "Volkswagen", "Hyundai", "Kia", "BYD", "NIO", "Ford", "Chevrolet", "GMC", "Toyota", "Other"]',
     '["Тесла", "БМВ", "Мерцедес-Бенц", "Ауди", "Порше", "Полестар", "Луцид", "Ривиан", "Фолксваген", "Хюндай", "Киа", "БИД", "НИО", "Форд", "Шевролет", "ДжиЕмСи", "Тойота", "Друга"]',
     'Select brand', 'Изберете марка', 1),

    ('Model', 'Модел', 'text', true, false, NULL, NULL, 
     'e.g. Model 3, ID.4', 'напр. Model 3, ID.4', 2),

    ('Year', 'Година', 'number', true, true, NULL, NULL, 
     'Manufacturing year', 'Година на производство', 3),

    ('Range (km)', 'Пробег (км)', 'select', true, true,
     '["Under 200 km", "200-300 km", "300-400 km", "400-500 km", "500-600 km", "Over 600 km"]',
     '["Под 200 км", "200-300 км", "300-400 км", "400-500 км", "500-600 км", "Над 600 км"]',
     'Select range', 'Изберете пробег', 4),

    ('Battery Capacity (kWh)', 'Капацитет на батерията (kWh)', 'select', false, true,
     '["Under 40 kWh", "40-60 kWh", "60-80 kWh", "80-100 kWh", "Over 100 kWh"]',
     '["Под 40 kWh", "40-60 kWh", "60-80 kWh", "80-100 kWh", "Над 100 kWh"]',
     'Select battery size', 'Изберете размер на батерията', 5),

    ('Mileage', 'Километраж', 'number', true, true, NULL, NULL,
     'Current mileage in km', 'Текущ пробег в км', 6),

    ('Drive Type', 'Задвижване', 'select', true, true,
     '["RWD (Rear)", "FWD (Front)", "AWD (All-Wheel)", "4WD"]',
     '["Задно", "Предно", "4x4 (AWD)", "4x4 (4WD)"]',
     'Select drive type', 'Изберете задвижване', 7),

    ('Charging Port', 'Порт за зареждане', 'select', false, true,
     '["Type 2 (EU)", "CCS Combo", "CHAdeMO", "Tesla Supercharger", "GB/T"]',
     '["Type 2 (EU)", "CCS Combo", "CHAdeMO", "Tesla Supercharger", "GB/T"]',
     'Select charging port', 'Изберете порт', 8),

    ('Color', 'Цвят', 'select', true, true,
     '["White", "Black", "Silver", "Gray", "Blue", "Red", "Green", "Brown", "Orange", "Other"]',
     '["Бял", "Черен", "Сребрист", "Сив", "Син", "Червен", "Зелен", "Кафяв", "Оранжев", "Друг"]',
     'Select color', 'Изберете цвят', 9),

    ('Condition', 'Състояние', 'select', true, true,
     '["New", "Like New", "Excellent", "Good", "Fair"]',
     '["Ново", "Като ново", "Отлично", "Добро", "Задоволително"]',
     'Select condition', 'Изберете състояние', 10),

    ('VIN', 'VIN номер', 'text', false, false, NULL, NULL,
     '17-character VIN', '17-символен VIN номер', 11),

    ('Number of Owners', 'Брой собственици', 'select', false, true,
     '["1", "2", "3", "4+"]',
     '["1", "2", "3", "4+"]',
     'Select owners count', 'Изберете брой собственици', 12),

    ('Service History', 'Сервизна история', 'select', false, true,
     '["Full Service History", "Partial Service History", "No Service History"]',
     '["Пълна сервизна история", "Частична сервизна история", "Без сервизна история"]',
     'Select service history', 'Изберете сервизна история', 13),

    ('Features', 'Екстри', 'multiselect', false, true,
     '["Autopilot/FSD", "Premium Interior", "Panoramic Roof", "Heated Seats", "Cooled Seats", "Premium Sound", "Tow Hitch", "Performance Package", "Air Suspension", "21+ Wheels"]',
     '["Автопилот/FSD", "Премиум интериор", "Панорамен покрив", "Подгрев на седалки", "Охлаждане на седалки", "Премиум аудио", "Теглич", "Performance пакет", "Въздушно окачване", "21+ джанти"]',
     'Select features', 'Изберете екстри', 14)
) AS t(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order);
;
