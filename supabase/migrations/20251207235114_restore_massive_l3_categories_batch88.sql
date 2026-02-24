-- Batch 88: Pet Medical Supplies categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'pet-supplies';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pet First Aid', 'Първа помощ за домашни любимци', 'pet-first-aid', parent_id_var, 20),
      ('Pet Medications', 'Лекарства за домашни любимци', 'pet-medications', parent_id_var, 21),
      ('Pet Dental Care', 'Дентална грижа за домашни любимци', 'pet-dental-care', parent_id_var, 22),
      ('Pet Flea & Tick Control', 'Контрол на бълхи и кърлежи', 'pet-flea-tick-control', parent_id_var, 23)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Bird Supplies deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'bird-supplies';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bird Cages', 'Клетки за птици', 'bird-cages', parent_id_var, 1),
      ('Bird Food', 'Храна за птици', 'bird-food', parent_id_var, 2),
      ('Bird Toys', 'Играчки за птици', 'bird-toys', parent_id_var, 3),
      ('Bird Perches', 'Кацалки за птици', 'bird-perches', parent_id_var, 4),
      ('Bird Feeders', 'Хранилки за птици', 'bird-feeders-pet', parent_id_var, 5),
      ('Bird Baths', 'Вани за птици', 'bird-baths-pet', parent_id_var, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Aquarium Supplies deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'aquarium-supplies';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Aquarium Tanks', 'Аквариуми', 'aquarium-tanks', parent_id_var, 1),
      ('Aquarium Filters', 'Филтри за аквариум', 'aquarium-filters', parent_id_var, 2),
      ('Aquarium Heaters', 'Нагреватели за аквариум', 'aquarium-heaters', parent_id_var, 3),
      ('Aquarium Lighting', 'Осветление за аквариум', 'aquarium-lighting', parent_id_var, 4),
      ('Aquarium Decorations', 'Декорации за аквариум', 'aquarium-decorations', parent_id_var, 5),
      ('Fish Food', 'Храна за риби', 'fish-food-aquarium', parent_id_var, 6),
      ('Water Conditioners', 'Подобрители на водата', 'water-conditioners', parent_id_var, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;;
