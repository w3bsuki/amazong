
-- Phase 2: Add missing L1 categories for Sports

-- Sports L0 ID: 7b423774-3be8-43de-989d-7a4253eda995

INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order) VALUES
-- New L1 Categories
('a1b2c3d4-1111-4000-8000-000000000001', 'Racket Sports', 'Ракетни спортове', 'racket-sports', '🎾', '7b423774-3be8-43de-989d-7a4253eda995', 10),
('a1b2c3d4-1111-4000-8000-000000000002', 'Fishing & Hunting', 'Риболов и лов', 'fishing-hunting', '🎣', '7b423774-3be8-43de-989d-7a4253eda995', 11),
('a1b2c3d4-1111-4000-8000-000000000003', 'Outdoor Recreation', 'Отдих на открито', 'outdoor-recreation', '🏕️', '7b423774-3be8-43de-989d-7a4253eda995', 12),
('a1b2c3d4-1111-4000-8000-000000000004', 'Sports Supplements', 'Спортни добавки', 'sports-supplements', '🥤', '7b423774-3be8-43de-989d-7a4253eda995', 13),
('a1b2c3d4-1111-4000-8000-000000000005', 'Fan Gear & Merchandise', 'Фен артикули', 'sports-fan-gear', '🏆', '7b423774-3be8-43de-989d-7a4253eda995', 14),
('a1b2c3d4-1111-4000-8000-000000000006', 'Equestrian', 'Конен спорт', 'equestrian', '🐴', '7b423774-3be8-43de-989d-7a4253eda995', 15);
;
