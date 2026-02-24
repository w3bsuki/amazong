
-- Fix duplicate GPU category - add missing Bulgarian name and update the orphan one
UPDATE categories 
SET name_bg = 'Видеокарти (GPU)'
WHERE slug = 'gpus' AND name_bg IS NULL;

-- Check if both GPUs are in different valid contexts
-- pc-gaming-gpu is under PC Gaming (Gaming category) - keep it
-- gpus is under Computer Components (Electronics category) - keep it but with proper name

-- Update the gpus category to have a clearer name
UPDATE categories 
SET name = 'Graphics Cards', 
    name_bg = 'Видеокарти'
WHERE slug = 'gpus';
;
