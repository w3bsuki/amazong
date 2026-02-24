-- Phase 4: Tools & Industrial - Power Tools L3 Categories Batch 1
-- Following Rule 5: Using verified parent UUIDs

DO $$
DECLARE
  -- Power Tools L2 parent IDs (verified from previous query)
  air_compressors_id UUID := 'd9bf26bd-9c88-46aa-abd0-7ef60d216a0d';
  combos_id UUID := '3ac20261-d503-4bee-889a-943ffe9f0010';
  demolition_id UUID := '27f03c93-cd3c-42f0-afed-37aba01b2606';
  mixers_id UUID := 'bf0b4c02-5d21-450e-a78a-dcc698b2014c';
  nibblers_id UUID := '6b2849f0-1b5b-4097-9683-bed41a6caed7';
  multi_tools_id UUID := 'd390141e-bb56-4c5a-927b-65c68b3b49f5';
  rotary_hammers_id UUID := '7f9e8d51-ab6c-4b76-b260-abcd45ad8bea';
  rotary_tools_id UUID := 'f5e42a2b-7d2d-47f4-a5b2-cbfd28407196';
BEGIN
  -- Verify parents exist before inserting
  IF NOT EXISTS (SELECT 1 FROM categories WHERE id = air_compressors_id) THEN
    RAISE EXCEPTION 'Parent not found: air_compressors';
  END IF;

  -- Air Compressors L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Portable Air Compressors', 'air-compressors-portable', air_compressors_id, 'Преносими компресори', '🔧', 1),
    ('Stationary Air Compressors', 'air-compressors-stationary', air_compressors_id, 'Стационарни компресори', '🔧', 2),
    ('Pancake Compressors', 'air-compressors-pancake', air_compressors_id, 'Палачинкови компресори', '🔧', 3),
    ('Hot Dog Compressors', 'air-compressors-hotdog', air_compressors_id, 'Хот-дог компресори', '🔧', 4),
    ('Twin Stack Compressors', 'air-compressors-twin-stack', air_compressors_id, 'Компресори с двоен резервоар', '🔧', 5),
    ('Wheelbarrow Compressors', 'air-compressors-wheelbarrow', air_compressors_id, 'Компресори с количка', '🔧', 6),
    ('Oil-Free Compressors', 'air-compressors-oil-free', air_compressors_id, 'Безмаслени компресори', '🔧', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Cordless Power Tool Combos L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('2-Tool Combo Kits', 'combos-2-tool', combos_id, 'Комбо комплекти 2 инструмента', '🔧', 1),
    ('3-Tool Combo Kits', 'combos-3-tool', combos_id, 'Комбо комплекти 3 инструмента', '🔧', 2),
    ('4-Tool Combo Kits', 'combos-4-tool', combos_id, 'Комбо комплекти 4 инструмента', '🔧', 3),
    ('5+ Tool Combo Kits', 'combos-5plus-tool', combos_id, 'Комбо комплекти 5+ инструмента', '🔧', 4),
    ('DeWalt Combo Kits', 'combos-dewalt', combos_id, 'DeWalt комбо комплекти', '🔧', 5),
    ('Makita Combo Kits', 'combos-makita', combos_id, 'Makita комбо комплекти', '🔧', 6),
    ('Milwaukee Combo Kits', 'combos-milwaukee', combos_id, 'Milwaukee комбо комплекти', '🔧', 7),
    ('Bosch Combo Kits', 'combos-bosch', combos_id, 'Bosch комбо комплекти', '🔧', 8),
    ('Ryobi Combo Kits', 'combos-ryobi', combos_id, 'Ryobi комбо комплекти', '🔧', 9)
  ON CONFLICT (slug) DO NOTHING;

  -- Demolition Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Demolition Hammers', 'demolition-hammers', demolition_id, 'Къртачи', '🔨', 1),
    ('Breakers', 'demolition-breakers', demolition_id, 'Бетонотрошачки', '🔨', 2),
    ('Chipping Hammers', 'demolition-chipping', demolition_id, 'Секачи', '🔨', 3),
    ('Concrete Cutters', 'demolition-concrete-cutters', demolition_id, 'Резачки за бетон', '🔨', 4),
    ('Demolition Bits', 'demolition-bits', demolition_id, 'Накрайници за къртачи', '🔨', 5),
    ('Electric Jackhammers', 'demolition-jackhammers', demolition_id, 'Електрически къртачи', '🔨', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Mixers & Stirrers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Cement Mixers', 'mixers-cement', mixers_id, 'Бетонобъркачки', '🔧', 1),
    ('Mortar Mixers', 'mixers-mortar', mixers_id, 'Хоросанобъркачки', '🔧', 2),
    ('Paint Mixers', 'mixers-paint', mixers_id, 'Миксери за боя', '🔧', 3),
    ('Drywall Mud Mixers', 'mixers-drywall', mixers_id, 'Миксери за гипскартон', '🔧', 4),
    ('Mixing Paddles', 'mixers-paddles', mixers_id, 'Бъркалки', '🔧', 5),
    ('Handheld Mixers', 'mixers-handheld', mixers_id, 'Ръчни миксери', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Nibblers & Shears L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Metal Shears', 'nibblers-metal-shears', nibblers_id, 'Ножици за метал', '✂️', 1),
    ('Nibblers', 'nibblers-nibblers', nibblers_id, 'Просекачки', '✂️', 2),
    ('Fiber Cement Shears', 'nibblers-fiber-cement', nibblers_id, 'Ножици за фиброцимент', '✂️', 3),
    ('Cordless Shears', 'nibblers-cordless', nibblers_id, 'Безжични ножици', '✂️', 4),
    ('Aviation Snips', 'nibblers-aviation-snips', nibblers_id, 'Авиационни ножици', '✂️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Oscillating Multi-Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Corded Multi-Tools', 'multi-tools-corded', multi_tools_id, 'Мултифункционални инструменти с кабел', '🔧', 1),
    ('Cordless Multi-Tools', 'multi-tools-cordless', multi_tools_id, 'Безжични мултифункционални инструменти', '🔧', 2),
    ('Multi-Tool Blades', 'multi-tools-blades', multi_tools_id, 'Ножове за мултифункционални инструменти', '🔧', 3),
    ('Sanding Attachments', 'multi-tools-sanding', multi_tools_id, 'Шлайфащи приставки', '🔧', 4),
    ('Scraping Attachments', 'multi-tools-scraping', multi_tools_id, 'Скребачни приставки', '🔧', 5),
    ('Cutting Attachments', 'multi-tools-cutting', multi_tools_id, 'Режещи приставки', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Rotary Hammers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('SDS-Plus Rotary Hammers', 'rotary-hammers-sds-plus', rotary_hammers_id, 'SDS-Plus перфоратори', '🔧', 1),
    ('SDS-Max Rotary Hammers', 'rotary-hammers-sds-max', rotary_hammers_id, 'SDS-Max перфоратори', '🔧', 2),
    ('Spline Rotary Hammers', 'rotary-hammers-spline', rotary_hammers_id, 'Сплайн перфоратори', '🔧', 3),
    ('Cordless Rotary Hammers', 'rotary-hammers-cordless', rotary_hammers_id, 'Безжични перфоратори', '🔧', 4),
    ('Combination Rotary Hammers', 'rotary-hammers-combo', rotary_hammers_id, 'Комбинирани перфоратори', '🔧', 5),
    ('Heavy-Duty Rotary Hammers', 'rotary-hammers-heavy-duty', rotary_hammers_id, 'Тежкотоварни перфоратори', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Rotary Tools L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Dremel Tools', 'rotary-tools-dremel', rotary_tools_id, 'Dremel инструменти', '🔧', 1),
    ('Die Grinders', 'rotary-tools-die-grinders', rotary_tools_id, 'Прави шлайфове', '🔧', 2),
    ('Engravers', 'rotary-tools-engravers', rotary_tools_id, 'Гравьори', '🔧', 3),
    ('Rotary Tool Accessories', 'rotary-tools-accessories', rotary_tools_id, 'Аксесоари за ротационни инструменти', '🔧', 4),
    ('Flex Shaft Rotary Tools', 'rotary-tools-flex-shaft', rotary_tools_id, 'Ротационни инструменти с гъвкав вал', '🔧', 5),
    ('Cordless Rotary Tools', 'rotary-tools-cordless', rotary_tools_id, 'Безжични ротационни инструменти', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
