
-- =====================================================
-- 🎬 PROMOTE MOVIES & MUSIC TO L0 CATEGORY
-- Date: December 4, 2025
-- Action: Move Music & Vinyl from Hobbies L1 to standalone L0
-- =====================================================

-- Step 1: Update Music & Vinyl to be L0 Movies & Music
UPDATE categories
SET 
    parent_id = NULL,
    name = 'Movies & Music',
    name_bg = 'Филми и музика',
    slug = 'movies-music',
    icon = '🎬',
    display_order = 23,
    description = 'Movies, music, vinyl records, DVDs, Blu-rays, CDs, and entertainment media',
    description_bg = 'Филми, музика, грамофонни плочи, DVD, Blu-ray, CD и развлекателни медии'
WHERE id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';

-- Step 2: Update existing subcategories display order
UPDATE categories SET display_order = 1 WHERE slug = 'vinyl-records' AND parent_id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';
UPDATE categories SET display_order = 2 WHERE slug = 'dvds-bluray' AND parent_id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';
UPDATE categories SET display_order = 3 WHERE slug = 'movie-memorabilia' AND parent_id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';
UPDATE categories SET display_order = 4 WHERE slug = 'music-memorabilia' AND parent_id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';
UPDATE categories SET display_order = 5 WHERE slug = 'digital-music' AND parent_id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';
;
