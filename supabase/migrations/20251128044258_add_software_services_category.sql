-- Add Software & Services parent category
INSERT INTO categories (id, name, name_bg, slug, parent_id, created_at)
VALUES 
  ('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'Software & Services', 'Софтуер и услуги', 'software-services', NULL, NOW());

-- Add subcategories for Software & Services
INSERT INTO categories (id, name, name_bg, slug, parent_id, created_at)
VALUES 
  -- Software subcategories
  ('a1111111-1111-1111-1111-111111111111', 'Business Software', 'Бизнес софтуер', 'business-software', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a2222222-2222-2222-2222-222222222222', 'Creative Software', 'Креативен софтуер', 'creative-software', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a3333333-3333-3333-3333-333333333333', 'Security Software', 'Софтуер за сигурност', 'security-software', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a4444444-4444-4444-4444-444444444444', 'Operating Systems', 'Операционни системи', 'operating-systems', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  
  -- Digital Services subcategories
  ('a5555555-5555-5555-5555-555555555555', 'Online Courses', 'Онлайн курсове', 'online-courses', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a6666666-6666-6666-6666-666666666666', 'AI & Tech Courses', 'AI и технологични курсове', 'ai-courses', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a7777777-7777-7777-7777-777777777777', 'Web Services', 'Уеб услуги', 'web-services', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a8888888-8888-8888-8888-888888888888', 'Cloud & SaaS', 'Облачни услуги', 'cloud-saas', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('a9999999-9999-9999-9999-999999999999', 'Professional Services', 'Професионални услуги', 'professional-services', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW()),
  ('aaaaaaa0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Subscriptions', 'Абонаменти', 'subscriptions', 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', NOW());;
