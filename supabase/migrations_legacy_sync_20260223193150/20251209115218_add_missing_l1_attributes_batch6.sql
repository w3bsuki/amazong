-- Batch 6: Real Estate and Jobs categories
DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  -- Business & Office Jobs
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'business-office-jobs';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Job Type', 'select', '["Full-time","Part-time","Contract","Freelance","Internship"]', false, 1, true),
    (v_cat_id, 'Experience Level', 'select', '["Entry Level","Junior","Mid-Level","Senior","Executive"]', false, 2, true),
    (v_cat_id, 'Work Mode', 'select', '["On-site","Remote","Hybrid"]', false, 3, true),
    (v_cat_id, 'Salary Range', 'select', '["Under 1500 BGN","1500-2500 BGN","2500-4000 BGN","4000-6000 BGN","6000+ BGN","Negotiable"]', false, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- IT & Technology Jobs
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'it-tech-jobs';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Specialization', 'select', '["Software Development","DevOps","QA","Data Science","Cybersecurity","IT Support","Product Management","UI/UX"]', false, 1, true),
    (v_cat_id, 'Job Type', 'select', '["Full-time","Part-time","Contract","Freelance"]', false, 2, true),
    (v_cat_id, 'Experience Level', 'select', '["Junior","Mid-Level","Senior","Lead","Architect"]', false, 3, true),
    (v_cat_id, 'Work Mode', 'select', '["On-site","Remote","Hybrid"]', false, 4, true),
    (v_cat_id, 'Technologies', 'text', NULL, false, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Foreclosures & Auctions
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'foreclosures-auctions';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Property Type', 'select', '["Apartment","House","Commercial","Land","Industrial","Mixed-Use"]', false, 1, true),
    (v_cat_id, 'Auction Type', 'select', '["Bank Foreclosure","Court Auction","Tax Sale","Private Auction"]', false, 2, true),
    (v_cat_id, 'Starting Price', 'select', '["Under 20000€","20000-50000€","50000-100000€","100000-200000€","200000€+"]', false, 3, true),
    (v_cat_id, 'Location', 'text', NULL, false, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Investment Properties
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'investment-properties';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Property Type', 'select', '["Residential Rental","Commercial","Mixed-Use","Development Land","Hotel/Hospitality","Student Housing"]', false, 1, true),
    (v_cat_id, 'Expected ROI', 'select', '["Under 5%","5-7%","7-10%","10-15%","15%+"]', false, 2, true),
    (v_cat_id, 'Occupancy', 'select', '["Fully Occupied","Partially Occupied","Vacant","New Development"]', false, 3, true),
    (v_cat_id, 'Price Range', 'select', '["Under 50000€","50000-100000€","100000-250000€","250000-500000€","500000€+"]', false, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Luxury Properties
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'luxury-properties';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Property Type', 'select', '["Villa","Penthouse","Estate","Mansion","Waterfront","Historic Property"]', false, 1, true),
    (v_cat_id, 'Bedrooms', 'select', '["3","4","5","6","7+"]', false, 2, true),
    (v_cat_id, 'Features', 'multiselect', '["Pool","Garden","Sea View","Mountain View","Wine Cellar","Home Theater","Gym","Spa","Smart Home"]', false, 3, true),
    (v_cat_id, 'Price Range', 'select', '["250000-500000€","500000-1M€","1M-2M€","2M-5M€","5M€+"]', false, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- New Construction
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'new-construction';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Property Type', 'select', '["Apartment","House","Townhouse","Duplex","Commercial"]', false, 1, true),
    (v_cat_id, 'Construction Stage', 'select', '["Pre-Construction","Foundation","Under Construction","Near Completion","Ready"]', false, 2, true),
    (v_cat_id, 'Energy Class', 'select', '["A+","A","B","C","Pending"]', false, 3, true),
    (v_cat_id, 'Completion Date', 'text', NULL, false, 4, true),
    (v_cat_id, 'Developer', 'text', NULL, false, 5, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Parking & Storage
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'parking-storage';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Type', 'select', '["Garage","Parking Space","Storage Unit","Warehouse Space","Container Storage"]', false, 1, true),
    (v_cat_id, 'Size', 'select', '["Small (up to 10m²)","Medium (10-25m²)","Large (25-50m²)","Very Large (50m²+)"]', false, 2, true),
    (v_cat_id, 'Features', 'multiselect', '["Covered","Heated","24/7 Access","Security","Video Surveillance","Climate Controlled"]', false, 3, true),
    (v_cat_id, 'Listing Type', 'select', '["For Sale","For Rent"]', true, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Rural & Agricultural
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'rural-agricultural';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, attribute_type, options, is_required, sort_order, is_filterable) VALUES
    (v_cat_id, 'Property Type', 'select', '["Farmland","Vineyard","Orchard","Forest","Ranch","Farm with Buildings","Agricultural Complex"]', false, 1, true),
    (v_cat_id, 'Land Size', 'select', '["Under 1 hectare","1-5 hectares","5-20 hectares","20-50 hectares","50+ hectares"]', false, 2, true),
    (v_cat_id, 'Current Use', 'select', '["Active Farm","Fallow","Mixed Use","Development Potential"]', false, 3, true),
    (v_cat_id, 'Water Access', 'select', '["Irrigation","Well","River/Lake","Municipal","None"]', false, 4, true)
    ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Batch 6: Real Estate and Jobs attributes added';
END $$;;
