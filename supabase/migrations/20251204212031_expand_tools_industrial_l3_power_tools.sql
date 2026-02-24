-- =====================================================
-- L3 Categories for Power Tools Subcategories
-- =====================================================

-- Drills (72da1665-d0be-4686-8754-6bcf983a7630)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Cordless Drills', 'Акумулаторни бормашини', 'drills-cordless', '72da1665-d0be-4686-8754-6bcf983a7630', '🔋', 1),
  (gen_random_uuid(), 'Corded Drills', 'Бормашини с кабел', 'drills-corded', '72da1665-d0be-4686-8754-6bcf983a7630', '🔌', 2),
  (gen_random_uuid(), 'Hammer Drills', 'Ударни бормашини', 'drills-hammer', '72da1665-d0be-4686-8754-6bcf983a7630', '🔨', 3),
  (gen_random_uuid(), 'Drill Presses', 'Колонни пробивни машини', 'drills-press', '72da1665-d0be-4686-8754-6bcf983a7630', '🏭', 4),
  (gen_random_uuid(), 'Right Angle Drills', 'Ъглови бормашини', 'drills-right-angle', '72da1665-d0be-4686-8754-6bcf983a7630', '📐', 5),
  (gen_random_uuid(), 'Magnetic Drills', 'Магнитни бормашини', 'drills-magnetic', '72da1665-d0be-4686-8754-6bcf983a7630', '🧲', 6);

-- Saws (f06ed034-4005-41d1-b6fa-1028d744d774)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Circular Saws', 'Циркулярни триони', 'saws-circular', 'f06ed034-4005-41d1-b6fa-1028d744d774', '⭕', 1),
  (gen_random_uuid(), 'Reciprocating Saws', 'Саблени триони', 'saws-reciprocating', 'f06ed034-4005-41d1-b6fa-1028d744d774', '↔️', 2),
  (gen_random_uuid(), 'Miter Saws', 'Герунзи', 'saws-miter', 'f06ed034-4005-41d1-b6fa-1028d744d774', '📐', 3),
  (gen_random_uuid(), 'Jigsaws', 'Прободни триони', 'saws-jigsaw', 'f06ed034-4005-41d1-b6fa-1028d744d774', '🔧', 4),
  (gen_random_uuid(), 'Table Saws', 'Настолни циркуляри', 'saws-table', 'f06ed034-4005-41d1-b6fa-1028d744d774', '🏭', 5),
  (gen_random_uuid(), 'Tile Saws', 'Машини за плочки', 'saws-tile', 'f06ed034-4005-41d1-b6fa-1028d744d774', '🔲', 6),
  (gen_random_uuid(), 'Track Saws', 'Потапящи циркуляри', 'saws-track', 'f06ed034-4005-41d1-b6fa-1028d744d774', '📏', 7);

-- Grinders (adb94a82-dc46-468f-b938-ebb4a5020792)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Angle Grinders', 'Ъглошлайфи', 'grinders-angle', 'adb94a82-dc46-468f-b938-ebb4a5020792', '⚙️', 1),
  (gen_random_uuid(), 'Bench Grinders', 'Настолни шмиргели', 'grinders-bench', 'adb94a82-dc46-468f-b938-ebb4a5020792', '🏭', 2),
  (gen_random_uuid(), 'Die Grinders', 'Прави шлайфмашини', 'grinders-die', 'adb94a82-dc46-468f-b938-ebb4a5020792', '🔧', 3),
  (gen_random_uuid(), 'Cut-Off Tools', 'Отрезни машини', 'grinders-cutoff', 'adb94a82-dc46-468f-b938-ebb4a5020792', '✂️', 4),
  (gen_random_uuid(), 'Concrete Grinders', 'Шлифовки за бетон', 'grinders-concrete', 'adb94a82-dc46-468f-b938-ebb4a5020792', '🏗️', 5);

-- Sanders (90597d20-0003-4503-b1e0-ee0254aa10f0)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Orbital Sanders', 'Орбитални шлайфи', 'sanders-orbital', '90597d20-0003-4503-b1e0-ee0254aa10f0', '⭕', 1),
  (gen_random_uuid(), 'Random Orbital Sanders', 'Ексцентрикови шлайфи', 'sanders-random-orbital', '90597d20-0003-4503-b1e0-ee0254aa10f0', '🔄', 2),
  (gen_random_uuid(), 'Belt Sanders', 'Лентови шлайфи', 'sanders-belt', '90597d20-0003-4503-b1e0-ee0254aa10f0', '➡️', 3),
  (gen_random_uuid(), 'Detail Sanders', 'Делта шлайфи', 'sanders-detail', '90597d20-0003-4503-b1e0-ee0254aa10f0', '🔺', 4),
  (gen_random_uuid(), 'Drywall Sanders', 'Шлайфи за гипсокартон', 'sanders-drywall', '90597d20-0003-4503-b1e0-ee0254aa10f0', '📦', 5);

-- Rotary Hammers (7f9e8d51-ab6c-4b76-b260-abcd45ad8bea)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'SDS-Plus Rotary Hammers', 'SDS-Plus перфоратори', 'hammers-sds-plus', '7f9e8d51-ab6c-4b76-b260-abcd45ad8bea', '🔨', 1),
  (gen_random_uuid(), 'SDS-Max Rotary Hammers', 'SDS-Max перфоратори', 'hammers-sds-max', '7f9e8d51-ab6c-4b76-b260-abcd45ad8bea', '💪', 2),
  (gen_random_uuid(), 'Cordless Rotary Hammers', 'Акумулаторни перфоратори', 'hammers-cordless', '7f9e8d51-ab6c-4b76-b260-abcd45ad8bea', '🔋', 3),
  (gen_random_uuid(), 'Combination Hammers', 'Комбинирани перфоратори', 'hammers-combination', '7f9e8d51-ab6c-4b76-b260-abcd45ad8bea', '🔄', 4);

-- Impact Wrenches (9baae207-341a-47d1-8e02-116c52132f99)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Cordless Impact Wrenches', 'Акумулаторни гайковерти', 'impact-cordless', '9baae207-341a-47d1-8e02-116c52132f99', '🔋', 1),
  (gen_random_uuid(), 'Corded Impact Wrenches', 'Гайковерти с кабел', 'impact-corded', '9baae207-341a-47d1-8e02-116c52132f99', '🔌', 2),
  (gen_random_uuid(), '1/2" Impact Wrenches', '1/2" ударни гайковерти', 'impact-half-inch', '9baae207-341a-47d1-8e02-116c52132f99', '🔧', 3),
  (gen_random_uuid(), '3/4" & 1" Impact Wrenches', '3/4" и 1" гайковерти', 'impact-three-quarter', '9baae207-341a-47d1-8e02-116c52132f99', '💪', 4);

-- Screwdrivers & Impact Drivers (1dc45ef0-2476-4827-99ae-e7e51c745e3f)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
VALUES
  (gen_random_uuid(), 'Cordless Screwdrivers', 'Акумулаторни отвертки', 'drivers-screwdriver', '1dc45ef0-2476-4827-99ae-e7e51c745e3f', '🔩', 1),
  (gen_random_uuid(), 'Impact Drivers', 'Ударни гайковерти', 'drivers-impact', '1dc45ef0-2476-4827-99ae-e7e51c745e3f', '💥', 2),
  (gen_random_uuid(), 'Drywall Screwdrivers', 'Машини за гипсокартон', 'drivers-drywall', '1dc45ef0-2476-4827-99ae-e7e51c745e3f', '📦', 3),
  (gen_random_uuid(), 'Deck Screwdrivers', 'Машини за настил', 'drivers-deck', '1dc45ef0-2476-4827-99ae-e7e51c745e3f', '🪵', 4)
ON CONFLICT (slug) DO NOTHING;;
