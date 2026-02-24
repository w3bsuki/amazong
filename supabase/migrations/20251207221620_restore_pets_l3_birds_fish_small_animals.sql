
-- Restore Birds, Fish, Small Animals L3 categories

DO $$
DECLARE
  pets_id UUID;
  birds_id UUID;
  fish_id UUID;
  small_animals_id UUID;
  reptiles_id UUID;
  horses_id UUID;
  -- Bird L2s
  bird_food_id UUID;
  bird_cages_id UUID;
  bird_toys_id UUID;
  bird_accessories_id UUID;
  bird_health_id UUID;
  -- Fish L2s
  fish_tanks_id UUID;
  fish_food_id UUID;
  fish_filters_id UUID;
  fish_decor_id UUID;
  fish_plants_id UUID;
  fish_health_id UUID;
  -- Small Animal L2s
  small_food_id UUID;
  small_cages_id UUID;
  small_bedding_id UUID;
  small_toys_id UUID;
  small_health_id UUID;
  -- Reptile L2s
  reptile_food_id UUID;
  reptile_tanks_id UUID;
  reptile_heating_id UUID;
  reptile_decor_id UUID;
  reptile_health_id UUID;
  -- Horse L2s
  horse_feed_id UUID;
  horse_tack_id UUID;
  horse_grooming_id UUID;
  horse_health_id UUID;
BEGIN
  SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
  SELECT id INTO birds_id FROM categories WHERE slug = 'birds' AND parent_id = pets_id;
  SELECT id INTO fish_id FROM categories WHERE slug IN ('fish-aquarium', 'fish-aquatic') LIMIT 1;
  SELECT id INTO small_animals_id FROM categories WHERE slug = 'small-animals' AND parent_id = pets_id;
  SELECT id INTO reptiles_id FROM categories WHERE slug = 'reptiles' AND parent_id = pets_id;
  SELECT id INTO horses_id FROM categories WHERE slug = 'horses' AND parent_id = pets_id;

  -- Get Bird L2 IDs
  SELECT id INTO bird_food_id FROM categories WHERE slug = 'bird-food' AND parent_id = birds_id;
  SELECT id INTO bird_cages_id FROM categories WHERE slug = 'bird-cages' AND parent_id = birds_id;
  SELECT id INTO bird_toys_id FROM categories WHERE slug = 'bird-toys' AND parent_id = birds_id;
  SELECT id INTO bird_accessories_id FROM categories WHERE slug = 'bird-accessories' AND parent_id = birds_id;
  SELECT id INTO bird_health_id FROM categories WHERE slug = 'bird-health' AND parent_id = birds_id;

  -- Get Fish L2 IDs  
  SELECT id INTO fish_tanks_id FROM categories WHERE slug = 'aquariums-tanks' AND parent_id = fish_id;
  SELECT id INTO fish_food_id FROM categories WHERE slug = 'fish-food' AND parent_id = fish_id;
  SELECT id INTO fish_filters_id FROM categories WHERE slug = 'filters-pumps' AND parent_id = fish_id;
  SELECT id INTO fish_decor_id FROM categories WHERE slug = 'aquarium-decor' AND parent_id = fish_id;
  SELECT id INTO fish_plants_id FROM categories WHERE slug = 'aquatic-plants' AND parent_id = fish_id;
  SELECT id INTO fish_health_id FROM categories WHERE slug = 'fish-health' AND parent_id = fish_id;

  -- Get Small Animal L2 IDs
  SELECT id INTO small_food_id FROM categories WHERE slug = 'small-animal-food' AND parent_id = small_animals_id;
  SELECT id INTO small_cages_id FROM categories WHERE slug = 'small-animal-cages' AND parent_id = small_animals_id;
  SELECT id INTO small_bedding_id FROM categories WHERE slug = 'small-animal-bedding' AND parent_id = small_animals_id;
  SELECT id INTO small_toys_id FROM categories WHERE slug = 'small-animal-toys' AND parent_id = small_animals_id;
  SELECT id INTO small_health_id FROM categories WHERE slug = 'small-animal-health' AND parent_id = small_animals_id;

  -- Get Reptile L2 IDs
  SELECT id INTO reptile_food_id FROM categories WHERE slug = 'reptile-food' AND parent_id = reptiles_id;
  SELECT id INTO reptile_tanks_id FROM categories WHERE slug = 'reptile-terrariums' AND parent_id = reptiles_id;
  SELECT id INTO reptile_heating_id FROM categories WHERE slug = 'reptile-heating' AND parent_id = reptiles_id;
  SELECT id INTO reptile_decor_id FROM categories WHERE slug = 'reptile-decor' AND parent_id = reptiles_id;
  SELECT id INTO reptile_health_id FROM categories WHERE slug = 'reptile-health' AND parent_id = reptiles_id;

  -- Get Horse L2 IDs
  SELECT id INTO horse_feed_id FROM categories WHERE slug = 'horse-feed' AND parent_id = horses_id;
  SELECT id INTO horse_tack_id FROM categories WHERE slug = 'horse-tack' AND parent_id = horses_id;
  SELECT id INTO horse_grooming_id FROM categories WHERE slug = 'horse-grooming' AND parent_id = horses_id;
  SELECT id INTO horse_health_id FROM categories WHERE slug = 'horse-health' AND parent_id = horses_id;

  -- Bird Food L3
  IF bird_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Seed Mixes', 'Смеси от семена', 'bird-seed-mixes', bird_food_id, '🌾', 1),
    ('Pellets', 'Пелети', 'bird-pellets', bird_food_id, '⚫', 2),
    ('Treats & Snacks', 'Лакомства', 'bird-treats', bird_food_id, '🍬', 3),
    ('Fruits & Vegetables', 'Плодове и зеленчуци', 'bird-fruits-vegetables', bird_food_id, '🍎', 4),
    ('Nectar & Supplements', 'Нектар и добавки', 'bird-nectar-supplements', bird_food_id, '🍯', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bird Cages L3
  IF bird_cages_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Small Bird Cages', 'Клетки за малки птици', 'small-bird-cages', bird_cages_id, '🏠', 1),
    ('Medium Bird Cages', 'Клетки за средни птици', 'medium-bird-cages', bird_cages_id, '🏠', 2),
    ('Large Bird Cages', 'Клетки за големи птици', 'large-bird-cages', bird_cages_id, '🏠', 3),
    ('Flight Cages', 'Волиери', 'flight-cages', bird_cages_id, '🦅', 4),
    ('Travel Carriers', 'Транспортни клетки', 'bird-travel-carriers', bird_cages_id, '✈️', 5),
    ('Cage Accessories', 'Аксесоари за клетки', 'bird-cage-accessories', bird_cages_id, '🔧', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bird Toys L3
  IF bird_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Swings & Perches', 'Люлки и кацалки', 'bird-swings-perches', bird_toys_id, '🪵', 1),
    ('Climbing Toys', 'Играчки за катерене', 'bird-climbing-toys', bird_toys_id, '🧗', 2),
    ('Foraging Toys', 'Играчки за търсене', 'bird-foraging-toys', bird_toys_id, '🔍', 3),
    ('Mirrors & Bells', 'Огледала и звънци', 'bird-mirrors-bells', bird_toys_id, '🔔', 4),
    ('Chewing Toys', 'Играчки за дъвчене', 'bird-chewing-toys', bird_toys_id, '🦴', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fish Tanks L3
  IF fish_tanks_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Freshwater Tanks', 'Сладководни аквариуми', 'freshwater-tanks', fish_tanks_id, '🐟', 1),
    ('Saltwater Tanks', 'Морски аквариуми', 'saltwater-tanks', fish_tanks_id, '🐠', 2),
    ('Nano Tanks', 'Нано аквариуми', 'nano-tanks', fish_tanks_id, '🔬', 3),
    ('Betta Tanks', 'Бета аквариуми', 'betta-tanks', fish_tanks_id, '🐟', 4),
    ('Tank Stands', 'Поставки за аквариуми', 'tank-stands', fish_tanks_id, '🪑', 5),
    ('Tank Kits', 'Комплекти', 'tank-kits', fish_tanks_id, '📦', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fish Food L3
  IF fish_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Flakes', 'Люспи', 'fish-flakes', fish_food_id, '🌾', 1),
    ('Pellets', 'Пелети', 'fish-pellets', fish_food_id, '⚫', 2),
    ('Frozen Food', 'Замразена храна', 'fish-frozen-food', fish_food_id, '❄️', 3),
    ('Live Food', 'Жива храна', 'fish-live-food', fish_food_id, '🦐', 4),
    ('Freeze-Dried', 'Лиофилизирана', 'fish-freeze-dried', fish_food_id, '🧊', 5),
    ('Vacation Feeders', 'Хранилки за почивка', 'fish-vacation-feeders', fish_food_id, '🏖️', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fish Filters L3
  IF fish_filters_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Canister Filters', 'Канистрови филтри', 'canister-filters', fish_filters_id, '🔧', 1),
    ('HOB Filters', 'Вътрешни филтри', 'hob-filters', fish_filters_id, '🔧', 2),
    ('Sponge Filters', 'Гъбени филтри', 'sponge-filters', fish_filters_id, '🧽', 3),
    ('Air Pumps', 'Въздушни помпи', 'air-pumps', fish_filters_id, '💨', 4),
    ('Water Pumps', 'Водни помпи', 'water-pumps', fish_filters_id, '💧', 5),
    ('Filter Media', 'Филтърни материали', 'filter-media', fish_filters_id, '🔩', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Small Animal Food L3
  IF small_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Rabbit Food', 'Храна за зайци', 'rabbit-food', small_food_id, '🐰', 1),
    ('Guinea Pig Food', 'Храна за морски свинчета', 'guinea-pig-food', small_food_id, '🐹', 2),
    ('Hamster Food', 'Храна за хамстери', 'hamster-food', small_food_id, '🐹', 3),
    ('Chinchilla Food', 'Храна за чинчили', 'chinchilla-food', small_food_id, '🐭', 4),
    ('Ferret Food', 'Храна за порове', 'ferret-food', small_food_id, '🦡', 5),
    ('Hay & Grass', 'Сено и трева', 'hay-grass', small_food_id, '🌾', 6),
    ('Treats', 'Лакомства', 'small-animal-treats', small_food_id, '🍬', 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Reptile Food L3
  IF reptile_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Live Insects', 'Живи насекоми', 'reptile-live-insects', reptile_food_id, '🦗', 1),
    ('Frozen Food', 'Замразена храна', 'reptile-frozen-food', reptile_food_id, '❄️', 2),
    ('Pellets & Dry Food', 'Пелети и суха храна', 'reptile-pellets', reptile_food_id, '⚫', 3),
    ('Supplements', 'Добавки', 'reptile-supplements', reptile_food_id, '💊', 4),
    ('Calcium & Vitamins', 'Калций и витамини', 'reptile-calcium-vitamins', reptile_food_id, '💎', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Reptile Tanks L3
  IF reptile_tanks_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Glass Terrariums', 'Стъклени терариуми', 'glass-terrariums', reptile_tanks_id, '🏠', 1),
    ('Screen Cages', 'Мрежести клетки', 'screen-cages', reptile_tanks_id, '📦', 2),
    ('Tubs & Racks', 'Кутии и стелажи', 'reptile-tubs-racks', reptile_tanks_id, '📦', 3),
    ('Bioactive Setups', 'Биоактивни системи', 'bioactive-setups', reptile_tanks_id, '🌿', 4),
    ('Tank Backgrounds', 'Фонове', 'tank-backgrounds', reptile_tanks_id, '🖼️', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Horse Feed L3
  IF horse_feed_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Hay & Forage', 'Сено и фураж', 'horse-hay-forage', horse_feed_id, '🌾', 1),
    ('Grain & Pellets', 'Зърно и пелети', 'horse-grain-pellets', horse_feed_id, '🌾', 2),
    ('Supplements', 'Добавки', 'horse-supplements', horse_feed_id, '💊', 3),
    ('Treats', 'Лакомства', 'horse-treats', horse_feed_id, '🍎', 4),
    ('Senior Feed', 'Храна за възрастни', 'horse-senior-feed', horse_feed_id, '🐴', 5),
    ('Performance Feed', 'Храна за спортни коне', 'horse-performance-feed', horse_feed_id, '🏇', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Horse Tack L3
  IF horse_tack_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Saddles', 'Седла', 'horse-saddles', horse_tack_id, '🐎', 1),
    ('Bridles & Headstalls', 'Юзди и оглавници', 'horse-bridles', horse_tack_id, '🐴', 2),
    ('Bits', 'Удила', 'horse-bits', horse_tack_id, '⭕', 3),
    ('Halters & Lead Ropes', 'Халтери и води', 'horse-halters', horse_tack_id, '🪢', 4),
    ('Girths & Cinches', 'Подпруги', 'horse-girths', horse_tack_id, '🔗', 5),
    ('Saddle Pads', 'Подложки за седло', 'horse-saddle-pads', horse_tack_id, '🛏️', 6),
    ('Stirrups', 'Стремена', 'horse-stirrups', horse_tack_id, '👞', 7),
    ('Reins', 'Поводи', 'horse-reins', horse_tack_id, '🪢', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Birds, Fish, Small Animals L3 restoration complete';
END $$;
;
