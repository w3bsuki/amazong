-- =====================================================
-- L2 Categories for Garden & Outdoor Power (05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Lawn Mowers', 'Косачки за трева', 'garden-lawn-mowers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🌿', 'Push, self-propelled, riding, robot mowers', 'Ръчни, самоходни, тракторни, роботи', 1),
  (gen_random_uuid(), 'Chainsaws', 'Резачки', 'garden-chainsaws', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🪚', 'Gas, electric, battery chainsaws', 'Бензинови, електрически, акумулаторни', 2),
  (gen_random_uuid(), 'String Trimmers', 'Тримери', 'garden-trimmers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🌾', 'Gas and electric string trimmers', 'Бензинови и електрически тримери', 3),
  (gen_random_uuid(), 'Hedge Trimmers', 'Храсторези', 'garden-hedge-trimmers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🌳', 'Electric and gas hedge trimmers', 'Електрически и бензинови храсторези', 4),
  (gen_random_uuid(), 'Leaf Blowers', 'Духалки за листа', 'garden-leaf-blowers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🍂', 'Handheld and backpack leaf blowers', 'Ръчни и гръбни духалки', 5),
  (gen_random_uuid(), 'Pressure Washers', 'Водоструйки', 'garden-pressure-washers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '💦', 'Electric and gas pressure washers', 'Електрически и бензинови водоструйки', 6),
  (gen_random_uuid(), 'Tillers & Cultivators', 'Култиватори и фрези', 'garden-tillers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🌱', 'Garden tillers and cultivators', 'Градински култиватори и мотофрези', 7),
  (gen_random_uuid(), 'Chippers & Shredders', 'Дробилки за клони', 'garden-chippers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🪵', 'Wood chippers and garden shredders', 'Дробилки за клони и градински шредери', 8),
  (gen_random_uuid(), 'Snow Blowers', 'Снегорини', 'garden-snow-blowers', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '❄️', 'Single and two-stage snow blowers', 'Едностепенни и двустепенни снегорини', 9),
  (gen_random_uuid(), 'Log Splitters', 'Цепачки за дърва', 'garden-log-splitters', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🪓', 'Electric and gas log splitters', 'Електрически и бензинови цепачки', 10),
  (gen_random_uuid(), 'Brush Cutters', 'Моторни коси', 'garden-brush-cutters', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🌿', 'Professional brush cutters', 'Професионални моторни коси', 11),
  (gen_random_uuid(), 'Garden Tool Accessories', 'Аксесоари за градинска техника', 'garden-accessories', '05fb5c5f-73f2-4bf5-85b6-5a82c56b5e19', '🧰', 'Blades, lines, chains, parts', 'Ножове, корди, вериги, части', 12)
ON CONFLICT (slug) DO NOTHING;;
