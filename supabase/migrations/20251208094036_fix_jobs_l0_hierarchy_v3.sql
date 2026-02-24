
-- Fix jobs L0 hierarchy: create parent categories and organize
DO $$
DECLARE
  v_jobs_id UUID;
  v_it_jobs_id UUID;
  v_medical_jobs_id UUID;
  v_business_jobs_id UUID;
BEGIN
  SELECT id INTO v_jobs_id FROM categories WHERE slug = 'jobs';
  
  -- Create IT Jobs parent L1
  INSERT INTO categories (name, name_bg, slug, parent_id)
  VALUES ('IT & Technology', 'IT и технологии', 'it-tech-jobs', v_jobs_id)
  RETURNING id INTO v_it_jobs_id;
  
  -- Create Medical Jobs parent L1
  INSERT INTO categories (name, name_bg, slug, parent_id)
  VALUES ('Healthcare', 'Здравеопазване', 'healthcare-jobs', v_jobs_id)
  RETURNING id INTO v_medical_jobs_id;
  
  -- Create Business Jobs parent L1
  INSERT INTO categories (name, name_bg, slug, parent_id)
  VALUES ('Business & Office', 'Бизнес и офис', 'business-office-jobs', v_jobs_id)
  RETURNING id INTO v_business_jobs_id;
  
  -- Move IT jobs under IT parent
  UPDATE categories SET parent_id = v_it_jobs_id
  WHERE slug IN ('software-dev-jobs', 'web-dev-jobs', 'mobile-dev-jobs', 'devops-jobs', 
                 'qa-engineer-jobs', 'it-support-jobs', 'data-science-jobs', 'ui-ux-jobs')
    AND parent_id = v_jobs_id;
  
  -- Move Medical jobs under Medical parent
  UPDATE categories SET parent_id = v_medical_jobs_id
  WHERE slug IN ('doctor-jobs', 'nursing-jobs', 'dental-jobs', 'pharmacy-jobs', 
                 'medical-lab-jobs', 'caregiver-jobs')
    AND parent_id = v_jobs_id;
  
  -- Move Business jobs under Business parent
  UPDATE categories SET parent_id = v_business_jobs_id
  WHERE slug IN ('accounting-jobs', 'finance-jobs', 'admin-jobs', 'hr-jobs', 
                 'management-jobs', 'marketing-jobs', 'sales-jobs')
    AND parent_id = v_jobs_id;
  
  RAISE NOTICE 'Jobs L0 hierarchy fixed';
END $$;
;
