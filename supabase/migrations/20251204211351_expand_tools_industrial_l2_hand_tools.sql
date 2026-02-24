-- =====================================================
-- L2 Categories for Hand Tools (496c798d-00b0-4126-a69d-eeb20ace0858)
-- Already has: Hammers, Measuring Tools, Pliers, Screwdrivers, Wrenches & Spanners
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Chisels & Punches', 'Длета и секачи', 'handtools-chisels', '496c798d-00b0-4126-a69d-eeb20ace0858', '🔧', 'Wood and cold chisels, punches and sets', 'Длета за дърво и метал, секачи', 6),
  (gen_random_uuid(), 'Files & Rasps', 'Пили и рашпили', 'handtools-files', '496c798d-00b0-4126-a69d-eeb20ace0858', '📄', 'Metal files, wood rasps and needle files', 'Метални пили, дървени рашпили', 7),
  (gen_random_uuid(), 'Cutting Tools', 'Режещи инструменти', 'handtools-cutting', '496c798d-00b0-4126-a69d-eeb20ace0858', '✂️', 'Utility knives, snips, and cutting tools', 'Макетни ножове, ножици за ламарина', 8),
  (gen_random_uuid(), 'Pry Bars & Crowbars', 'Лостове и кози крака', 'handtools-pry-bars', '496c798d-00b0-4126-a69d-eeb20ace0858', '🔧', 'Pry bars, crowbars and nail pullers', 'Лостове, кози крака и изваждачи на пирони', 9),
  (gen_random_uuid(), 'Clamps & Vises', 'Стяги и менгемета', 'handtools-clamps', '496c798d-00b0-4126-a69d-eeb20ace0858', '🔒', 'C-clamps, bar clamps, bench vises', 'C-стяги, лентови стяги, менгемета', 10),
  (gen_random_uuid(), 'Socket Sets', 'Комплекти вложки', 'handtools-sockets', '496c798d-00b0-4126-a69d-eeb20ace0858', '🔧', 'Socket sets and ratchets', 'Комплекти вложки и тресчотки', 11),
  (gen_random_uuid(), 'Hex & Torx Keys', 'Шестограми и торкс ключове', 'handtools-hex-torx', '496c798d-00b0-4126-a69d-eeb20ace0858', '🔑', 'Allen keys, hex sets, Torx sets', 'Шестограми, комплекти торкс', 12),
  (gen_random_uuid(), 'Saws & Blades', 'Ръчни триони', 'handtools-saws', '496c798d-00b0-4126-a69d-eeb20ace0858', '🪚', 'Hand saws, hacksaws, coping saws', 'Ръчни триони, ножовки', 13),
  (gen_random_uuid(), 'Striking & Demolition', 'Ударни инструменти', 'handtools-striking', '496c798d-00b0-4126-a69d-eeb20ace0858', '💥', 'Sledgehammers, mallets, demolition bars', 'Боздугани, гумени чукове', 14),
  (gen_random_uuid(), 'Hand Tool Sets', 'Комплекти ръчни инструменти', 'handtools-sets', '496c798d-00b0-4126-a69d-eeb20ace0858', '🧰', 'Complete hand tool sets and kits', 'Пълни комплекти ръчни инструменти', 15)
ON CONFLICT (slug) DO NOTHING;;
