-- Restore category_attributes for Electronics categories

-- Smartphones attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('smartphones', 'Brand', 'Марка', 'select', true, true, '["Apple", "Samsung", "Xiaomi", "OnePlus", "Google", "Huawei", "Motorola", "Nothing", "Sony", "ASUS", "Oppo", "Vivo", "Realme", "Honor"]', '["Apple", "Samsung", "Xiaomi", "OnePlus", "Google", "Huawei", "Motorola", "Nothing", "Sony", "ASUS", "Oppo", "Vivo", "Realme", "Honor"]', 1),
  ('smartphones', 'Storage Capacity', 'Капацитет', 'select', true, true, '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', 2),
  ('smartphones', 'Screen Size', 'Размер на екрана', 'select', false, true, '["Under 6\"", "6.0\" - 6.4\"", "6.5\" - 6.7\"", "Over 6.7\""]', '["Под 6\"", "6.0\" - 6.4\"", "6.5\" - 6.7\"", "Над 6.7\""]', 3),
  ('smartphones', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Very Good", "Good", "Acceptable"]', '["Ново", "Като ново", "Много добро", "Добро", "Приемливо"]', 4),
  ('smartphones', 'Color', 'Цвят', 'select', false, true, '["Black", "White", "Silver", "Gold", "Blue", "Green", "Red", "Purple", "Pink"]', '["Черен", "Бял", "Сребрист", "Златен", "Син", "Зелен", "Червен", "Лилав", "Розов"]', 5),
  ('smartphones', 'RAM', 'RAM памет', 'select', false, true, '["4GB", "6GB", "8GB", "12GB", "16GB"]', '["4GB", "6GB", "8GB", "12GB", "16GB"]', 6),
  ('smartphones', 'Network', 'Мрежа', 'select', false, true, '["5G", "4G LTE", "3G"]', '["5G", "4G LTE", "3G"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Laptops attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('computers-laptops', 'Brand', 'Марка', 'select', true, true, '["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Microsoft", "Razer", "Samsung", "LG"]', '["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Microsoft", "Razer", "Samsung", "LG"]', 1),
  ('computers-laptops', 'Processor', 'Процесор', 'select', true, true, '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3"]', '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3"]', 2),
  ('computers-laptops', 'RAM', 'RAM памет', 'select', true, true, '["4GB", "8GB", "16GB", "32GB", "64GB"]', '["4GB", "8GB", "16GB", "32GB", "64GB"]', 3),
  ('computers-laptops', 'Storage', 'Съхранение', 'select', true, true, '["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "1TB HDD", "2TB HDD"]', '["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "1TB HDD", "2TB HDD"]', 4),
  ('computers-laptops', 'Screen Size', 'Размер на екрана', 'select', false, true, '["11-12\"", "13-14\"", "15-16\"", "17\"+"]', '["11-12\"", "13-14\"", "15-16\"", "17\"+"]', 5),
  ('computers-laptops', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Very Good", "Good", "Acceptable"]', '["Ново", "Като ново", "Много добро", "Добро", "Приемливо"]', 6),
  ('computers-laptops', 'Graphics Card', 'Видеокарта', 'select', false, true, '["Integrated", "NVIDIA GeForce", "AMD Radeon", "Intel Iris"]', '["Интегрирана", "NVIDIA GeForce", "AMD Radeon", "Intel Iris"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Tablets attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('electronics-tablets', 'Brand', 'Марка', 'select', true, true, '["Apple", "Samsung", "Microsoft", "Lenovo", "Amazon", "Huawei", "Xiaomi"]', '["Apple", "Samsung", "Microsoft", "Lenovo", "Amazon", "Huawei", "Xiaomi"]', 1),
  ('electronics-tablets', 'Storage', 'Съхранение', 'select', true, true, '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', 2),
  ('electronics-tablets', 'Screen Size', 'Размер на екрана', 'select', false, true, '["7-8\"", "9-10\"", "11-12\"", "12\"+"]', '["7-8\"", "9-10\"", "11-12\"", "12\"+"]', 3),
  ('electronics-tablets', 'Connectivity', 'Свързаност', 'select', false, true, '["WiFi Only", "WiFi + Cellular"]', '["Само WiFi", "WiFi + Мобилни данни"]', 4),
  ('electronics-tablets', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Very Good", "Good", "Acceptable"]', '["Ново", "Като ново", "Много добро", "Добро", "Приемливо"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- TVs attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('electronics-tvs', 'Brand', 'Марка', 'select', true, true, '["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Vizio"]', '["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Vizio"]', 1),
  ('electronics-tvs', 'Screen Size', 'Размер на екрана', 'select', true, true, '["32\"", "40-43\"", "50-55\"", "60-65\"", "70-75\"", "77\"+"]', '["32\"", "40-43\"", "50-55\"", "60-65\"", "70-75\"", "77\"+"]', 2),
  ('electronics-tvs', 'Resolution', 'Резолюция', 'select', true, true, '["HD", "Full HD", "4K UHD", "8K"]', '["HD", "Full HD", "4K UHD", "8K"]', 3),
  ('electronics-tvs', 'Display Type', 'Тип дисплей', 'select', false, true, '["LED", "OLED", "QLED", "Mini LED", "Neo QLED"]', '["LED", "OLED", "QLED", "Mini LED", "Neo QLED"]', 4),
  ('electronics-tvs', 'Smart TV', 'Смарт ТВ', 'boolean', false, true, '[]', '[]', 5),
  ('electronics-tvs', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Very Good", "Good", "Acceptable"]', '["Ново", "Като ново", "Много добро", "Добро", "Приемливо"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Headphones attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('electronics-headphones', 'Brand', 'Марка', 'select', true, true, '["Sony", "Bose", "Apple", "Samsung", "JBL", "Sennheiser", "Audio-Technica", "Beats", "Jabra", "Skullcandy"]', '["Sony", "Bose", "Apple", "Samsung", "JBL", "Sennheiser", "Audio-Technica", "Beats", "Jabra", "Skullcandy"]', 1),
  ('electronics-headphones', 'Type', 'Тип', 'select', true, true, '["Over-Ear", "On-Ear", "In-Ear", "True Wireless"]', '["Наушници", "На ухото", "В ухото", "True Wireless"]', 2),
  ('electronics-headphones', 'Wireless', 'Безжични', 'boolean', false, true, '[]', '[]', 3),
  ('electronics-headphones', 'Noise Cancelling', 'Шумопотискане', 'boolean', false, true, '[]', '[]', 4),
  ('electronics-headphones', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Very Good", "Good", "Acceptable"]', '["Ново", "Като ново", "Много добро", "Добро", "Приемливо"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
