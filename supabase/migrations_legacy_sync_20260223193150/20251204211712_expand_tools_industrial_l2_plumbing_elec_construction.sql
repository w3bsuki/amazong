-- =====================================================
-- L2 Categories for Plumbing Tools (46a671dc-2aec-41f0-94e2-0d3601c66499)
-- Using tools- prefix to avoid conflicts
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Pipe Wrenches', 'Тръбни ключове', 'tools-plumbing-pipe-wrenches', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🔧', 'Pipe wrenches and pliers wrenches', 'Тръбни ключове и клещови ключове', 1),
  (gen_random_uuid(), 'Pipe Cutters', 'Резачки за тръби', 'tools-plumbing-pipe-cutters', '46a671dc-2aec-41f0-94e2-0d3601c66499', '✂️', 'Manual and power pipe cutters', 'Ръчни и механични резачки за тръби', 2),
  (gen_random_uuid(), 'Pipe Threaders', 'Резбонарезни за тръби', 'tools-plumbing-pipe-threaders', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🔩', 'Manual and electric pipe threading', 'Ръчни и електрически резбонарезни', 3),
  (gen_random_uuid(), 'Drain Cleaning Tools', 'Почистване на канали', 'tools-plumbing-drain-cleaning', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🚿', 'Drain snakes, augers, jetters', 'Спирали, бурета, водоструйки', 4),
  (gen_random_uuid(), 'Plungers & Augers', 'Бутала и бурета', 'tools-plumbing-plungers', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🪠', 'Plungers, toilet augers, hand augers', 'Бутала, тоалетни бурета', 5),
  (gen_random_uuid(), 'Plumbing Soldering', 'Запояване за тръби', 'tools-plumbing-soldering', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🔥', 'Torches, solder, flux for plumbing', 'Горелки, припой, флюс', 6),
  (gen_random_uuid(), 'PEX Tools', 'PEX инструменти', 'tools-plumbing-pex', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🔧', 'PEX crimpers, expanders, cutters', 'PEX кримпери, разширители, резачки', 7),
  (gen_random_uuid(), 'Leak Detection Tools', 'Откриване на течове', 'tools-plumbing-leak-detection', '46a671dc-2aec-41f0-94e2-0d3601c66499', '💧', 'Leak detectors, pressure testers', 'Детектори за течове, тестери', 8),
  (gen_random_uuid(), 'Plumbing Tool Accessories', 'ВиК аксесоари', 'tools-plumbing-accessories', '46a671dc-2aec-41f0-94e2-0d3601c66499', '🧰', 'Fittings, adapters, plumbing supplies', 'Фитинги, адаптери, ВиК консумативи', 9);

-- =====================================================
-- L2 Categories for Electrical Tools (0b270f5f-36b3-4721-b846-1792e51b204a)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Wire Strippers', 'Клещи за оголване', 'tools-electrical-wire-strippers', '0b270f5f-36b3-4721-b846-1792e51b204a', '⚡', 'Manual and automatic wire strippers', 'Ръчни и автоматични клещи за оголване', 1),
  (gen_random_uuid(), 'Crimping Tools', 'Кримпващи клещи', 'tools-electrical-crimpers', '0b270f5f-36b3-4721-b846-1792e51b204a', '🔧', 'Wire and terminal crimpers', 'Клещи за накрайници и кабелни обувки', 2),
  (gen_random_uuid(), 'Multimeters', 'Мултимери', 'tools-electrical-multimeters', '0b270f5f-36b3-4721-b846-1792e51b204a', '📊', 'Digital and analog multimeters', 'Дигитални и аналогови мултимери', 3),
  (gen_random_uuid(), 'Voltage Testers', 'Волтметри и тестери', 'tools-electrical-voltage-testers', '0b270f5f-36b3-4721-b846-1792e51b204a', '⚡', 'Non-contact and contact voltage testers', 'Безконтактни и контактни тестери', 4),
  (gen_random_uuid(), 'Cable Tools', 'Инструменти за кабели', 'tools-electrical-cable-tools', '0b270f5f-36b3-4721-b846-1792e51b204a', '🔌', 'Cable pullers, fish tapes, cutters', 'Изтеглители, тиганки, резачки', 5),
  (gen_random_uuid(), 'Circuit Testers', 'Тестери за вериги', 'tools-electrical-circuit-testers', '0b270f5f-36b3-4721-b846-1792e51b204a', '🔍', 'Circuit finders, outlet testers', 'Търсачи на вериги, тестери за контакти', 6),
  (gen_random_uuid(), 'Insulated Tools', 'Изолирани инструменти', 'tools-electrical-insulated', '0b270f5f-36b3-4721-b846-1792e51b204a', '🛡️', 'VDE insulated pliers, screwdrivers', 'VDE изолирани клещи, отвертки', 7),
  (gen_random_uuid(), 'Conduit Tools', 'Инструменти за гофре', 'tools-electrical-conduit', '0b270f5f-36b3-4721-b846-1792e51b204a', '🔧', 'Conduit benders, reamers, cutters', 'Огъвачи, райбери, резачки за гофре', 8),
  (gen_random_uuid(), 'Electrical Tool Accessories', 'Електрически аксесоари', 'tools-electrical-accessories', '0b270f5f-36b3-4721-b846-1792e51b204a', '🧰', 'Terminals, connectors, heat shrink', 'Накрайници, конектори, термосвиваем', 9);

-- =====================================================
-- L2 Categories for Construction & Masonry (f0d44138-7000-4a8b-ba2d-32409fa45cce)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Concrete Mixers', 'Бетонобъркачки', 'tools-concrete-mixers', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🏗️', 'Portable and stationary concrete mixers', 'Преносими и стационарни бетонобъркачки', 1),
  (gen_random_uuid(), 'Masonry Saws', 'Циркуляри за бетон', 'tools-masonry-saws', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🪚', 'Block saws, tile saws, masonry cutters', 'Триони за блокчета, плочки, бетон', 2),
  (gen_random_uuid(), 'Trowels & Floats', 'Мистрии и маламашки', 'tools-masonry-trowels', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🔧', 'Brick, finishing, and margin trowels', 'Зидарски, шпакловъчни мистрии', 3),
  (gen_random_uuid(), 'Levels & Squares', 'Нивелири и ъгли', 'tools-construction-levels', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '📐', 'Spirit levels, laser levels, squares', 'Либели, лазерни нивелири, ъгломери', 4),
  (gen_random_uuid(), 'Scaffolding', 'Скелета', 'tools-scaffolding', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🏗️', 'Frame, rolling, and mobile scaffolding', 'Рамкови, подвижни скелета', 5),
  (gen_random_uuid(), 'Concrete Vibrators', 'Вибратори за бетон', 'tools-concrete-vibrators', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🔧', 'Internal and external concrete vibrators', 'Иглени и повърхностни вибратори', 6),
  (gen_random_uuid(), 'Formwork', 'Кофраж', 'tools-formwork', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '📦', 'Formwork panels, ties, and accessories', 'Кофражни платна, свръзки, аксесоари', 7),
  (gen_random_uuid(), 'Rebar Tools', 'Инструменти за армировка', 'tools-rebar-tools', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🔧', 'Rebar cutters, benders, tiers', 'Резачки, огъвачи, връзвачки за арматура', 8),
  (gen_random_uuid(), 'Construction Tool Accessories', 'Строителни аксесоари', 'tools-construction-accessories', 'f0d44138-7000-4a8b-ba2d-32409fa45cce', '🧰', 'Chalk lines, plumb bobs, accessories', 'Маркиращи шнурове, отвеси, аксесоари', 9)
ON CONFLICT (slug) DO NOTHING;;
