
-- Fix services L0 hierarchy: consolidate 30 L1s to ~23
DO $$
DECLARE
  v_services_id UUID;
  v_events_entertainment UUID;
BEGIN
  SELECT id INTO v_services_id FROM categories WHERE slug = 'services';
  SELECT id INTO v_events_entertainment FROM categories WHERE slug = 'events-entertainment';
  
  -- Move event-related services under events-entertainment
  UPDATE categories SET parent_id = v_events_entertainment
  WHERE slug IN ('live-music-services', 'mc-host-services', 'decoration-services', 
                 'event-planning', 'event-photography', 'catering-services', 'dj-services') 
    AND parent_id = v_services_id;
  
  RAISE NOTICE 'Services L0 hierarchy fixed';
END $$;
;
