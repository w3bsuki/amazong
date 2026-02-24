-- =====================================================
-- L2 Categories for Power Tools (c939df1c-bc1f-4aed-9e7f-1a91420d3853)
-- Adding more comprehensive L2 subcategories
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  -- Additional Power Tool L2s (already has: Drills, Grinders, Impact Wrenches, Sanders, Saws)
  (gen_random_uuid(), 'Rotary Hammers', 'Перфоратори', 'powertools-rotary-hammers', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🔨', 'SDS-Plus and SDS-Max rotary hammers', 'SDS-Plus и SDS-Max перфоратори', 6),
  (gen_random_uuid(), 'Routers & Planers', 'Фрезери и ренде машини', 'powertools-routers-planers', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🔧', 'Wood routers, planers and jointers', 'Фрезери за дърво, ренде машини', 7),
  (gen_random_uuid(), 'Demolition Tools', 'Къртачи', 'powertools-demolition', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '💥', 'Demolition hammers and breakers', 'Къртачи и чукове за разбиване', 8),
  (gen_random_uuid(), 'Heat Guns', 'Пистолети за горещ въздух', 'powertools-heat-guns', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🔥', 'Industrial heat guns and accessories', 'Индустриални пистолети за горещ въздух', 9),
  (gen_random_uuid(), 'Oscillating Multi-Tools', 'Мултифункционални инструменти', 'powertools-multi-tools', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🔄', 'Oscillating and multi-function tools', 'Осцилиращи и многофункционални инструменти', 10),
  (gen_random_uuid(), 'Polishers & Buffers', 'Полирмашини', 'powertools-polishers', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '✨', 'Rotary and dual-action polishers', 'Ротационни и орбитални полирмашини', 11),
  (gen_random_uuid(), 'Nibblers & Shears', 'Нагризачи и ножици', 'powertools-nibblers-shears', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '✂️', 'Metal nibblers and electric shears', 'Нагризачи за метал и електрически ножици', 12),
  (gen_random_uuid(), 'Mixers & Stirrers', 'Бъркалки', 'powertools-mixers', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🔄', 'Paint and mortar mixers', 'Бъркалки за боя и разтвор', 13),
  (gen_random_uuid(), 'Screwdrivers & Impact Drivers', 'Електрически отвертки', 'powertools-drivers', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🔩', 'Cordless screwdrivers and impact drivers', 'Акумулаторни отвертки и ударни гайковерти', 14),
  (gen_random_uuid(), 'Cordless Power Tool Combos', 'Комплекти акумулаторни инструменти', 'powertools-combos', 'c939df1c-bc1f-4aed-9e7f-1a91420d3853', '🧰', 'Multi-tool cordless combo kits', 'Комплекти от няколко акумулаторни инструмента', 15)
ON CONFLICT (slug) DO NOTHING;;
