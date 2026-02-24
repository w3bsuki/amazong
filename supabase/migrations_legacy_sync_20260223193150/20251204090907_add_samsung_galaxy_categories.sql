-- Add Samsung Galaxy L3 categories under smartphones-samsung (ded04255-f46e-4590-8a5a-bb8d6fd8fc48)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- Galaxy S Series
('Galaxy S24 Ultra', 'Galaxy S24 Ultra', 'galaxy-s24-ultra', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 1),
('Galaxy S24+', 'Galaxy S24+', 'galaxy-s24-plus', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 2),
('Galaxy S24', 'Galaxy S24', 'galaxy-s24', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 3),
('Galaxy S23 Series', 'Galaxy S23 серия', 'galaxy-s23-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 4),
('Galaxy S22 Series', 'Galaxy S22 серия', 'galaxy-s22-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 5),
('Galaxy S21 Series', 'Galaxy S21 серия', 'galaxy-s21-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 6),
-- Galaxy Z Fold
('Galaxy Z Fold 6', 'Galaxy Z Fold 6', 'galaxy-z-fold-6', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 7),
('Galaxy Z Fold 5', 'Galaxy Z Fold 5', 'galaxy-z-fold-5', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 8),
('Galaxy Z Fold 4 & Earlier', 'Galaxy Z Fold 4 и по-ранни', 'galaxy-z-fold-earlier', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 9),
-- Galaxy Z Flip
('Galaxy Z Flip 6', 'Galaxy Z Flip 6', 'galaxy-z-flip-6', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 10),
('Galaxy Z Flip 5', 'Galaxy Z Flip 5', 'galaxy-z-flip-5', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 11),
('Galaxy Z Flip 4 & Earlier', 'Galaxy Z Flip 4 и по-ранни', 'galaxy-z-flip-earlier', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 12),
-- Galaxy A Series
('Galaxy A55', 'Galaxy A55', 'galaxy-a55', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 13),
('Galaxy A54', 'Galaxy A54', 'galaxy-a54', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 14),
('Galaxy A35', 'Galaxy A35', 'galaxy-a35', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 15),
('Galaxy A25', 'Galaxy A25', 'galaxy-a25', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 16),
('Galaxy A15', 'Galaxy A15', 'galaxy-a15', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 17),
('Galaxy A Series (Other)', 'Galaxy A серия (други)', 'galaxy-a-other', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 18),
-- Galaxy M Series
('Galaxy M Series', 'Galaxy M серия', 'galaxy-m-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 19),
-- Galaxy FE
('Galaxy FE Series', 'Galaxy FE серия', 'galaxy-fe-series', 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48', 20)
ON CONFLICT (slug) DO NOTHING;;
