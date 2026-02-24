-- Phase 4: Tools & Industrial - Attributes for all L1 categories

DO $$
DECLARE
  -- Tools L1 IDs
  power_tools_id UUID := 'c939df1c-bc1f-4aed-9e7f-1a91420d3853';
  hand_tools_id UUID := '496c798d-00b0-4126-a69d-eeb20ace0858';
  abrasives_id UUID := '509ae76f-ed12-4e84-b903-9240f369c546';
  adhesives_id UUID := 'dd23ca2d-56f4-47ee-8585-1bda07caaeae';
  agriculture_id UUID := 'd8539881-7635-4262-a994-1203d6eae5b4';
  auto_tools_id UUID := 'b46cd1e5-c0b6-4103-902f-a2fabcb44677';
  cleaning_id UUID := '969a708b-b87a-4730-8010-de72bdd10026';
  construction_id UUID := 'f0d44138-7000-4a8b-ba2d-32409fa45cce';
  electrical_id UUID := '0b270f5f-36b3-4721-b846-1792e51b204a';
  fasteners_id UUID := '97d0a86f-16a9-433b-b79d-df8adef9a28b';
  garden_id UUID := '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19';
  generators_id UUID := '081743f1-b668-4d7c-8d57-eed4bd09b793';
  hardware_id UUID := '1641f34e-43a7-4edc-b595-52c2b569d282';
  hvac_id UUID := '6f86da67-c11d-4d7e-a180-918117feb834';
  industrial_id UUID := 'be6fd810-03db-44a8-bdb9-04bb667c3b4f';
  metalwork_id UUID := 'da1a5ed8-3399-4a84-8b40-82297696453c';
  painting_id UUID := 'fb0ae7fb-a15b-43c8-9994-7674a0f8f05f';
  plumbing_id UUID := '46a671dc-2aec-41f0-94e2-0d3601c66499';
  pneumatic_id UUID := '9ebb8809-b3c7-483c-acd3-0dcbab483b13';
  safety_id UUID := 'aff61829-7b35-4858-8f74-1d0a3aa9a29d';
  test_meas_id UUID := '5ef11798-3076-4ad1-a64d-011603b72d99';
  tool_acc_id UUID := 'c830f31c-fb85-4a1a-b9c1-9f562cc83825';
  tool_storage_id UUID := '7b834eca-2355-47db-bb02-7ef509eafaa6';
  welding_id UUID := '65d5cf4c-2072-477a-82da-1ec72330d7a9';
  woodwork_id UUID := '6841ab90-828b-471b-9e65-2562909a86b6';
BEGIN
  -- Power Tools Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (power_tools_id, 'Power Source', 'Захранване', 'select', true, true, '["Cordless", "Corded Electric", "Pneumatic", "Gas"]', 1),
    (power_tools_id, 'Voltage', 'Волтаж', 'select', false, true, '["12V", "18V", "20V", "40V", "60V", "120V"]', 2),
    (power_tools_id, 'Brand', 'Марка', 'select', true, true, '["DeWalt", "Makita", "Milwaukee", "Bosch", "Ryobi", "Craftsman", "Ridgid", "Metabo", "Hilti", "Festool", "Other"]', 3),
    (power_tools_id, 'Use Type', 'Тип употреба', 'select', false, true, '["Professional", "DIY/Home", "Industrial", "Light Duty"]', 4),
    (power_tools_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used - Good", "Used - Fair", "For Parts"]', 5),
    (power_tools_id, 'Includes Battery', 'Включва батерия', 'select', false, true, '["Yes - 1 Battery", "Yes - 2 Batteries", "No - Tool Only", "Bare Tool"]', 6),
    (power_tools_id, 'Warranty', 'Гаранция', 'select', false, true, '["No Warranty", "30 Days", "90 Days", "1 Year", "2 Years", "3+ Years", "Lifetime"]', 7)
  ON CONFLICT DO NOTHING;

  -- Hand Tools Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (hand_tools_id, 'Brand', 'Марка', 'select', true, true, '["Stanley", "Craftsman", "Klein Tools", "Channellock", "Snap-on", "Knipex", "Wera", "Wiha", "GearWrench", "Proto", "Other"]', 1),
    (hand_tools_id, 'Material', 'Материал', 'select', false, true, '["Chrome Vanadium Steel", "Carbon Steel", "High Speed Steel", "Stainless Steel", "Chrome Molybdenum", "Titanium"]', 2),
    (hand_tools_id, 'Set Size', 'Размер на комплект', 'select', false, true, '["Single Tool", "5-10 Pieces", "11-20 Pieces", "21-50 Pieces", "50+ Pieces"]', 3),
    (hand_tools_id, 'Measurement System', 'Измервателна система', 'select', false, true, '["Metric", "SAE/Imperial", "Metric + SAE", "Universal"]', 4),
    (hand_tools_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Used - Good", "Used - Fair", "For Parts"]', 5),
    (hand_tools_id, 'Use Type', 'Тип употреба', 'select', false, true, '["Professional", "DIY/Home", "Industrial", "Automotive", "Electrical"]', 6)
  ON CONFLICT DO NOTHING;

  -- Abrasives Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (abrasives_id, 'Grit Size', 'Едрина', 'select', true, true, '["Extra Coarse (24-36)", "Coarse (40-60)", "Medium (80-120)", "Fine (150-180)", "Very Fine (220-320)", "Ultra Fine (400+)"]', 1),
    (abrasives_id, 'Material Type', 'Тип материал', 'select', false, true, '["Aluminum Oxide", "Zirconia", "Ceramic", "Silicon Carbide", "Diamond", "Garnet"]', 2),
    (abrasives_id, 'Disc Size', 'Размер на диска', 'select', false, true, '["4.5 inch", "5 inch", "6 inch", "7 inch", "9 inch"]', 3),
    (abrasives_id, 'Backing Type', 'Тип подложка', 'select', false, true, '["Paper", "Cloth", "Fiber", "Film", "Foam"]', 4),
    (abrasives_id, 'Application', 'Приложение', 'select', false, true, '["Metal", "Wood", "Paint", "Plastic", "Masonry", "Multi-Material"]', 5)
  ON CONFLICT DO NOTHING;

  -- Adhesives Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (adhesives_id, 'Adhesive Type', 'Тип лепило', 'select', true, true, '["Epoxy", "Super Glue", "Construction", "Wood Glue", "Spray", "Hot Melt", "Contact Cement"]', 1),
    (adhesives_id, 'Cure Time', 'Време за втвърдяване', 'select', false, true, '["Instant", "5-10 Minutes", "30 Minutes", "1 Hour", "24 Hours", "48+ Hours"]', 2),
    (adhesives_id, 'Water Resistant', 'Водоустойчив', 'select', false, true, '["Yes", "No", "Water-Proof", "Weather Resistant"]', 3),
    (adhesives_id, 'Application', 'Приложение', 'select', false, true, '["General Purpose", "Wood", "Metal", "Plastic", "Concrete", "Glass", "Fabric"]', 4),
    (adhesives_id, 'Size/Volume', 'Размер/Обем', 'select', false, true, '["Under 1 oz", "1-4 oz", "4-8 oz", "8-16 oz", "16+ oz", "Gallon"]', 5)
  ON CONFLICT DO NOTHING;

  -- Automotive Tools Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (auto_tools_id, 'Tool Type', 'Тип инструмент', 'select', true, true, '["Diagnostic", "Engine", "Brake", "Suspension", "Body", "Electrical", "General"]', 1),
    (auto_tools_id, 'Capacity/Rating', 'Капацитет/Рейтинг', 'select', false, true, '["1-2 Ton", "2-3 Ton", "3-5 Ton", "5+ Ton"]', 2),
    (auto_tools_id, 'Power Source', 'Захранване', 'select', false, true, '["Manual", "12V DC", "120V AC", "Pneumatic", "Battery"]', 3),
    (auto_tools_id, 'Professional Grade', 'Професионален клас', 'select', false, true, '["Yes", "No", "Commercial", "Industrial"]', 4),
    (auto_tools_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used", "For Parts"]', 5)
  ON CONFLICT DO NOTHING;

  -- Cleaning Equipment Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (cleaning_id, 'Power Type', 'Тип захранване', 'select', true, true, '["Electric", "Gas", "Battery", "Manual"]', 1),
    (cleaning_id, 'Pressure Rating', 'Налягане', 'select', false, true, '["Light Duty (< 2000 PSI)", "Medium Duty (2000-2800 PSI)", "Heavy Duty (2800-3500 PSI)", "Professional (3500+ PSI)"]', 2),
    (cleaning_id, 'Tank Size', 'Размер на резервоар', 'select', false, true, '["Under 5 Gallon", "5-10 Gallon", "10-16 Gallon", "16+ Gallon"]', 3),
    (cleaning_id, 'Use Type', 'Тип употреба', 'select', false, true, '["Residential", "Commercial", "Industrial"]', 4),
    (cleaning_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used"]', 5)
  ON CONFLICT DO NOTHING;

  -- Construction & Masonry Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (construction_id, 'Equipment Type', 'Тип оборудване', 'select', true, true, '["Mixer", "Vibrator", "Saw", "Scaffolding", "Lifting", "Leveling", "Other"]', 1),
    (construction_id, 'Power Source', 'Захранване', 'select', false, true, '["Electric", "Gas", "Diesel", "Manual"]', 2),
    (construction_id, 'Capacity', 'Капацитет', 'select', false, true, '["Light Duty", "Medium Duty", "Heavy Duty", "Commercial"]', 3),
    (construction_id, 'Portable', 'Преносим', 'select', false, true, '["Yes", "No", "Towable"]', 4),
    (construction_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used", "For Parts"]', 5)
  ON CONFLICT DO NOTHING;

  -- Garden & Outdoor Power Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (garden_id, 'Power Source', 'Захранване', 'select', true, true, '["Gas", "Cordless/Battery", "Corded Electric", "Manual"]', 1),
    (garden_id, 'Brand', 'Марка', 'select', false, true, '["Husqvarna", "Stihl", "John Deere", "Honda", "Toro", "Ego", "Greenworks", "Ryobi", "DeWalt", "Other"]', 2),
    (garden_id, 'Cutting Width', 'Широчина на рязане', 'select', false, true, '["Under 15 inch", "15-18 inch", "19-21 inch", "22-25 inch", "26+ inch"]', 3),
    (garden_id, 'Self-Propelled', 'Самоходен', 'select', false, true, '["Yes", "No", "Variable Speed"]', 4),
    (garden_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used", "For Parts"]', 5)
  ON CONFLICT DO NOTHING;

  -- Welding & Soldering Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (welding_id, 'Welding Type', 'Тип заваряване', 'select', true, true, '["MIG", "TIG", "Stick/Arc", "Flux Core", "Multi-Process", "Spot", "Plasma"]', 1),
    (welding_id, 'Amperage Range', 'Амперажен обхват', 'select', false, true, '["Under 100A", "100-200A", "200-300A", "300+ A"]', 2),
    (welding_id, 'Power Input', 'Входно захранване', 'select', false, true, '["110V", "220V", "Dual Voltage", "Battery"]', 3),
    (welding_id, 'Duty Cycle', 'Работен цикъл', 'select', false, true, '["Under 20%", "20-40%", "40-60%", "60%+"]', 4),
    (welding_id, 'Brand', 'Марка', 'select', false, true, '["Lincoln", "Miller", "Hobart", "ESAB", "Everlast", "Forney", "Eastwood", "Other"]', 5),
    (welding_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used"]', 6)
  ON CONFLICT DO NOTHING;

  -- Tool Storage Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (tool_storage_id, 'Storage Type', 'Тип съхранение', 'select', true, true, '["Tool Box", "Tool Chest", "Rolling Cabinet", "Wall System", "Workbench", "Bag/Pouch"]', 1),
    (tool_storage_id, 'Material', 'Материал', 'select', false, true, '["Steel", "Aluminum", "Plastic", "Composite", "Fabric"]', 2),
    (tool_storage_id, 'Number of Drawers', 'Брой чекмеджета', 'select', false, true, '["1-3", "4-6", "7-10", "11-15", "15+", "N/A"]', 3),
    (tool_storage_id, 'Lockable', 'С ключалка', 'select', false, true, '["Yes", "No"]', 4),
    (tool_storage_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Used - Good", "Used - Fair"]', 5)
  ON CONFLICT DO NOTHING;

  -- Safety Equipment Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (safety_id, 'Safety Type', 'Тип защита', 'select', true, true, '["Eye/Face", "Hearing", "Respiratory", "Head", "Hand", "Body", "Foot", "Fall Protection"]', 1),
    (safety_id, 'Protection Level', 'Ниво на защита', 'select', false, true, '["Basic", "ANSI Rated", "OSHA Compliant", "Industrial Grade"]', 2),
    (safety_id, 'Size', 'Размер', 'select', false, true, '["XS", "S", "M", "L", "XL", "XXL", "One Size", "Adjustable"]', 3),
    (safety_id, 'Material', 'Материал', 'select', false, true, '["Polycarbonate", "Rubber", "Leather", "Kevlar", "Nitrile", "Latex", "Neoprene"]', 4),
    (safety_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Used"]', 5)
  ON CONFLICT DO NOTHING;

END $$;;
