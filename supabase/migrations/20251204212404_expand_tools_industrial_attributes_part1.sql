-- =====================================================
-- TOOLS & INDUSTRIAL ATTRIBUTES - PART 1
-- Tool Specifications & Power
-- Category ID: e6f6ece0-ec00-4c0f-8b57-c52ae40a7399
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
VALUES
  -- TOOL SPECIFICATIONS (6-20)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Tool Category', 'Категория инструмент', 'select',
   '["Power Tool", "Hand Tool", "Pneumatic Tool", "Cordless Tool", "Measuring Tool", "Safety Equipment", "Storage", "Accessory"]'::jsonb,
   '["Електроинструмент", "Ръчен инструмент", "Пневматичен инструмент", "Акумулаторен инструмент", "Измервателен уред", "Предпазни средства", "Съхранение", "Аксесоар"]'::jsonb,
   true, true, 6),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Power Source', 'Захранване', 'select',
   '["Corded Electric (220V)", "Cordless Battery", "Pneumatic/Air", "Manual/Hand", "Gas/Petrol", "Diesel", "Hydraulic", "Solar"]'::jsonb,
   '["С кабел (220V)", "Акумулаторен", "Пневматичен/Въздушен", "Ръчен", "Бензинов", "Дизелов", "Хидравличен", "Соларен"]'::jsonb,
   false, true, 7),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Battery Voltage', 'Напрежение на батерията', 'select',
   '["10.8V", "12V", "14.4V", "18V", "20V", "36V", "40V", "54V/60V", "80V", "N/A"]'::jsonb,
   '["10.8V", "12V", "14.4V", "18V", "20V", "36V", "40V", "54V/60V", "80V", "Не е приложимо"]'::jsonb,
   false, true, 8),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Battery Type', 'Тип батерия', 'select',
   '["Li-Ion", "Li-Ion High Capacity", "LiHD", "NiCd", "NiMH", "Lead Acid", "N/A"]'::jsonb,
   '["Li-Ion", "Li-Ion висок капацитет", "LiHD", "NiCd", "NiMH", "Оловно-киселинна", "Не е приложимо"]'::jsonb,
   false, true, 9),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Battery Capacity (Ah)', 'Капацитет на батерията (Ah)', 'select',
   '["1.5 Ah", "2.0 Ah", "2.5 Ah", "3.0 Ah", "4.0 Ah", "5.0 Ah", "6.0 Ah", "8.0 Ah", "10.0 Ah", "12.0 Ah+", "N/A"]'::jsonb,
   '["1.5 Ah", "2.0 Ah", "2.5 Ah", "3.0 Ah", "4.0 Ah", "5.0 Ah", "6.0 Ah", "8.0 Ah", "10.0 Ah", "12.0 Ah+", "Не е приложимо"]'::jsonb,
   false, true, 10),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Motor Power (Watts)', 'Мощност на мотора (Watts)', 'select',
   '["Under 500W", "500-750W", "750-1000W", "1000-1500W", "1500-2000W", "2000-2500W", "2500W+", "N/A"]'::jsonb,
   '["Под 500W", "500-750W", "750-1000W", "1000-1500W", "1500-2000W", "2000-2500W", "2500W+", "Не е приложимо"]'::jsonb,
   false, true, 11),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Motor Type', 'Тип мотор', 'select',
   '["Brushed", "Brushless", "Universal", "Induction", "Permanent Magnet", "N/A"]'::jsonb,
   '["С четки", "Безчетков", "Универсален", "Индукционен", "С постоянни магнити", "Не е приложимо"]'::jsonb,
   false, true, 12),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'RPM/Speed', 'Обороти/Скорост', 'select',
   '["0-500 RPM", "500-1000 RPM", "1000-2000 RPM", "2000-3000 RPM", "3000-5000 RPM", "5000-10000 RPM", "10000-20000 RPM", "20000+ RPM", "Variable Speed"]'::jsonb,
   '["0-500 об/мин", "500-1000 об/мин", "1000-2000 об/мин", "2000-3000 об/мин", "3000-5000 об/мин", "5000-10000 об/мин", "10000-20000 об/мин", "20000+ об/мин", "Регулируема скорост"]'::jsonb,
   false, true, 13),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Variable Speed', 'Регулируема скорост', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 14),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Torque (Nm)', 'Въртящ момент (Nm)', 'select',
   '["Up to 20 Nm", "20-50 Nm", "50-100 Nm", "100-200 Nm", "200-400 Nm", "400-800 Nm", "800-1200 Nm", "1200+ Nm", "N/A"]'::jsonb,
   '["До 20 Nm", "20-50 Nm", "50-100 Nm", "100-200 Nm", "200-400 Nm", "400-800 Nm", "800-1200 Nm", "1200+ Nm", "Не е приложимо"]'::jsonb,
   false, true, 15),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Impact Rate (BPM/IPM)', 'Честота на удара', 'select',
   '["Up to 5000 BPM", "5000-10000 BPM", "10000-20000 BPM", "20000-30000 BPM", "30000-50000 BPM", "50000+ BPM", "N/A"]'::jsonb,
   '["До 5000 уд/мин", "5000-10000 уд/мин", "10000-20000 уд/мин", "20000-30000 уд/мин", "30000-50000 уд/мин", "50000+ уд/мин", "Не е приложимо"]'::jsonb,
   false, true, 16),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Chuck Size', 'Размер на патронника', 'select',
   '["1/4\" (6.35mm)", "3/8\" (10mm)", "1/2\" (13mm)", "5/8\" (16mm)", "SDS-Plus", "SDS-Max", "N/A"]'::jsonb,
   '["1/4\" (6.35мм)", "3/8\" (10мм)", "1/2\" (13мм)", "5/8\" (16мм)", "SDS-Plus", "SDS-Max", "Не е приложимо"]'::jsonb,
   false, true, 17),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Blade/Disc Size', 'Размер на диска/ножа', 'select',
   '["4\" (100mm)", "4.5\" (115mm)", "5\" (125mm)", "6\" (150mm)", "7\" (180mm)", "9\" (230mm)", "10\" (254mm)", "12\" (305mm)", "14\" (355mm)", "N/A"]'::jsonb,
   '["4\" (100мм)", "4.5\" (115мм)", "5\" (125мм)", "6\" (150мм)", "7\" (180мм)", "9\" (230мм)", "10\" (254мм)", "12\" (305мм)", "14\" (355мм)", "Не е приложимо"]'::jsonb,
   false, true, 18),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Air Pressure (PSI/bar)', 'Въздушно налягане (PSI/bar)', 'select',
   '["60-90 PSI (4-6 bar)", "90-120 PSI (6-8 bar)", "120-150 PSI (8-10 bar)", "150+ PSI (10+ bar)", "N/A"]'::jsonb,
   '["60-90 PSI (4-6 бар)", "90-120 PSI (6-8 бар)", "120-150 PSI (8-10 бар)", "150+ PSI (10+ бар)", "Не е приложимо"]'::jsonb,
   false, true, 19),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'CFM Rating', 'CFM рейтинг', 'select',
   '["Under 2 CFM", "2-4 CFM", "4-6 CFM", "6-10 CFM", "10-15 CFM", "15+ CFM", "N/A"]'::jsonb,
   '["Под 2 CFM", "2-4 CFM", "4-6 CFM", "6-10 CFM", "10-15 CFM", "15+ CFM", "Не е приложимо"]'::jsonb,
   false, true, 20)
ON CONFLICT DO NOTHING;;
