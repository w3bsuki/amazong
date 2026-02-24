
-- Move PC Components to be under Desktop PCs (not direct child of Electronics)
-- This makes more sense: Components are used to build PCs

UPDATE categories 
SET parent_id = '0828a9c4-ae8f-422e-9279-af9aec69b2ac'  -- Desktop PCs
WHERE id = '54b001a0-59ba-46a8-943c-8d4097e31210';  -- PC Components
;
