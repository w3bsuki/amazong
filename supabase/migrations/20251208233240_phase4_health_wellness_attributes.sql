-- Phase 4: Health & Wellness - Attributes for L1 categories

DO $$
DECLARE
  -- Health & Wellness L1 IDs
  supplements_id UUID := 'd1cdc34b-0001-4000-8000-000000000001';
  specialty_id UUID := 'd1cdc34b-0002-4000-8000-000000000002';
  sports_nutr_id UUID := 'd1cdc34b-0003-4000-8000-000000000003';
  medical_id UUID := 'd1cdc34b-0004-4000-8000-000000000004';
  natural_id UUID := 'd1cdc34b-0005-4000-8000-000000000005';
BEGIN
  -- Supplements & Vitamins Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (supplements_id, 'Form', 'Форма', 'select', true, true, '["Capsules", "Tablets", "Softgels", "Powder", "Liquid", "Gummies", "Chewables", "Spray"]', 1),
    (supplements_id, 'Dietary Preference', 'Диетични предпочитания', 'multiselect', false, true, '["Vegan", "Vegetarian", "Gluten-Free", "Non-GMO", "Organic", "Kosher", "Halal", "Sugar-Free"]', 2),
    (supplements_id, 'Target Benefit', 'Целева полза', 'select', false, true, '["Energy", "Immunity", "Sleep", "Joint Health", "Digestion", "Heart Health", "Brain Health", "Skin/Hair/Nails", "Bone Health"]', 3),
    (supplements_id, 'Serving Size', 'Порция', 'select', false, true, '["30 servings", "60 servings", "90 servings", "120 servings", "180 servings", "Other"]', 4),
    (supplements_id, 'Brand', 'Марка', 'select', false, true, '["NOW Foods", "Nature Made", "Garden of Life", "Solgar", "Pure Encapsulations", "Thorne", "Nordic Naturals", "Life Extension", "Other"]', 5),
    (supplements_id, 'Age Group', 'Възрастова група', 'select', false, true, '["Adults", "Seniors 50+", "Children", "Teens", "All Ages"]', 6),
    (supplements_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Sealed"]', 7)
  ON CONFLICT DO NOTHING;

  -- Sports & Fitness Nutrition Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (sports_nutr_id, 'Form', 'Форма', 'select', true, true, '["Powder", "Ready-to-Drink", "Capsules", "Tablets", "Bars", "Gels"]', 1),
    (sports_nutr_id, 'Protein Type', 'Тип протеин', 'select', false, true, '["Whey Concentrate", "Whey Isolate", "Whey Hydrolysate", "Casein", "Plant-Based", "Egg", "Beef", "Blended"]', 2),
    (sports_nutr_id, 'Flavor', 'Вкус', 'select', false, true, '["Chocolate", "Vanilla", "Strawberry", "Cookies & Cream", "Peanut Butter", "Banana", "Unflavored", "Other"]', 3),
    (sports_nutr_id, 'Goal', 'Цел', 'select', false, true, '["Muscle Building", "Weight Loss", "Endurance", "Recovery", "Energy", "Lean Muscle", "Performance"]', 4),
    (sports_nutr_id, 'Dietary', 'Диета', 'multiselect', false, true, '["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Soy-Free", "Sugar-Free", "Keto-Friendly"]', 5),
    (sports_nutr_id, 'Serving Size', 'Порция', 'select', false, true, '["1-2 lb", "2-5 lb", "5-10 lb", "10+ lb", "Single Serving", "Box of 12"]', 6),
    (sports_nutr_id, 'Brand', 'Марка', 'select', false, true, '["Optimum Nutrition", "MuscleTech", "BSN", "Dymatize", "MyProtein", "Cellucor", "JYM", "Ghost", "Other"]', 7),
    (sports_nutr_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Sealed"]', 8)
  ON CONFLICT DO NOTHING;

  -- Medical & Personal Care Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (medical_id, 'Product Type', 'Тип продукт', 'select', true, true, '["Monitor", "Test Kit", "Supplies", "Mobility Aid", "First Aid", "Pain Relief", "Personal Care"]', 1),
    (medical_id, 'Power Source', 'Захранване', 'select', false, true, '["Battery", "Rechargeable", "USB", "Manual", "AC Power"]', 2),
    (medical_id, 'FDA Cleared', 'FDA одобрен', 'select', false, true, '["Yes", "No", "N/A"]', 3),
    (medical_id, 'Prescription Required', 'Изисква рецепта', 'select', false, true, '["Yes", "No", "OTC"]', 4),
    (medical_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Refurbished", "Used - Good"]', 5),
    (medical_id, 'Warranty', 'Гаранция', 'select', false, true, '["No Warranty", "30 Days", "90 Days", "1 Year", "2 Years", "Lifetime"]', 6)
  ON CONFLICT DO NOTHING;

  -- Natural & Alternative Wellness Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (natural_id, 'Type', 'Тип', 'select', true, true, '["Essential Oil", "Herbal Supplement", "CBD Product", "Homeopathic", "Aromatherapy", "Traditional Medicine"]', 1),
    (natural_id, 'Form', 'Форма', 'select', false, true, '["Oil", "Capsules", "Tincture", "Powder", "Tea", "Topical", "Spray"]', 2),
    (natural_id, 'Extraction Method', 'Метод на екстракция', 'select', false, true, '["Cold Pressed", "Steam Distilled", "CO2 Extracted", "Alcohol Extracted", "Other"]', 3),
    (natural_id, 'Organic Certified', 'Органичен сертификат', 'select', false, true, '["USDA Organic", "EU Organic", "Non-Organic", "Wildcrafted"]', 4),
    (natural_id, 'Purity', 'Чистота', 'select', false, true, '["100% Pure", "Blend", "Therapeutic Grade", "Food Grade"]', 5),
    (natural_id, 'Brand', 'Марка', 'select', false, true, '["doTERRA", "Young Living", "Plant Therapy", "NOW Essential Oils", "Gaia Herbs", "Other"]', 6),
    (natural_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Sealed"]', 7)
  ON CONFLICT DO NOTHING;

  -- Specialty & Targeted Health Attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order) VALUES
    (specialty_id, 'Target Audience', 'Целева аудитория', 'select', true, true, '["Men", "Women", "Children", "Seniors", "Pregnant Women", "All Adults"]', 1),
    (specialty_id, 'Health Focus', 'Здравен фокус', 'select', true, true, '["Heart Health", "Blood Sugar", "Hormone Balance", "Stress & Mood", "Anti-Aging", "Fertility", "Children''s Health"]', 2),
    (specialty_id, 'Form', 'Форма', 'select', false, true, '["Capsules", "Tablets", "Softgels", "Powder", "Liquid", "Gummies"]', 3),
    (specialty_id, 'Doctor Formulated', 'Формулирано от лекар', 'select', false, true, '["Yes", "No"]', 4),
    (specialty_id, 'Third Party Tested', 'Тестван от трета страна', 'select', false, true, '["Yes", "No", "NSF Certified", "USP Verified"]', 5),
    (specialty_id, 'Condition', 'Състояние', 'select', true, true, '["New", "Sealed"]', 6)
  ON CONFLICT DO NOTHING;

END $$;;
