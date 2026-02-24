-- =====================================================
-- L2 Categories for Automotive Tools (b46cd1e5-c0b6-4103-902f-a2fabcb44677)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Diagnostic Tools', 'Диагностични уреди', 'automotive-diagnostic', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🔍', 'OBD scanners, code readers, diagnostic equipment', 'OBD скенери, четци на кодове, диагностика', 1),
  (gen_random_uuid(), 'Jacks & Lifts', 'Крикове и подемници', 'automotive-jacks', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🚗', 'Floor jacks, bottle jacks, car lifts', 'Подови крикове, бутилкови крикове, подемници', 2),
  (gen_random_uuid(), 'Jack Stands & Ramps', 'Подставки и рампи', 'automotive-stands', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🛠️', 'Jack stands, vehicle ramps, wheel dollies', 'Подставки, автомобилни рампи, количчета', 3),
  (gen_random_uuid(), 'Engine Tools', 'Инструменти за двигатели', 'automotive-engine', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '⚙️', 'Engine hoists, timing tools, compression testers', 'Кранове за двигатели, инструменти за ремък', 4),
  (gen_random_uuid(), 'Brake Tools', 'Спирачни инструменти', 'automotive-brake', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🛑', 'Brake bleeders, caliper tools, rotor tools', 'Обезвъздушители, инструменти за апарати', 5),
  (gen_random_uuid(), 'Tire & Wheel Tools', 'Инструменти за гуми', 'automotive-tire', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🛞', 'Tire changers, balancers, TPMS tools', 'Машини за гуми, баланси, TPMS', 6),
  (gen_random_uuid(), 'Battery Tools', 'Инструменти за акумулатори', 'automotive-battery', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🔋', 'Battery chargers, testers, jump starters', 'Зарядни, тестери, стартери', 7),
  (gen_random_uuid(), 'Oil & Fluid Tools', 'Инструменти за масло', 'automotive-fluids', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🛢️', 'Oil extractors, drain pans, fluid transfer', 'Маслоизвличащи, тави, помпи', 8),
  (gen_random_uuid(), 'Body & Frame Tools', 'Инструменти за каросерия', 'automotive-body', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🚙', 'Dent pullers, frame straighteners, body hammers', 'Изправящи вдлъбнатини, рихтовъчни', 9),
  (gen_random_uuid(), 'Suspension Tools', 'Ходова част инструменти', 'automotive-suspension', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🔧', 'Ball joint, tie rod, spring compressor tools', 'Шарнири, карета, пресователи', 10),
  (gen_random_uuid(), 'AC & Cooling Tools', 'Инструменти за климатик', 'automotive-ac', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '❄️', 'Refrigerant recovery, leak detectors, AC tools', 'Рекуперация, детектори за течове', 11),
  (gen_random_uuid(), 'Auto Tool Sets', 'Автомобилни комплекти', 'automotive-sets', 'b46cd1e5-c0b6-4103-902f-a2fabcb44677', '🧰', 'Complete automotive tool sets', 'Пълни автомобилни комплекти', 12)
ON CONFLICT (slug) DO NOTHING;;
