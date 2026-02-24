-- =====================================================
-- TOOLS & INDUSTRIAL CATEGORY EXPANSION - PHASE 2
-- Adding Missing L1 Categories
-- =====================================================

-- Root ID: e6f6ece0-ec00-4c0f-8b57-c52ae40a7399

-- First, let's add missing L1 categories that don't exist yet
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  -- Welding & Soldering (new L1)
  (gen_random_uuid(), 'Welding & Soldering', 'Заваръчна техника', 'welding-soldering', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🔥', 'Welding machines, soldering equipment and accessories', 'Заваръчни апарати, поялници и аксесоари', 10),
  
  -- Pneumatic & Air Tools (new L1)
  (gen_random_uuid(), 'Pneumatic & Air Tools', 'Пневматични инструменти', 'pneumatic-air-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '💨', 'Air compressors, pneumatic tools and accessories', 'Компресори, пневматични инструменти и аксесоари', 11),
  
  -- Automotive Tools (new L1)
  (gen_random_uuid(), 'Automotive Tools', 'Автомобилни инструменти', 'automotive-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🚗', 'Diagnostic tools, jacks, engine tools and automotive equipment', 'Диагностични уреди, крикове, инструменти за двигатели', 12),
  
  -- Garden & Outdoor Power Equipment (new L1)
  (gen_random_uuid(), 'Garden & Outdoor Power', 'Градинска техника', 'garden-outdoor-power', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🌳', 'Lawn mowers, chainsaws, trimmers and outdoor equipment', 'Косачки, резачки, тримери и градинско оборудване', 13),
  
  -- Woodworking Tools (new L1)
  (gen_random_uuid(), 'Woodworking Tools', 'Дървообработващи инструменти', 'woodworking-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🪵', 'Table saws, lathes, carving tools and woodworking equipment', 'Банцигови триони, стругове, дърворезбарски инструменти', 14),
  
  -- Metalworking Tools (new L1)
  (gen_random_uuid(), 'Metalworking Tools', 'Металообработващи инструменти', 'metalworking-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '⚙️', 'Metal lathes, milling machines, cutting and forming tools', 'Метални стругове, фрези, режещи инструменти', 15),
  
  -- Plumbing Tools (new L1)
  (gen_random_uuid(), 'Plumbing Tools', 'Водопроводни инструменти', 'plumbing-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🔧', 'Pipe wrenches, cutters, drain snakes and plumbing equipment', 'Тръбни ключове, резачки, спирали за канали', 16),
  
  -- Electrical Tools & Equipment (new L1)
  (gen_random_uuid(), 'Electrical Tools', 'Електроинсталационни инструменти', 'electrical-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '⚡', 'Wire strippers, crimpers, testers and electrical equipment', 'Клещи за оголване, кримпващи клещи, тестери', 17),
  
  -- Construction & Masonry (new L1)
  (gen_random_uuid(), 'Construction & Masonry', 'Строителство и зидария', 'construction-masonry', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🏗️', 'Concrete mixers, masonry tools, scaffolding and construction equipment', 'Бетонобъркачки, зидарски инструменти, скелета', 18),
  
  -- Painting & Finishing Equipment (new L1)
  (gen_random_uuid(), 'Painting & Finishing', 'Бояджийско оборудване', 'painting-finishing', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🎨', 'Paint sprayers, brushes, rollers and finishing equipment', 'Пръскачки за боя, четки, валяци и довършително оборудване', 19),
  
  -- Abrasives & Finishing Supplies (new L1)
  (gen_random_uuid(), 'Abrasives & Finishing', 'Абразиви и шлифовъчни материали', 'abrasives-finishing', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🔘', 'Sandpaper, grinding wheels, polishing compounds and abrasives', 'Шкурка, шлифовъчни дискове, полиращи пасти', 20),
  
  -- Adhesives & Sealants (new L1)
  (gen_random_uuid(), 'Adhesives & Sealants', 'Лепила и уплътнители', 'adhesives-sealants', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🧴', 'Epoxies, construction adhesives, silicones and tapes', 'Епоксидни лепила, строителни лепила, силикони, тиксо', 21),
  
  -- HVAC Tools & Equipment (new L1)
  (gen_random_uuid(), 'HVAC Tools & Equipment', 'ОВК инструменти', 'hvac-tools', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '❄️', 'Refrigerant tools, vacuum pumps, duct tools and HVAC equipment', 'Инструменти за хладилна техника, вакуум помпи', 22),
  
  -- Fasteners & Hardware (new L1)
  (gen_random_uuid(), 'Fasteners & Hardware', 'Крепежни елементи', 'fasteners-hardware', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🔩', 'Screws, bolts, nuts, anchors, brackets and hardware', 'Винтове, болтове, гайки, анкери, скоби', 23),
  
  -- Test & Measurement Equipment (new L1)
  (gen_random_uuid(), 'Test & Measurement', 'Измервателна апаратура', 'test-measurement-equipment', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '📊', 'Calipers, micrometers, laser levels and testing equipment', 'Шублери, микрометри, лазерни нивелири, тестери', 24),
  
  -- Tool Accessories & Parts (new L1)
  (gen_random_uuid(), 'Tool Accessories & Parts', 'Аксесоари и части за инструменти', 'tool-accessories-parts', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🔄', 'Drill bits, saw blades, batteries, chargers and replacement parts', 'Свредла, триони, батерии, зарядни и резервни части', 25),
  
  -- Generators & Power Equipment (new L1)
  (gen_random_uuid(), 'Generators & Power', 'Генератори и захранване', 'generators-power', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🔌', 'Portable generators, inverters, power stations and electrical equipment', 'Преносими генератори, инвертори, захранващи станции', 26),
  
  -- Cleaning Equipment (new L1)
  (gen_random_uuid(), 'Cleaning Equipment', 'Почистващо оборудване', 'cleaning-equipment', 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', '🧹', 'Pressure washers, vacuum cleaners, steam cleaners and cleaning tools', 'Водоструйки, прахосмукачки, парочистачки', 27)

ON CONFLICT (slug) DO NOTHING;;
