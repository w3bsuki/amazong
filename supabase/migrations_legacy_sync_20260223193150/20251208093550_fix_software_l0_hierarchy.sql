
-- Fix software L0 hierarchy: Consolidate L1s with 0 children into proper parent L1s

-- 1. Move antivirus/security items under security-software
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'security-software')
WHERE slug IN ('software-antivirus', 'software-internet-security', 'software-vpn')
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 2. Move office items under office-software
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'office-software')
WHERE slug IN (
  'software-office', 'software-ms-office', 'software-word', 
  'software-spreadsheets', 'software-presentation'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 3. Move OS items under operating-systems
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'operating-systems')
WHERE slug IN ('software-os', 'software-windows', 'software-linux', 'software-macos')
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 4. Move creative/photo/video items under creative-software
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'creative-software')
WHERE slug IN ('photo-editing', 'software-photo-editing', 'software-video-editing', 'software-audio')
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 5. Move dev tools under development-tools
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'development-tools')
WHERE slug = 'software-dev-tools'
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 6. Move business items under business-software
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'business-software')
WHERE slug IN ('software-accounting', 'software-project-mgmt')
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 7. Move backup under utilities-system
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'utilities-system')
WHERE slug IN ('software-backup', 'utility-software')
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 8. Move CAD under scientific-engineering
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'scientific-engineering')
WHERE slug = 'software-cad'
AND parent_id = (SELECT id FROM categories WHERE slug = 'software');

-- 9. Consolidate duplicate L1s - move ai-ml-software contents to ai-machine-learning
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'ai-machine-learning')
WHERE parent_id = (SELECT id FROM categories WHERE slug = 'ai-ml-software');

-- Then remove duplicate
DELETE FROM categories WHERE slug = 'ai-ml-software';

-- 10. Consolidate cloud-services into cloud-saas
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cloud-saas')
WHERE parent_id = (SELECT id FROM categories WHERE slug = 'cloud-services');

DELETE FROM categories WHERE slug = 'cloud-services';

-- 11. Consolidate utilities-tools into utilities-system
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'utilities-system')
WHERE parent_id = (SELECT id FROM categories WHERE slug = 'utilities-tools');

DELETE FROM categories WHERE slug = 'utilities-tools';

-- Final L1s should be: business-software, creative-software, security-software, 
-- multimedia-software, games-software, operating-systems, development-tools, 
-- web-development, ai-machine-learning, utilities-system, educational-software, 
-- office-software, productivity-software, cloud-saas, communication-collab, 
-- mobile-apps, scientific-engineering
;
