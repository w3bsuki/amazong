
-- ==============================================
-- JEWELRY & WATCHES - RING SPECIFIC ATTRIBUTES
-- Date: December 4, 2025
-- ==============================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
    -- Ring Size US
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Ring Size US', 'Размер пръстен (US)', 'select', false, true,
     '["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"]'::jsonb,
     '["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"]'::jsonb, 21),
     
    -- Ring Style
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Ring Style', 'Стил на пръстена', 'select', false, true,
     '["Solitaire", "Halo", "Three-Stone", "Cluster", "Pavé", "Channel Set", "Bezel Set", "Tension Set", "Cathedral", "Split Shank", "Twisted/Infinity", "Vintage/Antique", "Eternity Band", "Half Eternity", "Stackable", "Cocktail", "Statement", "Signet", "Spinner", "Adjustable"]'::jsonb,
     '["Солитер", "Хало", "Три камъка", "Клъстер", "Паве", "Канален монтаж", "Безел монтаж", "Напрежение", "Катедрален", "Разделена халка", "Усукан/Безкрайност", "Винтидж/Антикварен", "Вечност", "Половин вечност", "За подреждане", "Коктейлен", "Изявен", "Печатен", "Въртящ се", "Регулируем"]'::jsonb, 22),
     
    -- Band Width
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Band Width (mm)', 'Ширина на халката (мм)', 'select', false, true,
     '["1mm", "1.5mm", "2mm", "2.5mm", "3mm", "3.5mm", "4mm", "4.5mm", "5mm", "6mm", "7mm", "8mm", "9mm", "10mm+"]'::jsonb,
     '["1мм", "1.5мм", "2мм", "2.5мм", "3мм", "3.5мм", "4мм", "4.5мм", "5мм", "6мм", "7мм", "8мм", "9мм", "10мм+"]'::jsonb, 23),
     
    -- Stone Shape
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Stone Shape', 'Форма на камъка', 'select', false, true,
     '["Round Brilliant", "Princess (Square)", "Cushion", "Oval", "Emerald", "Radiant", "Pear/Teardrop", "Marquise", "Asscher", "Heart", "Trillion", "Baguette", "Cabochon", "Rose Cut", "Old Mine Cut", "Old European Cut", "Mixed", "Other"]'::jsonb,
     '["Кръгъл брилянт", "Принцеса (квадрат)", "Възглавница", "Овален", "Изумруд", "Радиант", "Круша/Капка", "Маркиз", "Ашер", "Сърце", "Трилион", "Багет", "Кабошон", "Роуз кът", "Стар минен кът", "Стар европейски кът", "Смесен", "Друго"]'::jsonb, 24),

    -- Total Carat Weight
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Total Carat Weight', 'Общо карати', 'select', false, true,
     '["Under 0.25ct", "0.25-0.49ct", "0.50-0.74ct", "0.75-0.99ct", "1.00-1.49ct", "1.50-1.99ct", "2.00-2.49ct", "2.50-2.99ct", "3.00-3.99ct", "4.00-4.99ct", "5.00ct+"]'::jsonb,
     '["Под 0.25кт", "0.25-0.49кт", "0.50-0.74кт", "0.75-0.99кт", "1.00-1.49кт", "1.50-1.99кт", "2.00-2.49кт", "2.50-2.99кт", "3.00-3.99кт", "4.00-4.99кт", "5.00кт+"]'::jsonb, 25);
;
