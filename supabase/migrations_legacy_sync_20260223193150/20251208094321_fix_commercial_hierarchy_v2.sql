
-- Fix commercial hierarchy - handle children first
DO $$
DECLARE
  v_commercial UUID;
  v_comm_office UUID;
  v_comm_retail UUID;
  v_comm_warehouse UUID;
  v_comm_hotel UUID;
  v_comm_restaurant UUID;
  v_comm_industrial UUID;
BEGIN
  SELECT id INTO v_commercial FROM categories WHERE slug = 'commercial';
  SELECT id INTO v_comm_office FROM categories WHERE slug = 'comm-office';
  SELECT id INTO v_comm_retail FROM categories WHERE slug = 'comm-retail';
  SELECT id INTO v_comm_warehouse FROM categories WHERE slug = 'comm-warehouse';
  SELECT id INTO v_comm_hotel FROM categories WHERE slug = 'comm-hotel';
  SELECT id INTO v_comm_restaurant FROM categories WHERE slug = 'comm-restaurant';
  SELECT id INTO v_comm_industrial FROM categories WHERE slug = 'comm-industrial';
  
  -- 1. Move children of commercial-sale to comm-* parents
  UPDATE categories SET parent_id = v_commercial
  WHERE parent_id IN (
    SELECT id FROM categories WHERE slug IN ('commercial-sale', 'commercial-rent', 'commercial-rentals')
  );
  
  -- 2. Now delete empty duplicates that have no children
  DELETE FROM categories 
  WHERE slug IN (
    'commercial-office', 'commercial-office-private', 'commercial-office-shared', 'office-buildings-sale', 'offices-commercial-sale',
    'commercial-retail', 'commercial-shops', 'retail-shops-sale', 'kiosks-sale', 'shopping-centers-sale', 'showrooms-sale',
    'commercial-restaurants', 'restaurants-sale',
    'commercial-hotels', 'hotels-sale', 'motels-sale', 'guesthouses-sale',
    'commercial-warehouses', 'warehouses-sale', 'logistics-centers-sale',
    'commercial-industrial', 'industrial-buildings-sale', 'factories-sale', 'commercial-manufacturing',
    'auto-service-sale', 'beauty-salons-sale', 'car-washes-sale', 'clinics-sale', 'coworking-sale', 
    'educational-sale', 'gas-stations-sale', 'gyms-sale', 'medical-offices-sale', 'mixed-use-sale',
    'commercial-rent', 'commercial-rentals', 'commercial-sale',
    'commercial-coworking', 'commercial-distribution', 'commercial-malls', 'commercial-medical', 'commercial-mixed'
  ) AND parent_id = v_commercial
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  RAISE NOTICE 'Commercial hierarchy fixed';
END $$;
;
