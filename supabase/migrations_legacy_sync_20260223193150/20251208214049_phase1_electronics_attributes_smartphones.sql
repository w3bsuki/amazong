
-- Phase 1.8: Add Attributes to Electronics Categories
-- Part 1: Smartphone Attributes

-- Add attributes to Smartphones L1 category (will inherit to all smartphone L2/L3)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Storage', 'Памет', 'select', true, '["32GB","64GB","128GB","256GB","512GB","1TB"]', '["32GB","64GB","128GB","256GB","512GB","1TB"]', 1),
  ('RAM', 'RAM', 'select', false, '["4GB","6GB","8GB","12GB","16GB","18GB","24GB"]', '["4GB","6GB","8GB","12GB","16GB","18GB","24GB"]', 2),
  ('Network', 'Мрежа', 'select', true, '["5G","4G LTE","3G Only"]', '["5G","4G LTE","Само 3G"]', 3),
  ('Screen Size', 'Размер екран', 'select', false, '["Under 5.5\"","5.5\"-6.0\"","6.0\"-6.5\"","6.5\"-7.0\"","7.0\"+"]', '["Под 5.5\"","5.5\"-6.0\"","6.0\"-6.5\"","6.5\"-7.0\"","7.0\"+"]', 4),
  ('Carrier Lock', 'Заключен към оператор', 'select', false, '["Unlocked","Carrier Locked","Factory Unlocked"]', '["Отключен","Заключен","Фабрично отключен"]', 5),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable","For Parts"]', '["Ново","Като ново","Много добро","Добро","Приемливо","За части"]', 6),
  ('Color', 'Цвят', 'select', false, '["Black","White","Silver","Gold","Blue","Green","Purple","Red","Pink","Other"]', '["Черен","Бял","Сребрист","Златен","Син","Зелен","Лилав","Червен","Розов","Друг"]', 7),
  ('SIM Type', 'Тип SIM', 'select', false, '["Single SIM","Dual SIM","eSIM Only","Dual SIM + eSIM"]', '["Единична SIM","Двойна SIM","Само eSIM","Двойна SIM + eSIM"]', 8),
  ('Camera MP', 'Камера MP', 'select', false, '["Under 12MP","12MP","48MP","50MP","64MP","108MP","200MP+"]', '["Под 12MP","12MP","48MP","50MP","64MP","108MP","200MP+"]', 9),
  ('Battery', 'Батерия', 'select', false, '["Under 3000mAh","3000-4000mAh","4000-5000mAh","5000-6000mAh","6000mAh+"]', '["Под 3000mAh","3000-4000mAh","4000-5000mAh","5000-6000mAh","6000mAh+"]', 10),
  ('Fast Charging', 'Бързо зареждане', 'select', false, '["No","18W","25W","33W","45W","65W","100W+","Wireless"]', '["Не","18W","25W","33W","45W","65W","100W+","Безжично"]', 11)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Tablets L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'tablets'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Storage', 'Памет', 'select', true, '["32GB","64GB","128GB","256GB","512GB","1TB","2TB"]', '["32GB","64GB","128GB","256GB","512GB","1TB","2TB"]', 1),
  ('Screen Size', 'Размер екран', 'select', true, '["7\"-8\"","8\"-10\"","10\"-11\"","11\"-12\"","12\"-13\"","13\"+"]', '["7\"-8\"","8\"-10\"","10\"-11\"","11\"-12\"","12\"-13\"","13\"+"]', 2),
  ('Connectivity', 'Свързаност', 'select', true, '["WiFi Only","WiFi + Cellular","5G"]', '["Само WiFi","WiFi + Cellular","5G"]', 3),
  ('Display Type', 'Тип дисплей', 'select', false, '["LCD","OLED","Mini-LED","E-Ink","ProMotion","Retina"]', '["LCD","OLED","Mini-LED","E-Ink","ProMotion","Retina"]', 4),
  ('Stylus Support', 'Поддръжка на стилус', 'select', false, '["None","Apple Pencil","S Pen","USI Stylus","Other"]', '["Няма","Apple Pencil","S Pen","USI Stylus","Друг"]', 5),
  ('RAM', 'RAM', 'select', false, '["2GB","3GB","4GB","6GB","8GB","12GB","16GB"]', '["2GB","3GB","4GB","6GB","8GB","12GB","16GB"]', 6),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable","For Parts"]', '["Ново","Като ново","Много добро","Добро","Приемливо","За части"]', 7),
  ('Color', 'Цвят', 'select', false, '["Black","White","Silver","Gold","Blue","Green","Purple","Pink","Other"]', '["Черен","Бял","Сребрист","Златен","Син","Зелен","Лилав","Розов","Друг"]', 8),
  ('Operating System', 'Операционна система', 'select', false, '["iPadOS","Android","Windows","ChromeOS","Fire OS"]', '["iPadOS","Android","Windows","ChromeOS","Fire OS"]', 9)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
;
