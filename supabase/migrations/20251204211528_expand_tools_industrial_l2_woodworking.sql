-- =====================================================
-- L2 Categories for Woodworking Tools (6841ab90-828b-471b-9e65-2562909a86b6)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Table Saws', 'Циркулярни триони', 'woodworking-table-saws', '6841ab90-828b-471b-9e65-2562909a86b6', '🪚', 'Cabinet, contractor, portable table saws', 'Кабинетни, договорни, преносими циркуляри', 1),
  (gen_random_uuid(), 'Band Saws', 'Банцигови триони', 'woodworking-band-saws', '6841ab90-828b-471b-9e65-2562909a86b6', '🪚', 'Woodworking band saws', 'Дървообработващи банцизи', 2),
  (gen_random_uuid(), 'Jointers & Planers', 'Абрихти и щрайхмуси', 'woodworking-jointers', '6841ab90-828b-471b-9e65-2562909a86b6', '🔧', 'Benchtop and floor jointers and planers', 'Настолни и подови абрихти и щрайхмуси', 3),
  (gen_random_uuid(), 'Wood Lathes', 'Дърводелски стругове', 'woodworking-lathes', '6841ab90-828b-471b-9e65-2562909a86b6', '🔄', 'Mini to full-size wood lathes', 'Мини до пълноразмерни стругове', 4),
  (gen_random_uuid(), 'Router Tables', 'Фрезерни маси', 'woodworking-router-tables', '6841ab90-828b-471b-9e65-2562909a86b6', '🔧', 'Router tables and accessories', 'Фрезерни маси и аксесоари', 5),
  (gen_random_uuid(), 'Scroll Saws', 'Контурни триони', 'woodworking-scroll-saws', '6841ab90-828b-471b-9e65-2562909a86b6', '🪚', 'Variable speed scroll saws', 'Контурни триони с регулируема скорост', 6),
  (gen_random_uuid(), 'Drill Presses', 'Пробивни машини', 'woodworking-drill-presses', '6841ab90-828b-471b-9e65-2562909a86b6', '🔧', 'Benchtop and floor drill presses', 'Настолни и подови пробивни машини', 7),
  (gen_random_uuid(), 'Carving Tools', 'Дърворезбарски инструменти', 'woodworking-carving', '6841ab90-828b-471b-9e65-2562909a86b6', '🎨', 'Hand carving tools, chisels, gouges', 'Ръчни дърворезбарски инструменти, длета', 8),
  (gen_random_uuid(), 'Clamps & Jigs', 'Стяги и приспособления', 'woodworking-clamps', '6841ab90-828b-471b-9e65-2562909a86b6', '🔒', 'Woodworking clamps and jigs', 'Дърводелски стяги и приспособления', 9),
  (gen_random_uuid(), 'Dust Collection', 'Прахосмукачки за дърво', 'woodworking-dust', '6841ab90-828b-471b-9e65-2562909a86b6', '💨', 'Dust collectors and shop vacuums', 'Прахосмукачки и аспирации', 10),
  (gen_random_uuid(), 'Woodworking Accessories', 'Дърводелски аксесоари', 'woodworking-accessories', '6841ab90-828b-471b-9e65-2562909a86b6', '🧰', 'Bits, blades, jigs and accessories', 'Фрези, ножове, приспособления', 11)
ON CONFLICT (slug) DO NOTHING;;
