-- =====================================================
-- TOOLS & INDUSTRIAL ATTRIBUTES - PART 3
-- Safety, Ergonomics & Features
-- Category ID: e6f6ece0-ec00-4c0f-8b57-c52ae40a7399
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
VALUES
  -- SAFETY & ERGONOMICS (36-50)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Safety Features', 'Функции за безопасност', 'multiselect',
   '["Anti-Kickback", "Electric Brake", "Soft Start", "Overload Protection", "Overheat Protection", "LED Work Light", "Lock-On Button", "Dead Man Switch", "Safety Clutch", "Restart Protection", "Blade Guard"]'::jsonb,
   '["Анти-откат", "Електрическа спирачка", "Мек старт", "Защита от претоварване", "Защита от прегряване", "LED работна лампа", "Бутон за заключване", "Прекъсвач при отпускане", "Предпазен съединител", "Защита от рестарт", "Предпазител за диска"]'::jsonb,
   false, true, 36),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Vibration Dampening', 'Потискане на вибрациите', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 37),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Vibration Level (m/s²)', 'Ниво на вибрации (m/s²)', 'select',
   '["Under 2.5 m/s²", "2.5-5 m/s²", "5-10 m/s²", "10-15 m/s²", "15+ m/s²", "N/A"]'::jsonb,
   '["Под 2.5 м/с²", "2.5-5 м/с²", "5-10 м/с²", "10-15 м/с²", "15+ м/с²", "Не е приложимо"]'::jsonb,
   false, false, 38),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Noise Level (dB)', 'Шумово ниво (dB)', 'select',
   '["Under 70 dB", "70-80 dB", "80-90 dB", "90-100 dB", "100-110 dB", "110+ dB"]'::jsonb,
   '["Под 70 dB", "70-80 dB", "80-90 dB", "90-100 dB", "100-110 dB", "110+ dB"]'::jsonb,
   false, true, 39),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Dust Collection', 'Прахосмукане', 'select',
   '["Built-in", "Port/Adapter Included", "Optional Adapter", "None"]'::jsonb,
   '["Вградено", "Включен порт/адаптер", "Опционален адаптер", "Няма"]'::jsonb,
   false, true, 40),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Ergonomic Design', 'Ергономичен дизайн', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 41),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'LED Work Light', 'LED работна лампа', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 42),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Belt Clip/Hook', 'Кука за колан', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, false, 43),

  -- COMPATIBILITY & ACCESSORIES (44-55)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Battery Platform', 'Батерийна платформа', 'select',
   '["Bosch 18V Professional", "Makita LXT 18V", "Makita CXT 12V", "DeWalt 20V MAX", "DeWalt FlexVolt", "Milwaukee M18", "Milwaukee M12", "Ryobi ONE+", "Einhell Power X-Change", "Metabo CAS", "Hilti 22V", "Festool 18V", "Universal/Multi", "N/A"]'::jsonb,
   '["Bosch 18V Professional", "Makita LXT 18V", "Makita CXT 12V", "DeWalt 20V MAX", "DeWalt FlexVolt", "Milwaukee M18", "Milwaukee M12", "Ryobi ONE+", "Einhell Power X-Change", "Metabo CAS", "Hilti 22V", "Festool 18V", "Универсална/Мулти", "Не е приложимо"]'::jsonb,
   false, true, 44),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Included Accessories', 'Включени аксесоари', 'multiselect',
   '["Carrying Case", "Soft Bag", "Battery", "Charger", "Extra Battery", "Drill Bits", "Saw Blades", "Sanding Discs", "Side Handle", "Depth Stop", "Dust Port Adapter", "Wrench/Key", "Manual"]'::jsonb,
   '["Куфар", "Мека чанта", "Батерия", "Зарядно", "Допълнителна батерия", "Свредла", "Ножове за трион", "Шлифовъчни дискове", "Странична дръжка", "Ограничител за дълбочина", "Адаптер за прах", "Ключ", "Ръководство"]'::jsonb,
   false, true, 45),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Kit Type', 'Тип комплект', 'select',
   '["Tool Only (Bare)", "Kit with 1 Battery", "Kit with 2 Batteries", "Full Kit", "Combo Kit", "Starter Set"]'::jsonb,
   '["Само инструмент", "Комплект с 1 батерия", "Комплект с 2 батерии", "Пълен комплект", "Комбиниран комплект", "Начален комплект"]'::jsonb,
   false, true, 46),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Compatible Accessories', 'Съвместими аксесоари', 'multiselect',
   '["Standard Bits/Blades", "SDS-Plus Bits", "SDS-Max Bits", "Hex Shank", "Quick-Change", "Universal Fit", "Brand Specific"]'::jsonb,
   '["Стандартни накрайници/ножове", "SDS-Plus свредла", "SDS-Max свредла", "Шестостенна опашка", "Бърза смяна", "Универсални", "Специфични за марката"]'::jsonb,
   false, false, 47),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Replacement Parts Available', 'Налични резервни части', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 48),

  -- APPLICATION & USE CASE (49-58)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Primary Application', 'Основно приложение', 'multiselect',
   '["Woodworking", "Metalworking", "Construction", "Automotive", "Plumbing", "Electrical", "HVAC", "Landscaping", "General Purpose", "DIY/Home Improvement"]'::jsonb,
   '["Дървообработка", "Металообработка", "Строителство", "Автомобилни", "ВиК", "Електрически", "ОВК", "Озеленяване", "Общо предназначение", "DIY/Подобрения в дома"]'::jsonb,
   false, true, 49),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Suitable For', 'Подходящ за', 'multiselect',
   '["Professional/Trade", "Industrial", "DIY/Home User", "Hobbyist", "Contractor", "Workshop"]'::jsonb,
   '["Професионалист/Занаятчия", "Индустриална употреба", "DIY/За дома", "Любител", "Изпълнител", "Работилница"]'::jsonb,
   false, true, 50),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Indoor/Outdoor Use', 'Вътрешна/Външна употреба', 'select',
   '["Indoor Only", "Outdoor Only", "Indoor & Outdoor", "Weatherproof/All Weather"]'::jsonb,
   '["Само на закрито", "Само на открито", "На закрито и открито", "Всякакви условия"]'::jsonb,
   false, true, 51),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Material Compatibility', 'Съвместимост с материали', 'multiselect',
   '["Softwood", "Hardwood", "Plywood/MDF", "Metal/Steel", "Stainless Steel", "Aluminum", "Concrete/Masonry", "Brick", "Tile/Ceramic", "Plastic/PVC", "Drywall/Gypsum", "Composite"]'::jsonb,
   '["Мека дървесина", "Твърда дървесина", "Шперплат/MDF", "Метал/Стомана", "Неръждаема стомана", "Алуминий", "Бетон/Зидария", "Тухла", "Плочки/Керамика", "Пластмаса/PVC", "Гипсокартон", "Композит"]'::jsonb,
   false, true, 52)
ON CONFLICT DO NOTHING;;
