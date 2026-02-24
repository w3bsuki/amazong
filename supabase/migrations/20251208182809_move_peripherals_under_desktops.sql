
-- Move Peripherals under Desktop PCs where it belongs
-- Keyboards, mice, webcams are PC peripherals, not standalone electronics

UPDATE categories 
SET parent_id = '0828a9c4-ae8f-422e-9279-af9aec69b2ac'  -- Desktop PCs
WHERE id = 'a0b6a85e-01ce-418f-85b8-2d9e02533339';  -- Peripherals
;
