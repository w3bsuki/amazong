
-- Fix orphaned vintage clothing by era - assign to parent 'fashion-vintage-clothing'
UPDATE categories SET parent_id = 'a81d455c-8f25-4ff9-9f09-f095473f5d84'
WHERE slug IN ('vcloth-era-1920', 'vcloth-era-3040', 'vcloth-era-1950', 'vcloth-era-1960', 'vcloth-era-1970', 'vcloth-era-1980', 'vcloth-era-1990')
AND parent_id IS NULL;

-- Fix orphaned vintage designer clothing - assign to parent 'fashion-vintage-clothing'
UPDATE categories SET parent_id = 'a81d455c-8f25-4ff9-9f09-f095473f5d84'
WHERE slug IN ('vcloth-design-chanel', 'vcloth-design-ysl', 'vcloth-design-versace', 'vcloth-design-dior', 'vcloth-design-gucci', 'vcloth-design-hermes', 'vcloth-design-other')
AND parent_id IS NULL;
;
