
-- Fix home-services hierarchy: consolidate 53 L2s to ~15
DO $$
DECLARE
  v_home_services UUID;
  v_electrical_services UUID;
  v_plumbing_services UUID;
  v_pest_control UUID;
BEGIN
  SELECT id INTO v_home_services FROM categories WHERE slug = 'home-services';
  SELECT id INTO v_electrical_services FROM categories WHERE slug = 'electrical-services';
  SELECT id INTO v_plumbing_services FROM categories WHERE slug = 'plumbing-services';
  SELECT id INTO v_pest_control FROM categories WHERE slug = 'pest-control';
  
  -- 1. Move electrical duplicates under electrical-services
  UPDATE categories SET parent_id = v_electrical_services
  WHERE slug IN ('home-electrical', 'services-electrical', 'services-electricians') 
    AND parent_id = v_home_services;
  
  -- 2. Move plumbing duplicates under plumbing-services
  UPDATE categories SET parent_id = v_plumbing_services
  WHERE slug IN ('home-plumbing', 'services-plumbing', 'services-plumbing-emergency') 
    AND parent_id = v_home_services;
  
  -- 3. Move pest control duplicates under pest-control
  UPDATE categories SET parent_id = v_pest_control
  WHERE slug IN ('home-pest-control', 'pest-control-services') 
    AND parent_id = v_home_services;
  
  -- 4. Delete empty duplicates (no children) - consolidate by keeping one and deleting others
  DELETE FROM categories WHERE slug IN (
    -- HVAC: keep hvac-services, delete duplicates
    'home-hvac', 'services-hvac', 'services-ac-installation', 'services-ac-repair',
    -- Landscaping: keep landscaping-services, delete duplicates  
    'home-landscaping', 'landscaping', 'services-landscaping', 'services-lawn-care',
    -- Painting: keep painting-services, delete duplicates
    'home-painting', 'services-painting', 'services-painting-interior',
    -- Moving: keep moving-services, delete duplicates
    'services-moving', 'services-moving-local',
    -- Cleaning: keep services-cleaning, delete duplicates
    'services-house-cleaning', 'services-window-cleaning', 'services-carpet-cleaning',
    -- Renovation: keep home-renovation-services, delete duplicates
    'services-renovation', 'services-renovation-bathroom', 'services-renovation-kitchen',
    -- Flooring: keep flooring-services, delete duplicate
    'home-flooring',
    -- Carpentry: keep carpentry-services, delete duplicate
    'home-carpentry',
    -- Roofing: keep roofing-services, delete duplicate
    'home-roofing',
    -- Security: keep security-systems-services, delete duplicate
    'home-security-services',
    -- Other duplicates
    'home-fencing', 'home-insulation', 'home-masonry', 'home-pool-spa', 'home-smart', 
    'home-solar', 'home-windows-doors'
  ) AND parent_id = v_home_services;
  
  RAISE NOTICE 'Home-services hierarchy fixed';
END $$;
;
