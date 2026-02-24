
-- Fix orphaned Audio tools - assign to 'audio-editing-software' or 'audio-production-software'
UPDATE categories SET parent_id = '4208a462-3da3-46b5-ae47-9192f0b79285'
WHERE slug IN ('audio-daw', 'audio-mastering', 'audio-mixing', 'audio-podcast', 'audio-samples', 'audio-vst')
AND parent_id IS NULL;

-- Fix orphaned Video tools - assign to 'video-editing-software'
UPDATE categories SET parent_id = '6fe47f3d-36ea-484b-9e68-83dc3e5249a3'
WHERE slug IN ('video-pro', 'video-consumer', 'video-screen', 'video-convert', 'video-color', 'video-effects')
AND parent_id IS NULL;

-- Fix orphaned Photo tools - assign to 'photo-editing-software'
UPDATE categories SET parent_id = '52d22d44-ae29-40e8-9b83-65eb96848087'
WHERE slug IN ('photo-raw', 'photo-hdr', 'photo-portrait', 'photo-batch', 'photo-organize', 'photo-effects')
AND parent_id IS NULL;

-- Fix orphaned 3D tools - assign to '3d-modeling-software'
UPDATE categories SET parent_id = '87143171-28a0-4cb8-94c8-dfe2428673ca'
WHERE slug IN ('3d-animation', '3d-assets', '3d-game-engine', '3d-rendering', '3d-vfx')
AND parent_id IS NULL;
;
