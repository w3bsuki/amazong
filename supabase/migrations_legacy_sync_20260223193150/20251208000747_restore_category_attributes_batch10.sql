-- Batch 10: More specific category attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Motorcycles
  SELECT id INTO cat_id FROM categories WHERE slug = 'motorcycles';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Make', 'Марка', 'select', true, true, '["Honda","Yamaha","Kawasaki","Suzuki","BMW","Ducati","Harley-Davidson","KTM","Triumph","Aprilia","Other"]', '["Honda","Yamaha","Kawasaki","Suzuki","BMW","Ducati","Harley-Davidson","KTM","Triumph","Aprilia","Друго"]', 1),
      (cat_id, 'Type', 'Тип', 'select', true, true, '["Sport","Cruiser","Touring","Naked/Street","Adventure","Enduro/Off-Road","Scooter","Electric"]', '["Спортен","Круизър","Туринг","Naked/Street","Адвенчър","Ендуро/Офроуд","Скутер","Електрически"]', 2),
      (cat_id, 'Engine Size (cc)', 'Обем двигател (куб.см)', 'select', false, true, '["Under 125cc","125-250cc","250-500cc","500-750cc","750-1000cc","1000cc+"]', '["Под 125cc","125-250cc","250-500cc","500-750cc","750-1000cc","1000cc+"]', 3),
      (cat_id, 'Year', 'Година', 'select', true, true, '["2024","2023","2022","2021","2020","2019","2015-2018","2010-2014","Before 2010"]', '["2024","2023","2022","2021","2020","2019","2015-2018","2010-2014","Преди 2010"]', 4),
      (cat_id, 'Mileage (km)', 'Пробег (км)', 'select', false, true, '["Under 5,000","5,000-15,000","15,000-30,000","30,000-50,000","50,000+"]', '["Под 5 000","5 000-15 000","15 000-30 000","30 000-50 000","50 000+"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Tires
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'wheels-tires';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Tire Type', 'Тип гума', 'select', true, true, '["Summer","Winter","All-Season","Off-Road"]', '["Летни","Зимни","Всесезонни","Офроуд"]', 1),
      (cat_id, 'Width', 'Ширина', 'select', false, true, '["155","165","175","185","195","205","215","225","235","245","255","265+"]', '["155","165","175","185","195","205","215","225","235","245","255","265+"]', 2),
      (cat_id, 'Aspect Ratio', 'Височина профил', 'select', false, true, '["35","40","45","50","55","60","65","70"]', '["35","40","45","50","55","60","65","70"]', 3),
      (cat_id, 'Rim Diameter', 'Диаметър джанта', 'select', true, true, '["14\"","15\"","16\"","17\"","18\"","19\"","20\"","21\"","22\"+"]', '["14\"","15\"","16\"","17\"","18\"","19\"","20\"","21\"","22\"+"]', 4),
      (cat_id, 'Brand', 'Марка', 'select', false, true, '["Michelin","Continental","Pirelli","Bridgestone","Goodyear","Dunlop","Hankook","Nokian","Other"]', '["Michelin","Continental","Pirelli","Bridgestone","Goodyear","Dunlop","Hankook","Nokian","Друго"]', 5),
      (cat_id, 'Run-Flat', 'Run-Flat', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Jewelry - Necklaces
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'necklaces';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Material', 'Материал', 'select', true, true, '["Gold 14K","Gold 18K","Gold 24K","White Gold","Rose Gold","Silver 925","Platinum","Stainless Steel","Costume"]', '["Злато 14К","Злато 18К","Злато 24К","Бяло злато","Розово злато","Сребро 925","Платина","Неръждаема стомана","Бижутерия"]', 1),
      (cat_id, 'Gemstone', 'Скъпоценен камък', 'select', false, true, '["None","Diamond","Ruby","Sapphire","Emerald","Pearl","Amethyst","Topaz","Opal","Other"]', '["Без","Диамант","Рубин","Сапфир","Изумруд","Перла","Аметист","Топаз","Опал","Друго"]', 2),
      (cat_id, 'Length', 'Дължина', 'select', false, true, '["Choker (35-40cm)","Princess (43-48cm)","Matinee (50-58cm)","Opera (70-90cm)","Rope (100cm+)"]', '["Чоукър (35-40см)","Принцеса (43-48см)","Матине (50-58см)","Опера (70-90см)","Rope (100см+)"]', 3),
      (cat_id, 'Style', 'Стил', 'select', false, true, '["Pendant","Chain","Choker","Statement","Layered","Religious","Personalized"]', '["Висулка","Верижка","Чоукър","Акцентно","Многослойно","Религиозно","Персонализирано"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Rings
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'rings';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Ring Type', 'Тип пръстен', 'select', true, true, '["Engagement","Wedding Band","Fashion","Signet","Eternity","Cocktail","Promise"]', '["Годежен","Сватбена халка","Модерен","Печатен","Етернити","Коктейлен","Обещание"]', 1),
      (cat_id, 'Material', 'Материал', 'select', true, true, '["Gold 14K","Gold 18K","White Gold","Rose Gold","Silver 925","Platinum","Titanium","Tungsten"]', '["Злато 14К","Злато 18К","Бяло злато","Розово злато","Сребро 925","Платина","Титан","Волфрам"]', 2),
      (cat_id, 'Main Stone', 'Основен камък', 'select', false, true, '["None","Diamond","Moissanite","Ruby","Sapphire","Emerald","Other"]', '["Без","Диамант","Моисанит","Рубин","Сапфир","Изумруд","Друго"]', 3),
      (cat_id, 'Ring Size', 'Размер пръстен', 'select', true, true, '["5","6","7","8","9","10","11","12"]', '["5","6","7","8","9","10","11","12"]', 4),
      (cat_id, 'Gender', 'Пол', 'select', false, true, '["Women","Men","Unisex"]', '["Дамски","Мъжки","Унисекс"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Watches
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'luxury-watches';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Brand', 'Марка', 'select', true, true, '["Rolex","Omega","Tag Heuer","Breitling","Patek Philippe","Audemars Piguet","IWC","Cartier","Jaeger-LeCoultre","Other"]', '["Rolex","Omega","Tag Heuer","Breitling","Patek Philippe","Audemars Piguet","IWC","Cartier","Jaeger-LeCoultre","Друго"]', 1),
      (cat_id, 'Movement', 'Механизъм', 'select', true, true, '["Automatic","Manual","Quartz"]', '["Автоматичен","Ръчен навод","Кварцов"]', 2),
      (cat_id, 'Case Material', 'Материал корпус', 'select', false, true, '["Stainless Steel","Gold","Rose Gold","Titanium","Ceramic","Platinum"]', '["Неръждаема стомана","Злато","Розово злато","Титан","Керамика","Платина"]', 3),
      (cat_id, 'Case Size', 'Размер корпус', 'select', false, true, '["Under 36mm","36-39mm","40-42mm","43-45mm","46mm+"]', '["Под 36мм","36-39мм","40-42мм","43-45мм","46мм+"]', 4),
      (cat_id, 'Water Resistance', 'Водоустойчивост', 'select', false, true, '["30m/3ATM","50m/5ATM","100m/10ATM","200m/20ATM","300m+ Diver"]', '["30м/3ATM","50м/5ATM","100м/10ATM","200м/20ATM","300м+ Гмуркач"]', 5),
      (cat_id, 'Box & Papers', 'Кутия и документи', 'select', false, true, '["Full Set","Box Only","Papers Only","Watch Only"]', '["Пълен комплект","Само кутия","Само документи","Само часовник"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
