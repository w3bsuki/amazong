
-- Add missing base attributes to L0 categories that need them

-- Get category IDs first
WITH cat_ids AS (
  SELECT id, slug FROM categories 
  WHERE slug IN ('hobbies', 'sports', 'tools-home')
)

-- HOBBIES: Add Material (already has condition, brand, skill_level, age_group)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Material',
  'Материал',
  'select',
  false,
  true,
  '["Wood", "Plastic", "Metal", "Fabric", "Paper", "Glass", "Ceramic", "Resin", "Mixed"]'::jsonb,
  '["Дърво", "Пластмаса", "Метал", "Плат", "Хартия", "Стъкло", "Керамика", "Смола", "Смесен"]'::jsonb,
  5
FROM categories WHERE slug = 'hobbies';

-- SPORTS: Add Material, Certification (already has Sport Type, Skill Level, Indoor/Outdoor, Gender, Weight)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Material',
  'Материал',
  'select',
  false,
  true,
  '["Leather", "Synthetic", "Rubber", "Carbon Fiber", "Aluminum", "Steel", "Nylon", "Polyester", "Cotton", "EVA Foam"]'::jsonb,
  '["Кожа", "Синтетика", "Гума", "Карбон", "Алуминий", "Стомана", "Найлон", "Полиестер", "Памук", "EVA пяна"]'::jsonb,
  6
FROM categories WHERE slug = 'sports';

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Brand',
  'Марка',
  'select',
  false,
  true,
  '["Nike", "Adidas", "Puma", "Under Armour", "Reebok", "New Balance", "ASICS", "Decathlon", "Wilson", "Speedo", "The North Face", "Columbia", "Other"]'::jsonb,
  '["Nike", "Adidas", "Puma", "Under Armour", "Reebok", "New Balance", "ASICS", "Декатлон", "Wilson", "Speedo", "The North Face", "Columbia", "Друга"]'::jsonb,
  7
FROM categories WHERE slug = 'sports';

-- TOOLS & INDUSTRIAL: Add Warranty, Certification, Brand (as select)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Warranty',
  'Гаранция',
  'select',
  false,
  true,
  '["No Warranty", "30 Days", "90 Days", "1 Year", "2 Years", "3 Years", "5 Years", "Lifetime"]'::jsonb,
  '["Без гаранция", "30 дни", "90 дни", "1 година", "2 години", "3 години", "5 години", "Доживотна"]'::jsonb,
  7
FROM categories WHERE slug = 'tools-home';

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Certification',
  'Сертификация',
  'multiselect',
  false,
  true,
  '["CE", "UL", "ISO 9001", "OSHA Compliant", "CSA", "TÜV", "RoHS", "None"]'::jsonb,
  '["CE", "UL", "ISO 9001", "OSHA съвместим", "CSA", "TÜV", "RoHS", "Няма"]'::jsonb,
  8
FROM categories WHERE slug = 'tools-home';

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  id,
  'Brand',
  'Марка',
  'select',
  false,
  true,
  '["Bosch", "DeWalt", "Makita", "Milwaukee", "Stanley", "Black+Decker", "Metabo", "Festool", "Hilti", "Ryobi", "Einhell", "Parkside", "Other"]'::jsonb,
  '["Bosch", "DeWalt", "Makita", "Milwaukee", "Stanley", "Black+Decker", "Metabo", "Festool", "Hilti", "Ryobi", "Einhell", "Parkside", "Друга"]'::jsonb,
  9
FROM categories WHERE slug = 'tools-home';
;
