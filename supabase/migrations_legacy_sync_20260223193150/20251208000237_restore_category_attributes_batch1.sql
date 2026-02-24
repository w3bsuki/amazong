-- Batch 1: Global Electronics Attributes (documented but may be missing)
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Electronics Global Attributes
  SELECT id INTO cat_id FROM categories WHERE slug = 'electronics';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Brand', 'Марка', 'select', false, true, '["Apple","Samsung","Xiaomi","Google","Sony","LG","Dell","HP","Lenovo","Asus","Acer","MSI","Huawei","OnePlus","Other"]', '["Apple","Samsung","Xiaomi","Google","Sony","LG","Dell","HP","Lenovo","Asus","Acer","MSI","Huawei","OnePlus","Друго"]', 1),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Black","White","Silver","Gold","Blue","Red","Green","Gray","Rose Gold","Purple","Multi-color"]', '["Черен","Бял","Сребрист","Златен","Син","Червен","Зелен","Сив","Розово злато","Лилав","Многоцветен"]', 2),
      (cat_id, 'Condition', 'Състояние', 'select', true, true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 3),
      (cat_id, 'Warranty', 'Гаранция', 'select', false, true, '["No Warranty","1 Month","3 Months","6 Months","1 Year","2 Years","3+ Years","Manufacturer Warranty"]', '["Без гаранция","1 месец","3 месеца","6 месеца","1 година","2 години","3+ години","Фабрична гаранция"]', 4),
      (cat_id, 'Original Box', 'Оригинална кутия', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Smartphones Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'smartphones';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Model Series', 'Модел серия', 'select', true, true, '["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 Series","iPhone 14 Series","iPhone 13 Series","iPhone SE","Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy Z Fold 6","Galaxy Z Flip 6","Galaxy A55","Pixel 9 Pro XL","Pixel 9 Pro","Pixel 9","Redmi Note 13","Other"]', '["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 серия","iPhone 14 серия","iPhone 13 серия","iPhone SE","Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy Z Fold 6","Galaxy Z Flip 6","Galaxy A55","Pixel 9 Pro XL","Pixel 9 Pro","Pixel 9","Redmi Note 13","Друго"]', 1),
      (cat_id, 'Storage', 'Памет', 'select', true, true, '["32GB","64GB","128GB","256GB","512GB","1TB"]', '["32GB","64GB","128GB","256GB","512GB","1TB"]', 2),
      (cat_id, 'RAM', 'RAM памет', 'select', false, true, '["4GB","6GB","8GB","12GB","16GB","18GB"]', '["4GB","6GB","8GB","12GB","16GB","18GB"]', 3),
      (cat_id, 'Screen Size', 'Размер на екрана', 'select', false, true, '["Under 5.5\"","5.5-6.0\"","6.0-6.5\"","6.5-7.0\"","7.0\"+ (Foldable)"]', '["Под 5.5\"","5.5-6.0\"","6.0-6.5\"","6.5-7.0\"","7.0\"+ (Сгъваем)"]', 4),
      (cat_id, 'Operating System', 'Операционна система', 'select', false, true, '["iOS 18","iOS 17","iOS 16","Android 15","Android 14","Android 13","HarmonyOS"]', '["iOS 18","iOS 17","iOS 16","Android 15","Android 14","Android 13","HarmonyOS"]', 5),
      (cat_id, 'Network', 'Мрежа', 'select', true, true, '["5G","4G LTE","3G Only"]', '["5G","4G LTE","Само 3G"]', 6),
      (cat_id, 'SIM Type', 'Тип SIM', 'multiselect', false, true, '["Single SIM","Dual SIM","eSIM","Nano SIM"]', '["Единична SIM","Двойна SIM","eSIM","Nano SIM"]', 7),
      (cat_id, 'Battery Capacity', 'Капацитет на батерията', 'select', false, true, '["Under 3000mAh","3000-4000mAh","4000-5000mAh","5000-6000mAh","6000mAh+"]', '["Под 3000mAh","3000-4000mAh","4000-5000mAh","5000-6000mAh","6000mAh+"]', 8),
      (cat_id, 'Camera MP', 'Камера MP', 'select', false, true, '["Under 12MP","12-48MP","48-64MP","64-108MP","108-200MP","200MP+"]', '["Под 12MP","12-48MP","48-64MP","64-108MP","108-200MP","200MP+"]', 9),
      (cat_id, 'Carrier Lock', 'Заключен към оператор', 'select', false, true, '["Unlocked","Locked (specify carrier)"]', '["Отключен","Заключен (уточнете оператор)"]', 10)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
