
-- Add comprehensive attributes to Home & Kitchen L0
-- First, update existing and add new universal attributes

-- Update existing attributes with better options
UPDATE category_attributes 
SET options = '["New", "Like New", "Good", "Fair", "For Parts/Repair"]'::jsonb,
    options_bg = '["Нов", "Като нов", "Добро", "Задоволително", "За части/ремонт"]'::jsonb
WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' 
AND name = 'Condition';

-- Add Condition if not exists
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  'e1a9ee96-632b-4939-babe-6923034fde2e',
  'Condition',
  'Състояние',
  'select',
  true,
  true,
  '["New", "Like New", "Good", "Fair", "For Parts/Repair"]'::jsonb,
  '["Нов", "Като нов", "Добро", "Задоволително", "За части/ремонт"]'::jsonb,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM category_attributes 
  WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' AND name = 'Condition'
);

-- Add Brand attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  'e1a9ee96-632b-4939-babe-6923034fde2e',
  'Brand',
  'Марка',
  'select',
  false,
  true,
  '["IKEA", "Ashley Furniture", "Wayfair", "West Elm", "Crate & Barrel", "Pottery Barn", "CB2", "Williams Sonoma", "KitchenAid", "Cuisinart", "Dyson", "Philips", "Samsung", "LG", "Bosch", "Tefal", "WMF", "Zwilling", "Le Creuset", "OXO", "Brabantia", "Joseph Joseph", "Villeroy & Boch", "Nespresso", "DeLonghi", "Other"]'::jsonb,
  '["IKEA", "Ashley Furniture", "Wayfair", "West Elm", "Crate & Barrel", "Pottery Barn", "CB2", "Williams Sonoma", "KitchenAid", "Cuisinart", "Dyson", "Philips", "Samsung", "LG", "Bosch", "Tefal", "WMF", "Zwilling", "Le Creuset", "OXO", "Brabantia", "Joseph Joseph", "Villeroy & Boch", "Nespresso", "DeLonghi", "Друга"]'::jsonb,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM category_attributes 
  WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' AND name = 'Brand'
);

-- Add Color attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  'e1a9ee96-632b-4939-babe-6923034fde2e',
  'Color',
  'Цвят',
  'multiselect',
  false,
  true,
  '["White", "Black", "Gray", "Brown", "Beige", "Blue", "Green", "Red", "Yellow", "Orange", "Pink", "Purple", "Gold", "Silver", "Natural Wood", "Multi-Color"]'::jsonb,
  '["Бял", "Черен", "Сив", "Кафяв", "Бежов", "Син", "Зелен", "Червен", "Жълт", "Оранжев", "Розов", "Лилав", "Златист", "Сребрист", "Натурално дърво", "Многоцветен"]'::jsonb,
  3
WHERE NOT EXISTS (
  SELECT 1 FROM category_attributes 
  WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' AND name = 'Color'
);

-- Add Price Range attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  'e1a9ee96-632b-4939-babe-6923034fde2e',
  'Price Range',
  'Ценови диапазон',
  'select',
  false,
  true,
  '["Budget (Under 50 лв)", "Mid-Range (50-200 лв)", "Premium (200-500 лв)", "Luxury (500+ лв)"]'::jsonb,
  '["Бюджетен (под 50 лв)", "Среден клас (50-200 лв)", "Премиум (200-500 лв)", "Луксозен (500+ лв)"]'::jsonb,
  4
WHERE NOT EXISTS (
  SELECT 1 FROM category_attributes 
  WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' AND name = 'Price Range'
);

-- Add Warranty attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  'e1a9ee96-632b-4939-babe-6923034fde2e',
  'Warranty',
  'Гаранция',
  'select',
  false,
  true,
  '["No Warranty", "30 Days", "90 Days", "6 Months", "1 Year", "2 Years", "5 Years", "Lifetime"]'::jsonb,
  '["Без гаранция", "30 дни", "90 дни", "6 месеца", "1 година", "2 години", "5 години", "Доживотна"]'::jsonb,
  5
WHERE NOT EXISTS (
  SELECT 1 FROM category_attributes 
  WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' AND name = 'Warranty'
);

-- Add Origin attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  'e1a9ee96-632b-4939-babe-6923034fde2e',
  'Country of Origin',
  'Страна на произход',
  'select',
  false,
  true,
  '["Bulgaria", "EU", "USA", "China", "Turkey", "Other"]'::jsonb,
  '["България", "ЕС", "САЩ", "Китай", "Турция", "Друга"]'::jsonb,
  6
WHERE NOT EXISTS (
  SELECT 1 FROM category_attributes 
  WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' AND name = 'Country of Origin'
);
;
