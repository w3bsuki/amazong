
-- Phase 5: Real Estate - Comprehensive Attributes

DO $$
DECLARE
  re_id UUID;
BEGIN
  SELECT id INTO re_id FROM categories WHERE slug = 'real-estate';
  
  -- Core Real Estate Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (re_id, 'Listing Type', 'Тип обява', 'select', '["For Sale", "For Rent", "For Lease", "Auction"]', '["Продажба", "Под наем", "Лизинг", "Търг"]', true, true, 1),
    (re_id, 'Property Type', 'Тип имот', 'select', '["Apartment", "House", "Villa", "Studio", "Townhouse", "Penthouse", "Land", "Commercial", "Industrial"]', '["Апартамент", "Къща", "Вила", "Студио", "Редова къща", "Пентхаус", "Земя", "Търговски", "Индустриален"]', true, true, 2),
    (re_id, 'Bedrooms', 'Спални', 'select', '["Studio", "1", "2", "3", "4", "5+"]', '["Студио", "1", "2", "3", "4", "5+"]', false, true, 3),
    (re_id, 'Bathrooms', 'Бани', 'select', '["1", "2", "3", "4+"]', '["1", "2", "3", "4+"]', false, true, 4),
    (re_id, 'Area (sq.m.)', 'Площ (кв.м.)', 'number', NULL, NULL, false, true, 5),
    (re_id, 'Floor', 'Етаж', 'select', '["Ground", "1", "2", "3", "4", "5", "6-10", "11-20", "20+", "Last"]', '["Партер", "1", "2", "3", "4", "5", "6-10", "11-20", "20+", "Последен"]', false, true, 6),
    (re_id, 'Year Built', 'Година на строеж', 'text', NULL, NULL, false, true, 7),
    (re_id, 'Condition', 'Състояние', 'select', '["New", "Excellent", "Good", "Needs Renovation", "Under Construction"]', '["Ново", "Отлично", "Добро", "Нуждае се от ремонт", "В строеж"]', false, true, 8),
    (re_id, 'Furnishing', 'Обзавеждане', 'select', '["Unfurnished", "Semi-furnished", "Fully Furnished"]', '["Необзаведен", "Частично обзаведен", "Напълно обзаведен"]', false, true, 9),
    (re_id, 'Heating', 'Отопление', 'select', '["Central", "Electric", "Gas", "Air Conditioning", "None"]', '["Централно", "Електрическо", "Газово", "Климатик", "Няма"]', false, true, 10)
  ON CONFLICT DO NOTHING;
END $$;

-- Residential Sales specific attributes
DO $$
DECLARE
  res_sales_id UUID;
BEGIN
  SELECT id INTO res_sales_id FROM categories WHERE slug = 'residential-sales';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (res_sales_id, 'Ownership Type', 'Тип собственост', 'select', '["Freehold", "Leasehold", "Co-op"]', '["Пълна собственост", "Лизхолд", "Кооперативна"]', false, true, 1),
    (res_sales_id, 'Has Garage', 'С гараж', 'boolean', NULL, NULL, false, true, 2),
    (res_sales_id, 'Has Parking', 'С паркомясто', 'boolean', NULL, NULL, false, true, 3),
    (res_sales_id, 'Has Garden', 'С двор', 'boolean', NULL, NULL, false, true, 4),
    (res_sales_id, 'Has Elevator', 'С асансьор', 'boolean', NULL, NULL, false, true, 5),
    (res_sales_id, 'Has Balcony', 'С балкон', 'boolean', NULL, NULL, false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- Residential Rentals specific attributes
DO $$
DECLARE
  res_rent_id UUID;
BEGIN
  SELECT id INTO res_rent_id FROM categories WHERE slug = 'residential-rentals';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (res_rent_id, 'Lease Term', 'Срок на наем', 'select', '["Short-term (< 1 month)", "1-6 months", "6-12 months", "12+ months", "Flexible"]', '["Краткосрочен (< 1 месец)", "1-6 месеца", "6-12 месеца", "12+ месеца", "Гъвкав"]', false, true, 1),
    (res_rent_id, 'Deposit Required', 'Депозит', 'select', '["None", "1 month", "2 months", "3 months"]', '["Няма", "1 месец", "2 месеца", "3 месеца"]', false, true, 2),
    (res_rent_id, 'Pets Allowed', 'Домашни любимци', 'boolean', NULL, NULL, false, true, 3),
    (res_rent_id, 'Utilities Included', 'Комунални включени', 'boolean', NULL, NULL, false, true, 4),
    (res_rent_id, 'Available From', 'Свободен от', 'text', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- Commercial specific attributes
DO $$
DECLARE
  commercial_id UUID;
BEGIN
  SELECT id INTO commercial_id FROM categories WHERE slug = 'commercial';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (commercial_id, 'Commercial Type', 'Тип комерсиален', 'select', '["Office", "Retail", "Restaurant", "Warehouse", "Industrial", "Mixed Use"]', '["Офис", "Магазин", "Ресторант", "Склад", "Индустриален", "Смесено ползване"]', false, true, 1),
    (commercial_id, 'Class', 'Клас', 'select', '["Class A", "Class B", "Class C"]', '["Клас A", "Клас B", "Клас C"]', false, true, 2),
    (commercial_id, 'Loading Dock', 'Товарна рампа', 'boolean', NULL, NULL, false, true, 3),
    (commercial_id, 'High Ceilings', 'Високи тавани', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Land specific attributes
DO $$
DECLARE
  land_id UUID;
BEGIN
  SELECT id INTO land_id FROM categories WHERE slug = 'land';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (land_id, 'Land Use', 'Предназначение', 'select', '["Residential", "Commercial", "Agricultural", "Industrial", "Mixed"]', '["Жилищно", "Търговско", "Земеделско", "Индустриално", "Смесено"]', false, true, 1),
    (land_id, 'Zoning', 'Зониране', 'text', NULL, NULL, false, true, 2),
    (land_id, 'Has Utilities', 'С комуникации', 'boolean', NULL, NULL, false, true, 3),
    (land_id, 'Road Access', 'Достъп до път', 'boolean', NULL, NULL, false, true, 4),
    (land_id, 'Buildable', 'С право на строеж', 'boolean', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- Vacation Rentals specific attributes
DO $$
DECLARE
  vacation_id UUID;
BEGIN
  SELECT id INTO vacation_id FROM categories WHERE slug = 'vacation-rentals';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (vacation_id, 'Rental Period', 'Период на наем', 'select', '["Daily", "Weekly", "Monthly", "Seasonal"]', '["Дневно", "Седмично", "Месечно", "Сезонно"]', false, true, 1),
    (vacation_id, 'Max Guests', 'Макс. гости', 'select', '["2", "4", "6", "8", "10+"]', '["2", "4", "6", "8", "10+"]', false, true, 2),
    (vacation_id, 'Has Pool', 'С басейн', 'boolean', NULL, NULL, false, true, 3),
    (vacation_id, 'Sea View', 'Изглед към море', 'boolean', NULL, NULL, false, true, 4),
    (vacation_id, 'Mountain View', 'Изглед към планина', 'boolean', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;
;
