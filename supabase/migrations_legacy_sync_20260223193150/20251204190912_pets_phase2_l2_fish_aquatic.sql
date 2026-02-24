-- PETS PHASE 2: Add L2 categories for Fish & Aquatic
-- Fish & Aquatic ID: d0fd9fc8-119c-4160-b9a2-0e61d662abcc

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Fish Food', 'Храна за риби', 'fish-food', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🐟', 1, 'Fish flakes, pellets, and specialty foods', 'Люспи, пелети и специализирана храна за риби'),
  ('Aquariums & Tanks', 'Аквариуми и резервоари', 'aquariums', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🐠', 2, 'Fish tanks, aquariums, and starter kits', 'Аквариуми, резервоари и стартови комплекти'),
  ('Aquarium Filters', 'Филтри за аквариуми', 'aquarium-filters', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🌊', 3, 'Filter systems, replacement cartridges, and media', 'Филтърни системи, сменяеми касети и медии'),
  ('Aquarium Lighting', 'Осветление за аквариуми', 'aquarium-lighting', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '💡', 4, 'LED lights, hoods, and lighting accessories', 'LED светлини, капаци и осветителни аксесоари'),
  ('Aquarium Heaters', 'Нагреватели за аквариуми', 'aquarium-heaters', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🌡️', 5, 'Heaters, thermometers, and temperature control', 'Нагреватели, термометри и контрол на температурата'),
  ('Aquarium Pumps & Air', 'Помпи и аерация за аквариуми', 'aquarium-pumps', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '💨', 6, 'Air pumps, powerheads, and circulation', 'Въздушни помпи, силови глави и циркулация'),
  ('Aquarium Decorations', 'Декорации за аквариуми', 'aquarium-decor', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🏰', 7, 'Plants, ornaments, rocks, and backgrounds', 'Растения, орнаменти, камъни и фонове'),
  ('Aquarium Substrate', 'Субстрат за аквариуми', 'aquarium-substrate', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🪨', 8, 'Gravel, sand, and planted tank substrates', 'Чакъл, пясък и субстрати за засадени аквариуми'),
  ('Water Care & Testing', 'Грижа за водата и тестове', 'water-care', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '💧', 9, 'Water conditioners, test kits, and treatments', 'Кондиционери за вода, тест комплекти и третирания'),
  ('Aquarium Cleaning', 'Почистване на аквариуми', 'aquarium-cleaning', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🧽', 10, 'Gravel vacuums, algae scrapers, and cleaning tools', 'Прахосмукачки за чакъл, скрепери и почистващи инструменти'),
  ('Pond Supplies', 'Езерни продукти', 'pond-supplies', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🏞️', 11, 'Pond equipment, koi food, and outdoor aquatics', 'Езерно оборудване, храна за кои и външни водни продукти'),
  ('Saltwater & Marine', 'Солена вода и морски', 'saltwater-marine', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', '🦑', 12, 'Marine aquarium supplies and reef equipment', 'Морски аквариумни продукти и рифово оборудване')
ON CONFLICT (slug) DO NOTHING;;
